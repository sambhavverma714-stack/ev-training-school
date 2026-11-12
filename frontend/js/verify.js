// Public certificate verification page

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verifyForm');
  const result = document.getElementById('verifyResult');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    verifyCertificate(form.elements.id.value.trim());
  });

  // The print button is created inside the result area, so use delegation
  result.addEventListener('click', (event) => {
    if (event.target.closest('#printBtn')) window.print();
  });

  // Support links such as verify.html?id=EVT-2025-A3F9C1
  const idFromUrl = new URLSearchParams(window.location.search).get('id');
  if (idFromUrl) {
    form.elements.id.value = idFromUrl;
    verifyCertificate(idFromUrl.trim());
  }
});

async function verifyCertificate(id) {
  const result = document.getElementById('verifyResult');

  if (!id) {
    result.innerHTML = '<div class="alert alert-warning">Please enter a certificate ID.</div>';
    return;
  }

  result.innerHTML = '<p class="muted">Checking certificate...</p>';
  history.replaceState(null, '', `verify.html?id=${encodeURIComponent(id)}`);

  try {
    const data = await api(`/certificates/verify/${encodeURIComponent(id)}`);

    if (data.valid) {
      result.innerHTML = `
        <div class="alert alert-success">${escapeHtml(data.message)}</div>
        ${certificateHtml(data.certificate)}
        <div class="hero-actions no-print">
          <button id="printBtn" class="btn btn-primary" type="button">Print or save as PDF</button>
        </div>
      `;
    } else {
      result.innerHTML = `<div class="alert alert-error">${escapeHtml(data.message)}</div>`;
    }
  } catch (err) {
    const message = err.status === 404
      ? 'No certificate found with this ID. Check the ID and try again.'
      : err.message;
    result.innerHTML = `<div class="alert alert-error">${escapeHtml(message)}</div>`;
  }
}

function certificateHtml(cert) {
  return `
    <div class="certificate">
      <div class="cert-org">EV Training School</div>
      <h2 class="cert-title">Certificate of Completion</h2>
      <p class="muted">This certifies that</p>
      <div class="cert-name">${escapeHtml(cert.userName)}</div>
      <p class="muted">has successfully completed</p>
      <div class="cert-course">${escapeHtml(cert.courseTitle)}</div>
      <div class="cert-meta">
        <div>Date of issue<strong>${escapeHtml(formatDate(cert.issuedAt))}</strong></div>
        <div>Certificate ID<strong>${escapeHtml(cert.id)}</strong></div>
      </div>
    </div>
  `;
}