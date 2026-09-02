(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const pageLanguage = (root.lang || 'ru').toLowerCase().split('-')[0];
  const interfaceText = {
    ru: {
      menuOpen: 'Открыть меню', menuClose: 'Закрыть меню',
      briefTitle: 'БРИФ НА ДИЗАЙН-ПРОЕКТ', name: 'Имя / проект', contact: 'Контакт', service: 'Услуга',
      task: 'ЗАДАЧА', audience: 'ЦЕЛЕВАЯ АУДИТОРИЯ', deadline: 'Желаемый срок', budget: 'Ориентир по бюджету',
      materials: 'МАТЕРИАЛЫ И РЕФЕРЕНСЫ', details: 'ДОПОЛНИТЕЛЬНЫЕ ДЕТАЛИ',
      required: 'Заполните, пожалуйста, обязательные поля.', requiredCopy: 'Сначала заполните обязательные поля.',
      subject: 'Бриф на дизайн-проект', opening: 'Готово — открываю письмо с заполненным брифом.',
      copied: 'Ответы скопированы — их можно вставить в Telegram или письмо.', copyFail: 'Не удалось скопировать автоматически. Выделите ответы вручную.',
      videoHover: 'Наведи, чтобы посмотреть', videoTap: 'Нажми, чтобы посмотреть',
      videoPlay: 'Воспроизвести анимацию', videoPause: 'Остановить анимацию',
      videoWithSound: 'Продолжить со звуком', soundOn: 'Включить звук', soundOff: 'Выключить звук',
      audioOn: 'Звук включён', audioOff: 'Без звука'
    },
    en: {
      menuOpen: 'Open menu', menuClose: 'Close menu',
      briefTitle: 'DESIGN PROJECT BRIEF', name: 'Name / project', contact: 'Contact', service: 'Service',
      task: 'PROJECT AND TASK', audience: 'TARGET AUDIENCE', deadline: 'Preferred deadline', budget: 'Estimated budget',
      materials: 'MATERIALS AND REFERENCES', details: 'ADDITIONAL DETAILS',
      required: 'Please complete the required fields.', requiredCopy: 'Complete the required fields first.',
      subject: 'Design project brief', opening: 'Done — opening an email with your completed brief.',
      copied: 'Answers copied — you can paste them into Telegram or an email.', copyFail: 'Automatic copying failed. Please select and copy the answers manually.',
      videoHover: 'Hover to play', videoTap: 'Tap to play',
      videoPlay: 'Play animation', videoPause: 'Stop animation',
      videoWithSound: 'Continue with sound', soundOn: 'Turn sound on', soundOff: 'Mute sound',
      audioOn: 'Sound on', audioOff: 'Muted'
    },
    es: {
      menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
      briefTitle: 'BRIEF DE PROYECTO DE DISEÑO', name: 'Nombre / proyecto', contact: 'Contacto', service: 'Servicio',
      task: 'PROYECTO Y TAREA', audience: 'PÚBLICO OBJETIVO', deadline: 'Plazo deseado', budget: 'Presupuesto orientativo',
      materials: 'MATERIALES Y REFERENCIAS', details: 'DETALLES ADICIONALES',
      required: 'Completa los campos obligatorios.', requiredCopy: 'Completa primero los campos obligatorios.',
      subject: 'Brief de proyecto de diseño', opening: 'Listo: se abrirá un correo con el brief completado.',
      copied: 'Respuestas copiadas: puedes pegarlas en Telegram o en un correo.', copyFail: 'No se pudieron copiar automáticamente. Selecciona y copia las respuestas manualmente.',
      videoHover: 'Pasa el cursor para reproducir', videoTap: 'Toca para reproducir',
      videoPlay: 'Reproducir animación', videoPause: 'Detener animación',
      videoWithSound: 'Continuar con sonido', soundOn: 'Activar sonido', soundOff: 'Silenciar',
      audioOn: 'Sonido activado', audioOff: 'Sin sonido'
    }
  };
  const ui = interfaceText[pageLanguage] || interfaceText.ru;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.__motionFallback) {
    window.clearTimeout(window.__motionFallback);
  }

  function readyPage() {
    body.classList.add('page-loaded');
  }

  if (document.readyState === 'complete') {
    readyPage();
  } else {
    window.addEventListener('load', readyPage, { once: true });
    window.setTimeout(readyPage, 750);
  }

  function createPageWipe() {
    const wipe = document.createElement('div');
    wipe.className = 'page-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    body.appendChild(wipe);

    if (reducedMotion) return;

    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#')) return;
      if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch (_) {
        return;
      }

      const current = new URL(window.location.href);
      const sameDocument = destination.pathname === current.pathname && destination.search === current.search;
      if (sameDocument && destination.hash) return;

      const sameOrigin = destination.origin === current.origin || (destination.origin === 'null' && current.origin === 'null');
      if (!sameOrigin) return;

      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(function () {
        window.location.href = destination.href;
      }, 430);
    });
  }

  function addReveal(element, variant, delay) {
    if (!element || element.classList.contains('reveal')) return;
    element.classList.add('reveal', `reveal--${variant}`);
    if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`);
  }

  function setupReveals() {
    const groups = [
      { selector: '.project-card', variant: 'up', step: 95 },
      { selector: '.projects__all, .projects__count, .projects__count-arrow, .projects__caption', variant: 'fade', step: 70 },
      { selector: '.services__title', variant: 'up', step: 0 },
      { selector: '.services__price-link', variant: 'up', step: 0 },
      { selector: '.service', variant: 'up', step: 95 },
      { selector: '.approach__statement', variant: 'left', step: 0 },
      { selector: '.step', variant: 'right', step: 90 },
      { selector: '.direct h2, .direct__lead', variant: 'up', step: 80 },
      { selector: '.direct-card', variant: 'up', step: 85 },
      { selector: '.about__photo', variant: 'scale', step: 0 },
      { selector: '.about__title, .about__text', variant: 'right', step: 90 },
      { selector: '.about__tags span', variant: 'up', step: 75 },
      { selector: '.footer__logo-img, .footer__title, .footer__click, .footer__social-text, .footer__mail, .footer__socials', variant: 'up', step: 70 },
      { selector: '.portfolio-case img', variant: 'image', step: 0 },
      { selector: '.portfolio-case .portfolio-container:not(img)', variant: 'fade', step: 0 }
    ];

    groups.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (element, index) {
        addReveal(element, group.variant, Math.min(index * group.step, 360));
      });
    });

    document.querySelectorAll('.about__top-line, .footer__bottom-line').forEach(function (element) {
      addReveal(element, 'line-x', 0);
    });

    document.querySelectorAll('.direct__arrow').forEach(function (element, index) {
      addReveal(element, 'line-x', 120 + index * 110);
    });

    document.querySelectorAll('.approach__left-line, .footer__divider').forEach(function (element) {
      addReveal(element, 'line-y', 0);
    });

    const revealElements = Array.from(document.querySelectorAll('.reveal'));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.04,
      rootMargin: '0px 0px 0px 0px'
    });

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function setupScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    body.appendChild(progress);

    let ticking = false;
    function updateProgress() {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      progress.style.transform = `scaleX(${ratio})`;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }, { passive: true });

    updateProgress();
  }

  function setupHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || reducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    let frame = null;
    hero.addEventListener('pointermove', function (event) {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        hero.style.setProperty('--hero-x', x.toFixed(3));
        hero.style.setProperty('--hero-y', y.toFixed(3));
      });
    });

    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-x', '0');
      hero.style.setProperty('--hero-y', '0');
    });
  }

  function setupModal() {
    const openButton = document.getElementById('memeOpen');
    const modal = document.getElementById('memeModal');
    const closeButton = document.getElementById('memeClose');
    const closeBackground = document.getElementById('memeCloseBg');

    if (!openButton || !modal) return;

    function openModal() {
      modal.hidden = false;
      window.requestAnimationFrame(function () {
        modal.classList.add('is-open');
      });
      body.classList.add('modal-open');
      if (closeButton) closeButton.focus({ preventScroll: true });
    }

    function closeModal() {
      modal.classList.remove('is-open');
      body.classList.remove('modal-open');
      window.setTimeout(function () {
        modal.hidden = true;
      }, reducedMotion ? 0 : 260);
      openButton.focus({ preventScroll: true });
    }

    openButton.addEventListener('click', openModal);
    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (closeBackground) closeBackground.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  function setupHoverGlow() {
    if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.project-card, .service, .direct-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--hover-x', `${x}%`);
        card.style.setProperty('--hover-y', `${y}%`);
      });
    });
  }



  function setupDegreeCursor() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    const degree = document.createElement('div');
    degree.className = 'cursor-degree';
    degree.textContent = '°';
    degree.setAttribute('aria-hidden', 'true');
    body.appendChild(degree);
    root.classList.add('degree-cursor-active');

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let scale = 0.9;
    let targetScale = 0.9;
    let rotation = 0;
    let targetRotation = 0;
    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTrailX = -100;
    let lastTrailY = -100;
    let lastTrailTime = 0;
    let scrollTimer = 0;
    let inverted = false;

    function isDarkTarget(target) {
      return Boolean(target && target.closest(
        '.footer, .hero__red-block, .projects__right-bg, .meme-modal__bg, .page-wipe, .price-cta, .price-footer'
      ));
    }

    function render() {
      /* Fast enough to function as the actual cursor, but still soft. */
      currentX += (targetX - currentX) * 0.84;
      currentY += (targetY - currentY) * 0.84;
      scale += (targetScale - scale) * 0.34;
      rotation += (targetRotation - rotation) * 0.28;

      degree.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg) scale(${scale})`;
      frame = window.requestAnimationFrame(render);
    }

    function makeTrail(x, y, white) {
      const trail = document.createElement('span');
      trail.className = `cursor-trail-degree${white ? ' is-inverted' : ''}`;
      trail.textContent = '°';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.setAttribute('aria-hidden', 'true');
      body.appendChild(trail);
      trail.addEventListener('animationend', function () {
        trail.remove();
      }, { once: true });
    }

    function makeRipple(x, y, white) {
      const ripple = document.createElement('span');
      ripple.className = `cursor-click-ring${white ? ' is-inverted' : ''}`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.setAttribute('aria-hidden', 'true');
      body.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      }, { once: true });
    }

    function makeBurst(x, y, white) {
      const vectors = [
        [-25, -18, -34],
        [4, -32, 28],
        [25, -12, 52]
      ];

      vectors.forEach(function (vector, index) {
        const particle = document.createElement('span');
        particle.className = `cursor-click-degree${white ? ' is-inverted' : ''}`;
        particle.textContent = '°';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--burst-x', `${vector[0]}px`);
        particle.style.setProperty('--burst-y', `${vector[1]}px`);
        particle.style.setProperty('--burst-rotate', `${vector[2]}deg`);
        particle.style.animationDelay = `${index * 22}ms`;
        particle.setAttribute('aria-hidden', 'true');
        body.appendChild(particle);
        particle.addEventListener('animationend', function () {
          particle.remove();
        }, { once: true });
      });
    }

    document.addEventListener('pointermove', function (event) {
      const now = performance.now();
      const velocityX = event.clientX - lastX;
      const velocityY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      targetX = event.clientX;
      targetY = event.clientY;
      targetRotation = Math.max(-18, Math.min(18, velocityX * 0.8 + velocityY * 0.16));

      inverted = isDarkTarget(event.target);
      degree.classList.add('is-visible');
      degree.classList.toggle('is-inverted', inverted);

      const travelled = Math.hypot(event.clientX - lastTrailX, event.clientY - lastTrailY);
      if (travelled > 24 && now - lastTrailTime > 46) {
        makeTrail(event.clientX, event.clientY, inverted);
        lastTrailX = event.clientX;
        lastTrailY = event.clientY;
        lastTrailTime = now;
      }
    }, { passive: true });

    document.addEventListener('pointerover', function (event) {
      if (!event.target.closest('a, button, [role="button"]')) return;
      degree.classList.add('is-interactive');
      targetScale = 1.28;
      targetRotation = 10;
    });

    document.addEventListener('pointerout', function (event) {
      if (!event.target.closest('a, button, [role="button"]')) return;
      degree.classList.remove('is-interactive');
      targetScale = 0.9;
      targetRotation = 0;
    });

    document.addEventListener('pointerdown', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      degree.classList.add('is-pressed');
      targetScale = 0.68;
      const white = isDarkTarget(event.target);
      makeRipple(event.clientX, event.clientY, white);
      makeBurst(event.clientX, event.clientY, white);
    });

    document.addEventListener('pointerup', function (event) {
      degree.classList.remove('is-pressed');
      targetScale = event.target.closest('a, button, [role="button"]') ? 1.28 : 0.9;
    });

    window.addEventListener('scroll', function () {
      degree.classList.add('is-scrolling');
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        degree.classList.remove('is-scrolling');
      }, 160);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      degree.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
      degree.classList.add('is-visible');
    });

    window.addEventListener('blur', function () {
      degree.classList.remove('is-visible');
    });

    frame = window.requestAnimationFrame(render);

    window.addEventListener('pagehide', function () {
      root.classList.remove('degree-cursor-active');
      if (frame) window.cancelAnimationFrame(frame);
    }, { once: true });
  }

  function setupViscousScroll() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    root.classList.add('viscous-scroll-active');

    let current = window.scrollY;
    let target = current;
    let frame = 0;
    let animating = false;
    let lastTime = 0;

    function maxScroll() {
      return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    }

    function clamp(value) {
      return Math.min(Math.max(value, 0), maxScroll());
    }

    function normalizedDelta(event) {
      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= window.innerHeight;
      return Math.max(-170, Math.min(170, delta));
    }

    function hasScrollableParent(node, delta) {
      let element = node instanceof Element ? node : null;
      while (element && element !== body && element !== document.documentElement) {
        const style = window.getComputedStyle(element);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
        if (canScroll) {
          const canMoveDown = delta > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1;
          const canMoveUp = delta < 0 && element.scrollTop > 1;
          if (canMoveDown || canMoveUp) return true;
        }
        element = element.parentElement;
      }
      return false;
    }

    function animate(time) {
      if (!lastTime) lastTime = time;
      const dt = Math.min(Math.max(time - lastTime, 1), 34);
      lastTime = time;

      const distance = target - current;
      /* Time-based exponential easing: intentionally viscous, never jerky. */
      const alpha = 1 - Math.exp(-dt / 220);
      current += distance * alpha;

      if (Math.abs(distance) < 0.24) {
        current = target;
        window.scrollTo(0, current);
        animating = false;
        frame = 0;
        lastTime = 0;
        return;
      }

      window.scrollTo(0, current);
      frame = window.requestAnimationFrame(animate);
    }

    function begin() {
      if (animating) return;
      animating = true;
      lastTime = 0;
      frame = window.requestAnimationFrame(animate);
    }

    function moveBy(amount) {
      if (!animating) {
        current = window.scrollY;
        target = current;
      }
      target = clamp(target + amount);
      begin();
    }

    function moveTo(position) {
      current = window.scrollY;
      target = clamp(position);
      begin();
    }

    window.addEventListener('wheel', function (event) {
      if (event.defaultPrevented || event.ctrlKey || body.classList.contains('modal-open')) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const delta = normalizedDelta(event);
      if (!delta || hasScrollableParent(event.target, delta)) return;

      event.preventDefault();
      moveBy(delta * 1.18);
    }, { passive: false });

    document.addEventListener('keydown', function (event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (body.classList.contains('modal-open')) return;
      if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;

      let amount = 0;
      if (event.key === 'ArrowDown') amount = 118;
      else if (event.key === 'ArrowUp') amount = -118;
      else if (event.key === 'PageDown') amount = window.innerHeight * .82;
      else if (event.key === 'PageUp') amount = -window.innerHeight * .82;
      else if (event.key === ' ' && !event.shiftKey) amount = window.innerHeight * .78;
      else if (event.key === ' ' && event.shiftKey) amount = -window.innerHeight * .78;
      else if (event.key === 'Home') {
        event.preventDefault();
        moveTo(0);
        return;
      } else if (event.key === 'End') {
        event.preventDefault();
        moveTo(maxScroll());
        return;
      } else {
        return;
      }

      event.preventDefault();
      moveBy(amount);
    });

    window.addEventListener('scroll', function () {
      if (animating) return;
      current = window.scrollY;
      target = current;
    }, { passive: true });

    window.addEventListener('resize', function () {
      target = clamp(target);
      current = clamp(current);
    }, { passive: true });

    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      let destination;
      try {
        destination = document.querySelector(hash);
      } catch (_) {
        return;
      }
      if (!destination) return;

      event.preventDefault();
      const margin = parseFloat(window.getComputedStyle(destination).scrollMarginTop) || 0;
      moveTo(destination.getBoundingClientRect().top + window.scrollY - margin);
      window.history.pushState(null, '', hash);
    });

    window.addEventListener('pagehide', function () {
      if (frame) window.cancelAnimationFrame(frame);
    }, { once: true });
  }

  function setupMagneticElements() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    const selector = [
      '.hero__button',
      '.nav__contact',
      '.projects__all',
      '.projects__count-arrow',
      '.portfolio-back',
      '.footer__click',
      '.footer__socials a'
    ].join(', ');

    document.querySelectorAll(selector).forEach(function (element) {
      element.classList.add('motion-magnetic');

      element.addEventListener('pointermove', function (event) {
        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
        element.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`);
        element.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`);
      });

      element.addEventListener('pointerleave', function () {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
      });
    });
  }

  function setupKineticDetails() {
    /* Remove the free-floating decorative degrees from v4. They looked like
       accidental cursor remnants in the hero whitespace. */
    document.querySelectorAll('.motion-degree-accent').forEach(function (element) {
      element.remove();
    });

    if (reducedMotion) return;

    const hero = document.querySelector('.hero');
    if (hero && !hero.querySelector('.motion-hero-rail')) {
      const rail = document.createElement('span');
      rail.className = 'motion-hero-rail';
      rail.setAttribute('aria-hidden', 'true');
      hero.appendChild(rail);

      const frame = document.createElement('span');
      frame.className = 'motion-photo-frame';
      frame.setAttribute('aria-hidden', 'true');
      hero.appendChild(frame);
    }

    const portfolioHero = document.querySelector('.portfolio-hero');
    if (portfolioHero) portfolioHero.classList.add('motion-portfolio-hero');
  }

  function setupTiltDetails() {
    /* Pointer-follow tilt looked lively, but on large images it created visible
       jitter. Keep image motion predictable: reveal + a calm hover zoom only. */
    document.querySelectorAll('.motion-tilt').forEach(function (element) {
      element.classList.remove('motion-tilt');
      element.style.removeProperty('--motion-tilt-r');
      element.style.removeProperty('--motion-tilt-x');
      element.style.removeProperty('--motion-tilt-y');
    });
  }

  function setupActiveSections() {
    if (!('IntersectionObserver' in window)) return;

    const sections = Array.from(document.querySelectorAll(
      '.projects, .services, .approach, .about, .footer, .portfolio-case'
    ));
    if (!sections.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('motion-section-active', entry.isIntersecting);
      });
    }, {
      threshold: .18,
      rootMargin: '-18% 0px -44% 0px'
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function setupDesktopCanvasScale() {
    const stage = document.getElementById('stage');
    const canvas = document.getElementById('canvas');
    if (!stage || !canvas) return;

    const desktop = window.matchMedia('(min-width: 1101px)');
    let resizeFrame = 0;

    function applyScale() {
      resizeFrame = 0;
      if (!desktop.matches) {
        root.style.setProperty('--scale', '1');
        stage.style.height = '';
        return;
      }

      /* clientWidth excludes the vertical scrollbar in Firefox and avoids
         the blank/right-overflow strip caused by 100vw. */
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 1440;
      const scale = viewportWidth / 1440;
      const canvasHeight = canvas.offsetHeight || 4649;
      root.style.setProperty('--scale', String(scale));
      stage.style.height = `${canvasHeight * scale}px`;
    }

    function scheduleScale() {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(applyScale);
    }

    applyScale();
    window.addEventListener('resize', scheduleScale, { passive: true });
    window.addEventListener('orientationchange', scheduleScale, { passive: true });
    if (desktop.addEventListener) desktop.addEventListener('change', scheduleScale);
    else desktop.addListener(scheduleScale);

    window.addEventListener('pagehide', function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    }, { once: true });
  }



  function setupLanguageSwitcher() {
    const hash = window.location.hash;
    document.querySelectorAll('[data-lang-link]').forEach(function (link) {
      link.addEventListener('click', function () {
        try {
          localStorage.setItem('anostosio_language', link.getAttribute('lang') || 'ru');
        } catch (_) {}
      });

      if (hash && link.getAttribute('href').includes('portfolio.html')) {
        link.setAttribute('href', link.getAttribute('href').split('#')[0] + hash);
      }
    });
  }

  function setupBackToTop() {
    const labels = { ru: 'Наверх', en: 'Back to top', es: 'Volver arriba' };
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', labels[pageLanguage] || labels.ru);
    button.setAttribute('title', labels[pageLanguage] || labels.ru);
    button.innerHTML = '<span aria-hidden="true">↑</span>';
    document.body.appendChild(button);

    let ticking = false;
    function update() {
      button.classList.toggle('is-visible', window.scrollY > 520);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    update();
  }

  function setupMobileNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    const desktop = window.matchMedia('(min-width: 1101px)');

    function setOpen(open) {
      body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? ui.menuClose : ui.menuOpen);
    }

    toggle.addEventListener('click', function () {
      setOpen(!body.classList.contains('nav-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!body.classList.contains('nav-open')) return;
      if (event.target.closest('.header')) return;
      setOpen(false);
    });

    function handleBreakpoint(event) {
      if (event.matches) setOpen(false);
    }

    if (desktop.addEventListener) desktop.addEventListener('change', handleBreakpoint);
    else desktop.addListener(handleBreakpoint);
  }

  function setupBriefForm() {
    const form = document.getElementById('projectBrief');
    if (!form) return;

    const copyButton = document.getElementById('briefCopy');
    const status = document.getElementById('briefStatus');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    function value(name) {
      const field = form.elements.namedItem(name);
      return field && typeof field.value === 'string' ? field.value.trim() : '';
    }

    function buildText() {
      const lines = [
        ui.briefTitle,
        '',
        `${ui.name}: ${value('name') || '—'}`,
        `${ui.contact}: ${value('contact') || '—'}`,
        `${ui.service}: ${value('service') || '—'}`,
        '',
        ui.task,
        value('task') || '—',
        '',
        ui.audience,
        value('audience') || '—',
        '',
        `${ui.deadline}: ${value('deadline') || '—'}`,
        `${ui.budget}: ${value('budget') || '—'}`,
        '',
        ui.materials,
        value('materials') || '—',
        '',
        ui.details,
        value('details') || '—'
      ];
      return lines.join('\n');
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }

    function markValidity() {
      fields.forEach(function (field) {
        field.setAttribute('aria-invalid', String(!field.validity.valid));
      });
    }

    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        field.setAttribute('aria-invalid', String(!field.validity.valid));
        setStatus('');
      });
      field.addEventListener('change', function () {
        field.setAttribute('aria-invalid', String(!field.validity.valid));
        setStatus('');
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      markValidity();
      if (!form.checkValidity()) {
        form.reportValidity();
        const invalid = form.querySelector(':invalid');
        if (invalid) invalid.focus();
        setStatus(ui.required);
        return;
      }

      const subject = `${ui.subject} — ${value('name')}`;
      const mailto = `mailto:Anostosio@yandex.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildText())}`;
      setStatus(ui.opening);
      window.location.href = mailto;
    });

    if (copyButton) {
      copyButton.addEventListener('click', async function () {
        markValidity();
        if (!form.checkValidity()) {
          form.reportValidity();
          const invalid = form.querySelector(':invalid');
          if (invalid) invalid.focus();
          setStatus(ui.requiredCopy);
          return;
        }

        const text = buildText();
        try {
          await navigator.clipboard.writeText(text);
          setStatus(ui.copied);
        } catch (_) {
          const helper = document.createElement('textarea');
          helper.value = text;
          helper.setAttribute('readonly', '');
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.appendChild(helper);
          helper.select();
          const copied = document.execCommand('copy');
          helper.remove();
          setStatus(copied ? ui.copied : ui.copyFail);
        }
      });
    }
  }

  function setupMotionPlayers() {
    const players = document.querySelectorAll('[data-motion-player]');
    if (!players.length) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    players.forEach(function (player) {
      const video = player.querySelector('video');
      if (!video) return;

      const hasAudio = player.dataset.hasAudio === 'true';
      const previewTime = Number.parseFloat(video.dataset.previewTime || '0.001');
      let pinned = false;

      video.controls = false;
      video.removeAttribute('controls');
      video.muted = true;

      function revealNativePreview() {
        /*
         * Once the first real frame is available, remove the temporary poster.
         * The idle preview and the playing state are then rendered by the same
         * video element with identical sizing and object-fit rules.
         */
        const finish = function () {
          if (video.poster) video.removeAttribute('poster');
        };

        if (Math.abs(video.currentTime - previewTime) < 0.02) {
          finish();
          return;
        }

        video.addEventListener('seeked', finish, { once: true });
        try {
          video.currentTime = previewTime;
        } catch (_) {
          finish();
        }
      }

      if (video.readyState >= 2) {
        revealNativePreview();
      } else {
        video.addEventListener('loadeddata', revealNativePreview, { once: true });
      }

      const trigger = document.createElement('button');
      trigger.className = 'motion-player__trigger';
      trigger.type = 'button';

      const playIcon = document.createElement('span');
      playIcon.className = 'motion-player__play';
      playIcon.setAttribute('aria-hidden', 'true');

      const hint = document.createElement('span');
      hint.className = 'motion-player__hint';
      hint.textContent = finePointer && !reducedMotion ? ui.videoHover : ui.videoTap;

      trigger.append(playIcon, hint);
      player.appendChild(trigger);

      let soundButton = null;
      let soundText = null;

      if (hasAudio) {
        soundButton = document.createElement('button');
        soundButton.className = 'motion-player__sound';
        soundButton.type = 'button';
        soundButton.innerHTML = [
          '<svg aria-hidden="true" viewBox="0 0 24 24">',
          '<path d="M4 9v6h4l5 4V5L8 9H4"></path>',
          '<path class="motion-player__waves" d="M16 9c1.2 1.4 1.2 4.6 0 6M18.7 6.7c2.8 3 2.8 7.6 0 10.6"></path>',
          '<path class="motion-player__mute" d="m17.2 9.2 4.6 4.6m0-4.6-4.6 4.6"></path>',
          '</svg>'
        ].join('');

        soundText = document.createElement('span');
        soundText.className = 'visually-hidden';
        soundButton.appendChild(soundText);
        player.appendChild(soundButton);
      }

      function isPlaying() {
        return !video.paused && !video.ended;
      }

      function updatePlayer() {
        const playing = isPlaying();
        player.classList.toggle('is-playing', playing);
        player.classList.toggle('is-pinned', pinned);
        player.classList.toggle('is-muted', video.muted);

        if (playing && finePointer && !pinned && hasAudio) {
          trigger.setAttribute('aria-label', ui.videoWithSound);
        } else {
          trigger.setAttribute('aria-label', playing ? ui.videoPause : ui.videoPlay);
        }

        hint.textContent = playing ? ui.videoPause : (finePointer && !reducedMotion ? ui.videoHover : ui.videoTap);

        if (soundButton && soundText) {
          const label = video.muted ? ui.soundOn : ui.soundOff;
          soundButton.setAttribute('aria-label', label);
          soundButton.title = label;
          soundText.textContent = video.muted ? ui.audioOff : ui.audioOn;
        }
      }

      function resetPlayer() {
        pinned = false;
        video.pause();
        video.muted = true;
        try {
          video.currentTime = previewTime;
        } catch (_) {
          /* Metadata may not be available yet; the poster still remains visible. */
        }
        updatePlayer();
      }

      async function playVideo(withSound, keepPlaying) {
        pinned = keepPlaying;
        video.muted = !(withSound && hasAudio);

        if (video.paused && Math.abs(video.currentTime - previewTime) < 0.08) {
          try {
            video.currentTime = 0;
          } catch (_) {
            /* Playback still starts from the nearest available frame. */
          }
        }

        try {
          await video.play();
        } catch (_) {
          video.muted = true;
          try {
            await video.play();
          } catch (_) {
            pinned = false;
          }
        }

        updatePlayer();
      }

      if (finePointer && !reducedMotion) {
        player.addEventListener('pointerenter', function (event) {
          if (event.pointerType === 'touch' || pinned) return;
          playVideo(false, false);
        });

        player.addEventListener('pointerleave', function (event) {
          if (event.pointerType === 'touch' || pinned) return;
          resetPlayer();
        });
      }

      trigger.addEventListener('click', function () {
        if (pinned || (!finePointer && isPlaying())) {
          resetPlayer();
          return;
        }

        playVideo(hasAudio, true);
      });

      if (soundButton) {
        soundButton.addEventListener('click', function (event) {
          event.stopPropagation();

          if (!isPlaying()) {
            playVideo(true, true);
            return;
          }

          pinned = true;
          video.muted = !video.muted;
          updatePlayer();
        });
      }

      video.addEventListener('play', updatePlayer);
      video.addEventListener('pause', updatePlayer);
      video.addEventListener('volumechange', updatePlayer);
      video.addEventListener('error', function () {
        player.classList.add('has-error');
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) resetPlayer();
      });

      updatePlayer();
    });
  }


  setupLanguageSwitcher();
  setupBackToTop();
  setupDesktopCanvasScale();
  setupMobileNavigation();
  setupBriefForm();
  createPageWipe();
  setupReveals();
  setupScrollProgress();
  setupHeroParallax();
  setupModal();
  setupHoverGlow();
  setupDegreeCursor();
  setupViscousScroll();
  setupMagneticElements();
  setupKineticDetails();
  setupTiltDetails();
  setupActiveSections();
  setupMotionPlayers();

  root.classList.add('motion-active');
}());
