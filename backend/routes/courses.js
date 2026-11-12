const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { calculateScore, generateCertId, signCertificate } = require('../utils');

const router = express.Router();

function findCourse(data, id) {
  return data.courses.find(c => c.id === id);
}

function findProgress(data, userId, courseId) {
  return data.progress.find(p => p.userId === userId && p.courseId === courseId);
}

function getOrCreateProgress(data, userId, courseId) {
  let record = findProgress(data, userId, courseId);
  if (!record) {
    record = { userId, courseId, completedModules: [], attempts: [], passed: false, passedAt: null };
    data.progress.push(record);
  }
  return record;
}

// Summarises a student's progress for one course
function summariseProgress(course, record) {
  const completed = record
    ? record.completedModules.filter(id => course.modules.some(m => m.id === id)).length
    : 0;
  const total = course.modules.length;
  const bestScore = record && record.attempts.length
    ? Math.max(...record.attempts.map(a => a.score))
    : null;

  return {
    completedModules: completed,
    totalModules: total,
    completedModuleIds: record ? record.completedModules : [],
    assessmentUnlocked: total > 0 && completed === total,
    attempts: record ? record.attempts.length : 0,
    bestScore,
    passed: record ? record.passed : false
  };
}

// Creates a signed certificate for a student who has passed
function issueCertificate(data, user, course) {
  let id;
  do {
    id = generateCertId();
  } while (data.certificates.some(c => c.id === id));

  const cert = {
    id,
    userId: user.id,
    userName: user.name,
    courseId: course.id,
    courseTitle: course.title,
    issuedAt: new Date().toISOString()
  };
  cert.signature = signCertificate(cert);

  data.certificates.push(cert);
  return cert;
}

// GET /api/courses  (public catalogue)
router.get('/', (req, res) => {
  const courses = db.read().courses.map(c => ({
    id: c.id,
    title: c.title,
    level: c.level,
    hours: c.hours,
    passingScore: c.passingScore,
    description: c.description,
    moduleCount: c.modules.length
  }));
  res.json({ courses });
});

// GET /api/courses/my/progress
// Defined before /:id so "my" is not treated as a course id
router.get('/my/progress', authRequired, (req, res) => {
  const data = db.read();
  const progress = data.courses.map(course => ({
    courseId: course.id,
    title: course.title,
    ...summariseProgress(course, findProgress(data, req.user.id, course.id))
  }));
  res.json({ progress });
});

// GET /api/courses/:id
router.get('/:id', authRequired, (req, res) => {
  const data = db.read();
  const course = findCourse(data, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json({
    course: {
      id: course.id,
      title: course.title,
      level: course.level,
      hours: course.hours,
      passingScore: course.passingScore,
      description: course.description,
      modules: course.modules.map(m => ({ id: m.id, title: m.title, content: m.content })),
      questionCount: course.assessment.length
    },
    progress: summariseProgress(course, findProgress(data, req.user.id, course.id))
  });
});

// POST /api/courses/:id/modules/:moduleId/complete
router.post('/:id/modules/:moduleId/complete', authRequired, (req, res) => {
  const data = db.read();
  const course = findCourse(data, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  if (!course.modules.some(m => m.id === req.params.moduleId)) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const record = getOrCreateProgress(data, req.user.id, course.id);
  if (!record.completedModules.includes(req.params.moduleId)) {
    record.completedModules.push(req.params.moduleId);
  }
  db.write(data);

  res.json({ progress: summariseProgress(course, record) });
});

// GET /api/courses/:id/assessment
// Returns questions without the correct answers
router.get('/:id/assessment', authRequired, (req, res) => {
  const data = db.read();
  const course = findCourse(data, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const progress = summariseProgress(course, findProgress(data, req.user.id, course.id));
  if (!progress.assessmentUnlocked) {
    return res.status(403).json({ error: 'Complete all modules to unlock the assessment', progress });
  }

  res.json({
    passingScore: course.passingScore,
    questions: course.assessment.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  });
});

// POST /api/courses/:id/assessment
// Body: { "answers": { "hv-q1": 2, "hv-q2": 1, ... } }
// Each value is the index of the chosen option.
router.post('/:id/assessment', authRequired, (req, res) => {
  const data = db.read();
  const course = findCourse(data, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const existing = findProgress(data, req.user.id, course.id);
  if (!summariseProgress(course, existing).assessmentUnlocked) {
    return res.status(403).json({ error: 'Complete all modules to unlock the assessment' });
  }

  const answers = req.body.answers || {};
  let correct = 0;

  const review = course.assessment.map(q => {
    const selected = Number.isInteger(answers[q.id]) ? answers[q.id] : null;
    const isCorrect = selected === q.answer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      selected,
      correctAnswer: q.answer,
      correct: isCorrect
    };
  });

  const total = course.assessment.length;
  const score = calculateScore(correct, total);
  const passed = score >= course.passingScore;

  const record = getOrCreateProgress(data, req.user.id, course.id);
  record.attempts.push({
    score,
    correct,
    total,
    passed,
    submittedAt: new Date().toISOString()
  });

  let certificateId = null;
  if (passed) {
    record.passed = true;
    record.passedAt = record.passedAt || new Date().toISOString();

    const alreadyIssued = data.certificates.find(
      c => c.userId === req.user.id && c.courseId === course.id
    );
    certificateId = alreadyIssued
      ? alreadyIssued.id
      : issueCertificate(data, req.user, course).id;
  }

  db.write(data);

  res.json({
    score,
    correct,
    total,
    passed,
    passingScore: course.passingScore,
    certificateId,
    review
  });
});

module.exports = router;