// Własna działalność: zlecenia indywidualne, Wielkie Odsłonięcie, portfolio i renoma (w stylu „The Sims: Kariera”).
// Same dane i czysta logika; okna obsługuje gra.

// ---------- elementy oferty (gracz wybiera po jednym z każdej kategorii) ----------
export const PARTS = {
  styl: { name: 'Styl komunikacji', icon: '🗣️', opts: {
    formalny: ['🎩', 'Formalny i ekspercki'], przyjazny: ['😊', 'Ciepły i przyjacielski'], odwazny: ['🔥', 'Odważny i kontrowersyjny'] } },
  gwar: { name: 'Gwarancja efektu', icon: '🛡️', opts: {
    brak: ['🎲', 'Bez gwarancji – czysta wizja'], zwrot: ['💸', 'Zwrot pieniędzy, jeśli nie zadziała'], kpi: ['📊', 'Twarde dane i wskaźniki (KPI)'] } },
  cena: { name: 'Cena', icon: '💰', opts: {
    okazja: ['🏷️', 'Okazyjna (−20%)'], rynek: ['⚖️', 'Rynkowa'], premium: ['💎', 'Premium (+40%)'] } },
};
export const PRICE_MULT = { okazja: 0.8, rynek: 1, premium: 1.4 };

// ---------- cechy klientów: wskazówka, oceny elementów (−2..+2) i komentarze ----------
// q: wymagana jakość (perfekcjonista) – poniżej kara
export const TRAITS = {
  perfekcjonista: { name: 'Perfekcjonista', icon: '🔍', hint: 'Odsyła agencjom oferty, gdy przecinek stoi krzywo. Liczy się jakość dopracowania.', q: 90,
    s: { formalny: 1, odwazny: -1, kpi: 1, brak: -1 },
    c: { formalny: 'Ekspercko, rzeczowo, bez emotikonek. Tak powinno być.', odwazny: 'Kontrowersyjnie? Ja tu przyszłam/przyszedłem po porządek, nie po cyrk.', kpi: 'Wskaźniki rozpisane co do przecinka. Pięknie. Naprawdę pięknie.', brak: 'Bez gwarancji? Czyli nikt nie wie, co wyjdzie? To mnie przeraża.' } },
  nieufny: { name: 'Nieufny', icon: '🤨', hint: 'Trzy razy pyta, czy na pewno nie jesteś oszustem. Potrzebuje twardych argumentów.',
    s: { kpi: 2, zwrot: 1, brak: -2, przyjazny: -1, formalny: 1 },
    c: { kpi: 'Liczby. Tabele. Wykresy. Dobrze. Może nawet Pani/Panu zaufam.', zwrot: 'Zwrot pieniędzy na piśmie? No, to już brzmi uczciwie.', brak: '„Zaufaj mi”? Tak mówił ostatni, który ukradł mi rower.', przyjazny: 'Za miło. Podejrzanie miło. Czego Pani/Pan ode mnie chce?', formalny: 'Konkretnie i poważnie. Tak rozmawiają ludzie, którzy nie kłamią.' } },
  ekscentryk: { name: 'Ekscentryk', icon: '🦄', hint: 'Przychodzi na spotkania w pelerynie i z papugą. Nudne pomysły usypiają, odważne – zachwycają.',
    s: { odwazny: 2, formalny: -2, brak: 1, kpi: -1 },
    c: { odwazny: 'TAK! To szaleństwo! Moja papuga też jest zachwycona!', formalny: 'Zasypiam przy drugim slajdzie. Papuga też. Nuda, nuda, NUDA.', brak: 'Bez gwarancji! Jak skok w nieznane! Uwielbiam!', kpi: 'Tabelki? Ja przyszłam/przyszedłem po magię, nie po Excela.' } },
  sknera: { name: 'Oszczędny', icon: '🪙', hint: 'Negocjuje nawet cenę kawy w automacie. Każda złotówka boli fizycznie.',
    s: { okazja: 2, premium: -2, zwrot: 1 },
    c: { okazja: 'Taniej?! Ojej. Muszę usiąść. Z radości.', premium: 'Za tę cenę można by kupić… wszystko. Dwa razy.', zwrot: 'Zwrot pieniędzy, gdyby nie wyszło? To lubię. Moje pieniądze są bezpieczne.' } },
  snob: { name: 'Snob', icon: '🥂', hint: 'Pije wyłącznie wodę z lodowca i nosi 3 złote zegarki. Tanie znaczy podejrzane.',
    s: { premium: 2, okazja: -2, formalny: 1, przyjazny: -1 },
    c: { premium: 'Premium. Ekskluzywnie. Pachnie pieniędzmi. Uwielbiam.', okazja: 'Okazyjnie? Czy ja wyglądam na kogoś z promocji?!', formalny: 'Elegancko i z klasą. Jak w moim klubie golfowym.', przyjazny: 'Proszę nie mówić do mnie jak do sąsiada z grilla.' } },
  serdeczny: { name: 'Serdeczny', icon: '🤗', hint: 'Na powitanie przytula recepcjonistkę. Ceni ciepło i ludzkie podejście bardziej niż tabelki.',
    s: { przyjazny: 2, formalny: -1, kpi: -1 },
    c: { przyjazny: 'Czuję, że Pani/Pan naprawdę mnie słucha. Chyba się wzruszę… 🥹', formalny: 'To brzmi jak instrukcja obsługi pralki. Gdzie tu serce?', kpi: 'Same liczby… a gdzie ludzie? Gdzie emocje?' } },
  ryzykant: { name: 'Ryzykant', icon: '🎰', hint: 'W przerwach na lunch skacze na bungee. Gwarancje to nuda, liczy się wizja.',
    s: { brak: 2, odwazny: 1, zwrot: -1, kpi: -1 },
    c: { brak: 'Zero asekuracji! Lecimy na całość! Gdzie mam podpisać?!', odwazny: 'Ostro! Kontrowersyjnie! Tak się robi zamieszanie!', zwrot: 'Gwarancja zwrotu? To jak spadochron przy skoku z krzesła. Bez sensu.', kpi: 'Wskaźniki, wskaźniki… a gdzie dreszczyk emocji?' } },
};
export const NEUTRAL = ['Hm. Może być.', 'Rozumiem. Idźmy dalej.', 'Nie powiem nie… ani tak.', 'OK. Zapisałem.'];

// ---------- typy zleceń ----------
// lvl: od którego poziomu (0-indeks), budget: bazowy, hours: termin, work: ile sesji przy biurku zwykle trzeba
export const JOBS = [
  { id: 'wizytowka', name: 'Wizytówka i logo', icon: '🪪', lvl: 0, budget: 320, hours: 48 },
  { id: 'social', name: 'Kampania w mediach społecznościowych', icon: '📱', lvl: 0, budget: 450, hours: 48 },
  { id: 'rebranding', name: 'Rebranding lokalu', icon: '🎨', lvl: 1, budget: 850, hours: 72 },
  { id: 'audyt', name: 'Audyt kryzysowy', icon: '🚨', lvl: 1, budget: 1100, hours: 30 },
  { id: 'strategia', name: 'Strategia marki', icon: '🧭', lvl: 2, budget: 1700, hours: 72 },
  { id: 'kampania', name: 'Kampania wizerunkowa', icon: '📣', lvl: 2, budget: 2300, hours: 96 },
  { id: 'vip', name: 'Pakiet VIP „wszystko w jednym”', icon: '💎', lvl: 3, budget: 3600, hours: 96, vip: true },
  { id: 'gala', name: 'Kampania gali charytatywnej', icon: '🎗️', lvl: 3, budget: 3000, hours: 72 },
  { id: 'krajowa', name: 'Ogólnopolska kampania marki', icon: '🇵🇱', lvl: 4, budget: 6500, hours: 120, vip: true },
];
export const JOB = Object.fromEntries(JOBS.map(j => [j.id, j]));

// ---------- klienci ----------
export const NEIGHBOUR_CLIENTS = {
  hania: { biz: 'Rada Osiedla Słonecznej Uliczki', traits: ['perfekcjonista', 'nieufny', 'sknera'] },
  marek: { biz: 'Studio medytacji „Marek-Zen”', traits: ['ekscentryk', 'snob', 'ryzykant'] },
  zosia: { biz: 'Marka „Beata Luxury”', traits: ['snob', 'ekscentryk', 'perfekcjonista'] },
  kuba: { biz: 'Zespół „Kuba i Struny”', traits: ['serdeczny', 'sknera', 'ryzykant'] },
  natalia: { biz: 'Bistro Natalii', traits: ['serdeczny', 'perfekcjonista', 'nieufny'] },
  tomek: { biz: 'Warsztat Pana Henryka', traits: ['nieufny', 'sknera', 'perfekcjonista'] },
};
export const VIPS = [
  ['Prezes Wiśniewska', 'sieć hoteli „Złoty Klucz”', '👩‍💼'], ['Pan Zenon', 'hurtownia „Zenon-Pol”', '👨‍💼'], ['Maks Złoty', 'influencer, 2 mln obserwujących', '🕶️'],
  ['Hrabina von Pierożek', 'restauracja „Pierogi Królewskie”', '👑'], ['Startup „KotGPT”', 'sztuczna inteligencja dla kotów', '🐱'], ['Burmistrz Słonecznej Doliny', 'urząd gminy', '🎖️'],
  ['Doktor Ząbek', 'klinika stomatologiczna', '🦷'], ['Pani Grażyna', 'sieć kwiaciarni „Róża i Grażyna”', '💐'],
];

// ---------- oceny ----------
export const RATINGS = [
  { id: 0, name: 'Katastrofa', icon: '💥', pay: 0.3, tip: 0, ren: -12, col: '#e5534b' },
  { id: 1, name: 'Przeciętnie', icon: '😐', pay: 0.8, tip: 0, ren: -2, col: '#f2b134' },
  { id: 2, name: 'Sukces', icon: '🌟', pay: 1, tip: 0.1, ren: 6, col: '#39c07f' },
  { id: 3, name: 'Arcydzieło!', icon: '🏆', pay: 1.25, tip: 0.25, ren: 14, col: '#7b4bd6' },
];

// ---------- pomocnicze ----------
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
/** Nowe zlecenie. who – id sąsiada (opcjonalnie), lvl – poziom gracza, ren – renoma 0..100 */
export function makeGig(r, lvl, ren, who, names) {
  const pool = JOBS.filter(j => j.lvl <= lvl), job = pick(r, pool.slice(-4));
  let client, traits;
  if (who && NEIGHBOUR_CLIENTS[who]) { client = { name: names[who] || who, biz: NEIGHBOUR_CLIENTS[who].biz, e: '🏘️', npc: who }; traits = NEIGHBOUR_CLIENTS[who].traits.slice(); }
  else { const v = pick(r, VIPS); client = { name: v[0], biz: v[1], e: v[2] }; const k = Object.keys(TRAITS); traits = []; while (traits.length < 3) { const t = pick(r, k); if (!traits.includes(t)) traits.push(t); } }
  const budget = Math.round(job.budget * (0.85 + r() * 0.3) * (1 + ren / 200) / 10) * 10;
  return { id: 'g' + Math.floor(r() * 1e9).toString(36), job: job.id, client, traits, budget, hours: job.hours };
}
/** Punktacja odsłonięcia: kolejno reakcje na elementy + jakość. Zwraca { steps, score, rating } */
export function judge(gig) {
  const steps = [];
  for (const [part, opt] of Object.entries(gig.choice)) {
    let sc = 0; const fans = [], foes = [];
    for (const t of gig.traits) { const v = TRAITS[t].s[opt] || 0; sc += v; if (v > 0) fans.push(t); if (v < 0) foes.push(t); }
    const T = sc > 0 ? TRAITS[fans[0]] : sc < 0 ? TRAITS[foes[0]] : null;
    steps.push({ part, opt, sc, text: T ? T.c[opt] : NEUTRAL[(part.length + opt.length) % NEUTRAL.length], trait: T ? T.name : null });
  }
  const perf = gig.traits.includes('perfekcjonista'), q = gig.quality;
  const qs = perf ? (q >= 90 ? 2 : q >= 70 ? 0 : -3) : q >= 90 ? 1.5 : q >= 70 ? 0.5 : -1;
  steps.push({ part: 'jakosc', sc: qs, text: q >= 90 ? 'A wykonanie… perfekcyjne. Każdy szczegół na miejscu.' : q >= 70 ? 'Wykonanie solidne, choć widać pośpiech w paru miejscach.' : 'Szczerze? Wygląda, jakby robione było w przerwie na kawę.' });
  const score = steps.reduce((s, x) => s + x.sc, 0);
  const rating = score < -1 ? 0 : score < 2 ? 1 : score < 5 ? 2 : 3;
  return { steps, score, rating };
}

// ---------- rozgłos na osiedlu ----------
export const BUZZ = {
  flop: ['Słyszałaś/eś? Klient wyszedł z jej/jego biura z płaczem… 😬', 'Podobno ta prezentacja dla {c} to była katastrofa. Cała ulica gada!', 'Mówią, że „{p}” był tak zły, że klient zmienił branżę.', 'Ja tam nic nie mówię, ale ta wpadka z {c}… 🙊'],
  hit: ['Gratulacje! Wszyscy mówią o „{p}” – arcydzieło! 👏', 'Widziałam/em Twoją kampanię dla {c}. Jestem pod wrażeniem! ✨', 'Ty to masz głowę do biznesu! Cała ulica jest dumna 😊', 'Moja kuzynka chce Twój numer – po tym, co zrobiłaś/eś dla {c}!'],
  ask: ['Słuchaj, a zrobiłabyś/zrobiłbyś coś dla mnie? Płacę! 💼', 'Masz chwilę? Mam dla Ciebie zlecenie! 📋', 'Potrzebuję kogoś z głową do marketingu. Pomożesz? 🙏'],
  fame: ['O, to ta słynna osoba od marketingu! 😍', 'Mogę selfie? Moja mama Cię uwielbia! 🤳', 'Widziałam/em Cię w gazecie! 📰'],
};
