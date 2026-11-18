// Budowanie domów z gotowych klocków:
//  - chaty: Quaternius "Medieval Village MegaKit" (CC0)
//  - nowoczesne: Kenney "Building Kit" (CC0)
//  - meble: Kenney "Furniture Kit" (CC0)
// Siatka budowania: komórki 2 × 2 m. Siatka ruchu postaci: kafelki 1 × 1 m.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as DET from './detale.js';

export const LOT_W = 20, LOT_D = 14;            // działka w metrach (kafelki 1 m)
export const CW = LOT_W / 2, CD = LOT_D / 2;    // działka w komórkach 2 m
export const EXIT = { x: 7, z: 13 };             // wyjście na ulicę (kafelek)

const P = 'assets/budowanie/';
export const STYLES = {
  chata: { name: 'Chata', icon: '🛖', h: 3.12,
    wall: P + 'chaty/Wall_Plaster_Straight.gltf', window: P + 'chaty/Wall_Plaster_Window_Wide_Round.gltf',
    door: P + 'chaty/Wall_Plaster_Door_Round.gltf', floor: P + 'chaty/Floor_WoodDark.gltf', corner: P + 'chaty/Corner_Exterior_Wood.gltf',
    price: { wall: 40, window: 80, door: 100, floor: 30 } },
  nowo: { name: 'Nowoczesny', icon: '🏢', h: 2.4,
    wall: P + 'nowoczesne/wall.glb', window: P + 'nowoczesne/wall-window-square.glb',
    door: P + 'nowoczesne/wall-doorway-square.glb', floor: P + 'nowoczesne/floor.glb', corner: P + 'nowoczesne/column.glb',
    roof: P + 'nowoczesne/roof-flat-center.glb',
    price: { wall: 60, window: 120, door: 140, floor: 45 } },
};
const ROOFS = { 4: [4, 6, 8], 6: [4, 6, 8, 10, 12, 14], 8: [8, 10, 12, 14] };

// ---------- wczytywanie modeli ----------
THREE.Cache.enabled = true; // każda tekstura pobierana tylko raz
const loader = new GLTFLoader(), cache = new Map();
let queue = Promise.resolve(); // modele wczytywane po kolei, żeby nie dublować pobrań tekstur
export function loadModel(url) {
  if (!cache.has(url)) {
    const pr = queue.then(() => new Promise((ok, err) => loader.load(url, g => {
      g.scene.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
      ok(g.scene);
    }, undefined, err)));
    queue = pr.catch(() => {});
    cache.set(url, pr);
  }
  return cache.get(url);
}
async function inst(url) { const s = await loadModel(url); return s.clone(true); }

// ---------- dane budowy ----------
// build = { walls: { 'h:x:z' | 'v:x:z': { t: 'wall'|'window'|'door', s: 'chata'|'nowo' } }, floors: { 'x:z': 'chata'|'nowo' } }
// 'h:x:z' – ściana pozioma od (2x, 2z) do (2x+2, 2z) w metrach; 'v:x:z' – pionowa od (2x, 2z) do (2x, 2z+2)
export function blockingEdges(build) {
  const hW = new Set(), vW = new Set();
  for (const [k, w] of Object.entries(build.walls)) {
    if (w.t === 'door') continue;
    const [d, x, z] = parse(k);
    if (d === 'h') { hW.add(`${2 * x},${2 * z}`); hW.add(`${2 * x + 1},${2 * z}`); }
    else { vW.add(`${2 * x},${2 * z}`); vW.add(`${2 * x},${2 * z + 1}`); }
  }
  return { hW, vW };
}
const parse = k => { const [d, x, z] = k.split(':'); return [d, +x, +z]; };
export const key = (d, x, z) => `${d}:${x}:${z}`;

// ---------- budowanie siatek 3D ----------
export async function buildMeshes(build, group, wallMode) {
  const g = new THREE.Group(), hs = build.hs || 1;
  const fl = build.floors, has = (x, z) => !!fl[`${x}:${z}`];
  const jobs = [];
  // podłogi
  for (const [k, s] of Object.entries(fl)) {
    const [x, z] = k.split(':').map(Number), st = STYLES[s];
    if ((build.floorMat && build.floorMat[k]) || (build._bath && build._bath.has(k))) { // luksusowa podłoga: parkiet / marmur, w łazience płytki
      const m = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), DET.floorL(build._bath && build._bath.has(k) ? 'tiles' : build.floorMat[k])); m.position.set(2 * x + 1, -0.045, 2 * z + 1); m.receiveShadow = true;
      const uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + x) * 0.5, (uv.getY(i) + z) * 0.5);
      g.add(m); continue;
    }
    jobs.push(inst(st.floor).then(o => { o.position.set(2 * x + 1, s === 'nowo' ? -0.09 : 0.005, 2 * z + 1); g.add(o); }));
  }
  // ściany
  const corners = new Map();
  for (const [k, w] of Object.entries(build.walls)) {
    const [d, x, z] = parse(k), st = STYLES[w.s];
    // po której stronie jest wnętrze?
    const inPos = d === 'h' ? has(x, z) : has(x, z), inNeg = d === 'h' ? has(x, z - 1) : has(x - 1, z);
    const exterior = inPos !== inNeg;
    const back = d === 'h' ? (inPos && !inNeg) : (inPos && !inNeg); // tylne ściany (od strony kamery daleko)
    const full = wallMode === 1 || (wallMode === 0 && back);
    const url = st[w.t] || st.wall;
    if (w.t !== 'glass') jobs.push(inst(url).then(o => {
      let rot;
      if (w.s === 'chata') rot = d === 'h' ? (inPos || !inNeg ? 0 : Math.PI) : (inPos || !inNeg ? -Math.PI / 2 : Math.PI / 2);
      else rot = d === 'h' ? Math.PI / 2 : 0;
      o.rotation.y = rot;
      o.position.set(d === 'h' ? 2 * x + 1 : 2 * x, 0, d === 'h' ? 2 * z : 2 * z + 1);
      o.scale.y = (full ? 1 : 0.13) * hs;
      o.userData.wallKey = k; g.add(o);
    }));
    if (w.t === 'window' && full && exterior) { // marszczone zasłony od środka (każde okno)
      const c = DET.curtains(1.25, st.h * hs - 0.05), inside = inPos ? 1 : -1;
      if (d === 'h') { c.position.set(2 * x + 1, 0, 2 * z + inside * 0.1); c.rotation.y = inside > 0 ? 0 : Math.PI; }
      else { c.position.set(2 * x + inside * 0.1, 0, 2 * z + 1); c.rotation.y = inside > 0 ? Math.PI / 2 : -Math.PI / 2; }
      g.add(c);
    }
    const ends = d === 'h' ? [[x, z], [x + 1, z]] : [[x, z], [x, z + 1]];
    if (exterior) ends.forEach(([cx, cz]) => corners.set(`${cx}:${cz}`, { s: w.s, full: (corners.get(`${cx}:${cz}`)?.full) || full }));
  }
  for (const [k, c] of corners) {
    const [x, z] = k.split(':').map(Number);
    jobs.push(inst(STYLES[c.s].corner).then(o => { o.position.set(2 * x, 0, 2 * z); o.scale.y = (c.full ? 1 : 0.13) * hs; g.add(o); }));
  }
  // listwy, lamperia, gzymsy, ościeżnice, parapety i kinkiety (od strony wnętrza)
  try { const t = interiorTrim(build, wallMode); g.add(t.group); t.lights.forEach(L => g.add(L)); g.userData.sconces = t.lights; } catch (e) { console.warn('Listwy i detale wnętrza', e); }
  // elewacja (cegła / beton / siding / tynk), szklane ściany i otoczenie domu
  try { g.add(exteriorSkin(build, wallMode)); } catch (e) { console.warn('Elewacja', e); }
  try { if (build.house) g.add(yardExtras(build, wallMode)); } catch (e) { console.warn('Otoczenie domu', e); }
  // dachy (tylko przy pełnych ścianach)
  if (wallMode === 1) { jobs.push(...roofs(build, g)); try { g.add(decorate(build)); } catch (e) { console.warn('Detale domu', e); } }
  await Promise.all(jobs.map(p => p.catch(e => console.warn('Brak elementu budowy', e))));
  group.clear(); group.add(g);
}
function roofs(build, g) {
  const jobs = [];
  const cells = Object.entries(build.floors);
  // nowoczesne – płaski dach na każdej komórce
  // (nowoczesne dostają dach czterospadowy w decorate())
  // chaty – jeden dach dwuspadowy nad prostokątem obejmującym podłogi chaty
  const ch = cells.filter(([, s]) => s === 'chata').map(([k]) => k.split(':').map(Number));
  if (ch.length) {
    const x0 = Math.min(...ch.map(c => c[0])), x1 = Math.max(...ch.map(c => c[0])) + 1;
    const z0 = Math.min(...ch.map(c => c[1])), z1 = Math.max(...ch.map(c => c[1])) + 1;
    const w = (x1 - x0) * 2, d = (z1 - z0) * 2, alongX = w > d;
    const a = Math.min(w, d), b = Math.max(w, d);
    const W = [4, 6, 8].reduce((p, c) => Math.abs(c - a) < Math.abs(p - a) ? c : p, 4);
    const Dd = ROOFS[W].reduce((p, c) => Math.abs(c - b) < Math.abs(p - b) ? c : p, ROOFS[W][0]);
    jobs.push(inst(P + `chaty/Roof_RoundTiles_${W}x${Dd}.gltf`).then(o => {
      const box = new THREE.Box3().setFromObject(o), sz = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
      const holder = new THREE.Group(); o.position.set(-c.x, 0, -c.z); holder.add(o);
      const sx = (a + 1.4) / sz.x, sz2 = (b + 1.0) / sz.z;
      holder.scale.set(sx, 0.72 * sx, sz2);
      if (alongX) holder.rotation.y = Math.PI / 2;
      holder.position.set((x0 + x1), STYLES.chata.h - 0.1, (z0 + z1));
      g.add(holder);
    }));
  }
  return jobs;
}

// ---------- gotowe domy (System Nieruchomości) ----------
function rect(b, s, x0, z0, x1, z1) {
  for (let x = x0; x < x1; x++) { b.walls[key('h', x, z0)] = { t: 'wall', s }; b.walls[key('h', x, z1)] = { t: 'wall', s }; }
  for (let z = z0; z < z1; z++) { b.walls[key('v', x0, z)] = { t: 'wall', s }; b.walls[key('v', x1, z)] = { t: 'wall', s }; }
  for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) b.floors[`${x}:${z}`] = s;
}
/** Bryła z kilku prostokątów (komórki 2 m): podłogi + ściany tylko na obrysie. */
function shell(b, s, rects) {
  for (const [x0, z0, x1, z1] of rects) for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) b.floors[`${x}:${z}`] = s;
  const has = (x, z) => !!b.floors[`${x}:${z}`];
  for (const k of Object.keys(b.floors)) { const [x, z] = k.split(':').map(Number);
    if (!has(x, z - 1)) b.walls[key('h', x, z)] = { t: 'wall', s }; if (!has(x, z + 1)) b.walls[key('h', x, z + 1)] = { t: 'wall', s };
    if (!has(x - 1, z)) b.walls[key('v', x, z)] = { t: 'wall', s }; if (!has(x + 1, z)) b.walls[key('v', x + 1, z)] = { t: 'wall', s }; }
}
function line(b, s, d, a, from, to) { for (let i = from; i < to; i++) b.walls[d === 'h' ? key('h', i, a) : key('v', a, i)] = { t: 'wall', s }; }
function mark(b, t, keys) { keys.forEach(k => { if (b.walls[k]) b.walls[k].t = t; }); }
function wallsOf(b, s, t, keys) { keys.forEach(k => { b.walls[k] = { t, s }; }); }
function floorAll(b, m) { for (const k of Object.keys(b.floors)) b.floorMat[k] = m; }

// 1) Przytulny Domek z Cegły – parterowy prostokąt z czerwonej cegły, drewniany ganek, dach dwuspadowy
function cottage() {
  const s = 'chata', b = { walls: {}, floors: {}, curtains: true, floorMat: {}, house: 'cottage', skin: 'brick' };
  rect(b, s, 1, 2, 7, 5);
  floorAll(b, 'oak'); b.floorMat['3:2'] = b.floorMat['4:2'] = 'terracotta';           // kuchnia – terakota
  line(b, s, 'h', 3, 1, 3); line(b, s, 'v', 3, 2, 3);                                 // łazienka
  line(b, s, 'v', 5, 2, 5);                                                            // sypialnia
  mark(b, 'door', ['h:3:5', 'v:3:2', 'v:5:4']);
  mark(b, 'window', ['h:1:2', 'h:4:2', 'h:6:2', 'v:1:3', 'v:1:4', 'v:7:2', 'v:7:4', 'h:1:5', 'h:4:5', 'h:6:5']);
  return b;
}
const COTTAGE_OBJS = [
  // mała łazienka: wanna, toaleta, umywalka
  ['bath', 2, 4], ['toilet', 4, 4], ['sink', 5, 4],
  // kompaktowa kuchnia połączona z salonem + stół z krzesłami
  ['fridge', 7, 4], ['stove', 8, 4], ['counter', 9, 4], ['table', 7, 7],
  // mały salon: kominek, dywan, kanapa, lampa, regał, telefon, roślina
  ['fireplace', 2, 6], ['rug', 2, 7], ['sofa', 2, 9, 2], ['lamp', 4, 9], ['books', 5, 6], ['phone', 9, 6], ['plant', 9, 9],
  // przytulna sypialnia
  ['bed', 11, 4], ['lamp', 10, 4], ['plant', 13, 4], ['rug', 11, 6], ['guitar', 13, 7], ['easel', 12, 9, 2], ['books', 13, 9, 2],
];

// 2) Szklany Pawilon Modernistyczny – asymetryczna bryła z płaskim dachem, przeszklenia od podłogi do sufitu, beton i czarna stal
function pavilion() {
  const s = 'nowo', b = { walls: {}, floors: {}, curtains: false, floorMat: {}, house: 'pavilion', skin: 'concrete', roof: 'flat', hs: 1.2 };
  shell(b, s, [[1, 2, 6, 6], [6, 1, 9, 4]]);
  floorAll(b, 'concrete'); for (const k of ['6:1', '7:1', '8:1', '6:2', '7:2', '8:2']) b.floorMat[k] = 'oak';  // sypialnia – dąb
  wallsOf(b, s, 'glass', ['v:3:2']); wallsOf(b, s, 'door', ['v:3:3']); line(b, s, 'h', 4, 1, 3);    // gabinet za szklaną ścianą
  wallsOf(b, s, 'wall', ['v:6:2']); wallsOf(b, s, 'door', ['v:6:3']);                                  // przejście do strefy nocnej
  wallsOf(b, s, 'door', ['v:7:3']); wallsOf(b, s, 'glass', ['h:7:3', 'h:8:3']);                       // łazienka ze szklanymi ścianami
  mark(b, 'glass', ['v:1:2', 'v:1:4', 'v:1:5', 'h:1:6', 'h:2:6', 'h:4:6', 'h:5:6', 'v:6:4', 'v:6:5', 'v:9:1', 'v:9:2', 'v:9:3', 'h:8:4']);
  mark(b, 'window', ['h:2:2', 'h:7:1', 'v:1:3']);
  mark(b, 'door', ['h:3:6', 'h:6:4']);
  return b;
}
const PAVILION_OBJS = [
  // gabinet domowy za szkłem
  ['desk', 2, 4], ['books', 4, 4], ['monstera', 5, 4], ['phone', 2, 7, 2], ['guitar', 4, 7, 2],
  // otwarta strefa dzienna: kuchnia z wyspą
  ['luxKitchen', 7, 4], ['luxFridge', 10, 4], ['kitchenIsland', 7, 6, 2],
  // salon: ściana TV, dywan, narożnik, lampa łukowa
  ['tvWall', 2, 8], ['rugLiving', 2, 9], ['sectional', 2, 10, 2], ['arcLamp', 5, 8],
  // jadalnia
  ['diningTable', 8, 9], ['chandelier', 8, 9], ['monsteraGold', 11, 11],
  // sypialnia z widokiem na łazienkę za szkłem
  ['luxBed', 13, 2], ['ficus', 12, 2], ['arcLamp', 17, 2], ['vanity', 16, 5, 2],
  // szklana łazienka
  ['walkShower', 14, 6], ['toilet', 15, 6], ['ovalBath', 16, 6],
  // taras z jacuzzi
  ['jacuzzi', 15, 9], ['palmPot', 17, 8],
];

// 3) Klasyczna Rezydencja Podmiejska – biały siding, okiennice, weranda z kolumnami
function classic() {
  const s = 'nowo', b = { walls: {}, floors: {}, curtains: true, floorMat: {}, house: 'classic', skin: 'clapboard' };
  rect(b, s, 1, 1, 9, 5);
  floorAll(b, 'parquet'); for (const k of ['2:1', '3:1', '4:1', '2:2', '3:2', '4:2']) b.floorMat[k] = 'checker';   // kuchnia w szachownicę
  for (const k of ['5:1', '6:1', '5:2', '6:2', '7:1', '8:1', '7:2', '8:2']) b.floorMat[k] = 'oak';                     // sypialnie
  line(b, s, 'v', 2, 1, 3);                         // łazienka | kuchnia
  line(b, s, 'h', 3, 1, 9);                         // część dzienna | część prywatna
  line(b, s, 'v', 5, 1, 5); line(b, s, 'v', 7, 1, 3); line(b, s, 'v', 3, 3, 5);
  mark(b, 'door', ['h:3:5', 'v:2:2', 'h:4:3', 'v:3:4', 'v:5:4', 'h:5:3', 'h:8:3']);
  mark(b, 'window', ['h:1:1', 'h:3:1', 'h:5:1', 'h:7:1', 'h:8:1', 'v:1:3', 'v:1:4', 'v:9:2', 'v:9:3', 'v:9:4', 'h:1:5', 'h:2:5', 'h:4:5', 'h:5:5', 'h:6:5', 'h:7:5', 'h:8:5']);
  return b;
}
const CLASSIC_OBJS = [
  // łazienka
  ['toilet', 2, 2], ['sink', 3, 2], ['shower', 2, 5, 2],
  // duża kuchnia z wyspą i stołem śniadaniowym
  ['fridge', 4, 2], ['stove', 5, 2], ['counter', 6, 2], ['counter', 7, 2], ['counter', 8, 2], ['plant', 9, 2], ['upperCabinets', 5, 2], ['kitchenIsland', 5, 4, 2], ['table', 8, 4],
  // hol wejściowy
  ['lamp', 6, 6], ['phone', 7, 6], ['rug', 7, 7],
  // formalna jadalnia
  ['rugDining', 2, 6], ['diningLong', 2, 6], ['chandelier', 3, 6], ['books', 5, 6], ['plant', 2, 9],
  // salon z kominkiem i pianinem
  ['fireplace', 13, 6], ['rug', 13, 7], ['sofa', 13, 9, 2], ['grandPiano', 16, 8, 2], ['books', 12, 9, 2], ['lamp', 15, 9], ['lamp', 10, 7],
  // sypialnia 1
  ['bed', 11, 2], ['lamp', 10, 2], ['plant', 13, 2], ['vanity', 12, 5, 2],
  // sypialnia 2
  ['bed', 15, 2], ['lamp', 14, 2], ['plant', 17, 2], ['desk', 14, 5, 2],
];

// 4) Willa Beverly Hills – rozłożysta willa w kształcie litery U, jasny tynk, łukowa kolumnada, taras i basen
function beverly() {
  const s = 'nowo', b = { walls: {}, floors: {}, lux: true, curtains: true, floorMat: {}, house: 'beverly', skin: 'stucco', roof: 'flat', hs: 1.25 };   // wysokie sufity 3 m
  shell(b, s, [[0, 1, 10, 4], [0, 4, 3, 6], [6, 4, 10, 6]]);
  floorAll(b, 'marble'); for (const k of ['7:1', '8:1', '9:1', '7:2', '8:2', '9:2', '7:3', '8:3', '9:3', '6:4', '7:4', '6:5', '7:5']) b.floorMat[k] = 'parquet'; // sypialnia i gabinet – parkiet
  wallsOf(b, s, 'door', ['v:3:1', 'v:3:2']); wallsOf(b, s, 'wall', ['v:3:3']);                 // kuchnia | salon (szerokie przejście)
  wallsOf(b, s, 'wall', ['v:7:1', 'v:7:2']); wallsOf(b, s, 'door', ['v:7:3']);                 // salon | apartament główny
  wallsOf(b, s, 'wall', ['h:0:4', 'h:2:4']); wallsOf(b, s, 'door', ['h:1:4']);                 // kuchnia | jadalnia
  wallsOf(b, s, 'door', ['h:6:4', 'h:9:4']); wallsOf(b, s, 'wall', ['h:7:4', 'h:8:4']);        // gabinet, łazienka SPA
  line(b, s, 'v', 8, 4, 6);                                                                     // gabinet | SPA
  mark(b, 'door', ['h:3:4']);
  mark(b, 'window', ['h:0:1', 'h:2:1', 'h:4:1', 'h:5:1', 'h:6:1', 'h:8:1', 'v:0:1', 'v:0:4', 'v:0:5', 'v:10:1', 'v:10:3', 'v:10:5', 'h:1:6', 'h:2:6', 'h:6:6', 'h:7:6', 'h:9:6', 'h:4:4', 'h:5:4', 'v:3:4', 'v:6:5']);
  return b;
}
const BEVERLY_OBJS = [
  // designerska kuchnia z marmurową wyspą i barem
  ['luxKitchen', 0, 2], ['luxFridge', 3, 2], ['upperCabinets', 0, 2], ['kitchenIsland', 1, 4, 2], ['homeBar', 4, 7, 2], ['monsteraGold', 0, 7],
  // wielki salon: kominek z TV, fortepian koncertowy, ogromny narożnik
  ['tvWall', 8, 2], ['grandPiano', 11, 2], ['statue', 13, 2], ['palmPot', 6, 2], ['rugLiving', 8, 3], ['glassTable', 9, 4], ['sectional', 8, 5, 2], ['arcLamp', 12, 5], ['chandelier', 10, 4],
  // apartament główny: łóżko, otwarta garderoba, toaletka
  ['rugBed', 15, 3], ['luxBed', 15, 2], ['ficus', 14, 2], ['monsteraGold', 19, 2], ['closet', 15, 7, 2], ['vanity', 18, 5, 2],
  // łazienka SPA z wolnostojącą wanną
  ['doubleSink', 16, 8], ['ovalBath', 17, 10, 2], ['walkShower', 16, 11, 2], ['toilet', 19, 11, 2], ['monsteraGold', 19, 8],
  // prywatny gabinet
  ['desk', 14, 11, 2], ['books', 12, 11, 2], ['phone', 15, 8], ['monstera', 13, 11],
  // jadalnia dla 8 osób
  ['rugDining', 1, 8], ['diningGrand', 1, 9], ['chandelier', 2, 9], ['artLeft', 0, 10], ['monsteraGold', 0, 8],
];

export const HOUSES = [
  { id: 'start', name: 'Przytulny Domek z Cegły', short: 'Domek z Cegły', tier: 'Startowy · skromny', icon: '🧱', price: 25000, mood: 0,
    desc: 'Parterowy domek z czerwonej cegły z drewnianym gankiem i dwuspadowym dachem. W środku ciepły styl vintage i rustykalny: kompaktowa kuchnia z terakotą połączona z małym salonem z kominkiem, przytulna sypialnia i mała łazienka z wanną.',
    rooms: ['🍳 Kuchnia + salon', '🛏️ Sypialnia', '🛁 Łazienka'], build: cottage, objs: COTTAGE_OBJS, sim: [7, 8] },
  { id: 'town', name: 'Szklany Pawilon Modernistyczny', short: 'Szklany Pawilon', tier: 'Średni · nowoczesny', icon: '🧊', price: 65000, mood: 4,
    desc: 'Asymetryczna bryła z płaskim dachem, przeszklenia od podłogi do sufitu, beton architektoniczny i czarna stal. Otwarta strefa dzienna z wyspą kuchenną, gabinet za szklaną ścianą, sypialnia z łazienką za szkłem i taras z jacuzzi.',
    rooms: ['🛋️ Otwarta strefa dzienna', '💻 Gabinet', '🛏️ Sypialnia', '🚿 Szklana łazienka', '🫧 Taras z jacuzzi'], build: pavilion, objs: PAVILION_OBJS, sim: [7, 10] },
  { id: 'classic', name: 'Klasyczna Rezydencja Podmiejska', short: 'Klasyczna Rezydencja', tier: 'Styl Wisteria Lane', icon: '🏡', price: 95000, mood: 6,
    desc: 'Biały siding, okiennice i szeroka weranda z kolumnami. Klasyczny hol wejściowy, formalna jadalnia, salon z kominkiem i pianinem, duża kuchnia w szachownicę, dwie sypialnie i ogród pełen hortensji.',
    rooms: ['🚪 Hol', '🍽️ Jadalnia', '🎹 Salon z kominkiem', '🍳 Duża kuchnia', '🛏️ 2 sypialnie', '🌸 Ogród z hortensjami'], build: classic, objs: CLASSIC_OBJS, sim: [8, 8] },
  { id: 'villa', name: 'Willa Beverly Hills', short: 'Willa Beverly Hills', tier: 'Ekskluzywna rezydencja', icon: '🌴', price: 180000, mood: 10,
    desc: 'Rozłożysta willa w kształcie litery U z jasnym tynkiem, łukową kolumnadą przy wejściu, tarasami i palmami. Wielki salon z kominkiem, fortepianem i narożnikiem, designerska kuchnia z marmurową wyspą i barem, jadalnia dla 8 osób, apartament z garderobą i toaletką, łazienka SPA, gabinet. Na zewnątrz podświetlany basen, drewniany taras, pergola i leżaki.',
    rooms: ['🛋️ Wielki salon', '🍸 Kuchnia z barem', '🍽️ Jadalnia dla 8', '👑 Apartament główny', '🛁 Łazienka SPA', '💼 Gabinet', '🏊 Basen i pergola'], build: beverly, objs: BEVERLY_OBJS, sim: [7, 6] },
];

// ---------- meble z Kenney Furniture Kit ----------
// m – model, s – skala (domyślnie 2), top – postaw na poprzednim elemencie, dz/dx – przesunięcie
export const KENNEY = {
  bed: [{ m: 'bedDouble' }], sofa: [{ m: 'loungeSofa' }], designSofa: [{ m: 'loungeDesignSofa' }],
  fridge: [{ m: 'kitchenFridgeLarge' }], stove: [{ m: 'kitchenStove' }], counter: [{ m: 'kitchenCabinetDrawer' }],
  toilet: [{ m: 'toilet' }], shower: [{ m: 'shower' }], sink: [{ m: 'bathroomSink' }], bath: [{ m: 'bathtub' }],
  books: [{ m: 'bookcaseOpen' }], lamp: [{ m: 'lampSquareFloor' }], plant: [{ m: 'pottedPlant' }], rug: [{ m: 'rugRectangle', flat: true }],
  table: [{ m: 'table' }, { m: 'chair', dx: -0.45, dz: 0.55, ry: Math.PI, free: true }, { m: 'chair', dx: 0.45, dz: 0.55, ry: Math.PI, free: true }],
  tv: [{ m: 'cabinetTelevision' }, { m: 'televisionModern', top: true }],
  desk: [{ m: 'desk' }, { m: 'computerScreen', top: true, dz: -0.15 }, { m: 'computerKeyboard', top: true, dz: 0.1 }, { m: 'chairDesk', free: true, dz: 0.75, ry: Math.PI }],
  speaker: [{ m: 'speaker' }], coffeeTable: [{ m: 'tableCoffeeGlass' }],
};
/** Zwraca grupę z meblem dopasowanym do pola w×d (wycentrowaną, frontem do +z) lub null. */
export async function kenneyFurniture(type, w, d) {
  const parts = KENNEY[type]; if (!parts) return null;
  const g = new THREE.Group(); let topY = 0, baseScale = 2;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const o = await inst(P + `meble/${p.m}.glb`);
    const holder = new THREE.Group(); holder.add(o);
    let box = new THREE.Box3().setFromObject(o), sz = box.getSize(new THREE.Vector3());
    let s = p.s || 2;
    if (i === 0 && !p.free) { s = Math.min(s, (w * 0.96) / sz.x, (d * 0.96) / sz.z); baseScale = s; }
    else s = Math.min(s, baseScale * 1.0) || s;
    o.scale.multiplyScalar(s);
    box = new THREE.Box3().setFromObject(o); const c = box.getCenter(new THREE.Vector3());
    o.position.sub(new THREE.Vector3(c.x, box.min.y, c.z));
    if (p.ry) holder.rotation.y = p.ry;
    holder.position.set(p.dx || 0, p.top ? topY : 0, p.dz || 0);
    if (p.flat) holder.position.y = 0.005;
    if (p.hide) holder.visible = false;
    if (i === 0) topY = box.max.y - box.min.y;
    g.add(holder);
  }
  return g;
}

// ---------- detale zewnętrzne domu gracza (tryb pełnych ścian) ----------
const DECO = {
  chata: { wy: 1.62, ww: 1.3, wh: 1.25, t: 0.2, dw: 1.1, dh: 2.35, shutter: '#2f5a3a' },
  nowo: { wy: 1.25, ww: 0.95, wh: 0.95, t: 0.12, dw: 1.0, dh: 2.05, shutter: '#2b2f36' },
};
function decorate(build) {
  const g = new THREE.Group(), fl = build.floors, has = (x, z) => !!fl[`${x}:${z}`];
  let front = null;
  for (const [k, w] of Object.entries(build.walls)) {
    const [d, x, z] = parse(k), inPos = has(x, z), inNeg = d === 'h' ? has(x, z - 1) : has(x - 1, z);
    if (inPos === inNeg) continue; // ściana wewnętrzna
    const out = inNeg ? 1 : -1, st = DECO[w.s] || DECO.chata, tt = build.skin ? (w.s === 'chata' ? 0.37 : 0.17) : st.t, plain = build.lux || build.house === 'pavilion';
    let px, pz, ry;
    if (d === 'h') { px = 2 * x + 1; pz = 2 * z + out * tt; ry = out > 0 ? 0 : Math.PI; }
    else { px = 2 * x + out * tt; pz = 2 * z + 1; ry = out > 0 ? Math.PI / 2 : -Math.PI / 2; }
    let u = null;
    if (w.t === 'window') u = plain ? null : DET.windowUnit({ w: st.ww, h: st.wh, glass: false, frame: false, shutter: build.house === 'classic' ? '#1f2a36' : st.shutter, flowers: build.house !== 'classic', seed: x + z });
    if (w.t === 'door') {
      u = plain ? null : DET.doorUnit({ w: st.dw, h: st.dh, panel: false, frame: false, roofColor: '#3b3f46', canopy: build.house !== 'classic', ...(build.house === 'classic' ? { color: '#7a1f2b' } : {}) });
      if (d === 'h' && out > 0 && (!front || z > front.z)) front = { x: px, z: 2 * z, s: w.s };
    }
    if (!u) continue;
    u.position.set(px, w.t === 'window' ? st.wy : 0, pz); u.rotation.y = ry; g.add(u);
  }
  // ganek przed głównymi drzwiami (od strony ulicy)
  if (build.roof === 'flat') { flatRoof(build, g); return DET.mergeStatic(g); }
  if (front && build.lux) DET.luxEntrance(g, front.x, front.z + 0.12, STYLES[front.s].h - 0.1);
  else if (front && (!build.house || build.house === 'cottage')) { const st = DECO[front.s] || DECO.chata, p = DET.porch({ w: 4.2, d: 1.9, floorY: 0, h: STYLES[front.s].h - 0.2, roofColor: '#3b3f46' }); p.position.set(front.x, 0, front.z + st.t + 0.02); g.add(p); }
  // dach czterospadowy nad częścią nowoczesną + kominy
  for (const s of ['nowo', 'chata']) {
    const cells = Object.entries(fl).filter(([, v]) => v === s).map(([k]) => k.split(':').map(Number)); if (!cells.length) continue;
    const x0 = Math.min(...cells.map(c => c[0])), x1 = Math.max(...cells.map(c => c[0])) + 1, z0 = Math.min(...cells.map(c => c[1])), z1 = Math.max(...cells.map(c => c[1])) + 1;
    const W = (x1 - x0) * 2, D = (z1 - z0) * 2, h = STYLES[s].h;
    let top = 3.2;
    if (s === 'nowo' && build.lux) { DET.luxVilla(g, 2 * x0, 2 * x1, 2 * z0, 2 * z1, h); continue; }
    if (s === 'nowo') { const rg = new THREE.Group(); rg.position.set(x0 + x1, h + 0.05, z0 + z1); g.add(rg); top = DET.hipRoof(rg, W, D, 0.5, 0.55, DET.M('roof', '#3b3f46'), DET.M('trim')); }
    DET.chimney(g, 2 * x0 - 0.45, 0, z0 + z1 - D * 0.2, h + top + 0.5);
  }
  return DET.mergeStatic(g);
}

// ---------- elewacje, szklane ściany, płaskie dachy i otoczenie domów (System Nieruchomości) ----------
function facadeTex(draw, size = 256) { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
let fseed = 77; const frnd = () => (fseed = (fseed * 16807) % 2147483647) / 2147483647;
const SKIN_MAT = {};
function skinMat(skin) {
  if (SKIN_MAT[skin]) return SKIN_MAT[skin];
  let m;
  if (skin === 'brick') { m = DET.M('brick', '#c4553c').clone(); m.userData.tile = 'wall'; m.userData.phRough = 1; DET.usePH(m, 'brick', 1); }
  else if (skin === 'clapboard') m = DET.M('siding', '#ffffff');
  else if (skin === 'concrete') { // beton architektoniczny: płyty szalunkowe 1 × 0,5 m z otworami po ściągach
    const t = facadeTex((x, s) => { x.fillStyle = '#bdb9b1'; x.fillRect(0, 0, s, s);
      for (let i = 0; i < 2600; i++) { const v = 160 + frnd() * 60; x.fillStyle = `rgba(${v},${v},${v - 4},.35)`; x.fillRect(frnd() * s, frnd() * s, 2 + frnd() * 3, 2 + frnd() * 3); }
      x.strokeStyle = 'rgba(80,78,74,.45)'; x.lineWidth = 2; x.strokeRect(1, 1, s - 2, s / 2 - 2); x.strokeRect(1, s / 2 + 1, s - 2, s / 2 - 2);
      x.fillStyle = 'rgba(60,58,55,.6)'; for (const [a, b] of [[0.18, 0.12], [0.82, 0.12], [0.18, 0.38], [0.82, 0.38], [0.18, 0.62], [0.82, 0.62], [0.18, 0.88], [0.82, 0.88]]) { x.beginPath(); x.arc(a * s, b * s, 3.2, 0, 7); x.fill(); } });
    m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.92 }); m.userData.tile = 'wall'; m.userData.phColor = '#cfccc5'; m.userData.phRough = 1; DET.usePH(m, 'concrete', 1);
  } else { // jasny tynk (stiuk)
    const t = facadeTex((x, s) => { x.fillStyle = '#f4ead9'; x.fillRect(0, 0, s, s); for (let i = 0; i < 3000; i++) { const v = 225 + frnd() * 30; x.fillStyle = `rgba(${v},${v - 8},${v - 22},.4)`; x.fillRect(frnd() * s, frnd() * s, 1 + frnd() * 2.5, 1 + frnd() * 2.5); } });
    m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }); m.userData.tile = 'wall';
  }
  return (SKIN_MAT[skin] = m);
}
const steelM = new THREE.MeshStandardMaterial({ color: '#16181c', roughness: 0.4, metalness: 0.6 });
const paneM = new THREE.MeshPhysicalMaterial({ color: '#cfe6f2', roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.28, clearcoat: 1, depthWrite: false });
// otwory w ścianach: od środka segmentu (u), od podłogi (y)
const OPEN = { chata: { win: [0.65, 1.0, 2.25], door: [0.575, 2.35] }, nowo: { win: [0.475, 0.775, 1.725], door: [0.5, 2.05] } };
/** Okładzina zewnętrzna (cegła / siding / beton / tynk) z otworami na okna i drzwi + szklane ściany ze stalowymi szprosami. */
function exteriorSkin(build, wallMode) {
  const g = new THREE.Group(), fl = build.floors, has = (x, z) => !!fl[`${x}:${z}`];
  const M = build.skin ? skinMat(build.skin) : null;
  for (const [k, w] of Object.entries(build.walls)) {
    const [d, x, z] = parse(k), inPos = has(x, z), inNeg = d === 'h' ? has(x, z - 1) : has(x - 1, z);
    const exterior = inPos !== inNeg, back = inPos && !inNeg, full = wallMode === 1 || (wallMode === 0 && back);
    const hs = build.hs || 1, H = STYLES[w.s].h * hs, hh = full ? H : H * 0.13;
    const cx = d === 'h' ? 2 * x + 1 : 2 * x, cz = d === 'h' ? 2 * z : 2 * z + 1, ry = d === 'h' ? 0 : Math.PI / 2;
    const put = (u, off, y, wd, ht, dp, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(wd, ht, dp), m); o.position.set(d === 'h' ? cx + u : cx + off, y, d === 'h' ? cz + off : cz + u); o.rotation.y = ry; g.add(o); return o; };
    if (w.t === 'glass') { // szkło od podłogi do sufitu w czarnej stalowej ramie
      put(0, 0, hh / 2, 1.96, hh, 0.025, paneM).renderOrder = 2;
      for (const u of [-0.985, 0.985]) put(u, 0, hh / 2, 0.05, hh, 0.09, steelM);
      put(0, 0, 0.03, 2, 0.06, 0.1, steelM); if (full) { put(0, 0, hh - 0.03, 2, 0.06, 0.1, steelM); put(0, 0, 1.0, 2, 0.035, 0.05, steelM); }
      continue;
    }
    if (!exterior || !M) continue;
    const out = inNeg && !inPos ? 1 : -1;                       // strona zewnętrzna (+ dla h: +z, dla v: +x)
    const T = TRIM[w.s] || TRIM.nowo, o = (w.s === 'chata' ? T.outT : 0.11) + 0.016, off = out * o;
    // przedłużenie przy narożnikach wypukłych, skrócenie przy wklęsłych
    const oc = out > 0 ? 0 : -1;                                  // indeks komórki po stronie zewnętrznej
    const nb = s2 => d === 'h' ? has(x + s2, z + oc) : has(x + oc, z + s2);
    const e0 = nb(-1) ? -(o + 0.03) : (o + 0.03), e1 = nb(1) ? -(o + 0.03) : (o + 0.03);
    const a = -1 - e0, b = 1 + e1, O0 = OPEN[w.s] || OPEN.nowo, O = { win: [O0.win[0], O0.win[1] * hs, O0.win[2] * hs], door: [O0.door[0], O0.door[1] * hs] };
    const seg = (u0, u1, y0, y1) => { if (u1 - u0 < 0.01 || Math.min(y1, hh) - y0 < 0.01) return; const top = Math.min(y1, hh); put((u0 + u1) / 2, off, (y0 + top) / 2, u1 - u0, top - y0, 0.03, M); };
    if (w.t === 'window') { const [hw, yb, yt] = O.win; seg(a, -hw, 0, hh); seg(hw, b, 0, hh); seg(-hw, hw, 0, yb); seg(-hw, hw, yt, hh); }
    else if (w.t === 'door') { const [hw, yt] = O.door; seg(a, -hw, 0, hh); seg(hw, b, 0, hh); seg(-hw, hw, yt, hh); }
    else seg(a, b, 0, hh);
    if (build.skin === 'brick' && full) { // cokół i nadproża z ciemniejszej cegły
      const dark = DET.M('brick', '#8f3a2a');
      put(0, off + out * 0.02, 0.2, 2 + e0 + e1, 0.4, 0.02, dark);
      if (w.t === 'window') put(0, off + out * 0.03, O.win[2] + 0.08, O.win[0] * 2 + 0.3, 0.16, 0.04, dark);
      if (w.t === 'window') put(0, off + out * 0.05, O.win[1] - 0.04, O.win[0] * 2 + 0.2, 0.06, 0.12, DET.M('stone', '#d8d2c5'));
    }
    if (build.skin === 'stucco' && full && w.t === 'window') { // łuk nad oknem i kamienny parapet
      const arc = new THREE.Mesh(new THREE.TorusGeometry(O.win[0] + 0.06, 0.06, 6, 18, Math.PI), DET.M('paint', '#efe2c8'));
      arc.position.set(d === 'h' ? cx : cx + off + out * 0.03, O.win[2], d === 'h' ? cz + off + out * 0.03 : cz); arc.rotation.y = ry; g.add(arc);
      put(0, off + out * 0.05, O.win[1] - 0.04, O.win[0] * 2 + 0.24, 0.07, 0.14, DET.M('stone', '#e8dfcf'));
    }
  }
  g.traverse(o => { if (o.isMesh) { o.castShadow = o.material !== paneM; o.receiveShadow = true; } });
  const glass = []; g.traverse(o => { if (o.isMesh && o.material === paneM) glass.push(o); });
  glass.forEach(o => g.remove(o));
  const merged = DET.mergeStatic(g); glass.forEach(o => { o.castShadow = false; merged.add(o); });
  return merged;
}
/** Płaski dach: strop nad każdą komórką + okap na obrysie (pawilon: czarna stal i LED, willa: biała attyka z gzymsem). */
function flatRoof(build, g) {
  const fl = build.floors, has = (x, z) => !!fl[`${x}:${z}`], villa = build.house === 'beverly';
  const hs = build.hs || 1, slab = villa ? DET.M('paint', '#ddd6cb') : DET.M('paint', '#e9e7e2'), wallC = DET.M('paint', '#f6efe2'), edge = villa ? DET.M('paint', '#efe2c8') : steelM;
  for (const [k, s] of Object.entries(fl)) { const [x, z] = k.split(':').map(Number); DET.box(g, 2.02, 0.26, 2.02, slab, 2 * x + 1, STYLES[s].h * hs + 0.13, 2 * z + 1); }
  const ov = villa ? 0.35 : 0.75;
  for (const [k, w] of Object.entries(build.walls)) {
    const [d, x, z] = parse(k), inPos = has(x, z), inNeg = d === 'h' ? has(x, z - 1) : has(x - 1, z); if (inPos === inNeg) continue;
    const out = inNeg ? 1 : -1, oc = out > 0 ? 0 : -1, nb = s2 => d === 'h' ? has(x + s2, z + oc) : has(x + oc, z + s2);
    const e0 = nb(-1) ? -ov : ov, e1 = nb(1) ? -ov : ov, L = 2 + e0 + e1, u = (e1 - e0) / 2, h = STYLES[w.s].h * hs;
    const at = (off, y, wd, ht, dp, m) => { const px = d === 'h' ? 2 * x + 1 + u : 2 * x + off, pz = d === 'h' ? 2 * z + off : 2 * z + 1 + u; DET.box(g, d === 'h' ? wd : dp, ht, d === 'h' ? dp : wd, m, px, y, pz); };
    at(out * ov / 2, h + 0.13, L, 0.26, ov, slab);
    if (villa) { at(out * (ov - 0.08), h + 0.5, L, 0.5, 0.16, wallC); at(out * (ov - 0.02), h + 0.78, L + 0.1, 0.08, 0.26, edge); at(out * (ov - 0.02), h + 0.02, L, 0.1, 0.22, edge); }
    else { at(out * (ov - 0.03), h + 0.13, L, 0.34, 0.06, steelM); at(out * (ov - 0.12), h - 0.02, L, 0.03, 0.05, DET.ledMat); }
  }
}
// pomocnicze elementy ogrodu
const leafM = c => DET.M('paint', c);
function hydrangea(g, x, z, r0 = 0.42, seed = 0) { const F = ['#c7b3ff', '#9ec5ff', '#ffc2dd', '#ffffff', '#b9d4ff'];
  DET.sph(g, r0, leafM('#3f8a45'), x, r0 * 0.75, z, 0.85);
  for (let k = 0; k < 7; k++) { const a = k * 0.9 + seed; DET.sph(g, 0.12, leafM(F[(seed + k) % 5]), x + Math.cos(a) * r0 * 0.7, r0 * 1.15 + (k % 2) * 0.06, z + Math.sin(a) * r0 * 0.7); } }
function palm(g, x, z, h = 4.2, lean = 0.2) {
  const trunk = DET.M('paint', '#9a7a55'), leaf = DET.M('paint', '#3f8a3a');
  for (let i = 0; i < 8; i++) { const t = i / 8; DET.cyl(g, 0.16 - t * 0.05, h / 8 + 0.02, trunk, x + lean * t * t * 2, (i + 0.5) * h / 8, z); }
  const tx = x + lean * 2, ty = h;
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, f = DET.box(g, 0.32, 0.04, 1.9, leaf, tx + Math.cos(a) * 0.85, ty - 0.25, z + Math.sin(a) * 0.85, -a + Math.PI / 2, 0.45); f.rotation.order = 'YXZ'; f.rotation.set(0.45, -a + Math.PI / 2, 0); }
  DET.sph(g, 0.22, DET.M('paint', '#6b5a2a'), tx, ty - 0.1, z);
}
function planter(g, x, z, w = 0.9, d = 0.45, grass = true) { DET.box(g, w, 0.5, d, DET.M('paint', '#2b2f36'), x, 0.25, z); if (grass) for (let i = 0; i < 6; i++) { const b = DET.box(g, 0.05, 0.7, 0.05, leafM(i % 2 ? '#7aa35a' : '#9cbf6a'), x - w / 2 + 0.12 + i * (w - 0.24) / 5, 0.75, z, 0, (i % 3 - 1) * 0.2); b.castShadow = false; } }
/** Otoczenie domu zależne od architektury. Elementy wysokie (dachy werandy, kolumny) tylko przy pełnych ścianach. */
function yardExtras(build, wallMode) {
  const g = new THREE.Group(), tall = wallMode === 1, H = build.house;
  if (H === 'cottage') { // drewno na opał, ławka, grządki kwiatów i latarnia
    const wood = DET.M('paint', '#8a5a32'), log = DET.M('paint', '#a8784a');
    DET.box(g, 0.1, 1.2, 1.6, wood, 14.75, 0.6, 6.2); for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { const c = DET.cyl(g, 0.11, 0.55, log, 14.5, 0.13 + r * 0.22, 5.55 + i * 0.25); c.rotation.x = Math.PI / 2; }
    const bench = new THREE.Group(); bench.position.set(10.6, 0, 11.2); g.add(bench); DET.box(bench, 1.4, 0.06, 0.4, wood, 0, 0.45, 0); DET.box(bench, 1.4, 0.4, 0.05, wood, 0, 0.7, -0.18); for (const s of [-0.6, 0.6]) DET.box(bench, 0.06, 0.45, 0.36, wood, s, 0.22, 0);
    const F = ['#ff6b8a', '#ffd23f', '#ffffff', '#c58bff', '#ff9a3c'];
    for (const [x0, x1] of [[2.2, 5.6], [8.6, 13.8]]) { DET.box(g, x1 - x0, 0.14, 0.5, DET.M('paint', '#6b4a30'), (x0 + x1) / 2, 0.07, 10.75); for (let x = x0 + 0.2; x < x1; x += 0.32) { DET.sph(g, 0.1, leafM('#4f8a3f'), x, 0.2, 10.75); DET.sph(g, 0.06, leafM(F[Math.round(x * 3) % 5]), x, 0.3, 10.75); } }
    if (tall) { DET.cyl(g, 0.04, 1.6, DET.M('paint', '#2b2b2b'), 9.2, 0.8, 12.6); DET.box(g, 0.22, 0.3, 0.22, DET.lampMat, 9.2, 1.75, 12.6); }
  }
  if (H === 'pavilion') { // drewniany taras przed sypialnią, donice z trawami, płyty betonowe
    const deck = DET.L('deck'), dg = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.05, 4.4), deck); dg.position.set(15.3, 0.02, 10.2); dg.receiveShadow = true;
    const uv = dg.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 3, uv.getY(i) * 2); g.add(dg);
    for (const x of [12.6, 18.2]) planter(g, x, 12.1, 0.8, 0.4); planter(g, 18.3, 8.6, 0.5, 0.9);
    for (let i = 0; i < 4; i++) DET.box(g, 1.1, 0.03, 0.6, DET.M('stone', '#c9c5bd'), 9.2 + i * 1.3, 0.015, 12.8);
    for (const x of [12.3, 18.3]) DET.box(g, 0.08, 0.06, 4.2, DET.ledMat, x, 0.05, 10.2);
    if (tall) { // stalowa pergola nad tarasem
      for (const [x, z] of [[12.4, 12.3], [18.4, 12.3]]) DET.box(g, 0.1, 2.4, 0.1, steelM, x, 1.2, z);
      DET.box(g, 6.1, 0.12, 0.12, steelM, 15.4, 2.4, 12.3); for (let x = 12.6; x < 18.4; x += 0.45) DET.box(g, 0.05, 0.08, 4.3, steelM, x, 2.42, 10.2);
    }
  }
  if (H === 'classic') { // szeroka weranda z kolumnami, balustradą i hortensjami
    const white = DET.M('paint', '#fbfaf6'), roofM = DET.M('roof', '#4a4f57');
    const fz0 = 10.1, fz1 = 12.5, sx0 = 18.1, sx1 = 19.6, bt = DET.LUXTEX.concrete.clone(); bt.needsUpdate = true; bt.repeat.set(0.45, 0.45); bt.rotation = Math.PI / 2;
    const boards = new THREE.MeshStandardMaterial({ map: bt, color: '#c4ccd4', roughness: 0.75 }); boards.userData.tile = 'wall';
    for (const [w, d, x, z] of [[18.2, fz1 - fz0, 10, (fz0 + fz1) / 2], [sx1 - sx0, 8.2, (sx0 + sx1) / 2, 8.4]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), boards); m.position.set(x, 0.02, z); m.receiveShadow = true; g.add(m); }
    const cols = []; for (let x = 1.2; x <= 19.3; x += 2.4) cols.push([x, fz1 - 0.15]); for (let z = 4.6; z < fz1 - 1; z += 2.4) cols.push([sx1 - 0.15, z]);
    const gap = x => Math.abs(x - 7) < 1.3;
    for (let i = 0; i < 17; i++) { const x = 1.6 + i * 1.1; if (gap(x)) continue; hydrangea(g, x, 13.2, 0.38, i); }
    for (let z = 2.6; z < 9.5; z += 1.3) hydrangea(g, 0.9, z, 0.4, Math.round(z));
    if (tall) {
      const h = STYLES.nowo.h;
      for (const [x, z] of cols) { DET.cyl(g, 0.13, h, white, x, h / 2, z); DET.box(g, 0.34, 0.12, 0.34, white, x, 0.06, z); DET.box(g, 0.34, 0.1, 0.34, white, x, h - 0.05, z); }
      // balustrada z tralkami (przerwa na schody przed drzwiami)
      const rail = (x0, x1, z) => { DET.box(g, x1 - x0, 0.06, 0.08, white, (x0 + x1) / 2, 0.9, z); DET.box(g, x1 - x0, 0.05, 0.06, white, (x0 + x1) / 2, 0.12, z); for (let x = x0 + 0.1; x < x1; x += 0.14) DET.box(g, 0.035, 0.76, 0.035, white, x, 0.5, z); };
      rail(1.2, 5.6, fz1 - 0.15); rail(8.4, 19.4, fz1 - 0.15);
      for (let z = 4.6; z < fz1 - 1; z += 0.14) DET.box(g, 0.035, 0.76, 0.035, white, sx1 - 0.15, 0.5, z); DET.box(g, 0.08, 0.06, fz1 - 4.6, white, sx1 - 0.15, 0.9, (4.6 + fz1) / 2);
      // daszek werandy (lekki spadek) z belką
      const r1 = DET.box(g, 19.0, 0.1, fz1 - fz0 + 0.5, roofM, 10.2, h + 0.18, (fz0 + fz1) / 2 + 0.15); r1.rotation.x = 0.1;
      const r2 = DET.box(g, sx1 - sx0 + 0.5, 0.1, 8.0, roofM, (sx0 + sx1) / 2 + 0.15, h + 0.18, 6.2); r2.rotation.z = -0.1;
      DET.box(g, 18.6, 0.2, 0.14, white, 10.2, h + 0.02, fz1 - 0.15); DET.box(g, 0.14, 0.2, 8.0, white, sx1 - 0.15, h + 0.02, 8.4);
      // schodki, lampy przy drzwiach i huśtawka na werandzie
      for (let i = 0; i < 2; i++) DET.box(g, 2.2, 0.1, 0.35, white, 7, 0.05, fz1 + 0.2 + i * 0.3);
      for (const x of [5.75, 8.25]) DET.box(g, 0.16, 0.26, 0.12, DET.lampMat, x, 1.9, 10.2);
      const sw = new THREE.Group(); sw.position.set(14.5, 0, 11.6); g.add(sw); DET.box(sw, 1.5, 0.07, 0.5, white, 0, 0.5, 0); DET.box(sw, 1.5, 0.45, 0.05, white, 0, 0.75, -0.22); for (const s of [-0.72, 0.72]) DET.box(sw, 0.02, h - 0.55, 0.02, DET.M('metal', '#888'), s, (h + 0.5) / 2, 0); DET.box(sw, 1.3, 0.1, 0.42, DET.L('linen', '#9ec5ff'), 0, 0.58, 0);
    }
  }
  if (H === 'beverly') { // łukowa kolumnada przed wejściem, kamienna posadzka, palmy i fontanna
    const stone = DET.M('stone', '#e8dfcf'), st2 = DET.M('paint', '#f6efe2'), cream = DET.M('paint', '#efe2c8');
    DET.box(g, 6.0, 0.05, 2.6, stone, 9, 0.025, 9.3);                       // posadzka pod kolumnadą
    for (let i = 0; i < 4; i++) DET.box(g, 1.8, 0.04, 0.55, stone, 7, 0.02, 10.9 + i * 0.75); // ścieżka
    // fontanna na dziedzińcu
    DET.cyl(g, 0.95, 0.4, stone, 10.6, 0.2, 11.4); const wat = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.04, 24), new THREE.MeshStandardMaterial({ color: '#4fd6f0', emissive: '#28b8ff', emissiveIntensity: 0.4, roughness: 0.05, transparent: true, opacity: 0.9 })); wat.position.set(10.6, 0.39, 11.4); g.add(wat);
    DET.cyl(g, 0.12, 0.9, stone, 10.6, 0.7, 11.4); DET.cyl(g, 0.4, 0.08, stone, 10.6, 1.15, 11.4);
    for (const [x, z] of [[0.6, 12.9], [5.4, 12.9], [12.6, 12.9], [19.4, 12.9]]) { DET.box(g, 0.7, 0.6, 0.7, cream, x, 0.3, z); DET.sph(g, 0.35, leafM('#3f8f3a'), x, 0.85, z); }
    if (tall) {
      const h = STYLES.nowo.h * (build.hs || 1), cz = 10.3;
      for (const x of [6.2, 9.0, 11.8]) { DET.cyl(g, 0.17, h, st2, x, h / 2, cz); DET.box(g, 0.44, 0.16, 0.44, cream, x, 0.08, cz); DET.box(g, 0.46, 0.14, 0.46, cream, x, h - 0.07, cz); }
      for (const [a, b] of [[6.2, 9.0], [9.0, 11.8]]) { const r = (b - a) / 2 - 0.17, arc = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 8, 20, Math.PI), st2); arc.position.set((a + b) / 2, h - 0.12 - r * 0.55, cz); arc.scale.y = 0.55; g.add(arc);
        DET.box(g, b - a, 0.5, 0.3, st2, (a + b) / 2, h - 0.25, cz); }
      DET.box(g, 6.4, 0.24, 2.7, st2, 9, h + 0.12, 9.2); DET.box(g, 6.6, 0.1, 2.9, cream, 9, h + 0.27, 9.2);
      for (const x of [7.6, 10.4]) { DET.cyl(g, 0.02, 0.5, DET.L('gold'), x, h - 0.25, 9.3); DET.sph(g, 0.14, DET.lampMat, x, h - 0.55, 9.3); }
      palm(g, 6.4, 12.4, 4.4, 0.15); palm(g, 13.2, 12.6, 4.0, -0.18); palm(g, -0.2, 0.6, 4.6, 0.1);
    }
  }
  return DET.mergeStatic(g);
}


// ---------- architektura wnętrza: listwy przypodłogowe, lamperia, gzyms, ościeżnice z łukiem, parapety, kinkiety ----------
const TRIM = { chata: { h: 3.12, inT: 0.092, outT: 0.314, dw: 1.15, dh: 2.35, wb: 1.0, ww: 1.3 }, nowo: { h: 2.4, inT: 0.055, outT: 0.055, dw: 1.0, dh: 2.05, wb: 0.78, ww: 0.95 } };
function interiorTrim(build, wallMode) {
  const g = new THREE.Group(), fl = build.floors, has = (x, z) => !!fl[`${x}:${z}`], lights = [];
  const white = new THREE.MeshStandardMaterial({ color: '#f6f3ec', roughness: 0.55 }), cream = new THREE.MeshStandardMaterial({ color: '#efe7d8', roughness: 0.6 });
  const potM = new THREE.MeshStandardMaterial({ color: '#c96f4a', roughness: 0.8 }), leafM = new THREE.MeshStandardMaterial({ color: '#4f8a3f', roughness: 0.7 });
  const gold = DET.L('gold'), glow = DET.L('glow', '#ffe2a8');
  const bx = (w, h, d, m, x, y, z, ry) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o; };
  const cand = [];
  for (const [k, w] of Object.entries(build.walls)) {
    if (w.t === 'glass') continue;
    const T0 = TRIM[w.s] || TRIM.chata, hk = build.hs || 1, T = hk === 1 ? T0 : { ...T0, h: T0.h * hk, dh: T0.dh * hk, wb: T0.wb * hk }, [d, x, z] = parse(k);
    const inPos = has(x, z), inNeg = d === 'h' ? has(x, z - 1) : has(x - 1, z), exterior = inPos !== inNeg;
    const back = inPos && !inNeg, full = wallMode === 1 || (wallMode === 0 && back);
    // kierunek lokalnego +Z modułu (dla chaty ściana jest niesymetryczna)
    let rot; if (w.s === 'chata') rot = d === 'h' ? (inPos || !inNeg ? 0 : Math.PI) : (inPos || !inNeg ? -Math.PI / 2 : Math.PI / 2); else rot = d === 'h' ? Math.PI / 2 : 0;
    const lz = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
    for (const side of [1, -1]) {
      const inside = d === 'h' ? (side > 0 ? inPos : inNeg) : (side > 0 ? inPos : inNeg); if (!inside) continue;
      const nrm = d === 'h' ? new THREE.Vector3(0, 0, side) : new THREE.Vector3(side, 0, 0);
      const t = w.s === 'chata' ? (lz.dot(nrm) > 0 ? T.inT : T.outT) : (w.t === 'wall' ? T.inT : 0.1);
      const cx = d === 'h' ? 2 * x + 1 : 2 * x + side * (t + 0.001), cz = d === 'h' ? 2 * z + side * (t + 0.001) : 2 * z + 1, ry = d === 'h' ? 0 : Math.PI / 2;
      const at = (u, y, off, wdt, hgt, dep, m) => { const px = d === 'h' ? cx + u : cx + side * off, pz = d === 'h' ? cz + side * off : cz + u; return bx(wdt, hgt, dep, m, px, y, pz, ry); };
      const segs = w.t === 'door' ? [[-1, -T.dw / 2], [T.dw / 2, 1]] : [[-1, 1]];
      for (const [a, b] of segs) { const L = b - a, u = (a + b) / 2;
        at(u, 0.065, 0.012, L, 0.13, 0.024, white); at(u, 0.135, 0.02, L, 0.018, 0.02, white); // listwa przypodłogowa z profilem
        if (!full) continue;
        at(u, 0.92, 0.014, L, 0.05, 0.028, white); at(u, 0.95, 0.024, L, 0.015, 0.02, white); // lamperia: listwa na wysokości krzesła
        if (w.t !== 'window') { const n = Math.max(1, Math.round(L / 0.9)), pw = L / n - 0.16; // ramki lamperii
          for (let i = 0; i < n; i++) { const pu = a + (i + 0.5) * (L / n); at(pu, 0.3, 0.008, pw, 0.016, 0.012, cream); at(pu, 0.78, 0.008, pw, 0.016, 0.012, cream); at(pu - pw / 2, 0.54, 0.008, 0.016, 0.48, 0.012, cream); at(pu + pw / 2, 0.54, 0.008, 0.016, 0.48, 0.012, cream); } }
        at(u, T.h - 0.07, 0.03, L, 0.09, 0.06, white); at(u, T.h - 0.13, 0.015, L, 0.03, 0.03, white); // gzyms pod sufitem
      }
      if (w.t === 'door' && full) { // szerokie ościeżnice i łuk
        for (const s2 of [-1, 1]) at(s2 * (T.dw / 2 + 0.06), T.dh / 2, 0.02, 0.12, T.dh, 0.04, white);
        if (exterior || w.s === 'chata') at(0, T.dh + 0.06, 0.02, T.dw + 0.26, 0.12, 0.04, white);
        else { const arc = new THREE.Mesh(new THREE.TorusGeometry(T.dw / 2 + 0.06, 0.05, 6, 20, Math.PI), white); const off = 0.02; arc.position.set(d === 'h' ? cx : cx + side * off, T.dh, d === 'h' ? cz + side * off : cz); arc.rotation.y = ry; g.add(arc); }
      }
      if (w.t === 'window' && full && exterior) { // parapet z doniczkami
        at(0, T.wb - 0.02, 0.09, T.ww + 0.24, 0.045, 0.18, white);
        for (const pu of [-T.ww / 3, T.ww / 4]) { const p = at(pu, T.wb + 0.07, 0.1, 0.12, 0.14, 0.12, potM); p.scale.set(1, 1, 1);
          for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), leafM); l.position.set(p.position.x + (i - 1.5) * 0.025, T.wb + 0.2 + (i % 2) * 0.05, p.position.z + (i % 2 ? 0.02 : -0.02)); g.add(l); } } }
      if (w.t === 'wall' && full) cand.push({ cx, cz, d, side, ry, T, x, z });
    }
  }
  // kinkiety: kilka ciepłych punktów światła na ścianach (rozsianych)
  const pick = []; for (const c of cand.sort((a, b) => (a.x * 7 + a.z * 13) % 5 - (b.x * 7 + b.z * 13) % 5)) { if (pick.every(p => Math.hypot(p.cx - c.cx, p.cz - c.cz) > 5)) pick.push(c); if (pick.length >= 4) break; }
  for (const c of pick) { const y = Math.min(c.T.h - 0.6, 1.85), off = (dz) => [c.d === 'h' ? c.cx : c.cx + c.side * dz, c.d === 'h' ? c.cz + c.side * dz : c.cz];
    let [px, pz] = off(0.04); bx(0.08, 0.16, 0.04, gold, px, y, pz, c.ry); [px, pz] = off(0.12);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.16, 12, 1, true), glow); sh.position.set(px, y + 0.1, pz); g.add(sh);
    const L = new THREE.PointLight('#ffc98a', 0, 4.2, 1.6); [px, pz] = off(0.25); L.position.set(px, y + 0.1, pz); L.userData.sconce = true; lights.push(L); }
  g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
  const merged = DET.mergeStatic(g); merged.traverse(o => { if (o.isMesh) o.castShadow = false; });
  return { group: merged, lights };
}
