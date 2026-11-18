// Psy 3D z zaokrąglonych brył: tułów, szyja, głowa z kufą, nos, oczy, uszy, 4 łapy, ruchomy ogon.
// Rasy: husky/owczarek, retriever, mały terier, kundelek. Akcesoria: szelki typu guard, obroża, długa linka.
// Mowa ciała: stress (uszy po sobie, niska sylwetka, nisko i szybko merdający ogon, szczekanie),
//             calm (rozluźnienie, węszenie przy ziemi, radosne merdanie), lie (leży i odpoczywa).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const mats = {};
const M = (c, o = {}) => { const k = c + JSON.stringify(o); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o })); };
const capG = new Map(); const cap = (r, l) => { const k = r + '|' + l; if (!capG.has(k)) capG.set(k, new THREE.CapsuleGeometry(r, l, 6, 12)); return capG.get(k); };
const sphG = new THREE.SphereGeometry(1, 16, 12);
function mesh(geo, m, parent, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
function ball(parent, r, m, x, y, z, sx = 1, sy = 1, sz = 1) { const o = mesh(sphG, m, parent, x, y, z); o.scale.set(r * sx, r * sy, r * sz); return o; }

export const BREEDS = {
  husky: { name: 'husky', size: 1.0, coat: '#8a8f99', belly: '#f2f2f2', muzzle: '#f2f2f2', ears: 'up', tail: 'curl', leg: 0.36, body: 0.2, len: 0.55 },
  retriever: { name: 'retriever', size: 1.0, coat: '#d9a85c', belly: '#e8c58a', muzzle: '#e3b878', ears: 'flop', tail: 'feather', leg: 0.35, body: 0.2, len: 0.58 },
  terrier: { name: 'terier', size: 0.62, coat: '#f2ede4', belly: '#f2ede4', muzzle: '#c9955c', ears: 'up', tail: 'stub', leg: 0.3, body: 0.19, len: 0.46, patch: '#b07a45' },
  mutt: { name: 'kundelek', size: 0.82, coat: '#6b4a32', belly: '#c9a07a', muzzle: '#2b2018', ears: 'mixed', tail: 'feather', leg: 0.33, body: 0.19, len: 0.52, patch: '#f0e6d8' },
};
const HARNESS = ['#e5534b', '#2f6fe4', '#39c07f', '#f2b134', '#7b4bd6'];

/** Tworzy psa. Zwraca { root, collar (punkt mocowania linki), update(dt, now, {moving, mood}) , mood } */
export function makeDogProc(breed = 'retriever', opts = {}) {
  const b = BREEDS[breed] || BREEDS.retriever, s = b.size, coat = M(b.coat), belly = M(b.belly), dark = M('#1a1412', { roughness: 0.4 });
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.scale.setScalar(s);
  const H = b.leg + 0.08; body.position.y = H;
  // tułów (kapsuła wzdłuż osi Z), brzuch, łaty
  const torso = mesh(cap(b.body, b.len), coat, body); torso.rotation.x = Math.PI / 2;
  ball(body, b.body * 0.92, belly, 0, -0.06, 0.02, 1, 0.75, 2.2);
  if (b.patch) ball(body, b.body * 0.7, M(b.patch), 0.06, 0.08, -0.12, 1, 0.8, 1.2);
  if (breed === 'husky') { ball(body, b.body * 0.9, M('#4a4f58'), 0, 0.09, -0.05, 1.02, 0.7, 2.0); }
  // szyja i głowa
  const neck = new THREE.Group(); neck.position.set(0, 0.08, b.len / 2 + 0.08); body.add(neck);
  const nk = mesh(cap(b.body * 0.62, 0.16), coat, neck, 0, 0.1, 0.02); nk.rotation.x = -0.6;
  const head = new THREE.Group(); head.position.set(0, 0.24, 0.1); neck.add(head);
  ball(head, 0.15, coat, 0, 0, 0, 1, 0.95, 1.05);
  if (breed === 'husky') ball(head, 0.13, M('#f2f2f2'), 0, -0.03, 0.05, 0.9, 0.8, 1);
  const muz = mesh(cap(0.075, 0.12), M(b.muzzle), head, 0, -0.05, 0.16); muz.rotation.x = Math.PI / 2;
  ball(head, 0.035, dark, 0, -0.02, 0.27, 1.2, 0.9, 1);                 // nos
  for (const sx of [-1, 1]) { ball(head, 0.026, dark, sx * 0.065, 0.04, 0.12); ball(head, 0.008, M('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.3 }), sx * 0.07, 0.05, 0.145); }
  const mouth = ball(head, 0.035, M('#c95b6a'), 0, -0.11, 0.2, 1, 0.4, 1.4); mouth.visible = false; // język (przy dyszeniu / szczekaniu)
  // uszy
  const ears = [];
  for (const sx of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sx * 0.09, 0.1, -0.02); head.add(e);
    const up = b.ears === 'up' || (b.ears === 'mixed' && sx > 0);
    if (up) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 8), coat); c.position.y = 0.06; c.castShadow = true; e.add(c); e.rotation.z = -sx * 0.15; }
    else { const f = ball(e, 0.06, M(breed === 'retriever' ? '#c9954c' : b.coat), sx * 0.02, -0.06, 0, 0.45, 1.3, 0.9); e.rotation.z = sx * 0.35; }
    e.userData.up = up; ears.push(e);
  }
  // łapy (biodro + kapsuła), z łapkami
  const legs = [];
  for (const [x, z] of [[-0.11, b.len / 2 - 0.02], [0.11, b.len / 2 - 0.02], [-0.11, -b.len / 2 + 0.04], [0.11, -b.len / 2 + 0.04]]) {
    const hip = new THREE.Group(); hip.position.set(x, -0.04, z); body.add(hip);
    mesh(cap(0.055, b.leg - 0.1), coat, hip, 0, -b.leg / 2, 0);
    ball(hip, 0.06, M(b.belly), 0, -b.leg + 0.03, 0.03, 1, 0.6, 1.3);
    legs.push(hip);
  }
  // ogon
  const tail = new THREE.Group(); tail.position.set(0, 0.08, -b.len / 2 - 0.12); body.add(tail);
  if (b.tail === 'stub') { ball(tail, 0.05, coat, 0, 0.06, 0, 1, 1.6, 1); }
  else { const t = mesh(cap(b.tail === 'curl' ? 0.06 : 0.045, 0.3), coat, tail, 0, 0.16, -0.05); t.rotation.x = -0.35; if (b.tail === 'curl') ball(tail, 0.07, M('#f2f2f2'), 0, 0.33, -0.1); }
  // akcesoria: szelki guard, obroża, punkt mocowania linki
  const hc = M(opts.harness || HARNESS[Math.floor(Math.random() * HARNESS.length)], { roughness: 0.6 });
  if (opts.harness !== false) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(b.body * 1.02, 0.025, 6, 20), hc); band.position.z = b.len / 2 - 0.08; body.add(band);
    const band2 = band.clone(); band2.position.z = b.len / 2 - 0.22; body.add(band2);
    const pad = mesh(new THREE.BoxGeometry(0.16, 0.04, 0.26), hc, body, 0, b.body * 0.98, b.len / 2 - 0.15);
    const chest = mesh(new THREE.BoxGeometry(0.08, 0.16, 0.04), hc, body, 0, -0.03, b.len / 2 + 0.12);
    mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), M('#c9c9c9', { metalness: 0.6, roughness: 0.3 }), body, 0, b.body + 0.04, b.len / 2 - 0.15);
  }
  const collar = new THREE.Mesh(new THREE.TorusGeometry(b.body * 0.62, 0.02, 6, 16), hc); collar.position.set(0, 0.16, 0.02); collar.rotation.x = 0.6; neck.add(collar);
  const ring = new THREE.Object3D(); ring.position.set(0, b.body + 0.06, b.len / 2 - 0.15); body.add(ring);
  // stan i animacja
  const st = { mood: opts.mood || 'calm', phase: Math.random() * 10, bark: 0, sniff: 0 };
  function update(dt, now, o = {}) {
    const t = now / 1000 + st.phase, moving = !!o.moving, mood = o.mood || st.mood; st.mood = mood;
    const stress = mood === 'stress', lie = mood === 'lie';
    // łapy
    legs.forEach((l, i) => { const ph = (i === 0 || i === 3) ? 0 : Math.PI; l.rotation.x = moving ? Math.sin(t * 9 + ph) * 0.55 : lie ? (i < 2 ? -1.35 : 1.3) : 0; });
    // sylwetka
    const low = stress ? -0.07 : lie ? -b.leg + 0.12 : 0;
    body.position.y += (H + low + (moving ? Math.abs(Math.sin(t * 9)) * 0.02 : 0) - body.position.y) * Math.min(1, dt * 8);
    // głowa: węszenie przy ziemi (spokój) albo czujne patrzenie i szczekanie (stres)
    st.sniff = !moving && mood === 'calm' ? (Math.sin(t * 0.7) > 0.2 ? 1 : 0) : 0;
    const targetNeck = st.sniff ? 1.0 + Math.sin(t * 6) * 0.08 : stress ? -0.15 : lie ? 0.35 : 0.05;
    neck.rotation.x += (targetNeck - neck.rotation.x) * Math.min(1, dt * 5);
    head.rotation.y = st.sniff ? Math.sin(t * 2.2) * 0.4 : stress ? Math.sin(t * 1.3) * 0.5 : Math.sin(t * 0.5) * 0.2;
    // uszy: po sobie w stresie
    ears.forEach((e, i) => { const sx = i ? 1 : -1, base = e.userData.up ? -sx * 0.15 : sx * 0.35; e.rotation.x += ((stress ? (e.userData.up ? -0.9 : -0.4) : 0) - e.rotation.x) * Math.min(1, dt * 6); e.rotation.z = base + (stress && e.userData.up ? -sx * 0.5 : 0); });
    // ogon: nisko i nerwowo albo wysoko i radośnie
    tail.rotation.x = stress ? 0.9 : lie ? 0.6 : -0.35;
    tail.rotation.y = Math.sin(t * (stress ? 18 : 11)) * (stress ? 0.18 : lie ? 0.1 : 0.7);
    // szczekanie
    if (stress && !moving && Math.random() < dt * 0.35) st.bark = 0.35;
    if (st.bark > 0) { st.bark -= dt; head.rotation.x = -0.25 + Math.sin(st.bark * 40) * 0.1; mouth.visible = true; } else { head.rotation.x += (0 - head.rotation.x) * Math.min(1, dt * 6); mouth.visible = mood === 'calm' && !st.sniff && Math.sin(t * 0.9) > 0.6; }
  }
  return { root, ring, update, get barking() { return st.bark > 0; }, get mood() { return st.mood; }, set mood(v) { st.mood = v; }, size: s };
}

/** Długa linka treningowa (lekko zwisająca) między dłonią opiekuna a szelkami psa. */
export function makeLeash(color = '#2b5d8c') {
  const N = 12, g = new THREE.Group(), m = M(color, { roughness: 0.6 }), seg = new THREE.CylinderGeometry(0.014, 0.014, 1, 6); seg.rotateX(Math.PI / 2);
  const parts = []; for (let i = 0; i < N; i++) { const c = new THREE.Mesh(seg, m); c.castShadow = true; g.add(c); parts.push(c); }
  const pts = Array.from({ length: N + 1 }, () => new THREE.Vector3());
  g.userData.set = (a, b) => { const d = a.distanceTo(b), sag = Math.min(0.45, d * 0.22);
    for (let i = 0; i <= N; i++) { const t = i / N; pts[i].lerpVectors(a, b, t); pts[i].y -= Math.sin(t * Math.PI) * sag; }
    for (let i = 0; i < N; i++) { const c = parts[i], p0 = pts[i], p1 = pts[i + 1]; c.position.lerpVectors(p0, p1, 0.5); c.scale.set(1, 1, Math.max(0.001, p0.distanceTo(p1))); c.lookAt(p1.x + (c.parent ? 0 : 0), p1.y, p1.z); } };
  return g;
}


// ============================================================
//  Gotowe, animowane psy: Quaternius „Ultimate Animated Animal Pack” (CC0) – Husky i Shiba Inu
//  + warianty kolorystyczne (owczarek, retriever, kundelek) przez przemalowanie materiałów.
// ============================================================
const SRC = {};
export function preloadDogs() {
  return Promise.all(['Husky', 'Shiba'].map(n => SRC[n] || (SRC[n] = new Promise((ok, err) => new GLTFLoader().load(`assets/psy/${n}.glb`, ok, undefined, err)))));
}
export const DOG_VARIANTS = {
  husky: { src: 'Husky', len: 1.05, name: 'husky' },
  owczarek: { src: 'Husky', len: 1.05, name: 'owczarek', tint: { 'Material': '#2e2219', 'Material.001': '#b9803f' } },
  shiba: { src: 'Shiba', len: 0.72, name: 'shiba' },
  retriever: { src: 'Shiba', len: 0.98, name: 'retriever', tint: { 'Main': '#e2b56a', 'Main_Light': '#f3e0b4' } },
  kundelek: { src: 'Shiba', len: 0.82, name: 'kundelek', tint: { 'Main': '#6b4a32', 'Main_Light': '#dcc7a8' } },
};
const CALM = ['Idle', 'Idle_2_HeadLow', 'Idle', 'Eating', 'Idle_2'], STRESS = ['Idle_HitReact_Left', 'Idle', 'Idle_HitReact_Right', 'Attack', 'Idle'];
/** Pies z modelu. Interfejs jak w makeDogProc: { root, ring, update(dt, now, {moving, running, mood}), barking, mood } */
export function makeDog(variant = 'retriever', opts = {}) {
  const V = DOG_VARIANTS[variant] || DOG_VARIANTS[Object.keys(DOG_VARIANTS)[Math.floor(Math.random() * 5)]];
  const root = new THREE.Group(), ring = new THREE.Object3D(); root.add(ring);
  const st = { mood: opts.mood || 'calm', cur: null, timer: 0, idx: Math.floor(Math.random() * 5), bark: 0, ready: false, mixer: null, actions: {}, bones: {}, model: null, harness: null };
  const hcol = opts.harness || HARNESS[Math.floor(Math.random() * HARNESS.length)];
  SRC[V.src] || preloadDogs();
  SRC[V.src].then(g => {
    const m = SkeletonUtils.clone(g.scene);
    m.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.frustumCulled = false;
      if (V.tint) { const mats = Array.isArray(o.material) ? o.material : [o.material]; const nm = mats.map(mt => { const t = V.tint[mt.name]; if (!t) return mt; const c = mt.clone(); c.color = new THREE.Color(t); return c; }); o.material = Array.isArray(o.material) ? nm : nm[0]; } }
      if (o.isBone) st.bones[o.name] = o; });
    // skala do docelowej długości psa
    m.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(m, true), size = box.getSize(new THREE.Vector3()), long = Math.max(size.x, size.z) || 1;
    m.scale.multiplyScalar(V.len / long); m.updateMatrixWorld(true); const box2 = new THREE.Box3().setFromObject(m, true); m.position.y -= box2.min.y;
    root.add(m); st.model = m;
    st.mixer = new THREE.AnimationMixer(m);
    for (const clip of g.animations) if (!clip.name.includes('|')) st.actions[clip.name] = st.mixer.clipAction(clip);
    // szelki guard i obroża (dopasowane do pozycji kości)
    const hc = M(hcol, { roughness: 0.6 }), r = V.len * 0.13;
    const h = new THREE.Group(); const band = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.12, 6, 18), hc); h.add(band);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(r * 1.1, r * 0.25, r * 1.6), hc); pad.position.y = r * 0.95; h.add(pad);
    const clip = new THREE.Mesh(new THREE.BoxGeometry(r * 0.35, r * 0.2, r * 0.35), M('#c9c9c9', { metalness: 0.6, roughness: 0.3 })); clip.position.y = r * 1.15; h.add(clip);
    h.traverse(o => { if (o.isMesh) o.castShadow = true; }); root.add(h); st.harness = h;
    const col = new THREE.Mesh(new THREE.TorusGeometry(r * 0.62, r * 0.1, 6, 16), hc); root.add(col); st.collar = col;
    st.ready = true; play(st.mood === 'stress' ? 'Idle_HitReact_Left' : 'Idle');
  }).catch(e => console.warn('Brak modelu psa', e));
  function play(name, once) {
    const a = st.actions[name]; if (!a || st.cur === name) return;
    a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity); a.clampWhenFinished = !!once; a.play();
    const prev = st.cur && st.actions[st.cur]; if (prev) a.crossFadeFrom(prev, 0.3, false);
    st.cur = name; st.timer = 2.5 + Math.random() * 3; if (name === 'Attack') st.bark = 0.9;
  }
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion();
  function update(dt, now, o = {}) {
    if (!st.ready) return; const mood = o.mood || st.mood; st.mood = mood;
    if (o.moving) play(o.running ? 'Gallop' : 'Walk');
    else if (mood === 'happy' && st.cur !== 'Jump_ToIdle' && !st.jumped) { play('Jump_ToIdle', true); st.jumped = true; }
    else { if (mood !== 'happy') st.jumped = false; st.timer -= dt; const list = mood === 'stress' ? STRESS : CALM;
      if (st.timer <= 0 || st.cur === 'Walk' || st.cur === 'Gallop' || (st.cur === 'Jump_ToIdle' && st.timer < 1.2)) { st.idx = (st.idx + 1) % list.length; play(list[st.idx], list[st.idx] === 'Attack'); if (st.cur === 'Attack') st.timer = 1.2; } }
    st.mixer.update(dt);
    // mowa ciała: uszy po sobie i ogon nisko w stresie, merdanie w spokoju
    const t = now / 1000, B = st.bones;
    for (const e of ['Ear1.L', 'Ear1.R']) if (B[e]) B[e].rotation.x += mood === 'stress' ? -0.7 : 0;
    if (B.Tail1) { if (mood === 'stress') B.Tail1.rotation.x += 0.7; else B.Tail1.rotation.y += Math.sin(t * (mood === 'happy' ? 18 : 11)) * 0.6; }
    if (st.bark > 0) st.bark -= dt;
    // szelki i obroża za kośćmi tułowia i szyi
    root.updateMatrixWorld(true);
    const tor = B.Torso2 || B.Torso, nk = B.Neck2 || B.Neck1;
    root.getWorldQuaternion(_q);
    if (tor && st.harness) { tor.getWorldPosition(_v); root.worldToLocal(_v); st.harness.position.copy(_v); st.harness.rotation.set(0, 0, 0); ring.position.copy(_v).add(new THREE.Vector3(0, V.len * 0.16, 0)); }
    if (nk && st.collar) { nk.getWorldPosition(_v); root.worldToLocal(_v); st.collar.position.copy(_v); st.collar.rotation.set(0.5, 0, 0); }
  }
  return { root, ring, update, get barking() { return st.bark > 0; }, get mood() { return st.mood; }, set mood(v) { st.mood = v; }, size: V.len, variant: V.name };
}
