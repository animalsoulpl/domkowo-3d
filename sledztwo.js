// Kampania śledcza „Kto wrobił Słoneczną Uliczkę?” – 4 akty, 12 etapów, 4 zakończenia.
// Same dane i czysta logika; okna, znaczniki i nagrody obsługuje gra (domkowo3d.html).
//
// Obsada (id sąsiadów z osiedle.js):
//   hania  → Pani Krystyna (przewodnicząca Rady, krasnalowy czarny rynek)
//   marek  → Pan Marek (guru-milioner, nocny zjadacz cudzych grilli, boi się listonosza)
//   zosia  → Beata (influencerka z pustą willą i długami za torebki – prawdziwa szantażystka)
//   tomek  → Pan Henryk (emerytowany konstruktor, „nic nie słyszy”, sieć podsłuchów – podwójny agent)
//   kuba, natalia → świadkowie

export const SUSPECTS = ['hania', 'marek', 'zosia', 'tomek', 'kuba', 'natalia'];
export const SECRETS = { // co gracz wie o sąsiedzie po zdobyciu dowodu
  hania: [['krasnale_faktura', 'Prowadzi czarny rynek krasnali kolekcjonerskich (900 zł za sztukę!)'], ['alibi_krystyna', 'W noc kradzieży mierzyła cudze trawniki linijką']],
  marek: [['okruchy', 'Nocami wyjada resztki z grilli sąsiadów'], ['zeznanie_marka', 'Ofiara szantażu: płaci 300 zł miesięcznie']],
  zosia: [['dlugi_beaty', '47 torebek na raty, meble z kartonu'], ['petla_live', 'Jej „live” w noc kradzieży był nagraniem w pętli']],
  tomek: [['piwnica', '38 par słuchawek w piwnicy – słyszy wszystko w stereo'], ['tasma_oryginal', 'Montuje nagrania tak, by wrobić innych']],
  kuba: [['dlugi_beaty', 'Ukrywa długi żony przed całą ulicą']],
  natalia: [['petla_live', 'Ogląda każdy live Beaty (choć się wypiera)']],
};

// ---------- DOWODY ----------
// kind: poszlaka | plotka | przedmiot | alibi · who: kogo dotyczy · fake: fałszywy trop (ujawniany po etapie 9)
const E = (id, icon, name, kind, who, desc, fake = false) => ({ id, icon, name, kind, who, desc, fake });
export const KINDS = { poszlaka: ['🔍', 'Poszlaka'], plotka: ['👂', 'Plotka'], przedmiot: ['📦', 'Przedmiot'], alibi: ['🕐', 'Alibi / zeznanie'] };
export const EVIDENCE = [
  E('liscik_gracz', '📝', 'Twój anonimowy liścik', 'poszlaka', null, 'Wycinanka z gazetowych liter: „Wiem, że Twoje firanki są z outletu. 500 zł i zapomnę”. Papier pachnie… drogo. Za drogo jak na kogoś, kto wycina litery z darmowej gazetki.'),
  E('zgloszenie', '🏆', 'Zgłoszenie kradzieży Złotej Konewki', 'przedmiot', 'hania', 'Spisane przez Panią Krystynę linijką, na papierze kancelaryjnym. Konewka zniknęła z gabloty w nocy z wtorku 13-go na środę 14-go. „Gablota była zamknięta na klucz, a klucz leżał pod wycieraczką. Jak u porządnych ludzi.”'),
  E('koperta_perfumy', '💌', 'Koperta pachnąca perfumami', 'poszlaka', null, 'W skrzynce Pani Krystyny leży list od szantażysty. Koperta pachnie perfumami „Noir de Luxe” (flakon 890 zł). Pani Krystyna używa wyłącznie wody kolońskiej „Konwalia 1987”.'),
  E('alibi_krystyna', '📏', 'Alibi Pani Krystyny', 'alibi', 'hania', '„W noc kradzieży mierzyłam linijką trawnik Kowalczyków. Przy czołówce. Ktoś musi.” Potwierdza to sześcioro sąsiadów, którym czołówka świeciła prosto do sypialni.'),
  E('alibi_marek', '🧘', 'Alibi Pana Marka', 'alibi', 'marek', '„Od 21:00 medytowałem. W ciszy. W ciemności. Na czczo. Jak zawsze.” – mówi Pan Marek, dyskretnie ocierając sos barbecue z brody.'),
  E('alibi_beata', '📸', 'Alibi Beaty', 'alibi', 'zosia', '„Byłam na live’ie do północy! Nagranie jest na profilu!” I rzeczywiście: trzy godziny Beaty opowiadającej o kremie z kawioru. Alibi jak marmur. Z marketu budowlanego, ale zawsze.'),
  E('alibi_henryk', '👴', 'Alibi Pana Henryka', 'alibi', 'tomek', '„Spałem. Aparat słuchowy był w szklance, okulary w drugiej, a szczęka w trzeciej. Nic nie widziałem, nic nie słyszałem.” Mówi to, zanim zdążysz zadać pytanie.'),
  E('plotka_marek_noc', '👂', 'Plotka zza płotu', 'plotka', 'marek', 'Pani Krystyna do Natalii, szeptem słyszalnym w sąsiednim województwie: „Marek o 1:12 – sprawdziłam na zegarku kuchennym – chrupał MOJĄ karkówkę! W szlafroku! Z czołówką!”'),
  E('krasnal_bez_nosa', '🧌', 'Krasnal z numerem seryjnym', 'przedmiot', 'hania', 'W krzakach przy gablocie: krasnal ogrodowy z odłamanym nosem i wybitym numerem seryjnym KR-0047. Krasnale nie mają numerów seryjnych. Prawda? PRAWDA?', true),
  E('okruchy', '🗑️', 'Zawartość śmietnika Pana Marka', 'poszlaka', 'marek', 'Śmietnik o 2:00 w nocy: kości z karkówki Pani Krystyny (zamarynowanej – a jakże – według linijki), sreberko po kiełbasie Natalii i paragon z nocnego sklepu na 37 bułek. Medytacja na czczo, mhm.'),
  E('nagranie_henryka', '📼', 'Taśma Pana Henryka', 'poszlaka', 'marek', 'Pan Henryk „przypadkiem” nagrał (dyktafonem, który „znalazł na chodniku”) głos Marka: „…konewka jest bezpieczna… nikt nie wie…”. Nagranie trzeszczy jak schabowy na smalcu.', true),
  E('tasma_maszyny', '🧳', 'Wstążka do maszyny do pisania', 'przedmiot', 'marek', 'W walizce pod latarnią: wstążka do maszyny do pisania z wyhaftowanymi inicjałami „M.M.” i karteczka: „To na pewno Marka. Podpisano: nikt”. Kto haftuje inicjały na wstążce do maszyny?!', true),
  E('listy_do_marka', '📦', 'Skrytka w szopie Marka', 'przedmiot', 'marek', 'W szopie: 14 listów z pogróżkami – ZAADRESOWANYCH DO MARKA („Wiemy o karkówce. I o listonoszu.”) – oraz mapa grilli osiedla z ocenami w gwiazdkach. Grill Krystyny: ⭐⭐⭐⭐⭐ „marynata z charakterem”.'),
  E('zeznanie_marka', '😰', 'Zeznanie Pana Marka', 'alibi', 'marek', 'Marek wyznaje: od wiosny płaci 300 zł miesięcznie. Listy przychodzą w czwartki, pachną drogimi perfumami, a szantażysta zna rzeczy, które Marek mówił tylko… do własnej lodówki. „Ktoś mnie podsłuchuje. Albo lodówka donosi.”'),
  E('kaseta', '🔐', 'Zakopana kaseta z szyfrem', 'przedmiot', null, 'Metalowa kaseta pod krasnalem w ogrodzie Krystyny. Zamek na 4 cyfry. Na wieczku wydrapane: „Dwie pierwsze – noc, w której złoto opuściło gablotę. Dwie ostatnie – minuta po pierwszej, gdy milioner chrupie cudzą karkówkę.”'),
  E('krasnale_faktura', '🧾', 'Faktury za krasnale', 'przedmiot', 'hania', 'Obok kasety: faktury za 12 krasnali „Edycja Kolekcjonerska z Kapturkiem” po 900 zł sztuka, odbiorca: hurtownia „Krasnal-Pol”. Przewodnicząca Rady prowadzi krasnalowy czarny rynek. Z kasą fiskalną.', true),
  E('tasma_oryginal', '🎞️', 'Oryginał nagrania', 'poszlaka', 'tomek', 'W kasecie: oryginał taśmy. Marek mówi tam „…KARKÓWKA jest bezpieczna… nikt nie wie…”. Ktoś przerobił „karkówkę” na „konewkę”. Na kasecie naklejka: „Montaż: H.”'),
  E('piwnica', '🎧', 'Piwnica Pana Henryka', 'poszlaka', 'tomek', 'Przez okienko piwnicy: 38 par słuchawek, mapa ulicy z pinezkami i karteczka: „B. – 30% dla mnie, 70% na torebki”. Pan Henryk, który „nic nie słyszy”, słyszy wszystko. W stereo.'),
  E('petla_live', '🐦', 'Gołąb w pętli', 'plotka', 'zosia', 'Natalia (która „nie ogląda takich rzeczy”) zauważyła: na nocnym live’ie Beaty ten sam gołąb przelatuje za oknem co 4 minuty. Przez 3 godziny. To było nagranie w pętli!'),
  E('klotnia', '💢', 'Podsłuchana kłótnia', 'plotka', 'zosia', 'Kuba: „ZNOWU torebka?!” Beata: „To INWESTYCJA, Kuba! Za tydzień będzie nas stać na wszystko. Henryk mówi, że Marek płaci jak w zegarku…” – i trzask zamykanego okna.'),
  E('dlugi_beaty', '💳', 'Długi Beaty', 'alibi', 'zosia', 'Kuba pęka: 47 torebek na raty, komornik dzwoni trzy razy dziennie, a meble w willi są z kartonu – tylko od strony obiektywu. „Ona nawet lodówkę ma z tektury. Z magnesem.”'),
  E('konewka', '🏆', 'Złota Konewka!', 'przedmiot', 'zosia', 'W krzakach Beaty, w worku na torebkę od projektanta: Złota Konewka. Z kwitem z lombardu: „Mosiądz malowany. Wycena: 40 zł”. Cała ulica przez 20 lat czciła mosiądz.'),
];
export const EV = Object.fromEntries(EVIDENCE.map(e => [e.id, e]));

// ---------- MIEJSCA DO PRZESZUKANIA / PODSŁUCHANIA ----------
// npc – do czyjego domu prowadzi droga; pos – znacznik [slot, x, z]; win – godziny [od, do) (może przechodzić przez północ)
const P = (id, icon, name, npc, pos, win, gives, text, extra = {}) => ({ id, icon, name, npc, pos, win, gives, text, ...extra });
export const SPOTS = {
  s_skrzynka: P('s_skrzynka', '📫', 'Skrzynka na listy Pani Krystyny', 'hania', ['hania', 15.5, 11.7], [8, 20], ['koperta_perfumy'], 'Rozglądasz się jak profesjonalny włamywacz, czyli podejrzanie. W skrzynce: trzy ulotki pizzerii, rachunek za wodę (zapłacony co do grosza) i list od szantażysty do Krystyny. Koperta pachnie jak perfumeria w galerii handlowej.'),
  s_plot: P('s_plot', '👂', 'Podsłuchaj rozmowę przy płocie Krystyny', 'hania', ['hania', 6, 11.6], [17, 21], ['plotka_marek_noc'], 'Kucasz za żywopłotem, udając, że wiążesz but. Od 25 minut. Pani Krystyna i Natalia rozmawiają szeptem, który słychać na trzech posesjach.'),
  s_krzaki_gab: P('s_krzaki_gab', '🌿', 'Krzaki przy gablocie Konewki', 'hania', ['hania', 3.5, 11.4], [7, 22], ['krasnal_bez_nosa'], 'Przeczesujesz krzaki przy pustej gablocie. Kolce, pajęczyny i… krasnal. Patrzy na Ciebie z wyrzutem. Ma numer seryjny. Kto numeruje krasnale?!'),
  s_smietnik: P('s_smietnik', '🗑️', 'Śmietnik Pana Marka (tylko 1:30–3:30!)', 'marek', ['marek', 16.5, 11.4], [1.5, 3.5], ['okruchy'], 'Druga w nocy. Ty, latarka i śmietnik milionera. Gdyby ktoś Cię teraz zobaczył, plotek starczyłoby do emerytury. Ale warto: ten śmietnik mówi więcej niż Marek przez cały rok.'),
  s_walizka: P('s_walizka', '🧳', 'Tajemnicza walizka pod latarnią', 'tomek', ['f2', 16, 11.8], [7, 21], ['tasma_maszyny'], 'Pod latarnią stoi walizka. Sama. Jak w filmie szpiegowskim z budżetem 300 zł. W środku: wstążka do maszyny do pisania i karteczka. Ktoś bardzo chciał, żeby ktoś to znalazł.'),
  s_obserwacja: P('s_obserwacja', '🔦', 'Nocna zasadzka przy ogrodzie Marka (0:45–2:30)', 'marek', ['marek', 6, 11.4], [0.75, 2.5], [], 'Siedzisz w krzakach z termosem. 0:58. 1:04. 1:11 – drzwi się uchylają! Marek w szlafroku, z czołówką i plastikowym pudełkiem, skrada się do… szopy. Wchodzi, coś chowa, wychodzi. Potem idzie do grilla Krystyny. Oczywiście.', { flag: 'obserwacja' }),
  s_skrytka: P('s_skrytka', '🏚️', 'Szopa-skrytka Pana Marka (noc)', 'marek', ['marek', 12, 11.2], [23, 3.5], ['listy_do_marka'], 'Zamek w szopie otwiera się kartą lojalnościową z pizzerii. W środku pachnie kadzidełkiem i… karkówką. Na półce pudło z listami. Czytasz pierwszy i robi Ci się zimno.', { needFlag: 'obserwacja', needText: 'Najpierw nocna zasadzka – musisz zobaczyć, gdzie Marek coś chowa' }),
  s_kaseta: P('s_kaseta', '⛏️', 'Świeżo skopana ziemia pod krasnalem (noc)', 'hania', ['hania', 10, 11.2], [23, 3.5], ['kaseta', 'krasnale_faktura'], 'Kopiesz łyżką do zupy (łopata byłaby za głośna). Pod krasnalem-strażnikiem: metalowa kaseta z szyfrem. A obok, w foliowym worku… faktury. Dużo faktur. Za krasnale.'),
  s_piwnica: P('s_piwnica', '🎧', 'Okienko piwnicy Pana Henryka (noc)', 'tomek', ['f2', 5, 11.4], [23, 3.5], ['piwnica'], 'Leżysz na trawniku i zaglądasz przez okienko piwnicy. Pan Henryk, „głuchy jak pień”, siedzi w słuchawkach i nuci, przełączając kanały: „Krystyna… Marek… o, Kuba znowu śpiewa pod prysznicem”.'),
  s_klotnia: P('s_klotnia', '👂', 'Podsłuchaj kłótnię Beaty i Kuby (20:00–23:00)', 'zosia', ['ola', 12, 11.6], [20, 23], ['klotnia'], 'Stoisz pod oknem z konewką i podlewasz cudzą hortensję od 40 minut. Hortensja tonie, ale warto – w środku leci kłótnia życia.'),
  s_krzaki_beaty: P('s_krzaki_beaty', '🌿', 'Krzaki przy płocie Beaty (noc)', 'zosia', ['ola', 4.5, 11.6], [23, 3.5], ['konewka'], 'W krzakach przy willi influencerki coś błyszczy. Worek na torebkę od projektanta, a w nim – ZŁOTA KONEWKA. Z kwitem z lombardu przyklejonym taśmą klejącą.'),
};

// ---------- PRZESŁUCHANIA ----------
// free – odpowiada od razu; inaczej kłamie, dopóki: przyjaźń ≥ f / romans ≥ r, łapówka, prezent albo konfrontacja z dowodem
const Q = (id, npc, stage, q, lie, truth, gives, o = {}) => ({ id, npc, stage, q, lie, truth, gives, ...o });
export const QUESTIONS = [
  Q('q_kr_alibi', 'hania', 1, 'Gdzie była Pani w noc kradzieży Konewki?', '', '„Ja? Mierzyłam trawnik Kowalczyków. Mają 4,2 cm zamiast regulaminowych 4. Skandal. Ktoś musi pilnować porządku, skoro wszyscy śpią!”', 'alibi_krystyna', { free: true }),
  Q('q_ma_alibi', 'marek', 2, 'Co robił Pan w noc z wtorku na środę?', '', '„Medytowałem. Od 21:00. Na czczo. Mój organizm nie potrzebuje jedzenia po zmroku – żywię się energią wszechświata.” (Z kieszeni wystaje mu bułka.)', 'alibi_marek', { free: true }),
  Q('q_be_alibi', 'zosia', 2, 'Gdzie byłaś w noc kradzieży, Beato?', '', '„Kochana, byłam na live’ie! Do północy! Dziesięć tysięcy widzów! No, prawie dziesięć. Nagranie jest na profilu, sprawdź sobie. I daj serduszko.”', 'alibi_beata', { free: true }),
  Q('q_he_alibi', 'tomek', 2, 'Słyszał Pan coś tamtej nocy?', '', '„CO? NIE SŁYSZĘ! Spałem! Aparat w szklance, okulary w szklance, szczęka w szklance. Nic nie wiem, nic nie widziałem, nikogo nie podsłuchuję!” (Nikt nie pytał o podsłuchiwanie.)', 'alibi_henryk', { free: true }),
  Q('q_he_tasma', 'tomek', 4, 'Panie Henryku, czy ma Pan coś, co pomoże w śledztwie?', '„Ja? Ja nic nie mam. Nic nie słyszę. Proszę mówić głośniej. GŁOŚNIEJ. Co? Nie.”', '„No dobrze, dobrze… Znalazłem dyktafon na chodniku, a na nim – czysty przypadek! – Marek mówi coś o konewce. Proszę, niech to Pani/Pan weźmie. Ja tu tylko mieszkam.” (Mruga trzy razy.)', 'nagranie_henryka', { f: 25, bribe: 150 }),
  Q('q_ma_listy', 'marek', 6, 'Co Pan trzyma w szopie, Panie Marku?', '„Sprzęt do medytacji. Kadzidełka. Matę. Gong. Absolutnie nic do jedzenia ani żadnych listów od nikogo.”', 'Marek siada na trawie i zakrywa twarz dłońmi. „Dobrze. Ktoś mnie szantażuje. Od wiosny. Wie o grillach. Wie o listonoszu. Wie nawet, co mówię do lodówki. Płacę 300 zł co miesiąc. Ja nie jestem milionerem. Ja jestem… na kredycie.”', 'zeznanie_marka', { f: 45, bribe: 400, confront: ['listy_do_marka'] }),
  Q('q_na_live', 'natalia', 8, 'Natalio, oglądałaś nocny live Beaty?', '„Ja? Nie oglądam takich głupot. Nigdy. Ani wczoraj o 21:00 z popcornem. Ani w ogóle.”', '„No dobra, oglądam wszystko. Ale wiesz, co było dziwne? Ten sam gołąb przelatywał za oknem co cztery minuty. Przez trzy godziny! Albo to gołąb z zaburzeniami, albo to było nagranie w pętli.”', 'petla_live', { f: 30, bribe: 120, confront: ['alibi_beata'] }),
  Q('q_ku_dlugi', 'kuba', 10, 'Kuba, jak tam u Was z pieniędzmi?', '„Świetnie! Kwitniemy! Willa, torebki, szampan!” (Za jego plecami ktoś w szarym garniturze puka do drzwi i trzyma teczkę z napisem KOMORNIK.)', 'Kuba siada na schodach i odkłada gitarę. „47 torebek. Na raty. Meble z kartonu – tylko od strony obiektywu. A ostatnio Beata mówi, że »Henryk załatwi resztę«. Ja już nic nie rozumiem.”', 'dlugi_beaty', { f: 40, r: 25, bribe: 300, confront: ['klotnia', 'konewka'] }),
];
export const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));

// ---------- DEDUKCJE ----------
// pick: ile dowodów trzeba połączyć; suspects: lista do wytypowania; options: zamiast podejrzanych – wybór odpowiedzi
export const DEDUCTIONS = {
  d_alibi: { title: 'Czyje alibi nie trzyma się kupy?', prompt: 'Wytypuj osobę, która kłamie o noc kradzieży, i połącz 2 dowody, które to pokazują.', suspects: ['hania', 'marek', 'zosia', 'tomek'], pick: 2,
    ok: (s, ev) => s === 'marek' && ev.includes('alibi_marek') && (ev.includes('okruchy') || ev.includes('plotka_marek_noc')),
    win: 'Kładziesz przed Markiem alibi i dowody. „Medytacja na czczo? Z 37 bułkami?” Marek czerwienieje jak ketchup. „Dobrze! Jadłem! Wychodzę nocą jeść cudze grillowanie! Ale konewki nie ruszałem!” Hm. Kłamał w jednym. Czy kłamie i w drugim?' },
  d_marek: { title: 'Kim naprawdę jest Pan Marek?', prompt: 'Wszystko wskazuje na Marka. Ale co mówią dowody ze skrytki? Wybierz odpowiedź i dowód, który ją potwierdza.', options: ['Szantażysta', 'Ofiara szantażu', 'Wspólnik szantażysty'], pick: 1,
    ok: (s, ev) => s === 1 && ev.includes('listy_do_marka'),
    win: 'ZWROT AKCJI! Listy w skrytce nie są pisane PRZEZ Marka – są pisane DO Marka. Marek nie jest szantażystą. Marek jest ofiarą. A wszystkie poszlaki przeciw niemu były trochę… za łatwe do znalezienia.' },
  d_henryk: { title: 'Kto podkładał fałszywe dowody?', prompt: 'Ktoś od początku „pomagał” w śledztwie i podsuwał dowody przeciw Markowi. Wytypuj tę osobę i połącz 3 dowody.', suspects: ['hania', 'marek', 'zosia', 'tomek', 'kuba', 'natalia'], pick: 3,
    ok: (s, ev) => s === 'tomek' && ev.includes('tasma_oryginal') && ev.includes('piwnica') && (ev.includes('nagranie_henryka') || ev.includes('tasma_maszyny')),
    win: 'Pan Henryk zdejmuje okulary i nagle słyszy doskonale. „No dobrze. Montowałem. Podkładałem. Ale ja tylko DOSTARCZAM informacje! Szefową jest ktoś, kto ma więcej torebek niż sumienia.” Taśma z „konewką”, wstążka „M.M.” i krasnal – wszystko to były fałszywe tropy.' },
};
export const WRONG = { // komiczne awantury po błędnym oskarżeniu
  hania: 'Pani Krystyna mierzy Cię linijką od stóp do głów. „Oskarżasz MNIE? PRZEWODNICZĄCĄ?!” Wyciąga regulamin osiedla (strona 412, paragraf o oszczerstwach) i odczytuje go na głos przez 40 minut. Sąsiedzi przynoszą krzesła.',
  marek: 'Pan Marek przechodzi w pozycję lotosu i zaczyna krzyczeć mantrę. Potem rzuca w Ciebie bułką. Jedną z trzydziestu siedmiu. Bułka jest czerstwa. To boli.',
  zosia: 'Beata natychmiast odpala live’a: „Kochani, zobaczcie, jak sąsiadka mnie NĘKA!” Czterdzieści tysięcy ludzi ogląda Cię w kapciach. W komentarzach: „ale ma brzydkie firanki”.',
  tomek: 'Pan Henryk udaje, że nie słyszy. Bardzo głośno. „CO?! KONEWKA?! JAKA KONEWKA?! RATUNKU, NAPAD!” Pół ulicy wybiega na balkony, ktoś dzwoni po straż miejską.',
  kuba: 'Kuba bierze gitarę i śpiewa Ci smutną balladę o fałszywych oskarżeniach. Ma czternaście zwrotek i refren w tonacji „wyrzut sumienia”.',
  natalia: 'Natalia rzuca w Ciebie chochlą. Celnie. Potem przeprasza, podnosi chochlę i rzuca jeszcze raz – „bo pierwszy raz był z emocji, a teraz z przekonania”.',
};
export const CODE = { kaseta: { answer: '1312', gives: ['tasma_oryginal'], title: 'Szyfr kasety', hint: 'Przeczytaj w notesie opis kasety, zgłoszenie kradzieży i plotkę zza płotu.' } };

// ---------- 12 ETAPÓW ----------
// goal: { spot } | { ask } | { deduce } | { code } | { cond: c => bool, text, prog: c => tekst }
// wait – po ilu dniach rusza następny etap (zawsze od 7:00 rano)
const G = {
  spot: id => ({ spot: id }), ask: id => ({ ask: id }), deduce: id => ({ deduce: id }), code: id => ({ code: id }),
};
export const ACTS = ['', 'Akt I · Afera o Złotą Konewkę', 'Akt II · Fałszywy trop i nocna zasadzka', 'Akt III · Zagadka szyfru i podwójny agent', 'Akt IV · Wielki finał'];
export const STAGES = [
  { n: 1, act: 1, icon: '🏆', name: 'Zniknięcie Złotej Konewki', wait: 1, reward: 300, startEv: ['liscik_gracz', 'zgloszenie'],
    intro: 'Słoneczna Uliczka ma jedną świętość: Złotą Konewkę – nagrodę za najpiękniejszy ogród, wręczaną od 20 lat (zawsze Pani Krystynie). Tej nocy Konewka zniknęła z gabloty. Rano każdy dom dostał anonimowy liścik z wyciętych liter. Ty też.<br><br><i>„Wiem, że Twoje firanki są z outletu.”</i><br><br>To jest wojna.',
    desc: 'Ktoś ukradł Konewkę i rozsyła szantaże. Zacznij od poszkodowanej – i od jej skrzynki na listy.',
    goals: [G.spot('s_skrzynka'), G.ask('q_kr_alibi')],
    outro: 'Koperta pachnie jak perfumeria, a Pani Krystyna ma alibi oświetlone czołówką. Jutro czas przepytać resztę podejrzanych. Notes śledczy zaczyna pęcznieć.' },
  { n: 2, act: 1, icon: '🕐', name: 'Alibi, alibi, alibi', wait: 1, reward: 400,
    intro: 'Czworo podejrzanych, cztery wersje wydarzeń i ani jednej prawdy. Zbierz alibi Pana Marka, Beaty i Pana Henryka. A po południu warto przypadkiem zawiązywać but przy płocie Pani Krystyny – wtedy plotkuje z Natalią.',
    desc: 'Zbierz alibi wszystkich podejrzanych i podsłuchaj popołudniowe plotki (17:00–21:00).',
    goals: [G.ask('q_ma_alibi'), G.ask('q_be_alibi'), G.ask('q_he_alibi'), G.spot('s_plot'), G.spot('s_krzaki_gab')],
    outro: 'Masz cztery alibi i jedną plotkę o nocnym jedzeniu karkówki. Ktoś tu kłamie. Ale żeby to udowodnić, trzeba zajrzeć tam, gdzie kłamstwa lądują o drugiej w nocy: do śmietnika.' },
  { n: 3, act: 1, icon: '🗑️', name: 'Dziura w alibi', wait: 1, reward: 500,
    intro: 'Śmietnik mówi prawdę. Zawsze. Ale tylko między 1:30 a 3:30, kiedy właściciel śpi (albo udaje, że medytuje). Przeszukaj śmietnik Pana Marka, a potem połącz dowody na Tablicy i wskaż, czyje alibi się sypie.',
    desc: 'Nocą przeszukaj śmietnik Marka (1:30–3:30) i wskaż na Tablicy Dowodów, kto kłamie.',
    goals: [G.spot('s_smietnik'), G.deduce('d_alibi')],
    outro: 'Marek przyznał się do nocnego objadania sąsiadów. Ale do Konewki – nie. Następnego ranka pod Twoimi drzwiami leży nowy liścik: <i>„Brawo, detektywie. Szukaj dalej. Marek ma więcej do ukrycia niż karkówkę.”</i>' },
  { n: 4, act: 2, icon: '📼', name: 'Wszystko wskazuje na Marka', wait: 1, reward: 500,
    intro: 'Nagle wszyscy chcą pomóc. Pan Henryk, który „nic nie słyszy”, sugeruje, że „coś może mieć”. A pod latarnią przy jego domu stoi walizka, której wczoraj nie było. Dowody same wpadają w ręce. Dziwne, prawda?',
    desc: 'Zdobądź zaufanie Pana Henryka i przeszukaj walizkę pod latarnią.',
    goals: [G.ask('q_he_tasma'), G.spot('s_walizka')],
    outro: 'Taśma z głosem Marka i wstążka z jego inicjałami. Wszystko pasuje. Za bardzo pasuje. Jeśli Marek coś ukrywa, zrobi to nocą. Czas na zasadzkę.' },
  { n: 5, act: 2, icon: '🔦', name: 'Nocna zasadzka', wait: 1, reward: 600,
    intro: 'Plan jest prosty: termos, ciemne ubranie, krzaki przy ogrodzie Marka. O 1:00 w nocy Marek wychodzi „medytować”. Sprawdź, dokąd chodzi – a potem zajrzyj do jego skrytki.',
    desc: 'Zrób zasadzkę przy ogrodzie Marka (0:45–2:30), a potem nocą zajrzyj do jego szopy.',
    goals: [G.spot('s_obserwacja'), G.spot('s_skrytka')],
    outro: 'Listy. Czternaście listów. Ale coś się nie zgadza… Te listy nie są od Marka.' },
  { n: 6, act: 2, icon: '😰', name: 'Marek – szantażysta czy ofiara?', wait: 2, reward: 800,
    intro: 'Czas zdecydować, czym jest Marek w tej układance. Przyjrzyj się dowodom na Tablicy, a potem porozmawiaj z nim szczerze – albo podsuń mu pod nos to, co znalazłaś/eś w szopie.',
    desc: 'Rozstrzygnij na Tablicy, kim jest Marek, i wyciągnij z niego prawdę (konfrontacja, przyjaźń 45+ albo łapówka).',
    goals: [G.deduce('d_marek'), G.ask('q_ma_listy')],
    outro: 'Pierwszy zwrot akcji: Marek jest ofiarą. Szantażysta zna sekrety, które ktoś mógł tylko PODSŁUCHAĆ. A to znaczy, że gdzieś na tej ulicy są uszy. Dużo uszu. Marek potrzebuje dwóch dni, żeby to przetrawić. Ty też.' },
  { n: 7, act: 3, icon: '🔐', name: 'Kaseta pod krasnalem', wait: 1, reward: 700,
    intro: 'Marek wspomniał, że szantażysta „zawsze kopie nocą w ogrodzie Krystyny”. Pod jednym z krasnali ziemia jest świeżo skopana. Ale uwaga: Krystyna mierzy trawnik do 23:00. Kopać trzeba później. Łyżką do zupy – łopata jest za głośna.',
    desc: 'Nocą wykop kasetę w ogrodzie Krystyny (od 23:00) i rozszyfruj 4-cyfrowy kod z dowodów w notesie.',
    goals: [G.spot('s_kaseta'), G.code('kaseta')],
    outro: '„Montaż: H.” Taśma, która pogrążała Marka, została przerobiona. A tylko jedna osoba na ulicy ma sprzęt do montażu – i „nic nie słyszy”.' },
  { n: 8, act: 3, icon: '🎧', name: 'Piwnica Pana Henryka', wait: 1, reward: 800,
    intro: 'Żeby dobrać się do Pana Henryka, potrzebujesz sojuszników – ulica musi Ci ufać. Zaprzyjaźnij się z kilkoma osobami, zajrzyj nocą przez okienko jego piwnicy i dowiedz się od Natalii, co naprawdę było na nocnym live’ie Beaty.',
    desc: 'Zdobądź zaufanie 3 sąsiadów (przyjaźń 30+), zajrzyj nocą do piwnicy Henryka i wypytaj Natalię o live Beaty.',
    goals: [{ cond: c => c.friends(30) >= 3, text: 'Zdobądź zaufanie 3 sąsiadów (przyjaźń 30+)', prog: c => `${Math.min(3, c.friends(30))}/3` }, G.spot('s_piwnica'), G.ask('q_na_live')],
    outro: '38 par słuchawek. Karteczka „B. – 30%”. Gołąb w pętli. Kawałki układanki zaczynają do siebie pasować. Czas wskazać podwójnego agenta.' },
  { n: 9, act: 3, icon: '🕵️', name: 'Podwójny agent', wait: 2, reward: 1000,
    intro: 'Ktoś od pierwszego dnia „pomagał” Ci w śledztwie. Podsuwał taśmy, walizki i krasnale. Połącz na Tablicy Dowodów trzy dowody i wskaż, kto przez cały czas grał na dwa fronty.',
    desc: 'Wskaż na Tablicy, kto podkładał fałszywe dowody (3 dowody).',
    goals: [G.deduce('d_henryk')],
    outro: 'Drugi zwrot akcji: Pan Henryk był podwójnym agentem – podsłuchiwał całą ulicę i podkładał fałszywe tropy. Ale on tylko dostarczał informacje. Ktoś inny wydawał pieniądze. Na torebki. Fałszywe tropy na Tablicy zostały oznaczone 🟥.' },
  { n: 10, act: 4, icon: '👜', name: 'Torebki, długi i mosiądz', wait: 1, reward: 1000,
    intro: '„B. – 70% na torebki.” Na tej ulicy jest tylko jedna osoba, która ma więcej torebek niż mebli. Ale oskarżenie influencerki bez dowodów to samobójstwo towarzyskie na żywo. Podsłuchaj, co dzieje się wieczorami w jej willi, przekonaj Kubę, żeby powiedział prawdę, i znajdź Konewkę.',
    desc: 'Podsłuchaj Beatę i Kubę (20:00–23:00), wyciągnij prawdę od Kuby i nocą przeszukaj krzaki Beaty.',
    goals: [G.spot('s_klotnia'), G.ask('q_ku_dlugi'), G.spot('s_krzaki_beaty')],
    outro: 'Złota Konewka jest z mosiądzu. Szantażystka ma 47 torebek na raty. Wspólnik ma 38 par słuchawek. Pozostało jedno: powiedzieć to wszystko na głos. Przy wszystkich.' },
  { n: 11, act: 4, icon: '🎉', name: 'Przygotowania do przyjęcia', wait: 1, reward: 800,
    intro: 'Wielki finał musi mieć publiczność. Zorganizuj przyjęcie osiedlowe u siebie. Pani Krystyna zgodzi się zwołać ulicę tylko pod warunkiem, że będzie sernik (domowy, nie z marketu – ona POZNA). Goście muszą Ci ufać, a dom musi być gotowy na imprezę.',
    desc: 'Naucz się piec (Gotowanie 2+), urządź strefę imprezową, zbierz 1500 zł na catering i zdobądź zaufanie 2 osób (przyjaźń 40+).',
    goals: [
      { cond: c => c.skillOf('gotowanie') >= 2, text: 'Upiecz sernik dla Rady: umiejętność Gotowanie 2+', prog: c => `${c.skillOf('gotowanie')}/2` },
      { cond: c => c.party, text: 'Urządź strefę imprezową (barek, głośnik albo kino domowe)', prog: c => (c.party ? '✓' : '🛋️') },
      { cond: c => c.money >= 1500, text: 'Zbierz 1500 zł na catering', prog: c => `${Math.min(1500, Math.floor(c.money))}/1500` },
      { cond: c => c.friends(40) >= 2, text: 'Zdobądź zaufanie 2 gości (przyjaźń 40+)', prog: c => `${Math.min(2, c.friends(40))}/2` },
    ],
    outro: 'Zaproszenia rozesłane. Sernik pachnie. Beata potwierdziła przybycie emotikoną 💅. Pan Henryk – „jeśli usłyszy dzwonek”. Przyjęcie jutro wieczorem.' },
  { n: 12, act: 4, icon: '🎭', name: 'Wielka konfrontacja', wait: 0, reward: 0,
    intro: 'Lampiony, sernik, cała ulica w Twoim ogrodzie. Gdzieś między sałatką jarzynową a trzecim toastem musisz wstać, stuknąć łyżeczką w kieliszek i powiedzieć prawdę. Albo to, co uznasz za prawdę.',
    desc: 'Rozpocznij przyjęcie (18:00–23:00), wskaż szantażystę, przedstaw dowody i zdecyduj, co dalej.',
    goals: [{ finale: true, text: 'Rozpocznij przyjęcie i wielką konfrontację (18:00–23:00)' }],
    outro: '' },
];

// ---------- ZAKOŃCZENIA ----------
export const ENDINGS = {
  detective: { icon: '🕵️', name: 'Detektyw Stulecia', reward: { money: 6000, buff: 25, rel: 15, rep: 40 },
    text: 'Kładziesz na stole Konewkę z kwitem z lombardu, długi, taśmę „Montaż: H.” i zdjęcia piwnicy. Beata próbuje odpalić live’a, ale Kuba delikatnie zabiera jej telefon. Pan Henryk nagle słyszy wszystko, łącznie z syreną straży miejskiej. Marek ze łzami w oczach odzyskuje swoje 300 zł miesięcznie (i oddaje Krystynie za karkówkę). Lokalna gazeta pisze: „DETEKTYW STULECIA ZE SŁONECZNEJ ULICZKI”. Rada Osiedla nadaje Ci honorowe członkostwo i… nową Konewkę. Tym razem ze złota. Podobno.' },
  mafia: { icon: '🕶️', name: 'Nowy Szef Mafii Osiedlowej', reward: { money: 12000, buff: 15, rel: -5, rep: 10 },
    text: 'Pokazujesz wszystkim dowody… a potem chowasz je z powrotem do teczki. „Proponuję układ” – mówisz. Pan Henryk od dziś podsłuchuje dla Ciebie. Beata reklamuje Twoją firmę za darmo. Krystyna, w zamian za milczenie o krasnalach, oddaje Ci przewodnictwo Rady i 10% z czarnego rynku krasnali. Marek gotuje Ci obiady. Ulica jest spokojniejsza niż kiedykolwiek. Bo boi się Ciebie. Witaj, Szefie.' },
  escape: { icon: '🧳', name: 'Wielka Ucieczka z Walizką Gotówki', reward: { money: 20000, buff: 10, rel: -20, rep: -30 },
    text: 'W trakcie toastu zauważasz pod stołem walizkę Beaty: cały szantażowy fundusz ulicy, w gotówce. Dowody? Prawda? Sprawiedliwość? Walizka ma kółka. Gdy wszyscy kłócą się o mosiężną Konewkę, Ty spokojnie wychodzisz tylnymi drzwiami. Tydzień później wracasz z opalenizną, bo zapomniałaś/eś ładowarki. Sąsiedzi patrzą podejrzliwie. Ale kto by udowodnił? Henryk wyłączył podsłuchy. Chyba.' },
  disgrace: { icon: '🙈', name: 'Kompromitacja i Wygnanie z Rady', reward: { money: 0, buff: -15, rel: -15, rep: -40 },
    text: 'Stukasz w kieliszek, wskazujesz winnego… i zapada cisza. Taka cisza, w której słychać, jak Pan Henryk wyłącza dyktafon. Dowody się nie kleją, oskarżony płacze, Pani Krystyna zwołuje nadzwyczajne zebranie, a Ty zostajesz wykreślona/y z listy kandydatów do Rady Osiedla na 99 lat. Beata nagrywa wszystko i zarabia na tym więcej niż na szantażach. Prawdziwy szantażysta wysyła Ci kwiaty. Z bilecikiem: „Dzięki!”.' },
};
export const FINAL_REQ = (main, ev) => main === 'zosia' && ev.includes('konewka') && ['dlugi_beaty', 'petla_live', 'klotnia'].some(x => ev.includes(x)) && ['piwnica', 'tasma_oryginal'].some(x => ev.includes(x));

// ---------- pomocnicze ----------
export const inWindow = (h, w) => !w || (w[0] < w[1] ? h >= w[0] && h < w[1] : h >= w[0] || h < w[1]);
export const winText = w => { const f = x => `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round((x % 1) * 60)).padStart(2, '0')}`; return `${f(w[0])}–${f(w[1])}`; };
export const goalKey = g => g.spot ? 'spot:' + g.spot : g.ask ? 'ask:' + g.ask : g.deduce ? 'ded:' + g.deduce : g.code ? 'code:' + g.code : g.finale ? 'finale' : 'cond:' + g.text;
