const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

function slotView(data, slot, userId) {
  const course = data.courses.find(c => c.id === slot.courseId);
  const booked = data.bookings.filter(b => b.slotId === slot.id).length;

  return {
    id: slot.id,
    courseId: slot.courseId,
    courseTitle: course ? course.title : 'Unknown course',
    labName: slot.labName,
    location: slot.location,
    startsAt: slot.startsAt,
    capacity: slot.capacity,
    spotsLeft: Math.max(slot.capacity - booked, 0),
    started: new Date(slot.startsAt) <= new Date(),
    bookedByMe: data.bookings.some(b => b.slotId === slot.id && b.userId === userId)
  };
}

function bookingView(data, booking) {
  const slot = data.slots.find(s => s.id === booking.slotId);
  const course = slot ? data.courses.find(c => c.id === slot.courseId) : null;

  return {
    id: booking.id,
    slotId: booking.slotId,
    courseTitle: course ? course.title : 'Unknown course',
    labName: slot ? slot.labName : 'Unknown lab',
    location: slot ? slot.location : '',
    startsAt: slot ? slot.startsAt : null,
    started: slot ? new Date(slot.startsAt) <= new Date() : false,
    createdAt: booking.createdAt
  };
}

// GET /api/bookings/slots
router.get('/slots', authRequired, (req, res) => {
  const data = db.read();
  const slots = [...data.slots]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map(slot => slotView(data, slot, req.user.id));
  res.json({ slots });
});

// POST /api/bookings/slots  (admin only)
router.post('/slots', authRequired, adminOnly, (req, res) => {
  const data = db.read();
  const courseId = String(req.body.courseId || '');
  const labName = String(req.body.labName || '').trim();
  const location = String(req.body.location || '').trim();
  const capacity = Number(req.body.capacity);
  const when = new Date(req.body.startsAt);

  if (!data.courses.some(c => c.id === courseId)) {
    return res.status(400).json({ error: 'Choose a valid course' });
  }
  if (!labName || !location) {
    return res.status(400).json({ error: 'Lab name and location are required' });
  }
  if (isNaN(when)) {
    return res.status(400).json({ error: 'Enter a valid start date and time' });
  }
  if (when <= new Date()) {
    return res.status(400).json({ error: 'The start time must be in the future' });
  }
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
    return res.status(400).json({ error: 'Capacity must be a whole number from 1 to 100' });
  }

  const slot = {
    id: 's-' + crypto.randomBytes(3).toString('hex'),
    courseId,
    labName,
    location,
    startsAt: when.toISOString(),
    capacity
  };

  data.slots.push(slot);
  db.write(data);

  res.status(201).json({ slot: slotView(data, slot, req.user.id) });
});

// POST /api/bookings   Body: { "slotId": "s-1" }
router.post('/', authRequired, (req, res) => {
  const data = db.read();
  const slot = data.slots.find(s => s.id === req.body.slotId);

  if (!slot) {
    return res.status(404).json({ error: 'Lab session not found' });
  }
  if (new Date(slot.startsAt) <= new Date()) {
    return res.status(400).json({ error: 'This session has already started' });
  }
  if (data.bookings.some(b => b.slotId === slot.id && b.userId === req.user.id)) {
    return res.status(409).json({ error: 'You have already booked this session' });
  }
  const taken = data.bookings.filter(b => b.slotId === slot.id).length;
  if (taken >= slot.capacity) {
    return res.status(409).json({ error: 'This session is fully booked' });
  }

  const booking = {
    id: 'b-' + crypto.randomBytes(4).toString('hex'),
    slotId: slot.id,
    userId: req.user.id,
    createdAt: new Date().toISOString()
  };

  data.bookings.push(booking);
  db.write(data);

  res.status(201).json({ booking: bookingView(data, booking) });
});

// GET /api/bookings/me
router.get('/me', authRequired, (req, res) => {
  const data = db.read();
  const bookings = data.bookings
    .filter(b => b.userId === req.user.id)
    .map(b => bookingView(data, b))
    .sort((a, b) => (a.startsAt || '').localeCompare(b.startsAt || ''));
  res.json({ bookings });
});

// GET /api/bookings/admin/all  (admin only)
router.get('/admin/all', authRequired, adminOnly, (req, res) => {
  const data = db.read();
  const bookings = data.bookings
    .map(b => {
      const user = data.users.find(u => u.id === b.userId);
      return {
        ...bookingView(data, b),
        studentName: user ? user.name : 'Unknown',
        studentEmail: user ? user.email : ''
      };
    })
    .sort((a, b) => (a.startsAt || '').localeCompare(b.startsAt || ''));
  res.json({ bookings });
});

// DELETE /api/bookings/slots/:id  (admin only)
// Removes a lab session and cancels any bookings for it.
router.delete('/slots/:id', authRequired, adminOnly, (req, res) => {
  const data = db.read();
  const slot = data.slots.find(s => s.id === req.params.id);

  if (!slot) {
    return res.status(404).json({ error: 'Lab session not found' });
  }

  const removedBookings = data.bookings.filter(b => b.slotId === slot.id).length;
  data.bookings = data.bookings.filter(b => b.slotId !== slot.id);
  data.slots = data.slots.filter(s => s.id !== slot.id);
  db.write(data);

  res.json({ message: 'Lab session deleted', removedBookings });
});

// DELETE /api/bookings/:id
// Students can cancel their own booking before the session starts.
// Admins can cancel any booking.
router.delete('/:id', authRequired, (req, res) => {
  const data = db.read();
  const booking = data.bookings.find(b => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const isAdmin = req.user.role === 'admin';
  if (booking.userId !== req.user.id && !isAdmin) {
    return res.status(403).json({ error: 'You can only cancel your own bookings' });
  }

  const slot = data.slots.find(s => s.id === booking.slotId);
  if (!isAdmin && slot && new Date(slot.startsAt) <= new Date()) {
    return res.status(400).json({ error: 'This session has already started and cannot be cancelled' });
  }

  data.bookings = data.bookings.filter(b => b.id !== booking.id);
  db.write(data);

  res.json({ message: 'Booking cancelled' });
});

module.exports = router;