const jwt = require('jsonwebtoken');
const db = require('../db');

// Checks the Bearer token and attaches the logged-in user to req.user
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue' });
  }

  let user;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    user = db.read().users.find(u => u.id === payload.id);
  } catch (err) {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }

  if (!user) {
    return res.status(401).json({ error: 'Account not found. Please log in again.' });
  }

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
}

// Only allows admins through. Must be used after authRequired.
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}

module.exports = { authRequired, adminOnly };