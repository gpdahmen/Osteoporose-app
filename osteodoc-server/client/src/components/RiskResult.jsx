import React from 'react';

export default function RiskResult({ result, data, patient, onBack, onNewAssessment }) {
  if (!result) return null;

  return (
    <div className="risk-result">
      <section className="card result-card" style={{ borderLeftColor: result.color }}>
        <h2>Ergebnis der Risikoberechnung</h2>

        <div className="result-summary">
          <div className="result-category" style={{ backgroundColor: result.color }}>
            <span className="category-label">{result.categoryLabel}</span>
            <span className="category-rr">Relatives Risiko: {result.totalRR}</span>
          </div>
        </div>

        {patient && (
          <div className="result-patient">
            <strong>Patient:</strong>{' '}
            {patient.last_name
              ? `${patient.last_name}, ${patient.first_name}`
              : patient.alias || `Anonym (ID: ${patient.id})`}
            {patient.age && ` – ${patient.age} Jahre`}
            {patient.gender && ` – ${patient.gender === 'weiblich' ? 'Weiblich' : 'Männlich'}`}
          </div>
        )}

        <div className="result-recommendation">
          <h3>Empfehlung</h3>
          <p>{result.recommendation}</p>
        </div>
      </section>

      {/* Detailaufschlüsselung */}
      <section className="card">
        <h2>Detailaufschlüsselung</h2>
        <table className="detail-table">
          <thead>
            <tr><th>Faktor</th><th>RR-Beitrag</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Basis (T-Score: {result.lowestTScore})</td>
              <td>{result.details.baseRR}</td>
            </tr>
            {result.details.tbsAdjustment !== 1 && (
              <tr><td>TBS-Korrektur</td><td>&times;{result.details.tbsAdjustment}</td></tr>
            )}
            {result.details.fractureRR !== 1 && (
              <tr><td>Frakturen</td><td>&times;{result.details.fractureRR}</td></tr>
            )}
            {result.details.medicationRR !== 1 && (
              <tr><td>Medikamente</td><td>&times;{result.details.medicationRR}</td></tr>
            )}
            {result.details.secondaryRR !== 1 && (
              <tr><td>Sekundäre Ursachen</td><td>&times;{result.details.secondaryRR}</td></tr>
            )}
            {result.details.lifestyleRR !== 1 && (
              <tr><td>Lebensstil / Stürze</td><td>&times;{result.details.lifestyleRR}</td></tr>
            )}
            {result.details.clinicalRR !== 1 && (
              <tr><td>Klinische Faktoren</td><td>&times;{result.details.clinicalRR}</td></tr>
            )}
            <tr className="total-row">
              <td><strong>Gesamtrisiko</strong></td>
              <td><strong>{result.totalRR}</strong></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Aktive Risikofaktoren */}
      {result.activeFactors && result.activeFactors.length > 0 && (
        <section className="card">
          <h2>Aktive Risikofaktoren</h2>
          <ul className="factor-list">
            {result.activeFactors.map((f, i) => (
              <li key={i}>
                <span>{f.name}</span>
                <span className="rr-badge">RR {f.rr}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="result-actions">
        <button className="btn-secondary" onClick={onBack}>
          Zurück zum Fragebogen
        </button>
        <button className="btn-primary" onClick={onNewAssessment}>
          Neues Assessment
        </button>
        <button className="btn-secondary" onClick={() => window.print()}>
          Drucken / PDF
        </button>
      </div>
    </div>
  );
}
