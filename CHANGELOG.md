# Osteoporose-Risikocheck – Changelog

## v4.0 (26.02.2026) — aktueller Stand
- DVO 2023 Tabelle 3.2 mit Originalfarben (grün/gelb/rosa/rot)
- Automatische Tabellenauswahl nach T-Score Gesamthüfte (3%/5%/10%)
- Patientenzeile und -spalte markiert, Patientenzelle farbig
- Admin-Modus (PIN 1234): Klartext-Diagnosen + ICD-10-5-Steller editierbar
- Diagnose-Datenbank (50+ Risikofaktoren) mit window.storage-Persistenz
- Textdatei: Diagnosen am Ende im Format "Klarschrift {ICD-10};"
- MedInput autoOpen bei "Ja"-Auswahl
- Eingebauter Textviewer + PDF via window.print()
- Größe (80–250 cm), Gewicht (30–300 kg), Alter (18–130 J.) mit Validierung
- Freie Eingabe bei Größe/Gewicht (kein Blockieren)
- Alterswarnung unter Geburtsdatumfeld (GebDatInput-Komponente)
- Standalone HTML-Export mit localStorage statt window.storage
- localStorage / window.storage kompatibel

## v3.x (Vorversionen)
- Auto-Save, Session-Verlauf, DXA-Sektion, PDF/TXT-Export
- MedInput-Komponente mit 200+ Medikamenten, 15+ Kategorien
- Simplified German questions (24 Fragen), Patientenfreundliche Hints
- Briefkopf-Editor, Druckansicht
