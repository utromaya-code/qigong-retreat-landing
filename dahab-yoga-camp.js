/* =============================================
   DAHAB YOGA CAMP — Main JS
   v20260524
   Features:
   - Header scroll/open state
   - Mobile nav
   - Active nav links
   - Reveal on scroll (IntersectionObserver)
   - Form → Telegram
   - Countdown timer
   - Parallax hero
   - Horizontal gallery scroll
   - Sticky urgency banner
============================================= */

// ── Header ──────────────────────────────────
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ── Mobile Nav ───────────────────────────────
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
    navOverlay.addEventListener("click", closeNav);
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

// ── Active Nav Links ─────────────────────────
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
    if (window.scrollY < 48) { setActiveNav(""); return; }
    const marker = 110;
    let current = "";
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= marker) { current = sectionIds[i]; break; }
    }
    setActiveNav(current);
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateNavActive); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateNavActive();
}

// ── Reveal on Scroll ─────────────────────────
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

// ── Telegram Form ────────────────────────────
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
    ].filter(Boolean).join("\n");
    window.open(`https://t.me/vsemaya?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

// ── Countdown Timer ───────────────────────────
(function () {
  function updateCountdown() {
    const target = new Date("2026-11-11T00:00:00");
    const diff = target.getTime() - Date.now();
    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    if (!dEl || !hEl || !mEl) return;
    if (diff <= 0) { dEl.textContent = hEl.textContent = mEl.textContent = "00"; return; }
    dEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
    hEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
    mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 30000);
})();

// ── PARALLAX HERO ─────────────────────────────
(function () {
  const heroImg = document.querySelector(".hero-image img");
  if (!heroImg) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let rafId = null;
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const scrollY = window.scrollY;
      const heroH = document.querySelector(".hero").offsetHeight;
      if (scrollY > heroH) return;
      // Move image at 40% of scroll speed = subtle depth effect
      heroImg.style.transform = `translateY(${scrollY * 0.22}px) scale(1.04)`;
    });
  }

  // Initial scale to avoid white edges during parallax
  heroImg.style.transform = "translateY(0) scale(1.04)";
  heroImg.style.willChange = "transform";
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ── HORIZONTAL GALLERY SCROLL ─────────────────
(function () {
  const gallery = document.querySelector(".gallery-h-track");
  if (!gallery) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 768) return;

  const section = gallery.closest(".gallery-h-section");
  if (!section) return;

  let rafId = null;

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;

      // progress 0→1 while section is in sticky viewport
      const progress = Math.max(0, Math.min(1, -rect.top / (sectionH - viewH)));
      const maxShift = gallery.scrollWidth - gallery.offsetWidth;
      gallery.style.transform = `translateX(${-progress * maxShift}px)`;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ── STICKY URGENCY BANNER ─────────────────────
(function () {
  // Inject banner HTML
  const banner = document.createElement("div");
  banner.id = "urgency-banner";
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <div class="urgency-inner">
      <span class="urgency-dot" aria-hidden="true"></span>
      <span class="urgency-text">
        <strong>Осталось 3 места</strong> по цене 99 000 ₽
        &nbsp;&middot;&nbsp; Старт через <span id="urgency-days">--</span> дней
      </span>
      <a class="urgency-cta" href="#request">Забронировать</a>
      <button class="urgency-close" aria-label="Закрыть баннер" title="Закрыть">&times;</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Countdown in banner
  function updateBannerDays() {
    const el = document.getElementById("urgency-days");
    if (!el) return;
    const diff = new Date("2026-11-11T00:00:00") - Date.now();
    el.textContent = diff > 0 ? Math.floor(diff / 86400000) : "0";
  }
  updateBannerDays();
  setInterval(updateBannerDays, 60000);

  // Show after scrolling past hero
  const hero = document.querySelector(".hero");
  let dismissed = false;
  let shown = false;

  function onScroll() {
    if (dismissed) return;
    const heroH = hero ? hero.offsetHeight : 400;
    if (window.scrollY > heroH * 0.7) {
      if (!shown) {
        shown = true;
        banner.classList.add("is-visible");
      }
    } else {
      if (shown) {
        shown = false;
        banner.classList.remove("is-visible");
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Close button
  banner.querySelector(".urgency-close").addEventListener("click", () => {
    dismissed = true;
    banner.classList.remove("is-visible");
    setTimeout(() => banner.remove(), 400);
  });

  // Hide on request section
  const requestSection = document.getElementById("request");
  if (requestSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        banner.classList.toggle("urgency-hidden", e.isIntersecting);
      });
    }, { threshold: 0.1 });
    obs.observe(requestSection);
  }
})();

// ── STICKY DAYS SECTION (scroll-driven photo swap) ───
(function () {
  const items = document.querySelectorAll(".pv-item");
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("pv-active");
        } else {
          entry.target.classList.remove("pv-active");
        }
      });
    },
    { threshold: 0.45 }
  );

  items.forEach((item) => observer.observe(item));
})();

// ── TEAM PHOTO HOVER ZOOM ─────────────────────
(function () {
  const teamPhotos = document.querySelectorAll(".team-photo img");
  teamPhotos.forEach((img) => {
    img.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    img.addEventListener("mouseenter", () => { img.style.transform = "scale(1.04)"; });
    img.addEventListener("mouseleave", () => { img.style.transform = "scale(1)"; });
  });
})();

// ── SMOOTH PRICE CARD HOVER ───────────────────
(function () {
  const cards = document.querySelectorAll(".price-card");
  cards.forEach((card) => {
    card.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease";
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
      card.style.boxShadow = "0 20px 48px rgba(10, 46, 48, 0.18)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
})();

// ── INCLUDED CARD HOVER ───────────────────────
(function () {
  const cards = document.querySelectorAll(".included-card");
  cards.forEach((card) => {
    card.style.transition = "background 0.25s ease, transform 0.25s ease";
    card.addEventListener("mouseenter", () => {
      card.style.background = "rgba(11, 109, 115, 0.06)";
      card.style.transform = "translateY(-2px)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "";
      card.style.transform = "";
    });
  });
})();

// ── GALLERY LIGHTBOX ─────────────────────────
(function () {
  const galleryImgs = document.querySelectorAll(".gallery-mosaic img");
  if (!galleryImgs.length) return;

  // Create lightbox
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Просмотр фото");
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close" aria-label="Закрыть">&times;</button>
    <button class="lb-prev" aria-label="Предыдущее">&#8592;</button>
    <button class="lb-next" aria-label="Следующее">&#8594;</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="">
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector(".lb-img");
  const imgs = [...galleryImgs];
  let currentIdx = 0;

  function openLb(idx) {
    currentIdx = idx;
    lbImg.src = imgs[idx].src;
    lbImg.alt = imgs[idx].alt;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }

  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function goPrev() { openLb((currentIdx - 1 + imgs.length) % imgs.length); }
  function goNext() { openLb((currentIdx + 1) % imgs.length); }

  imgs.forEach((img, i) => {
    const frame = img.closest(".media-frame");
    const target = frame || img;
    target.addEventListener("click", () => openLb(i));
  });

  lb.querySelector(".lb-backdrop").addEventListener("click", closeLb);
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-prev").addEventListener("click", goPrev);
  lb.querySelector(".lb-next").addEventListener("click", goNext);

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lb.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) { diff < 0 ? goNext() : goPrev(); }
  });
})();
