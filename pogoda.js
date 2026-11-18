// Pogoda, awarie, pożary, zwroty akcji i „reżyser” pilnujący, żeby nie było nudno.
// Same dane; efekty 3D, dźwięki i okna obsługuje gra.

// ---------- pogoda ----------
// light – mnożnik słońca, grey – ile szarości w niebie, rain – gęstość deszczu (0..1)
export const WEATHER = {
  sun: { name: 'Słonecznie', icon: '☀️', light: 1, grey: 0, rain: 0 },
  cloud: { name: 'Pochmurno', icon: '⛅', light: 0.72, grey: 0.35, rain: 0 },
  rain: { name: 'Deszcz', icon: '🌧️', light: 0.5, grey: 0.6, rain: 0.55 },
  storm: { name: 'Burza', icon: '⛈️', light: 0.3, grey: 0.85, rain: 1 },
};
// prawdopodobieństwa przejść (bez „zacinania się” w jednej pogodzie)
export const NEXT = { sun: [['sun', 3], ['cloud', 4], ['rain', 1]], cloud: [['sun', 3], ['cloud', 1], ['rain', 3], ['storm', 1.2]], rain: [['cloud', 3], ['rain', 1], ['storm', 1.6], ['sun', 1]], storm: [['rain', 3], ['cloud', 2]] };
export const DURATION = { sun: [240, 600], cloud: [120, 360], rain: [90, 240], storm: [45, 120] }; // minuty gry
export function nextWeather(cur) {
  const list = NEXT[cur] || NEXT.sun, sum = list.reduce((s, x) => s + x[1], 0); let r = Math.random() * sum;
  for (const [k, w] of list) { if (r < w) return k; r -= w; } return 'sun';
}
export const WEATHER_TOASTS = {
  sun: ['Wyszło słońce! Pani Krystyna już mierzy cień swojego płotu. ☀️', 'Słońce! Krasnale wyglądają na zadowolone. ☀️'],
  cloud: ['Chmury zbierają się nad Słoneczną. Ironia nazwy ulicy nie umyka nikomu. ⛅'],
  rain: ['Zaczyna padać. Pan Marek w panice chowa resztki z cudzego grilla. 🌧️', 'Deszcz! Idealna pogoda na koc, herbatę i plotki. 🌧️'],
  storm: ['⛈️ Nadciąga burza! Zamknij okna, schowaj krasnale, przytul kota.', '⛈️ Grzmi! Pan Henryk twierdzi, że „nic nie słyszy”. Wszyscy inni słyszą.'],
};

// ---------- strażacy ----------
export const FIREFIGHTER = [
  '„Proszę pani/pana, to już trzeci raz w tym miesiącu na tej ulicy. Poprzednio Pan Marek próbował zrobić tosta suszarką.”',
  '„Ugasiliśmy. Tylko… co to miało być? Bo wygląda jak skamielina z okresu kredy.”',
  '„Spokojnie, spokojnie. Gorzej było u pani Krystyny – podpaliła linijkę, mierząc płomień.”',
  '„Radzę zamówić pizzę. My tak robimy. I dlatego jeszcze żyjemy.”',
];

// ---------- zwroty akcji (min. 8, każdy z 3 wyborami) ----------
// fx: money, rep, buff, needs, rate (% stawki), special – obsługa w grze (warunki, losowania)
const C = (l, d, fx, msg) => ({ l, d, fx, msg });
export const EVENTS = [
  { id: 'spadek', icon: '📜', title: 'Spadek po ekscentrycznym wujku Zdzisławie',
    text: 'Notariusz w meloniku odczytuje testament: „Mojemu ulubionemu krewnemu zostawiam 15 000 zł. Pod warunkiem, że przez 3 dni nie kupi żadnego nowego mebla i nie pokłóci się z sąsiadem. Bo ja całe życie kupowałem meble i kłóciłem się z sąsiadami. I patrzcie, jak skończyłem.”',
    choices: [C('📜 Przyjmij warunki', '3 dni bez zakupów i kłótni → 15 000 zł', { special: 'spadek' }, 'Notariusz chowa testament. „Będziemy obserwować.” Kto to „my”?!'),
      C('🎩 Odrzuć z godnością', 'Nie dam się sterować zza grobu', { rep: 4, buff: 5 }, 'Cała ulica podziwia Twoją niezależność. Wujek Zdzisław pewnie przewraca się w grobie. Z uśmiechem.'),
      C('🤝 Negocjuj z notariuszem', '50% szans na 5000 zł od ręki', { special: 'spadekNeg' }, '')] },
  { id: 'rura', icon: '💧', title: 'Pękła rura w łazience!',
    text: 'Z łazienki dochodzi syk, a potem plusk. Woda sięga kostek i rośnie. Gumowa kaczka odpływa w stronę salonu jak kapitan statku.',
    choices: [C('🔧 Napraw sama/sam', 'Taśma, klucz i odwaga (zależy od Sprawności)', { special: 'ruraFix' }, ''),
      C('📞 Wezwij hydraulika (450 zł)', 'Drogo, ale pewnie', { money: -450, needs: { hygiene: -10 } }, 'Hydraulik pan Zbigniew naprawia wszystko w 15 minut i opowiada przez godzinę o swoim kocie. Wliczone w cenę.'),
      C('🙈 Zignoruj, „samo przejdzie”', 'Na pewno przejdzie…', { needs: { hygiene: -30 }, special: 'ruraIgnore' }, 'Nie przechodzi. Przy okazji odkrywasz, że kanapa nieźle pływa.')] },
  { id: 'inwestor', icon: '🕴️', title: 'Tajemniczy inwestor',
    text: 'Pod domem zatrzymuje się czarna limuzyna. Szyba zjeżdża do połowy. „Pięć tysięcy złotych. Teraz. W zamian za dziesięć procent pani/pana przyszłych zarobków. Na zawsze.” Szyba wraca na miejsce. Znowu zjeżdża. „Na zawsze.”',
    choices: [C('💰 Bierz pieniądze', '+5000 zł, stawka −8% na zawsze', { money: 5000, rate: -8 }, 'Gotówka w kopercie pachnie wanilią. Limuzyna odjeżdża bezszelestnie. Bardzo podejrzanie bezszelestnie.'),
      C('🙅 Odmów', 'Twoja przyszłość nie jest na sprzedaż', { rep: 2, buff: 6 }, 'Szyba zamyka się z obrażonym piskiem. Limuzyna odjeżdża… i zatrzymuje się pod domem Pana Marka. Oho.'),
      C('🔎 Zajrzyj do limuzyny', 'Kim on jest?!', { special: 'inwestorPeek' }, '')] },
  { id: 'kontrola', icon: '🧾', title: 'Kontrola skarbowo-osiedlowa',
    text: 'Dwie osoby w identycznych beżowych płaszczach: „Kontrola skarbowo-osiedlowa. Sprawdzamy, czy wszystkie krasnale na posesji są zgłoszone do ewidencji. I czy rachunki się zgadzają. Głównie krasnale.”',
    choices: [C('📂 Pokaż dokumenty', 'Uczciwie – zwykle się opłaca', { special: 'kontrolaDocs' }, ''),
      C('☕ Poczęstuj kawą i sernikiem', 'Łapówka czy gościnność? (50%)', { special: 'kontrolaCake' }, ''),
      C('🪟 Ucieknij przez okno', 'Najgorszy pomysł świata', { money: -500, rep: -5, needs: { fun: 15 }, special: 'kronika:kontrola' }, 'Kontrolerzy czekają na Ciebie pod oknem. Spokojnie. Z termosem. Mandat za „ucieczkę przed ewidencją krasnali”: 500 zł.')] },
  { id: 'zdrapka', icon: '🎟️', title: 'Zdrapka na chodniku',
    text: 'Na chodniku przed domem leży nieskrobnięta zdrapka „Złoty Krasnal”. Wiatr przewraca ją na drugą stronę, jakby mówił: „no dalej”.',
    choices: [C('🪙 Zdrap!', 'Może to Twój szczęśliwy dzień', { special: 'zdrapka' }, ''),
      C('📣 Poszukaj właściciela', 'Uczciwość ponad wszystko', { rep: 5, buff: 6 }, 'Właścicielką okazuje się Pani Krystyna. Zdrapuje przy Tobie: 2 zł. Daje Ci złotówkę „znaleźnego”. Czujesz się bogatsza/y. Duchowo.'),
      C('💸 Sprzedaj Panu Markowi za 50 zł', 'Pewna gotówka', { money: 50, special: 'zdrapkaMarek' }, '')] },
  { id: 'tv', icon: '🎥', title: 'Telewizja chce nagrać Twój dom',
    text: 'Ekipa programu „Perfekcyjny Dom na Słonecznej” stoi pod drzwiami: „Jutro emisja! Chcemy pokazać pani/pana wnętrza całej Polsce. Teraz. Kamera już idzie.”',
    choices: [C('🏡 Zgódź się', 'Efekt zależy od wystroju domu', { special: 'tvShow' }, ''),
      C('🙅 Odmów', 'Prywatność ponad sławę', { buff: 3 }, 'Ekipa idzie do Pani Krystyny. Słychać, jak wyciąga linijkę, żeby zmierzyć kamerzystę.'),
      C('👉 Poleć dom sąsiada', 'Niech inni się męczą (przyjaźń +)', { special: 'tvNeighbour' }, '')] },
  { id: 'szop', icon: '🦝', title: 'Szop pracz w kuchni!',
    text: 'W kuchni coś szura. Szop pracz siedzi na blacie, w jednej łapie trzyma kanapkę, w drugiej – Twoją kartę stałego klienta z piekarni. Patrzy na Ciebie, jakby to Ty tu była/był intruzem.',
    choices: [C('🧹 Przegoń miotłą', 'Zależy od Sprawności', { special: 'szopBroom' }, ''),
      C('📞 Zadzwoń do behawiorysty zwierząt (150 zł)', 'Profesjonalnie', { money: -150, needs: { fun: 5 } }, 'Behawiorystka wyjaśnia, że szop „przeżywa trudny okres”. Wychodzi z nim pod rękę. Szop macha na pożegnanie.'),
      C('🥪 Zaprzyjaźnij się', 'Daj mu kanapkę…', { needs: { hunger: -20, fun: 25 }, buff: 10, special: 'kronika:szop' }, 'Szop zjada kanapkę, mruga i od teraz codziennie o 18:00 przychodzi pod Twoje okno. Nazywasz go Zbyszek.')] },
  { id: 'teleturniej', icon: '🎙️', title: 'Teleturniej na żywo przez telefon',
    text: 'Dzwoni radio: „Jest pani/pan na antenie programu »Kto zgarnie milion na Słonecznej«! Pytanie za 3000 zł: Ile nóg ma krasnal ogrodowy Pani Krystyny o imieniu Waldek?”',
    choices: [C('🅰️ Dwie', 'Klasyka krasnalowa', { special: 'quiz:0' }, ''), C('🅱️ Trzy – jedna jest zapasowa', 'Pani Krystyna jest przezorna', { special: 'quiz:1' }, ''), C('🅲 Waldek nie ma nóg, Waldek ma wąsy', 'Szalona intuicja', { special: 'quiz:2' }, '')], quizOk: 0 },
  { id: 'bank', icon: '🏦', title: 'Pomyłka banku',
    text: 'Telefon z banku nie dzwoni. Za to na koncie pojawia się przelew: 9 999 zł z tytułem „premia dla Prezesa Wiśniewskiego”. Ty nie jesteś Prezesem Wiśniewskim. Chyba.',
    choices: [C('📞 Zgłoś i oddaj', 'Uczciwość nagradzana', { rep: 4, buff: 8, special: 'bankReturn' }, 'Bank dziękuje i w nagrodę przysyła… długopis z logo. Prezes Wiśniewski przysyła bombonierkę. Lepiej.'),
      C('🤫 Zatrzymaj', 'Może nikt nie zauważy (70% że zauważy)', { money: 9999, special: 'bankKeep' }, 'Konto wygląda pięknie. Serce bije trochę szybciej przy każdym dzwonku telefonu.'),
      C('🐈 Przekaż na Kocią Radę', 'Ktoś musi finansować koty w płaszczach', { needs: { fun: 20 }, special: 'bankCats' }, '')] },
];

// ---------- mikro-wydarzenia (żeby ciągle coś się działo) ----------
// w – pogoda, przy której ma sens (opcjonalnie); fx – drobne efekty
const M = (t, fx = {}, w) => ({ t, fx, w });
export const MICRO = [
  M('🌬️ Wiatr porwał Twoje pranie. Jedna skarpetka wylądowała na głowie krasnala Pani Krystyny. Pasuje mu.', { fun: 5 }, ['cloud', 'rain', 'storm']),
  M('🐦 Sroka ukradła łyżeczkę z parapetu. Patrzy z dachu z miną kolekcjonera.', { fun: 3 }),
  M('📮 W skrzynce list: „Wygrałaś/eś wycieczkę na Księżyc! Wystarczy wpłacić 9,99 zł”. Do kosza.', { fun: 2 }),
  M('🍕 Dostawca pomylił adresy i zostawił pizzę. Pyszna. Sąsiad z naprzeciwka – mniej zadowolony.', { hunger: 35, fun: 5 }),
  M('🎺 Ktoś na ulicy ćwiczy na trąbce. Fałszuje. Z pasją. Od godziny.', { fun: -4 }),
  M('🐌 Ślimak przemierza taras. Kibicujesz mu przez 10 minut. Wygrywa.', { fun: 6 }),
  M('☎️ Telefon: „Czy rozmawiam z właścicielem lodówki? To proszę ją złapać, bo ucieka!”. Klasyka.', { fun: 6 }),
  M('🌈 Po deszczu nad ulicą tęcza. Pani Krystyna mierzy jej długość. Wynik: „za krzywa”.', { fun: 6, social: 3 }, ['sun', 'cloud']),
  M('🧦 W pralce zniknęła kolejna skarpetka. Teoria spiskowa nabiera kształtów.', { fun: 2 }),
  M('🐿️ Wiewiórka zakopała orzecha w Twojej doniczce. To teraz jej doniczka. Takie prawo.', { fun: 4 }),
  M('💌 Na wycieraczce różyczka bez liściku. Kto?! Kiedy?! Dlaczego tylko jedna?!', { social: 6, fun: 3 }),
  M('☔ Parasol wywinął się na lewą stronę. Wyglądasz jak tulipan w stresie.', { fun: 3, hygiene: -5 }, ['rain', 'storm']),
  M('🐸 Po deszczu w ogrodzie koncert żab. Na bis grają „Miłość w promocji”.', { fun: 5 }, ['rain']),
  M('🛸 Nad ulicą przeleciało coś dziwnego. Pan Henryk mówi, że to jego dron. Dron mrugał trzema oczami.', { fun: 7 }),
  M('🦝 Szop Zbyszek macha do Ciebie zza płotu. Ma na głowie Twoją czapkę sprzed tygodnia.', { fun: 6 }),
  M('🎈 Balon z napisem „Wszystkiego najlepszego, Krystyno!” odlatuje nad dachami. Pani Krystyna goni go z linijką.', { fun: 5 }),
];
