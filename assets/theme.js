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
