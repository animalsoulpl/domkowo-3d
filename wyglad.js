// Generator wyglądu postaci: z jednego ziarna (seed) powstaje zawsze ta sama osoba –
// imię, fryzura, kolory, krój ubrania i dodatki. Dzięki temu wygląd jest stały między wczytaniami gry.

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

export const SKIN_TONES = ['#f7dcc8', '#f0c9aa', '#e8b894', '#d9a27c', '#c58c64', '#a8714c', '#8a5a3c', '#62402b'];
export const BODY_BUILDS = [['slim', 'Szczupła'], ['athletic', 'Wysportowana'], ['curvy', 'Pełniejsza']];
export const HAIR_COLORS = {
  blond: ['#e9cd7e', '#d8b261', '#f0dca0'], braz: ['#6b4428', '#8a5a33', '#4f3320'], czarne: ['#1d1510', '#2b211c'],
  rude: ['#b5562f', '#c9672e', '#8f3a22'], siwe: ['#bdb8b0', '#dcd6cc', '#9c9890'],
};
export const HAIR_SWATCHES = ['#f0dca0', '#e9cd7e', '#d8b261', '#8a5a33', '#6b4428', '#4f3320', '#2b211c', '#1d1510', '#c9672e', '#b5562f', '#8f3a22', '#dcd6cc', '#7b4bd6', '#e86f9a'];
export const EYE_COLORS = ['#5a3a22', '#3f2a1a', '#4f7fae', '#5e8c5a', '#7a6a4a', '#2e2a26'];
export const LIP_COLORS = [null, '#c4505a', '#d46a6a', '#b84a6a', '#c97a6e', '#a33a3a', '#e86f9a'];

export const HAIRSTYLES_ALL = [
  ['long', 'Długie proste'],
  ['waves', 'Fale do ramion'],
  ['ponytail', 'Wysoki kucyk'],
  ['bun', 'Kok na czubku'],
  ['bob', 'Krótki bob'],
  ['afro', 'Kręcone afro / loki'],
  ['parted', 'Krótkie z przedziałkiem'],
  ['messy', 'Rozczochrane'],
  ['ponytail_bangs', 'Kucyk z grzywką'],
  ['buzz', 'Buzzcut / na jeża'],
  ['bald', 'Łysina'],
];
export const HAIR_F = [['long', 'Długie proste'], ['waves', 'Fale do ramion'], ['ponytail', 'Wysoki kucyk'], ['bun', 'Kok na czubku'], ['bob', 'Krótki bob'], ['afro', 'Kręcone afro'], ['ponytail_bangs', 'Kucyk z grzywką'], ['pixie', 'Krótkie (pixie)'], ['buns', 'Dwa koczki']];
export const HAIR_M = [['parted', 'Z przedziałkiem'], ['fringe', 'Krótkie z grzywką'], ['messy', 'Rozczochrane'], ['wavy', 'Dłuższe falowane'], ['afro', 'Kręcone afro'], ['buzz', 'Buzzcut / na jeża'], ['bald', 'Łysina']];
export const BEARDS = [['none', 'Brak'], ['stubble', 'Zarost'], ['full', 'Pełna broda'], ['mustache', 'Wąsy'], ['goatee', 'Kozia bródka']];
export const TOP_STYLES = [
  ['tee', 'T-shirt'],
  ['blazer', 'Marynarka / Żakiet'],
  ['sweater', 'Sweter oversize'],
  ['hoodie', 'Bluza z kapturem'],
  ['tank', 'Top na ramiączkach'],
  ['shirt', 'Koszula z kołnierzykiem'],
];
export const BOTTOM_STYLES = [
  ['jeans', 'Dżinsy'],
  ['skirt', 'Spódnica rozkloszowana'],
  ['gown', 'Suknia wieczorowa (długa)'],
  ['shorts', 'Szorty'],
  ['slacks', 'Spodnie garniturowe'],
  ['joggers', 'Dresy'],
];
export const SHOE_STYLES = [
  ['sneakers', 'Sneakersy'],
  ['heels', 'Szpilki / Półbuty'],
  ['boots', 'Botki'],
  ['slippers', 'Kapcie'],
];
export const OUTFIT_CATS = [
  ['everyday', '☀️', 'Codzienny'],
  ['formal', '✨', 'Wizytowy'],
  ['sleepwear', '🌙', 'Piżama'],
  ['athletic', '🏃‍♀️', 'Sportowy'],
];
export const CLOTH_SWATCHES = ['#e5534b', '#2f6fe4', '#39a06a', '#f2c14e', '#ec6fb4', '#7b4bd6', '#f4f4f4', '#2b2f36', '#8fd0f0', '#f08a4b', '#1f3a5f', '#8a2e3b', '#c9b48a', '#5b7f6a'];
export const OUTFIT_F = [['dress_flare', 'Rozkloszowana sukienka'], ['dress_fit', 'Dopasowana sukienka'], ['skirt_blouse', 'Spódnica i bluzka'], ['pants_blazer', 'Spodnie i marynarka'], ['sweater', 'Luźny sweter'], ['hoodie', 'Bluza z kapturem'], ['tee', 'T-shirt i jeansy']];
export const OUTFIT_M = [['shirt_rolled', 'Koszula, podwinięte rękawy'], ['hoodie', 'Bluza z kapturem'], ['blazer', 'Marynarka casual'], ['tee_jacket', 'T-shirt i kurtka'], ['vest', 'Koszula i kamizelka'], ['tee', 'T-shirt'], ['sweater', 'Sweter']];
export const GLASSES = [['none', 'Brak'], ['round', 'Okrągłe'], ['square', 'Prostokątne'], ['sun', 'Przeciwsłoneczne']];
export const BAGS = [['none', 'Brak'], ['handbag', 'Torebka'], ['backpack', 'Plecak']];

// paleta ubrań
const TOPS = ['#e5534b', '#2f6fe4', '#39a06a', '#f2c14e', '#ec6fb4', '#7b4bd6', '#f2f2f2', '#2b2f36', '#8fd0f0', '#f08a4b', '#a8d48a', '#c9a6e8', '#1f3a5f', '#8a2e3b', '#d9c7a8', '#5b7f6a'];
const DRESSES = ['#c0392b', '#1f3a5f', '#2e7d5b', '#d4a017', '#8e44ad', '#e86f9a', '#2b2f36', '#4aa3df', '#f4f1ea', '#a0522d'];
const JACKETS = ['#2b2f36', '#3b4a6b', '#6b4a32', '#4a5a3a', '#7a7f87', '#2f4f7f', '#8a6a4a', '#1c1c22'];
const INNERS = ['#f4f4f4', '#ffffff', '#e8e2d4', '#2b2f36', '#cfe3f3', '#f6d6d6'];
const PANTS = ['#2f4f7f', '#3b5f9a', '#24324f', '#1f1f24', '#c9b48a', '#6b6f5a', '#7a7f87', '#4a3a2e', '#d9d4c7'];
const SKIRTS = ['#1f1f24', '#2f4f7f', '#8a2e3b', '#c9b48a', '#5b7f6a', '#7a6aa8', '#d48a6a'];
const SHOES = ['#f4f4f4', '#1f1f24', '#6b4428', '#8a2e3b', '#c9a27a', '#2f4f7f'];
const WATCH = ['#1f1f24', '#6b4428', '#c9a227', '#b8bec6'];

export const NAMES_F = ['Anna', 'Maria', 'Katarzyna', 'Magdalena', 'Agnieszka', 'Joanna', 'Ewa', 'Karolina', 'Monika', 'Aleksandra', 'Julia', 'Zuzanna', 'Wiktoria', 'Natalia', 'Paulina', 'Martyna', 'Weronika', 'Kinga', 'Iga', 'Lena', 'Hanna', 'Oliwia', 'Marta', 'Beata', 'Dorota', 'Patrycja', 'Emilia', 'Klaudia', 'Sylwia', 'Alicja'];
export const NAMES_M = ['Piotr', 'Krzysztof', 'Tomasz', 'Paweł', 'Michał', 'Marcin', 'Jakub', 'Adam', 'Łukasz', 'Mateusz', 'Kamil', 'Bartek', 'Szymon', 'Filip', 'Wojtek', 'Dawid', 'Rafał', 'Grzegorz', 'Antoni', 'Igor', 'Oskar', 'Kacper', 'Damian', 'Sebastian', 'Jan', 'Stanisław', 'Robert', 'Dominik', 'Hubert', 'Maciej'];
const SURN = [['Nowak', 'Nowak'], ['Kowalski', 'Kowalska'], ['Wiśniewski', 'Wiśniewska'], ['Wójcik', 'Wójcik'], ['Kamiński', 'Kamińska'], ['Lewandowski', 'Lewandowska'], ['Zieliński', 'Zielińska'], ['Szymański', 'Szymańska'], ['Woźniak', 'Woźniak'], ['Dąbrowski', 'Dąbrowska'], ['Kozłowski', 'Kozłowska'], ['Mazur', 'Mazur'], ['Jankowski', 'Jankowska'], ['Krawczyk', 'Krawczyk'], ['Piotrowski', 'Piotrowska'], ['Grabowski', 'Grabowska'], ['Pawlak', 'Pawlak'], ['Michalski', 'Michalska'], ['Król', 'Król'], ['Wieczorek', 'Wieczorek'], ['Jabłoński', 'Jabłońska'], ['Majewski', 'Majewska'], ['Olszewski', 'Olszewska'], ['Stępień', 'Stępień'], ['Malinowski', 'Malinowska']];

const pickR = (r, a) => a[Math.floor(r() * a.length)];
const weighted = (r, list) => { let s = 0; for (const [, w] of list) s += w; let x = r() * s; for (const [v, w] of list) { if ((x -= w) <= 0) return v; } return list[0][0]; };

export function generateName(seed, body) {
  const r = rng(seed ^ 0x9e3779b9), f = body === 'f';
  return { first: pickR(r, f ? NAMES_F : NAMES_M), last: pickR(r, SURN)[f ? 1 : 0] };
}

/**
 * Losuje pełny wygląd. opts: { body:'f'|'m', age:'adult'|'senior'|'young', name }
 * Zwraca obiekt "look" w formacie gen:2 rozumianym przez postac.js.
 */
export function generateLook(seed, opts = {}) {
  const r = rng(seed);
  const body = opts.body || (r() < 0.52 ? 'f' : 'm'), f = body === 'f', age = opts.age || (r() < 0.12 ? 'senior' : 'adult');
  const hairKey = age === 'senior' ? (r() < 0.75 ? 'siwe' : 'braz') : weighted(r, [['blond', 3], ['braz', 5], ['czarne', 3], ['rude', 1.2], ['siwe', 0.3]]);
  const L = {
    gen: 2, body, age,
    skin: pickR(r, SKIN_TONES), hair: pickR(r, HAIR_COLORS[hairKey]), eyes: pickR(r, EYE_COLORS),
    hairStyle: f ? weighted(r, age === 'senior' ? [['bun', 4], ['bob', 3], ['pixie', 3]] : [['long', 4], ['ponytail', 3], ['bun', 2], ['bob', 3], ['pixie', 1], ['buns', 1]])
      : weighted(r, age === 'senior' ? [['parted', 3], ['buzz', 2], ['bald', 3]] : [['fringe', 4], ['wavy', 3], ['parted', 3], ['buzz', 2], ['bald', 0.6]]),
    beard: f ? 'none' : weighted(r, [['none', 5], ['stubble', 3], ['full', 2], ['mustache', 1], ['goatee', 1.3]]),
    outfitType: f ? weighted(r, [['dress_flare', 2], ['dress_fit', 2], ['skirt_blouse', 2.5], ['pants_blazer', 2], ['sweater', 2], ['hoodie', 1.5], ['tee', 1.5]])
      : weighted(r, [['shirt_rolled', 3], ['hoodie', 2], ['blazer', 2], ['tee_jacket', 2], ['vest', 1.5], ['tee', 2], ['sweater', 1.5]]),
    lips: f ? pickR(r, ['#c4505a', '#d46a6a', '#b84a6a', '#c97a6e', '#a33a3a']) : null,
    acc: {
      glasses: weighted(r, age === 'senior' ? [['none', 2], ['round', 2], ['square', 3]] : [['none', 8], ['round', 1.2], ['square', 1.5], ['sun', 1]]),
      bag: f ? weighted(r, [['none', 4], ['handbag', 4], ['backpack', 1.5]]) : weighted(r, [['none', 6], ['backpack', 2.5]]),
      watch: r() < (f ? 0.35 : 0.55) ? pickR(r, WATCH) : null,
      earrings: f && r() < 0.6,
    },
  };
  const o = L.outfitType;
  L.top = o.startsWith('dress') ? pickR(r, DRESSES) : ['blazer', 'pants_blazer', 'tee_jacket', 'vest'].includes(o) ? pickR(r, JACKETS) : pickR(r, TOPS);
  L.inner = pickR(r, o === 'tee_jacket' ? TOPS.concat(INNERS) : INNERS);
  L.bottom = o === 'skirt_blouse' ? pickR(r, SKIRTS) : pickR(r, PANTS);
  if (o === 'skirt_blouse') L.top = pickR(r, INNERS.concat(['#f2c14e', '#8fd0f0', '#ec6fb4', '#c9a6e8']));
  L.shoes = pickR(r, SHOES);
  L.pattern = weighted(r, o === 'sweater' ? [['knit', 5], ['stripes', 1]] : o.startsWith('dress') ? [['plain', 4], ['dots', 1.5], ['floral', 1.5]] : o === 'shirt_rolled' ? [['plain', 3], ['check', 2], ['stripes', 1]] : o === 'tee' ? [['plain', 4], ['stripes', 1.5]] : [['plain', 1]]);
  L.bottomPattern = L.bottom.match(/#(2f4f7f|3b5f9a|24324f)/) ? 'denim' : 'plain';
  if (o === 'tee_jacket' && r() < 0.5) L.top = '#3b5f9a', L.topPattern = 'denim'; // kurtka jeansowa
  L.boots = f && !o.startsWith('dress') && o !== 'skirt_blouse' ? r() < 0.25 : f && r() < 0.3;
  L.tights = f && (o.startsWith('dress') || o === 'skirt_blouse') && r() < 0.35 ? pickR(r, ['#1f1f24', '#3a2e2a']) : null;
  const nm = opts.name || generateName(seed, body); L.name = typeof nm === 'string' ? nm : nm.first; if (typeof nm !== 'string') L.surname = nm.last;
  L.seed = seed >>> 0;
  return L;
}

/** Krótki opis wyglądu, np. do dymka. */
export function describeLook(L) {
  const lab = (list, k) => (list.find(x => x[0] === k) || [, ''])[1];
  return [lab(HAIRSTYLES_ALL, L.hairStyle) || lab(L.body === 'm' ? HAIR_M : HAIR_F, L.hairStyle), lab(L.body === 'm' ? OUTFIT_M : OUTFIT_F, L.outfitType)].filter(Boolean).join(', ');
}

// ---------- System 4 kategorii strojów (everyday, formal, sleepwear, athletic) ----------
function legacyToLayered(L) {
  const ot = L.outfitType || 'tee', fem = L.body !== 'm';
  let topStyle = 'tee', bottomStyle = 'jeans', shoeStyle = L.boots ? 'boots' : 'sneakers';
  if (ot === 'dress_flare') { topStyle = 'tank'; bottomStyle = 'skirt'; shoeStyle = 'heels'; }
  else if (ot === 'dress_fit') { topStyle = 'tank'; bottomStyle = 'gown'; shoeStyle = 'heels'; }
  else if (ot === 'skirt_blouse') { topStyle = 'shirt'; bottomStyle = 'skirt'; shoeStyle = 'heels'; }
  else if (ot === 'pants_blazer' || ot === 'blazer') { topStyle = 'blazer'; bottomStyle = 'slacks'; shoeStyle = 'heels'; }
  else if (ot === 'sweater') { topStyle = 'sweater'; bottomStyle = 'jeans'; shoeStyle = 'boots'; }
  else if (ot === 'hoodie') { topStyle = 'hoodie'; bottomStyle = 'joggers'; shoeStyle = 'sneakers'; }
  else if (ot === 'shirt_rolled' || ot === 'vest') { topStyle = 'shirt'; bottomStyle = 'slacks'; shoeStyle = 'heels'; }
  return {
    topStyle, bottomStyle, shoeStyle,
    top: L.top || (fem ? '#ec6fb4' : '#3b5f9a'),
    inner: L.inner || '#f4f4f4',
    bottom: L.bottom || '#2f4f7f',
    shoes: L.shoes || '#f4f4f4',
    pattern: L.pattern || 'plain',
    bottomPattern: L.bottomPattern || (bottomStyle === 'jeans' ? 'denim' : 'plain'),
  };
}

export function defaultOutfitsFor(L) {
  const fem = (L && L.body) !== 'm';
  const ev = legacyToLayered(L || {});
  return {
    everyday: ev,
    formal: fem
      ? { topStyle: 'tank', bottomStyle: 'gown', shoeStyle: 'heels', top: '#8a1538', inner: '#f4f4f4', bottom: '#8a1538', shoes: '#1f1f24', pattern: 'plain', bottomPattern: 'plain' }
      : { topStyle: 'blazer', bottomStyle: 'slacks', shoeStyle: 'heels', top: '#1f232c', inner: '#ffffff', bottom: '#1f232c', shoes: '#1f1f24', pattern: 'plain', bottomPattern: 'plain' },
    sleepwear: fem
      ? { topStyle: 'tank', bottomStyle: 'shorts', shoeStyle: 'slippers', top: '#c9a6e8', inner: '#ffffff', bottom: '#f4d6e8', shoes: '#f4f4f4', pattern: 'dots', bottomPattern: 'plain' }
      : { topStyle: 'tee', bottomStyle: 'joggers', shoeStyle: 'slippers', top: '#8fd0f0', inner: '#ffffff', bottom: '#24324f', shoes: '#7a7f87', pattern: 'stripes', bottomPattern: 'plain' },
    athletic: fem
      ? { topStyle: 'tank', bottomStyle: 'joggers', shoeStyle: 'sneakers', top: '#e5534b', inner: '#ffffff', bottom: '#2b2f36', shoes: '#f4f4f4', pattern: 'plain', bottomPattern: 'plain' }
      : { topStyle: 'hoodie', bottomStyle: 'shorts', shoeStyle: 'sneakers', top: '#39a06a', inner: '#ffffff', bottom: '#1f1f24', shoes: '#f4f4f4', pattern: 'plain', bottomPattern: 'plain' },
  };
}

export function ensureOutfits(L) {
  if (!L) return L;
  if (!L.build) L.build = 'athletic';
  if (!L.browColor) L.browColor = L.hair || '#4f3320';
  if (!L.outfits) L.outfits = defaultOutfitsFor(L);
  const defs = defaultOutfitsFor(L);
  for (const [k] of OUTFIT_CATS) if (!L.outfits[k]) L.outfits[k] = defs[k];
  if (!L.activeOutfit || !L.outfits[L.activeOutfit]) L.activeOutfit = 'everyday';
  return L;
}

export function resolveOutfitLook(L, cat = null) {
  ensureOutfits(L);
  const k = cat || L.activeOutfit || 'everyday';
  const o = L.outfits[k] || L.outfits.everyday;
  return {
    ...L,
    gen: 2,
    activeOutfit: k,
    topStyle: o.topStyle,
    bottomStyle: o.bottomStyle,
    shoeStyle: o.shoeStyle,
    top: o.top,
    inner: o.inner || '#f4f4f4',
    bottom: o.bottom,
    shoes: o.shoes,
    pattern: o.pattern || 'plain',
    bottomPattern: o.bottomPattern || (o.bottomStyle === 'jeans' ? 'denim' : 'plain'),
    boots: o.shoeStyle === 'boots',
  };
}

export function randomOutfitForCat(cat, fem) {
  const p = a => a[Math.floor(Math.random() * a.length)];
  const col = () => p(CLOTH_SWATCHES);
  if (cat === 'formal') {
    return fem
      ? { topStyle: p(['tank', 'blazer']), bottomStyle: p(['gown', 'skirt']), shoeStyle: 'heels', top: p(DRESSES), inner: '#ffffff', bottom: p(DRESSES), shoes: p(['#1f1f24', '#c9a27a', '#8a2e3b']), pattern: 'plain', bottomPattern: 'plain' }
      : { topStyle: p(['blazer', 'shirt']), bottomStyle: 'slacks', shoeStyle: 'heels', top: p(JACKETS), inner: '#ffffff', bottom: p(['#1f1f24', '#24324f', '#3b4a6b']), shoes: '#1f1f24', pattern: 'plain', bottomPattern: 'plain' };
  }
  if (cat === 'sleepwear') {
    return { topStyle: p(['tee', 'tank', 'sweater']), bottomStyle: p(['shorts', 'joggers']), shoeStyle: 'slippers', top: p(['#c9a6e8', '#8fd0f0', '#ec6fb4', '#f4f4f4', '#a8d48a']), inner: '#ffffff', bottom: p(['#24324f', '#f4d6e8', '#8fd0f0', '#c9a6e8']), shoes: '#f4f4f4', pattern: p(['dots', 'stripes', 'plain']), bottomPattern: 'plain' };
  }
  if (cat === 'athletic') {
    return { topStyle: p(['tank', 'tee', 'hoodie']), bottomStyle: p(['joggers', 'shorts']), shoeStyle: 'sneakers', top: col(), inner: '#ffffff', bottom: p(['#1f1f24', '#2b2f36', '#2f4f7f', '#7a7f87']), shoes: '#f4f4f4', pattern: 'plain', bottomPattern: 'plain' };
  }
  const ts = p(TOP_STYLES)[0], bs = p(fem ? ['jeans', 'skirt', 'shorts', 'slacks', 'joggers'] : ['jeans', 'shorts', 'slacks', 'joggers']);
  return { topStyle: ts, bottomStyle: bs, shoeStyle: p(SHOE_STYLES)[0], top: col(), inner: '#f4f4f4', bottom: bs === 'jeans' ? p(['#2f4f7f', '#3b5f9a', '#24324f']) : col(), shoes: p(SHOES), pattern: p(['plain', 'stripes', 'check', 'knit']), bottomPattern: bs === 'jeans' ? 'denim' : 'plain' };
}
