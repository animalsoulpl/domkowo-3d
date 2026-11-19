// Romantyczna kolacja w nowym świecie 3D („Taras Księżycowy” nad jeziorem)
// oraz tajne plotkowanie z Bartkiem o wszystkich sąsiadach (0% ryzyka wycieku!).
import * as THREE from 'three';

export const DATE_INVITES = [
  'Kochanie, ucieknijmy na chwilę z domu na romantyczną kolację nad jeziorem? W spokoju poplotkujemy o całej ulicy… 🍷✨',
  'Hej skarbie! Zarezerwowałem stolik przy świecach nad Księżycowym Jeziorem. Idziemy na randkę czy chociaż buziak? 🕯️💕',
  'Zostawmy na chwilę dom i sąsiadów… Wyskoczymy na tajną kolację przy świecach? Tam nikt nas nie podsłucha! 🥂🌙',
];

export const DATE_KISS_LINES = [
  'Mmm, od razu lepiej! Kocham Cię, skarbie 💕',
  'Najlepszy buziak na całej Słonecznej Uliczce! 😘',
  'Tego mi było trzeba! Wracamy do kolacji albo... jeszcze jeden? 💋',
];

export const DATE_TOAST_LINES = [
  ['Za nas i za to, że mieszkamy razem! 🥂', 'Za najlepszą drużynę na ulicy! Zawsze po tej samej stronie ✨'],
  ['Za spokój przy świecach i najświeższe plotki! 🍷', 'Na zdrowie, kochanie! Oby sąsiedzi nigdy nie przestali nas bawić 😏'],
  ['Za ten widok na jezioro i za Ciebie 💕', 'Księżyc, wino i Ty – czego chcieć więcej? 🌙'],
];

// Dodatkowe, zabawne anegdoty gdy wszystkie sekrety danego sąsiada są już znane
export const EXTRA_GOSSIP = [
  '{n} podobno ćwiczy przed lustrem „przypadkowe” miny, kiedy mija nas na chodniku. Z pełną choreografią!',
  'Widziałem wczoraj, jak {n} sprawdzał(a) przez firankę, kto wynosi śmieci. Z lornetką teatralną!',
  '{n} ma w domu specjalny zeszyt z ocenami trawników na całej ulicy. Podobno nasz ma „podejrzanie ładny kolor”.',
  'Słyszałem, że {n} zapisał(a) się na kurs „jak wyglądać na bardzo zajętego, idąc po bułki”. Pierwsze miejsce w grupie!',
  '{n} zawsze mówi, że „nie lubi plotek”, po czym pyta o trzy dodatkowe szczegóły i robi notatki w głowie.',
  'Ponoć {n} negocjuje z kurierem specjalny kod pukania, żeby sąsiedzi nie wiedzieli, ile paczek naprawdę przychodzi.',
];

export const ANIA_GOSSIP_OPENERS = [
  'Kochanie, nachyl się… słyszałeś, co ostatnio wyprawia {n}? 🤫',
  'Tylko między nami, przy tym winie… wiesz co odkryłam o {n}? 🍷',
  'Nie zgadniesz! Chodzi o {n}… muszę Ci to powiedzieć! 🤭',
  'Dobrze, że tu nikt nie słucha… pamiętasz {n}? Posłuchaj tego! ✨',
];

export const BARTEK_GOSSIP_REPLIES = [
  'NO NIE WIERZĘ! 😂 {n}?! A zawsze udaje takiego świętoszka!',
  'Hahaha, genialne! 🍷 Nasz mały tajny wywiad działa lepiej niż Kronika!',
  'Czekaj, doleję Ci wina… 🥂 To najlepsze, co dziś słyszałem! I spokojnie — stąd nic nie wycieknie 🤐💕',
  'O rany… 🤣 Będę się śmiał za każdym razem, jak spotkam {n} przy furtce!',
  'Uwielbiam te nasze tajne kolacje! 🕯️ Nikt nie słyszy, zero afery, a ile zabawy!',
];

export const fillG = (s, name, isFem = false) =>
  s.replace(/\{n\}/g, name || 'Sąsiad')
   .replace(/\(a\)/g, isFem ? 'a' : '');

export function createDateWorld({ buildCharacter, partnerLook }) {
  const sc = new THREE.Scene();
  sc.background = new THREE.Color('#090d22');
  sc.fog = new THREE.FogExp2('#0c1330', 0.018);

  // Oświetlenie: chłodna księżycowa poświata + ciepły blask świec na stoliku
  const hemi = new THREE.HemisphereLight('#6f85cc', '#181428', 0.65);
  sc.add(hemi);
  const moonLight = new THREE.DirectionalLight('#a8c4ff', 0.85);
  moonLight.position.set(-14, 18, -22);
  sc.add(moonLight);

  const candleLight = new THREE.PointLight('#ffaa52', 3.4, 11, 1.5);
  candleLight.position.set(0, 1.55, 0);
  sc.add(candleLight);

  const fillWarm = new THREE.PointLight('#ff7799', 1.1, 14, 1.6);
  fillWarm.position.set(0, 3.2, 2.4);
  sc.add(fillWarm);

  const mat = (c, r = 0.7, m = 0, em = 0, ei = 0) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...(em ? { emissive: em, emissiveIntensity: ei } : {}) });

  // Księżyc + poświata
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 24, 24),
    new THREE.MeshBasicMaterial({ color: '#fff4d4' })
  );
  moon.position.set(-12, 14, -36);
  sc.add(moon);
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 20, 20),
    new THREE.MeshBasicMaterial({ color: '#9ab6ff', transparent: true, opacity: 0.16, depthWrite: false })
  );
  halo.position.copy(moon.position);
  sc.add(halo);

  // Gwiazdy
  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 420; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.random() * Math.PI * 0.44;
    const rad = 48 + Math.random() * 14;
    starPos.push(Math.cos(th) * Math.cos(ph) * rad, Math.sin(ph) * rad + 2, Math.sin(th) * Math.cos(ph) * rad);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#fff8e8', size: 0.28, transparent: true, opacity: 0.88 }));
  sc.add(stars);

  // Jezioro
  const waterMat = new THREE.MeshStandardMaterial({
    color: '#0e2246', roughness: 0.14, metalness: 0.55, emissive: '#081834', emissiveIntensity: 0.45
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 24, 24), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.55;
  sc.add(water);

  // Odbicie księżyca na wodzie
  const moonRefl = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 22),
    new THREE.MeshBasicMaterial({ color: '#c8dcff', transparent: true, opacity: 0.14, depthWrite: false })
  );
  moonRefl.rotation.x = -Math.PI / 2;
  moonRefl.position.set(-7, -0.52, -18);
  sc.add(moonRefl);

  // Drewniany taras/pomost na palach nad wodą
  const deckY = 0;
  const woodM = mat('#5b3b27', 0.78);
  const darkWoodM = mat('#3d2518', 0.82);
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.6, 0.32, 32), woodM);
  deck.position.set(0, -0.16, 0);
  sc.add(deck);
  // Pomost prowadzący za plecy
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, 7), woodM);
  bridge.position.set(0, -0.16, 7.2);
  sc.add(bridge);
  // Pale w wodzie
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.4, 10), darkWoodM);
    pile.position.set(Math.cos(a) * 4.2, -0.7, Math.sin(a) * 4.2);
    sc.add(pile);
  }
  // Elegancki dywanik pod stolikiem
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.03, 32), mat('#6b1f3a', 0.9));
  rug.position.set(0, 0.015, 0);
  sc.add(rug);

  // 4 kolumny pergoli + girlandy ciepłych lampek
  const colPos = [[-3.1, -2.5], [3.1, -2.5], [-3.1, 2.5], [3.1, 2.5]];
  const stoneM = mat('#e7dfd2', 0.72);
  const bulbM = new THREE.MeshBasicMaterial({ color: '#ffd98a' });
  colPos.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 3.3, 12), stoneM);
    col.position.set(cx, 1.65, cz);
    sc.add(col);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.42), stoneM);
    cap.position.set(cx, 3.32, cz);
    sc.add(cap);
  });
  // Sznury z lampkami pomiędzy kolumnami
  const wirePairs = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
  wirePairs.forEach(([i, j]) => {
    const [x1, z1] = colPos[i], [x2, z2] = colPos[j];
    const steps = 7;
    for (let s = 1; s < steps; s++) {
      const f = s / steps;
      const sag = Math.sin(f * Math.PI) * 0.42;
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), bulbM);
      b.position.set(x1 + (x2 - x1) * f, 3.22 - sag, z1 + (z2 - z1) * f);
      sc.add(b);
    }
  });

  // Donice z różami na tarasie
  const potM = mat('#9d523c', 0.7);
  const leafM = mat('#225c37', 0.8);
  const roseM = mat('#d92b54', 0.5, 0, '#5a0c1e', 0.25);
  [[-3.4, 0], [3.4, 0], [0, -3.5]].forEach(([px, pz]) => {
    const g = new THREE.Group();
    g.position.set(px, 0, pz);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.42, 12), potM);
    pot.position.y = 0.21;
    g.add(pot);
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), leafM);
    bush.position.y = 0.62;
    g.add(bush);
    for (let r = 0; r < 5; r++) {
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), roseM);
      const a = r * 1.25;
      fl.position.set(Math.cos(a) * 0.26, 0.68 + (r % 2) * 0.14, Math.sin(a) * 0.26);
      g.add(fl);
    }
    sc.add(g);
  });

  // Romantyczny stolik z białym obrusem
  const tableG = new THREE.Group();
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.86, 0.78, 24), mat('#faf5ef', 0.85));
  cloth.position.y = 0.39;
  tableG.add(cloth);
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.77, 0.77, 0.04, 24), mat('#fffaf4', 0.8));
  tableTop.position.y = 0.79;
  tableG.add(tableTop);

  // Złote świeczniki i płomyki
  const goldM = mat('#e3b852', 0.28, 0.85);
  const flames = [];
  [-0.14, 0.14].forEach((cx, idx) => {
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.18, 10), goldM);
    holder.position.set(cx, 0.9, idx === 0 ? -0.1 : 0.1);
    tableG.add(holder);
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.2, 10), mat('#fff7e8', 0.7));
    wax.position.set(cx, 1.07, idx === 0 ? -0.1 : 0.1);
    tableG.add(wax);
    const fl = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.11, 8),
      new THREE.MeshBasicMaterial({ color: '#ffcc55' })
    );
    fl.position.set(cx, 1.22, idx === 0 ? -0.1 : 0.1);
    tableG.add(fl);
    flames.push(fl);
  });

  // Wazonik z czerwoną różą pośrodku
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 0.2, 12), mat('#d9e8f5', 0.15, 0.2));
  vase.position.set(0, 0.91, 0);
  tableG.add(vase);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), leafM);
  stem.position.set(0, 1.04, 0);
  tableG.add(stem);
  const rose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), roseM);
  rose.position.set(0, 1.16, 0);
  tableG.add(rose);

  // Talerze i kieliszki z winem dla Ani (-x) i Bartka (+x)
  const plateM = mat('#ffffff', 0.25, 0.1);
  const wineM = mat('#7a0c24', 0.15, 0.1, '#3b0410', 0.25);
  [-0.44, 0.44].forEach(px => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.022, 16), plateM);
    plate.position.set(px, 0.82, 0);
    tableG.add(plate);
    const meal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.04, 12), mat('#c97e48', 0.65));
    meal.position.set(px, 0.85, 0);
    tableG.add(meal);
    const stemG = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.035, 0.13, 8), plateM);
    stemG.position.set(px * 0.72, 0.87, px < 0 ? 0.24 : -0.24);
    tableG.add(stemG);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.022, 0.09, 10), wineM);
    cup.position.set(px * 0.72, 0.96, px < 0 ? 0.24 : -0.24);
    tableG.add(cup);
  });
  sc.add(tableG);

  // Dwa krzesła naprzeciwko siebie
  const chairM = mat('#7b2240', 0.65);
  const makeChair = (x, faceSign) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 0);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), chairM);
    seat.position.y = 0.46;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.58, 0.5), chairM);
    back.position.set(-faceSign * 0.23, 0.78, 0);
    g.add(back);
    [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.46, 6), goldM);
      leg.position.set(lx, 0.23, lz);
      g.add(leg);
    });
    sc.add(g);
  };
  makeChair(-1.05, 1);
  makeChair(1.05, -1);

  // Pływające lampiony na wodzie wokół tarasu
  const lanterns = [];
  const lantM = new THREE.MeshBasicMaterial({ color: '#ffcf7d' });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const rad = 6.2 + (i % 3) * 3.1;
    const lg = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 10), darkWoodM);
    lg.add(base);
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.26, 8), lantM);
    glow.position.y = 0.15;
    lg.add(glow);
    lg.position.set(Math.cos(a) * rad, -0.51, Math.sin(a) * rad);
    lg.userData = { a, rad, phase: Math.random() * 6.28 };
    sc.add(lg);
    lanterns.push(lg);
  }

  // Odległe sylwetki drzew po drugiej stronie jeziora
  const shoreTreeM = mat('#0d1d24', 0.95);
  for (let i = 0; i < 16; i++) {
    const a = Math.PI + (i / 15) * Math.PI;
    const rad = 20 + (i % 3) * 4;
    const tr = new THREE.Mesh(new THREE.ConeGeometry(1.4 + (i % 2) * 0.6, 5.5 + (i % 3) * 1.5, 7), shoreTreeM);
    tr.position.set(Math.cos(a) * rad, 2.1, Math.sin(a) * rad);
    sc.add(tr);
  }

  // Złote świetliki
  const fireflies = [];
  const ffM = new THREE.MeshBasicMaterial({ color: '#ffe888' });
  for (let i = 0; i < 24; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 6), ffM);
    const a = Math.random() * 6.28, rad = 1.6 + Math.random() * 4.2;
    f.userData = { a, rad, y0: 0.7 + Math.random() * 2.4, sp: 0.35 + Math.random() * 0.5, ph: Math.random() * 6.28 };
    sc.add(f);
    fireflies.push(f);
  }

  // Partner (Bartek) siedzący naprzeciwko Ani
  const partnerRoot = new THREE.Group();
  partnerRoot.position.set(1.05, deckY, 0);
  partnerRoot.rotation.y = -Math.PI / 2;
  sc.add(partnerRoot);
  const state = {
    scene: sc,
    deckY,
    simSeat: { x: -1.05, y: deckY, z: 0, face: Math.PI / 2 },
    partnerSeat: { x: 1.05, y: deckY, z: 0, face: -Math.PI / 2 },
    partnerRoot,
    partnerCh: null,
    partnerTalkUntil: 0,
    simTalkUntil: 0,
    camAt: [0.2, 2.75, 4.9, 0, 1.05, -0.15],
    update(dt, now, animateFn) {
      const t = now / 1000;
      flames.forEach((fl, i) => {
        fl.scale.y = 0.85 + Math.sin(t * 11 + i * 2.1) * 0.18;
        fl.scale.x = fl.scale.z = 0.92 + Math.cos(t * 9 + i) * 0.1;
      });
      candleLight.intensity = 3.2 + Math.sin(t * 8.5) * 0.35 + Math.sin(t * 17) * 0.15;
      lanterns.forEach(l => {
        const u = l.userData;
        l.position.y = -0.51 + Math.sin(t * 1.3 + u.phase) * 0.04;
        l.rotation.z = Math.sin(t * 0.9 + u.phase) * 0.06;
      });
      fireflies.forEach(f => {
        const u = f.userData;
        f.position.set(
          Math.cos(u.a + t * 0.12 * u.sp) * u.rad,
          u.y0 + Math.sin(t * 1.4 * u.sp + u.ph) * 0.35,
          Math.sin(u.a + t * 0.12 * u.sp) * u.rad
        );
      });
      if (state.partnerCh && animateFn) {
        animateFn(state.partnerCh, { pose: 'sit', seat: 0.46, talk: now < state.partnerTalkUntil }, dt, t);
      }
    },
    dispose() {
      sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    },
  };

  if (buildCharacter && partnerLook) {
    buildCharacter(partnerLook).then(ch => {
      state.partnerCh = ch;
      partnerRoot.add(ch.root);
    }).catch(() => {});
  }

  return state;
}
