// Osiedle wokół domu: ulica, chodniki, latarnie, działki sąsiadów, park,
// domy na sprzedaż i sąsiedzi, którzy żyją własnym życiem.
// Modele: Kenney "City Kit (Suburban)" i "Nature Kit" (CC0).
//
// Układ współrzędnych "osiedla" (H): działki północne z = 0..14, chodnik z = 14..16,
// jezdnia z = 16..22, chodnik z = 22..24, działki południowe z = 24..38 (obrócone frontem do ulicy).
// Świat gry = układ działki, na której mieszkamy; grupa osiedla jest przesuwana tak,
// żeby nasza działka zawsze leżała w (0..20, 0..14).
import * as THREE from 'three';
import * as BUD from './budowa.js';
import * as DET from './detale.js';
import * as WG from './wyglad.js';
import * as SK from './skradanie.js';
// stały wygląd sąsiada: losowanie z ziarna = id + ręczne poprawki pasujące do charakteru
const NL = (id, base, over = {}, acc = {}) => { const L = WG.generateLook(WG.hashStr('sasiad:' + id), base); return { ...L, ...over, acc: { ...L.acc, ...acc } }; };

const HD = 'assets/osiedle/domy/', NA = 'assets/osiedle/natura/';
const W = BUD.LOT_W, D = BUD.LOT_D, EXIT = BUD.EXIT;
const ZN = 15, ZS = 23;                 // środki chodników
const ZEBRAS = [-3, 23, 49, -29];       // przejścia dla pieszych

// ---------- działki ----------
export const SLOTS = {
  start: ['N', 0], town: ['N', 26], villa: ['S', 0],      // domy, które można kupić
  hania: ['N', -26], marek: ['S', -26], ola: ['S', 26],   // sąsiedzi
  f1: ['N', 52], f2: ['N', -52], f3: ['S', -52],           // dalsze domy (f3 = stary alias działki rezydencji)
  classic: ['S', -52],                                      // Klasyczna Rezydencja (na sprzedaż)
  park: ['S', 52],
};
const HOUSE_SLOTS = ['start', 'town', 'classic', 'villa'];
const MAT = {};
for (const [k, [side, x]] of Object.entries(SLOTS)) {
  const m = new THREE.Matrix4();
  if (side === 'N') m.makeTranslation(x, 0, 0); else { m.makeRotationY(Math.PI); m.setPosition(x + W, 0, 38); }
  MAT[k] = m;
}
const MAT_INV = {}; for (const k of Object.keys(MAT)) MAT_INV[k] = MAT[k].clone().invert();
const L2H = (slot, x, z) => new THREE.Vector3(x, 0, z).applyMatrix4(MAT[slot]);
const gateX = slot => HOUSE_SLOTS.includes(slot) ? EXIT.x + 0.5 : 10;

// ---------- sąsiedzi ----------
export const NEIGHBOURS = [
  { id: 'hania', traits: ['towarzyski', 'zlosliwy'], name: 'Pani Krystyna', e: '📏', slot: 'hania', hobby: 'garden', age: 'senior', interest: ['ogrodnictwo 🌷', null], desc: 'Przewodnicząca Rady Osiedla. Mierzy sąsiadom trawę linijką.',
    look: NL('hania', { body: 'f', age: 'senior' }, { hairStyle: 'bun', hair: '#dcd6cc', skin: '#f0c9aa', outfitType: 'sweater', top: '#c9a6e8', pattern: 'knit', bottom: '#6b6f5a', bottomPattern: 'plain', shoes: '#6b4428', lips: '#b86a72' }, { glasses: 'round', bag: 'handbag', earrings: true, watch: '#c9a227' }) },
  { id: 'marek', traits: ['ambitny', 'romantyczny'], name: 'Pan Marek', e: '🧘', slot: 'marek', hobby: 'jog', interest: ['sport 🏋️', 'sprawnosc'], desc: 'Tajemniczy milioner, guru biznesu i medytacji. Unika listonosza.',
    look: NL('marek', { body: 'm' }, { hairStyle: 'buzz', hair: '#1d1510', skin: '#9a6644', beard: 'stubble', outfitType: 'hoodie', top: '#e5534b', pattern: 'plain', bottom: '#1f1f24', bottomPattern: 'plain', shoes: '#f4f4f4' }, { glasses: 'none', bag: 'none', watch: '#1f1f24' }) },
  { id: 'zosia', traits: ['romantyczny', 'ambitny'], name: 'Beata', e: '📸', slot: 'ola', hobby: 'walk', partner: 'kuba', interest: ['sztuka 🎨', 'malarstwo'], desc: 'Influencerka. Królowa luksusu – przynajmniej w kadrze.',
    look: NL('zosia', { body: 'f' }, { hairStyle: 'long', hair: '#e3b65c', skin: '#f3cfb3', outfitType: 'dress_fit', top: '#f2a7c3', pattern: 'plain', shoes: '#f4f4f4', tights: null, lips: '#d4466a' }, { glasses: 'sun', bag: 'handbag', earrings: true }) },
  { id: 'kuba', traits: ['rodzinny', 'towarzyski'], name: 'Kuba', e: '🎸', slot: 'ola', hobby: 'walk', partner: 'zosia', interest: ['muzyka 🎸', 'muzyka'], desc: 'Muzyk, mąż Beaty. Zawsze ma dobry humor (zwłaszcza na pokaz).',
    look: NL('kuba', { body: 'm' }, { hairStyle: 'wavy', hair: '#5a3a22', skin: '#e8b894', beard: 'full', outfitType: 'tee_jacket', top: '#3b5f9a', topPattern: 'denim', inner: '#2b2f36', bottom: '#1f1f24', bottomPattern: 'plain', shoes: '#6b4428' }, { glasses: 'none', bag: 'none', watch: '#6b4428' }) },
  { id: 'natalia', traits: ['romantyczny', 'towarzyski'], name: 'Natalia', e: '🍳', slot: 'f1', hobby: 'walk', interest: ['gotowanie 🍳', 'gotowanie'], desc: 'Kucharka w bistro. Singielka, romantyczka.',
    look: NL('natalia', { body: 'f' }, { hairStyle: 'ponytail', hair: '#2b1a12', skin: '#c58c64', outfitType: 'skirt_blouse', top: '#f4f4f4', bottom: '#8a2e3b', shoes: '#1f1f24', lips: '#c4505a' }, { glasses: 'none', bag: 'handbag', earrings: true }) },
  { id: 'tomek', traits: ['introwertyk', 'zlosliwy'], name: 'Pan Henryk', e: '🔧', slot: 'f2', hobby: 'walk', age: 'senior', interest: ['technika 🔧', 'programowanie'], desc: 'Emerytowany konstruktor. Twierdzi, że nic nie widzi i nie słyszy.',
    look: NL('tomek', { body: 'm', age: 'senior' }, { hairStyle: 'parted', hair: '#d4cfc6', skin: '#f1c7a5', beard: 'mustache', outfitType: 'vest', top: '#e8e1d4', inner: '#e8e1d4', bottom: '#5a5f4a', bottomPattern: 'plain', shoes: '#6b4428' }, { glasses: 'square', bag: 'none', watch: '#c9a227' }) },
];

// ---------- pomocnicze ----------
const mats = {};
const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o })); };
function box(g, w, h, d, c, x, y, z, o, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o)); m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true; g.add(m); return m;
}
function cyl(g, rt, rb, h, c, x, y, z, o) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 16), mat(c, o)); m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const texL = new THREE.TextureLoader(), texCache = {};
function variationTex(v) {
  if (!texCache[v]) { const t = texL.load(HD + `Textures/variation-${v}.png`); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; texCache[v] = t; }
  return texCache[v];
}
async function put(parent, url, x, z, { s = 1, ry = 0, y = 0, tex = null, shadow = true } = {}) {
  const src = await BUD.loadModel(url); const o = src.clone(true);
  o.traverse(m => {
    if (!m.isMesh) return;
    m.castShadow = shadow; m.receiveShadow = true;
    if (tex) { m.material = m.material.clone(); m.material.map = variationTex(tex); }
    else if (m.material.metalness > 0.05 && !/tree_/.test(url)) { m.material = m.material.clone(); m.material.metalness = 0; m.material.roughness = Math.max(0.6, m.material.roughness); } // bez mapy otoczenia metal wychodzi czarny
  });
  o.position.set(x, y, z); o.rotation.y = ry; o.scale.setScalar(s); parent.add(o); return o;
}
const safe = p => p.catch(e => console.warn('Osiedle: brak modelu', e));

// lampy uliczne i okna świecą nocą
const glowMat = new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd88a', emissiveIntensity: 0.1 });

function shrub(g, x, z, r = 0.38, c = '#3f8f3a') {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat(c)); m.scale.set(1, 0.8, 1); m.position.set(x, r * 0.7, z);
  m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function mailbox(g, x, z, c) { cyl(g, 0.04, 0.04, 1, '#555', x, 0.5, z); box(g, 0.3, 0.25, 0.45, c, x, 1.05, z); }
function bench(g, x, z, ry = 0) {
  const b = new THREE.Group(); b.position.set(x, 0, z); b.rotation.y = ry; g.add(b);
  box(b, 1.6, 0.06, 0.45, '#9a6a3c', 0, 0.45, 0); box(b, 1.6, 0.35, 0.05, '#9a6a3c', 0, 0.72, -0.2);
  for (const sx of [-0.7, 0.7]) { box(b, 0.06, 0.45, 0.4, '#3a3f47', sx, 0.22, 0); box(b, 0.06, 0.35, 0.05, '#3a3f47', sx, 0.62, -0.22); }
}
function streetLamp(g, x, z, ry) {
  const l = new THREE.Group(); l.position.set(x, 0, z); l.rotation.y = ry; g.add(l);
  cyl(l, 0.06, 0.09, 4.2, '#3a3f47', 0, 2.1, 0); box(l, 0.08, 0.08, 0.9, '#3a3f47', 0, 4.15, 0.42);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.5), glowMat); head.position.set(0, 4.06, 0.8); l.add(head);
  box(l, 0.42, 0.06, 0.58, '#3a3f47', 0, 4.15, 0.8);
}
function forSaleSign(g, x, z, h) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 160; const x2 = c.getContext('2d');
  x2.fillStyle = '#fff'; x2.fillRect(0, 0, 256, 160); x2.fillStyle = '#d9342b'; x2.fillRect(0, 0, 256, 54);
  x2.fillStyle = '#fff'; x2.font = 'bold 34px sans-serif'; x2.textAlign = 'center'; x2.fillText('NA SPRZEDAŻ', 128, 40);
  const nm = h.short || h.name; let fs = 26; x2.fillStyle = '#1f2d3d'; x2.font = `bold ${fs}px sans-serif`; while (x2.measureText(nm).width > 244 && fs > 13) x2.font = `bold ${--fs}px sans-serif`; x2.fillText(nm, 128, 94);
  x2.fillStyle = '#2b8a4b'; x2.font = 'bold 32px sans-serif'; x2.fillText(h.price.toLocaleString('pl-PL') + ' zł', 128, 140);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Group(); s.position.set(x, 0, z); g.add(s);
  box(s, 0.08, 1.6, 0.08, '#6b4a2b', -0.55, 0.8, 0); box(s, 0.08, 1.6, 0.08, '#6b4a2b', 0.55, 0.8, 0);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.05), [mat('#eee'), mat('#eee'), mat('#eee'), mat('#eee'), new THREE.MeshStandardMaterial({ map: t }), new THREE.MeshStandardMaterial({ map: t })]);
  board.position.y = 1.25; board.castShadow = true; s.add(board);
}

// ---------- elementy działek ----------
const whiteFence = new THREE.MeshStandardMaterial({ color: '#f7f5ef', roughness: 0.6 });
function frontFence(g, gx, gap = 1.1, gaps = [], white = false) {
  const jobs = [], all = [[gx, gap], ...gaps];
  for (let x = 0.96; x < W; x += 1.92) if (all.every(([c, w]) => Math.abs(x - c) > w + 0.6)) jobs.push(put(g, HD + 'fence.glb', x, 14.15, { s: 4 }).then(o => { if (white) o.traverse(m => { if (m.isMesh) m.material = whiteFence; }); return o; }));
  return jobs;
}
const coneG = new THREE.ConeGeometry(1, 1, 10);
function thuja(g, x, z, h = 1.8) { const m = new THREE.Mesh(coneG, mat('#2f6f3a')); m.scale.set(h * 0.28, h, h * 0.28); m.position.set(x, h / 2, z); m.castShadow = true; g.add(m); }
function dmesh(g, w, h, d, m, x, y, z) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.receiveShadow = true; g.add(o); return o; }
function flowerRow(g, r, x0, x1, z, skip) {
  const F = ['flower_redA', 'flower_yellowA', 'flower_purpleA', 'flower_redB', 'flower_yellowB'], jobs = [];
  for (let x = x0; x <= x1; x += 0.55) if (!skip || Math.abs(x - skip) > 1) jobs.push(put(g, NA + F[Math.floor(r() * F.length)] + '.glb', x + (r() - 0.5) * 0.2, z + (r() - 0.5) * 0.3, { s: 3 + r(), ry: r() * 6, shadow: false }));
  return jobs;
}
const FRONT = 8.0; // front domu sąsiada (oś z działki)
function neighbourLot(g, cfg) {
  const r = rng(cfg.seed), jobs = [];
  box(g, 20, 0.02, 14, cfg.lawn || '#8fcb70', 10, -0.005, 7, {}, false);
  const h = DET.buildHouse({ ...cfg.h, seed: cfg.seed }); h.group.position.set(10, 0, FRONT); g.add(h.group); g.userData.porchZ = FRONT + (h.porchFront || 1.6);
  const pw = Math.min(5.2, h.w * 0.58), side = cfg.h.left ? -1 : 1;
  // ścieżka z płyt od schodków do furtki
  for (let z = FRONT + h.porchFront + 0.3; z < 14.1; z += 0.72) dmesh(g, 1.25, 0.05, 0.6, DET.M('paver'), 10, 0.025, z);
  // podjazd do garażu (albo miejsce parkingowe przy wykuszu)
  const dx = h.garageX != null ? 10 + h.garageX : 10 + side * (h.w / 2 + 2.3), dz0 = h.garageX != null ? FRONT + h.garageZ : FRONT - 3;
  dmesh(g, 3.5, 0.04, 14.1 - dz0, DET.M('stone', '#c4bfb6'), dx, 0.02, (dz0 + 14.1) / 2);
  jobs.push(...frontFence(g, 10, 1.1, [[dx, 1.9]]));
  // rabaty: kwiaty, krzewy kuliste i tuje przy ścianach
  const bx0 = 10 - h.w / 2 + 0.3, bx1 = 10 + h.w / 2 - 0.3, px0 = 10 - pw / 2 - 0.3, px1 = 10 + pw / 2 + 0.3;
  jobs.push(...flowerRow(g, r, bx0 + 0.6, px0 - 0.2, FRONT + 0.75), ...flowerRow(g, r, px1 + 0.2, bx1 - 0.6, FRONT + 0.75));
  for (const x of [bx0, px0, px1, bx1]) shrub(g, x, FRONT + 0.5, 0.4 + r() * 0.15, r() < 0.5 ? '#3f8f3a' : '#4fa046');
  thuja(g, 10 - side * (h.w / 2 + 0.6), FRONT + 0.4, 2.2); thuja(g, 10 - side * (h.w / 2 + 0.6), FRONT - 1.6, 2.6);
  for (const s2 of [-1, 1]) jobs.push(put(g, NA + 'flower_purpleA.glb', 10 + s2 * 0.95, FRONT + h.porchFront + 0.1, { s: 3.5, shadow: false }));
  // żywopłot po bokach (bez miejsca na podjazd)
  for (let z = 0.8; z < 13.5; z += 1.1) for (const x of [0.5, 19.5]) if (Math.abs(x - dx) > 2.2 || z < FRONT - 6) shrub(g, x, z, 0.42 + r() * 0.12, r() < 0.5 ? '#3f8f3a' : '#4a9a40');
  const T = ['tree_oak', 'tree_default', 'tree_detailed', 'tree_fat'];
  jobs.push(put(g, NA + T[Math.floor(r() * 4)] + '.glb', 10 - side * 7.5, 12, { s: 3.6 + r(), ry: r() * 6 }));
  jobs.push(put(g, NA + T[Math.floor(r() * 4)] + '.glb', 3 + r() * 14, -2.5, { s: 4.5 + r() * 1.5, ry: r() * 6 }));
  mailbox(g, 11.4, 13.6, cfg.mail || '#d9342b');
  if (cfg.bench) bench(g, 10 - side * 5.5, 11.6, Math.PI);
  return jobs;
}
function frontZ(build) { let f = 0; for (const k of Object.keys(build.floors)) { const [x, z] = k.split(':').map(Number); if (2 * x <= EXIT.x && EXIT.x < 2 * x + 2) f = Math.max(f, 2 * z + 2); } return f || 10; }
function forSaleLot(g, h, build) {
  const r = rng(h.price), jobs = [], fz = frontZ(build || h.build());
  box(g, 1.6, 0.03, D - fz + 0.1, '#cfc6b8', EXIT.x, 0, (fz + D) / 2, {}, false);  // ścieżka od frontu domu
  for (let i = 0; i < 9; i++) for (const x of [-0.5, W + 0.5]) shrub(g, x, 0.8 + i * 1.6, 0.35);
  mailbox(g, EXIT.x + 1.6, D - 0.4, '#2f6fe4');
  forSaleSign(g, EXIT.x + 3.2, D - 0.6, h);
  jobs.push(...flowerRow(g, r, 1, 5.4, 13.3), ...flowerRow(g, r, 10, 19, 13.3));
  return jobs;
}
function park(g) {
  const r = rng(77), jobs = [];
  box(g, 20, 0.02, 14, '#95d277', 10, -0.004, 7, {}, false);
  // staw
  const pond = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.06, 40), mat('#5aa6d6', { roughness: 0.15, metalness: 0.1 }));
  pond.scale.set(4.2, 1, 2.8); pond.position.set(11, 0.01, 5.5); pond.receiveShadow = true; g.add(pond);
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; jobs.push(put(g, NA + (i % 2 ? 'rock_smallA' : 'rock_smallC') + '.glb', 11 + Math.cos(a) * 4.4, 5.5 + Math.sin(a) * 3, { s: 2.6, ry: r() * 6 })); }
  for (const [x, z] of [[9, 5], [12.5, 6.4], [11.2, 4.2]]) jobs.push(put(g, NA + 'lily_large.glb', x, z, { s: 3, y: 0.03, shadow: false }));
  // alejka
  for (let z = 9.2; z < 14.2; z += 0.75) jobs.push(put(g, NA + 'path_stone.glb', 10 + (r() - 0.5) * 0.3, z, { s: 1.5, ry: r() - 0.5, shadow: false }));
  bench(g, 6.2, 9.6, Math.PI * 0.85); bench(g, 15.8, 9.6, -Math.PI * 0.85); bench(g, 11, 1.4, 0);
  streetLamp(g, 7.6, 10.5, 0.4); streetLamp(g, 14.4, 10.5, -0.4);
  const T = ['tree_oak', 'tree_default', 'tree_detailed', 'tree_fat', 'tree_pineRoundC'];
  for (const [x, z] of [[2, 2], [3.5, 11], [18, 2.5], [17.5, 12], [6, 0.5], [16, -1], [1.2, 7], [19, 7.5]]) jobs.push(put(g, NA + T[Math.floor(r() * T.length)] + '.glb', x, z, { s: 4 + r() * 1.5, ry: r() * 6 }));
  jobs.push(...flowerRow(g, r, 5, 8.6, 12.8), ...flowerRow(g, r, 11.4, 15, 12.8));
  jobs.push(put(g, NA + 'mushroom_redGroup.glb', 2.8, 3.5, { s: 3 }), put(g, NA + 'log.glb', 4, 3, { s: 3, ry: 1 }), put(g, NA + 'stump_round.glb', 15, 3.5, { s: 3 }));
  return jobs;
}
function street(g) {
  const x0 = -70, x1 = 90, len = x1 - x0, cx = (x0 + x1) / 2;
  box(g, len, 0.03, 6, '#565a61', cx, -0.004, 19, { roughness: 0.95 }, false);
  box(g, len, 0.06, 2, '#d8d2c8', cx, 0.0, ZN, {}, false); box(g, len, 0.06, 2, '#d8d2c8', cx, 0.0, ZS, {}, false);
  box(g, len, 0.12, 0.18, '#a9a49b', cx, 0.03, 16.05, {}, false); box(g, len, 0.12, 0.18, '#a9a49b', cx, 0.03, 21.95, {}, false);
  for (let x = x0; x < x1; x += 3) box(g, 1.5, 0.02, 0.16, '#f4f4f4', x, 0.015, 19, {}, false);
  for (const zx of ZEBRAS) for (let i = 0; i < 6; i++) box(g, 0.5, 0.025, 5.4, '#f7f7f7', zx - 1.25 + i * 0.5 * 1.0, 0.016, 19, {}, false);
  for (let x = x0 + 8; x < x1; x += 13) { streetLamp(g, x, 14.4, 0); streetLamp(g, x + 6.5, 23.6, Math.PI); }
  // ściana lasu za działkami
  const r = rng(5), jobs = [], P = ['tree_pineTallA', 'tree_pineRoundC', 'tree_cone', 'tree_default'];
  for (let x = x0; x < x1; x += 3.2 + r() * 2) {
    jobs.push(put(g, NA + P[Math.floor(r() * 4)] + '.glb', x, -6 - r() * 5, { s: 4.5 + r() * 2.5, ry: r() * 6 }));
    jobs.push(put(g, NA + P[Math.floor(r() * 4)] + '.glb', x + 1.5, 44 + r() * 5, { s: 4.5 + r() * 2.5, ry: r() * 6 }));
  }
  // drzewa w przerwach między działkami
  for (const gx of [-29, -3, 23, 49, 75]) for (const z of [3, 8]) {
    if (gx === -3 || gx === 23) continue; // te są przy naszym domu w grze
    jobs.push(put(g, NA + 'tree_oak.glb', gx, z, { s: 3.5 + r(), ry: r() * 6 }));
  }
  for (const gx of [-29, 49]) for (const z of [29, 34]) jobs.push(put(g, NA + 'tree_default.glb', gx, z, { s: 3.5 + r(), ry: r() * 6 })); // przy willi zamiast drzew – ogród luksusowy
  return jobs;
}

// ---------- ogród willi „Diament” (poza działką – zawsze widoczny) ----------
export const poolMat = new THREE.MeshStandardMaterial({ color: '#4fd6f0', emissive: '#28b8ff', emissiveIntensity: 0.55, roughness: 0.05, transparent: true, opacity: 0.9 });
function sportsCar(color) {
  const g = new THREE.Group(), paint = DET.M('metal', color), dark = DET.M('paint', '#16181c');
  DET.box(g, 1.95, 0.42, 4.3, paint, 0, 0.5, 0); DET.box(g, 1.85, 0.2, 1.4, paint, 0, 0.78, 1.35); DET.box(g, 1.7, 0.4, 1.9, DET.glassMat, 0, 0.9, -0.25);
  DET.box(g, 1.75, 0.08, 1.7, paint, 0, 1.12, -0.3); DET.box(g, 1.9, 0.08, 0.35, paint, 0, 0.98, -2.0);
  for (const sx of [-0.88, 0.88]) for (const sz of [-1.35, 1.35]) { const w = DET.cyl(g, 0.36, 0.28, dark, sx, 0.36, sz); w.rotation.z = Math.PI / 2; }
  for (const sx of [-0.6, 0.6]) { DET.box(g, 0.45, 0.1, 0.05, DET.lampMat, sx, 0.62, 2.16); DET.box(g, 0.5, 0.08, 0.05, DET.M('paint', '#ff2a2a'), sx, 0.66, -2.16); }
  return DET.mergeStatic(g);
}
function luxGrounds(g) {
  const jobs = [], deck = DET.M('paver'), white = DET.M('paint', '#f7f6f2'), wood = DET.M('paint', '#b48a5a'), r = rng(99);
  // taras i basen typu infinity za domem
  { const t = DET.LUXTEX.deck.clone(); t.needsUpdate = true; t.repeat.set(11, 3); t.rotation = Math.PI / 2; const dm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 });
    dmesh(g, 22, 0.12, 6.0, dm, 10, 0.06, -3.0); }
  const px = 8.5, pz = -3.3, pw = 12, pd = 3.4;
  for (const [w, d, x, z] of [[pw + 0.5, 0.25, px, pz - pd / 2], [pw + 0.5, 0.25, px, pz + pd / 2], [0.25, pd, px - pw / 2, pz], [0.25, pd, px + pw / 2, pz]]) dmesh(g, w, 0.35, d, white, x, 0.17, z);
  const water = new THREE.Mesh(new THREE.BoxGeometry(pw - 0.2, 0.06, pd - 0.2), poolMat); water.position.set(px, 0.26, pz); g.add(water);
  for (let i = 0; i < 6; i++) dmesh(g, 0.25, 0.04, 0.08, DET.ledMat, px - pw / 2 + 1 + i * 2, 0.3, pz + pd / 2 - 0.2);
  // jacuzzi ogrodowe
  DET.cyl(g, 1.2, 0.6, DET.M('paint', '#e9e2d6'), 17.6, 0.3, -3.3); const hw = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.05, 24), poolMat); hw.position.set(17.6, 0.6, -3.3); g.add(hw);
  // pergola lounge nad jacuzzi: belki z drewna, lampki na sznurku i lniane zasłony
  { const pg = new THREE.Group(), tk = DET.L('walnut', '#9a6a3c'), x0 = 15.4, x1 = 19.9, z0 = -5.6, z1 = -1.0;
    for (const x of [x0, x1]) for (const z of [z0, z1]) DET.box(pg, 0.18, 2.8, 0.18, tk, x, 1.4, z);
    for (const z of [z0, z1]) DET.box(pg, x1 - x0 + 0.5, 0.2, 0.14, tk, (x0 + x1) / 2, 2.85, z);
    for (let x = x0 - 0.1; x <= x1 + 0.1; x += 0.4) DET.box(pg, 0.08, 0.14, z1 - z0 + 0.5, tk, x, 3.0, (z0 + z1) / 2);
    for (let i = 0; i < 12; i++) { const t = i / 11; DET.sph(pg, 0.06, DET.lampMat, x0 + t * (x1 - x0), 2.7 - Math.sin(t * Math.PI) * 0.35, (z0 + z1) / 2); }
    for (const x of [x0 + 0.15, x1 - 0.15]) DET.box(pg, 0.05, 2.5, 0.9, DET.L('linen', '#f3ece0'), x, 1.5, z1 - 0.45);
    g.add(DET.mergeStatic(pg)); const pl = new THREE.PointLight('#ffc27a', 1.4, 6, 1.6); pl.position.set((x0 + x1) / 2, 2.4, (z0 + z1) / 2); g.add(pl); }
  // leżaki i parasole
  const cush = DET.L('linen', '#f3ece0'), teak = DET.L('walnut', '#8a5a32'), chrome = DET.L('chrome');
  for (let i = 0; i < 4; i++) { const x = 3.4 + i * 2.3, ln = new THREE.Group(); ln.position.set(x, 0.12, -0.75); ln.rotation.y = Math.PI; g.add(ln);
    DET.box(ln, 0.72, 0.1, 1.95, teak, 0, 0.3, 0); for (const a of [-0.3, 0.3]) for (const b of [-0.85, 0.85]) DET.box(ln, 0.06, 0.28, 0.06, teak, a, 0.14, b);
    DET.box(ln, 0.66, 0.1, 1.35, cush, 0, 0.4, 0.25); const bk = DET.box(ln, 0.66, 0.1, 0.72, cush, 0, 0.62, -0.62); bk.rotation.x = 0.75; DET.box(ln, 0.42, 0.14, 0.2, DET.L('velvet', '#2f6f8a'), 0, 0.75, -0.5);
    if (i % 2 === 0) { const tb = new THREE.Group(); tb.position.set(x + 1.15, 0.12, -0.6); g.add(tb); DET.cyl(tb, 0.25, 0.04, DET.L('marble'), 0, 0.5, 0); DET.cyl(tb, 0.03, 0.5, chrome, 0, 0.25, 0); DET.cyl(tb, 0.18, 0.02, chrome, 0, 0.01, 0);
      for (const [dx, col] of [[-0.08, '#ff8a3a'], [0.09, '#ff5fa2']]) { DET.cyl(tb, 0.04, 0.16, DET.L('glassLux'), dx, 0.6, 0.02); DET.cyl(tb, 0.035, 0.1, DET.M('paint', col), dx, 0.57, 0.02); DET.sph(tb, 0.03, DET.M('paint', '#f6d743'), dx + 0.03, 0.69, 0.02); } } }
  for (const x of [4.7, 9.5]) { DET.cyl(g, 0.03, 2.4, DET.M('metal', '#cfcfcf'), x, 1.2, -0.9); const um = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.5, 10), DET.M('paint', '#ffffff')); um.position.set(x, 2.45, -0.9); um.castShadow = true; g.add(um); }
  // podwodne światło basenu i ciepłe lampy ogrodowe
  { const uw = new THREE.PointLight('#3fd6ff', 3, 9, 1.5); uw.position.set(px, 0.5, pz); g.add(uw);
    for (const [x, z] of [[1.5, -6.2], [16, -6.2], [20.2, -0.5], [-0.4, -0.5]]) { const l = new THREE.PointLight('#ffc27a', 1.6, 7, 1.6); l.position.set(x, 1.2, z); g.add(l); }
    const bl = new THREE.Group(); for (let i = 0; i < 9; i++) { const x = -0.6 + i * 2.6; DET.box(bl, 0.14, 0.6, 0.14, DET.M('paint', '#2b2f36'), x, 0.3, -6.3); DET.box(bl, 0.16, 0.1, 0.16, DET.ledMat, x, 0.55, -6.3); }
    for (let z = -5.5; z < 0; z += 2.2) for (const x of [-0.9, 20.9]) { DET.box(bl, 0.14, 0.6, 0.14, DET.M('paint', '#2b2f36'), x, 0.3, z); DET.box(bl, 0.16, 0.1, 0.16, DET.ledMat, x, 0.55, z); }
    g.add(DET.mergeStatic(bl)); }
  // bujne krzewy: hortensje i bukszpan wzdłuż ogrodzenia i tarasu
  { const sh = new THREE.Group(), box1 = DET.M('paint', '#2f6f3a'), F = ['#c7b3ff', '#9ec5ff', '#ffc2dd', '#ffffff'];
    const hyd = (x, z, r0 = 0.45) => { DET.sph(sh, r0, DET.M('paint', '#3f8a45'), x, r0 * 0.75, z, 0.85); for (let k = 0; k < 7; k++) { const a = k * 0.9; DET.sph(sh, 0.12, DET.M('paint', F[(Math.round(x * 3) + k) % 4]), x + Math.cos(a) * r0 * 0.7, r0 * 1.2 + (k % 2) * 0.08, z + Math.sin(a) * r0 * 0.7); } };
    for (let z = 0.6; z < 14; z += 1.1) { hyd(-0.55, z, 0.42 + (Math.round(z) % 2) * 0.08); if (z < 3.5) hyd(20.55, z, 0.45); }
    for (let x = -1.5; x < 22; x += 1.2) DET.box(sh, 1.15, 0.7, 0.6, box1, x, 0.35, -6.9);
    for (const x of [0.5, 2.6, 16.4, 18.6]) hyd(x, -6.1, 0.5);
    g.add(DET.mergeStatic(sh)); }
  // palmy
  for (const [x, z, m] of [[-1.6, -1.5, 'tree_palmTall'], [-2.2, -5.8, 'tree_palmBend'], [21.4, -1.2, 'tree_palmDetailedTall'], [21.8, -5.6, 'tree_palmTall'], [15.2, -6.6, 'tree_palmBend'], [1.2, -6.8, 'tree_palmDetailedTall']]) jobs.push(put(g, NA + m + '.glb', x, z, { s: 4.6 + r() * 1.2, ry: r() * 6 }));
  // strefa ognia z kanapą (lewa przerwa)
  DET.cyl(g, 0.8, 0.35, DET.M('stone', '#8d8780'), -3, 0.18, 6); DET.cyl(g, 0.6, 0.06, DET.M('paint', '#222'), -3, 0.37, 6);
  for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5 - i * 0.08, 8), DET.lampMat); f.position.set(-3.15 + i * 0.15, 0.6, 6 + (i - 1) * 0.1); g.add(f); }
  for (let i = 0; i < 5; i++) { const a = Math.PI * 0.15 + i * Math.PI * 0.18, x = -3 + Math.cos(a) * 1.9, z = 6 - Math.sin(a) * 1.9; const s = dmesh(g, 1.1, 0.45, 0.7, DET.M('paint', '#e8e2d6'), x, 0.22, z); s.rotation.y = -a + Math.PI / 2; }
  // podjazd z autem sportowym (prawa przerwa)
  dmesh(g, 4.6, 0.05, 11, DET.M('stone', '#c4bfb6'), 23, 0.025, 8.5);
  const car = sportsCar('#d01f2a'); car.position.set(23, 0, 9.2); car.rotation.y = 0.15; g.add(car);
  // złota brama i ogrodzenie z czarnego metalu
  const fence = new THREE.Group(), black = DET.M('paint', '#16181c'), gold = DET.M('metal', '#c9a227'), gx = EXIT.x + 0.5;
  for (let x = 0.15; x < W; x += 0.22) { if (Math.abs(x - gx) < 1.7) continue; DET.box(fence, 0.04, 1.3, 0.04, black, x, 0.65, 14.15); DET.sph(fence, 0.04, gold, x, 1.33, 14.15); }
  for (const y of [0.25, 1.15]) for (const [a, b] of [[0, gx - 1.7], [gx + 1.7, W]]) DET.box(fence, b - a, 0.05, 0.05, black, (a + b) / 2, y, 14.15);
  for (const s2 of [-1, 1]) { DET.box(fence, 0.6, 1.9, 0.6, DET.M('stone', '#d8d2c5'), gx + s2 * 1.95, 0.95, 14.25); DET.box(fence, 0.7, 0.1, 0.7, gold, gx + s2 * 1.95, 1.95, 14.25); DET.box(fence, 0.3, 0.35, 0.3, DET.lampMat, gx + s2 * 1.95, 2.2, 14.25); }
  for (let i = 0; i < 8; i++) DET.box(fence, 0.08, 0.35, 0.08, DET.lampMat, 1.5 + i * 2.4, 0.18, 13.6);
  g.add(DET.mergeStatic(fence));
  return jobs;
}

// ============================================================
//  OSIEDLE
// ============================================================
export function createHood(scene, opts) {
  const { houses, buildCharacter, animateCharacter, getClips } = opts;
  const group = new THREE.Group(); group.matrixAutoUpdate = false; scene.add(group);
  const slotG = {}, houseG = {};
  for (const k of Object.keys(SLOTS)) { const g = new THREE.Group(); g.matrixAutoUpdate = false; g.matrix.copy(MAT[k]); group.add(g); slotG[k] = g; }
  let home = 'start';
  const jobs = [...street(group)];
  // sąsiedzi i dalsze domy
  const LOTS = {
    hania: { seed: 11, mail: '#7b4bd6', bench: true, h: { w: 9, wall: '#f1ead9', roof: '#3b3f46', shutter: '#2f5a3a', door: '#b0302b', roofType: 'gable', side: 'bay', left: true, dormers: 2 } },
    marek: { seed: 12, mail: '#2f4fbf', h: { w: 9.2, wall: '#9fb3c4', roof: '#2e3640', shutter: '#ffffff', door: '#1f3a5f', roofType: 'hip', side: 'garage', dormers: 1 } },
    ola: { seed: 13, mail: '#ec6fb4', lawn: '#92cf72', h: { w: 9.4, wall: '#f3e2b3', roof: '#5a3d32', shutter: '#7a2e2e', door: '#2f5a3a', roofType: 'gable', side: 'garage', left: true, dormers: 0 } },
    f1: { seed: 14, h: { w: 8.8, wall: '#d8e3cf', roof: '#3f4a3c', shutter: '#3a3a3a', door: '#f2c14e', roofType: 'hip', side: 'bay', dormers: 1 } },
    f2: { seed: 15, h: { w: 9.6, wall: '#e9e9ef', roof: '#33363d', shutter: '#1f3a5f', door: '#b0302b', roofType: 'gable', side: 'garage', dormers: 2 } },
  };
  for (const [k, cfg] of Object.entries(LOTS)) { slotG[k].userData.lot = k; jobs.push(...neighbourLot(slotG[k], cfg)); }
  // ---------- skrytki na posesjach sąsiadów: rekwizyty + znaczniki (widoczne w trybie skradania) ----------
  const stashAt = {}, stashMark = {}, stashMeta = {}, stashG = new THREE.Group(); stashG.visible = false;
  const DOORS = Object.keys(LOTS).map(k => ({ id: 'door_' + k, slot: k, kind: 'door' }));
  for (const st of [...SK.STASHES, ...DOORS]) { const cfg = LOTS[st.slot]; if (!cfg) continue; const side = cfg.h.left ? -1 : 1, g = slotG[st.slot], [x, z] = st.kind === 'door' ? [10, (g.userData.porchZ || 9.6) + 0.35] : SK.KINDS[st.kind].pos(side);
    stashAt[st.id] = [x, z]; stashMeta[st.id] = st;
    if (st.kind === 'klomb') { const dirt = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat('#5a3e28', { roughness: 1 })); dirt.scale.set(1.1, 0.28, 0.8); dirt.position.set(x, 0, z); dirt.receiveShadow = true; g.add(dirt);
      const sh = new THREE.Group(); sh.position.set(x + 0.75, 0, z - 0.2); sh.rotation.z = 0.35; g.add(sh); box(sh, 0.04, 1.0, 0.04, '#8a5a32', 0, 0.5, 0); box(sh, 0.22, 0.28, 0.03, '#9aa0a8', 0, 0.06, 0, { metalness: 0.5 }); }
    if (st.kind === 'altana') { const al = new THREE.Group(); al.position.set(x, 0, z); g.add(al); const wood = '#a87c50';
      for (const a of [-0.8, 0.8]) for (const b of [-0.8, 0.8]) box(al, 0.1, 2.1, 0.1, wood, a, 1.05, b);
      box(al, 1.7, 0.06, 1.7, '#8a6a48', 0, 0.03, 0); for (const b of [-0.8, 0.8]) box(al, 1.6, 0.9, 0.04, '#c9a77a', 0, 0.55, b); box(al, 0.04, 0.9, 1.6, '#c9a77a', 0.8, 0.55, 0); box(al, 0.04, 1.9, 0.75, '#7a5232', -0.8, 0.95, 0.3);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.9, 4), mat('#6b3f2a')); roof.rotation.y = Math.PI / 4; roof.position.y = 2.5; roof.castShadow = true; al.add(roof); }
    if (st.kind === 'kosz') { const b = new THREE.Group(); b.position.set(x, 0, z); g.add(b); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.95, 14), mat('#5b6370')); c.position.y = 0.48; c.castShadow = true; b.add(c); box(b, 0.7, 0.06, 0.7, '#3f454f', 0, 0.98, 0); }
    // znacznik skrytki (fioletowe kółko z ikoną) – klikany w trybie skradania
    const m = new THREE.Group(); m.position.copy(L2H(st.slot, x, z)); const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x2 = cv.getContext('2d');
    x2.fillStyle = '#7b4bd6'; x2.beginPath(); x2.arc(64, 64, 58, 0, 7); x2.fill(); x2.lineWidth = 8; x2.strokeStyle = '#fff'; x2.stroke(); x2.font = '62px sans-serif'; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillText(st.kind === 'door' ? '🚪' : SK.KINDS[st.kind].icon, 64, 70);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true, opacity: 0.92 })); sp.scale.set(0.7, 0.7, 1); sp.position.y = st.kind === 'altana' ? 3.2 : 1.7; sp.renderOrder = 6; m.add(sp);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 24), new THREE.MeshBasicMaterial({ color: '#b48cff', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06; m.add(ring);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 1.3), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.3; hit.userData.stash = st.id; m.add(hit);
    m.userData.sprite = sp; stashG.add(m); stashMark[st.id] = m; }
  group.add(stashG);
  // ---------- Usterka Rzeczywistości: krasnale ogrodowe, szczeliny (kryształy) ----------
  const realG = new THREE.Group(); group.add(realG);
  const gnomes = [];
  { const gm = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, ...o });
    const spots = Object.entries(LOTS).map(([k, cfg]) => [k, 10 + (cfg.h.left ? -1 : 1) * 2.5, 12.3]).concat([['park', 4.2, 9.5]]);
    for (const [slot, x, z] of spots) { const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); g.position.copy(L2H(slot, x, z)); g.rotation.y = SLOTS[slot][0] === 'S' ? 0 : Math.PI;
      const add = (geo, m, px, py, pz) => { const o = new THREE.Mesh(geo, m); o.position.set(px, py, pz); o.castShadow = true; inner.add(o); return o; };
      add(new THREE.CylinderGeometry(0.13, 0.17, 0.3, 12), gm('#2f5fbf'), 0, 0.15, 0); add(new THREE.SphereGeometry(0.11, 12, 10), gm('#f1c9a5'), 0, 0.37, 0);
      add(new THREE.ConeGeometry(0.12, 0.28, 12), gm('#d9342b'), 0, 0.56, 0); const b = add(new THREE.SphereGeometry(0.1, 10, 8), gm('#f7f7f2'), 0, 0.3, -0.07); b.scale.set(1, 1.2, 0.6);
      add(new THREE.SphereGeometry(0.03, 8, 6), gm('#e07a7a'), 0, 0.37, -0.11);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.6), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 0.5; hit.userData.gnome = gnomes.length; inner.add(hit);
      realG.add(g); gnomes.push({ g, inner, slot, lev: 0, on: false }); } }
  const portals = new Map();
  function makePortal(id, big) {
    const g = new THREE.Group(), s = big ? 2.4 : 1, pm = new THREE.MeshStandardMaterial({ color: '#8e5cff', emissive: '#7b3cff', emissiveIntensity: 1.8, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.88 });
    const gold = new THREE.MeshStandardMaterial({ color: '#ffd76a', emissive: '#ffb21e', emissiveIntensity: 1.6, roughness: 0.3, metalness: 0.6 });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.32 * s, 0), pm); crystal.scale.y = 1.7; crystal.position.y = 1.15 * s; g.add(crystal);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.14 * s, 0), gold); core.position.y = 1.15 * s; g.add(core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62 * s, 0.035 * s, 8, 40), gold); ring.position.y = 1.15 * s; g.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.48 * s, 0.025 * s, 8, 36), pm); ring2.position.y = 1.15 * s; ring2.rotation.x = Math.PI / 2; g.add(ring2);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.9 * s, 32), new THREE.MeshBasicMaterial({ color: '#a66bff', transparent: true, opacity: 0.35, depthWrite: false })); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04; g.add(glow);
    const motes = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.04 * s, 6, 5), i % 2 ? gold : pm); g.add(m); motes.push(m); }
    const L = new THREE.PointLight('#a874ff', big ? 3 : 1.6, big ? 14 : 6, 1.6); L.position.y = 1.2 * s; g.add(L);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.4 * s, 2.6 * s, 1.4 * s), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2 * s; hit.userData.portal = id; g.add(hit);
    g.userData = { crystal, core, ring, ring2, motes, glow, s, t0: Math.random() * 10 };
    return g;
  }
  jobs.push(...park(slotG.park));
  // domy, które można kupić – płot zawsze, a budynek tylko gdy w nim nie mieszkamy
  for (const id of HOUSE_SLOTS) {
    const h = houses.find(x => x.id === id); if (!h) continue;
    if (id === 'villa') jobs.push(...luxGrounds(slotG[id])); else jobs.push(...frontFence(slotG[id], EXIT.x + 0.5, 1.1, [], id === 'classic'));
    const hg = new THREE.Group(); hg.userData.houseId = id; slotG[id].add(hg); houseG[id] = hg;
    const bld = h.build();
    jobs.push(...forSaleLot(hg, h, bld));
    const inner = new THREE.Group(); hg.add(inner);
    jobs.push(BUD.buildMeshes(bld, inner, 1));
  }
  const ready = Promise.all(jobs.map(safe));

  function setHome(id) {
    if (!SLOTS[id]) id = 'start';
    home = id;
    group.matrix.copy(MAT[id]).invert(); group.matrixWorldNeedsUpdate = true;
    for (const k of HOUSE_SLOTS) if (houseG[k]) houseG[k].visible = k !== id;
    npcs.forEach(n => { if (n.state === 'meet' || n.state === 'visit') idle(n); });
  }
  // świat (działka domowa) -> osiedle i z powrotem
  const toH = v => v.clone().applyMatrix4(MAT[home]);
  const toWorld = v => v.clone().applyMatrix4(group.matrix);

  // ---------- mieszkańcy ----------
  const npcs = [];
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  async function spawnNpc(def) {
    if (npcs.some(x => x.id === def.id)) return;
    {
      const n = { ...def, pos: L2H(def.slot, 10 + (npcs.length % 2) * 1.2, 10.4), face: 0, route: [], state: 'idle', timer: 2 + Math.random() * 6, at: def.slot, side: SLOTS[def.slot][0], inside: false, visitDay: -1, ch: null };
      n.root = new THREE.Group(); n.root.rotation.order = 'YXZ'; n.root.position.copy(n.pos); group.add(n.root);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.85, 0.7), hitMat); hit.position.y = 0.92; hit.userData.npc = n.id; n.root.add(hit);
      npcs.push(n);
      try { n.ch = await buildCharacter(n.look); n.root.add(n.ch.root); } catch (e) { console.warn('Sąsiad bez modelu', e); }
    }
  }
  (async () => { for (const def of NEIGHBOURS.slice()) await spawnNpc(def); })();
  // nowa osoba w trakcie gry (z kreatora albo domownik spoza ulicy)
  function addNeighbour(def) { if (!NEIGHBOURS.some(x => x.id === def.id)) NEIGHBOURS.push(def); if (residents.has(def.id)) def.resident = true; return spawnNpc(def); }

  // ---------- przechodnie: losowi mieszkańcy dalszych ulic (wygląd i imię z zapisanego ziarna) ----------
  const walkers = []; let walkersTok = 0;
  async function setPassers(list) {
    const tok = ++walkersTok;
    walkers.splice(0).forEach(w => group.remove(w.root));
    for (const [i, seed] of (list || []).entries()) {
      const look = WG.generateLook(seed), side = i % 2 ? 'N' : 'S';
      const w = { id: 'p' + i, look, name: look.name + (look.surname ? ' ' + look.surname : ''), pos: new THREE.Vector3(-40 + ((seed % 997) / 997) * 100, 0, side === 'N' ? ZN : ZS), side, at: null, route: [], face: 0, timer: 1 + i * 2, ch: null, anim: null };
      w.root = new THREE.Group(); w.root.position.copy(w.pos); w.root.visible = false; group.add(w.root);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.85, 0.7), hitMat); hit.position.y = 0.92; hit.userData.walker = w.id; w.root.add(hit);
      walkers.push(w);
      try { const ch = await buildCharacter(look); if (tok !== walkersTok) return; w.ch = ch; w.root.add(ch.root); } catch (e) { console.warn('Przechodzień bez modelu', e); }
    }
  }
  function walkersUpdate(dt, hour, now, clips) {
    const night = hour >= 21 || hour < 7;
    for (const w of walkers) {
      w.root.visible = !!w.ch && !night;
      if (!w.root.visible) continue;
      if (w.route.length) {
        const tgt = w.route[0], dx = tgt.x - w.pos.x, dz = tgt.z - w.pos.z, dist = Math.hypot(dx, dz), sp = 1.2 * dt;
        if (dist > 0.01) w.face = Math.atan2(dx, dz);
        if (dist <= sp) { w.pos.copy(tgt); w.route.shift(); if (!w.route.length) { w.timer = 2 + Math.random() * 7; w.anim = Math.random() < 0.3 ? 'phone' : null; } }
        else { w.pos.x += dx / dist * sp; w.pos.z += dz / dist * sp; }
      } else if ((w.timer -= dt) <= 0) {
        const side = Math.random() < 0.7 ? w.side : (w.side === 'N' ? 'S' : 'N');
        w.route = plan(w, { side, x: -55 + Math.random() * 130 }); w.side = side; w.anim = null;
      }
      w.root.position.copy(w.pos);
      let d = w.face - w.root.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); w.root.rotation.y += d * Math.min(1, dt * 8);
      if (w.ch) animateCharacter(w.ch, w.route.length ? { pose: 'walk', timeScale: 0.95 } : { pose: 'stand', anim: w.anim }, dt, now / 1000, clips);
    }
  }

  // trasa po chodnikach, z przejściem przez jezdnię po pasach
  function routeTo(n, dest) {
    n.route = plan(n, dest); n.at = dest.slot || null; n.side = dest.slot ? SLOTS[dest.slot][0] : dest.side; n.inside = false;
  }
  function plan(n, dest) {
    const pts = [];
    if (n.at) { const gx = gateX(n.at); pts.push(L2H(n.at, gx, 13.3), L2H(n.at, gx, 15)); }
    else pts.push(new THREE.Vector3(n.pos.x, 0, n.side === 'N' ? ZN : ZS));
    const tSide = dest.slot ? SLOTS[dest.slot][0] : dest.side;
    const tx = dest.slot ? L2H(dest.slot, gateX(dest.slot), 15).x : dest.x;
    let side = n.at ? SLOTS[n.at][0] : n.side;
    if (side !== tSide) {
      const fromX = pts[pts.length - 1].x, mid = (fromX + tx) / 2;
      const zx = ZEBRAS.reduce((p, c) => Math.abs(c - mid) < Math.abs(p - mid) ? c : p);
      pts.push(new THREE.Vector3(zx, 0, side === 'N' ? ZN : ZS), new THREE.Vector3(zx, 0, tSide === 'N' ? ZN : ZS));
    }
    pts.push(new THREE.Vector3(tx, 0, tSide === 'N' ? ZN : ZS));
    if (dest.slot) { const gx = gateX(dest.slot); pts.push(L2H(dest.slot, gx, 13.3), L2H(dest.slot, dest.p[0], dest.p[1])); }
    if (dest.exact) pts.push(dest.exact.clone());
    return pts;
  }
  const homePt = n => [10 + (n.id === 'kuba' ? 0.8 : 0), 11.4];
  const yardPt = n => [10 + (n.id === 'kuba' ? 0.8 : 0), 11.8];
  const meetPoint = () => L2H(home, EXIT.x + 0.5, 15.05);

  function idle(n) { n.state = 'idle'; n.timer = 1 + Math.random() * 4; n.anim = null; }
  function goInside(n) { routeTo(n, { slot: n.slot, p: homePt(n) }); n.state = 'goingIn'; }
  function pickActivity(n, hour, day) {
    const r = Math.random();
    // odwiedziny pod naszą furtką (raz dziennie)
    if (hour > 9 && hour < 19 && n.visitDay !== day && r < (fav.has(n.id) ? 0.35 : 0.1) && !npcs.some(o => o.state === 'visit' || o.state === 'toVisit')) {
      n.visitDay = day; const mp = meetPoint();
      routeTo(n, { side: home && SLOTS[home][0], x: mp.x, exact: mp }); n.state = 'toVisit'; return;
    }
    if (freeWill && r > 0.82) { // sąsiedzi sami się spotykają: rozmowa, flirt albo kłótnia
      const m = npcs.find(o => o !== n && !o.resident && !o.inside && !o.override && ['idle', 'look', 'park', 'garden'].includes(o.state) && o.ch);
      if (m) { const mx = (n.pos.x + m.pos.x) / 2, side = Math.random() < 0.5 ? 'N' : 'S', zz = side === 'N' ? ZN : ZS;
        routeTo(n, { side, x: mx - 0.6, exact: new THREE.Vector3(mx - 0.6, 0, zz) }); routeTo(m, { side, x: mx + 0.6, exact: new THREE.Vector3(mx + 0.6, 0, zz) });
        n.state = m.state = 'toSocial'; n.soc = m.id; m.soc = n.id; return; }
    }
    if (n.hobby === 'jog' && r < 0.55) { routeTo(n, { side: n.side, x: Math.random() < 0.5 ? -60 : 82 }); n.state = 'jog'; n.next = 'jogBack'; return; }
    if (n.hobby === 'garden' && r < 0.6) { routeTo(n, { slot: n.slot, p: [Math.random() < 0.5 ? 3 + Math.random() * 4 : 13 + Math.random() * 3, 10.4 + Math.random() * 1.2] }); n.state = 'toGarden'; return; }
    if (r < 0.35) { routeTo(n, { slot: 'park', p: [7 + Math.random() * 8, 10 + Math.random() * 2] }); n.state = 'toPark'; return; }
    if (r < 0.65) { routeTo(n, { side: Math.random() < 0.5 ? 'N' : 'S', x: -55 + Math.random() * 130 }); n.state = 'stroll'; return; }
    goInside(n);
  }
  function arrived(n, hour) {
    switch (n.state) {
      case 'toGarden': n.state = 'garden'; n.anim = 'arms'; n.timer = 15 + Math.random() * 20; break;
      case 'toPark': n.state = 'park'; n.anim = Math.random() < 0.4 ? 'phone' : null; n.timer = 12 + Math.random() * 18; break;
      case 'stroll': n.state = 'look'; n.timer = 3 + Math.random() * 4; break;
      case 'jog': routeTo(n, { slot: n.slot, p: homePt(n) }); n.state = 'jogHome'; break;
      case 'jogHome': case 'goingIn': n.inside = true; n.state = 'inside'; n.timer = 15 + Math.random() * 25; break;
      case 'toVisit': n.state = 'visit'; n.timer = 35; n.anim = 'talk'; if (opts.onVisit) opts.onVisit(n); break;
      case 'toMeet': n.state = 'meet'; n.anim = 'talk'; break;
      case 'charge': n.state = 'watch'; n.timer = 7; n.anim = 'talk'; break;
      case 'toHost': n.state = 'meet'; n.anim = 'talk'; break;
      case 'toSocial': { n.state = 'socialWait'; n.timer = 25; const m = npcs.find(o => o.id === n.soc);
        if (m && m.state === 'socialWait') { const kind = n.forceKind || m.forceKind || (opts.socialKind && opts.socialKind(n, m)) || 'chat'; n.forceKind = m.forceKind = null; for (const x of [n, m]) { x.state = 'social'; x.anim = 'talk'; x.timer = 14 + Math.random() * 6; x.socKind = kind; }
          if (opts.npcEvent) opts.npcEvent('social', n, m, kind);
          if (kind === 'flirt') for (const x of [n, m]) { const pid = x.partner || (opts.partnerOf && opts.partnerOf(x.id)); const P = npcs.find(o => o.id === pid);
            if (P && P !== n && P !== m && !P.inside && !P.resident && P.pos.distanceTo(x.pos) < 22) { routeTo(P, { side: n.side, x: x.pos.x + 1.2, exact: new THREE.Vector3(x.pos.x + 1.2, 0, x.pos.z) }); P.state = 'toJealous'; P.jealousOf = x.id; P.rival = (x === n ? m : n).id; } } }
        else if (!m || !['toSocial', 'socialWait'].includes(m.state)) idle(n);
        break; }
      case 'errand': { n.state = 'errandDo'; n.timer = n.errandWait || 3; n.anim = 'arms'; const cb = n.onArrive; n.onArrive = null; if (cb) cb(n); break; }
      case 'avoid': idle(n); n.timer = 4; break;
      case 'toJealous': n.state = 'jealous'; n.anim = 'talk'; n.timer = 10; if (opts.npcEvent) opts.npcEvent('jealous', n, npcs.find(o => o.id === n.jealousOf), npcs.find(o => o.id === n.rival)); break;
      default: idle(n);
    }
  }
  // ---------- Usterka Rzeczywistości: pętla 4 kroków, taniec/chód tyłem, symbole nad głową ----------
  function makeOverheadTex(icon, glowCol) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 8, 64, 64, 58);
    g.addColorStop(0, glowCol); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    x.font = '68px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(icon, 64, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const UR_OV_TEX = {
    inverted: makeOverheadTex('💔', 'rgba(180,80,255,0.75)'),
    spiral:   makeOverheadTex('🌀', 'rgba(110,230,255,0.8)'),
  };
  function setUrOverhead(n, kind) {
    if (n.urMark) { n.root.remove(n.urMark); n.urMark = null; }
    if (!kind || !UR_OV_TEX[kind]) return;
    const g = new THREE.Group(); g.position.y = 2.45;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: UR_OV_TEX[kind], transparent: true, depthTest: false }));
    sp.scale.set(0.72, 0.72, 1); sp.renderOrder = 7; g.add(sp);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.025, 8, 28),
      new THREE.MeshBasicMaterial({ color: kind === 'inverted' ? '#c86bff' : '#58f0ff', transparent: true, opacity: 0.85 })
    );
    ring.rotation.x = Math.PI / 2; g.add(ring);
    const sparks = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), new THREE.MeshBasicMaterial({ color: kind === 'inverted' ? '#e58cff' : '#ffd23f' }));
      g.add(m); sparks.push(m);
    }
    g.userData = { sp, ring, sparks, kind };
    n.root.add(g); n.urMark = g;
  }
  function urMarkTick(n, now) {
    if (!n.urMark) return;
    const u = n.urMark.userData, t = now / 1000;
    n.urMark.position.y = 2.42 + Math.sin(t * 2.6 + n.root.id) * 0.08;
    u.ring.rotation.z = t * 2.4;
    u.ring.rotation.x = Math.PI / 2 + Math.sin(t * 1.7) * 0.35;
    u.sp.material.rotation = u.kind === 'inverted' ? Math.PI + Math.sin(t * 2) * 0.25 : -t * 2.5;
    u.sparks.forEach((m, i) => {
      const a = t * 2.8 + i * Math.PI / 2;
      m.position.set(Math.cos(a) * 0.36, Math.sin(t * 3 + i) * 0.14, Math.sin(a) * 0.36);
      m.rotation.y = t * 4;
    });
  }
  function urStep(n, dt, now, clips) {
    const u = n.ur; n.inside = false; n.hidden = false; n.root.visible = true;
    if (u.mode === 'loop') {
      // 4 kroki w przód (~3.2 m), zatrzymanie, gest + dymek wskazówki, powrót na start pętli
      const dist = 3.2, sp = 1.25;
      if (u.phase === 'walk') {
        u.d += sp * dt;
        if (u.d >= dist) { u.d = dist; u.phase = 'gesture'; u.t = 2.6; if (u.onCycle) u.onCycle(n.id); }
      } else if (u.phase === 'gesture') {
        u.t -= dt;
        if (u.t <= 0) { u.phase = 'reset'; u.t = 0.25; }
      } else {
        u.t -= dt;
        if (u.t <= 0) { u.d = 0; u.phase = 'walk'; }
      }
      n.pos.set(u.ax + u.dx * u.d, 0, u.az + u.dz * u.d);
      n.face = Math.atan2(u.dx, u.dz);
      n.root.position.copy(n.pos);
      n.root.rotation.set(0, n.face, 0);
      urMarkTick(n, now);
      if (n.ch) {
        const st = u.phase === 'walk' ? { pose: 'walk', jog: false, timeScale: 1 } : { pose: 'stand', anim: 'arms', talk: true };
        animateCharacter(n.ch, st, dt, now / 1000, clips);
      }
      return;
    }
    if (u.mode === 'dance') {
      n.root.position.set(n.pos.x, Math.abs(Math.sin(now / 150)) * 0.14, n.pos.z);
      n.root.rotation.set(0, (now / 450) % (Math.PI * 2), Math.sin(now / 190) * 0.12);
      urMarkTick(n, now);
      if (n.ch) animateCharacter(n.ch, { pose: 'stand', anim: 'cheer' }, dt, now / 1000, clips);
      return;
    }
  }
  let lastKeep = {}, isNight = false, fav = new Set(), freeWill = true; const residents = new Set();
  function update(dt, hour, day, simWorld, now) {
    const clips = getClips && getClips();
    const night = hour >= 21.5 || hour < 6.5; isNight = night;
    poolMat.emissiveIntensity = 0.45 + Math.sin(now / 650) * 0.12;
    if (marker) marker.userData.sprite.position.y = 2.2 + Math.sin(now / 300) * 0.15;
    for (const n of npcs) {
      if (residents.has(n.id)) n.resident = true;
      if (n.resident) { n.root.visible = false; continue; }
      if (n.override) { const o = n.override; n.root.position.copy(o.pos); n.root.rotation.set(o.rx || 0, o.ry, 0); n.root.visible = true;
        if (n.ch) animateCharacter(n.ch, { pose: o.pose || 'stand', sleep: false }, dt, now / 1000, clips); continue; }
      if (n.ur && !['meet', 'toMeet', 'toHost', 'visit'].includes(n.state)) { urStep(n, dt, now, clips); continue; } // Usterka Rzeczywistości: pętla / taniec (pauzuje na czas rozmowy z graczem)
      // noc: wszyscy idą do domu
      if (night && !n.inside && !['goingIn', 'meet', 'toMeet', 'toHost', 'errand', 'errandDo', 'watch', 'charge'].includes(n.state)) { n.soc = null; goInside(n); }
      // rozmowa z naszą postacią wygasa, gdy nikt jej nie podtrzymuje
      if ((n.state === 'meet' || n.state === 'toMeet' || n.state === 'toHost') && now - (lastKeep[n.id] || 0) > 2500) { n.hidden = false; idle(n); }
      if (n.route.length) {
        const tgt = n.route[0], dx = tgt.x - n.pos.x, dz = tgt.z - n.pos.z, dist = Math.hypot(dx, dz);
        const sp = (n.state === 'jog' || n.state === 'jogHome' ? 3.1 : n.state === 'charge' ? 3.4 : n.state === 'toMeet' ? 2.6 : 1.35) * dt;
        if (dist > 0.01) n.face = Math.atan2(dx, dz);
        if (dist <= sp) { n.pos.copy(tgt); n.route.shift(); if (!n.route.length) arrived(n, hour); }
        else { n.pos.x += dx / dist * sp; n.pos.z += dz / dist * sp; }
      } else if (n.state === 'social' || n.state === 'socialWait' || n.state === 'jealous') {
        const m = npcs.find(o => o.id === (n.state === 'jealous' ? n.jealousOf : n.soc)); if (m) n.face = Math.atan2(m.pos.x - n.pos.x, m.pos.z - n.pos.z);
        if ((n.timer -= dt) <= 0 || (n.state === 'socialWait' && n.timer < -20)) { n.soc = null; n.anim = null; idle(n); }
      } else if (n.state === 'watch') { // świadek: stoi i patrzy na zdarzenie
        if (n.watchAt) n.face = Math.atan2(n.watchAt.x - n.pos.x, n.watchAt.z - n.pos.z);
        if ((n.timer -= dt) <= 0) { n.anim = null; idle(n); }
      } else if (n.state === 'errandDo') {
        if ((n.timer -= dt) <= 0) { n.anim = null; if (night) goInside(n); else { routeTo(n, { slot: n.slot, p: homePt(n) }); n.state = 'goingIn'; } }
      } else if (n.state === 'meet' || n.state === 'visit') {
        const s = toH(simWorld); n.face = Math.atan2(s.x - n.pos.x, s.z - n.pos.z);
        if (n.state === 'visit' && (n.timer -= dt) <= 0) idle(n);
      } else if ((n.timer -= dt) <= 0) {
        if (n.state === 'inside' && night) n.timer = 5;
        else if (night) goInside(n);
        else { n.anim = null; pickActivity(n, hour, day); }
      }
      // omijanie gracza (po nastawieniu przez wrogiego sąsiada)
      if (n.avoidUntil > now && !n.inside && !['avoid', 'errand', 'errandDo', 'watch', 'goingIn'].includes(n.state)) { const s = toH(simWorld);
        if (s.distanceTo(n.pos) < 5.5) { const dir = n.pos.x >= s.x ? 1 : -1, side = n.pos.z < 19 ? 'N' : 'S'; n.at = null; n.side = side; routeTo(n, { side, x: n.pos.x + dir * 14 }); n.state = 'avoid'; if (opts.npcEvent) opts.npcEvent('avoid', n); } }
      n.root.position.copy(n.pos);
      // Zamiana Ról: taneczny albo sztywny chód
      if (n.gait === 'party') { n.root.position.y = Math.abs(Math.sin(now / 170)) * 0.13; n.root.rotation.z = Math.sin(now / 260) * 0.14; n.root.rotation.x = 0; n.gaitWas = true; }
      else if (n.gait === 'stiff') { n.root.rotation.x = -0.09; n.root.rotation.z = 0; n.gaitWas = true; }
      else if (n.gaitWas) { n.root.rotation.x = n.root.rotation.z = 0; n.gaitWas = false; }
      urMarkTick(n, now);
      const tf = n.glitch === 'back' && n.route.length ? n.face + Math.PI : n.face; let d = tf - n.root.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); n.root.rotation.y += d * Math.min(1, dt * 8);
      n.root.visible = !n.inside && !n.hidden;
      if (n.ch && n.root.visible) {
        const walking = n.route.length > 0, jog = n.state === 'jog' || n.state === 'jogHome';
        const st = walking ? { pose: 'walk', jog, timeScale: 1 } : { pose: 'stand', anim: n.anim === 'talk' ? undefined : n.anim, talk: n.anim === 'talk' };
        animateCharacter(n.ch, st, dt, now / 1000, clips);
      }
    }
    walkersUpdate(dt, hour, now, clips);
    // animacje Usterki: kryształy wirują, krasnale lewitują
    const tt = now / 1000;
    for (const g of portals.values()) { const u = g.userData, t = tt + u.t0; u.crystal.rotation.y = t * 1.3; u.core.rotation.y = -t * 2.2; u.ring.rotation.set(Math.sin(t * 0.7) * 0.5, t * 0.9, 0); u.ring2.rotation.z = t * 1.6;
      const b = Math.sin(t * 2) * 0.08 * u.s; u.crystal.position.y = u.core.position.y = 1.15 * u.s + b; u.glow.material.opacity = 0.25 + Math.sin(t * 3) * 0.1;
      u.motes.forEach((m, i) => { const a = t * (0.8 + i * 0.15) + i; m.position.set(Math.cos(a) * 0.75 * u.s, (0.5 + (i % 3) * 0.45 + Math.sin(t + i) * 0.1) * u.s, Math.sin(a) * 0.75 * u.s); }); }
    for (const gn of gnomes) { gn.lev += ((gn.on ? 1 : 0) - gn.lev) * Math.min(1, dt * 1.5); gn.inner.position.y = gn.lev * (1.0 + Math.sin(tt * 1.8) * 0.12); gn.inner.rotation.y = gn.lev * tt * 1.4; gn.inner.rotation.z = gn.lev * Math.sin(tt * 1.1) * 0.25; }
  }
  // znacznik fabularny (świecący znak zapytania nad miejscem do zbadania)
  let marker = null;
  function clearMarker() { if (marker) { group.remove(marker); marker = null; } }
  function setMarker(slot, x, z) {
    clearMarker(); const m = new THREE.Group(); m.position.copy(L2H(slot, x, z));
    const c = document.createElement('canvas'); c.width = c.height = 128; const x2 = c.getContext('2d'); x2.fillStyle = '#ffd23f'; x2.beginPath(); x2.arc(64, 64, 58, 0, 7); x2.fill(); x2.lineWidth = 8; x2.strokeStyle = '#fff'; x2.stroke(); x2.fillStyle = '#1f2d3d'; x2.font = 'bold 84px sans-serif'; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillText('?', 64, 70);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false })); sp.scale.set(0.9, 0.9, 1); sp.position.y = 2.2; sp.renderOrder = 6; m.add(sp); m.userData.sprite = sp;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 1.5; m.add(beam);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.7, 24), new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.7, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; m.add(ring);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.45), mat('#8a5a32')); box.position.y = 0.18; box.rotation.y = 0.4; box.castShadow = true; m.add(box);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, 1.2), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.3; hit.userData.marker = true; m.add(hit);
    group.add(m); marker = m;
  }
  // znaczniki śledztwa: kilka naraz, każdy z ikoną; poza porą (dim) przygaszone
  let clueG = null, clueKey = '';
  function setClues(list) {
    const key = JSON.stringify(list.map(c => [c.id, c.icon, !!c.dim]));
    if (key === clueKey) return; clueKey = key;
    if (clueG) group.remove(clueG); clueG = new THREE.Group(); group.add(clueG);
    for (const c of list) {
      const m = new THREE.Group(); m.position.copy(L2H(c.slot, c.x, c.z));
      const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x2 = cv.getContext('2d');
      x2.fillStyle = c.dim ? '#c9ccd1' : '#ffd23f'; x2.beginPath(); x2.arc(64, 64, 58, 0, 7); x2.fill(); x2.lineWidth = 8; x2.strokeStyle = '#fff'; x2.stroke();
      x2.font = '64px sans-serif'; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillText(c.icon, 64, 70);
      const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true, opacity: c.dim ? 0.7 : 1 })); sp.scale.set(0.85, 0.85, 1); sp.position.y = 2.0; sp.renderOrder = 6; m.add(sp);
      if (!c.dim) { const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.6, 14, 1, true), new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 1.3; m.add(beam); }
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.58, 24), new THREE.MeshBasicMaterial({ color: c.dim ? '#c9ccd1' : '#ffd23f', transparent: true, opacity: 0.7, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; m.add(ring);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.6, 1.1), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.3; hit.userData.clue = c.id; m.add(hit);
      clueG.add(m);
    }
  }
  function pick(raycaster) {
    const targets = npcs.filter(n => n.root.visible).map(n => n.root).concat(walkers.filter(w => w.root.visible).map(w => w.root)).concat(marker ? [marker] : []).concat(clueG ? [clueG] : []).concat(stashG.visible ? [stashG] : []).concat([realG]).concat(HOUSE_SLOTS.filter(k => houseG[k] && houseG[k].visible).map(k => houseG[k]));
    const hits = raycaster.intersectObjects(targets, true);
    for (const h of hits) {
      let o = h.object;
      while (o) { if (o.userData.clue) return { clue: o.userData.clue }; if (o.userData.stash) return { stash: o.userData.stash }; if (o.userData.portal) return { portal: o.userData.portal }; if (o.userData.gnome != null) return { gnome: o.userData.gnome }; if (o.userData.marker) return { marker: true }; if (o.userData.npc) return { npc: npcs.find(n => n.id === o.userData.npc) }; if (o.userData.walker) return { walker: walkers.find(w => w.id === o.userData.walker) }; if (o.userData.houseId) return { house: o.userData.houseId }; o = o.parent; }
    }
    return null;
  }
  return {
    group, ready, npcs, setHome, update, pick, setPassers, walkers, get home() { return home; },
    setNight(night) { glowMat.emissiveIntensity = 0.1 + night * 2.2; DET.setNight(night); },
    available: id => { const n = npcs.find(x => x.id === id); return !!n; }, // sąsiedzi dostępni o każdej porze (bez limitu po 22:00)
    call(id) { const n = npcs.find(x => x.id === id); if (!n) return; lastKeep[id] = performance.now(); n.inside = false; n.hidden = false; if (n.state === 'meet' || n.state === 'toMeet') return; const mp = meetPoint(); if (n.pos.distanceTo(mp) > 6.5) { const dir = n.pos.x >= mp.x ? 1 : -1; n.pos.set(mp.x + dir * 6.0, 0, mp.z); n.at = null; n.side = SLOTS[home][0]; } n.route = [mp.clone()]; n.state = 'toMeet'; },
    keep(id) { lastKeep[id] = performance.now(); },
    setFavourites(ids) { fav = new Set(ids); }, setMarker, clearMarker, setClues, addNeighbour,
    setFreeWill(b) { freeWill = b; },
    setResident(id, b) { if (b) residents.add(id); else residents.delete(id); const n = npcs.find(x => x.id === id); if (n) { n.resident = b; if (!b) { n.inside = false; n.pos = L2H(n.slot, 10, 11.6); n.at = n.slot; n.side = SLOTS[n.slot][0]; n.route = []; idle(n); } } },
    // postać sąsiada w konkretnym miejscu świata (np. w łóżku gracza)
    setOverride(id, worldPos, ry, rx = 0, pose = 'stand') { const n = npcs.find(x => x.id === id); if (!n) return; n.override = { pos: toH(worldPos), ry: ry - (SLOTS[home][0] === 'S' ? Math.PI : 0), rx, pose }; },
    clearOverride(id) { const n = npcs.find(x => x.id === id); if (!n || !n.override) return; n.override = null; n.pos = meetPoint(); n.at = null; n.side = SLOTS[home][0]; n.route = []; idle(n); },
    npcDef(id) { return npcs.find(x => x.id === id) || NEIGHBOURS.find(x => x.id === id); },
    distWorld(id, w) { const n = npcs.find(x => x.id === id); return n && !n.inside && !n.resident ? toWorld(n.pos).distanceTo(w) : Infinity; },
    // sąsiad wychodzi przed swój dom i czeka na nas
    host(id) { const n = npcs.find(x => x.id === id); if (!n) return; lastKeep[id] = performance.now(); n.inside = false; n.hidden = false; if (n.state === 'meet' && n.at === n.slot) return; routeTo(n, { slot: n.slot, p: yardPt(n) }); n.state = 'toHost'; },
    setHidden(id, b) { const n = npcs.find(x => x.id === id); if (n) n.hidden = b; },
    // trasa naszej postaci (w układzie świata) od furtki do sąsiada i z powrotem
    visitRoute(id, back = false) {
      const n = npcs.find(x => x.id === id) || NEIGHBOURS.find(x => x.id === id); const yp = yardPt(n);
      let pts;
      if (!back) pts = [L2H(home, EXIT.x + 0.5, EXIT.z + 0.5)].concat(plan({ at: home }, { slot: n.slot, p: [yp[0], yp[1] + 1.25] }));
      else pts = plan({ at: n.slot }, { slot: home, p: [EXIT.x + 0.5, EXIT.z + 0.5] });
      if (back) pts.unshift(L2H(n.slot, yp[0], yp[1] + 1.25));
      return pts.map(toWorld);
    },
    npcWorld(id) { const n = npcs.find(x => x.id === id); return n ? toWorld(n.pos) : null; },
    npcReady(id) { const n = npcs.find(x => x.id === id); return n && (n.state === 'meet'); },
    npcState(id) { const n = npcs.find(x => x.id === id); return n ? (n.inside ? 'inside' : n.state) : null; },
    // świadek: przerywa to, co robi, i patrzy na zdarzenie (punkt w świecie)
    react(id, worldPos, sec = 6) { const n = npcs.find(x => x.id === id); if (!n || n.inside || n.resident || n.override || ['meet', 'toMeet', 'toHost', 'errand', 'errandDo'].includes(n.state)) return false;
      n.route = []; n.at = null; n.side = n.pos.z < 19 ? 'N' : 'S'; n.state = 'watch'; n.watchAt = toH(worldPos); n.timer = sec; n.anim = 'talk'; return true; },
    // sąsiad idzie na naszą działkę (x, z – kafelki działki gracza) i coś tam robi (cb), potem wraca do domu
    errand(id, lx, lz, cb, wait = 3) { const n = npcs.find(x => x.id === id); if (!n || n.resident || n.override) return false;
      n.inside = false; n.hidden = false; if (n.at === null && !n.route.length) n.side = n.pos.z < 19 ? 'N' : 'S';
      routeTo(n, { slot: home, p: [lx, lz] }); n.state = 'errand'; n.onArrive = cb; n.errandWait = wait; return true; },
    // sąsiad podchodzi do innego i szepcze (kind = 'whisper' – obsługa w npcEvent)
    whisper(a, b) { const n = npcs.find(x => x.id === a), m = npcs.find(x => x.id === b); if (!n || !m || n.resident || m.resident || n.override || m.override || isNight) return false;
      for (const x of [n, m]) { x.inside = false; x.hidden = false; if (!x.route.length && x.at) { x.pos = L2H(x.at, gateX(x.at), 13.3); } }
      const mx = (n.pos.x + m.pos.x) / 2, side = m.pos.z < 19 ? 'N' : 'S', zz = side === 'N' ? ZN : ZS;
      routeTo(n, { side, x: mx - 0.55, exact: new THREE.Vector3(mx - 0.55, 0, zz) }); routeTo(m, { side, x: mx + 0.55, exact: new THREE.Vector3(mx + 0.55, 0, zz) });
      n.state = m.state = 'toSocial'; n.soc = m.id; m.soc = n.id; n.forceKind = m.forceKind = 'whisper'; return true; },
    setAvoid(id, untilMs) { const n = npcs.find(x => x.id === id); if (n) n.avoidUntil = untilMs; },
    gateWorld() { return toWorld(L2H(home, EXIT.x + 0.5, 14.6)); },
    // ---------- Usterka Rzeczywistości ----------
    setLoop(on, onCycle) {
      for (const n of npcs) {
        if (n.resident) continue;
        if (on) {
          n.inside = false; n.hidden = false; n.route = []; n.soc = null;
          const p = L2H(n.slot, gateX(n.slot), 15.2);
          const dir = SLOTS[n.slot][0] === 'N' ? 1 : -1;
          n.ur = { mode: 'loop', ax: p.x - dir * 1.6, az: p.z, dx: dir, dz: 0, d: Math.random() * 2, phase: 'walk', t: 0, onCycle };
        } else if (n.ur && n.ur.mode === 'loop') {
          n.ur = null; n.at = null; n.side = n.pos.z < 19 ? 'N' : 'S'; idle(n);
        }
      }
    },
    setAbsurd(id, kind) {
      const n = npcs.find(x => x.id === id); if (!n || n.resident) return;
      if (!kind) {
        if (n.ur && n.ur.mode === 'dance') { n.ur = null; n.root.rotation.z = 0; idle(n); }
        if (n.glitch === 'back') n.glitch = null;
        setUrOverhead(n, null);
        return;
      }
      n.inside = false; n.hidden = false;
      setUrOverhead(n, 'spiral');
      if (kind === 'dance') { n.route = []; n.ur = { mode: 'dance' }; }
      else { n.ur = null; n.glitch = 'back'; const side = n.pos.z < 19 ? 'N' : 'S'; n.at = null; n.side = side; routeTo(n, { side, x: n.pos.x + (Math.random() < 0.5 ? 16 : -16) }); n.state = 'stroll'; }
    },
    setGait(id, gait) { const n = npcs.find(x => x.id === id); if (n) n.gait = gait || null; },
    setOverhead(id, kind) {
      if (id === '*') { for (const n of npcs) if (!n.resident) setUrOverhead(n, kind); return; }
      const n = npcs.find(x => x.id === id); if (n) setUrOverhead(n, kind);
    },
    addPortal(id, slot, x, z, big = false) { if (portals.has(id)) return; const g = makePortal(id, big); g.position.copy(L2H(slot, x, z)); realG.add(g); portals.set(id, g); },
    removePortal(id) { const g = portals.get(id); if (!g) return; realG.remove(g); portals.delete(id); },
    portalWorld(id) { const g = portals.get(id); return g ? toWorld(g.position) : null; },
    slotWorld(slot, x, z) { return toWorld(L2H(slot, x, z)); },
    gnomeCount: () => gnomes.length, gnomeWorld(i) { const gn = gnomes[i]; return gn ? toWorld(gn.g.position) : null; },
    setGnomeLev(i, on) { if (gnomes[i]) gnomes[i].on = !!on; },
    setGlitch(id, type) { const n = npcs.find(x => x.id === id); if (!n) return; n.glitch = type || null;
      const ghost = type === 'ghost';
      if (n.ch) n.ch.root.traverse(m => { if (!m.isMesh || !m.material) return; const mats = Array.isArray(m.material) ? m.material : [m.material];
        if (ghost && !m.userData.ghostOrig) { m.userData.ghostOrig = m.material; m.material = Array.isArray(m.material) ? mats.map(x => { const c = x.clone(); c.transparent = true; c.opacity = 0.32; c.depthWrite = false; return c; }) : (() => { const c = m.material.clone(); c.transparent = true; c.opacity = 0.32; c.depthWrite = false; return c; })(); }
        else if (!ghost && m.userData.ghostOrig) { m.material = m.userData.ghostOrig; m.userData.ghostOrig = null; } }); },
    // trasa gracza (świat) na dowolny punkt działki/chodnika (slot, x, z) i z powrotem
    tripRoute(slot, x, z, back = false, from = null) { let pts;
      if (slot === home) { const gate = L2H(home, EXIT.x + 0.5, EXIT.z + 0.5), t = L2H(home, x, Math.min(z, 13.6)); pts = back ? [t, gate] : [gate, t]; if (back && from) pts.unshift(toH(from)); return pts.map(toWorld); } // własny ogród – prosto po podwórku
      if (!back) pts = [L2H(home, EXIT.x + 0.5, EXIT.z + 0.5)].concat(plan({ at: home }, z >= 14.5 ? { side: SLOTS[slot][0], x: L2H(slot, x, z).x, exact: L2H(slot, x, z) } : { slot, p: [x, z] }));
      else { pts = z >= 14.5 ? plan({ at: null, side: SLOTS[slot][0], pos: L2H(slot, x, z) }, { slot: home, p: [EXIT.x + 0.5, EXIT.z + 0.5] }) : plan({ at: slot }, { slot: home, p: [EXIT.x + 0.5, EXIT.z + 0.5] }); if (from) pts.unshift(toH(from)); }
      return pts.map(toWorld); },
    // ---------- skradanie ----------
    setStashes(ids) { const on = new Set(ids || []); stashG.visible = on.size > 0; for (const [id, m] of Object.entries(stashMark)) m.visible = on.has(id); },
    stashPulse(now) { if (stashG.visible) for (const m of Object.values(stashMark)) m.userData.sprite.position.y += Math.sin(now / 280) * 0.004; },
    // trasa gracza (świat) od furtki do skrytki i z powrotem; from – aktualna pozycja w świecie (przy ucieczce)
    stashRoute(id, back = false, from = null) { const st = stashMeta[id], [x, z] = stashAt[id]; let pts;
      if (!back) pts = [L2H(home, EXIT.x + 0.5, EXIT.z + 0.5)].concat(plan({ at: home }, { slot: st.slot, p: [x, z + (st.kind === 'altana' ? 1.3 : st.kind === 'door' ? 0.6 : 0.9)] }));
      else { pts = plan({ at: st.slot }, { slot: home, p: [EXIT.x + 0.5, EXIT.z + 0.5] }); if (from) pts.unshift(toH(from)); }
      return pts.map(toWorld); },
    stashWorld(id) { const st = stashMeta[id]; return st && stashAt[id] ? toWorld(L2H(st.slot, ...stashAt[id])) : null; },
    // na czyjej działce stoi punkt świata (klucz działki albo null)
    lotOf(w) { const h = toH(w); for (const k of Object.keys(SLOTS)) { if (k === 'f3') continue; const l = h.clone().applyMatrix4(MAT_INV[k]); if (l.x >= 0 && l.x <= W && l.z >= 0 && l.z <= D) return k; } return null; },
    // co widzi sąsiad: pozycja i kierunek patrzenia w świecie
    npcView(id) { const n = npcs.find(x => x.id === id); if (!n) return null; const dir = new THREE.Vector3(Math.sin(n.root.rotation.y), 0, Math.cos(n.root.rotation.y)).transformDirection(group.matrix);
      return { pos: toWorld(n.pos), dir, visible: n.root.visible && !n.inside && !n.resident && !n.hidden, state: n.state }; },
    // stożki pola widzenia na ziemi przed sąsiadami
    setCones(on, radius = 7, seeing = new Set(), half = 0.62) { for (const n of npcs) {
        if (!n.cone) { const geo = new THREE.CircleGeometry(1, 24, -Math.PI / 2 - half, half * 2); n.cone = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }));
          n.cone.rotation.x = -Math.PI / 2; n.cone.position.y = 0.05; n.cone.renderOrder = 3; n.root.add(n.cone); }
        const vis = on && n.root.visible && !n.inside && !n.resident; n.cone.visible = vis; if (!vis) continue;
        n.cone.scale.set(radius, radius, 1); const red = seeing.has(n.id); n.cone.material.color.set(red ? '#ff4d4d' : '#ffd23f'); n.cone.material.opacity = red ? 0.32 : 0.18; } },
    // sąsiad podbiega do miejsca w świecie (przyłapanie)
    charge(id, w) { const n = npcs.find(x => x.id === id); if (!n || n.resident || n.override) return; n.inside = false; n.hidden = false; if (!n.route.length && n.at) n.pos = L2H(n.at, gateX(n.at), 12.5);
      n.route = [toH(w).add(new THREE.Vector3(0.9, 0, 0.4))]; n.at = null; n.state = 'charge'; n.watchAt = toH(w); n.anim = null; },
  };
}
