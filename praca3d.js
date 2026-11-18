// Miejsca pracy 3D: osobna scena dla każdego zawodu, stanowiska do klikania,
// postacie (klienci, szef, współpracownicy) z dymkami próśb, ruch naszej postaci.
import * as THREE from 'three';
import * as BUD from './budowa.js';
import * as DET from './detale.js';
import * as PSY from './psy3d.js';

const MEB = 'assets/budowanie/meble/';
const X0 = -8, X1 = 8, Z0 = -5.5, Z1 = 5.5;     // pokój 16 × 11 m
export const DOOR = { x: -9.2, z: 3.6 }, ENTRY = { x: -6.8, z: 3.6 };

const mats = {};
const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o })); };
function B(g, w, h, d, c, x, y, z, o, ry = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'string' ? mat(c, o) : c); m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; g.add(m); return m; }
function C(g, rt, rb, h, c, x, y, z, o) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 18), mat(c, o)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; }
function canvasTex(draw, w = 256, h = 256, rep = 1) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); return t; }
const FLOORS = {
  wood: () => canvasTex((x, w, h) => { for (let i = 0; i < 8; i++) { const v = 150 + (i * 37) % 40; x.fillStyle = `rgb(${v + 30},${v},${v - 40})`; x.fillRect(0, i * h / 8, w, h / 8 - 2); x.fillStyle = '#6b4a2b'; x.fillRect((i * 71) % w, i * h / 8, 2, h / 8); } }, 256, 256, 4),
  tiles: (a = '#f2f2f2', b = '#d6dde6') => canvasTex((x, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? a : b; x.fillRect(i * w / 4, j * h / 4, w / 4, h / 4); } x.strokeStyle = '#999'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * w / 4, 0); x.lineTo(i * w / 4, h); x.stroke(); x.beginPath(); x.moveTo(0, i * h / 4); x.lineTo(w, i * h / 4); x.stroke(); } }, 256, 256, 4),
  concrete: () => canvasTex((x, w, h) => { x.fillStyle = '#b9b9b5'; x.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { const v = 160 + Math.random() * 50; x.fillStyle = `rgba(${v},${v},${v},.5)`; x.fillRect(Math.random() * w, Math.random() * h, 3, 3); } }, 256, 256, 3),
  oak: () => canvasTex((x, w, h) => { const n = 8; for (let i = 0; i < n; i++) for (let k = 0; k < 2; k++) { const v = 178 + ((i * 53 + k * 31) % 34); x.fillStyle = `rgb(${v + 22},${v - 4},${v - 52})`; const off = (i % 2) * w / 4; x.fillRect((k * w / 2 + off) % w, i * h / n, w / 2 - 2, h / n - 2); if (off) x.fillRect(0, i * h / n, off - 2, h / n - 2); x.fillStyle = 'rgba(90,60,30,.18)'; for (let q = 0; q < 6; q++) x.fillRect((k * w / 2 + off + q * 21) % w, i * h / n + 4 + (q % 3) * 7, 14, 1); } }, 256, 256, 3),
  carpet: (c = '#7a2e3e') => canvasTex((x, w, h) => { x.fillStyle = c; x.fillRect(0, 0, w, h); for (let i = 0; i < 600; i++) { x.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, 128, 128, 6),
};
function signTex(text, icon, bg) { return canvasTex((x, w, h) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(icon + ' ' + text, w / 2, h / 2); }, 1024, 128); }
function iconSprite(icon) {
  const t = canvasTex((x, w, h) => { x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#2f6fe4'; x.lineWidth = 6; x.stroke(); x.font = '64px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(icon, w / 2, h / 2 + 4); }, 128, 128);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false })); s.scale.set(0.55, 0.55, 1); s.renderOrder = 5; return s;
}
async function F(g, name, x, z, ry = 0, s = 2, y = 0) {
  const src = await BUD.loadModel(MEB + name + '.glb'), o = src.clone(true); o.scale.setScalar(s);
  const holder = new THREE.Group(); holder.add(o);
  const bb = new THREE.Box3().setFromObject(o), c = bb.getCenter(new THREE.Vector3()); o.position.set(-c.x, -bb.min.y, -c.z);
  holder.position.set(x, y, z); holder.rotation.y = ry; g.add(holder); return holder;
}
const safe = p => p.catch(e => console.warn('Praca: brak mebla', e));

// ---------- pokój ----------
function shell(g, th) {
  const fl = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0, 0.1, Z1 - Z0), new THREE.MeshStandardMaterial({ map: th.floor, roughness: 0.8 })); fl.position.y = -0.05; fl.receiveShadow = true; g.add(fl);
  const W = th.wall, H = 3.4;
  if (th.glass) { glassWalls(g, th, H); }
  else {
  B(g, X1 - X0 + 0.4, H, 0.2, W, 0, H / 2, Z0 - 0.1);
  B(g, 0.2, H, 9.1 - 0.1, W, X0 - 0.1, H / 2, Z0 + (9.1 - 0.1) / 2 - 0.1 + 0.05); B(g, 0.2, H, 1.0, W, X0 - 0.1, H / 2, Z1 - 0.5); B(g, 0.2, 0.9, 1.9, W, X0 - 0.1, H - 0.45, 3.6);
  B(g, 0.2, H, Z1 - Z0, W, X1 + 0.1, H / 2, 0);
  B(g, X1 - X0, 0.15, 0.06, '#ffffff', 0, 0.075, Z0 + 0.03); B(g, 0.06, 0.15, Z1 - Z0, '#ffffff', X1 - 0.03, 0.075, 0);
  // okna w ścianie bocznej i tylnej
  const glass = mat('#bfe3ff', { emissive: '#bfe3ff', emissiveIntensity: 0.35, roughness: 0.1 });
  for (const z of [-3, 0, 3]) { B(g, 0.05, 1.5, 1.6, glass, X1 - 0.02, 1.8, z); B(g, 0.08, 1.7, 0.1, '#ffffff', X1 - 0.04, 1.8, z - 0.85); B(g, 0.08, 1.7, 0.1, '#ffffff', X1 - 0.04, 1.8, z + 0.85); B(g, 0.08, 0.1, 1.8, '#ffffff', X1 - 0.04, 2.65, z); B(g, 0.12, 0.08, 1.8, '#ffffff', X1 - 0.06, 0.95, z); }
  }
  // drzwi wejściowe (otwarte) i wycieraczka
  B(g, 0.12, 2.5, 0.12, '#ffffff', X0 - 0.05, 1.25, 2.65); B(g, 0.12, 2.5, 0.12, '#ffffff', X0 - 0.05, 1.25, 4.55); B(g, 0.12, 0.12, 2.0, '#ffffff', X0 - 0.05, 2.5, 3.6);
  B(g, 1.4, 0.02, 1.6, '#5a4632', X0 + 0.8, 0.01, 3.6, {}, 0);
  // szyld
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(th.glass ? 4.4 : 6, th.glass ? 0.55 : 0.75), new THREE.MeshBasicMaterial({ map: signTex(th.name, th.icon, th.signBg || '#2f6fe4') })); sign.position.set(th.glass ? -3.2 : 0, th.glass ? 3.07 : 2.85, Z0 + 0.02); g.add(sign);
  // lampy sufitowe (świecące panele)
  const lamp = mat('#fff7e0', { emissive: '#fff1c4', emissiveIntensity: 1.2 });
  if (!th.glass) for (const x of [-4.5, 0, 4.5]) for (const z of [-2, 2]) { B(g, 1.2, 0.06, 0.5, lamp, x, 3.35, z); }
}
// przeszklona ściana tylna i boczna (biuro): parapet, szyby od podłogi prawie do sufitu, słupki
function glassWalls(g, th, H) {
  const W = th.wall, gl = new THREE.MeshStandardMaterial({ color: '#d8ecff', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false }), frame = '#2b2f36', top = 2.75, bot = 0.22;
  B(g, 0.2, H, 9.1 - 0.1, W, X0 - 0.1, H / 2, Z0 + (9.1 - 0.1) / 2 - 0.1 + 0.05); B(g, 0.2, H, 1.0, W, X0 - 0.1, H / 2, Z1 - 0.5); B(g, 0.2, 0.9, 1.9, W, X0 - 0.1, H - 0.45, 3.6); // lewa ściana z drzwiami
  B(g, 0.06, 0.15, 8.1, '#ffffff', X0 + 0.03, 0.075, Z0 + 4.05);
  B(g, X1 - X0 + 0.4, bot, 0.2, W, 0, bot / 2, Z0 - 0.1); B(g, X1 - X0 + 0.4, H - top, 0.2, W, 0, (H + top) / 2, Z0 - 0.1);
  B(g, 0.2, bot, Z1 - Z0, W, X1 + 0.1, bot / 2, 0); B(g, 0.2, H - top, Z1 - Z0, W, X1 + 0.1, (H + top) / 2, 0);
  const pb = B(g, X1 - X0, top - bot, 0.03, gl, 0, (top + bot) / 2, Z0 - 0.1), pr = B(g, 0.03, top - bot, Z1 - Z0, gl, X1 + 0.1, (top + bot) / 2, 0);
  pb.castShadow = pr.castShadow = false; pb.renderOrder = pr.renderOrder = 2;
  for (let x = X0; x <= X1 + 0.01; x += 2) B(g, 0.07, top - bot, 0.12, frame, x, (top + bot) / 2, Z0 - 0.1, { metalness: 0.5, roughness: 0.4 }).castShadow = false;
  for (let z = Z0; z <= Z1 + 0.01; z += 2.2) B(g, 0.12, top - bot, 0.07, frame, X1 + 0.1, (top + bot) / 2, z, { metalness: 0.5, roughness: 0.4 }).castShadow = false;
  B(g, X1 - X0, 0.06, 0.14, frame, 0, top, Z0 - 0.1); B(g, X1 - X0, 0.06, 0.14, frame, 0, bot, Z0 - 0.1);
  B(g, 0.14, 0.06, Z1 - Z0, frame, X1 + 0.1, top, 0); B(g, 0.14, 0.06, Z1 - Z0, frame, X1 + 0.1, bot, 0);
}
function station(g, list, s) {
  const hit = new THREE.Mesh(new THREE.BoxGeometry(s.hw || 1.4, 1.8, s.hd || 1.2), new THREE.MeshBasicMaterial({ visible: false })); hit.position.set(s.x, 0.9, s.z); hit.userData.station = s.id; g.add(hit);
  const ic = iconSprite(s.icon); ic.position.set(s.x, s.iy || 2.3, s.z); ic.userData.station = s.id; g.add(ic);
  list.push(s);
}
const coffee = (g, st, x, z) => {
  B(g, 1.0, 0.9, 0.6, '#d9d2c5', x, 0.45, z); safe(F(g, 'kitchenCoffeeMachine', x, z, 0, 2, 0.9));
  station(g, st, { id: 'coffee', name: 'Ekspres do kawy', icon: '☕', x, z, spot: [x, z + 1.0], face: Math.PI, act: { label: 'Wypij kawę', icon: '☕', dur: 15, energy: 1.6, fun: 0.3 } });
};
function dog(g, x, z, ry = 0, c = '#c9853f') { const d = new THREE.Group(); d.position.set(x, 0, z); d.rotation.y = ry; g.add(d);
  B(d, 0.28, 0.26, 0.62, c, 0, 0.42, 0); B(d, 0.24, 0.24, 0.26, c, 0, 0.62, 0.38); B(d, 0.12, 0.1, 0.14, '#2a1d14', 0, 0.58, 0.55);
  for (const s of [-1, 1]) { B(d, 0.06, 0.14, 0.04, '#7a4a2a', s * 0.1, 0.78, 0.33); for (const zz of [-0.22, 0.22]) B(d, 0.07, 0.32, 0.07, c, s * 0.09, 0.16, zz); }
  const tail = B(d, 0.05, 0.05, 0.3, c, 0, 0.55, -0.42); tail.rotation.x = -0.6; d.userData.tail = tail; return d; }

// ---------- układy dla zawodów ----------
const LAYOUTS = {
  cook: g => { const st = [], th = { name: 'Restauracja „Pod Lipą”', icon: '🍳', floor: FLOORS.tiles('#f4efe6', '#c9b8a0'), wall: '#f3e2c8', signBg: '#b0302b' }; shell(g, th);
    for (const [n, x] of [['kitchenFridgeLarge', -7.2], ['kitchenStove', -5.6], ['kitchenCabinetDrawer', -4.6], ['kitchenCabinetDrawer', -3.6], ['kitchenSink', -2.6], ['kitchenCabinet', -1.6]]) safe(F(g, n, x, Z0 + 0.45, 0));
    safe(F(g, 'hoodModern', -5.6, Z0 + 0.35, 0, 2, 1.7));
    for (const x of [-5.6, -4.3, -3.0, -1.7]) safe(F(g, 'kitchenBar', x, -2.3, Math.PI));
    for (const [x, z] of [[2.5, -2.6], [5.6, -2.6], [2.5, 0.6], [5.6, 0.6]]) { safe(F(g, 'tableRound', x, z)); safe(F(g, 'chair', x - 0.9, z, Math.PI / 2)); safe(F(g, 'chair', x + 0.9, z, -Math.PI / 2)); }
    safe(F(g, 'pottedPlant', 7.3, 4.8)); safe(F(g, 'pottedPlant', 0.6, -4.9));
    coffee(g, st, -0.3, Z0 + 0.4);
    station(g, st, { id: 'stove', name: 'Kuchenka', icon: '🍳', x: -5.6, z: Z0 + 0.45, spot: [-5.6, -4.0], face: Math.PI, act: { label: 'Gotuj zamówienia', icon: '🍳', dur: 40, anim: 'arms', duty: 16, perf: 3, energy: -0.12 } });
    station(g, st, { id: 'sink', name: 'Zmywak', icon: '🧽', x: -2.6, z: Z0 + 0.45, spot: [-2.6, -4.0], face: Math.PI, act: { label: 'Pozmywaj naczynia', icon: '🧽', dur: 30, anim: 'arms', duty: 12, perf: 2, energy: -0.1, hygiene: -0.1 } });
    station(g, st, { id: 'pass', name: 'Okienko wydawania', icon: '🍽️', x: -3.6, z: -2.3, hw: 5.4, spot: [-3.6, -3.1], face: 0, act: { label: 'Wydawaj dania', icon: '🍽️', dur: 30, anim: 'arms', duty: 12, perf: 2, social: 0.2 } });
    return { th, st, spots: [[-5.0, -1.3], [-3.6, -1.3], [-2.2, -1.3], [1.4, -1.3], [4.0, -1.3], [3.8, 1.9], [6.6, 1.9]], cam: [[1, 9.5, 14.5], [-0.5, 0.6, -0.8]] }; },
  dog: g => { const st = [], th = { name: 'Ośrodek Behawioralny „Spokojny Pies”', icon: '🐕' };
    // ---- teren: płaska polana w środku, łagodne pagórki dookoła ----
    const flat = (x, z) => { const dx = Math.max(0, Math.abs(x) - 9.5), dz = Math.max(0, Math.abs(z) - 6.8); return Math.min(1, Math.hypot(dx, dz) / 7); };
    const hgt = (x, z) => { const f = flat(x, z); return f * f * (1.6 + Math.sin(x * 0.23) * 0.9 + Math.cos(z * 0.31) * 0.8 + Math.sin((x + z) * 0.13) * 0.6); };
    const tg = new THREE.PlaneGeometry(90, 70, 150, 120); tg.rotateX(-Math.PI / 2);
    const pos = tg.attributes.position, col = new Float32Array(pos.count * 3), c1 = new THREE.Color('#79b85a'), c2 = new THREE.Color('#95c96a'), c3 = new THREE.Color('#5f9a48'), tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), y = hgt(x, z); pos.setY(i, y - 0.02); const n = (Math.sin(x * 1.7) * Math.cos(z * 1.3) + Math.sin(x * 0.37 + z * 0.51)) * 0.5;
      tmp.copy(c1).lerp(n > 0 ? c2 : c3, Math.abs(n) * 0.7).lerp(c3, Math.min(0.5, y * 0.12)); col.set([tmp.r, tmp.g, tmp.b], i * 3); }
    tg.setAttribute('color', new THREE.BufferAttribute(col, 3)); tg.computeVertexNormals();
    const terr = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })); terr.receiveShadow = true; g.add(terr);
    // ---- kręte żwirowe ścieżki ----
    const gravel = canvasTex((x, w, h) => { x.fillStyle = '#cbbd9a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const v = 150 + Math.random() * 80; x.fillStyle = `rgb(${v},${v - 10},${v - 30})`; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.2, 0, 7); x.fill(); } }, 128, 128, 1);
    const gm = new THREE.MeshStandardMaterial({ map: gravel, roughness: 1, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 });
    function path(pts, wd = 1.15) {
      const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z))), N = 60, P = curve.getSpacedPoints(N), v = [], uv = [], idx = [];
      for (let i = 0; i <= N; i++) { const p = P[i], t = curve.getTangentAt(Math.min(1, i / N)), nx = -t.z, nz = t.x, w2 = wd / 2 * (1 + Math.sin(i * 0.7) * 0.08);
        v.push(p.x + nx * w2, 0.03, p.z + nz * w2, p.x - nx * w2, 0.03, p.z - nz * w2); uv.push(0, i * 0.4, 1, i * 0.4); if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, gm); m.receiveShadow = true; g.add(m);
    }
    path([[-11, 3.6], [-7.5, 3.5], [-5.2, 2.2], [-4.6, 0.4], [-4.8, -1.4]]);
    path([[-5.2, 2.2], [-2.5, 1.6], [0, 0.4], [1.9, -0.9], [2.6, -2.1]], 1.0);
    path([[-2.5, 1.6], [-0.6, 2.6], [1.2, 2.9], [2.5, 2.9]], 0.9);
    // ---- drzewa: brzozy i sosny w nieregularnych kępach, krzewy ----
    const birchBark = canvasTex((x, w, h) => { x.fillStyle = '#efece4'; x.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { x.fillStyle = '#2b2b2b'; x.fillRect(Math.random() * w, Math.random() * h, 4 + Math.random() * 14, 2 + Math.random() * 3); } }, 64, 128, 1);
    const barkM = new THREE.MeshStandardMaterial({ map: birchBark, roughness: 0.9 });
    function birch(x, z, s = 1) { const y = hgt(x, z), t = new THREE.Group(); t.position.set(x, y, z); t.scale.setScalar(s); g.add(t);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 3.4, 8), barkM); tr.position.y = 1.7; tr.castShadow = true; t.add(tr);
      for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.55 + Math.random() * 0.25, 10, 8), mat(i % 2 ? '#9ccf5a' : '#86bf4a')); b.position.set((Math.random() - 0.5) * 1.1, 2.6 + Math.random() * 1.2, (Math.random() - 0.5) * 1.1); b.scale.y = 1.2; b.castShadow = true; t.add(b); } }
    function pine(x, z, s = 1) { const y = hgt(x, z), t = new THREE.Group(); t.position.set(x, y, z); t.scale.setScalar(s); g.add(t);
      C(t, 0.1, 0.16, 1.4, '#6b4a30', 0, 0.7, 0); for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.1 - i * 0.28, 1.5, 9), mat(i % 2 ? '#2f6a3a' : '#2a5f34')); c.position.y = 1.5 + i * 0.85; c.castShadow = true; t.add(c); } }
    function bush(x, z, r = 0.5, cl = '#4f9a45') { const y = hgt(x, z); for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(r * (0.7 + Math.random() * 0.4), 10, 8), mat(cl)); b.position.set(x + (Math.random() - 0.5) * r, y + r * 0.6, z + (Math.random() - 0.5) * r); b.scale.y = 0.8; b.castShadow = true; g.add(b); } }
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (const [cx, cz, n] of [[-13, -8, 6], [-4, -11, 7], [8, -11, 6], [15, -5, 6], [15, 6, 5], [-14, 7, 5], [3, 11, 5], [-6, 11, 4]]) for (let i = 0; i < n; i++) { const x = cx + (rnd() - 0.5) * 7, z = cz + (rnd() - 0.5) * 5; (rnd() < 0.5 ? birch : pine)(x, z, 0.8 + rnd() * 0.5); }
    birch(7.6, -5.6, 0.9); birch(-1.8, -6.0, 1.0); pine(-8.6, -6.2, 0.9); birch(8.4, 5.9, 0.85); pine(-9.2, 6.4, 0.8); birch(-0.6, 6.1, 0.8);
    for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, r = 10 + rnd() * 5; bush(Math.cos(a) * r * 1.1, Math.sin(a) * r * 0.75, 0.4 + rnd() * 0.3, rnd() < 0.5 ? '#4f9a45' : '#5aa84c'); }
    // ---- zadaszony pawilon konsultacyjny ----
    const P0 = { x: -4.8, z: -3.6 }, wood = '#a5713f';
    B(g, 5.2, 0.12, 3.4, wood, P0.x, 0.05, P0.z, { roughness: 0.8 }); for (let i = 0; i < 12; i++) B(g, 5.2, 0.005, 0.02, '#7a5230', P0.x, 0.115, P0.z - 1.6 + i * 0.29);
    for (const [dx, dz] of [[-2.45, -1.55], [2.45, -1.55], [-2.45, 1.55], [2.45, 1.55]]) B(g, 0.16, 2.7, 0.16, '#7a5230', P0.x + dx, 1.4, P0.z + dz);
    for (const s of [-1, 1]) { const r = B(g, 5.9, 0.1, 2.1, '#3f5a3a', P0.x, 2.95 + 0.0, P0.z + s * 0.92, {}); r.rotation.x = s * 0.42; }
    B(g, 5.6, 0.18, 0.18, '#7a5230', P0.x, 3.35, P0.z);
    B(g, 5.0, 0.06, 0.06, '#7a5230', P0.x, 0.95, P0.z - 1.6); for (let i = 0; i < 16; i++) B(g, 0.04, 0.8, 0.04, '#7a5230', P0.x - 2.4 + i * 0.32, 0.55, P0.z - 1.6);
    const arm = (x, z, ry, c) => { const a = new THREE.Group(); a.position.set(x, 0.12, z); a.rotation.y = ry; g.add(a); B(a, 0.8, 0.38, 0.75, c, 0, 0.22, 0); B(a, 0.8, 0.55, 0.16, c, 0, 0.62, -0.3); for (const s of [-1, 1]) B(a, 0.14, 0.32, 0.72, c, s * 0.38, 0.5, 0); };
    arm(P0.x - 1.2, P0.z - 0.3, 0.5, '#5b7f6a'); arm(P0.x + 0.6, P0.z - 0.5, -0.5, '#c9a87a');
    C(g, 0.45, 0.45, 0.05, '#e8e0d0', P0.x - 0.3, 0.62, P0.z + 0.2); C(g, 0.05, 0.08, 0.5, '#7a5230', P0.x - 0.3, 0.37, P0.z + 0.2); C(g, 0.06, 0.05, 0.1, '#ffffff', P0.x - 0.15, 0.7, P0.z + 0.1);
    B(g, 1.6, 1.0, 0.05, '#ffffff', P0.x + 1.7, 1.55, P0.z - 1.4); for (let i = 0; i < 4; i++) B(g, 0.6 + (i % 2) * 0.4, 0.03, 0.01, '#2f6fe4', P0.x + 1.5, 1.85 - i * 0.18, P0.z - 1.37); B(g, 0.05, 1.1, 0.05, '#555', P0.x + 1.05, 0.6, P0.z - 1.45); B(g, 0.05, 1.1, 0.05, '#555', P0.x + 2.35, 0.6, P0.z - 1.45);
    B(g, 0.4, 1.6, 1.4, '#8a5a32', P0.x - 2.25, 0.92, P0.z + 0.2); for (let i = 0; i < 3; i++) B(g, 0.42, 0.04, 1.4, '#7a5230', P0.x - 2.25, 0.5 + i * 0.45, P0.z + 0.2);
    for (let i = 0; i < 4; i++) { const t2 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 6, 14), mat(['#e5534b', '#2f6fe4', '#39c07f', '#f2b134'][i])); t2.position.set(P0.x - 2.1, 1.12, P0.z - 0.25 + i * 0.3); t2.rotation.y = Math.PI / 2; g.add(t2); }
    for (let i = 0; i < 3; i++) { const t2 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 5, 14), mat('#2b5d8c')); t2.position.set(P0.x - 2.1, 0.65, P0.z - 0.15 + i * 0.32); t2.rotation.x = Math.PI / 2; g.add(t2); }
    for (let i = 0; i < 3; i++) { B(g, 0.22, 0.05, 0.05, '#f2e6d0', P0.x - 2.1, 1.58, P0.z - 0.2 + i * 0.3); }
    coffee(g, st, P0.x - 2.0, P0.z + 2.2);
    // ---- strefa węszenia i wyciszenia ----
    const felt = ['#e5534b', '#f2b134', '#39c07f', '#2f6fe4', '#c9a6e8'];
    for (const [x, z] of [[1.4, -3.3], [3.0, -4.3], [4.3, -2.9]]) { C(g, 0.55, 0.55, 0.03, '#6b6b6b', x, 0.02, z); for (let i = 0; i < 26; i++) { const a = Math.random() * 7, r = Math.random() * 0.48; const f = B(g, 0.04, 0.08, 0.12, felt[i % 5], x + Math.cos(a) * r, 0.07, z + Math.sin(a) * r); f.rotation.y = a; } }
    const log = C(g, 0.13, 0.13, 2.6, '#8a5a32', 5.9, 0.45, -4.3); log.rotation.z = Math.PI / 2; log.rotation.y = 0.3; for (const s of [-1, 1]) B(g, 0.12, 0.42, 0.12, '#6b4a30', 5.9 + s * 1.05, 0.2, -4.3 - s * 0.32);
    for (const [x, z, r, h] of [[0.5, -4.8, 0.3, 0.35], [1.0, -5.2, 0.25, 0.25], [-0.1, -5.0, 0.22, 0.45]]) { C(g, r, r * 1.1, h, '#8a5a32', x, h / 2, z); C(g, r * 0.92, r * 0.92, 0.01, '#d9b98a', x, h + 0.005, z); }
    const tun = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.4, 18, 1, true), mat('#3f7a4a', { side: THREE.DoubleSide })); tun.rotation.z = Math.PI / 2; tun.rotation.y = -0.5; tun.position.set(6.4, 0.43, -1.8); tun.castShadow = true; g.add(tun);
    for (const [x, z] of [[7.0, -4.8], [7.5, -4.6]]) { C(g, 0.17, 0.13, 0.08, '#b8c0c8', x, 0.04, z, { metalness: 0.5, roughness: 0.3 }); C(g, 0.15, 0.15, 0.01, '#6fb6e0', x, 0.075, z); }
    // ---- strefa dystansu (bufor) za naturalnym żywopłotem ----
    const BZ = { x: 5.0, z: 2.9 };
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; if (Math.cos(a) < -0.82) continue; bush(BZ.x + Math.cos(a) * 2.5, BZ.z + Math.sin(a) * 2.1, 0.42, i % 2 ? '#3f8f3a' : '#4a9a40'); }
    for (const [dx, dz] of [[-1.2, 0], [0, -0.9], [0.9, 0.6]]) C(g, 0.02, 0.15, 0.35, '#f9a03f', BZ.x + dx, 0.18, BZ.z + dz);
    C(g, 0.6, 0.6, 0.02, '#c9a6e8', BZ.x + 0.3, 0.012, BZ.z + 0.2);
    B(g, 0.06, 1.1, 0.06, '#7a5230', BZ.x - 2.3, 0.55, BZ.z - 1.6); const sgn = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.4), new THREE.MeshBasicMaterial({ map: signTex('Strefa dystansu', '🐕', '#2f5a3a') })); sgn.position.set(BZ.x - 2.3, 1.15, BZ.z - 1.56); g.add(sgn);
    // ---- wejście z szyldem ----
    B(g, 0.12, 2.2, 0.12, '#7a5230', -9.4, 1.1, 5.0); B(g, 0.12, 2.2, 0.12, '#7a5230', -9.4, 1.1, 2.2);
    const ent = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.5), new THREE.MeshBasicMaterial({ map: signTex(th.name, th.icon, '#2f5a3a'), side: THREE.DoubleSide })); ent.position.set(-9.4, 2.0, 3.6); ent.rotation.y = Math.PI / 2; g.add(ent);
    // ---- psy mieszkające w ośrodku ----
    const parkDogs = [];
    const d1 = PSY.makeDog('retriever', { mood: 'calm', harness: false }); d1.root.position.set(3.2, 0, -3.6); d1.root.rotation.y = 0.8; g.add(d1.root); parkDogs.push(d1);
    const d2 = PSY.makeDog('shiba', { mood: 'calm', harness: false }); d2.root.position.set(7.0, 0, -4.1); d2.root.rotation.y = -2.3; g.add(d2.root); parkDogs.push(d2);
    // ---- stanowiska ----
    station(g, st, { id: 'desk', name: 'Pawilon konsultacyjny', icon: '📋', x: P0.x + 0.3, z: P0.z, hw: 3, spot: [P0.x + 0.1, P0.z + 2.1], face: Math.PI, act: { label: 'Poprowadź konsultację w pawilonie', icon: '📋', dur: 40, anim: 'arms', duty: 15, perf: 3, energy: -0.08 } });
    station(g, st, { id: 'agility', name: 'Strefa węszenia', icon: '👃', x: 3.0, z: -3.6, hw: 3.4, spot: [2.5, -2.2], face: Math.PI, act: { label: 'Poprowadź ćwiczenia węchowe', icon: '👃', dur: 35, anim: 'arms', duty: 15, perf: 3, energy: -0.12, fun: 0.4 } });
    station(g, st, { id: 'mat', name: 'Strefa dystansu', icon: '🧘', x: BZ.x, z: BZ.z, hw: 3.6, spot: [BZ.x - 1.6, BZ.z + 0.1], face: Math.PI / 2, act: { label: 'Pracuj z psem reaktywnym na dystansie', icon: '🧘', dur: 30, anim: 'arms', duty: 12, perf: 3, fun: 0.2, energy: -0.06 } });
    return { th, st, dogs: true, outdoor: true, parkDogs, spots: [[-3.8, -1.3], [-5.9, -1.4], [0.3, -1.4], [1.6, 0.9], [4.6, 2.5], [-1.6, 2.6]], cam: [[1, 11, 15.5], [0, 0, -0.6]] }; },

  med: g => { const st = [], th = { name: 'Przychodnia „Zdrówko”', icon: '🩺', floor: FLOORS.tiles('#eef4f6', '#d3e3ea'), wall: '#eaf4f2', signBg: '#39a07f' }; shell(g, th);
    for (const x of [-5.5, -4.3, -3.1]) safe(F(g, 'kitchenBar', x, -1.6, Math.PI)); safe(F(g, 'computerScreen', -4.3, -1.75, Math.PI, 2, 1.05));
    for (const x of [2.0, 5.0]) { safe(F(g, 'bedSingle', x, -3.8)); B(g, 0.05, 2.2, 2.6, '#bfe3d6', x + 1.35, 1.1, -3.8); }
    safe(F(g, 'bathroomCabinet', -7.3, -4.9)); safe(F(g, 'bathroomSink', -6.2, -5.0)); safe(F(g, 'bookcaseClosed', 7.3, 3.8, -Math.PI / 2));
    for (const z of [1.2, 2.2]) safe(F(g, 'benchCushion', -2.5, z, Math.PI / 2)); safe(F(g, 'pottedPlant', -7.2, 1.2));
    coffee(g, st, -1.3, Z0 + 0.4);
    station(g, st, { id: 'reception', name: 'Rejestracja', icon: '🗂️', x: -4.3, z: -1.6, hw: 3.6, spot: [-4.3, -2.6], face: 0, act: { label: 'Rejestruj pacjentów', icon: '🗂️', dur: 30, anim: 'type', duty: 12, perf: 2, social: 0.2 } });
    station(g, st, { id: 'bed', name: 'Gabinet zabiegowy', icon: '🩺', x: 2.0, z: -3.8, spot: [3.1, -2.4], face: Math.PI, act: { label: 'Badaj pacjentów', icon: '🩺', dur: 40, anim: 'arms', duty: 16, perf: 3, energy: -0.12 } });
    station(g, st, { id: 'meds', name: 'Szafka z lekami', icon: '💊', x: -7.3, z: -4.9, spot: [-7.0, -3.9], face: Math.PI, act: { label: 'Uzupełnij leki', icon: '💊', dur: 25, anim: 'arms', duty: 10, perf: 2 } });
    return { th, st, spots: [[-5.5, -0.6], [-3.1, -0.6], [-2.0, 1.7], [2.0, -1.4], [5.0, -1.4], [4.0, 1.5]], cam: [[0.5, 9.5, 14.5], [-0.5, 0.6, -0.8]] }; },
  it: g => { const st = [], th = { name: 'Software House „Bajt”', icon: '💻', floor: FLOORS.carpet('#4a5568'), wall: '#e8ecf3', signBg: '#2f9bd6' }; shell(g, th);
    for (const x of [-4.5, -1.5, 1.5, 4.5]) for (const z of [-3.6, -0.6]) { safe(F(g, 'desk', x, z)); safe(F(g, 'computerScreen', x, z - 0.2, 0, 2, 0.75)); safe(F(g, 'chairDesk', x, z + 0.75, Math.PI)); }
    B(g, 0.9, 2.2, 0.8, '#2b2f36', 7.2, 1.1, -4.6); for (let i = 0; i < 8; i++) B(g, 0.6, 0.05, 0.02, i % 2 ? '#39c07f' : '#2f9bd6', 7.2, 0.4 + i * 0.22, -4.18, { emissive: i % 2 ? '#39c07f' : '#2f9bd6', emissiveIntensity: 1 });
    B(g, 3, 1.4, 0.06, '#ffffff', -4.5, 1.7, Z0 + 0.05); B(g, 3.1, 1.5, 0.04, '#9aa0a8', -4.5, 1.7, Z0 + 0.02);
    safe(F(g, 'loungeSofa', 5.8, 3.4, Math.PI)); safe(F(g, 'pottedPlant', -7.2, -4.8));
    coffee(g, st, 2.0, Z0 + 0.4);
    station(g, st, { id: 'mydesk', name: 'Twoje biurko', icon: '⌨️', x: -1.5, z: -0.6, spot: [-1.5, 0.15], face: Math.PI, act: { label: 'Programuj', icon: '⌨️', dur: 45, anim: 'type', duty: 16, perf: 3, energy: -0.1, fun: -0.05 } });
    station(g, st, { id: 'server', name: 'Serwerownia', icon: '🖥️', x: 7.2, z: -4.6, spot: [6.6, -3.6], face: Math.PI, act: { label: 'Napraw serwer', icon: '🖥️', dur: 30, anim: 'arms', duty: 12, perf: 3 } });
    station(g, st, { id: 'board', name: 'Tablica', icon: '📊', x: -4.5, z: Z0 + 0.1, hw: 3, spot: [-4.5, -4.6], face: Math.PI, act: { label: 'Rozpisz zadania zespołu', icon: '📊', dur: 25, anim: 'arms', duty: 10, perf: 2, social: 0.2 } });
    return { th, st, spots: [[-4.5, 0.9], [1.5, 0.9], [4.5, 0.9], [-3.0, 2.6], [3.0, 2.6]], cam: [[0.5, 9.5, 14.5], [0, 0.6, -0.8]] }; },
  art: g => { const st = [], th = { name: 'Galeria i pracownia „Pędzel”', icon: '🎨', floor: FLOORS.wood(), wall: '#fbf8f2', signBg: '#ec6fb4' }; shell(g, th);
    const cols = ['#e8505b', '#2f9bd6', '#f6d743', '#39c07f', '#7b4bd6', '#f9a03f'];
    for (let i = 0; i < 6; i++) { B(g, 1.3, 1.0, 0.05, '#2b2b2b', -6 + i * 2.4, 1.9, Z0 + 0.06); B(g, 1.15, 0.85, 0.04, cols[i], -6 + i * 2.4, 1.9, Z0 + 0.09); B(g, 0.6, 0.3, 0.05, cols[(i + 2) % 6], -6 + i * 2.4 - 0.2, 1.8, Z0 + 0.12); }
    for (const [x, z] of [[-4.5, -1.6], [-2.3, -1.6]]) { C(g, 0.03, 0.03, 1.8, '#7a5233', x - 0.3, 0.9, z); C(g, 0.03, 0.03, 1.8, '#7a5233', x + 0.3, 0.9, z); B(g, 1.0, 0.8, 0.05, '#ffffff', x, 1.3, z + 0.05); B(g, 0.7, 0.4, 0.02, cols[Math.round(x) & 3], x, 1.35, z + 0.09); }
    for (const x of [2.5, 5.5]) { B(g, 0.8, 1.0, 0.8, '#ffffff', x, 0.5, 0.5); C(g, 0.2, 0.3, 0.6, cols[(x | 0) % 6], x, 1.3, 0.5); }
    B(g, 2, 0.85, 0.9, '#a77b50', -6.4, 0.43, 0.6); for (let i = 0; i < 5; i++) C(g, 0.06, 0.06, 0.15, cols[i], -7.1 + i * 0.35, 0.93, 0.6);
    safe(F(g, 'benchCushionLow', 4.0, 3.3)); safe(F(g, 'pottedPlant', 7.2, -4.8));
    coffee(g, st, 7.2, 1.2);
    station(g, st, { id: 'easel', name: 'Sztaluga', icon: '🖌️', x: -4.5, z: -1.6, spot: [-4.5, -0.7], face: Math.PI, act: { label: 'Maluj na zamówienie', icon: '🖌️', dur: 45, anim: 'paint', duty: 16, perf: 3, fun: 0.4 } });
    station(g, st, { id: 'wall', name: 'Ściana wystawowa', icon: '🖼️', x: 1.2, z: Z0 + 0.1, hw: 6, spot: [1.2, -4.4], face: Math.PI, act: { label: 'Aranżuj wystawę', icon: '🖼️', dur: 30, anim: 'arms', duty: 12, perf: 2 } });
    station(g, st, { id: 'paints', name: 'Stół z farbami', icon: '🎨', x: -6.4, z: 0.6, spot: [-6.4, 1.6], face: Math.PI, act: { label: 'Przygotuj farby i płótna', icon: '🎨', dur: 25, anim: 'arms', duty: 10, perf: 2 } });
    return { th, st, spots: [[-1.0, -3.6], [2.5, -3.6], [5.5, -3.6], [2.5, 1.8], [5.5, 1.8], [-1.0, 2.4]], cam: [[0.5, 9.5, 14.5], [0, 0.6, -0.8]] }; },
  police: g => { const st = [], th = { name: 'Komisariat Policji', icon: '🚓', floor: FLOORS.tiles('#d7dce4', '#bfc6d1'), wall: '#dfe6ef', signBg: '#2f4fbf' }; shell(g, th);
    for (const x of [-4.5, -1.5]) for (const z of [-3.6, -0.8]) { safe(F(g, 'desk', x, z)); safe(F(g, 'computerScreen', x, z - 0.2, 0, 2, 0.75)); safe(F(g, 'chairDesk', x, z + 0.75, Math.PI)); }
    B(g, 4, 0.2, 3.4, '#9aa0a8', 5.5, 0.1, -3.6); for (let x = 3.6; x <= 7.4; x += 0.3) C(g, 0.03, 0.03, 2.8, '#555b63', x, 1.4, -1.9); B(g, 4, 0.08, 0.08, '#555b63', 5.5, 2.8, -1.9);
    safe(F(g, 'benchCushion', 5.5, -4.6)); B(g, 1.4, 0.9, 0.7, '#3a3f47', 1.6, 0.45, -4.8); B(g, 0.5, 0.3, 0.3, '#222', 1.6, 1.05, -4.8); C(g, 0.01, 0.01, 0.6, '#222', 1.8, 1.45, -4.8);
    safe(F(g, 'bookcaseClosedWide', -7.3, 0.5, Math.PI / 2)); safe(F(g, 'pottedPlant', 7.2, 4.6));
    coffee(g, st, -6.5, Z0 + 0.4);
    station(g, st, { id: 'reports', name: 'Biurko z raportami', icon: '📝', x: -1.5, z: -0.8, spot: [-1.5, 0.0], face: Math.PI, act: { label: 'Pisz raporty', icon: '📝', dur: 40, anim: 'type', duty: 15, perf: 3, fun: -0.05 } });
    station(g, st, { id: 'radio', name: 'Radiostacja', icon: '📻', x: 1.6, z: -4.8, spot: [1.6, -3.9], face: Math.PI, act: { label: 'Koordynuj patrole', icon: '📻', dur: 30, anim: 'phone', duty: 12, perf: 3 } });
    station(g, st, { id: 'cell', name: 'Cela', icon: '🔐', x: 5.5, z: -1.9, hw: 4, spot: [5.5, -1.0], face: Math.PI, act: { label: 'Przesłuchaj zatrzymanego', icon: '🔐', dur: 30, anim: 'talk', duty: 12, perf: 3, energy: -0.1 } });
    return { th, st, spots: [[-4.5, 0.5], [-1.5, 1.4], [1.6, -2.6], [3.0, 1.4], [5.0, 1.0]], cam: [[0.5, 9.5, 14.5], [0, 0.6, -0.8]] }; },
  music: g => { const st = [], th = { name: 'Klub Muzyczny „Nuta”', icon: '🎸', floor: FLOORS.wood(), wall: '#3a2f4a', signBg: '#7b4bd6' }; shell(g, th);
    B(g, 8, 0.5, 3.6, '#2b2233', -3, 0.25, -3.6); for (const x of [-6.5, 0.5]) { B(g, 0.8, 1.6, 0.7, '#1c1c1c', x, 1.3, -4.8); C(g, 0.25, 0.25, 0.05, '#555', x, 1.5, -4.43); }
    C(g, 0.02, 0.02, 1.5, '#222', -3, 1.25, -2.4); C(g, 0.06, 0.06, 0.15, '#999', -3, 2.0, -2.4);
    for (const [x, r] of [[-4.3, 0.35], [-3.6, 0.28], [-4.9, 0.28]]) C(g, r, r, 0.35, '#c0392b', x, 0.75, -4.4);
    for (const x of [1.5, 2.8, 4.1, 5.4]) { safe(F(g, 'kitchenBar', x, 2.2, 0)); safe(F(g, 'stoolBar', x, 3.2)); }
    const spot = mat('#ffffff', { emissive: '#ff6fd8', emissiveIntensity: 1.5 }); for (const x of [-6, -3, 0]) B(g, 0.3, 0.3, 0.3, spot, x, 3.2, -2.4);
    coffee(g, st, 7.2, -2.0);
    station(g, st, { id: 'stage', name: 'Scena', icon: '🎤', x: -3, z: -2.4, hw: 2, spot: [-3, -2.9], face: 0, act: { label: 'Zagraj set na scenie', icon: '🎤', dur: 45, anim: 'cheer', duty: 16, perf: 3, fun: 0.6, energy: -0.15 } });
    station(g, st, { id: 'drums', name: 'Próba z zespołem', icon: '🥁', x: -4.3, z: -4.4, spot: [-5.6, -3.4], face: Math.PI / 2, act: { label: 'Ćwicz z zespołem', icon: '🥁', dur: 35, anim: 'arms', duty: 13, perf: 2, social: 0.3 } });
    station(g, st, { id: 'mixer', name: 'Konsoleta', icon: '🎚️', x: 2.8, z: 2.2, hw: 3, spot: [2.8, 1.3], face: 0, act: { label: 'Ustaw nagłośnienie', icon: '🎚️', dur: 25, anim: 'arms', duty: 10, perf: 2 } });
    return { th, st, spots: [[-4.5, -0.8], [-1.5, -0.8], [0.5, 0.6], [2.0, 4.2], [4.6, 4.2]], cam: [[0.5, 9.5, 14.5], [-0.5, 0.6, -0.8]] }; },
  biz: (g, deps = {}) => officeLayout(g, deps.lvl || 0),
};

// ============================================================
//  BIURO WŁASNEJ DZIAŁALNOŚCI – 3 strefy, wystrój rośnie z poziomem firmy
// ============================================================
const txt = (x, t, px, X, Y, c = '#1f2d3d', al = 'left') => { x.fillStyle = c; x.font = `bold ${px}px sans-serif`; x.textAlign = al; x.textBaseline = 'middle'; x.fillText(t, X, Y); };
function screenMat(draw, w = 256, h = 160) { const t = canvasTex(draw, w, h); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, 1); return new THREE.MeshStandardMaterial({ map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 0.75, roughness: 0.3 }); }
function plane(g, w, h, m, x, y, z, ry = 0) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.rotation.y = ry; g.add(p); return p; }
const mailScreen = () => screenMat((x, w, h) => { x.fillStyle = '#f4f7fb'; x.fillRect(0, 0, w, h); x.fillStyle = '#2f6fe4'; x.fillRect(0, 0, w, 18); txt(x, 'Poczta · 12 nowych', 11, 8, 9, '#fff');
  for (let i = 0; i < 6; i++) { x.fillStyle = i < 3 ? '#e6efff' : '#fff'; x.fillRect(6, 24 + i * 22, w - 12, 19); txt(x, ['Zapytanie o wycenę', 'Faktura 03/2025', 'Re: współpraca', 'Nowa rezerwacja', 'Opinia ⭐⭐⭐⭐⭐', 'Newsletter'][i], 10, 12, 33 + i * 22, '#345'); } });
const chartScreen = big => screenMat((x, w, h) => { x.fillStyle = '#15202e'; x.fillRect(0, 0, w, h); txt(x, big ? 'Przychody · klienci · kursy' : 'Kalendarz i przychody', 12, 10, 12, '#9fd0ff');
  const cols = ['#39c07f', '#2f9bd6', '#f9a03f']; for (let i = 0; i < 9; i++) { const v = 20 + ((i * 37) % 50) + i * 6; x.fillStyle = cols[i % 3]; x.fillRect(14 + i * (w - 28) / 9, h - 14 - v, (w - 28) / 9 - 6, v); }
  x.strokeStyle = '#ffd23f'; x.lineWidth = 2; x.beginPath(); for (let i = 0; i < 9; i++) x.lineTo(20 + i * (w - 28) / 9, h - 40 - i * 9 - (i % 2) * 8); x.stroke(); }, big ? 384 : 256, 160);
const boardTex = lv => canvasTex((x, w, h) => { x.fillStyle = '#fbfcfd'; x.fillRect(0, 0, w, h);
  txt(x, lv >= 3 ? 'STRATEGIA MARKI – Q3' : lv >= 1 ? 'NOWA OFERTA' : 'PLAN FIRMY: START', 30, w / 2, 34, '#2f6fe4', 'center');
  x.strokeStyle = '#e0563b'; x.lineWidth = 4; x.beginPath(); x.ellipse(w / 2, h / 2 + 10, 90, 44, 0, 0, 7); x.stroke(); txt(x, lv >= 3 ? 'MARKA' : 'KLIENCI', 26, w / 2, h / 2 + 10, '#e0563b', 'center');
  const notes = [['#ffd23f', 'cennik'], ['#8fe3b0', 'social'], ['#9fd0ff', lv >= 3 ? 'kurs' : 'maile'], ['#f7a8c8', lv >= 1 ? 'pakiety' : 'faktury'], ['#ffd23f', lv >= 3 ? 'zespół' : 'cele']];
  notes.forEach(([c, t], i) => { const a = i / notes.length * Math.PI * 2 + 0.3, X = w / 2 + Math.cos(a) * 190, Y = h / 2 + 10 + Math.sin(a) * 92; x.strokeStyle = '#345'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2 + Math.cos(a) * 90, h / 2 + 10 + Math.sin(a) * 44); x.lineTo(X, Y); x.stroke(); x.fillStyle = c; x.fillRect(X - 42, Y - 22, 84, 44); txt(x, t, 18, X, Y, '#234', 'center'); });
  x.strokeStyle = '#39a06a'; x.lineWidth = 3; x.beginPath(); x.moveTo(30, h - 30); for (let i = 0; i < 6; i++) x.lineTo(30 + i * 22, h - 34 - i * i * 2.4); x.stroke(); }, 512, 300);
const certTex = (t, gold) => canvasTex((x, w, h) => { x.fillStyle = '#fffaf0'; x.fillRect(0, 0, w, h); x.strokeStyle = gold ? '#c9a227' : '#2f6fe4'; x.lineWidth = 8; x.strokeRect(10, 10, w - 20, h - 20);
  txt(x, gold ? 'NAGRODA' : 'CERTYFIKAT', 22, w / 2, 44, gold ? '#a07d10' : '#2f6fe4', 'center'); txt(x, t, 15, w / 2, 84, '#345', 'center'); x.fillStyle = gold ? '#e3b23c' : '#e0563b'; x.beginPath(); x.arc(w / 2, 128, 16, 0, 7); x.fill(); }, 200, 160);
const facadeTex = (base, lit) => canvasTex((x, w, h) => { x.fillStyle = base; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) { x.fillStyle = Math.random() < lit ? '#ffe9b0' : '#6f8aa6'; x.fillRect(4 + c * 16, 4 + r * 16, 10, 11); } }, 128, 256, 1);

function officeLayout(g, lv) {
  const st = [], th = { name: lv >= 4 ? 'Marka Premium' : lv >= 2 ? 'Moje Studio · Biuro' : 'Moje Studio', icon: '🚀', floor: FLOORS.oak(), wall: '#f2ece2', signBg: lv >= 4 ? '#1f2d3d' : '#e0563b', glass: true };
  shell(g, th);
  // ---- widok za oknami: miasto, chodnik, drzewa ----
  B(g, 70, 0.04, 6, '#c9c6c0', 0, -0.06, Z0 - 3.4); B(g, 6, 0.04, 40, '#c9c6c0', X1 + 3.4, -0.06, 0);
  const fac = [facadeTex('#8fa3b8', 0.3), facadeTex('#b8a48f', 0.25), facadeTex('#a3b1bf', 0.35)];
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 12; i++) { const w = 3 + rnd() * 3, h = 6 + rnd() * 14, x = -26 + i * 4.8 + rnd(), z = -16 - rnd() * 8, m = new THREE.MeshStandardMaterial({ map: fac[i % 3], roughness: 0.7 }); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 3 + rnd() * 2), m); b.position.set(x, h / 2, z); g.add(b); }
  for (let i = 0; i < 6; i++) { const w = 3 + rnd() * 3, h = 7 + rnd() * 12, z = -12 + i * 5, m = new THREE.MeshStandardMaterial({ map: fac[(i + 1) % 3], roughness: 0.7 }); const b = new THREE.Mesh(new THREE.BoxGeometry(4, h, w), m); b.position.set(18 + rnd() * 6, h / 2, z); g.add(b); }
  for (const [x, z] of [[-6, -9], [-1, -8.6], [4, -9.2], [9, -8.8], [11.5, -3], [11.8, 3], [11.4, 8]]) { C(g, 0.1, 0.14, 1.6, '#6b4a30', x, 0.8, z); const c = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), mat('#5aa84c')); c.position.set(x, 2.3, z); c.castShadow = true; g.add(c); }

  // ======== STREFA PRACY PRZY BIURKU ========
  const DX = -5.0, DZ = -4.3, TOP = 0.76;
  B(g, 2.5, 0.06, 0.95, '#b98a5a', DX, TOP - 0.03, DZ, { roughness: 0.55 });
  for (const sx of [-1.18, 1.18]) for (const sz of [-0.4, 0.4]) B(g, 0.06, TOP - 0.06, 0.06, '#2b2f36', DX + sx, (TOP - 0.06) / 2, DZ + sz, { metalness: 0.6, roughness: 0.4 });
  B(g, 0.45, 0.6, 0.8, '#efe9df', DX + 0.9, 0.3, DZ); for (let i = 0; i < 3; i++) B(g, 0.12, 0.02, 0.02, '#888', DX + 0.9, 0.12 + i * 0.19, DZ + 0.41);
  // laptop
  const lap = new THREE.Group(); lap.position.set(DX - 0.35, TOP, DZ + 0.12); g.add(lap);
  B(lap, 0.4, 0.02, 0.27, '#c9ccd1', 0, 0.01, 0, { metalness: 0.6, roughness: 0.35 });
  const lid = new THREE.Group(); lid.position.set(0, 0.02, -0.13); lid.rotation.x = -0.28; lap.add(lid); B(lid, 0.4, 0.27, 0.012, '#c9ccd1', 0, 0.135, 0, { metalness: 0.6, roughness: 0.35 }); plane(lid, 0.37, 0.24, mailScreen(), 0, 0.135, 0.007);
  // drugi monitor (od poziomu 4 – szeroki)
  const big = lv >= 3, mw = big ? 1.1 : 0.62, mh = big ? 0.44 : 0.37, mon = new THREE.Group(); mon.position.set(DX + 0.38, TOP, DZ - 0.25); g.add(mon);
  B(mon, 0.24, 0.02, 0.18, '#2b2f36', 0, 0.01, 0); B(mon, 0.04, 0.3, 0.04, '#2b2f36', 0, 0.16, -0.02); B(mon, mw + 0.03, mh + 0.03, 0.03, '#1b1e23', 0, 0.3 + mh / 2, 0); plane(mon, mw, mh, chartScreen(big), 0, 0.3 + mh / 2, 0.017);
  // notatnik, długopis, kubek kawy, telefon, lampka, roślinka
  const nb = B(g, 0.22, 0.015, 0.3, '#2f4f7f', DX - 0.9, TOP + 0.008, DZ + 0.12); nb.rotation.y = 0.18; const pg = B(g, 0.2, 0.004, 0.28, '#fbf8f0', DX - 0.9, TOP + 0.018, DZ + 0.12); pg.rotation.y = 0.18;
  for (let i = 0; i < 5; i++) { const l = B(g, 0.14, 0.002, 0.006, '#7a8fb0', DX - 0.9, TOP + 0.021, DZ + 0.03 + i * 0.04); l.rotation.y = 0.18; }
  const pen = C(g, 0.006, 0.006, 0.15, '#e0563b', DX - 0.75, TOP + 0.01, DZ + 0.15); pen.rotation.z = Math.PI / 2; pen.rotation.y = 0.5;
  C(g, 0.042, 0.038, 0.1, '#ffffff', DX + 0.02, TOP + 0.05, DZ + 0.28); C(g, 0.036, 0.036, 0.005, '#4a2a17', DX + 0.02, TOP + 0.097, DZ + 0.28);
  const hdl = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.008, 6, 12), mat('#ffffff')); hdl.position.set(DX + 0.068, TOP + 0.05, DZ + 0.28); hdl.rotation.y = Math.PI / 2; g.add(hdl);
  B(g, 0.075, 0.009, 0.15, '#111317', DX - 0.62, TOP + 0.005, DZ + 0.3, { roughness: 0.2 });
  safe(F(g, 'lampRoundTable', DX + 1.05, DZ - 0.25, 0, 1.6, TOP)); safe(F(g, 'plantSmall2', DX - 1.08, DZ - 0.25, 0, 2, TOP));
  safe(F(g, 'chairDesk', DX - 0.3, DZ + 0.95, Math.PI));
  // regał na dokumenty i książki (lewa ściana)
  const SX = X0 + 0.22, SZ = -2.3;
  for (const dz of [-0.95, 0.95]) B(g, 0.4, 2.0, 0.04, '#8a6a48', SX, 1.0, SZ + dz); for (let i = 0; i < 5; i++) B(g, 0.4, 0.03, 1.9, '#8a6a48', SX, 0.05 + i * 0.48, SZ);
  const bc = ['#2f4f7f', '#e0563b', '#39a06a', '#f2b134', '#7b4bd6', '#e8e1d4', '#2b2f36'];
  for (let r = 0; r < 4; r++) { let z = SZ - 0.88; while (z < SZ + 0.85) { const binder = r < 2 && sd % 3 === 0, w = binder ? 0.08 : 0.03 + rnd() * 0.03, hh = binder ? 0.32 : 0.2 + rnd() * 0.14; if (z + w > SZ + 0.88) break; B(g, binder ? 0.3 : 0.2, hh, w, bc[Math.floor(rnd() * bc.length)], SX + 0.02, 0.08 + r * 0.48 + hh / 2, z + w / 2); z += w + 0.006; rnd(); } }
  safe(F(g, 'plantSmall1', SX, SZ - 0.6, 0, 2, 2.0)); safe(F(g, 'pottedPlant', X0 + 0.5, Z0 + 0.5)); safe(F(g, 'pottedPlant', X1 - 0.5, Z0 + 0.5));
  B(g, 0.5, 1.05, 0.6, '#9aa0a8', DX + 1.75, 0.53, DZ - 0.1, { metalness: 0.4, roughness: 0.5 }); for (let i = 0; i < 3; i++) B(g, 0.16, 0.03, 0.02, '#555', DX + 1.75, 0.25 + i * 0.32, DZ + 0.21);
  station(g, st, { id: 'laptop', name: 'Strefa pracy przy biurku', icon: '💻', x: DX, z: DZ + 0.35, hw: 2.7, hd: 1.7, spot: [DX - 0.3, DZ + 1.55], seat: [DX - 0.3, DZ + 0.9], seatFace: Math.PI, seatH: 0.5, face: Math.PI });

  // ======== STREFA SPOTKAŃ Z KLIENTAMI ========
  const MX = 3.8, MZ = 0.9;
  safe(F(g, 'rugRectangle', MX, MZ + 0.2, 0, 2.8, 0.005));
  safe(F(g, 'loungeDesignSofa', MX, MZ + 1.45, Math.PI)); safe(F(g, 'loungeDesignChair', MX - 1.55, MZ, Math.PI / 2)); safe(F(g, 'loungeDesignChair', MX + 1.55, MZ, -Math.PI / 2));
  safe(F(g, 'tableCoffee', MX, MZ, 0).then(h => { const bb = new THREE.Box3().setFromObject(h), y = bb.max.y;
    for (const [dx, dz] of [[-0.2, 0.05], [0.18, -0.06]]) { C(g, 0.035, 0.03, 0.07, '#ffffff', MX + dx, y + 0.035, MZ + dz); C(g, 0.06, 0.06, 0.006, '#ffffff', MX + dx, y + 0.003, MZ + dz); }
    B(g, 0.22, 0.01, 0.3, '#e0563b', MX + 0.02, y + 0.005, MZ + 0.12).rotation.y = 0.4; }));
  if (lv >= 1) safe(F(g, 'lampRoundFloor', MX + 2.5, MZ + 1.5));
  safe(F(g, 'pottedPlant', X1 - 0.5, MZ - 0.9));
  station(g, st, { id: 'meeting', name: 'Strefa spotkań z klientami', icon: '🛋️', x: MX, z: MZ + 0.3, hw: 4.4, hd: 2.8, spot: [MX - 1.55, MZ + 0.9], seat: [MX - 1.5, MZ], seatFace: Math.PI / 2, seatH: 0.42, face: Math.PI / 2 });
  // kącik kawowy (ekspres – od poziomu 3 profesjonalny)
  const KX = X1 - 0.38, KZ = 4.1;
  B(g, 0.6, 0.9, 1.7, '#e9e3d8', KX, 0.45, KZ); B(g, 0.64, 0.04, 1.74, '#4a4f57', KX, 0.92, KZ, { roughness: 0.35 });
  for (let i = 0; i < 4; i++) C(g, 0.04, 0.035, 0.09, ['#ffffff', '#e0563b', '#2f6fe4', '#f2b134'][i], KX + 0.12, 0.985, KZ - 0.78 + i * 0.1);
  if (lv >= 2) { const chrome = { metalness: 0.35, roughness: 0.25 };
    B(g, 0.42, 0.42, 0.55, '#c9ccd1', KX, 1.15, KZ + 0.25, chrome); B(g, 0.44, 0.04, 0.57, '#2b2f36', KX, 1.37, KZ + 0.25); for (const dz of [0.1, 0.4]) { B(g, 0.12, 0.05, 0.08, '#2b2f36', KX - 0.24, 1.1, KZ + dz); C(g, 0.035, 0.03, 0.06, '#ffffff', KX - 0.24, 0.97, KZ + dz); }
    C(g, 0.07, 0.09, 0.3, '#2b2f36', KX, 1.09, KZ - 0.35); const hop = C(g, 0.08, 0.04, 0.16, '#6b4a30', KX, 1.32, KZ - 0.35, { transparent: true, opacity: 0.85 }); hop.castShadow = false;
    const glow = B(g, 0.02, 0.04, 0.2, '#39c07f', KX - 0.22, 1.28, KZ + 0.25, { emissive: '#39c07f', emissiveIntensity: 1.2 }); glow.castShadow = false;
  } else safe(F(g, 'kitchenCoffeeMachine', KX, KZ + 0.2, -Math.PI / 2, 2, 0.94));
  station(g, st, { id: 'coffee', name: lv >= 2 ? 'Ekspres ciśnieniowy' : 'Ekspres do kawy', icon: '☕', x: KX, z: KZ, hw: 1.0, hd: 1.9, spot: [KX - 0.95, KZ], face: Math.PI / 2,
    act: { label: 'Wypij kawę', icon: '☕', dur: 15, energy: 1.6, fun: 0.3 } });

  // ======== STREFA KREATYWNA / NAGRANIOWA ========
  const WX = 0.9, WZ = Z0 + 0.75, wb = new THREE.Group(); wb.position.set(WX, 0, WZ); g.add(wb);
  for (const sx of [-1.05, 1.05]) { B(wb, 0.05, 1.95, 0.05, '#9aa0a8', sx, 0.98, 0, { metalness: 0.6 }); B(wb, 0.06, 0.04, 0.6, '#9aa0a8', sx, 0.03, 0, { metalness: 0.6 }); }
  B(wb, 2.1, 1.25, 0.04, '#d6dbe1', 0, 1.42, 0, { metalness: 0.5, roughness: 0.3 }); plane(wb, 2.02, 1.17, new THREE.MeshStandardMaterial({ map: boardTex(lv), roughness: 0.25 }), 0, 1.42, 0.022);
  B(wb, 1.2, 0.03, 0.08, '#c9ccd1', 0, 0.78, 0.05); for (let i = 0; i < 3; i++) { const mk = C(wb, 0.012, 0.012, 0.12, ['#2f6fe4', '#e0563b', '#39a06a'][i], -0.2 + i * 0.15, 0.81, 0.06); mk.rotation.z = Math.PI / 2; }
  station(g, st, { id: 'board', name: 'Tablica strategii', icon: '📋', x: WX, z: WZ, hw: 2.3, hd: 0.9, spot: [WX, WZ + 0.95], face: Math.PI });
  // plan nagraniowy: tło z lameli, statyw z lampą pierścieniową i kamerą
  const P = { x: 6.1, z: -4.25 }, TP = { x: 4.85, z: -2.75 };
  const back = new THREE.Group(); back.position.set(P.x + 0.2, 0, Z0 + 0.45); g.add(back); B(back, 2.2, 2.3, 0.06, '#e8dccb', 0, 1.15, 0); for (let i = 0; i < 11; i++) B(back, 0.07, 2.3, 0.05, '#8a6a48', -1.0 + i * 0.2, 1.15, 0.05);
  safe(F(g, 'plantSmall3', P.x + 0.9, Z0 + 0.75, 0, 2.4)); safe(F(g, 'stoolBar', P.x + 0.55, P.z - 0.2, 0, 1.8));
  if (lv >= 4) { const neon = plane(back, 1.3, 0.4, new THREE.MeshBasicMaterial({ map: canvasTex((x, w, h) => { x.fillStyle = '#00000000'; x.clearRect(0, 0, w, h); x.shadowColor = '#ff6fd8'; x.shadowBlur = 18; txt(x, '🚀 ' + 'MARKA', 64, w / 2, h / 2, '#ffd0f4', 'center'); }, 512, 160), transparent: true }), 0, 1.85, 0.09); neon.renderOrder = 3; }
  const tri = new THREE.Group(); tri.position.set(TP.x, 0, TP.z); tri.rotation.y = Math.atan2(P.x - TP.x, P.z - TP.z); g.add(tri);
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2, leg = C(tri, 0.012, 0.012, 1.0, '#222', Math.sin(a) * 0.2, 0.48, Math.cos(a) * 0.2); leg.rotation.set(Math.cos(a) * 0.38, 0, -Math.sin(a) * 0.38); }
  C(tri, 0.015, 0.015, 0.75, '#222', 0, 1.3, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 10, 32), mat('#ffffff', { emissive: '#fff7e6', emissiveIntensity: 1.4 })); ring.position.set(0, 1.62, 0); tri.add(ring);
  if (lv >= 3) { B(tri, 0.14, 0.1, 0.1, '#1b1e23', 0, 1.62, 0); C(tri, 0.035, 0.035, 0.08, '#2b2f36', 0, 1.62, 0.07).rotation.x = Math.PI / 2; B(tri, 0.02, 0.18, 0.02, '#222', 0.07, 1.74, 0); }
  else B(tri, 0.07, 0.14, 0.01, '#111317', 0, 1.62, 0.0);
  if (lv >= 3) { // światło softbox
    const sb = new THREE.Group(); sb.position.set(P.x - 1.3, 0, P.z + 0.3); sb.rotation.y = Math.atan2(P.x - sb.position.x, P.z - sb.position.z); g.add(sb);
    C(sb, 0.014, 0.014, 1.7, '#222', 0, 0.85, 0); B(sb, 0.5, 0.5, 0.22, '#1b1e23', 0, 1.8, 0); plane(sb, 0.46, 0.46, mat('#ffffff', { emissive: '#fffaf0', emissiveIntensity: 1.3 }), 0, 1.8, 0.115); }
  station(g, st, { id: 'camera', name: 'Kamera i lampa pierścieniowa', icon: '🎥', x: 5.5, z: -3.55, hw: 2.6, hd: 2.2, spot: [P.x, P.z], face: Math.atan2(TP.x - P.x, TP.z - P.z) });

  // ======== ROZWÓJ WYSTROJU WRAZ Z POZIOMEM ========
  if (lv === 0) { safe(F(g, 'cardboardBoxClosed', X0 + 0.7, 0.6, 0.3)); safe(F(g, 'cardboardBoxOpen', X0 + 1.4, 1.1, -0.2)); safe(F(g, 'cardboardBoxClosed', X0 + 0.65, 0.6, 0.1, 2, 0.42)); }
  const certs = [];
  if (lv >= 1) certs.push(['Kurs przedsiębiorczości', false], ['Klient roku 2024', false]);
  if (lv >= 2) certs.push(['Certyfikat eksperta', false], ['Top 10 marek miasta', true]);
  if (lv >= 4) certs.push(['Marka roku', true]);
  certs.forEach(([t, gold], i) => { const z = 0.1 + i * 0.85; B(g, 0.03, 0.56, 0.7, gold ? '#c9a227' : '#2b2b2b', X0 + 0.02, 1.75 - (i % 2) * 0.15, z, gold ? { metalness: 0.8, roughness: 0.3 } : {}); plane(g, 0.6, 0.47, new THREE.MeshStandardMaterial({ map: certTex(t, gold), roughness: 0.6 }), X0 + 0.04, 1.75 - (i % 2) * 0.15, z, Math.PI / 2); });
  if (lv >= 2) { // półka z nagrodami
    B(g, 0.26, 0.04, 1.2, '#8a6a48', X0 + 0.13, 1.18, 4.9); const gold = { metalness: 0.9, roughness: 0.25 };
    C(g, 0.05, 0.07, 0.04, '#2b2f36', X0 + 0.13, 1.22, 4.6); C(g, 0.02, 0.02, 0.12, '#e3b23c', X0 + 0.13, 1.3, 4.6, gold); C(g, 0.08, 0.03, 0.1, '#e3b23c', X0 + 0.13, 1.41, 4.6, gold);
    if (lv >= 4) { C(g, 0.07, 0.09, 0.05, '#2b2f36', X0 + 0.13, 1.225, 5.0); C(g, 0.025, 0.025, 0.2, '#e3b23c', X0 + 0.13, 1.35, 5.0, gold); C(g, 0.12, 0.04, 0.16, '#e3b23c', X0 + 0.13, 1.53, 5.0, gold); const st2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), mat('#e3b23c', gold)); st2.position.set(X0 + 0.13, 1.67, 5.0); g.add(st2); }
  }
  if (lv >= 3) { // duży ekran prezentacyjny w strefie spotkań
    const tv = new THREE.Group(); tv.position.set(MX, 0, MZ - 1.55); g.add(tv);
    B(tv, 1.8, 0.45, 0.4, '#2b2f36', 0, 0.23, 0); B(tv, 1.75, 1.0, 0.05, '#111317', 0, 1.15, -0.05); plane(tv, 1.68, 0.93, chartScreen(true), 0, 1.15, -0.02);
  }
  if (lv >= 4) { // nowoczesne oświetlenie: lampy wiszące i taśma LED
    for (const [x, z] of [[DX - 0.5, DZ], [DX + 0.6, DZ], [MX - 0.5, MZ], [MX + 0.5, MZ]]) { C(g, 0.006, 0.006, 1.0, '#222', x, 2.9, z); C(g, 0.1, 0.16, 0.22, '#1b1e23', x, 2.32, z, { metalness: 0.5 }); const b = C(g, 0.13, 0.13, 0.01, '#fff1c4', x, 2.205, z, { emissive: '#ffd27a', emissiveIntensity: 2 }); b.castShadow = false; }
    const led = mat('#fff1c4', { emissive: '#ffcf7a', emissiveIntensity: 2 }); B(g, X1 - X0, 0.03, 0.04, led, 0, 2.7, Z0 + 0.08).castShadow = false; B(g, 0.04, 0.03, Z1 - Z0, led, X0 + 0.08, 3.3, 0).castShadow = false;
  }
  return { th, st, spots: [[MX - 1.6, MZ + 1.9], [MX + 1.8, MZ + 1.9], [MX + 0.3, MZ - 0.95], [-3.0, -2.3], [-1.2, 1.4]], cam: [[0.5, 9.0, 13.5], [0, 0.6, -0.9]] };
}

let barkTex = null;
function barkSprite() {
  if (!barkTex) barkTex = canvasTex((x, w, h) => { x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(4, 14, w - 8, h - 28, 18) : x.rect(4, 14, w - 8, h - 28); x.fill(); x.strokeStyle = '#e5534b'; x.lineWidth = 5; x.stroke(); x.fillStyle = '#c0392b'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Hau!', w / 2, h / 2); }, 160, 96, 1);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: barkTex, depthTest: false })); s.scale.set(0.6, 0.36, 1); s.renderOrder = 6; return s;
}
// ============================================================
export function createWorkplace(career, deps) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(career === 'dog' ? '#bfe3ff' : '#d8e6f3');
  if (career === 'dog') { scene.fog = new THREE.Fog('#bfe3ff', 30, 70); PSY.preloadDogs(); }
  scene.add(new THREE.HemisphereLight('#ffffff', '#8a7a66', 1.15));
  const sun = new THREE.DirectionalLight('#fff4e0', 1.8); sun.position.set(7, 14, 9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); sun.shadow.bias = -0.0005; scene.add(sun);
  const room = new THREE.Group(); scene.add(room);
  const L = (LAYOUTS[career] || LAYOUTS.it)(room, deps);
  if (!L.outdoor) { const out = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat('#86c46a')); out.rotation.x = -Math.PI / 2; out.position.y = -0.11; scene.add(out); }
  const st = L.st, sim = { x: ENTRY.x, z: ENTRY.z, face: Math.PI / 2, path: [], onArrive: null };
  const npcs = [], hitMat = new THREE.MeshBasicMaterial({ visible: false });
  let ready = false;
  (async () => {
    const hairs = ['#2b1d14', '#5a3a22', '#c9853f', '#e3b65c', '#1d1510', '#8a4a2a', '#d9d4cc', '#b5562f'], skins = ['#f3cfb3', '#e8b894', '#c58c64', '#9a6644', '#f0c9aa', '#7a4e33'], cloth = ['#8fd0f0', '#a8d48a', '#f0c27a', '#e6a0b8', '#c9a6e8', '#f2f2f2', '#e5534b', '#5b7f6a', '#2f6fe4'];
    const pick = a => a[Math.floor(Math.random() * a.length)], fHair = ['Hair_Long', 'Hair_Buns', 'Hair_BuzzedFemale'], mHair = ['Hair_SimpleParted', 'Hair_Buzzed', 'Hair_SimpleParted'];
    const VAR = ['husky', 'owczarek', 'shiba', 'retriever', 'kundelek'];
    for (let i = 0; i < (L.dogs ? 5 : 4); i++) {
      const fem = Math.random() < 0.55, look = deps.genLook ? deps.genLook(i) : { body: fem ? 'f' : 'm', outfit: pick(['Peasant', 'Peasant', 'RangerNoHood']), hairModel: pick(fem ? fHair : mHair), hair: pick(hairs), skin: pick(skins), cloth: pick(cloth), beard: !fem && Math.random() < 0.35 };
      const n = { id: i, name: look.gen === 2 ? look.name : null, root: new THREE.Group(), x: DOOR.x, z: DOOR.z, face: 0, route: [], state: 'free', ch: null, req: null, wait: 0, react: null };
      n.root.visible = false; room.add(n.root);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.85, 0.7), hitMat); hit.position.y = 0.92; hit.userData.npc = i; n.root.add(hit);
      if (L.dogs) { n.dog = PSY.makeDog(VAR[i % VAR.length]); n.dog.root.visible = false; room.add(n.dog.root); n.leash = PSY.makeLeash(pick(['#2b5d8c', '#e5534b', '#39a06a', '#7a4a2a'])); n.leash.visible = false; room.add(n.leash); n.dx = DOOR.x; n.dz = DOOR.z; }
      // akcesoria: plecak albo saszetka na smaczki
      if (look.gen !== 2) { const acc = Math.random(), c = pick(['#2b2f36', '#e5534b', '#2f6fe4', '#39a06a', '#c9853f']);
        if (acc < 0.45) { const bp = new THREE.Group(); bp.position.set(0, 1.12, -0.2); n.root.add(bp); B(bp, 0.32, 0.4, 0.16, c, 0, 0, 0); B(bp, 0.26, 0.14, 0.06, c, 0, -0.08, 0.1); for (const sx of [-0.1, 0.1]) B(bp, 0.04, 0.42, 0.03, '#1f1f1f', sx, 0.04, 0.12); }
        else { B(n.root, 0.16, 0.13, 0.08, c, 0.2, 0.95, 0.08); B(n.root, 0.42, 0.03, 0.3, '#1f1f1f', 0, 0.98, 0.0).visible = false; } }
      npcs.push(n);
      try { n.ch = await deps.buildCharacter(look); n.root.add(n.ch.root); } catch (e) { console.warn('Postać w pracy bez modelu', e); }
    }
    ready = true;
  })();
  const taken = new Set();
  function freeSpot() { const fr = L.spots.map((p, i) => i).filter(i => !taken.has(i)); return fr.length ? fr[Math.floor(Math.random() * fr.length)] : null; }
  function walkTo(o, x, z) { o.route = [{ x, z }]; }
  return {
    scene, layout: L, stations: st, sim, npcs, get ready() { return ready; },
    cam: L.cam,
    /** Wpuszcza nową postać z prośbą. Zwraca obiekt postaci albo null. */
    spawn(req) {
      const n = npcs.find(x => x.state === 'free' && x.ch); if (!n) return null;
      const si = freeSpot(); if (si === null) return null;
      taken.add(si); n.spot = si; n.req = req; n.wait = 0; n.react = null; n.state = 'in';
      n.x = DOOR.x; n.z = DOOR.z; n.root.visible = true; n.happy = false;
      if (n.dog) { const on = req.who === 'klient'; n.dog.root.visible = n.leash.visible = on; n.dog.mood = Math.random() < 0.75 ? 'stress' : 'calm'; n.dx = DOOR.x - 0.6; n.dz = DOOR.z + 0.8; }
      const [x, z] = L.spots[si]; n.route = [{ x: ENTRY.x, z: ENTRY.z }, { x, z: 3.6 }, { x, z }]; return n;
    },
    leave(n, react) { n.react = react ? { t: react, until: performance.now() + 2600 } : null; n.state = 'leaving'; n.leaveAt = performance.now() + (react ? 2200 : 0); taken.delete(n.spot);
      n.happy = ['🤩', '🙂', '😊', '🥰'].includes(react); if (n.dog) n.dog.mood = n.happy ? 'happy' : react === '😠' || react === '😬' ? 'stress' : 'calm'; },
    walkSim(x, z, cb) { x = Math.max(X0 + 0.4, Math.min(X1 - 0.4, x)); z = Math.max(Z0 + 0.4, Math.min(Z1 - 0.3, z)); sim.path = [{ x, z }]; sim.onArrive = cb || null; },
    update(dt, mul, now, clips) {
      // nasza postać
      if (sim.path.length) { const t = sim.path[0], dx = t.x - sim.x, dz = t.z - sim.z, d = Math.hypot(dx, dz), s = 2.4 * mul * dt;
        if (d > 0.01) sim.face = Math.atan2(dx, dz);
        if (d <= s) { sim.x = t.x; sim.z = t.z; sim.path.shift(); if (!sim.path.length && sim.onArrive) { const cb = sim.onArrive; sim.onArrive = null; cb(); } } else { sim.x += dx / d * s; sim.z += dz / d * s; } }
      if (L.parkDogs) for (const d of L.parkDogs) d.update(dt * Math.max(mul, 0.0001), now, { moving: false, mood: d.mood });
      for (const n of npcs) {
        if (n.state === 'free') continue;
        if (n.state === 'leaving' && now >= n.leaveAt && !n.route.length) { n.route = [{ x: n.x, z: 3.6 }, { x: ENTRY.x, z: ENTRY.z }, { x: DOOR.x, z: DOOR.z }]; n.state = 'out'; }
        if (n.route.length) { const t = n.route[0], dx = t.x - n.x, dz = t.z - n.z, d = Math.hypot(dx, dz), s = 1.5 * mul * dt;
          if (d > 0.01) n.face = Math.atan2(dx, dz);
          if (d <= s) { n.x = t.x; n.z = t.z; n.route.shift(); if (!n.route.length) { if (n.state === 'in') n.state = 'wait'; else if (n.state === 'out') { n.state = 'free'; n.root.visible = false; if (n.dog) { n.dog.root.visible = false; n.leash.visible = false; } } } }
          else { n.x += dx / d * s; n.z += dz / d * s; } }
        else if (n.state === 'wait' || n.state === 'talk') n.face = Math.atan2(sim.x - n.x, sim.z - n.z);
        n.root.position.set(n.x, 0, n.z);
        let df = n.face - n.root.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); n.root.rotation.y += df * Math.min(1, dt * 8);
        if (n.dog && n.dog.root.visible) { // pies idzie obok opiekuna na długiej lince
          const ry = n.root.rotation.y, tx = n.x + Math.sin(ry + 1.1) * 1.0, tz = n.z + Math.cos(ry + 1.1) * 1.0, ddx = tx - n.dx, ddz = tz - n.dz, dd = Math.hypot(ddx, ddz), sp = 1.9 * mul * dt, moving = dd > 0.12;
          if (moving) { const k = Math.min(1, sp / dd); n.dx += ddx * k; n.dz += ddz * k; }
          const want = moving ? Math.atan2(ddx, ddz) : (n.state === 'wait' || n.state === 'talk') ? Math.atan2(sim.x - n.dx, sim.z - n.dz) : ry;
          let dr = want - n.dog.root.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr)); n.dog.root.rotation.y += dr * Math.min(1, dt * 6);
          n.dog.root.position.set(n.dx, 0, n.dz); n.dog.update(dt * Math.max(mul, 0.0001), now, { moving: moving && mul > 0, running: dd > 1.6, mood: n.dog.mood });
          if (n.dog.mood === 'happy' && now > (n.leaveAt || 0) + 2500) n.dog.mood = 'calm';
          const hand = new THREE.Vector3(Math.sin(ry + 1.3) * 0.28, 0.95, Math.cos(ry + 1.3) * 0.28).add(n.root.position), ring = n.dog.ring.getWorldPosition(new THREE.Vector3()); room.worldToLocal(ring);
          n.leash.userData.set(hand, ring);
          if (n.dog.barking && (!n.barkT || now - n.barkT > 900)) { n.barkT = now; const sp2 = barkSprite(); sp2.position.set(n.dx, 1.0 + n.dog.size * 0.5, n.dz); room.add(sp2); setTimeout(() => room.remove(sp2), 700); }
        }
        if (n.ch) { const walking = n.route.length > 0, joy = n.happy && n.state === 'leaving' && now < n.leaveAt, stressed = n.state === 'wait' && n.req && n.req.who === 'klient' && L.dogs;
          deps.animateCharacter(n.ch, walking ? { pose: 'walk', timeScale: Math.max(0.6, mul * 0.7) } : joy ? { pose: 'stand', anim: 'cheer' } : stressed ? { pose: 'stand', anim: 'arms' } : { pose: 'stand', talk: n.state === 'talk' }, dt * Math.max(mul, 0.0001), now / 1000, clips); }
      }
    },
    pick(ray) {
      const hits = ray.intersectObjects(room.children, true);
      for (const h of hits) { let o = h.object; while (o) { if (o.userData.npc !== undefined) { const n = npcs[o.userData.npc]; if (n.state !== 'free') return { npc: n }; } if (o.userData.station) return { station: st.find(s => s.id === o.userData.station) }; o = o.parent; } }
      const p = new THREE.Vector3(); if (ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), p) && p.x > X0 && p.x < X1 && p.z > Z0 && p.z < Z1) return { floor: p };
      return null;
    },
    dispose() { scene.traverse(o => { if (o.isMesh && o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); },
  };
}
