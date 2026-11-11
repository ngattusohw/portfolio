import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Fan, Guitar, RotateCcw } from "lucide-react";
import { usePortfolioMotion } from "@/hooks/usePortfolioMotion";
import { useGuitarStrum } from "@/hooks/useGuitarStrum";
import { WorkshopProjectVisual, workshopAssets, type WorkshopStation } from "./WorkshopProjectVisuals";
import { tourPose, tourStops, type WorkshopFrame } from "./workshop3d/tour";
import "./CuriosityWorkbench.css";

const stations: {id: WorkshopStation; title: string; theme: string; heading: string; description: string; note: string; href: string; link: string}[] = [
  { id: "watchpoint", title: "Watchpoint", theme: "01 / A CLEARER PICTURE", heading: "See the whole system.", description: "The services, the errors, the signals that matter. Watchpoint brings the moving parts of a product into one clear view.", note: "Observability, made approachable.", href: "https://watchpoint.dev/", link: "Explore Watchpoint" },
  { id: "somethings", title: "Somethings", theme: "02 / A HUMAN CONNECTION", heading: "Someone in your corner.", description: "I lead engineering at Somethings, where technology helps young people connect with a real peer mentor. The important part is the person on the other side.", note: "Building for people, with people.", href: "https://www.somethings.com/", link: "Meet Somethings" },
  { id: "remember", title: "Recollect AI", theme: "03 / A LITTLE CURIOSITY", heading: "Make room for what sticks.", description: "An interesting thought deserves another visit. AI-assisted flashcards and spaced repetition turn small moments of curiosity into lasting knowledge.", note: "A little reminder. A reason to return.", href: "https://recollect-ai.netlify.app/", link: "Explore Recollect AI · beta" },
  { id: "tinker", title: "Better Saunum", theme: "04 / A REASON TO TINKER", heading: "It started with a missing temperature.", description: "My sauna hid its temperature when it was off. So I built an app with temperature history, fan controls, and the information I wanted to see all along.", note: "An everyday frustration, turned into a build.", href: "/blog/building-better-saunum", link: "Read the build story" },
  { id: "guitar", title: "Guitar Rudiments", theme: "05 / A DAILY PRACTICE", heading: "A little better, every day.", description: "A guitar, a few focused minutes, and something to work on. I built Guitar Rudiments for guided drills, chord loops, a metronome, a tuner, and a practice journal.", note: "Software for the things I keep coming back to.", href: "https://guitar-rudiments.netlify.app/", link: "Open Guitar Rudiments" },
];

export default function CuriosityWorkbench() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const engine = useRef<{invalidate: () => void; dispose: () => void} | null>(null);
  const goToRef = useRef<(index: number, focus?: boolean) => void>(() => {});
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [alternate, setAlternate] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [fanOn, setFanOn] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [visible, setVisible] = useState(true);
  const { motionEnabled, paused, reducedMotion } = usePortfolioMotion();
  const { strum, strumming } = useGuitarStrum(active === 5);
  const current = active ? stations[active - 1] : null;
  const state = useRef<WorkshopFrame>({ progress: 0, active: 0, motion: motionEnabled, visible: true, fanOn: true, flipped: false, alternate: false, strumming: false, storyWidth: 400, storyHeight: 300, mobile: false });
  Object.assign(state.current, { active, motion: motionEnabled, visible, fanOn, flipped, alternate, strumming });

  const goTo = useCallback((index: number, focus = false) => {
    const element = section.current;
    const view = stage.current;
    if (!element || !view) return;
    if (focus) navigation.current?.querySelectorAll<HTMLButtonElement>("button")[index]?.focus({ preventScroll: true });
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top + (element.offsetHeight - view.offsetHeight) * tourStops[index], behavior: paused || reducedMotion ? "instant" : "smooth" });
  }, [paused, reducedMotion]);
  goToRef.current = goTo;

  useEffect(() => {
    let cancelled = false;
    void import("./workshop3d/scene").then(({ createWorkshopScene }) => {
      if (cancelled || !canvas.current) return;
      engine.current = createWorkshopScene(canvas.current, () => state.current, index => goToRef.current(index, true), () => { if (!cancelled) setStatus("ready"); }, () => { if (!cancelled) setStatus("fallback"); });
    }).catch(() => { if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; engine.current?.dispose(); engine.current = null; };
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = section.current;
    const view = stage.current;
    if (!element || !view) return;
    let request = 0;
    const update = () => {
      request = 0;
      const progress = Math.max(0, Math.min(1, -element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - view.offsetHeight)));
      state.current.progress = progress;
      const next = Math.round(tourPose(progress));
      if (next !== state.current.active) {
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && (story.current?.contains(focused) || focused.closest(".spatial-intro"))) navigation.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus({ preventScroll: true });
        state.current.active = next;
        setActive(next);
        setAnnouncement("");
      }
      engine.current?.invalidate();
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(update); };
    const measure = () => {
      state.current.mobile = window.matchMedia("(max-width: 760px)").matches;
      state.current.storyWidth = story.current?.offsetWidth || 0;
      state.current.storyHeight = story.current?.offsetHeight || 0;
      update();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(view);
    if (story.current) resize.observe(story.current);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(request); resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => { engine.current?.invalidate(); }, [active, alternate, flipped, fanOn, strumming, motionEnabled, visible, status]);

  const interact = async () => {
    if (current?.id === "somethings") { setAlternate(!alternate); setAnnouncement(alternate ? "Showing the original mentor screen." : "Showing the original chat screen."); }
    if (current?.id === "remember") { setFlipped(!flipped); setAnnouncement(flipped ? "What makes an idea stick?" : "Coming back to it."); }
    if (current?.id === "tinker") { setFanOn(!fanOn); setAnnouncement(`Demo fan ${fanOn ? "off" : "on"}. Temperature remains visible at 78 degrees Fahrenheit.`); }
    if (current?.id === "guitar") { const played = await strum(); setAnnouncement(played ? "Playing an E minor chord. This sound is a portfolio demo." : "Sound is unavailable. You can still explore the app."); }
  };
  const assets = current ? workshopAssets[current.id] : undefined;
  const productImage = assets ? alternate && current?.id === "somethings" && assets.alternate ? assets.alternate : assets.primary : undefined;
  const actionText = current?.id === "somethings" ? alternate ? "Meet the mentor" : "See the conversation" : current?.id === "remember" ? flipped ? "Turn the card back" : "Turn the card over" : current?.id === "tinker" ? fanOn ? "Turn the fan off" : "Turn the fan on" : "Strum the guitar · sound";

  return (
    <section id="hero" ref={section} className="spatial-tour" aria-labelledby="hero-title" data-station={active} data-renderer={status}>
      <div ref={stage} className="spatial-stage">
        <div className="spatial-scene" role="img" aria-label="A three-dimensional workbench with Watchpoint, Somethings, Recollect AI, Better Saunum, and Guitar Rudiments. Explore each project using the controls below.">
          <canvas ref={canvas} className="spatial-canvas" aria-hidden="true" />
          {status !== "ready" && <div className="spatial-poster" aria-hidden="true">
            {!current ? <img src="/images/workshop/nicks-workshop.webp" alt="" /> : <div className={`spatial-fallback-screen spatial-fallback-screen--${current.id}`}><WorkshopProjectVisual station={current.id} motionEnabled={motionEnabled && visible} alternate={current.id === "remember" ? flipped : current.id === "tinker" ? !fanOn : alternate} /></div>}
          </div>}
        </div>
        <div className="spatial-shade" aria-hidden="true" />
        <div className="spatial-topline"><span><i /> NICK’S WORKSHOP</span><a href="#projects">All projects <ArrowUpRight size={12} aria-hidden="true" /></a></div>
        <div className="spatial-intro" aria-hidden={active !== 0}>
          <p className="spatial-eyebrow">ENGINEER. FOUNDER. CONSTANT TINKERER.</p>
          <h1 id="hero-title">Always making<br /><em>something.</em></h1>
          <p className="spatial-intro-copy">I build software, lead teams, and follow<br className="spatial-desktop-break" /> the things that make me curious.</p>
          <button onClick={() => goTo(1, true)} tabIndex={active === 0 ? 0 : -1} className="spatial-explore">Come take a closer look <ArrowDown size={16} aria-hidden="true" /></button>
        </div>
        <div className="spatial-room-caption" aria-hidden={active !== 0}><span>FIVE PROJECTS. ONE WORKBENCH.</span><p>Scroll to look around.<br />Or pick something that catches your eye.</p></div>
        <div ref={story} className="spatial-story" hidden={active === 0}>
          <div key={current?.id} className="spatial-story-content">
            <p className="spatial-eyebrow">{current?.theme}</p><h2>{current?.heading}</h2>
            <p className="spatial-story-description">{current?.description}</p>
            <div className="spatial-action-area">
              {current?.id !== "watchpoint" && <button type="button" className="spatial-action" onClick={interact} aria-pressed={current?.id === "guitar" ? undefined : current?.id === "tinker" ? fanOn : current?.id === "remember" ? flipped : alternate}>
                {current?.id === "guitar" ? <Guitar size={17} /> : current?.id === "tinker" ? <Fan size={17} /> : current?.id === "remember" ? <RotateCcw size={17} /> : <ArrowRight size={17} />}{actionText}
              </button>}
              <span className="spatial-source">{current?.id === "tinker" ? `INTERACTIVE DEMO · 78°F · HEATER OFF · FAN ${fanOn ? "ON" : "OFF"}` : current?.id === "remember" ? "INTERACTIVE PORTFOLIO DEMO" : assets?.sourceLabel}</span>
            </div>
            <a className="spatial-project-link" href={current?.href} {...(current?.href.startsWith("https") ? {target: "_blank", rel: "noopener noreferrer"} : {})}>{current?.link}<ArrowUpRight size={16} aria-hidden="true" /></a>
            {productImage && <a className="spatial-original" href={productImage.src} target="_blank" rel="noopener noreferrer">View original screenshot <ArrowUpRight size={11} aria-hidden="true" /></a>}
            <p className="spatial-note">{current?.note}</p>
          </div>
        </div>
        <div className="spatial-bottom">
          <nav ref={navigation} className="spatial-navigation" aria-label="Explore the workshop">
            <button onClick={() => goTo(0)} aria-current={active === 0 ? "step" : undefined} aria-label="Overview of the workbench"><span className="spatial-overview-icon">⌂</span><span className="spatial-nav-title">The workbench</span></button>
            {stations.map((station, index) => <button key={station.id} onClick={() => goTo(index + 1)} aria-current={active === index + 1 ? "step" : undefined} aria-label={`Explore ${station.title}`}><span className="spatial-nav-number">0{index + 1}</span><span className="spatial-nav-title">{station.title}</span></button>)}
          </nav>
          <div className="spatial-step-controls"><button onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0} aria-label="Previous project"><ArrowLeft size={16} /></button><span>0{active}<i>/</i>05</span>{active < 5 ? <button onClick={() => goTo(active + 1)} aria-label="Next project"><ArrowRight size={16} /></button> : <a href="#projects" aria-label="Continue to the project list"><ArrowDown size={16} /></a>}</div>
        </div>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </div>
    </section>
  );
}
