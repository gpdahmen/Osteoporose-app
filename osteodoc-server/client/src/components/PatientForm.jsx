import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function PatientForm({ patient, onPatientCreated, isDoctor }) {
  const [alias, setAlias] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (patient) {
      setAlias(patient.alias || '');
      setAge(patient.age?.toString() || '');
      setGender(patient.gender || '');
      setFirstName(patient.first_name || '');
      setLastName(patient.last_name || '');
      setBirthDate(patient.birth_date ? patient.birth_date.split('T')[0] : '');
    }
  }, [patient]);

  // Alter automatisch aus Geburtsdatum berechnen
  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let calcAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calcAge--;
      }
      if (calcAge > 0) setAge(calcAge.toString());
    }
  }, [birthDate]);

  const handleCreatePatient = async () => {
    setError('');
    if (!age) {
      setError('Bitte geben Sie das Alter ein.');
      return;
    }

    try {
      const data = {
        alias: alias || undefined,
        age: parseInt(age),
        gender: gender || undefined,
      };

      if (isDoctor) {
        data.firstName = firstName || undefined;
        data.lastName = lastName || undefined;
        data.birthDate = birthDate || undefined;
      }

      const result = await api.createPatient(data);
      onPatientCreated(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card patient-form">
      <h2>Patientendaten</h2>
      {error && <div className="error-message">{error}</div>}

      {patient && (
        <div className="patient-info-banner">
          Patient geladen: {patient.last_name
            ? `${patient.last_name}, ${patient.first_name}`
            : patient.alias || `Anonym (ID: ${patient.id})`
          }
        </div>
      )}

      {isDoctor && (
        <div className="form-row">
          <div className="form-group">
            <label>Nachname</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nachname"
            />
          </div>
          <div className="form-group">
            <label>Vorname</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Vorname"
            />
          </div>
          <div className="form-group">
            <label>Geburtsdatum</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {!isDoctor && (
        <div className="form-group">
          <label>Kürzel (optional)</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="z.B. Initialen"
          />
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Alter *</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="120"
            required
          />
        </div>
        <div className="form-group">
          <label>Geschlecht</label>
          <div className="radio-group">
            <label className={`radio-label ${gender === 'weiblich' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="weiblich"
                checked={gender === 'weiblich'}
                onChange={(e) => setGender(e.target.value)}
              />
              Weiblich
            </label>
            <label className={`radio-label ${gender === 'maennlich' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="maennlich"
                checked={gender === 'maennlich'}
                onChange={(e) => setGender(e.target.value)}
              />
              Männlich
            </label>
          </div>
        </div>
      </div>

      {!patient && (
        <button className="btn-primary" onClick={handleCreatePatient}>
          Patient anlegen & Fragebogen starten
        </button>
      )}
    </section>
  );
}
