const crypto = require('crypto');

// Certificate IDs look like: EVT-2025-A3F9C1
function generateCertId() {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `EVT-${year}-${hex}`;
}

// Signs the key certificate fields with HMAC-SHA256
function signCertificate({ id, userName, courseTitle, issuedAt }) {
  const secret = process.env.CERT_SECRET || 'dev-cert-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(`${id}|${userName}|${courseTitle}|${issuedAt}`)
    .digest('hex');
}

// Checks a certificate's signature has not been tampered with
function verifyCertificateSignature(cert) {
  const expected = signCertificate(cert);
  const a = Buffer.from(expected);
  const b = Buffer.from(cert.signature || '');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Returns a score as a whole-number percentage
function calculateScore(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

module.exports = {
  generateCertId,
  signCertificate,
  verifyCertificateSignature,
  calculateScore
};