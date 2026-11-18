// Szczegółowe domy podmiejskie generowane proceduralnie:
// bryła z gzymsami, ganek z kolumnami i schodkami, garaż albo wykusz, dach z okapem,
// lukarny, komin z cegły, okna z ramami, szprosami, okiennicami i skrzynkami na kwiaty,
// drzwi z framugą, daszkiem i lampą. Na koniec wszystko scalane w kilka siatek (szybko).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ---------- tekstury (1 kafelek = 1 m) ----------
function canvasTex(draw, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const TEX = {
  siding: canvasTex((x, s) => { const b = s / 4; for (let i = 0; i < 4; i++) { const y = i * b, g = x.createLinearGradient(0, y, 0, y + b); g.addColorStop(0, '#dcdcdc'); g.addColorStop(0.18, '#ffffff'); g.addColorStop(1, '#efefef'); x.fillStyle = g; x.fillRect(0, y, s, b); x.fillStyle = '#a8a8a8'; x.fillRect(0, y + b - 3, s, 3); } }),
  roof: canvasTex((x, s) => { const rows = 5, rh = s / rows; let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let r = 0; r < rows; r++) { const off = (r % 2) * (s / 10); for (let i = -1; i < 5; i++) { const v = 150 + Math.floor(rnd() * 70); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(off + i * s / 5 + 1, r * rh, s / 5 - 2, rh - 2); }
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, r * rh + rh - 5, s, 5); } }),
  brick: canvasTex((x, s) => { x.fillStyle = '#d8d0c8'; x.fillRect(0, 0, s, s); const rows = 14, rh = s / rows; let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let r = 0; r < rows; r++) for (let i = -1; i < 5; i++) { const v = 185 + Math.floor(rnd() * 70); x.fillStyle = `rgb(${v},${v - 20},${v - 25})`; x.fillRect((r % 2) * (s / 8) + i * s / 4 + 2, r * rh + 2, s / 4 - 4, rh - 4); } }),
  stone: canvasTex((x, s) => { x.fillStyle = '#cfcac2'; x.fillRect(0, 0, s, s); let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 40; i++) { const v = 170 + Math.floor(rnd() * 60); x.fillStyle = `rgb(${v},${v},${v - 6})`; x.fillRect(rnd() * s, rnd() * s, 30 + rnd() * 50, 20 + rnd() * 25); } }),
  paver: canvasTex((x, s) => { x.fillStyle = '#9d978d'; x.fillRect(0, 0, s, s); for (let r = 0; r < 4; r++) for (let i = 0; i < 2; i++) { const v = 200 + ((r * 3 + i * 5) % 4) * 10; x.fillStyle = `rgb(${v},${v - 4},${v - 10})`; x.fillRect(i * s / 2 + (r % 2) * s / 4 + 3, r * s / 4 + 3, s / 2 - 6, s / 4 - 6); } }),
};
const mats = {};
/** Materiał: kind = siding | trim | roof | brick | stone | paint | paver | metal */
export function M(kind, color = '#ffffff') {
  const k = kind + color; if (mats[k]) return mats[k];
  const o = { color, roughness: 0.85 };
  if (TEX[kind]) o.map = TEX[kind];
  if (kind === 'paint') o.roughness = 0.6;
  if (kind === 'metal') { o.roughness = 0.35; o.metalness = 0.3; }
  const m = new THREE.MeshStandardMaterial(o); m.userData.tile = kind === 'roof' ? 'roof' : TEX[kind] ? 'wall' : null;
  return (mats[k] = m);
}
export const glassMat = new THREE.MeshStandardMaterial({ color: '#35536e', roughness: 0.12, metalness: 0.25, emissive: '#ffcf7a', emissiveIntensity: 0 });
export const lampMat = new THREE.MeshStandardMaterial({ color: '#fff6d8', emissive: '#ffd27a', emissiveIntensity: 0.25 });
export function setNight(n) { glassMat.emissiveIntensity = n * 0.6; lampMat.emissiveIntensity = 0.25 + n * 3.4; }

// ---------- prymitywy ----------
const BOXG = new Map(), cylG = new THREE.CylinderGeometry(1, 1, 1, 14), sphG = new THREE.SphereGeometry(1, 10, 8);
function boxG(w, h, d) { const k = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`; if (!BOXG.has(k)) BOXG.set(k, new THREE.BoxGeometry(w, h, d)); return BOXG.get(k); }
export function box(g, w, h, d, m, x, y, z, ry = 0, rx = 0) { const o = new THREE.Mesh(boxG(w, h, d), m); o.position.set(x, y, z); o.rotation.set(rx, ry, 0); g.add(o); return o; }
export function cyl(g, r, h, m, x, y, z) { const o = new THREE.Mesh(cylG, m); o.scale.set(r, h, r); o.position.set(x, y, z); g.add(o); return o; }
export function sph(g, r, m, x, y, z, sy = 1) { const o = new THREE.Mesh(sphG, m); o.scale.set(r, r * sy, r); o.position.set(x, y, z); g.add(o); return o; }
function polyMesh(g, tris, m) { // tris: płaska lista punktów [x,y,z] po 3 na trójkąt
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3)); geo.computeVertexNormals();
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(tris.length * 2), 2));
  const o = new THREE.Mesh(geo, m); g.add(o); return o;
}
const quad = (a, b, c, d) => [a, b, c, a, c, d];

// ---------- dachy ----------
/** Dach czterospadowy nad prostokątem W×D (środek w 0,0,0 = góra ścian). */
export function hipRoof(g, W, D, pitch, oh, m, trim) {
  const X = W / 2 + oh, Z = D / 2 + oh, y0 = -oh * pitch, top = y0 + Math.min(X, Z) * pitch, r = Math.max(0, X - Z), rz = Math.max(0, Z - X);
  const e1 = [-X, y0, Z], e2 = [X, y0, Z], e3 = [X, y0, -Z], e4 = [-X, y0, -Z], r1 = [-r, top, rz], r2 = [r, top, rz], r3 = [r, top, -rz], r4 = [-r, top, -rz];
  polyMesh(g, [...quad(e1, e2, r2, r1), ...quad(e3, e4, r4, r3), ...quad(e2, e3, r3, r2), ...quad(e4, e1, r1, r4)], m);
  fascia(g, X, Z, y0, trim); return top;
}
/** Dach dwuspadowy, kalenica wzdłuż X. Szczyty (trójkąty) w materiale ścian. */
export function gableRoof(g, W, D, pitch, oh, m, trim, wallM) {
  const X = W / 2 + oh * 0.8, Z = D / 2 + oh, y0 = -oh * pitch, top = (D / 2) * pitch;
  polyMesh(g, [...quad([-X, y0, Z], [X, y0, Z], [X, top, 0], [-X, top, 0]), ...quad([X, y0, -Z], [-X, y0, -Z], [-X, top, 0], [X, top, 0])], m);
  for (const s of [-1, 1]) polyMesh(g, [[s * W / 2, 0, D / 2], [s * W / 2, 0, -D / 2], [s * W / 2, top, 0]], wallM);
  for (const s of [-1, 1]) box(g, 0.12, 0.2, 2 * Z, trim, 0, y0 - 0.06, s * Z, 0);
  const L = Math.hypot(Z, top - y0), ang = Math.atan2(top - y0, Z);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const b = box(g, 0.14, 0.2, L, trim, sx * X, (y0 + top) / 2 - 0.06, sz * Z / 2); b.rotation.x = sz * ang; }
  return top;
}
function fascia(g, X, Z, y, trim) { box(g, 2 * X + 0.1, 0.2, 0.1, trim, 0, y - 0.08, Z); box(g, 2 * X + 0.1, 0.2, 0.1, trim, 0, y - 0.08, -Z); box(g, 0.1, 0.2, 2 * Z, trim, X, y - 0.08, 0); box(g, 0.1, 0.2, 2 * Z, trim, -X, y - 0.08, 0); }
export function chimney(g, x, y0, z, h) { box(g, 0.85, h, 0.85, M('brick', '#b5553f'), x, y0 + h / 2, z); box(g, 1.0, 0.14, 1.0, M('stone', '#8f8a84'), x, y0 + h + 0.07, z); box(g, 0.5, 0.3, 0.5, M('paint', '#3a3a3a'), x, y0 + h + 0.28, z); }

// ---------- okna i drzwi (front okna = +Z, tył w z = 0) ----------
export function windowUnit(o = {}) {
  const g = new THREE.Group(), w = o.w || 1, h = o.h || 1.35, T = M('trim', o.trimColor || '#ffffff'), fw = 0.09, fd = 0.14;
  if (o.glass !== false) box(g, w, h, 0.04, glassMat, 0, 0, 0.03);
  if (o.frame !== false) {
    box(g, w + 2 * fw, fw, fd, T, 0, h / 2 + fw / 2, fd / 2); box(g, w + 2 * fw, fw, fd, T, 0, -h / 2 - fw / 2, fd / 2);
    box(g, fw, h, fd, T, -w / 2 - fw / 2, 0, fd / 2); box(g, fw, h, fd, T, w / 2 + fw / 2, 0, fd / 2);
    if (o.mun !== false) { box(g, 0.035, h, 0.06, T, 0, 0, 0.06); box(g, w, 0.035, 0.06, T, 0, 0, 0.06); if (w > 1.3) { box(g, 0.035, h, 0.06, T, -w / 4, 0, 0.06); box(g, 0.035, h, 0.06, T, w / 4, 0, 0.06); } }
    box(g, w + 0.38, 0.12, 0.18, T, 0, h / 2 + fw + 0.06, 0.09);
  }
  box(g, w + 0.32, 0.06, 0.24, T, 0, -h / 2 - fw - 0.03, 0.12); // parapet
  if (o.shutter) { const S = M('paint', o.shutter), sw = Math.min(0.42, w * 0.42);
    for (const s of [-1, 1]) { const x = s * (w / 2 + fw + sw / 2 + 0.04); box(g, sw, h + 0.1, 0.05, S, x, 0, 0.03);
      for (let i = 0; i < 2; i++) box(g, sw - 0.12, h * 0.38, 0.03, S, x, (i ? 1 : -1) * h * 0.22, 0.065); } }
  if (o.flowers) { const B = M('paint', o.boxColor || '#ffffff'), y = -h / 2 - fw - 0.2;
    box(g, w + 0.12, 0.22, 0.24, B, 0, y, 0.16); const F = ['#e8505b', '#f6d743', '#ec6fb4', '#ffffff', '#b07be0'];
    for (let i = 0; i < 6; i++) { const x = -w / 2 + 0.08 + i * (w - 0.16) / 5; sph(g, 0.1, M('paint', '#4f9e3f'), x, y + 0.14, 0.16, 0.8); sph(g, 0.065, M('paint', F[(i + (o.seed || 0)) % 5]), x + 0.03, y + 0.24, 0.2); } }
  return g;
}
export function doorUnit(o = {}) {
  const g = new THREE.Group(), w = o.w || 1.0, h = o.h || 2.15, T = M('trim'), D = M('paint', o.color || '#b0302b');
  if (o.panel !== false) {
    box(g, w, h, 0.06, D, 0, h / 2, 0.03);
    for (const y of [0.55, 1.25]) box(g, w * 0.7, 0.5, 0.03, D, 0, y, 0.07);
    box(g, w * 0.55, 0.35, 0.03, glassMat, 0, 1.82, 0.07);
    sph(g, 0.045, M('metal', '#d4af37'), w * 0.36, 1.05, 0.11);
  }
  if (o.frame !== false) {
    box(g, 0.14, h + 0.14, 0.14, T, -w / 2 - 0.07, (h + 0.14) / 2, 0.07); box(g, 0.14, h + 0.14, 0.14, T, w / 2 + 0.07, (h + 0.14) / 2, 0.07);
    box(g, w + 0.5, 0.16, 0.18, T, 0, h + 0.15, 0.09);
  }
  if (o.canopy !== false) { const R = M('roof', o.roofColor || '#3b3f46'); const c = box(g, w + 0.9, 0.08, 0.75, R, 0, h + 0.42, 0.36); c.rotation.x = 0.22;
    for (const s of [-1, 1]) box(g, 0.08, 0.3, 0.3, T, s * (w / 2 + 0.3), h + 0.22, 0.15); }
  if (o.lamp !== false) { const L = M('paint', '#222222'), x = w / 2 + 0.5;
    box(g, 0.12, 0.26, 0.05, L, x, 1.75, 0.03); box(g, 0.17, 0.26, 0.17, lampMat, x, 1.72, 0.15); box(g, 0.22, 0.05, 0.22, L, x, 1.87, 0.15); }
  return g;
}
/** Ganek: front na +Z, tył przy ścianie (z = 0). */
export function porch(o) {
  const g = new THREE.Group(), w = o.w, d = o.d || 2.2, fy = o.floorY ?? 0.45, h = o.h || 2.6, T = M('trim'), R = M('roof', o.roofColor || '#3b3f46');
  if (fy > 0.1) { box(g, w, 0.12, d, M('paint', '#bdb3a4'), 0, fy - 0.06, d / 2); box(g, w, fy - 0.12, 0.06, T, 0, (fy - 0.12) / 2, d - 0.03); box(g, 0.06, fy - 0.12, d, T, -w / 2 + 0.03, (fy - 0.12) / 2, d / 2); box(g, 0.06, fy - 0.12, d, T, w / 2 - 0.03, (fy - 0.12) / 2, d / 2); }
  else box(g, w, 0.04, d, M('paver'), 0, 0.02, d / 2);
  const n = w > 4.2 ? 4 : 2, xs = n === 4 ? [-w / 2 + 0.2, -0.9, 0.9, w / 2 - 0.2] : [-w / 2 + 0.2, w / 2 - 0.2], z = d - 0.2;
  for (const x of xs) { cyl(g, 0.1, h, T, x, fy + h / 2, z); box(g, 0.28, 0.12, 0.28, T, x, fy + 0.06, z); box(g, 0.3, 0.14, 0.3, T, x, fy + h - 0.07, z); }
  box(g, w + 0.3, 0.26, 0.22, T, 0, fy + h + 0.1, z);
  const slope = 0.3, L = d + 0.45, r = box(g, w + 0.6, 0.1, L, R, 0, fy + h + 0.32 + (L / 2 - 0.25) * slope * 0.5, L / 2 - 0.1); r.rotation.x = Math.atan(slope * 0.5);
  if (fy > 0.1) { // balustrada (bez środka – tam są schodki)
    for (let i = 0; i < xs.length - 1; i++) { const a = xs[i], b = xs[i + 1]; if (a < 0 && b > 0) continue;
      const len = b - a; box(g, len, 0.06, 0.08, T, (a + b) / 2, fy + 0.85, z); box(g, len, 0.06, 0.08, T, (a + b) / 2, fy + 0.12, z);
      for (let x = a + 0.2; x < b - 0.1; x += 0.2) box(g, 0.04, 0.7, 0.04, T, x, fy + 0.48, z); }
    const sw = 1.7, st = 3; for (let i = 0; i < st; i++) box(g, sw, fy / st, 0.32, M('paint', '#bdb3a4'), 0, fy / st * (st - i) - fy / st / 2, d + 0.16 + i * 0.32);
  }
  return g;
}
export function dormer(o) {
  const g = new THREE.Group(), w = 1.35, h = 1.25, d = 2.2, W = M('siding', o.wall), T = M('trim');
  box(g, w, h, d, W, 0, h / 2, -d / 2); box(g, w + 0.1, 0.12, d, T, 0, h, -d / 2);
  const win = windowUnit({ w: 0.7, h: 0.8, shutter: null }); win.position.set(0, h / 2, 0.0); g.add(win);
  const rg = new THREE.Group(); rg.position.set(0, h, -d / 2); rg.rotation.y = Math.PI / 2; g.add(rg);
  gableRoof(rg, d, w, 0.9, 0.18, M('roof', o.roof), T, W);
  return g;
}

// ---------- scalanie ----------
export function mergeStatic(group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), buckets = new Map();
  group.traverse(o => {
    if (!o.isMesh) return;
    let geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k);
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    const tile = o.material.userData.tile;
    if (tile) { // UV w metrach – deski, cegły i dachówki mają stały rozmiar
      const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i)); let u, v;
        if (tile === 'roof') { if (nz >= nx) { u = p.getX(i); v = p.getZ(i) * Math.sign(n.getZ(i) || 1) + p.getY(i); } else { u = p.getZ(i); v = p.getX(i) * Math.sign(n.getX(i)) + p.getY(i); } }
        else if (ny > 0.7) { u = p.getX(i); v = p.getZ(i); } else if (nx > nz) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
        uv.setXY(i, u, v);
      }
    }
    if (!buckets.has(o.material)) buckets.set(o.material, []);
    buckets.get(o.material).push(geo);
  });
  const out = new THREE.Group();
  for (const [m, list] of buckets) { const geo = mergeGeometries(list); const mesh = new THREE.Mesh(geo, m); mesh.castShadow = mesh.receiveShadow = true; if (m.side !== THREE.DoubleSide && list.length && m.userData.tile === 'roof') m.side = THREE.DoubleSide; out.add(mesh); }
  return out;
}

// ---------- cały dom ----------
/**
 * Dom podmiejski. Front na +Z w z = 0, drzwi w x = 0. Zwraca { group, garageX, garageZ, porchFront }.
 * cfg: { w, d, wall, roof, shutter, door, roofType: 'gable'|'hip', side: 'garage'|'bay', left, dormers, seed }
 */
export function buildHouse(cfg) {
  const g = new THREE.Group(), w = cfg.w || 9, d = cfg.d || 7, F = 0.45, fh = 2.75, floors = 2, top = F + fh * floors;
  const Wm = M('siding', cfg.wall), T = M('trim'), R = M('roof', cfg.roof), side = cfg.left ? -1 : 1, sh = cfg.shutter, seed = cfg.seed || 0;
  box(g, w + 0.12, F, d + 0.12, M('stone', '#b9b2a8'), 0, F / 2, -d / 2);
  for (let i = 0; i < floors; i++) { box(g, w, fh, d, Wm, 0, F + fh * (i + 0.5), -d / 2); box(g, w + 0.26, 0.18, d + 0.26, T, 0, F + fh * (i + 1) - (i === floors - 1 ? 0.05 : 0), -d / 2); }
  for (const x of [-w / 2, w / 2]) for (const z of [0, -d]) box(g, 0.18, fh * floors, 0.18, T, x, F + fh, z);
  const pw = Math.min(5.2, w * 0.58);
  // okna – front
  const addWin = (x, y, z, ry, o = {}) => { const u = windowUnit({ shutter: sh, seed: seed + x, ...o }); u.position.set(x, y, z); u.rotation.y = ry; g.add(u); };
  const y1 = F + 1.45, y2 = F + fh + 1.45, gx = side * (w / 2);
  const frontX = w / 2 - Math.max(1.0, (w / 2 - pw / 2) / 2);
  if (cfg.side === 'bay') {
    const bx = side * frontX, bw = 2.5, bd = 0.85, bh = fh - 0.35;
    box(g, bw, bh, bd, Wm, bx, F + bh / 2, bd / 2); box(g, bw + 0.2, 0.15, bd + 0.2, T, bx, F + bh, bd / 2);
    box(g, bw + 0.1, F, bd, M('stone', '#b9b2a8'), bx, F / 2, bd / 2);
    addWin(bx, y1 - 0.1, bd, 0, { w: 1.3, h: 1.4, shutter: null, flowers: true });
    const rg = new THREE.Group(); rg.position.set(bx, F + bh + 0.08, bd / 2 - 0.05); g.add(rg); hipRoof(rg, bw, bd * 2, 0.45, 0.2, R, T);
    addWin(-bx, y1, 0, 0, { flowers: true });
  } else for (const s of [-1, 1]) addWin(s * frontX, y1, 0, 0, { flowers: true });
  const up = w > 8.5 ? [-w / 3, 0, w / 3] : [-w / 4, w / 4];
  for (const x of up) addWin(x, y2, 0, 0, { w: 0.95, h: 1.25, flowers: x !== 0 });
  // boki i tył
  for (const s of [-1, 1]) for (const zf of [0.28, 0.72]) for (const [fy, yy] of [[0, y1], [1, y2]]) {
    if (cfg.side === 'garage' && s === side && fy === 0) continue;
    if (s === -side && zf === 0.28 && fy === 0) continue; // tu komin
    addWin(s * w / 2, yy, -d * zf, s * Math.PI / 2, { w: 0.9, h: 1.25 });
  }
  for (const x of [-w / 4, w / 4]) for (const yy of [y1, y2]) addWin(x, yy, -d, Math.PI, { w: 0.95, h: 1.2, shutter: null });
  // drzwi i ganek
  const door = doorUnit({ color: cfg.door, roofColor: cfg.roof, canopy: false }); door.position.set(0, F, 0); g.add(door);
  const p = porch({ w: pw, d: 2.3, floorY: F, h: fh - 0.25, roofColor: cfg.roof }); g.add(p);
  // dach
  const rg = new THREE.Group(); rg.position.set(0, top, -d / 2); g.add(rg);
  const pitch = cfg.roofType === 'hip' ? 0.62 : 0.75;
  const rTop = cfg.roofType === 'hip' ? hipRoof(rg, w, d, pitch, 0.55, R, T) : gableRoof(rg, w, d, pitch, 0.55, R, T, Wm);
  // lukarny na przednim spadku
  const nd = cfg.dormers ?? 1, dxs = nd === 2 ? [-w * 0.22, w * 0.22] : nd === 1 ? [0] : [];
  for (const x of dxs) { const dm = dormer({ wall: cfg.wall, roof: cfg.roof }); const zf = -d * 0.2; dm.position.set(x, top + d * 0.2 * pitch - 0.35, zf + 0.02); g.add(dm); }
  // komin z cegły przy boku
  chimney(g, -side * (w / 2 + 0.4), 0, -d * 0.28, top + rTop + 0.3);
  // garaż
  let garageX = null, garageZ = null;
  if (cfg.side === 'garage') {
    const gw = 4.3, gd = 6.2, gh = 3.0, gz = -0.9; garageX = side * (w / 2 + gw / 2); garageZ = gz;
    box(g, gw, gh, gd, Wm, garageX, gh / 2, gz - gd / 2); box(g, gw + 0.2, 0.16, gd + 0.2, T, garageX, gh, gz - gd / 2);
    for (const x of [-gw / 2, gw / 2]) box(g, 0.16, gh, 0.16, T, garageX + x, gh / 2, gz);
    box(g, 3.1, 2.35, 0.08, M('trim', '#f4f4f4'), garageX, 1.2, gz + 0.04);
    for (let i = 1; i < 4; i++) box(g, 3.1, 0.035, 0.03, M('paint', '#c9c9c9'), garageX, 2.35 * i / 4 + 0.02, gz + 0.09);
    for (let i = 0; i < 4; i++) box(g, 0.55, 0.3, 0.03, glassMat, garageX - 1.15 + i * 0.77, 1.95, gz + 0.1);
    box(g, 3.4, 0.16, 0.16, T, garageX, 2.45, gz + 0.08);
    const l2 = new THREE.Group(); box(l2, 0.12, 0.26, 0.05, M('paint', '#222222'), 0, 0, 0); box(l2, 0.17, 0.26, 0.17, lampMat, 0, -0.03, 0.12); l2.position.set(garageX - side * 1.9, 2.0, gz + 0.03); g.add(l2);
    const gr = new THREE.Group(); gr.position.set(garageX, gh, gz - gd / 2); g.add(gr); hipRoof(gr, gw, gd, 0.5, 0.4, R, T);
  }
  // rabaty przy ścianie (ściółka)
  for (const s of [-1, 1]) { const x0 = s * (pw / 2 + 0.2), x1 = s * (cfg.side === 'garage' && s === side ? w / 2 : w / 2 + 0.3); box(g, Math.abs(x1 - x0), 0.06, 1.0, M('paint', '#5b3f2c'), (x0 + x1) / 2, 0.03, 0.55); }
  return { group: mergeStatic(g), garageX, garageZ, porchFront: 2.3 + 0.96, w, d };
}

// ---------- WILLA „DIAMENT”: szklane piętro z nawisem, taras, LED, kamień, złoto ----------
const railMat = new THREE.MeshStandardMaterial({ color: '#cfefff', transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.1 });
export const ledMat = new THREE.MeshStandardMaterial({ color: '#fff2d0', emissive: '#ffd79a', emissiveIntensity: 2.2 });
export function luxVilla(g, X0, X1, Z0, Z1, h) {
  const white = M('paint', '#f7f6f2'), dark = M('paint', '#2b2f36'), stone = M('stone', '#7d756c'), gold = M('metal', '#c9a227'), wood = M('paint', '#a0703f');
  // płyta stropu parteru z okapem i pasem LED
  box(g, X1 - X0 + 0.9, 0.34, Z1 - Z0 + 0.9, white, (X0 + X1) / 2, h + 0.17, (Z0 + Z1) / 2);
  box(g, X1 - X0 + 0.9, 0.04, 0.05, ledMat, (X0 + X1) / 2, h - 0.01, Z1 + 0.44); box(g, 0.05, 0.04, Z1 - Z0 + 0.9, ledMat, X1 + 0.44, h - 0.01, (Z0 + Z1) / 2);
  // piętro – szklana bryła z nawisem w prawo
  const ux0 = X0 + 5, ux1 = X1 + 1.8, uz0 = Z0, uz1 = Z1 - 2.6, uy = h + 0.34, uh = 3.0, ucx = (ux0 + ux1) / 2, ucz = (uz0 + uz1) / 2;
  box(g, ux1 - ux0, uh, 0.25, white, ucx, uy + uh / 2, uz0 + 0.12);                    // tył
  box(g, 0.25, uh, uz1 - uz0, white, ux0 + 0.12, uy + uh / 2, ucz);                   // lewy bok
  box(g, ux1 - ux0, 0.3, uz1 - uz0, white, ucx, uy + 0.15, ucz);                      // podłoga nawisu
  box(g, ux1 - ux0 - 0.3, uh - 0.3, 0.05, glassMat, ucx, uy + uh / 2, uz1 - 0.05);   // szklana ściana frontowa
  box(g, 0.05, uh - 0.3, uz1 - uz0 - 0.3, glassMat, ux1 - 0.05, uy + uh / 2, ucz);   // szklany bok
  for (let x = ux0 + 1.5; x < ux1 - 0.2; x += 1.6) box(g, 0.08, uh, 0.12, dark, x, uy + uh / 2, uz1);
  for (let z = uz0 + 1.5; z < uz1 - 0.2; z += 1.6) box(g, 0.12, uh, 0.08, dark, ux1, uy + uh / 2, z);
  box(g, 0.14, uh, 0.14, dark, ux1, uy + uh / 2, uz1);
  box(g, ux1 - ux0 + 1.4, 0.32, uz1 - uz0 + 1.2, white, ucx + 0.2, uy + uh + 0.16, ucz + 0.3);   // dach z okapem
  box(g, ux1 - ux0 + 1.4, 0.04, 0.05, ledMat, ucx + 0.2, uy + uh - 0.01, uz1 + 0.88); box(g, 0.05, 0.04, uz1 - uz0 + 1.2, ledMat, ux1 + 0.88, uy + uh - 0.01, ucz + 0.3);
  box(g, ux1 - X1, 0.04, uz1 - uz0, ledMat, (X1 + ux1) / 2, uy - 0.01, ucz);          // LED pod nawisem
  // wnętrze piętra widoczne przez szkło: lampy, sofa, rośliny
  for (const x of [ux0 + 2, ux0 + 5, ux0 + 8, ux0 + 11]) if (x < ux1 - 0.5) box(g, 0.6, 0.05, 0.6, lampMat, x, uy + uh - 0.05, ucz);
  box(g, 2.4, 0.45, 0.9, M('paint', '#e8e2d6'), ucx - 2, uy + 0.52, uz1 - 1.2); box(g, 2.4, 0.5, 0.2, M('paint', '#e8e2d6'), ucx - 2, uy + 0.8, uz1 - 1.6);
  box(g, 0.5, 0.9, 0.5, M('paint', '#2f6f3a'), ux1 - 1, uy + 0.75, uz1 - 0.8); box(g, 2.2, 1.2, 0.05, M('paint', '#c94f7c'), ucx + 2, uy + 1.6, uz0 + 0.27);
  // taras na stropie (lewa, przednia część) ze szklaną balustradą, leżakami i parasolem
  const tx0 = X0 - 0.4, tx1 = ux0, tz0 = uz1, tz1 = Z1 + 0.44;
  box(g, tx1 - tx0, 0.05, tz1 - tz0 + (uz1 - Z0) * 0, wood, (tx0 + tx1) / 2, uy + 0.03, (tz0 + tz1) / 2);
  box(g, tx1 - tx0, 1.0, 0.04, railMat, (tx0 + tx1) / 2, uy + 0.55, tz1 - 0.02); box(g, 0.04, 1.0, Z1 - Z0 + 0.9, railMat, tx0 + 0.02, uy + 0.55, (Z0 + Z1) / 2);
  box(g, tx1 - tx0, 0.05, 0.06, M('metal', '#cfcfcf'), (tx0 + tx1) / 2, uy + 1.06, tz1 - 0.02); box(g, 0.06, 0.05, Z1 - Z0 + 0.9, M('metal', '#cfcfcf'), tx0 + 0.02, uy + 1.06, (Z0 + Z1) / 2);
  for (const x of [tx0 + 1.2, tx0 + 2.4]) { const l = box(g, 0.7, 0.12, 1.8, white, x, uy + 0.4, tz1 - 1.4); l.rotation.x = 0; const bk = box(g, 0.7, 0.1, 0.7, white, x, uy + 0.65, tz1 - 2.3); bk.rotation.x = 0.7; }
  cyl(g, 0.03, 2.3, M('metal', '#cfcfcf'), tx1 - 1.2, uy + 1.2, tz1 - 1.5); const um = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.45, 10), M('paint', '#ffffff')); um.position.set(tx1 - 1.2, uy + 2.4, tz1 - 1.5); g.add(um);
  for (const z of [tz0 + 0.5, (Z0 + Z1) / 2 - 2]) { box(g, 0.5, 0.5, 0.5, dark, tx0 + 0.5, uy + 0.27, z); sph(g, 0.38, M('paint', '#3f8f3a'), tx0 + 0.5, uy + 0.75, z); }
  // lądowisko dla helikoptera na dachu piętra
  const ry = uy + uh + 0.33, hx = ucx + 0.6, hz = ucz + 0.2;
  cyl(g, 3.0, 0.04, M('paint', '#3a3f47'), hx, ry + 0.02, hz); const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.08, 6, 40), M('paint', '#f6d743')); ring.rotation.x = Math.PI / 2; ring.position.set(hx, ry + 0.05, hz); g.add(ring);
  for (const sx of [-0.55, 0.55]) box(g, 0.3, 0.03, 1.8, M('paint', '#ffffff'), hx + sx, ry + 0.05, hz); box(g, 1.1, 0.03, 0.3, M('paint', '#ffffff'), hx, ry + 0.05, hz);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; box(g, 0.15, 0.08, 0.15, ledMat, hx + Math.cos(a) * 2.9, ry + 0.06, hz + Math.sin(a) * 2.9); }
  const heli = new THREE.Group(); heli.position.set(hx - 0.3, ry + 0.05, hz + 0.4); heli.rotation.y = 0.5; g.add(heli);
  const hb = M('metal', '#e8e8ec'), hd = M('paint', '#1f2d3d');
  for (const sx of [-0.5, 0.5]) box(heli, 0.08, 0.08, 2.4, hd, sx, 0.08, 0);
  sph(heli, 0.85, hb, 0, 0.95, 0.2, 0.75); sph(heli, 0.62, glassMat, 0, 1.05, 0.7, 0.7);
  const boom = box(heli, 0.18, 0.18, 2.6, hb, 0, 1.05, -1.6); box(heli, 0.06, 0.6, 0.35, hd, 0, 1.3, -2.85);
  cyl(heli, 0.06, 0.4, hd, 0, 1.75, 0.15); for (const a of [0, Math.PI / 2]) box(heli, 0.12, 0.03, 4.4, hd, 0, 1.95, 0.15, a);
  // kamienna ściana-rzeźba łącząca kondygnacje i złote akcenty wejścia
  box(g, 0.7, h + uh + 0.6, 3.2, stone, ux0 - 0.35, (h + uh + 0.6) / 2, Z1 - 2.0);
  return { tx0, tx1 };
}
/** Wejście do willi: lewitujący daszek z LED, złote ramy i podświetlenia. */
export function luxEntrance(g, x, z, h) {
  const gold = M('metal', '#c9a227'), white = M('paint', '#f7f6f2');
  box(g, 3.6, 0.16, 2.4, white, x, h + 0.1, z + 1.1); box(g, 3.6, 0.03, 0.05, ledMat, x, h + 0.01, z + 2.28);
  for (const s of [-1, 1]) { box(g, 0.14, h, 0.14, gold, x + s * 1.1, h / 2, z + 0.1); box(g, 0.25, 0.25, 0.25, lampMat, x + s * 1.6, 0.13, z + 1.9); }
  box(g, 2.36, 0.14, 0.14, gold, x, h, z + 0.1);
  for (let i = 0; i < 3; i++) box(g, 1.6 - i * 0.1, 0.12, 0.4, M('stone', '#d8d2c5'), x, 0.06 - i * 0.0, z + 0.4 + i * 0.42);
}

// ---------- LUKSUSOWE MATERIAŁY (Beverly Hills) ----------
function texLux(draw, size = 512) { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
let seedL = 12345; const rndL = () => (seedL = (seedL * 16807) % 2147483647) / 2147483647;
export const LUXTEX = {
  // parkiet w jodełkę (orzech), kafelek = 2 m
  parquet: texLux((x, s) => {
    x.fillStyle = '#4a2e1a'; x.fillRect(0, 0, s, s);
    const L = s / 5, W = L / 4;
    for (let row = -2; row < 8; row++) for (let i = -2; i < 24; i++) {
      const v = 110 + Math.floor(rndL() * 45), col = `rgb(${v},${Math.floor(v * 0.62)},${Math.floor(v * 0.36)})`;
      for (const dir of [1, -1]) {
        x.save(); x.translate(i * W * 1.414 * 0.7 + (dir < 0 ? W * 0.99 : 0), row * L * 0.99 + i * 0); x.rotate(dir * Math.PI / 4);
        const g = x.createLinearGradient(0, 0, L, 0); g.addColorStop(0, col); g.addColorStop(0.5, `rgb(${v + 12},${Math.floor((v + 12) * 0.63)},${Math.floor((v + 12) * 0.37)})`); g.addColorStop(1, col);
        x.fillStyle = g; x.fillRect(0, 0, L, W - 1.5); for (let q = 0; q < 4; q++) { x.fillStyle = `rgba(55,28,10,${0.1 + rndL() * 0.15})`; x.fillRect(rndL() * L * 0.3, 1.5 + rndL() * (W - 5), L * (0.4 + rndL() * 0.6), 0.8); } x.fillStyle = 'rgba(30,15,5,.5)'; x.fillRect(0, W - 1.5, L, 1.5); x.restore();
      }
    }
  }),
  // jasny marmur z żyłkami
  marble: texLux((x, s) => {
    const g = x.createLinearGradient(0, 0, s, s); g.addColorStop(0, '#f4f2ee'); g.addColorStop(1, '#e9e5de'); x.fillStyle = g; x.fillRect(0, 0, s, s);
    for (let k = 0; k < 18; k++) { const gold = k % 4 === 0; x.strokeStyle = gold ? `rgba(196,150,60,${0.35 + rndL() * 0.3})` : `rgba(${120 + rndL() * 40},${120 + rndL() * 40},${130 + rndL() * 40},${0.12 + rndL() * 0.25})`; x.lineWidth = (gold ? 1.2 : 0.6) + rndL() * 2.2;
      x.beginPath(); let px = rndL() * s, py = 0; x.moveTo(px, py); while (py < s) { px += (rndL() - 0.5) * 60; py += 20 + rndL() * 40; x.lineTo(px, py); } x.stroke(); }
    x.strokeStyle = 'rgba(160,150,140,.35)'; x.lineWidth = 2; x.strokeRect(0, 0, s, s); // fugi płyt 1×1 m
    x.beginPath(); x.moveTo(s / 2, 0); x.lineTo(s / 2, s); x.moveTo(0, s / 2); x.lineTo(s, s / 2); x.stroke();
  }),
  // deski tarasowe
  deck: texLux((x, s) => { const n = 10, h = s / n; for (let i = 0; i < n; i++) { const v = 150 + Math.floor(rndL() * 40); x.fillStyle = `rgb(${v},${Math.floor(v * 0.66)},${Math.floor(v * 0.42)})`; x.fillRect(0, i * h, s, h - 3); x.fillStyle = '#3d2716'; x.fillRect(0, i * h + h - 3, s, 3); x.fillRect(((i * 137) % s), i * h, 3, h); } }, 256),
  // gruby dywan z fakturą
  rug: texLux((x, s) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, s, s);
    const c = s / 2; x.save(); x.translate(c, c);
    for (let r = 5; r > 0; r--) { x.fillStyle = r % 2 ? 'rgba(120,70,40,.28)' : 'rgba(30,50,80,.22)'; x.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = r * 34 * (i % 2 ? 0.72 : 1); x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); x.fill(); }
    x.restore();
    for (const [o, w, col] of [[14, 18, 'rgba(30,50,80,.35)'], [40, 6, 'rgba(160,110,50,.45)'], [56, 3, 'rgba(30,50,80,.3)']]) { x.strokeStyle = col; x.lineWidth = w; x.strokeRect(o, o, s - 2 * o, s - 2 * o); }
    for (let i = 0; i < 16; i++) { x.fillStyle = 'rgba(160,110,50,.4)'; const p = 14 + i * (s - 28) / 16; for (const [xx, yy] of [[p, 23], [p, s - 23], [23, p], [s - 23, p]]) { x.beginPath(); x.arc(xx, yy, 4, 0, 7); x.fill(); } }
    for (let i = 0; i < 12000; i++) { const v = 180 + rndL() * 75; x.fillStyle = `rgba(${v},${v},${v},.25)`; x.fillRect(rndL() * s, rndL() * s, 1.5, 2.5); } }, 512),
  // drewno ze słojami (orzech, biurka, szafki)
  wood: texLux((x, s) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) { const y0 = rndL() * s, a = 2 + rndL() * 6, f = 0.01 + rndL() * 0.02; x.strokeStyle = `rgba(70,40,20,${0.06 + rndL() * 0.14})`; x.lineWidth = 0.6 + rndL() * 1.6; x.beginPath(); for (let px = 0; px <= s; px += 8) x.lineTo(px, y0 + Math.sin(px * f + i) * a); x.stroke(); }
    for (let k = 0; k < 5; k++) { const cx = rndL() * s, cy = rndL() * s; for (let r = 3; r < 14; r += 3) { x.strokeStyle = 'rgba(60,30,12,.12)'; x.beginPath(); x.ellipse(cx, cy, r * 2.2, r, 0, 0, 7); x.stroke(); } } }, 256),
  // płytki łazienkowe 30×30 z fugami
  tiles: texLux((x, s) => { const n = 6, t = s / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 236 + Math.floor(rndL() * 12); x.fillStyle = `rgb(${v},${v},${v - 4})`; x.fillRect(i * t, j * t, t, t);
    for (let k = 0; k < 3; k++) { x.strokeStyle = `rgba(150,150,160,${0.08 + rndL() * 0.1})`; x.lineWidth = 0.6; x.beginPath(); x.moveTo(i * t + rndL() * t, j * t); x.lineTo(i * t + rndL() * t, j * t + t); x.stroke(); } }
    x.strokeStyle = '#a9a39a'; x.lineWidth = 3; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * t, 0); x.lineTo(i * t, s); x.moveTo(0, i * t); x.lineTo(s, i * t); x.stroke(); } }, 512),
  // aksamit / tkanina obiciowa – splot i miękkie przetarcia
  velvet: texLux((x, s) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, s, s); for (let i = 0; i < s; i += 2) { x.fillStyle = `rgba(0,0,0,${0.025 + rndL() * 0.05})`; x.fillRect(i, 0, 1, s); x.fillStyle = `rgba(255,255,255,${0.03 + rndL() * 0.04})`; x.fillRect(0, i, s, 1); }
    for (let k = 0; k < 40; k++) { const g = x.createRadialGradient(rndL() * s, rndL() * s, 1, 0, 0, 0); x.fillStyle = `rgba(255,255,255,${0.03 + rndL() * 0.04})`; x.beginPath(); x.ellipse(rndL() * s, rndL() * s, 10 + rndL() * 30, 4 + rndL() * 10, rndL() * 3, 0, 7); x.fill(); } }, 256),
  // juta – dolna warstwa dywanów
  jute: texLux((x, s) => { x.fillStyle = '#c9b48a'; x.fillRect(0, 0, s, s); for (let i = 0; i < s; i += 4) for (let j = 0; j < s; j += 4) { const v = 150 + Math.floor(rndL() * 60); x.fillStyle = `rgba(${v},${v - 25},${v - 70},.55)`; x.fillRect(i + ((j / 4) % 2) * 2, j, 3, 2); } }, 256),
  // tkanina (len) – zasłony, sofy
  fabric: texLux((x, s) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, s, s); for (let i = 0; i < s; i += 3) { x.fillStyle = `rgba(0,0,0,${0.03 + rndL() * 0.04})`; x.fillRect(i, 0, 1, s); x.fillRect(0, i, s, 1); } }, 128),
};
// podłogi do nowych domów (tekstura = 4 m): deski dębowe, terakota, beton polerowany, szachownica
LUXTEX.oak = texLux((x, s) => { const n = 20, h = s / n; for (let i = 0; i < n; i++) { let px = -((i * 97) % 300); while (px < s) { const L = 180 + rndL() * 260, v = 175 + Math.floor(rndL() * 40); x.fillStyle = `rgb(${v},${Math.floor(v * 0.74)},${Math.floor(v * 0.5)})`; x.fillRect(px, i * h, L - 2, h - 1.5);
  for (let q = 0; q < 3; q++) { x.fillStyle = `rgba(90,55,25,${0.08 + rndL() * 0.1})`; x.fillRect(px + rndL() * L * 0.3, i * h + 2 + rndL() * (h - 5), L * (0.3 + rndL() * 0.6), 0.8); } x.fillStyle = 'rgba(60,35,15,.6)'; x.fillRect(px + L - 2, i * h, 2, h); px += L; } x.fillStyle = 'rgba(60,35,15,.55)'; x.fillRect(0, i * h + h - 1.5, s, 1.5); } });
LUXTEX.terracotta = texLux((x, s) => { const n = 12, t = s / n; x.fillStyle = '#e9dccb'; x.fillRect(0, 0, s, s); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = Math.floor(rndL() * 30); x.fillStyle = `rgb(${190 + v},${105 + v},${70 + v / 2})`; x.fillRect(i * t + 2, j * t + 2, t - 4, t - 4); x.fillStyle = `rgba(255,220,180,${rndL() * 0.15})`; x.fillRect(i * t + 4, j * t + 4, t * 0.5, t * 0.3); } });
LUXTEX.concrete = texLux((x, s) => { x.fillStyle = '#c9c6c0'; x.fillRect(0, 0, s, s); for (let i = 0; i < 9000; i++) { const v = 170 + rndL() * 70; x.fillStyle = `rgba(${v},${v},${v - 3},.3)`; x.fillRect(rndL() * s, rndL() * s, 1 + rndL() * 4, 1 + rndL() * 4); }
  for (let k = 0; k < 6; k++) { const g = x.createRadialGradient(rndL() * s, rndL() * s, 5, rndL() * s, rndL() * s, 160); g.addColorStop(0, 'rgba(120,118,112,.12)'); g.addColorStop(1, 'rgba(120,118,112,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); }
  x.strokeStyle = 'rgba(90,88,84,.5)'; x.lineWidth = 1.5; for (let i = 0; i <= 2; i++) { x.beginPath(); x.moveTo(i * s / 2, 0); x.lineTo(i * s / 2, s); x.moveTo(0, i * s / 2); x.lineTo(s, i * s / 2); x.stroke(); } });
LUXTEX.checker = texLux((x, s) => { const n = 8, t = s / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? '#1d1d22' : '#f2efe8'; x.fillRect(i * t, j * t, t, t); } x.strokeStyle = 'rgba(150,150,150,.4)'; x.lineWidth = 1; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * t, 0); x.lineTo(i * t, s); x.moveTo(0, i * t); x.lineTo(s, i * t); x.stroke(); } });
LUXTEX.fabric.repeat.set(3, 3); LUXTEX.rug.repeat.set(1, 1); LUXTEX.wood.repeat.set(1.5, 1.5); LUXTEX.velvet.repeat.set(2, 2); LUXTEX.jute.repeat.set(3, 3);
let ENV = null; const envMats = new Set();
/** Mapa otoczenia (odbicia) – ustawiana raz z gry. */
export function setEnv(tex) { ENV = tex; envMats.forEach(m => { m.envMap = tex; m.needsUpdate = true; }); }
function withEnv(m, i = 1) { m.envMapIntensity = i; envMats.add(m); if (ENV) m.envMap = ENV; return m; }
withEnv(glassMat, 1.2);
// ---------- prawdziwe tekstury CC0 z Poly Haven (CDN) – z awaryjnymi teksturami proceduralnymi ----------
// Do czasu pobrania (albo gdy nie ma internetu) materiały używają tekstur rysowanych w canvasie.
const PH_BASE = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/';
const PH_SRC = {   // size – rzeczywisty rozmiar tekstury w metrach; gray – zamiana na szarą fakturę barwioną kolorem materiału
  wood: { id: 'wood_floor_deck', diff: 'diff', size: 1.8 },
  marble: { id: 'marble_01', diff: 'diff', size: 1.5 },
  brick: { id: 'red_brick', diff: 'diff', size: 1.4 },
  concrete: { id: 'concrete_floor_painted', diff: 'diff', size: 2.0, gray: 0.8, contrast: 0.55 },
  fabric: { id: 'fabric_pattern_07', diff: 'col_1', size: 0.4, gray: 0.9, contrast: 0.5 },
};
const phTex = {}, phWait = new Map();
export const phStatus = {};
/** Podpina materiał pod teksturę Poly Haven (od razu albo po pobraniu). uvM – ile metrów zajmuje 1 jednostka UV. */
export function usePH(m, key, uvM = 1) { if (phTex[key]) applyPH(m, key, uvM); else { if (!phWait.has(key)) phWait.set(key, []); phWait.get(key).push([m, uvM]); } return m; }
function applyPH(m, key, uvM) {
  const T = phTex[key], rep = uvM / PH_SRC[key].size;
  const mk = t => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rep, rep); c.anisotropy = 8; c.needsUpdate = true; return c; };
  m.map = mk(T.map); if (T.rough) m.roughnessMap = mk(T.rough);
  m.color.set(m.userData.phColor || '#ffffff'); if (m.userData.phRough != null) m.roughness = m.userData.phRough; m.needsUpdate = true;
}
function toTex(image, s, srgb) {
  let src = image;
  if (s && s.gray) { // szara faktura o średniej jasności s.gray (kolor nadaje materiał)
    const c = document.createElement('canvas'); c.width = image.width; c.height = image.height; const x = c.getContext('2d'); x.drawImage(image, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height), p = d.data; let sum = 0;
    for (let i = 0; i < p.length; i += 4) { const l = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; p[i] = l; sum += l; }
    const mean = sum / (p.length / 4);
    for (let i = 0; i < p.length; i += 4) { const v = Math.max(0, Math.min(255, s.gray * 255 + (p[i] - mean) * s.contrast)); p[i] = p[i + 1] = p[i + 2] = v; }
    x.putImageData(d, 0, 0); src = c;
  }
  const t = new THREE.Texture(src); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t;
}
/** Pobiera tekstury (kolor + mapa chropowatości) z CDN Poly Haven. Bez internetu zostają tekstury proceduralne. */
export function loadPolyHaven() {
  const loader = new THREE.ImageLoader(); loader.setCrossOrigin('anonymous');
  const img = url => new Promise((res, rej) => loader.load(url, res, undefined, rej));
  return Promise.all(Object.entries(PH_SRC).map(async ([key, s]) => {
    const base = PH_BASE + s.id + '/' + s.id + '_';
    const [d, r] = await Promise.allSettled([img(base + s.diff + '_1k.jpg'), img(base + 'rough_1k.jpg')]);
    if (d.status !== 'fulfilled') { phStatus[key] = 'proceduralna'; console.info('Poly Haven niedostępny – zostaje tekstura proceduralna:', key); return; }
    phTex[key] = { map: toTex(d.value, s, true), rough: r.status === 'fulfilled' ? toTex(r.value, null, false) : null };
    phStatus[key] = 'Poly Haven';
    (phWait.get(key) || []).forEach(([m, u]) => applyPH(m, key, u)); phWait.delete(key);
  }));
}
/** Materiał podłogi: drewno i parkiet, marmur, beton – z prawdziwymi teksturami; reszta jak w L(). */
export function floorL(kind) {
  if (kind === 'parquet' || kind === 'oak') return L('floorWood_' + kind);
  if (kind === 'marble') return L('floorMarble');
  return L(kind);
}
const luxCache = {};
/** Materiały luksusowe: marble, parquet, gold, chrome, velvet, linen, leather, glassLux, ceramic, deck, rug */
export function L(kind, color) {
  const k = kind + (color || ''); if (luxCache[k]) return luxCache[k]; let m;
  switch (kind) {
    case 'marble': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.marble, color: color || '#ffffff', roughness: 0.12, clearcoat: 0.8, clearcoatRoughness: 0.08 }), 0.7); break;
    case 'parquet': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.parquet, color: color || '#ffffff', roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3 }), 0.4); break;
    case 'gold': m = withEnv(new THREE.MeshStandardMaterial({ color: color || '#d4a83a', metalness: 1, roughness: 0.22 }), 1.3); break;
    case 'chrome': m = withEnv(new THREE.MeshStandardMaterial({ color: color || '#e8e8ec', metalness: 1, roughness: 0.12 }), 1.3); break;
    case 'velvet': m = new THREE.MeshStandardMaterial({ color: color || '#2f3b52', roughness: 0.92, map: LUXTEX.velvet }); m.userData.phColor = color || '#2f3b52'; usePH(m, 'fabric', 1); break;
    case 'linen': m = new THREE.MeshStandardMaterial({ color: color || '#efe7da', roughness: 1, map: LUXTEX.fabric }); m.userData.phColor = color || '#efe7da'; usePH(m, 'fabric', 1); break;
    case 'floorWood_parquet': case 'floorWood_oak': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX[kind.slice(10)], color: '#ffffff', roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.35 }), 0.4); m.userData.phRough = 0.75; usePH(m, 'wood', 4); break;
    case 'floorMarble': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.marble, color: '#ffffff', roughness: 0.15, clearcoat: 0.8, clearcoatRoughness: 0.08 }), 0.7); m.userData.phRough = 0.45; usePH(m, 'marble', 4); break;
    case 'leather': m = withEnv(new THREE.MeshStandardMaterial({ color: color || '#5a3a24', roughness: 0.45 }), 0.4); break;
    case 'glassLux': m = withEnv(new THREE.MeshPhysicalMaterial({ color: color || '#dff3ff', roughness: 0.02, transmission: 0, transparent: true, opacity: 0.35, clearcoat: 1 }), 1.5); break;
    case 'ceramic': m = withEnv(new THREE.MeshPhysicalMaterial({ color: color || '#f2efe8', roughness: 0.25, clearcoat: 0.6 }), 0.6); break;
    case 'lacquer': m = withEnv(new THREE.MeshPhysicalMaterial({ color: color || '#1a1a1a', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }), 0.8); break;
    case 'deck': m = new THREE.MeshStandardMaterial({ map: LUXTEX.deck, color: color || '#ffffff', roughness: 0.7 }); break;
    case 'rug': m = new THREE.MeshStandardMaterial({ map: LUXTEX.rug, color: color || '#e9e1d3', roughness: 1 }); break;
    case 'walnut': m = withEnv(new THREE.MeshStandardMaterial({ color: color || '#5b3a22', roughness: 0.45, map: LUXTEX.wood }), 0.3); break;
    case 'tiles': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.tiles, color: color || '#ffffff', roughness: 0.2, clearcoat: 0.5 }), 0.5); break;
    case 'oak': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.oak, color: color || '#ffffff', roughness: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.4 }), 0.3); break;
    case 'terracotta': m = withEnv(new THREE.MeshStandardMaterial({ map: LUXTEX.terracotta, color: color || '#ffffff', roughness: 0.7 }), 0.2); break;
    case 'concrete': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.concrete, color: color || '#ffffff', roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.2 }), 0.5); m.userData.phColor = '#e6e3dc'; m.userData.phRough = 0.6; usePH(m, 'concrete', 4); break;
    case 'checker': m = withEnv(new THREE.MeshPhysicalMaterial({ map: LUXTEX.checker, color: color || '#ffffff', roughness: 0.2, clearcoat: 0.6 }), 0.5); break;
    case 'jute': m = new THREE.MeshStandardMaterial({ map: LUXTEX.jute, color: color || '#ffffff', roughness: 1 }); break;
    case 'glow': m = new THREE.MeshStandardMaterial({ color: color || '#fff2d0', emissive: color || '#ffd79a', emissiveIntensity: 2.2 }); break;
    default: m = new THREE.MeshStandardMaterial({ color: color || '#ffffff' });
  }
  return (luxCache[k] = m);
}
/** Zasłony po bokach okna (wnętrze na +Z). w – szerokość okna, h – wysokość ściany. */
/** Frędzle na krótszych bokach dywanu (dywan w×d, środek w 0). */
export function rugFringe(g, w, d, color = '#efe6d6') {
  const F = new THREE.MeshStandardMaterial({ color, roughness: 1 }), geo = new THREE.BoxGeometry(0.025, 0.012, 0.13);
  for (const s of [-1, 1]) for (let x = -w / 2 + 0.05; x <= w / 2 - 0.05; x += 0.06) { const f = new THREE.Mesh(geo, F); f.position.set(x, 0.01, s * (d / 2 + 0.06)); g.add(f); }
}
export function curtains(w, h, color = '#e9dfcf') {
  const g = new THREE.Group(), F = L('linen', color), gold = L('gold');
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, w + 0.7, 8), gold); rod.rotation.z = Math.PI / 2; rod.position.set(0, h - 0.12, 0.12); g.add(rod);
  for (const s of [-1, 1]) { const x = s * (w / 2 + 0.05);
    for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, h - 0.2, 0.06), F); p.position.set(x + s * i * 0.085 - s * 0.12, (h - 0.2) / 2, 0.1 + (i % 2) * 0.04); p.castShadow = true; g.add(p); }
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 6, 16), gold); tie.position.set(x, 1.0, 0.14); tie.rotation.y = Math.PI / 2; g.add(tie); }
  return g;
}
