// Autonomiczne „mącenie” Bartka w 3D na Słonecznej Uliczce oraz 3 unikalne akcje szpiegowsko-prowokacyjne
// po przełączeniu sterowania na portret Bartka. Zero timerów!
import * as THREE from 'three';

export const BARTEK_TARGETS = ['hania', 'marek', 'zosia', 'kuba'];

export const BARTEK_SCHEMES = [
  {
    id: 'laptop',
    icon: '💻',
    label: 'Majstrowanie z laptopem przy skrzynce sąsiada',
    bartekSay: 'Jeszcze tylko obejście szyfrowania skrzynki… 💻⚡',
    particles: ['⚡', '📡'],
    witnessLines: [
      'Co ten Bartek znowu kombinuje przy mojej skrzynce?! ❗',
      'Widziałam go z tym laptopem, to bardzo podejrzane! 👀',
      'Bartek?! Podłączasz się do mojej skrzynki na listy?! 💢',
    ],
    suspicion: 16,
  },
  {
    id: 'envelope',
    icon: '✉️',
    label: 'Podrzucanie tajemniczej koperty pod furtkę',
    bartekSay: 'Nikt nie patrzy… cyk, tajemnicza koperta pod furtką! ✉️🤫',
    particles: ['✉️', '🤫'],
    witnessLines: [
      'Ej! Co Bartek właśnie podrzucił pod furtkę?! ❗',
      'Tajemnicza koperta z czerwoną pieczęcią?! Bartek, widziałem Cię! 👀',
      'To na pewno sprawka Bartka — kręcił się tu przed chwilą! 💢',
    ],
    suspicion: 14,
  },
  {
    id: 'dig',
    icon: '📦',
    label: 'Zakopywanie podejrzanego pudełka w rogu ogrodu',
    bartekSay: 'Tu w rogu ogrodu nikt tego nie znajdzie… chyba… 📦🕳️',
    particles: ['📦', '💨'],
    witnessLines: [
      'Chwila… czy Bartek właśnie coś ZAKOPUJE przy płocie?! ❗',
      'Co jest w tym pudełku, Bartek?! Cała ulica to widzi! 👀',
      'Znowu coś ukrywa po kątach! Bardzo podejrzane… 🤨',
    ],
    suspicion: 18,
  },
  {
    id: 'bribe',
    icon: '💵',
    label: 'Szeptanie i przekupywanie sąsiada na rogu ulicy',
    bartekSay: 'Ciii… 50 zł i nic dzisiaj nie widziałeś, zgoda? 💵🤫',
    particles: ['💵', '🤫'],
    witnessLines: [
      'Widziałam, jak Bartek wręcza komuś pieniądze na rogu! ❗',
      'O czym oni tak szepczą?! Bartek wyraźnie coś knuje! 👀',
      'Przekupstwo w biały dzień na Słonecznej Uliczce?! Skandal! 💢',
    ],
    suspicion: 15,
  },
];

export const BARTEK_SPECIAL_ACTS = [
  {
    id: 'eavesdrop',
    icon: '🎧',
    label: 'Podsłuchaj rozmowę / krzątaninę',
    desc: 'Przy płocie lub oknie sąsiada – zdobywa losową plotkę bez wiedzy sąsiada (0% wykrycia).',
  },
  {
    id: 'false_lead',
    icon: '🃏',
    label: 'Podłóż fałszywy trop',
    desc: 'W skrzynce sąsiada – kieruje podejrzenia na innego sąsiada, wywołuje kłótnię NPC-ów i zbija podejrzenia wobec Bartka.',
  },
  {
    id: 'absurd_theory',
    icon: '🗣️',
    label: 'Wkręć sąsiada w absurdalną teorię',
    desc: 'Wmawia sąsiadowi wymyśloną historię – obniża czujność sąsiada przed śledztwem Ani!',
  },
];

export const ABSURD_THEORIES = [
  {
    pitch: 'Wiesz, że gołębie na naszej ulicy mają wbudowane routery 5G i skanują trawniki? 🐦📡',
    react: 'CO?! Dlatego ten gołąb tak na mnie patrzył rano! Muszę schować krasnala! 🤯',
  },
  {
    pitch: 'Słyszałeś o nowym przepisie? Od jutra każdy musi mierzyć długość cienia płotu co godzinę! 📏☀️',
    react: 'Że co?! Lecę po linijkę, nie mam teraz głowy do żadnych podejrzeń! 🤯',
  },
  {
    pitch: 'Ponoć w naszej kanalizacji mieszkają bardzo kulturalne szopy i to one kradną pojedyncze skarpetki! 🦝🧦',
    react: 'O rety… to wyjaśnia moją zieloną skarpetkę z wtorku! Dzięki za ostrzeżenie, Bartek! 🤯',
  },
  {
    pitch: 'Sprawdzałem w kodzie satelity — nasza ulica leży na polu magnetycznym, przez które mleko szybciej znika z lodówek! 🛰️🥛',
    react: 'Niesamowite! Zaraz sprawdzę swoją lodówkę, w ogóle zapomniałem o czym rozmawialiśmy! 🤯',
  },
];

export const FALSE_LEAD_LINES = [
  ['To TY podrzucasz anonimy do mojej skrzynki?! Mam dowód! 💢', 'Ja?! Zwariowałeś?! Sam na siebie donosisz?! ⚡'],
  ['Cała ulica wie, że to Twoja sprawka! Nie wypieraj się! 💢', 'Jak śmiesz mnie oskarżać?! To wojna sąsiedzka! 😡'],
  ['Znalazłem w skrzynce notatkę z Twoim podpisem! 💢', 'To jakaś prowokacja! Jeszcze pożałujesz tych oszczerstw! ⚡'],
];

// Buduje mały rekwizyt 3D do akcji autonomicznej Bartka (laptop / koperta / pudełko)
export function makeSpyProp(kind) {
  const g = new THREE.Group();
  if (kind === 'laptop') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.3), new THREE.MeshStandardMaterial({ color: '#2b2f36', metalness: 0.5, roughness: 0.35 }));
    base.position.y = 0.88;
    const scr = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.025), new THREE.MeshStandardMaterial({ color: '#1b2838', emissive: '#38e8a2', emissiveIntensity: 1.2 }));
    scr.position.set(0, 1.02, -0.14); scr.rotation.x = -0.25;
    g.add(base, scr);
  } else if (kind === 'envelope') {
    const env = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.22), new THREE.MeshStandardMaterial({ color: '#fff8e8', roughness: 0.7 }));
    env.position.y = 0.03;
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.03, 12), new THREE.MeshStandardMaterial({ color: '#c0392b', emissive: '#6e1414', emissiveIntensity: 0.3 }));
    seal.position.y = 0.04;
    g.add(env, seal);
  } else if (kind === 'dig') {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.36), new THREE.MeshStandardMaterial({ color: '#8a5a34', roughness: 0.85 }));
    box.position.y = 0.14;
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.38), new THREE.MeshStandardMaterial({ color: '#2b2f36', metalness: 0.5 }));
    band.position.y = 0.16;
    g.add(box, band);
  } else {
    const bill = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.14), new THREE.MeshStandardMaterial({ color: '#39c07f', emissive: '#1e6e44', emissiveIntensity: 0.4 }));
    bill.position.y = 1.05;
    g.add(bill);
  }
  return g;
}
