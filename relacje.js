// Relacje: dwa paski (Przyjaźń -100..100, Romans 0..100), cechy charakteru, statusy,
// interakcje w 3 kategoriach (+ wspólne w odwiedzinach), akceptacja/odmowa zależna od relacji, nastroju i cech.
// rel = { f, r, st: null|'para'|'narzeczeni'|'malzenstwo'|'ex'|'rozwod', met, last }

export const newRel = () => ({ f: 0, r: 0, st: null, met: false, last: -1 });

// ---------- cechy charakteru ----------
export const TRAITS = {
  romantyczny: { name: 'Romantyczny', f: 'Romantyczna', icon: '💘', desc: 'Kocha flirt i czułe gesty' },
  ambitny: { name: 'Ambitny', f: 'Ambitna', icon: '🚀', desc: 'Lubi rozmowy o pracy i sukcesach' },
  towarzyski: { name: 'Towarzyski', f: 'Towarzyska', icon: '🎉', desc: 'Uwielbia rozmowy i plotki' },
  zlosliwy: { name: 'Złośliwy', f: 'Złośliwa', icon: '😈', desc: 'Lubi docinki, nie znosi czułości' },
  rodzinny: { name: 'Rodzinny', f: 'Rodzinna', icon: '🏡', desc: 'Marzy o ślubie i stabilnym związku' },
  introwertyk: { name: 'Introwertyk', f: 'Introwertyczka', icon: '📚', desc: 'Woli spokojne, głębokie rozmowy' },
  inteligentny: { name: 'Inteligentny', f: 'Inteligentna', icon: '🧠', desc: 'Szybciej się uczy, lubi mądre rozmowy' },
  wspierajacy: { name: 'Wspierający', f: 'Wspierająca', icon: '🤗', desc: 'Zawsze pocieszy i pomoże' },
};
export const traitName = (t, fem) => (fem ? TRAITS[t].f : TRAITS[t].name);
export function randomTraits() { const k = Object.keys(TRAITS); const a = k[Math.floor(Math.random() * k.length)]; let b; do { b = k[Math.floor(Math.random() * k.length)]; } while (b === a); return [a, b]; }

// ---------- statusy ----------
export function friendLabel(f) {
  return f >= 80 ? 'Najlepszy przyjaciel' : f >= 50 ? 'Przyjaciel' : f >= 25 ? 'Dobry znajomy' : f >= 3 ? 'Znajomy'
    : f > -15 ? 'Nieznajomy' : f > -50 ? 'Nie przepada za Tobą' : 'Wróg';
}
export function romanceLabel(r) { return r >= 90 ? 'Prawdziwa miłość' : r >= 60 ? 'Zakochanie' : r >= 25 ? 'Zauroczenie' : r > 0 ? 'Iskierka' : ''; }
export const STATUS = { para: '💑 Para', narzeczeni: '💍 Narzeczeństwo', malzenstwo: '💒 Małżeństwo', ex: '💔 Byli partnerzy', rozwod: '💔 Po rozwodzie' };
export const LOVE = ['para', 'narzeczeni', 'malzenstwo'];
const inLove = rel => LOVE.includes(rel.st);
/** Główny status: związek > wróg > zauroczenie > przyjaźń */
export function statusLabel(rel) {
  if (!rel || !rel.met) return 'Nieznajomy';
  if (inLove(rel)) return STATUS[rel.st];
  if (rel.f <= -50) return '⚔️ Wróg';
  if (rel.r >= 25) return '💘 Zauroczenie';
  return friendLabel(rel.f);
}

// ---------- zgodność cech ----------
function traitBonus(a, c) {
  const nt = c.n.traits || [], my = c.my || [], has = t => nt.includes(t); let b = 0;
  b += nt.filter(t => my.includes(t)).length * 0.06;
  if (a.cat === 'romance') { if (has('romantyczny')) b += 0.12; if (has('zlosliwy')) b -= 0.08; if (has('introwertyk') && ['kiss', 'hands', 'flirt'].includes(a.id)) b -= 0.06; }
  if (a.cat === 'friend') { if (has('towarzyski')) b += 0.1; if (has('introwertyk') && ['joke', 'gossip', 'chat'].includes(a.id)) b -= 0.07; if (has('introwertyk') && a.id === 'deep') b += 0.12; }
  if (a.id === 'work' && has('ambitny')) b += 0.15;
  if (has('wspierajacy') && a.cat !== 'conflict') b += 0.07;
  if (has('inteligentny') && ['deep', 'work'].includes(a.id)) b += 0.1;
  if (['propose', 'askout', 'wedding'].includes(a.id) && has('rodzinny')) b += 0.15;
  if (a.id === 'joke' && has('zlosliwy')) b += 0.1;
  return b;
}
export function compatibility(n, my) {
  const nt = n.traits || []; let s = nt.filter(t => my.includes(t)).length * 2;
  if (nt.includes('zlosliwy') && my.includes('romantyczny')) s--; if (nt.includes('towarzyski') && my.includes('introwertyk')) s--;
  return s >= 2 ? '💚 Świetnie się dogadacie' : s >= 1 ? '🙂 Pasujecie do siebie' : s < 0 ? '⚡ Trudne połączenie charakterów' : '😐 Przeciętna zgodność';
}

// c: { n, rel, mood (gracza), npcMood, visiting, myPartner, skillLvl, my (cechy gracza), hasBed }
const base = c => (c.mood - 50) / 400 + (c.npcMood - 55) / 220 + c.rel.f / 300;
const L = (...a) => a;
export const ACTS = [
  // ---- PRZYJAZNE ----
  { id: 'hello', cat: 'friend', icon: '👋', label: 'Przywitaj się', max: 6, ok: { f: 3 }, say: L('Cześć! Miło Cię widzieć!', 'Hej, sąsiedzie!'), yes: L('Cześć! 😊', 'O, witaj!'), react: '😊' },
  { id: 'chat', cat: 'friend', icon: '💬', label: 'Porozmawiaj o dniu', max: 30, rate: 1.6, ok: { f: 5 }, chance: c => 0.85 + base(c), fail: { f: -2 },
    say: L('Jak minął Ci dzień?', 'Co słychać u Ciebie?', 'Widziałaś/eś dziś ten zachód słońca?'), yes: L('Wiesz co, całkiem dobrze! 😊', 'Opowiem Ci, co mi się dziś przydarzyło…', 'Pięknie było! 🌅'), no: L('Nie mam dziś ochoty gadać.', 'Mhm. Spieszę się.') },
  { id: 'topic', cat: 'friend', icon: '🎯', label: c => `Pogadaj o: ${c.n.interest[0]}`, max: 30, rate: 1.8, ok: { f: 8 }, chance: c => 0.9 + base(c), fail: { f: -1 }, topic: true,
    say: L('Opowiedz mi o swojej pasji!'), yes: L('To mój ulubiony temat! 😍', 'Mogłabym/mógłbym o tym mówić godzinami!'), no: L('Hmm… nie dziś.') },
  { id: 'joke', cat: 'friend', icon: '😂', label: 'Opowiedz żart', max: 15, rate: 1.2, fx: { fun: 0.8 }, ok: { f: 6 }, chance: c => 0.5 + base(c) + (c.rel.f > 20 ? 0.1 : -0.1), fail: { f: -4 }, embarrass: true,
    say: L('Wiesz, czemu kot siedzi przy komputerze? Pilnuje myszki! 😄', 'Puk puk! – Kto tam? – Sąsiad z cukrem! 😂'), yes: L('Hahaha! Dobre! 🤣', 'Ojej, nie mogę! 😂'), no: L('…To miało być śmieszne?', 'Suchar. 😐') },
  { id: 'praise', cat: 'friend', icon: '🌸', label: 'Pochwal wygląd albo dom', max: 10, ok: { f: 5, r: 1 }, chance: c => 0.75 + base(c), fail: { f: -2 },
    say: L('Masz przepiękny ogród!', 'Świetnie dziś wyglądasz!', 'Ale masz gust – ten dom to cudo!'), yes: L('Och, dziękuję! ☺️', 'Miło, że zauważyłaś/eś!'), no: L('Eee… dzięki? 😅') },
  { id: 'gossip', cat: 'friend', icon: '🤫', label: 'Poplotkuj o sąsiadach', max: 30, rate: 2, fx: { fun: 0.4 }, need: { f: 20 }, ok: { f: 6 }, chance: c => 0.8 + base(c), fail: { f: -4 },
    say: L('Słyszałaś/eś, co się dzieje u Beaty i Kuby?', 'Nie uwierzysz, co widziałam/em wczoraj w nocy…'), yes: L('Nie mów! Opowiadaj! 🤭', 'Wiedziałam/em, że coś jest na rzeczy!'), no: L('Nie lubię plotek. 😒') },
  { id: 'deep', cat: 'friend', icon: '🫶', label: 'Zwierzenia', max: 40, rate: 2, need: { f: 40 }, ok: { f: 10 }, chance: c => 0.85 + base(c), fail: { f: -3 },
    say: L('Mogę Ci coś powiedzieć? Ostatnio jest mi trochę ciężko…'), yes: L('Zawsze możesz na mnie liczyć. 🤗', 'Dziękuję, że mi ufasz.'), no: L('To trochę za dużo informacji… 😬') },
  { id: 'work', cat: 'friend', icon: '💼', label: 'Pogadaj o pracy', max: 30, rate: 1, ok: { f: 4 }, perf: true, chance: c => 0.85 + base(c), fail: { f: -1 },
    say: L('Mam w pracy nowy projekt!'), yes: L('Mam dla Ciebie radę na awans! 💡'), no: L('Znowu o pracy? 🥱'), react: '🤓' },
  { id: 'hug', cat: 'friend', icon: '🤗', label: 'Przytul', max: 8, need: { f: 45 }, ok: { f: 6, r: 2 }, chance: c => 0.55 + base(c), fail: { f: -5 }, embarrass: true,
    say: L('Chodź tu! 🤗'), yes: L('🤗💛'), no: L('Ej, bez przesady… 😳') },
  { id: 'gift', cat: 'friend', icon: '🎁', label: 'Daj prezent', sub: '50 zł', cost: 50, max: 10, ok: { f: 10, r: 2 }, say: L('Mam coś dla Ciebie! 🎁'), yes: L('Prezent? Dla mnie? 🥹'), react: '🥰' },
  // ---- ROMANTYCZNE ----
  { id: 'flirt', cat: 'romance', icon: '😉', label: 'Flirtuj', max: 12, need: { f: 10 }, ok: { r: 8, f: 2 }, chance: c => 0.32 + base(c) + c.rel.r / 180 - (c.n.partner ? 0.3 : 0), fail: { r: -4, f: -4 }, romantic: true, embarrass: true,
    say: L('Czy ktoś Ci mówił, że masz piękny uśmiech? 😉', 'Gdybyś była/był gwiazdą, byłabyś/byłbyś najjaśniejszą…'), yes: L('Oj, przestań… 😊', 'Ty to umiesz zawrócić w głowie 😍'), no: L('Niezręcznie… 😬', 'Nie jestem zainteresowana/y.') },
  { id: 'romcomp', cat: 'romance', icon: '🌹', label: 'Daj komplement', max: 8, ok: { r: 5, f: 2 }, chance: c => 0.6 + base(c) + c.rel.r / 200, fail: { r: -2 }, romantic: true, embarrass: true,
    say: L('Przy Tobie zapominam o całym świecie.', 'Twoje oczy są jak gwiazdy.'), yes: L('Ojej… 🥰', 'Rumienię się! ☺️'), no: L('Hm… dziękuję. Chyba. 😶') },
  { id: 'hands', cat: 'romance', icon: '🤝', label: 'Trzymaj za rękę', max: 10, need: { r: 20 }, ok: { r: 6 }, chance: c => 0.6 + base(c) + c.rel.r / 200, fail: { r: -4 }, romantic: true, embarrass: true,
    say: L('Mogę? 🤝'), yes: L('💞'), no: L('Może nie teraz… 😳') },
  { id: 'kiss', cat: 'romance', icon: '💋', label: 'Pocałuj', max: 6, need: { r: 31 }, ok: { r: 10 }, chance: c => 0.35 + base(c) + c.rel.r / 170, fail: { r: -8, f: -5 }, romantic: true, embarrass: true,
    say: L('💋'), yes: L('😍💋', 'Mmm… jeszcze 💕'), no: L('Ej! Za szybko! 😳', 'Co Ty robisz?!') },
  { id: 'confess', cat: 'romance', icon: '💗', label: 'Wyznaj miłość', max: 10, need: { r: 51 }, ok: { r: 12, f: 4 }, chance: c => 0.45 + base(c) + (c.rel.r - 50) / 120, fail: { r: -10 }, romantic: true, embarrass: true,
    say: L('Muszę Ci coś powiedzieć… Kocham Cię. 💗'), yes: L('Ja Ciebie też! 😭💗', 'Czekałam/em na te słowa…'), no: L('Ja… nie czuję tego samego. Przepraszam. 😔') },
  { id: 'askout', cat: 'romance', icon: '💑', label: 'Zaproponuj związek', max: 10, need: { r: 61, f: 30 }, notSt: true, ok: { r: 10, st: 'para' }, chance: c => 0.5 + base(c) + (c.rel.r - 60) / 60 - (c.n.partner ? 0.35 : 0), fail: { r: -10 }, romantic: true, embarrass: true,
    say: L('Może… spróbujemy być razem? 💑'), yes: L('Tak! Jesteśmy parą! 💑', 'Myślałam/em, że nigdy nie zapytasz! 💕'), no: L('Chyba jeszcze nie… 😔') },
  { id: 'barabara', cat: 'romance', icon: '💞', label: 'Bara-bara w łóżku', max: 8, need: { r: 66 }, needBed: true, ok: { r: 4 }, chance: c => 0.5 + base(c) + (c.rel.r - 65) / 80 + (inLove(c.rel) ? 0.25 : -0.15), fail: { r: -6 }, romantic: true, embarrass: true, bara: true,
    say: L('Może… pójdziemy do mnie? 😏'), yes: L('Prowadź… 😍', 'Myślałam/em, że już nie zapytasz 😘'), no: L('Nie tak szybko! 😳') },
  { id: 'date', cat: 'romance', icon: '🥂', label: 'Romantyczna randka', sub: '100 zł', cost: 100, max: 90, rate: 1.5, fx: { fun: 1 }, needSt: ['para', 'narzeczeni', 'malzenstwo'], ok: { r: 12, f: 6 }, romantic: true, say: L('Zabieram Cię na kolację przy świecach! 🥂'), yes: L('Najpiękniejszy wieczór! 🌹'), react: '😍' },
  { id: 'propose', cat: 'romance', icon: '💍', label: 'Oświadcz się', max: 12, needSt: ['para'], need: { r: 81, f: 50 }, ok: { r: 10, st: 'narzeczeni' }, chance: c => 0.55 + base(c) + (c.rel.r - 80) / 50, fail: { r: -15 }, romantic: true, embarrass: true, kneel: true,
    say: L('Czy zostaniesz ze mną na zawsze? 💍'), yes: L('TAK! TAK! TAK! 💍😭'), no: L('Jeszcze nie jestem gotowa/y… 😟') },
  { id: 'wedding', cat: 'romance', icon: '💒', label: 'Weź ślub', sub: '1500 zł', cost: 1500, max: 60, rate: 2, fx: { fun: 1.5 }, needSt: ['narzeczeni'], ok: { r: 15, f: 10, st: 'malzenstwo' }, romantic: true, wedding: true, say: L('Ślubuję Ci miłość… 💒'), yes: L('Na zawsze razem! 💒🎉'), react: '🥰' },
  // ---- KONFLIKTOWE / ZŁOŚLIWE ----
  { id: 'criticize', cat: 'conflict', icon: '👎', label: 'Skrytykuj', max: 8, ok: { f: -8 }, mean: true, say: L('Ten Twój płot to jakaś porażka.', 'Serio w tym wyszłaś/wyszedłeś z domu?'), yes: L('Słucham?! 😠', 'Nikt Cię nie pytał! 😤'), react: '😠' },
  { id: 'argue', cat: 'conflict', icon: '🌩️', label: 'Kłóć się', max: 15, fx: { fun: 0.3 }, ok: { f: -14, r: -6 }, mean: true, storm: true, say: L('Mam dość Twojego zachowania!', 'Zawsze musisz mieć ostatnie słowo!'), yes: L('A Ty myślisz, że jesteś idealna/y?! 💢', 'Wynoś się z mojego trawnika! 💢'), react: '💢' },
  { id: 'mock', cat: 'conflict', icon: '🤡', label: 'Wyśmiej', max: 8, fx: { fun: 1.2 }, ok: { f: -12 }, mean: true, say: L('Hahaha, widziałaś/eś się w lustrze? 🤡'), yes: L('Jak możesz?! 😢', 'To było podłe. 😠'), react: '😢' },
  { id: 'breakup', cat: 'conflict', icon: '💔', label: c => c.rel.st === 'malzenstwo' ? 'Rozwiedź się' : 'Zerwij', max: 10, needSt: ['para', 'narzeczeni', 'malzenstwo'], ok: { r: -60, f: -30, st: 'ex' }, mean: true, storm: true, breakup: true, say: L('Musimy się rozstać…'), yes: L('Jak mogłaś/mogłeś?! 😭💔'), react: '😭' },
  // ---- RAZEM (tylko w odwiedzinach) ----
  { id: 'coffee', cat: 'together', icon: '☕', label: 'Wypijcie razem kawę', max: 45, rate: 1.5, fx: { energy: 0.3 }, visit: true, inside: true, ok: { f: 7 }, say: L('Kawa? ☕'), yes: L('Najlepsza kawa na osiedlu! ☕'), react: '😊' },
  { id: 'dinner', cat: 'together', icon: '🍲', label: 'Zjedzcie obiad', max: 60, rate: 1.2, fx: { hunger: 1.3 }, visit: true, inside: true, ok: { f: 8, r: 1 }, say: L('Pachnie obłędnie!'), yes: L('Musisz dać mi przepis! 😋'), react: '😋' },
  { id: 'movie', cat: 'together', icon: '🎬', label: 'Obejrzyjcie film', max: 90, rate: 1, fx: { fun: 1.2 }, visit: true, inside: true, ok: { f: 7, r: 2 }, say: L('Co oglądamy?'), yes: L('Ale się wzruszyłam/em… 🥲'), react: '🍿' },
  { id: 'garden', cat: 'together', icon: '🌷', label: 'Pomóż w ogródku', max: 45, rate: 1.2, fx: { fun: 0.4, hygiene: -0.3 }, visit: true, anim: 'arms', ok: { f: 8 }, say: L('Gdzie posadzić te tulipany?'), yes: L('Dziękuję za pomoc! 🌷'), react: '🥰' },
];
export const CATS = [['friend', '😊 Przyjazne'], ['romance', '💕 Romantyczne'], ['conflict', '😈 Konfliktowe'], ['together', '🏠 Razem']];
export const actLabel = (a, c) => typeof a.label === 'function' ? a.label(c) : a.label;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/** Czy można: true albo powód blokady. */
export function canDo(a, c) {
  const { rel } = c;
  if (a.visit && !c.visiting && !c.resident) return 'Tylko w odwiedzinach albo z domownikiem';
  if (a.needSt && !a.needSt.includes(rel.st)) return a.id === 'wedding' ? 'Najpierw zaręczyny' : a.id === 'propose' ? 'Najpierw bądźcie parą' : 'Tylko dla par';
  if (a.notSt && inLove(rel)) return 'Już jesteście razem';
  if (a.romantic && c.n.age === 'senior') return 'To tylko przyjaźń 🙂';
  if (a.needBed && !c.hasBed) return 'Potrzebne podwójne łóżko w domu';
  if (a.bara && c.visiting && !c.resident) return 'Tylko u Ciebie w domu';
  if (a.need && a.need.f && rel.f < a.need.f) return `Przyjaźń ${a.need.f}+`;
  if (a.need && a.need.r && rel.r < a.need.r) return `Romans ${a.need.r - 1}+`;
  return true;
}

/** Wynik interakcji: { ok, d, msg, say, react, embarrass, mean, storm, chance } */
export function outcome(a, c) {
  const p = Math.max(0.05, Math.min(0.97, (a.chance ? a.chance(c) + traitBonus(a, c) : 1) - (a.romantic && (c.rel.st === 'ex' || c.rel.st === 'rozwod') ? 0.3 : 0)));
  const ok = Math.random() < p;
  const d = { ...(ok ? a.ok : (a.fail || {})) };
  let bonus = '';
  if (ok && a.topic && c.n.interest[1] && c.skillLvl(c.n.interest[1]) >= 2) { d.f = (d.f || 0) + 5; bonus = ' Macie wspólny temat!'; }
  if (a.breakup && c.rel.st === 'malzenstwo') d.st = 'rozwod';
  return { ok, d, msg: (ok ? pick(a.yes || ['😊']) : pick(a.no || ['😬'])) + bonus, say: pick(a.say || ['…']), react: ok ? (a.react || (a.romantic ? '😍' : '😊')) : '😬', embarrass: !ok && !!a.embarrass, mean: !!a.mean, storm: !!a.storm, chance: Math.round(p * 100) };
}
/** Szansa w procentach (do pokazania w menu). */
export function chanceOf(a, c) { if (!a.chance) return 100; return Math.round(Math.max(0.05, Math.min(0.97, a.chance(c) + traitBonus(a, c))) * 100); }
