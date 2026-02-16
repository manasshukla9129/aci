/*
  ACI Single Page Website Scripts
  - Smooth scrolling (fixed navbar offset)
  - Close mobile menu on link click
  - Back-to-top button
  - Testimonials slider (Swiper)
  - Scroll animations (AOS)
  - Contact form validation (Bootstrap + custom message)
*/

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const navbar = $("#navbar");
  const backToTop = $("#backToTop");
  const yearEl = $("#year");

  // ------------------------------
  // Footer year
  // ------------------------------
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ------------------------------
  // AOS (Animate on Scroll)
  // ------------------------------
  if (window.AOS) {
    AOS.init({
      once: true,
      offset: 80,
      duration: 750,
      easing: "ease-out-cubic",
    });
  }

  // ------------------------------
  // Testimonials Slider (Swiper)
  // ------------------------------
  if (window.Swiper) {
    new Swiper(".testimonial-swiper", {
      loop: true,
      grabCursor: true,
      spaceBetween: 16,
      autoplay: {
        delay: 3800,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  // ------------------------------
  // Smooth scrolling with fixed navbar offset
  // ------------------------------
  const getNavOffset = () => {
    // Use actual rendered height (includes mobile/desktop differences)
    return navbar ? navbar.getBoundingClientRect().height : 0;
  };

  const scrollToHash = (hash) => {
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;

    const y = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset() + 2;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Intercept internal nav clicks to apply offset scrolling
  $$("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      // Only handle if a valid element exists
      if (!document.querySelector(href)) return;

      e.preventDefault();
      scrollToHash(href);

      // Update URL hash without jumping
      history.pushState(null, "", href);
    });
  });

  // If page loads with a hash, apply offset scroll once
  window.addEventListener("load", () => {
    if (window.location.hash) {
      // Small delay to ensure layout is ready
      setTimeout(() => scrollToHash(window.location.hash), 50);
    }
  });

  // ------------------------------
  // Close Bootstrap mobile menu on link click
  // ------------------------------
  const navMenu = $("#navMenu");
  if (navMenu && window.bootstrap) {
    const collapse = bootstrap.Collapse.getOrCreateInstance(navMenu, { toggle: false });
    $$(".navbar .nav-link, .navbar .btn", navMenu).forEach((el) => {
      el.addEventListener("click", () => {
        // Only close if it's currently shown (mobile state)
        if (navMenu.classList.contains("show")) collapse.hide();
      });
    });
  }

  // ------------------------------
  // Back-to-top
  // ------------------------------
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (!backToTop) return;

    if (y > 520) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ------------------------------
  // Contact Form Validation
  // ------------------------------
  const form = $("#contactForm");
  const formStatus = $("#formStatus");

  const setStatus = (msg, type = "info") => {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = "small";
    if (type === "success") formStatus.classList.add("text-success");
    else if (type === "error") formStatus.classList.add("text-danger");
    else formStatus.classList.add("text-muted");
  };

  if (form) {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Trigger Bootstrap validation UI
        form.classList.add("was-validated");

        if (!form.checkValidity()) {
          setStatus("Please fix the highlighted fields and try again.", "error");
          return;
        }

        // Client-side only (no backend). In a real app you'd POST this to an API.
        const data = Object.fromEntries(new FormData(form).entries());

        setStatus("Thanks! Your message has been recorded (demo). We will contact you soon.", "success");

        // For demo purposes, we reset the form.
        // If you connect a backend, reset after successful API call.
        form.reset();
        form.classList.remove("was-validated");

        // Optionally log data for developers
        // eslint-disable-next-line no-console
        console.log("ACI Contact Form Submission (demo):", data);
      },
      false
    );
  }
})();
