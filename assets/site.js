(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Monthly promo: ends on the last day of the current month, 23:59 local time
  var cd = document.getElementById('countdown');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var now = new Date();
    var target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    var t = Math.max(0, Math.floor((target - now) / 1000));
    cd.textContent = Math.floor(t / 86400) + 'd ' + pad(Math.floor(t % 86400 / 3600)) + 'h ' + pad(Math.floor(t % 3600 / 60)) + 'm ' + pad(t % 60) + 's';
  }
  tick(); setInterval(tick, 1000);

  // Modals
  var lead = document.getElementById('lead-modal');
  var ok = document.getElementById('success-modal');
  var lastFocus = null;
  function open(m) { lastFocus = document.activeElement; m.classList.add('open'); var f = m.querySelector('input:not([type=hidden]):not([name=_gotcha]), button'); if (f) setTimeout(function () { f.focus(); }, 30); }
  function close(m) { if (!m.classList.contains('open')) return; m.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  document.getElementById('open-consultation').addEventListener('click', function () { open(lead); });
  document.querySelectorAll('[data-open-consultation]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(lead); }); });
  document.getElementById('lead-modal-close').addEventListener('click', function () { close(lead); });
  document.getElementById('success-modal-close').addEventListener('click', function () { close(ok); });
  [lead, ok].forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) close(m); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(lead); close(ok); } });

  // Form → Formspree
  var form = document.getElementById('hero-contact-form');
  var btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('Network error'); })
      .then(function () {
        form.reset(); close(lead); open(ok);
        var err = form.querySelector('.form-error'); if (err) err.remove();
        if (window.dataLayer && typeof window.dataLayer.push === 'function') window.dataLayer.push({ event: 'form_success' });
      })
      .catch(function () {
        if (!form.querySelector('.form-error')) {
          var p = document.createElement('p'); p.className = 'form-error';
          p.textContent = 'Something went wrong. Please write us on WhatsApp.';
          btn.insertAdjacentElement('beforebegin', p);
        }
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Send'; });
  });
})();
