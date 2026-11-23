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
