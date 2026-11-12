// Shared helpers used by every page

const API_BASE = '/api';

// ---------- Login storage ----------
function getToken() {
  return localStorage.getItem('ev_token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('ev_user'));
  } catch (err) {
    return null;
  }
}

function isAdmin() {
  const user = getUser();
  return !!user && user.role === 'admin';
}

function saveAuth(token, user) {
  localStorage.setItem('ev_token', token);
  localStorage.setItem('ev_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('ev_token');
  localStorage.removeItem('ev_user');
}

// Sends the user to the login section if nobody is logged in.
// Returns true when the user is logged in.
function requireLogin() {
  if (!getToken()) {
    window.location.href = 'index.html?login=1';
    return false;
  }
  return true;
}

function logout() {
  clearAuth();
  window.location.href = 'index.html';
}

// ---------- API ----------
// Calls the backend. Throws an Error containing the server's message on failure.
async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;

  const response = await fetch(API_BASE + path, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    // The response was not JSON, so keep data empty
  }

  // Expired token or deleted account: send the user back to log in
  if (response.status === 401 && token) {
    clearAuth();
    window.location.href = 'index.html?login=1';
    throw new Error('Your session has expired. Please log in again.');
  }

  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }

  return data;
}

// ---------- UI helpers ----------
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function showAlert(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

function clearAlert(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = '';
}

// Disables a button and shows a busy label while an async action runs
async function withBusy(button, busyText, action) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = busyText;
  try {
    return await action();
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
}

// ---------- Light / dark theme ----------
function getTheme() {
  return localStorage.getItem('ev_theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', getTheme());
}

function toggleTheme() {
  localStorage.setItem('ev_theme', getTheme() === 'dark' ? 'light' : 'dark');
  applyTheme();
}

// Runs as soon as the script loads, so the page never flashes the wrong theme
applyTheme();

// ---------- Top navigation ----------
function renderNav() {
  const container = document.getElementById('navLinks');
  if (!container) return;

  const user = getUser();
  let html = '';

  if (getToken()) {
    html += `<a href="dashboard.html">Dashboard</a>`;
    html += `<span class="nav-user">${escapeHtml(user ? user.name : '')}</span>`;
    html += `<button class="btn btn-small btn-outline" id="logoutBtn" type="button">Log out</button>`;
  } else {
    html += `<a href="index.html?login=1">Log in</a>`;
  }

  html += `<a href="verify.html">Verify certificate</a>`;
  html += `<button class="btn btn-small btn-outline" id="themeBtn" type="button">${getTheme() === 'dark' ? 'Light mode' : 'Dark mode'}</button>`;

  container.innerHTML = html;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  document.getElementById('themeBtn').addEventListener('click', () => {
    toggleTheme();
    renderNav();
  });
}

document.addEventListener('DOMContentLoaded', renderNav);