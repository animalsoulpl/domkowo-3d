// Świat 2: Nowy Jork – Kamienica „Przyjaciele”
// Dokładny układ przekrojowy (Z = +8 całkowicie otwarte od frontu):
// - Korytarz: X = -1.5..+1.5, Z = -8..+8 (drewniana podłoga, ceglane ściany, schody przy Z = -8, kinkiety)
// - Mieszkanie Moniki (#20): X = -13.5..-1.5, Z = -8..+8
// - Mieszkanie Joeya (#19): X = +1.5..+12.5, Z = -8..+8
import * as THREE from 'three';
import * as WG from './wyglad.js';
import * as A3D from './assets3d.js';

export const FRIENDS_NPCS = [
  {
    id: 'fr_monika', name: 'Monika', e: '🧹', homeX: -4.2, homeZ: 3.4, face: -1.2, gender: 'f',
    role: 'Szefowa kuchni · Mieszkanie #20',
    traits: ['ambitny', 'rodzinny'],
    desc: 'Energiczna, pedantyczna szefowa kuchni z wielkim sercem. Właścicielka fioletowego apartamentu #20!',
    look: { ...WG.generateLook(101, { body: 'f' }), hairStyle: 'long', hair: '#1d1410', skin: '#f1c7a8', outfitType: 'skirt_blouse', top: '#b8324a', bottom: '#2b3242', shoes: '#222', lips: '#b84255' },
    lines: [
      'WITAJCIE w kamienicy! Pamiętajcie o podkładkach pod kubki — SERIO, mam na to oko! 😄',
      'Zrobiłam właśnie lasagne w mojej turkusowej kuchni. Ania, Bartek, musicie spróbować!',
      'Ten fiolet na ścianach? Wybierałam go trzy tygodnie. Warto było, prawda? 💜',
      'Czy ktoś przesunął poduszkę na kanapie o dwa centymetry?! Czuję to w kościach… 🧹',
    ],
  },
  {
    id: 'fr_joey', name: 'Joey', e: '🍕', homeX: 5.0, homeZ: -1.6, face: 1.4, gender: 'm',
    role: 'Aktor · Mieszkanie #19',
    traits: ['towarzyski', 'romantyczny'],
    desc: 'Wyluzowany, wiecznie głodny aktor. Król kanapek, piłkarzyków i kultowego „Jak leci?”.',
    look: { ...WG.generateLook(202, { body: 'm' }), hairStyle: 'fringe', hair: '#1a1412', skin: '#e6b896', outfitType: 'tee_jacket', top: '#2b2f36', inner: '#d9d9d9', bottom: '#364d73', shoes: '#2b2420' },
    lines: [
      'Hej, jak leci? 😉 Wpadajcie na piłkarzyki, tylko ostrzegam — jestem mistrzem!',
      'JOEY NIE DZIELI SIĘ JEDZENIEM! …No dobra, dla Ani i Bartka zrobię wyjątek na jeden kawałek pizzy 🍕',
      'Widzieliście nasze fotele rozkładane? Jak raz usiądziesz, to już nie wstajesz do wtorku!',
      'Biały ceramiczny chart przy wejściu? To Pat. Najlepszy lokator, nigdy nie zjada mojego jogurtu 🐕',
    ],
  },
];

export const FRIENDS_OBJECTS = [
  { id: 'sofa_monika', name: 'Salon i kanapa Moniki (#20)', icon: '🛋️', x: -10.5, z: -1.0, spot: [-9.2, -1.0], face: -Math.PI / 2, pose: 'sit', seat: 0.44, need: 'fun', gain: 26, energy: 14, msg: 'Relaks na kremowej sofie Moniki przed TV i regałem pełnym książek! 🛋️💜' },
  { id: 'kuchnia_monika', name: 'Turkusowa kuchnia Moniki (#20)', icon: '🍝', x: -3.6, z: 5.5, spot: [-4.6, 5.2], face: Math.PI / 2, pose: 'stand', anim: 'cook', need: 'hunger', gain: 48, skill: 'gotowanie', msg: 'Pyszna nowojorska kolacja w turkusowej kuchni pod miedzianymi garnkami! 🍝✨' },
  { id: 'jadalnia_monika', name: 'Okrągły stół jadalniany (#20)', icon: '🍽️', x: -5.5, z: -1.5, spot: [-5.5, 0.0], face: Math.PI, pose: 'sit', seat: 0.45, need: 'hunger', gain: 30, social: 18, msg: 'Kolacja i plotki przy okrągłym stole z 4 kolorowymi krzesłami! 🍽️' },
  { id: 'balkon_ny', name: 'Siedzisko pod oknem i schody ppoż.', icon: '🗽', x: -7.5, z: -7.4, spot: [-7.5, -6.4], face: Math.PI, pose: 'sit', seat: 0.45, need: 'fun', gain: 32, energy: 12, msg: 'Cudowny widok z siedziska pod oknem na schody przeciwpożarowe i Manhattan! 🗽🌃' },
  { id: 'pilkarzyki', name: 'Stół do piłkarzyków (#19)', icon: '⚽', x: 6.5, z: -2.0, spot: [5.2, -2.0], face: Math.PI / 2, pose: 'stand', anim: 'arms', need: 'fun', gain: 40, social: 24, msg: 'Gooool! Emocjonujący mecz w piłkarzyki w mieszkaniu Joeya! ⚽🔥' },
  { id: 'fotele_joey', name: 'Fotele rozkładane Barcalounger (#19)', icon: '🪑', x: 6.0, z: 3.5, spot: [6.0, 2.2], face: Math.PI / 2, pose: 'sit', seat: 0.45, need: 'energy', gain: 35, fun: 28, msg: 'Masywny skórzany recliner i telewizor przed Tobą — stąd nie chce się wstawać! 📺🪑' },
  { id: 'barek_joey', name: 'Lodówka i barek Joeya (#19)', icon: '🍕', x: 10.2, z: -6.0, spot: [9.0, -4.6], face: Math.PI * 0.75, pose: 'stand', need: 'hunger', gain: 40, bladder: 100, hygiene: 35, msg: 'Podwójna kanapka z klopsikami przy barze Joeya! (Nie mówcie mu!) 🥪🍕' },
  { id: 'piesek_pat', name: 'Biały ceramiczny chart Pat (#19)', icon: '🐕', x: 3.2, z: 0.2, spot: [4.2, 0.2], face: -Math.PI / 2, pose: 'stand', need: 'fun', gain: 20, msg: 'Kultowy duży biały ceramiczny chart Pat wita Cię przy wejściu do salonu #19! 🐕✨' },
  { id: 'wardrobe_monika', name: 'Szafa w mieszkaniu Moniki (#20)', icon: '🪞', x: -12.85, z: 5.4, spot: [-11.7, 5.4], face: -Math.PI / 2, pose: 'stand', wardrobe: true },
  { id: 'wardrobe_joey', name: 'Szafa w mieszkaniu Joeya (#19)', icon: '🪞', x: 4.2, z: -7.35, spot: [4.2, -6.2], face: Math.PI, pose: 'stand', wardrobe: true },
  // Obiekty misji 3D Moniki
  { id: 'm1_mugs', name: 'Krzywo ustawione kubki na stoliku', icon: '☕', x: -10.75, z: -1.0, spot: [-10.0, -1.0], face: -Math.PI / 2, pose: 'stand', anim: 'arms', quest: true },
  { id: 'm1_pillows', name: 'Rozrzucone poduszki na sofie', icon: '🛋️', x: -9.2, z: -1.0, spot: [-8.1, -1.0], face: -Math.PI / 2, pose: 'stand', anim: 'arms', quest: true },
  { id: 'm1_counter', name: 'Brudny blat przy turkusowych szafkach', icon: '🧽', x: -4.1, z: 5.5, spot: [-4.1, 4.4], face: 0, pose: 'stand', anim: 'arms', quest: true },
  { id: 'm3_closet', name: 'Sekretny schowek Moniki', icon: '🚪', x: -2.4, z: -7.5, spot: [-2.8, -6.3], face: Math.PI, pose: 'stand', anim: 'arms', quest: true },
];

export function createFriendsWorld({ buildCharacter, animateCharacter }) {
  const root = new THREE.Group();
  root.name = 'friendsWorld';

  const mat = (c, r = 0.78, m = 0, em = 0, ei = 0) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...(em ? { emissive: em, emissiveIntensity: ei } : {}) });
  // Miękko zaokrąglone krawędzie mebli i brył proceduralnych (RoundedBoxGeometry)
  const box = (p, w, h, d, c, x, y, z, o = {}) => {
    const geo = o.flat ? new THREE.BoxGeometry(w, h, d) : A3D.roundBoxGeo(w, h, d);
    const mesh = new THREE.Mesh(geo, typeof c === 'string' ? mat(c, o.r ?? 0.75, o.m ?? 0, o.em ?? 0, o.ei ?? 0) : c);
    mesh.position.set(x, y, z);
    mesh.castShadow = o.shadow !== false;
    mesh.receiveShadow = true;
    p.add(mesh);
    return mesh;
  };
  // Pełne materiały PBR (Diffuse + Normal + Roughness) dla Świata 2
  const pbrWoodMonika = A3D.getPBRMaterial('wood', { color: '#dfb892', repeat: [5, 6], roughness: 0.75 });
  const pbrWoodHall   = A3D.getPBRMaterial('wood', { color: '#a87d56', repeat: [2, 7], roughness: 0.78 });
  const pbrWoodJoey   = A3D.getPBRMaterial('wood', { color: '#c89b72', repeat: [5, 6], roughness: 0.78 });
  const pbrBrick      = A3D.getPBRMaterial('brick', { color: '#d8a696', repeat: [3, 2], roughness: 0.88, normalScale: 1.1 });
  const pbrBrickPillar = A3D.getPBRMaterial('brick', { color: '#d8a696', repeat: [1, 3], roughness: 0.88, normalScale: 1.1 });
  const pbrMarble     = A3D.getPBRMaterial('marble', { color: '#ffffff', repeat: [2, 1], roughness: 0.25, metalness: 0.08, normalScale: 0.45 });
  const pbrFabricWarm = A3D.getPBRMaterial('fabric', { color: '#e6c5a8', repeat: [2, 2], roughness: 0.9, normalScale: 0.75 });
  const pbrFabricRug  = A3D.getPBRMaterial('fabric', { color: '#d98a7c', repeat: [3, 3], roughness: 0.92, normalScale: 0.8 });
  const cyl = (p, rt, rb, h, c, x, y, z, o = {}) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 16), typeof c === 'string' ? mat(c, o.r ?? 0.65, o.m ?? 0) : c);
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    p.add(mesh);
    return mesh;
  };
  const sph = (p, rad, c, x, y, z, s = [1, 1, 1], o = {}) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(rad, 16, 12), typeof c === 'string' ? mat(c, o.r ?? 0.4, o.m ?? 0) : c);
    mesh.position.set(x, y, z);
    mesh.scale.set(...s);
    mesh.castShadow = true; mesh.receiveShadow = true;
    p.add(mesh);
    return mesh;
  };

  // ========== OŚWIETLENIE NOWEGO JORKU ==========
  const addLight = (L, x, y, z) => { L.position.set(x, y, z); root.add(L); return L; };
  addLight(new THREE.PointLight('#ffe2b0', 3.2, 22, 1.25), -8.5, 3.6, -0.5);  // salon Moniki
  addLight(new THREE.PointLight('#ffe9c8', 2.6, 18, 1.25), -4.0, 3.4, 4.5);   // kuchnia Moniki
  addLight(new THREE.PointLight('#ffd28e', 2.4, 16, 1.3), 0.0, 3.3, 0.0);     // korytarz
  addLight(new THREE.PointLight('#ffe0a8', 3.0, 22, 1.25), 6.5, 3.6, 1.5);    // salon i fotele Joeya
  addLight(new THREE.PointLight('#ffdfaa', 2.4, 18, 1.3), 8.5, 3.4, -4.5);    // piłkarzyki i kuchnia #19
  addLight(new THREE.PointLight('#9ab8ff', 1.6, 36, 1.15), -2, 7.5, -13.5);   // wieczorna poświata Manhattanu

  // ========== PODŁOGI PBR (Z = -8..+8, front Z = +8 całkowicie otwarty!) ==========
  // Płyta bazowa piętra: X = -13.5..+12.5 (szer. 26, środek -0.5), Z = -8..+8 (gł. 16, środek 0)
  box(root, 26.2, 0.24, 16.2, '#3a2a20', -0.5, -0.12, 0, { shadow: false, flat: true });
  // Mieszkanie Moniki (#20): X = -13.5..-1.5 (szer. 12, środek -7.5) – parkiet PBR!
  box(root, 12.0, 0.06, 16.0, pbrWoodMonika, -7.5, 0.03, 0, { shadow: false, flat: true });
  // Wspólny korytarz: X = -1.5..+1.5 (szer. 3.0, środek 0) – drewniana podłoga PBR!
  box(root, 3.0, 0.06, 16.0, pbrWoodHall, 0, 0.03, 0, { shadow: false, flat: true });
  // Mieszkanie Joeya (#19): X = +1.5..+12.5 (szer. 11, środek +7.0) – parkiet PBR!
  box(root, 11.0, 0.06, 16.0, pbrWoodJoey, 7.0, 0.03, 0, { shadow: false, flat: true });

  // Helper do ścian reagujących na przycisk `🧱 Ściany: wycięte / pełne / niskie`
  const wallItems = [];
  const wallBox = (p, w, h, d, c, x, y, z, kind = 'back', o = {}) => {
    const m = box(p, w, h, d, c, x, y, z, { flat: true, ...o });
    wallItems.push({ m, baseY: y, baseH: h, kind });
    return m;
  };
  const wallDecor = []; // obrazy, kinkiety, ramy okienne ukrywane w trybie niskim

  const purpleW = '#7b6899', tealW = '#45a09a', brickW = pbrBrick, joeyW = '#d8c3a5';

  // ========== ŚCIANY ZEWNĘTRZNE I DZIAŁOWE (ZERO ŚCIAN PRZY Z = +8!) ==========
  // 1. Tylna ściana Moniki (Z = -8, X = -13.5..-1.5): ceglana z ogromnym wieloszybowym oknem!
  wallBox(root, 3.2, 3.6, 0.28, brickW, -11.9, 1.8, -8.0, 'back');
  wallBox(root, 2.8, 3.6, 0.28, brickW, -2.9, 1.8, -8.0, 'back');
  wallBox(root, 6.0, 0.72, 0.28, brickW, -7.3, 0.36, -8.0, 'low');   // pod wielkim oknem
  wallBox(root, 6.0, 0.46, 0.28, brickW, -7.3, 3.37, -8.0, 'top');   // nad wielkim oknem
  // Wieloszybowe ramy okna (X = -10.3..-4.3)
  const winFrameM = mat('#f2ece2', 0.55);
  wallDecor.push(
    box(root, 6.0, 0.12, 0.34, winFrameM, -7.3, 0.74, -8.0),
    box(root, 6.0, 0.09, 0.3, winFrameM, -7.3, 2.0, -8.0),
    box(root, 0.1, 2.45, 0.3, winFrameM, -9.3, 1.95, -8.0),
    box(root, 0.1, 2.45, 0.3, winFrameM, -7.3, 1.95, -8.0),
    box(root, 0.1, 2.45, 0.3, winFrameM, -5.3, 1.95, -8.0)
  );
  // Odsłonięty ceglany filar PBR przy tylnej ścianie / strefie salon-jadalnia
  wallBox(root, 0.75, 3.6, 0.75, pbrBrickPillar, -7.6, 1.8, -4.6, 'pillar');
  // Lewa ściana Moniki (X = -13.5, Z = -8..+8) – fioletowa #7b6899
  wallBox(root, 0.28, 3.6, 16.0, purpleW, -13.5, 1.8, 0, 'side');

  // 2. Ściana między mieszkaniem Moniki a korytarzem (X = -1.5, drzwi przy Z = +2)
  // Segment tylny: Z = -8..+1.3 (dł. 9.3, środek -3.35); Segment przedni: Z = +2.7..+8 (dł. 5.3, środek +5.35)
  wallBox(root, 0.14, 3.6, 9.3, purpleW, -1.57, 1.8, -3.35, 'inner');
  wallBox(root, 0.14, 3.6, 5.3, purpleW, -1.57, 1.8, 5.35, 'inner');
  wallBox(root, 0.14, 3.6, 9.3, brickW, -1.43, 1.8, -3.35, 'inner');
  wallBox(root, 0.14, 3.6, 5.3, brickW, -1.43, 1.8, 5.35, 'inner');
  wallBox(root, 0.28, 1.0, 1.4, purpleW, -1.5, 3.1, 2.0, 'top');

  // FIOLETOWE DRZWI WEJŚCIOWE MONIKI (X = -1.5, Z = +2, otwierane do środka z ŻÓŁTĄ RAMKĄ #f1c40f!)
  const door20 = new THREE.Group();
  door20.position.set(-1.5, 0, 1.35);
  door20.rotation.y = 0.62; // otwarte lekko do środka (strona -X)
  box(door20, 0.09, 2.45, 1.25, '#684a94', 0, 1.23, 0.62);
  // Wyraźna żółta ozdobna ramka (#f1c40f) wokół wizjera od wewnętrznej strony (-X)
  const frameY = mat('#f1c40f', 0.35, 0.3, '#c99b08', 0.25);
  box(door20, 0.12, 0.48, 0.07, frameY, -0.025, 1.62, 0.42);
  box(door20, 0.12, 0.48, 0.07, frameY, -0.025, 1.62, 0.82);
  box(door20, 0.12, 0.07, 0.46, frameY, -0.025, 1.84, 0.62);
  box(door20, 0.12, 0.07, 0.46, frameY, -0.025, 1.40, 0.62);
  box(door20, 0.12, 0.14, 0.22, '#e3b852', 0.025, 1.88, 0.62); // tabliczka "20" od korytarza
  root.add(door20);

  // 3. Korytarz (X = -1.5..+1.5): tylna ściana przy Z = -8, SCHODY W GŁĘBI i KINKIETY!
  wallBox(root, 3.0, 3.6, 0.26, brickW, 0, 1.8, -8.0, 'back');
  // Schody kamienicy w głębi korytarza (Z = -7.8..-5.0)
  const stairG = new THREE.Group();
  for (let s = 0; s < 8; s++) {
    box(stairG, 2.6, 0.24, 0.38, s % 2 ? '#7c5334' : '#8d5f3c', 0, 0.14 + s * 0.24, -5.2 - s * 0.34);
  }
  box(stairG, 0.08, 2.1, 0.08, '#4a2e1a', -1.2, 1.2, -5.2);
  box(stairG, 0.08, 2.1, 0.08, '#4a2e1a', 1.2, 1.2, -5.2);
  root.add(stairG);
  // Świecące kinkiety na ceglanych ścianach korytarza
  const sconceMat = new THREE.MeshStandardMaterial({ color: '#ffebb8', emissive: '#ffbd59', emissiveIntensity: 1.5, roughness: 0.3 });
  const brassM = mat('#d4a843', 0.3, 0.8);
  [[-1.32, -2.2], [-1.32, 4.8], [1.32, -2.2], [1.32, 4.8]].forEach(([kx, kz]) => {
    const sg = new THREE.Group();
    sg.position.set(kx, 2.15, kz);
    box(sg, 0.08, 0.24, 0.14, brassM, 0, 0, 0);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.2, 10), sconceMat);
    shade.position.set(kx < 0 ? 0.12 : -0.12, 0.08, 0);
    sg.add(shade);
    root.add(sg);
    wallDecor.push(sg);
  });

  // 4. Ściana między korytarzem a mieszkaniem Joeya (X = +1.5, drzwi przy Z = +2)
  wallBox(root, 0.14, 3.6, 9.3, brickW, 1.43, 1.8, -3.35, 'inner');
  wallBox(root, 0.14, 3.6, 5.3, brickW, 1.43, 1.8, 5.35, 'inner');
  wallBox(root, 0.14, 3.6, 9.3, joeyW, 1.57, 1.8, -3.35, 'inner');
  wallBox(root, 0.14, 3.6, 5.3, joeyW, 1.57, 1.8, 5.35, 'inner');
  wallBox(root, 0.28, 1.0, 1.4, joeyW, 1.5, 3.1, 2.0, 'top');

  // BRĄZOWE DRZWI WEJŚCIOWE JOEYA (X = +1.5, Z = +2, dokładnie naprzeciwko Moniki + MAGNA DOODLE!)
  const door19 = new THREE.Group();
  door19.position.set(1.5, 0, 1.35);
  door19.rotation.y = -0.62; // otwarte lekko do środka (+X)
  box(door19, 0.09, 2.45, 1.25, '#7c5338', 0, 1.23, 0.62);
  // Biała tablica znikopis (Magna Doodle) z kolorowym rysunkiem od wewnątrz (+X)!
  box(door19, 0.11, 0.56, 0.66, '#d94848', 0.02, 1.52, 0.62);  // czerwona ramka tablicy
  box(door19, 0.12, 0.44, 0.54, '#f8f9fa', 0.03, 1.52, 0.62);  // biała powierzchnia
  // Kolorowy rysunek na znikopisie (uśmiech + domek/gwiazdka)
  box(door19, 0.13, 0.06, 0.24, '#2f6fe4', 0.035, 1.60, 0.62);
  box(door19, 0.13, 0.12, 0.06, '#2ecc71', 0.035, 1.48, 0.52);
  box(door19, 0.13, 0.12, 0.06, '#f1c40f', 0.035, 1.48, 0.72);
  box(door19, 0.12, 0.14, 0.22, '#e3b852', -0.025, 1.88, 0.62); // tabliczka "19" od korytarza
  root.add(door19);

  // 5. Tylna i prawa ściana Joeya (Z = -8, X = +1.5..+12.5; Prawa: X = +12.5, Z = -8..+8)
  wallBox(root, 4.2, 3.6, 0.28, brickW, 3.6, 1.8, -8.0, 'back');
  wallBox(root, 3.6, 3.6, 0.28, joeyW, 10.7, 1.8, -8.0, 'back');
  wallBox(root, 3.2, 0.9, 0.28, joeyW, 7.3, 0.45, -8.0, 'low');
  wallBox(root, 3.2, 0.46, 0.28, joeyW, 7.3, 3.37, -8.0, 'top');
  wallDecor.push(box(root, 3.2, 0.1, 0.32, '#f0e8dc', 7.3, 0.92, -8.0));
  wallBox(root, 0.28, 3.6, 16.0, joeyW, 12.5, 1.8, 0, 'side');

  // ============================================================
  //  [2] MEBLE I DETALE 3D – MIESZKANIE MONIKI (LEWA STRONA)
  // ============================================================
  const interactables = [];
  const tagObj = (g, id) => { g.traverse(o => { if (o.isMesh) o.userData.frObj = id; }); interactables.push(g); };

  // A. KUCHNIA (przód-prawo tuż przy wejściu: X = -5.5..-1.8, Z = +3.5..+7.5) – blaty marmurowe PBR!
  const kitG = new THREE.Group();
  // Szafki turkusowe wzdłuż prawej ściany działowej (X ≈ -2.1, Z = 3.8..7.3)
  box(kitG, 0.78, 0.92, 2.3, tealW, -2.05, 0.46, 5.1);
  box(kitG, 0.84, 0.08, 2.36, pbrMarble, -2.05, 0.95, 5.1); // marmurowy blat PBR
  // Kuchenka z palnikami
  box(kitG, 0.78, 0.92, 0.85, '#e8ecee', -2.05, 0.46, 6.75);
  [-0.2, 0.2].forEach(dz => [-0.16, 0.16].forEach(dx => cyl(kitG, 0.09, 0.09, 0.03, '#222', -2.05 + dx, 0.94, 6.75 + dz)));
  // Lodówka po prawej stronie przy wejściu (X = -2.15, Z = 3.5)
  box(kitG, 0.85, 2.05, 0.85, '#f2eadc', -2.1, 1.03, 3.55);
  box(kitG, 0.06, 0.42, 0.06, '#adb5bd', -2.55, 1.35, 3.35);
  // Wyspa / półwysep kuchenny (X = -5.2..-2.7, Z = 5.4) z marmurowym blatem PBR!
  box(kitG, 2.5, 0.9, 0.95, tealW, -4.1, 0.45, 5.5);
  box(kitG, 2.6, 0.08, 1.05, pbrMarble, -4.1, 0.94, 5.5);
  // Stelaż nad półwyspem z WISZĄCYMI MIEDZIANYMI GARNKAMI I PATELNIAMI!
  const rackG = new THREE.Group();
  box(rackG, 2.2, 0.06, 0.55, '#2b2d30', -4.1, 2.65, 5.5);
  [-4.9, -4.4, -3.85, -3.3].forEach((px, i) => {
    cyl(rackG, 0.014, 0.014, 0.36, '#333', px, 2.45, 5.5);
    const cop = i % 2 === 0 ? '#d27a44' : '#c46a35';
    cyl(rackG, 0.16 + (i % 2) * 0.04, 0.14 + (i % 2) * 0.03, 0.15, cop, px, 2.2, 5.5, { r: 0.25, m: 0.8 });
    box(rackG, 0.26, 0.03, 0.04, '#333', px + 0.2, 2.24, 5.5); // rączka patelni
  });
  kitG.add(rackG);
  tagObj(kitG, 'kuchnia_monika');
  root.add(kitG);

  // B. JADALNIA (centrum-prawo: X = -5.5, Z = -1.5) — okrągły stół + 4 RÓŻNE kolorowe krzesła!
  const dinG = new THREE.Group();
  dinG.position.set(-5.5, 0, -1.5);
  cyl(dinG, 1.05, 1.05, 0.08, '#8f5a34', 0, 0.78, 0);
  cyl(dinG, 0.12, 0.32, 0.76, '#6b4022', 0, 0.38, 0);
  // 4 zupełnie różne krzesła: czerwone, żółte, niebieskie, zielone!
  const chairSpecs = [
    ['#d94141', 0.54, 0],
    ['#f1c40f', 0.46, Math.PI / 2],
    ['#2f7de4', 0.58, Math.PI],
    ['#36a866', 0.50, Math.PI * 1.5],
  ];
  chairSpecs.forEach(([cc, bh, ang]) => {
    const cg = new THREE.Group();
    cg.position.set(Math.cos(ang) * 1.32, 0, Math.sin(ang) * 1.32);
    cg.rotation.y = -ang - Math.PI / 2;
    box(cg, 0.46, 0.07, 0.46, cc, 0, 0.47, 0);
    box(cg, 0.44, bh, 0.07, cc, 0, 0.48 + bh / 2, -0.2);
    [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([lx, lz]) =>
      box(cg, 0.045, 0.46, 0.045, '#5a3820', lx, 0.23, lz));
    dinG.add(cg);
  });
  tagObj(dinG, 'jadalnia_monika');
  root.add(dinG);

  // C. SALON MONIKI (centrum-lewo: X = -10.5, Z = -1.0) – prawdziwe modele .glb + tekstury PBR!
  // Warstwowe, wzorzyste dywany PBR na drewnianej podłodze
  box(root, 4.6, 0.025, 5.4, pbrFabricRug, -10.4, 0.072, -1.0, { shadow: false, flat: true });
  box(root, 3.6, 0.03, 4.2, pbrFabricWarm, -10.4, 0.078, -1.0, { shadow: false, flat: true });
  box(root, 2.5, 0.035, 3.0, '#6e3a54', -10.4, 0.083, -1.0, { shadow: false, flat: true });

  const sofaG = new THREE.Group();
  // Fallback proceduralny sofy (zastępowany po załadowaniu GlamVelvetSofa.glb!)
  const sofaFb = new THREE.Group();
  box(sofaFb, 1.05, 0.46, 2.8, pbrFabricWarm, -9.4, 0.28, -1.0);
  box(sofaFb, 0.26, 0.72, 2.8, pbrFabricWarm, -8.98, 0.72, -1.0);
  box(sofaFb, 1.05, 0.64, 0.26, pbrFabricWarm, -9.4, 0.46, -2.28);
  box(sofaFb, 1.05, 0.64, 0.26, pbrFabricWarm, -9.4, 0.46, 0.28);
  box(sofaFb, 0.18, 0.34, 0.38, '#c73866', -9.2, 0.68, -1.7);
  box(sofaFb, 0.18, 0.34, 0.38, '#45a09a', -9.2, 0.68, -0.3);
  sofaG.add(sofaFb);
  // Prawdziwy model 3D: GlamVelvetSofa.glb (skalowany przez Box3, skierowany na lewą ścianę z TV!)
  A3D.mountGlbModel(sofaG, {
    name: 'sofa',
    targetSize: [2.75, 1.05, 1.15],
    pos: [-9.35, 0.06, -1.0],
    rotY: -Math.PI / 2,
    userData: { frObj: 'sofa_monika' },
    fallbackGroup: sofaFb,
    replaceFallback: true,
  });

  // Niski drewniany stolik kawowy z marmurowym blatem PBR + patera z oliwkami .glb!
  box(sofaG, 0.78, 0.38, 1.5, '#7a4d2c', -10.75, 0.2, -1.0);
  box(sofaG, 0.82, 0.05, 1.54, pbrMarble, -10.75, 0.41, -1.0);
  cyl(sofaG, 0.06, 0.05, 0.1, '#ffffff', -10.7, 0.48, -1.35);
  cyl(sofaG, 0.06, 0.05, 0.1, '#f1c40f', -10.82, 0.48, -0.55);
  A3D.mountGlbModel(sofaG, {
    name: 'dish',
    targetSize: [0.42, 0.22, 0.42],
    pos: [-10.75, 0.43, -0.95],
    rotY: 0.4,
    userData: { frObj: 'sofa_monika' },
  });

  // Designerski fotel tapicerowany (SheenChair.glb) obok sofy z fallbackiem uszaka!
  const wingG = new THREE.Group();
  wingG.position.set(-10.3, 0, 1.75);
  wingG.rotation.y = Math.PI * 0.72;
  box(wingG, 0.92, 0.44, 0.88, pbrFabricWarm, 0, 0.26, 0);
  box(wingG, 0.9, 0.92, 0.2, '#3d6854', 0, 0.8, -0.36);
  box(wingG, 0.18, 0.56, 0.38, '#3d6854', -0.4, 0.98, -0.22);
  box(wingG, 0.18, 0.56, 0.38, '#3d6854', 0.4, 0.98, -0.22);
  box(wingG, 0.18, 0.34, 0.8, '#3d6854', -0.4, 0.54, 0.02);
  box(wingG, 0.18, 0.34, 0.8, '#3d6854', 0.4, 0.54, 0.02);
  sofaG.add(wingG);
  A3D.mountGlbModel(sofaG, {
    name: 'chair',
    targetSize: [1.05, 1.15, 1.05],
    pos: [-10.3, 0.06, 1.75],
    rotY: Math.PI * 0.72,
    userData: { frObj: 'sofa_monika' },
    fallbackGroup: wingG,
    replaceFallback: true,
  });

  // Stylowa lampa / latarenka (Lantern.glb) w salonie Moniki przy oknie!
  A3D.mountGlbModel(root, {
    name: 'lantern',
    targetSize: [0.45, 0.78, 0.45],
    pos: [-12.6, 0.06, -6.6],
    rotY: 0.6,
  });
  // Dekoracyjny aparat vintage (AntiqueCamera.glb) na regale z książkami w #20!
  A3D.mountGlbModel(root, {
    name: 'camera',
    targetSize: [0.45, 0.52, 0.45],
    pos: [-12.95, 2.46, -4.2],
    rotY: Math.PI / 2,
  });
  tagObj(sofaG, 'sofa_monika');
  root.add(sofaG);

  // Lewa ściana (X = -13.5): Szafka RTV z TV, wysoki regał z kolorowymi książkami i obrazy/plakaty!
  box(root, 0.62, 0.72, 2.2, '#6b4228', -13.0, 0.36, -1.0);
  box(root, 0.16, 0.82, 1.3, '#1a1e24', -12.95, 1.15, -1.0, { em: '#3a588a', ei: 0.38 });
  // Wysoki regał z kolorowymi książkami (X = -13.0, Z = -4.2)
  const bookG = new THREE.Group();
  box(bookG, 0.52, 2.45, 1.8, '#5e3922', -13.05, 1.23, -4.2);
  const bookCols = ['#e5534b', '#f1c40f', '#45a09a', '#3b82f6', '#e07a5f', '#9b59b6'];
  for (let row = 0; row < 4; row++) {
    for (let b = 0; b < 6; b++) {
      box(bookG, 0.36, 0.32, 0.2, bookCols[(row * 3 + b) % bookCols.length], -12.96, 0.42 + row * 0.54, -4.85 + b * 0.26);
    }
  }
  root.add(bookG);
  // Obrazy i plakaty na fioletowej ścianie (X = -13.34)
  wallDecor.push(
    box(root, 0.06, 0.95, 0.72, '#f5efe6', -13.34, 2.25, 1.5),
    box(root, 0.07, 0.78, 0.56, '#d9534f', -13.32, 2.25, 1.5),
    box(root, 0.06, 0.85, 0.95, '#e3b852', -13.34, 2.2, 3.6),
    box(root, 0.07, 0.68, 0.78, '#45a09a', -13.32, 2.2, 3.6)
  );

  // D. SIEDZISKO POD OKNEM (window seat przy Z = -7.4) + METALOWE SCHODY PPOŻ. (Z = -9.5)!
  const balkG = new THREE.Group();
  // Miękkie siedzisko z poduszkami pod wielkim oknem (wewnątrz #20)
  box(balkG, 5.6, 0.48, 0.88, '#f0e6d8', -7.3, 0.24, -7.4);
  box(balkG, 5.5, 0.14, 0.84, '#6b8e7e', -7.3, 0.54, -7.4);
  ['#c73866', '#f1c40f', '#45a09a', '#e07a5f'].forEach((pc, i) =>
    box(balkG, 0.45, 0.38, 0.2, pc, -9.2 + i * 1.25, 0.76, -7.65));
  // Metalowy balkon i schody przeciwpożarowe za oknem (Z = -9.5)!
  const ironM = mat('#1d2024', 0.42, 0.82);
  box(balkG, 5.8, 0.09, 2.0, ironM, -7.3, 0.08, -9.2);
  for (let i = 0; i < 11; i++) box(balkG, 0.05, 0.11, 2.0, ironM, -10.1 + i * 0.56, 0.1, -9.2);
  box(balkG, 5.8, 0.07, 0.07, ironM, -7.3, 1.12, -10.18);
  box(balkG, 0.07, 0.07, 2.0, ironM, -10.18, 1.12, -9.2);
  box(balkG, 0.07, 0.07, 2.0, ironM, -4.42, 1.12, -9.2);
  for (let i = 0; i < 14; i++) box(balkG, 0.04, 1.04, 0.04, ironM, -10.05 + i * 0.42, 0.6, -10.18);
  for (let s = 0; s < 8; s++) box(balkG, 0.72, 0.05, 0.26, ironM, -9.4, 0.35 + s * 0.38, -9.7 + s * 0.14);
  const fRail = box(balkG, 0.06, 3.4, 0.06, ironM, -9.0, 1.75, -9.15);
  fRail.rotation.x = 0.34;
  tagObj(balkG, 'balkon_ny');
  root.add(balkG);

  // ============================================================
  //  [3] MEBLE I DETALE 3D – MIESZKANIE JOEYA (PRAWA STRONA)
  // ============================================================
  // A. BIAŁY CERAMICZNY PIES (Pat the Dog) przy wejściu (X = +3.2, Z = +0.2)!
  const dogG = new THREE.Group();
  dogG.position.set(3.2, 0.06, 0.2);
  dogG.rotation.y = 0.5;
  const cerM = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.12, metalness: 0.12, emissive: '#e8eff7', emissiveIntensity: 0.14 });
  box(dogG, 0.78, 0.14, 1.15, '#5b3a24', 0, 0.07, 0);                     // niski drewniany podest
  sph(dogG, 0.34, cerM, 0, 0.66, -0.05, [0.95, 1.25, 1.35]);              // korpus siedzącego charta
  cyl(dogG, 0.16, 0.24, 0.56, cerM, 0, 1.12, 0.18);                       // smukła szyja charta
  sph(dogG, 0.2, cerM, 0, 1.46, 0.26, [0.9, 0.95, 1.35]);                 // głowa
  sph(dogG, 0.11, cerM, 0, 1.42, 0.52, [0.8, 0.75, 1.25]);                // wydłużony pysk charta
  cyl(dogG, 0.03, 0.06, 0.24, cerM, -0.14, 1.66, 0.16);                   // lewe ucho
  cyl(dogG, 0.03, 0.06, 0.24, cerM, 0.14, 1.66, 0.16);                    // prawe ucho
  cyl(dogG, 0.07, 0.06, 0.56, cerM, -0.16, 0.42, 0.34);                   // przednia łapa L
  cyl(dogG, 0.07, 0.06, 0.56, cerM, 0.16, 0.42, 0.34);                    // przednia łapa P
  sph(dogG, 0.18, cerM, -0.22, 0.34, -0.22, [0.85, 0.95, 1.2]);           // udo siedzące L
  sph(dogG, 0.18, cerM, 0.22, 0.34, -0.22, [0.85, 0.95, 1.2]);            // udo siedzące P
  // Zarysowanie na białym psie Pat (widoczne w Zadaniu 3 Joeya!)
  const patScratch = box(dogG, 0.08, 0.38, 0.08, '#2b2420', 0.26, 0.72, 0.08);
  patScratch.rotation.z = 0.42;
  patScratch.visible = false;
  tagObj(dogG, 'piesek_pat');
  root.add(dogG);

  // ========== OBIEKTY MISJI 3D (MONIKA ZADANIE 1 & 3 + PULSUJĄCE ZNACZNIKI 3D) ==========
  const questMarkers = [];
  const makeBeacon = (x, y, z, col = '#ffd23f') => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const dia = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.85, roughness: 0.2 })
    );
    g.add(dia);
    g.userData = { y0: y, dia };
    g.visible = false;
    root.add(g);
    questMarkers.push(g);
    return g;
  };

  // Zadanie 1 Moniki: 3 klikalne obiekty porządkowe (kubki, poduszki, brudny blat)
  const qMugs = new THREE.Group();
  const mugA = cyl(qMugs, 0.08, 0.07, 0.14, '#ff6b6b', -10.85, 0.5, -1.35); mugA.rotation.z = 0.35;
  const mugB = cyl(qMugs, 0.08, 0.07, 0.14, '#ffd23f', -10.62, 0.5, -0.68); mugB.rotation.z = -0.3;
  const mugHit = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.9, 1.3), new THREE.MeshBasicMaterial({ visible: false }));
  mugHit.position.set(-10.75, 0.65, -1.0);
  qMugs.add(mugHit);
  tagObj(qMugs, 'm1_mugs'); qMugs.visible = false; root.add(qMugs);

  const qPillows = new THREE.Group();
  const pilA = box(qPillows, 0.36, 0.26, 0.42, '#ff5c8a', -9.45, 0.66, -1.6); pilA.rotation.set(0.4, 0.5, 0.3);
  const pilB = box(qPillows, 0.36, 0.26, 0.42, '#45c4b0', -9.55, 0.64, -0.35); pilB.rotation.set(-0.35, -0.4, 0.4);
  const pilHit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 2.2), new THREE.MeshBasicMaterial({ visible: false }));
  pilHit.position.set(-9.35, 0.72, -1.0);
  qPillows.add(pilHit);
  tagObj(qPillows, 'm1_pillows'); qPillows.visible = false; root.add(qPillows);

  const qCounter = new THREE.Group();
  box(qCounter, 0.95, 0.04, 0.55, '#6b3e26', -4.1, 0.99, 5.5); // plama z sosu na blacie!
  box(qCounter, 0.45, 0.045, 0.35, '#8a4f2d', -3.6, 0.995, 5.3);
  const cntHit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.1), new THREE.MeshBasicMaterial({ visible: false }));
  cntHit.position.set(-4.1, 1.15, 5.5);
  qCounter.add(cntHit);
  tagObj(qCounter, 'm1_counter'); qCounter.visible = false; root.add(qCounter);

  // Zadanie 3 Moniki: Sekretny schowek pełen ukrytego bałaganu (X = -2.4, Z = -7.5)
  const qCloset = new THREE.Group();
  qCloset.position.set(-2.4, 0, -7.5);
  box(qCloset, 1.45, 2.45, 0.72, '#5c3f82', 0, 1.23, 0);
  const closetDoor = box(qCloset, 1.32, 2.3, 0.08, '#4c326e', 0, 1.23, 0.38);
  box(qCloset, 0.1, 0.1, 0.12, '#f1c40f', 0.45, 1.2, 0.44); // złota klamka
  const closetMess = new THREE.Group();
  box(closetMess, 0.45, 0.35, 0.4, '#e5534b', -0.25, 0.25, 0.58);
  box(closetMess, 0.38, 0.32, 0.36, '#f1c40f', 0.22, 0.22, 0.64);
  box(closetMess, 0.42, 0.28, 0.35, '#45a09a', 0.0, 0.56, 0.54);
  closetMess.visible = false;
  qCloset.add(closetMess);
  tagObj(qCloset, 'm3_closet');
  root.add(qCloset);

  const beacons = {
    m1_mugs: makeBeacon(-10.75, 1.45, -1.0, '#ffd23f'),
    m1_pillows: makeBeacon(-9.3, 1.55, -1.0, '#ffd23f'),
    m1_counter: makeBeacon(-4.1, 1.85, 5.5, '#ffd23f'),
    m3_closet: makeBeacon(-2.4, 2.85, -7.2, '#ff77aa'),
    kuchnia_monika: makeBeacon(-3.6, 2.25, 5.5, '#45e0d4'),
    barek_joey: makeBeacon(10.2, 2.35, -5.8, '#ffd23f'),
    pilkarzyki: makeBeacon(6.5, 2.15, -2.0, '#39c07f'),
    piesek_pat: makeBeacon(3.2, 2.35, 0.2, '#ff6b6b'),
    fr_monika: makeBeacon(-4.2, 2.55, 3.4, '#c77dff'),
    fr_joey: makeBeacon(5.0, 2.55, -1.6, '#ffa94d'),
  };

  // B. STREFA RELAKSU I FOTELE (przód-centrum: X = +6.0, Z = +3.5) skierowane na TV przy X = +11.5, Z = +3.5!
  box(root, 4.6, 0.03, 4.2, '#6b5344', 7.2, 0.075, 3.5, { shadow: false }); // dywan pod fotelami
  const chairG = new THREE.Group();
  const leatherM = mat('#5c321e', 0.42, 0.08);
  const leatherDarkM = mat('#472414', 0.45, 0.08);
  [2.55, 4.45].forEach(cz => {
    const rG = new THREE.Group();
    rG.position.set(6.0, 0, cz);
    // Skierowane dokładnie w stronę prawej ściany (+X, na telewizor przy X = +11.5)
    box(rG, 1.12, 0.48, 1.12, leatherM, 0, 0.28, 0);           // grube siedzisko
    box(rG, 0.3, 0.92, 1.12, leatherDarkM, -0.45, 0.74, 0);    // masywne oparcie (-X)
    box(rG, 1.08, 0.62, 0.26, leatherDarkM, 0, 0.52, -0.48);   // podłokietnik L
    box(rG, 1.08, 0.62, 0.26, leatherDarkM, 0, 0.52, 0.48);    // podłokietnik P
    box(rG, 0.45, 0.22, 0.92, leatherM, 0.72, 0.28, 0);        // rozkładany podnóżek (+X!)
    chairG.add(rG);
  });
  // Duży drewniany regał z telewizorem pod prawą ścianą (X = +11.5, Z = +3.5)
  box(chairG, 0.85, 2.25, 3.4, '#6b4228', 11.75, 1.13, 3.5);
  box(chairG, 0.22, 0.98, 1.45, '#191d24', 11.3, 1.18, 3.5, { em: '#4a6ea8', ei: 0.42 });
  tagObj(chairG, 'fotele_joey');
  root.add(chairG);

  // C. STREFA PIŁKARZYKÓW (centrum-prawo: X = +6.5, Z = -2.0) z wolną przestrzenią z obu stron!
  const foosG = new THREE.Group();
  foosG.position.set(6.5, 0, -2.0);
  box(foosG, 1.25, 0.3, 1.85, '#7d4a26', 0, 0.84, 0);
  box(foosG, 1.08, 0.06, 1.66, '#2e944e', 0, 0.98, 0); // zielone boisko!
  [[-0.5, -0.78], [0.5, -0.78], [-0.5, 0.78], [0.5, 0.78]].forEach(([lx, lz]) =>
    box(foosG, 0.1, 0.74, 0.1, '#4a2b16', lx, 0.37, lz));
  // Poprzeczne drążki i figurki zawodników
  for (let i = 0; i < 6; i++) {
    const rz = -0.62 + i * 0.25;
    box(foosG, 1.75, 0.03, 0.03, '#cfd6de', 0, 1.03, rz);
    const col = i % 2 ? '#e5534b' : '#2f6fe4';
    box(foosG, 0.08, 0.16, 0.08, col, -0.28, 1.07, rz);
    box(foosG, 0.08, 0.16, 0.08, col, 0.28, 1.07, rz);
  }
  tagObj(foosG, 'pilkarzyki');
  root.add(foosG);

  // D. KUCHNIA KAWALERSKA (tył-prawo: X = +8.5..+12.0, Z = -7.5..-4.5) – marmurowe blaty PBR!
  const barG = new THREE.Group();
  // Drewniana zabudowa kuchenna wzdłuż prawej i tylnej ściany
  box(barG, 2.4, 0.92, 0.78, '#8a5d3b', 10.6, 0.46, -7.35);
  box(barG, 2.46, 0.08, 0.84, pbrMarble, 10.6, 0.95, -7.35);
  box(barG, 0.88, 2.05, 0.88, '#e8ecf0', 11.75, 1.03, -6.2); // lodówka Joeya
  // Lada barowa (X = 8.8..11.2, Z = -4.9) + 2 wysokie hokery!
  box(barG, 2.4, 1.02, 0.62, '#7a4e2f', 10.0, 0.51, -4.95);
  box(barG, 2.5, 0.08, 0.72, pbrMarble, 10.0, 1.05, -4.95);
  // Dekoracyjny aparat vintage na regale RTV Joeya (#19)
  A3D.mountGlbModel(root, {
    name: 'camera',
    targetSize: [0.42, 0.48, 0.42],
    pos: [11.65, 2.26, 2.5],
    rotY: -Math.PI / 2,
  });

  // ========== DWUDRZWIOWE SZAFY 3D DO GARDEROBY W OBU MIESZKANIACH ==========
  const buildWardrobe3D = (x, z, rotY, bodyCol, doorCol, trimCol, handleCol, id) => {
    const wg = new THREE.Group();
    wg.position.set(x, 0.06, z);
    wg.rotation.y = rotY;
    box(wg, 1.65, 2.25, 0.68, bodyCol, 0, 1.13, 0);                 // korpus
    box(wg, 1.75, 0.1, 0.76, trimCol, 0, 2.28, 0.02);               // górny gzyms
    box(wg, 1.7, 0.12, 0.72, trimCol, 0, 0.06, 0.01);               // cokół
    // Dwoje drzwi z ramkami i uchwytami
    [-0.4, 0.4].forEach(dx => {
      box(wg, 0.76, 2.02, 0.06, doorCol, dx, 1.15, 0.34);
      box(wg, 0.62, 1.82, 0.02, trimCol, dx, 1.15, 0.375);
      box(wg, 0.54, 1.72, 0.025, doorCol, dx, 1.15, 0.382);
    });
    // Uchwyty metalowe pośrodku drzwi
    box(wg, 0.04, 0.24, 0.05, handleCol, -0.09, 1.12, 0.41, { r: 0.25, m: 0.85 });
    box(wg, 0.04, 0.24, 0.05, handleCol, 0.09, 1.12, 0.41, { r: 0.25, m: 0.85 });
    tagObj(wg, id);
    root.add(wg);
  };
  // Szafa w mieszkaniu Moniki (#20 – styl parysko-fioletowy z kremowymi drzwiami i złotymi uchwytami)
  buildWardrobe3D(-12.85, 5.4, Math.PI / 2, '#624c85', '#f3ede4', '#dfd2c0', '#e3b852', 'wardrobe_monika');
  // Szafa w mieszkaniu Joeya (#19 – ciepłe drewno industrialne z ciemnymi uchwytami)
  buildWardrobe3D(4.2, -7.35, 0, '#5e3c24', '#7a4f30', '#4a2e1a', '#24272c', 'wardrobe_joey');
  [9.4, 10.6].forEach(hx => {
    cyl(barG, 0.2, 0.18, 0.08, '#3a2b24', hx, 0.72, -4.2);
    cyl(barG, 0.04, 0.16, 0.7, '#222', hx, 0.36, -4.2);
  });
  tagObj(barG, 'barek_joey');
  root.add(barG);

  // ========== PANORAMA NOWEGO JORKU ZA TYLNYMI OKNAMI (Z < -11) ==========
  const cityG = new THREE.Group();
  box(cityG, 90, 0.2, 24, '#252932', 0, -6.5, -18, { shadow: false });
  box(cityG, 2.3, 0.65, 1.1, '#f5c42f', -5.5, -6.0, -14.5); // żółta taksówka NY
  box(cityG, 1.1, 0.45, 0.95, '#f5c42f', -5.5, -5.5, -14.5);
  const winGlow = new THREE.MeshBasicMaterial({ color: '#ffdf9a' });
  [[-19, 16, 7.5, '#6e3a2e'], [-10.5, 14, 7, '#7c4534'], [-2, 19, 7.5, '#5a3a35'], [7, 15, 7, '#754132'], [16, 18, 7.5, '#523836']].forEach(([bx, bh, bw, col]) => {
    box(cityG, bw, bh, 5, col, bx, bh / 2 - 6.5, -23.5, { shadow: false });
    for (let r = 0; r < 5; r++) for (let c = -1; c <= 1; c++) {
      if ((r + c + bx) % 3 === 0) continue;
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), winGlow);
      w.position.set(bx + c * 1.85, -2.5 + r * 2.5, -20.95);
      cityG.add(w);
    }
  });
  [[-24, 34, -36], [-12, 40, -40], [0, 48, -42], [12, 37, -38], [24, 32, -35]].forEach(([sx, sh, sz], idx) => {
    box(cityG, 6.8, sh, 6.8, '#1d243b', sx, sh / 2 - 6.5, sz, { shadow: false });
    if (idx === 2) {
      box(cityG, 3.4, 6, 3.4, '#27304f', sx, sh - 3.5, sz, { shadow: false });
      cyl(cityG, 0.08, 0.36, 8, '#ffe8a8', sx, sh + 3.4, sz);
    }
  });
  root.add(cityG);

  // ========== NPC-e 3D (EKIPA PRZYJACIÓŁ) ==========
  const npcs = FRIENDS_NPCS.map(def => {
    const r = new THREE.Group();
    r.position.set(def.homeX, 0.06, def.homeZ);
    r.rotation.y = def.face;
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.9, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hb.position.y = 0.95; hb.userData.frNpc = def.id;
    r.add(hb);
    root.add(r);
    const entry = { def, root: r, ch: null, talkUntil: 0, x: def.homeX, z: def.homeZ, face: def.face };
    if (buildCharacter) {
      buildCharacter(def.look).then(ch => {
        entry.ch = ch;
        ch.root.traverse(m => { if (m.isMesh) m.userData.frNpc = def.id; });
        r.add(ch.root);
      }).catch(() => {});
    }
    return entry;
  });

  // Ania i Bartek startują razem w salonie/jadalni Moniki
  const sim = { x: -7.2, z: 1.6, face: 0, tx: -7.2, tz: 1.6, moving: false, act: null, onArrive: null };
  const bartek = { x: -5.8, z: 1.8, face: -1.3, talkUntil: 0 };

  const clampWalk = (x, z) => [Math.max(-12.8, Math.min(11.8, x)), Math.max(-7.3, Math.min(7.3, z))];

  function setWallMode(mode) {
    // mode: 0 = wycięte, 1 = pełne, 2 = niskie
    for (const w of wallItems) {
      if (mode === 2) {
        if (w.kind === 'top') { w.m.visible = false; continue; }
        w.m.visible = true;
        const sc = w.kind === 'low' ? 0.55 : 0.22;
        w.m.scale.y = sc;
        w.m.position.y = (w.baseH * sc) / 2;
      } else if (mode === 0) {
        if (w.kind === 'top') { w.m.visible = false; continue; }
        w.m.visible = true;
        const sc = (w.kind === 'inner' || w.kind === 'side') ? 0.65 : 1.0;
        w.m.scale.y = sc;
        w.m.position.y = (w.baseH * sc) / 2;
      } else {
        w.m.visible = true;
        w.m.scale.y = 1.0;
        w.m.position.y = w.baseY;
      }
    }
    wallDecor.forEach(d => { d.visible = mode !== 2; });
  }
  setWallMode(0);

  function syncQuests(fs) {
    Object.values(beacons).forEach(b => { b.visible = false; });
    qMugs.visible = false; qPillows.visible = false; qCounter.visible = false;
    patScratch.visible = false;
    closetMess.visible = !!(fs && fs.monica && fs.monica.m3found);
    closetDoor.rotation.y = closetMess.visible ? 1.05 : 0;
    closetDoor.position.x = closetMess.visible ? -0.55 : 0;
    if (!fs || !fs.branch) return;
    if (fs.branch === 'monica' && !fs.monica.done) {
      const m = fs.monica;
      if (m.step === 0) {
        qMugs.visible = !m.m1.mugs; beacons.m1_mugs.visible = !m.m1.mugs;
        qPillows.visible = !m.m1.pillows; beacons.m1_pillows.visible = !m.m1.pillows;
        qCounter.visible = !m.m1.counter; beacons.m1_counter.visible = !m.m1.counter;
      } else if (m.step === 1) {
        if (!m.m2gotSauce) beacons.barek_joey.visible = true;
        else beacons.kuchnia_monika.visible = true;
      } else if (m.step === 2) {
        if (!m.m3found) beacons.m3_closet.visible = true;
        else beacons.fr_monika.visible = true;
      }
    } else if (fs.branch === 'joey' && !fs.joey.done) {
      const j = fs.joey;
      if (j.step === 0) {
        beacons.fr_joey.visible = true;
      } else if (j.step === 1) {
        if (!j.j2gotCake) beacons.kuchnia_monika.visible = true;
        else beacons.pilkarzyki.visible = true;
      } else if (j.step === 2) {
        patScratch.visible = !j.j3fixedDog;
        if (!j.j3gotGlue) beacons.kuchnia_monika.visible = true;
        else if (!j.j3fixedDog) beacons.piesek_pat.visible = true;
        else beacons.fr_joey.visible = true;
      }
    }
  }

  return {
    root,
    npcs,
    sim,
    bartek,
    setWallMode,
    syncQuests,
    setNpcAnim(id, anim, sec = 3.5) {
      const n = npcs.find(x => x.def.id === id);
      if (n) { n.anim = anim; n.animUntil = performance.now() + sec * 1000; }
    },
    // Domyślna kamera: obejmuje oba mieszkania z przodu pod lekkim kątem z góry, celując w (0, 1, 0)
    camAt: [0.0, 17.0, 22.0, 0.0, 1.0, 0.0],
    camPresets: {
      all: [0.0, 17.0, 22.0, 0.0, 1.0, 0.0],
      monika: [-7.5, 11.5, 14.5, -7.5, 1.0, 0.0],
      joey: [7.0, 11.5, 14.5, 7.0, 1.0, 0.0],
    },
    walkTo(x, z, onArrive = null) {
      const [cx, cz] = clampWalk(x, z);
      sim.tx = cx; sim.tz = cz; sim.moving = true; sim.act = null; sim.onArrive = onArrive;
    },
    pick(ray) {
      const npcHits = ray.intersectObjects(npcs.map(n => n.root), true);
      for (const h of npcHits) {
        let o = h.object;
        while (o && !o.userData.frNpc) o = o.parent;
        if (o && o.userData.frNpc) return { npc: npcs.find(n => n.def.id === o.userData.frNpc) };
      }
      const objHits = ray.intersectObjects(interactables.filter(g => g.visible), true);
      for (const h of objHits) {
        let o = h.object;
        while (o && !o.userData.frObj) o = o.parent;
        if (o && o.userData.frObj) return { obj: FRIENDS_OBJECTS.find(f => f.id === o.userData.frObj) };
      }
      return null;
    },
    update(dt, now) {
      const t = now / 1000;
      if (sim.moving) {
        const dx = sim.tx - sim.x, dz = sim.tz - sim.z, d = Math.hypot(dx, dz);
        if (d < 0.14) {
          sim.x = sim.tx; sim.z = sim.tz; sim.moving = false;
          const cb = sim.onArrive; sim.onArrive = null;
          if (cb) cb();
        } else {
          const step = Math.min(d, 3.6 * dt);
          sim.x += (dx / d) * step; sim.z += (dz / d) * step;
          sim.face = Math.atan2(dx, dz);
        }
      }
      for (const b of questMarkers) {
        if (!b.visible) continue;
        b.position.y = b.userData.y0 + Math.sin(t * 3.8) * 0.14;
        b.userData.dia.rotation.y = t * 2.2;
      }
      for (const n of npcs) {
        if (!n.ch || !animateCharacter) continue;
        const st = { pose: 'stand', talk: now < n.talkUntil };
        if (n.anim && now < (n.animUntil || 0)) st.anim = n.anim;
        animateCharacter(n.ch, st, dt, t);
      }
    },
    dispose() {
      root.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    },
  };
}
