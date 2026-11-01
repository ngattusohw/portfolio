# Retro-futurist portfolio direction

Reference: [PromptSites — Retro-Futurist](https://www.promptsites.co/prompt/retro-futurist): tactile retro hardware, restrained composition, conversational copy, and an interface that feels alive. The owner requested meaningful motion and a creative element grounded in his own story. The portfolio uses original artwork and its existing reviewed content.

The current hero is **“Curiosity, put to work.”** `RomanHero.tsx` introduces Nick’s software, engineering leadership, and personal tinkering; `CuriosityWorkbench.tsx` supplies an original interactive instrument built with HTML, CSS, SVG, and Framer Motion. It replaces the static CRT mascot in the hero.

Cool gray surfaces, black sans-serif typography, pink and green accents, and physical controls carry through the site. The charcoal project gallery preserves the original project artwork. About, experience, field notes, and contact share the same typography and controls. Body text has no scanline effects.

## Workbench interactions

- **Connect / Somethings:** two illustrated characters exchange a signal; making a connection changes their expression and the signal. This represents Nick’s work on technology supporting human connection, with a link to Somethings. It depicts no real users, conversations, or health outcomes.
- **Remember / Recollect AI:** a flashcard turns from a question to an answer, alongside illustrative review intervals. Link to Recollect’s verified project page and retain its beta status.
- **Tinker / Better Saunum:** the default experiment shows temperature history and a fan toggle while the heater is off. These come from Nick’s stated priorities for the app. Temperatures are explicitly labeled as a non-live demo; the illustration controls no real heater. Link to the public technical post at `/blog/building-better-saunum`.

Preserve verified role and project attribution. The private prequel’s publication status is independent of this design work.

## Motion and accessibility

Motion should explain state or invite interaction: a rotating fan, a connecting signal, a turned card, project-filter reflow, and restrained feedback on project and journal links. Main content stays visible immediately; avoid hidden scroll reveals. Preserve the original project images.

`PortfolioMotionProvider` centralizes the header pause control, system reduced-motion preference, and hidden-tab handling. The pause choice persists for the browser session, including navigation to the journal. The workbench also pauses decorative motion outside the viewport. Paused and reduced-motion states retain complete, usable illustrations and instant control feedback. Pointer tilt is mouse-only. Keep keyboard access, visible focus, readable labels, and touch targets; descriptions and sample-data labels remain available without animation.

Validation on November 1, 2026: typecheck, 12 existing regression tests, and production build passed. Chrome checks covered the three experiments, fan on/off, flashcard activation and accessible answer text, animated project filtering, modal focus restoration, mobile navigation with Escape, pause persistence, the complete paused graph, and offscreen suspension. Actual 320px, 390px, and 768px frame layouts had no horizontal overflow. System reduced-motion handling was reviewed in the provider and CSS; no operating-system preference was changed. Production is released through a reviewed PR and the existing main-branch Render deployment.

## Earlier character asset (retained)

- Built-in imagegen tool; generated November 1, 2026.
- Asset: `client/public/images/retro/terminal-friend.webp` (1086 × 1448, transparent alpha). Retained with its provenance; superseded in the hero by the workbench.
- Original PNG retained in Codex’s generated-images directory; production WebP encoded with `cwebp -q 86 -alpha_q 100`.
- The character is a decorative illustration, not a portrait of Nick.

Exact generation prompt:

> Use case: stylized-concept. Asset type: original portfolio website hero character, a transparent cutout. Create a sophisticated editorial studio portrait of a friendly retro-futurist computer-headed figure. The head is a chunky late-1980s beige-gray CRT monitor with rounded dark smoked glass, two softly glowing pale pink oval eyes, subtle scanlines, one tiny green indicator and a floppy drive slot below the screen. The body wears a relaxed dark charcoal workwear jacket over an off-white t-shirt, no tie, no human head, no visible hands. Waist-up portrait with shoulders fully inside frame, monitor nearly facing camera with a slight turn toward viewer's left, calm playful personality. Realistic tangible materials: finely textured aged plastic, reflective curved glass, cotton twill. Premium photorealistic 3D render with soft studio light from upper left, softly shaded right side. Tall 3:4 composition, entire monitor and shoulders visible with breathing room above, body ends at bottom. True transparent alpha background, no scenery, no backdrop, no ground. No text, no letters, no logos, no brand marks, no watermark. Use a restrained palette of beige, graphite, and pale pink. This should be a distinctive visual mascot, not a screenshot or web UI.
