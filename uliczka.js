// „Żyjąca Uliczka”: niezapowiedziani goście pod drzwiami, dzienny rejestr zdarzeń i poranna Kronika,
// a do tego tajemniczy Pan w Kapeluszu. Same dane; okna, postacie i efekty obsługuje gra.
// Efekty wyboru (fx): rel (V = gość), rep (reputacja na osiedlu), buff, money, needs, special
// W tekstach: {v} = imię gościa, {me} = imię gracza

const C = (l, d, fx, msg) => ({ l, d, fx, msg });
export const VISITS = [
  { id: 'ciasto', icon: '🥧', npc: true, title: 'Sąsiadka z ciastem', text: '{v} stoi na ganku z blachą szarlotki i błyskiem w oku. „Upiekłam/em za dużo… a przy okazji, słyszałaś/eś najnowsze?”',
    choices: [C('🏡 Wpuść i ugość', 'Kawa, ciasto i plotki', { rel: { V: 10 }, rep: 1, needs: { hunger: 25, social: 25 }, special: 'secret' }, '{v} zostaje na dwie kawy i trzy plotki. Szarlotka jest boska.'),
      C('🙂 Spław dyplomatycznie', 'Grzecznie, ale krótko', { rel: { V: -2 }, needs: { hunger: 15 } }, '„Dziękuję, ale mam spotkanie!” {v} zostawia ciasto i wychodzi lekko zawiedziona/y.'),
      C('🔎 Wypytaj ostro', '„Skąd wiesz takie rzeczy?”', { rel: { V: -6 }, special: 'clue' }, '{v} się czerwieni i wypala coś, czego chyba nie miał(a) mówić…')] },
  { id: 'cukier', icon: '🍬', npc: true, title: 'Pożyczka cukru', text: '{v}: „Cześć! Masz może szklankę cukru? Albo dwie? Albo… mogę wejść na chwilkę i zobaczyć, jak się urządziłaś/eś?”',
    choices: [C('🏡 Wpuść do środka', '{v} obejrzy Twoje meble…', { rel: { V: 6 }, special: 'tour' }, '{v} wchodzi, rozgląda się i rusza na obchód salonu.'),
      C('🙂 Podaj cukier w drzwiach', 'Szybko i miło', { rel: { V: 4 } }, '„Dzięki! Oddam… kiedyś.” Nigdy nie oddają.'),
      C('🔎 Wypytaj ostro', '„Po co komu dwie szklanki cukru o tej porze?”', { rel: { V: -4 }, special: 'secret' }, '{v} jąka się, że „to do… eksperymentu”. Przy okazji zdradza coś ciekawego.')] },
  { id: 'paczka', icon: '📦', title: 'Paczka bez nadawcy', who: 'Kurier', text: 'Kurier wciska Ci paczkę owiniętą szarym papierem. „Nie ma nadawcy. Nie ma adresu zwrotnego. Jest za to… tykanie? Nie, chyba nie. Pa!”',
    choices: [C('📂 Otwórz na własne ryzyko', 'Może skarb, może brokat', { special: 'open' }, ''),
      C('↩️ Odeślij do nadawcy', 'Bezpiecznie i nudno', { rep: 2 }, 'Paczka wraca do sortowni. Kurier wzdycha jak ktoś, kto widział już wszystko.'),
      C('🗄️ Schowaj w szafie', 'Niech poczeka…', { special: 'hide' }, 'Paczka ląduje w szafie. Czasem coś w niej… szeleści.')] },
  { id: 'klient', icon: '💼', title: 'Dawny klient w potrzebie', who: 'Klient', text: '',
    choices: [C('🏡 Pomóż od ręki', 'Męczące, ale wdzięczny klient', { needs: { energy: -15 }, money: 180, special: 'work+' }, 'Siadacie przy stole i po godzinie wszystko jest jasne. Klient płaci z nawiązką.'),
      C('🙂 Umów termin na jutro', 'Profesjonalnie', { rep: 1, special: 'work0' }, '„Jutro o dziesiątej? Świetnie.” Klient wychodzi uspokojony.'),
      C('🔎 Odpraw ostro', '„To nie są godziny przyjęć!”', { rep: -3, special: 'work-' }, 'Klient odchodzi, mamrocząc coś o „opiniach w internecie”.')] },
  { id: 'inspektor', icon: '📏', title: 'Inspektor Rady Osiedla', who: 'Inspektor Rady', text: 'Mężczyzna w kamizelce odblaskowej i z miarką zwijaną: „Kontrola estetyki ogrodu z ramienia Rady Osiedla. Pani Krystyna przesyła pozdrowienia… i ten formularz na 12 stron.”',
    choices: [C('🏡 Wpuść i oprowadź', 'Ocena zależy od wystroju', { special: 'inspect+' }, ''),
      C('🙂 Spław dyplomatycznie', '„Może w przyszłym tygodniu?”', { rep: -1 }, 'Inspektor zapisuje: „Kontrola utrudniona. Uśmiech podejrzanie szeroki”.'),
      C('🔎 Wypytaj o przepisy', 'Na jakiej podstawie?', { special: 'inspect?' }, '')] },
  { id: 'akwizytor', icon: '🧹', title: 'Akwizytor cudownego odkurzacza', who: 'Akwizytor', text: '„Dzień dobry! Odkurzacz „Turbo-Zen 3000” odkurza, medytuje i opowiada dowcipy. Tylko dziś 300 zł zamiast 2999!”',
    choices: [C('💸 Kup (300 zł)', 'Co może pójść nie tak?', { money: -300, special: 'vacuum' }, ''),
      C('🙂 Podziękuj grzecznie', 'Bez zakupów', {}, 'Akwizytor zostawia ulotkę i rusza do Pana Marka. Słychać, jak Pan Marek chowa się za firanką.'),
      C('🔎 Wypytaj o gwarancję', 'Złap go za słowo', { needs: { fun: 15 } }, 'Gwarancja obowiązuje „do końca rozmowy”. Akwizytor wycofuje się tyłem z dziwnym ukłonem.')] },
  { id: 'dzieci', icon: '🧒', title: 'Dzieciaki z puszką', who: 'Dzieci z sąsiedztwa', text: 'Trójka dzieciaków z puszką i rysunkiem: „Zbieramy na wycieczkę do zoo! Albo na lody. Raczej na zoo. Może na lody w zoo!”',
    choices: [C('💰 Wrzuć 50 zł', 'Hojnie', { money: -50, rep: 4, buff: 8 }, 'Dzieciaki piszczą z radości i rysują Cię kredą na chodniku. Z koroną.'),
      C('🍬 Daj słodycze', 'Kompromis', { rep: 2, needs: { fun: 8 } }, '„Dzięki! Ale następnym razem kasa!” – negocjują jak profesjonaliści.'),
      C('🔎 Zapytaj o szczegóły wycieczki', 'Kto organizuje?', { rep: -2, needs: { fun: 12 } }, 'Po trzecim pytaniu dzieci przyznają, że chodzi o lody. Szczerość doceniona, ale reputacja leci.')] },
  { id: 'pies', icon: '🐕', npc: true, title: 'Zgubiony pies', text: 'Na wycieraczce siedzi mokry kundelek z obrożą. Na adresówce: „Jestem psem {v}. Jeśli mnie znalazłeś, to znaczy, że znowu uciekłem.”',
    choices: [C('🏡 Wpuść, wytrzyj i odprowadź do domu', 'Dobry uczynek', { rel: { V: 15 }, rep: 3, needs: { fun: 12 } }, '{v} płacze ze szczęścia i obiecuje Ci słoik domowych ogórków. Pies liże Cię po nosie.'),
      C('🙂 Zadzwoń do właściciela', 'Szybko i skutecznie', { rel: { V: 8 } }, '{v} przybiega w kapciach. „Dziękuję! Znowu podkopał się pod płotem!”'),
      C('🔎 Przesłuchaj psa', '„No, mów, gdzie byłeś?”', { needs: { fun: 20 }, special: 'clue' }, 'Pies patrzy wymownie w stronę jednego z domów i szczeka trzy razy. To coś znaczy. Prawda?')] },
  { id: 'ankieta', icon: '📋', title: 'Ankieter „Badania szczęścia osiedli”', who: 'Ankieter', text: '„Dzień dobry, badamy szczęście na osiedlach. W skali od 1 do 10, jak szczęśliwa/y jest Pani/Pan? I czy sąsiedzi są…” – ścisza głos – „…normalni?”',
    choices: [C('🏡 Odpowiadaj szczerze i długo', 'Wylej żale', { needs: { social: 20 }, rep: -1, buff: 10 }, 'Po 40 minutach ankieter wygląda na wykończonego, a Ty – na odrodzoną/odrodzonego.'),
      C('🙂 Wszystko jest wspaniale!', 'Dyplomatycznie', { rep: 2 }, 'Ankieter notuje: „Respondent podejrzanie zadowolony”.'),
      C('🔎 Kto zamówił te badania?', 'Podejrzane', { special: 'clue' }, '„Hmm… Rada Osiedla. To znaczy – nie mogę powiedzieć.” Przypadkiem pokazuje Ci kartkę z listą pytań o sąsiadów.')] },
  { id: 'listonosz', icon: '🏃', npc: 'marek', title: 'Uciekinier przed listonoszem', text: 'Pan Marek wpada na ganek blady jak ściana: „Schowaj mnie! Listonosz! Ma polecony! Ja nie mogę… nie dzisiaj…”',
    choices: [C('🏡 Ukryj go w szafie', 'Solidarność sąsiedzka', { rel: { V: 14 }, needs: { fun: 15 } }, 'Listonosz dzwoni, czeka, odchodzi. Marek wychodzi z szafy z Twoim szalikiem i wdzięcznością na wieki.'),
      C('🙂 Wydaj go listonoszowi', '„Pan Marek jest tutaj!”', { rel: { V: -10 }, rep: 2 }, 'Marek odbiera list z rękami drżącymi jak galaretka. To było… wezwanie na przegląd kominiarski.'),
      C('🔎 Zapytaj, czego się boi', 'Wyciągnij prawdę', { rel: { V: -3 }, special: 'secret' }, 'Marek szepcze coś o „trzech poleconych w zeszłym roku” i przy okazji zdradza cudzy sekret.')] },
  { id: 'kwiaty', icon: '💐', npc: true, title: 'Bukiet od wielbiciela', text: '{v} stoi z bukietem róż i wyraźnie się denerwuje. „To… dla ciebie. Bez okazji. Po prostu… pomyślałam/em.”',
    choices: [C('🏡 Przyjmij i zaproś na herbatę', 'Romantycznie…', { rel: { V: 8 }, romance: 12, special: 'jealous' }, '{v} rumieni się po uszy. Herbata trwa dwie godziny.'),
      C('🙂 Podziękuj ciepło, ale jasno', 'Bez złamanych serc', { rel: { V: 3 } }, '„Rozumiem… ale róże i tak są twoje.” {v} odchodzi z godnością.'),
      C('🔎 Zapytaj, kto go namówił', 'Coś tu śmierdzi…', { rel: { V: -5 }, needs: { fun: 10 } }, '{v} przyznaje, że to był zakład z kumplami. Przegrał(a). Albo wygrał(a). Nikt już nie wie.')] },
  { id: 'kapelusz', icon: '🎩', mystery: true, title: 'Pan w Kapeluszu', who: 'Pan w Kapeluszu', text: '', choices: [] },
];

// ---------- tajemnica Pana w Kapeluszu (3 spotkania, 3 zagadki) ----------
export const HAT = [
  { intro: 'Na ganku stoi ktoś w długim płaszczu i melonie naciągniętym na oczy. Jest dziwnie wysoki i… lekko się chwieje. Bez słowa podaje Ci kopertę. Na kopercie: odcisk łapki.', riddle: 'Rano chodzę na czterech, w południe na czterech, wieczorem na czterech, a nocą po klawiaturze. Kim jestem?',
    opts: ['Kot', 'Stół', 'Pan Marek po imprezie'], ok: 0, win: 'Postać kiwa melonem z uznaniem, zostawia na wycieraczce mały złoty kluczyk i odchodzi dziwnym, kołyszącym krokiem. Słychać ciche „mrrr”.', item: '🗝️ złoty kluczyk' },
  { intro: 'Znowu On. Płaszcz, melon, chwianie. Z rękawa wysuwa się… czy to był ogon? Podaje Ci drugą kartkę.', riddle: 'Nie ma zamka, a strzeże skarbów. Śpi w nim ktoś, kto nigdy nie płaci czynszu. Co otwiera złoty kluczyk?',
    opts: ['Skrytkę w banku', 'Pudełko po butach', 'Szafę Pani Krystyny'], ok: 1, win: 'W pudełku po butach, które od miesięcy stoi pod Twoim łóżkiem, znajdujesz… idealnie poukładane kocie kłaczki i karteczkę: „Prawie. Jeszcze jedna próba.”', item: '📦 pudełko z kłaczkami' },
  { intro: 'Trzecia wizyta. Pan w Kapeluszu wygląda na zdenerwowanego. Płaszcz faluje, jakby coś pod nim się kłóciło. „Ostatnie pytanie” – mówi głos, który brzmi jak trzy głosy naraz.', riddle: 'Kto naprawdę rządzi Słoneczną Uliczką?',
    opts: ['Rada Osiedla', 'Pani Krystyna i jej linijka', 'Koty'], ok: 2, win: 'Melon spada. Płaszcz rozchyla się i… z hukiem wysypują się z niego TRZY KOTY stojące jeden na drugim. Najwyższy otrzepuje futro, kłania się i mówi (tak, mówi): „Miau. Uznaliśmy, że jesteś godna/y. Od dziś ta ulica jest pod ochroną Kociej Rady”. Potem wszystkie trzy znikają w żywopłocie. Na wycieraczce zostaje 777 zł w kocich zabawkach. I w gotówce.', item: '🐈 błogosławieństwo Kociej Rady' },
];
export const HAT_WRONG = ['Postać przez chwilę milczy, potem kręci melonem: „Hmm. Nie. Jeszcze nie”. Odchodzi, a z płaszcza wypada sucha karma.', '„Nie” – mówi Pan w Kapeluszu głosem przypominającym mruczenie. Zostawia na ganku kłębek włóczki i znika.'];

// ---------- paczka bez nadawcy ----------
export const PACKAGE = [
  { p: 0.3, icon: '🎁', t: 'W środku: 400 zł w kopercie i liścik „Za wszystko. Wiesz za co.” Nie wiesz. Ale bierzesz.', fx: { money: 400, buff: 10 } },
  { p: 0.25, icon: '🦆', t: '200 gumowych kaczek. Każda ma wypisane inne imię. Jedna ma Twoje. Nie wiadomo, czy to prezent, czy groźba.', fx: { needs: { fun: 30 }, rep: 1 } },
  { p: 0.25, icon: '✨', t: 'BROKAT. Bomba brokatowa. Jesteś teraz błyszcząca/y jak kula dyskotekowa. Na najbliższe 3 tygodnie.', fx: { needs: { hygiene: -45, fun: 10 }, rep: -1 } },
  { p: 0.2, icon: '🧌', t: 'Krasnal ogrodowy z karteczką: „Pilnuj go. Oni nadchodzą”. Kim są „oni”? Krasnal milczy. Krasnale zawsze milczą.', fx: { needs: { fun: 15 }, buff: 5 } },
];

// ---------- Kronika: szablony artykułów z rejestru zdarzeń ----------
// t: typ zdarzenia z dailyEventsLog; h/x: nagłówek/tekst ({me}, {npc}, {item}, {title}, {house}, {v}, {dish}); rep: wpływ na reputację
const A = (h, x, rep) => ({ h, x, rep });
export const ARTICLES = {
  klotnia_dom: [A('Czy w {house} wybuchł kryzys? Sąsiedzi słyszeli podniesione głosy!', 'Według relacji Pani z naprzeciwka „talerze nie latały, ale były tego bliskie”. Redakcja apeluje o ciszę po 22:00.', -3)],
  klotnia: [A('Awantura na chodniku! {me} i {npc} nie przebierali w słowach', 'Świadkowie mówią o „wymianie zdań o wysokiej temperaturze”. Pan Henryk twierdzi, że nic nie słyszał. Podobno nagrywał.', -3), A('Ostra wymiana zdań na Słonecznej', '{me} kontra {npc}: kto wygrał? Ulica jest podzielona, a ławka przed sklepem huczy od komentarzy.', -2)],
  noc: [A('Kto spaceruje po Słonecznej o północy?', 'Nocny dyżur Rady odnotował: {me} wychodzi z domu po 23:00. Spotkanie? Romans? Śledztwo? Redakcja nie śpi i obserwuje.', -1), A('Nocne życie na Słonecznej Uliczce', '{me} wraca do domu o porze, o której porządni ludzie już śnią o trawnikach. Pani Krystyna zanotowała godzinę. Dwa razy.', -1)],
  awans: [A('Kariera jak z bajki! {me} awansuje na stanowisko: {title}', 'Redakcja gratuluje i przypomina, że awans to idealna okazja, by w końcu przyciąć żywopłot.', 4), A('Mamy na ulicy nowego szefa! {me}: {title}', 'Sąsiedzi już planują, o jakie przysługi poprosić. Pan Marek pyta, czy to oznacza grilla.', 3)],
  sukces: [A('Sukces z naszej ulicy! {me} zachwyca klientów', 'Projekt „{item}” zebrał świetne recenzje. Ulica jest dumna, a konkurencja zgrzyta zębami.', 3)],
  wpadka: [A('Zawodowa wpadka? {me} ma za sobą gorszy dzień', 'Nieoficjalnie: „{item}” nie poszedł zgodnie z planem. Oficjalnie: redakcja nic nie wie. Ale wie.', -2)],
  zakup: [A('Nowy luksusowy zakup na ulicy – czyżby ktoś próbował przyćmić Radę Osiedla?', 'Nowy nabytek: „{item}” za {price} zł. Kupujący: {me}. Pani Krystyna podobno już mierzy swój salon linijką.', 2), A('Luksus wjeżdża na Słoneczną! {item} za {price} zł', 'Kurierzy dźwigali, sąsiedzi patrzyli zza firanek. Szczęśliwy nabywca: {me}. Szacowana zazdrość: bezcenna.', 1)],
  gosc: [A('Ruch pod drzwiami! {v} z wizytą', 'Redakcja odnotowała wizytę: {v}. Szczegóły spotkania owiane tajemnicą, ale firanki falowały.', 1)],
  gosc_zly: [A('Chłodne przyjęcie na progu', '{v} odchodzi sprzed drzwi z miną „nigdy więcej”. Gościnność na Słonecznej przeżywa kryzys?', -2)],
  pozar: [A('Dym nad Słoneczną! {me} kontra {dish} – wygrała patelnia', 'Czujnik dymu zagrał solo, a zapach spalenizny dotarł aż do parku. Redakcja poleca kurs gotowania. I gaśnicę.', -2)],
  premiera: [A('„{item}” – recenzja wielkiej premiery', 'Wielka premiera rozbudziła emocje na całej ulicy. Pan Marek twierdzi, że był na sali. Nie był.', 3)],
  kapelusz: [A('Widziano Pana w Kapeluszu! Kim jest tajemniczy gość?', 'Mieszkańcy donoszą o wysokiej, chwiejnej postaci w płaszczu, która pojawia się pod drzwiami jednego z domów. Ktoś słyszał mruczenie. Policja „nie komentuje kotów”.', 0)],
  pozar_straz: [A('STRAŻ POŻARNA NA SŁONECZNEJ! {me} kontra kuchenka – 0:1', 'Trzy wozy, jedna patelnia i tłum gapiów. Strażak komentował: „Widziałem wiele, ale to…”. Redakcja zaleca: zamawiajcie pizzę.', -4)],
  pozar_ugaszony: [A('Bohaterski wieczór z gaśnicą! {me} ratuje kuchnię', 'Szybka reakcja uratowała dom i połowę obiadu. Druga połowa pokryta pianą. Smacznego!', 2)],
  burza: [A('Burza stulecia nad Słoneczną!', 'Pioruny, ulewa i krasnale pływające w rynsztoku. Pan Henryk twierdzi, że „nic nie słyszał”. Wszyscy inni – owszem.', 0)],
  awaria: [A('Ciemność na Słonecznej! Awaria prądu', 'W wielu domach zgasło światło. U niektórych sąsiadów widziano tylko blask kominka i świeczek. Romantycznie? Podejrzanie?', 0)],
  kopniecie: [A('Fryzura „na piorun”! Bezpieczniki kontra {me}', 'Naprawa skrzynki bezpieczników zakończyła się nową, odważną fryzurą. Stylistki z Paryża już dzwonią.', -1)],
  spadek_ok: [A('Spadek po wujku Zdzisławie trafia do rąk: {me}!', '15 000 zł za 3 dni bez zakupów i kłótni. Pani Krystyna komentuje: „Ja bym nie wytrzymała”.', 3)],
  spadek_fail: [A('Spadek przepadł! Testament wujka Zdzisława złamany', 'Warunki nie zostały spełnione. Pieniądze trafiają do kota wujka. Kot planuje zakup kanapy.', -1)],
  rura: [A('Powódź na Słonecznej! Łazienka kontra {me} – 1:0', 'Woda dotarła aż do chodnika. Gumową kaczkę odnaleziono dwa domy dalej. Kaczka w dobrym stanie.', -2)],
  kontrola: [A('Ucieczka przez okno przed kontrolą krasnali!', 'Kontrolerzy czekali pod oknem z termosem. Mandat: 500 zł. Krasnale nadal niezgłoszone.', -3)],
  tvshow: [A('Telewizja na Słonecznej! {me} w programie „Perfekcyjny Dom”', 'Cała Polska widziała salon. Pani Krystyna oglądała z linijką przy ekranie.', 2)],
  szop: [A('Szop Zbyszek ma nowego przyjaciela', 'Codziennie o 18:00 szop pracz czeka pod jednym z okien. Przyjaciel: {me}. Zbyszek odmówił komentarza.', 1)],
  quiz: [A('Mamy geniusza! {me} wygrywa 3000 zł w radiu', 'Pytanie o nogi krasnala Waldka okazało się kluczowe. Waldek był dostępny do komentarza, ale milczał.', 2)],
  zdrapka: [A('Szczęściarz z naszej ulicy! 10 000 zł ze zdrapki', 'Wygrana: {me}. Okrzyk radości słychać było aż w piwnicy Pana Henryka.', 2)],
  bank: [A('Bank odzyskuje pieniądze! Wpadka na Słonecznej', 'Ktoś z ulicy próbował zatrzymać cudzą premię. Bank był szybszy. I doliczył opłatę.', -3)],
  afera_public: [A('SKANDAL NA PRZYJĘCIU! Sprawca afery „{item}” zdemaskowany przy toaście!', 'W trakcie toastu {me} wskazał(a) winnego: {npc}. Goście bili brawo, ktoś krzyczał „Brawo, detektywie!”. Redakcja nazywa to „najlepszym toastem sezonu”.', 6)],
  afera_cicho: [A('Tajemnicze zamieszanie na przyjęciu', 'Mówi się o aferze „{item}”, ale nikt nic nie widział, nikt nic nie wie, a wszyscy nagle są dla siebie bardzo mili. Podejrzane.', 0)],
  afera_wpadka: [A('Fałszywe oskarżenie na przyjęciu! Niewinny gość w ogniu krytyki', 'Podczas toastu gospodarz(yni) – {me} – oskarżył(a) o aferę „{item}” niewłaściwą osobę: {npc}. Część gości wyszła oburzona. Prawdziwy sprawca podobno dopił szampana.', -4)],
  afera_nierozwiazana: [A('Afera „{item}” wciąż nierozwiązana', 'Przyjęcie skończyło się, a zagadka została. Sąsiedzi zakładają się, kto to zrobił. Faworytem jest Pan Henryk. Jak zawsze.', -1)],
  impreza: [A('Wieczór, o którym mówi cała ulica: {item}!', 'Goście bawili się do późna, a Pani Krystyna przyznała imprezie ocenę „bez zastrzeżeń” (z linijką w ręku). Gospodarz/gospodyni: {me}.', 4)],
  impreza_slaba: [A('Imprezowa klapa? {item} bez fajerwerków', 'Według świadków atmosfera siadła jak suflet. Ktoś zasnął przy przekąskach. Ktoś inny – na przekąskach.', -1)],
  koty: [A('KOCIA RADA ISTNIEJE?! Wstrząsające doniesienia', 'Według niepotwierdzonych informacji trzy koty w płaszczu sprawują tajną władzę nad ulicą. Pani Krystyna zwołuje nadzwyczajne zebranie. Koty nie przyszły. Koty nigdy nie przychodzą na zebrania.', 5)],
};
export const FILLERS = [
  A('Prognoza pogody według Pana Henryka', '„Jutro będzie pogoda.” Pan Henryk prosi o niezadawanie dodatkowych pytań.', 0),
  A('Rada Osiedla: trawniki o 0,3 cm za wysokie', 'Pani Krystyna przeprowadziła pomiary o 6:00 rano. Wyniki są „niepokojące”. Linijka trafiła do dezynfekcji.', 0),
  A('Kot z numeru 5 ponownie wybrany Kotem Miesiąca', 'Konkurencja nie miała szans. Kot nie skomentował zwycięstwa. Ziewnął.', 0),
  A('Krasnale na ulicy: spis powszechny', 'Na Słonecznej Uliczce mieszka 47 krasnali. To o 3 więcej niż tydzień temu. Nikt nie wie, skąd się biorą.', 0),
  A('Pan Marek widziany o świcie przy cudzym grillu', 'Pan Marek twierdzi, że „medytował”. Grill twierdzi co innego.', 0),
  A('Ogłoszenie drobne', 'Zaginęła szklanka cukru. Ostatnio widziana w drodze do sąsiada. Uczciwego znalazcę prosimy o zwrot. Albo o ciasto.', 0),
];
export const HOUSES = { start: 'domku z cegły nr 7', town: 'szklanego pawilonu nr 3', classic: 'rezydencji nr 8', villa: 'willi Beverly Hills nr 2' };
export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
