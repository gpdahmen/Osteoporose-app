import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function AdminPanel() {
  const [tab, setTab] = useState('users'); // users | auditLog | stats
  const [users, setUsers] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Neuer Benutzer
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'arzt', fullName: '' });

  useEffect(() => {
    if (tab === 'users') loadUsers();
    if (tab === 'auditLog') loadAuditLog();
    if (tab === 'stats') loadStats();
  }, [tab]);

  const loadUsers = async () => {
    try {
      const result = await api.getUsers();
      setUsers(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadAuditLog = async () => {
    try {
      const result = await api.getAuditLog({ limit: 100 });
      setAuditLog(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadStats = async () => {
    try {
      const result = await api.getStats();
      setStats(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createUser(newUser);
      setNewUser({ username: '', password: '', role: 'arzt', fullName: '' });
      setShowCreateUser(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.updateUser(user.id, { isActive: !user.is_active });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Benutzer "${user.username}" wirklich löschen?`)) return;
    try {
      await api.deleteUser(user.id);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="tab-bar">
        <button className={`tab ${tab === 'users' ? 'active' : ''}`}
                onClick={() => setTab('users')}>Benutzerverwaltung</button>
        <button className={`tab ${tab === 'auditLog' ? 'active' : ''}`}
                onClick={() => setTab('auditLog')}>Audit-Log</button>
        <button className={`tab ${tab === 'stats' ? 'active' : ''}`}
                onClick={() => setTab('stats')}>Systemstatus</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ─── Benutzerverwaltung ─────────────────── */}
      {tab === 'users' && (
        <section className="card">
          <div className="section-header">
            <h3>Benutzer</h3>
            <button className="btn-primary" onClick={() => setShowCreateUser(!showCreateUser)}>
              {showCreateUser ? 'Abbrechen' : 'Neuer Benutzer'}
            </button>
          </div>

          {showCreateUser && (
            <form onSubmit={handleCreateUser} className="create-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Benutzername</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Passwort (min. 8 Zeichen)</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    minLength={8}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rolle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="arzt">Arzt</option>
                    <option value="mfa">MFA</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vollständiger Name</label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Anlegen</button>
            </form>
          )}

          <table className="data-table">
            <thead>
              <tr>
                <th>Benutzername</th>
                <th>Name</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Letzter Login</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={!u.is_active ? 'inactive-row' : ''}>
                  <td>{u.username}</td>
                  <td>{u.full_name || '–'}</td>
                  <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  <td>{u.is_active ? 'Aktiv' : 'Gesperrt'}</td>
                  <td>{u.last_login ? new Date(u.last_login).toLocaleString('de-DE') : '–'}</td>
                  <td>
                    <button className="btn-small" onClick={() => handleToggleActive(u)}>
                      {u.is_active ? 'Sperren' : 'Aktivieren'}
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDeleteUser(u)}>
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ─── Audit-Log ──────────────────────────── */}
      {tab === 'auditLog' && (
        <section className="card">
          <h3>Audit-Log (letzte 100 Einträge)</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zeitpunkt</th>
                <th>Benutzer</th>
                <th>Aktion</th>
                <th>Entität</th>
                <th>IP-Adresse</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.created_at).toLocaleString('de-DE')}</td>
                  <td>{entry.username || '–'}</td>
                  <td>{entry.action}</td>
                  <td>{entry.entity_type ? `${entry.entity_type} #${entry.entity_id}` : '–'}</td>
                  <td>{entry.ip_address || '–'}</td>
                </tr>
              ))}
              {auditLog.length === 0 && (
                <tr><td colSpan={5} className="empty">Keine Einträge</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* ─── Systemstatus ───────────────────────── */}
      {tab === 'stats' && stats && (
        <section className="card">
          <h3>Systemstatus</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.activeUsers}</span>
              <span className="stat-label">Aktive Benutzer</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalPatients}</span>
              <span className="stat-label">Patienten gesamt</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalAssessments}</span>
              <span className="stat-label">Assessments gesamt</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
