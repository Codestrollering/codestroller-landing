// Persona stack: set who is in front; works with or without motion.
window.__stack = function (st, frontIdx) {
  var cards = Array.prototype.slice.call(st.querySelectorAll(':scope > .person')), n = cards.length;
  var order = st._order || [cards[n - 1]].concat(cards.slice(0, n - 1));
  if (frontIdx != null) { var c = cards[frontIdx]; order = [c].concat(order.filter(function (x) { return x !== c; })); }
  st._order = order;
  order.forEach(function (c, d) { if (!c.classList.contains('leaving') || d !== n - 1) c.setAttribute('data-depth', String(d)); });
  var lg = st.parentNode.querySelector('.stack-legend');
  if (lg) lg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(cards[+b.dataset.card] === order[0])); });
};
(function () {
  document.querySelectorAll('.people.stack').forEach(function (st) {
    window.__stack(st);
    var lg = st.parentNode.querySelector('.stack-legend');
    if (lg) lg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (st._stop) st._stop();
      window.__stack(st, +b.dataset.card);
    });
  });
})();
// Motion for the theme trial: reveal-on-scroll with a stagger, count-up figures.
// Content is fully visible without JS or with reduced motion.

// Card stack: the one animated section. Shuffle through all four twice and settle on the AI agent,
// then stamp its red F. Nothing moves with reduced motion; clicking a chip stops the shuffle.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.querySelectorAll('.people.stack').forEach(function (st) {
    var n = st.querySelectorAll(':scope > .person').length;
    var steps = 2 * n, done = 0, timer = null, stopped = false;
    function stamp() {
      var marks = st.parentNode.querySelectorAll('.pgrade.f');
      marks.forEach(function (m) { m.classList.remove('stamp'); void m.offsetWidth; m.classList.add('stamp'); });
    }
    function step() {
      if (stopped) return;
      var front = st._order[0];
      front.classList.add('leaving');
      st._order = st._order.slice(1).concat([front]);
      window.__stack(st);
      setTimeout(function () { front.classList.remove('leaving'); front.setAttribute('data-depth', String(n - 1)); }, 900);
      if (++done >= steps) { clearInterval(timer); setTimeout(stamp, 650); }
    }
    st._stop = function () { stopped = true; clearInterval(timer); };
    var started = false;
    function start() { if (started) return; started = true; setTimeout(function () { step(); timer = setInterval(step, 1500); }, 900); }
    function visible() { var r = st.getBoundingClientRect(); return r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.2; }
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); start(); } }, { threshold: 0.4 });
    io.observe(st);
    function check() { if (!started && visible()) { io.disconnect(); start(); } }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('load', function () { setTimeout(check, 600); });
  });
})();

// Header menu (narrow screens), shared by every page.
(function () {
  var head = document.querySelector('.site-head'), btn = head && head.querySelector('.menu-btn');
  if (!btn) return;
  function close() { head.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () { var open = head.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  head.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && head.classList.contains('open')) { close(); btn.focus(); } });
})();

// Sample report PDF: ask for an email, then download. Without JS the link downloads directly.
(function () {
  var dlg = document.getElementById('leadDialog');
  var trigger = document.querySelector('[data-lead-pdf]');
  if (!dlg || !trigger || typeof dlg.showModal !== 'function') return;
  var API = window.CS_API || 'https://app.codestroller.com';
  var form = document.getElementById('leadForm'), done = document.getElementById('leadDone');
  var err = document.getElementById('leadError'), msg = document.getElementById('leadDoneMsg');
  var email = document.getElementById('lead-email');
  function download() {
    var a = document.createElement('a');
    a.href = trigger.getAttribute('href'); a.download = trigger.getAttribute('download') || '';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function open(e) {
    e.preventDefault();
    form.hidden = false; done.hidden = true; err.textContent = '';
    dlg.showModal(); email.focus();
  }
  trigger.addEventListener('click', open);
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); }
  });
  dlg.addEventListener('close', function () { trigger.focus(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err.textContent = 'Please enter an email address we can send the report to.'; email.setAttribute('aria-invalid', 'true'); email.focus(); return; }
    email.removeAttribute('aria-invalid'); err.textContent = '';
    var btn = form.querySelector('.lead-submit'); btn.disabled = true; btn.textContent = 'Sending…';
    var body = { email: v, website: document.getElementById('lead-site').value, consent: document.getElementById('lead-consent').checked, nickname: document.getElementById('lead-nick').value, page: location.href };
    function finish(emailed) {
      download();
      msg.textContent = emailed ? 'We’ve also emailed the link to ' + v + '.' : 'If it doesn’t appear, use the link below.';
      form.hidden = true; done.hidden = false; done.querySelector('h2').focus();
      btn.disabled = false; btn.textContent = 'Get the report';
    }
    fetch(API + '/api/sample-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }, function () { return { ok: r.ok, status: r.status, j: {} }; }); })
      .then(function (x) {
        if (x.status === 400) { err.textContent = (x.j && x.j.error) || 'Please check your email address.'; btn.disabled = false; btn.textContent = 'Get the report'; email.focus(); return; }
        finish(!!(x.ok && x.j && x.j.emailed));
      })
      .catch(function () { finish(false); }); // never block the download on our side
  });
})();
