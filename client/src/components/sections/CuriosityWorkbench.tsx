import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fan,
  Guitar,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { usePortfolioMotion } from "@/hooks/usePortfolioMotion";
import { useGuitarStrum } from "@/hooks/useGuitarStrum";
import {
  WorkshopProjectVisual,
  workshopAssets,
  type WorkshopStation,
} from "./WorkshopProjectVisuals";
import "./CuriosityWorkbench.css";

const stations = [
  {
    id: "watchpoint" as WorkshopStation,
    title: "Watchpoint",
    theme: "01 / Observability",
    point: { x: 0.256, y: 0.339 },
    marker: { x: 0.256, y: 0.51 },
    zoom: 2.6,
    mobileZoom: 3.3,
    screenHeight: 0.1915,
    description:
      "A clearer view of the systems behind a product. Watchpoint brings service health, errors, analytics, and custom metrics into one dashboard.",
    href: "https://watchpoint.dev/",
    link: "Explore Watchpoint",
  },
  {
    id: "somethings" as WorkshopStation,
    title: "Somethings",
    theme: "02 / People",
    point: { x: 0.384, y: 0.5 },
    marker: { x: 0.384, y: 0.63 },
    zoom: 4.2,
    mobileZoom: 7,
    screenHeight: 0.17,
    description:
      "Technology should bring us closer to a real human. I lead engineering at Somethings, connecting young people with peer support.",
    href: "https://www.somethings.com/",
    link: "Meet Somethings",
  },
  {
    id: "remember" as WorkshopStation,
    title: "Recollect AI",
    theme: "03 / Learning",
    point: { x: 0.515, y: 0.438 },
    marker: { x: 0.515, y: 0.58 },
    zoom: 3.5,
    mobileZoom: 4.7,
    screenHeight: 0.121,
    description:
      "A little curiosity, worth keeping. AI-assisted flashcards and spaced repetition help make room for what you want to remember.",
    href: "https://recollect-ai.netlify.app/",
    link: "Explore Recollect AI · beta",
  },
  {
    id: "tinker" as WorkshopStation,
    title: "Better Saunum",
    theme: "04 / Tinkering",
    point: { x: 0.741, y: 0.443 },
    marker: { x: 0.77, y: 0.59 },
    zoom: 3.15,
    mobileZoom: 4.1,
    screenHeight: 0.089,
    description:
      "My sauna hid the temperature when it was off. So I built an app with temperature history, fan controls, and a little less friction.",
    href: "/blog/building-better-saunum",
    link: "Read the build story",
  },
  {
    id: "guitar" as WorkshopStation,
    title: "Guitar Rudiments",
    theme: "05 / Practice",
    point: { x: 0.862, y: 0.655 },
    marker: { x: 0.927, y: 0.675 },
    zoom: 2.7,
    mobileZoom: 5.8,
    screenHeight: 0.245,
    description:
      "A little practice, a little progress. I built Guitar Rudiments for focused sessions: guided drills, chord loops, a metronome, a tuner, and a practice journal.",
    href: "https://guitar-rudiments.netlify.app/",
    link: "Open Guitar Rudiments",
  },
  {
    id: "persona" as WorkshopStation,
    title: "Persona",
    theme: "06 / Creativity",
    point: { x: 0.46, y: 0.25 },
    marker: { x: 0.46, y: 0.135 },
    zoom: 3.6,
    mobileZoom: 4.8,
    screenHeight: 0.2,
    description:
      "Every good ad starts with understanding someone. Persona connects market research and buyer personas to finished ad creative, ready to review and download.",
    href: "https://personaapp.ai/",
    link: "Explore Persona",
  },
  {
    id: "wedded" as WorkshopStation,
    title: "GetWedded",
    theme: "07 / Possibility",
    point: { x: 0.628, y: 0.572 },
    marker: { x: 0.635, y: 0.665 },
    zoom: 3.3,
    mobileZoom: 3.8,
    screenHeight: 0.15,
    description:
      "Start with how you want the day to feel. Wedded turns that vision into venue discovery, with an AI assistant to handle outreach, follow-ups, and tour coordination.",
    href: "https://getwedded.ai/",
    link: "Explore GetWedded",
  },
  {
    id: "franiq" as WorkshopStation,
    title: "FranIQ",
    theme: "08 / Clarity",
    point: { x: 0.63, y: 0.25 },
    marker: { x: 0.63, y: 0.135 },
    zoom: 3.5,
    mobileZoom: 4.5,
    screenHeight: 0.21,
    description:
      "A clearer picture of a growing franchise. FranIQ, The Internicola Law Firm’s platform, brings registrations, disclosures, documents, and compliance workflows together.",
    href: "https://www.franchiselawsolutions.com/franiq",
    link: "Explore FranIQ",
  },
];
// Evenly distribute every station within the native scroll range. Leave room
// for an overview and a final hold, regardless of how many projects are added.
const stationSpacing = 0.84 / Math.max(1, stations.length - 1);
const stops = [0, ...stations.map((_, index) => 0.12 + index * stationSpacing)];
const hold = Math.min(0.035, stationSpacing * 0.2);
const frames = [
  { at: 0, pose: 0 },
  { at: 0.045, pose: 0 },
  ...stops.slice(1).flatMap((stop, index) => [
    { at: stop - hold, pose: index + 1 },
    { at: Math.min(1, stop + hold), pose: index + 1 },
  ]),
  { at: 1, pose: stations.length },
];
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Native document scroll drives one camera across a single, continuous room. */
export default function CuriosityWorkbench() {
  const section = useRef<HTMLElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [size, setSize] = useState({ width: 1440, height: 900, mobile: false });
  const [alternateViews, setAlternateViews] = useState<
    Partial<Record<WorkshopStation, boolean>>
  >({ watchpoint: false, somethings: false, remember: false, tinker: false, guitar: false });
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
  const { strum, strumming } = useGuitarStrum(current?.id === "guitar");
  const animationEnabled = motionEnabled && visible;
  const currentAssets = current ? workshopAssets[current.id] : null;
  const alternate = current ? Boolean(alternateViews[current.id]) : false;
  const currentImage = currentAssets
    ? alternate && currentAssets.alternate
      ? currentAssets.alternate
      : currentAssets.primary
    : null;

  useEffect(() => {
    const navigation = nav.current;
    const button = navigation?.querySelectorAll<HTMLButtonElement>("button")[active];
    if (!navigation || !button) return;
    // Scroll only the tab strip, never the document that drives the camera.
    navigation.scrollTo({
      left: button.offsetLeft - navigation.clientWidth / 2 + button.offsetWidth / 2,
      behavior: motionEnabled ? "smooth" : "instant",
    });
  }, [active, motionEnabled, size.width]);

  useEffect(() => {
    const element = consoleRef.current;
    if (!element) return;
    let scheduled = 0;
    let previousHeight = -1;
    const measure = () => {
      scheduled = 0;
      const height = element.offsetHeight;
      if (height === previousHeight) return;
      previousHeight = height;
      section.current?.style.setProperty(
        "--workshop-console-height",
        `${height}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(() => {
      if (!scheduled) scheduled = requestAnimationFrame(measure);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, []);

  useEffect(() => {
    const element = lens.current;
    if (!element) return;
    let scheduled = 0;
    const measure = () => {
      scheduled = 0;
      const next = {
        width: element.clientWidth,
        height: element.clientHeight,
        mobile: window.matchMedia("(max-width: 900px)").matches,
      };
      setSize((previous) =>
        previous.width === next.width &&
        previous.height === next.height &&
        previous.mobile === next.mobile
          ? previous
          : next,
      );
    };
    measure();
    const observer = new ResizeObserver(() => {
      if (!scheduled) scheduled = requestAnimationFrame(measure);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let scheduled = 0;
    const pose = (index: number) => {
      if (index === 0) {
        const overviewScale = size.mobile && window.innerWidth < 560
          ? size.width / sceneWidth : 1;
        return {
          scale: overviewScale,
          x: (size.width - sceneWidth * overviewScale) / 2,
          y: size.mobile
            ? size.height * (overviewScale < 1 ? 0.72 : 0.63) - sceneHeight * overviewScale / 2
            : clamp(
                size.height * 0.46 - sceneHeight * 0.41,
                size.height - sceneHeight,
                0,
              ),
        };
      }
      const station = stations[index - 1];
      const screenHeight = station.screenHeight;
      const isPhone = station.id === "somethings" || station.id === "guitar";
      const isPaper = ["persona", "wedded", "franiq"].includes(station.id);
      const compactDesktop = !size.mobile && size.width <= 1200;
      const paperWidth = station.id === "wedded" ? 0.2
        : station.id === "persona" ? 0.145
        : station.id === "franiq" ? 0.12 : 0;
      const heightFraction = size.mobile ? (isPhone ? 0.82 : 0.7)
        : compactDesktop ? 0.38 : isPhone ? 0.54 : isPaper ? 0.38 : 0.45;
      const verticalFocus = size.mobile ? (isPhone ? 0.5 : 0.55)
        : compactDesktop ? 0.36 : isPhone ? 0.4 : isPaper ? 0.37 : 0.43;
      const scale = Math.min(
        size.mobile ? station.mobileZoom : station.zoom,
        paperWidth ? (size.width * 0.9) / (sceneWidth * paperWidth) : Infinity,
        (size.height * heightFraction) / (sceneHeight * screenHeight),
      );
      return {
        scale,
        x: clamp(
          size.width * 0.5 -
            (station.id === "guitar" && size.mobile ? 0.843 : station.point.x) * sceneWidth * scale,
          Math.min(0, size.width - sceneWidth * scale),
          0,
        ),
        y: size.height * verticalFocus - station.point.y * sceneHeight * scale,
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
      const nextActive = stops.reduce(
        (nearest, stop, index) =>
          Math.abs(progress - stop) < Math.abs(progress - stops[nearest]) ? index : nearest,
        0,
      );
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

  const interact = async () => {
    if (!current) return;
    if (current.id === "guitar") {
      const played = await strum();
      setAnnouncement(played
        ? "Playing an E minor chord. The guitar sound is a portfolio demo."
        : "Sound is unavailable in this browser. You can still explore Guitar Rudiments.");
      return;
    }
    setAlternateViews((views) => ({
      ...views,
      [current.id]: !views[current.id],
    }));
    setAnnouncement(
      current.id === "remember"
        ? alternate
          ? "What makes an idea stick?"
          : "Coming back to it."
        : current.id === "tinker"
          ? `Demo fan ${alternate ? "on" : "off"}. Temperature remains visible at 78 degrees Fahrenheit.`
          : `${current.title}: ${alternate ? currentAssets?.primary.alt : currentAssets?.alternate?.alt}`,
    );
  };

  return (
    <section
      id="hero"
      ref={section}
      className="workshop-tour"
      aria-labelledby="hero-title"
      data-station={active}
      data-motion={animationEnabled ? "on" : "off"}
      style={{ height: `${(stations.length + 1) * 100 + 10}svh` }}
    >
      <div className="workshop-stage">
        <div
          className="workshop-lens"
          ref={lens}
          aria-label={`A workshop with ${stations.length} interactive project stations`}
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
              alt="A wood workbench with tools, a desktop monitor, a tablet and a handmade sauna controller. A phone sits on the table; a guitar and practice phone stand beside the bench."
              width={1672}
              height={941}
              loading="eager"
              decoding="async"
            />
            <div className="workshop-guitar-amp" aria-hidden="true">
              <span>GUITAR RUDIMENTS</span>
            </div>
            <div
              className="workshop-guitar"
              data-strumming={strumming && animationEnabled ? "yes" : "no"}
              aria-hidden="true"
            >
              <span className="workshop-guitar-floor-shadow" />
              <img
                src="/images/workshop/acoustic-guitar.webp"
                alt=""
                width={1194}
                height={2961}
                draggable={false}
              />
              <div className="workshop-guitar-strings">
                {[0, 1, 2, 3, 4, 5].map((string) => <i key={string} />)}
              </div>
            </div>
            {stations.map((station, index) => (
              <div
                key={station.id}
                className={`workshop-project-screen workshop-project-screen--${station.id}`}
                data-selected={active === index + 1 ? "yes" : "no"}
              >
                <WorkshopProjectVisual
                  station={station.id}
                  motionEnabled={animationEnabled}
                  alternate={Boolean(alternateViews[station.id])}
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

        <div className="workshop-console" ref={consoleRef}>
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
                {current?.id === "remember"
                  ? "PLAY WITH THE IDEA"
                  : current?.id === "tinker"
                    ? "INTERACTIVE DEMO · SAMPLE TEMPERATURE"
                    : currentAssets?.sourceLabel}
              </span>
              {(currentAssets?.alternate || current?.id === "guitar" || current?.id === "remember" || current?.id === "tinker") && (
                <button
                  className="workshop-demo-button"
                  type="button"
                  onClick={interact}
                  aria-pressed={
                    current?.id === "guitar" ? undefined : current?.id === "tinker" ? !alternate : alternate
                  }
                >
                  {current?.id === "guitar" ? (
                    <Guitar size={17} aria-hidden="true" />
                  ) : current?.id === "tinker" ? (
                    <Fan size={17} aria-hidden="true" />
                  ) : alternate || current?.id === "remember" ? (
                    <RotateCcw size={17} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={17} aria-hidden="true" />
                  )}
                  {current?.id === "guitar"
                    ? "Strum the guitar · sound"
                    : current?.id === "remember"
                    ? alternate
                      ? "Turn the card back"
                      : "Turn the card over"
                    : current?.id === "tinker"
                      ? alternate
                        ? "Turn demo fan on"
                        : "Turn demo fan off"
                      : alternate
                        ? currentAssets?.alternateActionLabel
                        : currentAssets?.actionLabel}
                </button>
              )}
              {currentImage ? (
                <a
                  className="workshop-original-link"
                  href={currentImage?.src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentAssets?.originalLabel ?? "View full screenshot"}{" "}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              ) : (
                <p className="workshop-action-note">
                  {current?.id === "remember"
                    ? alternate
                      ? "Coming back to it. That’s the idea."
                      : "What makes an idea stick?"
                    : `Sample: 78°F. Heater off. Fan ${alternate ? "off" : "on"}.`}
                </p>
              )}
            </div>
          </div>
          <div className="workshop-navigation-caption" aria-hidden="true">
            <span>EXPLORE THE BENCH</span>
            <span>{String(active).padStart(2, "0")} / {String(stations.length).padStart(2, "0")} · Swipe tabs →</span>
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
                <span className={station.id === "guitar" ? "workshop-nav-full-title" : undefined}>{station.title}</span>
                {station.id === "guitar" && <span className="workshop-mobile-label">Guitar</span>}
              </button>
            ))}
            <span className="workshop-scroll-hint">
              <span>{String(active).padStart(2, "0")} / {String(stations.length).padStart(2, "0")}</span>
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
