import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const FRACTURE_OPTIONS = [
  { key: 'singleVertebralGrade1', label: 'Singuläre WK-Fraktur 1. Grades (25-40% Höhenminderung)' },
  { key: 'singleVertebralGrade2or3', label: 'Singuläre WK-Fraktur 2./3. Grades (>40% Höhenminderung)' },
  { key: 'multipleVertebral', label: 'Multiple Wirbelkörperfrakturen (≥2)' },
  { key: 'proximalFemur', label: 'Niedrigtraumatische proximale Femurfraktur' },
  { key: 'otherLowTrauma', label: 'Andere niedrigtraumatische Frakturen' },
];

const MEDICATION_OPTIONS = [
  { key: 'glucocorticoidsLow', label: 'Glukokortikoide ≥2,5 mg (≥3 Monate)' },
  { key: 'glucocorticoidsHigh', label: 'Glukokortikoide ≥7,5 mg (≥3 Monate)' },
  { key: 'aromataseInhibitors', label: 'Aromatasehemmer' },
  { key: 'antiandrogens', label: 'Antiandrogene Therapie / GnRH-Analoga' },
  { key: 'anticonvulsants', label: 'Antikonvulsiva (enzyminduzierend)' },
  { key: 'ppiLongTerm', label: 'Protonenpumpenhemmer (>1 Jahr)' },
];

export default function Questionnaire({ patient, existingData, onComplete }) {
  // DXA-Werte
  const [tScoreHip, setTScoreHip] = useState('');
  const [tScoreLumbar, setTScoreLumbar] = useState('');
  const [tScoreFemoralNeck, setTScoreFemoralNeck] = useState('');
  const [tbs, setTbs] = useState('');

  // Risikofaktoren
  const [fractures, setFractures] = useState({});
  const [medications, setMedications] = useState({});
  const [falls, setFalls] = useState(0);
  const [immobile, setImmobile] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [bmi, setBmi] = useState('');

  // Sekundäre Osteoporose
  const [secondaryCauses, setSecondaryCauses] = useState([]);
  const [availableRiskFactors, setAvailableRiskFactors] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Risikofaktoren aus DB laden
  useEffect(() => {
    api.getRiskFactors()
      .then(setAvailableRiskFactors)
      .catch(() => {});
  }, []);

  // Existierende Daten laden
  useEffect(() => {
    if (existingData) {
      setTScoreHip(existingData.tScoreHip?.toString() || '');
      setTScoreLumbar(existingData.tScoreLumbar?.toString() || '');
      setTScoreFemoralNeck(existingData.tScoreFemoralNeck?.toString() || '');
      setTbs(existingData.tbs?.toString() || '');
      setFractures(existingData.fractures || {});
      setMedications(existingData.medications || {});
      setFalls(existingData.falls || 0);
      setImmobile(existingData.immobile || false);
      setSmoking(existingData.smoking || false);
      setBmi(existingData.bmi?.toString() || '');
      setSecondaryCauses(existingData.secondaryCauses || []);
    }
  }, [existingData]);

  const toggleFracture = (key) => {
    setFractures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMedication = (key) => {
    setMedications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecondaryCause = (factor) => {
    setSecondaryCauses(prev => {
      const exists = prev.find(c => c.id === factor.id);
      if (exists) {
        return prev.filter(c => c.id !== factor.id);
      }
      return [...prev, { ...factor, active: true, relativeRisk: factor.relative_risk }];
    });
  };

  const handleSubmit = async () => {
    if (!patient) {
      setError('Bitte zuerst einen Patienten anlegen.');
      return;
    }

    setError('');
    setSubmitting(true);

    const data = {
      age: patient.age,
      gender: patient.gender,
      tScoreHip: tScoreHip ? parseFloat(tScoreHip) : null,
      tScoreLumbar: tScoreLumbar ? parseFloat(tScoreLumbar) : null,
      tScoreFemoralNeck: tScoreFemoralNeck ? parseFloat(tScoreFemoralNeck) : null,
      tbs: tbs ? parseFloat(tbs) : null,
      fractures,
      medications,
      falls,
      immobile,
      smoking,
      bmi: bmi ? parseFloat(bmi) : null,
      riskFactors: [],
      secondaryCauses,
    };

    try {
      const result = await api.createAssessment({
        patientId: patient.id,
        data,
      });
      onComplete(data, result.risk_result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Risikofaktoren nach Kategorie gruppieren (nur sekundäre)
  const secondaryCategories = {};
  for (const rf of availableRiskFactors) {
    if (['Endokrin', 'Gastrointestinal', 'Renal', 'Hämatologisch',
         'Immunologisch', 'Neurologisch', 'Genetisch'].includes(rf.category)) {
      if (!secondaryCategories[rf.category]) secondaryCategories[rf.category] = [];
      secondaryCategories[rf.category].push(rf);
    }
  }

  return (
    <div className="questionnaire">
      {error && <div className="error-message">{error}</div>}

      {/* ─── DXA-Werte ──────────────────────────── */}
      <section className="card">
        <h2>DXA-Messwerte (T-Scores)</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Gesamthüfte (Total Hip)</label>
            <input
              type="number"
              step="0.1"
              value={tScoreHip}
              onChange={(e) => setTScoreHip(e.target.value)}
              placeholder="z.B. -2.5"
            />
          </div>
          <div className="form-group">
            <label>LWS (L1-L4)</label>
            <input
              type="number"
              step="0.1"
              value={tScoreLumbar}
              onChange={(e) => setTScoreLumbar(e.target.value)}
              placeholder="z.B. -2.8"
            />
          </div>
          <div className="form-group">
            <label>Schenkelhals (Femoral Neck)</label>
            <input
              type="number"
              step="0.1"
              value={tScoreFemoralNeck}
              onChange={(e) => setTScoreFemoralNeck(e.target.value)}
              placeholder="z.B. -2.3"
            />
          </div>
        </div>
        <div className="form-group">
          <label>TBS (Trabecular Bone Score, optional)</label>
          <input
            type="number"
            step="0.01"
            value={tbs}
            onChange={(e) => setTbs(e.target.value)}
            placeholder="z.B. 1.25"
          />
        </div>
      </section>

      {/* ─── Frakturen ──────────────────────────── */}
      <section className="card">
        <h2>Frakturanamnese</h2>
        <div className="checkbox-group">
          {FRACTURE_OPTIONS.map(opt => (
            <label key={opt.key} className={`checkbox-label ${fractures[opt.key] ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={!!fractures[opt.key]}
                onChange={() => toggleFracture(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      {/* ─── Allgemeine Risikofaktoren ──────────── */}
      <section className="card">
        <h2>Allgemeine Risikofaktoren</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Stürze im letzten Jahr</label>
            <input
              type="number"
              min="0"
              value={falls}
              onChange={(e) => setFalls(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>BMI (kg/m²)</label>
            <input
              type="number"
              step="0.1"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="z.B. 22.5"
            />
          </div>
        </div>
        <div className="checkbox-group">
          <label className={`checkbox-label ${immobile ? 'selected' : ''}`}>
            <input type="checkbox" checked={immobile} onChange={() => setImmobile(!immobile)} />
            Immobilität
          </label>
          <label className={`checkbox-label ${smoking ? 'selected' : ''}`}>
            <input type="checkbox" checked={smoking} onChange={() => setSmoking(!smoking)} />
            Rauchen (aktuell)
          </label>
        </div>
      </section>

      {/* ─── Medikamente ────────────────────────── */}
      <section className="card">
        <h2>Medikamentöse Risikofaktoren</h2>
        <div className="checkbox-group">
          {MEDICATION_OPTIONS.map(opt => (
            <label key={opt.key} className={`checkbox-label ${medications[opt.key] ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={!!medications[opt.key]}
                onChange={() => toggleMedication(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      {/* ─── Sekundäre Osteoporose ──────────────── */}
      <section className="card">
        <h2>Sekundäre Osteoporose</h2>
        {Object.entries(secondaryCategories).map(([cat, factors]) => (
          <div key={cat} className="secondary-category">
            <h3>{cat}</h3>
            <div className="checkbox-group">
              {factors.map(f => (
                <label
                  key={f.id}
                  className={`checkbox-label ${secondaryCauses.find(c => c.id === f.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={!!secondaryCauses.find(c => c.id === f.id)}
                    onChange={() => toggleSecondaryCause(f)}
                  />
                  {f.name} {f.icd10_code && <span className="icd-code">({f.icd10_code})</span>}
                  <span className="rr-badge">RR {f.relative_risk}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(secondaryCategories).length === 0 && (
          <p className="hint">Risikofaktoren werden aus der Datenbank geladen...</p>
        )}
      </section>

      {/* ─── Absenden ───────────────────────────── */}
      <div className="submit-section">
        <button
          className="btn-primary btn-large"
          onClick={handleSubmit}
          disabled={submitting || !patient}
        >
          {submitting ? 'Berechnung läuft...' : 'Risiko berechnen & speichern'}
        </button>
        {!patient && (
          <p className="hint">Bitte zuerst oben einen Patienten anlegen.</p>
        )}
      </div>
    </div>
  );
}
