import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fan,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { usePortfolioMotion } from "@/hooks/usePortfolioMotion";
import { WorkshopProjectVisual } from "./WorkshopProjectVisuals";
import "./CuriosityWorkbench.css";

type Station = "connect" | "remember" | "tinker";
const stations = [
  {
    id: "connect" as Station,
    title: "Somethings",
    theme: "01 / People",
    point: { x: 0.256, y: 0.339 },
    marker: { x: 0.256, y: 0.51 },
    zoom: 2.6,
    mobileZoom: 3.3,
    description:
      "Technology should bring us closer to a real human. I lead engineering at Somethings, connecting young people with peer support.",
    href: "https://somethings.com/",
    link: "Meet Somethings",
  },
  {
    id: "remember" as Station,
    title: "Recollect AI",
    theme: "02 / Learning",
    point: { x: 0.515, y: 0.438 },
    marker: { x: 0.515, y: 0.58 },
    zoom: 3.5,
    mobileZoom: 4.7,
    description:
      "A little curiosity, worth keeping. AI-assisted flashcards and spaced repetition help make room for what you want to remember.",
    href: "https://recollect-ai.netlify.app/",
    link: "Explore Recollect AI · beta",
  },
  {
    id: "tinker" as Station,
    title: "Better Saunum",
    theme: "03 / Tinkering",
    point: { x: 0.741, y: 0.443 },
    marker: { x: 0.77, y: 0.59 },
    zoom: 3.15,
    mobileZoom: 4.1,
    description:
      "My sauna hid the temperature when it was off. So I built an app with temperature history, fan controls, and a little less friction.",
    href: "/blog/building-better-saunum",
    link: "Read the build story",
  },
];
const stops = [0, 0.32, 0.62, 0.94];
const frames = [
  { at: 0, pose: 0 },
  { at: 0.07, pose: 0 },
  { at: 0.27, pose: 1 },
  { at: 0.37, pose: 1 },
  { at: 0.57, pose: 2 },
  { at: 0.67, pose: 2 },
  { at: 0.87, pose: 3 },
  { at: 1, pose: 3 },
];
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Native document scroll drives one camera across a single, continuous room. */
export default function CuriosityWorkbench() {
  const section = useRef<HTMLElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [size, setSize] = useState({ width: 1440, height: 900, mobile: false });
  const [connected, setConnected] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [fanOn, setFanOn] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const { motionEnabled, paused, reducedMotion } = usePortfolioMotion();
  const visible = useInView(section, { amount: 0 });
  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(0);
  const cameraScale = useMotionValue(1);
  const inverseScale = useTransform(cameraScale, (value) => 1 / value);
  const sceneWidth = size.mobile
    ? size.width * 1.45
    : Math.max(size.width, (size.height * 1672) / 941);
  const sceneHeight = (sceneWidth * 941) / 1672;
  const current = active > 0 ? stations[active - 1] : null;
  const animationEnabled = motionEnabled && visible;

  useEffect(() => {
    const element = lens.current;
    if (!element) return;
    const measure = () =>
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
        mobile: window.matchMedia("(max-width: 900px)").matches,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let scheduled = 0;
    const pose = (index: number) => {
      if (index === 0)
        return {
          scale: 1,
          x: (size.width - sceneWidth) / 2,
          y: size.mobile
            ? size.height * 0.63 - sceneHeight / 2
            : clamp(
                size.height * 0.46 - sceneHeight * 0.41,
                size.height - sceneHeight,
                0,
              ),
        };
      const station = stations[index - 1];
      const screenHeight = [0.1915, 0.121, 0.089][index - 1];
      const scale = Math.min(
        size.mobile ? station.mobileZoom : station.zoom,
        (size.height * (size.mobile ? 0.7 : 0.45)) /
          (sceneHeight * screenHeight),
      );
      return {
        scale,
        x: size.width * 0.5 - station.point.x * sceneWidth * scale,
        y:
          size.height * (size.mobile ? 0.55 : 0.43) -
          station.point.y * sceneHeight * scale,
      };
    };
    const update = () => {
      scheduled = 0;
      const travel = Math.max(
        1,
        element.offsetHeight -
          (element.firstElementChild as HTMLElement).offsetHeight,
      );
      const progress = clamp(
        -element.getBoundingClientRect().top / travel,
        0,
        1,
      );
      const nextActive =
        progress < 0.18 ? 0 : progress < 0.47 ? 1 : progress < 0.77 ? 2 : 3;
      if (nextActive !== activeRef.current) {
        if (
          panel.current?.contains(document.activeElement) ||
          (nextActive !== 0 &&
            document.activeElement?.closest(
              ".workshop-overview, .workshop-hotspot",
            ))
        )
          nav.current
            ?.querySelectorAll<HTMLButtonElement>("button")
            [nextActive]?.focus({ preventScroll: true });
        activeRef.current = nextActive;
        setActive(nextActive);
        setAnnouncement("");
      }
      // Paused/reduced-motion views change only at a station boundary, without travel.
      if (!motionEnabled) {
        const target = pose(nextActive);
        cameraX.set(target.x);
        cameraY.set(target.y);
        cameraScale.set(target.scale);
        return;
      }
      let segment = 0;
      while (segment < frames.length - 2 && progress > frames[segment + 1].at)
        segment++;
      const from = frames[segment];
      const to = frames[segment + 1];
      const fraction = clamp((progress - from.at) / (to.at - from.at), 0, 1);
      const eased = fraction * fraction * (3 - 2 * fraction);
      const a = pose(from.pose);
      const b = pose(to.pose);
      cameraX.set(a.x + (b.x - a.x) * eased);
      cameraY.set(a.y + (b.y - a.y) * eased);
      cameraScale.set(a.scale + (b.scale - a.scale) * eased);
    };
    const schedule = () => {
      if (!scheduled) scheduled = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(scheduled);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [
    size,
    sceneWidth,
    sceneHeight,
    motionEnabled,
    cameraX,
    cameraY,
    cameraScale,
  ]);

  const goTo = useCallback(
    (index: number, focusNavigation = false) => {
      const element = section.current;
      if (!element) return;
      if (focusNavigation)
        nav.current
          ?.querySelectorAll<HTMLButtonElement>("button")
          [index]?.focus({ preventScroll: true });
      const top = element.getBoundingClientRect().top + window.scrollY;
      const travel =
        element.offsetHeight -
        (element.firstElementChild as HTMLElement).offsetHeight;
      window.scrollTo({
        top: top + travel * stops[index],
        behavior: paused || reducedMotion ? "instant" : "smooth",
      });
    },
    [paused, reducedMotion],
  );

  const interact = () => {
    if (active === 1) {
      setConnected((value) => !value);
      setAnnouncement(
        connected
          ? "Connection reset."
          : "Better, together. The two characters are connected.",
      );
    }
    if (active === 2) {
      setFlipped((value) => !value);
      setAnnouncement(
        flipped
          ? "Question: What makes an idea stick?"
          : "Answer: Coming back to it. Small returns. Lasting knowledge.",
      );
    }
    if (active === 3) {
      setFanOn((value) => !value);
      setAnnouncement(
        fanOn
          ? "Demo fan off. Temperature remains visible at 78 degrees Fahrenheit."
          : "Demo fan on. Temperature remains visible at 78 degrees Fahrenheit.",
      );
    }
  };

  return (
    <section
      id="hero"
      ref={section}
      className="workshop-tour"
      aria-labelledby="hero-title"
      data-station={active}
    >
      <div className="workshop-stage">
        <div
          className="workshop-lens"
          ref={lens}
          aria-label="An illustrated workshop with three project stations"
        >
          <motion.div
            className="workshop-world"
            style={{
              width: sceneWidth,
              height: sceneHeight,
              x: cameraX,
              y: cameraY,
              scale: cameraScale,
            }}
          >
            <img
              className="workshop-room"
              src="/images/workshop/nicks-workshop.webp"
              alt="A wood workbench with tools, a desktop monitor, a tablet and a handmade sauna controller."
              width={1672}
              height={941}
              loading="eager"
              decoding="async"
            />
            {stations.map((station, index) => (
              <div
                key={station.id}
                className={`workshop-project-screen workshop-project-screen--${station.id}`}
                data-selected={active === index + 1 ? "yes" : "no"}
              >
                <WorkshopProjectVisual
                  station={station.id}
                  motionEnabled={animationEnabled}
                  connected={connected}
                  flipped={flipped}
                  fanOn={fanOn}
                />
                <span className="workshop-glass" />
              </div>
            ))}
            {stations.map((station, index) => (
              <motion.button
                key={station.id}
                className="workshop-hotspot"
                style={{
                  left: `${station.marker.x * 100}%`,
                  top: `${station.marker.y * 100}%`,
                  scale: inverseScale,
                  x: "-50%",
                  y: "-50%",
                }}
                type="button"
                onClick={() => goTo(index + 1, true)}
                tabIndex={active === 0 ? 0 : -1}
                aria-hidden={active !== 0}
                aria-label={`Explore ${station.title} on the workbench`}
              >
                <span className="workshop-hotspot-number">0{index + 1}</span>
                <span className="workshop-hotspot-name">
                  {station.title}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </span>
              </motion.button>
            ))}
          </motion.div>
          <div className="workshop-vignette" aria-hidden="true" />
        </div>

        <div
          className="workshop-overview"
          data-visible={active === 0 ? "yes" : "no"}
        >
          <p className="workshop-eyebrow">
            NICK GATTUSO III / ENGINEER, FOUNDER, TINKERER
          </p>
          <h1 id="hero-title">
            Come take
            <br />a closer look.
          </h1>
          <div className="workshop-overview-aside">
            <p>
              I build software, lead teams, and tinker until things work better.
              Here’s a look around.
            </p>
            <button
              type="button"
              onClick={() => goTo(1, true)}
              tabIndex={active === 0 ? 0 : -1}
            >
              Scroll to explore <ArrowDown size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="workshop-topbar">
          <span>{active === 0 ? "THE WORKBENCH" : current?.theme}</span>
          <a href="#projects">
            Skip to project list <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>

        <div className="workshop-console">
          <div
            ref={panel}
            className="workshop-project-story"
            hidden={active === 0}
          >
            <div className="workshop-project-copy">
              <p className="workshop-eyebrow">{current?.theme}</p>
              <h2>{current?.title}</h2>
              <p>{current?.description}</p>
              <a
                href={current?.href}
                {...(current?.href.startsWith("https")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {current?.link}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="workshop-project-action">
              <span className="workshop-demo-label">
                {active === 3
                  ? "INTERACTIVE DEMO · SAMPLE TEMPERATURE"
                  : "PLAY WITH THE IDEA"}
              </span>
              <button
                className="workshop-demo-button"
                type="button"
                onClick={interact}
                aria-pressed={
                  active === 1 ? connected : active === 2 ? flipped : fanOn
                }
              >
                {active === 1 ? (
                  <>
                    {connected ? (
                      <RotateCcw size={17} />
                    ) : (
                      <ArrowRight size={17} />
                    )}
                    {connected ? "Connect again" : "Make a connection"}
                  </>
                ) : active === 2 ? (
                  <>
                    <RotateCcw size={17} />
                    {flipped ? "Turn the card back" : "Turn the card over"}
                  </>
                ) : (
                  <>
                    <Fan size={17} />
                    {fanOn ? "Turn demo fan off" : "Turn demo fan on"}
                  </>
                )}
              </button>
              <p className="workshop-action-note">
                {active === 1
                  ? "A small illustration of human connection."
                  : active === 2
                    ? flipped
                      ? "Coming back to it. That’s the idea."
                      : "What makes an idea stick?"
                    : `Sample: 78°F. Heater off. Fan ${fanOn ? "on" : "off"}.`}
              </p>
            </div>
          </div>
          <div
            className="workshop-navigation"
            ref={nav}
            role="group"
            aria-label="Explore the workshop"
          >
            <button
              type="button"
              onClick={() => goTo(0)}
              aria-pressed={active === 0}
            >
              <Maximize2 size={15} aria-hidden="true" />
              <span>The whole bench</span>
              <span className="workshop-mobile-label">Overview</span>
            </button>
            {stations.map((station, index) => (
              <button
                key={station.id}
                type="button"
                onClick={() => goTo(index + 1)}
                aria-pressed={active === index + 1}
              >
                <span className="workshop-nav-number">0{index + 1}</span>
                <span>{station.title}</span>
              </button>
            ))}
            <span className="workshop-scroll-hint">
              <span>{String(active).padStart(2, "0")} / 03</span>
              <ArrowDown size={15} aria-hidden="true" />
            </span>
          </div>
        </div>
        <span className="sr-only" role="status">
          {announcement}
        </span>
      </div>
    </section>
  );
}
