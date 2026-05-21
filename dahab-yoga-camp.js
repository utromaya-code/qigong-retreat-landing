const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (navToggle && siteNav && header) {
  const navOverlay = document.getElementById("nav-overlay");

  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (navOverlay) {
      navOverlay.classList.remove("is-open");
      navOverlay.setAttribute("aria-hidden", "true");
    }
  };

  navToggle.addEventListener("click", () => {
    const wasOpen = navToggle.getAttribute("aria-expanded") === "true";
    const nowOpen = !wasOpen;
    navToggle.setAttribute("aria-expanded", String(nowOpen));
    siteNav.classList.toggle("is-open", nowOpen);
    header.classList.toggle("is-open", nowOpen);
    document.body.classList.toggle("nav-open", nowOpen);
    if (navOverlay) {
      navOverlay.classList.toggle("is-open", nowOpen);
      navOverlay.setAttribute("aria-hidden", nowOpen ? "false" : "true");
    }
  });

  if (navOverlay) {
    navOverlay.addEventListener("click", () => {
      closeNav();
    });
  }

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
      navToggle.focus();
    }
  });
}

const navLinks = document.querySelectorAll(".site-nav a[data-nav-section]");

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", id && link.dataset.navSection === id);
  });
}

if (navLinks.length) {
  const sectionIds = [...navLinks].map((link) => link.dataset.navSection).filter(Boolean);
  let ticking = false;

  const updateNavActive = () => {
    ticking = false;
    if (window.scrollY < 48) {
      setActiveNav("");
      return;
    }

    const marker = 110;
    let current = "";

    for (let i = sectionIds.length - 1; i >= 0; i -= 1) {
      const el = document.getElementById(sectionIds[i]);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= marker) {
        current = sectionIds[i];
        break;
      }
    }

    setActiveNav(current);
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateNavActive);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateNavActive();
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 160px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const requestForm = document.getElementById("request-form");

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(requestForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const text = [
      "Здравствуйте! Хочу на йога-кэмп в Дахаб 11-21 ноября 2026.",
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      message ? `Комментарий: ${message}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://t.me/vsemaya?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

(function () {
  function updateCountdown() {
    const target = new Date("2026-11-11T00:00:00");
    const diff = target.getTime() - Date.now();
    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    if (!dEl || !hEl || !mEl) return;
    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      return;
    }
    dEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
    hEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
    mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 30000);
})();
