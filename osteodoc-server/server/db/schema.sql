-- OsteoDoc Datenbankschema (PostgreSQL)
-- Erstellt die vollständige Datenbankstruktur für die OsteoDoc-Anwendung

-- Erweiterungen
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabelle: users (Admin-Benutzerverwaltung)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(64) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,          -- bcrypt-Hash
    role        VARCHAR(16) NOT NULL CHECK (role IN ('admin', 'arzt', 'mfa')),
    full_name   VARCHAR(128),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    last_login  TIMESTAMP
);

-- ============================================================
-- Tabelle: patients (Standardmodus: anonym)
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
    id           SERIAL PRIMARY KEY,
    -- Anonymmodus: kein Name, nur Alter
    alias        VARCHAR(64),                   -- Optional: Kürzel
    age          INTEGER,                       -- Alter statt Geburtsdatum
    gender       VARCHAR(16) CHECK (gender IN ('weiblich', 'maennlich')),
    -- Ärzte-Modus: mit Namen
    last_name    VARCHAR(128),                  -- nur wenn Arzt eingeloggt
    first_name   VARCHAR(128),
    birth_date   DATE,
    -- Metadaten
    created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- Tabelle: assessments (Befunddaten)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
    id           SERIAL PRIMARY KEY,
    patient_id   INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    -- Alle Formulardaten als strukturiertes JSON
    data         JSONB NOT NULL,
    -- Berechnetes Ergebnis
    risk_result  JSONB,
    -- Metadaten
    created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabelle: risk_factors (DVO-2023 Risikofaktoren-Datenbank)
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_factors (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    category     VARCHAR(64) NOT NULL,
    icd10_code   VARCHAR(16),
    relative_risk NUMERIC(4,2) NOT NULL,
    description  TEXT,
    is_active    BOOLEAN DEFAULT TRUE,
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabelle: therapies (Therapie-Datenbank)
-- ============================================================
CREATE TABLE IF NOT EXISTS therapies (
    id                SERIAL PRIMARY KEY,
    wirkstoff         VARCHAR(255) NOT NULL,       -- Aktiver Wirkstoff
    handelsnamen      TEXT,                        -- Handelsnamen (kommagetrennt)
    gruppe            VARCHAR(128),                -- Medikamentengruppe
    indikation        TEXT,                        -- Indikation
    dosierung         TEXT,                        -- Dosierung
    zulassungstext    TEXT,                        -- Zulassungstext
    nebenwirkungen    TEXT,                        -- Nebenwirkungen
    kontraindikationen TEXT,                       -- Kontraindikationen
    monitoring        TEXT,                        -- Monitoring-Anforderungen
    is_active         BOOLEAN DEFAULT TRUE,
    updated_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabelle: laboratory_values (Laborwerte-Referenz)
-- ============================================================
CREATE TABLE IF NOT EXISTS laboratory_values (
    id              SERIAL PRIMARY KEY,
    parameter_name  VARCHAR(255) NOT NULL,
    category        VARCHAR(64) NOT NULL,
    unit            VARCHAR(32),
    reference_min   NUMERIC,
    reference_max   NUMERIC,
    reference_text  VARCHAR(128),                  -- z.B. "> 30 ng/ml"
    clinical_note   TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabelle: letterheads (Briefkopf-Konfiguration pro Arzt)
-- ============================================================
CREATE TABLE IF NOT EXISTS letterheads (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    practice_name   VARCHAR(255),
    doctor_name     VARCHAR(255),
    specialty       VARCHAR(255),
    address         TEXT,
    phone           VARCHAR(64),
    email           VARCHAR(128),
    website         VARCHAR(255),
    additional_line TEXT,
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabelle: audit_log (Protokollierung)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(64) NOT NULL,
    entity_type VARCHAR(32),
    entity_id   INTEGER,
    details     JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Indizes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);
CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_factors_category ON risk_factors(category);
CREATE INDEX IF NOT EXISTS idx_laboratory_values_category ON laboratory_values(category);
