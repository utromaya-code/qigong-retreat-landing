const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

function onScrollHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(!expanded));
    if (answer) {
      answer.style.maxHeight = expanded ? "0px" : `${answer.scrollHeight}px`;
    }
  });
});

const form = document.getElementById("course-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const message = [
      "Здравствуйте! Хочу оставить заявку на курс «Точка опоры».",
      `Имя: ${data.get("name") || ""}`,
      `Телефон: ${data.get("phone") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Откуда узнал(а): ${data.get("source") || "-"}`,
      `Уровень: ${data.get("level") || "-"}`,
      `Запрос: ${data.get("goal") || "-"}`
    ].join("\n");

    window.location.href = `https://t.me/vsemaya?text=${encodeURIComponent(message)}`;
  });
}
