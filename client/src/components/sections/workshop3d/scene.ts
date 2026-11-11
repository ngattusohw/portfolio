import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { buildWorkshopObjects } from "./objects";
import { createWorkshopScreens } from "./screens";
import { tourPose, type WorkshopFrame } from "./tour";

export function createWorkshopScene(
  canvas: HTMLCanvasElement,
  getFrame: () => WorkshopFrame,
  onPick: (station: number) => void,
  onReady: () => void,
  onFailure: () => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#232822");
  scene.fog = new THREE.Fog("#232822", 42, 75);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.08, 80);
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  let environmentMap: THREE.WebGLRenderTarget;
  try {
    environmentMap = generator.fromScene(environment, 0.06);
  } catch (error) {
    renderer.dispose();
    throw error;
  } finally {
    environment.dispose();
    generator.dispose();
  }
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = 0.38;
  scene.add(new THREE.HemisphereLight("#fff0d4", "#353e36", 1.55));
  const key = new THREE.DirectionalLight("#ffe4b8", 3.2);
  key.position.set(-4, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 8, bottom: -5, near: 0.5, far: 25 });
  key.shadow.normalBias = 0.035;
  key.shadow.bias = -0.0002;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight("#c0d1d5", 1.1);
  fill.position.set(6, 4, 2);
  scene.add(fill);
  let screens: ReturnType<typeof createWorkshopScreens>;
  let objects: ReturnType<typeof buildWorkshopObjects>;
  try {
    screens = createWorkshopScreens(renderer);
    try {
      objects = buildWorkshopObjects(scene, screens.textures);
    } catch (error) {
      screens.dispose();
      throw error;
    }
  } catch (error) {
    key.shadow.dispose();
    environmentMap.dispose();
    renderer.dispose();
    throw error;
  }
  const overview = { camera: new THREE.Vector3(4.5, 5.8, 15.8), focus: new THREE.Vector3(0, 0.8, 0) };
  const bounds = objects.stations.map(station => {
    const box = new THREE.Box3().setFromObject(station.group);
    return { size: box.getSize(new THREE.Vector3()), center: box.getCenter(new THREE.Vector3()) };
  });
  let disposed = false;
  let ready = false;
  let scheduled = 0;
  let lastTime = 0;
  let elapsed = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  let firstFrame = true;
  let settleUntil = 0;
  const lookAt = overview.focus.clone();
  camera.position.copy(overview.camera);
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const desiredCamera = new THREE.Vector3();
  const desiredFocus = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const nextCamera = new THREE.Vector3();
  const nextFocus = new THREE.Vector3();
  let tap: { pointerId: number; x: number; y: number; scrollY: number } | null = null;

  function pose(index: number, width: number, height: number, frame: WorkshopFrame, outCamera: THREE.Vector3, outFocus: THREE.Vector3) {
    if (index === 0) {
      outFocus.copy(overview.focus);
      outCamera.copy(overview.camera);
      if (frame.mobile) {
        // Fit the twelve-unit work surface across portrait screens without
        // multiplying an already distant desktop pose by the aspect ratio.
        const distance = Math.max(18, 6.7 / (Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.aspect));
        outCamera.set(0.18, 0.38, 1).normalize().multiplyScalar(distance).add(outFocus);
      }
      return;
    }
    const station = objects.stations[index - 1];
    outFocus.copy(station.focus);
    if (frame.mobile) outFocus.y = bounds[index - 1].center.y;
    direction.subVectors(station.camera, station.focus).normalize();
    const safeWidth = frame.mobile ? width * 0.87 : Math.max(width * 0.5, width - frame.storyWidth - 100);
    const safeHeight = frame.mobile ? Math.max(100, height - frame.storyHeight - 60) : height * 0.77;
    const size = bounds[index - 1].size;
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const fitVertical = size.y / (2 * tangent) * height / safeHeight;
    const fitHorizontal = size.x / (2 * tangent * camera.aspect) * width / safeWidth;
    const distance = Math.max(fitVertical, fitHorizontal, station.camera.distanceTo(station.focus) * 0.85) * 1.08;
    outCamera.copy(direction).multiplyScalar(distance).add(outFocus);
  }

  function draw(now: number) {
    try {
      drawFrame(now);
    } catch {
      fail();
    }
  }

  function drawFrame(now: number) {
    scheduled = 0;
    if (disposed) return;
    const frame = getFrame();
    if (!frame.visible || document.hidden) { lastTime = now; return; }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    if (width !== lastWidth || height !== lastHeight) {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, frame.mobile ? 1.5 : 1.75, Math.sqrt(2600000 / (width * height)));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      lastWidth = width;
      lastHeight = height;
      firstFrame = true;
    }
    const delta = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    if (frame.motion) elapsed += delta;
    const position = frame.motion ? tourPose(frame.progress) : frame.active;
    const from = Math.floor(position);
    const fraction = position - from;
    pose(from, width, height, frame, desiredCamera, desiredFocus);
    pose(Math.min(5, from + 1), width, height, frame, nextCamera, nextFocus);
    desiredCamera.lerp(nextCamera, fraction);
    desiredFocus.lerp(nextFocus, fraction);
    const blend = frame.motion && !firstFrame ? 1 - Math.exp(-delta * 10) : 1;
    camera.position.lerp(desiredCamera, blend);
    lookAt.lerp(desiredFocus, blend);
    const introAmount = Math.min(1, position);
    const offsetX = frame.mobile ? 0 : THREE.MathUtils.lerp(-width * 0.12, Math.min(width * 0.22, (frame.storyWidth + 20) * 0.5), introAmount);
    const offsetY = frame.mobile ? THREE.MathUtils.lerp(-height * 0.16, frame.storyHeight * 0.5 - 22, introAmount) : -height * 0.015;
    camera.setViewOffset(width, height, offsetX, offsetY, width, height);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
    const active = frame.active ? objects.stations[frame.active - 1].id : null;
    screens.update(elapsed, active, frame);
    objects.update(elapsed, active, frame);
    renderer.render(scene, camera);
    firstFrame = false;
    const moving = camera.position.distanceToSquared(desiredCamera) > 0.00001 || lookAt.distanceToSquared(desiredFocus) > 0.00001;
    if (frame.motion && (moving || now < settleUntil || active === "tinker" || frame.strumming)) scheduled = requestAnimationFrame(draw);
  }

  function invalidate() {
    if (disposed) return;
    settleUntil = performance.now() + 1100;
    if (!scheduled) scheduled = requestAnimationFrame(draw);
  }

  function startTap(event: PointerEvent) {
    tap = ready && event.isPrimary && event.button === 0
      ? { pointerId: event.pointerId, x: event.clientX, y: event.clientY, scrollY: window.scrollY }
      : null;
  }

  function moveTap(event: PointerEvent) {
    if (tap?.pointerId === event.pointerId && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 10) tap = null;
  }

  function cancelTap() { tap = null; }

  function pick(event: PointerEvent) {
    const press = tap;
    tap = null;
    // A swipe belongs to native page scrolling, even if its final pointer-up
    // happens over a project. Only a stationary primary-pointer tap selects it.
    if (!ready || disposed || !press || press.pointerId !== event.pointerId || event.button !== 0 ||
      Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10 || Math.abs(window.scrollY - press.scrollY) > 5) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(objects.stations.map(station => station.group), true);
    if (!intersections.length) return;
    let object: THREE.Object3D | null = intersections[0].object;
    while (object && !object.userData.station) object = object.parent;
    const index = objects.stations.findIndex(station => station.id === object?.userData.station);
    if (index >= 0) onPick(index + 1);
  }
  const lost = (event: Event) => { event.preventDefault(); fail(); };
  canvas.addEventListener("pointerdown", startTap, { passive: true });
  canvas.addEventListener("pointermove", moveTap, { passive: true });
  canvas.addEventListener("pointercancel", cancelTap);
  canvas.addEventListener("pointerup", pick);
  canvas.addEventListener("webglcontextlost", lost);
  const resize = new ResizeObserver(invalidate);
  resize.observe(canvas);
  void screens.ready.then(async () => {
    if (disposed) return;
    pose(0, canvas.clientWidth || 1440, canvas.clientHeight || 800, getFrame(), desiredCamera, desiredFocus);
    camera.position.copy(desiredCamera);
    camera.lookAt(desiredFocus);
    await renderer.compileAsync(scene, camera);
    if (disposed) return;
    ready = true;
    onReady();
    invalidate();
  }).catch(fail);
  invalidate();

  function fail() {
    if (disposed) return;
    dispose();
    onFailure();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    ready = false;
    tap = null;
    cancelAnimationFrame(scheduled);
    scheduled = 0;
    resize.disconnect();
    canvas.removeEventListener("pointerdown", startTap);
    canvas.removeEventListener("pointermove", moveTap);
    canvas.removeEventListener("pointercancel", cancelTap);
    canvas.removeEventListener("pointerup", pick);
    canvas.removeEventListener("webglcontextlost", lost);
    objects.dispose();
    screens.dispose();
    key.shadow.dispose();
    environmentMap.dispose();
    renderer.dispose();
  }

  return { invalidate, dispose };
}
