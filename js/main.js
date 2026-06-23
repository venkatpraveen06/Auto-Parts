(() => {
  const body = document.body;
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  const backToTopBtn = document.querySelector("[data-back-top]");
  const quickSearchForm = document.querySelector("[data-quick-search]");
  const revealItems = document.querySelectorAll(".reveal");
  const counterNodes = document.querySelectorAll(".counter");
  const faqQuestions = document.querySelectorAll(".faq-question");
  const yearNode = document.querySelector("[data-year]");

  // Fade in each page once everything is ready.
  window.addEventListener("DOMContentLoaded", () => {
    body.classList.add("page-ready");
  });

  // Update copyright year automatically.
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  // Mobile menu.
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Back to top visibility.
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      const shouldShow = window.scrollY > 420;
      backToTopBtn.classList.toggle("show", shouldShow);
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll reveal animations.
  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  // Counter animation for KPI blocks.
  if (counterNodes.length) {
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    counterNodes.forEach((counter) => countObserver.observe(counter));
  }

  function animateCounter(node) {
    const target = Number(node.dataset.target || 0);
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      node.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }

  // FAQ accordion interaction.
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove("open");
      });

      item.classList.toggle("open", !isOpen);
    });
  });

  // Quick search CTA redirects to order page with prefill hint.
  if (quickSearchForm) {
    quickSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = quickSearchForm.querySelector("input");
      const rawTerm = input ? input.value.trim() : "";
      const query = encodeURIComponent(rawTerm);
      const targetUrl = rawTerm
        ? `order-request.html?part=${query}`
        : "order-request.html";
      window.location.href = targetUrl;
    });
  }

  // Smooth cross-page transitions for local links.
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("https://wa.me") ||
      link.target === "_blank"
    ) {
      return;
    }

    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      if (!sameOrigin) return;

      event.preventDefault();
      body.classList.add("page-leaving");
      setTimeout(() => {
        window.location.href = url.href;
      }, 220);
    });
  });
})();
