// Course page: modules, lessons, and the graded assessment

let courseId = null;
let course = null;
let progress = null;
let currentView = { type: 'module', index: 0 };

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;

  courseId = new URLSearchParams(window.location.search).get('id');
  if (!courseId) {
    document.getElementById('courseMain').innerHTML =
      '<div class="alert alert-error">No course selected. Go back to the catalogue and choose a course.</div>';
    return;
  }

  document.getElementById('moduleList').addEventListener('click', onModuleListClick);
  document.getElementById('courseMain').addEventListener('click', onMainClick);

  loadCourse();
});

async function loadCourse() {
  try {
    const data = await api(`/courses/${encodeURIComponent(courseId)}`);
    course = data.course;
    progress = data.progress;
    document.title = `${course.title} · EV Training School`;

    // Open the first unfinished module, or the assessment if all are done
    const firstOpen = course.modules.findIndex(m => !progress.completedModuleIds.includes(m.id));
    if (firstOpen === -1) {
      showAssessment();
    } else {
      showModule(firstOpen);
    }
  } catch (err) {
    document.getElementById('courseMain').innerHTML =
      `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

// Reloads progress from the server and redraws the sidebar only
async function refreshProgress() {
  const data = await api(`/courses/${encodeURIComponent(courseId)}`);
  progress = data.progress;
  renderSidebar();
}

// ---------- Sidebar ----------
function renderSidebar() {
  const moduleButtons = course.modules.map((m, i) => {
    const done = progress.completedModuleIds.includes(m.id);
    const active = currentView.type === 'module' && currentView.index === i;
    return `
      <button class="module-item ${active ? 'active' : ''}" data-module="${i}" type="button">
        <span>${i + 1}. ${escapeHtml(m.title)}</span>
        ${done ? '<span class="done-tick">✓</span>' : ''}
      </button>
    `;
  }).join('');

  const locked = !progress.assessmentUnlocked;
  const assessmentActive = currentView.type === 'assessment' || currentView.type === 'result';
  const assessmentStatus = progress.passed ? '<span class="done-tick">✓</span>' : (locked ? '🔒' : '');

  document.getElementById('moduleList').innerHTML = `
    <div class="hint">Modules</div>
    ${moduleButtons}
    <div class="hint">Assessment</div>
    <button class="module-item ${assessmentActive ? 'active' : ''}" data-view="assessment" type="button" ${locked ? 'disabled' : ''}>
      <span>Final assessment</span>
      ${assessmentStatus}
    </button>
  `;
}

function onModuleListClick(event) {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;

  if (button.dataset.module !== undefined) {
    showModule(Number(button.dataset.module));
  }
  if (button.dataset.view === 'assessment') {
    showAssessment();
  }
}

// ---------- Buttons inside the main area ----------
function onMainClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  switch (button.dataset.action) {
    case 'prev':
      showModule(currentView.index - 1);
      break;
    case 'next':
      showModule(currentView.index + 1);
      break;
    case 'complete':
      completeModule(button);
      break;
    case 'assessment':
    case 'retake':
      showAssessment();
      break;
    case 'modules':
      showModule(0);
      break;
  }
}

// ---------- Lessons ----------
function showModule(index) {
  currentView = { type: 'module', index };
  renderSidebar();

  const m = course.modules[index];
  const total = course.modules.length;
  const isLast = index === total - 1;
  const done = progress.completedModuleIds.includes(m.id);

  const prevButton = index > 0
    ? '<button class="btn btn-outline" data-action="prev" type="button">← Previous</button>'
    : '<span></span>';

  const completeButton = done
    ? '<span class="badge badge-success">Completed</span>'
    : '<button class="btn btn-primary" data-action="complete" type="button">Mark as complete</button>';

  const nextButton = isLast
    ? '<button class="btn btn-outline" data-action="assessment" type="button">Go to assessment →</button>'
    : '<button class="btn btn-outline" data-action="next" type="button">Next →</button>';

  document.getElementById('courseMain').innerHTML = `
    <article class="lesson">
      <p class="muted">${escapeHtml(course.title)} · Module ${index + 1} of ${total}</p>
      <h2>${escapeHtml(m.title)}</h2>
      <div class="hv-note">Safety first: treat every high-voltage component as live until you have verified it is dead with a rated meter.</div>
      ${m.content.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      <div class="lesson-actions">
        ${prevButton}
        <div class="hero-actions">
          ${completeButton}
          ${nextButton}
        </div>
      </div>
    </article>
  `;
}

async function completeModule(button) {
  const moduleId = course.modules[currentView.index].id;
  clearAlert('pageAlert');

  try {
    const data = await withBusy(button, 'Saving...', () =>
      api(`/courses/${encodeURIComponent(courseId)}/modules/${moduleId}/complete`, { method: 'POST' })
    );
    progress = data.progress;

    if (currentView.index < course.modules.length - 1) {
      showModule(currentView.index + 1);
    } else {
      showAssessment();
    }
  } catch (err) {
    showAlert('pageAlert', err.message);
  }
}

// ---------- Assessment ----------
async function showAssessment() {
  currentView = { type: 'assessment' };
  renderSidebar();
  const main = document.getElementById('courseMain');

  if (!progress.assessmentUnlocked) {
    main.innerHTML = `
      <article class="lesson">
        <h2>Final assessment is locked</h2>
        <p class="muted">Complete all ${course.modules.length} modules to unlock the assessment.</p>
        <div class="lesson-actions">
          <button class="btn btn-primary" data-action="modules" type="button">Back to modules</button>
        </div>
      </article>
    `;
    return;
  }

  main.innerHTML = '<p class="muted">Loading assessment...</p>';

  try {
    const data = await api(`/courses/${encodeURIComponent(courseId)}/assessment`);
    renderQuiz(data);
  } catch (err) {
    main.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

function renderQuiz(data) {
  const total = data.questions.length;

  const questionsHtml = data.questions.map((q, qi) => `
    <div class="quiz-question">
      <h3>${qi + 1}. ${escapeHtml(q.question)}</h3>
      ${q.options.map((option, oi) => `
        <label class="option">
          <input type="radio" name="${escapeHtml(q.id)}" value="${oi}">
          <span>${escapeHtml(option)}</span>
        </label>
      `).join('')}
    </div>
  `).join('');

  document.getElementById('courseMain').innerHTML = `
    <article class="lesson">
      <h2>Final assessment</h2>
      <p class="muted">Answer all ${total} questions. You need ${data.passingScore}% to pass and earn your certificate.</p>
      <form id="quizForm">
        ${questionsHtml}
        <div class="lesson-actions">
          <span class="muted">Answered <span id="answeredCount">0</span> of ${total}</span>
          <button class="btn btn-primary" type="submit">Submit assessment</button>
        </div>
      </form>
    </article>
  `;

  const form = document.getElementById('quizForm');
  form.addEventListener('change', () => updateAnswered(form));
  form.addEventListener('submit', (event) => submitQuiz(event, data.questions));
}

// Updates the answered counter and highlights the chosen option
function updateAnswered(form) {
  let count = 0;
  form.querySelectorAll('.quiz-question').forEach(question => {
    if (question.querySelector('input:checked')) count++;
    question.querySelectorAll('.option').forEach(label => {
      label.classList.toggle('selected', label.querySelector('input').checked);
    });
  });
  document.getElementById('answeredCount').textContent = count;
}

async function submitQuiz(event, questions) {
  event.preventDefault();
  clearAlert('pageAlert');

  const form = event.target;
  const answers = {};
  questions.forEach(q => {
    const checked = form.querySelector(`input[name="${q.id}"]:checked`);
    if (checked) answers[q.id] = Number(checked.value);
  });

  const missing = questions.length - Object.keys(answers).length;
  if (missing > 0) {
    showAlert('pageAlert', `Please answer every question before submitting. ${missing} still unanswered.`, 'warning');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  try {
    const result = await withBusy(button, 'Submitting...', () =>
      api(`/courses/${encodeURIComponent(courseId)}/assessment`, {
        method: 'POST',
        body: { answers }
      })
    );
    await refreshProgress();
    showResult(result);
  } catch (err) {
    showAlert('pageAlert', err.message);
  }
}

function showResult(result) {
  currentView = { type: 'result' };
  renderSidebar();

  const review = result.review.map((r, i) => `
    <div class="quiz-question">
      <h3>${i + 1}. ${escapeHtml(r.question)}</h3>
      ${r.options.map((option, oi) => {
        let state = '';
        let mark = '';
        if (oi === r.correctAnswer) {
          state = 'correct';
          mark = ' ✓';
        } else if (oi === r.selected) {
          state = 'wrong';
          mark = ' ✗';
        }
        return `<div class="option ${state}">${escapeHtml(option)}${mark}</div>`;
      }).join('')}
      <p class="muted">${r.correct ? 'Correct' : (r.selected === null ? 'Not answered' : 'Incorrect')}</p>
    </div>
  `).join('');

  document.getElementById('courseMain').innerHTML = `
    <div class="result-banner ${result.passed ? 'result-pass' : 'result-fail'}">
      <h2>${result.passed ? 'Passed' : 'Not passed yet'}</h2>
      <p>You scored ${result.score}% (${result.correct} of ${result.total} correct). Pass mark: ${result.passingScore}%.</p>
      <div class="hero-actions">
        ${result.passed
          ? '<a class="btn btn-primary" href="dashboard.html#certificates">View my certificate</a>'
          : '<button class="btn btn-primary" data-action="retake" type="button">Retake assessment</button>'}
        <button class="btn btn-outline" data-action="modules" type="button">Review modules</button>
      </div>
    </div>
    <article class="lesson">
      <h2>Your answers</h2>
      ${review}
    </article>
  `;
}