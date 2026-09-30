"use strict";

/* WhatsApp */

const phone = "5534988556437";

const whatsapp = (message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsapp(
    "Olá! Conheci o site da Afro Beauty e gostaria de saber mais sobre os serviços e horários disponíveis.",
  );
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.href = whatsapp(
    `Olá! Conheci a Afro Beauty pelo site e tenho interesse em ${link.dataset.service.toLowerCase()}. Podemos conversar sobre valores e disponibilidade?`,
  );

  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

/* Ano automático */

document.getElementById("year").textContent = new Date().getFullYear();

/* Menu mobile */

const menu = document.querySelector(".menu");
const nav = document.getElementById("nav");

function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir menu");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");

  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
  if (event.matches) {
    closeMenu();
  }
});

/* Filtros da galeria */

const cards = [...document.querySelectorAll(".gallery-card")];

const gallery = document.querySelector(".gallery");

const filters = [...document.querySelectorAll("[data-filter]")];

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filters.forEach((filter) => {
      const active = filter === button;

      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");

      card.hidden = category !== "todos" && !categories.includes(category);
    });

    gallery.classList.toggle("filtered", category !== "todos");

    const total = cards.filter((card) => !card.hidden).length;

    document.querySelector(".gallery-count").textContent =
      `${total} ${total === 1 ? "trabalho" : "trabalhos"} na seleção`;
  });
});

/* Galeria ampliada */

const dialog = document.querySelector(".lightbox");
const photo = dialog.querySelector("img");

let selection = [];
let current = 0;
let sourceButton;

function showPhoto() {
  const card = selection[current];
  const img = card.querySelector("img");

  photo.src = img.src;
  photo.alt = img.alt;

  photo.classList.remove("zoomed");

  document.getElementById("photo-title").textContent = card.dataset.title;

  document.getElementById("photo-count").textContent =
    `${current + 1} / ${selection.length}`;
}

function changePhoto(step) {
  current = (current + step + selection.length) % selection.length;

  showPhoto();
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    selection = cards.filter((item) => !item.hidden);
    current = selection.indexOf(card);
    sourceButton = card;

    showPhoto();
    dialog.showModal();

    document.body.classList.add("locked");
  });
});

dialog.querySelector(".close").addEventListener("click", () => {
  dialog.close();
});

dialog.querySelector(".previous").addEventListener("click", () => {
  changePhoto(-1);
});

dialog.querySelector(".next").addEventListener("click", () => {
  changePhoto(1);
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("locked");

  sourceButton?.focus({
    preventScroll: true,
  });
});

/* Fecha ao clicar fora da janela */

dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) {
    return;
  }

  const box = dialog.getBoundingClientRect();

  const outside =
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom;

  if (outside) {
    dialog.close();
  }
});

/* Navegação pelo teclado */

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    changePhoto(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    changePhoto(1);
  }
});

/* Ampliação no computador */

photo.addEventListener("dblclick", () => {
  photo.classList.toggle("zoomed");
});

/* Gestos no celular */

let touchX = 0;
let touchY = 0;
let lastTap = 0;

photo.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length === 1) {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    }
  },
  { passive: true },
);

photo.addEventListener(
  "touchend",
  (event) => {
    const dx = event.changedTouches[0].clientX - touchX;

    const dy = event.changedTouches[0].clientY - touchY;

    const horizontalSwipe = Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy);

    if (horizontalSwipe) {
      changePhoto(dx < 0 ? 1 : -1);
      lastTap = 0;
      return;
    }

    const now = Date.now();

    const tap = Math.abs(dx) < 10 && Math.abs(dy) < 10;

    if (tap) {
      if (now - lastTap < 300) {
        photo.classList.toggle("zoomed");
      }

      lastTap = now;
    }
  },
  { passive: true },
);

/* Inspiração personalizada */

const descriptions = {
  Autêntica: "Tranças e detalhes que colocam sua identidade em primeiro plano.",

  Marcante:
    "Uma maquiagem expressiva ou um penteado para acompanhar uma ocasião especial.",

  Delicada:
    "Uma inspiração suave, com detalhes que valorizam sua beleza de forma sutil.",
};

const moods = [...document.querySelectorAll("[data-mood]")];

function selectMood(button) {
  moods.forEach((item) => {
    const active = item === button;

    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });

  const mood = button.dataset.mood;

  document.getElementById("mood-copy").textContent = descriptions[mood];

  document.getElementById("mood-link").href = whatsapp(
    `Olá! Vi o site da Afro Beauty e escolhi a inspiração "${mood}". Gostaria de conversar sobre um visual nesse estilo e consultar horários.`,
  );
}

moods.forEach((button) => {
  button.addEventListener("click", () => {
    selectMood(button);
  });
});

selectMood(moods[0]);
/* Substitui os símbolos por ícones SVG */
const svgIcon = (path) => `
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="${path}"/>
  </svg>
`;

document.querySelectorAll(".gallery-card b").forEach((icon) => {
  icon.innerHTML = svgIcon("M12 5v14M5 12h14");
});

dialog.querySelector(".close").innerHTML = svgIcon("M6 6l12 12M18 6 6 18");

dialog.querySelector(".previous").innerHTML = svgIcon("m15 5-7 7 7 7");

dialog.querySelector(".next").innerHTML = svgIcon("m9 5 7 7-7 7");

document.querySelectorAll(".faq summary").forEach((summary) => {
  summary.insertAdjacentHTML(
    "beforeend",
    `
      <svg
        class="faq-toggle"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 12h14"/>
        <path class="vertical" d="M12 5v14"/>
      </svg>
    `,
  );
});
