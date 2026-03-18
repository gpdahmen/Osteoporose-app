/**
 * OsteoDoc – Patientendaten-API
 * POST   /api/patients          – Patient anlegen
 * GET    /api/patients           – Patientenliste (nur für Arzt/Admin)
 * GET    /api/patients/:id       – Einzelner Patient
 * PUT    /api/patients/:id       – Patient aktualisieren
 * DELETE /api/patients/:id       – Patient löschen
 */

const express = require('express');
const { pool } = require('../config/database');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// ─── Patient anlegen ─────────────────────────────────────────
// Anonymer Modus: ohne Login, nur Alter und Geschlecht
// Arzt-Modus: mit Login, vollständige Patientendaten
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { alias, age, gender, lastName, firstName, birthDate } = req.body;
    const isAnonymous = !req.user || req.user.role === 'mfa';

    if (isAnonymous) {
      // Anonymmodus: nur Alter erforderlich
      if (!age) {
        return res.status(400).json({ error: 'Alter ist erforderlich' });
      }

      const result = await pool.query(
        `INSERT INTO patients (alias, age, gender, is_anonymous, created_by)
         VALUES ($1, $2, $3, TRUE, $4)
         RETURNING id, alias, age, gender, is_anonymous, created_at`,
        [alias || null, age, gender || null, req.user?.id || null]
      );

      return res.status(201).json(result.rows[0]);
    }

    // Arzt-Modus: vollständige Daten
    const result = await pool.query(
      `INSERT INTO patients (alias, age, gender, last_name, first_name, birth_date, is_anonymous, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, $7)
       RETURNING *`,
      [alias || null, age, gender || null, lastName || null, firstName || null, birthDate || null, req.user.id]
    );

    await logAudit(req.user.id, 'PATIENT_CREATED', 'patient', result.rows[0].id, null, req.ip);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Patient-Erstellfehler:', err);
    res.status(500).json({ error: 'Serverfehler beim Anlegen des Patienten' });
  }
});

// ─── Patientenliste (nur Arzt/Admin) ─────────────────────────
router.get('/', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { search, sort = 'created_at', order = 'DESC', limit = 50, offset = 0 } = req.query;

    const allowedSorts = ['last_name', 'first_name', 'birth_date', 'created_at', 'age'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let query = `SELECT id, alias, age, gender, last_name, first_name, birth_date,
                        is_anonymous, created_at
                 FROM patients`;
    const params = [];

    // Nur eigene Patienten, außer Admin
    if (req.user.role === 'arzt') {
      query += ' WHERE created_by = $1';
      params.push(req.user.id);
    }

    // Suche
    if (search) {
      const searchParam = `%${search}%`;
      const whereOrAnd = params.length > 0 ? 'AND' : 'WHERE';
      query += ` ${whereOrAnd} (last_name ILIKE $${params.length + 1}
                 OR first_name ILIKE $${params.length + 1}
                 OR alias ILIKE $${params.length + 1})`;
      params.push(searchParam);
    }

    query += ` ORDER BY ${sortCol} ${sortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Gesamtanzahl für Pagination
    let countQuery = 'SELECT COUNT(*) FROM patients';
    const countParams = [];
    if (req.user.role === 'arzt') {
      countQuery += ' WHERE created_by = $1';
      countParams.push(req.user.id);
    }
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      patients: result.rows,
      total: parseInt(countResult.rows[0].count),
    });
  } catch (err) {
    console.error('Patientenliste-Fehler:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Einzelner Patient ───────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    let query = 'SELECT * FROM patients WHERE id = $1';
    const params = [id];

    // Ärzte nur eigene Patienten
    if (req.user.role === 'arzt') {
      query += ' AND created_by = $2';
      params.push(req.user.id);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Patient aktualisieren ───────────────────────────────────
router.put('/:id', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { alias, age, gender, lastName, firstName, birthDate } = req.body;

    const result = await pool.query(
      `UPDATE patients
       SET alias = COALESCE($1, alias),
           age = COALESCE($2, age),
           gender = COALESCE($3, gender),
           last_name = COALESCE($4, last_name),
           first_name = COALESCE($5, first_name),
           birth_date = COALESCE($6, birth_date),
           updated_at = NOW()
       WHERE id = $7 ${req.user.role === 'arzt' ? 'AND created_by = $8' : ''}
       RETURNING *`,
      req.user.role === 'arzt'
        ? [alias, age, gender, lastName, firstName, birthDate, id, req.user.id]
        : [alias, age, gender, lastName, firstName, birthDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient nicht gefunden' });
    }

    await logAudit(req.user.id, 'PATIENT_UPDATED', 'patient', parseInt(id), null, req.ip);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Patient löschen ─────────────────────────────────────────
router.delete('/:id', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM patients WHERE id = $1 ${req.user.role === 'arzt' ? 'AND created_by = $2' : ''} RETURNING id`,
      req.user.role === 'arzt' ? [id, req.user.id] : [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient nicht gefunden' });
    }

    await logAudit(req.user.id, 'PATIENT_DELETED', 'patient', parseInt(id), null, req.ip);
    res.json({ message: 'Patient gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
