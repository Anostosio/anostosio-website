(function () {
  'use strict';

  var counterId = 110819448;
  var consentKey = 'anostosio_analytics_consent_v1';
  var policyVersion = '2026-09-03';
  var disableKey = 'disableYaCounter' + counterId;
  var loaded = false;
  var volatileConsent = null;
  var language = (document.documentElement.lang || 'ru').slice(0, 2);

  var copy = {
    ru: {
      title: 'Файлы cookie°',
      text: 'Я использую Яндекс Метрику, чтобы понимать, какие страницы и проекты интересны посетителям. Аналитика включится только с вашего согласия.',
      policy: 'Подробнее о данных, cookies и Яндекс Метрике',
      accept: 'ПРИНЯТЬ',
      decline: 'ОТКЛОНИТЬ',
      settings: 'Cookies',
      aria: 'Настройки файлов cookie',
      privacy: 'Персональные данные',
      legal: 'Правовая информация',
      briefNotice: 'При формировании письма ответы остаются на вашем устройстве. После отправки письма указанные сведения будут использованы для ответа на обращение и обсуждения возможного проекта. Подробнее — '
    },
    en: {
      title: 'Cookies°',
      text: 'I use Yandex Metrica to understand which pages and projects visitors find useful. Analytics will only start with your consent.',
      policy: 'Read about data, cookies and Yandex Metrica',
      accept: 'ACCEPT',
      decline: 'DECLINE',
      settings: 'Cookies',
      aria: 'Cookie settings',
      privacy: 'Personal data',
      legal: 'Legal information',
      briefNotice: 'When the email is created, your answers stay on your device. After you send the email, the information will be used to reply to your enquiry and discuss a possible project. See the '
    },
    es: {
      title: 'Cookies°',
      text: 'Uso Yandex Metrica para saber qué páginas y proyectos interesan a los visitantes. La analítica solo se activará con tu consentimiento.',
      policy: 'Más información sobre datos, cookies y Yandex Metrica',
      accept: 'ACEPTAR',
      decline: 'RECHAZAR',
      settings: 'Cookies',
      aria: 'Configuración de cookies',
      privacy: 'Datos personales',
      legal: 'Información legal',
      briefNotice: 'Al crear el correo, las respuestas permanecen en tu dispositivo. Después de enviarlo, la información se utilizará para responder a tu consulta y hablar de un posible proyecto. Consulta la '
    }
  };

  var ui = copy[language] || copy.ru;

  function privacyHref() {
    if (language === 'en') return '/en/privacy.html';
    if (language === 'es') return '/es/privacy.html';
    return '/privacy.html';
  }

  function legalHref() {
    if (language === 'en') return '/en/legal.html';
    if (language === 'es') return '/es/legal.html';
    return '/legal.html';
  }

  function ensureLegalStyles() {
    if (document.querySelector('link[data-anostosio-legal-styles]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/legal.css';
    link.setAttribute('data-anostosio-legal-styles', '');
    document.head.appendChild(link);
  }

  function readStoredConsent() {
    var raw;
    try {
      raw = window.localStorage.getItem(consentKey);
    } catch (error) {
      raw = null;
    }

    if (!raw) return null;
    if (raw === 'granted' || raw === 'denied') return raw;

    try {
      var record = JSON.parse(raw);
      if (record && (record.choice === 'granted' || record.choice === 'denied')) {
        return record.choice;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function getConsent() {
    return volatileConsent || readStoredConsent();
  }

  function setConsent(value) {
    volatileConsent = value;
    try {
      window.localStorage.setItem(consentKey, JSON.stringify({
        choice: value,
        updatedAt: new Date().toISOString(),
        policyVersion: policyVersion
      }));
    } catch (error) {
      // The choice still applies to the current page when storage is unavailable.
    }
  }

  function setMetrikaDisabled(disabled) {
    window[disableKey] = Boolean(disabled);
  }

  function deleteCookie(name) {
    var base = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = base;
    if (window.location.hostname === 'anostosio.ru' || /\.anostosio\.ru$/.test(window.location.hostname)) {
      document.cookie = base + '; domain=.anostosio.ru';
    }
  }

  function clearMetrikaClientData() {
    try {
      document.cookie.split(';').forEach(function (part) {
        var name = part.split('=')[0].trim();
        if (/^_ym/i.test(name) || /^(yandexuid|yuidss|ymex|usst|yabs-sid|i|gdpr|is_gdpr|is_gdpr_b)$/i.test(name)) {
          deleteCookie(name);
        }
      });
    } catch (error) {
      // Browser privacy settings can make cookie access unavailable.
    }

    try {
      for (var i = window.localStorage.length - 1; i >= 0; i -= 1) {
        var localKey = window.localStorage.key(i);
        if (localKey && (/^_ym/i.test(localKey) || /^zz$/i.test(localKey))) {
          window.localStorage.removeItem(localKey);
        }
      }
    } catch (error) {
      // Keep the user's own consent record even if analytics storage cannot be inspected.
    }

    try {
      for (var j = window.sessionStorage.length - 1; j >= 0; j -= 1) {
        var sessionKey = window.sessionStorage.key(j);
        if (sessionKey && /^_ym/i.test(sessionKey)) {
          window.sessionStorage.removeItem(sessionKey);
        }
      }
    } catch (error) {
      // Session storage can be unavailable in restrictive browser modes.
    }
  }

  function stopMetrika() {
    setMetrikaDisabled(true);

    if (typeof window.ym === 'function') {
      try {
        window.ym(counterId, 'destruct');
      } catch (error) {
        // The counter may not have completed initialization yet.
      }
    }

    document.querySelectorAll('script[data-anostosio-metrika]').forEach(function (tag) {
      tag.remove();
    });
    loaded = false;
    clearMetrikaClientData();
  }

  // Default to privacy-preserving behavior before any Yandex tag can be inserted.
  setMetrikaDisabled(getConsent() !== 'granted');

  function loadMetrika() {
    if (loaded || getConsent() !== 'granted') return;
    setMetrikaDisabled(false);
    loaded = true;

    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();

    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counterId;
    tag.setAttribute('data-anostosio-metrika', '');
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

  function makeLegalLink(href, text) {
    var link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    return link;
  }

  function addLegalLinks() {
    var privacy = privacyHref();
    var legal = legalHref();

    var globalNav = document.querySelector('.global-footer__bottom nav');
    if (globalNav && !globalNav.querySelector('a[href*="privacy.html"]')) {
      globalNav.appendChild(makeLegalLink(privacy, ui.privacy));
      globalNav.appendChild(makeLegalLink(legal, ui.legal));
    }

    var compactFooter = document.querySelector('.price-footer .price-container');
    if (compactFooter && !compactFooter.querySelector('a[href*="privacy.html"]')) {
      var links = document.createElement('span');
      links.className = 'anostosio-legal-links';
      links.appendChild(makeLegalLink(privacy, ui.privacy));
      links.appendChild(makeLegalLink(legal, ui.legal));
      var mark = compactFooter.querySelector('span:last-child');
      if (mark) compactFooter.insertBefore(links, mark);
      else compactFooter.appendChild(links);
    }
  }

  function addBriefPrivacyNotice() {
    var form = document.getElementById('projectBrief');
    if (!form || form.querySelector('.brief-privacy-note')) return;

    var actions = form.querySelector('.brief-form__actions');
    if (!actions) return;

    var notice = document.createElement('p');
    notice.className = 'brief-privacy-note';
    notice.appendChild(document.createTextNode(ui.briefNotice));
    var link = makeLegalLink(privacyHref(), ui.privacy);
    notice.appendChild(link);
    notice.appendChild(document.createTextNode('.'));
    actions.insertAdjacentElement('afterend', notice);
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

    var policy = document.createElement('p');
    policy.className = 'metric-consent__text metric-consent__policy';
    policy.appendChild(makeLegalLink(privacyHref(), ui.policy));

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
    content.appendChild(policy);
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
      setMetrikaDisabled(false);
      closeBanner();
      loadMetrika();
    });

    decline.addEventListener('click', function () {
      setConsent('denied');
      stopMetrika();
      closeBanner();
    });

    settings.addEventListener('click', openBanner);

    if (getConsent() === 'granted') {
      closeBanner();
      loadMetrika();
    } else if (getConsent() === 'denied') {
      setMetrikaDisabled(true);
      closeBanner();
    } else {
      setMetrikaDisabled(true);
      openBanner();
    }
  }

  function init() {
    ensureLegalStyles();
    addLegalLinks();
    addBriefPrivacyNotice();
    bindGoals();
    createConsentUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
}());
