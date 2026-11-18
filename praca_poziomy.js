// Kariera zależna od poziomu: zadania przy stanowiskach, prośby postaci i dylematy
// przypisane do konkretnego etapu kariery (a nie te same od 1. do ostatniego poziomu).
//
// Etapy (band): 0 – początek, 1 – rozwój, 2 – ekspert / szczyt.
//  • zawody z rozgałęzieniem (8 poziomów): 1–2 → etap 0, 3–5 → etap 1, 6–8 (specjalizacja) → etap 2
//  • behawiorysta i własna działalność (5 poziomów): 1 → etap 0, 2–3 → etap 1, 4–5 → etap 2

export const band = (c, lvl) => c.branches ? (lvl < 2 ? 0 : lvl < 5 ? 1 : 2) : (lvl < 1 ? 0 : lvl < 3 ? 1 : 2);
export const BAND_NAMES = ['Początek kariery', 'Rozwój', 'Ekspert'];

// ---------- ZADANIA PRZY STANOWISKACH ----------
// T(stanowisko, ikona, nazwa, poziomy [od, do] (0-indeks), dodatki)
// dodatki: dur (min gry), anim, duty (% obowiązków), perf (% postępu), sit (siedzi), br (specjalizacja),
// po zakończeniu: money, rate, demand, burnout, lessons (lekcje kursu → pasywny dochód)
const T = (st, i, l, lv, o = {}) => ({ st, icon: i, label: l, lv: Array.isArray(lv) ? lv : [lv, lv], dur: 30, anim: 'arms', duty: 14, perf: 2.5, ...o });
const COFFEE = [
  T('coffee', '☕', 'Wypij kawę', [0, 7], { dur: 15, duty: 0, perf: 0, energy: 1.6, fun: 0.3 }),
  T('coffee', '💬', 'Pogadaj z zespołem przy kawie', [0, 7], { dur: 20, duty: 4, perf: 1, anim: 'talk', social: 0.6 }),
];
const TY = { anim: 'type' }, TK = { anim: 'talk' }, PH = { anim: 'phone' }, PT = { anim: 'paint' }, CH = { anim: 'cheer' };

export const TASKS = {
  cook: [
    T('sink', '🧽', 'Zmywaj naczynia', 0, { hygiene: -0.1 }), T('sink', '🫧', 'Wyszoruj garnki i blaty', 0), T('pass', '🍽️', 'Wynoś czyste talerze na wydawkę', 0, { dur: 20, duty: 10 }),
    T('stove', '🥕', 'Obieraj i krój warzywa', 1), T('stove', '🥣', 'Gotuj sosy według przepisu', 1), T('sink', '🧹', 'Utrzymuj porządek na stanowisku', 1, { dur: 20, duty: 10 }),
    T('stove', '🍳', 'Gotuj dania z karty', 2, { dur: 40, duty: 16, energy: -0.12 }), T('pass', '🍽️', 'Wydawaj gorące dania', 2), T('stove', '🥩', 'Smaż steki na zamówienie', 2),
    T('pass', '👀', 'Kontroluj jakość każdego talerza', 3), T('stove', '📋', 'Prowadź zmianę i rozdzielaj zadania', 3, TK), T('stove', '🗒️', 'Ułóż menu dnia', 3, TY),
    T('stove', '🌿', 'Stwórz nowe danie sezonowe', 4, { dur: 40, duty: 16, perf: 3.5 }), T('pass', '📣', 'Koordynuj wydawanie (ekspedycja)', 4, TK), T('stove', '👨‍🍳', 'Szkol młodszych kucharzy', 4, TK),
    T('pass', '🥂', 'Przyjmij gości VIP przy stole szefa', [5, 7], { br: 0, ...TK }), T('stove', '🍷', 'Przygotuj menu degustacyjne 7 dań', [5, 7], { br: 0, dur: 45, duty: 18, perf: 4 }), T('pass', '🚚', 'Negocjuj z dostawcami', [5, 7], { br: 0, ...PH }),
    T('stove', '🎬', 'Nagraj odcinek programu kulinarnego', [5, 7], { br: 1, dur: 45, duty: 18, perf: 4, ...TK }), T('pass', '🎤', 'Próba przed kamerą', [5, 7], { br: 1, ...TK }), T('stove', '📺', 'Pokaz gotowania na żywo', [5, 7], { br: 1, ...CH }),
    ...COFFEE],
  med: [
    T('meds', '🧴', 'Dezynfekuj sprzęt i łóżka', 0), T('bed', '🛏️', 'Przewoź pacjentów na wózku', 0, { energy: -0.1 }), T('reception', '📁', 'Roznoś dokumenty między gabinetami', 0, { dur: 20, duty: 10 }),
    T('reception', '🗂️', 'Przeprowadzaj wywiad z pacjentem', 1, TK), T('bed', '🌡️', 'Mierz ciśnienie i temperaturę', 1), T('meds', '💊', 'Ucz się dawkowania leków', 1, TY),
    T('bed', '🚑', 'Udzielaj pierwszej pomocy', 2, { energy: -0.12 }), T('meds', '🎒', 'Przygotuj torbę ratunkową', 2, { dur: 20, duty: 10 }), T('reception', '📞', 'Przyjmuj zgłoszenia alarmowe', 2, PH),
    T('bed', '🩺', 'Badaj pacjentów pod okiem lekarza', 3, { dur: 40, duty: 16 }), T('reception', '📝', 'Wypisuj skierowania i recepty', 3, TY), T('meds', '💊', 'Ustal leczenie i dawki', 3),
    T('bed', '🩺', 'Diagnozuj i lecz samodzielnie', 4, { dur: 40, duty: 16, perf: 3.5 }), T('reception', '💬', 'Konsultacje z rodzinami pacjentów', 4, TK), T('meds', '👩‍⚕️', 'Nadzoruj stażystów', 4, TK),
    T('bed', '🔪', 'Przeprowadź operację', [5, 7], { br: 0, dur: 50, duty: 20, perf: 4, energy: -0.15 }), T('meds', '🧤', 'Przygotuj blok operacyjny', [5, 7], { br: 0 }), T('reception', '📋', 'Obchód i omówienie przypadków', [5, 7], { br: 0, ...TK }),
    T('meds', '🔬', 'Analizuj próbki w laboratorium', [5, 7], { br: 1, dur: 40, duty: 16, perf: 4 }), T('reception', '📄', 'Pisz publikację naukową', [5, 7], { br: 1, ...TY }), T('bed', '🧪', 'Prowadź badanie kliniczne', [5, 7], { br: 1 }),
    ...COFFEE],
  it: [
    T('mydesk', '🐞', 'Testuj aplikację i zgłaszaj błędy', 0, TY), T('board', '📝', 'Spisz scenariusze testów', 0), T('server', '🤖', 'Uruchom testy automatyczne', 0, { dur: 20, duty: 10 }),
    T('mydesk', '🔧', 'Poprawiaj proste błędy', 1, TY), T('board', '🗣️', 'Odbierz zadania na stand-upie', 1, { dur: 15, duty: 8, ...TK }), T('server', '🚀', 'Wdrażaj na serwer testowy', 1),
    T('mydesk', '⌨️', 'Programuj nowe funkcje', 2, { dur: 45, duty: 16, ...TY }), T('server', '🖥️', 'Monitoruj serwery', 2), T('board', '👀', 'Code review kolegów', 2),
    T('board', '🏗️', 'Projektuj architekturę systemu', 3, { perf: 3.5 }), T('mydesk', '⚡', 'Optymalizuj wydajność', 3, TY), T('server', '🔥', 'Gaś awarie na produkcji', 3, { energy: -0.12 }),
    T('board', '📊', 'Planuj sprint zespołu', 4), T('mydesk', '💬', 'Rozmowy 1:1 z programistami', 4, TK), T('server', '✅', 'Zatwierdzaj wdrożenia', 4, { dur: 20, duty: 10 }),
    T('mydesk', '🎮', 'Programuj mechanikę gry', [5, 7], { br: 0, dur: 45, duty: 18, ...TY }), T('board', '🗺️', 'Projektuj poziomy i fabułę', [5, 7], { br: 0 }), T('server', '🕹️', 'Testy gry z graczami', [5, 7], { br: 0, fun: 0.4 }),
    T('board', '💼', 'Pitch dla inwestorów', [5, 7], { br: 1, ...TK }), T('mydesk', '🚀', 'Buduj prototyp produktu', [5, 7], { br: 1, dur: 45, duty: 18, ...TY }), T('server', '☁️', 'Skaluj infrastrukturę', [5, 7], { br: 1 }),
    ...COFFEE],
  art: [
    T('paints', '🧽', 'Myj pędzle i porządkuj farby', 0), T('wall', '🖼️', 'Odkurzaj ramy i witaj gości', 0, TK), T('paints', '🪵', 'Naciągaj płótna na krosna', 0),
    T('easel', '✏️', 'Rysuj ilustracje na zamówienie', 1, PT), T('paints', '📝', 'Przygotuj szkice koncepcyjne', 1), T('wall', '🔨', 'Wieszaj prace na wystawie', 1),
    T('easel', '🖌️', 'Maluj obraz olejny', 2, { dur: 45, duty: 16, ...PT }), T('paints', '🎨', 'Mieszaj własne kolory', 2), T('wall', '💬', 'Rozmawiaj z kupcami', 2, TK),
    T('easel', '🖼️', 'Maluj cykl obrazów', 3, { dur: 45, duty: 16, ...PT }), T('wall', '🎙️', 'Wywiad dla magazynu o sztuce', 3, TK), T('paints', '👧', 'Prowadź warsztaty dla dzieci', 3, { fun: 0.3, ...TK }),
    T('wall', '🏛️', 'Zaprojektuj własną wystawę', 4, { perf: 3.5 }), T('easel', '🌟', 'Maluj obraz główny wystawy', 4, { dur: 45, duty: 18, ...PT }), T('paints', '📚', 'Wybierz prace do katalogu', 4),
    T('easel', '👑', 'Maluj arcydzieło', [5, 7], { br: 0, dur: 50, duty: 20, perf: 4, ...PT }), T('wall', '🏛️', 'Kuratoruj wystawę innych artystów', [5, 7], { br: 0 }), T('paints', '💎', 'Wyceniaj dzieła na aukcję', [5, 7], { br: 0 }),
    T('easel', '✏️', 'Projektuj logo dla marki', [5, 7], { br: 1, ...PT }), T('wall', '📽️', 'Prezentuj projekt klientowi', [5, 7], { br: 1, ...TK }), T('paints', '🎨', 'Twórz paletę kolorów kampanii', [5, 7], { br: 1 }),
    ...COFFEE],
  police: [
    T('reports', '📖', 'Ucz się przepisów', 0, TY), T('radio', '📻', 'Nasłuchuj komunikatów', 0, PH), T('cell', '🔐', 'Pilnuj aresztu', 0, { dur: 20, duty: 10 }),
    T('reports', '📝', 'Spisuj zgłoszenia obywateli', 1, TY), T('radio', '📻', 'Zgłaszaj się z patrolu', 1, PH), T('cell', '🚔', 'Doprowadzaj zatrzymanych', 1),
    T('radio', '📡', 'Kieruj patrolami', 2, PH), T('cell', '🗣️', 'Przesłuchuj świadków', 2, TK), T('reports', '✅', 'Sprawdzaj raporty podwładnych', 2, TY),
    T('reports', '🔎', 'Prowadź dochodzenie', 3, { dur: 40, duty: 16, ...TY }), T('cell', '🔐', 'Przesłuchuj podejrzanych', 3, TK), T('radio', '📻', 'Koordynuj akcję', 3, PH),
    T('reports', '🏢', 'Zarządzaj komisariatem', 4, TY), T('radio', '📋', 'Odprawa z funkcjonariuszami', 4, TK), T('cell', '⚖️', 'Nadzoruj zatrzymania', 4),
    T('reports', '🧩', 'Analizuj dowody i poszlaki', [5, 7], { br: 0, dur: 40, duty: 18, ...TY }), T('cell', '🕵️', 'Konfrontacja z podejrzanym', [5, 7], { br: 0, ...TK }), T('radio', '👁️', 'Prowadź obserwację', [5, 7], { br: 0, ...PH }),
    T('cell', '🛡️', 'Trening szturmowy', [5, 7], { br: 1, energy: -0.2 }), T('radio', '🗺️', 'Planuj akcję antyterrorystyczną', [5, 7], { br: 1, ...PH }), T('reports', '🎯', 'Szkol oddział', [5, 7], { br: 1, ...TK }),
    ...COFFEE],
  music: [
    T('mixer', '📄', 'Roznoś ulotki o koncercie', 0, { energy: -0.08 }), T('stage', '🔌', 'Rozstawiaj sprzęt na scenie', 0), T('drums', '🎼', 'Nastrój instrumenty zespołu', 0, { dur: 20, duty: 10 }),
    T('stage', '🎸', 'Graj covery przed koncertem', 1, { fun: 0.4, ...CH }), T('drums', '🎵', 'Ćwicz akordy i skale', 1), T('mixer', '💿', 'Zbieraj datki i sprzedawaj płyty', 1, TK),
    T('mixer', '🎙️', 'Nagrywaj partie w studiu', 2), T('drums', '🎼', 'Graj z nut na sesji', 2), T('stage', '🎤', 'Zagraj support przed gwiazdą', 2, CH),
    T('drums', '🥁', 'Próba z zespołem', 3, { social: 0.3 }), T('stage', '🎤', 'Koncert zespołu', 3, { dur: 45, duty: 16, fun: 0.5, ...CH }), T('mixer', '✍️', 'Komponuj nowy utwór', 3),
    T('stage', '🌟', 'Zagraj solowy koncert', 4, { dur: 45, duty: 18, perf: 3.5, ...CH }), T('mixer', '📋', 'Ustal setlistę trasy', 4), T('drums', '🎙️', 'Wywiad z dziennikarzem muzycznym', 4, TK),
    T('stage', '🤘', 'Rockowy koncert na stadionie', [5, 7], { br: 0, dur: 50, duty: 20, perf: 4, ...CH }), T('drums', '💿', 'Nagraj album z zespołem', [5, 7], { br: 0 }), T('mixer', '✍️', 'Podpisuj autografy fanom', [5, 7], { br: 0, ...TK }),
    T('stage', '🎻', 'Recital z orkiestrą', [5, 7], { br: 1, dur: 50, duty: 20, perf: 4, ...CH }), T('drums', '🎼', 'Ćwicz partię solową', [5, 7], { br: 1 }), T('mixer', '👨‍🏫', 'Prowadź kurs mistrzowski', [5, 7], { br: 1, ...TK }),
    ...COFFEE],
  dog: [
    T('agility', '🦮', 'Wyprowadzaj psy klientów', 0, { energy: -0.1 }), T('mat', '👀', 'Obserwuj mowę ciała psów', 0), T('desk', '📝', 'Napisz raport dla opiekuna', 0, TY),
    T('agility', '🐶', 'Poprowadź zajęcia dla szczeniąt', 1, { fun: 0.4 }), T('mat', '🍖', 'Nagradzaj spokojne zachowania', 1), T('desk', '📋', 'Asystuj na konsultacji', 1, TK),
    T('desk', '📋', 'Konsultacja 1:1 z opiekunem', 2, { dur: 40, duty: 16, ...TK }), T('agility', '👃', 'Poprowadź ćwiczenia węchowe', 2), T('mat', '🗺️', 'Ułóż plan pracy z bodźcami', 2),
    T('mat', '🧘', 'Trening reaktywnego psa na dystansie', 3, { dur: 40, duty: 16 }), T('agility', '🌿', 'Dekompresja i regulacja emocji', 3), T('desk', '👨‍🏫', 'Edukacja opiekunów', 3, TK),
    T('desk', '💔', 'Trudny przypadek: pies po traumie', 4, { dur: 45, duty: 18, perf: 4, ...TK }), T('mat', '🎓', 'Superwizja młodszych trenerów', 4, TK), T('agility', '🎥', 'Nagraj wykład dla trenerów', 4, TK),
    ...COFFEE],
  // Własna działalność: każde zadanie zarabia (money × cennik) i wpływa na stres
  biz: [
    // strefa pracy przy biurku
    T('laptop', '📧', 'Odpisuj na maile i zapytania', 0, { sit: true, ...TY, money: 35, burnout: 1 }),
    T('laptop', '🧾', 'Wystaw pierwsze faktury', 0, { sit: true, ...TY, dur: 25, money: 50 }),
    T('laptop', '🔍', 'Szukaj klientów w sieci', 0, { sit: true, ...TY, demand: 6 }),
    T('laptop', '📞', 'Rozmowy telefoniczne z klientami', [1, 2], { sit: true, ...PH, money: 80, demand: 3, burnout: 2 }),
    T('laptop', '💰', 'Przygotuj wyceny i oferty', [1, 2], { sit: true, ...TY, money: 60 }),
    T('laptop', '🤝', 'Negocjuj duży kontrakt (wideorozmowa)', [3, 4], { sit: true, ...TK, dur: 45, duty: 18, perf: 4, money: 260, burnout: 4 }),
    T('laptop', '📅', 'Zarządzaj grafikiem i zespołem', [3, 4], { sit: true, ...TY, money: 90, burnout: -6 }),
    // strefa spotkań
    T('meeting', '☕', 'Darmowa konsultacja na zachętę', 0, { sit: true, ...TK, demand: 8, social: 0.4 }),
    T('meeting', '🗣️', 'Spotkanie 1:1 z klientem', [1, 2], { sit: true, ...TK, dur: 40, duty: 16, money: 130, social: 0.3, burnout: 2 }),
    T('meeting', '💼', 'Sesja strategiczna dla dużej firmy', [3, 4], { sit: true, ...TK, dur: 45, duty: 18, perf: 4, money: 340, burnout: 5 }),
    // strefa kreatywna / nagraniowa
    T('board', '🎯', 'Rozpisz cele i budżet firmy', 0, { perf: 3.5 }),
    T('board', '📋', 'Zaplanuj ofertę na tablicy', [1, 2], { perf: 3.5, rate: 2 }),
    T('board', '🗺️', 'Strategia marki na kwartał', [3, 4], { perf: 4, rate: 2, demand: 5 }),
    T('camera', '📱', 'Nagraj krótką rolkę o firmie', 0, { ...TK, dur: 20, duty: 10, demand: 6 }),
    T('camera', '🎬', 'Nagraj poradnik do mediów społecznościowych', [1, 2], { ...TK, demand: 8, money: 40 }),
    T('camera', '🎓', 'Nagraj lekcję kursu online', [3, 4], { ...TK, dur: 45, duty: 16, lessons: 1, burnout: 2 }),
    T('camera', '🔴', 'Poprowadź płatny webinar na żywo', [3, 4], { ...TK, dur: 40, duty: 16, money: 300, burnout: 6 }),
    // ekspres do kawy
    T('coffee', '☕', 'Wypij kawę', [0, 4], { dur: 15, duty: 0, perf: 0, energy: 1.6, fun: 0.3 }),
    T('coffee', '🧘', 'Przerwa na oddech (mniej stresu)', [0, 4], { dur: 20, duty: 4, perf: 0, burnout: -8, fun: 0.4 }),
    T('coffee', '🤝', 'Kawa networkingowa w coworku', 0, { ...TK, dur: 25, duty: 10, money: 25, demand: 5, social: 0.5 }),
    T('coffee', '☕', 'Poczęstuj klienta kawą i domknij sprzedaż', [1, 2], { ...TK, dur: 25, duty: 12, money: 90 }),
    T('coffee', '🥂', 'Kawa z partnerem biznesowym', [3, 4], { ...TK, dur: 30, duty: 12, perf: 4, money: 180 }),
  ],
};

/** Zadania dostępne na danym poziomie (i specjalizacji). */
export function tasksFor(career, lvl, branch) {
  return (TASKS[career] || []).filter(t => lvl >= t.lv[0] && lvl <= t.lv[1] && (t.br === undefined || t.br === (branch ?? 0)));
}
/** Zadania, które odblokują się dopiero wyżej (podgląd w menu stanowiska). */
export function lockedFor(career, lvl, branch) {
  return (TASKS[career] || []).filter(t => t.lv[0] > lvl && (t.br === undefined || branch === null || branch === undefined || t.br === branch));
}

// ---------- PROŚBY POSTACI (dopisane + etapy istniejących) ----------
const A = (l, e, msg, react = '😊') => ({ l, e, msg, react });
const B = (l, e, msg, p, re, rmsg) => ({ l, e, msg, react: '🙂', risk: p ? { p, e: re, msg: rmsg } : null });
const C = (l, p, we, wmsg, le, lmsg) => ({ l, win: { p, e: we, msg: wmsg }, lose: { e: le, msg: lmsg } });
const R = (bands, who, t, a, b, c, extra = {}) => ({ bands, who, t, A: a, B: b, C: c, ...extra });

// etapy dla istniejących próśb (kolejność jak w praca_npc.js)
export const REQ_BANDS = {
  cook: [[1, 2], [1, 2], [1, 2], [0, 1]],
  dog: [[1, 2], [1, 2], [0, 1], [2]],
  med: [[1, 2], [0, 1, 2], [1, 2], [0, 1, 2]],
  it: [[0, 1], [1], [1, 2], [2]],
  art: [[1, 2], [1, 2], [0, 1], [0, 1, 2]],
  police: [[0, 1], [0, 1], [0, 1, 2], [1, 2]],
  music: [[0, 1], [1, 2], [1, 2], [1, 2]],
  biz: [[0], [1, 2], [1, 2], [1, 2]],
  generic: [[0, 1], [0, 1, 2], [0, 1], [1]],
};
export const REQ_ICONS = { biz: ['🪙', '🏷️', '📱', '🎓'] };

export const REQUESTS = {
  cook: [
    R([0], 'kolega', 'Zabrakło czystych kieliszków, a sala pełna gości!',
      A('Umyj je szybko, ale dokładnie', { perf: 6, energy: -4 }, 'Kieliszki lśnią, kelner odetchnął z ulgą.'),
      B('Przetrzyj ścierką te z boku', { perf: 2 }, 'Nikt nic nie zauważył.', 0.5, { perf: -6 }, 'Gość znalazł ślad szminki na kieliszku… 💄'),
      C('Zorganizuj „taśmę” z kelnerami do zmywaka', 0.55, { perf: 12, social: 10, buff: 8 }, 'Zgrany zespół! Szef kuchni Cię pochwalił. 🙌', { perf: -5, hygiene: -10 }, 'Ktoś poślizgnął się na mokrej podłodze. Wszystko w pianie… 💦')),
    R([0], 'szef', 'Przed otwarciem trzeba obrać 10 kilo ziemniaków. Dasz radę?',
      A('Obieraj starannie, równo i bez marnowania', { perf: 7, energy: -6 }, 'Szef kuchni kiwnął głową: „Porządna robota”.'),
      B('Obieraj grubo, byle szybciej', { perf: 3 }, 'Zdążyłaś/eś przed otwarciem!', 0.45, { perf: -5 }, 'Szef zobaczył kosz pełen grubych obierek… „To połowa ziemniaka!” 🥔'),
      C('Zaproponuj frytki z obierkami jako danie dnia', 0.5, { perf: 14, money: 30, buff: 10 }, 'Chrupiące obierki z ziołami zniknęły w godzinę! Nowa pozycja w karcie! 🍟', { perf: -4, fun: -6 }, 'Szef spróbował i bez słowa wrzucił je do kosza. 😶')),
    R([2], 'klient', 'Jestem krytykiem kulinarnym. Czym zaskoczy mnie szef kuchni?',
      A('Podaj dopracowane danie sygnaturowe', { perf: 10, money: 60 }, 'Krytyk notował z uśmiechem. Recenzja: 4,5 gwiazdki! ⭐'),
      B('Podaj to, co akurat jest gotowe', { money: 30 }, 'Krytyk zjadł bez komentarza.', 0.5, { perf: -10, buff: -8 }, 'Recenzja: „Poprawnie, bez duszy”. Ała. 📰'),
      C('Ugotuj dla niego danie na oczach gości', 0.5, { perf: 22, money: 150, rate: 4, buff: 15 }, 'Owacje na sali! Recenzja na pierwszej stronie! 🌟', { perf: -10, buff: -12 }, 'Płomień flambiru osmalił mu brwi… 🔥'), { as: 'Krytyk kulinarny' }),
    R([2], 'szef', 'Musimy obciąć koszty kuchni o 20%. Masz pomysł?',
      A('Przeanalizuj odpady i zamówienia', { perf: 10, rate: 3 }, 'Odpady spadły o połowę, a jakość została. Właściciel zachwycony.'),
      B('Kup tańsze składniki', { money: 80 }, 'Koszty spadły od razu.', 0.55, { perf: -12, rate: -3 }, 'Stali goście zauważyli różnicę. Rezerwacji ubywa… 📉'),
      C('Wprowadź „menu zero waste” jako atrakcję', 0.5, { perf: 20, money: 120, rate: 5, buff: 12 }, 'Media piszą o ekologicznej restauracji! Kolejki przed wejściem! 🌱', { perf: -8, fun: -8 }, 'Goście nie zrozumieli zupy z łodyg brokułu… 🥦'), { as: 'Właściciel restauracji' }),
  ],
  dog: [
    R([0], 'klient', 'Wyprowadzisz dziś mojego psa dwa razy? On nie lubi innych psów.',
      A('Wybierz spokojne trasy i omijaj psy łukiem', { perf: 7, money: 20 }, 'Pies wrócił spokojny i zmęczony. Opiekunka zostawiła napiwek!'),
      B('Idź do psiego parku, bo blisko', { money: 15 }, 'Udało się bez spotkań.', 0.5, { perf: -7, buff: -6 }, 'W parku był owczarek… Było głośno i nerwowo. 😬'),
      C('Spaceruj o świcie, gdy nikogo nie ma', 0.6, { perf: 12, money: 40, buff: 8 }, 'Pies pierwszy raz spokojnie węszył na całym spacerze. 🌅', { energy: -15, fun: -5 }, 'Pobudka o 5:00 była zbyt ambitna… 🥱')),
    R([0], 'kolega', 'Widzisz, jak ten owczarek ziewa i oblizuje się? Co to znaczy?',
      A('To sygnały uspokajające – pies jest w stresie', { perf: 8, fun: 3 }, 'Trenerka się uśmiechnęła: „Masz oko do psów!”'),
      B('Pewnie jest śpiący i głodny', { perf: 1 }, 'Trenerka tylko uniosła brew.', 0.5, { perf: -4 }, 'Pies za chwilę warknął. To jednak był stres… 😔'),
      C('Odsuń psa od hałasu i obserwuj, co się zmieni', 0.6, { perf: 13, buff: 8 }, 'Pies od razu się rozluźnił. Brawo za intuicję! 🐕', { perf: -3, fun: -4 }, 'Pies pociągnął Cię prosto w kałużę. 💦'), { as: 'Trenerka' }),
    R([2], 'szef', 'Telewizja chce Twojej opinii: czy psy powinny wchodzić do sklepów?',
      A('Wyważona, rzetelna odpowiedź oparta na badaniach', { perf: 12, money: 100, rate: 3 }, 'Wywiad wyemitowano w całości. Dzwonią nowi klienci!'),
      B('Rzuć chwytliwe hasło pod klikalność', { money: 60 }, 'Hasło trafiło na paski informacyjne.', 0.5, { perf: -10, rate: -2 }, 'Środowisko trenerów skrytykowało Cię za uproszczenia… 📺'),
      C('Pokaż na żywo, jak pies czyta otoczenie w sklepie', 0.5, { perf: 24, money: 200, rate: 6, buff: 18 }, 'Materiał obejrzało milion osób! 🎥', { perf: -8, buff: -10 }, 'Pies na wizji zjadł kiełbasę z lady. 🌭'), { as: 'Dziennikarka TV' }),
  ],
  med: [
    R([0], 'szef', 'Sala nr 3 do dezynfekcji – natychmiast!',
      A('Zdezynfekuj dokładnie według procedury', { perf: 7, energy: -5 }, 'Oddziałowa sprawdziła i pochwaliła Twoją dokładność.'),
      B('Przetrzyj tylko blaty', { perf: 2 }, 'Szybko i sprawnie.', 0.5, { perf: -7 }, 'Kontrola sanepidu znalazła zaniedbania… 🧫'),
      C('Zaproponuj nowy grafik sprzątania sal', 0.5, { perf: 12, buff: 8 }, 'Grafik przyjęto na całym oddziale! 📋', { perf: -4, social: -6 }, 'Oddziałowa: „Od planowania jestem ja”. 😐'), { as: 'Oddziałowa' }),
    R([0], 'klient', 'Gdzie jest rentgen? Błądzę tu od pół godziny…',
      A('Zaprowadź pacjenta osobiście', { perf: 6, social: 6 }, 'Pacjent ściskał Ci dłoń z wdzięczności.'),
      B('Machnij ręką: „Prosto i w lewo”', { perf: 1 }, 'Pacjent poszedł.', 0.5, { perf: -5 }, 'Pacjent trafił do kotłowni. Znowu. 🚪'),
      C('Narysuj strzałki na podłodze dla wszystkich', 0.5, { perf: 12, buff: 10 }, 'Dyrekcja zostawiła Twoje strzałki na stałe! ➡️', { perf: -5 }, 'Strzałki prowadzą do szatni personelu… 🙈')),
    R([2], 'kolega', 'Nie wiem, co dolega pacjentowi z sali 5. Pomożesz?',
      A('Przeanalizujcie razem wyniki krok po kroku', { perf: 10, social: 8 }, 'Diagnoza postawiona, a stażysta wiele się nauczył.'),
      B('Postaw diagnozę za niego, szybko', { perf: 4 }, 'Problem rozwiązany.', 0.4, { perf: -8 }, 'Stażysta nic nie zrozumiał i powtórzył błąd u kolejnego pacjenta… 😟'),
      C('Zrób z tego przypadku wykład dla całego oddziału', 0.5, { perf: 20, rate: 4, buff: 12 }, 'Wykład nagrano i pokazano na konferencji! 🎓', { perf: -6, energy: -10 }, 'Pacjent wyszedł do domu w trakcie wykładu… zdrowy. 😅'), { as: 'Stażysta' }),
    R([2], 'szef', 'Potrzebujemy kogoś do komisji etyki szpitala. Wchodzisz?',
      A('Zgódź się i rzetelnie przygotuj', { perf: 12, rate: 3, energy: -8 }, 'Twój głos przekonał komisję. Szacunek całego szpitala.'),
      B('Odmów – za dużo pracy', { buff: 4 }, 'Masz więcej czasu dla pacjentów.', 0.3, { perf: -6 }, 'Dyrektor zapamiętał odmowę… 😶'),
      C('Zaproponuj zupełnie nowe zasady dla szpitala', 0.45, { perf: 25, money: 200, rate: 6, buff: 15 }, 'Twoje zasady przyjęto w całym województwie! 🏥', { perf: -10, buff: -10 }, 'Komisja uznała pomysł za zbyt rewolucyjny. 📜'), { as: 'Dyrektor szpitala' }),
  ],
  it: [
    R([0], 'kolega', 'Ten błąd, który zgłosiłaś/eś… jesteś pewna/pewien, że to nie funkcja?',
      A('Pokaż kroki do odtworzenia błędu', { perf: 7 }, 'Programista się zaczerwienił: „Faktycznie, mój błąd”.'),
      B('Wycofaj zgłoszenie dla świętego spokoju', { perf: 1 }, 'Konflikt zażegnany.', 0.55, { perf: -7 }, 'Błąd trafił do klienta. Szef pyta, kto testował… 🐞'),
      C('Nagraj film z błędem w roli głównej', 0.55, { perf: 12, fun: 10, buff: 8 }, 'Film krąży po firmie, a błąd naprawiono w 5 minut! 🎬', { perf: -4, social: -8 }, 'Programista się obraził… na tydzień. 😤'), { as: 'Programista' }),
    R([0], 'szef', 'Przetestujesz całą aplikację do 16:00?',
      A('Zrób listę priorytetów i testuj najważniejsze', { perf: 8, energy: -6 }, 'Najważniejsze błędy złapane na czas!'),
      B('Przeklikaj wszystko szybko', { perf: 3 }, 'Zdążyłaś/eś!', 0.5, { perf: -8 }, 'Klient znalazł błąd w logowaniu po 2 minutach… 🙈'),
      C('Napisz skrypt, który przetestuje za Ciebie', 0.45, { perf: 16, rate: 3, buff: 10 }, 'Skrypt działa! Zespół chce go używać codziennie. 🤖', { perf: -6, fun: -6 }, 'Skrypt wysłał 3000 zgłoszeń do szefa. 📧')),
    R([2], 'kolega', 'Nie rozumiem tego kodu… wytłumaczysz?',
      A('Usiądź z juniorem i wytłumacz krok po kroku', { perf: 10, social: 8 }, 'Junior w końcu zrozumiał i dziękuje z błyskiem w oku.'),
      B('Napisz to za niego', { perf: 3 }, 'Szybko i działa.', 0.45, { perf: -8 }, 'Junior znów utknął przy tym samym problemie… 😔'),
      C('Zorganizuj warsztaty dla wszystkich juniorów', 0.55, { perf: 20, rate: 4, social: 15 }, 'Warsztaty to hit – firma robi z nich stały program! 🎓', { perf: -5, energy: -10 }, 'Przyszła jedna osoba. Ta sama. 🪑'), { as: 'Junior' }),
    R([2], 'szef', 'Inwestor chce zobaczyć demo produktu za godzinę!',
      A('Pokaż stabilną, sprawdzoną wersję', { perf: 12, money: 100 }, 'Inwestor zadowolony – finansowanie przedłużone.'),
      B('Doklej na szybko nową funkcję', { money: 60 }, 'Wygląda imponująco.', 0.55, { perf: -12 }, 'Aplikacja wyłączyła się na samym środku pokazu… 💥'),
      C('Opowiedz wizję i pokaż prototyp z tablicy', 0.5, { perf: 25, money: 300, rate: 6, buff: 15 }, 'Inwestor podwoił budżet! 🚀', { perf: -10, buff: -10 }, 'Inwestor zapytał: „A gdzie produkt?” 🤨'), { as: 'Prezes' }),
  ],
  art: [
    R([0], 'szef', 'Przenieś te rzeźby do drugiej sali – tylko ostrożnie!',
      A('Przenieś je powoli, jedna po drugiej', { perf: 7, energy: -6 }, 'Wszystkie całe. Kurator odetchnął.'),
      B('Weź dwie naraz, szybciej będzie', { perf: 3 }, 'Udało się!', 0.4, { perf: -10, buff: -8 }, 'Rzeźba „Spokój” straciła nos… 🗿'),
      C('Ustaw je w nowej, zaskakującej kompozycji', 0.5, { perf: 13, buff: 10 }, 'Kurator: „To lepsze niż mój plan!” 🖼️', { perf: -5 }, 'Rzeźby stoją tyłem do zwiedzających. 🙃'), { as: 'Kurator' }),
    R([2], 'klient', 'Kupię całą serię, jeśli namalujesz mojego kota jako cesarza.',
      A('Zgódź się i namaluj go z godnością', { perf: 8, money: 300 }, 'Kot-cesarz wisi w salonie kolekcjonera. Płaci z nawiązką!'),
      B('Odmów – to poniżej Twojej sztuki', { buff: 5 }, 'Twoja sztuka zostaje czysta.', 0.3, { money: -50, perf: -4 }, 'Kolekcjoner kupił serię u konkurencji… 😾'),
      C('Namaluj całą dynastię kocich władców', 0.5, { perf: 22, money: 600, rate: 5, buff: 15 }, '„Dynastia Mruczków” zachwyciła krytyków! 👑🐈', { perf: -8 }, 'Kot obraził się na swój portret i zrzucił go ze ściany. 😼'), { as: 'Kolekcjoner' }),
    R([2], 'kolega', 'Obejrzysz moje portfolio? Szczerze.',
      A('Daj życzliwą, konkretną informację zwrotną', { perf: 10, social: 10 }, 'Młoda artystka dziękuje – wie, nad czym pracować.'),
      B('Pochwal wszystko, żeby nie robić przykrości', { social: 4 }, 'Uśmiech na jej twarzy.', 0.4, { perf: -5 }, 'Pokazała portfolio komisji i poległa. Wróciła z pretensjami… 😢'),
      C('Zaproponuj jej wspólną wystawę', 0.5, { perf: 20, money: 200, social: 15, buff: 12 }, 'Wystawa „Mistrz i uczennica” to sukces! 🎨', { perf: -6, buff: -8 }, 'Jej obrazy podobały się bardziej niż Twoje… 😅'), { as: 'Młoda artystka' }),
  ],
  police: [
    R([0], 'szef', 'Kadecie! Jaki jest mandat za przejście na czerwonym?',
      A('Odpowiedz zgodnie z taryfikatorem', { perf: 8 }, 'Instruktor kiwnął głową: „Dobrze się uczysz”.'),
      B('Zgadnij pewnym głosem', { perf: 2 }, 'Instruktor nie zauważył.', 0.5, { perf: -6 }, 'Pomyliłaś/eś o 400 zł. Cała sala się śmiała. 😳'),
      C('Wyrecytuj cały taryfikator jak rap', 0.45, { perf: 14, fun: 12, buff: 10 }, 'Cała grupa bije brawo! Legenda szkoły! 🎤', { perf: -5, fun: -6 }, 'Instruktor kazał Ci zrobić 50 pompek. 💪'), { as: 'Instruktor' }),
    R([2], 'kolega', 'Pierwsza interwencja… trochę się boję.',
      A('Pojedź z nim i pokaż, jak spokojnie rozmawiać', { perf: 10, social: 10 }, 'Interwencja przebiegła wzorowo. Młody policjant złapał pewność siebie.'),
      B('Powiedz: „Dasz radę” i wyślij go samego', { perf: 2 }, 'Poradził sobie!', 0.45, { perf: -8 }, 'Interwencja przeciągnęła się do nocy… 🌙'),
      C('Przeprowadź z nim symulację na komisariacie', 0.55, { perf: 18, rate: 3, social: 12 }, 'Symulacje stały się stałym szkoleniem! 🎯', { perf: -4, energy: -10 }, 'Symulacja wyszła zbyt realistycznie – wezwano prawdziwe wsparcie. 🚨'), { as: 'Młody posterunkowy' }),
    R([2], 'szef', 'Mamy za mało dowodów na akt oskarżenia. Co proponujesz?',
      A('Zbierz dodatkowe dowody zgodnie z procedurą', { perf: 12, energy: -8 }, 'Sprawa zamknięta – solidnie i bez zarzutów.'),
      B('Przyciśnij podejrzanego na przesłuchaniu', { perf: 4 }, 'Przyznał się.', 0.5, { perf: -12, buff: -10 }, 'Obrońca podważył zeznania. Sprawa się sypie… ⚖️'),
      C('Zastaw sprytną pułapkę na wspólników', 0.45, { perf: 25, money: 250, rate: 6, buff: 15 }, 'Cała szajka zatrzymana! Gratulacje od komendanta głównego! 🏅', { perf: -10, buff: -12 }, 'W pułapkę wpadł listonosz. 📮'), { as: 'Prokurator' }),
  ],
  music: [
    R([0], 'klient', 'Co to za ulotka? Kto dziś gra?',
      A('Opowiedz z pasją o zespole', { perf: 7, social: 6 }, 'Przechodzień obiecał przyjść z przyjaciółmi!'),
      B('Wciśnij ulotkę i biegnij dalej', { perf: 2 }, 'Kolejna ulotka rozdana.', 0.4, { perf: -4 }, 'Ulotka wylądowała w koszu na Twoich oczach. 🗑️'),
      C('Zaśpiewaj kawałek refrenu na ulicy', 0.5, { perf: 13, money: 25, fun: 10 }, 'Zebrał się tłum, wszyscy idą na koncert! 🎶', { perf: -4, fun: -6 }, 'Przechodzień przyspieszył kroku. 🏃'), { as: 'Przechodzień' }),
    R([2], 'szef', 'Sponsor trasy chce, żebyś zagrał(a) jego reklamowy dżingiel.',
      A('Negocjuj subtelną współpracę zgodną z Twoim stylem', { perf: 12, money: 200 }, 'Sponsor zadowolony, fani też. Wszyscy wygrali.'),
      B('Zagraj dżingiel, kasa to kasa', { money: 400 }, 'Przelew przyszedł.', 0.5, { perf: -12, buff: -10 }, 'Fani nazwali Cię „sprzedawczykiem”… 😬'),
      C('Zrób z dżingla rockową balladę', 0.5, { perf: 24, money: 500, rate: 6, buff: 18 }, 'Ballada stała się hitem radia! 📻', { perf: -8 }, 'Sponsor nie rozpoznał swojego dżingla. Umowa zerwana. 📄'), { as: 'Menedżer trasy' }),
    R([2], 'klient', 'To prawda, że zespół się rozpada?',
      A('Odpowiedz spokojnie i rzeczowo', { perf: 10 }, 'Dziennikarz napisał wyważony tekst. Plotki ucichły.'),
      B('Rzuć „bez komentarza” i odejdź', { perf: 2 }, 'Uniknięto tematu.', 0.5, { perf: -8 }, 'Nagłówek: „Gwiazda ucieka od pytań”. 📰'),
      C('Zagraj z zespołem na żywo podczas wywiadu', 0.55, { perf: 22, money: 200, buff: 15, social: 15 }, 'Nagranie obiegło sieć – zespół silniejszy niż kiedykolwiek! 🎸', { perf: -8, fun: -8 }, 'Perkusista akurat poszedł po kawę… 🥁'), { as: 'Dziennikarz' }),
  ],
  biz: [
    R([0], 'klient', 'Potrzebuję wyceny dla mojej kawiarni. Ile to będzie kosztować?',
      A('Przygotuj rzetelną, rozpisaną wycenę', { perf: 7, money: 60, demand: 3 }, 'Klientka przyjęła ofertę bez negocjacji. Pierwsze poważne zlecenie!'),
      B('Rzuć kwotę „na oko”', { money: 90 }, 'Klientka się zgodziła.', 0.5, { perf: -6, rate: -2, burnout: 6 }, 'Okazało się, że pracy jest trzy razy więcej, niż wyceniłaś/eś… ⏰'),
      C('Zaproponuj darmowy próbny projekt', 0.55, { perf: 14, demand: 12, buff: 10 }, 'Klientka zachwycona – podpisała umowę na rok! ☕', { energy: -12, burnout: 6 }, 'Klientka podziękowała za darmowy projekt… i zniknęła. 👻'), { ico: '💰' }),
    R([0, 1], 'klient', 'Jestem studentką. Zrobisz to za pół ceny?',
      A('Zaproponuj mniejszy zakres w uczciwej cenie', { perf: 6, money: 40 }, 'Studentka wybrała mniejszy pakiet i jest zadowolona.'),
      B('Zgódź się na pół ceny', { money: 25, demand: 4 }, 'Nowa klientka!', 0.45, { rate: -3, burnout: 5 }, 'Teraz wszyscy jej znajomi chcą pół ceny… 🏷️'),
      C('Zaproponuj barter: projekt za film z opinią', 0.55, { perf: 12, demand: 12 }, 'Jej film z opinią obejrzało 30 tys. osób! 📱', { perf: -4, fun: -5 }, 'Film nagrała pionowo, w ciemności, z mlaskaniem. 📵'), { ico: '🏷️' }),
    R([0], 'szef', 'Opowiesz o swojej firmie na naszym śniadaniu biznesowym?',
      A('Przygotuj krótkie, konkretne wystąpienie', { perf: 8, demand: 8, social: 8 }, 'Trzy osoby poprosiły o wizytówkę!'),
      B('Wystąp bez przygotowania', { demand: 3 }, 'Poszło całkiem nieźle.', 0.45, { perf: -5, buff: -6 }, 'Zapomniałaś/eś nazwy własnej firmy. 😳'),
      C('Zrób interaktywny warsztat zamiast nudnej przemowy', 0.5, { perf: 16, demand: 15, money: 50, buff: 12 }, 'Warsztat był hitem śniadania! Telefon dzwoni! 📞', { perf: -4, energy: -10 }, 'Rzutnik nie działał, a markery wyschły. 🖍️'), { ico: '📣', as: 'Właścicielka coworku' }),
    R([1, 2], 'klient', 'Reklamacja! Projekt miał być na wczoraj, a faktura ma błąd.',
      A('Przeproś, popraw fakturę i daj nowy termin na piśmie', { perf: 8, burnout: 3 }, 'Klient docenił profesjonalizm i został na dłużej.'),
      B('Zrzuć winę na system do faktur', { money: 20 }, 'Klient przyjął wyjaśnienie.', 0.55, { perf: -10, demand: -8 }, 'Klient zadzwonił do firmy od systemu… Wyszło na jaw. 😬'),
      C('Oddaj projekt jeszcze dziś z gratisem', 0.5, { perf: 16, demand: 10, rate: 2, buff: 10 }, 'Klient napisał entuzjastyczną opinię! ⭐⭐⭐⭐⭐', { burnout: 14, energy: -15, buff: -8 }, 'Siedzisz do 2 w nocy, a klient i tak marudzi… 🌙'), { ico: '⚠️' }),
    R([1], 'szef', 'Zróbmy wspólny pakiet usług – podział 50/50?',
      A('Przygotuj umowę z jasnym podziałem zadań', { perf: 9, rate: 3, demand: 5 }, 'Wspólny pakiet ruszył i dobrze się sprzedaje.'),
      B('Zgódź się na słowo, bez umowy', { money: 150 }, 'Pierwsze zyski już są!', 0.5, { perf: -10, money: -150 }, 'Partner „zapomniał” o Twojej połowie… 💸'),
      C('Zaproponuj wspólne wydarzenie z biletami', 0.5, { perf: 18, money: 350, demand: 12, buff: 12 }, 'Bilety wyprzedane w dwa dni! 🎟️', { perf: -6, money: -100 }, 'Przyszło 7 osób, w tym Twoja mama. 👵'), { ico: '🤝' }),
    R([1, 2], 'klient', 'Konkurencja daje 30% taniej. Albo rabat, albo odchodzę.',
      A('Spokojnie pokaż wartość swojej usługi', { perf: 8, rate: 2 }, 'Klient został – i przestał wspominać o konkurencji.'),
      B('Daj 30% rabatu', { money: 50 }, 'Klient został.', 0.6, { rate: -5, burnout: 6 }, 'Klient żąda teraz rabatu przy każdym zleceniu… 🏷️'),
      C('Pozwól mu odejść i podnieś ceny dla nowych', 0.5, { perf: 14, rate: 6, demand: -3 }, 'Nowi klienci płacą więcej i są milsi! 💎', { demand: -10, buff: -8 }, 'Przez tydzień nikt nowy się nie zgłosił… 📉'), { ico: '😤', as: 'Trudny klient' }),
    R([2], 'szef', 'Sieć 40 sklepów chce licencji na Twoją metodę.',
      A('Negocjuj licencję z kontrolą jakości', { perf: 12, money: 400, rate: 4, lessons: 2 }, 'Licencja podpisana! Co miesiąc wpływa tantiema.'),
      B('Sprzedaj wszystkie prawa jednorazowo', { money: 1500 }, 'Ogromny przelew!', 0.5, { perf: -14, rate: -4 }, 'Sieć zepsuła Twoją metodę, a recenzje obciążają Twoje nazwisko… 📉'),
      C('Zażądaj udziału w zyskach i miejsca w zarządzie', 0.4, { perf: 30, money: 800, rate: 8, lessons: 4, buff: 20 }, 'Zgodzili się! Twoja marka wchodzi na rynek ogólnopolski! 🏢', { perf: -8, buff: -12 }, 'Prezes sieci zakończył rozmowę w pół zdania. 📞'), { ico: '🏢' }),
    R([2], 'klient', 'Wystąpisz jutro rano w telewizji jako ekspert?',
      A('Przygotuj trzy konkretne porady', { perf: 12, demand: 12, money: 150 }, 'Wystąpienie było rzeczowe i ciepłe. Zapytań przybywa!'),
      B('Idź bez przygotowania – jesteś ekspertem', { demand: 6 }, 'Poszło gładko.', 0.45, { perf: -10, buff: -10 }, 'Na wizji zapomniałaś/eś, o co chodziło w pytaniu… 📺'),
      C('Zaproponuj stały cotygodniowy kącik ekspercki', 0.45, { perf: 24, demand: 20, money: 300, lessons: 2, buff: 18 }, 'Masz własny kącik w telewizji śniadaniowej! 🌟', { perf: -6, burnout: 8 }, 'Producentka: „Damy znać”. Nie dali. 📵'), { ico: '📺', as: 'Producentka TV' }),
    R([2], 'kolega', 'Grafik pęka w szwach. Przyjmujemy jeszcze klientów?',
      A('Zrób listę oczekujących i chroń swój czas', { perf: 10, rate: 4, burnout: -8 }, 'Lista oczekujących dodaje marce prestiżu. Spokojniej!'),
      B('Bierzemy wszystkich!', { money: 500, burnout: 18, energy: -15 }, 'Konto rośnie…', 0.5, { perf: -10, buff: -12 }, 'Przemęczenie dało o sobie znać – pomyłki w terminach… 😵'),
      C('Zatrudnij drugą osobę do zespołu', 0.55, { perf: 20, money: 200, burnout: -15, rate: 3, buff: 12 }, 'Nowa osoba świetnie się wdrożyła! Firma rośnie. 👥', { money: -300, burnout: 8 }, 'Nowa osoba zrezygnowała po tygodniu… 🚪'), { ico: '📅' }),
    R([2], 'klient', 'Kupiłam Twój kurs online, ale jest za trudny. Chcę zwrot!',
      A('Zwróć pieniądze i zapytaj, co poprawić', { perf: 8, money: -100, lessons: 1 }, 'Na podstawie jej uwag dodajesz lekcję wprowadzającą. Kurs sprzedaje się lepiej!'),
      B('Odmów zwrotu, regulamin to regulamin', { money: 50 }, 'Pieniądze zostają.', 0.55, { perf: -10, demand: -8 }, 'Klientka opisała sprawę w grupie z 50 tys. osób… 📢'),
      C('Zaproś ją na darmową sesję na żywo', 0.55, { perf: 16, demand: 12, buff: 10 }, 'Została Twoją największą fanką i poleca kurs wszystkim! 💖', { energy: -10, burnout: 6 }, 'Sesja trwała 3 godziny i nic nie pomogła. 😩'), { ico: '🎓' }),
  ],
};

// ---------- DYLEMATY (karta podczas zmiany) ----------
const ev = (bands, icon, t, A, B, C) => ({ bands, icon, t, A, B, C });

// zwykłe zawody: osobna sytuacja na każdy etap (A wymaga umiejętności)
export const CAREER_EV = {
  med: [{ t: 'Na korytarzu pacjent zasłabł, a lekarzy nie ma w pobliżu!', a: 'Udziel pierwszej pomocy', b: 'Biegnij po lekarza' }, null,
    { t: 'Rodzina pacjenta żąda eksperymentalnej terapii, której nikt w kraju jeszcze nie stosował.', a: 'Podejmij się trudnego leczenia', b: 'Skieruj pacjenta do ośrodka za granicą' }],
  cook: [{ t: 'Cukiernik zachorował, a szef każe Ci w 15 minut przygotować deser dla 30 gości!', a: 'Spróbuj upiec deser', b: 'Poproś o pomoc kucharza' }, null,
    { t: 'Gwiazda telewizji chce, żeby Twoja kuchnia obsłużyła jej wesele na 200 osób.', a: 'Przygotuj autorskie menu weselne', b: 'Zaproponuj sprawdzony catering' }],
  it: [{ t: 'Godzinę przed premierą aplikacji znajdujesz poważny błąd!', a: 'Napisz szczegółowy raport i powtórz testy', b: 'Powiedz tylko szefowi' }, null,
    { t: 'Konkurencyjna firma chce przejąć cały Twój zespół – z Tobą na czele.', a: 'Negocjuj najlepsze warunki dla zespołu', b: 'Odrzuć ofertę' }],
  art: [{ t: 'Gość galerii potrącił obraz wart 50 tys. zł – rama się chwieje!', a: 'Złap obraz i sprawdź uszkodzenia', b: 'Zawołaj kuratora' }, null,
    { t: 'Muzeum narodowe proponuje Ci retrospektywę Twojej twórczości.', a: 'Namaluj nowe dzieło na otwarcie', b: 'Pokaż tylko starsze prace' }],
  police: [{ t: 'Na szkoleniu strzeleckim instruktor wybiera Cię do pokazu przed komendantem.', a: 'Zrób pokaz celności', b: 'Poproś o więcej czasu na trening' }, null,
    { t: 'Dostajesz anonimowy cynk: gang planuje dziś skok na bank.', a: 'Poprowadź akcję zatrzymania', b: 'Przekaż sprawę wyżej' }],
  music: [{ t: 'Ulewa! Ulotki rozmokły, a koncert startuje za godzinę i sala jest pusta.', a: 'Zagraj na ulicy, żeby zwabić ludzi', b: 'Rozdaj resztę ulotek pod dachem' }, null,
    { t: 'Wytwórnia oferuje kontrakt płytowy, ale chce zmienić Twój styl.', a: 'Zagraj im swój autorski materiał', b: 'Podpisz kontrakt na ich warunkach' }],
};
// etapy istniejących kart (kolejność jak w praca.js)
export const EV_BANDS = {
  dog: [[1, 2], [1], [2], [1, 2], [1, 2], [1, 2], [2]],
  biz: [[1, 2], [0, 1], [1, 2], [0, 1], [0, 1], [1, 2], [2]],
  generic: [[0, 1], [0, 1], [1, 2], [1, 2], [0, 1, 2]],
};
export const EVENTS = {
  dog: [
    ev([0], '🦮', 'Wyprowadzasz naraz cztery psy. Nagle jeden wyślizguje się z obroży i biegnie w stronę ulicy!',
      { l: 'Zatrzymaj się, przykucnij i spokojnie przywołaj psa', d: '+Postęp, spokój psów', e: { perf: 12, buff: 6 }, msg: 'Pies wrócił, zaciekawiony, czemu kucasz. Uff! Opiekun nawet się nie dowiedział, jak było blisko.' },
      { l: 'Biegnij za nim, ciągnąc resztę psów', d: 'Szybko, ale ryzykownie', e: { perf: 3, energy: -15 }, risk: { p: 0.5, e: { perf: -10, buff: -12, hygiene: -15 }, msg: 'Wszystkie psy uznały, że to zabawa. Skończyło się w fontannie… ⛲' }, msg: 'Złapany! Choć ledwo dyszysz.' },
      { l: 'Zaszeleść torebką smaczków jak na pikniku', d: 'Ryzyko! Sprytny trik albo chaos', win: { p: 0.6, e: { perf: 22, money: 40, buff: 15, fun: 10 }, promo: 0.15, msg: 'Pies zawrócił w miejscu! Przechodnie bili brawo! 👏' }, lose: { e: { perf: -6, fun: -8 }, msg: 'Przybiegło pięć obcych psów. Twój nie. 🐕🐕🐕' } }),
    ev([0], '🐾', 'Pies klienta po spacerze ma skaleczoną łapę. Opiekun wraca za 10 minut.',
      { l: 'Opatrz łapę i od razu powiedz opiekunowi prawdę', d: '+Zaufanie, +postęp', e: { perf: 12, rate: 2 }, msg: 'Opiekun docenił szczerość: „Takiego wyprowadzacza szukałem!”' },
      { l: 'Nic nie mów – może nie zauważy', d: 'Spokój teraz, ryzyko utraty klienta', e: { money: 30 }, risk: { p: 0.65, e: { perf: -14, buff: -12 }, msg: 'Opiekun zauważył i od razu zrezygnował z Twoich usług… 😞' }, msg: 'Opiekun niczego nie zauważył.' },
      { l: 'Zaproponuj darmowe sprawdzenie u zaprzyjaźnionego weterynarza', d: 'Ryzyko! Wdzięczność albo strata czasu', win: { p: 0.55, e: { perf: 24, money: 60, buff: 15 }, promo: 0.15, msg: 'Weterynarz potwierdził: drobiazg. Opiekun poleca Cię całemu osiedlu! 🏥' }, lose: { e: { energy: -12, perf: -4 }, msg: 'Kolejka u weterynarza na 3 godziny… 🕐' } }),
  ],
  biz: [
    ev([0], '⏳', 'Pierwszy duży klient chce zapłacić dopiero po 60 dniach. A czynsz za biuro jest za tydzień.',
      { l: 'Negocjuj zaliczkę 30% z góry', d: '+Reputacja, bezpieczeństwo', e: { perf: 12, money: 200, rate: 2 }, msg: 'Klient zgodził się bez problemu. Profesjonalizm procentuje!' },
      { l: 'Zgódź się i weź szybką pożyczkę', d: 'Klient zostaje, koszty pożyczki', e: { money: 100, burnout: 8 }, risk: { p: 0.45, e: { money: -250, buff: -12 }, msg: 'Odsetki od pożyczki zjadły cały zysk… 💸' }, msg: 'Czynsz zapłacony, klient zadowolony.' },
      { l: 'Zaproponuj rabat 5% za płatność w 7 dni', d: 'Ryzyko! Szybka gotówka albo utrata klienta', win: { p: 0.55, e: { perf: 20, money: 400, buff: 12 }, promo: 0.2, msg: 'Klient zapłacił w 2 dni i chwali Twoją elastyczność! 💳' }, lose: { e: { perf: -6, demand: -5 }, msg: 'Klient obraził się, że „wątpisz w jego wypłacalność”. 🙄' } }),
    ev([2], '💼', 'Inwestor chce kupić 40% Twojej firmy. Kwota robi wrażenie, ale chce mieć wpływ na decyzje.',
      { l: 'Odmów grzecznie – rozwijasz się po swojemu', d: '+Niezależność, +reputacja', e: { perf: 14, rate: 4, buff: 10 }, msg: 'Branża mówi o Tobie z szacunkiem: „Nie da się jej/go kupić”.' },
      { l: 'Weź pieniądze i oddaj kontrolę', d: 'Ogromna gotówka, mniej wolności', e: { money: 3000, rate: -6, burnout: 10 }, risk: { p: 0.5, e: { perf: -12, buff: -15 }, msg: 'Inwestor każe Ci pracować w weekendy i zmienić logo na fioletowe. 💜' }, msg: 'Na koncie milionowe… prawie. Konto wygląda pięknie.' },
      { l: 'Zaproponuj mu inwestycję w nowy kurs online zamiast w firmę', d: 'Ryzyko! Pasywny dochód albo klapa', win: { p: 0.5, e: { perf: 30, money: 1500, lessons: 5, buff: 22 }, promo: 0.35, msg: 'Inwestor wchodzi w kurs! Nagrania gotowe, sprzedaż ruszyła! 🎓' }, lose: { e: { perf: -8, money: -300 }, msg: 'Inwestor wycofał się po pierwszym nagraniu próbnym. 🎬' } }),
  ],
};

/** Dopisuje etapy i nowe treści do istniejących pul (wywołać raz po imporcie). */
export function install(PR, PRN) {
  for (const [k, bands] of Object.entries(REQ_BANDS)) (PRN.REQUESTS[k] || []).forEach((r, i) => { if (!r.bands && bands[i]) r.bands = bands[i]; if (REQ_ICONS[k] && REQ_ICONS[k][i] && !r.ico) r.ico = REQ_ICONS[k][i]; });
  for (const [k, list] of Object.entries(REQUESTS)) { PRN.REQUESTS[k] = PRN.REQUESTS[k] || []; for (const r of list) if (!PRN.REQUESTS[k].includes(r)) PRN.REQUESTS[k].push(r); }
  for (const [k, bands] of Object.entries(EV_BANDS)) (PR.EVENTS[k] || []).forEach((e, i) => { if (!e.bands && bands[i]) e.bands = bands[i]; });
  for (const [k, list] of Object.entries(EVENTS)) { PR.EVENTS[k] = PR.EVENTS[k] || []; for (const e of list) if (!PR.EVENTS[k].includes(e)) PR.EVENTS[k].push(e); }
  for (const [k, list] of Object.entries(CAREER_EV)) { const c = PR.CAREERS[k]; if (c) c.evs = list; }
}
