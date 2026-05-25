const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const mobileCta = document.getElementById("mobile-cta");

function updateHeader() {
  const isScrolled = window.scrollY > 18;
  if (header) header.classList.toggle("is-scrolled", isScrolled);
  if (mobileCta) mobileCta.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (navToggle && siteNav && header) {
  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", () => {
    const opened = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!opened));
    siteNav.classList.toggle("is-open", !opened);
    header.classList.toggle("is-open", !opened);
    document.body.classList.toggle("nav-open", !opened);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const navTargets = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navTargets.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
  );

  navTargets.forEach((target) => activeObserver.observe(target));
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 140px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = {
  route: document.getElementById("route-panel"),
  practice: document.getElementById("practice-panel")
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const active = button.dataset.tab;

    tabButtons.forEach((item) => {
      const selected = item.dataset.tab === active;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    Object.entries(tabPanels).forEach(([key, panel]) => {
      if (!panel) return;
      const selected = key === active;
      panel.classList.toggle("is-active", selected);
      panel.hidden = !selected;
    });
  });
});

function updateCountdown() {
  const target = new Date("2026-11-11T00:00:00+03:00").getTime();
  const diff = target - Date.now();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");

  if (!daysEl || !hoursEl || !minsEl) return;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minsEl.textContent = String(mins).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 30000);

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

const galleryImages = document.querySelectorAll(".gallery-track img");

if (galleryImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Просмотр фотографии");
  lightbox.innerHTML = '<button type="button" aria-label="Закрыть">×</button><img alt="">';
  document.body.appendChild(lightbox);

  const lightboxButton = lightbox.querySelector("button");
  const lightboxImage = lightbox.querySelector("img");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    lightboxImage.src = "";
  };

  galleryImages.forEach((image) => {
    image.addEventListener("click", () => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightboxButton.focus();
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightboxButton) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}
