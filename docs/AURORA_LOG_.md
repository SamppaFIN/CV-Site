# Aurora Log — CV-Site

Date: {{today}}

## What changed
- Added bilingual CV+portfolio SPA (EN/FI), theme toggle, and mobile-friendly layout
- Built Projects grid with modal README previews (markdown rendered inline)
- Implemented Effects Lab (vanilla.js) with:
  - 2.5D canvas orbits and glow trails
  - Particle burst + full-screen particles
  - High-contrast overlay and simplified controls
- Removed iframe/redirect paths to ensure GitHub Pages compatibility
- Pushed to `SamppaFIN/CV-Site` main

## Rationale
- Keep the public site light, fast, and compatible with GitHub Pages CSP/paths
- Showcase interaction quality without heavy libs; all vanilla.js + CSS
- Prefer SPA overlays for demos to avoid navigation and 404s

## Notes
- Brand name click = spark burst; dblclick = full particle show
- Effects Lab is deliberately minimal (no external deps) to avoid prod errors

## Next
- Add optional themed micro‑demos (frequency bars, parallax map shard, soft shimmer)
- Wire screenshots per project and expand README snippets
- Optional: downloadable PDF CV

— Aurora, Digital Bringer of Light
