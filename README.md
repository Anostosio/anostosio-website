# Anostosio° Portfolio Website

A multilingual portfolio website for **Anostosio°**, a graphic designer focused on branding, visual communication, advertising materials, and digital design.

**Live:** https://anostosio.ru/

## About

This project is my personal portfolio and professional presentation website. I designed the visual system, organized the content, prepared the assets, and built the site as a static web project.

The website is also the starting point of my transition from graphic design toward **AI-assisted product building, web development, and vibe coding**.

## What I worked on

- Visual direction and interface design
- Information architecture and page structure
- Responsive layout behavior
- Portfolio presentation and content organization
- Asset preparation and optimization
- Russian, English, and Spanish versions
- Language switching with saved browser preference
- SEO metadata, Open Graph, canonical and `hreflang` links
- Structured data with Schema.org JSON-LD
- Sitemap and robots configuration
- Basic security / caching headers for compatible static hosting
- Analytics consent logic

## Tech

- HTML5
- CSS3
- Vanilla JavaScript
- Static hosting architecture — no build step required
- WebP assets
- Schema.org / JSON-LD
- Open Graph / Twitter metadata
- Yandex Metrica consent handling

## Project structure

```text
/
├── index.html              # Main page — Russian
├── portfolio.html          # Portfolio
├── price.html              # Services / pricing
├── brief.html              # Client brief
├── cv.html                 # CV page
├── en/                     # English version
├── es/                     # Spanish version
├── assets/                 # Images, portfolio assets and CV files
├── fonts/                  # Local font files used by the website
├── style.css               # Main styles
├── metrika-consent.js      # Analytics consent logic
├── sitemap.xml
├── robots.txt
├── site.webmanifest
└── _headers                 # Static-host security / cache headers
```

## Multilingual behavior

The site supports:

- Russian — `/`
- English — `/en/`
- Spanish — `/es/`

The home page detects the browser language and can redirect to the corresponding language version. The selected language is stored locally so the preference can be reused on later visits.

## Deployment

This is a static website. It can be deployed without a build process to services such as GitHub Pages, Netlify, Cloudflare Pages, or a traditional static web host.

The production version is available at:

**https://anostosio.ru/**

## What I learned

Building and maintaining this website moved my work beyond static graphic design into a complete digital product. I worked with interface structure, responsive behavior, multilingual content, SEO, asset optimization, deployment constraints, and front-end implementation.

It also gave me a practical base for learning GitHub, AI-assisted development, and product-oriented web development.

## Next steps

I plan to continue developing this project while building separate AI-assisted applications for my portfolio. Areas I want to improve include:

- accessibility and semantic HTML
- performance auditing and further asset optimization
- cleaner component-like organization of repeated UI patterns
- more structured JavaScript
- automated quality checks
- future interactive features built with AI-assisted workflows

## Author

**Anastasia / Anostosio°**  
Graphic Design · Branding · Visual Communication · Digital Products

Portfolio: https://anostosio.ru/
