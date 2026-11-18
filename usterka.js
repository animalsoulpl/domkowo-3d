// Kampania „Usterka Rzeczywistości” – surrealistyczna fabuła o bańce czasoprzestrzeni nad Słoneczną Uliczką.
// Same dane i teksty; mechanika (anomalie 3D, Kurator, niebo, stabilność) jest w grze.
// {me} – imię gracza, {p} – partner (Bartek), formy [męska|żeńska] dla gracza.

export const START = { stab: 72, shards: 0 };

// ---------- Prolog: „Transmisja zza Kurtyny” (okna bez limitu czasu) ----------
export const PROLOG = [
  { icon: '📡', title: 'Transmisja zza Kurtyny',
    say: 'Nie bój się. Nie jestem stąd. Właściwie nikt tu nie jest… stąd.',
    html: `<p class="story">Telewizor sam się włącza. Zamiast obrazu – szum, który brzmi jak szept. Powietrze w salonie gęstnieje, lampy przygasają, a na środku pokoju z pyłu światła składa się <b>wysoka, świetlista sylwetka</b>. Zamiast głowy ma <b>wirujący pierścień</b>, który brzęczy jak kieliszek trącony palcem.</p>
      <p class="story">„Nazywam się <b>Kurator Rzeczywistości</b>. Pilnuję, żeby światy trzymały się w szwach. Wasz właśnie zaczął się pruć.”</p>` },
  { icon: '🫧', title: 'Gdzie jesteście',
    say: 'Wasza ulica to bańka. Ładna, słoneczna… i zamknięta.',
    points: [
      ['🫧', '<b>Słoneczna Uliczka to bańka czasoprzestrzeni</b> – mały świat odcięty od reszty rzeczywistości. Na zewnątrz nie ma „dalej”. Jest tylko Kurtyna.'],
      ['🔁', '<b>Sąsiedzi żyją w nieświadomej pętli.</b> Te same rozmowy, te same plotki, ta sama karkówka u Pana Marka. Oni tego nie widzą.'],
      ['👁️', '<b>Ty i {p} zyskaliście Świadomość.</b> Widzicie szwy świata: rzeczy, które unoszą się w powietrzu, sąsiadów, którzy „przeskakują”, i światło, które nie powinno istnieć.'],
    ] },
  { icon: '🌀', title: 'Stabilność Świata',
    say: 'Bańka słabnie. Czuję to w pierścieniu.',
    points: [
      ['🌀', 'W lewym górnym rogu widzisz licznik <b>🌀 Stabilność Świata</b>. Zaczyna na <b>72%</b> i <b>powoli spada</b> z każdą godziną gry.'],
      ['⚠️', 'Każda <b>niezbadana Anomalia</b> przyspiesza spadek. Gdy Stabilność jest niska, niebo robi się <b>fioletowo-turkusowe</b>, pojawiają się <b>dwa księżyce i zorza</b>, a dziwnych zjawisk przybywa.'],
      ['🛟', 'Spokojnie: nic tu nie dzieje się na czas. Jeśli Stabilność spadnie do zera, wyciągnę Was z zapaści – ale coś stracicie.'],
    ] },
  { icon: '🔮', title: 'Jak badać Anomalie',
    say: 'Klikaj to, co dziwne. Świadomość zrobi resztę.',
    points: [
      ['🔮', '<b>Szczeliny Wymiarowe</b> – wirujące, fioletowo-złote kryształy w ogrodach, na chodnikach i w parku. <b>Kliknij</b>, a {me} pójdzie je zbadać i zbierze <b>Odłamek Rzeczywistości</b> (+6% Stabilności).'],
      ['🪑', '<b>Lewitujące przedmioty</b> – krzesła, rośliny i krasnale ogrodowe, które unoszą się metr nad ziemią. <b>Kliknij</b>, żeby je uziemić (+3%).'],
      ['👻', '<b>Usterki sąsiadów</b> – ktoś chodzi tyłem, jest półprzezroczysty albo mówi zagadkami. <b>Kliknij</b> go i wybierz: <b>🧘 Ustabilizuj</b> (+4%) albo <b>👁️ Przebudź</b> (prawda trochę wstrząśnie bańką, ale ten sąsiad zyska Świadomość).'],
      ['💡', 'Mnie też możesz kliknąć w salonie. Przypomnę zasady albo wskażę najbliższą Anomalię.'],
    ] },
  { icon: '🎯', title: 'Cel i trzy zakończenia',
    say: 'Trzy drzwi. Jedno serce bańki. Wybór będzie Twój.',
    points: [
      ['1️⃣', '<b>Akt I – Pęknięcia:</b> zbierz <b>3 Odłamki</b>.'],
      ['2️⃣', '<b>Akt II – Echo Pętli:</b> zbierz łącznie <b>7 Odłamków</b> i zbadaj <b>2 usterki sąsiadów</b>.'],
      ['3️⃣', '<b>Akt III – Rdzeń:</b> zbierz łącznie <b>10 Odłamków</b>. W parku otworzy się <b>Rdzeń Bańki</b> – tam wybierzesz zakończenie.'],
      ['🛠️', '<b>Naprawa Bańki</b> – wymaga <b>Stabilności co najmniej 60%</b>.'],
      ['👁️', '<b>Wielkie Przebudzenie</b> – wymaga <b>4 przebudzonych sąsiadów</b>.'],
      ['🚪', '<b>Ucieczka we Dwoje</b> – zawsze dostępna, ale ma swoją cenę.'],
      ['📖', 'Wszystko to przeczytasz ponownie w każdej chwili pod przyciskiem <b>📖 Zasady i Cel Fabuły</b> obok licznika.'],
    ] },
];
export const KURATOR_AFTER = 'Zaczynamy. Rozejrzyj się – pierwsza Szczelina już mruga w Waszym ogrodzie.';
export const PARTNER_AFTER = ['Ty też go widzisz?! Myślałem, że to przez trzecią kawę…', 'Dobra. Świecący facet z obręczą zamiast głowy. To nowe nawet jak na tę ulicę.'];

// ---------- Akty ----------
export const ACTS = [
  { n: 1, name: 'Pęknięcia', goal: 'Zbierz 3 Odłamki Rzeczywistości.', need: { shards: 3 },
    intro: null },
  { n: 2, name: 'Echo Pętli', goal: 'Zbierz łącznie 7 Odłamków i zbadaj 2 usterki sąsiadów.', need: { shards: 7, glitches: 2 },
    intro: { icon: '🔁', title: 'Akt II – Echo Pętli', say: 'Pętla zaczyna się zacinać. Sąsiedzi to czują, choć nie rozumieją.',
      html: `<p class="story">Trzy Odłamki w Twoich dłoniach brzęczą unisono. Kurator kiwa pierścieniem: „Dobrze. Bańka Cię zauważyła. Teraz <b>pętla zacznie się zacinać</b> – zobaczysz to na sąsiadach.”</p>
        <ul class="rlist"><li>👻 Sąsiedzi będą częściej <b>chodzić tyłem</b>, <b>przezroczystnieć</b> i <b>mówić zagadkami</b>.</li><li>🧘 <b>Ustabilizuj</b> usterkę, żeby wzmocnić bańkę, albo 👁️ <b>Przebudź</b> sąsiada – zyska Świadomość (liczy się do zakończenia „Wielkie Przebudzenie”).</li><li>🎯 Cel: łącznie <b>7 Odłamków</b> i <b>2 zbadane usterki</b>.</li></ul>` } },
  { n: 3, name: 'Rdzeń', goal: 'Zbierz łącznie 10 Odłamków. Potem w parku otworzy się Rdzeń Bańki.', need: { shards: 10 },
    intro: { icon: '💠', title: 'Akt III – Rdzeń', say: 'Czujesz to drżenie pod chodnikiem? To serce bańki.',
      html: `<p class="story">Niebo na moment pęka jak lód na kałuży. Kurator unosi się wyżej niż zwykle: „Pod parkiem bije <b>Rdzeń Bańki</b>. Kiedy zbierzesz <b>10 Odłamków</b>, otworzy się – i będziesz [musiał|musiała] wybrać.”</p>
        <ul class="rlist"><li>💠 Cel: łącznie <b>10 Odłamków</b>.</li><li>🛠️ <b>Naprawa</b> wymaga Stabilności ≥ 60% – dbaj o nią.</li><li>👁️ <b>Przebudzenie</b> wymaga 4 przebudzonych sąsiadów.</li><li>🚪 <b>Ucieczka</b> jest zawsze możliwa.</li></ul>` } },
];
export const CORE_OPEN = { icon: '💠', title: 'Rdzeń się otwiera!', say: 'Jest gotowy. Idź do parku. Ja tam będę… w pewnym sensie.',
  html: `<p class="story">Dziesięć Odłamków układa się w Twoich dłoniach w koło, a potem znika. W tej samej chwili w <b>parku</b> rozlega się dźwięk jak dzwon pod wodą. Nad stawem otwiera się <b>Rdzeń Bańki</b> – ogromny, wirujący kryształ.</p><p>🎯 Kliknij <b>Rdzeń w parku</b>, żeby tam pójść i wybrać zakończenie.</p>` };

// ---------- Zakończenia ----------
export const ENDINGS = [
  { id: 'repair', icon: '🛠️', name: 'Naprawa Bańki', req: 'Stabilność ≥ 60%',
    desc: 'Zszywasz szwy świata. Pętla znów płynie gładko, sąsiedzi niczego nie zauważą – ale Ty i {p} zachowacie wspomnienia.',
    epi: `<p class="story">Przykładasz dłonie do Rdzenia. Kryształ mruczy, potem cichnie. Niebo wraca do błękitu, krasnale opadają na trawniki, Pan Marek znów rozpala grilla dokładnie o 18:00.</p><p class="story">Kurator po raz ostatni obraca pierścieniem: „Rzadko ktoś wybiera ciszę. Dbajcie o nią.” I rozpływa się w pyłku światła.</p><p>🛠️ Stabilność: 100%. Anomalie znikają. Ty i {p} pamiętacie wszystko.</p>`,
    head: 'Słoneczna Uliczka wraca do normy', text: 'Mieszkańcy zgodnie twierdzą, że „nic się nie działo”. Jedynie {me} uśmiecha się dziwnie na widok krasnali.' },
  { id: 'awaken', icon: '👁️', name: 'Wielkie Przebudzenie', req: '4 przebudzonych sąsiadów',
    desc: 'Rozbijasz pętlę od środka. Wszyscy sąsiedzi zyskują Świadomość – bańka staje się otwartym, dziwnym, wolnym światem.',
    epi: `<p class="story">Przebudzeni sąsiedzi stają z Tobą w kręgu wokół Rdzenia. Pani Krystyna odkłada linijkę. Pan Henryk wyłącza wszystkie mikrofony. Kryształ pęka – nie z hukiem, ale ze śmiechem.</p><p class="story">Pętla się kończy. Od dziś każdy dzień na Słonecznej jest naprawdę nowy. A nocą, na pamiątkę, nad dachami tańczy delikatna zorza.</p><p>👁️ Wszyscy sąsiedzi zyskują Świadomość (+10 przyjaźni z przebudzonymi). Zorza zostaje na nocnym niebie.</p>`,
    head: 'Cała ulica się obudziła!', text: 'Sąsiedzi wyszli wczoraj na ulicę i… zaczęli rozmawiać o nowych rzeczach. Pierwszy raz od lat. Pan Marek zjadł sałatkę.' },
  { id: 'escape', icon: '🚪', name: 'Ucieczka we Dwoje', req: 'zawsze dostępne',
    desc: 'Przechodzicie z {p_ins} przez Rdzeń, zanim bańka się zamknie. Wracacie do „nowej” ulicy – ale sąsiedzi Was nie pamiętają, relacje zaczynają się od nowa.',
    epi: `<p class="story">Łapiesz {p_acc} za rękę. „Na trzy?” – „Na trzy.” Rdzeń połyka Was jak ciepła woda. Przez chwilę nie ma nic, potem jest zapach skoszonej trawy.</p><p class="story">Ta sama ulica. Te same domy. Ale sąsiedzi patrzą na Was jak na nowych mieszkańców: „Dzień dobry! Pan… Pani… się wprowadzili?”</p><p>🚪 Anomalie znikają. Wszystkie relacje z sąsiadami wracają blisko zera (nowy start). Ty i {p} – razem, przebudzeni, wolni.</p>`,
    head: 'Nowi sąsiedzi na Słonecznej?', text: 'Mieszkańcy witają „nową parę” spod siódemki. Para twierdzi, że mieszka tu od dawna. Redakcja nie wnika.' },
];

// ---------- Zapaść (Stabilność 0%) ----------
export const COLLAPSE = { icon: '🌪️', title: 'Zapaść Rzeczywistości!',
  html: `<p class="story">Świat zgrzyta. Przez sekundę wszystko dzieje się naraz: wczoraj, dziś i jutro. Sąsiedzi stają w pół kroku, ptaki wiszą w powietrzu.</p><p class="story">Kurator łapie bańkę jak upuszczony balon: „Trzymam! Ale musiałem oddać coś Kurtynie.”</p>` };

// ---------- Kurator: kwestie i rozmowa ----------
export const KURATOR_IDLE = ['Szwy trzymają. Na razie.', 'Słyszysz to brzęczenie? To pierścień. Martwi się.', 'Kryształy lubią ogrody. I chodniki. I parki. Lubią wszystko.', 'Wasz krasnal właśnie mrugnął. Przysięgam.', 'Pętla to nie kara. To przyzwyczajenie.', 'Gdy niebo fioletowieje, bańka krzyczy.'];
export const KURATOR_LORE = [
  'Jestem Kuratorem. Opiekuję się światami, które ktoś kiedyś zapomniał domknąć.',
  'Waszą ulicę stworzył czyjś sen o idealnym sąsiedztwie. Sen był piękny, ale zbyt mocno chciał trwać.',
  'Pierścień? To moja głowa. A raczej to, co z niej zostało po spotkaniu z nieskończonością. Nie polecam.',
  'Nie mogę naprawić bańki sam. Potrzebuję kogoś, kto jest w środku i widzi szwy. Was.',
];
export const PARTNER_HINTS = ['Widziałem fioletowe światło za płotem. Sprawdzisz?', 'Nasz kwiatek właśnie odleciał na metr w górę. Normalny wtorek.', 'Sąsiad szedł tyłem przez całą ulicę i nikt nic nie powiedział.', 'Czuję, że świat dziś trochę… trzeszczy.'];

// ---------- usterki sąsiadów: absurdalne zagadki ----------
export const RIDDLES = [
  'Niebo ma dziś smak lawendy. Spróbuj, póki nie zgęstnieje.',
  'Wtorek przyszedł dwa razy. Drugi był trochę smutniejszy.',
  'Mój cień poszedł na pocztę i nie wrócił.',
  'Czy też słyszysz, jak trawa liczy do trzech?',
  'Zjadłam/em jutro na śniadanie. Było lekko przypalone.',
  'Ta ulica ma kształt westchnienia. Nie zauważyłaś/eś?',
  'Moje klucze są w kieszeni, której jeszcze nie uszyto.',
  'Księżyc mrugnął do mnie dwa razy. Bo są dwa.',
  'Podlewam kwiaty, ale to one podlewają mnie.',
  'Ktoś przestawił godziny. Teraz jest wpół do niebieskiej.',
  'Gdy zamykam oczy, ulica dalej patrzy.',
  'Przepraszam, czy to ja już tu stałam/em?',
];
export const GLITCH_AWAKE = ['Ja… pamiętam wczoraj. I przedwczoraj. To był TEN SAM dzień!', 'Zaraz. Dlaczego zawsze o 18:00 pachnie karkówką?! Ile razy to przeżyłam/em?', 'Widzę… szwy. Na niebie są szwy! Dziękuję. Chyba.', 'Obudziłam/em się. Czy zawsze było tak… kolorowo?'];
export const GLITCH_CALM = ['Uff… już mi lepiej. O czym rozmawialiśmy?', 'Coś mi zaszumiało w głowie. Ale przeszło.', 'Dziwne. Szłam/em tyłem? Nieważne.'];
export const GROUND_LINES = ['Na ziemię, kolego. 🪑', 'Świadomość mówi: grawitacja. 🌀', 'Wracaj na swoje miejsce. ✨'];
export const SHARD_LINES = ['Mam Odłamek! Jest ciepły… i brzęczy. 🔮', 'Kolejny kawałek świata. 🔮', 'Rzeczywistość w kieszeni. Dosłownie. 🔮'];

export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
export const gform = (t, fem) => t.replace(/\[([^|\]]*)\|([^\]]*)\]/g, (m, a, b) => fem ? b : a);
export const pick = a => a[Math.floor(Math.random() * a.length)];
