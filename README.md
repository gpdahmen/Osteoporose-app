# 🦴 Osteoporose-Fragebogen v4

Eine vollständige, **DSGVO-konforme Webanwendung** zur strukturierten Osteoporose-Dokumentation und Risikoberechnung nach der **DVO-Leitlinie 2023** – entwickelt für den orthopädischen Praxisalltag.

Die App läuft vollständig im Browser, benötigt keine Serververbindung und speichert alle Daten ausschließlich lokal auf dem Gerät des Benutzers (IndexedDB / localStorage).

---

## 🖥️ Live-Demo & Download

> **Einfachste Nutzung:** Die Datei `osteoporose-fragebogen-v4.html` herunterladen und direkt im Browser öffnen – keine Installation, kein Server, keine Abhängigkeiten.

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
- **DXA-Werte** – Eingabe von T-Score und Z-Score für LWS und Hüfte

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
| **Drittanbieter** | Nur Google Fonts (CDN, optional) sowie React/Babel von cdnjs.cloudflare.com |
| **Patientendaten** | Verlassen das Gerät zu keinem Zeitpunkt |
| **Export** | Nur als lokaler Ausdruck / PDF |

> **Hinweis:** Für den klinischen Einsatz sollte geprüft werden, ob die lokale Speicherung im Browser der einrichtungsinternen DSGVO-Richtlinie entspricht. Bei gemeinsam genutzten Computern empfiehlt sich die Verwendung im Inkognito-Modus oder das regelmäßige Löschen der Browser-Daten.

---

## 🛠️ Technische Details

### Architektur

```
osteoporose-fragebogen-v4.html    ← Standalone-Datei, direkt im Browser öffnen
osteoporose-fragebogen-v4.jsx     ← Quellcode (React/JSX)
```

Die HTML-Datei ist **vollständig self-contained**: React, ReactDOM und Babel werden von `cdnjs.cloudflare.com` geladen; alle medizinischen Datenbanken (Risikofaktoren, Therapie, Laborwerte) sind inline eingebettet. Es gibt keine weiteren Abhängigkeiten.

### Stack

| Technologie | Verwendung |
|---|---|
| **React 18** | UI-Framework |
| **Babel Standalone** | JSX-Kompilierung im Browser |
| **IndexedDB** | Persistente Patientendaten-Speicherung |
| **localStorage** | Einstellungen, Briefkopf, Datenbanküberschreibungen |
| **CSS (vanilla)** | Responsives Layout, kein CSS-Framework |

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

1. Datei `osteoporose-fragebogen-v4.html` herunterladen
2. Im Browser öffnen (Doppelklick oder `Datei → Öffnen`)
3. Fragebogen ausfüllen
4. Für den Arzt-Zugang: Button **„🩺 Arzt-Zugang"** → PIN `1234`
5. Briefkopf unter **✏️ Briefkopf** einrichten (einmalig)

---

## 📁 Repository-Inhalt

```
├── osteoporose-fragebogen-v4.html   # Fertige Anwendung (direkt nutzbar)
├── osteoporose-fragebogen-v4.jsx    # React/JSX Quellcode
├── osteoporose-risikocheck-4.html   # Ältere Version (Archiv)
└── README.md
```

---

## 👨‍⚕️ Entwickelt von

**Dr. med. Georg P. Dahmen**  
Orthopädie Langenhorn, Hamburg  

---

## 📄 Lizenz

Dieses Projekt steht für den nicht-kommerziellen Einsatz in medizinischen Einrichtungen zur freien Verfügung. Eine kommerzielle Nutzung oder Weitergabe bedarf der ausdrücklichen Genehmigung des Autors.
