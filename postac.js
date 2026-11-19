// Postać z gotowych modeli Quaternius (CC0): głowa z "Universal Base Characters",
// ciało i stroje z "Modular Character Outfits – Fantasy", fryzury z "Universal Base Characters".
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const A = 'assets/postacie/';
export const OUTFITS = [['Peasant', 'Codzienny (lniany)'], ['Ranger', 'Łucznik (z kapturem)'], ['RangerNoHood', 'Łucznik (bez kaptura)']];
export const HAIRSTYLES = [['Hair_Long', 'Długie'], ['Hair_Buns', 'Koki'], ['Hair_SimpleParted', 'Krótkie z przedziałkiem'], ['Hair_BuzzedFemale', 'Bardzo krótkie'], ['Hair_Buzzed', 'Na jeża'], ['none', 'Brak']];
export const TARGET_HEIGHT = 1.74;

const loader = new GLTFLoader();
const cache = new Map();
function loadGltf(url) {
  if (!cache.has(url)) cache.set(url, new Promise((ok, err) => loader.load(url, ok, undefined, err)));
  return cache.get(url);
}
export function preload(fem) {
  const g = fem ? 'Female' : 'Male';
  return Promise.all([A + `baza/Superhero_${g}_FullBody.gltf`, A + `stroje/${g}_Peasant.gltf`].map(loadGltf));
}

// Zostaw w siatce tylko trójkąty przypisane do głowy/szyi (reszta ciała jest pod strojem).
function keepHeadOnly(mesh, keepBones) {
  const geo = mesh.geometry, idx = geo.index, sk = geo.attributes.skinIndex, sw = geo.attributes.skinWeight;
  const keep = new Set(keepBones.map(n => mesh.skeleton.bones.findIndex(b => b.name === n)).filter(i => i >= 0));
  const headWeight = v => { let w = 0; for (let k = 0; k < 4; k++) if (keep.has(sk.getComponent(v, k))) w += sw.getComponent(v, k); return w; };
  const hw = new Float32Array(sk.count); for (let v = 0; v < sk.count; v++) hw[v] = headWeight(v);
  const out = [];
  for (let i = 0; i < idx.count; i += 3) {
    const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2);
    if (hw[a] > 0.5 && hw[b] > 0.5 && hw[c] > 0.5) out.push(a, b, c);
  }
  const g2 = geo.clone(); g2.setIndex(out); mesh.geometry = g2;
}

function tint(mesh, color) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mesh.material = mats.map(m => { const c = m.clone(); c.color = new THREE.Color(color); return c; });
  if (mesh.material.length === 1) mesh.material = mesh.material[0];
}

/**
 * Buduje postać. look: { body:'f'|'m', outfit, hairModel, hair (kolor), skin (kolor), eyes (kolor), beard }
 * Zwraca { root, bones, head, height, pelvisY }
 */
export async function buildCharacter(look) {
  if (look && look.gen === 2) return buildModern(look);
  const fem = (look.body || 'f') === 'f', G = fem ? 'Female' : 'Male';
  const outfitKey = look.outfit || 'Peasant', hood = outfitKey === 'Ranger';
  const outfitFile = outfitKey.startsWith('Ranger') ? 'Ranger' : 'Peasant';
  const urls = [A + `stroje/${G}_${outfitFile}.gltf`, A + `baza/Superhero_${G}_FullBody.gltf`];
  const hairModel = look.hairModel || (fem ? 'Hair_Long' : 'Hair_SimpleParted');
  if (hairModel !== 'none' && !hood) urls.push(A + `fryzury/${hairModel}.gltf`);
  if (look.beard && !fem) urls.push(A + 'fryzury/Hair_Beard.gltf');
  const gltfs = await Promise.all(urls.map(loadGltf));

  const root = new THREE.Group();
  const scenes = gltfs.map(g => SkeletonUtils.clone(g.scene));
  scenes.forEach(s => root.add(s));
  // szkielet główny = szkielet stroju
  let master = null;
  scenes[0].traverse(o => { if (o.isSkinnedMesh && !master) master = o.skeleton; });
  const byName = new Map(master.bones.map(b => [b.name, b]));

  scenes.forEach((s, si) => s.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    const mn = (o.material && o.material.name) || '';
    if (si === 0 && !hood && /Hood/i.test(o.name)) o.visible = false;
    if (si === 1) { // głowa bazowa
      if (/Superhero/i.test(mn) || /Superhero/i.test(o.name)) { keepHeadOnly(o, ['Head', 'neck_01']); if (look.skin) tint(o, look.skin); }
      if (/Eyes/i.test(mn) && look.eyes) tint(o, look.eyes);
      if (/Hair/i.test(mn) && look.hair) tint(o, look.hair); // brwi
    }
    if (si >= 2 && look.hair) tint(o, look.hair);
    if (si === 0 && /Regular/i.test(mn) && look.skin) tint(o, look.skin); // odsłonięta skóra w stroju łucznika
    else if (si === 0 && look.cloth && !/Regular|Eye|Hair/i.test(mn)) tint(o, new THREE.Color(look.cloth).multiplyScalar(2.2)); // kolor ubrania (sąsiedzi), rozjaśniony, bo mnoży się z teksturą
    if (o.isSkinnedMesh && si > 0) {
      const bones = o.skeleton.bones.map(b => byName.get(b.name) || b);
      o.bind(new THREE.Skeleton(bones, o.skeleton.boneInverses), o.bindMatrix);
    }
  }));
  // ukryj nieużywane szkielety (kości z innych plików nie są już potrzebne)
  // skala do docelowego wzrostu
  root.updateMatrixWorld(true);
  const head = byName.get('Head'), foot = byName.get('foot_l');
  const hp = head.getWorldPosition(new THREE.Vector3()), fp = foot.getWorldPosition(new THREE.Vector3());
  const rawH = (hp.y - Math.min(0, fp.y)) + 0.16; // od stóp do czubka głowy (szacunkowo)
  const s = TARGET_HEIGHT / rawH;
  root.scale.setScalar(s);
  root.updateMatrixWorld(true);
  const pelvisY = byName.get('pelvis').getWorldPosition(new THREE.Vector3()).y;
  const rest = new Map(master.bones.map(b => [b, b.quaternion.clone()]));
  let masterScene = scenes[0];
  return { root, master: masterScene, bones: byName, head, pelvisY, rest, scale: s, mixer: null, current: null };
}

// ---------- pozowanie przez "celowanie" kośćmi ----------
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _rq = new THREE.Quaternion();
function aim(ch, boneName, childName, dir) {
  const b = ch.bones.get(boneName), c = ch.bones.get(childName); if (!b || !c) return;
  b.updateMatrixWorld(true);
  const cur = c.getWorldPosition(_v2).sub(b.getWorldPosition(_v1)).normalize();
  ch.root.getWorldQuaternion(_rq);
  const tgt = dir.clone().normalize().applyQuaternion(_rq);
  _q.setFromUnitVectors(cur, tgt);
  b.getWorldQuaternion(_q1); b.parent.getWorldQuaternion(_q2);
  b.quaternion.copy(_q2.invert().multiply(_q.multiply(_q1)));
  b.updateMatrixWorld(true);
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function twist(ch, boneName, axis, ang) { const b = ch.bones.get(boneName); if (b) { b.rotateOnAxis(axis, ang); b.updateMatrixWorld(true); } }

export function poseCharacter(ch, st, t) {
  ch.rest.forEach((q, b) => b.quaternion.copy(q));
  ch.root.updateMatrixWorld(true);
  const sw = Math.sin(t * 8), cw = Math.cos(t * 8);
  const P = st.pose, an = st.anim;
  // nogi
  if (P === 'walk') {
    aim(ch, 'thigh_l', 'calf_l', V(0.02, -1, sw * 0.42)); aim(ch, 'thigh_r', 'calf_r', V(-0.02, -1, -sw * 0.42));
    aim(ch, 'calf_l', 'foot_l', V(0, -1, sw * 0.42 - Math.max(0, -cw) * 0.75)); aim(ch, 'calf_r', 'foot_r', V(0, -1, -sw * 0.42 - Math.max(0, cw) * 0.75));
  } else if (P === 'sit') {
    aim(ch, 'thigh_l', 'calf_l', V(0.08, -0.05, 1)); aim(ch, 'thigh_r', 'calf_r', V(-0.08, -0.05, 1));
    aim(ch, 'calf_l', 'foot_l', V(0.02, -1, 0.08)); aim(ch, 'calf_r', 'foot_r', V(-0.02, -1, 0.08));
  } else {
    aim(ch, 'thigh_l', 'calf_l', V(0.04, -1, 0)); aim(ch, 'thigh_r', 'calf_r', V(-0.04, -1, 0));
    aim(ch, 'calf_l', 'foot_l', V(0.02, -1, -0.02)); aim(ch, 'calf_r', 'foot_r', V(-0.02, -1, -0.02));
  }
  // ręce (domyślnie opuszczone wzdłuż ciała)
  const arm = (side, up, low) => { const s = side === 'l' ? 1 : -1;
    aim(ch, 'upperarm_' + side, 'lowerarm_' + side, V(up[0] * s, up[1], up[2]));
    aim(ch, 'lowerarm_' + side, 'hand_' + side, V(low[0] * s, low[1], low[2])); };
  let L = [[0.16, -1, 0.02], [0.06, -1, 0.12]], R = [[0.16, -1, 0.02], [0.06, -1, 0.12]];
  if (P === 'walk') { L = [[0.14, -1, -sw * 0.35], [0.05, -1, -sw * 0.3 + 0.25]]; R = [[0.14, -1, sw * 0.35], [0.05, -1, sw * 0.3 + 0.25]]; }
  if (P === 'sit') { L = [[0.15, -1, 0.25], [0.05, -0.35, 1]]; R = L; }
  if (an === 'type') { L = [[0.18, -0.85, 0.5], [-0.15, -0.1, 1]]; R = L; }
  if (an === 'arms') { const k = Math.sin(t * 5) * 0.15; L = [[0.15, -0.9, 0.35], [-0.2, 0.0 + k, 1]]; R = [[0.15, -0.9, 0.35], [-0.2, -k, 1]]; }
  if (an === 'paint') { L = [[0.15, -0.95, 0.25], [-0.1, -0.2, 1]]; R = [[0.25, -0.2 + Math.sin(t * 4) * 0.25, 1], [0.0, 0.3 + Math.sin(t * 3) * 0.3, 1]]; }
  if (an === 'play') { L = [[0.3, -0.7, 0.55], [-0.6, 0.35, 0.8]]; R = [[0.2, -0.9, 0.35], [-0.6, -0.2 + Math.sin(t * 14) * 0.15, 0.8]]; }
  if (an === 'phone') { R = [[0.3, -0.75, 0.35], [-0.35, 1, 0.1]]; L = [[0.16, -0.9, 0.35], [-0.25, -0.1, 1]]; }
  if (an === 'cheer') { L = [[0.35, 1, 0.1], [0.15, 1, 0]]; R = L; }
  if (P === 'lie') { L = [[0.12, -1, 0.05], [0.05, -1, 0.15]]; R = L; }
  arm('l', L[0], L[1]); arm('r', R[0], R[1]);
  // głowa i tułów
  const head = ch.bones.get('Head'), sp = ch.bones.get('spine_02');
  if (P === 'stand' && !an) { head.rotateY(Math.sin(t * 0.6) * 0.18); head.rotateX(Math.sin(t * 0.37) * 0.04); sp && sp.rotateX(Math.sin(t * 2) * 0.01); }
  if (an === 'type' || an === 'arms' || an === 'play') head.rotateX(0.25);
  if (an === 'phone') head.rotateZ(-0.12);
  if (P === 'walk' && sp) sp.rotateY(sw * 0.06);
  ch.root.updateMatrixWorld(true);
}

// ---------- animacje (Universal Animation Library, CC0) ----------
let clipsPromise = null;
export function loadAnimations() {
  if (!clipsPromise) clipsPromise = new Promise((ok, err) => loader.load('assets/animacje/UAL1_Standard.glb', g => {
    const clips = {};
    const restA = new Map(); g.scene.traverse(o => { if (o.isBone) restA.set(o.name, o.quaternion.clone()); });
    for (const c of g.animations) {
      // tylko obroty kości + ruch miednicy (proporcje ciała zostają z modelu)
      c.tracks = c.tracks.filter(t => t.name.endsWith('.quaternion') || t.name === 'pelvis.position');
      clips[c.name] = c;
    }
    clips._restA = restA;
    ok(clips);
  }, undefined, err));
  return clipsPromise;
}

// przelicz klip z postawy manekina na postawę modelu: q_model = rest_model * rest_anim^-1 * q_anim
function retarget(ch, clip, restA) {
  const restM = new Map(); ch.rest.forEach((q, b) => restM.set(b.name, q));
  const c = clip.clone();
  const qa = new THREE.Quaternion(), qm = new THREE.Quaternion(), qv = new THREE.Quaternion();
  for (const t of c.tracks) {
    if (!t.name.endsWith('.quaternion')) continue;
    const bn = t.name.slice(0, -'.quaternion'.length), ra = restA.get(bn), rm = restM.get(bn);
    if (!ra || !rm) continue;
    qa.copy(ra).invert(); qm.copy(qa).multiply(rm); // q_anim * rest_anim^-1 * rest_model
    const v = t.values;
    for (let i = 0; i < v.length; i += 4) { qv.set(v[i], v[i + 1], v[i + 2], v[i + 3]); qv.multiply(qm); v[i] = qv.x; v[i + 1] = qv.y; v[i + 2] = qv.z; v[i + 3] = qv.w; }
  }
  return c;
}

// jaki klip do jakiej czynności
function clipFor(st) {
  if (st.pose === 'lie' || st.anim === 'play') return null; // ręcznie ułożone pozy
  if (st.pose === 'walk') return st.jog ? 'Jog_Fwd_Loop' : 'Walk_Loop';
  if (st.pose === 'sit') return st.anim === 'type' ? 'Driving_Loop' : st.talk ? 'Sitting_Talking_Loop' : 'Sitting_Idle_Loop';
  if (st.anim === 'cheer') return 'Dance_Loop';
  if (st.anim === 'phone' || st.talk) return 'Idle_Talking_Loop';
  if (st.anim === 'arms' || st.anim === 'paint') return 'Interact';
  if (st.anim === 'type') return 'Driving_Loop';
  return 'Idle_Loop';
}

/** Animuje postać: klipy z biblioteki, a dla leżenia i gitary – ręczna poza. */
export function animateCharacter(ch, st, dt, t, clips) {
  const name = clips ? clipFor(st) : null;
  if (!name || !clips[name]) {
    if (ch.mixer && ch.current) { ch.mixer.stopAllAction(); ch.current = null; }
    poseCharacter(ch, st, t); return;
  }
  if (!ch.mixer) { ch.mixer = new THREE.AnimationMixer(ch.master); ch.actions = {}; }
  if (ch.current !== name) {
    const next = ch.actions[name] || (ch.actions[name] = ch.mixer.clipAction(retarget(ch, clips[name], clips._restA)));
    if (name === 'Interact') { next.setLoop(THREE.LoopPingPong, Infinity); }
    next.reset().play();
    const prev = ch.current && ch.actions[ch.current];
    if (prev) next.crossFadeFrom(prev, 0.25, false); else ch.rest.forEach((q, b) => b.quaternion.copy(q));
    ch.current = name;
  }
  ch.actions[name].timeScale = st.timeScale || 1;
  ch.mixer.update(dt);
  // telefon przy uchu – dopasuj prawą rękę po animacji
  if (st.anim === 'phone') {
    aim(ch, 'upperarm_r', 'lowerarm_r', V(-0.3, -0.75, 0.35));
    aim(ch, 'lowerarm_r', 'hand_r', V(0.35, 1, 0.1));
  }
  ch.root.updateMatrixWorld(true);
}

// =====================================================================
//  GENERACJA 2: modułowe fryzury, kroje ubrań, detale twarzy i dodatki
//  (look.gen === 2, patrz wyglad.js). Bazą jest ciało ze stroju "Peasant",
//  które przemalowujemy kolorami wierzchołków na różne kroje, a fryzury,
//  spódnice, kaptury i akcesoria to osobne siatki przypięte do kości.
// =====================================================================
const HAIR_CAP = {
  long: 'Hair_Long', waves: 'Hair_BuzzedFemale', ponytail: 'Hair_BuzzedFemale', ponytail_bangs: 'Hair_BuzzedFemale',
  bun: 'Hair_BuzzedFemale', bob: 'Hair_BuzzedFemale', pixie: 'Hair_BuzzedFemale', buns: 'Hair_Buns',
  afro: 'Hair_Buzzed', messy: 'Hair_Buzzed', fringe: 'Hair_Buzzed', wavy: 'Hair_SimpleParted',
  parted: 'Hair_SimpleParted', buzz: 'Hair_Buzzed', bald: null
};
// Ciche wykrywanie opcjonalnych modularnych modeli .glb w ./models/characters/ (zero błędów w konsoli gdy brak)
const CHAR_GLB_BASE = './models/characters/';
const charGlbChecked = new Map();
async function tryLoadCharGlb(filename) {
  if (!filename) return null;
  if (charGlbChecked.has(filename)) return charGlbChecked.get(filename);
  const url = CHAR_GLB_BASE + filename;
  const p = fetch(url, { method: 'HEAD' }).then(r => {
    if (!r.ok) return null;
    return loadGltf(url).then(g => g.scene).catch(() => null);
  }).catch(() => null);
  charGlbChecked.set(filename, p);
  return p;
}
function specFromLook(look, fem) {
  if (!look.topStyle && !look.bottomStyle) return SPEC[look.outfitType] || SPEC[fem ? 'tee' : 'shirt_rolled'];
  const ts = look.topStyle || 'tee', bs = look.bottomStyle || 'jeans';
  const sp = { sleeve: 'short', neck: 'round' };
  if (ts === 'blazer') { sp.sleeve = 'long'; sp.open = 'blazer'; }
  else if (ts === 'sweater') { sp.sleeve = 'long'; sp.hem = true; sp.cuffs = true; }
  else if (ts === 'hoodie') { sp.sleeve = 'long'; sp.hem = true; sp.cuffs = true; sp.hood = true; sp.pocket = true; }
  else if (ts === 'tank') { sp.sleeve = 'none'; sp.neck = 'v'; }
  else if (ts === 'shirt') { sp.sleeve = 'rolled'; sp.placket = true; sp.tuck = true; sp.belt = true; }
  else { sp.sleeve = 'short'; sp.tuck = false; }
  if (bs === 'skirt') { sp.skirt = { hem: 0.56, flare: 0.65 }; }
  else if (bs === 'gown') { sp.skirt = { hem: 0.14, flare: 0.85 }; sp.dress = true; sp.sash = true; }
  else if (bs === 'shorts') { sp.shorts = true; }
  return sp;
}
const SPEC = {
  dress_flare: { sleeve: 'short', neck: 'v', skirt: { hem: 0.5, flare: 1 }, dress: true, sash: true },
  dress_fit: { sleeve: 'none', neck: 'round', skirt: { hem: 0.56, flare: 0.35 }, dress: true },
  skirt_blouse: { sleeve: 'rolled', neck: 'v', skirt: { hem: 0.6, flare: 0.45 }, tuck: true },
  pants_blazer: { sleeve: 'long', open: 'blazer' },
  sweater: { sleeve: 'long', hem: true, cuffs: true },
  hoodie: { sleeve: 'long', hem: true, cuffs: true, hood: true, pocket: true },
  tee: { sleeve: 'short', tuck: false },
  shirt_rolled: { sleeve: 'rolled', placket: true, tuck: true, belt: true },
  blazer: { sleeve: 'long', open: 'blazer' },
  tee_jacket: { sleeve: 'long', open: 'jacket', cuffs: true },
  vest: { sleeve: 'rolled', open: 'vest', tuck: true, belt: true, sleeveInner: true },
};
const col = c => new THREE.Color(c);
const shade = (c, k) => { const o = col(c); return k >= 0 ? o.lerp(new THREE.Color(1, 1, 1), k) : o.multiplyScalar(1 + k); };

// średni kolor tekstury (żeby gołe ręce i fryzury proceduralne pasowały do teksturowanej głowy)
const avgCache = new WeakMap();
function avgTex(tex) {
  const img = tex && tex.image; if (!img) return new THREE.Color(1, 1, 1);
  if (avgCache.has(img)) return avgCache.get(img);
  let out = new THREE.Color(1, 1, 1);
  try {
    const c = document.createElement('canvas'); c.width = c.height = 24; const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, 24, 24); const d = x.getImageData(0, 0, 24, 24).data; let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 20) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    if (n) out = new THREE.Color().setRGB(r / n / 255, g / n / 255, b / n / 255, THREE.SRGBColorSpace);
  } catch (e) { /* brak dostępu do pikseli */ }
  avgCache.set(img, out); return out;
}

// ---- wzory tkanin (szare, mnożone przez kolor wierzchołków) ----
const patCache = {};
function canvasTex(draw, n = 128, rep = 4) {
  const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, n, n); draw(x, n);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function patTex(kind) {
  if (!kind || kind === 'plain') return null;
  if (patCache[kind]) return patCache[kind];
  const R = (a, b) => a + Math.random() * (b - a);
  const draw = {
    stripes: (x, n) => { x.fillStyle = '#8a8a8a'; for (let y = 0; y < n; y += 32) x.fillRect(0, y, n, 12); },
    check: (x, n) => { x.globalAlpha = 0.45; x.fillStyle = '#6a6a6a'; for (let i = 0; i < n; i += 32) { x.fillRect(i, 0, 12, n); x.fillRect(0, i, n, 12); } x.globalAlpha = 0.6; x.fillStyle = '#fff'; for (let i = 20; i < n; i += 32) { x.fillRect(i, 0, 2, n); x.fillRect(0, i, n, 2); } },
    dots: (x, n) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, n, n); x.fillStyle = '#5a5a5a'; for (let i = 0; i < n; i += 32) for (let j = 0; j < n; j += 32) { x.beginPath(); x.arc(i + 8 + ((j / 32) % 2) * 16, j + 8, 5, 0, 7); x.fill(); } },
    floral: (x, n) => { for (let k = 0; k < 9; k++) { const cx = R(10, n - 10), cy = R(10, n - 10); x.fillStyle = '#f8f8f8'; for (let p = 0; p < 5; p++) { const a = p * 1.2566; x.beginPath(); x.ellipse(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, 5, 3, a, 0, 7); x.fill(); } x.fillStyle = '#6a6a6a'; x.beginPath(); x.arc(cx, cy, 3, 0, 7); x.fill(); } x.globalCompositeOperation = 'destination-over'; x.fillStyle = '#c8c8c8'; x.fillRect(0, 0, n, n); },
    knit: (x, n) => { x.fillStyle = '#e4e4e4'; x.fillRect(0, 0, n, n); x.strokeStyle = '#b8b8b8'; x.lineWidth = 2; for (let i = 0; i < n; i += 8) for (let j = 0; j < n; j += 8) { x.beginPath(); x.moveTo(i, j); x.lineTo(i + 4, j + 7); x.lineTo(i + 8, j); x.stroke(); } },
    denim: (x, n) => { const d = x.getImageData(0, 0, n, n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 205 + ((i + j) % 4 < 2 ? 25 : 0) + R(-18, 18); const o = (j * n + i) * 4; d.data[o] = d.data[o + 1] = d.data[o + 2] = v; } x.putImageData(d, 0, 0); },
  }[kind];
  return (patCache[kind] = draw ? canvasTex(draw, 128, kind === 'knit' || kind === 'denim' ? 6 : 4) : null);
}
let strandTex = null;
function hairTex() {
  if (!strandTex) strandTex = canvasTex((x, n) => { x.fillStyle = '#d8d8d8'; x.fillRect(0, 0, n, n); for (let i = 0; i < 140; i++) { const v = 150 + Math.floor(Math.random() * 105); x.strokeStyle = `rgb(${v},${v},${v})`; x.lineWidth = 1 + Math.random() * 2; const xx = Math.random() * n; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + 4, n * 0.33, xx - 4, n * 0.66, xx, n); x.stroke(); } }, 128, 3);
  return strandTex;
}

// przemaluj siatkę stroju: każdy wierzchołek dostaje kolor regionu, trójkąty skóry idą do osobnego materiału
const _vp = new THREE.Vector3();
function recolor(mesh, fn, clothMat, skinMat) {
  const geo = mesh.geometry.clone(); mesh.geometry = geo;
  const n = geo.attributes.position.count, cArr = new Float32Array(n * 3), isSkin = new Uint8Array(n);
  const si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, bones = mesh.skeleton.bones;
  for (let i = 0; i < n; i++) {
    let best = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; best = si.getComponent(i, k); } }
    mesh.getVertexPosition(i, _vp); _vp.applyMatrix4(mesh.matrixWorld);
    const r = fn(_vp, (bones[best] && bones[best].name) || '');
    if (r === 'skin') { isSkin[i] = 1; cArr.set([1, 1, 1], i * 3); } else cArr.set([r.r, r.g, r.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cArr, 3));
  const idx = geo.index, cloth = [], skin = [];
  for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2); (isSkin[a] + isSkin[b] + isSkin[c] >= 2 ? skin : cloth).push(a, b, c); }
  geo.setIndex(cloth.concat(skin)); geo.clearGroups(); geo.addGroup(0, cloth.length, 0); geo.addGroup(cloth.length, skin.length, 1);
  mesh.material = [clothMat, skinMat];
}
function worldPts(mesh) {
  const idx = mesh.geometry.index, used = new Set(); for (let i = 0; i < idx.count; i++) used.add(idx.getX(i));
  const out = []; for (const i of used) { const v = new THREE.Vector3(); mesh.getVertexPosition(i, v); v.applyMatrix4(mesh.matrixWorld); out.push(v); } return out;
}
// zwężana rurka (kucyk, kosmyki)
function taperTube(pts, r0, r1, seg = 24, rad = 10) {
  const curve = new THREE.CatmullRomCurve3(pts), g = new THREE.TubeGeometry(curve, seg, 1, rad, false), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) { const t = i / seg, c = curve.getPointAt(t), r = r0 + (r1 - r0) * Math.pow(t, 0.8) * (1 - 0.15 * Math.sin(t * Math.PI));
    for (let j = 0; j <= rad; j++) { const k = i * (rad + 1) + j; v.fromBufferAttribute(p, k).sub(c).multiplyScalar(r).add(c); p.setXYZ(k, v.x, v.y, v.z); } }
  // zamknij koniec małą kulką
  g.computeVertexNormals(); return g;
}
function M(g, m, x, y, z, sx = 1, sy = 1, sz = 1) { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; return o; }
const SPH = new THREE.SphereGeometry(1, 18, 12);

async function buildModern(look) {
  const fem = look.body !== 'm', G = fem ? 'Female' : 'Male';
  const hs = look.hairStyle || (fem ? 'long' : 'parted'), capName = HAIR_CAP[hs];
  const beard = fem ? 'none' : (look.beard === true ? 'full' : look.beard || 'none');
  const spec = specFromLook(look, fem);
  const acc = look.acc || {};
  const kinds = ['outfit', 'head'], urls = [A + `stroje/${G}_Peasant.gltf`, A + `baza/Superhero_${G}_FullBody.gltf`];
  if (capName) { kinds.push('hair'); urls.push(A + `fryzury/${capName}.gltf`); }
  if (beard === 'full' || beard === 'stubble') { kinds.push('beard'); urls.push(A + 'fryzury/Hair_Beard.gltf'); }
  const gltfs = await Promise.all(urls.map(loadGltf));

  const root = new THREE.Group();
  const scenes = gltfs.map(g => SkeletonUtils.clone(g.scene));
  scenes.forEach(s => root.add(s));
  let master = null; scenes[0].traverse(o => { if (o.isSkinnedMesh && !master) master = o.skeleton; });
  const byName = new Map(master.bones.map(b => [b.name, b]));
  const outfit = []; let headMesh = null, eyesMesh = null, browMesh = null; const capMeshes = [], beardMeshes = [];
  scenes.forEach((s, si) => s.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    const mn = (o.material && o.material.name) || '', kind = kinds[si];
    if (o.isSkinnedMesh && si > 0) { const bones = o.skeleton.bones.map(b => byName.get(b.name) || b); o.bind(new THREE.Skeleton(bones, o.skeleton.boneInverses), o.bindMatrix); }
    if (kind === 'outfit') outfit.push(o);
    else if (kind === 'head') {
      if (/Superhero/i.test(mn) || /Superhero/i.test(o.name)) { keepHeadOnly(o, ['Head', 'neck_01']); tint(o, look.skin || '#f0c9aa'); headMesh = o; }
      else if (/Eyes/i.test(mn)) { tint(o, look.eyes || '#5a3a22'); eyesMesh = o; }
      else if (/Hair/i.test(mn)) { tint(o, look.browColor || look.hair || '#5a3a22'); browMesh = o; }
    } else if (kind === 'hair') { tint(o, look.hair || '#5a3a22'); capMeshes.push(o); }
    else if (kind === 'beard') { tint(o, look.hair || '#5a3a22'); beardMeshes.push(o); }
  }));
  // skala do wzrostu
  root.updateMatrixWorld(true);
  const head = byName.get('Head'), wp = n => byName.get(n).getWorldPosition(new THREE.Vector3());
  const rawH = (head.getWorldPosition(new THREE.Vector3()).y - Math.min(0, wp('foot_l').y)) + 0.16;
  const s = (TARGET_HEIGHT * (look.age === 'senior' ? 0.97 : 1) * (look.height || 1)) / rawH;
  const buildMul = look.build === 'slim' ? [0.90, 0.91] : look.build === 'curvy' ? [1.14, 1.12] : [1.0, 1.0];
  root.scale.set(s * buildMul[0], s, s * buildMul[1]); root.updateMatrixWorld(true);

  // ---- pomiary ciała w pozie spoczynkowej ----
  const C = { sx: wp('upperarm_l').x, ex: wp('lowerarm_l').x, wx: wp('hand_l').x, armY: wp('upperarm_l').y, neckY: wp('neck_01').y, waistY: wp('spine_01').y, pelvisY: wp('pelvis').y, chestY: wp('spine_03').y };
  const hp = worldPts(headMesh), hb = new THREE.Box3().setFromPoints(hp);
  const T = hb.max.y, Bz = hb.min.z, Fz = hb.max.z, W = hb.max.x;
  const ep = eyesMesh ? worldPts(eyesMesh) : [];
  const eyeL = new THREE.Vector3(), eyeR = new THREE.Vector3(); let nl = 0, nr = 0, eyeZ = 0.07;
  for (const v of ep) { if (v.x > 0) { eyeL.add(v); nl++; } else { eyeR.add(v); nr++; } eyeZ = Math.max(eyeZ, v.z); }
  if (nl) eyeL.divideScalar(nl); else eyeL.set(0.03, 1.685, 0.06); if (nr) eyeR.divideScalar(nr); else eyeR.set(-0.03, 1.685, 0.06);
  const E = (eyeL.y + eyeR.y) / 2;
  // profil twarzy: najbardziej wysunięte punkty przy osi symetrii
  const prof = y0 => { let z = -1; for (const v of hp) if (Math.abs(v.x) < 0.014 && Math.abs(v.y - y0) < 0.006) z = Math.max(z, v.z); return z > -1 ? z : 0.09; };

  // ---- kolory ----
  const skinTex = headMesh && (Array.isArray(headMesh.material) ? headMesh.material[0] : headMesh.material).map;
  // tekstura głowy jest już opalona – dzielimy przez jej średni kolor, żeby twarz miała dokładnie wybrany odcień
  const skinC = col(look.skin || '#f0c9aa'), av = avgTex(skinTex);
  if (headMesh) { const hm = Array.isArray(headMesh.material) ? headMesh.material : [headMesh.material]; hm.forEach(m => m.color.setRGB(Math.min(2.4, skinC.r / Math.max(0.05, av.r)), Math.min(2.4, skinC.g / Math.max(0.05, av.g)), Math.min(2.4, skinC.b / Math.max(0.05, av.b)))); }
  const refHair = (capMeshes[0] || browMesh); const refMat = refHair && (Array.isArray(refHair.material) ? refHair.material[0] : refHair.material);
  const hairC = col(look.hair || '#5a3a22').multiply(avgTex(refMat && refMat.map));
  const skinMat = new THREE.MeshStandardMaterial({ color: skinC, roughness: 0.62 });
  const top = look.top || '#2f6fe4', inner = look.inner || '#f4f4f4', bottom = look.bottom || '#2f4f7f', shoes = look.shoes || '#1f1f24';
  const legsSkin = !!spec.skirt, tights = look.tights;
  const belt = col(['#3a2a1e', '#1c1c1c', '#6b4428'][((look.seed || 0) >>> 3) % 3]);
  const sole = col(shoes === '#f4f4f4' ? '#e8e4dc' : (look.seed || 0) % 2 ? '#2a2420' : '#efefe9');

  // ---- region ubrania dla wierzchołka ----
  const bodyMin = {}; for (const m of outfit) { const pts = worldPts(m); bodyMin[m.name] = pts.reduce((a, v) => Math.min(a, v.y), 9); }
  const torsoMin = Math.min(...outfit.filter(m => /Body/.test(m.name)).map(m => bodyMin[m.name]).concat([C.waistY - 0.05]));
  const tuckY = C.waistY - 0.035;
  function region(part, p, bone) {
    if (bone.startsWith('hand')) return 'skin';
    const ax = Math.abs(p.x), y = p.y, z = p.z;
    if (part === 'feet') {
      if (y < 0.022) return sole;
      if (y < 0.125) return col(shoes);
      if (look.boots || look.shoeStyle === 'boots') return y < 0.135 ? shade(shoes, -0.3) : col(shoes);
      if (spec.shorts) return 'skin';
      return legsSkin ? (tights ? col(tights) : y < 0.2 ? col(shoes) : shade(shoes, -0.08)) : col(bottom); // pod spódnicą: wysokie kozaki
    }
    if (part === 'legs') {
      if (spec.shorts) return y > C.pelvisY - 0.28 ? col(bottom) : 'skin';
      return legsSkin ? (tights ? col(tights) : 'skin') : col(bottom);
    }
    // ręce (T‑poza: ramię leży wzdłuż osi X)
    if (ax > C.sx + 0.015 && y > C.armY - 0.13) {
      const sc = spec.sleeveInner ? inner : top;
      switch (spec.sleeve) {
        case 'none': return ax > C.sx + 0.03 ? 'skin' : col(sc);
        case 'short': return ax > C.sx + 0.11 ? 'skin' : ax > C.sx + 0.095 ? shade(sc, -0.12) : col(sc);
        case 'rolled': return ax > C.ex + 0.045 ? 'skin' : ax > C.ex - 0.005 ? shade(sc, 0.18) : col(sc);
        default: return spec.cuffs && ax > C.wx - 0.045 ? shade(sc, -0.15) : col(sc);
      }
    }
    // tułów
    if (spec.neck === 'v' && z > 0 && y > C.neckY - 0.11 + ax * 1.4) return 'skin';
    if (spec.neck === 'round' && z > 0.01 && y > C.neckY - 0.05 + ax * 0.6) return 'skin';
    if (spec.tuck && y < tuckY) return col(spec.skirt ? bottom : bottom);
    if (spec.belt && y < tuckY + 0.03) return belt;
    if (spec.dress && spec.sash && y < C.waistY + 0.02 && y > C.waistY - 0.03) return shade(top, -0.3);
    if (spec.open && z > 0.02) {
      const w = spec.open === 'vest' ? 0.05 + Math.max(0, y - 1.2) * 0.3 : 0.032 + Math.max(0, y - 1.16) * 0.26;
      if (ax < w) return col(inner);
      if (spec.open !== 'vest' && ax < w + 0.016 && y > 1.27) return shade(top, -0.22);
      if (spec.open === 'blazer' && ax < w + 0.05 && Math.abs(y - (C.waistY + 0.04)) < 0.008) return shade(top, -0.3); // kieszeń
    }
    if (spec.placket && z > 0.04 && ax < 0.008) return shade(top, -0.15);
    if (spec.hem && y < torsoMin + 0.045) return shade(top, -0.16);
    if (spec.pocket && z > 0.04 && ax < 0.09 && y > torsoMin + 0.06 && y < torsoMin + 0.17) return shade(top, -0.1);
    return col(top);
  }
  for (const m of outfit) {
    const part = /Feet/.test(m.name) ? 'feet' : /Legs/.test(m.name) ? 'legs' : 'body';
    const old = Array.isArray(m.material) ? m.material[0] : m.material;
    const pat = part === 'legs' ? look.bottomPattern : part === 'feet' ? null : look.topPattern || look.pattern;
    const cm = new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, map: patTex(pat), normalMap: old.normalMap || null, roughness: pat === 'denim' ? 0.95 : part === 'feet' ? 0.5 : 0.85 });
    recolor(m, (p, b) => region(part, p, b), cm, skinMat);
  }
  // zarost / broda
  for (const b of beardMeshes) { const mm = Array.isArray(b.material) ? b.material : [b.material]; mm.forEach(x => { if (beard === 'stubble') { x.transparent = true; x.opacity = 0.42; x.depthWrite = false; } }); }

  // ---- doczepiane części ----
  const attach = (bone, obj) => { root.updateMatrixWorld(true); byName.get(bone).attach(obj); };
  const hairM = new THREE.MeshStandardMaterial({ color: hairC.clone().multiplyScalar(1.15), roughness: 0.78, map: hairTex(), side: THREE.DoubleSide });
  const hairMv = hairM.clone(); hairMv.map = hairTex().clone(); hairMv.map.rotation = Math.PI / 2; hairMv.map.needsUpdate = true;
  const H = new THREE.Group(); // wszystko na głowie, w układzie świata z pozy spoczynkowej
  const cz = (Fz + Bz) / 2 - 0.005;
  if (hs === 'ponytail' || hs === 'ponytail_bangs') {
    const tieY = T - 0.035, tieZ = Bz + 0.03;
    H.add(new THREE.Mesh(taperTube([V(0, tieY, tieZ), V(0, T + 0.005, Bz - 0.035), V(0, T - 0.07, Bz - 0.085), V(0, E - 0.1, Bz - 0.075), V(0.005, E - 0.23, Bz - 0.045)], 0.034, 0.008, 30, 12), hairMv));
    H.add(M(SPH, new THREE.MeshStandardMaterial({ color: ['#e5534b', '#2b2f36', '#f2c14e', '#ec6fb4'][(look.seed || 0) % 4], roughness: 0.6 }), 0, tieY + 0.004, tieZ - 0.012, 0.026, 0.024, 0.02));
  }
  if (hs === 'waves') { // fale do ramion (wyraźne falowane pasma z tyłu i po bokach)
    for (let i = -3; i <= 3; i++) {
      const x = i * 0.028, side = Math.abs(i) >= 2 ? 0.015 : 0, z0 = Bz + 0.035 + side;
      H.add(new THREE.Mesh(taperTube([
        V(x * 0.85, T - 0.02, z0),
        V(x * 1.15, E - 0.02, z0 - 0.02),
        V(x * 1.25 + (i % 2 ? 0.014 : -0.014), E - 0.13, z0 - 0.035),
        V(x * 1.18, E - 0.22, z0 - 0.015),
      ], 0.032, 0.018, 18, 8), hairMv));
    }
  }
  if (hs === 'afro') { // kręcone afro / loki (kopuła z gęstych loków 3D)
    const cy = E + 0.065;
    H.add(M(SPH, hairM, 0, cy, cz - 0.012, W + 0.065, 0.135, 0.14));
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, elev = (i % 3) * 0.045;
      H.add(M(SPH, hairM, Math.cos(a) * (W + 0.042), cy - 0.02 + elev, cz - 0.01 + Math.sin(a) * 0.095, 0.046, 0.046, 0.046));
    }
  }
  if (hs === 'messy') { // rozczochrane (dynamiczne kosmyki 3D na czubku i bokach)
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2;
      const sx = Math.cos(a) * 0.055, sz = cz + Math.sin(a) * 0.065;
      const sp = M(SPH, hairM, sx, T - 0.005 + (i % 3) * 0.012, sz, 0.026, 0.055, 0.028);
      sp.rotation.set(Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55);
      H.add(sp);
    }
  }
  if (hs === 'bun') {
    H.add(M(SPH, hairM, 0, T - 0.045, Bz - 0.015, 0.052, 0.046, 0.044));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 20), hairMv); ring.position.set(0, T - 0.045, Bz + 0.005); ring.scale.set(1, 0.9, 1); H.add(ring);
    H.add(M(SPH, hairM, 0.03, T - 0.075, Bz + 0.02, 0.02, 0.03, 0.02)); // pasmo spinające
  }
  if (hs === 'bob' || hs === 'wavy') {
    const bob = hs === 'bob', top0 = T - 0.035, bot = bob ? E - 0.115 : E - 0.07, r0 = W + (bob ? 0.012 : 0.008);
    const prof2 = bob ? [[r0 - 0.01, top0 + 0.012], [r0, top0 - 0.01], [r0 + 0.01, E + 0.02], [r0 + 0.014, E - 0.05], [r0 + 0.008, bot + 0.012], [r0 - 0.008, bot]]
      : [[r0 - 0.01, top0 + 0.01], [r0, top0 - 0.01], [r0 + 0.006, E], [r0 + 0.008, bot + 0.02], [r0 - 0.004, bot]];
    const gap = bob ? 0.82 : 1.05;
    const g = new THREE.LatheGeometry(prof2.map(([r, y]) => new THREE.Vector2(r, y)), 40, gap, Math.PI * 2 - gap * 2);
    const zs = ((Fz - Bz) / 2 + 0.02) / (r0 + 0.01);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(x, z), w = (bob ? 0.003 : 0.006) * Math.sin(a * (bob ? 14 : 9) + y * 40); const rr = 1 + w / Math.max(0.05, Math.hypot(x, z)); p.setXYZ(i, x * rr, y, z * rr * zs + cz); }
    g.computeVertexNormals(); H.add(new THREE.Mesh(g, hairM));
    if (bob) { const fr = M(SPH, hairM, 0.022, T - 0.045, prof(T - 0.05) + 0.004, 0.06, 0.022, 0.026); fr.rotation.z = -0.35; H.add(fr); }
  }
  if (hs === 'fringe' || hs === 'ponytail_bangs') { // grzywka: wycinek skorupy nad czołem z postrzępionym dolnym brzegiem
    const fy = E + 0.004, ry = T - fy + 0.01, rx = W + 0.012, rz = prof(E + 0.05) - cz + 0.016;
    const g = new THREE.SphereGeometry(1, 22, 8, Math.PI / 2 - 1.0, 2.0, 0.18, 0.78), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), th = Math.acos(Math.max(-1, Math.min(1, y)));
      const edge = th > 0.9 ? (0.012 * (0.5 + 0.5 * Math.sin(Math.atan2(x, z) * 22))) : 0;
      p.setXYZ(i, x * rx, y * ry + fy - edge, z * rz + cz + (th > 0.7 ? 0.004 : 0)); }
    g.computeVertexNormals(); H.add(new THREE.Mesh(g, hairM));
  }
  if (hs === 'long') { // pasma opadające na plecy, dłuższe niż sam model
    for (let i = -3; i <= 3; i++) { const x = i * 0.026, z0 = Bz + 0.03 - Math.abs(i) * 0.004;
      H.add(new THREE.Mesh(taperTube([V(x * 0.9, E + 0.03, z0), V(x * 1.15, E - 0.08, z0 - 0.03), V(x * 1.25, E - 0.22, z0 - 0.045 + Math.abs(i) * 0.005), V(x * 1.3, E - 0.34, z0 - 0.035)], 0.03, 0.016, 16, 8), hairMv)); }
  }
  // twarz
  const mouthY = E - 0.08, mz = prof(mouthY);
  if (fem && look.lips) {
    const lm = new THREE.MeshStandardMaterial({ color: look.lips, roughness: 0.35 });
    H.add(M(SPH, lm, 0, mouthY + 0.0045, mz + 0.001, 0.02, 0.0045, 0.006), M(SPH, lm, 0, mouthY - 0.0035, mz, 0.018, 0.0055, 0.006));
    const lash = new THREE.MeshStandardMaterial({ color: '#1a1412', roughness: 0.8 });
    for (const e of [eyeL, eyeR]) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.0165, 0.0022, 4, 12, Math.PI * 0.9), lash); l.position.set(e.x, e.y - 0.002, eyeZ - 0.004); l.rotation.z = Math.PI * 0.05; l.scale.set(1, 0.95, 1); H.add(l); }
  } else {
    const lm = new THREE.MeshStandardMaterial({ color: col(look.skin || '#e8b894').multiplyScalar(0.72), roughness: 0.5 });
    H.add(M(SPH, lm, 0, mouthY, mz - 0.001, 0.019, 0.0045, 0.006));
  }
  if (beard === 'mustache' || beard === 'goatee') {
    const by = mouthY + 0.014, bz = prof(by) + 0.002;
    for (const sx of [-1, 1]) { const m = M(SPH, hairM, sx * 0.014, by, bz, 0.018, 0.0065, 0.009); m.rotation.z = sx * -0.28; H.add(m); }
    if (beard === 'goatee') H.add(M(SPH, hairM, 0, mouthY - 0.03, prof(mouthY - 0.03) - 0.002, 0.018, 0.024, 0.012));
  }
  if (acc.earrings) { const gm = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.25 }); for (const sx of [-1, 1]) H.add(M(SPH, gm, sx * (W - 0.006), E - 0.05, -0.006, 0.0065, 0.0065, 0.0065)); }
  if (acc.glasses && acc.glasses !== 'none') {
    const sun = acc.glasses === 'sun', sq = acc.glasses === 'square';
    const fm = new THREE.MeshStandardMaterial({ color: sun ? '#1c1c1c' : ['#2b2f36', '#6b4428', '#b8bec6', '#8a2e3b'][(look.seed || 0) % 4], metalness: sq ? 0.2 : 0.5, roughness: 0.35 });
    const lz = eyeZ + 0.03, rr = sq ? 0.026 : 0.023;
    for (const e of [eyeL, eyeR]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.0026, 6, sq ? 4 : 20), fm); ring.position.set(e.x * 1.05, e.y, lz); if (sq) { ring.rotation.z = Math.PI / 4; ring.scale.set(1.15, 0.8, 1); } H.add(ring);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(rr * (sq ? 0.95 : 0.98), sq ? 4 : 20), new THREE.MeshStandardMaterial({ color: sun ? '#101418' : '#dfe9f0', transparent: true, opacity: sun ? 0.88 : 0.16, roughness: 0.05, metalness: 0.3 }));
      lens.position.copy(ring.position); if (sq) { lens.rotation.z = Math.PI / 4; lens.scale.set(1.15, 0.8, 1); } H.add(lens);
      const sx = Math.sign(e.x), a = V(e.x * 1.05 + sx * rr * (sq ? 1.12 : 1), e.y + 0.002, lz - 0.003), b = V(sx * (W - 0.002), e.y + 0.006, -0.012);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.004, a.distanceTo(b)), fm); arm.position.copy(a).add(b).multiplyScalar(0.5); arm.lookAt(b); H.add(arm);
    }
    const br = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(eyeL.x - eyeR.x) * 1.05 - rr * 2, 0.003, 0.003), fm); br.position.set(0, E + 0.004, lz); H.add(br);
  }
  H.traverse(o => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
  attach('Head', H);
  // Opcjonalne modularne modele .glb z ./models/characters/ (jeśli obecne, automatycznie dopasowane skalą)
  if (acc.glasses && acc.glasses !== 'none') {
    tryLoadCharGlb('glasses.glb').then(sc => {
      if (!sc) return;
      const m = sc.clone(true), b = new THREE.Box3().setFromObject(m), sz = b.getSize(new THREE.Vector3());
      const scf = sz.x > 0.001 ? 0.14 / sz.x : 1; m.scale.setScalar(scf);
      m.position.set(0, E, eyeZ + 0.025); attach('Head', m);
    });
  }

  // ---- tułów: kaptur, sznurki, plecak ----
  const front = 0.125 + (fem ? 0.01 : 0), back = fem ? -0.13 : -0.15;
  if (spec.hood) {
    const hm = new THREE.MeshStandardMaterial({ color: shade(top, -0.06), roughness: 0.9, side: THREE.DoubleSide });
    const hood = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), hm); hood.position.set(0, C.neckY - 0.035, back + 0.02); hood.scale.set(0.12, 0.07, 0.085); hood.rotation.x = -0.5; hood.castShadow = true;
    const ch = new THREE.Group(); ch.add(hood);
    const sm = new THREE.MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.7 });
    for (const sx of [-1, 1]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.11, 5), sm); st.position.set(sx * 0.03, C.neckY - 0.12, front + 0.012); ch.add(st); ch.add(M(SPH, sm, sx * 0.03, C.neckY - 0.18, front + 0.012, 0.006, 0.009, 0.006)); }
    attach('spine_03', ch);
  }
  if (acc.bag === 'backpack') {
    const c = ['#2b2f36', '#e5534b', '#2f6fe4', '#39a06a', '#c9853f', '#7b4bd6'][(look.seed || 0) % 6], bm = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }), dm = new THREE.MeshStandardMaterial({ color: '#1f1f1f', roughness: 0.8 });
    const bp = new THREE.Group(), by = C.chestY - 0.03, bz = back - 0.075;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.13), bm); body.position.set(0, by, bz); bp.add(body);
    const pk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.05), bm); pk.position.set(0, by - 0.09, bz - 0.085); bp.add(pk);
    const lid = M(SPH, bm, 0, by + 0.18, bz, 0.14, 0.04, 0.065); bp.add(lid);
    for (const sx of [-1, 1]) {
      const over = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, front - back + 0.02), dm); over.position.set(sx * 0.085, C.armY + 0.045, (front + back) / 2); bp.add(over);
      const fs = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.014), dm); fs.position.set(sx * 0.088, C.armY - 0.08, front + 0.006); fs.rotation.x = 0.08; bp.add(fs);
    }
    bp.traverse(o => { if (o.isMesh) o.castShadow = true; });
    attach('spine_03', bp);
  }
  // ---- spódnica / dół sukienki ----
  if (spec.skirt) {
    const k = spec.skirt, sc = spec.dress ? top : bottom, top0 = C.waistY + 0.015, hem = k.hem;
    const pr = [[0.15, top0], [0.178, top0 - 0.07], [0.212, C.pelvisY - 0.04], [0.235 + k.flare * 0.04, C.pelvisY - 0.2], [0.25 + k.flare * 0.11, hem + 0.02], [0.247 + k.flare * 0.11, hem]];
    const g = new THREE.LatheGeometry(pr.map(([r, y]) => new THREE.Vector2(r, y)), 36);
    const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(x, z), fold = 1 + (k.flare ? 0.035 * Math.sin(a * 12) * Math.min(1, (top0 - y) / 0.4) : 0); p.setXYZ(i, x * fold, y, z * fold * 0.86 - 0.025); }
    g.computeVertexNormals();
    const pat = spec.dress ? (look.topPattern || look.pattern) : 'plain';
    const t = patTex(pat), sm = new THREE.MeshStandardMaterial({ color: col(sc), map: t, roughness: 0.85, side: THREE.DoubleSide });
    const sk = new THREE.Mesh(g, sm); sk.castShadow = true; sk.receiveShadow = true;
    const grp = new THREE.Group(); grp.add(sk);
    if (spec.dress && spec.sash) { const band = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.152, 0.03, 36, 1, true), new THREE.MeshStandardMaterial({ color: shade(top, -0.3), roughness: 0.6, side: THREE.DoubleSide })); band.scale.set(1, 1, 0.86); band.position.set(0, top0, -0.025); grp.add(band); }
    attach('pelvis', grp);
  }
  // ---- zegarek ----
  if (acc.watch) {
    const wg = new THREE.Group(), x = C.wx - 0.04, y = wp('hand_l').y, z = wp('hand_l').z;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.0075, 6, 16), new THREE.MeshStandardMaterial({ color: acc.watch, roughness: 0.4, metalness: /c9a227|b8bec6/.test(acc.watch) ? 0.8 : 0.1 }));
    band.rotation.y = Math.PI / 2; band.position.set(x, y, z); band.scale.set(1, 0.85, 1); wg.add(band);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.008, 16), new THREE.MeshStandardMaterial({ color: '#f2f2f2', metalness: 0.6, roughness: 0.2 })); face.position.set(x, y + 0.03, z); wg.add(face);
    attach('lowerarm_l', wg);
  }
  // ---- torebka w ręce (w T‑pozie "pod dłonią" znaczy "dalej wzdłuż ręki") ----
  if (acc.bag === 'handbag') {
    const c = ['#8a2e3b', '#2b2f36', '#c9a27a', '#6b4428', '#e86f9a', '#f2f2f2'][(look.seed || 0) % 6];
    const g = new THREE.Group(), bm = new THREE.MeshStandardMaterial({ color: c, roughness: 0.45 });
    const bb = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.17, 0.24), bm); bb.position.y = -0.17; g.add(bb);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.245), new THREE.MeshStandardMaterial({ color: shade(c, -0.2), roughness: 0.4 })); flap.position.y = -0.11; g.add(flap);
    const clasp = M(SPH, new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.25 }), 0.042, -0.12, 0, 0.008, 0.008, 0.008); g.add(clasp);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.007, 6, 16, Math.PI), bm); handle.rotation.y = Math.PI / 2; handle.position.y = -0.085; g.add(handle);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const hpR = wp('hand_r'); g.position.set(hpR.x - 0.02, hpR.y, hpR.z); g.rotation.z = -Math.PI / 2;
    attach('hand_r', g);
  }
  const pelvisY = byName.get('pelvis').getWorldPosition(new THREE.Vector3()).y;
  const rest = new Map(master.bones.map(b => [b, b.quaternion.clone()]));
  return { root, master: scenes[0], bones: byName, head, pelvisY, rest, scale: s, mixer: null, current: null };
}
