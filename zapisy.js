// System trwałego zapisu stanu gry (localStorage), 4 sloty zapisu, bezpieczna Nowa Gra
// oraz eksport/import kopii zapasowej do pliku .json.

export const AUTOSAVE_KEY = 'domkowo3d_autosave';
export const LEGACY_KEY = 'domkowo3d';
export const SLOT_KEYS = ['domkowo3d_slot_1', 'domkowo3d_slot_2', 'domkowo3d_slot_3', 'domkowo3d_slot_4'];

// Bezpieczna kopia czystych danych JSON (pomija obiekty Three.js, funkcje i cykle)
export function cleanJson(val, seen = new WeakSet()) {
  if (val === null || val === undefined) return val;
  const t = typeof val;
  if (t === 'number') return Number.isFinite(val) ? val : 0;
  if (t === 'string' || t === 'boolean') return val;
  if (t !== 'object') return undefined;
  if (val.isObject3D || val.isMaterial || val.isBufferGeometry || val.isTexture || val.isVector3 || val.isQuaternion || val.isMatrix4) return undefined;
  if (seen.has(val)) return undefined;
  seen.add(val);
  if (Array.isArray(val)) {
    const arr = [];
    for (const item of val) {
      const c = cleanJson(item, seen);
      if (c !== undefined) arr.push(c);
    }
    return arr;
  }
  const out = {};
  for (const [k, v] of Object.entries(val)) {
    if (k.startsWith('_three') || k === 'mesh' || k === 'root' || k === 'ch' || k === 'scene') continue;
    const c = cleanJson(v, seen);
    if (c !== undefined) out[k] = c;
  }
  return out;
}

export function serializeGameState(S, { saveName = 'Autozapis', day = 1, hour = 8, clock = '08:00', ensureOutfits } = {}) {
  if (!S) return null;
  if (ensureOutfits && S.look) ensureOutfits(S.look);
  const members = (S.members || []).map(m => {
    if (ensureOutfits && m.look) ensureOutfits(m.look);
    return {
      key: m.key,
      npcId: m.npcId || m.key,
      look: cleanJson(m.look),
      sim: {
        x: m.sim ? m.sim.x : 0,
        z: m.sim ? m.sim.z : 0,
        face: m.sim ? (m.sim.face || 0) : 0,
        atWork: false,
      },
      needs: cleanJson(m.needs),
      skills: cleanJson(m.skills),
      job: cleanJson(m.job),
      buff: cleanJson(m.buff),
    };
  });

  const objs = (S.objs || []).map(o => ({
    id: o.id,
    type: o.type,
    style: o.style || S.interiorStyle || 'Minimalizm',
    x: o.x,
    y: o.y || 0,
    z: o.z,
    rot: o.rot || 0,
    rotationY: o.rot === 2 ? Math.PI : (o.rotationY || 0),
  }));

  const world = S.world === 'friends' ? 'friends' : S.world === 'villa' ? 'villa' : 'suburbs';
  const friendsBranch = (S.friendsStory && S.friendsStory.branch) || null;

  return {
    version: 2,
    meta: {
      saveName,
      savedAt: new Date().toISOString(),
      day,
      hour: Math.floor(hour),
      clock,
      world,
      friendsBranch,
      simName: (S.look && S.look.name) || 'Ania',
    },
    economyAndHouse: {
      money: Math.round(S.money || 0),
      unlimited: !!S.unlimited,
      home: S.home || 'start',
      villaOwned: !!S.villaOwned,
      interiorStyle: S.interiorStyle || 'Minimalizm',
      interiorV: S.interiorV || 2,
      nextId: S.nextId || 200,
      build: cleanJson(S.build),
      objs,
    },
    characters: {
      activeKey: S.activeKey || 'self',
      bartekAdded: !!S.bartekAdded,
      aniaRenamed: !!S.aniaRenamed,
      activeSim: {
        x: S.sim ? S.sim.x : 5,
        z: S.sim ? S.sim.z : 5,
        face: S.sim ? (S.sim.face || 0) : 0,
        look: cleanJson(S.look),
        needs: cleanJson(S.needs),
        skills: cleanJson(S.skills),
        job: cleanJson(S.job),
        buff: cleanJson(S.buff),
      },
      members,
      people: cleanJson(S.people || []),
      relationships: cleanJson(S.rel || {}),
      npcMood: cleanJson(S.npcMood || {}),
      mem: cleanJson(S.mem || {}),
      avoid: cleanJson(S.avoid || {}),
    },
    storyProgress: {
      t: S.t || 480,
      story: cleanJson(S.story),
      reality: cleanJson(S.reality),
      friendsStory: cleanJson(S.friendsStory),
      gossip: cleanJson(S.gossip),
      street: cleanJson(S.street),
      worldSeed: S.worldSeed || 0,
      passers: cleanJson(S.passers || []),
      needsMode: S.needsMode || 'normal',
      weather: cleanJson(S.weather),
      power: S.power !== false,
      items: cleanJson(S.items || []),
      yard: cleanJson(S.yard),
      feud: cleanJson(S.feud),
      nn: cleanJson(S.nn),
      bartekSpy: cleanJson(S.bartekSpy),
    },
  };
}

export function saveAuto(data) {
  if (!data) return false;
  try {
    const raw = JSON.stringify(data);
    localStorage.setItem(AUTOSAVE_KEY, raw);
    return true;
  } catch (e) {
    console.warn('Autozapis nie powiódł się:', e);
    return false;
  }
}

export function loadAuto() {
  for (const key of [AUTOSAVE_KEY, LEGACY_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.version === 2 || parsed.sim)) return parsed;
    } catch (e) {}
  }
  return null;
}

export function clearSessionAuto() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch (e) {}
}

export function saveSlot(idx, data) {
  const key = SLOT_KEYS[idx];
  if (!key || !data) return false;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Zapis slotu nie powiódł się:', e);
    return false;
  }
}

export function loadSlot(idx) {
  const key = SLOT_KEYS[idx];
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function deleteSlot(idx) {
  const key = SLOT_KEYS[idx];
  if (key) try { localStorage.removeItem(key); } catch (e) {}
}

export function listSlots() {
  return SLOT_KEYS.map((_, i) => {
    const d = loadSlot(i);
    if (!d) return { index: i, empty: true };
    const m = d.meta || {}, ec = d.economyAndHouse || {};
    return {
      index: i,
      empty: false,
      saveName: m.saveName || `Zapis ${i + 1}`,
      savedAt: m.savedAt || '',
      day: m.day || 1,
      clock: m.clock || '08:00',
      world: m.world === 'friends' ? 'friends' : m.world === 'villa' ? 'villa' : 'suburbs',
      money: ec.money ?? (d.money || 0),
      simName: m.simName || 'Ania',
    };
  });
}

export function exportToJsonFile(data, filename = 'domkowo_zapis.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 250);
}

export function importFromJsonFile(onLoaded, onError) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.onchange = () => {
    const file = inp.files && inp.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || ''));
        if (!data || (data.version !== 2 && !data.sim)) throw new Error('Nieprawidłowy format pliku zapisu.');
        onLoaded(data);
      } catch (e) {
        if (onError) onError(e);
      }
    };
    reader.onerror = () => { if (onError) onError(new Error('Błąd odczytu pliku.')); };
    reader.readAsText(file);
  };
  inp.click();
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso; }
}

export function createSaveManagerUI({ getSerialized, onHydrate, onNewGame, toast }) {
  const overlay = document.createElement('div');
  overlay.id = 'saveMgrOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:58;display:none;align-items:center;justify-content:center;background:rgba(10,14,28,0.72);backdrop-filter:blur(6px)';
  document.body.appendChild(overlay);

  let confirmNewMode = false;

  function render() {
    const slots = listSlots();
    const worldLabel = w => w === 'friends' ? '🗽 Kamienica „Przyjaciele”' : w === 'villa' ? '🏛️ Rezydencja na Wzgórzu' : '🏡 Słoneczna Uliczka';
    const boxStyle = 'width:min(680px,94vw);max-height:90vh;overflow:auto;background:#fff;color:#1f2d3d;border-radius:20px;padding:18px 20px;box-shadow:0 24px 70px rgba(0,0,0,0.45)';

    if (confirmNewMode) {
      overlay.innerHTML = `<div style="${boxStyle}">
        <div style="font-size:40px;text-align:center">✨</div>
        <h2 style="margin:6px 0;text-align:center">Rozpocząć Nową Grę?</h2>
        <p style="font-size:13.5px;color:#4a5568;text-align:center;line-height:1.5">
          Czy zapisałaś/eś swój obecny świat na jednym z 4 slotów?<br>
          <b>Twoje 4 ręczne sloty zapisu pozostaną w 100% nietknięte</b> — zresetowana zostanie wyłącznie bieżąca sesja i autozapis (<code>domkowo3d_autosave</code>).
        </p>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button id="smConfirmNewYes" style="flex:1;background:#e0563b;color:#fff;font-weight:800;padding:11px;border-radius:12px">✨ Tak, zacznij Nową Grę</button>
          <button id="smConfirmNewBack" style="flex:1;background:#eef2f7;color:#1f2d3d;font-weight:700;padding:11px;border-radius:12px">← Wróć do slotów (zapisz najpierw)</button>
        </div>
      </div>`;
      overlay.querySelector('#smConfirmNewBack').onclick = () => { confirmNewMode = false; render(); };
      overlay.querySelector('#smConfirmNewYes').onclick = () => {
        confirmNewMode = false;
        close();
        clearSessionAuto();
        onNewGame();
      };
      return;
    }

    const slotHtml = slots.map(sl => {
      const idx = sl.index;
      if (sl.empty) {
        return `<div style="border:1.5px dashed #cbd5e1;border-radius:14px;padding:10px 12px;background:#f8fafc">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <div><b>Slot ${idx + 1}</b> · <span style="color:#8a97a8">Pusty slot zapisu</span></div>
            <div style="display:flex;gap:6px;align-items:center">
              <input data-sname="${idx}" placeholder="Nazwa zapisu…" value="Mój świat ${idx + 1}" maxlength="28" style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;width:145px">
              <button data-ssave="${idx}" style="background:#39c07f;color:#fff;font-weight:700;padding:6px 10px;font-size:12px;border-radius:8px">💾 Zapisz tutaj</button>
            </div>
          </div>
        </div>`;
      }
      return `<div style="border:1.5px solid #cbd5e1;border-radius:14px;padding:10px 12px;background:#fff">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div>
            <b>Slot ${idx + 1}: ${sl.saveName}</b>
            <div style="font-size:12px;color:#4a5568;margin-top:2px">${worldLabel(sl.world)} · Dzień <b>${sl.day}</b> (${sl.clock}) · 💰 <b>${Number(sl.money).toLocaleString('pl-PL')} zł</b></div>
            <div style="font-size:11px;color:#8a97a8">Zapisano: ${fmtDate(sl.savedAt)}</div>
          </div>
          <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
            <input data-sname="${idx}" value="${sl.saveName.replace(/"/g, '&quot;')}" maxlength="28" style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;width:125px">
            <button data-ssave="${idx}" style="background:#39c07f;color:#fff;font-weight:700;padding:6px 9px;font-size:12px;border-radius:8px">💾 Zapisz tutaj</button>
            <button data-sload="${idx}" style="background:#2f6fe4;color:#fff;font-weight:700;padding:6px 9px;font-size:12px;border-radius:8px">📂 Wczytaj</button>
            <button data-sdel="${idx}" style="background:#ffe5e5;color:#c33;font-weight:700;padding:6px 9px;font-size:12px;border-radius:8px">🗑️ Usuń</button>
          </div>
        </div>
      </div>`;
    }).join('');

    overlay.innerHTML = `<div style="${boxStyle}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="margin:0;font-size:19px">💾 Zapisy i Nowa Gra</h2>
        <button id="smClose" style="padding:4px 10px;border-radius:8px">✕</button>
      </div>
      <div style="font-size:12px;color:#567;margin-bottom:10px">Autozapis działa automatycznie co 30 s oraz po ważnych akcjach (klucz <code>domkowo3d_autosave</code>). Poniżej masz 4 niezależne sloty zapisu:</div>
      <div style="display:grid;gap:8px;margin-bottom:14px">${slotHtml}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <button id="smExport" style="background:#5d3a9b;color:#fff;font-weight:700;padding:9px;border-radius:11px;font-size:12.5px">⬇️ Eksportuj zapis do pliku (.json)</button>
        <button id="smImport" style="background:#2b8a4b;color:#fff;font-weight:700;padding:9px;border-radius:11px;font-size:12.5px">⬆️ Wczytaj zapis z pliku (.json)</button>
      </div>
      <button id="smNewGame" style="width:100%;background:linear-gradient(90deg,#f7b733,#e0563b);color:#fff;font-weight:800;padding:10px;border-radius:12px;font-size:13.5px">✨ Rozpocznij Nową Grę (bez utraty zapisów)</button>
    </div>`;

    overlay.querySelector('#smClose').onclick = close;
    overlay.querySelectorAll('[data-ssave]').forEach(b => b.onclick = () => {
      const idx = +b.dataset.ssave;
      const inp = overlay.querySelector(`[data-sname="${idx}"]`);
      const name = (inp && inp.value.trim()) || `Zapis ${idx + 1}`;
      const data = getSerialized(name);
      if (saveSlot(idx, data)) {
        if (toast) toast(`💾 Zapisano świat w <b>Slot ${idx + 1} (${name})</b>!`, '💾', 'good');
        render();
      }
    });
    overlay.querySelectorAll('[data-sload]').forEach(b => b.onclick = () => {
      const idx = +b.dataset.sload;
      const data = loadSlot(idx);
      if (!data) return;
      close();
      onHydrate(data, `Slot ${idx + 1}`);
    });
    overlay.querySelectorAll('[data-sdel]').forEach(b => b.onclick = () => {
      const idx = +b.dataset.sdel;
      deleteSlot(idx);
      if (toast) toast(`🗑️ Usunięto zapis ze <b>Slotu ${idx + 1}</b>.`, '🗑️');
      render();
    });
    overlay.querySelector('#smExport').onclick = () => {
      const data = getSerialized('Eksport');
      if (data) {
        exportToJsonFile(data, 'domkowo_zapis.json');
        if (toast) toast('⬇️ Pobrano kopię zapasową: <b>domkowo_zapis.json</b>', '💾', 'good');
      }
    };
    overlay.querySelector('#smImport').onclick = () => {
      importFromJsonFile(
        data => {
          close();
          onHydrate(data, 'pliku .json');
        },
        err => {
          if (toast) toast(`❌ Nie udało się wczytać pliku: ${err.message}`, '⚠️', 'bad');
        }
      );
    };
    overlay.querySelector('#smNewGame').onclick = () => { confirmNewMode = true; render(); };
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  function open() { confirmNewMode = false; overlay.style.display = 'flex'; render(); }
  function close() { overlay.style.display = 'none'; }

  return { open, close };
}
