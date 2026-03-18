/**
 * OsteoDoc – Risikofaktoren-API
 * GET  /api/risk-factors       – Alle Risikofaktoren
 * PUT  /api/risk-factors/:id   – Risikofaktor bearbeiten (Arzt/Admin)
 */

const express = require('express');
const { pool } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── Alle Risikofaktoren ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM risk_factors WHERE is_active = TRUE';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY category, name';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Kategorien ──────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM risk_factors WHERE is_active = TRUE ORDER BY category'
    );
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Risikofaktor bearbeiten ─────────────────────────────────
router.put('/:id', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, icd10Code, relativeRisk, description } = req.body;

    const result = await pool.query(
      `UPDATE risk_factors
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           icd10_code = COALESCE($3, icd10_code),
           relative_risk = COALESCE($4, relative_risk),
           description = COALESCE($5, description),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, category, icd10Code, relativeRisk, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Risikofaktor nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
