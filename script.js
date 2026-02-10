const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

function onScrollHeader() {
  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", onScrollHeader);
onScrollHeader();

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;

    faqQuestions.forEach((other) => {
      other.setAttribute("aria-expanded", "false");
      const otherAnswer = other.nextElementSibling;
      if (otherAnswer) {
        otherAnswer.style.maxHeight = "0px";
      }
    });

    button.setAttribute("aria-expanded", String(!expanded));
    if (!expanded && answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");

if (lightbox && lightboxImage && lightboxCaption) {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.dataset.image;
      const caption = item.dataset.caption || "";
      if (!src) return;

      lightboxImage.src = src;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.src = "";
  };

  lightbox.addEventListener("click", (event) => {
    if (
      event.target === lightbox ||
      event.target.classList.contains("lightbox-close")
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

const modal = document.getElementById("signup-modal");
const openModalButtons = document.querySelectorAll("[data-open-modal]");

if (modal) {
  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function updateCountdown() {
  const targetDate = new Date("2026-02-21T09:00:00+03:00");
  const now = new Date();
  const diff = targetDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("signup-form");
if (form) {
  const errors = {
    name: "Введите имя (минимум 2 символа).",
    phone: "Введите корректный телефон.",
    experience: "Выберите вариант опыта.",
    consent: "Нужно согласие на обработку данных."
  };

  const setError = (field, message = "") => {
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    const fields = form.querySelectorAll("input, select");

    fields.forEach((field) => {
      if (field.type === "checkbox") {
        if (!field.checked) {
          valid = false;
          setError(field, errors[field.name]);
        } else {
          setError(field);
        }
        return;
      }

      if (!field.checkValidity()) {
        valid = false;
        setError(field, errors[field.name] || "Проверьте поле.");
      } else {
        setError(field);
      }
    });

    if (!valid) return;

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const experience = form.elements.experience.value;

    const message = `Здравствуйте! Хочу записаться на ретрит по цигун.\nИмя: ${name}\nТелефон: ${phone}\nОпыт: ${experience}`;
    window.location.href = `https://t.me/vsemaya?text=${encodeURIComponent(message)}`;
  });

  form.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", () => setError(field));
    field.addEventListener("change", () => setError(field));
  });
}
