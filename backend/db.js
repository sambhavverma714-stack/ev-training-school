const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const COURSES = require('./courseContent');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_FILE = DB_FILE + '.tmp';

// Lab room used for each course when sessions are generated
const LABS = {
  'hv-safety': { labName: 'HV Isolation Lab', location: 'Bay 1 - Training Workshop', capacity: 6, hour: 9 },
  'battery-diagnostics': { labName: 'Battery Diagnostics Lab', location: 'Bay 2 - Battery Station', capacity: 4, hour: 10 },
  'motor-inverter': { labName: 'Motor and Inverter Lab', location: 'Bay 3 - Drive Unit Station', capacity: 5, hour: 11 },
  'charging-systems': { labName: 'EV Charging Lab', location: 'Bay 4 - Charging Station', capacity: 6, hour: 13 },
  'hv-wiring-repair': { labName: 'HV Wiring Repair Lab', location: 'Bay 5 - Harness Workshop', capacity: 4, hour: 9 }
};

// Creates one lab session the given number of days from now
function makeSession(courseId, daysAhead) {
  const lab = LABS[courseId];
  const when = new Date();
  when.setDate(when.getDate() + daysAhead);
  when.setHours(lab.hour, 0, 0, 0);

  return {
    id: 's-' + crypto.randomBytes(3).toString('hex'),
    courseId,
    labName: lab.labName,
    location: lab.location,
    startsAt: when.toISOString(),
    capacity: lab.capacity
  };
}

// Makes sure every course has at least one lab session in the future.
// Returns true if any sessions were added.
function ensureFutureSessions(data) {
  const now = new Date();
  let added = false;

  COURSES.forEach(course => {
    if (!LABS[course.id]) return;
    const hasFuture = data.slots.some(s => s.courseId === course.id && new Date(s.startsAt) > now);
    if (!hasFuture) {
      data.slots.push(makeSession(course.id, 7), makeSession(course.id, 14));
      added = true;
    }
  });

  return added;
}

function buildSeed() {
  return {
    users: [
      {
        id: 'u-admin',
        name: 'Admin',
        email: 'admin@evschool.com',
        passwordHash: bcrypt.hashSync('Admin123!', 10),
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ],
    courses: COURSES,
    progress: [],
    slots: [],
    bookings: [],
    certificates: []
  };
}

// Creates data/db.json on first run. On later runs, refreshes course content
// and lab sessions without deleting any student data.
function init() {
  if (!fs.existsSync(DB_FILE)) {
    const data = buildSeed();
    ensureFutureSessions(data);
    write(data);
    console.log('Created data/db.json with seed data');
    return;
  }

  const data = read();
  data.courses = COURSES; // course content always follows courseContent.js
  const added = ensureFutureSessions(data);
  write(data);
  if (added) console.log('Added lab sessions for the coming weeks');
}

function read() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Writes to a temporary file first, then swaps it in. If the computer stops
// mid-save, the previous db.json is still intact.
function write(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2));
  fs.renameSync(TMP_FILE, DB_FILE);
}

module.exports = { init, read, write };