import { useId } from "react";
import "./WorkshopLegacyVisuals.css";

type WorkshopLegacyVisualProps = {
  station: "remember" | "tinker";
  motionEnabled: boolean;
  flipped: boolean;
  fanOn: boolean;
};

/** Decorative screens only. The workshop's stationary panel owns all controls. */
export function WorkshopLegacyVisual({
  station,
  motionEnabled,
  flipped,
  fanOn,
}: WorkshopLegacyVisualProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div
      className={`workshop-legacy-visual workshop-legacy-visual--${station}`}
      data-motion={motionEnabled ? "on" : "off"}
      data-flipped={flipped ? "yes" : "no"}
      data-fan={fanOn ? "on" : "off"}
      aria-hidden="true"
    >
      {station === "remember" && (
        <>
          <div className="workshop-legacy-recollect-brand">
            recollect<span>AI</span>
          </div>
          <div className="workshop-legacy-memory-stack">
            <div className="workshop-legacy-memory-sheet workshop-legacy-memory-sheet-one" />
            <div className="workshop-legacy-memory-sheet workshop-legacy-memory-sheet-two" />
            <div className="workshop-legacy-memory-card">
              <div className="workshop-legacy-memory-face workshop-legacy-memory-front">
                <span className="workshop-legacy-card-label">
                  A LITTLE REMINDER
                </span>
                <strong>
                  What makes
                  <br />
                  an idea stick?
                </strong>
                <span className="workshop-legacy-card-footer">
                  01 / A QUESTION WORTH RETURNING TO
                </span>
              </div>
              <div className="workshop-legacy-memory-face workshop-legacy-memory-back">
                <span className="workshop-legacy-card-label">THE ANSWER</span>
                <strong>
                  Coming
                  <br />
                  back to it.
                </strong>
                <span className="workshop-legacy-card-footer">
                  SMALL RETURNS. LASTING KNOWLEDGE.
                </span>
              </div>
            </div>
          </div>
          <div className="workshop-legacy-review-intervals">
            <span>Today</span>
            <i />
            <span>Tomorrow</span>
            <i />
            <span>Next week</span>
          </div>
        </>
      )}

      {station === "tinker" && (
        <svg viewBox="0 0 600 220" className="workshop-legacy-visual-svg">
          <defs>
            <linearGradient id={`${id}-heat`} x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#f6c386" stopOpacity=".22" />
              <stop offset="1" stopColor="#f6c386" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="28" y="33" className="workshop-legacy-screen-brand">
            better saunum
          </text>
          <text x="28" y="67" className="workshop-legacy-screen-label">
            ALWAYS VISIBLE.
          </text>
          <text x="23" y="159" className="workshop-legacy-temperature">
            78
            <tspan className="workshop-legacy-temperature-unit" dx="5">
              °F
            </tspan>
          </text>
          <circle cx="32" cy="187" r="3" fill="#aaa999" />
          <text x="44" y="191" className="workshop-legacy-screen-label">
            DEMO · HEATER OFF
          </text>
          <path d="M216 65 V194 M358 65 V194" stroke="#adba9d" opacity=".14" />
          <g className="workshop-legacy-demo-fan" transform="translate(-98 -2)">
            <circle
              cx="385"
              cy="127"
              r="57"
              fill="#222c29"
              stroke="#b5c0a0"
              strokeWidth="1.4"
            />
            <circle
              cx="385"
              cy="127"
              r="48"
              fill="none"
              stroke="#596752"
              strokeWidth=".8"
            />
            <g className="workshop-legacy-fan-rotor" fill="#d2ddb6">
              <path d="M385 125 C359 119 351 101 367 92 C386 82 400 98 385 125" />
              <path d="M387 127 C393 101 411 93 420 109 C430 128 414 142 387 127" />
              <path d="M385 129 C411 135 419 153 403 162 C384 172 370 156 385 129" />
              <path d="M383 127 C377 153 359 161 350 145 C340 126 356 112 383 127" />
            </g>
            <circle
              cx="385"
              cy="127"
              r="9"
              fill="#26322a"
              stroke="#d2ddb6"
              strokeWidth="2"
            />
          </g>
          <text
            x="287"
            y="200"
            textAnchor="middle"
            className="workshop-legacy-screen-label"
          >
            FAN {fanOn ? "ON" : "OFF"}
          </text>
          <text x="380" y="67" className="workshop-legacy-screen-label">
            TEMPERATURE HISTORY
          </text>
          <path
            d="M380 94 H574 M380 129 H574 M380 164 H574"
            stroke="#adba9d"
            opacity=".15"
          />
          <path
            d="M380 94 C414 90 422 116 449 126 S488 145 515 151 S553 157 574 160 V172 H380 Z"
            fill={`url(#${id}-heat)`}
          />
          <path
            d="M380 94 C414 90 422 116 449 126 S488 145 515 151 S553 157 574 160"
            className="workshop-legacy-history-line"
            pathLength="100"
          />
          <circle
            cx="574"
            cy="160"
            r="4"
            fill="#f6c386"
            className="workshop-legacy-history-now"
          />
          <text x="380" y="191" className="workshop-legacy-screen-label">
            100°
          </text>
          <text
            x="574"
            y="191"
            textAnchor="end"
            className="workshop-legacy-screen-label"
          >
            78° NOW
          </text>
        </svg>
      )}
    </div>
  );
}
