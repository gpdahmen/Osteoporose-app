/**
 * OsteoDoc – Laborwerte-API
 * GET  /api/laboratory              – Alle Laborwerte
 * GET  /api/laboratory/categories   – Kategorien
 * PUT  /api/laboratory/:id          – Laborwert bearbeiten (Arzt/Admin)
 */

const express = require('express');
const { pool } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── Alle Laborwerte ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM laboratory_values WHERE is_active = TRUE';
    const params = [];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (parameter_name ILIKE $${params.length + 1} OR clinical_note ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY category, parameter_name';
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
      'SELECT DISTINCT category FROM laboratory_values WHERE is_active = TRUE ORDER BY category'
    );
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Laborwert bearbeiten ────────────────────────────────────
router.put('/:id', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { parameterName, category, unit, referenceMin, referenceMax,
            referenceText, clinicalNote } = req.body;

    const result = await pool.query(
      `UPDATE laboratory_values
       SET parameter_name = COALESCE($1, parameter_name),
           category = COALESCE($2, category),
           unit = COALESCE($3, unit),
           reference_min = COALESCE($4, reference_min),
           reference_max = COALESCE($5, reference_max),
           reference_text = COALESCE($6, reference_text),
           clinical_note = COALESCE($7, clinical_note),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [parameterName, category, unit, referenceMin, referenceMax, referenceText, clinicalNote, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laborwert nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
