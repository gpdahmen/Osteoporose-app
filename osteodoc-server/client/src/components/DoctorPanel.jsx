import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function DoctorPanel({ onLoadPatient }) {
  const [tab, setTab] = useState('patients'); // patients | riskFactors | therapies | laboratory
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Risikofaktoren & Therapien
  const [riskFactors, setRiskFactors] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [labValues, setLabValues] = useState([]);

  useEffect(() => {
    if (tab === 'patients') loadPatients();
    if (tab === 'riskFactors') loadRiskFactors();
    if (tab === 'therapies') loadTherapies();
    if (tab === 'laboratory') loadLaboratory();
  }, [tab, search, sort, order]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const result = await api.getPatients({ search, sort, order });
      setPatients(result.patients);
      setTotal(result.total);
    } catch {
      // Fehler ignorieren
    } finally {
      setLoading(false);
    }
  };

  const loadRiskFactors = async () => {
    try {
      const result = await api.getRiskFactors();
      setRiskFactors(result);
    } catch {}
  };

  const loadTherapies = async () => {
    try {
      const result = await api.getTherapies();
      setTherapies(result);
    } catch {}
  };

  const loadLaboratory = async () => {
    try {
      const result = await api.getLaboratory();
      setLabValues(result);
    } catch {}
  };

  const handleLoadPatient = async (patient) => {
    try {
      const assessments = await api.getPatientAssessments(patient.id);
      onLoadPatient(patient, assessments[0] || null);
    } catch {
      onLoadPatient(patient, null);
    }
  };

  const toggleSort = (col) => {
    if (sort === col) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSort(col);
      setOrder('ASC');
    }
  };

  return (
    <div className="doctor-panel">
      <div className="tab-bar">
        <button className={`tab ${tab === 'patients' ? 'active' : ''}`}
                onClick={() => setTab('patients')}>Patienten</button>
        <button className={`tab ${tab === 'riskFactors' ? 'active' : ''}`}
                onClick={() => setTab('riskFactors')}>Risikofaktoren</button>
        <button className={`tab ${tab === 'therapies' ? 'active' : ''}`}
                onClick={() => setTab('therapies')}>Therapien</button>
        <button className={`tab ${tab === 'laboratory' ? 'active' : ''}`}
                onClick={() => setTab('laboratory')}>Laborwerte</button>
      </div>

      {/* ─── Patienten-Tab ──────────────────────── */}
      {tab === 'patients' && (
        <section className="card">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Patient suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="count">{total} Patienten</span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('last_name')}>Name</th>
                <th onClick={() => toggleSort('age')}>Alter</th>
                <th>Geschlecht</th>
                <th onClick={() => toggleSort('created_at')}>Erstellt</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.last_name
                      ? `${p.last_name}, ${p.first_name}`
                      : p.alias || `Anonym #${p.id}`}
                  </td>
                  <td>{p.age}</td>
                  <td>{p.gender === 'weiblich' ? 'W' : p.gender === 'maennlich' ? 'M' : '–'}</td>
                  <td>{new Date(p.created_at).toLocaleDateString('de-DE')}</td>
                  <td>
                    <button className="btn-small" onClick={() => handleLoadPatient(p)}>
                      Laden
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && !loading && (
                <tr><td colSpan={5} className="empty">Keine Patienten gefunden</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* ─── Risikofaktoren-Tab ─────────────────── */}
      {tab === 'riskFactors' && (
        <section className="card">
          <h3>DVO-2023 Risikofaktoren</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Kategorie</th>
                <th>ICD-10</th>
                <th>RR</th>
              </tr>
            </thead>
            <tbody>
              {riskFactors.map(rf => (
                <tr key={rf.id}>
                  <td>{rf.name}</td>
                  <td>{rf.category}</td>
                  <td>{rf.icd10_code || '–'}</td>
                  <td><span className="rr-badge">{rf.relative_risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ─── Therapien-Tab ──────────────────────── */}
      {tab === 'therapies' && (
        <section className="card">
          <h3>Osteoporose-Therapien</h3>
          <div className="therapy-list">
            {therapies.map(t => (
              <div key={t.id} className="therapy-card">
                <h4>{t.wirkstoff}</h4>
                {t.handelsnamen && <p><strong>Handelsnamen:</strong> {t.handelsnamen}</p>}
                {t.gruppe && <p><strong>Gruppe:</strong> {t.gruppe}</p>}
                {t.indikation && <p><strong>Indikation:</strong> {t.indikation}</p>}
                {t.dosierung && <p><strong>Dosierung:</strong> {t.dosierung}</p>}
                {t.nebenwirkungen && <p><strong>Nebenwirkungen:</strong> {t.nebenwirkungen}</p>}
                {t.kontraindikationen && <p><strong>Kontraindikationen:</strong> {t.kontraindikationen}</p>}
              </div>
            ))}
            {therapies.length === 0 && <p className="empty">Keine Therapien in der Datenbank.</p>}
          </div>
        </section>
      )}

      {/* ─── Laborwerte-Tab ─────────────────────── */}
      {tab === 'laboratory' && (
        <section className="card">
          <h3>Laborwerte-Referenz</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Kategorie</th>
                <th>Referenz</th>
                <th>Einheit</th>
              </tr>
            </thead>
            <tbody>
              {labValues.map(lv => (
                <tr key={lv.id}>
                  <td>{lv.parameter_name}</td>
                  <td>{lv.category}</td>
                  <td>{lv.reference_text || `${lv.reference_min || ''} – ${lv.reference_max || ''}`}</td>
                  <td>{lv.unit || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
