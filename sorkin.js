// Własna działalność w stylu Aarona Sorkina: pojedynki „Walk & Talk”, Wielkie Premiery z kryzysami za kulisami
// i dylematy Ego kontra Ideały. Same dane; okna, liczniki czasu i nagrody obsługuje gra.

export const STYLES = {
  vis: { icon: '🚀', name: 'Wizjoner', col: '#7b4bd6' },
  ana: { icon: '📊', name: 'Analityk', col: '#2f6fe4' },
  dip: { icon: '🕊️', name: 'Dyplomata', col: '#39a06a' },
};

// ---------- POJEDYNKI „WALK & TALK” ----------
// każda runda: kwestia przeciwnika, 3 riposty, best – która wygrywa w tej rundzie
const R = (o, vis, ana, dip, best) => ({ o, vis, ana, dip, best });
export const DUELS = [
  { id: 'rywal', who: 'Kacper Wilk', role: 'rywal biznesowy, „Wilk Consulting”', icon: '🐺',
    intro: 'Korytarz centrum konferencyjnego. Kacper Wilk dogania Cię przy windach, nie zwalniając kroku.',
    win: ['Wilk zatrzymuje się w pół kroku. Pierwszy raz od lat nie ma riposty.', 'Ktoś za Wami parska śmiechem. Wilk udaje, że to nie o niego chodziło.'],
    lose: ['Wilk uśmiecha się jak ktoś, kto właśnie wygrał przetarg.', 'Wilk klepie Cię po ramieniu. To gorsze niż cios.'],
    rounds: [
      R('Słyszałem, że zatrudniasz praktykantów. Ilu? Dwóch? To nie firma, to kółko zainteresowań.', 'Ty zatrudniasz pięćdziesięciu ludzi, żeby robili to, co ja robię z dwójką. To nie jest skala, Kacper. To nadwaga.', 'Dwóch praktykantów, 34 klientów, zero reklamacji. Ty masz pięćdziesięciu ludzi i 41 reklamacji. Mam liczyć dalej?', 'Kółko zainteresowań, które właśnie odebrało Ci klienta z Mokotowa. Ale tak, mamy też ciasteczka.', 'ana'),
      R('Twoja ostatnia kampania była… urocza. Jak rysunek dziecka na lodówce.', 'Dzieci rysują to, czego dorośli boją się nawet pomyśleć. Dlatego ich rysunki wiszą na lodówce, a twoje raporty w niszczarce.', 'Urocza kampania podniosła sprzedaż klienta o 38%. Twoja „poważna” obniżyła ją o 12. Lodówka wygrywa.', 'Dzięki. Przekażę. Moja lodówka bardzo przeżywa recenzje.', 'vis'),
      R('Daj spokój. Za rok będziesz u mnie pracować. Na recepcji.', 'Za rok nie będzie już recepcji. Ani twojej firmy w obecnym kształcie. Ja to widzę. Ty jeszcze nie.', 'Za rok mój przychód przekroczy twój. Policzyłam/em to na serwetce, możesz sprawdzić.', 'Super, zawsze chciałam/em siedzieć blisko wyjścia. Z twoimi klientami to będzie bardzo praktyczne.', 'dip'),
    ] },
  { id: 'inwestor', who: 'Helena Kruk', role: 'inwestorka, fundusz „Kruk Capital”', icon: '🦅',
    intro: 'Helena Kruk idzie szybko, telefon przy uchu. „Masz trzy minuty. Dwie i pół. Mów.”',
    win: ['Kruk odkłada telefon. To się jej nie zdarza.', '„Ciekawe” – mówi Kruk. W jej słowniku to więcej niż „genialne”.'],
    lose: ['Kruk już rozmawia przez telefon z kimś innym.', '„Dziękuję. Odezwiemy się.” Nie odezwą się.'],
    rounds: [
      R('Dlaczego miałabym zainwestować w kogoś, kto jeszcze rok temu nie miał firmy?', 'Bo rok temu nikt nie miał tego pomysłu. Za rok będą go mieli wszyscy. Pytanie, czy pani będzie wtedy właścicielką oryginału, czy kopii.', 'Bo w rok zrobiłam/em 400% wzrostu przy zerowym długu. Pani ostatnia inwestycja potrzebowała na to pięciu lat i trzech restrukturyzacji.', 'Bo ja też rok temu nie wiedziałam/em, że będę dziś biec obok pani w szpilkach do windy. A jednak.', 'ana'),
      R('Rynek jest nasycony. Konkurencja ma większe budżety. Co masz, czego oni nie mają?', 'Mam odwagę zrobić to, czego oni nie zrobią, bo mają za dużo do stracenia. Pani też kiedyś miała.', 'Mam 92% klientów wracających po raz drugi. Średnia rynku to 31. To nie jest budżet. To jest lojalność, której nie da się kupić.', 'Mam panią na korytarzu przez trzy minuty. Oni dostali tylko maila z odmową.', 'vis'),
      R('Ile chcesz i co z tym zrobisz? Jednym zdaniem.', 'Chcę miliona, żeby zbudować coś, czego za pięć lat nikt nie będzie umiał sobie wyobrazić bez nas.', 'Pół miliona: 60% na zespół, 30% na produkt, 10% na rezerwę. Zwrot w 26 miesięcy. Arkusz wysłałam/em pani wczoraj o 23:14.', 'Tyle, żeby nie musieć pani więcej gonić do windy.', 'ana'),
    ] },
  { id: 'dziennikarz', who: 'Robert Szpila', role: 'dziennikarz śledczy, portal „Kulisy”', icon: '🎙️',
    intro: 'Robert Szpila wyrasta przy wyjściu z biura. Dyktafon już włączony. „Tylko kilka pytań.”',
    win: ['Szpila wyłącza dyktafon. „To… było dobre. Nie użyję tego. Ale było dobre.”', 'Szpila notuje coś i po raz pierwszy się uśmiecha.'],
    lose: ['Szpila uśmiecha się szeroko. Masz już tytuł jutrzejszego artykułu. Niestety.', '„Dziękuję, to mi wystarczy” – mówi Szpila. To najgorsze zdanie świata.'],
    rounds: [
      R('Byli klienci mówią, że obiecujesz więcej, niż dowozisz. Komentarz?', 'Obiecuję więcej, niż ktokolwiek inny ma odwagę obiecać. Czasem dowożę tylko dwa razy więcej niż konkurencja. Wiem, dramat.', '94% projektów oddanych w terminie, średnia ocen 4,8. Proszę podać nazwiska tych „byłych klientów”, chętnie sprawdzę, czy w ogóle byli klientami.', 'Ci byli klienci to ci sami, którzy przepłacili u konkurencji i teraz szukają winnego? Pozdrawiam ich serdecznie.', 'dip'),
      R('Podobno zwolniłaś/eś asystentkę przez SMS-a.', 'Nie zwolniłam/em, tylko awansowałam/em ją do własnej firmy. Dziś jest moją partnerką biznesową. SMS brzmiał: „Leć”.', 'Nikt nie został zwolniony. Mam umowę, aneks i jej zgodę na publikację. Chce pan kopię teraz czy po kawie?', 'Przez SMS-a to ja zamawiam pizzę. Ludzi traktuję trochę lepiej niż pizzę. Trochę.', 'ana'),
      R('Ostatnie pytanie: czy nie boisz się, że ktoś cię kiedyś przerośnie?', 'Liczę na to. Jeśli nikt mnie nie przerośnie, to znaczy, że źle uczę ludzi.', 'Statystycznie to nieuniknione. Dlatego planuję być tą osobą, która go zatrudni.', 'Panie redaktorze, mam 1,68. Wszyscy mnie przerastają. Przyzwyczaiłam/em się.', 'vis'),
    ] },
  { id: 'wspolnik', who: 'Tomasz Lis-Kowalski', role: 'wspólnik, współzałożyciel firmy', icon: '🤝',
    intro: 'Wspólnik wpada do biura, zamyka drzwi nogą. „Musimy pogadać. Teraz. Chodź, przejdziemy się.”',
    win: ['Wspólnik siada na brzegu biurka. „Dobra. Masz rację. Nienawidzę, kiedy masz rację.”', 'Wspólnik zaczyna się śmiać. Napięcie znika jak bańka.'],
    lose: ['Wspólnik trzaska drzwiami. Szyba lekko drży.', '„Zastanowię się, czy dalej chcę to robić” – rzuca wspólnik na odchodne.'],
    rounds: [
      R('To JA wymyśliłem ten pomysł. Na serwetce. W 2019. Dlaczego w wywiadzie mówiłaś/eś „ja”?', 'Bo pomysł na serwetce jest wart tyle, co serwetka. Firmą stał się dopiero wtedy, gdy ktoś zaryzykował wszystko. Obydwoje to zrobiliśmy. W wywiadzie mówię „ja”, bo pytają mnie.', 'Serwetka jest w moim sejfie, oprawiona. Pod nią umowa wspólników, paragraf 4: „wspólny pomysł”. Chcesz, żebym ci ją przeczytał(a) na głos?', 'Masz rację. Następny wywiad dajesz ty. Powodzenia z pytaniem o nasze straty z 2021.', 'dip'),
      R('Chcę, żebyśmy przyjęli tę ofertę od korporacji. Bezpieczna kasa. Mamy kredyty.', 'Bezpieczna kasa to najdroższa rzecz na świecie. Kosztuje wszystko, co sprawia, że w ogóle warto wstawać rano.', 'Oferta to 40% naszego rocznego przychodu za 100% naszego czasu przez dwa lata. Policz to na godziny. Wychodzi mniej niż płaca minimalna.', 'Możemy też obrabować bank. Też bezpieczna kasa, a przynajmniej zabawniej.', 'ana'),
      R('A może po prostu… już do siebie nie pasujemy?', 'Pasujemy do siebie jak nikt. Właśnie dlatego się kłócimy: bo obojgu nam zależy na czymś większym niż my.', 'Przez pięć lat podjęliśmy razem 312 decyzji. Pokłóciliśmy się o 11. To 96% zgodności. Lepiej niż większość małżeństw.', 'Nie pasujemy od pierwszego dnia. Ty jesteś rannym ptaszkiem, a ja normalnym człowiekiem. I jakoś działa.', 'vis'),
    ] },
  { id: 'rywalka', who: 'Ewa Diament', role: 'konkurentka, „Diament Agency”', icon: '💎',
    intro: 'Gala branżowa. Ewa Diament wyrasta przy barze z kieliszkiem w dłoni. „O, ty tutaj? Kto cię wpuścił?”',
    win: ['Diament dopija kieliszek jednym haustem i odchodzi bez słowa.', 'Barman podaje Ci drinka na koszt firmy. „Za to, co powiedziałaś/eś”.'],
    lose: ['Diament stuka się z Tobą kieliszkiem z litością. To boli.', 'Kilka osób przy barze kiwa głowami… w stronę Diament.'],
    rounds: [
      R('Twoje logo wygląda, jakbyś zrobiła/zrobił je w Paincie.', 'Bo zrobiłam/em. W 2010 Paint był bardziej odważny niż twoje całe portfolio.', 'Rozpoznawalność mojego logo: 61% w grupie docelowej. Twojego: 9%. Paint się kłania.', 'Dziękuję, to mój ulubiony program. Zaraz po kalkulatorze, którym liczę klientów, którzy odeszli od ciebie do mnie.', 'dip'),
      R('Klienci wybierają mnie, bo mam doświadczenie. Ty masz… entuzjazm.', 'Doświadczenie to wiedza, jak robiło się rzeczy wczoraj. Ja zajmuję się jutrem.', 'Masz 15 lat doświadczenia i 3 nagrody. Ja mam 3 lata i 5 nagród. Może doświadczenie jest przereklamowane.', 'Entuzjazm jest zaraźliwy. Doświadczenie niestety też – razem z nudą.', 'vis'),
      R('Daj spokój. Do końca roku przejmę połowę twoich klientów.', 'Możesz przejąć klientów. Nie przejmiesz pomysłów, które ich do mnie przyciągnęły. Wrócą.', 'Moi klienci podpisali umowy na dwa lata. Sprawdziłam/em. Możesz próbować od 2027.', 'Bierz. Szczególnie tego od pierogów. Pozdrów go ode mnie. I przygotuj dużo serwetek.', 'ana'),
    ] },
  { id: 'aniol', who: 'Jan Złoty', role: 'anioł biznesu, milioner z Doliny Krzemowej', icon: '😇',
    intro: 'Jan Złoty mija Cię w holu w japonkach i bluzie z kapturem. „Masz 60 sekund, potem mam jogę.”',
    win: ['Złoty zdejmuje kaptur. „Okej. Zostaję na kawę. Joga poczeka.”', 'Złoty wyciąga telefon: „Mój asystent do ciebie zadzwoni.”'],
    lose: ['Złoty zakłada słuchawki i odpływa na jogę.', '„Fajnie. Powodzenia” – mówi Złoty tonem, którym się żegna kota sąsiada.'],
    rounds: [
      R('Wszyscy mówią, że zmienią świat. Ty też?', 'Nie. Ja chcę zmienić tylko jedną rzecz. Taką, którą zauważy każdy, kto wstanie jutro rano.', 'Nie świat. 12 tysięcy małych firm w Polsce, które dziś tracą 30% przychodu przez zły marketing. To mój świat.', 'Świat ma wystarczająco dużo zmieniaczy. Ja chcę, żeby ludzie wreszcie przestali się bać swojej księgowej.', 'vis'),
      R('Ile wydałaś/eś w zeszłym miesiącu na kawę w biurze?', 'Za mało. Najlepsze pomysły powstają przy trzeciej kawie. Planuję zwiększyć budżet.', '412 zł. To 0,3% kosztów. Każdy pomysł z kuchni firmowej przyniósł średnio 18 tysięcy. Najlepsza inwestycja w firmie.', 'Kawę przynosi wspólnik. Ja przynoszę ciasto. Tak dzielimy ryzyko.', 'ana'),
      R('Ostatnie: co zrobisz, jeśli przegrasz?', 'Zacznę od nowa. Tylko szybciej i mądrzej. Przegrana to tylko bardzo drogi kurs.', 'Mam plan B, C i D w arkuszu. Plan E to przeprowadzka do Portugalii. Wszystkie są policzone.', 'Napiszę o tym książkę. Wtedy przegrana stanie się bestsellerem. Też biznes.', 'dip'),
    ] },
];

// ---------- WIELKA PREMIERA: kryzysy za kulisami ----------
// e: money, burnout, renoma, perf, partner (utrata wspólnika); pts: punkty do nagłówka
const K = (icon, t, ...opts) => ({ icon, t, opts });
const O = (l, d, e, pts, msg) => ({ l, d, e, pts, msg });
export const CRISES = [
  K('📽️', 'Projektor wyświetla tylko niebieski ekran z napisem „Aktualizacja 1 z 47”. Za 20 minut start.',
    O('Prezentuj bez slajdów – sama opowieść', 'Ryzyko, ale charyzma', { burnout: 8 }, 2, 'Bez slajdów ludzie patrzą tylko na Ciebie. I słuchają.'),
    O('Wypożycz projektor z sali obok za 800 zł', 'Pewnie, ale drogo', { money: -800 }, 1, 'Działa. Kosztowało, ale działa.'),
    O('Odwołaj pokaz wideo, zrób Q&A', 'Bezpiecznie, nudno', { renoma: -2 }, -1, 'Q&A ratuje sytuację, ale nikt nie wyjdzie zachwycony.')),
  K('🦊', 'Konkurencja ogłosiła godzinę temu IDENTYCZNY produkt. Nawet nazwa jest podobna.',
    O('Zmień zakończenie prezentacji: pokaż coś, czego oni nie mają', 'Improwizacja na żywo', { burnout: 10 }, 2, 'Nowa puenta trafia. Sala czuje, kto jest oryginałem.'),
    O('Wspomnij o tym ze sceny z humorem', 'Lekko i zręcznie', {}, 1, '„Miło, że konkurencja tak nas śledzi” – sala się śmieje.'),
    O('Zadzwoń do prawnika i zagroź pozwem', 'Twardo, ale nerwowo', { money: -500, renoma: -3 }, -1, 'Prawnik obiecuje „zająć się tym”. Ty jesteś cała w nerwach.')),
  K('🚪', 'Wspólnik pisze: „Jeśli nie dostanę 60% udziałów, wychodzę. Teraz. Przed premierą.”',
    O('Odpowiedz: „Drzwi są tam”', 'Tracisz wspólnika, zyskujesz kontrolę', { partner: true, renoma: 3 }, 1, 'Wspólnik wychodzi. Sala nawet nie zauważa. Ty – owszem.'),
    O('Obiecaj rozmowę po premierze', 'Zyskujesz czas, kosztem stresu', { burnout: 12 }, 0, 'Wspólnik zostaje. Na razie. Ręce Ci drżą.'),
    O('Oddaj mu 10% więcej udziałów', 'Spokój za cenę firmy', { money: -1500 }, 1, 'Wspólnik się uśmiecha. Twoje konto i duma trochę mniej.')),
  K('🎤', 'Mikrofon piszczy, a technik… zniknął. Ktoś widział go w barze naprzeciwko.',
    O('Mów bez mikrofonu, głośno i blisko ludzi', 'Odważnie i blisko publiczności', { burnout: 6 }, 2, 'Schodzisz ze sceny między ludzi. To robi wrażenie.'),
    O('Zapłać barmanowi, żeby oddał technika (300 zł)', 'Szybko i skutecznie', { money: -300 }, 1, 'Technik wraca z miną winowajcy. Mikrofon działa.'),
    O('Przesuń start o 30 minut', 'Bezpiecznie, ale ludzie się nudzą', { renoma: -2 }, -1, 'Pół sali wychodzi na papierosa. Część nie wraca.')),
  K('📰', 'Dziennikarz dzwoni: „Mam przeciek, że produkt ma poważny błąd. Komentarz przed premierą?”',
    O('Przyznaj się i pokaż plan naprawy na scenie', 'Szczerość jako atut', { perf: 4 }, 2, 'Szczerość rozbraja salę. „W końcu ktoś mówi prawdę.”'),
    O('„Bez komentarza”', 'Bezpiecznie, ale podejrzanie', {}, 0, 'Dziennikarz notuje. Zobaczymy jutro.'),
    O('Zaprzecz wszystkiemu', 'Ryzyko kompromitacji', { renoma: -5 }, -2, 'Błąd wychodzi na jaw w trzeciej minucie pokazu. Ojej.')),
  K('👗', 'Kawa na białej koszuli. Pięć minut przed wejściem. Plama w kształcie Afryki.',
    O('Wyjdź w plamie i zażartuj z niej', 'Autoironia', {}, 1, '„Mapa świata to nasz nowy plan ekspansji” – sala bije brawo.'),
    O('Kup marynarkę od gościa z pierwszego rzędu (600 zł)', 'Drogo, ale elegancko', { money: -600 }, 1, 'Marynarka jest o dwa rozmiary za duża. Wygląda… modnie?'),
    O('Panika i spóźnione wejście', 'Stres', { burnout: 15 }, -2, 'Wchodzisz spóźniona/y, spocona/y i z plamą. Najgorszy z trzech światów.')),
  K('💸', 'Główny sponsor wycofuje się 15 minut przed startem. Kasa na catering zniknęła.',
    O('Zapłać z własnej kieszeni (2000 zł)', 'Klasa kosztuje', { money: -2000 }, 2, 'Goście jedzą, piją i są zachwyceni. Nikt nie wie, ile Cię to kosztowało.'),
    O('Ogłoś „premierę minimalistyczną” – woda i paluszki', 'Odważny branding biedy', { renoma: 1 }, 1, 'Część gości uważa to za genialny koncept. Część jest głodna.'),
    O('Udawaj, że catering się spóźnia', 'Kłamstwo w ostatniej chwili', { renoma: -4 }, -2, 'Catering „spóźnia się” do końca imprezy. Goście wychodzą głodni i źli.')),
  K('🐦', 'Wpis influencera z 2 mln obserwujących: „Jutro premiera X. Ciekawe, czy znowu zawiodą 🙄”.',
    O('Zaproś go na scenę, na żywo', 'Ryzyko wielkiego wygranego', { burnout: 8 }, 2, 'Influencer przychodzi, próbuje produktu i… nagrywa entuzjastyczną relację.'),
    O('Odpowiedz merytorycznie w komentarzu', 'Spokojnie', {}, 1, 'Twoja odpowiedź zbiera więcej polubień niż jego wpis.'),
    O('Zignoruj', 'Bez kosztów, bez zysków', {}, 0, 'Wpis żyje swoim życiem. Część gości czytała go w kolejce.')),
  K('🔌', 'Prąd w całym budynku gaśnie. W sali 200 osób i telefony z latarkami.',
    O('Poprowadź premierę przy świetle telefonów', 'Magia chwili', { burnout: 6 }, 3, '200 latarek, ciemność i Twój głos. Ludzie będą o tym mówić latami.'),
    O('Wynajmij agregat (1200 zł)', 'Pewnie', { money: -1200 }, 1, 'Agregat huczy jak traktor, ale światło jest.'),
    O('Przełóż premierę na jutro', 'Bezpiecznie, ale klapa', { renoma: -6 }, -3, 'Jutro przychodzi połowa gości. Druga połowa poszła do konkurencji.')),
];
export const HEADLINES = [
  { min: 6, icon: '🚀', t: 'REWOLUCJA NA RYNKU!', sub: 'Słoneczna Uliczka ma nową gwiazdę biznesu. Analitycy: „Takiej premiery nie było od lat”.', money: 6000, renoma: 18, perf: 25, buff: 30 },
  { min: 3, icon: '🌟', t: 'Udany debiut, który zapamiętamy', sub: 'Pełna sala, długie brawa i kolejka chętnych po pokazie.', money: 3500, renoma: 10, perf: 15, buff: 20 },
  { min: 0, icon: '😐', t: 'Poprawnie, ale bez fajerwerków', sub: 'Goście wyszli zadowoleni. Ale nikt nie dzwonił do mamy, żeby o tym opowiedzieć.', money: 1500, renoma: 2, perf: 5, buff: 5 },
  { min: -99, icon: '💥', t: 'Wielka klapa przy pełnej sali', sub: 'Media nie zostawiają suchej nitki. Konkurencja otwiera szampana.', money: 300, renoma: -10, perf: -10, buff: -20 },
];
export const LAUNCH_NEED = 100; // postęp do odblokowania premiery

// ---------- DYLEMATY: EGO KONTRA IDEAŁY ----------
// scene: [mówca, kwestia]; choices: tag – 'ego' | 'idealy' | 'kompromis'
const D = (id, icon, title, scene, ...choices) => ({ id, icon, title, scene, choices });
const C = (tag, l, d, e, msg) => ({ tag, l, d, e, msg });
export const TAGS = { ego: ['👑', 'Ego'], idealy: ['🕊️', 'Ideały'], kompromis: ['⚖️', 'Kompromis'] };
export const DILEMMAS = [
  D('sprzedaz', '💼', 'Oferta nie do odrzucenia',
    [['Prezes korporacji', 'Dwanaście milionów. Gotówką. Za całą firmę.'], ['Ty', 'A haczyk?'], ['Prezes korporacji', 'Żaden. No, prawie żaden. Zamykamy dział, który robi te wasze… bezpłatne kursy dla małych firm. Nieopłacalne.'], ['Ty', 'To jest jedyny dział, z którego jestem dumna/y.'], ['Prezes korporacji', 'Dwanaście milionów jest bardziej dumne.']],
    C('ego', 'Sprzedaj. Dwanaście milionów to dwanaście milionów.', 'Ogromna gotówka, firma przestaje być Twoja', { money: 12000, rate: -10, buff: -10, renoma: -10 }, 'Przelew przychodzi w piątek. W poniedziałek budzisz się bogata/y i dziwnie pusta/y.'),
    C('idealy', 'Odmów. Kursy zostają, firma zostaje.', 'Szacunek branży, zero pieniędzy', { renoma: 12, perf: 10, buff: 15 }, 'Prezes wychodzi bez słowa. Następnego dnia piszą o Tobie: „Nie na sprzedaż”.'),
    C('kompromis', 'Sprzedaj 30% i zapisz kursy w umowie', 'Mniej pieniędzy, mniej wolności, ale kursy przetrwają', { money: 3500, rate: 3, burnout: 8 }, 'Negocjacje trwają do 3 nad ranem. Kursy są zapisane w paragrafie 14. Prawie jak zwycięstwo.')),
  D('autorstwo', '✍️', 'Czyj to był pomysł?',
    [['Była asystentka', 'Ta kampania, za którą dostałaś/eś nagrodę… to był mój szkic. Mam maila z datą.'], ['Ty', 'Rozwinęłam/rozwinąłem go. Zmieniłam/em wszystko.'], ['Była asystentka', 'Zmieniłaś/eś kolor czcionki. I podpis.'], ['Ty', 'To nie fair.'], ['Była asystentka', 'Właśnie. Dlatego tu jestem.']],
    C('ego', 'Zaprzecz – nagroda jest Twoja', 'Zachowujesz chwałę, ryzykujesz skandal', { renoma: 4, buff: -5 }, 'Asystentka odchodzi. Trzy tygodnie później jej mail ląduje w portalu branżowym…'),
    C('idealy', 'Publicznie oddaj jej zasługę i połowę nagrody', 'Tracisz blask, zyskujesz klasę', { money: -1000, renoma: 10, perf: 8, buff: 10 }, 'Na gali mówisz jej nazwisko ze sceny. Sala wstaje. Ona płacze. Ty trochę też.'),
    C('kompromis', 'Zatrudnij ją jako dyrektorkę kreatywną', 'Problem staje się atutem', { money: -800, rate: 4, burnout: 4 }, '„Najlepsze pomysły mamy razem” – mówisz w wywiadzie. I to nawet prawda.')),
  D('kontrowersyjny', '🦈', 'Klient z ciemną przeszłością',
    [['Klient', 'Płacę potrójną stawkę. Chcę, żeby moja firma… wyglądała na przyjazną środowisku.'], ['Ty', 'A jest przyjazna środowisku?'], ['Klient', 'Wylewamy tylko trochę do rzeki. W porównaniu z innymi to prawie ogród botaniczny.'], ['Ty', 'Pan chce, żebym kłamał(a) za pieniądze.'], ['Klient', 'Chcę, żebyś opowiadał(a) historię. Za bardzo duże pieniądze.']],
    C('ego', 'Bierz zlecenie – pieniądze nie śmierdzą', 'Potrójna stawka, ryzyko afery', { money: 4500, renoma: -8, buff: -8 }, 'Kampania jest piękna. Rzeka – mniej. Za trzy miesiące wybucha afera z Twoim logo w tle.'),
    C('idealy', 'Odmów i powiedz dlaczego', 'Tracisz kasę, zyskujesz kręgosłup', { renoma: 8, perf: 6, buff: 12 }, '„Proszę wrócić, kiedy przestanie pan wylewać” – mówisz. Kilku Twoich klientów to słyszy. Szanują Cię bardziej.'),
    C('kompromis', 'Przyjmij pod warunkiem realnej zmiany w fabryce', 'Ryzykowne, ale może zmienić świat', { money: 2000, burnout: 10, renoma: 3 }, 'Klient zgrzyta zębami, ale montuje filtry. Twoja kampania mówi prawdę. Prawie całą.')),
  D('przyjaciel', '🫂', 'Przyjaciel czy firma?',
    [['Najlepszy przyjaciel', 'Moja firma upada. Potrzebuję zlecenia od ciebie. Jakiegokolwiek.'], ['Ty', 'Twoja oferta jest dwa razy droższa od konkurencji.'], ['Najlepszy przyjaciel', 'Znamy się od podstawówki.'], ['Ty', 'Wiem. Właśnie dlatego to takie trudne.'], ['Najlepszy przyjaciel', 'Nie mów, że to „tylko biznes”. Proszę.']],
    C('ego', 'Odmów – biznes to biznes', 'Firma zarabia, przyjaźń cierpi', { money: 800, buff: -15 }, 'Przyjaciel kiwa głową i wychodzi. Na urodziny w tym roku nie przychodzi.'),
    C('idealy', 'Daj mu zlecenie za pełną stawkę', 'Tracisz pieniądze, ratujesz przyjaciela', { money: -1500, buff: 15, renoma: 2 }, 'Przyjaciel ratuje firmę. Pięć lat później to on przyprowadza Ci największego klienta w historii.'),
    C('kompromis', 'Daj mniejsze zlecenie i pomóż mu poprawić ofertę', 'Mądra pomoc', { money: -400, burnout: 6, buff: 8 }, 'Spędzacie noc nad jego cennikiem. Rano ma lepszą ofertę – i dla Ciebie, i dla innych.')),
  D('media', '📺', 'Wywiad w telewizji śniadaniowej',
    [['Producentka', 'Mamy dla ciebie siedem minut na żywo. Jest jeden warunek.'], ['Ty', 'Słucham.'], ['Producentka', 'Musisz powiedzieć, że zaczynałaś/eś w garażu, bez grosza. Widzowie to kochają.'], ['Ty', 'Zaczynałam/em w mieszkaniu rodziców. Z ich pieniędzmi.'], ['Producentka', 'To nie sprzeda się o siódmej rano.']],
    C('ego', 'Opowiedz historię z garażem', 'Wielki rozgłos, mała uczciwość', { renoma: 10, demand: 15, buff: -5 }, 'Garaż robi furorę. Twoja mama dzwoni: „Jaki garaż? Przecież mieszkałaś/eś u nas!”.'),
    C('idealy', 'Powiedz prawdę albo odmów', 'Mniej rozgłosu, czyste sumienie', { renoma: 3, perf: 6, buff: 8 }, 'Opowiadasz o pomocy rodziców. Kilka osób pisze: „Pierwszy raz ktoś przyznał, że miał wsparcie”.'),
    C('kompromis', 'Opowiedz o mieszkaniu rodziców z humorem', 'Prawda z puentą', { renoma: 7, demand: 8 }, '„Mój garaż miał lodówkę i mamę, która pytała, czy jadłam/em” – studio się śmieje.')),
  D('zespol', '👥', 'Zwolnienia albo zysk',
    [['Księgowa', 'Mamy dwie drogi. Albo zwalniamy trzy osoby, albo przez pół roku nie wypłacasz sobie pensji.'], ['Ty', 'Inwestorzy?'], ['Księgowa', 'Inwestorzy chcą zwolnień. Mówią, że to „optymalizacja”.'], ['Ty', 'Te trzy osoby budowały firmę od zera.'], ['Księgowa', 'Inwestorzy budowali od zera wiele firm. Głównie ich zwolnienia.']],
    C('ego', 'Zwolnij trzy osoby', 'Firma bezpieczna, zespół przerażony', { money: 3000, perf: -5, burnout: -5, buff: -12 }, 'Firma zarabia. W kuchni nikt już nie żartuje.'),
    C('idealy', 'Rezygnujesz z pensji na pół roku', 'Lojalny zespół, puste konto', { money: -2500, perf: 12, renoma: 6, buff: 10 }, 'Zespół dowiaduje się przypadkiem. Następnego dnia ktoś zostawia Ci na biurku domowe ciasto.'),
    C('kompromis', 'Wszyscy (z Tobą) na 80% etatu przez 3 miesiące', 'Ból rozłożony równo', { money: -800, perf: 5, burnout: 6 }, 'Nikt nie jest zachwycony. Ale nikt też nie odchodzi.')),
  D('nagroda', '🏆', 'Nagroda za cudzą pracę',
    [['Organizator gali', 'Gratulacje! Zostałaś/eś Przedsiębiorcą Roku. Tylko… musisz odebrać nagrodę sama/sam.'], ['Ty', 'Dlaczego sama/sam? To praca całego zespołu.'], ['Organizator gali', 'Formuła gali. Jedna osoba, jedna statuetka, jedno zdjęcie na okładkę.'], ['Ty', 'A jeśli wejdę z całym zespołem?'], ['Organizator gali', 'To nie będzie okładki.']],
    C('ego', 'Odbierz sama/sam – okładka to okładka', 'Sława, chłodny zespół', { renoma: 12, demand: 12, perf: -4 }, 'Okładka wygląda świetnie. Zespół ogląda galę w biurze. W ciszy.'),
    C('idealy', 'Wejdź z całym zespołem', 'Bez okładki, z zespołem na zawsze', { perf: 12, renoma: 4, buff: 15 }, 'Na scenie dziesięć osób. Zdjęcie trafia do internetu i ma więcej udostępnień niż jakakolwiek okładka.'),
    C('kompromis', 'Odbierz sama/sam, ale całe przemówienie poświęć zespołowi', 'Sprytny balans', { renoma: 9, perf: 6 }, 'Wymieniasz każde imię. Zespół płacze ze wzruszenia przed telewizorem.')),
  D('dane', '🔐', 'Dane klientów na sprzedaż',
    [['Broker danych', 'Masz w bazie dwadzieścia tysięcy adresów klientów. Płacę złotówkę za każdy.'], ['Ty', 'To są ludzie, którzy mi zaufali.'], ['Broker danych', 'To są wiersze w tabelce. Ja kupuję wiersze, nie zaufanie.'], ['Ty', 'A co pan z nimi zrobi?'], ['Broker danych', 'Lepiej, żebyś nie wiedział(a). Łatwiej będzie spać.']],
    C('ego', 'Sprzedaj bazę', 'Szybkie 20 tysięcy, gigantyczne ryzyko', { money: 6000, renoma: -15, buff: -15 }, 'Przez tydzień jest spokój. Potem klienci dostają po 40 SMS-ów dziennie o garnkach. Wiedzą, skąd.'),
    C('idealy', 'Odmów i zgłoś brokera', 'Zasady ponad wszystko', { renoma: 10, perf: 6, buff: 10 }, 'Broker znika z rynku. Ty dostajesz list z podziękowaniem od urzędu ochrony danych.'),
    C('kompromis', 'Odmów i napisz o tym poradnik dla klientów', 'Zasady plus marketing', { renoma: 8, demand: 10, lessons: 1 }, 'Poradnik „Jak chronić swoje dane” sprzedaje się świetnie. Ironia losu.')),
];
