// Tryb fabularny „Tajemnice Słonecznej Uliczki” – 5 rozdziałów, wybory, 3 zakończenia
// oraz generator losowych Wyzwań dnia. Tylko dane i logika celów; okna i nagrody obsługuje gra.
//
// ctx (dostarcza gra): { lux, met, maxFriend(id?), rel(id), lvl, skill, money, hour, st (statystyki), base (stan na starcie rozdziału), owns(type), night }
// Wybór: { l, d, e: { money, buff, rel: {id: zmiana}, pts: 'honor'|'cunning'|'drama', flag } , msg }

const A = (l, d, e, msg) => ({ l, d, e: { pts: 'honor', ...e }, msg, style: 'Dyplomatycznie', col: '#39c07f' });
const B = (l, d, e, msg) => ({ l, d, e: { pts: 'cunning', ...e }, msg, style: 'Sprytnie i ryzykownie', col: '#f2b134' });
const C = (l, d, e, msg) => ({ l, d, e: { pts: 'drama', ...e }, msg, style: 'Bezpośrednio', col: '#e5534b' });

export const CHAPTERS = [
  { id: 1, name: 'Nowa na osiedlu', icon: '🏡', reward: { money: 800, pts: 50 },
    intro: { icon: '📦', title: 'Rozdział 1: Nowa na osiedlu', text: 'Słoneczna Uliczka wygląda jak z katalogu: białe płotki, przystrzyżone trawniki, uśmiechy od ucha do ucha. Ale tutaj nikt nie patrzy na Ciebie – patrzą na Twój dom, Twoje firanki i to, czy umiesz przyjąć gości. Pierwsze wrażenie robi się tylko raz.' },
    desc: 'Sąsiedzi oceniają nowych mieszkańców po domu i gościnności. Pokaż się z najlepszej strony.',
    goals: [
      { id: 'meet', text: 'Poznaj 2 sąsiadów (przywitaj się albo porozmawiaj)', check: c => c.met >= 2, prog: c => `${Math.min(2, c.met)}/2` },
      { id: 'lux', text: c => `Podnieś wystrój domu do ${c.base.lux + 6} pkt (kup ozdoby lub meble)`, check: c => c.lux >= c.base.lux + 6, prog: c => `${c.lux}/${c.base.lux + 6}` },
      { id: 'pay', text: 'Zdobądź pierwszą wypłatę (zakończ zmianę w pracy)', check: c => c.st.shifts > c.base.shifts, prog: c => c.st.shifts > c.base.shifts ? '✓' : '0/1' },
    ],
    outro: { icon: '✉️', title: 'Anonimowy list', text: 'Rano na wycieraczce leży koperta bez nadawcy. W środku jedno zdanie, wycięte z gazetowych liter:<br><br><i>„Wiem, co ukrywa rodzina z domu naprzeciwko. Nie ufaj ich uśmiechom.”</i><br><br>Dom naprzeciwko – to dom Zosi i Kuby.',
      choices: [
        A('Schowaj list i obserwuj spokojnie', 'Bez pochopnych ruchów', { buff: 5 }, 'Postanawiasz zachować zimną krew. Na tej ulicy cierpliwość jest walutą.'),
        B('Pokaż list Pani Hani – plotkarki wiedzą najwięcej', 'Hania będzie zachwycona, Zosia mniej', { rel: { hania: 12, zosia: -5 } }, 'Pani Hania aż klasnęła w dłonie. „Wiedziałam, że coś jest nie tak z tymi uśmiechami!”'),
        C('Idź z listem prosto do Zosi i Kuby', 'Szczerość ponad wszystko – ale bez gwarancji', { rel: { zosia: -8, kuba: -8 }, buff: -5 }, 'Zosia zbladła, Kuba zamknął drzwi trochę za szybko. Coś tu jest na rzeczy.'),
      ] } },
  { id: 2, name: 'Sąsiedzkie sekrety', icon: '🤫', reward: { money: 1500, pts: 80 },
    intro: { icon: '☕', title: 'Rozdział 2: Sąsiedzkie sekrety', text: 'Na Słonecznej Uliczce informacja to waluta, a kawa u sąsiadki to giełda. Żeby dowiedzieć się, kto wysłał list i o kogo naprawdę chodzi, musisz zdobyć zaufanie – i status. Nikt nie zwierza się komuś, kto dopiero zaczyna karierę.' },
    desc: 'Zdobądź zaufanie, awansuj i sprawdź, co kryje się przy domu Zosi i Kuby.',
    goals: [
      { id: 'friend', text: 'Zaprzyjaźnij się z sąsiadem (przyjaźń 40+)', check: c => c.maxFriend() >= 40, prog: c => `${Math.round(Math.max(0, c.maxFriend()))}/40` },
      { id: 'promo', text: 'Zdobądź awans w pracy', check: c => c.st.promos > c.base.promos, prog: c => c.st.promos > c.base.promos ? '✓' : '0/1' },
      { id: 'probe', text: 'Zbadaj podejrzaną paczkę przy domu Zosi i Kuby', check: c => !!c.flags.ch2found, prog: c => c.flags.ch2found ? '✓' : '🔎', go: { npc: 'zosia', key: 'ch2', marker: ['ola', 4.5, 11.6] } },
    ],
    discover: { ch2: { icon: '📦', title: 'Paczka pod żywopłotem', text: 'W krzakach przy domu Zosi i Kuby leży przemoczona paczka. W środku: wypowiedzenie z pracy na nazwisko Kuby sprzed czterech miesięcy i kwity z lombardu – za biżuterię Zosi.<br><br>Kuba od miesięcy wychodzi rano „na próby z orkiestrą”… a orkiestry od dawna nie ma.',
      choices: [
        A('Porozmawiaj z Kubą w cztery oczy i zaproponuj pomoc', 'Ostrzegasz go, zanim prawda wyjdzie sama', { rel: { kuba: 20, zosia: 5 }, buff: 5 }, 'Kuba długo milczał. „Nie wiedziałem, jak jej powiedzieć…” Ściska Ci dłoń. Masz przyjaciela – i dług wdzięczności.'),
        B('Zasugeruj Kubie, że Twoje milczenie ma swoją cenę', 'Szantaż: szybka gotówka, wrogi sąsiad', { money: 1500, rel: { kuba: -35 } }, 'Kuba bez słowa podaje Ci kopertę. W jego oczach widzisz strach. I coś jeszcze – urazę.'),
        C('Pokaż wszystko Zosi', 'Prawda boli – ale to nie Twoja tajemnica', { rel: { zosia: 15, kuba: -30 }, buff: -5 }, 'Zosia czyta kwity trzy razy. Potem zamyka drzwi. Przez całą noc w ich oknach pali się światło.'),
      ] } },
    outro: { icon: '✉️', title: 'Drugi list', text: 'Tym razem koperta czeka w skrzynce na listy. Te same gazetowe litery:<br><br><i>„Dobra robota. Ale Kuba to płotka. Ktoś na tej ulicy ma znacznie większy sekret – i zakopuje go nocą.”</i><br><br>Ktoś Cię obserwuje. Ktoś, kto wie wszystko.',
      choices: [
        A('Zachowaj list jako dowód i bądź ostrożna', 'Spokój i rozwaga', { buff: 3 }, 'Chowasz list do szuflady, obok pierwszego. Kolekcja rośnie.'),
        B('Zostaw w skrzynce odpowiedź: „Kim jesteś?”', 'Gra w kotka i myszkę', { flag: 'replied' }, 'Rano Twojej kartki już nie ma. Ktoś ją zabrał.'),
        C('Ogłoś przy płocie, że wiesz o anonimach', 'Niech autor wie, że go szukasz', { rel: { hania: 5, natalia: -5 }, buff: -3 }, 'Pani Hania aż upuściła konewkę. Natalia, przechodząc obok, jakby przyspieszyła kroku…'),
      ] } },
  { id: 3, name: 'Wielka rywalizacja', icon: '💅', reward: { money: 2500, pts: 100 },
    intro: { icon: '👑', title: 'Rozdział 3: Wielka rywalizacja', text: 'Zosia z naprzeciwka ma najpiękniejszy salon na ulicy – i nie zamierza oddać korony. A w sobotę na Słoneczną Uliczkę przyjeżdża Pani Prezes Wiśniewska, która szuka „domu do sesji w magazynie”. Wygrywa najpiękniejsze wnętrze i najlepsza gospodyni.' },
    desc: 'Przebij luksus salonu Zosi i rozwiń swoją kluczową umiejętność przed wizytą VIP.',
    goals: [
      { id: 'beat', text: c => `Przebij luksus Zosi (${c.base.rival} pkt wystroju)`, check: c => c.lux > c.base.rival, prog: c => `${c.lux}/${c.base.rival + 1}` },
      { id: 'skill', text: c => `Rozwiń umiejętność ${c.skillName} do poziomu ${c.base.skillTarget}`, check: c => c.skill >= c.base.skillTarget, prog: c => `${c.skill}/${c.base.skillTarget}` },
    ],
    outro: { icon: '🥂', title: 'Wizyta Pani Prezes', text: 'Pani Prezes Wiśniewska rozgląda się po Twoim salonie, a Zosia stoi w drzwiach z kamienną twarzą. Nagle pada podchwytliwe pytanie:<br><br><i>„Piękne wnętrze. Ale słyszałam, że na tej ulicy nic nie jest takie, jakim się wydaje. Coś mi pani o tym powie?”</i>',
      choices: [
        A('„To ludzie tworzą tę ulicę – i każdy ma prawo do odrobiny prywatności”', 'Klasa i dyskrecja', { money: 1000, rel: { zosia: 10 }, buff: 10 }, 'Pani Prezes uśmiecha się z uznaniem. „Klasa. To rzadkie.” Twój dom trafi do magazynu – a Zosia patrzy na Ciebie inaczej.'),
        B('Delikatnie zasugeruj, że salon Zosi to tylko fasada', 'Wygrywasz konkurs, tracisz sąsiadkę', { money: 3000, rel: { zosia: -25 } }, 'Pani Prezes unosi brew i notuje coś w kalendarzu. Wygrałaś sesję w magazynie. Zosia trzaska drzwiami.'),
        C('„Na tej ulicy wszyscy coś ukrywają. Ja nie.”', 'Szczerość robi wrażenie… albo skandal', { money: 1500, rel: { hania: 10, marek: -5 }, buff: 5 }, 'Cisza. Potem Pani Prezes wybucha śmiechem. „Uwielbiam panią!” Marek, który słyszał to zza płotu, nie wygląda na rozbawionego.'),
      ] } },
  { id: 4, name: 'Nocna intryga', icon: '🌙', reward: { money: 3000, pts: 120 },
    intro: { icon: '🌙', title: 'Rozdział 4: Nocna intryga', text: 'Druga w nocy. Budzi Cię dźwięk łopaty. W ogrodzie Marka miga latarka, a potem gaśnie. Trzeci list mówił o kimś, kto „zakopuje sekret nocą”. Jeśli chcesz poznać prawdę, musisz wyjść na ulicę, kiedy wszyscy śpią.' },
    desc: 'Wyjdź nocą (23:00–4:00) i sprawdź, co Marek zakopał w ogrodzie.',
    goals: [
      { id: 'night', text: 'Wyjdź na ulicę między 23:00 a 4:00 i zbadaj ogród Marka', check: c => !!c.flags.ch4found, prog: c => c.flags.ch4found ? '✓' : (c.night ? '🔎 teraz!' : '🌙 czekaj na noc'), go: { npc: 'marek', key: 'ch4', night: true, marker: ['marek', 15.5, 11.2] } },
    ],
    discover: { ch4: { icon: '🗝️', title: 'Skrzynia w ogrodzie Marka', text: 'Pod świeżo przekopaną ziemią – metalowa skrzynka. W środku plik listów miłosnych… od Zosi. Daty sprzed roku. I zdjęcie: Marek i Zosia na plaży, roześmiani.<br><br>Za Twoimi plecami trzaska gałązka. Marek stoi w szlafroku, z latarką w dłoni. „Proszę… nie mów nikomu.”',
      choices: [
        A('Zakop skrzynię z powrotem i porozmawiaj z nim rano', 'Dajesz mu szansę, by sam to naprawił', { rel: { marek: 25 }, buff: 5 }, 'Rano Marek przynosi Ci kawę i całą historię. Skończyło się, zanim się zaczęło. Teraz chce tylko zapomnieć.'),
        B('Cichy układ: milczysz, a on spłaca przysługę', 'Pieniądze i władza nad sąsiadem', { money: 2000, rel: { marek: -15 } }, 'Marek kiwa głową i jutro na Twoim koncie pojawia się przelew. Masz w ręku kolejną tajemnicę ulicy.'),
        C('Zabierz skrzynię jako dowód', 'Prawda kiedyś musi wyjść na jaw', { rel: { marek: -35, zosia: -15 }, buff: -5, flag: 'evidence' }, 'Marek patrzy, jak odchodzisz ze skrzynią. Nie mówi ani słowa. To cisza przed burzą.'),
      ] } },
    outro: { icon: '💌', title: 'Autorka listów', text: 'Na wycieraczce – zaproszenie na Wielką Galę Słonecznej Uliczki. Podpisane eleganckim pismem: <b>Natalia</b>. A pod spodem, wycięte z gazety, znajome litery: <i>„Do zobaczenia na gali. Teraz już wiesz, że to ja.”</i><br><br>Natalia od początku wiedziała wszystko o wszystkich.',
      choices: [
        A('Odwiedź Natalię i zapytaj, dlaczego to robi', 'Zrozumieć, zamiast oceniać', { rel: { natalia: 15 }, buff: 3 }, '„Bo nikt tu nie mówi prawdy” – mówi Natalia. – „A ja mam dość udawania.” Może nie jest wrogiem.'),
        B('Zacznij zbierać haki na Natalię', 'Ona ma sekrety – Ty też możesz grać', { rel: { natalia: -10 }, flag: 'dirt' }, 'Kilka telefonów i już wiesz: Natalia sama ma długi i pozew w sądzie. Teraz Ty trzymasz karty.'),
        C('Zagroź jej, że ujawnisz anonimy na gali', 'Wojna otwarta', { rel: { natalia: -25 }, buff: -3 }, 'Natalia blednie, ale się uśmiecha. „Zobaczymy, kto pierwszy.”'),
      ] } },
  { id: 5, name: 'Finał na uliczce', icon: '🎉', reward: { money: 5000, pts: 200 },
    intro: { icon: '🎆', title: 'Rozdział 5: Finał na uliczce', text: 'Wielka Gala Słonecznej Uliczki. Lampiony, szampan i wszystkie sekrety w jednym ogrodzie. Żeby to Ty była gwiazdą wieczoru, potrzebujesz pozycji, pieniędzy i domu, w którym chce się bawić.' },
    desc: 'Zdobądź wysoki status, urządź strefę imprezową i dokonaj ostatecznego wyboru.',
    goals: [
      { id: 'career', text: 'Osiągnij co najmniej 3. poziom kariery', check: c => c.lvl >= 2, prog: c => `${c.lvl + 1}/3` },
      { id: 'cash', text: 'Zgromadź 10 000 zł', check: c => c.money >= 10000, prog: c => `${Math.min(10000, Math.floor(c.money))}/10000` },
      { id: 'party', text: 'Urządź strefę imprezową (barek, głośnik albo kino domowe)', check: c => c.owns('homeBar') || c.owns('speaker') || c.owns('cinema') || c.owns('tvWall'), prog: c => (c.owns('homeBar') || c.owns('speaker') || c.owns('cinema') || c.owns('tvWall')) ? '✓' : '🛋️' },
    ],
    outro: { icon: '🎭', title: 'Wielka Gala', text: 'Gala trwa w najlepsze, gdy Natalia stuka łyżeczką w kieliszek. „Kochani, zanim zatańczymy… czas na prawdę o naszej uliczce.” Wszystkie oczy zwracają się na Ciebie. Kuba, Zosia, Marek, Pani Hania – wszyscy wiedzą, że to Ty znasz ich tajemnice.<br><br>Co zrobisz?',
      choices: [
        A('Wyjdź na środek i wznieś toast za przebaczenie', 'Łączysz ludzi zamiast ich dzielić', { pts2: 'honor', rel: { zosia: 10, kuba: 10, marek: 10, hania: 10, natalia: 10 }, buff: 15 }, 'Mówisz o drugich szansach. Ktoś zaczyna klaskać. Potem wszyscy.'),
        B('Uśmiechnij się i szepnij Natalii: „Ja też coś wiem”', 'Rozgrywasz wszystkich po cichu', { pts2: 'cunning', money: 3000 }, 'Natalia odkłada kieliszek. Toast się nie odbywa. Od dziś to Ty decydujesz, co wie ta ulica.'),
        C('Powiedz wszystko. Głośno.', 'Koniec udawania – niech spłonie', { pts2: 'drama', rel: { zosia: -15, kuba: -10, marek: -15, natalia: -10 }, buff: 5 }, 'Szklanka pęka. Zosia płacze, Marek wychodzi, Pani Hania nagrywa wszystko telefonem.'),
      ] } },
];

export const ENDINGS = {
  honor: { icon: '👑', name: 'Królowa Uliczki', text: 'Słoneczna Uliczka znów jest słoneczna – i to dzięki Tobie. Kuba znalazł nową pracę, Zosia i Marek mówią sobie „dzień dobry”, a Natalia zaprasza Cię na kawę bez ukrytych motywów. Kiedy ktoś na ulicy ma problem, puka do Twoich drzwi. Jesteś Królową Uliczki.', reward: { money: 3000, buff: 20, rel: 15 } },
  cunning: { icon: '🎭', name: 'Szara Eminencja', text: 'Nikt nie wie, ile wiesz – i właśnie dlatego nikt Ci się nie sprzeciwia. Na zebraniach wspólnoty wszyscy patrzą na Ciebie, zanim zagłosują. Szuflada z listami jest pełna, konto też. Uśmiechasz się do sąsiadów zza białego płotka. Jesteś Szarą Eminencją.', reward: { money: 8000, buff: 10, rel: -5 } },
  drama: { icon: '💥', name: 'Wielki Skandal', text: 'Następnego dnia o Słonecznej Uliczce piszą wszystkie portale. Wywiady, telewizja, a nawet propozycja reality show. Połowa sąsiadów z Tobą nie rozmawia, druga połowa prosi o autograf. Nudno już nie będzie. To był Wielki Skandal – a Ty jesteś jego gwiazdą.', reward: { money: 5000, buff: 15, rel: -10 } },
};

// ---------- WYZWANIA DNIA ----------
// c – ctx; zwraca obiekt wyzwania z celem względem stanu na starcie
export const CHALLENGES = [
  c => ({ id: 'bet', icon: '💅', title: 'Sąsiedzki zakład', text: `${c.pick(['Beata', 'Natalia', 'Pani Krystyna'])} twierdzi, że jej salon jest bardziej luksusowy niż Twój. Zdobądź +10 punktów wystroju.`, hours: 72, reward: 1500, buff: ['Wygrany zakład', 15], start: { lux: c.lux }, check: (c, s) => c.lux >= s.lux + 10, prog: (c, s) => `${c.lux - s.lux}/10` }),
  c => ({ id: 'dinner', icon: '🍝', title: 'Kryzys przed imprezą', text: 'Za 3 godziny wpadają znajomi! Ugotuj kolację i doprowadź się do porządku (higiena 70+).', hours: 3, reward: 600, buff: ['Perfekcyjna gospodyni', 12], start: { cooks: c.st.cooks }, check: (c, s) => c.st.cooks > s.cooks && c.needs.hygiene >= 70, prog: (c, s) => `${c.st.cooks > s.cooks ? '🍝✓' : '🍝'} ${c.needs.hygiene >= 70 ? '🧼✓' : '🧼'}` }),
  c => ({ id: 'social', icon: '💬', title: 'Dusza towarzystwa', text: 'Porozmawiaj z 3 różnymi sąsiadami w ciągu doby.', hours: 24, reward: 700, buff: ['Ulubienica ulicy', 10], start: { t: c.t }, check: (c, s) => c.talkedSince(s.t) >= 3, prog: (c, s) => `${Math.min(3, c.talkedSince(s.t))}/3` }),
  c => ({ id: 'work', icon: c.careerIcon, title: 'Zlecenie specjalne', text: c.career === 'dog' ? 'Burmistrz potrzebuje pilnej pomocy z psem przed wywiadem! Obsłuż 3 osoby w pracy w ciągu doby.' : c.career === 'biz' ? 'Zrób viralowy projekt: obsłuż 3 klientów w pracy w ciągu doby.' : 'Szef ma specjalne zadanie: obsłuż 3 osoby w pracy w ciągu doby.', hours: 30, reward: 1200, buff: ['Gwiazda w pracy', 12], start: { served: c.st.served }, check: (c, s) => c.st.served >= s.served + 3, prog: (c, s) => `${Math.min(3, c.st.served - s.served)}/3` }),
  c => ({ id: 'skill', icon: '📚', title: 'Szybka nauka', text: `Podnieś umiejętność ${c.skillName} o pół poziomu w ciągu 12 godzin.`, hours: 12, reward: 800, buff: ['Głowa pełna wiedzy', 10], start: { s: c.skillRaw }, check: (c, s) => c.skillRaw >= s.s + 0.5, prog: (c, s) => `${Math.round((c.skillRaw - s.s) * 100)}/50%` }),
  c => ({ id: 'spa', icon: '🛁', title: 'Dzień dla siebie', text: 'Zadbaj o siebie: podnieś zabawę i higienę do 85+ w ciągu 6 godzin.', hours: 6, reward: 400, buff: ['Zrelaksowana', 15], start: {}, check: c => c.needs.fun >= 85 && c.needs.hygiene >= 85, prog: c => `🎮${Math.round(c.needs.fun)} 🧼${Math.round(c.needs.hygiene)}` }),
  c => ({ id: 'visit', icon: '🏡', title: 'Wizyta z ciastem', text: 'Odwiedź sąsiada w jego domu (przycisk 🏡 Odwiedź w 💞 Relacjach).', hours: 24, reward: 500, buff: ['Dobra sąsiadka', 10], start: { v: c.st.visits }, check: (c, s) => c.st.visits > s.v, prog: (c, s) => c.st.visits > s.v ? '✓' : '0/1' }),
];
