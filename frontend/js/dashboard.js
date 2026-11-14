// Student and admin dashboard

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;

  const user = getUser();
  document.getElementById('greeting').textContent = `Hello, ${user ? user.name : 'learner'}`;

  if (isAdmin()) {
    document.getElementById('adminLink').classList.remove('hidden');
  }

  setupSidebar();
  setupBookingActions();
  setupAdminForm();
  setupAdminActions();
  loadDashboard();
  loadSlots();
  if (isAdmin()) loadCourseOptions();
});

// ---------- Sidebar ----------
function setupSidebar() {
  document.querySelectorAll('.side-link').forEach(link => {
    link.addEventListener('click', () => showPanel(link.dataset.panel));
  });
  const fromHash = window.location.hash.replace('#', '');
  showPanel(fromHash || 'overview');
}

function showPanel(name) {
  if (name === 'admin' && !isAdmin()) name = 'overview';
  if (!document.getElementById('panel-' + name)) name = 'overview';

  document.querySelectorAll('.side-link').forEach(link => {
    link.classList.toggle('active', link.dataset.panel === name);
  });
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== 'panel-' + name);
  });
  history.replaceState(null, '', '#' + name);
}

// ---------- Loading data ----------
async function loadDashboard() {
  try {
    const [progressRes, bookingsRes, certsRes] = await Promise.all([
      api('/courses/my/progress'),
      api('/bookings/me'),
      api('/certificates/me')
    ]);
    renderStats(progressRes.progress, bookingsRes.bookings, certsRes.certificates);
    renderCourses(progressRes.progress);
    renderMyBookings(bookingsRes.bookings);
    renderCertificates(certsRes.certificates);
  } catch (err) {
    showAlert('pageAlert', err.message);
  }
}

async function loadSlots() {
  try {
    const { slots } = await api('/bookings/slots');
    renderSlots(slots);
    if (isAdmin()) renderAdminSlots(slots);
  } catch (err) {
    showAlert('bookingAlert', err.message);
  }
}

async function refreshBookings() {
  await loadDashboard();
  await loadSlots();
}

// ---------- Rendering ----------
function emptyBox(text) {
  return `<div class="empty">${escapeHtml(text)}</div>`;
}

function renderStats(progress, bookings, certificates) {
  const passed = progress.filter(p => p.passed).length;
  const modulesDone = progress.reduce((sum, p) => sum + p.completedModules, 0);
  const modulesTotal = progress.reduce((sum, p) => sum + p.totalModules, 0);
  const upcoming = bookings.filter(b => !b.started).length;

  const stats = [
    { value: `${passed} / ${progress.length}`, label: 'Courses passed' },
    { value: `${modulesDone} / ${modulesTotal}`, label: 'Modules completed' },
    { value: certificates.length, label: 'Certificates earned' },
    { value: upcoming, label: 'Upcoming lab sessions' }
  ];

  document.getElementById('statGrid').innerHTML = stats.map(s => `
    <div class="card">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

function statusBadge(p) {
  if (p.passed) return '<span class="badge badge-success">Passed</span>';
  if (p.attempts > 0) return `<span class="badge badge-warning">Best score ${p.bestScore}% · not yet passed</span>`;
  if (p.assessmentUnlocked) return '<span class="badge badge-info">Assessment ready</span>';
  if (p.completedModules > 0) return '<span class="badge badge-info">In progress</span>';
  return '<span class="badge">Not started</span>';
}

function renderCourses(progress) {
  if (isAdmin()) loadAdminBookings();
  document.getElementById('courseList').innerHTML = progress.map(p => {
    const pct = p.totalModules ? Math.round((p.completedModules / p.totalModules) * 100) : 0;
    return `
      <div class="list-item">
        <div>
          <div class="item-title">${escapeHtml(p.title)}</div>
          <div class="item-sub">${p.completedModules} of ${p.totalModules} modules complete</div>
          <div class="progress"><div class="progress-bar" style="width: ${pct}%"></div></div>
          ${statusBadge(p)}
        </div>
        <a class="btn btn-primary btn-small" href="course.html?id=${encodeURIComponent(p.courseId)}">
          ${p.passed ? 'Review' : 'Continue'}
        </a>
      </div>
    `;
  }).join('');
}

function renderMyBookings(bookings) {
  const container = document.getElementById('myBookings');
  if (!bookings.length) {
    container.innerHTML = emptyBox('You have no lab bookings yet. Pick a session below.');
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="list-item">
      <div>
        <div class="item-title">${escapeHtml(b.labName)}</div>
        <div class="item-sub">${escapeHtml(b.courseTitle)} · ${escapeHtml(b.location)}</div>
        <div class="item-sub">${escapeHtml(formatDate(b.startsAt))}</div>
      </div>
      ${b.started
        ? '<span class="badge">Started</span>'
        : `<button class="btn btn-outline btn-small" data-cancel="${escapeHtml(b.id)}" type="button">Cancel booking</button>`}
    </div>
  `).join('');
}

function renderSlots(slots) {
  const container = document.getElementById('slotList');
  if (!slots.length) {
    container.innerHTML = emptyBox('No lab sessions are scheduled yet.');
    return;
  }

  container.innerHTML = slots.map(s => {
    let action;
    if (s.bookedByMe) {
      action = '<span class="badge badge-success">Booked</span>';
    } else if (s.started) {
      action = '<span class="badge">Started</span>';
    } else if (s.spotsLeft === 0) {
      action = '<span class="badge badge-danger">Full</span>';
    } else {
      action = `<button class="btn btn-primary btn-small" data-book="${escapeHtml(s.id)}" type="button">Book seat</button>`;
    }

    return `
      <div class="list-item">
        <div>
          <div class="item-title">${escapeHtml(s.labName)}</div>
          <div class="item-sub">${escapeHtml(s.courseTitle)} · ${escapeHtml(s.location)}</div>
          <div class="item-sub">${escapeHtml(formatDate(s.startsAt))} · ${s.spotsLeft} of ${s.capacity} seats left</div>
        </div>
        ${action}
      </div>
    `;
  }).join('');
}

function renderAdminSlots(slots) {
  const container = document.getElementById('adminSlotList');
  if (!slots.length) {
    container.innerHTML = emptyBox('No sessions yet. Create one above.');
    return;
  }

  container.innerHTML = slots.map(s => {
    const booked = s.capacity - s.spotsLeft;
    return `
      <div class="list-item">
        <div>
          <div class="item-title">${escapeHtml(s.labName)} · ${escapeHtml(s.courseTitle)}</div>
          <div class="item-sub">${escapeHtml(s.location)} · ${escapeHtml(formatDate(s.startsAt))}</div>
        </div>
        <div class="hero-actions">
          <span class="badge badge-info">${booked} / ${s.capacity} booked${s.started ? ' · started' : ''}</span>
          <button class="btn btn-outline btn-small" data-delete-slot="${escapeHtml(s.id)}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderCertificates(certs) {
  const container = document.getElementById('certList');
  if (!certs.length) {
    container.innerHTML = emptyBox('No certificates yet. Pass a course assessment with at least the pass mark to earn one.');
    return;
  }

  container.innerHTML = certs.map(c => `
    <div class="list-item">
      <div>
        <div class="item-title">${escapeHtml(c.courseTitle)}</div>
        <div class="item-sub">Issued ${escapeHtml(formatDate(c.issuedAt))} · ID ${escapeHtml(c.id)}</div>
      </div>
      <a class="btn btn-outline btn-small" href="verify.html?id=${encodeURIComponent(c.id)}">View &amp; print</a>
    </div>
  `).join('');
}

// ---------- Booking actions ----------
function setupBookingActions() {
  document.getElementById('panel-bookings').addEventListener('click', async (event) => {
    const bookButton = event.target.closest('[data-book]');
    const cancelButton = event.target.closest('[data-cancel]');
    if (bookButton) await bookSlot(bookButton);
    if (cancelButton) await cancelBooking(cancelButton);
  });
}

async function bookSlot(button) {
  clearAlert('bookingAlert');
  try {
    await withBusy(button, 'Booking...', () =>
      api('/bookings', { method: 'POST', body: { slotId: button.dataset.book } })
    );
    showAlert('bookingAlert', 'Your seat is booked. You can cancel it any time before the session starts.', 'success');
    await refreshBookings();
  } catch (err) {
    showAlert('bookingAlert', err.message);
  }
}

async function cancelBooking(button) {
  if (!confirm('Cancel this lab booking?')) return;
  clearAlert('bookingAlert');
  try {
    await withBusy(button, 'Cancelling...', () =>
      api(`/bookings/${encodeURIComponent(button.dataset.cancel)}`, { method: 'DELETE' })
    );
    showAlert('bookingAlert', 'Booking cancelled.', 'success');
    await refreshBookings();
  } catch (err) {
    showAlert('bookingAlert', err.message);
  }
}

// ---------- Admin ----------
async function loadAdminBookings() {
  if (!isAdmin()) return;
  try {
    const { bookings } = await api('/bookings/admin/all');
    renderAdminBookings(bookings);
  } catch (err) {
    showAlert('adminAlert', 'Could not load bookings: ' + err.message);
  }
}

function renderAdminBookings(bookings) {
  const container = document.getElementById('adminBookingList');
  if (!container) return;
  if (!bookings.length) {
    container.innerHTML = emptyBox('No bookings yet.');
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="list-item">
      <div>
        <div class="item-title">${escapeHtml(b.studentName)} · ${escapeHtml(b.labName)}</div>
        <div class="item-sub">${escapeHtml(b.courseTitle)} · ${escapeHtml(formatDate(b.startsAt))}</div>
        <div class="item-sub">${escapeHtml(b.studentEmail || '')}</div>
      </div>
      <span class="badge ${b.started ? '' : 'badge-info'}">${b.started ? 'Started' : 'Upcoming'}</span>
    </div>
  `).join('');
}

function setupAdminActions() {
  if (!isAdmin()) return;
  document.getElementById('adminSlotList').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-delete-slot]');
    if (!button) return;

    if (!confirm('Delete this lab session? Any bookings for it will also be cancelled.')) return;
    clearAlert('adminAlert');
    try {
      await withBusy(button, 'Deleting...', () =>
        api(`/bookings/slots/${encodeURIComponent(button.dataset.deleteSlot)}`, { method: 'DELETE' })
      );
      showAlert('adminAlert', 'Lab session deleted.', 'success');
      await refreshBookings();
    } catch (err) {
      showAlert('adminAlert', err.message);
    }
  });
}

async function loadCourseOptions() {
  try {
    const { courses } = await api('/courses');
    document.querySelector('#slotForm select[name="courseId"]').innerHTML = courses
      .map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title)}</option>`)
      .join('');
  } catch (err) {
    showAlert('adminAlert', 'Could not load courses: ' + err.message);
  }
}

function setupAdminForm() {
  if (!isAdmin()) return;

  const form = document.getElementById('slotForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlert('adminAlert');

    const startsAtValue = form.elements.startsAt.value;
    if (!startsAtValue) {
      showAlert('adminAlert', 'Please choose a start date and time.');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    try {
      await withBusy(button, 'Creating...', () =>
        api('/bookings/slots', {
          method: 'POST',
          body: {
            courseId: form.elements.courseId.value,
            labName: form.elements.labName.value.trim(),
            location: form.elements.location.value.trim(),
            startsAt: new Date(startsAtValue).toISOString(),
            capacity: Number(form.elements.capacity.value)
          }
        })
      );
      form.reset();
      showAlert('adminAlert', 'Lab session created.', 'success');
      await loadSlots();
      if (isAdmin()) await loadAdminBookings();
    } catch (err) {
      showAlert('adminAlert', err.message);
    }
  });
}