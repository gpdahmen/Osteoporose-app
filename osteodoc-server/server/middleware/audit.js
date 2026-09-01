/**
 * OsteoDoc – Audit-Logging-Middleware
 * Protokolliert sicherheitsrelevante Aktionen in der Datenbank.
 */

const { pool } = require('../config/database');
const logger = require('../config/logger');

async function logAudit(userId, action, entityType, entityId, details, ipAddress) {
  try {
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ipAddress]
    );
  } catch (err) {
    logger.error('Audit-Log-Fehler:', { error: err.message });
  }
}

module.exports = { logAudit };
