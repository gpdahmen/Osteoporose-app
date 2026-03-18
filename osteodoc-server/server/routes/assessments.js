/**
 * OsteoDoc – Befunddaten-API (Assessments)
 * POST /api/assessments              – Neues Assessment anlegen
 * GET  /api/assessments/patient/:id  – Assessments eines Patienten
 * GET  /api/assessments/:id          – Einzelnes Assessment
 */

const express = require('express');
const { pool } = require('../config/database');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const { calculateRisk } = require('../utils/riskCalculator');

const router = express.Router();

// ─── Neues Assessment anlegen ────────────────────────────────
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { patientId, data } = req.body;

    if (!patientId || !data) {
      return res.status(400).json({ error: 'Patient-ID und Befunddaten erforderlich' });
    }

    // Risikoberechnung durchführen
    const riskResult = calculateRisk(data);

    const result = await pool.query(
      `INSERT INTO assessments (patient_id, data, risk_result, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patientId, JSON.stringify(data), JSON.stringify(riskResult), req.user?.id || null]
    );

    if (req.user) {
      await logAudit(req.user.id, 'ASSESSMENT_CREATED', 'assessment', result.rows[0].id,
        { patientId }, req.ip);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Assessment-Erstellfehler:', err);
    res.status(500).json({ error: 'Serverfehler beim Anlegen des Assessments' });
  }
});

// ─── Assessments eines Patienten ─────────────────────────────
router.get('/patient/:patientId', requireAuth, async (req, res) => {
  try {
    const { patientId } = req.params;

    const result = await pool.query(
      `SELECT a.*, u.full_name AS created_by_name
       FROM assessments a
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.patient_id = $1
       ORDER BY a.created_at DESC`,
      [patientId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Einzelnes Assessment ────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.*, p.alias, p.age, p.gender, p.last_name, p.first_name
       FROM assessments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Risikoberechnung (ohne Speichern) ──────────────────────
router.post('/calculate-risk', (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Befunddaten erforderlich' });
    }

    const riskResult = calculateRisk(data);
    res.json(riskResult);
  } catch (err) {
    console.error('Risikoberechnungsfehler:', err);
    res.status(500).json({ error: 'Fehler bei der Risikoberechnung' });
  }
});

module.exports = router;
