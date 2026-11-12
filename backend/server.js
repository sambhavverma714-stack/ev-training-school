// Loads the settings first (creates backend/.env on first run)
require('./config');

const express = require('express');
const path = require('path');
const db = require('./db');
const { rateLimit } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const bookingRoutes = require('./routes/bookings');
const certificateRoutes = require('./routes/certificates');

db.init();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// Slow down repeated login and sign-up attempts
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
app.use('/api/auth/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/certificates', certificateRoutes);

// Unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Serve the frontend from ../frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'The request data is not valid JSON' });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error. Please try again.' });
});

const PORT = Number(process.env.PORT) || 5050;

const server = app.listen(PORT, () => {
  console.log(`EV Training School running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Open backend/.env, change PORT to 5051, save, and start again.`);
    process.exit(1);
  }
  throw err;
});