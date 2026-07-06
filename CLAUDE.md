# SABA S.r.l. — Sito vetrina

Sito statico (HTML/CSS/JS, nessun build) per **SABA S.r.l.**, azienda di **forgiatura a caldo di ricambi per macchine agricole** (mazze trinciasermenti, denti per erpice, zappe per frese, vomeri/punte, ricambi su disegno), con **3 stabilimenti**: 01 Forgiatura & rifacimento stampi (Loc. Fornaci 9, Nozza di Vestone BS), 02 Forgiatura automatizzata & lavorazioni meccaniche (Strada di Ponte Re, Barghe BS), 03 Trattamenti termici & magazzino automatizzato (Via Provinciale 10, Barghe BS). Sede legale = stabilimento 01. Tagline: *"QUALITY, EVERYWHERE"*.

## Struttura

Sito **a pagina unica** ("Fork Terra Nova"): tutto in `index.html`, con sezioni scorribili collegate dalla navigazione ad ancora (`#home`, `#azienda`, `#prodotti`, `#blog`, `#stabilimenti`, `#contatti`; più il marquee clienti `#clienti`).

```text
index.html                     Pagina unica (home, clienti, azienda, prodotti, blog, stabilimenti, contatti)
privacy-policy.html            Informativa privacy (pagina statica separata, IT/EN/FR/DE/ES)
cookie-policy.html             Cookie policy (pagina statica separata, IT/EN/FR/DE/ES)
assets/css/styles.css          Design system (variabili CSS, glassmorphism, componenti, animazioni) + stile .legal-page per le pagine legali
assets/js/i18n.js              Motore traduzioni IT/EN/FR/DE/ES (data-en/fr/de/es accanto all'italiano)
assets/js/app.js               Reveal allo scroll, scrollspy, contatori, menu mobile, dropdown lingue, form, mappa
assets/vendor/leaflet.css      Libreria mappa (locale, no CDN)
assets/vendor/leaflet.js       Libreria mappa (locale, no CDN)
assets/vendor/fonts/           Space Grotesk + Space Mono in woff2 (locale, no Google Fonts CDN)
assets/img/                    Logo SABA (mark + wordmark), loghi clienti, foto di campo, scatti studio dei ricambi forgiati (prod-*.png), sfondi hero e contatti, poster video
assets/video/stabilimenti-clip.mp4   Clip stabilimenti (muta, in loop, sezione Stabilimenti)
assets/sources/                Sorgenti AI pesanti (source-prod-*.png, source-hero-*.png) da cui sono derivati gli asset sopra; in .gitignore, non deployare
```

Font **vendorizzati in locale** in `assets/vendor/fonts/` (Space Grotesk + Space Mono, woff2, dichiarati via `@font-face` in `styles.css`, lug 2026) — non più caricati da Google Fonts CDN. La mappa dei 3 stabilimenti usa Leaflet servito in locale da `assets/vendor/`. Il logo in navbar è la coppia `saba-mark.png` (icona, `.brand__mark`) + `saba-wordmark.png` (scritta, `.brand__name`, immagine e non più testo).

## ⚠️ REGOLA LINGUE (obbligatoria)

Il sito è **multilingue: Italiano (default), Inglese, Francese, Tedesco, Spagnolo**.

L'italiano è il testo scritto direttamente nell'HTML. Le altre lingue stanno in attributi **accanto** allo stesso elemento:
- testo → `data-en` / `data-fr` / `data-de` / `data-es` (usa `data-...-placeholder` per i placeholder, `data-...-aria` per gli aria-label; aggiungi `data-html` se il testo contiene tag come `<br>`/`<b>`)

**Ogni volta che aggiungi o modifichi un testo visibile, DEVI aggiornare TUTTE e cinque le lingue** sullo stesso elemento. Mai lasciare un testo solo in italiano o aggiornarne solo alcune.

Esempio corretto:
```html
<h2 data-en="Forged to last" data-fr="Forgés pour durer" data-de="Geschmiedet, um zu halten" data-es="Forjados para durar">Forgiati per durare</h2>
<input placeholder="Mario Rossi"
  data-en-placeholder="John Smith" data-fr-placeholder="Jean Dupont" data-de-placeholder="Max Mustermann" data-es-placeholder="Juan Pérez">
```

Se manca la traduzione di una lingua, `i18n.js` ricade automaticamente sull'italiano — ma non è una scusa per ometterla.

Per **aggiungere una nuova lingua** in futuro: aggiungi il codice in `LANGS` dentro `assets/js/i18n.js`, aggiungi una voce `<li><button data-lang="xx">` (con bandiera `<span class="lang-flag" aria-hidden="true">🏳️</span>` + nome lingua) al menu `.lang-dropdown__menu` — l'unico selettore lingua, usato sia da desktop che da mobile — **su tutte e 3 le pagine HTML** (`index.html`, `privacy-policy.html`, `cookie-policy.html`), aggiungi il codice bandiera alla mappa `LANG_FLAGS` in `assets/js/app.js` (per `index.html`) e negli script inline duplicati di `privacy-policy.html`/`cookie-policy.html`, e l'attributo `data-xx` corrispondente su ogni elemento tradotto.

Glossario navigazione (mantenere coerente):
| IT | EN | FR | DE | ES |
|---|---|---|---|---|
| Home | Home | Accueil | Startseite | Inicio |
| Azienda | Company | Entreprise | Unternehmen | Empresa |
| Prodotti | Products | Produits | Produkte | Productos |
| Blog | Blog | Blog | Blog | Blog |
| Stabilimenti | Plants | Sites | Standorte | Plantas |
| Contatti | Contact | Contact | Kontakt | Contacto |
| Richiedi preventivo | Get a quote | Demander un devis | Angebot anfordern | Solicitar presupuesto |

## Design system ("Campo & Forgia")

- Colori (da logo): ink `#16202B`, corallo `#F8463A` (con `--coral-dark #D93227`), avorio `#F7F4EE`, sabbia `#E6DCC8`, acciaio `#8A95A1`. Tutto via variabili CSS in `:root`, incluse le variabili glass (`--glass-bg`, `--glass-border`).
- Font: **Space Grotesk** (`--font-sans`, testo e display), **Space Mono** (`--font-mono`, dati/codici/eyebrow).
- Firma visiva: **foto fissa a tutta pagina** dietro ai contenuti (`.frame__bg` + velo `.frame__overlay`), **navbar bianca a pillola** flottante (`.nav-pill`), card in **glassmorphism** (`.glass`). La sezione Contatti ha uno sfondo fotografico proprio. Lo sfondo fisso è un `<picture>`: sotto i 640px carica `hero-tractor-sunset-mobile.jpg` (scatto verticale generato della stessa scena, trattore in basso e sole a sinistra; sorgente `assets/sources/source-hero-tractor-sunset-mobile.png`, in `.gitignore`), sopra la versione panoramica.
- Animazioni: reveal allo scroll a scaglioni (`.anim` + IntersectionObserver, ritardo `--d`), scrollspy che evidenzia la sezione attiva, contatori (`[data-count]`), marquee loghi clienti, mappa Leaflet lazy, clip video in pausa fuori vista, menu mobile e dropdown lingue. Rispettare sempre `prefers-reduced-motion`.

## Note

- **Deploy**: sito pubblicato su **Cloudflare Pages** (progetto `saba-website`, sottodominio `saba-website.pages.dev`), sotto l'account Cloudflare **Numa AI** dell'utente (lug 2026). Dominio definitivo `saba-forging.it` gestito da un'azienda esterna: DNS richiesti (non ancora confermati) — record `CNAME www → saba-website.pages.dev` e redirect 301 dal dominio nudo (`saba-forging.it`) a `www.saba-forging.it`. Finché il redirect non è attivo, l'unico URL pubblico raggiungibile è il sottodominio `.pages.dev` (o `www.saba-forging.it` una volta propagato il CNAME).
- Il **form contatti** è collegato a [Web3Forms](https://web3forms.com) (invio via `fetch` in `app.js`, nessun backend) con una access key reale già inserita nell'`<input type="hidden" name="access_key">` (lug 2026). Le richieste arrivano via email all'indirizzo registrato su web3forms.com. Indirizzi, telefono (`+39 0365 81233`), sede legale, CAP e P.IVA (`IT00680570983`) sono **reali** (lug 2026); i pin della mappa (`initMap` in `app.js`) sono geocodificati sugli indirizzi e ritoccabili al metro.
- **Privacy Policy e Cookie Policy** (lug 2026): `privacy-policy.html` e `cookie-policy.html`, pagine statiche a sé stanti (non sezioni della single-page), linkate dal footer e dal testo del consenso nel form contatti (`data-html` con `<a>` inline). Multilingue IT/EN/FR/DE/ES come il resto del sito (stesso `.lang-toggle`/`.lang-dropdown` in header). Sono una prima bozza (dati reali: P.IVA, CF, REA, PEC, indirizzo), non ancora riviste da un legale; entrambe hanno un box `.legal-note` che lo segnala esplicitamente, incluso il riferimento al trasferimento extra-UE dei dati verso Web3Forms (punto 7 della Privacy Policy). Se si aggiungono strumenti di tracciamento (Analytics, pixel) la Cookie Policy va aggiornata e serve un banner di consenso (ora non serve: solo cookie tecnici + localStorage lingua + font/tile/Web3Forms di terze parti).
- Ci sono **due sezioni distinte**: **Prodotti** (`#prodotti`) e **Blog** (`#blog`), entrambe basate sulla griglia `.product-grid`.
  - **Prodotti** (`.product-grid`): 6 card catalogo (media, titolo, descrizione breve, tag, link "Richiedi info" `.product__more`). Tutte e 6 usano gli **scatti studio dei ricambi forgiati** su fondo scuro: `prod-mazze/coltelli/denti/zappe/vomeri/ricambi.png`.
  - **Blog** (`.blog-carousel` > `.product-grid.blog-track`): 4 post editoriali (`.blog-card`) con **foto di campo/trattori** (`field-*.jpg`); ogni card ha un eyebrow di categoria (`.blog-card__cat`) e un **articolo espandibile** `<details class="article">` in tutte e 5 le lingue (un `<p>` per paragrafo, ciascuno con `data-en/fr/de/es`). Da **desktop** è un **carosello a riga singola**: 3 card visibili + frecce `.blog-nav` (`data-blog-prev`/`data-blog-next`, JS in `app.js`) che scorrono **all'infinito** in entrambi i sensi. Aprendo un articolo (`:has(.article[open])`) la card va a **tutta larghezza** e le altre si nascondono (vista lettura); in quello stato le frecce **cambiano articolo** (prec/succ, un solo `<details open>` alla volta). Da **mobile** eredita il carosello a swipe di `.product-grid` (frecce nascoste, articolo che si espande in verticale). Articoli (aratura, trinciatura, semina, fresatura) scritti con la skill **humanizer** + ricerca web di agronomia.
  - Niente **fade laterale** sul carosello mobile: la `mask-image` su `.product-grid` creava un backdrop root che spegneva il `backdrop-filter` (glassmorphism) delle card figlie, quindi è stata rimossa. Gli swipe scattano una card alla volta (`scroll-snap-stop: always`).
- Gli **scatti studio dei ricambi** sono generati con Pillow (`knockout_light_bg` per i pezzi in acciaio chiaro, `knockout_dark_part` per quelli scuri come zappa, così i fori mostrano il fondo) a partire dai file sorgente `assets/sources/source-prod-*.png` (uno per pezzo: mazze/vomeri/denti/ricambi/coltelli/zappe); i sorgenti sono in `.gitignore` (pesanti, non deployare). La 2ª card prodotti (file `prod-coltelli.png`/`source-prod-coltelli.png`, nome legacy) mostra dal lug 2026 una **punta forgiata a profilo dritto** con nervatura a spina di pesce, titolo "Punte di ricambio" (`Punte di ricambio`/`Replacement points`/`Pointes de rechange`/`Ersatzspitzen`/`Puntas de repuesto`).
- Le **immagini sono reali** (loghi clienti, foto di campo, sfondi hero e contatti, poster video): stanno in `assets/img/`. Lo sfondo hero desktop `hero-tractor-sunset.png` è pesante (~2,5 MB): valutare una versione compressa/WebP.
- Anteprima locale: servire la **root del progetto** con un server statico (es. `python -m http.server`) e aprire `index.html` — `file://` è bloccato per i moduli/asset.
