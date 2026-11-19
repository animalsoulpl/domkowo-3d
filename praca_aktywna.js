// Aktywny moduł pracy 3D: 3 konkretne zlecenia na zmianę, natychmiastowa wypłata,
// spacery 3D z psami (Wyprowadzacz psów), aktywne przypadki behawioralne (wyższe poziomy)
// oraz współpracownicy zintegrowani z panelem Relacje (np. Kinga).
// Zero timerów i zero starych kart szansy A/B/C.

export const DOG_WALKS = [
  {
    id: 'walk_babel', breed: 'kundelek', dogName: 'Bąbel', client: 'Pani Marta',
    tag: 'Lękliwy kundelek', startComfort: 55, reward: 120,
    desc: 'Bąbel boi się gwałtownych ruchów i rowerów. Potrzebuje spokojnego tempa i dystansu.',
    route: [[-4.8, 2.2], [-1.2, 2.2], [2.4, 1.0], [5.4, -0.8], [1.8, -2.2], [-3.2, -1.6]],
    events: [
      {
        wp: 1, icon: '🚴', title: 'Przejeżdżający rowerzysta!',
        text: 'Zza zakrętu alejki nadjeżdża szybki rowerzysta. Bąbel kuli uszy i zastyga w bezruchu.',
        opts: [
          { label: 'Zejdź w bok i zwiększ dystans', sub: 'Dajesz psu bezpieczną przestrzeń', d: +22, mood: 'calm', react: 'Bąbel wypuszcza powietrze, rozluźnia uszy i spokojnie obserwuje rower z boku.' },
          { label: 'Rozrzuć smaczki w trawie', sub: 'Węszenie obniża napięcie', d: +18, mood: 'happy', react: 'Bąbel od razu opuszcza nos w trawę i z merdającym ogonem wyjada przysmaki!' },
          { label: 'Idź prosto na krótkiej smyczy', sub: 'Skracasz linkę i wymuszasz mijanie', d: -24, mood: 'stress', react: 'Bąbel napina całe ciało, kuli ogon i zaczyna nerwowo szczekać na rower!' },
        ],
      },
      {
        wp: 3, icon: '🌿', title: 'Chęć węszenia w krzakach',
        text: 'Bąbel zatrzymuje się przy kępie trawy i intensywnie łapie zapachy innych psów.',
        opts: [
          { label: 'Pozwól mu spokojnie powęszyć', sub: 'Luźna smycz, tempo psa', d: +20, mood: 'happy', react: 'Bąbel macha ogonem i po chwili sam z uśmiechem rusza dalej za Tobą!' },
          { label: 'Pochwal cicho i zachęć do dalszej drogi', sub: 'Łagodne przekierowanie', d: +10, mood: 'calm', react: 'Bąbel zerka na Ciebie z zaufaniem i spokojnie podąża ścieżką.' },
          { label: 'Szarpnij smyczą: „Idziemy!”', sub: 'Pośpiech i presja', d: -22, mood: 'stress', react: 'Bąbel cofa się spięty i nerwowo oblizuje nos.' },
        ],
      },
      {
        wp: 5, icon: '🐕', title: 'Mijanie szczekającego psa',
        text: 'Z naprzeciwka idzie mały, głośno ujadający terier. Bąbel sztywnieje.',
        opts: [
          { label: 'Zrób szeroki łuk i zasłoń Bąbla ciałem', sub: 'Łuk uspokajający', d: +22, mood: 'happy', react: 'Bąbel widzi Twoje wsparcie, odwraca głowę i spokojnie mija psa!' },
          { label: 'Rozrzuć garść smaczków za łukiem', sub: 'Skojarzenie z nagrodą', d: +16, mood: 'calm', react: 'Bąbel skupia się na szukaniu smaczków i ignoruje ujadanie.' },
          { label: 'Podejdź bliżej, „żeby się przywitały”', sub: 'Wymuszony kontakt na smyczy', d: -28, mood: 'stress', react: 'Bąbel wybucha paniką i obszczekuje teriera z napiętej smyczy!' },
        ],
      },
    ],
  },
  {
    id: 'walk_loki', breed: 'husky', dogName: 'Loki', client: 'Pan Tomasz',
    tag: 'Energiczny husky', startComfort: 60, reward: 135,
    desc: 'Loki ma niespożytą energię i ciągnie na smyczy do każdego zapachu w parku.',
    route: [[-4.2, 2.4], [0.5, 2.5], [4.8, 1.5], [5.2, -1.6], [0.2, -2.1], [-3.8, -1.0]],
    events: [
      {
        wp: 1, icon: '🌿', title: 'Krzaki pełne tropów',
        text: 'Loki ciągnie w stronę gęstych krzaków przy alejce, dysząc z ekscytacji.',
        opts: [
          { label: 'Rozrzuć smaczki w trawie na długiej lince', sub: 'Praca nosem wycisza husky', d: +22, mood: 'happy', react: 'Loki zwalnia, opuszcza nos i spokojnie wywęsza przysmaki z radosnym ogonem!' },
          { label: 'Zatrzymaj się i poczekaj na luźną smycz', sub: 'Spokojna konsekwencja', d: +14, mood: 'calm', react: 'Loki ogląda się na Ciebie, luzuje linkę i rusza równym krokiem.' },
          { label: 'Idź prosto na krótkiej smyczy', sub: 'Siłowanie się z psem', d: -20, mood: 'stress', react: 'Loki jeszcze mocniej zapiera się łapami i zaczyna frustracyjnie poszczekiwać!' },
        ],
      },
      {
        wp: 3, icon: '🏃', title: 'Biegacz na ścieżce',
        text: 'Obok Was przebiega szybki jogger — Loki natychmiast chce ruszyć w pogoń!',
        opts: [
          { label: 'Zejdź w bok i skup uwagę na sobie', sub: 'Dystans + kontakt wzrokowy', d: +20, mood: 'happy', react: 'Loki siada obok Ciebie, macha puszystym ogonem i puszcza biegacza mimo uszu!' },
          { label: 'Rzuć smaczek w przeciwną stronę', sub: 'Przekierowanie instynktu pogoni', d: +15, mood: 'calm', react: 'Loki z radością goni smaczek zamiast joggera i wraca rozluźniony.' },
          { label: 'Krzyknij „NIE!” i szarpnij krótko smycz', sub: 'Wzrost pobudzenia', d: -25, mood: 'stress', react: 'Loki nakręca się jeszcze bardziej, skacze na smyczy i głośno wyje!' },
        ],
      },
    ],
  },
  {
    id: 'walk_rex', breed: 'owczarek', dogName: 'Rex', client: 'Pani Joanna',
    tag: 'Reaktywny owczarek', startComfort: 45, reward: 150,
    desc: 'Rex łatwo spina się na widok innych psów i hałasu. Wymaga uważnego prowadzenia.',
    route: [[-5.0, 2.0], [-0.8, 1.8], [3.6, 1.8], [5.0, -1.2], [1.0, -2.0], [-4.0, -1.4]],
    events: [
      {
        wp: 1, icon: '🐕', title: 'Szczekający pies za ogrodzeniem',
        text: 'Z boku ścieżki rozlega się głośne szczekanie. Rex stawia sierść na karku i sztywnieje!',
        opts: [
          { label: 'Zejdź w bok i zwiększ dystans', sub: 'Natychmiastowe wyjście ze strefy stresu', d: +24, mood: 'calm', react: 'Rex odrywa wzrok od ogrodzenia, otrzepuje się i wraca na luźną smycz!' },
          { label: 'Rozrzuć smaczki w trawie za łukiem', sub: 'Praca węchowa na dystans', d: +20, mood: 'happy', react: 'Rex opuszcza uszy do neutralnej pozycji i z przyjemnością węszy w trawie.' },
          { label: 'Idź prosto na krótkiej smyczy', sub: 'Konfrontacja z bodźcem', d: -26, mood: 'stress', react: 'Rex rzuca się do przodu na napiętej smyczy i odpowiada głośnym szczekaniem!' },
        ],
      },
      {
        wp: 3, icon: '🚴', title: 'Rowerzysta dzwoni dzwonkiem',
        text: 'Za plecami słychać ostry dzwonek roweru. Rex obraca się gwałtownie z napiętym ogonem.',
        opts: [
          { label: 'Ustaw się między rowerem a psem + smaczki', sub: 'Bezpieczna bariera i wsparcie', d: +22, mood: 'happy', react: 'Rex uspokaja się przy Twojej nodze, a po chwili radośnie merda ogonem!' },
          { label: 'Przejdź łukiem na trawnik', sub: 'Zwiększenie przestrzeni', d: +18, mood: 'calm', react: 'Rex oddycha głębiej i spokojnie przepuszcza rowerzystę.' },
          { label: 'Przyciągnij go krótko przy samej krawędzi ścieżki', sub: 'Brak możliwości ucieczki', d: -24, mood: 'stress', react: 'Rex wpada w silny stres i zaczyna szczekać na mijający rower!' },
        ],
      },
      {
        wp: 5, icon: '🛍️', title: 'Szeleszcząca reklamówka na wietrze',
        text: 'Wiatr podrywa foliową torbę tuż przed nosem Rexa.',
        opts: [
          { label: 'Daj mu czas, żeby sam powąchał z dystansu', sub: 'Kontrolowana eksploracja', d: +18, mood: 'happy', react: 'Rex robi krok do przodu, obwąchuje torbę i dumnie merda ogonem!' },
          { label: 'Omiń spokojnym łukiem', sub: 'Spokojne prowadzenie', d: +12, mood: 'calm', react: 'Rex nie daje się sprowokować i grzecznie idzie obok Ciebie.' },
          { label: 'Pchnij go w stronę torby, „żeby się nie bał”', sub: 'Zalewanie bodźcem (flooding)', d: -22, mood: 'stress', react: 'Rex odskakuje przerażony z podkulonym ogonem!' },
        ],
      },
    ],
  },
];

// Aktywne przypadki na placu treningowym dla wyższych stanowisk (Młodszy trener, Behawiorysta psów i wyżej)
export const DOG_CASES = [
  {
    id: 'case_kora', breed: 'owczarek', dogName: 'Kora', client: 'Pan Piotr',
    issue: 'Silna reaktywność na krótkiej obroży — kuli uszy, ciało sztywne, szczeka na wszystko wokół.',
    startComfort: 25, reward: 220,
    steps: [
      {
        prompt: 'Kora stoi sztywno na krótkiej obroży, kuli uszy i nerwowo obszczekuje plac. Od czego zaczynasz sesję?',
        opts: [
          { tool: 'harness', label: '🦮 Zmień obrożę na szelki z długą linką', sub: 'Zdejmuje nacisk z szyi i daje swobodę ruchu', d: +38, mood: 'calm', react: 'Kora natychmiast przestaje się dusić na obroży, rozluźnia kark i głęboko wzdycha!' },
          { tool: 'mat', label: '🧶 Rozłóż matę węchową tuż pod nosem', sub: 'Węszenie uspokaja, choć obroża wciąż ciśnie', d: +20, mood: 'calm', react: 'Kora na chwilę węszy, ale krótka obroża nadal ją spina.' },
          { tool: 'force', label: '📢 Wydaj stanowczą komendę „SIAD!”', sub: 'Presja przy wysokim stresie', d: -15, mood: 'stress', react: 'Kora jeszcze bardziej kuli uszy i zaczyna głośno szczekać!' },
        ],
      },
      {
        prompt: 'Kora już lepiej oddycha, ale wciąż nerwowo skanuje wzrokiem plac. Jakie narzędzie teraz dobierasz?',
        opts: [
          { tool: 'mat', label: '🧶 Rozłóż matę węchową na trawie', sub: 'Naturalne węszenie obniża kortyzol', d: +35, mood: 'happy', react: 'Kora z entuzjazmem zanurza nos w macie węchowej — ogon zaczyna radośnie merdać!' },
          { tool: 'distance', label: '↔️ Praca na dystans i spokojne łuki', sub: 'Budowanie poczucia bezpieczeństwa', d: +28, mood: 'happy', react: 'Kora rozluźnia sylwetkę i z ufnością podąża za Tobą po łuku.' },
          { tool: 'force', label: '⏱️ Podejdź od razu do przeszkody agility', sub: 'Za wcześnie na trudne ćwiczenia', d: -18, mood: 'stress', react: 'Kora zastyga w miejscu i odmawia współpracy.' },
        ],
      },
    ],
  },
  {
    id: 'case_max', breed: 'husky', dogName: 'Max', client: 'Pani Karolina',
    issue: 'Przebodźcowany husky — nie potrafi się wyciszyć na placu, biega w kółko i szczeka z frustracji.',
    startComfort: 30, reward: 245,
    steps: [
      {
        prompt: 'Max jest mocno pobudzony, biega nerwowo na krótkim sznurku i szczeka. Które narzędzie użyjesz najpierw?',
        opts: [
          { tool: 'mat', label: '🧶 Mata węchowa z ukrytymi przysmakami', sub: 'Przełącza mózg z pobudzenia na spokojne węszenie', d: +38, mood: 'calm', react: 'Max natychmiast opuszcza głowę, zaczyna spokojnie węszyć i przestaje szczekać!' },
          { tool: 'distance', label: '↔️ Praca na dystans z dala od bodźców', sub: 'Wyciszenie w spokojnym kącie placu', d: +26, mood: 'calm', react: 'Max zwalnia oddech i zaczyna łapać z Tobą kontakt wzrokowy.' },
          { tool: 'force', label: '🎾 Rzuć mu piłkę, żeby się wybiegał', sub: 'Jeszcze bardziej podbija adrenalinę', d: -16, mood: 'stress', react: 'Max nakręca się do granic możliwości i nie słyszy już niczego!' },
        ],
      },
      {
        prompt: 'Max wyraźnie się wyciszył. Jak utrwalisz ten spokój na placu?',
        opts: [
          { tool: 'harness', label: '🦮 Szelki z długą linką i spokojny spacer łukiem', sub: 'Swobodna eksploracja bez ciągnięcia', d: +34, mood: 'happy', react: 'Max idzie miękkim krokiem, wesoło merda ogonem i uśmiecha się do opiekunki!' },
          { tool: 'distance', label: '↔️ Nagradzanie spokojnego patrzenia na dystans', sub: 'Wzmacnianie opanowania', d: +30, mood: 'happy', react: 'Max kładzie się rozluźniony i z merdającym ogonem obserwuje plac!' },
          { tool: 'force', label: '📢 Przyspiesz trening posłuszeństwa', sub: 'Zbyt szybki powrót do presji', d: -15, mood: 'stress', react: 'Max znów zaczyna nerwowo podskakiwać.' },
        ],
      },
    ],
  },
  {
    id: 'case_fiona', breed: 'kundelek', dogName: 'Fiona', client: 'Pan Marek S.',
    issue: 'Lękliwa sunia po adopcji — trzęsie się, kuli uszy i boi się zbliżyć do opiekuna na otwartym placu.',
    startComfort: 20, reward: 260,
    steps: [
      {
        prompt: 'Fiona stoi skulona w rogu placu, kuli uszy i boi się otwartej przestrzeni. Co wybierasz?',
        opts: [
          { tool: 'distance', label: '↔️ Praca na dystans — przykucnij bokiem i daj przestrzeń', sub: 'Sygnały uspokajające budują zaufanie', d: +40, mood: 'calm', react: 'Fiona prostuje uszy, robi dwa nieśmiałe kroki w Twoją stronę i powoli macha ogonem!' },
          { tool: 'mat', label: '🧶 Połóż matę węchową między Wami', sub: 'Bezpieczna zachęta bez kontaktu wzrokowego', d: +32, mood: 'calm', react: 'Fiona podchodzi ostrożnie do maty i z ulgą zaczyna węszyć.' },
          { tool: 'force', label: '🤗 Podejdź wprost i pogłaszcz ją po głowie', sub: 'Przekroczenie granic lękliwego psa', d: -18, mood: 'stress', react: 'Fiona kuli się jeszcze bardziej i ucieka na koniec smyczy.' },
        ],
      },
      {
        prompt: 'Fiona nabrała odwagi i podchodzi bliżej! Jak zakończysz sesję sukcesem?',
        opts: [
          { tool: 'mat', label: '🧶 Mata węchowa + ciche pochwały', sub: 'Pozytywne zakończenie sesji', d: +38, mood: 'happy', react: 'Fiona z radością wywęsza ostatnie smaczki i radośnie merda ogonem przy Twoich nogach!' },
          { tool: 'harness', label: '🦮 Delikatne dopasowanie szelek z długą linką', sub: 'Komfort na przyszłe spacery', d: +32, mood: 'happy', react: 'Fiona swobodnie przechadza się po placu — pełen sukces behawioralny!' },
          { tool: 'force', label: '🐕 Wprowadź od razu drugiego psa na plac', sub: 'Zbyt trudny bodziec na pierwszą sesję', d: -20, mood: 'stress', react: 'Fiona ponownie wpada w lęk i cofa się pod ogrodzenie.' },
        ],
      },
    ],
  },
];

// Zlecenia dla pozostałych karier (3 konkretne aktywne zlecenia na zmianę, zero A/B/C kart szansy!)
export const CAREER_ORDERS = {
  med: [
    { icon: '🩺', title: 'Konsultacja pacjenta z gorączką', reward: 140, prompt: 'Pacjent zgłasza osłabienie i wysoką temperaturę. Jak prowadzisz badanie?', opts: [
      { label: 'Pełny wywiad, pomiar parametrów i plan leczenia', d: +100, react: 'Pacjent odetchnął z ulgą i dziękuje za dokładną opiekę!' },
      { label: 'Szybkie badanie podstawowe i recepta', d: +70, react: 'Sprawna wizyta — pacjent zadowolony.' },
    ] },
    { icon: '💉', title: 'Przygotowanie zabiegu i analiza wyników', reward: 165, prompt: 'Przyszły wyniki badań laboratoryjnych pilnego pacjenta.', opts: [
      { label: 'Dokładna weryfikacja wskaźników i dobór dawki', d: +100, react: 'Bezbłędna diagnoza — zespół chwali Twoją precyzję!' },
      { label: 'Standardowy protokół leczenia', d: +75, react: 'Zabieg przebiegł bez komplikacji.' },
    ] },
    { icon: '🏥', title: 'Obchód i wypis z zaleceniami', reward: 155, prompt: 'Pacjent wraca do domu i prosi o jasne wskazówki rekonwalescencji.', opts: [
      { label: 'Rozpisz dokładny plan leków i diety', d: +100, react: 'Rodzina pacjenta zostawia ciepłe podziękowania!' },
      { label: 'Przekaż krótką ulotkę informacyjną', d: +70, react: 'Wypis zakończony sprawnie.' },
    ] },
  ],
  cook: [
    { icon: '🍳', title: 'Zamówienie specjalne: risotto z borowikami', reward: 130, prompt: 'Gość VIP zamówił kremowe risotto z idealnym balansem smaku.', opts: [
      { label: 'Powoli redukuj bulion i wykończ parmezanem', d: +100, react: 'Gość zachwycony — zostawia wysoki napiwek!' },
      { label: 'Przygotuj w przyspieszonym tempie', d: +70, react: 'Danie wydane na czas, całkiem smaczne.' },
    ] },
    { icon: '🍰', title: 'Deser dnia na ważną rocznicę', reward: 150, prompt: 'Para przy stoliku nr 4 świętuje rocznicę — proszą o wyjątkowy deser.', opts: [
      { label: 'Udekoruj świeżymi owocami i ciepłym sosem czekoladowym', d: +100, react: 'Brawa na sali! Goście robią zdjęcia Twojemu deserowi!' },
      { label: 'Podaj klasyczną porcję z karty', d: +75, react: 'Miły akcent na koniec kolacji.' },
    ] },
    { icon: '🍲', title: 'Szczyt obiadowy — wydawka 3 stolików naraz', reward: 160, prompt: 'Kuchnia pełna zamówień, trzeba zgrać temperaturę i czas wydania.', opts: [
      { label: 'Zorganizuj stanowisko i wydaj wszystkie dania gorące', d: +100, react: 'Perfekcyjny serwis — zero reklamacji!' },
      { label: 'Wydawaj po kolei, jak tylko będą gotowe', d: +70, react: 'Wszystkie stoliki obsłużone.' },
    ] },
  ],
  it: [
    { icon: '💻', title: 'Naprawa krytycznego błędu przed releasem', reward: 160, prompt: 'W logach pojawił się crash na ekranie logowania klientów.', opts: [
      { label: 'Odtwórz błąd, napisz test i wdróż czystą poprawkę', d: +100, react: 'Build zielony! Zespół docenia bezbłędny fix.' },
      { label: 'Dodaj szybki fallback na froncie', d: +75, react: 'Problem załatany na czas wdrożenia.' },
    ] },
    { icon: '⚡', title: 'Optymalizacja wolnego zapytania bazy', reward: 175, prompt: 'Dashboard ładuje się 6 sekund — klienci narzekają.', opts: [
      { label: 'Dodaj indeksy i wyeliminuj zapytania N+1', d: +100, react: 'Czas spadł do 80 ms! Świetna robota.' },
      { label: 'Włącz cache po stronie serwera', d: +75, react: 'Strona działa zauważalnie szybciej.' },
    ] },
    { icon: '🚀', title: 'Nowa funkcja dla kluczowego klienta', reward: 190, prompt: 'Klient prosi o eksport raportów jednym kliknięciem.', opts: [
      { label: 'Zaprojektuj czysty interfejs + walidację danych', d: +100, react: 'Klient zachwycony — chwali jakość wdrożenia!' },
      { label: 'Wdróż prosty eksport CSV', d: +75, react: 'Funkcja dostarczona przed terminem.' },
    ] },
  ],
  art: [
    { icon: '🎨', title: 'Obraz na zamówienie do salonu', reward: 145, prompt: 'Kolekcjoner szuka ciepłego płótna w złotych barwach.', opts: [
      { label: 'Zbuduj głębię warstwami laserunku i światłocienia', d: +100, react: 'Klient oniemiał z zachwytu i płaci z bonusem!' },
      { label: 'Namaluj minimalistyczną kompozycję', d: +75, react: 'Elegancki, nowoczesny efekt.' },
    ] },
    { icon: '🖼️', title: 'Kuratorskie przygotowanie nowej wystawy', reward: 155, prompt: 'Trzeba dobrać oświetlenie i układ prac w głównej sali.', opts: [
      { label: 'Stwórz spójną ścieżkę narracyjną z ciepłym światłem', d: +100, react: 'Goście wernisażu są pod ogromnym wrażeniem!' },
      { label: 'Ustaw prace według rozmiaru', d: +70, react: 'Sala wygląda schludnie i przejrzyście.' },
    ] },
    { icon: '✨', title: 'Renowacja uszkodzonej ramy i płótna', reward: 165, prompt: 'Zabytkowy pejzaż wymaga delikatnego oczyszczenia.', opts: [
      { label: 'Pracuj powoli precyzyjnym pędzelkiem konserwatorskim', d: +100, react: 'Obraz odzyskał dawny blask!' },
      { label: 'Oczyść tylko najmocniejsze zabrudzenia', d: +70, react: 'Bezpieczna, poprawna renowacja.' },
    ] },
  ],
  police: [
    { icon: '🚓', title: 'Zgłoszenie kradzieży roweru w parku', reward: 150, prompt: 'Świadek widział podejrzanego przy alejce zachodniej.', opts: [
      { label: 'Zabezpiecz ślady i dokładnie przesłuchaj świadka', d: +100, react: 'Rower odnaleziony! Mieszkaniec jest ogromnie wdzięczny.' },
      { label: 'Przeprowadź szybki patrol okolicy', d: +75, react: 'Sprawa przyjęta i udokumentowana.' },
    ] },
    { icon: '🔍', title: 'Analiza nagrań monitoringu osiedla', reward: 165, prompt: 'Na nagraniu z nocy widać nieznany pojazd przy skrzyżowaniu.', opts: [
      { label: 'Zbliż klatki i porównaj tablicę w bazie', d: +100, react: 'Trafienie w 100%! Komendant chwali spostrzegawczość.' },
      { label: 'Spisz przybliżony rysopis auta', d: +70, react: 'Raport dodany do akt sprawy.' },
    ] },
    { icon: '📋', title: 'Mediacja w sporze sąsiedzkim', reward: 155, prompt: 'Dwóch mieszkańców kłóci się o miejsce parkingowe.', opts: [
      { label: 'Wysłuchaj obu stron i zaproponuj spokojną ugodę', d: +100, react: 'Sąsiedzi podali sobie ręce — zero mandatu, pełen spokój!' },
      { label: 'Przypomnij przepisy i zamknij interwencję', d: +70, react: 'Porządek przywrócony.' },
    ] },
  ],
  music: [
    { icon: '🎸', title: 'Nagrania partii gitarowej w studiu', reward: 145, prompt: 'Producent potrzebuje chwytliwego riffu do nowego singla.', opts: [
      { label: 'Nagraj z wyczuciem dynamiki i dodatkową harmonią', d: +100, react: 'Producent krzyczy: „To jest HIT!”' },
      { label: 'Zagraj czysto prosty schemat akordowy', d: +75, react: 'Solidne nagranie za pierwszym podejściem.' },
    ] },
    { icon: '🎹', title: 'Próba przed wieczornym koncertem', reward: 155, prompt: 'Trzeba zgrać tempo zespołu i ustawić odsłuchy.', opts: [
      { label: 'Dopracuj przejścia i brzmienie każdego instrumentu', d: +100, react: 'Zespół brzmi jak milion dolarów!' },
      { label: 'Przegrajcie raz całą setlistę', d: +75, react: 'Próba zaliczona bez wpadek.' },
    ] },
    { icon: '🎤', title: 'Minikoncert dla fanów na żywo', reward: 175, prompt: 'Publiczność czeka na bis i wspólny refren!', opts: [
      { label: 'Zaproś publiczność do śpiewu i zagraj pełne solo', d: +100, react: 'Owacje na stojąco i świetne napiwki!' },
      { label: 'Zagraj spokojną balladę na finał', d: +75, react: 'Ciepłe brawa na zakończenie występu.' },
    ] },
  ],
  biz: [
    { icon: '🚀', title: 'Warsztat strategiczny z nowym klientem', reward: 185, prompt: 'Klient chce zwiększyć sprzedaż swojej marki w miesiąc.', opts: [
      { label: 'Rozpisz konkretny plan kampanii i mierniki sukcesu', d: +100, react: 'Klient od razu podpisuje kontrakt i płaci zaliczkę!' },
      { label: 'Przedstaw gotowy szablon działań', d: +75, react: 'Spotkanie zakończone pozytywnie.' },
    ] },
    { icon: '💡', title: 'Prezentacja nowej oferty premium', reward: 210, prompt: 'Zarząd firmy porównuje Twoją propozycję z konkurencją.', opts: [
      { label: 'Pokaż realne wyniki i indywidualne dopasowanie', d: +100, react: 'Wygrywasz zlecenie z premią za jakość!' },
      { label: 'Skup się na szybkiej realizacji', d: +75, react: 'Klient akceptuje ofertę podstawową.' },
    ] },
    { icon: '📈', title: 'Audyt wizerunku i raport dla marki', reward: 195, prompt: 'Klient prosi o wskazanie 3 najważniejszych zmian.', opts: [
      { label: 'Przygotuj klarowne rekomendacje z przykładami', d: +100, react: 'Polecenie do kolejnych klientów gwarantowane!' },
      { label: 'Wyślij zwięzłe podsumowanie w punktach', d: +75, react: 'Raport przyjęty bez uwag.' },
    ] },
  ],
};

// Współpracownik w miejscu pracy — trafia jako fizyczny NPC 3D i do głównej listy Relacje!
export const COWORKERS = {
  dog:    { id: 'kinga', name: 'Kinga', role: 'Młodszy trener', e: '🐕', body: 'f', traits: ['towarzyski', 'rodzinny'], interest: ['psy 🐕', 'zwierzeta'], desc: 'Współpracowniczka z ośrodka „Spokojny Pies”. Uwielbia psy i chętnie wymienia się doświadczeniami.' },
  med:    { id: 'kinga', name: 'Kinga', role: 'Pielęgniarka dyżurna', e: '🩺', body: 'f', traits: ['towarzyski', 'ambitny'], interest: ['medycyna 🩺', 'medycyna'], desc: 'Współpracowniczka z kliniki. Zawsze pomocna na dyżurze.' },
  cook:   { id: 'kinga', name: 'Kinga', role: 'Sous-chef', e: '🍳', body: 'f', traits: ['towarzyski', 'ambitny'], interest: ['gotowanie 🍳', 'gotowanie'], desc: 'Współpracowniczka z kuchni. Zna wszystkie kulinarne sekrety.' },
  it:     { id: 'kinga', name: 'Kinga', role: 'Tech Lead', e: '💻', body: 'f', traits: ['ambitny', 'towarzyski'], interest: ['programowanie 💻', 'programowanie'], desc: 'Współpracowniczka z zespołu IT. Lubi dobrą kawę i czysty kod.' },
  art:    { id: 'kinga', name: 'Kinga', role: 'Kuratorka galerii', e: '🎨', body: 'f', traits: ['romantyczny', 'towarzyski'], interest: ['sztuka 🎨', 'malarstwo'], desc: 'Współpracowniczka z galerii. Ma świetne oko do kolorów.' },
  police: { id: 'kinga', name: 'Kinga', role: 'Partnerka z patrolu', e: '🚓', body: 'f', traits: ['ambitny', 'rodzinny'], interest: ['sport 🏋️', 'sprawnosc'], desc: 'Współpracowniczka z komisariatu. Zawsze kryje Twoje plecy.' },
  music:  { id: 'kinga', name: 'Kinga', role: 'Realizatorka dźwięku', e: '🎸', body: 'f', traits: ['towarzyski', 'romantyczny'], interest: ['muzyka 🎸', 'muzyka'], desc: 'Współpracowniczka ze studia nagrań. Zna każdy rytm.' },
  biz:    { id: 'kinga', name: 'Kinga', role: 'Menedżerka projektów', e: '🚀', body: 'f', traits: ['ambitny', 'towarzyski'], interest: ['biznes 🚀', 'biznes'], desc: 'Współpracowniczka z biura. Trzyma rękę na pulsie projektów.' },
};

export const COWORKER_CHATS = [
  { label: '💬 Porozmawiaj o dzisiejszych zleceniach', df: +8, reply: 'Świetnie Ci dziś idzie! Klienci są naprawdę zadowoleni.' },
  { label: '☕ Zapytaj o wskazówki z pracy', df: +10, reply: 'Najważniejszy jest spokój i obserwacja — Ty masz do tego naturalny talent!' },
  { label: '😂 Zaśmiejcie się ze wspólnej anegdoty', df: +12, reply: 'Hahaha, pamiętasz tamtego huskiego? Do dziś się z tego śmieję!' },
];
