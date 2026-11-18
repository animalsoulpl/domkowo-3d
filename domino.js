// Silnik Przyczynowo-Skutkowy („Efekt Domina”): kwestie dymków, reakcje świadków, zemsta sąsiadów.
// Formy rodzajowe dopasowuje gx(tekst, mówiącyKobieta, adresatKobieta): „widziałam/em” – mówiący, „zrobiłaś/eś” i „był(a)” – adresat, „Życzliwy/a” – mówiący.
// {me} – imię gracza, {t} – osoba, której dotyczy zdarzenie, {w} – świadek

// ikonki emocji nad głowami (z animacją CSS)
export const EMO = {
  shock: '😱', anger: '💢', bolt: '⚡', heart: '💔', ear: '👂', what: '❓', eyes: '👀', shh: '🤫', sad: '😢', smug: '😏', note: '📝', love: '💕', sweat: '😅',
};
export const EMO_ANIM = { '⚡': 'shake', '💢': 'shake', '💔': 'break', '👂': 'pulse', '❓': 'wobble', '😱': 'pop', '👀': 'look', '🤫': 'pulse', '📝': 'pop', '😏': 'pop', '😢': 'drop', '💕': 'float', '😅': 'pop' };

// świadkowie: kind → rola → kwestie
export const WITNESS = {
  flirt: {
    partner: ['Serio? Na moich oczach?!', 'Myślałam/em, że jesteśmy drużyną…', 'Widziałam/em wszystko. WSZYSTKO.', 'Ja tu stoję, wiesz?'],
    targetPartner: ['Hej! To moja druga połówka!', 'Odsuń się od {t}. Już.', 'Ładnie to tak, przy ludziach?'],
    moralist: ['Tak się nie robi, kiedy jest się w związku…', 'Ojej. Ojej, ojej.', 'Nie widziałam/em tego. Ale zapamiętam.'],
    gossip: ['Ooo, to pójdzie w świat… 😏', 'Muszę to komuś opowiedzieć!', 'No proszę, proszę…'],
    other: ['Ekhm… ja tylko przechodzę.', 'Udam, że nic nie widziałam/em.', 'Hmm… ciekawe.'],
  },
  gossip: {
    target: ['Słyszę każde słowo, wiesz?', 'Serio? Myślałam/em, że jesteśmy po jednej stronie…', 'Mówisz tak o mnie? Za plecami?'],
    moralist: ['Nieładnie tak obgadywać ludzi.', 'Nie mam dziś siły na te gierki.', 'Plotki zawsze wracają, pamiętaj.'],
    gossip: ['Mów dalej, mów! 👂', 'Wiedziałam/em! Zawsze to mówiłam/em!', 'O, to dobre. Zapamiętam.'],
    other: ['Lepiej się do tego nie mieszać.', 'Hmm, to by wiele wyjaśniało…'],
  },
  search: {
    owner: ['Co Ty robisz na MOJEJ posesji?!', 'Widziałam/em wszystko z okna!', 'Zaraz dzwonię na policję!'],
    other: ['Widziałam/em wszystko z okna.', 'A to ciekawe… kto tak grzebie u sąsiadów?', 'Ktoś tu węszy…'],
  },
  argue: {
    target: ['I jeszcze się wydzierasz?!', 'Dość tego!'],
    friendOfTarget: ['Zostaw {t} w spokoju!', 'Hej, spokojnie! {t} to moja bratnia dusza!'],
    partner: ['Możecie przestać? Ludzie patrzą…', 'Nie mam dziś siły na te gierki.'],
    other: ['Co tu się dzieje?!', 'Ale awantura…', 'Lepiej się nie wtrącać.'],
  },
};

// awantura na ganku (złośliwa wizyta wrogiego sąsiada)
export const DOOR = {
  ring: ['🔔 Otwieraj!', '🔔 Puk, puk. MOCNO.', '🔔 Wiem, że jesteś w domu!'],
  open: ['No wreszcie! Musimy pogadać.', 'Ty chyba myślisz, że nikt nic nie widzi?', 'Przyszłam/em wyjaśnić parę spraw. Głośno.'],
  rant: [
    'Cała ulica wie, co zrobiłaś/eś!', 'Myślałaś/eś, że się nie dowiem?', 'Twoje plotki mi zrujnowały tydzień!',
    'Trzymaj się z daleka od mojego płotu!', 'Ja tego tak nie zostawię!', 'Wstyd mi, że mieszkam przy tej samej ulicy!',
  ],
  reasons: { gossip: 'Obgadujesz mnie za plecami!', flirt: 'Widziałam/em ten flirt! Wstydź się!', search: 'Grzebałaś/eś na mojej posesji!', argue: 'Po tej kłótni nawet się nie odezwałaś/eś!', default: 'Od dawna mam Cię dosyć!' },
  apologize: ['Przepraszam… nie chciałam/em.', 'Masz rację, przesadziłam/em. Przepraszam.'],
  apologyReact: ['…Dobra. Ale mam Cię na oku.', 'Hmph. Przyjmuję. Na razie.'],
  fight: ['A Ty co? Sędzia się znalazł(a)?!', 'Wynocha z mojego ganku!', 'Mów ciszej, sąsiedzi patrzą!'],
  fightReact: ['Jeszcze tego pożałujesz!', 'Zobaczymy, kto się będzie śmiał ostatni!'],
  slam: ['💥 *trzask drzwi*'],
  slamReact: ['Taaak, uciekaj! Cała ulica słyszała!', 'Drzwiami nic nie załatwisz!'],
  ignored: ['Wiem, że tam jesteś!', 'Tchórzu! Pokaż się!'],
  passers: ['Co tu się dzieje?!', 'Ojej, awantura…', 'Szybko, gdzie mój telefon?', 'Ale scena!'],
};

// drobny sabotaż posesji
export const SABOTAGE = {
  trashFound: ['Kto przewrócił nasz kosz?!', 'Śmieci na całym trawniku… super poranek.', 'To nie był wiatr. Wiatr nie zostawia śladów butów.'],
  noteFound: ['Ktoś zostawił kartkę pod drzwiami…', 'Anonim? Serio? W tym wieku?'],
  notes: [
    '„Niektórzy powinni pilnować swojego nosa. Życzliwy/a.”',
    '„Wiemy, co robisz. Cała ulica wie.”',
    '„Twój trawnik jest za długi. Twoje kłamstwa też.”',
    '„Wyprowadź się, dopóki jeszcze możesz.”',
    '„Uśmiechaj się. Ktoś patrzy.”',
  ],
  sneak: ['🤫', '😈', '🤭'],
};

// nastawianie ulicy (efekt kuli śnieżnej)
export const WHISPER = {
  whisperer: ['Psst… słyszałaś/eś o {me}?', 'Nie mów nikomu, ale {me}…', 'Uważaj na {me}. Mówię Ci.'],
  listener: ['Nie może być! 😳', 'Wiedziałam/em, że coś jest nie tak…', 'Serio?! Od dziś omijam szerokim łukiem.'],
  avoid: ['Nie mam ochoty z Tobą rozmawiać.', 'Słyszałam/em to i owo… Daj mi spokój.', 'Może innym razem. Albo nigdy.'],
  avoidWalk: ['…', '🙄', 'O, nie…'],
};

// codzienne komentarze w dymkach zamiast okienek
export const COMMENT = {
  inviteCall: ['📞 {t} dzwoni: „{x}”'],
  gossipAsk: ['No dobra… o kim plotkujemy? 👂'],
  allyYes: ['Od dziś Ty mówisz mi, ja mówię Tobie. 🤝', 'Pakt? Pakt. Nikomu ani słowa. 🤝'],
  allyNo: ['Sojusz? Ze mną? Najpierw zasłuż na zaufanie. 🙄'],
  coaxYes: ['Ojej… właściwie mogę Ci powiedzieć, tylko nikomu! 😳'],
  coaxNo: ['Ty coś kombinujesz. Za dużo pytasz. 🤨'],
  warned: ['Wiedziałam/em, że {t} to żmija. Dziękuję! 🫢'],
  blackmailAngry: ['Szantażujesz MNIE?! Proszę bardzo, mów wszystkim! 😡'],
  blackmailPay: ['To zostaje między nami. Rozumiemy się? 💰'],
  blackmailFavor: ['Dobrze… szepnę słówko tu i ówdzie. 😒'],
};
export const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
export const pick = a => a[Math.floor(Math.random() * a.length)];
export function gx(t, sp, ad) {
  return t.replace(/(\p{L}+)am\/em(?!\p{L})/gu, (m, x) => x + (sp ? 'am' : 'em'))
    .replace(/(\p{L}+)aś\/eś(?!\p{L})/gu, (m, x) => x + (ad ? 'aś' : 'eś'))
    .replace(/(\p{L}+)\(a\)/gu, (m, x) => x + (ad ? 'a' : ''))
    .replace(/(\p{L}+)y\/a(?!\p{L})/gu, (m, x) => x + (sp ? 'a' : 'y'));
}
