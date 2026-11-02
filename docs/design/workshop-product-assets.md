# Workshop product assets

Watchpoint, Somethings, Guitar Rudiments, Persona, GetWedded, and FranIQ use original product imagery. At the owner’s
explicit request, Recollect AI and Better Saunum restore the earlier interactive
portfolio illustrations from commit `10a14b2`. No new product imagery was
generated for this correction. The conceptual room artwork is documented in
`retro-futurist.md`; it is not a photograph of Nick’s actual room.

`WorkshopProjectVisuals.tsx` owns the image displays and delegates the restored
demos to `WorkshopLegacyVisuals.tsx`. These screens are decorative. The stationary
panel provides readable descriptions, actions, state announcements, and full-image
links to the original images for all six asset-based stations. Nothing operates a real product account
or device.

## Watchpoint

- Portfolio asset: `client/public/images/workshop/products/watchpoint-preview.png`.
- Source: the official public product preview on <https://watchpoint.dev/>.
- The **1072 × 568 PNG** was captured through the browser from the visible
  landscape Portfolio Command Center preview, preserving the website’s own UI.
- It shows public sample data, not live operational metrics.
- The monitor contains the complete landscape image at its original ratio.
  It has no screenshot-pan action. A full-image link exposes the original frame.
- This replaces PR #6’s **1440 × 3072** `after-dashboard.png` capture from
  Watchpoint commit `a4c32d3`, whose tall layout did not suit the monitor.

## Somethings

- Product listing: <https://apps.apple.com/us/app/somethings-for-teens/id1666667151>.
- Source 1, mentor screen:
  <https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/34/09/17/34091743-c8f2-d626-c7a7-43aa8ed94e5b/App_store_screen.png/1290x2796bb.png>.
- Source 2, chat screen:
  <https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/aa/e7/1d/aae71df5-a4b2-9656-1031-8e539b3f1910/App_store_screen.png/1290x2796bb.png>.
- Retrieved November 1, 2026 as `/tmp/somethings-official-0.png` and
  `/tmp/somethings-official-1.png`. Both source files are **1242 × 2688**, despite
  the size suffix in Apple’s URLs.
- Portfolio assets: `client/public/images/workshop/products/somethings-mentor.webp`
  and `somethings-chat.webp`.
- Both now use **lossless WebP**, preserving the original dimensions and artwork.
  This supersedes PR #6’s quality-94 lossy conversion.
- The CSS viewport begins at approximately **x=74, y=730**, with a source width
  of **1086 pixels**. It removes the promotional headline and outer phone frame
  to give the original app UI more of the physical phone’s display area. The
  source files remain uncropped and available through the full-image link.
- These are official public marketing screenshots, not private conversations
  or captures from an account accessed for this portfolio.
- Image displays have no glass overlay or brightness/saturation filter. The
  camera world avoids permanent `will-change: transform` rasterization so zoomed
  images can retain their detail.

## Recollect AI

- `WorkshopLegacyVisuals.tsx` and `.css` restore the markup, styling, and card
  interaction from portfolio commit `10a14b2`, with isolated class names.
- The question is **“What makes an idea stick?”**; the back reads **“Coming back
  to it.”** The card starts on its question side and flips after an explicit
  action. This is a portfolio illustration of spaced repetition, not a native
  product screenshot.
- PR #6 used actual 2064 × 2752 native `ipad-03-review.png` and
  `ipad-04-answer.png` captures from the October 11 Recollect App Store submission
  workspace, showing an Italian starter card. Those screenshot crops are no
  longer used by the workshop.
- Preserve the product’s beta description until a public release is verified.

## Better Saunum

- The same legacy component restores the controller illustration from portfolio
  commit `10a14b2`: **78°F**, **heater off**, a cooling-history graph, and a fan
  that initially starts on.
- The fan button changes the local demo state only. The fan rotates when enabled
  and motion is allowed; the graph endpoint glows. Temperature remains visible
  in both fan states. The stationary panel labels the temperature as sample data.
- PR #6 used native 2064 × 2752 `01-demo-history.jpg` and `03-demo-controls.jpg`
  from `better-saunum/docs/app-store-screenshots/ipad-13/`, captured in the iOS
  Simulator from source `ba541f42e2aad1c167bae6fe3b2e17c6282e9233` using simulated
  sauna data. Those screenshot crops are no longer used by the workshop.
- Related technical article: <https://nickgattuso.com/blog/building-better-saunum>.

## Guitar Rudiments (fifth station)

- Native app capture: `client/public/images/workshop/products/guitar-rudiments-home.jpg`.
  Copied unchanged from `learn-guitar/docs/app-store/screenshots/iphone/01-practice-home.jpg`:
  **1206 × 2622**, captured November 1, 2026 on an isolated iPhone 16 Pro simulator
  from source commit `638b4f5694e1a8ebd212e248825b2666db0e5e9d`. It contains no
  fabricated practice results. The complete screenshot fits inside a separate
  phone resting on a small practice amp beside the bench.
- Original product mark: `client/public/images/projects/guitar-rudiments/icon.svg`,
  copied unchanged from `learn-guitar/assets/icon.svg` for the project details.
- Decorative guitar: `client/public/images/workshop/acoustic-guitar.webp`, converted
  at quality 92 from the **1194 × 2961** transparent [PurePNG guitar photograph](https://purepng.com/photo/10674/objects-acoustic-guitar).
  Source uploader: LPuo. The source page identifies it as CC0, free for commercial
  use with no attribution required. It is stock scene decoration, not a photograph
  documented as Nick’s own instrument. Transparency and proportions are preserved.
- Source PNG:
  <https://purepng.com/public/uploads/large/purepng.com-acoustic-guitarguitarmusicalinstrumentstringacoustic-guitarelectrical-14215265368472bdsf.png>.
- Product description is grounded in `learn-guitar/README.md` and its public
  [information page](https://guitar-rudiments.netlify.app/support.html). The native
  app was awaiting App Store review at the time of this addition. Do not imply
  that the App Store release is available until verified.
- Links target the [browser app](https://guitar-rudiments.netlify.app/), whose home
  and tuner screens were verified in the existing Chrome tab. An additional tab
  displayed a practice-storage startup error while the existing tab continued to
  work; concurrent-tab storage behavior was not diagnosed or changed here. The
  screenshot remains the original native capture.
- “Strum the guitar · sound” explicitly starts a short synthesized E minor chord
  and string vibration. This is a portfolio interaction, not a recording or app
  screenshot animation. There is no autoplay, microphone access, or external audio
  request. Playback stops on station exit, hidden tab, completion, or unmount.

## Shared motion and accessibility

- The camera retains native document scrolling and the existing pause,
  reduced-motion, hidden-tab, and offscreen behavior.
- Somethings image transitions, the Recollect card transition, and Saunum fan /
  endpoint animations honor the motion preference. Controls remain usable with
  motion disabled, and complete static views remain visible.
- Card and fan states remain independent when visitors move between stations.
  Saunum uses `fanOn = !alternate`; its initial `alternate=false` means fan on.
- Desktop and 320×568, 390×844, and 844×390 browser checks passed, including
  screenshot framing, card/fan states, motion pause, and repeated station changes
  without resize warnings. TypeScript, all 12 isolated tests, and production build
  also passed. See `retro-futurist.md` for the validation record.

## Persona, GetWedded, and FranIQ (stations six through eight)

Added November 1, 2026. No new product imagery was generated. The cork board, book,
and clipboard are CSS scene props around original assets, not recreated app UI.

### Persona

- Product and public creative gallery: <https://personaapp.ai/>.
- `persona-nutrition.webp` and `persona-haircare.webp` are unchanged **800 × 1000**
  originals from `persona-ai/apps/marketing/assets/ads/bar-forget-cheat-days.webp`
  and `glass-forget-frizz.webp`, twice the resolution of the existing gallery
  thumbnails. The wordmark is the original `persona-lockup-horizontal-1c-forest.svg`.
- Both complete prints appear on a cork board. An explicit action changes which
  creative is foregrounded; the image link and screen-reader announcement follow it.
- Description follows the public site's research → personas → creative → review flow.

### GetWedded / Wedded

- Product: <https://getwedded.ai/>. The product itself is branded **Wedded**.
- `wedded-garden.jpg` and `wedded-hilltop.jpg` are unchanged `castle-gardens.jpg`
  (**1200 × 900**) and `estate-hilltop.jpg` (**1200 × 898**) from
  `wedding-ai/apps/web/public/anon/`. The wordmark is the original
  `apps/web/public/brand/wordmark-ink.svg`.
- The source README and manifest identify these as the product's own generated
  illustrations of fictional settings. They are not photographs of real venues
  or Nick's wedding. The source label on the portfolio makes that distinction.
- The book lifts from the table when selected and turns between the two original illustrations. Its title and swatches
  are decorative portfolio copy. No private signed-in wedding data is used.
- Venue discovery, outreach, follow-ups, and tour coordination are already
  verified on Collect's public portfolio: <https://collectsoftware.org/>.

### FranIQ

- Official product page: <https://www.franchiselawsolutions.com/franiq>.
- `franiq-compliance.png` is the public **1464 × 1596** product hero retrieved from
  <https://internicola.imgix.net/FranIQ-Franchise-Compliance-Infrastructure.png?auto=format&fit=max&w=1600&q=95>.
- The alternate is the existing unchanged **800 × 480**
  `/images/projects/collect/franiq-dashboard.png` from Collect Software.
- A clipboard displays the full original artwork with sample-data attribution.
  The reveal action switches to the original dashboard composition; neither is
  presented as live client data or a live compliance system.
- FranIQ gets its own project entry; the reviewed Internicola Law Firm entry is
  preserved. Features and attribution follow the official product page.

### Expanded tour

- Camera stops are evenly distributed inside the native scroll range, with
  overview and final resting intervals. The tour height derives from the number
  of stations. Every station is reachable by scrolling or direct navigation.
- The tab strip has horizontal overflow on small screens, a visible swipe hint,
  and minimum 92 × 46 pixel tabs. Active-tab centering scrolls only the strip.
- New paper transitions use the same motion preference as existing displays;
  paused, reduced-motion, hidden-tab, and offscreen behavior is preserved.

- Browser verification: 320×568, 390×844, 844×390, and 1024×768 frames had
  no page overflow, broken workshop assets, clipped new-station artwork, or
  runtime/resize errors. Original card/fan interactions and guitar framing were
  checked after expanding the navigation. The FranIQ details modal opens with
  its source attribution at every tested size.
