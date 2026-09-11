import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homeCopy, navigation, projects, site } from '../lab/data/projects.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['ru', 'en', 'es'];

const caseLabels = {
  ru: { overview: 'О ПРОДУКТЕ', problem: 'КОНТЕКСТ / ПРОБЛЕМА', solution: 'ИДЕЯ / РЕШЕНИЕ', product: 'PRODUCT', ux: 'UX / UI', role: 'МОЯ РОЛЬ', stack: 'STACK', result: 'РЕЗУЛЬТАТ', verified: 'ПОДТВЕРЖДЕНО ИСХОДНИКАМИ', page: 'CASE STUDY' },
  en: { overview: 'PRODUCT OVERVIEW', problem: 'CONTEXT / PROBLEM', solution: 'IDEA / SOLUTION', product: 'PRODUCT', ux: 'UX / UI', role: 'MY ROLE', stack: 'STACK', result: 'RESULT', verified: 'VERIFIED FROM SOURCE', page: 'CASE STUDY' },
  es: { overview: 'PRODUCTO', problem: 'CONTEXTO / PROBLEMA', solution: 'IDEA / SOLUCIÓN', product: 'PRODUCTO', ux: 'UX / UI', role: 'MI PAPEL', stack: 'STACK', result: 'RESULTADO', verified: 'VERIFICADO EN EL PROYECTO', page: 'CASO' }
};

function localePrefix(locale) {
  return locale === 'ru' ? '' : `${locale}/`;
}

function outputPath(locale, slug = '') {
  const base = path.join(root, localePrefix(locale), 'lab');
  return slug ? path.join(base, 'projects', slug, 'index.html') : path.join(base, 'index.html');
}

function relativeRoot(file) {
  const rel = path.relative(path.dirname(file), root).replaceAll(path.sep, '/');
  return rel ? `${rel}/` : './';
}

function route(locale, slug = '') {
  const prefix = locale === 'ru' ? '' : `/${locale}`;
  return slug ? `${prefix}/lab/projects/${slug}/` : `${prefix}/lab/`;
}

function designRoute(locale) {
  return locale === 'ru' ? '/' : `/${locale}/`;
}

function legalRoute(locale, file) {
  return locale === 'ru' ? `/${file}.html` : `/${locale}/${file}.html`;
}

function alternates(slug = '') {
  return locales.map((locale) => `<link rel="alternate" hreflang="${locale}" href="https://anostosio.ru${route(locale, slug)}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="https://anostosio.ru${route('en', slug)}">`;
}

function head({ locale, title, description, slug = '', file, project = null }) {
  const prefix = relativeRoot(file);
  const canonical = `https://anostosio.ru${route(locale, slug)}`;
  const schema = project ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: canonical,
    author: { '@type': 'Person', name: 'Anastasia Kravtsova', url: 'https://anostosio.ru/' },
    dateCreated: project.year,
    inLanguage: locale,
    description
  } : {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Anostosio° Product Lab',
    url: canonical,
    author: { '@type': 'Person', name: 'Anastasia Kravtsova', url: 'https://anostosio.ru/' },
    inLanguage: locale,
    description
  };

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
${alternates(slug)}
<meta name="theme-color" content="#190403">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="Anostosio°">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${prefix}lab/lab.css">
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
<script defer src="${prefix}lab/lab.js"></script>
<script defer src="${prefix}metrika-consent.js"></script>
</head>`;
}

function header(locale, detail = false) {
  const n = navigation[locale];
  const langLinks = locales.map((code) => {
    const currentSlug = detail.slug || '';
    const active = code === locale ? ' class="is-active" aria-current="page"' : '';
    return `<a href="${route(code, currentSlug)}" lang="${code}" hreflang="${code}" data-lang-link${active}>${code.toUpperCase()}</a>`;
  }).join('<span aria-hidden="true">/</span>');

  const centerNav = detail
    ? `<a href="${route(locale)}">${n.backLab}</a>`
    : `<a href="#projects">${n.projects}</a><a href="#method">${n.method}</a><a href="#skills">${n.skills}</a>`;

  return `<header class="lab-header">
  <a class="lab-brand" href="${route(locale)}" aria-label="Anostosio Product Lab">ANOSTOSIO<span>°</span></a>
  <nav class="direction-switch" aria-label="Portfolio direction"><a href="${designRoute(locale)}">${n.design}</a><span>/</span><a class="is-active" href="${route(locale)}">${n.lab}</a></nav>
  <button class="lab-menu" type="button" aria-expanded="false" aria-controls="labNav" aria-label="${n.menuOpen}"><span></span><span></span></button>
  <nav class="lab-nav" id="labNav" aria-label="Product Lab navigation">${centerNav}<a href="${site.cvUrl}" download data-analytics="cv_download">${n.cv}</a><a href="#contact" data-analytics="contact_click">${n.contact}</a></nav>
  <nav class="lab-languages" aria-label="Language selector">${langLinks}</nav>
</header>`;
}

function footer(locale) {
  const n = navigation[locale];
  const contactLabels = {
    ru: ['СВЯЗАТЬСЯ', '@Anostosio во всех социальных сетях', 'Контактные данные', 'Социальные сети'],
    en: ['GET IN TOUCH', '@Anostosio on all social platforms', 'Contact details', 'Social links'],
    es: ['CONTACTAR', '@Anostosio en todas las redes sociales', 'Datos de contacto', 'Redes sociales']
  }[locale];
  return `<footer class="lab-footer" id="contact">
  <div><a class="lab-footer__brand" href="${route(locale)}">A<span>°</span></a><p>${n.footer}</p></div>
  <section class="lab-footer__contact" aria-label="${contactLabels[2]}"><p>${contactLabels[0]}</p><span>${contactLabels[1]}</span><a class="lab-footer__mail" href="mailto:${site.email}">${site.email} <i>↗</i></a><nav class="lab-footer__socials" aria-label="${contactLabels[3]}"><a aria-label="HeadHunter" href="${site.hh}" target="_blank" rel="noopener noreferrer">hh</a><a aria-label="VK" href="${site.vk}" target="_blank" rel="noopener noreferrer">vk</a><a aria-label="Telegram" href="${site.telegram}" target="_blank" rel="noopener noreferrer">tg</a></nav></section>
  <nav class="lab-footer__nav"><a href="${designRoute(locale)}">${n.design}</a><a href="${route(locale)}">${n.lab}</a><a href="${legalRoute(locale, 'privacy')}">${n.privacy}</a><a href="${legalRoute(locale, 'legal')}">${n.legal}</a></nav>
  <p>© ${site.year} ANOSTOSIO°</p>
</footer>`;
}

function projectCard(project, locale) {
  const c = project.copy[locale];
  const n = navigation[locale];
  const image = project.cover
    ? `<figure class="product-card__visual"><div class="browser-bar"><i></i><i></i><i></i><span>${project.liveUrl.replace(/^https?:\/\//, '')}</span></div><img src="${project.cover}" alt="${project.title} interface" width="1600" height="1000" loading="lazy" decoding="async"></figure>`
    : `<div class="product-card__placeholder" aria-hidden="true"><span>OUR</span><span>WISH</span><span>LIST°</span><i>@</i></div>`;
  const primary = project.caseStudyEnabled
    ? `<a class="button button--light" href="${route(locale, project.slug)}" data-analytics="project_open">${n.caseStudy} <span>↗</span></a>`
    : `<a class="button button--light" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" data-analytics="telegram_bot_click">${n.openBot}</a>`;

  return `<article class="product-card product-card--${project.slug}">
    <div class="product-card__head"><span>${project.index}°</span><span>${project.productStatus}</span>${project.caseStudyStatus ? `<span>${n.soon}</span>` : ''}</div>
    <div class="product-card__copy"><p>${c.cardType}</p><h3>${project.shortTitle}</h3><p>${c.cardDescription}</p></div>
    ${image}
    <div class="product-card__foot"><div>${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>${primary}</div>
  </article>`;
}

function renderHome(locale, file) {
  const c = homeCopy[locale];
  const n = navigation[locale];
  return `${head({ locale, title: c.title, description: c.description, file })}
<body class="lab-body">
<a class="skip-link" href="#main">Skip to content</a>
${header(locale)}
<main id="main">
  <section class="lab-hero" aria-labelledby="lab-title">
    <p class="eyebrow">${c.eyebrow}</p>
    <h1 id="lab-title"><span>${c.heroA}</span><span>${c.heroB}</span><span>${c.heroC}<b>°</b></span></h1>
    <div class="lab-hero__meta"><p>${c.disciplines}</p><p>${c.lead}</p></div>
    <div class="lab-hero__actions"><a class="button button--dark" href="#projects">${c.viewProjects} <span>↓</span></a><a class="button" href="${site.cvUrl}" download data-analytics="cv_download">${n.downloadCv}</a></div>
    <div class="lab-hero__index"><span>${c.indexLabel}</span><i></i><span>01 / 04</span></div>
    <p class="lab-hero__statement">${c.statement}</p>
  </section>
  <section class="lab-projects" id="projects" aria-labelledby="projects-title">
    <div class="section-intro"><p class="eyebrow">${c.projectsEyebrow}</p><h2 id="projects-title">${c.projectsTitle}</h2><p>${c.projectsIntro}</p></div>
    <div class="project-grid">${projects.map((project) => projectCard(project, locale)).join('\n')}</div>
  </section>
  <section class="lab-method" id="method" aria-labelledby="method-title">
    <div class="section-intro section-intro--dark"><p class="eyebrow">${c.methodEyebrow}</p><h2 id="method-title">${c.methodTitle}</h2><p>${c.methodIntro}</p></div>
    <ol class="method-grid">${c.steps.map(([num, title, text]) => `<li><span>${num}°</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>
  </section>
  <section class="lab-skills" id="skills" aria-labelledby="skills-title">
    <div class="section-intro"><p class="eyebrow">${c.skillsEyebrow}</p><h2 id="skills-title">${c.skillsTitle}</h2></div>
    <div class="skill-groups">${c.skillGroups.map(([title, items], index) => `<article><span>0${index + 1}°</span><h3>${title}</h3><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul></article>`).join('')}</div>
  </section>
  <section class="lab-cv" aria-labelledby="cv-title"><div><p class="eyebrow">${c.cvEyebrow}</p><h2 id="cv-title">${c.cvTitle}</h2></div><div><p>${c.cvText}</p><a class="button button--light" href="${site.cvUrl}" download data-analytics="cv_download">${n.downloadCv}</a></div></section>
  <section class="lab-contact" aria-labelledby="contact-title"><p class="eyebrow">${c.contactEyebrow}</p><h2 id="contact-title">${c.contactTitle}</h2><p>${c.contactText}</p><div><a href="mailto:${site.email}">${site.email} ↗</a><a href="${site.telegram}" target="_blank" rel="noopener noreferrer">TELEGRAM ↗</a></div></section>
</main>
${footer(locale)}
</body>
</html>`;
}

function actionLinks(project, locale) {
  const n = navigation[locale];
  const links = [];
  if (project.liveUrl) links.push(`<a class="button button--dark" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" data-analytics="${project.slug === 'ourwishlist' ? 'telegram_bot_click' : 'live_project_click'}">${project.slug === 'ourwishlist' ? n.openBot : n.openProduct}</a>`);
  if (project.githubUrl) links.push(`<a class="button" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" data-analytics="github_click">${n.github}</a>`);
  return links.join('');
}

function detailHero(project, locale) {
  const c = project.copy[locale];
  const labels = caseLabels[locale];
  return `<section class="case-hero">
    <div class="case-hero__meta"><span>PRODUCT ${project.index}</span><span>${labels.page}</span><span>${project.year}</span></div>
    <p class="eyebrow">${c.cardType}</p><h1>${project.shortTitle}</h1><p class="case-hero__lead">${c.subtitle}</p>
    <div class="case-hero__actions">${actionLinks(project, locale)}</div>
    <dl><div><dt>STATUS</dt><dd>${project.productStatus}</dd></div>${c.role ? `<div><dt>ROLE</dt><dd>${c.role}</dd></div>` : ''}<div><dt>CASE</dt><dd>${project.contentReady ? labels.verified : navigation[locale].soon}</dd></div></dl>
  </section>`;
}

function fullCase(project, locale) {
  const c = project.copy[locale];
  const l = caseLabels[locale];
  const secondary = project.secondaryImage ? `<figure class="case-shot case-shot--secondary"><img src="${project.secondaryImage}" alt="${project.title} result interface" width="1600" height="1000" loading="lazy" decoding="async"></figure>` : '';
  return `${detailHero(project, locale)}
  <figure class="case-shot"><div class="browser-bar"><i></i><i></i><i></i><span>${project.liveUrl.replace(/^https?:\/\//, '')}</span></div><img src="${project.cover}" alt="${project.title} interface" width="1600" height="1000" loading="eager" decoding="async"></figure>
  <section class="case-split"><p class="eyebrow">${l.problem}</p><div><h2>${c.problemTitle}<span>°</span></h2><p>${c.problem}</p></div></section>
  <section class="case-split case-split--accent"><p class="eyebrow">${l.solution}</p><div><h2>${c.solutionTitle}<span>°</span></h2><p>${c.solution}</p></div></section>
  <section class="case-product"><div class="section-intro"><p class="eyebrow">${l.product}</p><h2>${c.featureTitle}<span>°</span></h2></div><div class="feature-grid">${c.features.map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  ${secondary}
  <section class="case-split"><p class="eyebrow">${l.ux}</p><div><h2>${c.uxTitle}<span>°</span></h2><p>${c.ux}</p></div></section>
  <section class="case-ai"><div><p class="eyebrow">AI / HUMAN</p><h2>${c.aiTitle}<span>°</span></h2><p>${c.aiIntro}</p></div><ol>${c.aiSteps.map(([title, text], index) => `<li><span>0${index + 1}°</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol></section>
  <section class="case-stack"><p class="eyebrow">${l.stack}</p><div>${c.stack.map((item) => `<span>${item}</span>`).join('')}</div></section>
  <section class="case-result"><p class="eyebrow">${l.result}</p><div><h2>${c.resultTitle}<span>°</span></h2><p>${c.result}</p><p class="case-result__role"><strong>${l.role}</strong><br>${c.contribution}</p><div class="case-hero__actions">${actionLinks(project, locale)}</div></div></section>`;
}

function placeholderCase(project, locale) {
  const c = project.copy[locale];
  return `${detailHero(project, locale)}
  <section class="placeholder-case">
    <div class="placeholder-case__mark" aria-hidden="true"><span>OUR</span><span>WISH</span><span>LIST°</span><i>@</i></div>
    <div><p class="eyebrow">${project.caseStudyStatus}</p><h2>${c.placeholder}<span>°</span></h2><p>${c.placeholderText}</p><p class="placeholder-case__note">${c.materials}</p><div class="case-hero__actions">${actionLinks(project, locale)}</div></div>
  </section>`;
}

function renderProject(project, locale, file) {
  const c = project.copy[locale];
  const n = navigation[locale];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return `${head({ locale, title: `${project.title} — Anostosio° Product Lab`, description: c.metaDescription, slug: project.slug, file, project })}
<body class="lab-body case-body">
<a class="skip-link" href="#main">Skip to content</a>
${header(locale, project)}
<main id="main" class="case-main">${project.caseStudyEnabled ? fullCase(project, locale) : placeholderCase(project, locale)}
  <nav class="case-next" aria-label="${n.nextProject}"><a href="${route(locale, next.slug)}"><span>${n.nextProject}</span><strong>${next.shortTitle}</strong><i>↗</i></a><a href="${route(locale)}#projects">${n.allProjects}</a></nav>
</main>
${footer(locale)}
</body>
</html>`;
}

for (const locale of locales) {
  const homeFile = outputPath(locale);
  await mkdir(path.dirname(homeFile), { recursive: true });
  await writeFile(homeFile, renderHome(locale, homeFile));
  for (const project of projects) {
    const file = outputPath(locale, project.slug);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, renderProject(project, locale, file));
  }
}

console.log(`Generated ${locales.length * (projects.length + 1)} Product Lab pages.`);
