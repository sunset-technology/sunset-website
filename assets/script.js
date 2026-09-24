(function () {
  try {
    var els = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } catch (e) {}
})();

// ---------------------------------------------------------------------------
// Language switcher (ES / EN / IT). Translations for the current page are
// embedded per-page as window.__I18N__ = { "<id>": {es,en,it}, ... }.
// ---------------------------------------------------------------------------
(function () {
  try {
    var LANGS = ['es', 'en', 'it'];
    var stored = null;
    try { stored = localStorage.getItem('sunset_lang'); } catch (e) {}
    var lang = (stored && LANGS.indexOf(stored) !== -1) ? stored : 'es';

    function applyLang(l) {
      lang = l;
      try { localStorage.setItem('sunset_lang', l); } catch (e) {}
      document.documentElement.lang = l;
      var data = window.__I18N__ || {};

      var titleEntry = data.__title__;
      if (titleEntry && titleEntry[l] != null) { document.title = titleEntry[l]; }
      var descEntry = data.__meta_desc__;
      if (descEntry && descEntry[l] != null) {
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) { metaDesc.setAttribute('content', descEntry[l]); }
      }

      var nodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute('data-i18n');
        var entry = data[key];
        if (entry && entry[l] != null) { el.innerHTML = entry[l]; }
      }

      var attrNodes = document.querySelectorAll('[data-i18n-attr]');
      for (var j = 0; j < attrNodes.length; j++) {
        var an = attrNodes[j];
        var specs = an.getAttribute('data-i18n-attr').split(',');
        for (var s = 0; s < specs.length; s++) {
          var spec = specs[s].split(':');
          var attrEntry = data[spec[1]];
          if (attrEntry && attrEntry[l] != null) { an.setAttribute(spec[0], attrEntry[l]); }
        }
      }

      var btns = document.querySelectorAll('.lang-switch-menu button');
      for (var k = 0; k < btns.length; k++) {
        btns[k].classList.toggle('active', btns[k].getAttribute('data-lang') === l);
      }
      var label = document.querySelector('.lang-switch-current');
      if (label) { label.textContent = l.toUpperCase(); }
    }

    document.addEventListener('DOMContentLoaded', function () {
      applyLang(lang);
      var sw = document.querySelector('.lang-switch');
      if (!sw) { return; }
      var btn = sw.querySelector('.lang-switch-btn');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        sw.classList.toggle('open');
      });
      var menuBtns = sw.querySelectorAll('.lang-switch-menu button');
      for (var i = 0; i < menuBtns.length; i++) {
        menuBtns[i].addEventListener('click', function (ev) {
          applyLang(ev.currentTarget.getAttribute('data-lang'));
          sw.classList.remove('open');
        });
      }
      document.addEventListener('click', function () { sw.classList.remove('open'); });
    });
  } catch (e) {}
})();

// ---------------------------------------------------------------------------
// "Presencia" map video: starts playing (from the beginning, so the visitor
// sees the full rotate-in + sequential Florida/Buenos Aires/Malaga reveal)
// only once it actually scrolls into view, instead of autoplaying while
// off-screen and looping past the interesting part before anyone sees it.
// ---------------------------------------------------------------------------
(function () {
  try {
    var vid = document.getElementById('presencia-video');
    if (!vid) { return; }
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          try { vid.currentTime = 0; } catch (e) {}
          var p = vid.play();
          if (p && p.catch) { p.catch(function () {}); }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(vid);
  } catch (e) {}
})();

// ---------------------------------------------------------------------------
// "Nuestro rol como integrador de sistemas" cards: clicking one opens a
// popup modal with the card's full explanatory text, in addition to the
// existing hover lift.
// ---------------------------------------------------------------------------
(function () {
  try {
    var overlay = document.getElementById('rol-modal-overlay');
    if (!overlay) { return; }
    var titleEl = document.getElementById('rol-modal-title');
    var bodyEl = document.getElementById('rol-modal-body');
    var closeBtn = document.getElementById('rol-modal-close');

    function openModal(title, detail) {
      titleEl.textContent = title || '';
      bodyEl.textContent = detail || '';
      overlay.classList.add('open');
    }
    function closeModal() {
      overlay.classList.remove('open');
    }

    document.querySelectorAll('.rol-card').forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(card.getAttribute('data-title'), card.getAttribute('data-detail'));
      });
    });
    if (closeBtn) { closeBtn.addEventListener('click', closeModal); }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeModal(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); }
    });
  } catch (e) {}
})();

// ---------------------------------------------------------------------------
// "Con la confianza de" marquee: each operator name is dim/disabled by
// default and lights up (brand color, full opacity) for roughly a second
// as it passes through the horizontal center of the track.
// ---------------------------------------------------------------------------
(function () {
  try {
    var wrap = document.querySelector('.trust-track-wrap');
    if (!wrap) { return; }
    var names = wrap.querySelectorAll('.op-name');
    if (!names.length) { return; }
    function tick() {
      var wrapRect = wrap.getBoundingClientRect();
      var centerX = wrapRect.left + wrapRect.width / 2;
      for (var i = 0; i < names.length; i++) {
        var r = names[i].getBoundingClientRect();
        var dist = Math.abs((r.left + r.width / 2) - centerX);
        var threshold = Math.max(30, r.width / 2.2);
        names[i].classList.toggle('active', dist < threshold);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  } catch (e) {}
})();
