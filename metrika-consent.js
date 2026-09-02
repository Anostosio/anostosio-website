(function () {
  'use strict';

  var counterId = 110819448;
  var consentKey = 'anostosio_analytics_consent_v1';
  var loaded = false;
  var language = (document.documentElement.lang || 'ru').slice(0, 2);

  var copy = {
    ru: {
      title: 'Файлы cookie°',
      text: 'Я использую Яндекс Метрику, чтобы понимать, какие страницы и проекты интересны посетителям. Аналитика включится только с вашего согласия.',
      accept: 'ПРИНЯТЬ',
      decline: 'ОТКЛОНИТЬ',
      settings: 'Cookies',
      aria: 'Настройки файлов cookie'
    },
    en: {
      title: 'Cookies°',
      text: 'I use Yandex Metrica to understand which pages and projects visitors find useful. Analytics will only start with your consent.',
      accept: 'ACCEPT',
      decline: 'DECLINE',
      settings: 'Cookies',
      aria: 'Cookie settings'
    },
    es: {
      title: 'Cookies°',
      text: 'Uso Yandex Metrica para saber qué páginas y proyectos interesan a los visitantes. La analítica solo se activará con tu consentimiento.',
      accept: 'ACEPTAR',
      decline: 'RECHAZAR',
      settings: 'Cookies',
      aria: 'Configuración de cookies'
    }
  };

  var ui = copy[language] || copy.ru;

  function getConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // The choice still applies to the current page when storage is unavailable.
    }
  }

  function loadMetrika() {
    if (loaded || getConsent() !== 'granted') return;
    loaded = true;

    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counterId;
    tag.onerror = function () {
      loaded = false;
    };
    document.head.appendChild(tag);

    window.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
      params: {
        site_language: language
      }
    });
  }

  function reachGoal(name) {
    if (getConsent() !== 'granted' || typeof window.ym !== 'function') return;
    window.ym(counterId, 'reachGoal', name);
  }

  window.anostosioMetrikaGoal = reachGoal;

  function goalForLink(link) {
    var href = link.getAttribute('href') || '';
    var absolute;

    if (/^mailto:/i.test(href)) return 'email_click';
    if (/^https?:\/\/(t\.me|vk\.com|instagram\.com|www\.instagram\.com)/i.test(href)) return 'social_click';

    try {
      absolute = new URL(href, window.location.href);
    } catch (error) {
      return '';
    }

    if (absolute.origin !== window.location.origin) return '';
    if (/\/portfolio\.html$/.test(absolute.pathname)) return 'portfolio_open';
    if (/\/price\.html$/.test(absolute.pathname)) return 'price_open';
    if (/\/brief\.html$/.test(absolute.pathname)) return 'brief_open';
    return '';
  }

  function bindGoals() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      var goal = link ? goalForLink(link) : '';
      if (goal) reachGoal(goal);
    }, true);

    var brief = document.getElementById('projectBrief');
    if (brief) {
      brief.addEventListener('submit', function () {
        reachGoal('brief_submit');
      }, true);
    }
  }

  function createConsentUi() {
    var banner = document.createElement('section');
    banner.className = 'metric-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', ui.aria);
    banner.hidden = true;

    var content = document.createElement('div');
    content.className = 'metric-consent__content';

    var title = document.createElement('h2');
    title.className = 'metric-consent__title';
    title.textContent = ui.title;

    var text = document.createElement('p');
    text.className = 'metric-consent__text';
    text.textContent = ui.text;

    var actions = document.createElement('div');
    actions.className = 'metric-consent__actions';

    var accept = document.createElement('button');
    accept.className = 'metric-consent__button metric-consent__button--accept';
    accept.type = 'button';
    accept.textContent = ui.accept;

    var decline = document.createElement('button');
    decline.className = 'metric-consent__button metric-consent__button--decline';
    decline.type = 'button';
    decline.textContent = ui.decline;

    var settings = document.createElement('button');
    settings.className = 'metric-consent-settings';
    settings.type = 'button';
    settings.textContent = ui.settings;
    settings.setAttribute('aria-label', ui.aria);

    actions.appendChild(accept);
    actions.appendChild(decline);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(actions);
    banner.appendChild(content);
    document.body.appendChild(banner);
    document.body.appendChild(settings);

    function openBanner() {
      banner.hidden = false;
      settings.hidden = true;
    }

    function closeBanner() {
      banner.hidden = true;
      settings.hidden = false;
    }

    accept.addEventListener('click', function () {
      setConsent('granted');
      closeBanner();
      loadMetrika();
    });

    decline.addEventListener('click', function () {
      setConsent('denied');
      closeBanner();
    });

    settings.addEventListener('click', openBanner);

    if (getConsent() === 'granted') {
      closeBanner();
      loadMetrika();
    } else if (getConsent() === 'denied') {
      closeBanner();
    } else {
      openBanner();
    }
  }

  function init() {
    bindGoals();
    createConsentUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
}());
