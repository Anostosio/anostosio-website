# Multilingual build report

## Structure
- `/` — Russian
- `/en/` — English
- `/es/` — Spanish

## Decisions
- Project and brand names remain unchanged.
- Prices remain in Russian roubles; only “from / desde” and surrounding copy were translated.
- Text inside portfolio images and mockups was not translated.
- BarSuk contains only the identity board and poster. Matchboxes and calendar remain in a separate Print Projects section.
- The final portfolio section is named 3D only.

## Technical work
- Added a page-preserving RU / EN / ES switcher to all five page types.
- Localised visible text, metadata, Open Graph locale, aria labels, alt text, placeholders, form options, 404 copy, and brief email generation.
- Added English and Spanish web manifests.
- Kept shared CSS, JS, assets, fonts, animations, smooth scrolling and degree cursor.
- Did not add canonical, absolute hreflang, og:url or sitemap because the final domain was not supplied.
