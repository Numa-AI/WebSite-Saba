/* ============================================================
   SABA — Internazionalizzazione IT / EN / FR / DE
   L'italiano è il testo di default presente nell'HTML.
   Le altre lingue vivono in attributi accanto al testo italiano,
   così restano sempre sincronizzate quando si modifica un testo:
     - data-en / data-fr / data-de          -> textContent
       (oppure innerHTML se l'elemento ha anche data-html;
        oppure l'attributo content per i <meta>)
     - data-en-placeholder / -fr- / -de-     -> attributo placeholder
     - data-en-aria / -fr- / -de-            -> attributo aria-label
   Se manca la traduzione per una lingua, si ricade sull'italiano.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "saba-lang";
  var LANGS = ["it", "en", "fr", "de"];
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
    var initial = LANGS.indexOf(stored) !== -1 ? stored : "it";
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
