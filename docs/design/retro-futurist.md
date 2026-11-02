# Retro-futurist portfolio direction

References: [PromptSites — Scroll Landing](https://www.promptsites.co/prompt/scroll-landing) for camera movement and exploration, the owner-supplied garage-workbench image for physical composition, and the earlier [PromptSites — Retro-Futurist](https://www.promptsites.co/prompt/retro-futurist) reference for tactile hardware and personality. The owner requested a whole workbench that visitors can zoom into, with individual projects animating in different parts of it. The portfolio uses original conceptual artwork and its existing reviewed content.

The current hero is **“Come take a closer look.”** `RomanHero.tsx` combines the immersive workshop with Nick’s current-role strip. `CuriosityWorkbench.tsx` presents a continuous physical room with a Watchpoint desktop monitor, a separate Somethings phone on the tabletop, a Recollect AI tablet, a Better Saunum controller, a guitar beside a second phone showing Guitar Rudiments, a Persona creative pinboard, a GetWedded inspiration book, and a FranIQ clipboard. The initial view shows the whole bench; native document scroll then moves a camera between project stations. This replaces the previous standalone CSS instrument, which had replaced the static CRT mascot.

The workshop combines warm wood, dark controls, and bright screen illustrations. The surrounding site keeps its established sans-serif and monospace typography, pink and green accents, cool gray surfaces, and charcoal project gallery with the original project artwork. About, experience, field notes, and contact remain part of the ordinary document. Body text has no scanline effects.

## Scene and camera architecture

One generated room image supplies the physical setting. `WorkshopProjectVisuals.tsx` places Watchpoint’s complete official landscape product preview over the monitor and original Somethings App Store imagery inside a separate CSS phone on the table. The phone crops out the promotional headline and outer frame while retaining the original app pixels. Both image displays omit the brightness/saturation filter and glass overlay, and the camera world has no permanent `will-change: transform` layer, to keep the imagery crisp while zooming. At the owner’s explicit request, `WorkshopLegacyVisuals.tsx` restores the earlier Recollect card and Better Saunum controller illustrations from commit `10a14b2`. Camera travel, the phone’s image transition, card flipping, and fan rotation supply movement. See [product asset provenance](./workshop-product-assets.md). Screen components are decorative and `aria-hidden`; the stationary project panel owns all actual buttons, project descriptions, links, and action announcements.

The scene uses a sticky viewport inside a taller scroll section. Scroll progress interpolates Framer Motion values for translation and scale through an overview and eight project poses, with resting intervals at each device. Hotspots and the persistent navigation select the same scroll stops. Captions and action controls stay outside the transformed world; hotspot scale is compensated so targets stay usable. Mobile framing differs from desktop, and short landscape layouts keep navigation within the viewport. Horizontal camera positions stay within the room bounds to avoid an empty edge at the guitar close-up.

The tour does not intercept native wheel, touch, or keyboard scrolling. A “Skip to project list” link reaches the normal gallery immediately; the full portfolio remains available independently of the tour.

## Workbench interactions

- **Watchpoint / monitor:** the complete 1072 × 568 landscape product preview from `watchpoint.dev` fits inside the monitor at its original ratio. It shows the official Portfolio Command Center preview with sample data, without the former tall-dashboard pan.
- **Somethings / phone:** lossless versions of the original App Store mentor and chat artwork appear in an app-focused viewport, removing the promotional header and outer phone frame. The button transitions between those two public marketing images; no private conversations are accessed.
- **Recollect AI / tablet:** the restored memory card asks “What makes an idea stick?” and flips to “Coming back to it.” The button, stationary text, and announcement track the same card state. Retain beta attribution.
- **Better Saunum / controller:** the restored sample display keeps 78°F visible with the heater off. The demo fan starts on, rotates when motion is enabled, and can be toggled without operating any hardware. Temperature history and its animated endpoint remain visible.
- **Guitar Rudiments / guitar and phone:** a stock guitar photograph sits beside a CSS practice amp and phone with the complete original native iPhone screenshot. A clearly labeled sound button synthesizes a brief E minor chord, with string vibration when motion is enabled. Audio never autoplays and closes on station exit, hidden tab, completion, or unmount. The project gallery uses the app’s original icon and verified feature descriptions. The project links directly to the browser app; its home and tuner screens were verified in the existing browser tab. A separate new tab encountered a practice-storage error, documented with the asset provenance.

Watchpoint, Somethings, and Guitar Rudiments provide full-image links. Recollect and Better Saunum provide explicit interactive-demo descriptions and state text. Do not present any of these as a live product or hardware connection. The original generated room remains a conceptual setting; no new product imagery was generated for these additions.

Preserve verified role and project attribution. The private prequel’s publication status is independent of this design work.

## Motion and accessibility

Motion should invite exploration or explain state: camera travel to physical devices, panning through actual screenshots, revealing the captured answer, project-filter reflow, and restrained feedback on project and journal links. Main content stays visible immediately; avoid hidden scroll reveals. Preserve the original project images.

`PortfolioMotionProvider` centralizes the header pause control, system reduced-motion preference, and hidden-tab handling. The pause choice persists for the browser session, including navigation to the journal. The workbench also pauses decorative motion outside the viewport. Paused and reduced-motion states move directly between station poses without camera travel and retain complete illustrations and usable controls. Scene geometry must not collapse or change when motion is paused or the browser tab is hidden.

Keep keyboard access, visible focus, readable labels, and comfortable touch targets. Move focus to the appropriate navigation button before hiding a focused overview control or changing a focused project panel. Automatic scroll progress does not generate live announcements; explicit demo actions do. Descriptions and screenshot-source labels remain available without animation.

## Current workshop asset

- Built-in `image_gen` tool; original conceptual artwork generated November 1, 2026.
- Production asset: `client/public/images/workshop/nicks-workshop.webp` (1672 × 941, WebP quality 91).
- The garage photo supplied by the owner informed the arrangement of wood work surfaces, tools, and shelves. The final room is an original illustration, not a copied photograph or a depiction of Nick’s real workshop.
- Device screens are supplied by the application, allowing project animation and state changes without replacing the room image.
- Exact generation prompt: [workshop-image-prompt.txt](./workshop-image-prompt.txt). The production image is approximately 324 KiB; no runtime image generation or additional dependency is needed.

## Validation

The eight-station addition was checked in Chrome at desktop size and in actual
320×568, 390×844, 844×390, and 1024×768 frames. Persona, GetWedded, and FranIQ
fit their close-ups without cropped artwork or controls. The tab strip keeps its
active item visible, every new asset loads, paused navigation remains usable, and
repeated station changes produced no runtime or resize warnings. The original
Recollect flip and Saunum fan controls still work; the guitar phone fits above the
console. Portrait overview framing now shows the complete bench, and the
landscape introduction sits beside the scene so it cannot cover the new hotspots.
The separate FranIQ gallery details open at every tested width. Keyboard focus
moves from hotspots to their navigation tab, and Tab/Enter reaches the next
station. TypeScript, all 12 isolated tests, and the production build pass; the
existing Browserslist and bundle-size warnings remain.

The Guitar Rudiments addition passed TypeScript, all 12 isolated regression tests, and the production build on November 1, 2026. Chrome checks covered the fifth camera stop, the original native screenshot, explicit chord playback, and paused navigation. Actual 320×568, 390×844, and 844×390 frames had no horizontal overflow, clipped controls, or resize errors. Every navigation target is at least 47 pixels wide at 320px. The app screenshot and icon hashes match their source files. System reduced-motion behavior uses the existing shared provider and was reviewed in code without changing the OS preference. No backend or infrastructure settings changed.

The image-quality correction and Recollect/Saunum restoration passed TypeScript, all 12 isolated regression tests, and the production build on November 1, 2026. Chrome checks covered the complete Watchpoint preview, both sharper Somethings crops, the restored card flip and fan toggle, and paused animations. Actual 320×568, 390×844, and 844×390 frames had no horizontal overflow or clipped controls. Console/lens measurements now update on animation frames; repeated station navigation produced no ResizeObserver warnings. The existing bundle-size and Browserslist warnings remain. Earlier validation follows for historical context.

Historical four-station product-asset validation on November 1, 2026: TypeScript, all 12 existing isolated regression tests, and the production build passed. Chrome checks covered the desktop overview, all four stations, original screenshot transitions, full-image link targets, and paused navigation with no active screen animations. Actual 320×568, 390×844, and 844×390 frames were inspected without horizontal page overflow; the portrait camera now measures the story panel so it cannot cover the phone, and landscape retains the screenshot-source disclosure. Source hashes were checked against the original Watchpoint, Recollect, and Better Saunum captures. Reduced-motion behavior was reviewed in code without changing the OS setting. The existing bundle-size and Browserslist warnings remain.

Immersive-workshop validation on November 1, 2026: TypeScript check, all 12 existing isolated regression tests, and production build passed. Chrome checks covered the wide room, all three close-ups, native scrolling, direct station navigation, connection, card flip, fan toggle, paused station navigation, and keyboard focus transfer. Actual 320×568, 390×844, 768×1024, and 844×390 frame layouts were inspected; narrow phone frames had no horizontal overflow and the landscape console stayed inside its 390px viewport. The tour shortcut reached the project list, the Recollect detail modal opened, and contact fields remained readable. The OS reduced-motion branch shares the checked paused-camera behavior and was reviewed in code; the system preference was not changed for this pass. Production is released through a PR, required CI, and the existing main-branch Render deployment. The pre-existing large-bundle and Browserslist warnings remain.

Historical validation of the previous standalone instrument on November 1, 2026: typecheck, 12 existing regression tests, and production build passed. Chrome checks covered its three experiments, fan on/off, flashcard activation and accessible answer text, animated project filtering, modal focus restoration, mobile navigation with Escape, pause persistence, the complete paused graph, and offscreen suspension. Actual 320px, 390px, and 768px frame layouts had no horizontal overflow. These results describe the previous implementation, not verification of the new camera tour.

## Earlier character asset (retained)

- Built-in imagegen tool; generated November 1, 2026.
- Asset: `client/public/images/retro/terminal-friend.webp` (1086 × 1448, transparent alpha). Retained with its provenance; superseded in the hero by the workbench.
- Original PNG retained in Codex’s generated-images directory; production WebP encoded with `cwebp -q 86 -alpha_q 100`.
- The character is a decorative illustration, not a portrait of Nick.

Exact generation prompt:

> Use case: stylized-concept. Asset type: original portfolio website hero character, a transparent cutout. Create a sophisticated editorial studio portrait of a friendly retro-futurist computer-headed figure. The head is a chunky late-1980s beige-gray CRT monitor with rounded dark smoked glass, two softly glowing pale pink oval eyes, subtle scanlines, one tiny green indicator and a floppy drive slot below the screen. The body wears a relaxed dark charcoal workwear jacket over an off-white t-shirt, no tie, no human head, no visible hands. Waist-up portrait with shoulders fully inside frame, monitor nearly facing camera with a slight turn toward viewer's left, calm playful personality. Realistic tangible materials: finely textured aged plastic, reflective curved glass, cotton twill. Premium photorealistic 3D render with soft studio light from upper left, softly shaded right side. Tall 3:4 composition, entire monitor and shoulders visible with breathing room above, body ends at bottom. True transparent alpha background, no scenery, no backdrop, no ground. No text, no letters, no logos, no brand marks, no watermark. Use a restrained palette of beige, graphite, and pale pink. This should be a distinctive visual mascot, not a screenshot or web UI.
