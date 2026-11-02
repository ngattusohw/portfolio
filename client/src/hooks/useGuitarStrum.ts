import { useCallback, useEffect, useRef, useState } from "react";

const openEMinor = [82.41, 123.47, 164.81, 196, 246.94, 329.63];

/** A visitor-triggered, synthesized pluck. Never starts audio on page load. */
export function useGuitarStrum(active: boolean) {
  const context = useRef<AudioContext | null>(null);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [strumming, setStrumming] = useState(false);

  const stop = useCallback(() => {
    generation.current++;
    clearTimeout(timer.current);
    setStrumming(false);
    const previous = context.current;
    context.current = null;
    if (previous && previous.state !== "closed") void previous.close();
  }, []);

  useEffect(() => {
    if (!active) stop();
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [active, stop]);

  const strum = useCallback(async () => {
    stop();
    const request = generation.current;
    try {
      const audio = new AudioContext();
      context.current = audio;
      await audio.resume();
      if (request !== generation.current || document.hidden) return false;
      const volume = audio.createGain();
      volume.gain.value = 0.2;
      volume.connect(audio.destination);
      openEMinor.forEach((frequency, string) => {
        const duration = 2.4;
        const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
        const samples = buffer.getChannelData(0);
        const delay = Math.round(audio.sampleRate / frequency);
        // Karplus–Strong: a short noise impulse decays through a string-sized delay.
        for (let i = 0; i < delay; i++) samples[i] = Math.random() * 2 - 1;
        for (let i = delay; i < samples.length; i++) {
          samples[i] = 0.498 * (samples[i - delay] + samples[i - delay + 1]);
        }
        for (let i = 0; i < samples.length; i++) {
          samples[i] *= Math.min(1, i / 80) * Math.min(1, (samples.length - i) / 2000);
        }
        const source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(volume);
        source.start(audio.currentTime + string * 0.035);
      });
      setStrumming(true);
      timer.current = setTimeout(stop, 2700);
      return true;
    } catch {
      if (request === generation.current) stop();
      return false;
    }
  }, [stop]);

  return { strum, strumming };
}
