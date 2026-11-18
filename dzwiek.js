// Dźwięk generowany w całości przez Web Audio API – bez plików audio.
// Muzyka (dom / praca / budowanie), efekty (UI, monety, fanfary, dymki, kroki…) i otoczenie (ptaki, świerszcze, gwar w pracy).

const SAVE = 'domkowo3d_audio';
const cfg = Object.assign({ muted: false, music: 0.55, sfx: 0.7 }, JSON.parse(localStorage.getItem(SAVE) || '{}'));
let ctx = null, master, musicG, sfxG, ambG, verb, verbG, noiseBuf;
const save = () => localStorage.setItem(SAVE, JSON.stringify(cfg));
export const settings = cfg;

// ---------- start (odblokowanie przy pierwszym kliknięciu) ----------
export function init() {
  const unlock = () => {
    if (!ctx) build();
    if (ctx.state === 'suspended') ctx.resume();
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, unlock, { capture: true }));
}
function build() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.connect(master);
  musicG = ctx.createGain(); sfxG = ctx.createGain(); ambG = ctx.createGain();
  [musicG, sfxG, ambG].forEach(g => g.connect(comp));
  // pogłos (generowana odpowiedź impulsowa)
  verb = ctx.createConvolver(); const len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  verb.buffer = ir; verbG = ctx.createGain(); verbG.gain.value = 0.32; verb.connect(verbG); verbG.connect(comp);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  applyVolumes();
  setInterval(tick, 40);
  const k = amb; amb = null; if (k) setAmbient(k, ambNight);
}
function applyVolumes() {
  if (!ctx) return; const t = ctx.currentTime;
  master.gain.setTargetAtTime(cfg.muted ? 0 : 1, t, 0.05);
  musicG.gain.setTargetAtTime(cfg.music * 0.5 * duck, t, 0.3);
  sfxG.gain.setTargetAtTime(cfg.sfx * 0.8, t, 0.05);
  ambG.gain.setTargetAtTime(cfg.sfx * 0.5, t, 0.2);
}
let duck = 1;
export function setMuted(m) { cfg.muted = m; save(); applyVolumes(); }
export function setVolume(kind, v) { cfg[kind] = v; save(); applyVolumes(); }

// ---------- instrumenty ----------
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function env(g, t, a, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
function voice(dest, t, type, f, peak, dur, a = 0.005, send = 0.4, detune = 0) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; o.detune.value = detune;
  env(g, t, a, peak, dur); o.connect(g); g.connect(dest); if (send) { const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(verb); }
  o.start(t); o.stop(t + dur + 0.05); return o;
}
const INST = {
  piano(t, m, v = 1, dur = 2.2) { const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(700, t + dur); lp.connect(musicG);
    voice(lp, t, 'triangle', f, 0.11 * v, dur, 0.004, 0.45, -4); voice(lp, t, 'sine', f, 0.09 * v, dur * 1.1, 0.004, 0.45, 3); voice(lp, t, 'sine', f * 2, 0.025 * v, dur * 0.4, 0.003, 0.3); },
  marimba(t, m, v = 1) { const f = hz(m); voice(musicG, t, 'sine', f, 0.16 * v, 0.7, 0.003, 0.35); voice(musicG, t, 'sine', f * 4, 0.035 * v, 0.12, 0.002, 0.2); },
  pluck(t, m, v = 1) { const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(4000, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.3); lp.connect(musicG); voice(lp, t, 'triangle', f, 0.12 * v, 0.45, 0.003, 0.3); voice(lp, t, 'square', f, 0.012 * v, 0.2, 0.003, 0.2); },
  pad(t, notes, v = 1, dur = 3) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.connect(musicG); notes.forEach((m, i) => voice(lp, t, 'sine', hz(m), 0.03 * v, dur, 0.4, 0.6, i % 2 ? 6 : -6)); },
  bass(t, m, v = 1, dur = 0.8) { voice(musicG, t, 'sine', hz(m), 0.16 * v, dur, 0.01, 0.05); voice(musicG, t, 'triangle', hz(m), 0.04 * v, dur * 0.5, 0.01, 0); },
  hat(t, v = 1) { const s = ctx.createBufferSource(); s.buffer = noiseBuf; const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7500; const g = ctx.createGain(); env(g, t, 0.002, 0.025 * v, 0.05); s.connect(hp); hp.connect(g); g.connect(musicG); s.start(t, Math.random()); s.stop(t + 0.08); },
};

// ---------- muzyka ----------
// akordy jako nuty MIDI; sc – skala melodii
const MOODS = {
  home: { bpm: 74, inst: 'piano', swing: 0.04, melody: 0.32, hats: false,
    prog: [[53, 57, 60, 64], [50, 57, 60, 64], [46, 53, 57, 62], [48, 55, 58, 62]], sc: [65, 67, 69, 72, 74, 76, 77, 79],
    arp: [0, -1, 2, -1, 1, -1, 3, 2] },
  build: { bpm: 96, inst: 'marimba', swing: 0.06, melody: 0.4, hats: false,
    prog: [[48, 55, 59, 62], [45, 52, 55, 60], [41, 53, 57, 64], [43, 55, 59, 62]], sc: [72, 74, 76, 79, 81, 84, 86],
    arp: [0, 2, 1, 3, 2, 1, 3, 2] },
  lounge: { bpm: 92, inst: 'piano', swing: 0.08, melody: 0.38, hats: true,
    prog: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], sc: [69, 71, 72, 74, 76, 77, 79, 81],
    arp: [0, 2, 1, 3, 0, 2, 3, 1] },
  waltz: { bpm: 168, inst: 'piano', swing: 0, melody: 0.45, hats: false,
    prog: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 53, 57, 60], [43, 50, 55, 59]], sc: [67, 69, 71, 72, 74, 76, 77, 79],
    arp: [0, -1, 2, 3, -1, 2, 1, 3] },
  yacht: { bpm: 122, inst: 'pluck', swing: 0, melody: 0.3, hats: true,
    prog: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 62]], sc: [69, 72, 74, 76, 79, 81, 84],
    arp: [0, 2, 1, 2, 3, 2, 1, 2] },
  work: { bpm: 108, inst: 'pluck', swing: 0, melody: 0.26, hats: true,
    prog: [[45, 52, 55, 60], [41, 52, 57, 60], [48, 52, 55, 59], [43, 50, 55, 59]], sc: [69, 71, 72, 74, 76, 79, 81],
    arp: [0, 1, 2, 1, 3, 1, 2, 1] },
};
let mood = 'home', want = 'home', nextT = 0, step = 0, bar = 0, lastMel = 72;
export function setMode(m) { if (MOODS[m]) want = m; }
function scheduleStep(t) {
  const M = MOODS[mood], s = step % 8, chord = M.prog[bar % M.prog.length];
  if (s === 0) { INST.bass(t, chord[0] - 12, 1, 60 / M.bpm * 3.5); INST.pad(t, chord.slice(1), 1, 60 / M.bpm * 4.2); }
  if ((mood === 'work' || mood === 'yacht') && (s === 4)) INST.bass(t, chord[0] - 12, 0.7, 0.4); if (mood === 'yacht' && s % 2 === 0) INST.bass(t, chord[0] - 24, 0.5, 0.18);
  const ai = M.arp[s]; if (ai >= 0) { const n = chord[ai % chord.length] + (ai >= chord.length ? 12 : 0) + 12; INST[M.inst](t, n, s === 0 ? 0.9 : 0.6 + Math.random() * 0.2, mood === 'home' ? 2.4 : undefined); }
  if (M.hats && s % 2 === 1) INST.hat(t, s === 3 || s === 7 ? 1 : 0.6);
  if (Math.random() < M.melody && s % 2 === 0) { // melodia – spacer po skali, najchętniej po dźwiękach akordu
    const sc = M.sc; let i = sc.indexOf(lastMel); if (i < 0) i = Math.floor(sc.length / 2);
    i = Math.max(0, Math.min(sc.length - 1, i + [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)])); lastMel = sc[i];
    INST[M.inst === 'pluck' ? 'marimba' : M.inst](t + 0.01, lastMel, 0.55, 1.6);
  }
}
function tick() {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  if (nextT < now) nextT = now + 0.05;
  while (nextT < now + 0.25) {
    const M = MOODS[mood], e = 60 / M.bpm / 2, sw = (step % 2) ? M.swing : 0;
    scheduleStep(nextT + sw);
    nextT += e; step++;
    if (step % 8 === 0) { bar++; if (want !== mood && bar % 2 === 0) { mood = want; bar = 0; duck = 0.35; applyVolumes(); setTimeout(() => { duck = 1; applyVolumes(); }, 900); } }
  }
  ambientTick(now);
}

// ---------- efekty ----------
function noise(t, dur, freq, type, peak, dest = sfxG, q = 1) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); env(g, t, 0.002, peak, dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.02);
}
function sweep(t, f0, f1, dur, peak, type = 'sine', dest = sfxG, send = 0.15) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.004, peak, dur); o.connect(g); g.connect(dest); if (send) { const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(verb); } o.start(t); o.stop(t + dur + 0.05);
}
const bell = (t, f, peak, dur = 0.9) => { voice(sfxG, t, 'sine', f, peak, dur, 0.002, 0.35); voice(sfxG, t, 'sine', f * 2.76, peak * 0.25, dur * 0.4, 0.002, 0.2); };
const SFX = {
  click(t) { sweep(t, 1400, 900, 0.045, 0.07, 'sine', sfxG, 0); noise(t, 0.015, 3000, 'bandpass', 0.03); },
  coins(t) { for (let i = 0; i < 5; i++) { const tt = t + i * 0.055 + Math.random() * 0.02; bell(tt, 2000 + Math.random() * 900, 0.06, 0.35); } },
  cash(t) { noise(t, 0.12, 1500, 'bandpass', 0.08, sfxG, 2); bell(t + 0.1, 1568, 0.09, 0.8); bell(t + 0.22, 2093, 0.09, 1.1); },
  fanfare(t) { [60, 64, 67, 72].forEach((m, i) => { voice(sfxG, t + i * 0.11, 'triangle', hz(m + 12), 0.1, 0.5, 0.01, 0.4); voice(sfxG, t + i * 0.11, 'sawtooth', hz(m + 12), 0.012, 0.3, 0.01, 0.2); });
    [72, 76, 79, 84].forEach(m => voice(sfxG, t + 0.48, 'triangle', hz(m), 0.07, 1.4, 0.02, 0.5)); },
  success(t) { bell(t, hz(88), 0.08); bell(t + 0.12, hz(95), 0.08, 1.2); },
  levelup(t) { [76, 79, 84, 88].forEach((m, i) => { voice(sfxG, t + i * 0.08, 'sine', hz(m), 0.11, 0.5, 0.003, 0.35); voice(sfxG, t + i * 0.08, 'sine', hz(m) * 4, 0.02, 0.1, 0.002, 0.2); }); },
  pop(t) { sweep(t, 700, 240, 0.12, 0.12); noise(t, 0.03, 2000, 'bandpass', 0.03); },
  notify(t) { bell(t, 1320, 0.08, 0.7); bell(t + 0.09, 1760, 0.06, 0.9); },
  bad(t) { voice(sfxG, t, 'triangle', hz(64), 0.07, 0.25, 0.01, 0.2); voice(sfxG, t + 0.16, 'triangle', hz(59), 0.07, 0.45, 0.01, 0.3); },
  place(t) { sweep(t, 160, 60, 0.16, 0.22, 'sine', sfxG, 0.05); noise(t, 0.08, 500, 'lowpass', 0.12); },
  remove(t) { sweep(t, 300, 900, 0.12, 0.06, 'triangle'); noise(t, 0.1, 1200, 'highpass', 0.05); },
  step(t, alt) { noise(t, 0.05, alt ? 750 : 620, 'lowpass', 0.07); sweep(t, alt ? 110 : 95, 60, 0.05, 0.05, 'sine', sfxG, 0); },
  thunder(t) { noise(t, 0.25, 2500, 'highpass', 0.12); noise(t + 0.05, 2.8, 140, 'lowpass', 0.35, sfxG, 0.7); noise(t + 0.4, 2.2, 90, 'lowpass', 0.28, sfxG, 0.5); },
  alarm(t) { for (let i = 0; i < 3; i++) { voice(sfxG, t + i * 0.22, 'square', 2900, 0.035, 0.12, 0.003, 0.05); } },
  zap(t) { for (let i = 0; i < 6; i++) noise(t + i * 0.04, 0.03, 4000, 'bandpass', 0.08, sfxG, 4); sweep(t, 900, 120, 0.3, 0.06, 'sawtooth'); },
  splash(t) { noise(t, 0.6, 900, 'bandpass', 0.12, sfxG, 0.8); },
  doorbell(t) { bell(t, 659, 0.13, 1.4); bell(t + 0.42, 523, 0.13, 1.9); },
  door(t) { sweep(t, 220, 110, 0.25, 0.08, 'triangle'); noise(t, 0.2, 400, 'lowpass', 0.06); },
};
let lastPlay = {};
export function play(name) {
  if (!ctx || ctx.state !== 'running' || !SFX[name]) return;
  const now = ctx.currentTime; if (lastPlay[name] && now - lastPlay[name] < 0.06) return; lastPlay[name] = now;
  SFX[name](now + 0.005);
}
// kroki: wołane co klatkę, gdy postać idzie
let stepAcc = 0, stepAlt = false;
export function walking(dt, rate = 1) { if (!ctx) return; stepAcc += dt * rate; if (stepAcc > 0.36) { stepAcc = 0; stepAlt = !stepAlt; play('step'); } }

// ---------- otoczenie ----------
let amb = null, ambNight = false, nextAmb = 0, roomTone = null;
export function setAmbient(kind, night = false) {
  ambNight = night;
  if (kind === amb) return; amb = kind;
  if (!ctx) return;
  if (roomTone) { roomTone.g.gain.setTargetAtTime(0, ctx.currentTime, 0.4); const r = roomTone; setTimeout(() => r.s.stop(), 1500); roomTone = null; }
  if (kind === 'work') { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380; const g = ctx.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(ambG); s.start(); g.gain.setTargetAtTime(0.05, ctx.currentTime, 1); roomTone = { s, g }; }
}
function chirp(t) { const n = 2 + Math.floor(Math.random() * 4), base = 2600 + Math.random() * 1800, pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8; pan.connect(ambG);
  for (let i = 0; i < n; i++) { const tt = t + i * (0.09 + Math.random() * 0.05), f = base * (0.85 + Math.random() * 0.4); sweep(tt, f, f * (Math.random() < 0.5 ? 1.35 : 0.75), 0.07, 0.035, 'sine', pan, 0.25); } }
function cricket(t) { const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.4 - 0.7; pan.connect(ambG); for (let i = 0; i < 3; i++) voice(pan, t + i * 0.06, 'sine', 4300 + Math.random() * 300, 0.012, 0.04, 0.003, 0.1); }
function workSound(t) { const r = Math.random(); if (r < 0.5) for (let i = 0; i < 3 + Math.random() * 4; i++) noise(t + i * 0.09, 0.02, 2500, 'bandpass', 0.012, ambG, 3); else if (r < 0.75) bell(t, 2600 + Math.random() * 500, 0.012, 0.4); else { const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() - 0.5; pan.connect(ambG); for (let i = 0; i < 4; i++) voice(pan, t + i * 0.13, 'triangle', 180 + Math.random() * 80, 0.006, 0.12, 0.02, 0.2); } }
function ambientTick(now) {
  if (!amb || now < nextAmb) return;
  if (amb === 'home') { if (ambNight) { cricket(now + 0.05); nextAmb = now + 0.5 + Math.random() * 1.2; } else { chirp(now + 0.05); nextAmb = now + 1.5 + Math.random() * 4.5; } }
  else if (amb === 'work') { workSound(now + 0.05); nextAmb = now + 1.2 + Math.random() * 2.8; }
}
export const debug = () => ({ state: ctx ? ctx.state : 'brak', mood, want, amb, night: ambNight, t: ctx ? +ctx.currentTime.toFixed(1) : 0 });

// ---------- deszcz (pętla szumu, głośność 0..1) ----------
let rainNode = null;
export function setRain(level) {
  if (!ctx) return;
  if (!rainNode && level > 0) { const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.4; const g = ctx.createGain(); g.gain.value = 0; src.connect(f); f.connect(g); g.connect(ambG); src.start(); rainNode = { src, g }; }
  if (rainNode) { rainNode.g.gain.setTargetAtTime(level * 0.09, ctx.currentTime, 0.8); if (level <= 0) { const r = rainNode; rainNode = null; setTimeout(() => { try { r.src.stop(); } catch (e) {} }, 3000); } }
}
