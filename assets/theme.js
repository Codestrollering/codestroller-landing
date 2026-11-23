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
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');

  var groups = [
    '.people:not(.stack)', '.r-people', '.plans', '.ways-grid', '.keep', '.visits', '.frames', '.steps', '.features', '.figures', '.r-sum', '.mlist', '.preview-people', '.agent-steps', '.agent-log ol'
  ];
  var cards = '.person, .r-person, .plan, .way, .keep > div, .visit, .frame, .steps li, .feature, .figures > div, .verdict, .mlist li, .preview-people li, .compare, .browser, .wire, .faq, .platforms, .agent-log';
  var seen = new Set();
  groups.forEach(function (g) {
    document.querySelectorAll(g).forEach(function (group) {
      var i = 0;
      Array.prototype.forEach.call(group.children, function (el) {
        if (seen.has(el)) return; seen.add(el);
        el.classList.add('reveal'); el.style.setProperty('--d', (i++ * 80) + 'ms');
      });
    });
  });
  document.querySelectorAll(cards).forEach(function (el) {
    if (el.closest('.stack')) return;
    if (!seen.has(el) && !el.closest('.reveal')) { el.classList.add('reveal'); seen.add(el); }
  });
  document.querySelectorAll('.person, .r-person, .plan, .way, .visit, .frame').forEach(function (el) { if (!el.closest('.stack')) el.classList.add('lift-hover'); });

  // persona stack: rotate through all four cards twice, then settle on the AI agent
  document.querySelectorAll('.people.stack').forEach(function (st) {
    var n = st.querySelectorAll(':scope > .person').length;
    st.classList.add('reveal');
    var steps = 2 * n, done = 0, timer = null, stopped = false;
    function step() {
      if (stopped) return;
      var front = st._order[0];
      front.classList.add('leaving');
      st._order = st._order.slice(1).concat([front]);
      window.__stack(st);
      setTimeout(function () { front.classList.remove('leaving'); front.setAttribute('data-depth', String(n - 1)); }, 900);
      if (++done >= steps) { clearInterval(timer); }
    }
    st._stop = function () { stopped = true; clearInterval(timer); };
    st._start = function () {
      if (st._started) return; st._started = true;
      setTimeout(function () { step(); timer = setInterval(step, 1500); }, 1100);
    };
  });

  // headline: customers, then those who send an AI assistant; twice, then back to customers
  document.querySelectorAll('h1.rot').forEach(function (h) {
    var flips = 0, hover = false;
    h.addEventListener('mouseenter', function () { hover = true; });
    h.addEventListener('mouseleave', function () { hover = false; });
    setTimeout(function () {
      var t = setInterval(function () {
        if (hover) return;
        h.classList.toggle('show-b');
        if (++flips >= 4) clearInterval(t);
      }, 3200);
    }, 2200);
  });

  // count-up: animate the number, keep its final value for assistive tech
  function countUp(b) {
    var txt = b.textContent.trim(); var m = txt.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m || b.dataset.counted) return; b.dataset.counted = '1';
    var end = parseFloat(m[2]), dec = (m[2].split('.')[1] || '').length, t0 = null, dur = 800;
    b.setAttribute('aria-label', txt);
    b.style.minWidth = b.getBoundingClientRect().width + 'px';
    function frame(t) {
      if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); var e = 1 - Math.pow(1 - p, 3);
      b.textContent = m[1] + (end * e).toFixed(dec) + m[3];
      if (p < 1) requestAnimationFrame(frame);
    }
    if (end > 0) requestAnimationFrame(frame);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target._start) en.target._start();
      en.target.querySelectorAll('.counts b, dd, .price b').forEach(countUp);
      if (en.target.matches('dd, .counts b')) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  // safety net: anything on screen (or the whole page, if the observer never fires) still shows
  function sweep() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); if (el._start) el._start(); el.querySelectorAll('.counts b, dd, .price b').forEach(countUp); }
    });
  }
  window.addEventListener('load', function () { setTimeout(sweep, 1200); });
  window.addEventListener('beforeprint', function () { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); }); });
})();
