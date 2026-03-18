# 🦴 Osteoporose-Fragebogen

Eine vollständige, **DSGVO-konforme Webanwendung** zur strukturierten Osteoporose-Dokumentation und Risikoberechnung auf der Grundlage der **DVO-Leitlinie 2023** – entwickelt für den osteologischen Praxisalltag.

**Es handelt sich um eine Demo-Version als Machbarkeitsstudie. Sie dient nur zur Veranschaulichung und zu Schulungszwecken. Es ist nicht zur klinischen Anwendung gedacht oder geeignet. Es ist ein Projekt in Entwicklung und weißt noch Fehler auf.**

Die App läuft vollständig im Browser, benötigt keine Serververbindung und speichert alle Daten ausschließlich lokal auf dem Gerät des Benutzers (IndexedDB / localStorage). Zusätzlich steht mit **OsteoDoc Server** eine optionale Mehrbenutzervariante mit PostgreSQL-Datenbank bereit.

---

## 🖥️ Live-Demo (GitHub Pages)

Die vier Versionen sind direkt im Browser nutzbar – kein Download nötig:

| Version | Beschreibung | Link |
|---|---|---|
| **Vollversion** | Alle Funktionen inkl. Arzt-Zugang, Laborwerte, Sekundäre Osteoporose, Schmerzeinzeichnungen, Anamnese | [Vollversion öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-app-vollversion.html) |
| **Standard** | Standard-Fragebogen mit Arzt-Zugang | [Standard öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-fragebogen-standard.html) |
| **Kurzversion** | Kompakter Fragebogen | [Kurzversion öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-fragebogen-kurz.html) |
| **Einfach** | Schlanke Einzelversion mit reduziertem Funktionsumfang | [Einfach öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-Fragebogen%20einfach.html) |

> **Offline-Nutzung:** Jede HTML-Datei kann auch heruntergeladen und lokal im Browser geöffnet werden – keine Installation, kein Server, keine Abhängigkeiten.

Die Anwendung funktioniert in allen modernen Browsern (Chrome, Firefox, Edge, Safari) und ist für Desktop, Tablet und Mobilgeräte optimiert.

---

## ✨ Funktionsübersicht

### Patientenfragebogen (Hauptansicht)

Der Fragebogen führt strukturiert durch alle relevanten Risikofaktoren:

- **Stammdaten** – Name, Geburtsdatum (mit automatischer Altersberechnung und 2-/4-stelliger Jahreszahl), Geschlecht
- **Allgemeine Risikofaktoren** – Frakturen, Stürze, Immobilität, BMI, Rauchen, Alkohol
- **Medikamente** – Kortikosteroide, Aromatasehemmer, Antiepileptika, PPIs, Antikoagulanzien u. v. m.
- **Sekundäre Osteoporose** – Symptomcheck für 7 Erkrankungsgruppen (endokrin, gastroenterologisch, renal, hämatologisch, immunologisch, neurologisch, genetisch)
- **Bisherige Therapie** – Dokumentation laufender Osteoporose-Medikation
- **DXA-Werte** – Eingabe von T-Score (Gesamthüfte, LWS, Schenkelhals) und TBS

Alle Felder sind responsiv und für die Eingabe am Touchscreen optimiert.

---

### 📊 Auswertung & Risikoberechnung

- **Automatische Risikoberechnung** nach DVO-Leitlinie 2023 mit gewichteten Risikofaktoren (RR-basiert)
- **Risikokategorien:** Sehr hoch (×≥3.0) / Hoch (×≥2.0) / Mäßig (×≥1.5) / Gering (<1.5)
- **Therapieempfehlung** auf Basis des berechneten Risikos
- **Differenzierung** zwischen Risikofaktoren (fließen in Kalkulation ein) und Risikoindikatoren (begründen Basisdiagnostik, aber ohne direkte Gewichtung)
- **Befundbericht-Generator** – strukturierter Arztbrief als druckfertiges Dokument

---

### 🩺 Arzt-Zugang (PIN-geschützt)

Der passwortgeschützte Arztzugang (Standard-PIN: `1234`) bietet erweiterte Funktionen:

#### 📊 Auswertung
- Risiko-Ergebnis mit Therapieempfehlung
- **Fragebogen direkt bearbeiten** – alle Patientenantworten können nachträglich geändert oder ergänzt werden (insbesondere DXA-Werte)
- Änderungen werden sofort in die Risikoberechnung übernommen
- Export als PDF oder TXT

#### 👥 Patienten-Tab
- Vollständige Patientenliste aller gespeicherten Sitzungen
- Sortierung nach Name, Geburtsdatum, letztem Untersuchungsdatum, Geschlecht oder Risikokategorie
- Schnelles Laden gespeicherter Befunde per Klick
- Patientensuche in Echtzeit

#### 🦴 Risikofaktoren & Risikoindikatoren
- Vollständige editierbare Datenbank aller DVO-2023-Risikofaktoren mit RR-Werten
- Diagnosen und ICD-10-Codes direkt im WYSIWYG-Modus anpassbar
- Filterbare Ansicht nach Kategorie (Frakturen, Stürze, Erkrankungen, Medikamente …)
- Hinweistext mit Erklärung der Leitlinien-Systematik

#### 🔎 Sekundäre Osteoporose
- Editierbare Datenbank für 7 Erkrankungsgruppen mit jeweils:
  - Erkrankungsname und ICD-10-Code
  - Klinische Triggersymptome
  - Weiterführende Untersuchungsempfehlungen
  - Scoring-Stufen (z. B. nach WHO, EULAR)
- Karten-Layout mit Aufklapp-Funktion pro Erkrankung

#### 💊 Osteoporose-Therapie
- WYSIWYG-Datenbank aller zugelassenen Osteoporose-Präparate
- Felder: Wirkstoff, Handelsnamen, Gruppe, Indikation, Dosierung, Zulassungstext, Nebenwirkungen, Kontraindikationen, Monitoring
- Vollständig editierbar – alle Änderungen bleiben lokal gespeichert

#### 🔬 Laborwerte
- Eingebetteter, vollständiger **Osteologie-Laborwert-Editor** mit:
  - 62 relevanten Laborparametern in 10 Kategorien
  - Suche nach Parameter-Name und Erkrankung
  - Editierbaren Referenzwerten, Einheiten und klinischen Hinweisen
  - „In neuem Tab öffnen"-Funktion für Vollbildansicht
- Kein externer Server erforderlich – vollständig inline eingebettet

#### ✏️ Briefkopf
- Praxisname, Arztname, Fachrichtung, Adresse, Telefon, E-Mail, Webseite, Zusatzzeile
- Wird automatisch auf allen Druckdokumenten übernommen

---

## 📝 Einfach-Version

Die Datei `osteoporose-Fragebogen einfach.html` ist eine **schlanke Einzelversion** für den schnellen Einsatz – alle Funktionen in einer einzigen, kompakten HTML-Datei mit reduziertem Umfang.

### Unterschiede zur Vollversion

| Merkmal | Einfach | Vollversion |
|---|---|---|
| Fragebogen-Sektionen | 5 fokussierte Abschnitte | 10+ Abschnitte inkl. Sekundäre Osteoporose |
| Fragen | ca. 25 | ca. 80+ |
| Anamnese-Modul | – | Diagnosen, Allergien, Operationen, Familienanamnese, Gynäkologie |
| Schmerzeinzeichnungen | – | 12 Körperansichten mit Canvas-Zeichnung |
| Medikamentenerkennung (Kamera) | – | QR-Code, Barcode, KI-Fotoerkennung |
| Laborwerte-Datenbank | – | 62 Parameter in 10 Kategorien |
| Therapie-Datenbank | – | Vollständige Osteoporose-Präparate-DB |
| Sekundäre Osteoporose | – | 7 Erkrankungsgruppen mit Symptomcheck |
| Patienten-Verwaltung | Einzelsitzung | Mehrere Patienten, Verlaufsvergleich |
| Export | Nur Drucken/PDF | PDF-Bericht, TXT-Export, HTML-Download |
| Arzt-PIN | `0000` | `1234` |

### Enthaltene Sektionen

1. **Frühere Knochenbrüche** – Hüfte, Wirbelsäule (akut & alt), Genant-Grad
2. **Medikamente** – Glukokortikoide (dosisabhängig), Antidepressiva, Schlafmittel, Antikonvulsiva, PPIs, Aromatasehemmer, GnRH-Analoga
3. **Grunderkrankungen** – Diabetes Typ 1/2, Rheumatoide Arthritis, CED, Hyperthyreose, Zöliakie, Herzinsuffizienz, HIV, Anorexie, Malignome
4. **Lebensstil & Sturzrisiko** – BMI (automatische Berechnung), Alkohol, Rauchen, Stürze, Gehhilfen, Pflegebedürftigkeit, Immobilisation
5. **DXA-Knochendichtemessung** – T-Score LWS, Schenkelhals, Gesamthüfte

### Risikofaktor-Gruppen

Die Einfach-Version implementiert die DVO-2023-Regel: Es werden maximal 2 Risikofaktoren multipliziert, davon max. 1 aus Gruppe **S** (Sturzrisiko) und max. 1 aus Gruppe **G** (Glukokortikoide).

---

## 🗄️ OsteoDoc Server (Mehrbenutzervariante)

Für den Einsatz mit mehreren Arbeitsplätzen steht die **OsteoDoc Server**-Variante bereit – eine vollständige Client-Server-Architektur mit zentraler PostgreSQL-Datenbank, Benutzerverwaltung und Audit-Protokollierung.

### Architektur

```
osteodoc-server/
├── server/
│   ├── app.js                          # Express-Server (Hauptdatei)
│   ├── config/
│   │   ├── database.js                 # PostgreSQL-Verbindungspool
│   │   └── logger.js                   # Winston-Logging
│   ├── db/
│   │   ├── schema.sql                  # Datenbankschema (8 Tabellen)
│   │   ├── seed-risk-factors.sql       # DVO-2023-Risikofaktoren (28 Einträge)
│   │   └── init.js                     # DB-Initialisierung + Admin-Erstellung
│   ├── routes/
│   │   ├── auth.js                     # Login, JWT, Passwort-Änderung
│   │   ├── patients.js                 # Patienten-CRUD
│   │   ├── assessments.js              # Befunde + automatische Risikoberechnung
│   │   ├── riskFactors.js              # Risikofaktoren-Datenbank
│   │   ├── therapies.js                # Therapie-Datenbank
│   │   ├── laboratory.js               # Laborwerte-Referenzen
│   │   └── admin.js                    # Benutzerverwaltung, Audit-Log, Statistiken
│   ├── middleware/
│   │   ├── auth.js                     # JWT-Authentifizierung, Rollen-Prüfung
│   │   ├── audit.js                    # Audit-Logging (DSGVO-konform)
│   │   └── noExternalRequests.js       # Blockiert ausgehende HTTP-Verbindungen
│   └── utils/
│       └── riskCalculator.js           # DVO-2023-Risikoalgorithmus
└── client/
    └── src/
        ├── App.jsx                     # React-Frontend (SPA)
        ├── components/                 # UI-Komponenten
        ├── context/AuthContext.jsx      # Authentifizierungs-Kontext
        └── utils/api.js                # API-Client
```

### Datenbankschema (PostgreSQL)

Die Datenbank besteht aus **8 Tabellen**:

| Tabelle | Beschreibung | Wichtige Spalten |
|---|---|---|
| **users** | Benutzerverwaltung (Admin, Arzt, MFA) | `username`, `password` (bcrypt), `role`, `is_active`, `last_login` |
| **patients** | Patienten (anonym oder namentlich) | `alias`, `age`, `gender`, `last_name`, `first_name`, `birth_date`, `is_anonymous` |
| **assessments** | Befunde mit Risikoergebnis | `patient_id` (FK), `data` (JSONB), `risk_result` (JSONB), `created_by` (FK) |
| **risk_factors** | DVO-2023-Risikofaktoren | `name`, `category`, `icd10_code`, `relative_risk`, `description` |
| **therapies** | Osteoporose-Medikamente | `wirkstoff`, `handelsnamen`, `gruppe`, `dosierung`, `nebenwirkungen`, `kontraindikationen` |
| **laboratory_values** | Osteologie-Laborreferenzen | `parameter_name`, `category`, `unit`, `reference_min/max`, `clinical_note` |
| **letterheads** | Praxis-Briefkopf pro Benutzer | `practice_name`, `doctor_name`, `specialty`, `address`, `phone`, `email` |
| **audit_log** | DSGVO-Audit-Protokoll | `user_id`, `action`, `entity_type`, `entity_id`, `details` (JSONB), `ip_address` |

### Risikoberechnung (Server-Algorithmus)

Der serverseitige Risikorechner (`riskCalculator.js`) berechnet das Gesamtrisiko stufenweise:

```
Gesamt-RR = Basis-RR (T-Score) × TBS-Adjustment × Klinische RF
            × Fraktur-RF × Medikamenten-RF × Sekundäre Ursachen × Lebensstil-RF
```

**Basis-RR nach T-Score:**

| T-Score | Relatives Risiko |
|---|---|
| ≤ −4,0 | 3,0 |
| ≤ −3,5 | 2,5 |
| ≤ −3,0 | 2,0 |
| ≤ −2,5 | 1,5 |
| ≤ −2,0 | 1,2 |
| ≤ −1,5 | 1,0 |

**TBS-Adjustment:** TBS < 1,23 → ×1,5 · TBS < 1,31 → ×1,2

**Risikokategorien:**

| Gesamt-RR | Kategorie | Farbe | Empfehlung |
|---|---|---|---|
| ≥ 3,0 | Sehr hoch | Rot | Dringend spezifische Therapie |
| ≥ 2,0 | Hoch | Orange | Spezifische Therapie empfohlen |
| ≥ 1,5 | Mäßig | Gelb | Basismaßnahmen + Reevaluation |
| < 1,5 | Gering | Grün | Basismaßnahmen |

### Geseedete Risikofaktoren (28 DVO-2023-Einträge)

| Kategorie | Anzahl | Beispiele | RR-Bereich |
|---|---|---|---|
| Frakturen | 5 | Multiple Wirbelkörperfrakturen (3,0), Proximaler Femur (2,0) | 1,5–3,0 |
| Medikamente | 6 | Glukokortikoide ≥7,5 mg (4,0), Aromatasehemmer (1,5) | 1,2–4,0 |
| Endokrin | 5 | Cushing (2,0), Diabetes Typ 1 (1,5), Hyperparathyreoidismus (1,5) | 1,3–2,0 |
| Gastrointestinal | 3 | Zöliakie (1,5), M. Crohn (1,5), Colitis ulcerosa (1,3) | 1,3–1,5 |
| Hämatologisch | 2 | Multiples Myelom (2,0), Mastozytose (1,5) | 1,5–2,0 |
| Immunologisch | 2 | Rheumatoide Arthritis (1,5), Spondylitis ankylosans (1,5) | 1,5 |
| Renal | 1 | CKD GFR < 30 (2,0) | 2,0 |
| Neurologisch | 1 | Epilepsie (1,3) | 1,3 |
| Genetisch | 1 | Osteogenesis imperfecta (2,0) | 2,0 |
| Stürze | 1 | ≥ 2 Stürze/Jahr (1,5) | 1,5 |
| Mobilität | 1 | Immobilität (1,5) | 1,5 |
| Lebensstil | 2 | Rauchen (1,2), BMI < 20 (1,5) | 1,2–1,5 |

### API-Endpunkte

| Pfad | Methoden | Auth | Beschreibung |
|---|---|---|---|
| `/api/auth/login` | POST | – | Login → JWT-Token (8h) |
| `/api/auth/me` | GET | JWT | Aktueller Benutzer |
| `/api/auth/change-password` | POST | JWT | Passwort ändern |
| `/api/patients` | GET, POST | Optional/JWT | Patienten anlegen & auflisten |
| `/api/patients/:id` | GET, PUT, DELETE | JWT | Einzelpatient bearbeiten/löschen |
| `/api/assessments` | POST | Optional | Befund erstellen (automatische Risikoberechnung) |
| `/api/assessments/patient/:id` | GET | JWT | Befunde eines Patienten |
| `/api/assessments/calculate-risk` | POST | – | Risikoberechnung ohne Speicherung (Vorschau) |
| `/api/risk-factors` | GET | – | Risikofaktoren-Datenbank |
| `/api/risk-factors/:id` | PUT | JWT (Arzt/Admin) | Risikofaktor bearbeiten |
| `/api/therapies` | GET | – | Therapie-Datenbank |
| `/api/therapies/:id` | PUT | JWT (Arzt/Admin) | Therapie bearbeiten |
| `/api/laboratory` | GET | – | Laborwerte-Referenzen |
| `/api/laboratory/:id` | PUT | JWT (Arzt/Admin) | Laborwert bearbeiten |
| `/api/admin/users` | GET, POST | JWT (Admin) | Benutzerverwaltung |
| `/api/admin/users/:id` | PUT, DELETE | JWT (Admin) | Benutzer bearbeiten/löschen |
| `/api/admin/audit-log` | GET | JWT (Admin) | Audit-Protokoll |
| `/api/admin/stats` | GET | JWT (Admin) | Systemstatistiken |

### Sicherheit

| Maßnahme | Umsetzung |
|---|---|
| **Authentifizierung** | JWT-Token (8h Gültigkeit), bcrypt-Passwort-Hashing (12 Runden) |
| **Rollenmodell** | 3 Rollen: `admin`, `arzt`, `mfa` – rollenbasierte Zugriffskontrolle |
| **Rate-Limiting** | API: 200 Req/15 Min · Login: 10 Versuche/15 Min |
| **Audit-Log** | Alle relevanten Aktionen (Login, Patientenanlage, Passwortänderung, …) mit Zeitstempel und IP |
| **Outbound-Blocking** | Alle ausgehenden HTTP/HTTPS-Verbindungen zu externen Hosts blockiert |
| **Security-Header** | Helmet.js (CSP, Referrer-Policy, kein Frame-Embedding) |
| **SQL-Injection** | Ausschließlich parametrisierte Queries |
| **Dualer Patienten-Modus** | Anonym (nur Alter/Geschlecht) oder namentlich (nur bei Arzt-Login) |

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|---|---|---|
| `PORT` | 3000 | Server-Port |
| `DB_HOST` | localhost | PostgreSQL-Host |
| `DB_PORT` | 5432 | PostgreSQL-Port |
| `DB_NAME` | osteodoc | Datenbankname |
| `DB_USER` | osteodoc | DB-Benutzer |
| `DB_PASSWORD` | (leer) | DB-Passwort |
| `JWT_SECRET` | dev-secret-… | JWT-Signaturschlüssel |
| `JWT_EXPIRES_IN` | 8h | Token-Gültigkeit |
| `ADMIN_USERNAME` | admin | Initialer Admin-Benutzer |
| `ADMIN_PASSWORD` | admin | Initiales Admin-Passwort |

---

## 🔒 Datenschutz & DSGVO

### Standalone-HTML-Versionen

| Merkmal | Details |
|---|---|
| **Speicherort** | Ausschließlich lokal (IndexedDB + localStorage im Browser) |
| **Serververbindung** | Keine – die App funktioniert vollständig offline |
| **Drittanbieter** | Google Fonts (fonts.googleapis.com) sowie React/Babel von unpkg.com |
| **Patientendaten** | Verlassen das Gerät zu keinem Zeitpunkt |
| **Export** | Nur als lokaler Ausdruck / PDF |

### OsteoDoc Server

| Merkmal | Details |
|---|---|
| **Speicherort** | Lokale PostgreSQL-Datenbank (kein Cloud-Hosting) |
| **Netzwerk** | Server bindet nur auf `127.0.0.1` (localhost) – kein externer Zugriff |
| **Outbound-Blocking** | Ausgehende Verbindungen zu externen Hosts werden aktiv blockiert |
| **Audit-Trail** | Vollständige Protokollierung aller Datenänderungen mit Benutzer-ID, IP und Zeitstempel |
| **Verschlüsselung** | Passwörter bcrypt-gehasht (12 Runden), JWT-signierte Token |

> **Hinweis:** Für den klinischen Einsatz sollte geprüft werden, ob die jeweilige Speicherform (lokal im Browser oder in PostgreSQL) der einrichtungsinternen DSGVO-Richtlinie entspricht. Bei gemeinsam genutzten Computern empfiehlt sich die Verwendung im Inkognito-Modus oder das regelmäßige Löschen der Browser-Daten.

---

## 🛠️ Technische Details

### Architektur

```
├── index.html                              # Startseite (GitHub Pages)
├── osteoporose-app-vollversion.html        # Vollversion (alle Features)
├── osteoporose-fragebogen-standard.html    # Standard-Fragebogen
├── osteoporose-fragebogen-kurz.html        # Kurzversion
├── osteoporose-Fragebogen einfach.html     # Einfach-Version (kompakt)
├── osteoporose-fragebogen-v4.jsx           # Gemeinsame JSX-Quelldatei
├── literaturverzeichnis.html               # Literaturverzeichnis
├── README.md
└── osteodoc-server/                        # Server-Variante (optional)
    ├── server/
    │   ├── app.js                          # Express.js-Server
    │   ├── config/                         # DB-Verbindung, Logging
    │   ├── db/                             # Schema, Seeds, Initialisierung
    │   ├── routes/                         # REST-API-Endpunkte
    │   ├── middleware/                      # Auth, Audit, Security
    │   └── utils/                          # Risikorechner
    └── client/
        └── src/                            # React-SPA-Frontend
```

Jede Standalone-HTML-Datei ist **vollständig self-contained**: React, ReactDOM und Babel werden von `unpkg.com` geladen; alle medizinischen Datenbanken (Risikofaktoren, Therapie, Laborwerte) sind inline eingebettet. Es gibt keine weiteren Abhängigkeiten.

### Stack

| Technologie | Verwendung |
|---|---|
| **React 18** | UI-Framework (Standalone + Server-Client) |
| **Babel Standalone** | JSX-Kompilierung im Browser (Standalone-Versionen) |
| **IndexedDB** | Persistente Patientendaten-Speicherung (Standalone) |
| **localStorage** | Einstellungen, Briefkopf, Datenbanküberschreibungen (Standalone) |
| **CSS (vanilla)** | Responsives Layout, kein CSS-Framework |
| **Node.js / Express** | Backend-Server (OsteoDoc Server) |
| **PostgreSQL** | Relationale Datenbank mit JSONB-Feldern (OsteoDoc Server) |
| **JWT / bcrypt** | Authentifizierung und Passwort-Hashing (OsteoDoc Server) |
| **Helmet.js** | Security-Header (OsteoDoc Server) |

### Externe Bibliotheken (CDN)

Alle externen Abhängigkeiten werden über CDN geladen – es gibt keine lokale Installation oder Build-Prozesse:

| Bibliothek | Version | CDN | Zweck |
|---|---|---|---|
| **React** | 18.x | unpkg.com | UI-Rendering und Komponentenarchitektur |
| **ReactDOM** | 18.x | unpkg.com | DOM-Rendering für React-Komponenten |
| **Babel Standalone** | latest | unpkg.com | JSX-zu-JavaScript-Kompilierung im Browser |
| **Google Fonts – Source Sans 3** | – | fonts.googleapis.com | Primäre UI-Schriftart (Gewichte: 300, 400, 500, 600, 700) |
| **Google Fonts – Playfair Display** | – | fonts.googleapis.com | Überschriften und Praxisname (Gewichte: 400, 600, 700, kursiv) |
| **jsQR** | – | cdn.jsdelivr.net | QR-Code-Erkennung im Medikamenten-Scanner (nur Vollversion) |

> **Hinweis:** Außer den genannten CDN-Ressourcen bestehen keine weiteren externen Abhängigkeiten. Es werden keine npm-Pakete, Build-Tools oder serverseitige Frameworks für die Standalone-HTML-Versionen verwendet.

### Datenpersistenz

Die Standalone-App verwendet ein mehrstufiges Speichersystem:
- **Sitzungsdaten** (Fragebogen-Antworten, berechnetes Risiko) → IndexedDB
- **Konfiguration** (Briefkopf, PIN) → localStorage
- **Datenbanküberschreibungen** (editierte Risikofaktoren, Therapieeinträge, Laborwerte) → localStorage mit Versionierungs-Keys

Bei einem Browser-Update oder Cache-Leerung bleiben die Daten erhalten, solange `localStorage` und `IndexedDB` nicht explizit gelöscht werden.

---

## 📋 Medizinische Grundlagen

Die Risikoberechnung und alle Datenbankeinträge basieren auf:

- **DVO-Leitlinie Osteoporose 2023** (Deutsche Gesellschaft für Osteologie)
- Relative-Risiko-Faktoren (RR) gemäß Leitlinien-Tabellen
- ICD-10-GM-Kodierung für alle Erkrankungen
- Osteologie-Laborwerte nach aktuellen Fachgesellschafts-Empfehlungen (DGO, ESCEO)

> **Haftungsausschluss:** Diese Software ist ein Dokumentations- und Entscheidungshilfswerkzeug. Sie ersetzt keine ärztliche Beurteilung. Alle Therapieentscheidungen liegen in der alleinigen Verantwortung der behandelnden Ärztin / des behandelnden Arztes.

---

## 🚀 Schnellstart

### Standalone (kein Server)

1. Eine der vier Versionen oben über den Link öffnen – oder HTML-Datei herunterladen
2. Im Browser öffnen (Doppelklick oder `Datei → Öffnen`)
3. Fragebogen ausfüllen
4. Für den Arzt-Zugang: Button **„🩺 Arzt-Zugang"** oben rechts → PIN `1234` (Einfach-Version: `0000`)
5. Briefkopf unter **✏️ Briefkopf** einrichten (einmalig)

### OsteoDoc Server

1. PostgreSQL installieren und Datenbank `osteodoc` anlegen
2. Umgebungsvariablen setzen (siehe Tabelle oben)
3. `cd osteodoc-server && npm install`
4. `npm start` → Server läuft auf `http://127.0.0.1:3000`
5. Login mit `admin` / `admin` (Standard) → Passwort sofort ändern

---

## 👨‍⚕️ Entwickelt von

**Dr. med. Georg P. Dahmen**
Orthopädie Langenhorn, Hamburg

### 🤖 KI-Unterstützung

Dieses Projekt wurde mit Unterstützung von **Claude** (Anthropic) entwickelt. Claude hat bei der Programmierung, Strukturierung und Weiterentwicklung der Anwendung assistiert.

---

## 📄 Lizenz

Dieses Projekt steht für den nicht-kommerziellen Test-Einsatz in medizinischen Einrichtungen zur freien Verfügung. Eine kommerzielle Nutzung oder Weitergabe bedarf der ausdrücklichen Genehmigung des Autors.
