import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header({ user, view, onNavigate, onLoginClick, onNewAssessment }) {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-brand">
        <h1 className="header-title">OsteoDoc</h1>
        <span className="header-subtitle">Osteoporose-Bewertung nach DVO 2023</span>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-btn ${view === 'questionnaire' ? 'active' : ''}`}
          onClick={onNewAssessment}
        >
          Neuer Fragebogen
        </button>

        {user?.role === 'arzt' && (
          <button
            className={`nav-btn ${view === 'doctor' ? 'active' : ''}`}
            onClick={() => onNavigate('doctor')}
          >
            Arzt-Bereich
          </button>
        )}

        {user?.role === 'admin' && (
          <>
            <button
              className={`nav-btn ${view === 'doctor' ? 'active' : ''}`}
              onClick={() => onNavigate('doctor')}
            >
              Arzt-Bereich
            </button>
            <button
              className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
              onClick={() => onNavigate('admin')}
            >
              Administration
            </button>
          </>
        )}
      </nav>

      <div className="header-auth">
        {user ? (
          <div className="user-info">
            <span className="user-badge">{user.role === 'admin' ? 'Admin' : 'Arzt'}</span>
            <span className="user-name">{user.fullName || user.username}</span>
            <button className="btn-logout" onClick={logout}>Abmelden</button>
          </div>
        ) : (
          <button className="btn-login" onClick={onLoginClick}>Anmelden</button>
        )}
      </div>
    </header>
  );
}
