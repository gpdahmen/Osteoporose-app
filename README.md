# 🦴 Osteoporose-Fragebogen

Eine vollständige, **DSGVO-konforme Webanwendung** zur strukturierten Osteoporose-Dokumentation und Risikoberechnung auf der Grundlage der **DVO-Leitlinie 2023** – entwickelt für den osteologischen Praxisalltag.

**Es handelt sich um eine Demo-Version als Machbarkeitsstudie. Sie dient nur zur Veranschaulichung und zu Schulungszwecken. Es ist nicht zur klinischen Anwendung gedacht oder geeignet. Es ist ein Projekt in Entwicklung und weißt noch Fehler auf.** 

Die App läuft vollständig im Browser, benötigt keine Serververbindung und speichert alle Daten ausschließlich lokal auf dem Gerät des Benutzers (IndexedDB / localStorage).

---

## 🖥️ Live-Demo (GitHub Pages)

Die drei Versionen sind direkt im Browser nutzbar – kein Download nötig:

| Version | Beschreibung | Link |
|---|---|---|
| **Vollversion** | Alle Funktionen inkl. Arzt-Zugang, Laborwerte, Sekundäre Osteoporose | [Vollversion öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-app-vollversion.html) |
| **Standard** | Standard-Fragebogen mit Arzt-Zugang | [Standard öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-fragebogen-standard.html) |
| **Kurzversion** | Kompakter Fragebogen | [Kurzversion öffnen](https://gpdahmen.github.io/Osteoporose-app/osteoporose-fragebogen-kurz.html) |

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

## 🔒 Datenschutz & DSGVO

| Merkmal | Details |
|---|---|
| **Speicherort** | Ausschließlich lokal (IndexedDB + localStorage im Browser) |
| **Serververbindung** | Keine – die App funktioniert vollständig offline |
| **Drittanbieter** | Google Fonts (fonts.googleapis.com) sowie React/Babel von unpkg.com |
| **Patientendaten** | Verlassen das Gerät zu keinem Zeitpunkt |
| **Export** | Nur als lokaler Ausdruck / PDF |

> **Hinweis:** Für den klinischen Einsatz sollte geprüft werden, ob die lokale Speicherung im Browser der einrichtungsinternen DSGVO-Richtlinie entspricht. Bei gemeinsam genutzten Computern empfiehlt sich die Verwendung im Inkognito-Modus oder das regelmäßige Löschen der Browser-Daten.

---

## 🛠️ Technische Details

### Architektur

```
├── index.html                              # Startseite (GitHub Pages)
├── osteoporose-app-vollversion.html        # Vollversion (alle Features)
├── osteoporose-fragebogen-standard.html    # Standard-Fragebogen
├── osteoporose-fragebogen-kurz.html        # Kurzversion
└── README.md
```

Jede HTML-Datei ist **vollständig self-contained**: React, ReactDOM und Babel werden von `cdnjs.cloudflare.com` geladen; alle medizinischen Datenbanken (Risikofaktoren, Therapie, Laborwerte) sind inline eingebettet. Es gibt keine weiteren Abhängigkeiten.

### Stack

| Technologie | Verwendung |
|---|---|
| **React 18** | UI-Framework |
| **Babel Standalone** | JSX-Kompilierung im Browser |
| **IndexedDB** | Persistente Patientendaten-Speicherung |
| **localStorage** | Einstellungen, Briefkopf, Datenbanküberschreibungen |
| **CSS (vanilla)** | Responsives Layout, kein CSS-Framework |

### Externe Bibliotheken (CDN)

Alle externen Abhängigkeiten werden über CDN geladen – es gibt keine lokale Installation oder Build-Prozesse:

| Bibliothek | Version | CDN | Zweck |
|---|---|---|---|
| **React** | 18.x | unpkg.com | UI-Rendering und Komponentenarchitektur |
| **ReactDOM** | 18.x | unpkg.com | DOM-Rendering für React-Komponenten |
| **Babel Standalone** | latest | unpkg.com | JSX-zu-JavaScript-Kompilierung im Browser |
| **Google Fonts – Source Sans 3** | – | fonts.googleapis.com | Primäre UI-Schriftart (Gewichte: 300, 400, 500, 600, 700) |
| **Google Fonts – Playfair Display** | – | fonts.googleapis.com | Überschriften und Praxisname (Gewichte: 400, 600, 700, kursiv) |

> **Hinweis:** Außer den genannten CDN-Ressourcen bestehen keine weiteren externen Abhängigkeiten. Es werden keine npm-Pakete, Build-Tools oder serverseitige Frameworks verwendet.

### Datenpersistenz

Die App verwendet ein mehrstufiges Speichersystem:
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

1. Eine der drei Versionen oben über den Link öffnen – oder HTML-Datei herunterladen
2. Im Browser öffnen (Doppelklick oder `Datei → Öffnen`)
3. Fragebogen ausfüllen
4. Für den Arzt-Zugang: Button **„🩺 Arzt-Zugang"** oben rechts → PIN `1234`
5. Briefkopf unter **✏️ Briefkopf** einrichten (einmalig)

---

## 👨‍⚕️ Entwickelt von

**Dr. med. Georg P. Dahmen**
Orthopädie Langenhorn, Hamburg

### 🤖 KI-Unterstützung

Dieses Projekt wurde mit Unterstützung von **Claude** (Anthropic) entwickelt. Claude hat bei der Programmierung, Strukturierung und Weiterentwicklung der Anwendung assistiert.

---

## 📄 Lizenz

Dieses Projekt steht für den nicht-kommerziellen Einsatz in medizinischen Einrichtungen zur freien Verfügung. Eine kommerzielle Nutzung oder Weitergabe bedarf der ausdrücklichen Genehmigung des Autors.
