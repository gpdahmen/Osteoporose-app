/**
 * OsteoDoc – Datenbank-Konfiguration (PostgreSQL)
 */

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'osteodoc',
  user:     process.env.DB_USER || 'osteodoc',
  password: process.env.DB_PASSWORD || '',
  max:      20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unerwarteter Datenbankfehler:', err.message);
});

module.exports = { pool };
