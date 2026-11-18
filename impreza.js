// Imprezy: aplikacja „Gale i Przyjęcia” w telefonie, motywy, odpowiedzi SMS, stroje i zabawne incydenty.
// Same dane; sceny 3D, goście i muzyka są w grze.

export const THEMES = {
  gala: { id: 'gala', icon: '🏖️', name: 'Charytatywna Gala przy Basenie', cost: 800, music: 'lounge', hour: 20.1,
    desc: 'Złocisto-różowy zachód słońca, girlandy lampek nad basenem, świecące materace, bar koktajlowy z barmanem, fontanna czekoladowa i białe loże. Stroje: letnie i koktajlowe. Muzyka lounge.' },
  bal: { id: 'bal', icon: '🎭', name: 'Tajemniczy Bal Maskowy w Rezydencji', cost: 1200, music: 'waltz', hour: 22.5,
    desc: 'Elegancka noc w stylu Beverly Hills: czerwony dywan ze złotymi słupkami, stół bankietowy ze świecznikami, piramida z kieliszków szampana i kominek w pełnym ogniu. Suknie, smokingi i maski. Walc fortepianowy.' },
  jacht: { id: 'jacht', icon: '🛥️', name: 'Ekskluzywna Impreza na Superjachcie', cost: 3000, music: 'yacht', hour: 23,
    desc: 'Przenosicie się na pokład białego superjachtu na nocnym oceanie: neonowe barierki, jacuzzi z bąbelkami, parkiet, bar i kanapy na rufie, a na horyzoncie światła miasta.' },
};

// odpowiedzi SMS (najpierw osobiste, potem ogólne)
export const SMS = {
  hania: ['Przyjdę sprawdzić, jak przyjmujesz gości. Linijkę wezmę ze sobą. 📏', 'Będę punktualnie. Czyli 15 minut przed czasem.'],
  marek: ['Będę, jeśli będzie dobry catering 🍖', 'Wpadnę! Tylko nie mów listonoszowi, gdzie jestem.'],
  zosia: ['Już prasuję sukienkę! 💅 Będzie live!', 'Jasne! Mam nadzieję, że oświetlenie będzie instagramowe ✨'],
  kuba: ['Wezmę gitarę 🎸 (Beata mówi, że nie mogę)', 'Jestem! Gdzie mam stawić się z sałatką?'],
  natalia: ['Przyniosę deser! Nie odmawiaj! 🍰', 'Lecę! Kto jeszcze będzie? Pytam… dla siebie 😏'],
  tomek: ['CO? Impreza? Przyjdę. Nic nie słyszałem, ale przyjdę. 🔧', 'Będę. Postaram się niczego nie nagrywać.'],
  generic: ['Już się szykuję! 🎉', 'Będę na pewno! 😊', 'Wpadnę! Mam nowe buty do przetestowania 👠', 'Tak! W końcu jakieś wydarzenie na tej ulicy!'],
  decline: ['Przykro mi, w tym terminie mierzę trawnik. 🙄', 'Nie przyjdę. Wiesz dlaczego. 😤', 'Mam inne plany. Bardzo ważne. Z kotem.'],
  theme: {
    gala: ['Biorę strój kąpielowy i dobry humor! 🩱', 'Basen i koktajle? Już jadę! 🍹'],
    bal: ['Która maska lepsza – złota czy czarna? 🎭', 'Ćwiczę walca przed lustrem! 💃'],
    jacht: ['JACHT?! Wezmę tabletki na chorobę morską ⛵', 'Pierwszy raz na jachcie! Zakładam marynarską czapkę ⚓'],
  },
};

// stroje: kobieta / mężczyzna (nadpisuje pola wyglądu)
const pick = a => a[Math.floor(Math.random() * a.length)];
export function partyLook(look, theme) {
  const f = (look.body || 'f') === 'f', L = { ...look, acc: { ...(look.acc || {}) }, pattern: 'plain', topPattern: 'plain', bottomPattern: 'plain', tights: null };
  if (theme === 'gala') { if (f) Object.assign(L, { outfitType: 'dress_flare', top: pick(['#f7c6d9', '#bfe3ff', '#fff1a8', '#c8f0d8', '#ffd6b8']), shoes: '#f4e9d8' }); else Object.assign(L, { outfitType: 'shirt_rolled', top: pick(['#f4f1e8', '#d8ecff', '#ffe3d1']), inner: '#f4f1e8', bottom: pick(['#d8cdb5', '#c9d6e3', '#f4f1e8']), shoes: '#8a6a48' }); L.acc.glasses = Math.random() < 0.4 ? 'sun' : L.acc.glasses; }
  if (theme === 'bal') { if (f) Object.assign(L, { outfitType: 'dress_fit', top: pick(['#7a1f3d', '#1b1b3a', '#0f3d3a', '#3a1b5a', '#111111']), shoes: '#111111', earrings: true }); else Object.assign(L, { outfitType: 'blazer', top: '#15151c', inner: '#ffffff', bottom: '#15151c', shoes: '#0b0b0b' }); L.acc.glasses = 'none'; L.acc.bag = 'none'; }
  if (theme === 'jacht') { if (f) Object.assign(L, { outfitType: 'dress_fit', top: pick(['#ffffff', '#e8e3d3', '#d4af37', '#c0c8d0']), shoes: '#e8e3d3' }); else Object.assign(L, { outfitType: 'shirt_rolled', top: '#ffffff', inner: '#ffffff', bottom: pick(['#1d2b4a', '#f4f1e8']), shoes: '#8a6a48' }); L.acc.bag = 'none'; }
  return L;
}

// zabawne incydenty w trakcie imprezy (podnoszą atmosferę)
export const INCIDENTS = {
  gala: ['🏊 Pan Marek wskoczył do basenu w garniturze. „To był test wodoodporności!”', '🍫 Ktoś wpadł twarzą w fontannę czekoladową. Twierdzi, że to „maseczka”.', '🦩 Dmuchany flaming odpłynął z gościem śpiącym na pokładzie.', '🍹 Barman wymyślił koktajl „Słoneczna Uliczka”. Smakuje jak plotka z limonką.'],
  bal: ['🎭 Dwie osoby w identycznych maskach przez godzinę rozmawiały, myśląc, że rozmawiają z kimś innym.', '🥂 Piramida z kieliszków przetrwała! Pani Krystyna zmierzyła jej wysokość. „Akceptowalna.”', '💃 Pan Henryk zatańczył walca. Twierdzi, że „nic nie słyszał”, ale trzymał rytm idealnie.', '🕯️ Ktoś zdmuchnął świecznik, myśląc, że to tort. Wszyscy zaśpiewali „Sto lat”.'],
  jacht: ['🫧 Jacuzzi zrobiło tyle piany, że zniknęły w niej trzy osoby i jedna kanapa.', '🐬 Za burtą przepłynęły delfiny! Albo Pan Marek w piance. Trudno powiedzieć.', '⚓ Kapitan pozwolił komuś sterować. Jacht wykonał trzy kółka i „taniec”.', '🌌 Wszyscy zamilkli na widok spadającej gwiazdy. Natalia pomyślała życzenie. Na głos.'],
};
export const ACTIONS = [
  { id: 'toast', icon: '🥂', name: 'Wznieś toast', atm: 12, cd: 60, social: 10, say: ['Za gości! 🥂', 'Za Słoneczną Uliczkę! 🥂', 'Zdrowie gospodarzy! (czyli moje) 🥂'] },
  { id: 'dance', icon: '💃', name: 'Rozkręć parkiet', atm: 9, cd: 40, fun: 15, say: ['Wszyscy na parkiet! 💃', 'DJ, podkręć to! 🕺'] },
  { id: 'mingle', icon: '💬', name: 'Zagadaj gości', atm: 5, cd: 20, social: 20, say: ['Jak się bawicie? 😊', 'Spróbujcie przekąsek! 🍤'] },
];
export const RATING = [[80, '🏆 Impreza roku!', 'O tej imprezie będzie się mówić latami. Pani Krystyna przyznała jej ocenę „bez zastrzeżeń”. Pierwszy raz w historii.'], [55, '🌟 Udane przyjęcie', 'Goście wychodzą zadowoleni, z balonikami i plotkami na tydzień.'], [30, '🙂 Całkiem miło', 'Było sympatycznie. Nikt nie wpadł do basenu, co część gości uznała za minus.'], [0, '😬 Mogło być lepiej', 'Atmosfera siadła jak suflet. Ktoś zasnął przy przekąskach. Ktoś inny – na przekąskach.']];
