// Ekran „🪞 Garderoba i Wygląd” (3D Turntable CAS – Create-A-Sim)
// Osobny moduł z dedykowanym podglądem 3D na podświetlonym podeście, obrotem 360° myszą,
// zbliżeniem Cała sylwetka / Twarz i fryzura oraz 6 zakładkami edycji (w tym 4 kategoriami strojów).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as WG from './wyglad.js';
import * as REL from './relacje.js';

const PATTERNS = [['plain', 'Gładki'], ['stripes', 'Paski'], ['check', 'Kratka'], ['dots', 'Kropki'], ['floral', 'Kwiaty'], ['knit', 'Dzianina']];
const HOUSES_NEW = [['f1', 'Dom wschodni'], ['f2', 'Dom zachodni'], ['hania', 'Przy ul. Słonecznej (północ)'], ['ola', 'Przy ul. Słonecznej (południe)']];

export function createCAS({ buildCharacter, animateCharacter, getClips, onSaveExisting, onCreateNew, playSound }) {
  // ---- Overlay DOM ----
  const rootEl = document.createElement('div');
  rootEl.id = 'casOverlay';
  rootEl.style.cssText = 'position:fixed;inset:0;z-index:55;display:none;background:radial-gradient(circle at 32% 45%,#2c2148,#13162b 72%);color:#fff;font-family:inherit';
  rootEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 460px;height:100%;width:100%">
      <div id="casStage" style="position:relative;overflow:hidden;cursor:grab;user-select:none">
        <canvas id="casCanvas" style="width:100%;height:100%;display:block"></canvas>
        <div style="position:absolute;top:16px;left:18px;display:flex;align-items:center;gap:10px">
          <div style="background:rgba(15,16,32,0.75);border:1px solid rgba(255,255,255,0.2);border-radius:14px;padding:8px 14px;backdrop-filter:blur(8px)">
            <div id="casTitle" style="font-size:17px;font-weight:800;color:#ffe6b8">🪞 Garderoba i Wygląd</div>
            <div style="font-size:11.5px;color:#c9d2eb">Przeciągnij myszą, aby obrócić postać o 360°</div>
          </div>
        </div>
        <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;background:rgba(15,16,32,0.8);padding:7px 10px;border-radius:14px;border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(8px)">
          <button id="casZoomFull" style="background:#7b4bd6;color:#fff;font-weight:700;padding:7px 12px;border-radius:10px">🧍 Cała sylwetka</button>
          <button id="casZoomFace" style="background:rgba(255,255,255,0.14);color:#fff;font-weight:700;padding:7px 12px;border-radius:10px">😊 Twarz i fryzura</button>
          <button id="casRandomBtn" style="background:linear-gradient(90deg,#f7b733,#fc4a1a);color:#fff;font-weight:800;padding:7px 12px;border-radius:10px">🎲 Losuj stylizację</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;background:rgba(18,20,38,0.94);border-left:1.5px solid rgba(255,255,255,0.14);height:100%;overflow:hidden">
        <div id="casTabs" style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:12px 12px 8px;border-bottom:1px solid rgba(255,255,255,0.1)"></div>
        <div id="casBody" style="flex:1;overflow:auto;padding:12px 14px;font-size:13px"></div>
        <div style="display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,0.12);background:rgba(10,12,24,0.8)">
          <button id="casSaveBtn" style="flex:1;background:#39c07f;color:#fff;font-weight:800;padding:11px;font-size:14px;border-radius:12px">✅ Zapisz i wyjdź</button>
          <button id="casCancelBtn" style="background:rgba(255,255,255,0.15);color:#fff;font-weight:700;padding:11px 16px;font-size:13.5px;border-radius:12px">✕ Anuluj</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(rootEl);

  const stageEl = rootEl.querySelector('#casStage');
  const canvas = rootEl.querySelector('#casCanvas');
  const tabsEl = rootEl.querySelector('#casTabs');
  const bodyEl = rootEl.querySelector('#casBody');
  const titleEl = rootEl.querySelector('#casTitle');

  // ---- Dedykowana scena 3D Turntable ----
  let casRenderer = null, casScene = null, casCam = null, charHolder = null, currentCh = null;
  let openState = false, rafId = 0, lastT = 0;
  let yaw = 0.25, dragging = false, dragX = 0;
  let zoomMode = 'full'; // 'full' | 'face'
  let camCurPos = new THREE.Vector3(0, 1.35, 3.15);
  let camCurTgt = new THREE.Vector3(0, 0.95, 0);

  function ensureRenderer() {
    if (casRenderer) return;
    casRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    casRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    casRenderer.shadowMap.enabled = true;
    casRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    casRenderer.toneMappingExposure = 1.08;

    casScene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(casRenderer);
    casScene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    casCam = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    casCam.position.copy(camCurPos);
    casCam.lookAt(camCurTgt);

    // Światła studyjne
    casScene.add(new THREE.HemisphereLight('#dfe8ff', '#3a2b52', 0.95));
    const key = new THREE.DirectionalLight('#fff5e6', 2.0);
    key.position.set(2.8, 4.2, 3.5); key.castShadow = true;
    casScene.add(key);
    const rim = new THREE.DirectionalLight('#9ec5ff', 1.15);
    rim.position.set(-3.2, 2.8, -2.5);
    casScene.add(rim);

    // Podświetlony okrągły podest
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 1.08, 0.14, 40),
      new THREE.MeshStandardMaterial({ color: '#2b2448', roughness: 0.3, metalness: 0.45 })
    );
    base.position.y = -0.07; base.receiveShadow = true;
    casScene.add(base);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.96, 0.024, 12, 48),
      new THREE.MeshBasicMaterial({ color: '#7ee8ff' })
    );
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.005;
    casScene.add(ring);

    charHolder = new THREE.Group();
    casScene.add(charHolder);
  }

  function resizeCas() {
    if (!casRenderer || !openState) return;
    const w = Math.max(200, stageEl.clientWidth), h = Math.max(200, stageEl.clientHeight);
    casRenderer.setSize(w, h, false);
    casCam.aspect = w / h;
    casCam.updateProjectionMatrix();
  }
  addEventListener('resize', resizeCas);

  // Obrót 360° przeciągnięciem myszy
  stageEl.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    dragging = true; dragX = e.clientX; stageEl.style.cursor = 'grabbing';
  });
  addEventListener('pointermove', e => {
    if (!dragging || !openState) return;
    yaw += (e.clientX - dragX) * 0.012;
    dragX = e.clientX;
  });
  addEventListener('pointerup', () => { dragging = false; stageEl.style.cursor = 'grab'; });

  // ---- Stan edycji ----
  let editLook = null;
  let editMeta = { mode: 'edit', targetKey: 'self', role: 'neighbour', slot: 'f1' };
  let activeTab = 'id'; // 'id' | 'face' | 'everyday' | 'formal' | 'sleepwear' | 'athletic'
  let buildToken = 0;

  async function rebuildPreview() {
    if (!openState || !editLook) return;
    ensureRenderer();
    const tok = ++buildToken;
    const cat = ['everyday', 'formal', 'sleepwear', 'athletic'].includes(activeTab) ? activeTab : (editLook.activeOutfit || 'everyday');
    const resolved = WG.resolveOutfitLook(editLook, cat);
    try {
      const ch = await buildCharacter(resolved);
      if (tok !== buildToken || !openState) return;
      charHolder.clear();
      charHolder.add(ch.root);
      currentCh = ch;
    } catch (e) { console.warn('CAS preview err', e); }
  }

  function casLoop(now) {
    if (!openState) return;
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (charHolder) charHolder.rotation.y = yaw;
    const wantPos = zoomMode === 'face' ? new THREE.Vector3(0, 1.56, 1.38) : new THREE.Vector3(0, 1.3, 3.15);
    const wantTgt = zoomMode === 'face' ? new THREE.Vector3(0, 1.48, 0) : new THREE.Vector3(0, 0.92, 0);
    camCurPos.lerp(wantPos, Math.min(1, dt * 7));
    camCurTgt.lerp(wantTgt, Math.min(1, dt * 7));
    casCam.position.copy(camCurPos);
    casCam.lookAt(camCurTgt);
    if (currentCh && animateCharacter) {
      animateCharacter(currentCh, { pose: 'stand' }, dt, now / 1000, getClips ? getClips() : null);
    }
    casRenderer.render(casScene, casCam);
    rafId = requestAnimationFrame(casLoop);
  }

  // ---- Renderowanie zakładek i kontrolek ----
  const TABS = [
    ['id', '🪪 Tożsamość'],
    ['face', '💇 Twarz i Włosy'],
    ['everyday', '☀️ Codzienny'],
    ['formal', '✨ Wizytowy'],
    ['sleepwear', '🌙 Piżama'],
    ['athletic', '🏃‍♀️ Sportowy'],
  ];

  const swatchRow = (colors, cur, attr) =>
    `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 10px">${colors.map(c =>
      `<button data-${attr}="${c ?? ''}" style="width:26px;height:26px;border-radius:50%;padding:0;background:${c || 'linear-gradient(135deg,#fff 45%,#e55 50%,#fff 55%)'};border:2.5px solid ${cur === c ? '#7ee8ff' : '#ffffff88'};box-shadow:${cur === c ? '0 0 0 2px #7b4bd6' : 'none'}"></button>`
    ).join('')}</div>`;

  const segRow = (items, cur, attr) =>
    `<div style="display:flex;flex-wrap:wrap;gap:5px;margin:5px 0 10px">${items.map(([k, lbl]) =>
      `<button data-${attr}="${k}" style="font-size:12px;padding:5px 9px;border-radius:9px;background:${cur === k ? '#7b4bd6' : 'rgba(255,255,255,0.12)'};color:#fff;font-weight:${cur === k ? '700' : '500'}">${lbl}</button>`
    ).join('')}</div>`;

  function renderUI() {
    const L = editLook;
    WG.ensureOutfits(L);
    tabsEl.innerHTML = TABS.map(([k, lbl]) =>
      `<button data-ctab="${k}" style="font-size:11.5px;padding:7px 4px;border-radius:10px;background:${activeTab === k ? '#7b4bd6' : 'rgba(255,255,255,0.1)'};color:#fff;font-weight:700">${lbl}</button>`
    ).join('');
    tabsEl.querySelectorAll('[data-ctab]').forEach(b => b.onclick = () => {
      activeTab = b.dataset.ctab;
      if (activeTab === 'face') setZoom('face');
      else setZoom('full');
      renderUI(); rebuildPreview();
    });

    let h = '';
    if (activeTab === 'id') {
      h += `<div style="font-weight:700;color:#ffe6b8;margin-bottom:4px">Imię postaci</div>
        <input id="casNameIn" value="${(L.name || '').replace(/"/g, '&quot;')}" maxlength="20" style="width:100%;padding:8px 10px;border-radius:10px;border:1px solid #ffffff33;background:#ffffff18;color:#fff;font-size:14px;margin-bottom:10px">
        <div style="font-weight:700;color:#ffe6b8">Płeć</div>
        ${segRow([['f', '👩 Kobieta'], ['m', '👨 Mężczyzna']], L.body || 'f', 'cbody')}
        <div style="font-weight:700;color:#ffe6b8">Sylwetka (typ budowy ciała)</div>
        ${segRow(WG.BODY_BUILDS, L.build || 'athletic', 'cbuild')}
        <div style="font-weight:700;color:#ffe6b8">Cechy charakteru (wybierz do 3)</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin:5px 0 10px">${Object.entries(REL.TRAITS).map(([k, t]) => {
          const on = (L.traits || []).includes(k);
          return `<button data-ctrait="${k}" style="font-size:11.5px;padding:5px 8px;border-radius:9px;background:${on ? '#39c07f' : 'rgba(255,255,255,0.12)'};color:#fff">${t.icon} ${REL.traitName(k, L.body !== 'm')}</button>`;
        }).join('')}</div>`;
      if (editMeta.mode === 'new') {
        h += `<div style="font-weight:700;color:#ffe6b8;margin-top:8px">Rola w świecie gry</div>
          ${segRow([['member', '🏡 Domownik (mieszka z Anią)'], ['neighbour', '🏘️ Nowy sąsiad na ulicy']], editMeta.role, 'crole')}`;
        if (editMeta.role === 'neighbour') {
          h += `<div style="font-weight:700;color:#ffe6b8">Do którego domu się wprowadza?</div>
            ${segRow(HOUSES_NEW, editMeta.slot, 'cslot')}`;
        }
      }
    } else if (activeTab === 'face') {
      h += `<div style="font-weight:700;color:#ffe6b8">Odcień karnacji</div>${swatchRow(WG.SKIN_TONES, L.skin, 'cskin')}
        <div style="font-weight:700;color:#ffe6b8">Fryzura 3D (${WG.HAIRSTYLES_ALL.length} modeli)</div>${segRow(WG.HAIRSTYLES_ALL, L.hairStyle || 'long', 'chairst')}
        <div style="font-weight:700;color:#ffe6b8">Kolor włosów</div>${swatchRow(WG.HAIR_SWATCHES, L.hair, 'chaircol')}
        <div style="font-weight:700;color:#ffe6b8">Kolor brwi</div>${swatchRow(WG.HAIR_SWATCHES.slice(0, 12), L.browColor || L.hair, 'cbrow')}
        <div style="font-weight:700;color:#ffe6b8">Kolor oczu</div>${swatchRow(WG.EYE_COLORS, L.eyes, 'ceyes')}
        <div style="font-weight:700;color:#ffe6b8">${L.body === 'm' ? 'Zarost' : 'Makijaż ust (szminka)'}</div>
        ${L.body === 'm' ? segRow(WG.BEARDS, L.beard || 'none', 'cbeard') : swatchRow(WG.LIP_COLORS, L.lips || null, 'clips')}
        <div style="font-weight:700;color:#ffe6b8">Okulary 3D</div>${segRow(WG.GLASSES, (L.acc && L.acc.glasses) || 'none', 'cglass')}`;
    } else {
      const cat = activeTab, O = L.outfits[cat];
      const catMeta = WG.OUTFIT_CATS.find(x => x[0] === cat) || ['', '', cat];
      h += `<div style="background:rgba(123,75,214,0.22);border:1px solid #9d75f0;border-radius:10px;padding:7px 10px;margin-bottom:10px;font-size:12px">Edytujesz kategorię: <b>${catMeta[1]} ${catMeta[2]}</b></div>
        <div style="font-weight:700;color:#ffe6b8">Góra (warstwa 3D)</div>${segRow(WG.TOP_STYLES, O.topStyle, 'ctopst')}
        <div style="font-weight:700;color:#ffe6b8">Kolor góry</div>${swatchRow(WG.CLOTH_SWATCHES, O.top, 'ctopcol')}
        <div style="font-weight:700;color:#ffe6b8">Dół / Całość (warstwa 3D)</div>${segRow(WG.BOTTOM_STYLES, O.bottomStyle, 'cbotst')}
        <div style="font-weight:700;color:#ffe6b8">Kolor dołu</div>${swatchRow(WG.CLOTH_SWATCHES, O.bottom, 'cbotcol')}
        <div style="font-weight:700;color:#ffe6b8">Buty</div>${segRow(WG.SHOE_STYLES, O.shoeStyle, 'cshoest')}
        <div style="font-weight:700;color:#ffe6b8">Kolor butów</div>${swatchRow(['#f4f4f4', '#1f1f24', '#6b4428', '#8a2e3b', '#c9a27a', '#2f4f7f'], O.shoes, 'cshoecol')}
        <div style="font-weight:700;color:#ffe6b8">Wzór tkaniny</div>${segRow(PATTERNS, O.pattern || 'plain', 'cpat')}`;
    }
    bodyEl.innerHTML = h;

    // Bindy kontrolek
    const ni = bodyEl.querySelector('#casNameIn');
    if (ni) ni.oninput = () => { L.name = ni.value; };
    const bind = (attr, fn) => bodyEl.querySelectorAll(`[data-${attr}]`).forEach(b => b.onclick = () => { fn(b.dataset[attr]); renderUI(); rebuildPreview(); });
    bind('cbody', v => { L.body = v; L.beard = v === 'm' ? (L.beard || 'none') : 'none'; });
    bind('cbuild', v => { L.build = v; });
    bind('ctrait', v => { L.traits = L.traits || []; const i = L.traits.indexOf(v); if (i >= 0) L.traits.splice(i, 1); else if (L.traits.length < 3) L.traits.push(v); });
    bind('crole', v => { editMeta.role = v; });
    bind('cslot', v => { editMeta.slot = v; });
    bind('cskin', v => { L.skin = v; });
    bind('chairst', v => { L.hairStyle = v; });
    bind('chaircol', v => { L.hair = v; });
    bind('cbrow', v => { L.browColor = v; });
    bind('ceyes', v => { L.eyes = v; });
    bind('cbeard', v => { L.beard = v; });
    bind('clips', v => { L.lips = v || null; });
    bind('cglass', v => { L.acc = L.acc || {}; L.acc.glasses = v; });
    if (['everyday', 'formal', 'sleepwear', 'athletic'].includes(activeTab)) {
      const O = L.outfits[activeTab];
      bind('ctopst', v => { O.topStyle = v; });
      bind('ctopcol', v => { O.top = v; });
      bind('cbotst', v => { O.bottomStyle = v; O.bottomPattern = v === 'jeans' ? 'denim' : 'plain'; });
      bind('cbotcol', v => { O.bottom = v; });
      bind('cshoest', v => { O.shoeStyle = v; });
      bind('cshoecol', v => { O.shoes = v; });
      bind('cpat', v => { O.pattern = v; });
    }
  }

  function setZoom(m) {
    zoomMode = m;
    rootEl.querySelector('#casZoomFull').style.background = m === 'full' ? '#7b4bd6' : 'rgba(255,255,255,0.14)';
    rootEl.querySelector('#casZoomFace').style.background = m === 'face' ? '#7b4bd6' : 'rgba(255,255,255,0.14)';
  }
  rootEl.querySelector('#casZoomFull').onclick = () => setZoom('full');
  rootEl.querySelector('#casZoomFace').onclick = () => setZoom('face');
  rootEl.querySelector('#casRandomBtn').onclick = () => {
    if (!editLook) return;
    const fem = editLook.body !== 'm';
    if (['everyday', 'formal', 'sleepwear', 'athletic'].includes(activeTab)) {
      editLook.outfits[activeTab] = WG.randomOutfitForCat(activeTab, fem);
    } else {
      const r = WG.generateLook((Math.random() * 1e9) >>> 0, { body: editLook.body });
      editLook.skin = r.skin; editLook.hair = r.hair; editLook.browColor = r.hair; editLook.eyes = r.eyes;
      editLook.hairStyle = WG.HAIRSTYLES_ALL[Math.floor(Math.random() * WG.HAIRSTYLES_ALL.length)][0];
      editLook.build = WG.BODY_BUILDS[Math.floor(Math.random() * WG.BODY_BUILDS.length)][0];
      editLook.outfits = WG.defaultOutfitsFor(r);
    }
    if (playSound) playSound('swish');
    renderUI(); rebuildPreview();
  };
  rootEl.querySelector('#casCancelBtn').onclick = () => close();
  rootEl.querySelector('#casSaveBtn').onclick = () => {
    if (!editLook) return;
    if (!editLook.name || !editLook.name.trim()) editLook.name = editLook.body === 'm' ? 'Kamil' : 'Maja';
    if (!editLook.traits || !editLook.traits.length) editLook.traits = REL.randomTraits();
    const cat = ['everyday', 'formal', 'sleepwear', 'athletic'].includes(activeTab) ? activeTab : (editLook.activeOutfit || 'everyday');
    editLook.activeOutfit = cat;
    const saved = JSON.parse(JSON.stringify(editLook));
    const meta = { ...editMeta };
    close();
    if (playSound) playSound('swish');
    if (meta.mode === 'new' && onCreateNew) onCreateNew(saved, meta);
    else if (onSaveExisting) onSaveExisting(saved, meta);
  };

  function open(lookObj, meta = { mode: 'edit', targetKey: 'self' }) {
    editLook = JSON.parse(JSON.stringify(lookObj));
    WG.ensureOutfits(editLook);
    editMeta = { mode: 'edit', targetKey: 'self', role: 'neighbour', slot: 'f1', ...meta };
    activeTab = meta.startTab || (meta.mode === 'new' ? 'id' : 'everyday');
    titleEl.textContent = meta.mode === 'new' ? '➕ Stwórz nową postać (CAS 3D)' : `🪞 Garderoba: ${editLook.name || 'Postać'}`;
    yaw = 0.25;
    setZoom(activeTab === 'face' ? 'face' : 'full');
    openState = true;
    rootEl.style.display = 'block';
    ensureRenderer();
    resizeCas();
    renderUI();
    rebuildPreview();
    lastT = performance.now();
    rafId = requestAnimationFrame(casLoop);
  }

  function close() {
    openState = false;
    rootEl.style.display = 'none';
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  return { open, close, isOpen: () => openState };
}
