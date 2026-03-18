/**
 * OsteoDoc – Außenzugriff-Sperre
 * Verhindert, dass das Backend HTTP-Anfragen an externe Server sendet.
 *
 * Diese Middleware überwacht ausgehende Verbindungen nicht direkt,
 * sondern stellt über den HTTP-Client sicher, dass keine externen
 * URLs aufgerufen werden. Wird beim Serverstart einmalig ausgeführt.
 */

const http = require('http');
const https = require('https');
const logger = require('../config/logger');

function blockExternalRequests() {
  const originalHttpRequest = http.request;
  const originalHttpsRequest = https.request;

  function createBlockingWrapper(original, protocol) {
    return function (options, callback) {
      const hostname = typeof options === 'string'
        ? new URL(options).hostname
        : (options.hostname || options.host || 'localhost');

      // Nur lokale Verbindungen erlauben
      const allowedHosts = ['localhost', '127.0.0.1', '::1'];
      if (!allowedHosts.includes(hostname)) {
        const msg = `Blockiert: Ausgehende ${protocol}-Anfrage an ${hostname}`;
        logger.warn(msg);
        const err = new Error(msg);
        if (callback) callback(err);
        // Leeres Request-Objekt mit Error zurückgeben
        const fakeReq = new (require('stream').Writable)();
        fakeReq.end = () => {};
        fakeReq.abort = () => {};
        process.nextTick(() => fakeReq.emit('error', err));
        return fakeReq;
      }

      return original.call(this, options, callback);
    };
  }

  http.request = createBlockingWrapper(originalHttpRequest, 'HTTP');
  https.request = createBlockingWrapper(originalHttpsRequest, 'HTTPS');

  logger.info('Außenzugriff-Sperre aktiviert: Nur lokale Verbindungen erlaubt.');
}

module.exports = { blockExternalRequests };
