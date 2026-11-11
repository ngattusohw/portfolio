import * as THREE from "three";

type ScreenState = {
  fanOn: boolean;
  flipped: boolean;
  alternate: boolean;
  strumming: boolean;
  motion: boolean;
};

type Surface = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
};

const ASSETS = "/images/workshop/products";
const DISPLAY = '"Space Grotesk", Arial, sans-serif';
const MONO = '"IBM Plex Mono", monospace';

/** Match each screen plane to its canvas ratio; never stretch the source UI. */
export const workshopScreenSizes = {
  watchpoint: [1072, 568],
  somethings: [1086, 1958],
  remember: [1024, 768],
  tinker: [1200, 440],
  guitar: [1206, 2622],
} as const;

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function trackedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  for (const character of text) {
    context.fillText(character, x, y);
    x += context.measureText(character).width + tracking;
  }
}

function ease(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2;
}

/**
 * Five screens, with one intentional action in each interactive demo. Product
 * captures stay intact; Recollect and Saunum retain the existing portfolio's
 * approved illustrated screens. The surrounding React panel owns the controls,
 * descriptions, source attribution, and sample-data disclosure.
 */
export function createWorkshopScreens(renderer: THREE.WebGLRenderer): {
  textures: Record<string, THREE.Texture>;
  ready: Promise<void>;
  update: (elapsed: number, active: string | null, states: ScreenState) => void;
  dispose: () => void;
} {
  let disposed = false;
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const surfaces = Object.fromEntries(
    Object.entries(workshopScreenSizes).map(([id, [width, height]]) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error(`Could not create the ${id} product screen.`);
      context.fillStyle = id === "somethings" || id === "guitar" ? "#f4f1ea" : "#202a25";
      context.fillRect(0, 0, width, height);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.name = `workshop-product-${id}`;
      return [id, { canvas, context, texture }];
    }),
  ) as Record<keyof typeof workshopScreenSizes, Surface>;

  const textures = Object.fromEntries(
    Object.entries(surfaces).map(([id, surface]) => [id, surface.texture]),
  );
  const images: Record<string, HTMLImageElement> = {};
  const pendingImages = new Map<string, () => void>();
  let imageReady = false;
  let lastState: ScreenState = {
    fanOn: true,
    flipped: false,
    alternate: false,
    strumming: false,
    motion: true,
  };
  let flip = 0;
  let flipFrom = 0;
  let flipStarted = -10;
  let alternate = 0;
  let alternateFrom = 0;
  let alternateStarted = -10;
  let fanRotation = 0;
  let previousTime: number | null = null;
  let lastAnimatedFrame = -1;
  let previousActive: string | null = null;

  function loadImage(name: string, filename: string) {
    return new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      images[name] = image;
      image.onload = () => {
        pendingImages.delete(name);
        image.onload = null;
        image.onerror = null;
        resolve();
      };
      image.onerror = () => {
        pendingImages.delete(name);
        image.onload = null;
        image.onerror = null;
        reject(new Error(`The original ${name} product image could not load (${filename}).`));
      };
      pendingImages.set(name, () => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
        pendingImages.delete(name);
        // Disposal is not a load failure. Settle the promise so a caller
        // awaiting readiness is not left waiting on a cancelled image.
        resolve();
      });
      image.src = `${ASSETS}/${filename}`;
    });
  }

  function drawSomethings(progress: number) {
    if (!imageReady || disposed) return;
    const { context, texture } = surfaces.somethings;
    context.fillStyle = "#fffcf7";
    context.fillRect(0, 0, 1086, 1958);
    // Original App Store asset: the same native crop used by the legacy phone.
    context.drawImage(images.mentor, 74, 730, 1086, 1958, 0, 0, 1086, 1958);
    if (progress > 0) {
      context.globalAlpha = progress;
      context.drawImage(images.chat, 74, 730, 1086, 1958, 0, 0, 1086, 1958);
      context.globalAlpha = 1;
    }
    texture.needsUpdate = true;
  }

  function drawRecollect(progress: number) {
    const { context: c, canvas, texture } = surfaces.remember;
    c.clearRect(0, 0, canvas.width, canvas.height);
    const ground = c.createRadialGradient(563, 192, 20, 520, 280, 800);
    ground.addColorStop(0, "#49415c");
    ground.addColorStop(1, "#272332");
    c.fillStyle = ground;
    c.fillRect(0, 0, 1024, 768);

    c.fillStyle = "#f5f1e7";
    c.font = `500 41px ${DISPLAY}`;
    c.fillText("recollect", 61, 78);
    const brandWidth = c.measureText("recollect").width;
    c.fillStyle = "#c9b1ed";
    c.font = `400 22px ${MONO}`;
    c.fillText("AI", 61 + brandWidth + 15, 76);

    const centerX = 512;
    const centerY = 400;
    const cardWidth = 676;
    const cardHeight = 430;
    const drawSheet = (angle: number, x: number, y: number, color: string) => {
      c.save();
      c.translate(centerX + x, centerY + y);
      c.rotate(angle * Math.PI / 180);
      c.shadowColor = "#0003";
      c.shadowBlur = 24;
      c.shadowOffsetY = 10;
      c.fillStyle = color;
      roundedRect(c, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);
      c.fill();
      c.shadowColor = "transparent";
      c.strokeStyle = "#d6c8e7";
      c.lineWidth = 1;
      c.stroke();
      c.restore();
    };
    drawSheet(9, 14, 13, "#a999c9");
    drawSheet(-7, -14, 4, "#d1c4e5");

    const angle = progress * Math.PI;
    const back = progress >= 0.5;
    c.save();
    c.translate(centerX, centerY);
    c.rotate(-2 * Math.PI / 180);
    // Compress only the rotating card; its lettering is never independently
    // stretched or swapped while visible. At the edge, the opposite face appears.
    c.scale(Math.max(0.008, Math.abs(Math.cos(angle))), 1);
    const card = c.createLinearGradient(-338, -215, 338, 215);
    card.addColorStop(0, back ? "#e1d6ff" : "#fff9e9");
    card.addColorStop(1, back ? "#c1afe4" : "#ece5d7");
    c.fillStyle = card;
    c.shadowColor = "#0004";
    c.shadowBlur = 26;
    c.shadowOffsetY = 8;
    roundedRect(c, -338, -215, 676, 430, 16);
    c.fill();
    c.shadowColor = "transparent";

    c.fillStyle = "#322d39";
    c.font = `400 14px ${MONO}`;
    trackedText(c, back ? "THE ANSWER" : "A LITTLE REMINDER", -277, -159, 1.1);
    c.font = `500 68px ${DISPLAY}`;
    trackedText(c, back ? "Coming" : "What makes", -277, -12, -2.6);
    trackedText(c, back ? "back to it." : "an idea stick?", -277, 57, -2.6);
    c.font = `400 11px ${MONO}`;
    trackedText(
      c,
      back ? "SMALL RETURNS. LASTING KNOWLEDGE." : "01 / A QUESTION WORTH RETURNING TO",
      -277,
      173,
      0.4,
    );
    c.restore();

    c.fillStyle = "#dfd4ed";
    c.font = `400 18px ${MONO}`;
    c.fillText("Today", 154, 720);
    c.fillText("Tomorrow", 452, 720);
    c.fillText("Next week", 772, 720);
    c.strokeStyle = back ? "#dfd0ff" : "#82768f";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(228, 714);
    c.lineTo(428, 714);
    c.moveTo(560, 714);
    c.lineTo(748, 714);
    c.stroke();
    texture.needsUpdate = true;
  }

  function drawSaunum(fanOn: boolean, rotation: number, glow = 1) {
    const { context: c, texture } = surfaces.tinker;
    c.save();
    c.scale(2, 2);
    const ground = c.createRadialGradient(300, 77, 5, 300, 110, 360);
    ground.addColorStop(0, "#29352c");
    ground.addColorStop(1, "#18221d");
    c.fillStyle = ground;
    c.fillRect(0, 0, 600, 220);

    c.fillStyle = "#f5f1e7";
    c.font = `500 19px ${DISPLAY}`;
    trackedText(c, "better saunum", 28, 33, -0.8);
    const label = (text: string, x: number, y: number) => {
      c.fillStyle = "#b2bdaa";
      c.font = `400 10px ${MONO}`;
      trackedText(c, text, x, y, 0.55);
    };
    label("ALWAYS VISIBLE.", 28, 67);
    c.fillStyle = "#f6c386";
    c.font = `500 100px ${DISPLAY}`;
    trackedText(c, "78", 23, 159, -7);
    c.font = `500 32px ${DISPLAY}`;
    c.fillText("°F", 144, 159);
    c.fillStyle = "#aaa999";
    c.beginPath();
    c.arc(32, 187, 3, 0, Math.PI * 2);
    c.fill();
    label("DEMO · HEATER OFF", 44, 191);

    c.strokeStyle = "#adba9d24";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(216, 65);
    c.lineTo(216, 194);
    c.moveTo(358, 65);
    c.lineTo(358, 194);
    c.stroke();

    c.fillStyle = "#222c29";
    c.strokeStyle = "#b5c0a0";
    c.lineWidth = 1.4;
    c.beginPath();
    c.arc(287, 125, 57, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = "#596752";
    c.lineWidth = 0.8;
    c.beginPath();
    c.arc(287, 125, 48, 0, Math.PI * 2);
    c.stroke();

    c.save();
    c.translate(287, 125);
    c.rotate(rotation);
    c.translate(-385, -127);
    c.fillStyle = "#d2ddb6";
    // These blade paths are the original WorkshopLegacyVisuals artwork.
    c.fill(new Path2D("M385 125 C359 119 351 101 367 92 C386 82 400 98 385 125 M387 127 C393 101 411 93 420 109 C430 128 414 142 387 127 M385 129 C411 135 419 153 403 162 C384 172 370 156 385 129 M383 127 C377 153 359 161 350 145 C340 126 356 112 383 127"));
    c.restore();
    c.fillStyle = "#26322a";
    c.strokeStyle = "#d2ddb6";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(287, 125, 9, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    label(`FAN ${fanOn ? "ON" : "OFF"}`, fanOn ? 266 : 263, 200);

    label("TEMPERATURE HISTORY", 380, 67);
    c.strokeStyle = "#adba9d26";
    c.lineWidth = 1;
    c.beginPath();
    for (const y of [94, 129, 164]) {
      c.moveTo(380, y);
      c.lineTo(574, y);
    }
    c.stroke();
    const chartPath = "M380 94 C414 90 422 116 449 126 S488 145 515 151 S553 157 574 160";
    const fill = c.createLinearGradient(0, 94, 0, 172);
    fill.addColorStop(0, "#f6c38638");
    fill.addColorStop(1, "#f6c38600");
    c.fillStyle = fill;
    c.fill(new Path2D(`${chartPath} V172 H380 Z`));
    c.strokeStyle = "#f6c386";
    c.lineWidth = 2.5;
    c.lineCap = "round";
    c.stroke(new Path2D(chartPath));
    c.fillStyle = "#f6c386";
    c.globalAlpha = glow;
    c.beginPath();
    c.arc(574, 160, 4, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;
    label("100°", 380, 191);
    label("78° NOW", 525, 191);
    c.restore();
    texture.needsUpdate = true;
  }

  drawRecollect(0);
  drawSaunum(true, 0);

  const ready = Promise.all([
    loadImage("watchpoint", "watchpoint-preview.png"),
    loadImage("mentor", "somethings-mentor.webp"),
    loadImage("chat", "somethings-chat.webp"),
    loadImage("guitar", "guitar-rudiments-home.jpg"),
    document.fonts.load(`500 68px ${DISPLAY}`).catch(() => []),
    document.fonts.load(`400 14px ${MONO}`).catch(() => []),
  ]).then(() => {
    if (disposed) return;
    imageReady = true;
    for (const id of ["watchpoint", "guitar"] as const) {
      const { context, canvas, texture } = surfaces[id];
      context.drawImage(images[id], 0, 0, canvas.width, canvas.height);
      texture.needsUpdate = true;
    }
    drawSomethings(lastState.alternate ? 1 : 0);
    drawRecollect(lastState.flipped ? 1 : 0);
    drawSaunum(lastState.fanOn, fanRotation);
  });
  // The caller gets the original rejected promise and can show its fallback.
  // Attaching a handler immediately also avoids an unhandled rejection if its
  // surrounding scene is still loading when an image fails.
  void ready.catch(() => undefined);

  return {
    textures,
    ready,
    update(elapsed, active, states) {
      if (disposed) return;
      const delta = previousTime === null ? 0 : Math.max(0, Math.min(elapsed - previousTime, 0.1));
      previousTime = elapsed;
      const changedActive = active !== previousActive;
      const motionChanged = states.motion !== lastState.motion;
      const flipChanged = states.flipped !== lastState.flipped;
      const alternateChanged = states.alternate !== lastState.alternate;
      if (flipChanged) {
        flipFrom = flip;
        flipStarted = elapsed;
      }
      if (alternateChanged) {
        alternateFrom = alternate;
        alternateStarted = elapsed;
      }

      const flipTarget = states.flipped ? 1 : 0;
      const alternateTarget = states.alternate ? 1 : 0;
      // Offscreen and reduced-motion changes settle immediately. Commit that
      // settled state as the next transition's origin as well, so resuming
      // motion or returning to a station cannot replay an old transition.
      if (!states.motion || active !== "remember") {
        flipFrom = flipTarget;
        flipStarted = elapsed - 0.85;
      }
      if (!states.motion || active !== "somethings") {
        alternateFrom = alternateTarget;
        alternateStarted = elapsed - 0.42;
      }
      const nextFlip = states.motion && active === "remember"
        ? flipFrom + (flipTarget - flipFrom) * ease(Math.max(0, Math.min(1, (elapsed - flipStarted) / 0.85)))
        : flipTarget;
      const nextAlternate = states.motion && active === "somethings"
        ? alternateFrom + (alternateTarget - alternateFrom) * ease(Math.max(0, Math.min(1, (elapsed - alternateStarted) / 0.42)))
        : alternateTarget;
      if (nextFlip !== flip || flipChanged || motionChanged) drawRecollect(nextFlip);
      if (nextAlternate !== alternate || alternateChanged) drawSomethings(nextAlternate);
      flip = nextFlip;
      alternate = nextAlternate;

      const fanAnimating = states.motion && active === "tinker";
      if (fanAnimating && states.fanOn) fanRotation = (fanRotation + delta * Math.PI * 2 / 1.8) % (Math.PI * 2);
      const animationFrame = Math.floor(elapsed * 30);
      if (
        states.fanOn !== lastState.fanOn || motionChanged || changedActive ||
        (fanAnimating && animationFrame !== lastAnimatedFrame)
      ) {
        drawSaunum(states.fanOn, fanRotation, fanAnimating ? 0.7 + 0.3 * Math.cos(elapsed * Math.PI * 2 / 3) : 1);
      }
      lastAnimatedFrame = animationFrame;
      previousActive = active;
      lastState = { ...states };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pendingImages.forEach((cancel) => cancel());
      Object.values(images).forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
      Object.values(textures).forEach((texture) => texture.dispose());
    },
  };
}
