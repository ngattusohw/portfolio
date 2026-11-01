import { useId } from "react";
import "./WorkshopProjectVisuals.css";

type WorkshopProjectVisualProps = {
  station: "connect" | "remember" | "tinker";
  motionEnabled: boolean;
  connected: boolean;
  flipped: boolean;
  fanOn: boolean;
};

/** Decorative screens only. The workshop's stationary panel owns all controls. */
export function WorkshopProjectVisual({
  station,
  motionEnabled,
  connected,
  flipped,
  fanOn,
}: WorkshopProjectVisualProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div
      className={`workshop-visual workshop-visual--${station}`}
      data-motion={motionEnabled ? "on" : "off"}
      data-connected={connected ? "yes" : "no"}
      data-flipped={flipped ? "yes" : "no"}
      data-fan={fanOn ? "on" : "off"}
      aria-hidden="true"
    >
      {station === "connect" && (
        <svg viewBox="0 0 500 320" className="workshop-visual-svg">
          <defs>
            <linearGradient id={`${id}-pink`} x2="1" y2="1">
              <stop stopColor="#ffd9db" />
              <stop offset="1" stopColor="#e78bad" />
            </linearGradient>
            <linearGradient id={`${id}-green`} x2="1" y2="1">
              <stop stopColor="#dfffab" />
              <stop offset="1" stopColor="#a4c877" />
            </linearGradient>
          </defs>
          <text x="28" y="33" className="workshop-screen-brand">
            somethings
          </text>
          <circle cx="461" cy="27" r="4" fill="#d9ffaa" />
          <path
            d="M125 166 C185 65 309 268 376 166"
            className="workshop-connection-line"
          />
          <path
            d="M125 166 C185 65 309 268 376 166"
            className="workshop-connection-signal"
            pathLength="100"
          />
          <g className="workshop-person workshop-person-one">
            <ellipse
              cx="121"
              cy="231"
              rx="68"
              ry="11"
              fill="#000"
              opacity=".2"
            />
            <rect
              x="53"
              y="90"
              width="137"
              height="137"
              rx="52"
              fill={`url(#${id}-pink)`}
            />
            <path
              d="M70 125 C84 94 111 95 127 97"
              stroke="#ffe9e6"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity=".7"
            />
            <g className="workshop-avatar-eyes" fill="#4a3043">
              <ellipse cx="101" cy="153" rx="5" ry="8" />
              <ellipse cx="143" cy="153" rx="5" ry="8" />
            </g>
            <path
              d="M106 178 Q122 194 138 178"
              stroke="#4a3043"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="83"
              cy="173"
              rx="11"
              ry="6"
              fill="#e8729b"
              opacity=".5"
            />
            <ellipse
              cx="160"
              cy="173"
              rx="11"
              ry="6"
              fill="#e8729b"
              opacity=".5"
            />
          </g>
          <g className="workshop-person workshop-person-two">
            <ellipse
              cx="377"
              cy="231"
              rx="68"
              ry="11"
              fill="#000"
              opacity=".2"
            />
            <rect
              x="309"
              y="90"
              width="137"
              height="137"
              rx="66"
              fill={`url(#${id}-green)`}
            />
            <path
              d="M328 125 C342 99 365 96 382 98"
              stroke="#f0ffdb"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity=".7"
            />
            <g className="workshop-avatar-eyes" fill="#35432b">
              <ellipse cx="356" cy="153" rx="5" ry="8" />
              <ellipse cx="398" cy="153" rx="5" ry="8" />
            </g>
            <path
              d="M361 178 Q377 194 393 178"
              stroke="#35432b"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
          <g className="workshop-connection-heart">
            <circle cx="250" cy="158" r="25" fill="#29262f" stroke="#a183a3" />
            {connected ? (
              <path
                d="M250 170 L237 157 C226 144 244 137 250 148 C256 137 274 144 263 157 Z"
                fill="#f5b4cc"
              />
            ) : (
              <path
                d="M241 158 H259 M250 149 V167"
                stroke="#e3d8e5"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>
          <text
            x="250"
            y="280"
            textAnchor="middle"
            className="workshop-screen-message"
          >
            {connected ? "Better, together." : "Human connection."}
          </text>
        </svg>
      )}

      {station === "remember" && (
        <>
          <div className="workshop-recollect-brand">
            recollect<span>AI</span>
          </div>
          <div className="workshop-memory-stack">
            <div className="workshop-memory-sheet workshop-memory-sheet-one" />
            <div className="workshop-memory-sheet workshop-memory-sheet-two" />
            <div className="workshop-memory-card">
              <div className="workshop-memory-face workshop-memory-front">
                <span className="workshop-card-label">A LITTLE REMINDER</span>
                <strong>
                  What makes
                  <br />
                  an idea stick?
                </strong>
                <span className="workshop-card-footer">
                  01 / A QUESTION WORTH RETURNING TO
                </span>
              </div>
              <div className="workshop-memory-face workshop-memory-back">
                <span className="workshop-card-label">THE ANSWER</span>
                <strong>
                  Coming
                  <br />
                  back to it.
                </strong>
                <span className="workshop-card-footer">
                  SMALL RETURNS. LASTING KNOWLEDGE.
                </span>
              </div>
            </div>
          </div>
          <div className="workshop-review-intervals">
            <span>Today</span>
            <i />
            <span>Tomorrow</span>
            <i />
            <span>Next week</span>
          </div>
        </>
      )}

      {station === "tinker" && (
        <svg viewBox="0 0 600 220" className="workshop-visual-svg">
          <defs>
            <linearGradient id={`${id}-heat`} x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#f6c386" stopOpacity=".22" />
              <stop offset="1" stopColor="#f6c386" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="28" y="33" className="workshop-screen-brand">
            better saunum
          </text>
          <text x="28" y="67" className="workshop-screen-label">
            ALWAYS VISIBLE.
          </text>
          <text x="23" y="159" className="workshop-temperature">
            78
            <tspan className="workshop-temperature-unit" dx="5">
              °F
            </tspan>
          </text>
          <circle cx="32" cy="187" r="3" fill="#aaa999" />
          <text x="44" y="191" className="workshop-screen-label">
            DEMO · HEATER OFF
          </text>
          <path d="M216 65 V194 M358 65 V194" stroke="#adba9d" opacity=".14" />
          <g className="workshop-demo-fan" transform="translate(-98 -2)">
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
            <g className="workshop-fan-rotor" fill="#d2ddb6">
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
            className="workshop-screen-label"
          >
            FAN {fanOn ? "ON" : "OFF"}
          </text>
          <text x="380" y="67" className="workshop-screen-label">
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
            className="workshop-history-line"
            pathLength="100"
          />
          <circle
            cx="574"
            cy="160"
            r="4"
            fill="#f6c386"
            className="workshop-history-now"
          />
          <text x="380" y="191" className="workshop-screen-label">
            100°
          </text>
          <text
            x="574"
            y="191"
            textAnchor="end"
            className="workshop-screen-label"
          >
            78° NOW
          </text>
        </svg>
      )}
    </div>
  );
}
