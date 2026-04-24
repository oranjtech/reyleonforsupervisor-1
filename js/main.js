(function () {
  "use strict";

  var LANG_KEY = "rey-leon-site-lang";
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getStoredLang() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function applyLang(lang) {
    var root = document.documentElement;
    root.setAttribute("lang", lang === "es" ? "es" : "en");
    root.setAttribute("data-lang", lang === "es" ? "es" : "en");
    var toggles = document.querySelectorAll("[data-lang-toggle]");
    toggles.forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-toggle") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.classList.toggle("is-active", isActive);
    });
  }

  function initLang() {
    var stored = getStoredLang();
    var browser =
      navigator.language && navigator.language.toLowerCase().startsWith("es")
        ? "es"
        : "en";
    var initial = stored === "es" || stored === "en" ? stored : browser;
    applyLang(initial);

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = btn.getAttribute("data-lang-toggle");
        if (next === "en" || next === "es") {
          setStoredLang(next);
          applyLang(next);
          var menu = btn.closest(".mobile-nav-details");
          if (menu) menu.removeAttribute("open");
        }
      });
    });
  }

  function initMobileNavClose() {
    document.querySelectorAll(".mobile-nav-panel a").forEach(function (a) {
      a.addEventListener("click", function () {
        var d = a.closest("details");
        if (d) d.removeAttribute("open");
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
        if (history.replaceState) {
          history.replaceState(null, "", id);
        }
      });
    });
  }

  function initNavScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initParallax() {
    if (prefersReduced) return;
    var layer = document.querySelector("[data-parallax]");
    if (!layer) return;
    var reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      /* ignore */
    }
    if (reduce) return;

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          var shift = Math.min(y * 0.12, 80);
          layer.style.setProperty("--parallax-y", shift + "px");
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initCurrentYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var y = new Date().getFullYear();
    nodes.forEach(function (n) {
      n.textContent = String(y);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initLang();
      initMobileNavClose();
      initSmoothScroll();
      initNavScroll();
      initParallax();
      initReveal();
      initCurrentYear();
    });
  } else {
    initLang();
    initMobileNavClose();
    initSmoothScroll();
    initNavScroll();
    initParallax();
    initReveal();
    initCurrentYear();
  }
})();
