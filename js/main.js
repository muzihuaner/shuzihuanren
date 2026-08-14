/* 数字怀仁 · shared interactions */
(function () {
  'use strict';

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  /* ---- current nav link ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav > a[data-page]').forEach(function (a) {
    if (a.getAttribute('data-page') === path) {
      a.classList.add('is-current');
    }
  });

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---- back to top ---- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---- map tooltip ---- */
  var tip = document.querySelector('.map-tip');
  if (tip) {
    document.querySelectorAll('[data-map-point]').forEach(function (pt) {
      var enter = function () {
        tip.innerHTML = '<b>' + (pt.getAttribute('data-map-name') || '') + '</b>' +
          (pt.getAttribute('data-map-desc') || '');
        tip.classList.add('show');
      };
      var move = function (e) {
        var pad = 16;
        var x = e.clientX + pad;
        var y = e.clientY + pad;
        var r = tip.getBoundingClientRect();
        if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - pad;
        if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - pad;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
      };
      var leave = function () { tip.classList.remove('show'); };
      pt.addEventListener('mouseenter', enter);
      pt.addEventListener('mousemove', move);
      pt.addEventListener('mouseleave', leave);
    });
  }

  /* ---- fake form submit (front-end demo) ---- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = '提交留言'; }
        var ok = form.querySelector('.form-success');
        if (ok) ok.classList.add('show');
        form.reset();
        setTimeout(function () { if (ok) ok.classList.remove('show'); }, 6000);
      }, 900);
    });
  });

  /* ---- mailto form submit (send via email client) ---- */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    var to = form.getAttribute('data-mailto');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      };
      var name = val('name'), content = val('content');
      if (!name || !content) return;
      var subject = encodeURIComponent('【数字怀仁】' + (val('type') || '留言') + ' · ' + name);
      var body = encodeURIComponent(
        '称呼：' + name + '\n' +
        '联系方式：' + (val('contact') || '（未填写）') + '\n' +
        '留言类型：' + (val('type') || '留言') + '\n\n' +
        content
      );
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      var ok = form.querySelector('.form-success');
      if (ok) ok.classList.add('show');
      setTimeout(function () { if (ok) ok.classList.remove('show'); }, 8000);
    });
  });

  /* ---- year in footer ---- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();