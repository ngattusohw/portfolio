import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";

const MotionContext = createContext({
  motionEnabled: false,
  paused: false,
  reducedMotion: false,
  toggleMotion: () => {},
});

export function PortfolioMotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(() => {
    try {
      return window.sessionStorage.getItem("portfolio-motion-paused") === "yes";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        "portfolio-motion-paused",
        paused ? "yes" : "no",
      );
    } catch {
      // Motion controls still work when browser storage is unavailable.
    }
  }, [paused]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  const motionEnabled = !reducedMotion && !paused && visible;
  return (
    <MotionContext.Provider
      value={{
        motionEnabled,
        paused,
        reducedMotion,
        toggleMotion: () => setPaused((value) => !value),
      }}
    >
      <MotionConfig reducedMotion={motionEnabled ? "never" : "always"}>
        <div data-portfolio-motion={motionEnabled ? "on" : "off"}>
          {children}
        </div>
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export const usePortfolioMotion = () => useContext(MotionContext);
