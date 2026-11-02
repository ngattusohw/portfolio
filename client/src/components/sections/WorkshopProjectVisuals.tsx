import { WorkshopLegacyVisual } from "./WorkshopLegacyVisuals";
import "./WorkshopProjectVisuals.css";

export type WorkshopStation =
  "watchpoint" | "somethings" | "remember" | "tinker" | "guitar"
  | "persona" | "wedded" | "franiq";

type ProductAsset = { src: string; alt: string };
type WorkshopAsset = {
  primary: ProductAsset;
  alternate?: ProductAsset;
  sourceLabel: string;
  actionLabel?: string;
  alternateActionLabel?: string;
  originalLabel?: string;
};

const assetRoot = "/images/workshop/products";

/** The monitor and two phones use original product imagery. Recollect and
 * Saunum deliberately restore the portfolio's earlier interactive demos. */
export const workshopAssets: Partial<Record<WorkshopStation, WorkshopAsset>> = {
  watchpoint: {
    primary: {
      src: `${assetRoot}/watchpoint-preview.png`,
      alt: "Watchpoint's official Portfolio Command Center preview showing service health, error trends, subscribers, and notifications",
    },
    sourceLabel: "Official Watchpoint product preview · sample data",
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
  guitar: {
    primary: {
      src: `${assetRoot}/guitar-rudiments-home.jpg`,
      alt: "Guitar Rudiments running on iPhone, with a practice session, metronome, chord loops, rudiments, and tuner",
    },
    sourceLabel: "Original Guitar Rudiments iPhone screenshot",
  },
  persona: {
    primary: {
      src: `${assetRoot}/persona-nutrition.webp`,
      alt: "Persona's original nutrition ad creative for Persona Bar",
    },
    alternate: {
      src: `${assetRoot}/persona-haircare.webp`,
      alt: "Persona's original haircare ad creative for Glass Coat",
    },
    sourceLabel: "Original ads from Persona's public gallery",
    actionLabel: "Swap to the haircare ad",
    alternateActionLabel: "Swap to the nutrition ad",
    originalLabel: "View original ad",
  },
  wedded: {
    primary: {
      src: `${assetRoot}/wedded-garden.jpg`,
      alt: "Wedded's original garden ceremony illustration",
    },
    alternate: {
      src: `${assetRoot}/wedded-hilltop.jpg`,
      alt: "Wedded's original hilltop ceremony illustration",
    },
    sourceLabel: "Original Wedded venue illustrations · fictional settings",
    actionLabel: "Turn to the hilltop ceremony",
    alternateActionLabel: "Turn back to the garden",
    originalLabel: "View original illustration",
  },
  franiq: {
    primary: {
      src: `${assetRoot}/franiq-compliance.png`,
      alt: "FranIQ's official compliance platform artwork, with a registration map and disclosure overview",
    },
    alternate: {
      src: "/images/projects/collect/franiq-dashboard.png",
      alt: "FranIQ's original dashboard artwork from Collect Software, showing its compliance and knowledge-base screens",
    },
    sourceLabel: "Official FranIQ product artwork · sample data",
    actionLabel: "Reveal the dashboard artwork",
    alternateActionLabel: "Return to the compliance overview",
    originalLabel: "View original artwork",
  },
};

type WorkshopProjectVisualProps = {
  station: WorkshopStation;
  motionEnabled: boolean;
  alternate: boolean;
};

/** The stationary panel owns all accessible descriptions and controls. */
export function WorkshopProjectVisual({
  station,
  motionEnabled,
  alternate,
}: WorkshopProjectVisualProps) {
  if (station === "remember" || station === "tinker") {
    return (
      <WorkshopLegacyVisual
        station={station}
        motionEnabled={motionEnabled}
        flipped={alternate}
        fanOn={!alternate}
      />
    );
  }
  const assets = workshopAssets[station]!;
  return (
    <div
      className={`workshop-visual workshop-visual--${station}`}
      data-motion={motionEnabled ? "on" : "off"}
      data-alternate={alternate ? "yes" : "no"}
      aria-hidden="true"
    >
      {station === "persona" && <>
        <div className="workshop-pinboard-brand">
          <img src={`${assetRoot}/persona-wordmark.svg`} alt="" />
          <span>THE CREATIVE WALL</span>
        </div>
        <span className="workshop-paper-pin" />
      </>}
      {station === "wedded" && <div className="workshop-book-title">
        <img src={`${assetRoot}/wedded-wordmark.svg`} alt="" />
        <span>A day that<br />feels like you.</span>
        <div className="workshop-book-swatches"><i /><i /><i /></div>
        <small>{alternate ? "02 / HILLTOP" : "01 / GARDEN"}</small>
      </div>}
      {station === "franiq" && <span className="workshop-clipboard-clip" />}
      <img
        className="workshop-product-image workshop-product-image--primary"
        src={assets.primary.src}
        alt=""
        draggable={false}
        decoding="async"
      />
      {assets.alternate && (
        <img
          className="workshop-product-image workshop-product-image--alternate"
          src={assets.alternate.src}
          alt=""
          draggable={false}
          decoding="async"
        />
      )}
      {station === "wedded" && <span className="workshop-book-binding" />}
    </div>
  );
}
