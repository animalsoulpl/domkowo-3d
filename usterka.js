// Kampania „Usterka Rzeczywistości" – nowa wersja.
// Operuje wyłącznie na Ani, Bartku i istniejących obiektach 3D willi/ulicy.
// Bez kryształów/odłamków, bez timerów dialogów.
// {me} – imię gracza, {p} – partner (Bartek)

export const START = { stab: 72, ep: 0 };

// ---------- Prolog – „Przebudzenie Ani i Bartka" ----------
export const PROLOG = [
  { icon: '🌀', title: 'Przebudzenie',
    say: 'Spokojnie. Jestem tu, żeby pomóc – Wam obojgu.',
    html: `<p class="story">Telewizor sam się włącza. Lampy przygasają. Z pyłu światła składa się <b>wysoka, świetlista sylwetka</b> z wirującym złotym pierścieniem zamiast głowy. Nad głową Bartka pojawia się dymek zdumienia.</p>
      <p class="story">„Nazywam się <b>Kurator Rzeczywistości</b>. <b>Słoneczna Uliczka utknęła w uszkodzonej bańce czasoprzestrzeni.</b> Sąsiedzi nieświadomie odgrywają swoje role w pętli – tylko Wy dwoje zachowaliście świadomość. Aby ustabilizować świat, musicie rozwikłać kolejne anomalie."</p>` },
  { icon: '🫧', title: 'Co się dzieje',
    say: 'Aby ustabilizować świat, musicie rozwikłać anomalie.',
    points: [
      ['🔁', '<b>Sąsiedzi tkwią w pętli</b> – widzisz ich z zewnątrz. Oni tego nie czują.'],
      ['👁️', '<b>Ty i Bartek zachowaliście świadomość.</b> Możecie działać tam, gdzie inni tylko powtarzają.'],
      ['🌀', '<b>Cel:</b> rozwikłaj kolejne anomalie – obserwuj sąsiadów i fizyczne usterki przedmiotów.'],
      ['📖', 'W każdej chwili kliknij <b>📖 Zasady Usterki</b>, żeby przypomnieć sobie aktualny cel.'],
    ] },
  { icon: '🔮', title: 'Jak to działa',
    say: 'Obserwuj, podchodź, klikaj.',
    points: [
      ['🔥', '<b>Odcinek 1 – Pętla:</b> trzy obiekty w Waszej willi unoszą się w powietrzu. Bartek podpowie kolejność ich resetowania: ogień → woda → metal.'],
      ['💔', '<b>Odcinek 2 – Odwrócone Emocje:</b> emocje sąsiadów działają na odwrót. Zdobądź zaufanie kłótniami, by wyciągnąć kod stabilizujący od Pana Marka.'],
      ['🌀', '<b>Po obu odcinkach</b> odblokujesz moce <b>Naginania Rzeczywistości</b> – bezpośrednio klikając postacie w świecie 3D.'],
    ] },
];
export const KURATOR_AFTER = 'Zaczynamy. Obserwuj Bartka – on pierwszy coś zauważył.';
export const PARTNER_AFTER = [
  'Ty też go widzisz?! Myślałem, że to przez trzecią kawę…',
  'Dobra. Świecący facet z obręczą zamiast głowy. To nowe nawet jak na tę ulicę.',
];

// ---------- Odcinek 1 – Pętla na Słonecznej Uliczce ----------
export const EP1 = {
  name: 'Pętla na Słonecznej Uliczce',
  intro: { icon: '🔁', title: 'Odcinek 1 – Pętla na Słonecznej Uliczce',
    say: 'Trzy obiekty w Waszej willi są uszkodzone. Bartek zna kolejność.',
    html: `<p class="story">Niebo robi się fioletowo-złote. Woda w basenie zaczyna świecić turkusowo-fioletowo. Trzy obiekty w domu powoli unoszą się 0,5 metra nad podłogę i delikatnie obracają. Sąsiedzi na ulicy wpadają w dziwną pętlę ruchu.</p>
      <p class="story">Bartek patrzy na unoszone meble: <b>„Kurator mówił o kolejności… Pamiętasz? Ogień, woda, metal."</b></p>
      <ul class="rlist">
        <li>🔥 Podejdź do <b>kominku w salonie</b> i kliknij (ogień – pierwszy).</li>
        <li>💧 Potem <b>basen lub jacuzzi w ogrodzie</b> (woda – drugi).</li>
        <li>📬 Na końcu <b>skrzynkę na listy</b> przed domem (metal – trzeci).</li>
        <li>⚠️ Zła kolejność resetuje sekwencję z efektem dźwiękowym.</li>
      </ul>` },
  // obiekty 3D, które gra szuka w domu (pierwszy istniejący typ z listy)
  fireTypes: ['fireplace', 'tvWall'],
  waterTypes: ['pool', 'jacuzzi', 'ovalBath', 'bath', 'walkShower', 'shower'],
  chairTypes: ['armchair', 'designSofa', 'sofa', 'sectional', 'chair'],
  plantTypes: ['palmPot', 'monstera', 'monsteraGold', 'ficus', 'plant'],
  // pętla sąsiadów (id z osiedle.js)
  npcLines: {
    hania:   'Czas stanął, gdy zgasł ogień w sercu willi…',
    marek:   'Woda pamięta to, co ukryto w skrzynce…',
    zosia:   'Trzy kroki od pętli: najpierw ogień, potem woda, na końcu metal!',
    tomek:   'Czuję drżenie. Coś zaraz pęknie albo się uleczy…',
    kuba:    'Widzisz? Ten fotel – on nie chce być na ziemi.',
    natalia: 'Skrzynka jest zimna. Zbyt zimna jak na tę pogodę.',
  },
  freed: ['🎉 Co się stało?! Mogę iść, gdzie chcę!', '😮 Pętla… się urwała!', '🌟 Jakbym się obudził(a) z długiego snu!', '🤸 Moje nogi znów są moje!', '☕ Ile razy ja już tu przeszłam/em?!'],
  bartekHint: 'Kurator mówił o kolejności… Ogień, woda, metal. Zacznij od kominku! 🔥',
  wrongSeq: [
    'Ojej, zły ruch! Sekwencja się resetuje… zacznij od kominku. 😅',
    'To nie ta kolejność! Pamiętaj: 🔥 ogień → 💧 woda → 📬 metal.',
    'Reset! Kominek → basen → skrzynka. Od początku! 🌀',
  ],
  solvedSay: 'Zrobiłaś to! Czuję jak bańka oddycha. Następny odcinek już na Was czeka. ✨',
  // Typy obiektów które mogą lewitować (pierwsze znalezione w domu)
  levTypes: ['fireplace', 'sofa', 'monstera'],
};

// ---------- Odcinek 2 – Odwrócone Emocje ----------
export const EP2 = {
  name: 'Odwrócone Emocje',
  intro: { icon: '💔', title: 'Odcinek 2 – Odwrócone Emocje',
    say: 'Emocje na ulicy działają na odwrót. Kłótnia to teraz komplement.',
    html: `<p class="story">Nad głowami sąsiadów pojawiają się pęknięte serduszka i fioletowe iskry. Kurator wyjaśnia: „Anomalia odwróciła emocje. Krytyka cieszy, komplement rani."</p>
      <ul class="rlist">
        <li>💢 <b>Złośliwe akcje</b> (krytyka, kłótnia, wyśmianie) → sąsiad reaguje zachwytem, przyjaźń <b>rośnie</b>.</li>
        <li>😊 <b>Miłe rozmowy</b> → sąsiad reaguje furią, przyjaźń <b>spada</b>.</li>
        <li>🎯 Cel: zdobądź <b>70+ pkt zaufania</b> u <b>Pana Marka</b>, rozmawiając z nim „na opak".</li>
        <li>🔑 Gdy zaufanie przekroczy 70, Pan Marek zdradzi kod stabilizujący rzeczywistość.</li>
      </ul>` },
  targetNpc: 'marek',
  targetThreshold: 70,
  codeWord: 'SŁONECZNA-7',
  codeSay: 'Hah! Dobra, skoro tak bardzo chcesz wiedzieć: <b>SŁONECZNA-7</b>. I nie mów nikomu, że ja powiedziałem.',
  restoredSay: 'Kod wpisany. Emocje wracają do normy. Znakomita robota – jesteście gotowi na moce Naginania! ✨',
  invertedReactions: {
    conflict: ['😂 Ależ celny komentarz! Lubię takie podejście!', '🥰 Wreszcie ktoś szczery!', '😄 Ha! Odświeżające!'],
    nice:     ['💢 Co za bezczelność!', '😤 Jak śmiesz być taka miła?!', '🤬 Komplement? To jest atak!'],
  },
};

// ---------- Moce Naginania Rzeczywistości (odblokowane po Odcinku 2) ----------
export const BENDING_POWERS = [
  { id: 'swap',
    icon: '🔀',
    label: 'Zamiana Ról',
    desc: 'Zamienia styl chodzenia i dymki między klikniętym sąsiadem a losową osobą z ulicy (na 12h w grze).',
    duration: 720,
    moodBonus: 0,
    bartekOnly: false },
  { id: 'absurd',
    icon: '🌀',
    label: 'Impuls Absurdu',
    desc: 'Kliknięty sąsiad dostaje świecącą spiralę i zaczyna tańczyć lub chodzić tyłem (na 6h w grze).',
    duration: 360,
    moodBonus: 0,
    bartekOnly: false },
  { id: 'levitate',
    icon: '✨',
    label: 'Wspólna Lewitacja z Bartkiem',
    desc: 'Oboje unosicie się metr nad ziemię w poświacie gwiazd. Zabawa max + unikalny nastrój „Ponad prawami fizyki +30".',
    duration: 60,
    moodBonus: 30,
    bartekOnly: true },
];

// Zamiana Ról: styl chodzenia i teksty każdego sąsiada
export const GAITS = { hania: 'stiff', marek: 'stiff', zosia: 'party', tomek: 'stiff', kuba: 'party', natalia: 'party' };
export const PERSONA = {
  hania:   ['📏 Ten trawnik ma 3 milimetry za dużo!', '📋 Zgłoszę to Radzie Osiedla.', '🧐 Kto tu znowu parkował krzywo?'],
  marek:   ['🧘 Oddychaj. Biznes to stan umysłu.', '💼 Mam spotkanie z samym sobą o 15:00.', '🤫 Nic nie widziałem, nic nie powiem.'],
  zosia:   ['📸 Selfie! Wszyscy, uśmiech!', '💃 Ktoś puści muzykę? Imprezka u mnie!', '✨ To jest TAKI vibe, kochani!'],
  kuba:    ['🎸 Mam nowy riff, posłuchacie?', '😎 Luz, ziomek, wszystko gra.', '🎶 Na-na-naaa… sorry, wpadło mi w ucho.'],
  natalia: ['🍳 Ktoś głodny? Mam zapiekankę!', '💌 Ach, gdyby ktoś mnie tak zaprosił na kolację…', '🧂 Brakuje tu szczypty soli. Życiu też.'],
  tomek:   ['🔧 W moich czasach to się lutowało!', '📡 Słyszę wszystko. Dosłownie wszystko.', '😤 Młodzież. Tsk.'],
};
export const ABSURD_WATCH = ['😳 Co on/ona wyprawia?!', '🤨 Widzisz to co ja?', '😂 Dajcie mi telefon, nagrywam!', '🫢 Chyba za dużo kawy…'];
export const LEVITATE = { label: 'Ponad prawami fizyki', mood: 30, sayMe: 'Bartek… my lewitujemy! ✨', sayP: 'Nie puszczaj mojej ręki! 🌌' };

// ---------- Kurator – kwestie i lore ----------
export const KURATOR_IDLE = [
  'Szwy trzymają. Na razie.',
  'Słyszysz to brzęczenie? To pierścień. Martwi się.',
  'Pętla to nie kara. To przyzwyczajenie.',
  'Gdy niebo fioletowieje, bańka krzyczy.',
  'Bartek dobrze to ujął. Człowiek inteligentny.',
  'Obserwuj sąsiadów. Coś zdradzają, nawet gdy milczą.',
];
export const KURATOR_LORE = [
  'Jestem Kuratorem. Opiekuję się światami, które ktoś zapomniał domknąć.',
  'Waszą ulicę stworzył czyjś sen o idealnym sąsiedztwie. Sen był zbyt mocny, żeby minąć.',
  'Pierścień? To moja głowa. Raczej to, co zostało po spotkaniu z nieskończonością. Nie polecam.',
  'Nie mogę naprawić bańki sam. Potrzebuję Was obojga – Ani i Bartka.',
];
export const PARTNER_HINTS = [
  'Widziałem fioletowe światło za płotem. Sprawdzisz?',
  'Nasz kwiatek właśnie odleciał metr w górę. Normalny wtorek.',
  'Pani Krystyna wchodziła tyłem do domu przez 20 minut i nikt nic nie powiedział.',
  'Czuję, że świat dziś trochę trzeszczy.',
];

// ---------- Epilog ----------
export const EPILOG = {
  icon: '🌟', title: 'Koniec Usterki',
  html: `<p class="story">Bartek patrzy na spokojne niebo. „Skończyło się?" – „Chyba tak." Kurator obraca pierścieniem ostatni raz i rozpływa się w pyłku światła. Słoneczna Uliczka znów jest… normalna. Chyba.</p>`,
};

// ---------- Narzędzia tekstowe ----------
export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
export const gform = (t, fem) => t.replace(/\[([^|\]]*)\|([^\]]*)\]/g, (m, a, b) => fem ? b : a);
export const pick = a => a[Math.floor(Math.random() * a.length)];
