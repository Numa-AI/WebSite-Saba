/* ============================================================
   SABA — Internazionalizzazione IT / EN / FR / DE / ES
   L'italiano è il testo di default presente nell'HTML.
   Le altre lingue vivono in attributi accanto al testo italiano,
   così restano sempre sincronizzate quando si modifica un testo:
     - data-en / data-fr / data-de / data-es -> textContent
       (oppure innerHTML se l'elemento ha anche data-html;
        oppure l'attributo content per i <meta>)
     - data-en-placeholder / -fr- / -de- / -es- -> attributo placeholder
     - data-en-aria / -fr- / -de- / -es-        -> attributo aria-label
   Se manca la traduzione per una lingua, si ricade sull'italiano.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "saba-lang";
  var LANGS = ["it", "en", "fr", "de", "es"];
  var cached = false;

  function getStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  /* Salva i contenuti italiani originali (una sola volta). */
  function cacheOriginals() {
    if (cached) return;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.tagName === "META") {
        el.setAttribute("data-it", el.getAttribute("content") || "");
      } else if (el.hasAttribute("data-html")) {
        el.setAttribute("data-it", el.innerHTML);
      } else {
        el.setAttribute("data-it", el.textContent);
      }
    });
    document.querySelectorAll("[data-en-placeholder]").forEach(function (el) {
      el.setAttribute("data-it-placeholder", el.getAttribute("placeholder") || "");
    });
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      el.setAttribute("data-it-aria", el.getAttribute("aria-label") || "");
    });
    cached = true;
  }

  /* Lingua preferita dal browser, se tra quelle supportate (altrimenti null).
     Legge navigator.languages (es. ["en-US","en","it"]) e ne prende la prima
     il cui codice primario ("en-US" -> "en") è tra LANGS. Nessuna chiamata di
     rete, nessun permesso: usa solo l'impostazione lingua del dispositivo. */
  function detectBrowserLang() {
    var list = [];
    try {
      if (navigator.languages && navigator.languages.length) {
        list = navigator.languages;
      } else if (navigator.language) {
        list = [navigator.language];
      }
    } catch (e) { return null; }
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || "").toLowerCase().split("-")[0];
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return null;
  }

  /* Ritorna la traduzione per la lingua, con fallback sull'italiano. */
  function pick(el, lang, suffix) {
    var it = el.getAttribute("data-it" + suffix);
    if (lang === "it") return it;
    var v = el.getAttribute("data-" + lang + suffix);
    return (v === null || v === "") ? it : v;
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "it";
    cacheOriginals();
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = pick(el, lang, "");
      if (el.tagName === "META") {
        el.setAttribute("content", val);
      } else if (el.hasAttribute("data-html")) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-en-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", pick(el, lang, "-placeholder"));
    });
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      el.setAttribute("aria-label", pick(el, lang, "-aria"));
    });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });

    store(lang);
  }

  function init() {
    var stored = getStored();
    /* Precedenza: 1) scelta salvata dall'utente, 2) lingua del browser al
       primo accesso, 3) italiano. Salvando la scelta manuale (store in
       applyLang) l'auto-rilevamento non sovrascrive più le visite successive. */
    var initial = LANGS.indexOf(stored) !== -1
      ? stored
      : (detectBrowserLang() || "it");
    applyLang(initial);
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
    });
    window.SABA_setLang = applyLang;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
