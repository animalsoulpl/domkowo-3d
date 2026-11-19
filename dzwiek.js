// Dźwięk generowany w całości przez Web Audio API – bez plików audio.
// Muzyka (dom / praca / budowanie), efekty (UI, monety, fanfary, dymki, kroki…) i otoczenie (ptaki, świerszcze, gwar w pracy).

const SAVE = 'domkowo3d_audio';
const cfg = Object.assign({ muted: false, music: 0.55, sfx: 0.7, voiceMode: 'simlish' }, JSON.parse(localStorage.getItem(SAVE) || '{}'));
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
  piano(t, m, v = 1, dur = 1.4) {
    const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(1100, t + dur); lp.connect(musicG);
    voice(lp, t, 'triangle', f, 0.12 * v, dur, 0.003, 0.35, -3);
    voice(lp, t, 'sine', f, 0.1 * v, dur * 1.05, 0.003, 0.35, 3);
    voice(lp, t, 'sine', f * 2, 0.032 * v, dur * 0.45, 0.002, 0.25);
  },
  marimba(t, m, v = 1) {
    const f = hz(m);
    voice(musicG, t, 'sine', f, 0.17 * v, 0.48, 0.002, 0.3);
    voice(musicG, t, 'triangle', f * 4, 0.038 * v, 0.08, 0.001, 0.2);
  },
  pizz(t, m, v = 1) { // charakterystyczne dla Simsów pizzicato smyczkowe
    const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(520, t + 0.24); lp.connect(musicG);
    voice(lp, t, 'sawtooth', f, 0.065 * v, 0.24, 0.002, 0.28, -5);
    voice(lp, t, 'triangle', f, 0.11 * v, 0.28, 0.002, 0.28, 4);
  },
  glock(t, m, v = 1) { // jasny dzwoneczek / ksylofon w górnym rejestrze
    const f = hz(m);
    voice(musicG, t, 'sine', f, 0.095 * v, 0.75, 0.002, 0.45);
    voice(musicG, t, 'sine', f * 2.756, 0.022 * v, 0.18, 0.001, 0.3);
  },
  pluck(t, m, v = 1) {
    const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3800, t); lp.frequency.exponentialRampToValueAtTime(600, t + 0.28); lp.connect(musicG);
    voice(lp, t, 'triangle', f, 0.12 * v, 0.4, 0.003, 0.28);
    voice(lp, t, 'square', f, 0.014 * v, 0.16, 0.002, 0.18);
  },
  pad(t, notes, v = 1, dur = 2.4) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1350; lp.connect(musicG);
    notes.forEach((m, i) => voice(lp, t, 'sine', hz(m), 0.024 * v, dur, 0.22, 0.5, i % 2 ? 5 : -5));
  },
  bass(t, m, v = 1, dur = 0.42) { // sprężysty kontrabas (upright bass)
    const f = hz(m), lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(260, t + dur); lp.connect(musicG);
    voice(lp, t, 'triangle', f, 0.18 * v, dur, 0.006, 0.06);
    voice(lp, t, 'sine', f, 0.14 * v, dur * 1.1, 0.006, 0.04);
  },
  kick(t, v = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(125, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.09);
    env(g, t, 0.003, 0.13 * v, 0.11); o.connect(g); g.connect(musicG); o.start(t); o.stop(t + 0.14);
  },
  hat(t, v = 1) { // lekki shaker / miotełka
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 6800; hp.Q.value = 1.2;
    const g = ctx.createGain(); env(g, t, 0.003, 0.022 * v, 0.055);
    s.connect(hp); hp.connect(g); g.connect(musicG); s.start(t, Math.random()); s.stop(t + 0.08);
  },
};

// ---------- muzyka w stylu The Sims (pogodny fortepian, pizzicato, marimba, motywy melodyczne) ----------
// prog: 4-taktowe progresje (Cmaj7/add9/Dm9/G13), motifs: chwytliwe 8-ósemkowe motywy (indeks w skali lub -1 = pauza)
const MOODS = {
  home: { // słoneczne przedmieście – The Sims Live / Neighborhood (pogodne pianino + pizzicato + dzwoneczki)
    bpm: 114, inst: 'piano', acc: 'pizz', lead: 'glock', swing: 0.035, hats: true, kick: true,
    prog: [[48, 55, 59, 62, 64], [45, 52, 55, 60, 64], [50, 53, 57, 60, 64], [43, 50, 55, 59, 62]], // Cmaj9 → Am7 → Dm9 → G6
    sc: [67, 69, 71, 72, 74, 76, 79, 81, 83, 84],
    arp: [0, 2, -1, 3, 1, -1, 4, 2],
    motifs: [
      [3, -1, 5, 6, -1, 5, 4, 3],
      [6, -1, 5, 3, 4, -1, 2, -1],
      [3, 4, 5, -1, 7, 6, 5, 4],
      [5, -1, 3, 2, 3, -1, 6, -1],
    ],
  },
  build: { // tryb Kupuj / Buduj – skoczna marimba + pizzicato jak w The Sims Build/Buy!
    bpm: 120, inst: 'marimba', acc: 'pizz', lead: 'piano', swing: 0.04, hats: true, kick: true,
    prog: [[53, 57, 60, 64, 67], [52, 55, 59, 62, 67], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62]], // Fmaj9 → Em7 → Dm9 → Cmaj9
    sc: [69, 71, 72, 74, 76, 77, 79, 81, 84, 86],
    arp: [0, 3, 1, 4, 2, 3, 1, 2],
    motifs: [
      [2, 4, -1, 6, 4, 3, 2, -1],
      [6, -1, 7, 6, 4, -1, 2, 3],
      [4, 6, 8, -1, 7, 6, 4, 2],
      [3, -1, 4, 6, -1, 4, 2, -1],
    ],
  },
  lounge: { bpm: 100, inst: 'piano', acc: 'pizz', lead: 'glock', swing: 0.055, hats: true, kick: false,
    prog: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]],
    sc: [69, 71, 72, 74, 76, 77, 79, 81],
    arp: [0, 2, -1, 3, 1, 2, -1, 3],
    motifs: [[2, -1, 4, 5, -1, 4, 2, -1], [5, -1, 4, 2, 1, -1, 2, -1]] },
  waltz: { bpm: 162, inst: 'piano', acc: 'pizz', lead: 'glock', swing: 0, hats: false, kick: false,
    prog: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 53, 57, 60], [43, 50, 55, 59]],
    sc: [67, 69, 71, 72, 74, 76, 77, 79],
    arp: [0, -1, 2, 3, -1, 2, 1, 3],
    motifs: [[3, -1, 5, 4, -1, 3, 2, -1], [5, -1, 7, 6, -1, 5, 3, -1]] },
  yacht: { bpm: 122, inst: 'pluck', acc: 'marimba', lead: 'glock', swing: 0.02, hats: true, kick: true,
    prog: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 62]],
    sc: [69, 72, 74, 76, 79, 81, 84],
    arp: [0, 2, 1, 2, 3, 2, 1, 2],
    motifs: [[0, -1, 2, 3, -1, 4, 3, 2], [4, -1, 3, 2, 0, -1, 2, -1]] },
  work: { bpm: 116, inst: 'pluck', acc: 'pizz', lead: 'marimba', swing: 0.025, hats: true, kick: true,
    prog: [[45, 52, 55, 60], [41, 52, 57, 60], [48, 52, 55, 59], [43, 50, 55, 59]],
    sc: [69, 71, 72, 74, 76, 79, 81],
    arp: [0, 1, 2, -1, 3, 1, 2, -1],
    motifs: [[0, 2, -1, 4, 3, 2, 0, -1], [4, -1, 5, 4, 2, -1, 0, -1]] },
};
let mood = 'home', want = 'home', nextT = 0, step = 0, bar = 0;
export function setMode(m) { if (MOODS[m]) want = m; }
function scheduleStep(t) {
  const M = MOODS[mood], s = step % 8, chord = M.prog[bar % M.prog.length];
  const root = chord[0] - 12, fifth = root + 7;
  // Skoczny bas w stylu Simsów (raz-i-dwa-i…) + ciepły pad na początku taktu
  if (s === 0) { INST.bass(t, root, 0.95, 0.45); INST.pad(t, chord.slice(1, 4), 0.7, 60 / M.bpm * 3.8); }
  else if (s === 3) INST.bass(t, fifth, 0.62, 0.28);
  else if (s === 4) INST.bass(t, root + 12, 0.72, 0.34);
  else if (s === 7 && bar % 2 === 1) INST.bass(t, fifth, 0.55, 0.22);

  // Lekki rytm (miotełka/shaker + miękka stopa)
  if (M.kick && (s === 0 || s === 4)) INST.kick(t, s === 0 ? 0.7 : 0.45);
  if (M.hats) INST.hat(t, s % 2 === 1 ? 0.85 : 0.35);

  // Akompaniament akordowy + pizzicato na off-beatach ("um-pa-um-pa" jak w The Sims!)
  const ai = M.arp[s];
  if (ai >= 0) {
    const n = chord[ai % chord.length] + 12;
    INST[M.inst](t, n, s === 0 ? 0.85 : 0.62, 0.95);
  }
  if (M.acc && (s === 2 || s === 6)) {
    // krótkie staccato pizzicato dwudźwiękiem
    INST[M.acc](t, chord[1] + 12, 0.62);
    INST[M.acc](t, chord[2] + 12, 0.52);
  }

  // Chwytliwy motyw melodyczny (zmienia się co 4 takty, z delikatną wariacją)
  if (M.motifs && M.motifs.length) {
    const phrase = Math.floor(bar / 4) % 2; // fraza A / B
    const motif = M.motifs[(bar + phrase) % M.motifs.length];
    const mi = motif[s];
    if (mi >= 0 && mi < M.sc.length) {
      const note = M.sc[mi] + (bar % 8 === 7 && s >= 6 ? 2 : 0);
      const leadInst = (bar % 8 < 4) ? M.inst : (M.lead || 'glock');
      INST[leadInst](t + 0.008, note, leadInst === 'glock' ? 0.58 : 0.68, 0.85);
    }
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
  rewind(t) { sweep(t, 1200, 180, 0.26, 0.11, 'sawtooth', sfxG, 0.2); sweep(t + 0.14, 980, 260, 0.22, 0.09, 'triangle', sfxG, 0.2); noise(t, 0.34, 2400, 'bandpass', 0.06, sfxG, 3); },
  swish(t) {
    noise(t, 0.26, 1900, 'bandpass', 0.075, sfxG, 2.2);
    sweep(t, 320, 1180, 0.24, 0.07, 'sine', sfxG, 0.1);
    [76, 80, 83, 88].forEach((m, i) => bell(t + 0.07 + i * 0.055, hz(m), 0.065, 0.42));
  },
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

// ---------- system głosów: Simlish (Web Audio API) + Polski Lektor (speechSynthesis) ----------
let activeVoiceG = null, lastVoiceAt = 0, lastAmbientVoiceAt = 0, voiceEndAt = 0;
export function getVoiceMode() { return cfg.voiceMode || 'simlish'; }
export function setVoiceMode(m) {
  if (!['simlish', 'pl', 'off'].includes(m)) return;
  cfg.voiceMode = m; save(); stopVoice();
}
export function stopVoice() {
  if (typeof speechSynthesis !== 'undefined') try { speechSynthesis.cancel(); } catch (e) {}
  if (activeVoiceG && ctx) {
    try { activeVoiceG.gain.cancelScheduledValues(ctx.currentTime); activeVoiceG.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.025); } catch (e) {}
    activeVoiceG = null;
  }
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
function cleanSpeechText(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ').trim();
}
function pickPolishVoice(gender) {
  if (typeof speechSynthesis === 'undefined') return null;
  const list = speechSynthesis.getVoices().filter(v => /^pl/i.test(v.lang));
  if (!list.length) return null;
  const femHint = /zosia|paulina|ewa|maja|kasia|female|anna/i;
  const maleHint = /krzysztof|marek|adam|male/i;
  return list.find(v => gender === 'f' ? femHint.test(v.name) : maleHint.test(v.name)) || list[0];
}

export function playCharacterVoice(speakerName, gender, text, emotion = 'neutral', opts = {}) {
  const mode = getVoiceMode();
  if (mode === 'off' || cfg.muted) return;
  const clean = cleanSpeechText(text);
  if (!clean) return;
  const now = performance.now();
  // Ochrona anty-spamowa (1.5 s dla dymków w tle na ulicy) i ochrona przed nakładaniem
  if (opts.ambient) {
    if (now - lastAmbientVoiceAt < 1500) return;
    if (now < voiceEndAt) return;
    lastAmbientVoiceAt = now;
  } else {
    if (now - lastVoiceAt < 120) return;
    lastVoiceAt = now;
  }
  const name = String(speakerName || '');
  const isKurator = /kurator/i.test(name);
  const isAnia = /^ania$/i.test(name);
  const isBartek = /^bartek$/i.test(name);
  const isQuestion = /\?\s*$/.test(clean);
  const isAngry = emotion === 'angry' || emotion === 'storm' || emotion === 'neg';
  const isLove = emotion === 'love' || emotion === 'romance' || emotion === 'flirt';

  // --- Tryb Polski Lektor (window.speechSynthesis) ---
  if (mode === 'pl') {
    if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean.slice(0, 260));
      u.lang = 'pl-PL';
      const v = pickPolishVoice(gender); if (v) u.voice = v;
      const h = (hashStr(name || 'sim') - 0.5) * 0.14;
      let pitch = isKurator ? 0.72 : isAnia ? 1.15 : isBartek ? 0.85 : (gender === 'f' ? 1.15 + h : 0.85 + h);
      if (isAngry) pitch -= 0.08;
      else if (isLove) pitch += 0.05;
      u.pitch = Math.max(0.5, Math.min(1.6, pitch));
      u.rate = isKurator ? 0.92 : isAngry ? 1.16 : isLove ? 0.94 : 1.04;
      u.volume = Math.max(0.15, Math.min(1, cfg.sfx * 1.1));
      voiceEndAt = now + Math.min(4500, Math.max(900, clean.length * 55));
      speechSynthesis.speak(u);
    } catch (e) {}
    return;
  }

  // --- Tryb Simlish (Web Audio API) ---
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  stopVoice();
  const t0 = ctx.currentTime + 0.015;
  const vg = ctx.createGain();
  vg.gain.setValueAtTime(1, t0);
  vg.connect(sfxG);
  activeVoiceG = vg;

  // Barwa bazowa postaci
  const h = hashStr(name || 'sim');
  let baseF = isKurator ? 98 : isAnia ? (238 + h * 24) : isBartek ? (132 + h * 18)
    : (gender === 'f' ? 215 + h * 70 : 118 + h * 54);
  if (isAngry) baseF *= 0.91;
  else if (isLove) baseF *= 1.04;

  // Długość serii sylab dopasowana do długości zdania (maks. 1.2–1.8 s)
  const sylCount = Math.max(3, Math.min(9, Math.round(clean.length / 7)));
  const stepBase = isAngry ? 0.115 : isLove ? 0.185 : isKurator ? 0.19 : 0.145;
  const maxDur = isLove ? 1.75 : isAngry ? 1.25 : 1.55;
  const step = Math.min(stepBase, maxDur / sylCount);
  const totalDur = sylCount * step;
  voiceEndAt = now + totalDur * 1000 + 80;

  // Filtr dolnoprzepustowy dla miękkiego, przyjemnego brzmienia bez piszczenia
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(isKurator ? 920 : isAngry ? 1750 : isLove ? 1250 : (gender === 'f' ? 1550 : 1100), t0);
  lp.Q.value = isKurator ? 2.2 : 0.9;
  lp.connect(vg);

  // Dla Kuratora: delikatne echo + mocny pogłos
  if (isKurator && verb) {
    const del = ctx.createDelay(0.5); del.delayTime.value = 0.14;
    const fb = ctx.createGain(); fb.gain.value = 0.34;
    const wet = ctx.createGain(); wet.gain.value = 0.55;
    lp.connect(del); del.connect(fb); fb.connect(del); del.connect(wet); wet.connect(vg);
    const rv = ctx.createGain(); rv.gain.value = 0.78; lp.connect(rv); rv.connect(verb);
  } else if (verb) {
    const rv = ctx.createGain(); rv.gain.value = isLove ? 0.36 : 0.18; lp.connect(rv); rv.connect(verb);
  }

  // Deterministyczny wzór melodii z treści wypowiedzi
  const seed0 = Math.floor(hashStr(clean) * 1000);
  const scale = isLove ? [0, 2, 4, 7, 9] : isAngry ? [0, 1, 3, 5, 7] : isKurator ? [0, 3, 5, 7, 10] : [0, 2, 4, 5, 7, 9];
  for (let i = 0; i < sylCount; i++) {
    const ts = t0 + i * step;
    const dur = step * (isLove ? 0.92 : isAngry ? 0.76 : 0.84);
    const semi = scale[(seed0 + i * 3 + (clean.charCodeAt(i % clean.length) || 0)) % scale.length];
    let f = baseF * Math.pow(2, (semi - 2) / 12);
    // Intonacja pytająca: podnieś ton ostatnich sylab w górę
    if (isQuestion && i >= sylCount - 2) f *= (i === sylCount - 1 ? 1.28 : 1.12);
    else if (!isQuestion && i === sylCount - 1) f *= 0.93;

    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o1.type = isKurator ? 'sawtooth' : 'triangle';
    o2.type = 'sine';
    o1.frequency.setValueAtTime(f * (isLove ? 0.96 : 1.0), ts);
    o2.frequency.setValueAtTime(f * (isKurator ? 0.5 : 2.0), ts);
    if (isLove) {
      o1.frequency.exponentialRampToValueAtTime(f * 1.08, ts + dur * 0.75);
      o2.frequency.exponentialRampToValueAtTime(f * 2.16, ts + dur * 0.75);
    } else if (isQuestion && i === sylCount - 1) {
      o1.frequency.exponentialRampToValueAtTime(f * 1.18, ts + dur);
    } else {
      o1.frequency.exponentialRampToValueAtTime(f * (0.94 + (i % 2) * 0.1), ts + dur);
    }

    const peak = (isKurator ? 0.11 : isAngry ? 0.16 : 0.13) * (opts.ambient ? 0.7 : 1.0);
    g.gain.setValueAtTime(0.0001, ts);
    g.gain.linearRampToValueAtTime(peak, ts + Math.min(0.025, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, ts + dur);

    const g2 = ctx.createGain(); g2.gain.value = isKurator ? 0.35 : 0.18;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp);
    o1.start(ts); o2.start(ts);
    o1.stop(ts + dur + 0.03); o2.stop(ts + dur + 0.03);
  }
}
