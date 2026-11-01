import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowUpRight,
  Fan,
  Lightbulb,
  Network,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { usePortfolioMotion } from "@/hooks/usePortfolioMotion";
import "./CuriosityWorkbench.css";

const modes = [
  {
    id: "connect",
    label: "Connect",
    icon: Network,
    number: "01",
    project: "Somethings",
    description:
      "Building technology that brings people closer to a real human.",
    href: "https://somethings.com/",
    link: "Meet Somethings",
  },
  {
    id: "remember",
    label: "Remember",
    icon: Lightbulb,
    number: "02",
    project: "Recollect AI",
    description:
      "Making room for the things you want to remember. One return visit at a time.",
    href: "https://recollect-ai.netlify.app/",
    link: "Explore Recollect AI",
  },
  {
    id: "tinker",
    label: "Tinker",
    icon: Fan,
    number: "03",
    project: "Better Saunum",
    description:
      "My sauna hid the temperature when it was off. So I built the app I wanted.",
    href: "/blog/building-better-saunum",
    link: "Read the build story",
  },
] as const;
type Mode = (typeof modes)[number]["id"];

export default function CuriosityWorkbench() {
  const [mode, setMode] = useState<Mode>("tinker");
  const [fanOn, setFanOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { motionEnabled } = usePortfolioMotion();
  const scene = useRef<HTMLDivElement>(null);
  const inView = useInView(scene, { amount: 0.1 });
  const animate = motionEnabled && inView;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 120, damping: 24 });
  const rotateY = useSpring(x, { stiffness: 120, damping: 24 });
  const selected = modes.find((item) => item.id === mode)!;

  useEffect(() => {
    if (!animate) {
      x.set(0);
      y.set(0);
    }
  }, [animate, x, y]);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!animate || event.pointerType !== "mouse") return;
    // Keep the hit target still while a visitor is using a physical control.
    if (event.target instanceof Element && event.target.closest("button, a"))
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -6);
  };

  return (
    <div
      ref={scene}
      className="workbench"
      data-mode={mode}
      data-animate={animate ? "yes" : "no"}
    >
      <div className="workbench-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="workbench-note">
        <span aria-hidden="true">↳</span> A few things I can’t leave alone.
      </div>
      <div
        className="workbench-perspective"
        onPointerMove={move}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div
          className="workbench-machine"
          style={{
            rotateX: animate ? rotateX : 0,
            rotateY: animate ? rotateY : 0,
          }}
        >
          <div className="machine-topline">
            <span>NG / III</span>
            <span>
              THE WORKBENCH <i aria-hidden="true" />
            </span>
          </div>
          <div
            className="machine-controls"
            role="group"
            aria-label="Choose a workbench experiment"
          >
            {modes.map(({ id, label, icon: Icon, number }) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                aria-controls="workbench-screen"
                onClick={() => setMode(id)}
              >
                <span>{number}</span>
                <Icon size={17} aria-hidden="true" />
                <strong>{label}</strong>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="machine-bezel">
            <div
              className="machine-screen"
              id="workbench-screen"
              role="region"
              aria-label={`${selected.project} interactive illustration`}
            >
              <div className="screen-topline">
                <span>
                  <i aria-hidden="true" /> {selected.project}
                </span>
                <span>EXP. {selected.number}</span>
              </div>
              <div className="screen-scene" key={mode}>
                {mode === "tinker" && (
                  <>
                    <div className="sauna-display">
                      <div className="sauna-reading">
                        <span className="screen-label">ALWAYS VISIBLE.</span>
                        <strong>
                          78<span>°F</span>
                        </strong>
                        <span className="heater-state">HEATER OFF</span>
                      </div>
                      <div
                        className={`fan-assembly ${fanOn ? "fan-running" : ""}`}
                        aria-hidden="true"
                      >
                        <span className="fan-ring" />
                        <Fan className="fan-blades" strokeWidth={1.2} />
                        <span className="fan-hub" />
                      </div>
                    </div>
                    <div
                      className="temperature-history"
                      role="img"
                      aria-label="Illustrative temperature history cooling from 100 to 78 degrees Fahrenheit"
                    >
                      <div className="history-topline">
                        <span>TEMPERATURE HISTORY</span>
                        <span>100° → 78°</span>
                      </div>
                      <svg
                        viewBox="0 0 400 70"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id="history-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity=".22"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          className="history-area"
                          d="M0 9 C35 7 47 20 78 23 S125 26 155 38 S201 44 235 49 S290 52 323 56 S371 59 400 59 V70 H0 Z"
                        />
                        <path
                          className="history-line"
                          d="M0 9 C35 7 47 20 78 23 S125 26 155 38 S201 44 235 49 S290 52 323 56 S371 59 400 59"
                        />
                        <circle
                          className="history-dot"
                          cx="392"
                          cy="59"
                          r="3"
                        />
                      </svg>
                      <div className="history-axis">
                        <span>EARLIER</span>
                        <span>NOW</span>
                      </div>
                    </div>
                    <button
                      className="screen-action fan-switch"
                      type="button"
                      onClick={() => setFanOn((value) => !value)}
                      aria-pressed={fanOn}
                      aria-label="Toggle demo fan"
                    >
                      <span>
                        <Fan size={14} aria-hidden="true" /> Fan{" "}
                        {fanOn ? "on" : "off"}
                      </span>
                      <span className="switch-track" aria-hidden="true">
                        <i />
                      </span>
                    </button>
                  </>
                )}
                {mode === "connect" && (
                  <>
                    <div
                      className={`connection-world ${connected ? "is-connected" : ""}`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 400 170" className="connection-cable">
                        <path d="M92 85 C150 8 250 160 308 85" />
                        <path
                          className="connection-signal"
                          d="M92 85 C150 8 250 160 308 85"
                        />
                      </svg>
                      <div className="connection-person person-one">
                        <span className="pixel-eyes">
                          <i />
                          <i />
                        </span>
                        <span className="pixel-smile" />
                      </div>
                      <span className="connection-plus">
                        {connected ? "♡" : "+"}
                      </span>
                      <div className="connection-person person-two">
                        <span className="pixel-eyes">
                          <i />
                          <i />
                        </span>
                        <span className="pixel-smile" />
                      </div>
                    </div>
                    <p className="connection-message">
                      {connected
                        ? "Better, together."
                        : "A real human on the other end."}
                    </p>
                    <button
                      className="screen-action"
                      type="button"
                      onClick={() => setConnected((value) => !value)}
                      aria-pressed={connected}
                    >
                      {connected ? (
                        <>
                          <RotateCcw size={14} aria-hidden="true" /> Try again
                        </>
                      ) : (
                        <>
                          <Network size={14} aria-hidden="true" /> Make a
                          connection
                        </>
                      )}
                    </button>
                  </>
                )}
                {mode === "remember" && (
                  <>
                    <div
                      className={`memory-world ${flipped ? "is-flipped" : ""}`}
                    >
                      <span
                        className="memory-card-back back-one"
                        aria-hidden="true"
                      />
                      <span
                        className="memory-card-back back-two"
                        aria-hidden="true"
                      />
                      <button
                        className="memory-card"
                        type="button"
                        onClick={() => setFlipped((value) => !value)}
                        aria-label={
                          flipped
                            ? "Coming back to it. Show flashcard question"
                            : "What makes an idea stick? Reveal flashcard answer"
                        }
                      >
                        <span className="memory-card-inner">
                          <span
                            className="memory-card-face memory-front"
                            aria-hidden={flipped}
                          >
                            <span>01 / A LITTLE REMINDER</span>
                            <strong>
                              What makes
                              <br />
                              an idea stick?
                            </strong>
                            <span>Tap to turn it over ↗</span>
                          </span>
                          <span
                            className="memory-card-face memory-back"
                            aria-hidden={!flipped}
                          >
                            <Sparkles size={23} aria-hidden="true" />
                            <strong>
                              Coming
                              <br />
                              back to it.
                            </strong>
                            <span>Small returns. Lasting knowledge.</span>
                          </span>
                        </span>
                      </button>
                    </div>
                    <span className="sr-only" aria-live="polite">
                      {flipped
                        ? "Answer: Coming back to it. Small returns. Lasting knowledge."
                        : ""}
                    </span>
                    <div
                      className="memory-intervals"
                      aria-label="Illustrative spaced review intervals"
                    >
                      <span className="interval-dot" />
                      Today
                      <i />
                      <span
                        className={
                          flipped ? "interval-dot active" : "interval-dot"
                        }
                      />
                      Tomorrow
                      <i />
                      <span
                        className={
                          flipped ? "interval-dot active" : "interval-dot"
                        }
                      />
                      Next week
                    </div>
                  </>
                )}
              </div>
              <div className="screen-bottomline">
                <span>INTERACTIVE DEMO</span>
                <span>
                  {mode === "tinker"
                    ? "DEMO · NOT LIVE"
                    : mode === "remember"
                      ? "RECOLLECT AI · BETA"
                      : "HUMAN CONNECTION"}
                </span>
              </div>
            </div>
          </div>
          <div className="machine-bottom">
            <span className="machine-vents" aria-hidden="true" />
            <span>BUILT FROM CURIOSITY.</span>
            <span className="machine-screw" aria-hidden="true">
              +
            </span>
          </div>
        </motion.div>
        <div className="machine-foot" aria-hidden="true" />
        <div className="machine-shadow" aria-hidden="true" />
      </div>
      <div className="workbench-story" aria-live="polite" aria-atomic="true">
        <p>{selected.description}</p>
        <a
          href={selected.href}
          {...(selected.href.startsWith("https")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {selected.link}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
