// Sąsiedzkie intrygi: sekrety, plotki, „głuchy telefon”, sojusze i Kronika Słonecznej Uliczki.
// Same dane i czysta logika; okna, relacje i czas obsługuje gra.
// W tekstach {n} = imię osoby, której dotyczy sekret.

// full – pełna wersja (Opowiadaj!), half – połowiczna (Wysłuchaj), head – nagłówek do Kroniki
const X = (id, icon, full, half, head) => ({ id, icon, full, half, head });
export const SECRETS = [
  X('peruka', '💇', '{n} nosi perukę. I ma trzy zapasowe, nazwane imionami byłych sympatii: Zbyszek, Mariolka i Pan Ryszard.', '{n} coś kombinuje z włosami… podobno za dobrze wyglądają jak na ten wiek.', 'Fryzura z drugiej ręki? {n} ma w szafie trzy peruki z imionami!'),
  X('krasnal', '🧌', '{n} rozmawia nocą z krasnalem ogrodowym. Opowiada mu o problemach. Krasnal ma na imię Waldek i podobno „najlepiej słucha”.', '{n} wychodzi nocą do ogrodu i z kimś rozmawia. Ale tam nikogo nie ma…', 'Nocne zwierzenia przy rabatce: {n} i krasnal Waldek – najlepsi przyjaciele?'),
  X('trawa', '🌱', '{n} ma idealny trawnik… z plastiku. Sztuczna trawa z marketu, a co sobotę udawane podlewanie dla publiczności.', '{n} ma podejrzanie równy trawnik. Za zielony. Nawet w sierpniu.', 'Plastikowa prawda! Trawnik roku na Słonecznej Uliczce kupiony w markecie'),
  X('sernik', '🍰', '{n} kupuje swój słynny „domowy” sernik w cukierni „Pod Pączkiem”. Przekłada go do własnej blachy, a pudełko pali w kominku.', '{n} piecze sernik… ale nikt nigdy nie widział, żeby w tym domu włączał się piekarnik.', 'Afera sernikowa! {n} kupuje „domowe” ciasto w cukierni'),
  X('karaoke', '🎤', 'W każdy czwartek {n} śpiewa w barze karaoke w masce i pelerynie jako „Zorro Disco”. Ma fanklub. Fanklub nie wie, kto to.', '{n} w czwartki znika wieczorem i wraca o północy z brokatem we włosach.', 'Zorro Disco zdemaskowane! To {n} śpiewa w czwartki w karaoke'),
  X('koty', '🐈', '{n} twierdzi, że nie ma zwierząt. Ma siedem kotów. Jeden ma konto na Instagramie i więcej obserwujących niż burmistrz.', 'Gdy {n} jest w domu, słychać miauczenie. Wielogłosowe.', 'Siedem kotów i jeden celebryta! {n} ukrywał(a) futrzaną rodzinę'),
  X('dyplom', '🎓', '{n} ma w salonie dyplom z Harvardu wydrukowany w punkcie ksero przy dworcu. Za 4,50 zł. Z laminowaniem.', '{n} ma w salonie dyplom… ktoś zauważył, że „Harvard” jest napisany przez dwa „r”.', 'Harrvard z ksero! {n} i dyplom za 4,50 zł'),
  X('taniec', '💃', '{n} w tajemnicy chodzi na lekcje tańca brzucha dla początkujących. Jest najlepszą osobą w grupie. Ma przydomek „Huragan”.', '{n} we wtorki wraca do domu z dzwoneczkami przy pasku i bardzo dobrym humorem.', 'Huragan ze Słonecznej! {n} gwiazdą lekcji tańca brzucha'),
  X('recenzje', '✍️', '{n} pisze anonimowe recenzje restauracji jako „Krytyk Kulinarny 3000”. Wszystkie 214 recenzji dotyczą pierogów.', '{n} ciągle stuka coś w telefonie po wyjściu z pierogarni. Bardzo zawzięcie.', 'Krytyk Kulinarny 3000 zdemaskowany! To {n} i obsesja pierogów'),
  X('auto', '🚗', '{n} jeździ luksusowym autem pożyczonym od szwagra. Na raty. Szwagier też jeszcze je spłaca.', '{n} jakoś nerwowo myje to nowe auto. Jakby nie było do końca swoje.', 'Pożyczony luksus! {n} jeździ autem szwagra (i banku)'),
  X('akwarium', '🐟', '{n} podlewa rośliny sąsiadów wodą z akwarium, „bo to naturalny nawóz”. Rybki są zdania, że to kradzież.', '{n} czasem kręci się z konewką przy cudzych płotach. Konewka dziwnie pachnie.', 'Nawóz z akwarium! {n} podlewał(a) cudze ogrody wodą od rybek'),
  X('telenowela', '📺', '{n} płakał(a) na finale telenoweli „Miłość w Promocji” tak głośno, że sąsiedzi zadzwonili po straż. Strażacy też płakali.', '{n} kilka tygodni temu tak szlochał(a), że podobno przyjechała straż.', 'Łzy, straż i telenowela! {n} wzruszył(a) całą ulicę'),
  X('joga', '🧘', 'Na zajęciach jogi {n} „medytuje” w pozycji dziecka. W rzeczywistości śpi. I chrapie. Instruktorka nazywa to „oddechem wewnętrznego niedźwiedzia”.', 'Na jodze {n} zawsze leży najdłużej ze wszystkich. Podejrzanie spokojnie.', 'Joga czy drzemka? {n} chrapie na zajęciach medytacji'),
  X('paczki', '📦', '{n} zamawia 15 paczek tygodniowo i chowa je w garażu, żeby rodzina nie widziała. W garażu nie ma już miejsca na auto.', '{n} codziennie odbiera paczki od kuriera. Czasem dwa razy.', 'Garaż pełen tajemnic! {n} i 15 paczek tygodniowo'),
  X('fryzjer', '✂️', '{n} mówi, że strzyże się u stylisty w Paryżu. W rzeczywistości robi to sam(a) nożyczkami do paznokci przed lustrem w łazience.', '{n} po „wizycie w Paryżu” ma dziwnie krzywą grzywkę.', 'Paryż czy łazienka? {n} strzyże się nożyczkami do paznokci!'),
  X('ogrodnik', '🥕', '{n} kupuje nagrodzone marchewki na targu i wkopuje je do grządki w noc przed konkursem.', '{n} w noc przed konkursem ogrodniczym kopie w grządkach z czołówką na głowie.', 'Marchewkowy przekręt! {n} i rekordowe warzywa prosto z targu'),
];
export const SEC = Object.fromEntries(SECRETS.map(s => [s.id, s]));

// ---------- zaczepki plotkarzy ----------
export const OPENERS = [
  'Nie uwierzysz, co wyszło na jaw! Bohater dnia: {t}. Chcesz o tym poplotkować?',
  'Psst! Chodź tu bliżej. Wiesz, co robi {t}? Opowiedzieć?',
  'Tylko nikomu nie mów… {t} ma taki sekret, że aż mnie skręca. Chcesz posłuchać?',
  'Słuchaj, muszę to komuś powiedzieć, bo pęknę. {t} – i to grubsza sprawa. Wchodzisz?',
  'Mam gorący temat. Bardzo gorący. {t}! Poplotkujemy?',
];
export const PARTNER_OPENERS = ['Kochanie, wiesz, co dziś usłyszałem/am? {t} ma niezły sekret… Chcesz posłuchać?', 'Usiądź, bo się przewrócisz. Wiesz, co robi {t}?'];
export const CHOICES = {
  fuel: ['🔥', '„Opowiadaj! Też coś zauważyłam/em…”', 'Podsycasz plotkę: przyjaźń z rozmówcą rośnie mocno, poznajesz cały sekret, ale plotka może wyciec'],
  defend: ['🛡️', '„Nieładnie tak mówić za plecami.”', 'Bronisz sąsiada: plotkarz się obraża, ale rośnie Twoja reputacja i zaufanie obgadywanej osoby'],
  listen: ['🤐', '„Hmm, ciekawe… mów dalej.”', 'Słuchasz bez komentarza: połowa informacji, zero ryzyka'],
};
export const DEFEND_LINES = ['No wiesz… Ja tylko mówię, co słyszałam/em. 😤', 'Phi. Święta się znalazła/znalazł. 🙄', 'Dobra, dobra. Już nic nie mówię. 😒'];

// ---------- konfrontacje po wycieku ----------
export const CONFRONT = [
  '{t} staje przed Tobą czerwona/y ze złości: „Słyszałam/em, co o mnie opowiadasz! {s} Cała ta historia?! Jak śmiesz?!”',
  '{t} wali do drzwi: „Otwieraj! Cała ulica wie, że to TY rozpowiadasz o mnie plotki! {s}”',
  '{t} zatrzymuje Cię na chodniku i dźga palcem w powietrze: „Myślisz, że się nie dowiem? {s} Ładnie, bardzo ładnie!”',
];
export const LEAK_HEADS = ['Skandal na ulicy! Wyszło na jaw, kto rozpuszcza plotki!', 'Głuchy telefon dzwoni dwa razy! Plotka wróciła do nadawcy', 'Awantura pod płotem! Sąsiedzka przyjaźń w gruzach'];

// ---------- reakcje na „Obgadaj innego sąsiada” (zależnie od cech słuchacza) ----------
export const GOSSIP_REACT = {
  zlosliwy: ['Ha! Wiedziałam/em! Mów więcej! 😈', 'O, to mi się podoba. Masz jeszcze coś? 😏'],
  towarzyski: ['Nieee! Serio? Muszę to komuś powiedzieć! 🤭', 'Uwielbiam Cię! Kawa jutro, opowiesz więcej? ☕'],
  rodzinny: ['Hmm… nie wiem, czy powinniśmy o tym mówić. 😕', 'Każdy ma swoje sprawy, wiesz…'],
  introwertyk: ['…Okej. 😶', 'Nie bardzo lubię takie rozmowy.'],
  wspierajacy: ['Może po prostu z nią/nim porozmawiaj? 🤗'],
  default: ['Ojej. No proszę. 😮', 'Kto by pomyślał! 😯'],
};
export const LEAK_BASE = 0.35, LEAK_HIGH = 0.7, LEAK_ALLY = 0.12;
export const leakChance = traits => (traits || []).some(t => t === 'zlosliwy' || t === 'towarzyski') ? LEAK_HIGH : LEAK_BASE;
export const fill = (s, o) => s.replace(/\{n\}/g, o.n || '').replace(/\{t\}/g, o.t || '').replace(/\{s\}/g, o.s || '');
