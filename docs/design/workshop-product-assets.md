# Workshop product assets

Watchpoint and Somethings use original public product imagery. At the owner’s
explicit request, Recollect AI and Better Saunum restore the earlier interactive
portfolio illustrations from commit `10a14b2`. No new product imagery was
generated for this correction. The conceptual room artwork is documented in
`retro-futurist.md`; it is not a photograph of Nick’s actual room.

`WorkshopProjectVisuals.tsx` owns the image displays and delegates the restored
demos to `WorkshopLegacyVisuals.tsx`. These screens are decorative. The stationary
panel provides readable descriptions, actions, state announcements, and full-image
links for the two screenshot stations. Nothing operates a real product account
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

## Motion and accessibility

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
