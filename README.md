# Domkowo 3D

Przeglądarkowa gra życiowa w 3D (three.js) w klimacie symulatora rodziny: dom do urządzania i budowania, kariery, relacje z sąsiadami, plotki i intrygi, imprezy, pogoda, śledztwo „Kto wrobił Słoneczną Uliczkę?”, system nieruchomości, skradanie się po posesjach oraz surrealistyczna kampania „Usterka Rzeczywistości”.

## Jak uruchomić

Gra wczytuje moduły i modele z plików, więc potrzebuje lokalnego serwera (nie działa po dwukliku w plik):

```bash
python3 -m http.server 8765
```

Potem otwórz w przeglądarce: <http://localhost:8765/domkowo3d.html>

Biblioteka three.js 0.160 i tekstury Poly Haven ładują się z CDN (potrzebny internet przy pierwszym uruchomieniu; bez niego gra używa tekstur proceduralnych).

## Najważniejsze pliki

| Plik | Co zawiera |
|---|---|
| `domkowo3d.html` | główna gra (silnik, interfejs, logika) |
| `budowa.js`, `detale.js` | budowanie domów, gotowe domy, materiały i detale |
| `osiedle.js` | ulica, sąsiedzi, działki, anomalie na osiedlu |
| `relacje.js`, `plotki.js`, `domino.js` | relacje, plotki, Efekt Domina (świadkowie, zemsta) |
| `skradanie.js` | skrytki, wnętrza domów sąsiadów, przyłapanie |
| `usterka.js` | kampania „Usterka Rzeczywistości” |
| `sledztwo.js`, `uliczka.js`, `pogoda.js`, `impreza.js`, `afera.js` | fabuła, wydarzenia i teksty |
| `assets/` | modele 3D, animacje i tekstury |

## Licencje zasobów

Modele i animacje pochodzą z darmowych paczek: Kenney (CC0), Quaternius (CC0) oraz Poly Pizza (CC0 / CC-BY 3.0). Szczegóły i autorzy są w plikach `LICENCJA*.txt` oraz `assets/modele/AUTORZY.txt`.
