import "./WorkshopProjectVisuals.css";

export type WorkshopStation =
  "watchpoint" | "somethings" | "remember" | "tinker";

type ProductAsset = { src: string; alt: string };
type WorkshopAsset = {
  primary: ProductAsset;
  alternate: ProductAsset;
  sourceLabel: string;
  actionLabel: string;
  alternateActionLabel: string;
};

const assetRoot = "/images/workshop/products";

/** Original product captures; sources and demo-data boundaries are documented in
 * docs/design/workshop-product-assets.md. No UI is redrawn for these screens. */
export const workshopAssets: Record<WorkshopStation, WorkshopAsset> = {
  watchpoint: {
    primary: {
      src: `${assetRoot}/watchpoint-dashboard.png`,
      alt: "Watchpoint dashboard showing service health and application charts for its fictional Northstar Digital demo organization",
    },
    alternate: {
      src: `${assetRoot}/watchpoint-dashboard.png`,
      alt: "Watchpoint dashboard showing additional chart types and infrastructure monitoring with demo data",
    },
    sourceLabel: "Actual Watchpoint dashboard · demo data",
    actionLabel: "Explore the dashboard",
    alternateActionLabel: "Back to dashboard overview",
  },
  somethings: {
    primary: {
      src: `${assetRoot}/somethings-mentor.webp`,
      alt: "Official Somethings App Store screenshot introducing a peer mentor",
    },
    alternate: {
      src: `${assetRoot}/somethings-chat.webp`,
      alt: "Official Somethings App Store screenshot showing the app's chat experience",
    },
    sourceLabel: "Official Somethings App Store screenshots",
    actionLabel: "See the chat screen",
    alternateActionLabel: "See the mentor screen",
  },
  remember: {
    primary: {
      src: `${assetRoot}/recollect-review.png`,
      alt: "Recollect AI native review screen with the Italian flashcard question Buongiorno",
    },
    alternate: {
      src: `${assetRoot}/recollect-answer.png`,
      alt: "Recollect AI native answer screen: Good morning; hello during the day",
    },
    sourceLabel: "Native app screenshots · sample Italian deck",
    actionLabel: "Reveal the answer",
    alternateActionLabel: "Show the question",
  },
  tinker: {
    primary: {
      src: `${assetRoot}/better-saunum-history.jpg`,
      alt: "Better Saunum native demo screen showing sauna temperature and saved temperature history",
    },
    alternate: {
      src: `${assetRoot}/better-saunum-controls.jpg`,
      alt: "Better Saunum native demo screen showing air circulation and sauna light controls",
    },
    sourceLabel: "Native app screenshots · simulated sauna data",
    actionLabel: "See fan controls",
    alternateActionLabel: "See temperature history",
  },
};

type WorkshopProjectVisualProps = {
  station: WorkshopStation;
  motionEnabled: boolean;
  alternate: boolean;
};

/** Decorative crops of authentic screenshots. The stationary panel owns all
 * accessible descriptions, screenshot actions, and full-size image links. */
export function WorkshopProjectVisual({
  station,
  motionEnabled,
  alternate,
}: WorkshopProjectVisualProps) {
  const assets = workshopAssets[station];
  return (
    <div
      className={`workshop-visual workshop-visual--${station}`}
      data-motion={motionEnabled ? "on" : "off"}
      data-alternate={alternate ? "yes" : "no"}
      aria-hidden="true"
    >
      <img
        className="workshop-product-image workshop-product-image--primary"
        src={assets.primary.src}
        alt=""
        draggable={false}
        decoding="async"
      />
      {station !== "watchpoint" && (
        <img
          className="workshop-product-image workshop-product-image--alternate"
          src={assets.alternate.src}
          alt=""
          draggable={false}
          decoding="async"
        />
      )}
    </div>
  );
}
