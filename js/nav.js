/* ==========================================================================
   KFIT PERFORMANCE — Site interactions
   - Mobile nav drawer (hamburger) with focus + scroll management
   - Sticky-nav shadow on scroll
   - IntersectionObserver scroll-fade animations
   - Footer year stamp
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavDrawer();
    initStickyNav();
    initScrollFade();
    initFooterYear();
    initFormRedirect();
  });

  /* ---------------------------------------------------------------------- */
  /* Mobile navigation drawer                                               */
  /* ---------------------------------------------------------------------- */
  function initNavDrawer() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.querySelector(".nav-drawer");
    if (!toggle || !drawer) return;

    var body = document.body;

    function openDrawer() {
      drawer.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      body.classList.add("no-scroll");
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      body.classList.remove("no-scroll");
    }

    function toggleDrawer() {
      if (drawer.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    toggle.addEventListener("click", toggleDrawer);

    // Close when a drawer link is tapped
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
        toggle.focus();
      }
    });

    // Reset state if resized up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Sticky nav shadow                                                      */
  /* ---------------------------------------------------------------------- */
  function initStickyNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 8) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------- */
  /* Scroll-triggered fade-in                                               */
  /* ---------------------------------------------------------------------- */
  function initScrollFade() {
    var items = document.querySelectorAll(".fade-in");
    if (!items.length) return;

    // No IntersectionObserver support (or reduced motion) → show everything.
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------- */
  /* Footer year                                                            */
  /* ---------------------------------------------------------------------- */
  function initFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Contact form: point FormSubmit's _next at this site's thank-you page   */
  /* so the redirect works on both the staging URL and the live domain.     */
  /* ---------------------------------------------------------------------- */
  function initFormRedirect() {
    var field = document.querySelector("[data-next-thankyou]");
    if (!field) return;

    var path = window.location.pathname;
    var dir = path.slice(0, path.lastIndexOf("/") + 1); // strip the filename
    field.value = window.location.origin + dir + "thank-you.html";
  }
})();
