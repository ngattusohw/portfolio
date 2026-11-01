# Retro-futurist portfolio direction

References: [PromptSites — Scroll Landing](https://www.promptsites.co/prompt/scroll-landing) for camera movement and exploration, the owner-supplied garage-workbench image for physical composition, and the earlier [PromptSites — Retro-Futurist](https://www.promptsites.co/prompt/retro-futurist) reference for tactile hardware and personality. The owner requested a whole workbench that visitors can zoom into, with individual projects animating in different parts of it. The portfolio uses original conceptual artwork and its existing reviewed content.

The current hero is **“Come take a closer look.”** `RomanHero.tsx` combines the immersive workshop with Nick’s current-role strip. `CuriosityWorkbench.tsx` presents a continuous physical room with a desktop monitor, tablet, handmade sauna controller, and surrounding tools. The initial view shows the whole bench; native document scroll then moves a camera between project stations. This replaces the previous standalone CSS instrument, which had replaced the static CRT mascot.

The workshop combines warm wood, dark controls, and bright screen illustrations. The surrounding site keeps its established sans-serif and monospace typography, pink and green accents, cool gray surfaces, and charcoal project gallery with the original project artwork. About, experience, field notes, and contact remain part of the ordinary document. Body text has no scanline effects.

## Scene and camera architecture

One generated room image supplies the physical setting. HTML and SVG screens from `WorkshopProjectVisuals.tsx` sit over the image’s blank device displays, so the illustrations remain live as the camera moves. The screen component is decorative and `aria-hidden`; the stationary project panel owns all actual buttons, project descriptions, links, and action announcements.

The scene uses a sticky viewport inside a taller scroll section. Scroll progress interpolates Framer Motion values for translation and scale through an overview and three project poses, with resting intervals at each device. Hotspots and the persistent navigation select the same scroll stops. Captions and action controls stay outside the transformed world; hotspot scale is compensated so targets stay usable. Mobile framing differs from desktop, and short landscape layouts keep navigation within the viewport.

The tour does not intercept native wheel, touch, or keyboard scrolling. A “Skip to project list” link reaches the normal gallery immediately; the full portfolio remains available independently of the tour.

## Workbench interactions

- **Connect / Somethings:** the desktop monitor shows two large illustrated characters exchanging a signal. The connection button changes their shared symbol and status. This represents Nick’s work on technology supporting human connection, with a link to Somethings. It depicts no real users, conversations, or health outcomes.
- **Remember / Recollect AI:** the tablet holds a physical-looking stack of flashcards. The active card turns from a question to an answer, alongside illustrative review intervals. Link to Recollect’s verified project page and retain its beta status.
- **Tinker / Better Saunum:** the wide controller screen shows temperature, a fan, and temperature history together while the heater is off. The fan toggle and persistent reading come from Nick’s stated priorities for the app. Temperatures are explicitly labeled as a non-live demo; the illustration controls no real heater. Link to the public technical post at `/blog/building-better-saunum`.

Preserve verified role and project attribution. The private prequel’s publication status is independent of this design work.

## Motion and accessibility

Motion should invite exploration or explain state: camera travel to physical devices, a rotating fan, a connecting signal, a turned card, project-filter reflow, and restrained feedback on project and journal links. Main content stays visible immediately; avoid hidden scroll reveals. Preserve the original project images.

`PortfolioMotionProvider` centralizes the header pause control, system reduced-motion preference, and hidden-tab handling. The pause choice persists for the browser session, including navigation to the journal. The workbench also pauses decorative motion outside the viewport. Paused and reduced-motion states move directly between station poses without camera travel and retain complete illustrations and usable controls. Scene geometry must not collapse or change when motion is paused or the browser tab is hidden.

Keep keyboard access, visible focus, readable labels, and comfortable touch targets. Move focus to the appropriate navigation button before hiding a focused overview control or changing a focused project panel. Automatic scroll progress does not generate live announcements; explicit demo actions do. Descriptions and sample-data labels remain available without animation.

## Current workshop asset

- Built-in `image_gen` tool; original conceptual artwork generated November 1, 2026.
- Production asset: `client/public/images/workshop/nicks-workshop.webp` (1672 × 941, WebP quality 91).
- The garage photo supplied by the owner informed the arrangement of wood work surfaces, tools, and shelves. The final room is an original illustration, not a copied photograph or a depiction of Nick’s real workshop.
- Device screens are supplied by the application, allowing project animation and state changes without replacing the room image.
- Exact generation prompt: [workshop-image-prompt.txt](./workshop-image-prompt.txt). The production image is approximately 324 KiB; no runtime image generation or additional dependency is needed.

## Validation

Immersive-workshop validation on November 1, 2026: TypeScript check, all 12 existing isolated regression tests, and production build passed. Chrome checks covered the wide room, all three close-ups, native scrolling, direct station navigation, connection, card flip, fan toggle, paused station navigation, and keyboard focus transfer. Actual 320×568, 390×844, 768×1024, and 844×390 frame layouts were inspected; narrow phone frames had no horizontal overflow and the landscape console stayed inside its 390px viewport. The tour shortcut reached the project list, the Recollect detail modal opened, and contact fields remained readable. The OS reduced-motion branch shares the checked paused-camera behavior and was reviewed in code; the system preference was not changed for this pass. Production is released through a PR, required CI, and the existing main-branch Render deployment. The pre-existing large-bundle and Browserslist warnings remain.

Historical validation of the previous standalone instrument on November 1, 2026: typecheck, 12 existing regression tests, and production build passed. Chrome checks covered its three experiments, fan on/off, flashcard activation and accessible answer text, animated project filtering, modal focus restoration, mobile navigation with Escape, pause persistence, the complete paused graph, and offscreen suspension. Actual 320px, 390px, and 768px frame layouts had no horizontal overflow. These results describe the previous implementation, not verification of the new camera tour.

## Earlier character asset (retained)

- Built-in imagegen tool; generated November 1, 2026.
- Asset: `client/public/images/retro/terminal-friend.webp` (1086 × 1448, transparent alpha). Retained with its provenance; superseded in the hero by the workbench.
- Original PNG retained in Codex’s generated-images directory; production WebP encoded with `cwebp -q 86 -alpha_q 100`.
- The character is a decorative illustration, not a portrait of Nick.

Exact generation prompt:

> Use case: stylized-concept. Asset type: original portfolio website hero character, a transparent cutout. Create a sophisticated editorial studio portrait of a friendly retro-futurist computer-headed figure. The head is a chunky late-1980s beige-gray CRT monitor with rounded dark smoked glass, two softly glowing pale pink oval eyes, subtle scanlines, one tiny green indicator and a floppy drive slot below the screen. The body wears a relaxed dark charcoal workwear jacket over an off-white t-shirt, no tie, no human head, no visible hands. Waist-up portrait with shoulders fully inside frame, monitor nearly facing camera with a slight turn toward viewer's left, calm playful personality. Realistic tangible materials: finely textured aged plastic, reflective curved glass, cotton twill. Premium photorealistic 3D render with soft studio light from upper left, softly shaded right side. Tall 3:4 composition, entire monitor and shoulders visible with breathing room above, body ends at bottom. True transparent alpha background, no scenery, no backdrop, no ground. No text, no letters, no logos, no brand marks, no watermark. Use a restrained palette of beige, graphite, and pale pink. This should be a distinctive visual mascot, not a screenshot or web UI.
