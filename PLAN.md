# Implementierungsplan: Osteoporose-App als Server-Webanwendung

## Ausgangslage

Die App ist aktuell eine rein clientseitige Anwendung (HTML-Dateien mit React via CDN, Daten in IndexedDB/localStorage). Sie soll zu einer vollständigen Server-Webanwendung umgebaut werden.

---

## Phase 1: Server-Infrastruktur (Ubuntu Hyper-V VM)

### 1.1 Hyper-V VM Setup-Dokumentation
- Anleitung für Ubuntu 24.04 LTS als Hyper-V Generation-2-VM
- Empfohlene Ressourcen: 4 GB RAM, 2 vCPUs, 40 GB Disk
- Netzwerkkonfiguration: Statische IP im lokalen Netz, nur Port 443 (HTTPS) nach außen

### 1.2 Server-Stack
- **Node.js 20 LTS** als Application Server (lokal installiert via `apt`, kein `nvm`)
- **Express.js** als Web-Framework
- **SQLite3** als Datenbank (dateibasiert, kein separater DB-Server nötig, alle Daten auf dem Server)
- **better-sqlite3** als Node.js-Treiber (synchron, performant, keine externen Abhängigkeiten)

**Begründung SQLite:** Für eine Einzelpraxis/Klinik-Anwendung mit wenigen gleichzeitigen Nutzern ist SQLite ideal – kein DB-Server-Prozess, einfaches Backup (eine Datei), und alle Daten bleiben in einer lokalen Datei auf dem Server.

---

## Phase 2: Projekt-Struktur & Offline-Fähigkeit

### 2.1 Neue Projektstruktur
```
osteoporose-app/
├── server/
│   ├── index.js              # Express-Server (Haupteinstieg)
│   ├── config.js             # Server-Konfiguration
│   ├── db/
│   │   ├── schema.sql        # Datenbankschema
│   │   ├── seed.sql          # Initialdaten (Risikofaktoren, Therapie, Labor)
│   │   └── database.js       # DB-Verbindung & Hilfsfunktionen
│   ├── routes/
│   │   ├── auth.js           # Login/Logout/Session
│   │   ├── admin.js          # Admin-Routen (Benutzerverwaltung)
│   │   ├── patients.js       # Patienten-CRUD
│   │   ├── questionnaire.js  # Fragebogen-Daten
│   │   └── reports.js        # Befundberichte
│   ├── middleware/
│   │   ├── auth.js           # Session-Prüfung
│   │   ├── csrf.js           # CSRF-Schutz
│   │   └── security.js       # Security-Header, Rate-Limiting
│   └── lib/
│       ├── risk-calculator.js # DVO-Risikoberechnung (serverseitig)
│       └── pdf-generator.js   # PDF-Erzeugung (lokal, z.B. pdfkit)
├── public/
│   ├── index.html            # Startseite
│   ├── css/
│   │   ├── main.css          # Hauptstyles
│   │   └── fonts/            # Lokale Fonts (Source Sans 3, Playfair Display)
│   ├── js/
│   │   ├── vendor/           # React, ReactDOM, Babel (lokal gebündelt)
│   │   └── app/              # Anwendungs-JavaScript
│   │       ├── questionnaire.js
│   │       ├── admin.js
│   │       └── common.js
│   └── fonts/                # WOFF2-Dateien (lokal, kein Google Fonts)
├── scripts/
│   ├── setup.sh              # Server-Ersteinrichtung
│   ├── backup.sh             # Datenbank-Backup
│   └── update.sh             # Update-Script (mit Genehmigungsdialog)
├── docs/
│   ├── INSTALL.md            # Installationsanleitung
│   ├── ADMIN.md              # Admin-Handbuch
│   ├── API.md                # API-Dokumentation
│   ├── SECURITY.md           # Sicherheitskonzept
│   └── UPDATE.md             # Update-Prozedur
├── certs/                    # Let's Encrypt Zertifikate (nicht im Git)
├── data/                     # SQLite-Datenbankdatei (nicht im Git)
├── package.json
├── package-lock.json
└── .gitignore
```

### 2.2 Alle Abhängigkeiten lokal
- React, ReactDOM, Babel: Als lokale Dateien in `public/js/vendor/` ablegen
- Fonts: Google Fonts (Source Sans 3, Playfair Display) als WOFF2 in `public/fonts/`
- **Kein CDN, kein externer Zugriff zur Laufzeit**
- Alle npm-Module werden bei der Installation heruntergeladen und sind dann lokal vorhanden

---

## Phase 3: Datenbank-Schema (SQLite)

### 3.1 Tabellen

```sql
-- Benutzer (Admin-verwaltete Benutzer-Datenbank)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,        -- bcrypt-gehashed
    role TEXT NOT NULL DEFAULT 'user',  -- 'admin', 'arzt', 'user'
    display_name TEXT,                  -- Optional (für Ärzte)
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    last_login TEXT
);

-- Patienten-Stammdaten
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Für Standard-Benutzer: nur Alter und Geschlecht (anonym)
    -- Für Arzt-Benutzer: volle Stammdaten
    age INTEGER,                        -- Alter (Standard-Modus)
    birth_date TEXT,                     -- Geburtsdatum (Arzt-Modus, optional)
    first_name TEXT,                     -- Vorname (Arzt-Modus, optional)
    last_name TEXT,                      -- Nachname (Arzt-Modus, optional)
    gender TEXT NOT NULL,                -- 'm', 'w', 'd'
    created_by INTEGER REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Fragebogen-Sitzungen
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES patients(id),
    user_id INTEGER REFERENCES users(id),
    questionnaire_data TEXT NOT NULL,    -- JSON mit allen Antworten
    risk_score REAL,
    risk_category TEXT,
    therapy_recommendation TEXT,
    dxa_values TEXT,                     -- JSON (T-Scores, TBS)
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Befundberichte
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES sessions(id),
    report_type TEXT DEFAULT 'standard', -- 'standard', 'brief'
    content TEXT NOT NULL,               -- Generierter Bericht (HTML/Text)
    letterhead TEXT,                      -- JSON mit Briefkopf-Daten
    created_at TEXT DEFAULT (datetime('now'))
);

-- Praxis-Konfiguration (Briefkopf etc.)
CREATE TABLE config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Audit-Log (Nachvollziehbarkeit)
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
```

### 3.2 Medizinische Stammdaten (Initial-Befüllung)
- Risikofaktoren-Datenbank (DVO 2023) mit RR-Werten
- Therapie-Datenbank (Osteoporose-Präparate)
- Laborwerte-Referenzen (62 Parameter, 10 Kategorien)
- Sekundäre Osteoporose (7 Erkrankungsgruppen)
- ICD-10-Codes

Diese werden aus den bestehenden HTML-Dateien extrahiert und als `seed.sql` bereitgestellt.

---

## Phase 4: Backend-API

### 4.1 Authentifizierung & Autorisierung
- **Session-basiert** (express-session mit SQLite-Store) – keine externen Auth-Dienste
- Passwörter: bcrypt-gehashed
- CSRF-Schutz via csurf-Token
- Rate-Limiting für Login-Versuche
- Rollen: `admin`, `arzt`, `user`

### 4.2 API-Endpunkte

```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/session        # Aktuelle Session prüfen

GET    /api/patients             # Patienten-Liste (gefiltert nach Rolle)
POST   /api/patients             # Patient anlegen
GET    /api/patients/:id         # Patient laden
PUT    /api/patients/:id         # Patient aktualisieren
DELETE /api/patients/:id         # Patient löschen (nur Admin/Arzt)

POST   /api/sessions             # Neue Fragebogen-Sitzung
GET    /api/sessions/:id         # Sitzung laden
PUT    /api/sessions/:id         # Sitzung aktualisieren
GET    /api/sessions/:id/report  # Befundbericht generieren

GET    /api/reference/risks      # Risikofaktoren-Datenbank
GET    /api/reference/therapy    # Therapie-Datenbank
GET    /api/reference/lab        # Laborwerte-Referenzen

# Admin-Bereich
GET    /api/admin/users          # Alle Benutzer
POST   /api/admin/users          # Benutzer anlegen
PUT    /api/admin/users/:id      # Benutzer bearbeiten
DELETE /api/admin/users/:id      # Benutzer deaktivieren
GET    /api/admin/audit          # Audit-Log einsehen
```

### 4.3 Sicherheits-Middleware
- `helmet` für Security-Header (CSP, HSTS, X-Frame-Options etc.)
- Kein `Access-Control-Allow-Origin` (kein CORS nötig, alles vom selben Server)
- Content-Security-Policy: Nur eigene Ressourcen (`'self'`), kein inline-Script-eval
- Rate-Limiting: 5 Login-Versuche pro 15 Minuten pro IP

---

## Phase 5: Frontend-Umbau

### 5.1 Standard-Benutzerseite (kein Login erforderlich / einfacher Login)
- **Kein Name erforderlich** – Felder für Vor-/Nachname entfallen
- **Nur Alter** statt Geburtsdatum (Eingabefeld Alter in Jahren)
- Geschlecht als Pflichtfeld
- Fragebogen wie bisher (Risikofaktoren, Medikamente, DXA-Werte)
- Ergebnis: Risikokategorie + Empfehlung (ohne Arztbrieffunktion)

### 5.2 Arzt-Zugang
- Login mit Benutzername/Passwort (statt PIN)
- Volle Stammdaten (Name, Geburtsdatum) möglich
- Patientenverwaltung, Befundberichte, Export
- Editierbare Datenbanken (Risikofaktoren, Therapie, Labor)

### 5.3 Admin-Bereich
- Benutzerverwaltung: Anlegen, Bearbeiten, Deaktivieren von Benutzern
- Rollen zuweisen (admin, arzt, user)
- Audit-Log einsehen
- Briefkopf / Praxis-Konfiguration verwalten
- System-Status (DB-Größe, letzte Backups)

### 5.4 Lokale Assets
- React 18, ReactDOM, Babel: Lokale Kopien statt CDN
- Fonts: WOFF2-Dateien lokal (Source Sans 3, Playfair Display)
- Keinerlei externe Requests zur Laufzeit

---

## Phase 6: HTTPS mit Let's Encrypt

### 6.1 Zertifikat-Einrichtung
- **certbot** installieren (`apt install certbot`)
- Zertifikat initial erstellen (erfordert einmalig Port 80 für ACME-Challenge)
- Node.js-Server liest Zertifikate aus `/etc/letsencrypt/live/`
- HTTPS auf Port 443, HTTP auf Port 80 nur für Redirect auf HTTPS

### 6.2 Zertifikat-Erneuerung
- Cronjob für `certbot renew` (automatisch alle 60 Tage)
- Post-Hook: Node.js-Server-Restart nach Erneuerung
- **Hinweis:** Die Erneuerung erfordert kurzzeitig eine Internetverbindung zum Let's Encrypt-Server. Alternativ: DNS-01-Challenge, wenn kein HTTP-Zugriff von außen möglich ist.

### 6.3 Alternative für rein internes Netz
- Falls kein Internet-Zugriff: Selbstsigniertes Zertifikat oder interne CA
- Dokumentation beider Varianten in `docs/SECURITY.md`

---

## Phase 7: Update- & Wartungsstrategie

### 7.1 Update-Script (`scripts/update.sh`)
```
- Prüft verfügbare apt-Updates
- Listet jedes Update einzeln auf
- Fragt für jedes Update: "Genehmigen? [j/n]"
- Installiert nur genehmigte Updates
- Erstellt vorher automatisches DB-Backup
- Loggt alle Aktionen in Audit-Log
```

### 7.2 App-Updates
- Git-basiert: `git pull` für neue Versionen
- `npm ci` für Dependency-Updates (nur aus lockfile)
- Migrations-Script für Datenbankschema-Änderungen
- Jeder Schritt einzeln bestätigbar

### 7.3 Backup
- Tägliches SQLite-Backup per Cronjob (`scripts/backup.sh`)
- Rotation: 7 Tagesbackups, 4 Wochenbackups
- Backup-Verzeichnis konfigurierbar

---

## Phase 8: Dokumentation

### 8.1 Quellcode-Dokumentation
- JSDoc-Kommentare für alle Funktionen und Module
- Inline-Kommentare für komplexe Logik (Risikoberechnung, DVO-Formeln)
- API-Dokumentation mit Request/Response-Beispielen

### 8.2 Betriebsdokumentation
- `docs/INSTALL.md` – Schritt-für-Schritt Installationsanleitung (Hyper-V + Ubuntu + App)
- `docs/ADMIN.md` – Admin-Handbuch (Benutzerverwaltung, Backup, Wartung)
- `docs/SECURITY.md` – Sicherheitskonzept (Verschlüsselung, Datenschutz, Netzwerk)
- `docs/UPDATE.md` – Update-Prozedur mit Genehmigungsworkflow
- `docs/API.md` – Vollständige REST-API-Referenz

---

## Umsetzungsreihenfolge

| Schritt | Beschreibung |
|---------|-------------|
| **1** | Projektstruktur anlegen, `package.json`, Dependencies installieren |
| **2** | SQLite-Datenbank: Schema + Seed-Daten aus bestehenden HTML-Dateien extrahieren |
| **3** | Express-Server mit HTTPS, Security-Middleware, Session-Management |
| **4** | Auth-System (Login, Rollen, Session-Store) |
| **5** | API-Routen: Patienten, Sitzungen, Referenzdaten |
| **6** | Admin-Bereich: Benutzerverwaltung, Audit-Log |
| **7** | Frontend: Standard-Benutzerseite (anonym, nur Alter) |
| **8** | Frontend: Arzt-Zugang mit vollen Stammdaten |
| **9** | Frontend: Admin-Panel |
| **10** | Lokale Assets (React, Fonts) einbinden, alle CDN-Referenzen entfernen |
| **11** | PDF-Befundbericht-Generator (serverseitig) |
| **12** | Setup-Scripts (Installation, Backup, Update mit Genehmigung) |
| **13** | Vollständige Dokumentation (JSDoc + Betriebsdocs) |
| **14** | Testen auf Ubuntu 24.04 Hyper-V VM |

---

## Technologie-Entscheidungen (Zusammenfassung)

| Komponente | Wahl | Begründung |
|-----------|------|-----------|
| Runtime | Node.js 20 LTS | Stabil, lange Unterstützung, JavaScript durchgehend |
| Framework | Express.js | Bewährt, minimal, gut dokumentiert |
| Datenbank | SQLite3 | Kein DB-Server nötig, eine Datei, einfaches Backup |
| Auth | express-session + bcrypt | Serverseitig, keine externen Dienste |
| HTTPS | Let's Encrypt / certbot | Kostenlos, automatisiert, Industriestandard |
| Frontend | React 18 (lokal) | Bestehende Codebasis beibehalten |
| Fonts | Lokale WOFF2-Dateien | Kein Google-Fonts-CDN zur Laufzeit |
| PDF | pdfkit (Node.js) | Rein serverseitig, keine externen Dienste |
| OS | Ubuntu 24.04 LTS | Aktuell, langfristiger Support, Hyper-V-kompatibel |
