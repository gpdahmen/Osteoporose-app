/**
 * OsteoDoc – Haupt-Einstiegspunkt
 * Serverbasierte Webanwendung zur Osteoporose-Bewertung (DVO 2023)
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const assessmentRoutes = require('./routes/assessments');
const adminRoutes = require('./routes/admin');
const riskFactorRoutes = require('./routes/riskFactors');
const therapyRoutes = require('./routes/therapies');
const laboratoryRoutes = require('./routes/laboratory');

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

// ============================================================
// Sicherheits-Middleware
// ============================================================

// Helmet mit Content Security Policy (keine externen Ressourcen)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS nur für gleiche Herkunft
app.use(cors({ origin: false }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 200,
  message: { error: 'Zu viele Anfragen. Bitte warten.' },
});
app.use('/api/', limiter);

// Strengeres Limit für Login-Versuche
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Zu viele Login-Versuche. Bitte warten.' },
});
app.use('/api/auth/login', loginLimiter);

// ============================================================
// Body Parser
// ============================================================
app.use(express.json({ limit: '1mb' }));

// ============================================================
// Request-Logging
// ============================================================
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// ============================================================
// API-Routen
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/risk-factors', riskFactorRoutes);
app.use('/api/therapies', therapyRoutes);
app.use('/api/laboratory', laboratoryRoutes);

// ============================================================
// Statische Dateien (gebündeltes React-Frontend)
// ============================================================
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// SPA-Fallback: alle nicht-API-Routen → index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route nicht gefunden' });
  }
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// ============================================================
// Fehlerbehandlung
// ============================================================
app.use((err, req, res, _next) => {
  logger.error('Serverfehler:', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// ============================================================
// Server starten
// ============================================================
app.listen(PORT, '127.0.0.1', () => {
  logger.info(`OsteoDoc-Server gestartet auf Port ${PORT}`);
  console.log(`OsteoDoc läuft auf http://127.0.0.1:${PORT}`);
});

module.exports = app;
