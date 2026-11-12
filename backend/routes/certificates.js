const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { verifyCertificateSignature } = require('../utils');

const router = express.Router();

// Only the fields that are safe to show publicly
function certView(cert) {
  return {
    id: cert.id,
    userName: cert.userName,
    courseTitle: cert.courseTitle,
    issuedAt: cert.issuedAt
  };
}

// GET /api/certificates/me
router.get('/me', authRequired, (req, res) => {
  const certificates = db.read().certificates
    .filter(c => c.userId === req.user.id)
    .map(certView);
  res.json({ certificates });
});

// GET /api/certificates/verify/:id  (public)
router.get('/verify/:id', (req, res) => {
  const id = String(req.params.id || '').trim().toUpperCase();
  const cert = db.read().certificates.find(c => c.id === id);

  if (!cert) {
    return res.status(404).json({ valid: false, error: 'No certificate found with this ID' });
  }

  const valid = verifyCertificateSignature(cert);
  res.json({
    valid,
    certificate: certView(cert),
    message: valid
      ? 'This certificate is genuine.'
      : 'The signature does not match. This certificate may have been altered.'
  });
});

module.exports = router;