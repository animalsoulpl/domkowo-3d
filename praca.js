// Praca: nowe zawody i karty dylematów (3 wybory) podczas zmiany.
// Efekty (e): perf – postęp awansu / reputacja, rate – zmiana stawki godzinowej w %, money – zł,
// energy/fun/social/hygiene – potrzeby, buff – nastrój (na kilka godzin), demand/burnout – własna działalność,
// passive – odblokowanie produktu cyfrowego.

export const SKILLS = { psy: ['Behawiorystyka', '🐕'], biznes: ['Przedsiębiorczość', '📈'] };

export const CAREERS = {
  dog: { name: 'Behawiorysta psów', icon: '🐕', skill: 'psy', start: 9, end: 17, color: '#c9853f',
    levels: ['Wyprowadzacz psów', 'Młodszy trener', 'Behawiorysta psów', 'Specjalista od psiej reaktywności i emocji', 'Uznany zoopsycholog'],
    pay: [15, 22, 34, 52, 80], branches: null, callWho: 'opiekuna psa (klienta)',
    duties: [
      ['Spacery z psami klientów', 'Obserwacja psiej mowy ciała', 'Raport dla opiekuna'],
      ['Zajęcia dla szczeniąt', 'Nagradzanie spokojnych zachowań', 'Pomoc na konsultacjach'],
      ['Konsultacje 1:1', 'Czytanie mowy ciała psa', 'Plan pracy z bodźcami'],
      ['Praca z reaktywnymi psami w terenie', 'Regulacja emocji i dekompresja', 'Edukacja opiekunów'],
      ['Trudne przypadki i trauma', 'Szkolenia dla trenerów', 'Wykłady i publikacje'],
    ],
    ev: null },
  biz: { name: 'Własna działalność', icon: '🚀', skill: 'biznes', start: 10, end: 16, color: '#e0563b',
    levels: ['Freelancer na start', 'Rozpoznawalna marka', 'Ceniony ekspert', 'Pełny grafik', 'Marka premium'],
    pay: [20, 28, 40, 58, 85], branches: null, biz: true, callWho: 'stałego klienta',
    duties: [
      ['Szukanie pierwszych klientów', 'Wizytówka w internecie', 'Pierwsze zlecenia'],
      ['Stali klienci', 'Posty w mediach społecznościowych', 'Opinie i polecenia'],
      ['Konsultacje premium', 'Własna metoda pracy', 'Współprace z innymi'],
      ['Pełny kalendarz', 'Lista oczekujących', 'Delegowanie zadań'],
      ['Marka rozpoznawalna w całym kraju', 'Produkty cyfrowe', 'Wystąpienia i media'],
    ],
    ev: null },
};

// Produkty cyfrowe (pasywny dochód) – własna działalność
export const PASSIVE = [
  { id: 'pdf', name: 'Poradnik PDF', icon: '📘', tier: 1, cost: 200, perDay: 45 },
  { id: 'pakiety', name: 'Pakiety konsultacji', icon: '📦', tier: 2, cost: 500, perDay: 100 },
  { id: 'kurs', name: 'Kurs online', icon: '🎓', tier: 3, cost: 1200, perDay: 230 },
];
export const PRICES = { low: ['💸 Niska', 0.8, 1.25], std: ['⚖️ Standard', 1, 1], premium: ['💎 Premium', 1.4, 0.7] }; // nazwa, mnożnik stawki, mnożnik przyrostu popytu
export const LOADS = { light: ['🌿 Mało klientów', 4, -6], normal: ['📅 Normalnie', 6, 6], heavy: ['🔥 Dużo klientów', 10, 16] }; // godziny, przyrost wypalenia
export const STYLES = { normal: ['⚖️', 'Normalnie'], hard: ['💪', 'Pracuj ciężko'], easy: ['😌', 'Na luzie'], network: ['🤝', 'Buduj relacje / markę'] };

// ---------- KARTY DYLEMATÓW ----------
// A – profesjonalnie (pewny efekt), B – szybki zysk (ryzyko wpadki), C – odważnie (wielka wygrana albo katastrofa)
const ev = (icon, t, A, B, C) => ({ icon, t, A, B, C });

export const EVENTS = {
  dog: [
    ev('🐕‍🦺', 'Reaktywny pies klienta mocno reaguje na bodźce w parku – szczeka i rzuca się na smyczy. Zestresowany opiekun żąda: „Niech pan/pani go wreszcie naprawi, choćby siłą!”',
      { l: 'Zwiększ dystans i spokojnie poprowadź opiekuna przez dekompresję', d: '+Reputacja, +awans, +stawka', e: { perf: 14, rate: 3, fun: 4 }, msg: 'Pies się wyciszył, a opiekun po raz pierwszy zobaczył, czego naprawdę potrzebuje jego pies. Polecił Cię znajomym!' },
      { l: 'Zgódź się na szybką, powierzchowną metodę „pod publikę”', d: 'Szybka gotówka, ryzyko utraty zaufania', e: { money: 150 }, risk: { p: 0.55, e: { perf: -12, rate: -3, buff: -10 }, msg: 'Pies „wyglądał na spokojnego” 10 minut, potem było gorzej. Opiekun wystawił Ci jedną gwiazdkę… 😬' }, msg: 'Opiekun zapłacił i wyszedł zadowolony. Na razie.' },
      { l: 'Zamień to w przełomową lekcję o mowie ciała psa – dla opiekuna i gapiów', d: 'Ryzyko! Viral albo chaos', win: { p: 0.5, e: { perf: 40, money: 300, rate: 8, buff: 20 }, promo: 0.35, msg: 'Ktoś nagrał Twoją lekcję i film obejrzało 200 tys. osób! Telefon się urywa! 🌟' }, lose: { e: { perf: -10, fun: -10, buff: -12 }, msg: 'W trakcie wykładu pies wyrwał się i ukradł kanapkę emerytowi. Gapie mieli niezły ubaw… 🥪' } }),
    ev('🐶', 'Zajęcia dla szczeniąt: 8 maluchów, jeden kradnie smycze, drugi zasnął w misce z wodą, a trzeci uparcie ciągnie Cię za sznurówki.',
      { l: 'Krótkie sesje z przerwami na odpoczynek i spokojną zabawę', d: '+Awans, +zadowolenie klientów', e: { perf: 12, fun: 6, energy: -5 }, msg: 'Szczeniaki wyszły zmęczone i szczęśliwe, a opiekunowie zachwyceni Twoją cierpliwością.' },
      { l: 'Rozdawaj smaczki za wszystko, byle był spokój', d: 'Napiwki teraz, ryzyko „żebrzących” szczeniąt', e: { money: 80, fun: 3 }, risk: { p: 0.5, e: { perf: -8, rate: -2 }, msg: 'Po tygodniu szczeniaki skaczą na każdego, kto ma kieszenie. Opiekunowie mają pretensje… 🍖' }, msg: 'Opiekunowie zachwyceni „grzecznymi” pieskami. Dostajesz napiwki!' },
      { l: 'Zrób z tego „Szczenięcą godzinę socjalizacji” na żywo w sieci', d: 'Ryzyko! Słodki viral albo kompromitacja', win: { p: 0.55, e: { perf: 30, money: 250, rate: 6, buff: 18, social: 15 }, promo: 0.25, msg: 'Transmisja okazała się hitem! Zapisy na zajęcia na 3 miesiące do przodu! 🐾' }, lose: { e: { perf: -8, buff: -10, fun: -8 }, msg: 'Kamera przewróciła się na samym początku – widzowie oglądali przez godzinę sufit i słyszeli tylko piski. 📹' } }),
    ev('📱', 'Znana influencerka chce viralowe nagranie ze swoim lękliwym chihuahua na zatłoczonym festynie. Płaci z góry.',
      { l: 'Odmów nagrania i zaproponuj plan stopniowej pracy z lękiem', d: '+Reputacja, +stawka, mniej pieniędzy teraz', e: { perf: 15, rate: 4 }, msg: 'Influencerka była zaskoczona, ale opowiedziała o Twojej uczciwości w relacji. Zyskujesz poważanie wśród opiekunów!' },
      { l: 'Nakręć szybki, wyreżyserowany filmik za 500 zł', d: 'Duża gotówka, ryzyko krytyki', e: { money: 500 }, risk: { p: 0.6, e: { perf: -15, rate: -4, buff: -15 }, msg: 'Komentujący behawioryści zauważyli zestresowanego psa. Burza w sieci… 🌩️' }, msg: 'Film zebrał lajki, a pieniądze są na koncie.' },
      { l: 'Nagraj edukacyjny film o sygnałach stresu u psa – z jej udziałem', d: 'Ryzyko! Hit albo klapa', win: { p: 0.5, e: { perf: 35, money: 400, rate: 10, buff: 22 }, promo: 0.3, msg: 'Film „Twój pies mówi DOŚĆ” stał się hitem! Media dzwonią z prośbą o wywiad! 🎬' }, lose: { e: { perf: -6, fun: -12, buff: -10 }, msg: 'Influencerka obraziła się w połowie, a chihuahua obszczekał operatora. Klapa. 🙈' } }),
    ev('🛏️', 'Pies ze schroniska od 3 dni chowa się pod łóżkiem w nowym domu. Rodzina oczekuje cudu do weekendu, bo „przyjeżdża babcia”.',
      { l: 'Plan dekompresji: daj psu przestrzeń, przewidywalność i czas', d: '+Awans, +wdzięczność rodziny', e: { perf: 13, social: 8 }, msg: 'Po kilku dniach pies sam przyszedł do dzieci po głaskanie. Rodzina płakała ze szczęścia. 🥹' },
      { l: 'Wywab go kiełbasą, żeby szybko pokazać efekt', d: 'Szybki napiwek, ryzyko regresu', e: { money: 90 }, risk: { p: 0.5, e: { perf: -9, buff: -8 }, msg: 'Pies wyszedł po kiełbasę, przestraszył się babci i znów się schował. Na dłużej… 🌭' }, msg: 'Pies wyszedł! Rodzina zadowolona, dostajesz napiwek.' },
      { l: 'Połóż się na podłodze i czytaj na głos książkę przez godzinę', d: 'Ryzyko! Magia albo dziwna sytuacja', win: { p: 0.6, e: { perf: 28, money: 150, rate: 5, buff: 18, fun: 10 }, promo: 0.2, msg: 'Pies przyczołgał się i położył Ci głowę na kolanach. Rodzina opowiada o Tobie całemu osiedlu! 📖🐕' }, lose: { e: { perf: -5, energy: -10, fun: -5 }, msg: 'Zasnęłaś/zasnąłeś na podłodze. Obudził Cię pies… liżąc Ci ucho. Rodzina jest zdezorientowana. 😴' } }),
    ev('🧸', 'Dwa psy w jednym domu pokłóciły się o zabawkę. Opiekunka jest przerażona i pyta, czy musi oddać jednego z nich.',
      { l: 'Zarządzanie zasobami: osobne miski, zabawki i spokojne strefy', d: '+Awans, +stawka', e: { perf: 12, rate: 2 }, msg: 'Spokój w domu wrócił, a opiekunka odetchnęła z ulgą. Zostajesz jej stałym behawiorystą!' },
      { l: 'Sprzedaj jej drogi gadżet „anty-kłótnia” z polecenia', d: 'Prowizja teraz, ryzyko niezadowolenia', e: { money: 200 }, risk: { p: 0.6, e: { perf: -12, rate: -3, buff: -8 }, msg: 'Gadżet okazał się bezużyteczny, a opiekunka zażądała zwrotu i powiedziała o tym w grupie na Facebooku… 📢' }, msg: 'Opiekunka kupiła gadżet. Prowizja wpłynęła!' },
      { l: 'Zorganizuj wspólne spacery równoległe obu psów z innymi psami z osiedla', d: 'Ryzyko! Psia przyjaźń albo psi chaos', win: { p: 0.5, e: { perf: 32, money: 220, rate: 6, buff: 18, social: 20 }, promo: 0.25, msg: 'Spacery zamieniły się w osiedlową grupę! Zapisuje się coraz więcej psów (i ich opiekunów). 🐕🐕🐕' }, lose: { e: { perf: -9, energy: -15, hygiene: -20 }, msg: 'Wszystkie psy wskoczyły naraz do kałuży błota. Ty też. 🟤' } }),
    ev('🐺', 'Klient upiera się, że jego pies jest „dominujący” i chce nauczyć się „być samcem alfa”.',
      { l: 'Delikatnie wyjaśnij, że teoria dominacji to mit, i pokaż pracę na nagrodach', d: '+Reputacja, +rozwój', e: { perf: 12, rate: 2, fun: 3 }, msg: 'Klient długo milczał, a potem powiedział: „To ma sens”. Pies od razu wydał się szczęśliwszy.' },
      { l: 'Przytakuj, żeby nie stracić klienta', d: 'Pewna zapłata, ryzyko wyrzutów sumienia', e: { money: 120 }, risk: { p: 0.5, e: { perf: -10, buff: -14 }, msg: 'Wieczorem nie możesz zasnąć, myśląc o tym psie. Twoje wartości ucierpiały… 😔' }, msg: 'Klient zapłacił i był zadowolony.' },
      { l: 'Daj zabawny pokaz: Ty jako „alfa” kontra pies, który ma to w nosie', d: 'Ryzyko! Śmiech i zrozumienie albo kompromitacja', win: { p: 0.5, e: { perf: 30, money: 180, rate: 6, buff: 20, fun: 15 }, promo: 0.2, msg: 'Klient płakał ze śmiechu i zrozumiał wszystko. Opowiada o Tobie na każdej imprezie! 😂' }, lose: { e: { perf: -8, fun: -10, buff: -8 }, msg: 'Pies naprawdę zignorował Cię na oczach klienta, a potem ukradł Ci czapkę. 🧢' } }),
    ev('🏥', 'Lecznica weterynaryjna proponuje Ci poprowadzenie warsztatu o łagodnym obchodzeniu się z psami (low-stress handling).',
      { l: 'Przygotuj się porządnie i poprowadź profesjonalny warsztat', d: '+Awans, +stawka, zmęczenie', e: { perf: 15, rate: 4, energy: -10 }, msg: 'Weterynarze zachwyceni! Lecznica poleca Cię wszystkim swoim pacjentom.' },
      { l: 'Zaimprowizuj na starych slajdach i weź szybkie honorarium', d: 'Gotówka, ryzyko wpadki', e: { money: 250 }, risk: { p: 0.5, e: { perf: -12, buff: -10 }, msg: 'Na slajdzie nr 3 było zdjęcie z Twoich wakacji w bikini/kąpielówkach. Cisza na sali… 🏖️' }, msg: 'Poszło gładko, honorarium wpłynęło.' },
      { l: 'Przyprowadź na żywo najbardziej lękliwego psa ze schroniska', d: 'Ryzyko! Wzruszający sukces albo chaos w lecznicy', win: { p: 0.5, e: { perf: 38, money: 300, rate: 8, buff: 25 }, promo: 0.35, msg: 'Pies na oczach wszystkich dał się spokojnie zbadać. Brawa na stojąco – i ktoś go adoptował! 💖' }, lose: { e: { perf: -10, fun: -12, buff: -10 }, msg: 'Pies schował się pod biurkiem ordynatora i nie wyszedł do końca warsztatu. Ordynator też nie. 🙃' } }),
  ],
  biz: [
    ev('📨', 'Nagły napływ zapytań od klientów zapycha Ci skrzynkę i grafik!',
      { l: 'Podnieś stawki i utwórz listę oczekujących', d: '+Prestiż, +stawka', e: { perf: 12, rate: 8, demand: 5 }, msg: 'Lista oczekujących sprawia, że Twoja marka wygląda na rozchwytywaną. Prestiż rośnie!' },
      { l: 'Weź wszystkie zlecenia kosztem snu', d: 'Duża gotówka, ogromny spadek energii i nastroju', e: { money: 600, energy: -35, fun: -20, burnout: 25, buff: -15 }, risk: { p: 0.35, e: { perf: -10 }, msg: 'Pomyliłaś/pomyliłeś terminy dwóch klientów. Jeden był bardzo niezadowolony… 📆' }, msg: 'Konto rośnie, ale oczy same się zamykają…' },
      { l: 'Stwórz gotowy pakiet edukacyjny dla wszystkich chętnych', d: 'Ryzyko! Pasywny dochód albo klapa', win: { p: 0.55, e: { perf: 30, money: 400, rate: 5, buff: 20, passive: 'pdf' }, promo: 0.3, msg: 'Pakiet sprzedaje się sam! Odblokowano produkt cyfrowy 📘 – pasywny dochód codziennie!' }, lose: { e: { perf: -8, money: -150, fun: -10 }, msg: 'Plik okazał się pusty… Wysłałaś/wysłałeś 40 osobom PDF z listą zakupów. 🛒' } }),
    ev('💢', 'Klientka po jednej sesji żąda zwrotu pieniędzy, bo „nie widzi efektów”, i grozi złą opinią.',
      { l: 'Spokojna rozmowa i bezpłatna sesja kontrolna', d: '+Reputacja, kosztuje czas', e: { perf: 12, energy: -8, demand: 4 }, msg: 'Klientka zmieniła zdanie i wystawiła Ci 5 gwiazdek z długim opisem. ⭐⭐⭐⭐⭐' },
      { l: 'Zignoruj wiadomość i zatrzymaj pieniądze', d: 'Pieniądze zostają, ryzyko złej opinii', e: { money: 150 }, risk: { p: 0.65, e: { perf: -15, demand: -12, buff: -12 }, msg: 'Klientka opisała wszystko na trzech forach. Zapytania wyraźnie spadły… 📉' }, msg: 'Klientka zamilkła. Uff.' },
      { l: 'Zrób z tej sytuacji publiczne studium przypadku i nową usługę', d: 'Ryzyko! Szacunek branży albo drama', win: { p: 0.5, e: { perf: 32, money: 250, rate: 6, demand: 12, buff: 15 }, promo: 0.25, msg: 'Twoja szczerość zachwyciła ludzi. Nowa usługa „plan 30 dni” sprzedaje się świetnie! 📈' }, lose: { e: { perf: -12, demand: -8, buff: -15 }, msg: 'Klientka rozpoznała się w opisie i nagrała o tym film. Drama na cały internet… 🍿' } }),
    ev('🏢', 'Duża firma proponuje kontrakt: dużo pracy, ale bardzo niska stawka.',
      { l: 'Negocjuj uczciwą stawkę i jasny zakres', d: '+Prestiż, +stawka', e: { perf: 12, rate: 6 }, msg: 'Firma przystała na Twoje warunki. Szanują Cię za profesjonalizm.' },
      { l: 'Bierz od razu – pewna gotówka', d: 'Pieniądze teraz, wypalenie, niższa stawka', e: { money: 700, burnout: 20, rate: -4, energy: -15 }, risk: { p: 0.35, e: { perf: -8, buff: -12 }, msg: 'Firma dorzuca „jeszcze tylko jedną poprawkę” codziennie. Masz dość… 😩' }, msg: 'Przelew przyszedł. Duży.' },
      { l: 'Zaproponuj im swój pakiet premium za potrójną cenę', d: 'Ryzyko! Kontrakt życia albo zerwane rozmowy', win: { p: 0.4, e: { perf: 40, money: 1500, rate: 12, buff: 25, demand: 10 }, promo: 0.4, msg: 'Zgodzili się! To kontrakt życia – Twoja marka wskakuje na wyższy poziom! 💼✨' }, lose: { e: { perf: -6, buff: -10, fun: -8 }, msg: 'Prezes wybuchnął śmiechem i rozłączył się. Przynajmniej masz anegdotę na imprezy. 📞' } }),
    ev('📲', 'Twój post w sieci zaczyna się rozchodzić, ale komentarze są mieszane – część ludzi się kłóci.',
      { l: 'Odpowiadaj spokojnie i merytorycznie', d: '+Reputacja, +popyt', e: { perf: 10, demand: 10, social: 10 }, msg: 'Ludzie docenili Twój spokój. Obserwujących przybywa!' },
      { l: 'Dopłać do reklamy, żeby wybić post jeszcze wyżej', d: '−200 zł, szansa na wielu klientów', e: { money: -200, demand: 15 }, risk: { p: 0.4, e: { perf: -8, demand: -10 }, msg: 'Reklama trafiła do ludzi, którzy tylko się kłócili w komentarzach… 🤦' }, msg: 'Zasięgi wystrzeliły, przychodzą nowe zapytania!' },
      { l: 'Wejdź na żywo i odpowiadaj na wszystkie pytania przez 2 godziny', d: 'Ryzyko! Wielki rozgłos albo wpadka na wizji', win: { p: 0.55, e: { perf: 30, money: 300, demand: 20, buff: 20, social: 20 }, promo: 0.25, msg: 'Live obejrzało 15 tysięcy osób! Ludzie Cię pokochali! 🔴' }, lose: { e: { perf: -8, buff: -15, fun: -10 }, msg: 'Przez całego live’a miałaś/miałeś filtr kota i nie umiałaś/umiałeś go wyłączyć. 🐱' } }),
    ev('🧾', 'Jutro termin rozliczenia podatków i dokumentów, a Ty masz w nich kompletny bałagan!',
      { l: 'Zatrudnij księgową', d: '−250 zł, spokój i pewność', e: { money: -250, perf: 6, buff: 8, burnout: -8 }, msg: 'Księgowa wszystko ogarnęła w godzinę. Czujesz ogromną ulgę! 😌' },
      { l: 'Rozlicz się sam/sama w nocy', d: 'Oszczędność, zmęczenie, ryzyko błędu', e: { energy: -25, money: 100 }, risk: { p: 0.45, e: { money: -300, buff: -15 }, msg: 'Pomyłka w deklaracji – odsetki i nerwowe telefony z urzędu… 📠' }, msg: 'Udało się! O 3:47 w nocy, ale się udało.' },
      { l: 'Zbuduj automatyczny system faktur i rozliczeń', d: 'Ryzyko! Oszczędność na lata albo chaos', win: { p: 0.55, e: { perf: 22, rate: 8, burnout: -15, buff: 15 }, promo: 0.15, msg: 'System działa jak marzenie. Masz więcej czasu na klientów i wyższą efektywność! ⚙️' }, lose: { e: { perf: -6, money: -150, fun: -15 }, msg: 'System wystawił 300 faktur Twojej mamie. Na 0,01 zł każda. 🤖' } }),
    ev('🦊', 'Konkurencja skopiowała Twoją ofertę słowo w słowo i oferuje ją taniej.',
      { l: 'Postaw na jakość i opinie zadowolonych klientów', d: '+Prestiż, +stawka', e: { perf: 12, rate: 4, demand: 4 }, msg: 'Klienci wiedzą, kto jest oryginałem. Twoje opinie mówią same za siebie.' },
      { l: 'Obniż ceny, żeby nie stracić klientów', d: 'Więcej klientów teraz, niższa stawka', e: { money: 200, demand: 12, rate: -8 }, risk: { p: 0.4, e: { perf: -8, buff: -10 }, msg: 'Wojna cenowa – konkurencja też obniżyła ceny. Pracujesz więcej za mniej… 📉' }, msg: 'Klienci zostali, a nawet przyszli nowi.' },
      { l: 'Zaproponuj konkurencji wspólny projekt', d: 'Ryzyko! Silny duet albo upokorzenie', win: { p: 0.5, e: { perf: 34, money: 450, rate: 8, demand: 15, buff: 20, social: 15 }, promo: 0.3, msg: 'Zrobiliście razem wydarzenie, o którym mówi cała branża! 🤝' }, lose: { e: { perf: -10, buff: -15 }, msg: 'Konkurencja opublikowała Waszą rozmowę jako „dowód”, że to Ty kopiujesz. Ała. 😵' } }),
    ev('🧘', 'Przyjaciółka zaprasza Cię na weekendowy wyjazd regeneracyjny w środku najbardziej zapracowanego tygodnia.',
      { l: 'Zaplanuj dzień wolny i jedź', d: 'Mniej wypalenia, lepszy nastrój, mniejszy popyt', e: { burnout: -30, buff: 25, fun: 25, social: 20, demand: -5 }, msg: 'Wracasz z naładowanymi bateriami i masą nowych pomysłów! 🌿' },
      { l: 'Odmów i pracuj dalej', d: 'Pieniądze, rosnące wypalenie', e: { money: 400, burnout: 18, fun: -15, social: -10 }, risk: { p: 0.4, e: { buff: -20, perf: -6 }, msg: 'W piątek złapało Cię totalne zmęczenie. Nic nie ma sensu… 😶' }, msg: 'Wszystko zrobione na czas.' },
      { l: 'Jedź i poprowadź tam płatny warsztat dla uczestników', d: 'Ryzyko! Odpoczynek i zarobek albo stres', win: { p: 0.55, e: { perf: 25, money: 500, burnout: -15, buff: 22, social: 25, demand: 8 }, promo: 0.2, msg: 'Warsztat był hitem, a do tego odpoczęłaś/odpocząłeś. Najlepszy weekend w historii! 🏕️' }, lose: { e: { burnout: 15, fun: -15, buff: -10 }, msg: 'Nikt nie przyszedł na warsztat – wszyscy poszli na jogę z kozami. 🐐' } }),
  ],
  generic: [
    ev('🎭', 'Biurowa drama: dwie osoby z zespołu kłócą się o to, kto zjadł czyjś jogurt z lodówki. Wszyscy patrzą na Ciebie.',
      { l: 'Spokojnie zmediuj i zaproponuj podpisywanie jedzenia', d: '+Awans, +relacje w zespole', e: { perf: 10, social: 10 }, msg: 'Zespół odetchnął. Szef zauważył Twoje zdolności przywódcze.' },
      { l: 'Kup im dwa nowe jogurty i miej spokój', d: '−10 zł, szybki spokój', e: { money: -10, perf: 4, fun: 4 }, risk: { p: 0.35, e: { perf: -6, fun: -8 }, msg: 'Teraz cały zespół oczekuje od Ciebie jogurtów codziennie. 🥛' }, msg: 'Spokój przywrócony. Na razie.' },
      { l: 'Zorganizuj „śledztwo jogurtowe” z tablicą i nitkami jak w kryminale', d: 'Ryzyko! Legenda biura albo wpadka', win: { p: 0.5, e: { perf: 25, fun: 25, social: 20, buff: 20, rate: 3 }, promo: 0.15, msg: 'Winny przyznał się na oczach wszystkich (to był szef!). Jesteś legendą biura! 🕵️' }, lose: { e: { perf: -10, fun: -5, buff: -10 }, msg: 'Okazało się, że to Twój jogurt i Ty go zjadłaś/zjadłeś wczoraj. 🫠' } }),
    ev('🎩', 'Ekscentryczny szef zniknął przed ważnym spotkaniem z klientem i prosi Cię SMS-em: „Zastąp mnie. Improwizuj.”',
      { l: 'Rzetelnie przedstaw projekt na podstawie notatek', d: '+Awans, +zaufanie szefa', e: { perf: 14, energy: -8 }, msg: 'Klient zadowolony, a szef po powrocie nazwał Cię „swoją prawą ręką”.' },
      { l: 'Obiecaj klientowi wszystko, czego chce, żeby szybko zamknąć umowę', d: 'Premia teraz, ryzyko kłopotów', e: { money: 200 }, risk: { p: 0.55, e: { perf: -14, buff: -12 }, msg: 'Obiecałaś/obiecałeś lądowisko dla helikoptera na dachu. Firma nie ma dachu… 🚁' }, msg: 'Umowa podpisana! Premia wpłynęła.' },
      { l: 'Zaprezentuj własny, odważny pomysł zamiast planu szefa', d: 'Ryzyko! Natychmiastowy awans albo katastrofa', win: { p: 0.45, e: { perf: 40, money: 300, rate: 8, buff: 25 }, promo: 0.4, msg: 'Klient zachwycony Twoim pomysłem! Zarząd chce, żebyś prowadził(a) projekt! 🚀' }, lose: { e: { perf: -15, buff: -15, fun: -10 }, msg: 'Projektor wyświetlił zamiast prezentacji Twoje zdjęcia kota w czapeczkach. 50 slajdów. 🐈' } }),
    ev('🔥', 'Kryzys w firmie! Najważniejszy projekt się sypie, a wszyscy panikują.',
      { l: 'Zorganizuj zespół i rozpisz plan ratunkowy', d: '+Awans, zmęczenie', e: { perf: 15, energy: -15, rate: 2 }, msg: 'Projekt uratowany! Wszyscy wiedzą, komu to zawdzięczają.' },
      { l: 'Weź płatne nadgodziny i rób swoje', d: 'Gotówka, zmęczenie', e: { money: 180, energy: -12 }, risk: { p: 0.3, e: { perf: -6, fun: -10 }, msg: 'Projekt i tak upadł, a Ty jesteś wykończony/a. 😮‍💨' }, msg: 'Nadgodziny opłacone podwójnie!' },
      { l: 'Zaproponuj zupełnie nowy, szalony kierunek projektu', d: 'Ryzyko! Przełom albo totalna klapa', win: { p: 0.45, e: { perf: 38, money: 250, rate: 7, buff: 22 }, promo: 0.35, msg: 'Szalony pomysł zadziałał! Prezes osobiście Ci gratuluje! 🏆' }, lose: { e: { perf: -14, buff: -15 }, msg: 'Zespół spojrzał na Ciebie, jakby na Twojej głowie wyrósł kaktus. 🌵' } }),
    ev('📋', 'Niespodziewana kontrola z zewnątrz! Inspektor chce zobaczyć dokumenty, których nikt nie może znaleźć.',
      { l: 'Szczerze przyznaj braki i pokaż plan naprawy', d: '+Awans, +zaufanie', e: { perf: 11, buff: 5 }, msg: 'Inspektor docenił uczciwość. Firma dostała tylko upomnienie, a Ty pochwałę.' },
      { l: 'Szybko „zrekonstruuj” dokumenty z pamięci', d: 'Premia za ratunek, ryzyko wpadki', e: { money: 150, perf: 4 }, risk: { p: 0.5, e: { perf: -15, buff: -15 }, msg: 'Inspektor zauważył, że dokument z 2019 roku jest wydrukowany na jutrzejszym papierze… 📄' }, msg: 'Uff, przeszło! Szef wręczył Ci kopertę.' },
      { l: 'Oprowadź inspektora po firmie z takim urokiem, że zapomni o papierach', d: 'Ryzyko! Sympatia albo kompromitacja', win: { p: 0.45, e: { perf: 28, money: 150, social: 25, buff: 20 }, promo: 0.2, msg: 'Inspektor wyszedł z kubkiem firmowym i uśmiechem. Kontrola zakończona pozytywnie! ☕' }, lose: { e: { perf: -12, fun: -10, buff: -10 }, msg: 'W trakcie oprowadzania zamknęliście się w archiwum. Na 3 godziny. 🔒' } }),
    ev('☕', 'Ekspres do kawy w pracy się zepsuł. Wśród pracowników narasta bunt.',
      { l: 'Zgłoś awarię i przynieś kawę z kawiarni dla zespołu', d: '−40 zł, +relacje, +awans', e: { money: -40, perf: 8, social: 15, fun: 5 }, msg: 'Zostałaś/zostałeś bohaterem dnia! ☕' },
      { l: 'Napraw go sam/sama, skoro serwis zdziera', d: 'Oszczędność, ryzyko zalania biura', e: { perf: 5, fun: 6 }, risk: { p: 0.5, e: { perf: -8, hygiene: -25, buff: -8 }, msg: 'Ekspres wybuchł fontanną kawy. Masz brązowe włosy. Wszędzie. 🤎' }, msg: 'Działa! Wszyscy klaszczą!' },
      { l: 'Zorganizuj „dzień herbaty” z degustacją i quizem', d: 'Ryzyko! Integracja albo bunt', win: { p: 0.55, e: { perf: 20, fun: 25, social: 25, buff: 20 }, promo: 0.1, msg: 'Najlepsza integracja w historii firmy! Szef chce to powtarzać co miesiąc. 🍵' }, lose: { e: { perf: -6, fun: -10 }, msg: 'Nikt nie lubi herbaty z pokrzywy z czosnkiem. Nikt. 🧄' } }),
  ],
};

/** 3-wyborowa karta dla zwykłych zawodów na bazie ich własnego wydarzenia */
export function careerEvent(c, skillOk) {
  return ev(c.icon, c.ev.t,
    { l: c.ev.a, d: '+Awans, rozwój umiejętności', e: skillOk ? { perf: 18, rate: 4, money: 60, buff: 10 } : { perf: -6, buff: -8 }, msg: skillOk ? 'Udało się! Twoje umiejętności zrobiły wrażenie.' : 'Nie wyszło… Brakuje jeszcze umiejętności. Trzeba więcej ćwiczyć!' },
    { l: c.ev.b, d: 'Bezpiecznie, mały plus', e: { perf: 4, money: 40 }, msg: 'Rozsądna decyzja.' },
    { l: 'Zaimprowizuj coś zupełnie nowego', d: 'Ryzyko! Wielki sukces albo zabawna wpadka', win: { p: 0.45, e: { perf: 35, money: 200, rate: 6, buff: 20 }, promo: 0.3, msg: 'Wszyscy są w szoku – to było genialne! 🌟' }, lose: { e: { perf: -12, fun: -10, buff: -10 }, msg: 'Wszyscy są w szoku – i to nie w dobrym sensie. 🙈' } });
}
