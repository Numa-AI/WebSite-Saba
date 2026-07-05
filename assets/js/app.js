/* ============================================================
   SABA — Fork "Terra Nova": interazioni (pagina unica)
   - Reveal allo scroll a scaglioni (IntersectionObserver)
   - Scrollspy: evidenzia la sezione attiva nella navigazione
   - Contatori numerici animati (sezione Azienda)
   - Titolo hero sempre su una riga in tutte le lingue
   - Menu mobile a comparsa
   - Form contatti (front-end, senza backend)
   Rispetta prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;
  var hasIO = "IntersectionObserver" in window;

  /* ---------- Ritardi a scaglioni per gli elementi .anim ---------- */
  document.querySelectorAll(".section").forEach(function (section) {
    section.querySelectorAll(".anim").forEach(function (el, i) {
      el.style.setProperty("--d", Math.min(i, 8));
    });
  });

  /* ---------- Reveal allo scroll ---------- */
  var anims = document.querySelectorAll(".anim");
  if (prefersReduced || !hasIO) {
    anims.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    anims.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scrollspy ---------- */
  var sections = document.querySelectorAll("main .section");
  var navAnchors = document.querySelectorAll(".nav-links a, .mobile-menu ul a");
  function setActive(id) {
    navAnchors.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  if (hasIO) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contatori animati ---------- */
  function formatNum(value, decimals) {
    return value.toLocaleString("it-IT", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = 1500;
    var startTime = null;
    function frame(now) {
      if (startTime === null) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(target * eased, decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = formatNum(target, decimals);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (prefersReduced || !hasIO) {
      counters.forEach(function (el) {
        el.textContent = formatNum(parseFloat(el.getAttribute("data-count")), parseInt(el.getAttribute("data-decimals") || "0", 10));
      });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Titoli sempre su una riga ----------
     I titoli con white-space: nowrap (hero sempre, Stabilimenti da
     desktop in su) vengono ridotti in proporzione se in una lingua
     superano la larghezza disponibile. Ricalcolo su resize e
     cambio lingua.                                              */
  var fitTitleEls = document.querySelectorAll(".home__title, .plant-title");
  function fitTitles() {
    fitTitleEls.forEach(function (el) {
      el.style.fontSize = "";
      if (window.getComputedStyle(el).whiteSpace !== "nowrap") return;
      var available = el.parentElement.clientWidth;
      var needed = el.scrollWidth;
      if (needed > available && needed > 0) {
        var current = parseFloat(window.getComputedStyle(el).fontSize);
        el.style.fontSize = Math.max(18, Math.floor(current * available / needed * 10) / 10) + "px";
      }
    });
  }
  fitTitles();
  window.addEventListener("resize", fitTitles);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
  /* i18n.js aggiorna l'attributo lang di <html> a ogni cambio lingua */
  new MutationObserver(fitTitles).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  /* ---------- Clip stabilimenti ----------
     Muta e in loop; ferma con prefers-reduced-motion e in pausa
     quando esce dalla finestra per risparmiare batteria.        */
  var clip = document.querySelector(".plant-video video");
  if (clip) {
    if (prefersReduced) {
      clip.removeAttribute("autoplay");
      clip.pause();
    } else if (hasIO) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = clip.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            clip.pause();
          }
        });
      }, { threshold: 0.2 });
      vio.observe(clip);
    }
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  function closeMenu() {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    var closeBtn = document.querySelector(".mobile-menu__close");
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    var menu = document.querySelector(".mobile-menu");
    if (menu) {
      menu.addEventListener("click", function (e) {
        if (e.target === menu) closeMenu();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Dropdown lingue (da mobile) ---------- */
  var langDropdown = document.querySelector("[data-lang-dropdown]");
  if (langDropdown) {
    var langBtn = langDropdown.querySelector(".lang-dropdown__btn");
    var langCurrent = langDropdown.querySelector("[data-lang-current]");

    function closeLang() {
      langDropdown.removeAttribute("data-open");
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
    function updateLangLabel() {
      if (langCurrent) {
        langCurrent.textContent = (document.documentElement.getAttribute("lang") || "it").toUpperCase();
      }
    }

    if (langBtn) {
      langBtn.addEventListener("click", function () {
        if (langDropdown.hasAttribute("data-open")) {
          closeLang();
        } else {
          langDropdown.setAttribute("data-open", "");
          langBtn.setAttribute("aria-expanded", "true");
        }
      });
    }
    /* i18n.js applica già la lingua al click: qui chiudo solo il menu */
    langDropdown.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", closeLang);
    });
    document.addEventListener("click", function (e) {
      if (!langDropdown.contains(e.target)) closeLang();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLang();
    });

    updateLangLabel();
    new MutationObserver(updateLangLabel).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }

  /* ---------- Form contatti ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var status = form.querySelector(".form__status");
      if (status) {
        status.classList.add("is-visible");
        status.setAttribute("role", "status");
      }
      form.reset();
    });
  }

  /* ---------- Mappa stabilimenti (Leaflet + tile chiare CARTO) ----------
     Coordinate geocodificate sugli indirizzi reali degli stabilimenti;
     ritoccabili al metro se serve.                                */
  var mapEl = document.getElementById("map");
  if (mapEl && window.L) {
    var mapInited = false;
    var initMap = function () {
      if (mapInited) return;
      mapInited = true;
      var plants = [
        { tag: "01", name: "SABA · Forgiatura", town: "Loc. Fornaci, 9 · Vestone (BS)", ll: [45.7067, 10.3919] },
        { tag: "02", name: "SABA · Forgiatura automatizzata", town: "Strada di Ponte Re · Barghe (BS)", ll: [45.6914, 10.3963] },
        { tag: "03", name: "SABA · Trattamenti", town: "Via Provinciale, 10 · Barghe (BS)", ll: [45.6708, 10.4101] }
      ];
      var map = L.map(mapEl, { scrollWheelZoom: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(map);
      var bounds = [];
      plants.forEach(function (p) {
        var icon = L.divIcon({
          className: "",
          html: '<span class="map-pin">' + p.tag + "</span>",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -18]
        });
        var gmaps = "https://www.google.com/maps/dir/?api=1&destination=" + p.ll[0] + "," + p.ll[1];
        L.marker(p.ll, { icon: icon })
          .addTo(map)
          .bindPopup("<b>" + p.name + "</b>" + p.town + '<br><a href="' + gmaps + '" target="_blank" rel="noopener">Google Maps ↗</a>');
        bounds.push(p.ll);
      });
      map.fitBounds(bounds, { padding: [32, 32] });
    };
    if (hasIO) {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            initMap();
            mio.disconnect();
          }
        });
      }, { rootMargin: "200px" });
      mio.observe(mapEl);
    } else {
      initMap();
    }
  }

  /* ---------- Frecce carosello blog ----------
     Da desktop il blog è una riga scorribile: le frecce avanti/indietro girano
     all'infinito (dalla fine si torna all'inizio e viceversa). */
  var blogTrack = document.querySelector("[data-blog-track]");
  var blogPrev = document.querySelector("[data-blog-prev]");
  var blogNext = document.querySelector("[data-blog-next]");
  if (blogTrack && (blogPrev || blogNext)) {
    var blogCards = Array.prototype.slice.call(blogTrack.querySelectorAll(".blog-card"));
    var blogDetails = Array.prototype.slice.call(blogTrack.querySelectorAll(".article"));
    var isDesktop = function () { return window.matchMedia("(min-width: 640px)").matches; };
    var cardStep = function () {
      var card = blogTrack.querySelector(".blog-card");
      return card ? card.getBoundingClientRect().width + 14 : blogTrack.clientWidth / 3;
    };
    var goBlog = function (dir) {
      var open = blogTrack.querySelector(".article[open]");
      if (open) {
        /* modalità lettura: chiudi l'articolo aperto e apri il prec/succ (loop) */
        var i = blogCards.indexOf(open.closest(".blog-card"));
        var n = (i + dir + blogCards.length) % blogCards.length;
        open.open = false;
        var d = blogCards[n].querySelector(".article");
        if (d) d.open = true;
        return;
      }
      var behavior = prefersReduced ? "auto" : "smooth";
      var max = blogTrack.scrollWidth - blogTrack.clientWidth;
      var target;
      if (dir > 0) {
        target = blogTrack.scrollLeft >= max - 6 ? 0 : Math.min(blogTrack.scrollLeft + cardStep(), max);
      } else {
        target = blogTrack.scrollLeft <= 6 ? max : Math.max(blogTrack.scrollLeft - cardStep(), 0);
      }
      blogTrack.scrollTo({ left: target, behavior: behavior });
    };
    if (blogNext) blogNext.addEventListener("click", function () { goBlog(1); });
    if (blogPrev) blogPrev.addEventListener("click", function () { goBlog(-1); });

    /* Da desktop un solo articolo aperto alla volta (vista lettura a tutta
       larghezza); riporto lo scorrimento a inizio così la card piena è intera. */
    blogDetails.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open && isDesktop()) {
          blogDetails.forEach(function (o) { if (o !== d) o.open = false; });
          blogTrack.scrollLeft = 0;
        }
      });
    });
  }

  /* ---------- Anno corrente ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
