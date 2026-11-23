// Motion for the theme trial: reveal-on-scroll with a stagger, count-up figures.
// Content is fully visible without JS or with reduced motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');

  var groups = [
    '.people', '.r-people', '.plans', '.ways-grid', '.keep', '.visits', '.frames', '.steps', '.features', '.figures', '.r-sum', '.mlist', '.preview-people'
  ];
  var cards = '.person, .r-person, .plan, .way, .keep > div, .visit, .frame, .steps li, .feature, .figures > div, .verdict, .mlist li, .preview-people li, .compare, .browser, .wire, .faq, .platforms';
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
    if (!seen.has(el) && !el.closest('.reveal')) { el.classList.add('reveal'); seen.add(el); }
  });
  document.querySelectorAll('.person, .r-person, .plan, .way, .visit, .frame').forEach(function (el) { el.classList.add('lift-hover'); });

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
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); el.querySelectorAll('.counts b, dd, .price b').forEach(countUp); }
    });
  }
  window.addEventListener('load', function () { setTimeout(sweep, 1200); });
  window.addEventListener('beforeprint', function () { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); }); });
})();
