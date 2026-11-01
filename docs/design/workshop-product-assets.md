# Workshop product assets

The workshop now presents existing product assets and authentic app captures. No
product UI was generated or redrawn for this revision. The room artwork remains
an original conceptual workshop, documented in `retro-futurist.md`; it is not a
photograph of Nick's actual room.

`WorkshopProjectVisuals.tsx` uses these images as decorative screen viewports.
The stationary project panel provides readable descriptions, explicit screenshot
controls, provenance labels, and access to the full images. Screen transitions
change screenshots or their visible crop; they do not operate an app or device.

## Watchpoint

- Portfolio asset: `client/public/images/workshop/products/watchpoint-dashboard.png`.
- Original: `/Users/ngattuso/dev/collect/watchpoint/after-dashboard.png`.
- Dimensions: **1440 × 3072**. Copied without modification.
- Repository provenance: tracked in Watchpoint commit `a4c32d3` (July 15, 2026,
  “feat: add gtm-demo seed scenario and widget/dashboard UI refinements”).
- Product: <https://watchpoint.dev/>.
- The screenshot displays **fictional demo data**, not live operational metrics.
  Its “Northstar Digital” organization comes from `seedGtmDemoOrg` in the product's
  `prisma/seed.ts`. The visible account is the seeded “Dev Owner.”
- The monitor initially shows the upper dashboard and pans to lower chart windows
  after an explicit action. The original full screenshot is preserved.

## Somethings

- Product listing: <https://apps.apple.com/us/app/somethings-for-teens/id1666667151>.
- Source 1, mentor screen:
  <https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/34/09/17/34091743-c8f2-d626-c7a7-43aa8ed94e5b/App_store_screen.png/1290x2796bb.png>.
- Source 2, chat screen:
  <https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/aa/e7/1d/aae71df5-a4b2-9656-1031-8e539b3f1910/App_store_screen.png/1290x2796bb.png>.
- Retrieved November 1, 2026 as `/tmp/somethings-official-0.png` and
  `/tmp/somethings-official-1.png`. Both actual files are **1242 × 2688**, despite
  the size suffix in Apple's URLs.
- Portfolio assets: `client/public/images/workshop/products/somethings-mentor.webp`
  and `somethings-chat.webp`.
- Conversion: `cwebp -q 94` only, preserving source dimensions, colors, composition,
  and artwork. No generated imagery, new text, or UI alterations were added.
- These are Somethings' public App Store marketing screenshots. They are not
  screenshots from a private peer-support conversation or an account accessed
  for this portfolio.
- The phone displays the complete portrait artwork with its original proportions.

## Recollect AI

- Portfolio assets: `client/public/images/workshop/products/recollect-review.png`
  and `recollect-answer.png`.
- Originals: `ipad-03-review.png` and `ipad-04-answer.png` in
  `/Users/ngattuso/.codex/visualizations/2026/10/11/01a12cca-0e4d-7fe0-8f3a-a5352075cc8f/app-store-submission/`.
- Both are **2064 × 2752**, captured October 28, 2026, and copied without modification.
- Capture documentation: `/private/tmp/recollect-native-screenshots/README.txt`;
  asset manifest: `/private/tmp/recollect-native-screenshots/prepared-screenshots.json`.
- These are actual React Native app screens in the iOS Simulator, using isolated
  fictional learning data and real catalog cards. The capture harness retained
  the app's routes, layout, typography, gestures, and native components. It did
  not use browser rendering or synthetic upscaling, and did not read an existing
  signed-in user's database. The manifest confirms opaque RGB native pixels
  were preserved.
- The captured Italian card asks **“Buongiorno”** and answers **“Good morning;
  hello during the day.”** The workshop crops the center of those original card
  faces and crossfades between them. No replacement card text is synthesized.
- Review source SHA-256:
  `9e2ee80475206fbe29686162bbd9c78ef00ed0e51d303eb8402a4f584d9cc9f4`.
- Answer source SHA-256:
  `b45afc65ebed1ee6476e2729c9ce6aa170511c1bc44eb5786f1f7fceeac86bfa`.
- Product landing page: <https://recollect-ai.netlify.app/>. These screenshots do
  not imply that the app is publicly available; preserve the portfolio's beta
  description until a public release is independently verified.

## Better Saunum

- Portfolio assets: `client/public/images/workshop/products/better-saunum-history.jpg`
  and `better-saunum-controls.jpg`.
- Originals: `/Users/ngattuso/dev/collect/better-saunum/docs/app-store-screenshots/ipad-13/01-demo-history.jpg`
  and `03-demo-controls.jpg` in the same directory.
- Both are **2064 × 2752** and copied without modification.
- The product's `docs/app-store-screenshots/README.md` and `manifest.json` record
  their provenance: unmodified native iOS Simulator captures from October 23,
  2026, app source `ba541f42e2aad1c167bae6fe3b2e17c6282e9233`. They were captured
  directly as opaque JPEGs without browser rendering, frame compositing, or
  image generation.
- These show the app's explicitly labeled **simulated sauna and history**. The
  controls frame shows a simulated active session, high fan setting, and light
  enabled. No commands were sent to a real heater during capture; the portfolio
  likewise sends none.
- The wide display crops the native temperature column, gently pans to its
  history graph, and shows the fan controls after an explicit action. The full
  controls screenshot also includes the light controls. The stationary label retains the
  simulated-data disclosure when an image crop excludes the original label.
- Related technical article: <https://nickgattuso.com/blog/building-better-saunum>.

## Motion and accessibility

- Screenshot changes are user-driven; the selected sauna station also pans
  between the temperature and history graph. The scene camera retains native
  document scrolling and the existing motion preference controls.
- Crossfades and dashboard panning are disabled when motion is paused or the
  system requests reduced motion.
- No temperature, status, count, conversation, or review result is invented in
  code. Full-size asset links expose the originals behind each cropped screen.
