/**
 * OsteoDoc – Datenbank-Initialisierung
 * Erstellt Tabellen und legt den Admin-Benutzer an.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function initDatabase() {
  const client = await pool.connect();

  try {
    // Schema laden und ausführen
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Erstelle Datenbankschema...');
    await client.query(schema);
    console.log('Schema erfolgreich erstellt.');

    // Admin-Benutzer anlegen (falls noch nicht vorhanden)
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';

    const existing = await client.query(
      'SELECT id FROM users WHERE username = $1',
      [adminUser]
    );

    if (existing.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPass, 12);
      await client.query(
        `INSERT INTO users (username, password, role, full_name)
         VALUES ($1, $2, 'admin', 'Administrator')`,
        [adminUser, hashedPassword]
      );
      console.log(`Admin-Benutzer "${adminUser}" erstellt.`);
    } else {
      console.log('Admin-Benutzer existiert bereits.');
    }

    // Standard-Risikofaktoren einfügen (falls leer)
    const rfCount = await client.query('SELECT COUNT(*) FROM risk_factors');
    if (parseInt(rfCount.rows[0].count) === 0) {
      const seedPath = path.join(__dirname, 'seed-risk-factors.sql');
      if (fs.existsSync(seedPath)) {
        const seed = fs.readFileSync(seedPath, 'utf8');
        await client.query(seed);
        console.log('Risikofaktoren-Daten eingefügt.');
      }
    }

    console.log('Datenbank-Initialisierung abgeschlossen.');
  } catch (err) {
    console.error('Fehler bei der DB-Initialisierung:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
