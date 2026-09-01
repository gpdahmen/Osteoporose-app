/**
 * OsteoDoc – Admin-Verwaltungs-Routen
 * GET    /api/admin/users       – Alle Benutzer
 * POST   /api/admin/users       – Benutzer anlegen
 * PUT    /api/admin/users/:id   – Benutzer bearbeiten
 * DELETE /api/admin/users/:id   – Benutzer löschen
 * GET    /api/admin/audit-log   – Audit-Log
 * GET    /api/admin/stats       – Systemstatistiken
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// Alle Admin-Routen erfordern Admin-Rolle
router.use(requireAuth, requireRole('admin'));

// ─── Alle Benutzer ───────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, full_name, is_active, created_at, last_login FROM users ORDER BY created_at'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Benutzer anlegen ────────────────────────────────────────
router.post('/users', async (req, res) => {
  try {
    const { username, password, role, fullName } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Benutzername, Passwort und Rolle erforderlich' });
    }

    if (!['admin', 'arzt', 'mfa'].includes(role)) {
      return res.status(400).json({ error: 'Ungültige Rolle. Erlaubt: admin, arzt, mfa' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' });
    }

    // Prüfe ob Benutzername existiert
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Benutzername bereits vergeben' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (username, password, role, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, role, full_name, is_active, created_at`,
      [username, hashedPassword, role, fullName || null]
    );

    await logAudit(req.user.id, 'USER_CREATED', 'user', result.rows[0].id,
      { username, role }, req.ip);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Benutzer-Erstellfehler:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Benutzer bearbeiten ─────────────────────────────────────
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, fullName, isActive, password } = req.body;

    // Admin kann sich nicht selbst deaktivieren
    if (parseInt(id) === req.user.id && isActive === false) {
      return res.status(400).json({ error: 'Sie können sich nicht selbst deaktivieren' });
    }

    let query = `UPDATE users SET
      role = COALESCE($1, role),
      full_name = COALESCE($2, full_name),
      is_active = COALESCE($3, is_active)`;
    const params = [role, fullName, isActive];

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      query += `, password = $${params.length + 1}`;
      params.push(hashedPassword);
    }

    query += ` WHERE id = $${params.length + 1} RETURNING id, username, role, full_name, is_active`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    await logAudit(req.user.id, 'USER_UPDATED', 'user', parseInt(id), { role, isActive }, req.ip);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Benutzer löschen ────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Sie können sich nicht selbst löschen' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    await logAudit(req.user.id, 'USER_DELETED', 'user', parseInt(id), null, req.ip);
    res.json({ message: 'Benutzer gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Audit-Log ───────────────────────────────────────────────
router.get('/audit-log', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT al.*, u.username
       FROM audit_log al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Systemstatistiken ───────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, patients, assessments] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_active = TRUE'),
      pool.query('SELECT COUNT(*) FROM patients'),
      pool.query('SELECT COUNT(*) FROM assessments'),
    ]);

    res.json({
      activeUsers: parseInt(users.rows[0].count),
      totalPatients: parseInt(patients.rows[0].count),
      totalAssessments: parseInt(assessments.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
