(function () {
  'use strict';

  var menu = document.querySelector('.lab-menu');
  var nav = document.getElementById('labNav');
  var language = (document.documentElement.lang || 'en').slice(0, 2);
  var labels = {
    ru: ['Открыть меню', 'Закрыть меню'],
    en: ['Open menu', 'Close menu'],
    es: ['Abrir menú', 'Cerrar menú']
  };

  function fixLocalFileLinks() {
    if (window.location.protocol !== 'file:') return;
    var pathname = decodeURI(window.location.pathname).replace(/\\/g, '/');
    var marker = language === 'ru' ? '/lab/' : '/' + language + '/lab/';
    var markerIndex = pathname.indexOf(marker);
    if (markerIndex < 0) return;
    var siteRoot = pathname.slice(0, markerIndex);

    document.querySelectorAll('a[href^="/"]').forEach(function (link) {
      var href = link.getAttribute('href');
      var parts = href.split('#');
      var target = parts[0];
      if (target === '/') target = '/index.html';
      else if (target.endsWith('/')) target += 'index.html';
      link.setAttribute('href', 'file://' + encodeURI(siteRoot + target) + (parts[1] ? '#' + parts[1] : ''));
    });
  }

  function installCaseVisual() {
    if (!document.body.classList.contains('case-body')) return;
    var path = window.location.pathname;
    var copy = {
      ru: {
        brief: ['ВИЗУАЛЬНАЯ ЛОГИКА ПРОДУКТА', 'Вводные', 'Проверка', 'AI-сборка', 'Рабочий бриф', 'ФАКТЫ', 'ПРОБЕЛЫ', 'ГИПОТЕЗЫ'],
        crm: ['ВОРОНКА В ОДНОМ ЭКРАНЕ', 'Кандидат', 'Отклик', 'Интервью', 'Решение', 'СЕГОДНЯ', '3 действия требуют внимания'],
        wish: ['ПАРА + ЖЕЛАНИЯ + СЮРПРИЗ', 'ВЫ', 'ПАРТНЁР', 'ОБЩИЙ WISHLIST']
      },
      en: {
        brief: ['PRODUCT LOGIC', 'Inputs', 'Check', 'AI build', 'Working brief', 'FACTS', 'GAPS', 'HYPOTHESES'],
        crm: ['THE PIPELINE IN ONE VIEW', 'Candidate', 'Applied', 'Interview', 'Decision', 'TODAY', '3 actions need attention'],
        wish: ['COUPLE + WISHES + SURPRISE', 'YOU', 'PARTNER', 'SHARED WISHLIST']
      },
      es: {
        brief: ['LÓGICA DEL PRODUCTO', 'Datos', 'Revisión', 'Creación AI', 'Brief de trabajo', 'HECHOS', 'VACÍOS', 'HIPÓTESIS'],
        crm: ['EL PIPELINE EN UNA VISTA', 'Candidato', 'Solicitud', 'Entrevista', 'Decisión', 'HOY', '3 acciones requieren atención'],
        wish: ['PAREJA + DESEOS + SORPRESA', 'TÚ', 'PAREJA', 'WISHLIST COMPARTIDA']
      }
    }[language] || null;
    if (!copy) return;

    var section = document.createElement('section');
    section.className = 'case-system-visual';
    section.setAttribute('aria-hidden', 'true');

    if (path.indexOf('/projects/brief/') !== -1) {
      section.classList.add('case-system-visual--brief');
      section.innerHTML = '<div class="system-visual__label">' + copy.brief[0] + '</div><div class="brief-visual__flow">' +
        copy.brief.slice(1, 5).map(function (item, index) { return '<div><span>0' + (index + 1) + '°</span><strong>' + item + '</strong><i></i></div>'; }).join('') +
        '</div><div class="brief-visual__evidence"><span>' + copy.brief[5] + '</span><span>' + copy.brief[6] + '</span><span>' + copy.brief[7] + '</span></div>';
      var oldPreview = document.querySelector('.case-shot--secondary');
      if (oldPreview) oldPreview.remove();
    } else if (path.indexOf('/projects/job-search-crm/') !== -1) {
      section.classList.add('case-system-visual--crm');
      section.innerHTML = '<div class="system-visual__label">' + copy.crm[0] + '</div><div class="crm-visual__board">' +
        copy.crm.slice(1, 5).map(function (item, index) { return '<div><strong>0' + (index + 1) + ' · ' + item + '</strong><span></span><span></span>' + (index === 1 ? '<span></span>' : '') + '</div>'; }).join('') +
        '</div><div class="crm-visual__today"><strong>' + copy.crm[5] + '</strong><span>' + copy.crm[6] + '</span><i>03</i></div>';
    } else if (path.indexOf('/projects/ourwishlist/') !== -1) {
      section.classList.add('case-system-visual--wish');
      section.innerHTML = '<div class="system-visual__label">' + copy.wish[0] + '</div><div class="wish-visual__people"><div><i>♡</i><span>' + copy.wish[1] + '</span></div><b>+</b><div><i>♡</i><span>' + copy.wish[2] + '</span></div><b>→</b><div class="is-shared"><i>♥</i><span>' + copy.wish[3] + '</span></div></div><div class="wish-visual__cards"><span></span><span></span><span></span></div>';
    } else return;

    var anchor = document.querySelector('.case-split--accent') || document.querySelector('.case-hero');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
  }

  fixLocalFileLinks();
  installCaseVisual();

  function closeMenu() {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', (labels[language] || labels.en)[0]);
    nav.classList.remove('is-open');
  }

  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('aria-label', (labels[language]||labels.en)[open ? 0 : 1]);
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) closeMenu();
    }, { passive: true });
  }

  document.querySelectorAll('[data-lang-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      try { localStorage.setItem('anostosio_language', link.lang || 'ru'); } catch (_) {}
    });
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-analytics]');
    if (!link || typeof window.anostosioMetrikaGoal !== 'function') return;
    window.anostosioMetrikaGoal(link.getAttribute('data-analytics'));
  }, true);

  function setupMemeModal() {
    var openButton = document.getElementById('memeOpen');
    var modal = document.getElementById('memeModal');
    var closeButton = document.getElementById('memeClose');
    var closeBackground = document.getElementById('memeCloseBg');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!openButton || !modal) return;

    function openModal() {
      modal.hidden = false;
      window.requestAnimationFrame(function () { modal.classList.add('is-open'); });
      document.body.classList.add('modal-open');
      if (closeButton) closeButton.focus({ preventScroll: true });
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      window.setTimeout(function () { modal.hidden = true; }, reducedMotion ? 0 : 260);
      openButton.focus({ preventScroll: true });
    }

    openButton.addEventListener('click', openModal);
    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (closeBackground) closeBackground.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  setupMemeModal();

  var revealTargets = document.querySelectorAll('.product-card, .method-grid li, .skill-groups article, .feature-grid article, .case-split, .case-ai li, .case-system-visual');
  revealTargets.forEach(function (element) { element.setAttribute('data-reveal', ''); });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (element) { element.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(function (element) { observer.observe(element); });
  }
}());
