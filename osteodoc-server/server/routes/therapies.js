/**
 * OsteoDoc – Therapie-Datenbank-API
 * GET  /api/therapies       – Alle Therapien
 * PUT  /api/therapies/:id   – Therapie bearbeiten (Arzt/Admin)
 */

const express = require('express');
const { pool } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── Alle Therapien ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { gruppe } = req.query;
    let query = 'SELECT * FROM therapies WHERE is_active = TRUE';
    const params = [];

    if (gruppe) {
      query += ' AND gruppe = $1';
      params.push(gruppe);
    }

    query += ' ORDER BY wirkstoff';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ─── Therapie bearbeiten ─────────────────────────────────────
router.put('/:id', requireAuth, requireRole('arzt', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { wirkstoff, handelsnamen, gruppe, indikation, dosierung,
            zulassungstext, nebenwirkungen, kontraindikationen, monitoring } = req.body;

    const result = await pool.query(
      `UPDATE therapies
       SET wirkstoff = COALESCE($1, wirkstoff),
           handelsnamen = COALESCE($2, handelsnamen),
           gruppe = COALESCE($3, gruppe),
           indikation = COALESCE($4, indikation),
           dosierung = COALESCE($5, dosierung),
           zulassungstext = COALESCE($6, zulassungstext),
           nebenwirkungen = COALESCE($7, nebenwirkungen),
           kontraindikationen = COALESCE($8, kontraindikationen),
           monitoring = COALESCE($9, monitoring),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [wirkstoff, handelsnamen, gruppe, indikation, dosierung,
       zulassungstext, nebenwirkungen, kontraindikationen, monitoring, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Therapie nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
