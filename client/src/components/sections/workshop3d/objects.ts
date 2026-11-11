import * as THREE from "three";

export interface WorkshopObjectStation {
  id: string;
  group: THREE.Group;
  focus: THREE.Vector3;
  camera: THREE.Vector3;
  screen?: THREE.Mesh;
}

/** A small, deliberately composed room. Screens are the supplied product assets. */
export function buildWorkshopObjects(
  scene: THREE.Scene,
  screens: Record<string, THREE.Texture>,
): {
  stations: WorkshopObjectStation[];
  update: (
    elapsed: number,
    active: string | null,
    states: { fanOn: boolean; flipped: boolean; strumming: boolean; motion: boolean },
  ) => void;
  dispose: () => void;
} {
  const world = new THREE.Group();
  world.name = "Nick's workshop";
  scene.add(world);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const stations: WorkshopObjectStation[] = [];

  const standard = (color: THREE.ColorRepresentation, roughness = 0.7, metalness = 0) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.add(value);
    return value;
  };
  const material = {
    plaster: standard("#1d261f", 0.98),
    floor: standard("#242a22", 0.96),
    walnut: standard("#68472f", 0.59),
    walnutDark: standard("#382b23", 0.74),
    oak: standard("#aa7c4d", 0.66),
    cream: standard("#e4dfcd", 0.63),
    charcoal: standard("#202824", 0.63),
    rubber: standard("#151c19", 0.92),
    olive: standard("#727760", 0.73),
    sage: standard("#a7af98", 0.66),
    lavender: standard("#9c92b1", 0.48, 0.3),
    bronze: standard("#a78855", 0.34, 0.72),
    aluminum: standard("#b7bab0", 0.37, 0.76),
    blackMetal: standard("#2c322d", 0.36, 0.65),
    paper: standard("#ede6d2", 0.93),
    terracotta: standard("#986c4d", 0.91),
    green: standard("#4a6044", 0.86),
    leafLight: standard("#788357", 0.78),
    guitar: standard("#b5793d", 0.4),
    guitarSide: standard("#65422d", 0.48),
    string: standard("#d7c58d", 0.25, 0.8),
  };
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.add(value);
    return value;
  };
  const mesh = (
    parent: THREE.Object3D,
    shape: THREE.BufferGeometry,
    surface: THREE.Material | THREE.Material[],
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const value = new THREE.Mesh(geometry(shape), surface);
    value.position.set(x, y, z);
    value.castShadow = true;
    value.receiveShadow = true;
    parent.add(value);
    return value;
  };
  const roundedShape = (width: number, height: number, radius: number) => {
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 2, height / 2);
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  };
  const rounded = (
    parent: THREE.Object3D,
    width: number,
    height: number,
    depth: number,
    radius: number,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const bevel = Math.min(depth * 0.2, radius * 0.32, 0.025);
    const shape = new THREE.ExtrudeGeometry(roundedShape(width - bevel * 2, height - bevel * 2, radius), {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 8,
    });
    shape.translate(0, 0, -depth / 2 + bevel);
    return mesh(parent, shape, surface, x, y, z);
  };
  const box = (
    parent: THREE.Object3D,
    width: number,
    height: number,
    depth: number,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => mesh(parent, new THREE.BoxGeometry(width, height, depth), surface, x, y, z);
  const cylinder = (
    parent: THREE.Object3D,
    radiusTop: number,
    radiusBottom: number,
    height: number,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
    segments = 32,
  ) => mesh(parent, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), surface, x, y, z);
  const tube = (parent: THREE.Object3D, points: THREE.Vector3[], radius: number, surface: THREE.Material) =>
    mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 28, radius, 7, false), surface);
  const torus = (parent: THREE.Object3D, radius: number, thickness: number, surface: THREE.Material, x = 0, y = 0, z = 0) =>
    mesh(parent, new THREE.TorusGeometry(radius, thickness, 8, 48), surface, x, y, z);
  const frontDisc = (parent: THREE.Object3D, radius: number, depth: number, surface: THREE.Material, x: number, y: number, z: number) => {
    const value = cylinder(parent, radius, radius, depth, surface, x, y, z);
    value.rotation.x = Math.PI / 2;
    return value;
  };

  // The only procedural imagery is wood grain: no product screen is redrawn here.
  const woodCanvas = document.createElement("canvas");
  woodCanvas.width = 1024;
  woodCanvas.height = 256;
  const woodContext = woodCanvas.getContext("2d");
  if (woodContext) {
    woodContext.fillStyle = "#977149";
    woodContext.fillRect(0, 0, 1024, 256);
    for (let line = 0; line < 155; line++) {
      const y = (line / 155) * 256;
      woodContext.strokeStyle = line % 4 === 0 ? "rgba(46,25,10,.13)" : "rgba(231,195,139,.10)";
      woodContext.lineWidth = line % 3 === 0 ? 1.8 : 0.65;
      woodContext.beginPath();
      woodContext.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 16) {
        woodContext.lineTo(x, y + Math.sin(x * 0.007 + line * 0.19) * 2.1 + Math.sin(x * 0.021 + line) * 0.8);
      }
      woodContext.stroke();
    }
    const wood = new THREE.CanvasTexture(woodCanvas);
    wood.colorSpace = THREE.SRGBColorSpace;
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    wood.repeat.set(2, 1);
    textures.add(wood);
    material.oak.map = wood;
    material.oak.color.set("#e4c6a1");
    material.guitar.map = wood;
    material.guitar.color.set("#f0c286");
  }

  const screen = (parent: THREE.Object3D, texture: THREE.Texture | undefined, width: number, height: number, x: number, y: number, z: number, radius = 0.035) => {
    const screenMaterial = new THREE.MeshBasicMaterial({ map: texture ?? null, color: texture ? "#ffffff" : "#222b29", toneMapped: false });
    materials.add(screenMaterial);
    const shape = new THREE.ShapeGeometry(roundedShape(width, height, radius), 8);
    const positions = shape.attributes.position;
    const uvs = shape.attributes.uv;
    for (let vertex = 0; vertex < positions.count; vertex++) {
      uvs.setXY(vertex, (positions.getX(vertex) + width / 2) / width, (positions.getY(vertex) + height / 2) / height);
    }
    const value = mesh(parent, shape, screenMaterial, x, y, z);
    value.castShadow = false;
    value.receiveShadow = false;
    return value;
  };
  const badge = (parent: THREE.Object3D, text: string, width: number, x: number, y: number, z: number, light = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = light ? "#dfd7c1" : "#252e28";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "500 34px monospace";
    context.letterSpacing = "5px";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = light ? "#343a30" : "#d4c8aa";
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    screen(parent, texture, width, width / 8, x, y, z, 0.008);
  };
  const station = (id: string, x: number, focus: [number, number, number], camera: [number, number, number]) => {
    const group = new THREE.Group();
    group.position.x = x;
    group.name = id;
    group.userData.station = id;
    world.add(group);
    const item: WorkshopObjectStation = {
      id,
      group,
      focus: new THREE.Vector3(...focus),
      camera: new THREE.Vector3(...camera),
    };
    stations.push(item);
    return item;
  };

  // Architecture, bench, and a restrained shelf establish actual spatial depth.
  // Generous room bounds keep its outer edges outside every portrait/desktop
  // camera framing, including the wider overview lens.
  box(world, 160, 0.15, 160, material.floor, 0, -2.58, 0);
  box(world, 160, 60, 0.25, material.plaster, 0, 12, -2.8);
  box(world, 160, 0.1, 0.06, material.walnutDark, 0, -2.41, -2.62);
  rounded(world, 12.5, 0.23, 3.3, 0.09, material.oak, 0, -0.13, 0);
  // Front and rear solid timber aprons, with inset steel legs.
  rounded(world, 12.14, 0.4, 0.13, 0.025, material.walnut, 0, -0.43, 1.45);
  box(world, 12.0, 0.32, 0.13, material.walnutDark, 0, -0.4, -1.43);
  for (const x of [-5.65, 5.65]) {
    for (const z of [-1.25, 1.25]) {
      rounded(world, 0.17, 2.27, 0.17, 0.03, material.blackMetal, x, -1.35, z);
    }
    box(world, 0.17, 0.12, 2.65, material.blackMetal, x, -2.4, 0);
  }
  badge(world, "NICK GATTUSO / BUILT WITH CURIOSITY", 2.8, -3.8, -0.43, 1.523, true);
  rounded(world, 5.4, 0.12, 0.55, 0.025, material.oak, -2.4, 3.6, -2.25);
  for (const x of [-4.4, -0.35]) {
    box(world, 0.045, 0.45, 0.045, material.bronze, x, 3.34, -2.52);
    box(world, 0.045, 0.045, 0.42, material.bronze, x, 3.14, -2.32);
  }
  // Quiet books and objects on the shelf, not another row of projects.
  [material.olive, material.cream, material.walnutDark, material.terracotta].forEach((surface, index) => {
    const book = rounded(world, 0.14 + index * 0.018, 0.56 + (index % 2) * 0.12, 0.31, 0.012, surface, -4.1 + index * 0.19, 3.96 + (index % 2) * 0.06, -2.21);
    book.rotation.z = index === 3 ? -0.13 : 0;
  });
  torus(world, 0.25, 0.055, material.bronze, -0.5, 3.91, -2.2);
  rounded(world, 0.55, 0.08, 0.28, 0.015, material.walnutDark, -0.5, 3.7, -2.2);

  // A real shaded task lamp. Its small light adds warmth, while global lights are
  // owned by the renderer so the page can choose its own performance budget.
  cylinder(world, 0.28, 0.31, 0.065, material.bronze, -5.75, 0.04, -0.77);
  tube(world, [
    new THREE.Vector3(-5.75, 0.08, -0.77),
    new THREE.Vector3(-5.75, 1.5, -0.77),
    new THREE.Vector3(-5.55, 2.56, -0.77),
    new THREE.Vector3(-4.96, 2.66, -0.67),
  ], 0.035, material.bronze);
  const shade = cylinder(world, 0.13, 0.4, 0.35, material.olive, -4.95, 2.5, -0.67, 48);
  shade.rotation.z = -0.18;
  const lightSurface = standard("#fff0cc", 0.5);
  lightSurface.emissive.set("#ffd796");
  lightSurface.emissiveIntensity = 1.2;
  cylinder(world, 0.35, 0.35, 0.018, lightSurface, -4.92, 2.32, -0.67);
  const lampLight = new THREE.PointLight("#ffdca0", 4, 4.5, 2);
  lampLight.position.set(-4.92, 2.27, -0.67);
  world.add(lampLight);

  const watchpoint = station("watchpoint", -3.85, [-3.85, 1.18, 0.05], [-3.55, 2.0, 4.8]);
  rounded(watchpoint.group, 2.9, 0.025, 1.55, 0.06, material.olive, 0, 0.017, 0.28);
  rounded(watchpoint.group, 0.83, 0.065, 0.55, 0.045, material.blackMetal, 0, 0.07, -0.15);
  const stand = rounded(watchpoint.group, 0.22, 0.65, 0.15, 0.04, material.aluminum, 0, 0.37, -0.28);
  stand.rotation.x = -0.16;
  rounded(watchpoint.group, 2.56, 1.63, 0.25, 0.11, material.charcoal, 0, 1.4, -0.16);
  rounded(watchpoint.group, 2.4, 1.43, 0.035, 0.075, material.rubber, 0, 1.42, -0.013);
  watchpoint.screen = screen(watchpoint.group, screens.watchpoint, 2.29, 2.29 * 568 / 1072, 0, 1.48, 0.012, 0.035);
  badge(watchpoint.group, "WATCHPOINT", 0.72, 0, 0.68, -0.011);
  const watchLed = standard("#b2c48b", 0.4);
  watchLed.emissive.set("#b3cf8b");
  watchLed.emissiveIntensity = 0.6;
  frontDisc(watchpoint.group, 0.016, 0.009, watchLed, 1.06, 0.68, -0.008);
  // Compact mechanical keyboard, mouse, and their small shadows.
  const keyboard = new THREE.Group();
  keyboard.position.set(-0.13, 0.065, 0.91);
  keyboard.rotation.x = -Math.PI / 2;
  watchpoint.group.add(keyboard);
  rounded(keyboard, 1.74, 0.54, 0.075, 0.045, material.cream);
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 12; column++) {
      rounded(keyboard, 0.115, 0.087, 0.028, 0.013, column === 0 && row === 0 ? material.terracotta : material.paper,
        -0.76 + column * 0.138, 0.195 - row * 0.117, 0.047);
    }
  }
  const mouse = mesh(watchpoint.group, new THREE.SphereGeometry(0.18, 24, 16), material.sage, 1.1, 0.075, 0.9);
  mouse.scale.set(0.66, 0.37, 1);
  tube(watchpoint.group, [new THREE.Vector3(0, 0.6, -0.3), new THREE.Vector3(0.22, 0.08, -0.53), new THREE.Vector3(1.2, 0.035, -0.7), new THREE.Vector3(1.45, -0.07, -1.55)], 0.013, material.rubber);

  const makePhone = (parent: THREE.Object3D, texture: THREE.Texture | undefined, width: number, height: number, x: number, y: number, z: number, shell: THREE.Material) => {
    const device = new THREE.Group();
    device.position.set(x, y, z);
    parent.add(device);
    rounded(device, width + 0.065, height + 0.065, 0.09, 0.095, shell);
    rounded(device, width + 0.015, height + 0.015, 0.014, 0.084, material.rubber, 0, 0, 0.049);
    const display = screen(device, texture, width, height, 0, 0, 0.058, 0.076);
    rounded(device, 0.19, 0.032, 0.005, 0.014, material.rubber, 0, height / 2 - 0.048, 0.061);
    rounded(device, 0.012, 0.15, 0.027, 0.004, shell, width / 2 + 0.039, 0.18, 0);
    return { device, display };
  };
  const somethings = station("somethings", -1.8, [-1.8, 0.86, 0.65], [-1.65, 1.32, 3.75]);
  rounded(somethings.group, 0.68, 0.065, 0.66, 0.04, material.terracotta, 0, 0.035, 0.43);
  const phoneSupport = rounded(somethings.group, 0.36, 0.59, 0.07, 0.045, material.terracotta, 0, 0.34, 0.34);
  phoneSupport.rotation.x = -0.13;
  const somethingPhone = makePhone(somethings.group, screens.somethings, 0.65, 0.65 * 1958 / 1086, 0, 0.79, 0.6, material.aluminum);
  somethingPhone.device.rotation.x = -0.085;
  somethings.screen = somethingPhone.display;
  // A tactile ceramic cup with a recessed top, never covering the phone.
  const mug = cylinder(somethings.group, 0.18, 0.16, 0.29, material.cream, -0.65, 0.16, -0.22);
  torus(somethings.group, 0.1, 0.03, material.cream, -0.84, 0.17, -0.22);
  const coffee = cylinder(somethings.group, 0.153, 0.153, 0.008, material.walnutDark, -0.65, 0.305, -0.22);
  mug.name = "ceramic coffee cup";
  coffee.castShadow = false;

  const recollect = station("remember", 0, [0, 0.85, 0.27], [0.25, 1.6, 4.1]);
  rounded(recollect.group, 1.75, 0.045, 1.05, 0.045, material.sage, 0, 0.03, 0.22);
  const tabletStand = rounded(recollect.group, 0.78, 0.53, 0.07, 0.035, material.lavender, 0, 0.31, -0.03);
  tabletStand.rotation.x = -0.2;
  const tablet = new THREE.Group();
  tablet.position.set(0, 0.85, 0.2);
  tablet.rotation.x = -0.1;
  recollect.group.add(tablet);
  rounded(tablet, 1.75, 1.35, 0.075, 0.11, material.lavender);
  rounded(tablet, 1.66, 1.26, 0.012, 0.075, material.rubber, 0, 0, 0.043);
  recollect.screen = screen(tablet, screens.remember, 1.56, 1.17, 0, 0, 0.053, 0.05);
  frontDisc(tablet, 0.012, 0.007, material.charcoal, 0, 0.635, 0.05);
  // A pencil and a slim, closed notebook put learning in a physical context.
  const notebook = new THREE.Group();
  notebook.position.set(0.03, 0.055, 1.03);
  notebook.rotation.x = -Math.PI / 2;
  notebook.rotation.z = -0.06;
  recollect.group.add(notebook);
  rounded(notebook, 1.0, 0.53, 0.045, 0.025, material.paper);
  rounded(notebook, 1.03, 0.55, 0.012, 0.025, material.olive, 0, 0, 0.027);
  box(notebook, 0.023, 0.55, 0.015, material.walnutDark, 0.36, 0, 0.039);
  const pencil = cylinder(recollect.group, 0.016, 0.016, 1.0, material.oak, 0.12, 0.067, 1.39, 6);
  pencil.rotation.z = Math.PI / 2;
  pencil.rotation.y = 0.07;

  const saunum = station("tinker", 2.25, [2.25, 0.72, 0.15], [2.6, 1.55, 4.1]);
  rounded(saunum.group, 1.92, 1.23, 0.54, 0.11, material.aluminum, 0, 0.67, -0.08);
  rounded(saunum.group, 1.8, 1.1, 0.035, 0.07, material.charcoal, 0, 0.68, 0.209);
  rounded(saunum.group, 1.67, 0.83, 0.02, 0.035, material.rubber, 0, 0.8, 0.233);
  saunum.screen = screen(saunum.group, screens.tinker, 1.58, 1.58 * 440 / 1200, 0, 0.8, 0.247, 0.025);
  badge(saunum.group, "BETTER SAUNUM", 0.92, -0.22, 0.31, 0.236);
  frontDisc(saunum.group, 0.07, 0.065, material.bronze, 0.68, 0.31, 0.265);
  box(saunum.group, 0.012, 0.04, 0.003, material.paper, 0.68, 0.334, 0.299);
  for (const x of [-0.64, 0.64]) {
    rounded(saunum.group, 0.2, 0.09, 0.34, 0.035, material.rubber, x, 0.045, -0.07);
  }
  // The little air circulator is separate from the controller. Its rotor reflects
  // only the demo's local fan state; nothing here communicates with a real sauna.
  const fan = new THREE.Group();
  fan.position.set(0.05, 0.54, -0.89);
  // Raised just above the controller, a readable silhouette from the overview.
  fan.position.y = 1.71;
  saunum.group.add(fan);
  torus(fan, 0.35, 0.025, material.bronze, 0, 0, 0.04);
  const fanRotor = new THREE.Group();
  fanRotor.position.z = 0.01;
  fan.add(fanRotor);
  for (let blade = 0; blade < 5; blade++) {
    const shape = new THREE.Shape();
    shape.moveTo(0.04, 0);
    shape.bezierCurveTo(0.1, 0.02, 0.3, -0.02, 0.3, 0.1);
    shape.bezierCurveTo(0.29, 0.23, 0.13, 0.27, 0.08, 0.11);
    shape.quadraticCurveTo(0.04, 0.08, 0.04, 0);
    const bladeMesh = mesh(fanRotor, new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: false, curveSegments: 8 }), material.olive);
    bladeMesh.rotation.z = blade * Math.PI * 2 / 5;
  }
  frontDisc(fan, 0.075, 0.095, material.bronze, 0, 0, 0.045);
  for (let ring = 1; ring < 5; ring++) torus(fan, ring * 0.07, 0.005, material.aluminum, 0, 0, 0.097);
  for (let spoke = 0; spoke < 4; spoke++) {
    const bar = box(fan, 0.66, 0.008, 0.008, material.aluminum, 0, 0, 0.098);
    bar.rotation.z = spoke * Math.PI / 4;
  }
  tube(saunum.group, [new THREE.Vector3(-0.18, 1.26, -0.87), new THREE.Vector3(-0.22, 1.55, -0.91), new THREE.Vector3(-0.35, 1.72, -0.91)], 0.026, material.bronze);

  const guitarStation = station("guitar", 4.45, [4.7, 1.13, 0.2], [5.1, 2.05, 4.9]);
  const amp = new THREE.Group();
  amp.position.set(-0.24, 0.37, 0.03);
  guitarStation.group.add(amp);
  rounded(amp, 1.23, 0.7, 0.55, 0.065, material.charcoal);
  rounded(amp, 1.11, 0.47, 0.02, 0.035, material.olive, 0, -0.065, 0.284);
  // Woven grille represented by fine physical wires, catching the side light.
  for (let wire = 0; wire < 38; wire++) {
    box(amp, 0.006, 0.42, 0.003, material.walnutDark, -0.51 + wire * 0.0276, -0.065, 0.298);
  }
  for (let wire = 0; wire < 12; wire++) {
    box(amp, 1.04, 0.004, 0.003, material.cream, 0, -0.265 + wire * 0.036, 0.301);
  }
  rounded(amp, 1.08, 0.115, 0.016, 0.012, material.bronze, 0, 0.223, 0.289);
  for (let knob = 0; knob < 4; knob++) frontDisc(amp, 0.026, 0.02, material.charcoal, -0.37 + knob * 0.155, 0.224, 0.308);
  badge(amp, "PRACTICE", 0.47, 0, -0.01, 0.307);
  const guitarPhone = makePhone(guitarStation.group, screens.guitar, 0.48, 0.48 * 2622 / 1206, -0.24, 1.28, 0.17, material.aluminum);
  guitarPhone.device.rotation.x = -0.09;
  guitarStation.screen = guitarPhone.display;
  rounded(guitarStation.group, 0.53, 0.045, 0.34, 0.025, material.bronze, -0.24, 0.74, 0.13);
  const guitar = new THREE.Group();
  guitar.position.set(0.83, 0.13, -0.08);
  guitar.rotation.z = -0.12;
  guitarStation.group.add(guitar);

  const guitarOutline = new THREE.Shape();
  guitarOutline.moveTo(0, 0);
  guitarOutline.bezierCurveTo(-0.52, -0.025, -0.72, 0.35, -0.59, 0.68);
  guitarOutline.bezierCurveTo(-0.53, 0.9, -0.29, 0.93, -0.31, 1.12);
  guitarOutline.bezierCurveTo(-0.34, 1.3, -0.55, 1.4, -0.42, 1.58);
  guitarOutline.bezierCurveTo(-0.33, 1.73, -0.14, 1.72, 0, 1.7);
  guitarOutline.bezierCurveTo(0.14, 1.72, 0.33, 1.73, 0.42, 1.58);
  guitarOutline.bezierCurveTo(0.55, 1.4, 0.34, 1.3, 0.31, 1.12);
  guitarOutline.bezierCurveTo(0.29, 0.93, 0.53, 0.9, 0.59, 0.68);
  guitarOutline.bezierCurveTo(0.72, 0.35, 0.52, -0.025, 0, 0);
  const guitarBody = new THREE.ExtrudeGeometry(guitarOutline, { depth: 0.24, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.025, bevelThickness: 0.025, curveSegments: 24 });
  mesh(guitar, guitarBody, [material.guitar, material.guitarSide]);
  const outlinePoints = guitarOutline.getPoints(100).map(point => new THREE.Vector3(point.x, point.y, 0.267));
  outlinePoints.push(outlinePoints[0].clone());
  tube(guitar, outlinePoints, 0.009, material.cream);
  frontDisc(guitar, 0.195, 0.005, material.walnutDark, 0, 1.08, 0.27);
  torus(guitar, 0.208, 0.01, material.cream, 0, 1.08, 0.275);
  torus(guitar, 0.23, 0.006, material.walnutDark, 0, 1.08, 0.275);
  torus(guitar, 0.242, 0.005, material.cream, 0, 1.08, 0.275);
  rounded(guitar, 0.44, 0.125, 0.035, 0.035, material.walnutDark, 0, 0.49, 0.29);
  rounded(guitar, 0.28, 0.018, 0.016, 0.004, material.cream, 0, 0.508, 0.315);
  rounded(guitar, 0.19, 1.3, 0.095, 0.025, material.walnutDark, 0, 2.0, 0.208);
  rounded(guitar, 0.165, 1.33, 0.018, 0.012, material.charcoal, 0, 1.985, 0.265);
  for (let fret = 0; fret < 16; fret++) {
    const y = 2.59 - 1.29 * (1 - Math.pow(2, -fret / 12)) / (1 - Math.pow(2, -16 / 12));
    box(guitar, 0.17, 0.008, 0.008, material.aluminum, 0, y, 0.279);
    if ([3, 5, 7, 9, 12, 15].includes(fret)) frontDisc(guitar, 0.014, 0.004, material.cream, 0, y - 0.035, 0.28);
  }
  const head = rounded(guitar, 0.27, 0.39, 0.085, 0.065, material.guitarSide, 0, 2.83, 0.196);
  head.rotation.x = -0.1;
  for (let pin = 0; pin < 3; pin++) {
    for (const direction of [-1, 1]) {
      frontDisc(guitar, 0.028, 0.05, material.aluminum, direction * 0.079, 2.72 + pin * 0.1, 0.25);
      rounded(guitar, 0.08, 0.052, 0.035, 0.018, material.cream, direction * 0.166, 2.72 + pin * 0.1, 0.205);
    }
  }
  // Six independent strings can visibly resonate after the explicit strum action.
  const strings: THREE.Mesh[] = [];
  for (let string = 0; string < 6; string++) {
    const x = -0.065 + string * 0.026;
    const value = cylinder(guitar, 0.0015 + (5 - string) * 0.00032, 0.0015 + (5 - string) * 0.00032, 2.27, material.string, x, 1.62, 0.296, 5);
    strings.push(value);
    frontDisc(guitar, 0.01, 0.01, material.cream, x, 0.45, 0.317);
  }
  tube(guitarStation.group, [new THREE.Vector3(0.53, 0.035, 0.25), new THREE.Vector3(0.88, 0.035, -0.12), new THREE.Vector3(1.3, 0.035, 0.25)], 0.027, material.blackMetal);
  tube(guitarStation.group, [new THREE.Vector3(0.88, 0.03, -0.12), new THREE.Vector3(0.9, 0.95, -0.18), new THREE.Vector3(1.0, 1.65, -0.06)], 0.023, material.blackMetal);

  // One plant softens the room without turning every free surface into a prop.
  const plant = new THREE.Group();
  plant.position.set(3.68, 0, -1.16);
  world.add(plant);
  cylinder(plant, 0.22, 0.16, 0.4, material.terracotta, 0, 0.2, 0);
  cylinder(plant, 0.195, 0.195, 0.008, material.walnutDark, 0, 0.398, 0);
  for (let stem = 0; stem < 7; stem++) {
    const angle = stem * 2.39;
    const height = 0.65 + (stem % 3) * 0.15;
    const end = new THREE.Vector3(Math.cos(angle) * 0.27, height, Math.sin(angle) * 0.22);
    tube(plant, [new THREE.Vector3(0, 0.38, 0), new THREE.Vector3(end.x * 0.6, height * 0.75, end.z * 0.6), end], 0.008, material.green);
    const leaf = new THREE.Shape();
    leaf.moveTo(0, 0);
    leaf.bezierCurveTo(-0.15, 0.12, -0.11, 0.38, 0, 0.46);
    leaf.bezierCurveTo(0.13, 0.33, 0.13, 0.12, 0, 0);
    const surface = (stem % 2 ? material.green : material.leafLight).clone();
    surface.side = THREE.DoubleSide;
    materials.add(surface);
    const leafMesh = mesh(plant, new THREE.ShapeGeometry(leaf, 12), surface, end.x, end.y, end.z);
    leafMesh.rotation.set(-0.5, angle, -Math.cos(angle) * 0.85);
  }

  // Ray picking can resolve any physical descendant to its station, including
  // glass, controls, and supporting objects, without guessing a screen rectangle.
  for (const entry of stations) {
    entry.group.traverse(child => { child.userData.station = entry.id; });
  }

  let lastElapsed = 0;
  return {
    stations,
    update(elapsed, active, states) {
      const delta = Math.min(0.05, Math.max(0, elapsed - lastElapsed));
      lastElapsed = elapsed;
      if (states.motion && states.fanOn) fanRotor.rotation.z -= delta * 7;
      const vibration = states.motion && states.strumming && active === "guitar";
      strings.forEach((string, index) => {
        string.position.x = -0.065 + index * 0.026 + (vibration ? Math.sin(elapsed * (78 + index * 11)) * 0.007 : 0);
      });
      watchLed.emissiveIntensity = states.motion && active === "watchpoint" ? 0.55 + Math.sin(elapsed * 1.6) * 0.12 : 0.55;
    },
    dispose() {
      scene.remove(world);
      geometries.forEach(value => value.dispose());
      materials.forEach(value => value.dispose());
      textures.forEach(value => value.dispose());
      world.clear();
    },
  };
}
