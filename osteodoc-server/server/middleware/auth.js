/**
 * OsteoDoc – JWT-Authentifizierungs-Middleware
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Pflicht-Authentifizierung: Anfrage wird abgelehnt ohne gültigen Token.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentifizierung erforderlich' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token' });
  }
}

/**
 * Optionale Authentifizierung: Token wird geprüft, falls vorhanden.
 * Anonyme Nutzer können fortfahren.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

/**
 * Rollenbasierte Zugriffskontrolle.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentifizierung erforderlich' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Keine Berechtigung für diese Aktion' });
    }
    next();
  };
}

module.exports = { requireAuth, optionalAuth, requireRole, JWT_SECRET };
