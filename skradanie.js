// Skradanie się po posesjach sąsiadów: skrytki z fizycznymi dowodami, stożki wzroku, przyłapanie i artykuł w Kronice.
// Bez liczników czasu – liczy się wybór chwili (sąsiad w domu, odwrócony, daleko) i tryb skradania.

// rodzaje skrytek: pozycja na działce sąsiada zależy od strony garażu (side = +1 garaż po prawej, −1 po lewej)
// x, z – kafelki działki (dom: x 5,5–14,5, z 1–8; ogród od frontu z 8–14)
export const KINDS = {
  klomb: { icon: '🌱', name: 'Świeżo przekopany klomb', loc: 'świeżo przekopanym klombie', pos: side => [10 - side * 5.9, 10.4] },
  altana: { icon: '🛖', name: 'Zamknięta altana', loc: 'zamkniętej altanie', pos: side => [10 - side * 7.4, 3.6] },
  skrzynka: { icon: '📫', name: 'Skrzynka na listy', loc: 'skrzynce na listy', pos: () => [11.4, 13.0] },
  okno: { icon: '🪟', name: 'Okno salonu', loc: 'oknie salonu', pos: side => [10 - side * 2.9, 8.7] },
  kosz: { icon: '🗑️', name: 'Kosz przy garażu', loc: 'koszu przy garażu', pos: side => [10 + side * 5.7, 9.0] },
};

// skrytki: slot – działka, owner – kto tam mieszka (zauważy i zrobi awanturę), item – fizyczny dowód
export const STASHES = [
  { id: 'hania_klomb', slot: 'hania', kind: 'klomb', item: { icon: '📏', name: 'Zakopana srebrna linijka „K.”', desc: 'Linijka owinięta w folię, a pod nią lista sąsiadów z notatkami: „trawa 4,2 cm – SKANDAL”. Twoje nazwisko podkreślone dwa razy.' },
    find: 'Odgarniasz świeżą ziemię dłonią. Pod warstwą torfu coś błyszczy…' },
  { id: 'hania_altana', slot: 'hania', kind: 'altana', item: { icon: '📔', name: 'Tajny pamiętnik Rady Osiedla', desc: 'Pamiętnik z kłódeczką (kłódeczka z plastiku). „Dzień 412: Marek znowu zjadł karkówkę o 23:00. Odnotowano.”' },
    find: 'Drzwiczki altany są zamknięte na haczyk. Haczyk jest… dekoracyjny. W środku, pod poduszką leżaka, leży zeszyt.' },
  { id: 'hania_okno', slot: 'hania', kind: 'okno', item: { icon: '📷', name: 'Zdjęcie Twojego trawnika z czerwonym X', desc: 'Przez szparę w oknie widzisz ścianę ze zdjęciami wszystkich trawników na ulicy. Jedno odkleiło się i spadło na parapet. To Twoje.' },
    find: 'Przyklejasz nos do szyby salonu. Firanka się uchyla…' },
  { id: 'marek_kosz', slot: 'marek', kind: 'kosz', item: { icon: '🧾', name: 'Podarty czek na 50 000 zł', desc: 'Czek podarty na cztery części. Odbiorca: „Fundacja Ratowania Karkówki”. Podpis Marka i dopisek: „NIGDY WIĘCEJ”.' },
    find: 'Unosisz klapę kosza przy garażu. Zapach grilla i… papieru wartościowego.' },
  { id: 'marek_klomb', slot: 'marek', kind: 'klomb', item: { icon: '🗝️', name: 'Klucz do garażu w słoiku', desc: 'Słoik po ogórkach, w środku klucz z przywieszką „GARAŻ – NIE OTWIERAĆ PRZY RODZINIE”. Co tam jest?' },
    find: 'Klomb wygląda, jakby przekopywał go ktoś w panice o drugiej w nocy.' },
  { id: 'marek_okno', slot: 'marek', kind: 'okno', item: { icon: '🕯️', name: 'Kadzidełko „Zen Millionaire”', desc: 'Na parapecie stoi otwarta paczka kadzidełek i podręcznik „Medytuj i bogać się w 7 dni”. Jedno kadzidełko wypadło na zewnątrz.' },
    find: 'W salonie Marka stoi złoty Budda z naklejką z ceną.' },
  { id: 'ola_altana', slot: 'ola', kind: 'altana', item: { icon: '📓', name: 'Pamiętnik Zosi', desc: '„Kochany pamiętniku, 80% moich obserwujących to boty. Pozostałe 20% to mama i Kuba z trzech kont.”' },
    find: 'W altanie ring light, statyw i stos sukienek z metkami. Na pufie leży różowy zeszyt.' },
  { id: 'ola_kosz', slot: 'ola', kind: 'kosz', item: { icon: '🎸', name: 'List z wytwórni (z odmową)', desc: '„Szanowny Panie Kubo, Pana utwór „Sałatka dla Beaty” nie spełnia naszych wymogów. Ani żadnych innych.” Zgnieciony i przemoczony łzami.' },
    find: 'W koszu przy garażu: struny, kostki do gitary i zmięta koperta z logo wytwórni.' },
  { id: 'ola_klomb', slot: 'ola', kind: 'klomb', item: { icon: '💍', name: 'Pierścionek zaręczynowy w pudełku', desc: 'Ktoś go tu zakopał „na przechowanie”. Na wieczku: „Dla Z. – jak już będę sławny”.' },
    find: 'Kopiesz w klombie Zosi i Kuby. Ziemia jest miękka, jakby ktoś coś tu chował całkiem niedawno.' },
  { id: 'f1_okno', slot: 'f1', kind: 'okno', item: { icon: '📜', name: 'Przepis z dopiskiem', desc: 'Przepis na słynny sos Natalii. Na dole drobnym pismem: „od mamy Pani Krystyny, NIE MÓWIĆ”.' },
    find: 'Z kuchni Natalii pachnie czosnkiem. Na parapecie leży kartka przyciśnięta słoikiem.' },
  { id: 'f1_kosz', slot: 'f1', kind: 'kosz', item: { icon: '🥫', name: 'Puste opakowania gotowego sosu', desc: 'Dwanaście saszetek „Sos Babuni – gotowy w 2 minuty”. Ten sam, który Natalia podaje jako „rodzinny przepis”.' },
    find: 'Kosz przy garażu jest pełny… saszetek.' },
  { id: 'f1_altana', slot: 'f1', kind: 'altana', item: { icon: '💌', name: 'Listy miłosne bez podpisu', desc: 'Plik listów przewiązany czerwoną wstążką. Wszystkie zaczynają się od „Najdroższy Sąsiedzie…”. Który sąsiad?' },
    find: 'W altanie Natalii świeczki, poduszki w serca i pachnąca lawendą szkatułka.' },
  { id: 'f2_altana', slot: 'f2', kind: 'altana', item: { icon: '🎙️', name: 'Mikrofon szpiegowski i taśmy', desc: 'Pudełko z taśmami podpisanymi „ULICA – WTOREK”, „ULICA – ŚRODA”… Pan Henryk słyszy WSZYSTKO. Zawsze słyszał.' },
    find: 'Altana Pana Henryka jest zamknięta na kłódkę. Kłódka jest otwarta. Bardzo w jego stylu.' },
  { id: 'f2_okno', slot: 'f2', kind: 'okno', item: { icon: '🦻', name: 'Wyłączony aparat słuchowy', desc: 'Aparat słuchowy z wyjętą baterią, na parapecie. Obok kartka: „Udawać, że nie słyszę – działa od 1994”.' },
    find: 'Zaglądasz do salonu Pana Henryka. Na stole pięć radioodbiorników nastawionych na… mikrofony z ulicy.' },
  { id: 'f2_klomb', slot: 'f2', kind: 'klomb', item: { icon: '🦆', name: 'Gumowa kaczka w maleńkim melonie', desc: 'Dziwny przedmiot: gumowa kaczka w kapelusiku z melonem. Na spodzie wypalone: „P.w.K.”. Czy to ma związek z Panem w Kapeluszu?' },
    find: 'W klombie coś piszczy, kiedy na to nadepniesz.' },
];

// Kronika: artykuł o włamywaczu następnego dnia
export const HEADS = ['Włamywacz na Słonecznej Uliczce!', 'Ktoś myszkuje po ogrodach!', 'Skandal: intruz na posesji sąsiada', 'Nocny (i dzienny) gość w cudzym ogródku'];
export const ARTICLE = [
  '{o} relacjonuje: „Patrzę, a tu {me} w moim ogródku, przy {k}. Na czworakach!” Redakcja apeluje o czujność i zamykanie altan.',
  'Mieszkańcy są zaniepokojeni: {me} [został|została] [przyłapany|przyłapana] na posesji {o_gen}, przy {k}. „[Udawał|Udawała], że szuka kota. Nie ma kota” – mówi świadek.',
  'Według naszych informatorów {me} „[podziwiał|podziwiała] roślinność” na cudzej działce (przy {k}). Nikt nie wierzy w zainteresowania botaniczne.',
];
export const CAUGHT_OWNER = ['💢 CO TY ROBISZ NA MOJEJ POSESJI?!', '💢 STÓJ! Widzę Cię! Złodziej!', '💢 To MÓJ ogród! Wynocha, natychmiast!', '💢 Wiedziałam/em, że coś kombinujesz!'];
export const CAUGHT_OTHER = ['😱 Hej! Ktoś grzebie u {o}!', '😱 Złodziej! {o}, szybko!', '😱 Widzę Cię! Co Ty tam robisz?!'];
export const CAUGHT_ME = ['Eee… szukam kota! 😅', 'To nie tak, jak wygląda! 😳', 'Ja tylko… podziwiam klomb! 🌱'];
export const FOUND_ME = ['Mam to! 🤫', 'Cichutko… mam! 😏', 'Bingo. Nikt nie widział. 🥷'];
export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');

// ================= WNĘTRZA DOMÓW SĄSIADÓW =================
// Wspólny układ (kafelki 1 m, ten sam układ współrzędnych co działka): sypialnia (tył-lewo), pracownia (tył-prawo),
// kuchnia (przód-lewo), salon z wejściem (przód-prawo). Ściany: komórki 2 m (jak w budowie domu).
export const IN_ROOMS = { bedroom: 'Sypialnia', study: 'Pracownia', kitchen: 'Kuchnia', living: 'Salon' };
export const IN_ENTRY = { x: 12, z: 11 };       // kafelek tuż za drzwiami wejściowymi
export const IN_DOOR = { x: 12.9, z: 12.4 };     // znacznik wyjścia
// wspólne meble: [typ, x, z, rot]
export const IN_BASE = [
  ['bed', 5, 2], ['lamp', 4, 2], ['plant', 7, 2], ['books', 9, 2], ['rug', 5, 4],
  ['desk', 11, 2], ['books', 13, 2], ['lamp', 15, 2],
  ['fridge', 4, 6], ['stove', 5, 6], ['counter', 8, 6], ['counter', 9, 6], ['table', 5, 9],
  ['tv', 10, 6], ['rug', 10, 7], ['sofa', 10, 10, 2], ['plant', 15, 6], ['lamp', 15, 11], ['artRight', 15, 7],
];
// charakter domu: kolory podłóg, dodatkowe meble (hobby)
export const IN_STYLE = {
  hania: { floor: 'oak', extra: [['plant', 14, 2], ['plant', 4, 11], ['books', 14, 5, 2]], vibe: 'Wszędzie serwetki, porcelanowe pieski i równo przycięte paprotki. Pachnie lawendą i kontrolą.' },
  marek: { floor: 'parquet', extra: [['speaker', 14, 2], ['fireplace', 13, 6], ['coffeeTable', 12, 8]], vibe: 'Skórzana kanapa, złoty Budda i zapach grilla. Na ścianie dyplom „Milioner Roku (osiedla)”.' },
  ola: { floor: 'oak', extra: [['guitar', 14, 2], ['easel', 15, 4], ['speaker', 14, 9]], vibe: 'Ring light w każdym kącie, gitary i sukienki z metkami. Ktoś tu nagrywa relacje i piosenki naraz.' },
  f1: { floor: 'terracotta', extra: [['counter', 7, 6], ['plant', 4, 11], ['coffeeTable', 12, 8]], vibe: 'Pachnie czosnkiem i bazylią. Na każdym blacie słoiki z przyprawami podpisane ozdobnym pismem.' },
  f2: { floor: 'parquet', extra: [['speaker', 14, 2], ['phone', 15, 4], ['speaker', 4, 11]], vibe: 'Pięć radioodbiorników, kable i słuchawki. Cisza tak głęboka, że słychać, jak ktoś słucha.' },
};
// miejsca skrytek we wnętrzu: znacznik (x, z) i kafelek, z którego się sięga
export const IN_SPOTS = {
  biurko: { icon: '🗄️', name: 'Szuflada biurka', loc: 'szufladzie biurka', at: [11.9, 2.6], tile: [11, 3] },
  lozko: { icon: '🛏️', name: 'Pod materacem', loc: 'łóżku', at: [5.9, 3.2], tile: [7, 3] },
  kuchnia: { icon: '🫙', name: 'Szafka kuchenna', loc: 'szafce kuchennej', at: [9.5, 6.6], tile: [9, 7] },
  obraz: { icon: '🖼️', name: 'Sejf za obrazem', loc: 'obrazie w salonie', at: [15.6, 8.0], tile: [14, 8] },
  szafa: { icon: '📚', name: 'Regał w sypialni', loc: 'regale w sypialni', at: [9.5, 2.6], tile: [9, 3] },
};
export const IN_STASHES = [
  { id: 'hania_in_biurko', slot: 'hania', spot: 'biurko', item: { icon: '📁', name: 'Teczka „Akta trawników 1987–2025”', desc: 'Grube akta: każdy trawnik na ulicy, zmierzony co tydzień. Przy Twoim adresie: „OBSERWOWAĆ. PODEJRZANA/Y.”' } },
  { id: 'hania_in_szafa', slot: 'hania', spot: 'szafa', item: { icon: '🏆', name: 'Puchar „Najkrótsza Trawa 1987”', desc: 'Na pucharze wygrawerowane cudze nazwisko, zaklejone taśmą z napisem „K.”. Czyżby legenda była… pożyczona?' } },
  { id: 'marek_in_obraz', slot: 'marek', spot: 'obraz', item: { icon: '💼', name: 'Teczka z sejfu: „Plan B – Malediwy”', desc: 'Bilety w jedną stronę, broszura „Jak zniknąć z osiedla” i lista: „Nie mówić Beacie. Nie mówić nikomu.”' } },
  { id: 'marek_in_kuchnia', slot: 'marek', spot: 'kuchnia', item: { icon: '🥩', name: 'Szafka „DIETA” pełna karkówki', desc: 'Na drzwiczkach karteczka „DIETA – NIE OTWIERAĆ”. W środku 9 kg karkówki i sos barbecue w hurtowym opakowaniu.' } },
  { id: 'ola_in_lozko', slot: 'ola', spot: 'lozko', item: { icon: '🧾', name: 'Faktura za 50 000 obserwujących', desc: 'Pod materacem: faktura „Followers Express – pakiet Gwiazda”. Zapłacone z konta Kuby.' } },
  { id: 'ola_in_biurko', slot: 'ola', spot: 'biurko', item: { icon: '🎼', name: 'Tekst piosenki z przekreślonym imieniem', desc: '„Zosiu, Zosiu, gwiazdo ma…” – „Zosiu” przekreślone, a nad nim dopisane: „Natalio”. Kuba, co Ty kombinujesz?' } },
  { id: 'f1_in_kuchnia', slot: 'f1', spot: 'kuchnia', item: { icon: '📕', name: 'Książka kucharska z ekslibrisem „K.”', desc: 'Stara książka z przepisami. Na wyklejce: „Własność Krystyny. Nie wynosić!” Słynny sos Natalii jest na stronie 47.' } },
  { id: 'f1_in_szafa', slot: 'f1', spot: 'szafa', item: { icon: '💗', name: 'Dziennik zakochanej', desc: '„Dzień 30: On ma gitarę i smutne oczy. Dzień 31: Zosia znowu stała przy nim. Dzień 32: Muszę coś zrobić.”' } },
  { id: 'f2_in_biurko', slot: 'f2', spot: 'biurko', item: { icon: '🗺️', name: 'Mapa ulicy z mikrofonami', desc: 'Plan Słonecznej Uliczki z 23 czerwonymi kropkami. Jedna jest… w Twoim ogrodzie, pod krasnalem.' } },
  { id: 'f2_in_obraz', slot: 'f2', spot: 'obraz', item: { icon: '🎩', name: 'Czarny melonik za obrazem', desc: 'W sejfie za obrazem leży czarny melonik i okulary przeciwsłoneczne. Pan w Kapeluszu… to Pan Henryk?!' } },
];
export const BREAKIN_HEADS = ['Włamanie na Słonecznej Uliczce!', 'Ktoś wszedł do domu sąsiada!', 'Intruz w salonie: osiedle w szoku'];
export const BREAKIN_TEXT = ['{o} wrócił(a) z kuchni i zastał(a) w swoim domu nieproszonego gościa: {me}. „[Stał|Stała] przy {k} i [udawał|udawała], że podziwia meble!” Policja osiedlowa (Pani Krystyna) wszczęła postępowanie.', 'Szok na Słonecznej: {me} [przyłapany|przyłapana] we wnętrzu domu {o_gen}. Według świadków „[miał|miała] minę kogoś, kto szuka czegoś bardzo konkretnego”.'];
export const CAUGHT_INSIDE = ['💢 WŁAMANIE?! W MOIM DOMU?!', '💢 Co Ty robisz w moim salonie?! WYNOCHA!', '💢 Ratunku! Złodziej! A nie, to Ty… TYM GORZEJ!'];
export const WAKE = ['😴… Hm? Kto tam?', '😳 Słyszę kroki!'];
// [męska|żeńska] – forma dla gracza, (a) – forma dla gospodarza
export const gform = (t, meFem, oFem) => t.replace(/\[([^|\]]*)\|([^\]]*)\]/g, (m, a, b) => meFem ? b : a).replace(/(\p{L}+)\(a\)/gu, (m, x) => x + (oFem ? 'a' : ''));
