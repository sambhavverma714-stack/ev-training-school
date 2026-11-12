// Landing page: course catalogue, login and registration

const LEVEL_BADGES = {
  Foundation: 'badge-info',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger'
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const authSection = document.getElementById('authSection');
  const welcomeCard = document.getElementById('welcomeCard');

  if (getToken()) {
    // Already logged in: show a welcome card instead of the forms
    const user = getUser();
    authSection.classList.add('hidden');
    welcomeCard.classList.remove('hidden');
    document.getElementById('welcomeText').textContent =
      `Welcome back, ${user ? user.name : 'learner'}.`;
  } else if (params.get('login')) {
    showAlert('authAlert', 'Log in to access courses and your dashboard.', 'info');
    authSection.scrollIntoView();
  }

  setupTabs();
  setupLoginForm();
  setupRegisterForm();
  loadCourses();
});

function fieldValue(form, name) {
  return form.elements[name].value.trim();
}

// Switches between the Log in and Register forms
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      document.getElementById('loginForm').classList.toggle('hidden', tab.dataset.tab !== 'login');
      document.getElementById('registerForm').classList.toggle('hidden', tab.dataset.tab !== 'register');
      clearAlert('authAlert');
    });
  });
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlert('authAlert');
    const button = form.querySelector('button[type="submit"]');

    try {
      const data = await withBusy(button, 'Logging in...', () =>
        api('/auth/login', {
          method: 'POST',
          body: {
            email: fieldValue(form, 'email'),
            password: form.elements['password'].value
          }
        })
      );
      saveAuth(data.token, data.user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert('authAlert', err.message);
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlert('authAlert');
    const button = form.querySelector('button[type="submit"]');

    try {
      const data = await withBusy(button, 'Creating account...', () =>
        api('/auth/register', {
          method: 'POST',
          body: {
            name: fieldValue(form, 'name'),
            email: fieldValue(form, 'email'),
            password: form.elements['password'].value
          }
        })
      );
      saveAuth(data.token, data.user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert('authAlert', err.message);
    }
  });
}

// Loads the public catalogue from the backend
async function loadCourses() {
  const grid = document.getElementById('courseGrid');

  try {
    const { courses } = await api('/courses');
    grid.innerHTML = courses.map(courseCard).join('');
  } catch (err) {
    grid.innerHTML = `<p class="alert alert-error">Could not load courses: ${escapeHtml(err.message)}</p>`;
  }
}

function courseCard(course) {
  const badgeClass = LEVEL_BADGES[course.level] || 'badge-info';
  const buttonText = getToken() ? 'Open course' : 'Log in to start';

  return `
    <article class="card course-card">
      <span class="badge ${badgeClass}">${escapeHtml(course.level)}</span>
      <h3>${escapeHtml(course.title)}</h3>
      <p class="muted">${escapeHtml(course.description)}</p>
      <div class="meta">
        <span>${course.moduleCount} modules</span>
        <span>${course.hours} hours</span>
        <span>Pass mark ${course.passingScore}%</span>
      </div>
      <a class="btn btn-primary" href="course.html?id=${encodeURIComponent(course.id)}">${buttonText}</a>
    </article>
  `;
}