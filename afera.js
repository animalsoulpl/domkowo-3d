// Afery na przyjęciach (w klimacie „Pokojówek z Beverly Hills”): 6 scenariuszy, poszlaki, alibi, finał przy toaście.
// Sprawca i ofiara są losowani spośród gości; poszlaki zależą od „znaków rozpoznawczych” sąsiadów.
// W tekstach: {v} ofiara, {c} sprawca, {w} świadek, {s} ktoś podejrzany, {place} miejsce, {loc} miejsce poszlaki, {item} przedmiot

export const SCENARIOS = [
  { id: 'kolia', icon: '💎', title: 'Kradzież brylantowej kolii',
    intro: 'Przeraźliwy krzyk przerywa muzykę! Z toaletki w {place} zniknęła brylantowa kolia, którą {v} zdjęła/zdjął na chwilę do zdjęcia. Warta 80 000 zł. Ktoś widział cień wymykający się w trakcie toastu…',
    locs: ['Przy toaletce', 'Na parapecie okna', 'W koszu z serwetkami', 'Pod poduszką kanapy'] },
  { id: 'szampan', icon: '🥂', title: 'Sabotaż w kieliszku',
    intro: 'W połowie toastu {v} osuwa się na kanapę i zaczyna chrapać jak niedźwiedź po zimie. Na dnie kieliszka – biały osad. Ktoś dosypał środka nasennego, żeby ośmieszyć gospodarzy i przejąć kontrakt {v}!',
    locs: ['Przy tacy z kieliszkami', 'Obok wiaderka z lodem', 'Za donicą z palmą', 'Na barze, pod podkładką'] },
  { id: 'koperta', icon: '✉️', title: 'Szantażysta na tarasie',
    intro: 'Kelner niesie tacę z przekąskami, a między koreczkami leży koperta. W środku kompromitujące zdjęcia – na nich {v}! Na odwrocie: „Zapłać albo cała ulica to zobaczy”. Ktoś z gości podłożył ją przed chwilą.',
    locs: ['Obok tacy z przekąskami', 'Na stoliku przy lożach', 'W doniczce przy wejściu', 'Pod serwetnikiem'] },
  { id: 'walizka', icon: '🧳', title: 'Walizka w krzakach',
    intro: 'Pies sąsiada wygrzebuje z krzaków wodoodporną walizkę: fałszywe paszporty, peruka, sztuczne wąsy i 50 000 zł w gotówce! Na zdjęciu w paszporcie twarz jest dziwnie znajoma. Ktoś z gości planuje wielką ucieczkę.',
    locs: ['W krzakach przy {pool}', 'Przy bramie wjazdowej', 'Na leżaku pod ręcznikiem', 'W koszu na śmieci przy barze'] },
  { id: 'testament', icon: '📜', title: 'Podmieniony testament',
    intro: 'Podchmielony/a {v} wymachuje dokumentem: „Ktoś kazał mi to podpisać! Mówił, że to lista gości!”. To przekazanie całego majątku „okazicielowi niniejszego”. Podpis jest w połowie, a długopis zniknął.',
    locs: ['Przy stoliku z dokumentem', 'W kieszeni porzuconej marynarki', 'Obok kominka', 'Pod schodami do ogrodu'] },
  { id: 'romans', icon: '💔', title: 'Sekretny romans za żywopłotem',
    intro: 'Po przyjęciu lotem błyskawicy krąży plotka: {v} ma romans za żywopłotem! Na sofie ktoś „przypadkiem” zostawił list miłosny i zdjęcie. Ale wszystko wygląda… zbyt idealnie. Ktoś to podrzucił.',
    locs: ['Na sofie w salonie', 'Za żywopłotem', 'W wazonie z różami', 'Przy lustrze w korytarzu'] },
];

// znaki rozpoznawcze (2 na osobę) – z nich powstają poszlaki
export const SIGS = {
  hania: ['srebrna linijka z wygrawerowanym „K.”', 'chusteczka pachnąca wodą kolońską „Konwalia 1987”'],
  marek: ['serwetka z plamą sosu barbecue', 'opakowanie po kadzidełku „Zen Millionaire”'],
  zosia: ['sztuczna rzęsa z brokatem', 'ślad czerwonej szminki „Luxury Red” na serwetce'],
  kuba: ['kostka do gitary z napisem „Kuba Rocks”', 'zerwana struna gitarowa'],
  natalia: ['ślady mąki na klamce', 'spinka do włosów w kształcie widelca'],
  tomek: ['malutki mikrofon szpiegowski', 'bateryjka do aparatu słuchowego'],
  generic: ['zgubiona spinka do mankietów', 'pognieciony paragon z kwiaciarni'],
};
export const NEUTRAL = [
  { icon: '📱', t: 'Zostawiony telefon z SMS-em: „Zrobione. Nikt nic nie widział. Spotkajmy się po toaście.” Numer bez nazwy.' },
  { icon: '🧾', t: 'Pognieciony paragon z nocnej apteki: „Krople nasenne – 2 szt.”. Godzina zakupu: dziś, 18:47.' },
  { icon: '🧤', t: 'Jedna rękawiczka z eleganckiej skóry. Druga pewnie jest w czyjejś kieszeni…' },
];
export const ALIBI_TRUE = ['Przez cały toast tańczyłam/em z: {w}. Możesz zapytać.', 'Stałam/em przy barze i kłóciłam/em się z barmanem o oliwki. Cały bar to widział.', 'Byłam/em na zewnątrz, dzwoniłam/em do mamy. Rozmowa trwała 40 minut. Jak zawsze.'];
export const SUSPECT = ['Ale wiesz… widziałam/em, jak {s} kręcił(a) się koło miejsca, gdzie to się stało.', 'Nie chcę nikogo oskarżać, ale {s} był(a) dziś dziwnie nerwowy/a.', 'Jeśli pytasz mnie – sprawdź {s}. Tylko nie mów, że to ode mnie.'];
export const ALIBI_LIE = ['Ja? Byłam/em… przy barze! Albo w łazience. W każdym razie nie TAM. Na pewno.', 'Cały czas stałam/em z wszystkimi. No, prawie cały. Na chwilkę wyszłam/wyszedłem po… powietrze. Świeże.', 'Nic nie wiem, nic nie widziałam/em, a w ogóle to piękne dekoracje, prawda?'];
export const STUMBLE = ['„To… to nie moje! To znaczy moje, ale… ktoś mi to ukradł! Wczoraj! Albo jutro!” – głos lekko drży.', '„Skąd… skąd to masz?” – blednie i odstawia kieliszek trzęsącą się ręką.', '„A, to? Ha-ha. Pewnie… wypadło mi. Przypadkiem. W TYM miejscu. Przypadkiem.”'];
export const EXPLAIN = ['„Tak, to może być moje… ale w czasie incydentu byłam/em z: {w}. Zapytaj. Ktoś chce mnie wrobić!”', '„Owszem, moje. Ale ktoś mi to podwędził wcześniej – {w} widział(a), jak tego szukałam/em. Ciekawe, kto miał w tym interes?”'];
export const UNRELATED = ['„Pierwszy raz to widzę. Naprawdę.”', '„Hmm… nie mam pojęcia, co to jest.”'];
export const PARTNER_HINT = ['Kochanie, widziałem, jak {c} wymykał(a) się w trakcie toastu. Może to nic…', 'Słuchaj, {c} pytał(a) mnie dziś, gdzie trzymamy cenne rzeczy. Dziwne, nie?'];
export const SHAME = ['🙊 Pani z naprzeciwka szepcze do koleżanki: „To ta osoba, co oskarżyła niewinnego na własnej imprezie…”', '📰 Na słupie ogłoszeniowym ktoś przykleił wycinek z Kroniki o Twojej wpadce. Z narysowanym wąsem.', '🙄 Pan Marek mija Cię i mruczy: „Ja tylko jem karkówkę, nikogo nie oskarżam…”'];
export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');

// dopasowanie form „widziałam/em”, „był(a)”, „nerwowy/a”, „wyszłam/wyszedłem” do płci: me – mówiący, other – osoba, o której mowa
export function gfix(t, me, other) {
  return t.replace(/(\p{L}+)\(a\)/gu, (_, w) => other ? w + 'a' : w)
    .replace(/(\p{L}+)\/(\p{L}+)/gu, (m, a, b) => {
      if (b === 'em') return me ? a : a.replace(/am$/, '') + 'em';
      if (b === 'a') return other ? a.replace(/y$/, '') + 'a' : a;
      if (b === 'ej') return me ? a : a;
      return me ? a : b;
    });
}
