import { WorkshopLegacyVisual } from "./WorkshopLegacyVisuals";
import "./WorkshopProjectVisuals.css";

export type WorkshopStation =
  "watchpoint" | "somethings" | "remember" | "tinker" | "guitar";

type ProductAsset = { src: string; alt: string };
type WorkshopAsset = {
  primary: ProductAsset;
  alternate?: ProductAsset;
  sourceLabel: string;
  actionLabel?: string;
  alternateActionLabel?: string;
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
    </div>
  );
}
