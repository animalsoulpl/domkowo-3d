// Świat 3: Rezydencja na Wzgórzu (Willowa Dzielnica)
// Water.js (basen Infinity + jacuzzi), Sky.js (pastelowy zmierzch + PMREMGenerator),
// tekstury PBR z Poly Haven (rock_boulder_dry, wood_floor_deck, cobblestone_floor_04),
// organiczne wzgórze (IcosahedronGeometry), palmy/pnącza (CatmullRomCurve3 + TubeGeometry),
// opływowe białe auto sportowe (ExtrudeGeometry + clearcoat 1.0) i dwukondygnacyjna willa (bez BoxGeometry).
import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as A3D from './assets3d.js';

export const VILLA_PRICE = 25000;

export const VILLA_OBJECTS = [
  { id: 'v_pool', name: 'Basen Infinity (Kąpiel i pływanie)', icon: '🏊', spot: [-1.0, 2.64, 5.2], face: 0, waterMode: 'pool', need: 'fun', gain: 45, hygiene: 40, energy: 25, msg: 'Ania i Bartek pływają razem w basenie Infinity o pastelowym zmierzchu! 🏊🌅' },
  { id: 'v_jacuzzi', name: 'Podwyższone Jacuzzi z bąbelkami', icon: '🫧', spot: [6.3, 2.64, 5.2], face: 0, waterMode: 'jacuzzi', need: 'energy', gain: 40, fun: 40, hygiene: 35, msg: 'Ciepłe bąbelki w podwyższonym jacuzzi — pełny relaks jak w Beverly Hills! 🫧✨' },
  { id: 'v_loungers', name: 'Czarne leżaki przy basenie', icon: '☀️', spot: [-5.7, 2.64, 4.6], face: 0, waterMode: 'lounger', need: 'energy', gain: 35, fun: 30, msg: 'Opalanie na czarnych leżakach przy basenie Infinity! ☀️🌅' },
  { id: 'v_lounge', name: 'Strefa wypoczynkowa na tarasie', icon: '🥂', spot: [3.2, 2.64, 1.8], face: -0.6, need: 'fun', gain: 28, social: 24, msg: 'Wieczorny drink na tarasie z jasnego trawertynu! 🥂✨' },
  { id: 'v_car', name: 'Białe auto sportowe na podjeździe', icon: '🏎️', spot: [-7.2, 2.64, 3.8], face: -1.5, need: 'fun', gain: 48, msg: 'Przejażdżka białym autem sportowym krętymi drogami Willowej Dzielnicy! 🏎️💨' },
  { id: 'v_salon', name: 'Luksusowy Salon z kominkiem i witryną', icon: '🛋️', spot: [-1.2, 2.64, -3.5], face: Math.PI, need: 'fun', gain: 36, energy: 20, msg: 'Relaks na welurowej sofie przy panoramicznym kominku i witrynie z winem! 🔥🍷' },
  { id: 'v_kitchen', name: 'Kuchnia Designerska z marmurową wyspą', icon: '🍳', spot: [-6.0, 2.64, -3.5], face: -Math.PI / 2, need: 'hunger', gain: 55, skill: 'gotowanie', msg: 'Wykwintna kolacja przy wyspie z białego włoskiego marmuru! 🍽️✨' },
  { id: 'v_bed', name: 'Sypialnia Główna (Wielkie pikowane łóżko)', icon: '🛏️', spot: [3.4, 2.64, -3.4], face: Math.PI, sleep: true, need: 'energy', gain: 65, msg: 'Królewski odpoczynek na wielkim łóżku z pikowanym zagłówkiem! 🛏️💤' },
  { id: 'v_wardrobe', name: 'Przeszklona Garderoba Walk-in', icon: '🪞', spot: [2.6, 2.64, -2.5], face: Math.PI / 2, wardrobe: true, msg: 'Przeszklona garderoba walk-in z podświetleniem LED! 🪞✨' },
  { id: 'v_spa', name: 'Łazienka SPA (Kamienna wanna i deszczownica)', icon: '🛁', spot: [6.8, 2.64, -3.4], face: Math.PI, need: 'hygiene', gain: 100, energy: 25, fun: 20, msg: 'Relaksująca kąpiel w kamiennej owalnej wannie SPA! 🛁✨' },
];

// Organiczna skała / fragment wzgórza z deformowanego IcosahedronGeometry
function makeDeformedRock(radius, detail, seed, mat, sx = 1, sy = 1, sz = 1) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
    const n = Math.sin(vx * 1.7 + seed) * Math.cos(vy * 2.1 - seed * 0.7) * Math.sin(vz * 1.9 + seed * 1.3);
    const d = 1 + n * 0.24;
    pos.setXYZ(i, vx * d * sx, vy * d * sy, vz * d * sz);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// Palma z wygiętego CatmullRomCurve3 + TubeGeometry (pień + łukowate liście)
function makePalmTree(x, y, z, h = 6.2, leanX = 0.7, leanZ = 0.4, trunkMat, leafMat) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(leanX * 0.35, h * 0.35, leanZ * 0.35),
    new THREE.Vector3(leanX * 0.8, h * 0.72, leanZ * 0.75),
    new THREE.Vector3(leanX, h, leanZ),
  ]);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.2, 8, false), trunkMat);
  trunk.castShadow = true; trunk.receiveShadow = true;
  g.add(trunk);

  const top = new THREE.Vector3(leanX, h, leanZ);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + (x * 0.3);
    const len = 2.1 + (i % 3) * 0.35;
    const fCurve = new THREE.CatmullRomCurve3([
      top.clone(),
      top.clone().add(new THREE.Vector3(Math.cos(a) * len * 0.45, 0.55, Math.sin(a) * len * 0.45)),
      top.clone().add(new THREE.Vector3(Math.cos(a) * len * 0.85, 0.15, Math.sin(a) * len * 0.85)),
      top.clone().add(new THREE.Vector3(Math.cos(a) * len, -0.55, Math.sin(a) * len)),
    ]);
    const frond = new THREE.Mesh(new THREE.TubeGeometry(fCurve, 10, 0.12, 5, false), leafMat);
    frond.scale.set(1, 0.42, 1);
    frond.castShadow = true;
    g.add(frond);
  }
  return g;
}

// Zwisające pnącza z krzywych CatmullRomCurve3 + TubeGeometry
function makeHangingVines(x0, x1, y, z, count, vineMat, leafMat) {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const f = count > 1 ? i / (count - 1) : 0.5;
    const vx = x0 + (x1 - x0) * f;
    const drop = 0.85 + Math.sin(i * 2.1) * 0.42;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(vx, y, z),
      new THREE.Vector3(vx + Math.sin(i) * 0.14, y - drop * 0.45, z + 0.14),
      new THREE.Vector3(vx - Math.cos(i) * 0.12, y - drop, z + 0.06),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.028, 5, false), vineMat));
    for (let k = 1; k <= 4; k++) {
      const pt = curve.getPoint(k / 4);
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 0), leafMat);
      leaf.position.copy(pt);
      leaf.scale.set(1.3, 0.65, 0.9);
      g.add(leaf);
    }
  }
  return g;
}

// Opływowe białe auto sportowe z THREE.ExtrudeGeometry (bevelEnabled: true) + clearcoat: 1.0
function makeSportsCar() {
  const carG = new THREE.Group();
  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: '#f8fafc', metalness: 0.22, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.06,
  });
  const glassM = new THREE.MeshPhysicalMaterial({
    color: '#111827', metalness: 0.15, roughness: 0.08, clearcoat: 1.0, transparent: true, opacity: 0.88,
  });
  const tireM = new THREE.MeshStandardMaterial({ color: '#181a1f', roughness: 0.82 });
  const rimM = new THREE.MeshStandardMaterial({ color: '#d8e0ea', metalness: 0.9, roughness: 0.18 });
  const headLightM = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#e6f4ff', emissiveIntensity: 3.4, roughness: 0.1 });
  const tailLightM = new THREE.MeshStandardMaterial({ color: '#ff3b3b', emissive: '#ff1f1f', emissiveIntensity: 2.8, roughness: 0.2 });

  // Profil aerodynamiczny nadwozia (2D Shape -> ExtrudeGeometry z bevelEnabled: true!)
  const shape = new THREE.Shape();
  shape.moveTo(-2.15, 0.34);
  shape.quadraticCurveTo(-2.22, 0.66, -1.65, 0.78);
  shape.lineTo(-0.75, 0.92);
  shape.quadraticCurveTo(-0.2, 1.32, 0.55, 1.3);
  shape.quadraticCurveTo(1.25, 1.24, 1.72, 0.88);
  shape.quadraticCurveTo(2.22, 0.78, 2.25, 0.48);
  shape.lineTo(2.15, 0.32);
  shape.lineTo(-2.15, 0.32);

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.62, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.12, bevelSegments: 4, curveSegments: 16,
  });
  bodyGeo.translate(0, 0, -0.81);
  const body = new THREE.Mesh(bodyGeo, bodyPaint);
  body.castShadow = true; body.receiveShadow = true;
  carG.add(body);

  // Przyciemniana szyba kabiny (ExtrudeGeometry)
  const cabShape = new THREE.Shape();
  cabShape.moveTo(-0.72, 0.88);
  cabShape.quadraticCurveTo(-0.18, 1.28, 0.52, 1.26);
  cabShape.quadraticCurveTo(1.08, 1.2, 1.48, 0.88);
  cabShape.closePath();
  const cabGeo = new THREE.ExtrudeGeometry(cabShape, {
    depth: 1.32, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3,
  });
  cabGeo.translate(0, 0, -0.66);
  const cab = new THREE.Mesh(cabGeo, glassM);
  carG.add(cab);

  // 4 koła sportowe z felgami
  [[-1.35, -0.92], [-1.35, 0.92], [1.38, -0.92], [1.38, 0.92]].forEach(([wx, wz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20), tireM);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 0.38, wz);
    wheel.castShadow = true;
    carG.add(wheel);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 12), rimM);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(wx, 0.38, wz);
    carG.add(rim);
  });

  // Świecące reflektory przednie (-X to przód) i tylne (+X)
  [-0.58, 0.58].forEach(lz => {
    const hl = new THREE.Mesh(A3D.roundBoxGeo(0.18, 0.14, 0.38), headLightM);
    hl.position.set(-2.14, 0.56, lz);
    carG.add(hl);
    const tl = new THREE.Mesh(A3D.roundBoxGeo(0.14, 0.12, 0.44), tailLightM);
    tl.position.set(2.22, 0.62, lz);
    carG.add(tl);
  });

  // Delikatny snop światła z reflektorów
  const carLight = new THREE.PointLight('#e8f4ff', 2.2, 8, 1.5);
  carLight.position.set(-2.8, 0.7, 0);
  carG.add(carLight);

  return carG;
}

export function createLuxuryVillaWorld({ renderer }) {
  const root = new THREE.Group();
  root.name = 'luxuryVillaWorld';

  // ---- [1] NIEBO O ZMIERZCHU (Sky.js + PMREMGenerator) ----
  const sky = new Sky();
  sky.scale.setScalar(450);
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 8;
  skyUniforms['rayleigh'].value = 2.5;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const sunVec = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 4.5);   // słońce nisko nad horyzontem (pastelowy zmierzch!)
  const theta = THREE.MathUtils.degToRad(215);
  sunVec.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sunVec);
  root.add(sky);

  // Wygeneruj mapę odbić PMREMGenerator z nieba Sky.js
  let envTex = null;
  let pmremRT = null;
  if (renderer) {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const skyScene = new THREE.Scene();
      const skyCopy = new Sky();
      skyCopy.scale.setScalar(100);
      Object.keys(skyUniforms).forEach(k => {
        if (skyCopy.material.uniforms[k]) skyCopy.material.uniforms[k].value = skyUniforms[k].value;
      });
      skyScene.add(skyCopy);
      pmremRT = pmrem.fromScene(skyScene, 0.04);
      envTex = pmremRT.texture;
      pmrem.dispose();
    } catch (e) { console.warn('Sky PMREM warn', e); }
  }

  // ---- [2] TEKSTURY PBR Z POLY HAVEN ----
  const rockPBR   = A3D.getPBRMaterial('rock',   { color: '#d8cfc4', repeat: [3, 2], roughness: 0.88, normalScale: 1.15 });
  const rockWall  = A3D.getPBRMaterial('rock',   { color: '#c4b8a8', repeat: [4, 2], roughness: 0.9,  normalScale: 1.2 });
  const woodPBR   = A3D.getPBRMaterial('wood',   { color: '#c89260', repeat: [4, 4], roughness: 0.65, normalScale: 0.85 });
  const woodDark  = A3D.getPBRMaterial('wood',   { color: '#7a5030', repeat: [3, 3], roughness: 0.72, normalScale: 0.8 });
  const cobblePBR = A3D.getPBRMaterial('cobble', { color: '#d2cbc0', repeat: [5, 5], roughness: 0.84, normalScale: 1.0 });
  const travPBR   = A3D.getPBRMaterial('cobble', { color: '#efe6d8', repeat: [6, 4], roughness: 0.55, normalScale: 0.45 });
  const slateMat  = A3D.getPBRMaterial('rock',   { color: '#1b2028', repeat: [4, 2], roughness: 0.14, metalness: 0.16, normalScale: 1.35 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#1b1f26', roughness: 0.35, metalness: 0.82 });
  const glassM    = new THREE.MeshPhysicalMaterial({ color: '#cce6f5', roughness: 0.06, metalness: 0.1, transmission: 0.45, transparent: true, opacity: 0.52, clearcoat: 1.0 });
  const grassMat  = new THREE.MeshStandardMaterial({ color: '#3b6e35', roughness: 0.92 });
  const leafMat   = new THREE.MeshStandardMaterial({ color: '#2b6b33', roughness: 0.72 });
  const vineMat   = new THREE.MeshStandardMaterial({ color: '#225228', roughness: 0.85 });

  // Helper do brył z zaokrąglonymi krawędziami (RoundedBoxGeometry – bez BoxGeometry!)
  const rbox = (p, w, h, d, m, x, y, z, shadow = true) => {
    const mesh = new THREE.Mesh(A3D.roundBoxGeo(w, h, d), typeof m === 'string' ? new THREE.MeshStandardMaterial({ color: m, roughness: 0.75 }) : m);
    mesh.position.set(x, y, z);
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    p.add(mesh);
    return mesh;
  };

  const interactables = [];
  const tagObj = (g, id) => { g.traverse(o => { if (o.isMesh) o.userData.vObj = id; }); interactables.push(g); };

  // ---- [3] TEREN, PRZYSTRZYŻONY TRAWNIK, WZGÓRZE I SKAŁY ORGANICZNE ----
  const lawn = new THREE.Mesh(new THREE.CylinderGeometry(52, 56, 0.4, 48), grassMat);
  lawn.position.set(0, -0.2, 4);
  lawn.receiveShadow = true;
  root.add(lawn);

  // Zbocze wzgórza za willą (deformowane IcosahedronGeometry!)
  const hillSpecs = [
    [-16, 4.5, -18, 12, 1.4, 0.85, 0.9], [0, 6.2, -21, 14, 1.5, 0.9, 0.95], [16, 4.8, -18, 12, 1.35, 0.85, 0.9],
    [-23, 2.2, -7, 9, 1.1, 0.7, 1.0], [22, 2.4, -6, 9.5, 1.1, 0.72, 1.0],
  ];
  hillSpecs.forEach(([hx, hy, hz, r, sx, sy, sz], i) => {
    const h = makeDeformedRock(r, 2, 10 + i * 3.7, i % 2 ? grassMat : rockPBR, sx, sy, sz);
    h.position.set(hx, hy, hz);
    root.add(h);
  });
  // Organiczne skały ozdobne wokół basenu i podjazdu
  [[-12.5, 0.7, 8.2, 1.7], [-10.8, 0.5, 10.6, 1.2], [9.5, 0.6, 9.8, 1.5], [11.4, 0.9, 7.2, 1.9], [12.5, 1.4, 1.5, 2.2]].forEach(([rx, ry, rz, rad], i) => {
    const rk = makeDeformedRock(rad, 1, 40 + i * 5.1, rockPBR, 1.25, 0.78, 1.05);
    rk.position.set(rx, ry, rz);
    root.add(rk);
  });

  // Kamienne płyty ścieżki po prawej stronie na trawniku
  for (let i = 0; i < 6; i++) {
    rbox(root, 2.6, 0.12, 1.15, cobblePBR, 9.6 + Math.sin(i * 0.6) * 0.35, 0.06, 10.5 + i * 1.55, false);
  }

  // ---- [4] GŁÓWNY TARAS Z JASNEGO TRAWERTYNU (y = 2.6) + SZEROKIE SCHODY PO PRAWEJ ----
  // Podstawa tarasu (kamienna podbudowa)
  rbox(root, 20.5, 2.55, 15.5, rockWall, 0.5, 1.275, -0.5);
  // Górna płyta tarasu z jasnego trawertynu
  rbox(root, 21.0, 0.16, 16.0, travPBR, 0.5, 2.56, -0.5, false);

  // Szerokie kamienne schody po prawej stronie (z y = 0 do y = 2.6) + czarna metalowa balustrada
  for (let s = 0; s < 8; s++) {
    const sy = 0.16 + s * 0.31;
    rbox(root, 3.6, 0.32, 0.75, cobblePBR, 9.5, sy, 9.4 - s * 0.42);
  }
  // Czarna metalowa balustrada wzdłuż schodów
  const stairRailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(11.2, 1.05, 9.5),
    new THREE.Vector3(11.2, 3.55, 6.2),
  ]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(stairRailCurve, 8, 0.045, 8, false), darkMetal));
  [9.4, 7.8, 6.3].forEach((rz, idx) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.05, 8), darkMetal);
    post.position.set(11.2, 0.6 + idx * 1.15, rz);
    root.add(post);
  });

  // ---- [5] BASEN INFINITY + JACUZZI (Water.js + CZARNY ŁUPEK + ANIMOWANY SPŁYW WODY) ----
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin('anonymous');
  const waterNormals = texLoader.load('./textures/waternormals.jpg', t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  }, undefined, () => {
    texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg', t2 => {
      waterNormals.image = t2.image;
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
      waterNormals.needsUpdate = true;
    });
  });
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const poolG = new THREE.Group();
  // Niecka basenu wysunięta z przodu (X = -6.5..+4.7, Z = 5.4..10.0)
  rbox(poolG, 11.6, 2.55, 4.9, slateMat, -0.9, 1.275, 7.75);
  // Przednia ściana przelewowa z fakturowanego czarnego łupku + animowany spływ wody!
  rbox(poolG, 11.4, 2.48, 0.22, slateMat, -0.9, 1.28, 10.22);
  const waterfallStrips = [];
  const wfMat = new THREE.MeshPhysicalMaterial({
    color: '#9ee8ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.42, clearcoat: 1.0,
  });
  for (let i = 0; i < 9; i++) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.25), wfMat.clone());
    strip.position.set(-5.9 + i * 1.25, 1.32, 10.36);
    strip.userData = { ph: i * 0.8 };
    poolG.add(strip);
    waterfallStrips.push(strip);
  }
  // Dolna niecka przelewowa u stóp czarnego łupku
  rbox(poolG, 11.8, 0.36, 1.45, slateMat, -0.9, 0.18, 10.95);
  const catchWater = new THREE.Mesh(new THREE.PlaneGeometry(11.3, 1.15), new THREE.MeshPhysicalMaterial({ color: '#1b6d85', roughness: 0.08, clearcoat: 1.0 }));
  catchWater.rotation.x = -Math.PI / 2;
  catchWater.position.set(-0.9, 0.37, 10.95);
  poolG.add(catchWater);

  // Falująca tafla Basenu Infinity (Water.js)
  const infinityWater = new Water(new THREE.PlaneGeometry(11.1, 4.55), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection: sunVec.clone().normalize(),
    sunColor: 0xffc896,
    waterColor: 0x0c6b82,
    distortionScale: 1.6,
    fog: false,
  });
  infinityWater.rotation.x = -Math.PI / 2;
  infinityWater.position.set(-0.9, 2.58, 7.72);
  poolG.add(infinityWater);

  // Podwodne turkusowe podświetlenie basenu Infinity
  const poolGlow = new THREE.PointLight('#4de3ff', 2.4, 12, 1.5);
  poolGlow.position.set(-0.9, 2.1, 7.8);
  poolG.add(poolGlow);
  tagObj(poolG, 'v_pool');
  root.add(poolG);

  // Podwyższone Jacuzzi po prawej stronie basenu (X = 6.3, Z = 7.4)
  const jacG = new THREE.Group();
  rbox(jacG, 3.3, 3.05, 3.3, slateMat, 6.3, 1.525, 7.4);
  rbox(jacG, 3.45, 0.14, 3.45, travPBR, 6.3, 3.06, 7.4);
  const jacuzziWater = new Water(new THREE.PlaneGeometry(2.85, 2.85), {
    textureWidth: 256,
    textureHeight: 256,
    waterNormals,
    sunDirection: sunVec.clone().normalize(),
    sunColor: 0xffd6aa,
    waterColor: 0x1aa6b8,
    distortionScale: 2.2,
    fog: false,
  });
  jacuzziWater.rotation.x = -Math.PI / 2;
  jacuzziWater.position.set(6.3, 3.08, 7.4);
  jacG.add(jacuzziWater);
  const jacLight = new THREE.PointLight('#66f2ff', 2.0, 7, 1.5);
  jacLight.position.set(6.3, 3.3, 7.4);
  jacG.add(jacLight);
  tagObj(jacG, 'v_jacuzzi');
  root.add(jacG);

  // ---- [6] PODJAZD PO LEWEJ, MUR OPOROWY Z BLUSZCZEM I BIAŁE AUTO SPORTOWE ----
  // Podjazd (X = -17..-10, Z = -2..+12)
  rbox(root, 7.2, 0.14, 15.0, cobblePBR, -13.6, 0.07, 5.2, false);
  // Kamienny mur oporowy wzdłuż podjazdu
  rbox(root, 0.75, 2.6, 13.0, rockWall, -9.9, 1.3, 1.2);
  // Bluszcz porastający mur oporowy
  root.add(makeHangingVines(-10.35, -10.35, 2.55, 1.2, 1, vineMat, leafMat));
  for (let i = 0; i < 12; i++) {
    const ivy = makeDeformedRock(0.32, 0, 80 + i, leafMat, 0.7, 0.9, 1.3);
    ivy.position.set(-10.32, 1.4 + (i % 3) * 0.45, -3.5 + i * 0.95);
    root.add(ivy);
  }
  // Opływowe białe auto sportowe (ExtrudeGeometry + clearcoat 1.0 + opcjonalny sportscar.glb)
  const carHolder = new THREE.Group();
  carHolder.position.set(-13.4, 0.14, 5.6);
  carHolder.rotation.y = Math.PI / 2 - 0.18;
  const procCar = makeSportsCar();
  carHolder.add(procCar);
  tagObj(carHolder, 'v_car');
  root.add(carHolder);

  // Opcjonalne ładowanie ./models/villa/sportscar.glb (jeśli plik istnieje, zero błędów konsoli gdy brak!)
  fetch('./models/villa/sportscar.glb', { method: 'HEAD' }).then(r => {
    if (!r.ok) return;
    new GLTFLoader().load('./models/villa/sportscar.glb', gltf => {
      const m = gltf.scene;
      const b = new THREE.Box3().setFromObject(m), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
      const sc = sz.x > 0.001 ? 4.4 / Math.max(sz.x, sz.z) : 1;
      m.scale.setScalar(sc);
      m.position.set(-c.x * sc, -b.min.y * sc, -c.z * sc);
      m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.vObj = 'v_car'; } });
      procCar.visible = false;
      carHolder.add(m);
    }, undefined, () => {});
  }).catch(() => {});

  // ---- [7] MEBLE TARASOWE: 2 CZARNE LEŻAKI + CIEMNY ZESTAW WYPOCZYNKOWY ----
  const loungerG = new THREE.Group();
  [-6.8, -4.6].forEach(lx => {
    rbox(loungerG, 0.95, 0.24, 2.05, darkMetal, lx, 2.78, 3.6);
    rbox(loungerG, 0.86, 0.14, 1.35, '#262b33', lx, 2.94, 3.92);
    const back = rbox(loungerG, 0.86, 0.14, 0.72, '#262b33', lx, 3.16, 2.95);
    back.rotation.x = 0.55;
  });
  tagObj(loungerG, 'v_loungers');
  root.add(loungerG);

  const loungeG = new THREE.Group();
  rbox(loungeG, 3.4, 0.45, 0.95, '#252932', 4.6, 2.86, 1.2);
  rbox(loungeG, 3.4, 0.52, 0.22, '#1d2028', 4.6, 3.22, 0.8);
  rbox(loungeG, 0.95, 0.45, 2.4, '#252932', 6.1, 2.86, 2.35);
  rbox(loungeG, 1.45, 0.36, 0.95, woodDark, 4.4, 2.82, 2.65);
  // Ciepły lampion na stoliku tarasowym
  const lampL = new THREE.PointLight('#ffcf87', 1.8, 8, 1.5);
  lampL.position.set(4.4, 3.35, 2.65);
  loungeG.add(lampL);
  tagObj(loungeG, 'v_lounge');
  root.add(loungeG);

  // ---- [8] DWUKONDYGNACYJNA WILLA + EKSKLUZYWNE WNĘTRZE (4 POMIESZCZENIA + .GLB + MARMUR PBR) ----
  const marblePBR = A3D.getPBRMaterial('marble', { color: '#ffffff', repeat: [2, 2], roughness: 0.22, metalness: 0.08, normalScale: 0.45 });
  const fabricLight = A3D.getPBRMaterial('fabric', { color: '#f4eee6', repeat: [3, 3], roughness: 0.92, normalScale: 0.7 });
  const walnutM = new THREE.MeshStandardMaterial({ color: '#422a1c', roughness: 0.55 });
  const matteBlackM = new THREE.MeshStandardMaterial({ color: '#1b1d22', roughness: 0.72, metalness: 0.12 });
  const goldM = new THREE.MeshStandardMaterial({ color: '#e0b84c', roughness: 0.24, metalness: 0.88 });
  const villaG = new THREE.Group();
  const upperGroup = new THREE.Group(); // piętro + dach + frontowe szyby (ukrywane w trybie Ściany: wycięte!)
  const lowerWalls = [];
  const baseY = 2.64;

  const addLowerWall = (w, h, d, m, x, y, z) => {
    const mesh = rbox(villaG, w, h, d, m, x, y, z);
    lowerWalls.push({ mesh, baseY: y, baseH: h });
    return mesh;
  };

  // Cichy loader opcjonalnych modeli w ./models/villa/ (zero błędów konsoli gdy brak)
  const tryOptionalVillaGlb = (file, parent, targetSize, pos, rotY, fallbackObj, userData) => {
    fetch('./models/villa/' + file, { method: 'HEAD' }).then(r => {
      if (!r.ok) return;
      new GLTFLoader().load('./models/villa/' + file, gltf => {
        const m = gltf.scene;
        const b = new THREE.Box3().setFromObject(m), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
        const s = Math.min(sz.x > 0.001 ? targetSize[0] / sz.x : 1, sz.y > 0.001 ? targetSize[1] / sz.y : 1, sz.z > 0.001 ? targetSize[2] / sz.z : 1);
        m.scale.setScalar(s);
        m.position.set(pos[0] - c.x * s, pos[1] - b.min.y * s, pos[2] - c.z * s);
        m.rotation.y = rotY;
        m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (userData) Object.assign(o.userData, userData); } });
        if (fallbackObj) fallbackObj.visible = false;
        parent.add(m);
      }, undefined, () => {});
    }).catch(() => {});
  };

  // Podłoga parteru z egzotycznego drewna PBR (X = -8.6..+8.6, Z = -8.2..-1.0)
  rbox(villaG, 17.2, 0.14, 7.3, woodPBR, 0.0, baseY + 0.07, -4.65, false);
  // Ściany zewnętrzne parteru (tylna + boczne + działowe między pomieszczeniami)
  addLowerWall(17.4, 3.8, 0.36, rockPBR, 0.0, baseY + 1.9, -8.3);        // tylna ściana
  addLowerWall(0.36, 3.8, 7.4, rockPBR, -8.6, baseY + 1.9, -4.65);       // lewa ściana (kuchnia)
  addLowerWall(0.36, 3.8, 7.4, marblePBR, 8.6, baseY + 1.9, -4.65);      // prawa ściana (łazienka SPA)
  addLowerWall(0.22, 3.8, 5.2, '#ebe4d8', 1.65, baseY + 1.9, -5.6);      // ścianka Salon | Sypialnia
  addLowerWall(0.22, 3.8, 5.4, marblePBR, 5.65, baseY + 1.9, -5.5);      // ścianka Sypialnia | Łazienka SPA

  // ---- POMIESZCZENIE 1: SALON (X = -4.2..+1.5, Z = -8.0..-1.4) ----
  const salonG = new THREE.Group();
  // Gęsty jasny dywan na podłodze z egzotycznego drewna
  rbox(salonG, 4.4, 0.04, 3.6, fabricLight, -1.4, baseY + 0.15, -4.4, false);
  // Welurowa sofa (GlamVelvetSofa.glb + fallback proceduralny)
  const vSofaFb = new THREE.Group();
  rbox(vSofaFb, 2.4, 0.45, 0.95, '#3b4a6b', -1.4, baseY + 0.36, -3.5);
  rbox(vSofaFb, 2.4, 0.65, 0.22, '#2d3a56', -1.4, baseY + 0.72, -3.08);
  salonG.add(vSofaFb);
  A3D.mountGlbModel(salonG, { name: 'sofa', targetSize: [2.5, 1.0, 1.1], pos: [-1.4, baseY + 0.15, -3.35], rotY: Math.PI, userData: { vObj: 'v_salon' }, fallbackGroup: vSofaFb, replaceFallback: true });
  // Designerski fotel (SheenChair.glb + fallback)
  const vChairFb = rbox(salonG, 0.85, 0.85, 0.85, '#c97848', -3.3, baseY + 0.52, -4.5);
  A3D.mountGlbModel(salonG, { name: 'chair', targetSize: [0.95, 1.05, 0.95], pos: [-3.3, baseY + 0.15, -4.5], rotY: 1.15, userData: { vObj: 'v_salon' }, fallbackGroup: vChairFb, replaceFallback: true });
  // Marmurowy stolik kawowy ze złotą ramą
  rbox(salonG, 1.45, 0.08, 0.82, marblePBR, -1.4, baseY + 0.56, -4.75);
  rbox(salonG, 1.32, 0.38, 0.7, goldM, -1.4, baseY + 0.34, -4.75);
  // Panoramiczny kominek z żywym ogniem na tylnej ścianie salonu (X = -1.4, Z = -7.8)
  rbox(salonG, 2.6, 1.15, 0.65, matteBlackM, -1.4, baseY + 0.7, -7.8);
  rbox(salonG, 2.7, 0.1, 0.72, marblePBR, -1.4, baseY + 1.32, -7.8);
  const fireFlames = [];
  const fireMat = new THREE.MeshBasicMaterial({ color: '#ff9b2f' });
  for (let i = -3; i <= 3; i++) {
    const fl = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.36 + (Math.abs(i) % 2) * 0.1, 7), fireMat);
    fl.position.set(-1.4 + i * 0.26, baseY + 0.62, -7.52);
    fl.userData = { ph: i * 1.1 };
    salonG.add(fl);
    fireFlames.push(fl);
  }
  const fireLight = new THREE.PointLight('#ff9a3c', 2.8, 9, 1.4);
  fireLight.position.set(-1.4, baseY + 0.9, -7.1);
  salonG.add(fireLight);
  // Podświetlana witryna na wino (X = 0.7, Z = -7.75) + aparat vintage na półce!
  rbox(salonG, 1.25, 2.55, 0.58, walnutM, 0.75, baseY + 1.4, -7.75);
  rbox(salonG, 1.15, 2.35, 0.06, glassM, 0.75, baseY + 1.4, -7.45, false);
  for (let row = 0; row < 4; row++) {
    for (let b = -1; b <= 1; b++) {
      const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.28, 8), new THREE.MeshStandardMaterial({ color: row % 2 ? '#234a2c' : '#5a1624', roughness: 0.2, metalness: 0.1 }));
      bt.position.set(0.75 + b * 0.28, baseY + 0.55 + row * 0.52, -7.68);
      salonG.add(bt);
    }
  }
  const wineLed = new THREE.PointLight('#ffe0a8', 1.5, 5, 1.6);
  wineLed.position.set(0.75, baseY + 2.35, -7.55);
  salonG.add(wineLed);
  A3D.mountGlbModel(salonG, { name: 'camera', targetSize: [0.36, 0.4, 0.36], pos: [-2.2, baseY + 1.38, -7.75], rotY: 0.35, userData: { vObj: 'v_salon' } });
  tagObj(salonG, 'v_salon');
  villaG.add(salonG);

  // ---- POMIESZCZENIE 2: KUCHNIA DESIGNERSKA (X = -8.3..-4.5, Z = -7.8..-2.2) ----
  const kitG = new THREE.Group();
  // Zabudowa z ciemnego orzecha i czarnego matu wzdłuż tylnej i lewej ściany
  rbox(kitG, 3.6, 0.95, 0.78, matteBlackM, -6.5, baseY + 0.6, -7.65);
  rbox(kitG, 3.66, 0.08, 0.84, marblePBR, -6.5, baseY + 1.1, -7.65);
  rbox(kitG, 3.5, 0.9, 0.45, walnutM, -6.5, baseY + 2.45, -7.82); // górne szafki orzech
  rbox(kitG, 0.85, 2.2, 0.85, matteBlackM, -7.95, baseY + 1.24, -6.4); // czarna matowa lodówka
  // Wyspa z białego włoskiego marmuru ze złotymi żyłkami i welurowymi hokerami!
  rbox(kitG, 2.6, 0.94, 1.1, marblePBR, -6.2, baseY + 0.6, -4.8);
  rbox(kitG, 2.66, 0.06, 1.16, goldM, -6.2, baseY + 0.16, -4.8); // złoty cokół wyspy
  rbox(kitG, 2.68, 0.08, 1.18, marblePBR, -6.2, baseY + 1.1, -4.8);
  // Welurowe hokery przy wyspie
  [-7.0, -6.2, -5.4].forEach(hx => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.18, 0.72, 10), goldM);
    leg.position.set(hx, baseY + 0.5, -3.95); kitG.add(leg);
    rbox(kitG, 0.42, 0.12, 0.42, '#2d4a5e', hx, baseY + 0.88, -3.95);
  });
  // Marmurowa patera z oliwkami (IridescentDishWithOlives.glb) na wyspie!
  A3D.mountGlbModel(kitG, { name: 'dish', targetSize: [0.42, 0.24, 0.42], pos: [-6.1, baseY + 1.14, -4.8], rotY: 0.2, userData: { vObj: 'v_kitchen' } });
  tagObj(kitG, 'v_kitchen');
  villaG.add(kitG);

  // ---- POMIESZCZENIE 3: SYPIALNIA GŁÓWNA + PRZESZKLONA GARDEROBA WALK-IN (X = +1.8..+5.5) ----
  const bedG = new THREE.Group();
  // Wielkie łóżko z pikowanym zagłówkiem (RoundedBoxGeometry)
  rbox(bedG, 2.15, 0.46, 2.25, '#f2ece4', 3.65, baseY + 0.36, -6.5);
  rbox(bedG, 2.28, 1.38, 0.22, '#3d3347', 3.65, baseY + 0.84, -7.65); // pikowany zagłówek
  for (let px = -0.75; px <= 0.75; px += 0.5) for (let py = 0.75; py <= 1.15; py += 0.35) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldM);
    btn.position.set(3.65 + px, baseY + py, -7.52); bedG.add(btn);
  }
  rbox(bedG, 2.05, 0.14, 1.5, '#c9b8a6', 3.65, baseY + 0.62, -6.15); // narzuta
  rbox(bedG, 0.72, 0.18, 0.42, '#ffffff', 3.15, baseY + 0.66, -7.2);
  rbox(bedG, 0.72, 0.18, 0.42, '#ffffff', 4.15, baseY + 0.66, -7.2);
  // Designerski fotel w sypialni (SheenChair.glb)
  const bChairFb = rbox(bedG, 0.78, 0.8, 0.78, '#c97848', 4.85, baseY + 0.5, -3.5);
  A3D.mountGlbModel(bedG, { name: 'chair', targetSize: [0.88, 0.96, 0.88], pos: [4.85, baseY + 0.15, -3.5], rotY: -2.2, userData: { vObj: 'v_bed' }, fallbackGroup: bChairFb, replaceFallback: true });
  tagObj(bedG, 'v_bed');
  villaG.add(bedG);

  // Podświetlana od środka Przeszklona Garderoba Walk-in (X = 2.55, Z = -2.55)!
  const wardG = new THREE.Group();
  wardG.position.set(2.55, baseY + 0.14, -2.55);
  rbox(wardG, 1.55, 2.4, 0.82, walnutM, 0, 1.2, 0);
  rbox(wardG, 1.48, 2.28, 0.06, glassM, 0, 1.2, 0.42, false); // szklane drzwi frontowe!
  rbox(wardG, 1.56, 0.06, 0.86, goldM, 0, 2.42, 0);
  // Drążek i kolorowe wieszaki widoczne przez szkło
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.38, 8), goldM);
  rod.rotation.z = Math.PI / 2; rod.position.set(0, 1.92, 0.05); wardG.add(rod);
  ['#f4f4f4', '#1f232c', '#c73866', '#e0b868', '#45a09a', '#7b4bd6', '#d8c3a5'].forEach((col, i) => {
    rbox(wardG, 0.11, 0.88 + (i % 3) * 0.15, 0.46, col, -0.54 + i * 0.18, 1.4 - (i % 2) * 0.06, 0.05);
  });
  const wardLed = new THREE.PointLight('#ffe9b8', 2.0, 4.5, 1.5);
  wardLed.position.set(0, 2.25, 0.15); wardG.add(wardLed);
  tagObj(wardG, 'v_wardrobe');
  villaG.add(wardG);

  // ---- POMIESZCZENIE 4: ŁAZIENKA SPA (X = +5.7..+8.4, Z = -7.8..-2.2) ----
  const spaG = new THREE.Group();
  rbox(spaG, 2.8, 0.06, 6.2, marblePBR, 7.1, baseY + 0.15, -4.9, false); // marmurowa podłoga SPA
  // Wolnostojąca owalna wanna z kamienia (THREE.LatheGeometry!)
  const tubPts = [
    new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.52, 0.02), new THREE.Vector2(0.68, 0.22),
    new THREE.Vector2(0.76, 0.58), new THREE.Vector2(0.72, 0.64), new THREE.Vector2(0.62, 0.56), new THREE.Vector2(0.45, 0.12), new THREE.Vector2(0.0, 0.12),
  ];
  const tubMesh = new THREE.Mesh(new THREE.LatheGeometry(tubPts, 32), marblePBR);
  tubMesh.scale.set(0.88, 1.0, 1.38);
  tubMesh.position.set(7.15, baseY + 0.18, -5.8);
  tubMesh.castShadow = true; tubMesh.receiveShadow = true;
  spaG.add(tubMesh);
  // Woda w wannie SPA
  const tubWater = new THREE.Mesh(new THREE.CircleGeometry(0.58, 24), new THREE.MeshPhysicalMaterial({ color: '#8de2f2', roughness: 0.06, clearcoat: 1.0, transparent: true, opacity: 0.82 }));
  tubWater.rotation.x = -Math.PI / 2; tubWater.scale.set(0.84, 1.32, 1); tubWater.position.set(7.15, baseY + 0.66, -5.8);
  spaG.add(tubWater);
  tryOptionalVillaGlb('bathtub.glb', spaG, [1.5, 0.85, 2.0], [7.15, baseY + 0.18, -5.8], 0, tubMesh, { vObj: 'v_spa' });
  // Przeszklony prysznic deszczowy ze złotą deszczownicą (X = 7.15, Z = -3.1)
  rbox(spaG, 1.35, 2.4, 0.06, glassM, 7.15, baseY + 1.35, -3.75, false);
  rbox(spaG, 0.06, 2.4, 1.35, glassM, 6.48, baseY + 1.35, -3.1, false);
  const rainHead = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 16), goldM);
  rainHead.position.set(7.35, baseY + 2.45, -3.1); spaG.add(rainHead);
  tagObj(spaG, 'v_spa');
  villaG.add(spaG);

  // Latarenki (Lantern.glb) na tarasie i przy schodach!
  A3D.mountGlbModel(root, { name: 'lantern', targetSize: [0.42, 0.72, 0.42], pos: [7.9, 2.64, 5.5], rotY: 0.4 });
  A3D.mountGlbModel(root, { name: 'lantern', targetSize: [0.42, 0.72, 0.42], pos: [-8.1, 2.64, 5.4], rotY: -0.3 });

  // Ogromne przeszklone drzwi francuskie na parterze (w upperGroup – znikają w trybie wyciętych ścian, odsłaniając wnętrze!)
  rbox(upperGroup, 16.8, 3.4, 0.08, glassM, 0.0, baseY + 1.75, -1.05, false);
  for (let i = -4; i <= 4; i++) {
    rbox(upperGroup, 0.09, 3.55, 0.16, darkMetal, i * 2.05, baseY + 1.78, -1.05);
  }
  rbox(upperGroup, 17.0, 0.12, 0.18, darkMetal, 0.0, baseY + 3.52, -1.05);

  // Ciepłe światło wnętrza parteru (zawsze włączone)
  const intLight = new THREE.PointLight('#ffd294', 3.4, 18, 1.35);
  intLight.position.set(-1.5, baseY + 2.9, -4.5);
  villaG.add(intLight);
  const intLightR = new THREE.PointLight('#ffe0b0', 2.8, 16, 1.35);
  intLightR.position.set(5.0, baseY + 2.9, -4.5);
  villaG.add(intLightR);

  // Strop między parterem a piętrem + wysunięty balkon piętra z drewnianą podbitką (w upperGroup!)
  rbox(upperGroup, 17.8, 0.38, 9.6, woodPBR, 0.0, baseY + 3.92, -3.7);
  rbox(upperGroup, 17.4, 1.05, 0.07, glassM, 0.0, baseY + 4.62, 0.98, false);
  rbox(upperGroup, 17.6, 0.08, 0.12, darkMetal, 0.0, baseY + 5.15, 0.98);
  upperGroup.add(makeHangingVines(-7.6, 7.6, baseY + 4.05, 1.05, 14, vineMat, leafMat));

  // Piętro willi (kamień + drewno + ogromne przeszklenia)
  const fl2Y = baseY + 4.1;
  rbox(upperGroup, 3.4, 3.3, 6.4, rockPBR, -6.2, fl2Y + 1.65, -4.8);
  rbox(upperGroup, 3.4, 3.3, 6.4, rockPBR, 6.2, fl2Y + 1.65, -4.8);
  rbox(upperGroup, 9.2, 3.3, 0.4, woodPBR, 0.0, fl2Y + 1.65, -7.8);
  rbox(upperGroup, 9.0, 3.1, 0.08, glassM, 0.0, fl2Y + 1.55, -1.7, false);
  for (let i = -3; i <= 3; i++) rbox(upperGroup, 0.08, 3.15, 0.14, darkMetal, i * 1.48, fl2Y + 1.58, -1.7);
  const upLight = new THREE.PointLight('#ffd08a', 2.8, 13, 1.4);
  upLight.position.set(0, fl2Y + 2.2, -4.4);
  upperGroup.add(upLight);

  // Dwuspadowy dach na piętrze (ExtrudeGeometry) + widoczne drewniane krokwie!
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-9.6, 0); roofShape.lineTo(0, 3.2); roofShape.lineTo(9.6, 0);
  roofShape.lineTo(8.8, -0.25); roofShape.lineTo(0, 2.7); roofShape.lineTo(-8.8, -0.25); roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 9.6, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 2 });
  roofGeo.translate(0, 0, -9.2);
  const roofMesh = new THREE.Mesh(roofGeo, darkMetal);
  roofMesh.position.set(0, fl2Y + 3.25, 0.4); roofMesh.castShadow = true; roofMesh.receiveShadow = true;
  upperGroup.add(roofMesh);
  for (let i = -5; i <= 5; i++) {
    const rx = i * 1.65, ry = fl2Y + 3.05 + (1 - Math.abs(rx) / 9.4) * 2.55;
    rbox(upperGroup, 0.16, 0.22, 9.5, woodDark, rx, ry, -4.0);
  }
  // Ciepłe kinkiety zewnętrzne (PointLight, #ffcf87)
  const sconceGlow = new THREE.MeshStandardMaterial({ color: '#ffebb8', emissive: '#ffcf87', emissiveIntensity: 2.2 });
  [[-5.2, baseY + 2.3, -0.82], [5.2, baseY + 2.3, -0.82], [-5.2, fl2Y + 2.1, -1.52], [5.2, fl2Y + 2.1, -1.52]].forEach(([kx, ky, kz]) => {
    rbox(upperGroup, 0.22, 0.36, 0.18, sconceGlow, kx, ky, kz, false);
    const pt = new THREE.PointLight('#ffcf87', 2.4, 10, 1.5);
    pt.position.set(kx, ky, kz + 0.45); upperGroup.add(pt);
  });

  villaG.add(upperGroup);
  root.add(villaG);

  // Bąbelki 3D w Jacuzzi (widoczne, gdy Ania i Bartek się relaksują!)
  const jacBubbles = [];
  const bubMat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.72, roughness: 0.1 });
  for (let i = 0; i < 14; i++) {
    const bm = new THREE.Mesh(new THREE.SphereGeometry(0.08 + (i % 3) * 0.03, 8, 8), bubMat);
    bm.position.set(6.3 + Math.cos(i) * 0.85, 3.12, 7.4 + Math.sin(i * 1.4) * 0.85);
    bm.userData = { ph: i * 0.7 };
    root.add(bm);
    jacBubbles.push(bm);
  }

  // Opcjonalne modele ./models/villa/palmtree.glb i sunlounger.glb (zero błędów konsoli gdy brak!)
  tryOptionalVillaGlb('sunlounger.glb', loungerG, [1.1, 0.8, 2.1], [-6.8, 2.64, 3.6], 0, null, { vObj: 'v_loungers' });
  const palm1 = makePalmTree(-9.6, 2.55, -2.5, 6.8, -1.1, 0.7, woodDark, leafMat);
  root.add(palm1);
  tryOptionalVillaGlb('palmtree.glb', root, [4.5, 7.0, 4.5], [-9.6, 2.55, -2.5], 0, palm1, null);
  root.add(makePalmTree(9.8, 2.55, -3.2, 7.2, 1.2, 0.6, woodDark, leafMat));
  root.add(makePalmTree(-12.2, 0.0, 10.2, 6.4, -0.8, 0.9, woodDark, leafMat));
  root.add(makePalmTree(11.8, 0.0, 8.8, 6.6, 0.9, 0.8, woodDark, leafMat));
  root.add(makePalmTree(13.2, 0.0, 1.8, 7.4, 1.3, -0.5, woodDark, leafMat));

  // ---- [10] STAN ANI I BARTKA W WILLI (TARAS, WNĘTRZE, BASEN, JACUZZI) ----
  const sim = { x: -1.4, y: 2.64, z: 2.2, face: 0.2, tx: -1.4, tz: 2.2, moving: false, mode: 'land', onArrive: null };
  const bartek = { x: 0.9, y: 2.64, z: 2.4, face: -0.35, mode: 'land', talkUntil: 0 };

  const clampWalk = (x, z) => [Math.max(-8.4, Math.min(8.4, x)), Math.max(-7.5, Math.min(5.2, z))];

  function setWallMode(mode) {
    // 0 = wycięte (perfekcyjnie odsłania 4 luksusowe pomieszczenia parteru!), 1 = pełne (2 piętra + dach!), 2 = niskie
    upperGroup.visible = (mode === 1);
    for (const w of lowerWalls) {
      if (mode === 2) {
        w.mesh.scale.y = 0.22;
        w.mesh.position.y = baseY + (w.baseH * 0.22) / 2;
      } else {
        w.mesh.scale.y = 1.0;
        w.mesh.position.y = w.baseY;
      }
    }
  }
  setWallMode(0);

  return {
    root,
    envTex,
    sunVec,
    sim,
    bartek,
    setWallMode,
    setWaterMode(m) {
      sim.mode = m; bartek.mode = m; sim.moving = false;
      if (m === 'pool') {
        sim.x = -2.2; sim.y = 1.48; sim.z = 7.7; sim.face = 1.3;
        bartek.x = 0.4; bartek.y = 1.48; bartek.z = 7.7; bartek.face = -1.3;
      } else if (m === 'jacuzzi') {
        sim.x = 5.85; sim.y = 2.15; sim.z = 7.4; sim.face = 1.4;
        bartek.x = 6.75; bartek.y = 2.15; bartek.z = 7.4; bartek.face = -1.4;
      } else if (m === 'lounger') {
        sim.x = -6.8; sim.y = 2.68; sim.z = 3.85; sim.face = 0;
        bartek.x = -4.6; bartek.y = 2.68; bartek.z = 3.85; bartek.face = 0;
      } else {
        sim.x = -1.4; sim.y = 2.64; sim.z = 2.2;
        bartek.x = 0.9; bartek.y = 2.64; bartek.z = 2.4;
      }
    },
    camAt: [-1.2, 13.5, 22.5, 0.0, 3.6, -1.2],
    camPresets: {
      all: [-1.2, 13.5, 22.5, 0.0, 3.6, -1.2],
      interior: [0.0, 12.2, 5.2, 0.0, 3.0, -5.0],
      pool: [0.0, 6.8, 17.5, 0.0, 2.8, 6.8],
      car: [-18.5, 5.2, 14.5, -13.0, 1.2, 5.5],
    },
    walkTo(x, z, onArrive = null) {
      if (sim.mode !== 'land') { sim.mode = 'land'; sim.y = 2.64; bartek.mode = 'land'; bartek.y = 2.64; bartek.x = 0.9; bartek.z = 2.4; }
      const [cx, cz] = clampWalk(x, z);
      sim.tx = cx; sim.tz = cz; sim.moving = true; sim.onArrive = onArrive;
    },
    pick(ray) {
      const hits = ray.intersectObjects(interactables, true);
      for (const h of hits) {
        let o = h.object;
        while (o && !o.userData.vObj) o = o.parent;
        if (o && o.userData.vObj) return { obj: VILLA_OBJECTS.find(v => v.id === o.userData.vObj) };
      }
      return null;
    },
    update(dt, now) {
      // Animacja falowania wody Water.js (basen Infinity + Jacuzzi)
      if (infinityWater.material.uniforms['time']) infinityWater.material.uniforms['time'].value += dt * 0.65;
      if (jacuzziWater.material.uniforms['time']) jacuzziWater.material.uniforms['time'].value += dt * 1.15;
      const t = now / 1000;
      // Animacja spływu wody po czarnym łupku
      for (const s of waterfallStrips) {
        s.material.opacity = 0.26 + 0.22 * (0.5 + 0.5 * Math.sin(t * 4.5 + s.userData.ph));
        s.position.y = 1.28 - ((t * 0.7 + s.userData.ph * 0.2) % 0.22);
      }
      // Żywy ogień w panoramicznym kominku w salonie
      for (const fl of fireFlames) {
        fl.scale.y = 0.8 + 0.28 * Math.sin(t * 10 + fl.userData.ph);
        fl.scale.x = fl.scale.z = 0.9 + 0.12 * Math.cos(t * 8 + fl.userData.ph);
      }
      fireLight.intensity = 2.5 + Math.sin(t * 9) * 0.35;
      // Bąbelki w Jacuzzi
      for (const bm of jacBubbles) {
        bm.position.y = 3.08 + ((t * 0.38 + bm.userData.ph) % 0.26);
        bm.scale.setScalar(0.75 + 0.35 * Math.sin(t * 5 + bm.userData.ph));
      }
      // Ruch pływania w basenie Infinity
      if (sim.mode === 'pool') {
        sim.y = 1.48 + Math.sin(t * 2.4) * 0.05;
        bartek.y = 1.48 + Math.cos(t * 2.2) * 0.05;
      }
      // Ruch Ani po tarasie i wnętrzu
      if (sim.moving) {
        const dx = sim.tx - sim.x, dz = sim.tz - sim.z, d = Math.hypot(dx, dz);
        if (d < 0.15) {
          sim.x = sim.tx; sim.z = sim.tz; sim.moving = false;
          const cb = sim.onArrive; sim.onArrive = null;
          if (cb) cb();
        } else {
          const step = Math.min(d, 3.6 * dt);
          sim.x += (dx / d) * step; sim.z += (dz / d) * step;
          sim.face = Math.atan2(dx, dz);
        }
      }
    },
    dispose() {
      if (pmremRT) pmremRT.dispose();
      root.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    },
  };
}
