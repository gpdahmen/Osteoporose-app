/**
 * OsteoDoc – Authentifizierungs-Routen
 * POST /api/auth/login   – Anmeldung
 * POST /api/auth/logout  – Abmeldung (clientseitig)
 * GET  /api/auth/me       – Aktueller Benutzer
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// ─── Login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
    }

    const result = await pool.query(
      'SELECT id, username, password, role, full_name, is_active FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Benutzerkonto gesperrt' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await logAudit(null, 'LOGIN_FAILED', 'user', user.id, { username }, req.ip);
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Token erstellen
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Last login aktualisieren
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    await logAudit(user.id, 'LOGIN', 'user', user.id, null, req.ip);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
      },
    });
  } catch (err) {
    console.error('Login-Fehler:', err);
    res.status(500).json({ error: 'Serverfehler bei der Anmeldung' });
  }
});

// ─── Aktueller Benutzer ──────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, full_name, last_login FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.full_name,
      lastLogin: user.last_login,
    });
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Passwort ändern ─────────────────────────────────────────
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Aktuelles und neues Passwort erforderlich' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Neues Passwort muss mindestens 8 Zeichen lang sein' });
    }

    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Aktuelles Passwort ist falsch' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
    await logAudit(req.user.id, 'PASSWORD_CHANGED', 'user', req.user.id, null, req.ip);

    res.json({ message: 'Passwort erfolgreich geändert' });
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
