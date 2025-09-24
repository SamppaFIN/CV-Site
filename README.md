# CV‑Site (Bilingual CV + Portfolio)

Live: GitHub Pages (main branch)

A lightweight, mobile‑first CV + portfolio built with vanilla.js and CSS. Includes EN/FI language switch, theme toggle, project cards with modal README previews, and an inline Effects Lab for subtle interactive demos.

## Features
- Bilingual content (EN/FI) — `js/i18n.js`
- Light/Dark theme toggle (persisted)
- Projects grid with images + markdown descriptions (inline renderer)
- Modal with high‑contrast readability and keyboard escape
- Effects Lab (vanilla.js):
  - 2.5D canvas orbits (glow trails)
  - Particle burst and full‑screen particles
  - Simple controls — no external libraries
- Accessibility: keyboard close, readable contrasts, responsive layout

## Structure
```
cv-site/
  index.html            # SPA entry
  css/styles.css        # Theme + layout + modal + overlay
  js/app.js             # Behavior, projects, modal, effects lab
  js/i18n.js            # EN/FI translations
  js/markdown.js        # Minimal markdown renderer (safe subset)
  docs/AURORA_LOG_.md   # Dev diary
  .gitignore            # excludes docs by default
```

## Getting Started
Open `cv-site/index.html` locally or serve via any static server.

For GitHub Pages:
- Repository: `SamppaFIN/CV-Site`
- Pages source: `main` (root)
- Access via: `https://samppafin.github.io/CV-Site/` (or user’s chosen path)

## Updating Projects
Edit the `projects` array in `js/app.js`:
```js
{ id: 'AngelicWaves', title: 'AngelicWaves', img: 'https://…', md: `Markdown with links` }
```
Optionally add a README snippet to the `README` object keyed by `id` for richer modal content.

## Effects Lab
Open the footer “✧ Effects” button. The lab uses a single canvas and vanilla JS for:
- orbiting particles with hue cycling
- burst and full‑screen effects

## License
MIT — intended for personal portfolio use. Replace content and images with your own.

---
Built with ❤️ using vanilla.js and careful UX decisions.
