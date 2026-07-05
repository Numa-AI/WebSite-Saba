# SABA S.r.l. — Sito vetrina

Sito statico (HTML/CSS/JS, nessun build) per **SABA S.r.l.**, azienda di **forgiatura a caldo di ricambi per macchine agricole** (mazze trinciasermenti, denti per erpice, zappe per frese, vomeri/punte, ricambi su disegno), con **3 stabilimenti** (Forgiatura / Trattamenti termici / Lavorazione & finitura). Tagline: *"QUALITY, EVERYWHERE"*.

## Struttura

Sito **a pagina unica** ("Fork Terra Nova"): tutto in `index.html`, con sezioni scorribili collegate dalla navigazione ad ancora (`#home`, `#azienda`, `#prodotti`, `#blog`, `#stabilimenti`, `#contatti`; più il marquee clienti `#clienti`).

```text
index.html                     Pagina unica (home, clienti, azienda, prodotti, blog, stabilimenti, contatti)
assets/css/styles.css          Design system (variabili CSS, glassmorphism, componenti, animazioni)
assets/js/i18n.js              Motore traduzioni IT/EN/FR/DE (data-en/fr/de accanto all'italiano)
assets/js/app.js               Reveal allo scroll, scrollspy, contatori, menu mobile, dropdown lingue, form, mappa
assets/vendor/leaflet.css      Libreria mappa (locale, no CDN)
assets/vendor/leaflet.js       Libreria mappa (locale, no CDN)
assets/img/                    Logo SABA, loghi clienti, foto di campo, scatti studio dei ricambi forgiati (prod-*.png), sfondi hero e contatti, poster video
assets/video/stabilimenti-clip.mp4   Clip stabilimenti (muta, in loop, sezione Stabilimenti)
```

Font caricati da Google Fonts (Space Grotesk + Space Mono). La mappa dei 3 stabilimenti usa Leaflet servito in locale da `assets/vendor/`.

## ⚠️ REGOLA LINGUE (obbligatoria)

Il sito è **multilingue: Italiano (default), Inglese, Francese, Tedesco**.

L'italiano è il testo scritto direttamente nell'HTML. Le altre lingue stanno in attributi **accanto** allo stesso elemento:
- testo → `data-en` / `data-fr` / `data-de` (usa `data-...-placeholder` per i placeholder, `data-...-aria` per gli aria-label; aggiungi `data-html` se il testo contiene tag come `<br>`/`<b>`)

**Ogni volta che aggiungi o modifichi un testo visibile, DEVI aggiornare TUTTE e quattro le lingue** sullo stesso elemento. Mai lasciare un testo solo in italiano o aggiornarne solo alcune.

Esempio corretto:
```html
<h2 data-en="Forged to last" data-fr="Forgés pour durer" data-de="Geschmiedet, um zu halten">Forgiati per durare</h2>
<input placeholder="Mario Rossi"
  data-en-placeholder="John Smith" data-fr-placeholder="Jean Dupont" data-de-placeholder="Max Mustermann">
```

Se manca la traduzione di una lingua, `i18n.js` ricade automaticamente sull'italiano — ma non è una scusa per ometterla.

Per **aggiungere una nuova lingua** in futuro: aggiungi il codice in `LANGS` dentro `assets/js/i18n.js`, aggiungi un pulsante `data-lang="xx"` in **entrambi** i selettori lingua (il blocco `.lang-toggle` nell'header e il menu `.lang-dropdown__menu` compatto per mobile), e l'attributo `data-xx` corrispondente su ogni elemento tradotto.

Glossario navigazione (mantenere coerente):
| IT | EN | FR | DE |
|---|---|---|---|
| Home | Home | Accueil | Startseite |
| Azienda | Company | Entreprise | Unternehmen |
| Prodotti | Products | Produits | Produkte |
| Blog | Blog | Blog | Blog |
| Stabilimenti | Plants | Sites | Standorte |
| Contatti | Contact | Contact | Kontakt |
| Richiedi preventivo | Get a quote | Demander un devis | Angebot anfordern |

## Design system ("Campo & Forgia")

- Colori (da logo): ink `#16202B`, corallo `#F8463A` (con `--coral-dark #D93227`), avorio `#F7F4EE`, sabbia `#E6DCC8`, acciaio `#8A95A1`. Tutto via variabili CSS in `:root`, incluse le variabili glass (`--glass-bg`, `--glass-border`).
- Font: **Space Grotesk** (`--font-sans`, testo e display), **Space Mono** (`--font-mono`, dati/codici/eyebrow).
- Firma visiva: **foto fissa a tutta pagina** dietro ai contenuti (`.frame__bg` + velo `.frame__overlay`), **navbar bianca a pillola** flottante (`.nav-pill`), card in **glassmorphism** (`.glass`). La sezione Contatti ha uno sfondo fotografico proprio. Lo sfondo fisso è un `<picture>`: sotto i 640px carica `hero-tractor-sunset-mobile.jpg` (ritaglio verticale della stessa scena, sole a sinistra e senza trattore, derivato con Pillow da `hero-tractor-sunset.png`), sopra la versione panoramica.
- Animazioni: reveal allo scroll a scaglioni (`.anim` + IntersectionObserver, ritardo `--d`), scrollspy che evidenzia la sezione attiva, contatori (`[data-count]`), marquee loghi clienti, mappa Leaflet lazy, clip video in pausa fuori vista, menu mobile e dropdown lingue. Rispettare sempre `prefers-reduced-motion`.

## Note

- **Placeholder da sostituire** (cerca i commenti `PLACEHOLDER` in `index.html` e `assets/js/app.js`): indirizzi reali (via e civico) dei 3 stabilimenti e sede legale, telefono (`+39 000 000 0000`), P.IVA (`IT00000000000`), coordinate esatte degli stabilimenti nella mappa (`initMap` in `app.js`, ora sui centri di Vestone e Barghe), i link Privacy/Cookie Policy nel footer (`href="#"`), e collegare il **form a un backend/endpoint** (ora è solo front-end, mostra un messaggio di conferma senza inviare).
- Ci sono **due sezioni distinte**: **Prodotti** (`#prodotti`) e **Blog** (`#blog`), entrambe basate sulla griglia `.product-grid`.
  - **Prodotti** (`.product-grid`): 6 card catalogo (media, titolo, descrizione breve, tag, link "Richiedi info" `.product__more`). Tutte e 6 usano gli **scatti studio dei ricambi forgiati** su fondo scuro: `prod-mazze/coltelli/denti/zappe/vomeri/ricambi.png`.
  - **Blog** (`.blog-carousel` > `.product-grid.blog-track`): 4 post editoriali (`.blog-card`) con **foto di campo/trattori** (`field-*.jpg`); ogni card ha un eyebrow di categoria (`.blog-card__cat`) e un **articolo espandibile** `<details class="article">` in tutte e 4 le lingue (un `<p>` per paragrafo, ciascuno con `data-en/fr/de`). Da **desktop** è un **carosello a riga singola**: 3 card visibili + frecce `.blog-nav` (`data-blog-prev`/`data-blog-next`, JS in `app.js`) che scorrono **all'infinito** in entrambi i sensi. Aprendo un articolo (`:has(.article[open])`) la card va a **tutta larghezza** e le altre si nascondono (vista lettura); in quello stato le frecce **cambiano articolo** (prec/succ, un solo `<details open>` alla volta). Da **mobile** eredita il carosello a swipe di `.product-grid` (frecce nascoste, articolo che si espande in verticale). Articoli (aratura, trinciatura, semina, fresatura) scritti con la skill **humanizer** + ricerca web di agronomia.
  - Niente **fade laterale** sul carosello mobile: la `mask-image` su `.product-grid` creava un backdrop root che spegneva il `backdrop-filter` (glassmorphism) delle card figlie, quindi è stata rimossa. Gli swipe scattano una card alla volta (`scroll-snap-stop: always`).
- Gli **scatti studio dei ricambi** sono generati con Pillow (`knockout_light_bg` per i pezzi in acciaio chiaro, `knockout_dark_part` per quelli scuri come coltello/zappa, così i fori mostrano il fondo) a partire dai file sorgente `ChatGPT Image *.png` nella root (fondo studio scuro 16:9); i sorgenti sono in `.gitignore` (pesanti, non deployare).
- Le **immagini sono reali** (loghi clienti, foto di campo, sfondi hero e contatti, poster video): stanno in `assets/img/`. Lo sfondo hero `hero-bg.png` è pesante (~2,4 MB): valutare una versione compressa/WebP.
- Anteprima locale: servire la **root del progetto** con un server statico (es. `python -m http.server`) e aprire `index.html` — `file://` è bloccato per i moduli/asset.
