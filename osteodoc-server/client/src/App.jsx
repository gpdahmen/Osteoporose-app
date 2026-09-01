import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import PatientForm from './components/PatientForm';
import Questionnaire from './components/Questionnaire';
import RiskResult from './components/RiskResult';
import DoctorPanel from './components/DoctorPanel';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('questionnaire'); // questionnaire | result | doctor | admin
  const [showLogin, setShowLogin] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [riskResult, setRiskResult] = useState(null);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>OsteoDoc wird geladen...</p>
      </div>
    );
  }

  const handleAssessmentComplete = (data, result) => {
    setAssessmentData(data);
    setRiskResult(result);
    setView('result');
  };

  const handleNewAssessment = () => {
    setCurrentPatient(null);
    setAssessmentData(null);
    setRiskResult(null);
    setView('questionnaire');
  };

  const handleLoadPatient = (patient, assessment) => {
    setCurrentPatient(patient);
    if (assessment) {
      setAssessmentData(assessment.data);
      setRiskResult(assessment.risk_result);
      setView('result');
    } else {
      setView('questionnaire');
    }
  };

  return (
    <div className="app">
      <Header
        user={user}
        view={view}
        onNavigate={setView}
        onLoginClick={() => setShowLogin(true)}
        onNewAssessment={handleNewAssessment}
      />

      <main className="main-content">
        {view === 'questionnaire' && (
          <>
            <PatientForm
              patient={currentPatient}
              onPatientCreated={setCurrentPatient}
              isDoctor={user?.role === 'arzt'}
            />
            <Questionnaire
              patient={currentPatient}
              existingData={assessmentData}
              onComplete={handleAssessmentComplete}
            />
          </>
        )}

        {view === 'result' && riskResult && (
          <RiskResult
            result={riskResult}
            data={assessmentData}
            patient={currentPatient}
            onBack={() => setView('questionnaire')}
            onNewAssessment={handleNewAssessment}
          />
        )}

        {view === 'doctor' && user?.role === 'arzt' && (
          <DoctorPanel onLoadPatient={handleLoadPatient} />
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <footer className="footer">
        <p>OsteoDoc v1.0 – Basierend auf DVO-Leitlinie 2023</p>
        <p>Alle Daten verbleiben auf diesem Server. Keine externen Verbindungen.</p>
      </footer>
    </div>
  );
}
