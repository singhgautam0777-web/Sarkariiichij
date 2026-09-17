// Sarkariiichij - Main JavaScript

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".main-nav");
const searchInput = document.querySelector("#mainSearch");
const searchBtn = document.querySelector("#searchBtn");

// Mobile Menu
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("mobile-open");
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("mobile-open");
      menuBtn.textContent = "☰";
    });
  });
}

// Search
function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchInput.focus();
    return;
  }

  const searchableItems = document.querySelectorAll(
    ".job-card, .quick-card, .feature-card, .resource-card, " +
    ".qualification-card, .department-grid a, .service-grid a, " +
    ".tools-grid a, .prep-card"
  );

  let found = false;

  searchableItems.forEach(item => {
    const text = item.textContent.toLowerCase();

    if (text.includes(query)) {
      item.style.display = "";
      item.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      item.style.outline = "3px solid #93c5fd";

      setTimeout(() => {
        item.style.outline = "";
      }, 1800);

      found = true;
      return;
    }

    item.style.display = "";
  });

  if (!found) {
    alert(
      "इस समय \"" +
      searchInput.value +
      "\" से संबंधित जानकारी उपलब्ध नहीं है।"
    );
  }
}

if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      performSearch();
    }
  });
}

// Current Year
const yearElement = document.querySelector(".footer-bottom span");

if (yearElement) {
  yearElement.textContent =
    `© ${new Date().getFullYear()} Sarkariiichij. All Rights Reserved.`;
}
