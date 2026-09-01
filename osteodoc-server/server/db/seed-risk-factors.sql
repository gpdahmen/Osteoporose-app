-- OsteoDoc – Risikofaktoren nach DVO-Leitlinie 2023
-- Seed-Daten für die Ersteinrichtung

INSERT INTO risk_factors (name, category, icd10_code, relative_risk, description) VALUES
-- Allgemeine Risikofaktoren
('Singuläre Wirbelkörperfraktur 1. Grades', 'Frakturen', 'M80.08', 1.5, 'Singuläre WK-Fraktur mit 25-40% Höhenminderung'),
('Multiple Wirbelkörperfrakturen', 'Frakturen', 'M80.08', 3.0, 'Zwei oder mehr Wirbelkörperfrakturen'),
('Singuläre Wirbelkörperfraktur 2./3. Grades', 'Frakturen', 'M80.08', 2.0, 'WK-Fraktur mit >40% Höhenminderung'),
('Niedrigtraumatische proximale Femurfraktur', 'Frakturen', 'S72.0', 2.0, 'Hüftfraktur bei adäquatem oder Bagatelltrauma'),
('Andere niedrigtraumatische Frakturen', 'Frakturen', 'M80.0', 1.5, 'Nicht-vertebrale, nicht-Femur-Frakturen'),
('Sturzneigung (≥2 Stürze/Jahr)', 'Stürze', 'R29.6', 1.5, 'Mindestens zwei klinisch relevante Stürze im letzten Jahr'),
('Immobilität', 'Mobilität', 'M62.3', 1.5, 'Bettlägerigkeit oder erheblich eingeschränkte Mobilität'),
('Rauchen (aktuell)', 'Lebensstil', 'F17.2', 1.2, 'Aktiver Tabakkonsum'),
('BMI < 20 kg/m²', 'Lebensstil', 'R63.6', 1.5, 'Untergewicht'),
-- Medikamentöse Risikofaktoren
('Glukokortikoide ≥2,5 mg ≥3 Monate', 'Medikamente', 'Y42.0', 2.0, 'Systemische Glukokortikoidtherapie ≥2,5 mg Prednisolonäquivalent über ≥3 Monate'),
('Glukokortikoide ≥7,5 mg ≥3 Monate', 'Medikamente', 'Y42.0', 4.0, 'Hochdosierte systemische Glukokortikoidtherapie'),
('Aromatasehemmer', 'Medikamente', 'L02BG', 1.5, 'Aromatasehemmer-Therapie bei Mammakarzinom'),
('Antiandrogene Therapie / GnRH', 'Medikamente', 'L02AE', 1.5, 'Androgendeprivationstherapie'),
('Antikonvulsiva', 'Medikamente', 'N03A', 1.2, 'Enzyminduzierende Antikonvulsiva'),
('Protonenpumpenhemmer (>1 Jahr)', 'Medikamente', 'A02BC', 1.2, 'Langzeittherapie mit PPI über mehr als 1 Jahr'),
-- Sekundäre Osteoporose – Endokrin
('Diabetes mellitus Typ 1', 'Endokrin', 'E10', 1.5, 'Insulinabhängiger Diabetes mellitus'),
('Cushing-Syndrom', 'Endokrin', 'E24', 2.0, 'Endogenes oder exogenes Cushing-Syndrom'),
('Primärer Hyperparathyreoidismus', 'Endokrin', 'E21.0', 1.5, 'pHPT mit erhöhtem PTH und Calcium'),
('Hypogonadismus', 'Endokrin', 'E28/E29', 1.5, 'Östrogen- oder Testosteronmangel'),
('Hyperthyreose', 'Endokrin', 'E05', 1.3, 'Manifeste Schilddrüsenüberfunktion'),
-- Sekundäre Osteoporose – Gastrointestinal
('Zöliakie', 'Gastrointestinal', 'K90.0', 1.5, 'Glutensensitive Enteropathie'),
('Morbus Crohn', 'Gastrointestinal', 'K50', 1.5, 'Chronisch-entzündliche Darmerkrankung'),
('Colitis ulcerosa', 'Gastrointestinal', 'K51', 1.3, 'Chronisch-entzündliche Darmerkrankung'),
-- Sekundäre Osteoporose – Renal
('Chronische Niereninsuffizienz (GFR <30)', 'Renal', 'N18.4', 2.0, 'Schwere Nierenfunktionseinschränkung'),
-- Sekundäre Osteoporose – Hämatologisch
('Multiples Myelom', 'Hämatologisch', 'C90.0', 2.0, 'Plasmozytom'),
('Systemische Mastozytose', 'Hämatologisch', 'D47.0', 1.5, 'Mastzellerkrankung mit Knochenbefall'),
-- Sekundäre Osteoporose – Immunologisch
('Rheumatoide Arthritis', 'Immunologisch', 'M05/M06', 1.5, 'Chronische Polyarthritis'),
('Spondylitis ankylosans', 'Immunologisch', 'M45', 1.5, 'Morbus Bechterew'),
-- Sekundäre Osteoporose – Neurologisch
('Epilepsie (unter Therapie)', 'Neurologisch', 'G40', 1.3, 'Epilepsie unter antikonvulsiver Therapie'),
-- Sekundäre Osteoporose – Genetisch
('Osteogenesis imperfecta', 'Genetisch', 'Q78.0', 2.0, 'Glasknochenkrankheit');
