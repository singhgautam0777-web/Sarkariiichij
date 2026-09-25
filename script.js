/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 1
   Core System + DOM Helpers + Mobile Menu + Modal
   ========================================================= */

"use strict";

/* ---------- GLOBAL APP OBJECT ---------- */

const SarkariiChij = {
  version: "1.0.0",
  storagePrefix: "sarkariiichij_",

  state: {
    menuOpen: false,
    modalOpen: false,
    notificationOpen: false,
    currentSearch: "",
    currentYear: new Date().getFullYear()
  }
};

/* ---------- DOM HELPERS ---------- */

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function getElement(id) {
  return document.getElementById(id);
}

function exists(selector, parent = document) {
  return !!$(selector, parent);
}

/* ---------- STORAGE ---------- */

function storageKey(key) {
  return SarkariiChij.storagePrefix + key;
}

function saveData(key, value) {
  try {
    localStorage.setItem(
      storageKey(key),
      JSON.stringify(value)
    );
    return true;
  } catch (error) {
    console.error("Storage save error:", error);
    return false;
  }
}

function getData(key, fallback = null) {
  try {
    const value = localStorage.getItem(storageKey(key));

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error("Storage read error:", error);
    return fallback;
  }
}

function removeData(key) {
  try {
    localStorage.removeItem(storageKey(key));
    return true;
  } catch (error) {
    console.error("Storage remove error:", error);
    return false;
  }
}

/* ---------- SAFE TEXT ---------- */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------- PAGE NAVIGATION ---------- */

function goToPage(page) {
  if (!page) {
    return;
  }

  window.location.href = page;
}

function goToSection(id) {
  if (!id) {
    return;
  }

  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  history.replaceState(null, "", "#" + id);
}

/* ---------- MOBILE MENU ---------- */

function openMobileMenu() {
  SarkariiChij.state.menuOpen = true;

  const sidebar =
    $(".mobile-sidebar") ||
    getElement("mobileSidebar");

  const overlay =
    $(".mobile-menu-overlay") ||
    getElement("mobileMenuOverlay");

  if (sidebar) {
    sidebar.classList.add("active");
  }

  if (overlay) {
    overlay.classList.add("active");
  }

  document.body.classList.add("menu-open");
}

function closeMobileMenu() {
  SarkariiChij.state.menuOpen = false;

  const sidebar =
    $(".mobile-sidebar") ||
    getElement("mobileSidebar");

  const overlay =
    $(".mobile-menu-overlay") ||
    getElement("mobileMenuOverlay");

  if (sidebar) {
    sidebar.classList.remove("active");
  }

  if (overlay) {
    overlay.classList.remove("active");
  }

  document.body.classList.remove("menu-open");
}

function toggleMobileMenu() {
  if (SarkariiChij.state.menuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/* ---------- MODAL ---------- */

function openModal(content = "", title = "") {
  const modal =
    $(".modal") ||
    getElement("globalModal");

  if (!modal) {
    return;
  }

  const titleElement =
    $(".modal-header h2", modal) ||
    $(".modal-title", modal);

  const bodyElement =
    $(".modal-body", modal) ||
    $(".modal-content-body", modal);

  if (titleElement && title) {
    titleElement.textContent = title;
  }

  if (bodyElement) {
    bodyElement.innerHTML = content;
  }

  modal.classList.add("active");
  SarkariiChij.state.modalOpen = true;

  document.body.classList.add("modal-open");
}

function closeModal() {
  const modal =
    $(".modal") ||
    getElement("globalModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  SarkariiChij.state.modalOpen = false;

  document.body.classList.remove("modal-open");
}

/* ---------- MODAL EVENTS ---------- */

function setupModalEvents() {
  const modal =
    $(".modal") ||
    getElement("globalModal");

  if (!modal) {
    return;
  }

  const closeButtons = $$(
    ".modal-close, [data-close-modal]",
    modal
  );

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

/* ---------- MOBILE MENU EVENTS ---------- */

function setupMobileMenu() {
  const menuButtons = $$(
    ".menu-toggle, [data-menu-toggle]"
  );

  menuButtons.forEach((button) => {
    button.addEventListener("click", toggleMobileMenu);
  });

  const closeButtons = $$(
    ".mobile-close, [data-menu-close]"
  );

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeMobileMenu);
  });

  const overlay =
    $(".mobile-menu-overlay") ||
    getElement("mobileMenuOverlay");

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeMobileMenu
    );
  }

  $$(".mobile-sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });
}

/* ---------- ESCAPE KEY ---------- */

function setupKeyboardEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (SarkariiChij.state.menuOpen) {
      closeMobileMenu();
    }

    if (SarkariiChij.state.modalOpen) {
      closeModal();
    }

    if (SarkariiChij.state.notificationOpen) {
      closeNotifications();
    }
  });
}

/* ---------- NOTIFICATIONS ---------- */

function openNotifications() {
  const panel =
    $(".notification-panel") ||
    getElement("notificationPanel");

  if (!panel) {
    return;
  }

  panel.classList.add("active");
  SarkariiChij.state.notificationOpen = true;
}

function closeNotifications() {
  const panel =
    $(".notification-panel") ||
    getElement("notificationPanel");

  if (!panel) {
    return;
  }

  panel.classList.remove("active");
  SarkariiChij.state.notificationOpen = false;
}

function toggleNotifications() {
  if (SarkariiChij.state.notificationOpen) {
    closeNotifications();
  } else {
    openNotifications();
  }
}

/* ---------- NOTIFICATION EVENTS ---------- */

function setupNotificationEvents() {
  const buttons = $$(
    ".notification-button, [data-notification-toggle]"
  );

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        toggleNotifications();
      }
    );
  });

  document.addEventListener("click", (event) => {
    const panel = $(".notification-panel");

    if (!panel) {
      return;
    }

    if (
      !panel.contains(event.target) &&
      !event.target.closest(
        ".notification-button, [data-notification-toggle]"
      )
    ) {
      closeNotifications();
    }
  });
}

/* ---------- YEAR ---------- */

function setCurrentYear() {
  const year = new Date().getFullYear();

  $$(".current-year, #currentYear").forEach(
    (element) => {
      element.textContent = year;
    }
  );
}

/* ---------- INITIALIZATION ---------- */

function initializeSarkariiChij() {
  setupMobileMenu();
  setupModalEvents();
  setupNotificationEvents();
  setupKeyboardEvents();
  setCurrentYear();

  console.log(
    "SarkariiChij loaded successfully — v" +
      SarkariiChij.version
  );
}

/* ---------- DOM READY ---------- */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeSarkariiChij
  );
} else {
  initializeSarkariiChij();
}

/* ---------- END PART 1 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 2
   Global Search + Search Results + Filters
   ========================================================= */

/* ---------- SEARCH DATABASE ---------- */

const searchDatabase = [
  {
    title: "Government Jobs",
    keywords: "job jobs sarkari naukri government vacancy recruitment",
    url: "jobs.html",
    category: "Jobs"
  },
  {
    title: "SSC Jobs",
    keywords: "ssc cgl chsl mts gd cpo stenographer ssc",
    url: "jobs.html?department=SSC",
    category: "Jobs"
  },
  {
    title: "Railway Jobs",
    keywords: "railway rrb rrc ntpc group d alp technician railway job",
    url: "jobs.html?department=Railway",
    category: "Jobs"
  },
  {
    title: "Banking Jobs",
    keywords: "bank ibps sbi rbi nabard sebi banking",
    url: "jobs.html?department=Banking",
    category: "Jobs"
  },
  {
    title: "India Post / GDS",
    keywords: "post office gds india post dak sevak postal",
    url: "jobs.html?department=India%20Post",
    category: "Jobs"
  },
  {
    title: "Defence Jobs",
    keywords: "army navy air force defence drdo isro icg coast guard",
    url: "jobs.html?department=Defence",
    category: "Jobs"
  },
  {
    title: "Police & CAPF Jobs",
    keywords: "police crpf bsff cisf itbp ssb capf assam rifles",
    url: "jobs.html?department=Police",
    category: "Jobs"
  },
  {
    title: "Teaching Jobs",
    keywords: "teacher teaching ctet tet kvs nvs school teacher",
    url: "jobs.html?department=Teaching",
    category: "Jobs"
  },
  {
    title: "UP Government Jobs",
    keywords: "up upsssc uppsc uttar pradesh government",
    url: "jobs.html?state=Uttar%20Pradesh",
    category: "State Jobs"
  },
  {
    title: "Admission",
    keywords: "admission college university course ug pg diploma",
    url: "admission.html",
    category: "Education"
  },
  {
    title: "Results",
    keywords: "result results exam result university result",
    url: "results.html",
    category: "Results"
  },
  {
    title: "Admit Card",
    keywords: "admit card hall ticket exam card",
    url: "admit-card.html",
    category: "Exam"
  },
  {
    title: "Syllabus",
    keywords: "syllabus exam pattern subject topics",
    url: "syllabus.html",
    category: "Exam"
  },
  {
    title: "Cut Off",
    keywords: "cutoff cut off merit marks qualifying",
    url: "cutoff.html",
    category: "Exam"
  },
  {
    title: "Previous Year Papers",
    keywords: "previous paper pyq question paper old paper",
    url: "papers.html",
    category: "Study"
  },
  {
    title: "Scholarship",
    keywords: "scholarship student scholarship fee financial aid",
    url: "scholarship.html",
    category: "Education"
  },
  {
    title: "Sarkari Yojana",
    keywords: "yojana scheme government scheme pm scheme welfare",
    url: "yojana.html",
    category: "Government"
  },
  {
    title: "Sarkari Kaam",
    keywords: "sarkari kaam certificate income caste domicile ews online service",
    url: "sarkari-kaam.html",
    category: "Services"
  },
  {
    title: "Career Tools",
    keywords: "calculator age percentage cgpa career tool",
    url: "career-tools.html",
    category: "Tools"
  },
  {
    title: "Eligibility Checker",
    keywords: "eligibility age qualification eligible checker",
    url: "eligibility.html",
    category: "Tools"
  },
  {
    title: "Mock Test",
    keywords: "mock test quiz practice exam test",
    url: "mock-test.html",
    category: "Preparation"
  }
];

/* ---------- NORMALIZE SEARCH ---------- */

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/* ---------- SEARCH ---------- */

function searchSite(query, limit = 10) {
  const normalized = normalizeSearch(query);

  if (!normalized) {
    return [];
  }

  const words = normalized.split(" ");

  const results = searchDatabase
    .map((item) => {
      const title = normalizeSearch(item.title);
      const keywords = normalizeSearch(item.keywords);

      let score = 0;

      if (title === normalized) {
        score += 100;
      }

      if (title.includes(normalized)) {
        score += 50;
      }

      if (keywords.includes(normalized)) {
        score += 35;
      }

      words.forEach((word) => {
        if (title.includes(word)) {
          score += 12;
        }

        if (keywords.includes(word)) {
          score += 5;
        }
      });

      return {
        ...item,
        score
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/* ---------- RENDER SEARCH RESULTS ---------- */

function renderSearchResults(results, container) {
  if (!container) {
    return;
  }

  if (!results.length) {
    container.innerHTML = `
      <div class="no-data">
        No matching result found.
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map((item) => {
      return `
        <a
          class="search-result-item"
          href="${escapeHTML(item.url)}"
        >
          <strong>${escapeHTML(item.title)}</strong>
          <span>${escapeHTML(item.category)}</span>
        </a>
      `;
    })
    .join("");
}

/* ---------- SEARCH INPUT ---------- */

function handleSearchInput(input) {
  if (!input) {
    return;
  }

  const query = normalizeSearch(input.value);

  SarkariiChij.state.currentSearch = query;

  const wrapper =
    input.closest(".global-search") ||
    input.parentElement;

  if (!wrapper) {
    return;
  }

  let resultsBox =
    $(".search-results", wrapper);

  if (!resultsBox) {
    resultsBox = document.createElement("div");
    resultsBox.className = "search-results";
    wrapper.appendChild(resultsBox);
  }

  if (!query) {
    resultsBox.innerHTML = "";
    resultsBox.classList.remove("active");
    return;
  }

  const results = searchSite(query);

  renderSearchResults(results, resultsBox);
  resultsBox.classList.add("active");
}

/* ---------- SEARCH FORM ---------- */

function submitSearch(input) {
  if (!input) {
    return;
  }

  const query = normalizeSearch(input.value);

  if (!query) {
    return;
  }

  const results = searchSite(query, 1);

  if (results.length) {
    window.location.href = results[0].url;
    return;
  }

  const searchUrl =
    "jobs.html?search=" +
    encodeURIComponent(query);

  window.location.href = searchUrl;
}

/* ---------- SEARCH EVENTS ---------- */

function setupSearch() {
  const inputs = $$(
    ".global-search input[type='search'], " +
    ".global-search input[name='search'], " +
    ".global-search input[type='text'], " +
    "[data-global-search]"
  );

  inputs.forEach((input) => {
    input.addEventListener(
      "input",
      () => handleSearchInput(input)
    );

    input.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitSearch(input);
        }

        if (event.key === "Escape") {
          const wrapper =
            input.closest(".global-search") ||
            input.parentElement;

          const resultsBox =
            wrapper &&
            $(".search-results", wrapper);

          if (resultsBox) {
            resultsBox.classList.remove("active");
          }
        }
      }
    );
  });

  $$(".global-search form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input =
        $("input", form);

      submitSearch(input);
    });
  });

  document.addEventListener("click", (event) => {
    if (
      event.target.closest(".global-search")
    ) {
      return;
    }

    $$(".search-results").forEach(
      (box) => {
        box.classList.remove("active");
      }
    );
  });
}

/* ---------- URL QUERY ---------- */

function getQueryParams() {
  const params = new URLSearchParams(
    window.location.search
  );

  const data = {};

  params.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

function getQueryParam(name) {
  const params = new URLSearchParams(
    window.location.search
  );

  return params.get(name);
}

/* ---------- APPLY URL SEARCH ---------- */

function applyUrlSearch() {
  const query = getQueryParam("search");

  if (!query) {
    return;
  }

  const inputs = $$(
    ".global-search input"
  );

  inputs.forEach((input) => {
    input.value = query;
  });

  SarkariiChij.state.currentSearch =
    normalizeSearch(query);
}

/* ---------- FILTER HELPERS ---------- */

function filterItems(items, filters = {}) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter((item) => {
    return Object.keys(filters).every(
      (key) => {
        const filterValue =
          normalizeSearch(filters[key]);

        if (!filterValue) {
          return true;
        }

        const itemValue =
          normalizeSearch(item[key]);

        return itemValue.includes(
          filterValue
        );
      }
    );
  });
}

/* ---------- SELECT FILTER ---------- */

function applySelectFilter(
  select,
  items,
  field
) {
  if (!select || !Array.isArray(items)) {
    return items;
  }

  const value =
    normalizeSearch(select.value);

  if (!value) {
    return items;
  }

  return items.filter((item) => {
    return normalizeSearch(
      item[field]
    ).includes(value);
  });
}

/* ---------- RESET FILTERS ---------- */

function resetFilters(container) {
  if (!container) {
    return;
  }

  $$("input, select", container)
    .forEach((element) => {
      if (
        element.tagName === "SELECT"
      ) {
        element.selectedIndex = 0;
      } else {
        element.value = "";
      }
    });
}

/* ---------- SEARCH INIT ---------- */

function initializeSearchSystem() {
  setupSearch();
  applyUrlSearch();
}

/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitialize =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitialize();

  initializeSearchSystem();
};

/* ---------- END PART 2 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 3
   Saved Jobs + Reminders + Application Tracker
   ========================================================= */

/* ---------- SAVED JOBS ---------- */

function getSavedJobs() {
  return getData("saved_jobs", []);
}

function isJobSaved(jobId) {
  if (!jobId) {
    return false;
  }

  const jobs = getSavedJobs();

  return jobs.some(
    (job) => String(job.id) === String(jobId)
  );
}

function saveJob(job) {
  if (!job || !job.id) {
    return false;
  }

  const jobs = getSavedJobs();

  const alreadySaved = jobs.some(
    (item) =>
      String(item.id) === String(job.id)
  );

  if (alreadySaved) {
    return false;
  }

  jobs.push({
    id: job.id,
    title: job.title || "Government Job",
    department: job.department || "",
    qualification: job.qualification || "",
    lastDate: job.lastDate || "",
    url: job.url || "jobs.html",
    savedAt: new Date().toISOString()
  });

  saveData("saved_jobs", jobs);

  updateSavedJobUI();

  showToast("Job saved successfully.");

  return true;
}

function removeSavedJob(jobId) {
  if (!jobId) {
    return false;
  }

  const jobs = getSavedJobs();

  const filtered = jobs.filter(
    (job) =>
      String(job.id) !== String(jobId)
  );

  saveData("saved_jobs", filtered);

  updateSavedJobUI();

  showToast("Job removed from saved jobs.");

  return true;
}

function toggleSavedJob(job) {
  if (!job || !job.id) {
    return;
  }

  if (isJobSaved(job.id)) {
    removeSavedJob(job.id);
  } else {
    saveJob(job);
  }
}

/* ---------- SAVED JOB UI ---------- */

function updateSavedJobUI() {
  const jobs = getSavedJobs();

  $$(".save-btn, [data-save-job]").forEach(
    (button) => {
      const id =
        button.dataset.jobId ||
        button.getAttribute("data-job-id");

      if (!id) {
        return;
      }

      if (isJobSaved(id)) {
        button.classList.add("saved");
        button.textContent =
          button.dataset.savedText ||
          "✓ Saved";
      } else {
        button.classList.remove("saved");
        button.textContent =
          button.dataset.saveText ||
          "♡ Save Job";
      }
    }
  );

  $$(".saved-count").forEach(
    (element) => {
      element.textContent = jobs.length;
    }
  );
}

/* ---------- SAVED JOB EVENTS ---------- */

function setupSavedJobEvents() {
  document.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          ".save-btn, [data-save-job]"
        );

      if (!button) {
        return;
      }

      event.preventDefault();

      const id =
        button.dataset.jobId ||
        button.getAttribute("data-job-id");

      const title =
        button.dataset.jobTitle ||
        button.getAttribute("data-job-title") ||
        "Government Job";

      const department =
        button.dataset.department || "";

      const qualification =
        button.dataset.qualification || "";

      const lastDate =
        button.dataset.lastDate || "";

      const url =
        button.dataset.url || "jobs.html";

      toggleSavedJob({
        id,
        title,
        department,
        qualification,
        lastDate,
        url
      });

      updateSavedJobUI();
    }
  );

  updateSavedJobUI();
}

/* ---------- RENDER SAVED JOBS ---------- */

function renderSavedJobs(container) {
  if (!container) {
    return;
  }

  const jobs = getSavedJobs();

  if (!jobs.length) {
    container.innerHTML = `
      <div class="saved-empty">
        <p>No saved jobs yet.</p>
        <a href="jobs.html" class="btn btn-primary">
          Browse Government Jobs
        </a>
      </div>
    `;

    return;
  }

  container.innerHTML = jobs
    .map(
      (job) => `
        <div class="tracker-item saved-job-item">
          <div class="tracker-info">
            <h3>${escapeHTML(job.title)}</h3>
            <p>
              ${escapeHTML(job.department || "Government")}
              ${job.qualification
                ? " • " +
                  escapeHTML(job.qualification)
                : ""}
            </p>

            ${
              job.lastDate
                ? `
                  <p>
                    Last Date:
                    ${escapeHTML(job.lastDate)}
                  </p>
                `
                : ""
            }
          </div>

          <div class="job-actions">
            <a
              href="${escapeHTML(job.url)}"
              class="btn btn-primary btn-sm"
            >
              View
            </a>

            <button
              type="button"
              class="btn btn-light btn-sm"
              data-remove-saved-job="${escapeHTML(
                job.id
              )}"
            >
              Remove
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

/* ---------- REMOVE SAVED JOB EVENTS ---------- */

function setupSavedJobRemoveEvents() {
  document.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          "[data-remove-saved-job]"
        );

      if (!button) {
        return;
      }

      const id =
        button.getAttribute(
          "data-remove-saved-job"
        );

      removeSavedJob(id);

      const container =
        button.closest(
          ".saved-jobs-container"
        );

      if (container) {
        renderSavedJobs(container);
      }
    }
  );
}

/* ---------- REMINDERS ---------- */

function getReminders() {
  return getData("reminders", []);
}

function createReminder(reminder) {
  if (!reminder) {
    return false;
  }

  const reminders = getReminders();

  const item = {
    id:
      reminder.id ||
      "reminder_" +
        Date.now(),
    title:
      reminder.title ||
      "Government Job Reminder",
    date:
      reminder.date || "",
    time:
      reminder.time || "",
    type:
      reminder.type || "job",
    note:
      reminder.note || "",
    createdAt:
      new Date().toISOString()
  };

  reminders.push(item);

  saveData("reminders", reminders);

  showToast("Reminder saved.");

  return item;
}

function removeReminder(id) {
  const reminders = getReminders();

  const filtered =
    reminders.filter(
      (item) =>
        String(item.id) !== String(id)
    );

  saveData("reminders", filtered);

  showToast("Reminder removed.");
}

/* ---------- REMINDER UI ---------- */

function renderReminders(container) {
  if (!container) {
    return;
  }

  const reminders = getReminders();

  if (!reminders.length) {
    container.innerHTML = `
      <div class="saved-empty">
        No reminders created yet.
      </div>
    `;

    return;
  }

  container.innerHTML = reminders
    .map(
      (item) => `
        <div class="reminder-item">
          <div>
            <h4>${escapeHTML(item.title)}</h4>

            <p>
              ${escapeHTML(item.date || "")}
              ${
                item.time
                  ? " • " +
                    escapeHTML(item.time)
                  : ""
              }
            </p>

            ${
              item.note
                ? `
                  <p>
                    ${escapeHTML(item.note)}
                  </p>
                `
                : ""
            }
          </div>

          <button
            type="button"
            class="btn btn-light btn-sm"
            data-remove-reminder="${escapeHTML(
              item.id
            )}"
          >
            Remove
          </button>
        </div>
      `
    )
    .join("");
}

/* ---------- REMINDER EVENTS ---------- */

function setupReminderEvents() {
  document.addEventListener(
    "click",
    (event) => {
      const removeButton =
        event.target.closest(
          "[data-remove-reminder]"
        );

      if (removeButton) {
        const id =
          removeButton.getAttribute(
            "data-remove-reminder"
          );

        removeReminder(id);

        const container =
          removeButton.closest(
            ".reminder-list"
          );

        if (container) {
          renderReminders(container);
        }

        return;
      }

      const createButton =
        event.target.closest(
          "[data-create-reminder]"
        );

      if (!createButton) {
        return;
      }

      const id =
        createButton.dataset.jobId ||
        "reminder_" + Date.now();

      const title =
        createButton.dataset.title ||
        "Government Job Reminder";

      const date =
        createButton.dataset.date || "";

      createReminder({
        id,
        title,
        date
      });

      const container =
        $(".reminder-list");

      if (container) {
        renderReminders(container);
      }
    }
  );

  $$(".reminder-list").forEach(
    (container) => {
      renderReminders(container);
    }
  );
}

/* ---------- APPLICATION TRACKER ---------- */

function getApplications() {
  return getData(
    "application_tracker",
    []
  );
}

function saveApplication(application) {
  if (!application) {
    return false;
  }

  const applications =
    getApplications();

  const item = {
    id:
      application.id ||
      "application_" +
        Date.now(),

    title:
      application.title ||
      "Government Job",

    department:
      application.department || "",

    applicationDate:
      application.applicationDate ||
      "",

    examDate:
      application.examDate || "",

    status:
      application.status ||
      "Applied",

    note:
      application.note || "",

    url:
      application.url || "jobs.html",

    updatedAt:
      new Date().toISOString()
  };

  applications.push(item);

  saveData(
    "application_tracker",
    applications
  );

  showToast(
    "Application added to tracker."
  );

  return item;
}

/* ---------- UPDATE APPLICATION ---------- */

function updateApplicationStatus(
  id,
  status
) {
  const applications =
    getApplications();

  const updated =
    applications.map((item) => {
      if (
        String(item.id) ===
        String(id)
      ) {
        return {
          ...item,
          status,
          updatedAt:
            new Date().toISOString()
        };
      }

      return item;
    });

  saveData(
    "application_tracker",
    updated
  );

  showToast(
    "Application status updated."
  );
}

/* ---------- REMOVE APPLICATION ---------- */

function removeApplication(id) {
  const applications =
    getApplications();

  const filtered =
    applications.filter(
      (item) =>
        String(item.id) !==
        String(id)
    );

  saveData(
    "application_tracker",
    filtered
  );

  showToast(
    "Application removed."
  );
}

/* ---------- RENDER APPLICATIONS ---------- */

function renderApplications(
  container
) {
  if (!container) {
    return;
  }

  const applications =
    getApplications();

  if (!applications.length) {
    container.innerHTML = `
      <div class="saved-empty">
        <p>No applications added yet.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    applications
      .map(
        (item) => `
          <div class="tracker-item">
            <div class="tracker-info">
              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <p>
                ${escapeHTML(
                  item.department ||
                    "Government"
                )}
              </p>

              ${
                item.applicationDate
                  ? `
                    <p>
                      Applied:
                      ${escapeHTML(
                        item.applicationDate
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                item.examDate
                  ? `
                    <p>
                      Exam:
                      ${escapeHTML(
                        item.examDate
                      )}
                    </p>
                  `
                  : ""
              }
            </div>

            <div>
              <span class="tracker-status
                ${
                  item.status ===
                  "Completed"
                    ? "status-completed"
                    : item.status ===
                      "Upcoming"
                    ? "status-upcoming"
                    : "status-pending"
                }">
                ${escapeHTML(
                  item.status
                )}
              </span>

              <button
                type="button"
                class="btn btn-light btn-sm"
                data-remove-application="${escapeHTML(
                  item.id
                )}"
              >
                Remove
              </button>
            </div>
          </div>
        `
      )
      .join("");
}

/* ---------- TRACKER EVENTS ---------- */

function setupApplicationTracker() {
  document.addEventListener(
    "click",
    (event) => {
      const removeButton =
        event.target.closest(
          "[data-remove-application]"
        );

      if (removeButton) {
        const id =
          removeButton.getAttribute(
            "data-remove-application"
          );

        removeApplication(id);

        const container =
          removeButton.closest(
            ".application-tracker"
          );

        if (container) {
          renderApplications(
            container
          );
        }

        return;
      }

      const addButton =
        event.target.closest(
          "[data-add-application]"
        );

      if (!addButton) {
        return;
      }

      saveApplication({
        id:
          addButton.dataset.jobId,

        title:
          addButton.dataset.title,

        department:
          addButton.dataset.department,

        applicationDate:
          addButton.dataset.applicationDate,

        examDate:
          addButton.dataset.examDate,

        status:
          addButton.dataset.status ||
          "Applied",

        url:
          addButton.dataset.url
      });

      const container =
        $(".application-tracker");

      if (container) {
        renderApplications(
          container
        );
      }
    }
  );

  $$(".application-tracker")
    .forEach((container) => {
      renderApplications(container);
    });
}

/* ---------- TOAST ---------- */

function showToast(message) {
  if (!message) {
    return;
  }

  let container =
    $(".toast-container");

  if (!container) {
    container =
      document.createElement("div");

    container.className =
      "toast-container";

    document.body.appendChild(
      container
    );
  }

  const toast =
    document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();

    if (!container.children.length) {
      container.remove();
    }
  }, 3000);
}

/* ---------- END PART 3 ---------- */
/* =========================================================
   SCRIPT.JS — PART 4
   Back To Top + FAQ + Validation + System Initialization
   ========================================================= */


/* ---------- BACK TO TOP ---------- */

function setupBackToTop() {
    const button =
        document.getElementById("backToTop") ||
        document.querySelector(".back-to-top");

    if (!button) return;

    function updateBackToTop() {
        if (window.scrollY > 400) {
            button.classList.add("show");
            button.style.display = "flex";
        } else {
            button.classList.remove("show");
            button.style.display = "none";
        }
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    button.addEventListener("click", function (event) {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateBackToTop();
}


/* ---------- FAQ ACCORDION ---------- */

function setupFAQ() {
    const faqItems = $$(".faq-item");

    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
        const question =
            item.querySelector(".faq-question") ||
            item.querySelector(".faq-header") ||
            item.querySelector("button");

        const answer =
            item.querySelector(".faq-answer") ||
            item.querySelector(".faq-content");

        if (!question || !answer) return;

        question.setAttribute("role", "button");
        question.setAttribute("tabindex", "0");

        question.addEventListener("click", function () {
            const isOpen = item.classList.contains("active");

            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer") ||
                    otherItem.querySelector(".faq-content");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.style.display = "none";
                }
            });

            if (!isOpen) {
                item.classList.add("active");
                answer.style.display = "block";
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });

        question.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                question.click();
            }
        });

        if (!item.classList.contains("active")) {
            answer.style.display = "none";
        }
    });
}


/* ---------- CONFIRMATION HELPER ---------- */

function confirmAction(message, callback) {
    const text =
        message ||
        "Are you sure you want to continue?";

    if (window.confirm(text)) {
        if (typeof callback === "function") {
            callback();
        }

        return true;
    }

    return false;
}


/* ---------- FORM VALIDATION ---------- */

function validateRequiredFields(form) {
    if (!form) return false;

    const requiredFields = form.querySelectorAll(
        "[required]"
    );

    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(function (field) {
        const value = String(field.value || "").trim();

        if (!value) {
            isValid = false;

            field.classList.add("input-error");

            if (!firstInvalid) {
                firstInvalid = field;
            }
        } else {
            field.classList.remove("input-error");
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();

        showToast(
            "Please fill all required fields.",
            "error"
        );
    }

    return isValid;
}


function validateEmail(email) {
    const value = String(email || "").trim();

    if (!value) return false;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


function validateMobileNumber(number) {
    const value = String(number || "")
        .replace(/\s+/g, "");

    return /^[6-9]\d{9}$/.test(value);
}


function setupFormValidation() {
    const forms = $$("form");

    if (!forms.length) return;

    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            const valid = validateRequiredFields(form);

            if (!valid) {
                event.preventDefault();
                return;
            }

            const emailFields = form.querySelectorAll(
                'input[type="email"]'
            );

            for (const field of emailFields) {
                if (
                    field.value.trim() &&
                    !validateEmail(field.value)
                ) {
                    event.preventDefault();

                    field.classList.add("input-error");
                    field.focus();

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }
            }

            const mobileFields = form.querySelectorAll(
                'input[type="tel"], input[name*="mobile"], input[name*="phone"]'
            );

            for (const field of mobileFields) {
                if (
                    field.value.trim() &&
                    !validateMobileNumber(field.value)
                ) {
                    event.preventDefault();

                    field.classList.add("input-error");
                    field.focus();

                    showToast(
                        "Please enter a valid 10-digit mobile number.",
                        "error"
                    );

                    return;
                }
            }
        });
    });
}


/* ---------- REMOVE INPUT ERROR ---------- */

function setupInputErrorRemoval() {
    const inputs = $$(
        "input, textarea, select"
    );

    inputs.forEach(function (input) {
        input.addEventListener("input", function () {
            if (String(input.value || "").trim()) {
                input.classList.remove("input-error");
            }
        });

        input.addEventListener("change", function () {
            if (String(input.value || "").trim()) {
                input.classList.remove("input-error");
            }
        });
    });
}


/* ---------- HASH NAVIGATION ---------- */

function setupHashNavigation() {
    const hashLinks = $$('a[href^="#"]');

    hashLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(
                null,
                "",
                href
            );
        });
    });
}


/* ---------- ACTIVE NAV LINK ---------- */

function updateActiveNavigation() {
    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";

    const links = $$(
        ".main-nav a, .mobile-nav a, .mobile-menu a"
    );

    links.forEach(function (link) {
        const href =
            link.getAttribute("href") || "";

        const cleanHref =
            href.split("?")[0]
                .split("#")[0]
                .split("/")
                .pop()
                .toLowerCase();

        if (
            cleanHref &&
            cleanHref === currentPage
        ) {
            link.classList.add("active");
        }
    });
}


/* ---------- PRINT PAGE ---------- */

function setupPrintButtons() {
    const buttons = $$(
        "[data-print], .print-btn"
    );

    buttons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            window.print();
        });
    });
}


/* ---------- COPY TO CLIPBOARD ---------- */

function setupCopyButtons() {
    const buttons = $$(
        "[data-copy]"
    );

    buttons.forEach(function (button) {
        button.addEventListener("click", async function () {
            const text =
                button.getAttribute("data-copy") ||
                button.textContent.trim();

            try {
                await navigator.clipboard.writeText(text);

                showToast(
                    "Copied successfully.",
                    "success"
                );
            } catch (error) {
                showToast(
                    "Copy failed.",
                    "error"
                );
            }
        });
    });
}


/* ---------- EXTERNAL LINK SAFETY ---------- */

function setupExternalLinks() {
    const links = $$("a[href]");

    links.forEach(function (link) {
        const href =
            link.getAttribute("href") || "";

        if (
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {
            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }
    });
}


/* ---------- PART 3 SYSTEM INITIALIZATION ---------- */

function initializePart3Systems() {
    try {
        setupSavedJobEvents();
    } catch (error) {
        console.warn(
            "Saved job event setup failed:",
            error
        );
    }

    try {
        setupSavedJobRemoveEvents();
    } catch (error) {
        console.warn(
            "Saved job remove setup failed:",
            error
        );
    }

    try {
        setupReminderEvents();
    } catch (error) {
        console.warn(
            "Reminder setup failed:",
            error
        );
    }

    try {
        setupApplicationTracker();
    } catch (error) {
        console.warn(
            "Application tracker setup failed:",
            error
        );
    }
}


/* ---------- PART 4 SYSTEM INITIALIZATION ---------- */

function initializePart4Systems() {
    setupBackToTop();
    setupFAQ();
    setupFormValidation();
    setupInputErrorRemoval();
    setupHashNavigation();
    updateActiveNavigation();
    setupPrintButtons();
    setupCopyButtons();
    setupExternalLinks();
}


/* ---------- EXTEND MAIN INITIALIZATION ---------- */

const previousInitializePart4 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart4();

    try {
        initializePart3Systems();
    } catch (error) {
        console.warn(
            "Part 3 initialization error:",
            error
        );
    }

    try {
        initializePart4Systems();
    } catch (error) {
        console.warn(
            "Part 4 initialization error:",
            error
        );
    }
};


/* ---------- END PART 4 ---------- */
/* =========================================================
   SCRIPT.JS — PART 5
   STATE PORTALS + JOB FILTERS + DYNAMIC FILTER SYSTEM
   ========================================================= */


/* ---------- STATE PORTAL DATABASE ---------- */

const statePortalDatabase = [

    {
        state: "Uttar Pradesh",
        short: "UP",
        jobs: "UPPSC, UPSSSC, UP Police",
        website: "https://uppsc.up.nic.in/"
    },

    {
        state: "Bihar",
        short: "BR",
        jobs: "BPSC, Bihar Police, BTSC",
        website: "https://www.bpsc.bih.nic.in/"
    },

    {
        state: "Jharkhand",
        short: "JH",
        jobs: "JPSC, JSSC",
        website: "https://www.jpsc.gov.in/"
    },

    {
        state: "Madhya Pradesh",
        short: "MP",
        jobs: "MPPSC, MPESB",
        website: "https://mppsc.mp.gov.in/"
    },

    {
        state: "Rajasthan",
        short: "RJ",
        jobs: "RPSC, RSSB",
        website: "https://rpsc.rajasthan.gov.in/"
    },

    {
        state: "Maharashtra",
        short: "MH",
        jobs: "MPSC, Police",
        website: "https://mpsc.gov.in/"
    },

    {
        state: "West Bengal",
        short: "WB",
        jobs: "WBPSC, Police",
        website: "https://psc.wb.gov.in/"
    },

    {
        state: "Gujarat",
        short: "GJ",
        jobs: "GPSC, GSSSB",
        website: "https://gpsc.gujarat.gov.in/"
    },

    {
        state: "Haryana",
        short: "HR",
        jobs: "HPSC, HSSC",
        website: "https://hpsc.gov.in/"
    },

    {
        state: "Punjab",
        short: "PB",
        jobs: "PPSC, Punjab Police",
        website: "https://ppsc.gov.in/"
    },

    {
        state: "Uttarakhand",
        short: "UK",
        jobs: "UKPSC, UKSSSC",
        website: "https://psc.uk.gov.in/"
    },

    {
        state: "Himachal Pradesh",
        short: "HP",
        jobs: "HPPSC, HP Police",
        website: "https://hppsc.hp.gov.in/"
    },

    {
        state: "Chhattisgarh",
        short: "CG",
        jobs: "CGPSC, CG Vyapam",
        website: "https://psc.cg.gov.in/"
    },

    {
        state: "Odisha",
        short: "OD",
        jobs: "OPSC, OSSC, OSSSC",
        website: "https://www.opsc.gov.in/"
    },

    {
        state: "Assam",
        short: "AS",
        jobs: "APSC, Assam Police",
        website: "https://apsc.nic.in/"
    },

    {
        state: "Karnataka",
        short: "KA",
        jobs: "KPSC, Karnataka Police",
        website: "https://kpsc.kar.nic.in/"
    },

    {
        state: "Tamil Nadu",
        short: "TN",
        jobs: "TNPSC, TNUSRB",
        website: "https://www.tnpsc.gov.in/"
    },

    {
        state: "Kerala",
        short: "KL",
        jobs: "Kerala PSC",
        website: "https://www.keralapsc.gov.in/"
    },

    {
        state: "Andhra Pradesh",
        short: "AP",
        jobs: "APPSC, Police",
        website: "https://psc.ap.gov.in/"
    },

    {
        state: "Telangana",
        short: "TS",
        jobs: "TSPSC, Police",
        website: "https://www.tspsc.gov.in/"
    }
];


/* ---------- RENDER STATE PORTALS ---------- */

function renderStatePortals(
    containerId = "statePortalGrid"
) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    statePortalDatabase.forEach(function (state) {

        const card =
            document.createElement("div");

        card.className = "service-card";

        card.innerHTML = `
            <div class="service-icon">
                ${escapeHTML(state.short)}
            </div>

            <h3>
                ${escapeHTML(state.state)}
            </h3>

            <p>
                ${escapeHTML(state.jobs)}
            </p>

            <a
                href="${escapeHTML(state.website)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
            >
                Official Portal
            </a>
        `;

        container.appendChild(card);
    });
}


/* ---------- STATE SEARCH ---------- */

function searchStatePortals(keyword) {

    const value =
        normalizeSearch(keyword);

    if (!value) {
        return statePortalDatabase;
    }

    return statePortalDatabase.filter(
        function (state) {

            return (
                normalizeSearch(state.state)
                    .includes(value) ||

                normalizeSearch(state.short)
                    .includes(value) ||

                normalizeSearch(state.jobs)
                    .includes(value)
            );
        }
    );
}


function setupStatePortalSearch() {

    const input =
        document.getElementById(
            "statePortalSearch"
        );

    const container =
        document.getElementById(
            "statePortalGrid"
        );

    if (!input || !container) return;

    function renderResults() {

        const results =
            searchStatePortals(input.value);

        container.innerHTML = "";

        if (!results.length) {

            container.innerHTML = `
                <div class="empty-box">
                    <h3>No state portal found</h3>
                    <p>
                        Try another state name.
                    </p>
                </div>
            `;

            return;
        }

        results.forEach(function (state) {

            const card =
                document.createElement("div");

            card.className = "service-card";

            card.innerHTML = `
                <div class="service-icon">
                    ${escapeHTML(state.short)}
                </div>

                <h3>
                    ${escapeHTML(state.state)}
                </h3>

                <p>
                    ${escapeHTML(state.jobs)}
                </p>

                <a
                    href="${escapeHTML(state.website)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                >
                    Official Portal
                </a>
            `;

            container.appendChild(card);
        });
    }

    input.addEventListener(
        "input",
        renderResults
    );

    renderResults();
}


/* ---------- QUALIFICATION FILTER ---------- */

function setupQualificationFilter() {

    const filter =
        document.getElementById(
            "qualificationFilter"
        );

    if (!filter) return;

    filter.addEventListener(
        "change",
        function () {

            const value =
                normalizeSearch(filter.value);

            const cards =
                $$(".job-card");

            if (!value) {

                cards.forEach(function (card) {
                    card.style.display = "";
                });

                return;
            }

            cards.forEach(function (card) {

                const text =
                    normalizeSearch(
                        card.textContent
                    );

                if (text.includes(value)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        }
    );
}


/* ---------- JOB CATEGORY FILTER ---------- */

function setupJobCategoryFilter() {

    const filter =
        document.getElementById(
            "jobCategoryFilter"
        );

    if (!filter) return;

    filter.addEventListener(
        "change",
        function () {

            const value =
                normalizeSearch(filter.value);

            const cards =
                $$(".job-card");

            if (!value) {

                cards.forEach(function (card) {
                    card.style.display = "";
                });

                return;
            }

            cards.forEach(function (card) {

                const category =
                    card.getAttribute(
                        "data-category"
                    ) || "";

                const text =
                    card.textContent || "";

                const searchable =
                    normalizeSearch(
                        category + " " + text
                    );

                card.style.display =
                    searchable.includes(value)
                        ? ""
                        : "none";
            });
        }
    );
}


/* ---------- STATE FILTER ---------- */

function setupJobStateFilter() {

    const filter =
        document.getElementById(
            "jobStateFilter"
        );

    if (!filter) return;

    filter.addEventListener(
        "change",
        function () {

            const value =
                normalizeSearch(filter.value);

            const cards =
                $$(".job-card");

            if (!value) {

                cards.forEach(function (card) {
                    card.style.display = "";
                });

                return;
            }

            cards.forEach(function (card) {

                const state =
                    card.getAttribute(
                        "data-state"
                    ) || "";

                const text =
                    card.textContent || "";

                const searchable =
                    normalizeSearch(
                        state + " " + text
                    );

                card.style.display =
                    searchable.includes(value)
                        ? ""
                        : "none";
            });
        }
    );
}


/* ---------- CLEAR JOB FILTERS ---------- */

function clearJobFilters() {

    const filters = [
        "qualificationFilter",
        "jobCategoryFilter",
        "jobStateFilter"
    ];

    filters.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    $$(".job-card").forEach(
        function (card) {
            card.style.display = "";
        }
    );
}


/* ---------- RESET BUTTON ---------- */

function setupFilterResetButtons() {

    const buttons =
        $$(
            "[data-reset-filters], .reset-filters"
        );

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                clearJobFilters();

                resetFilters();

                showToast(
                    "Filters reset successfully.",
                    "success"
                );
            }
        );
    });
}


/* ---------- DYNAMIC FILTER INITIALIZATION ---------- */

function initializeFilterSystems() {

    setupStatePortalSearch();

    setupQualificationFilter();

    setupJobCategoryFilter();

    setupJobStateFilter();

    setupFilterResetButtons();

    renderStatePortals();
}


/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitializePart5 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart5();

    try {

        initializeFilterSystems();

    } catch (error) {

        console.warn(
            "Filter system initialization failed:",
            error
        );
    }
};


/* ---------- GLOBAL PUBLIC FUNCTIONS ---------- */

window.SarkariiChij =
    window.SarkariiChij ||
    {};


window.SarkariiChij.searchStates =
    searchStatePortals;


window.SarkariiChij.clearFilters =
    clearJobFilters;


window.SarkariiChij.renderStatePortals =
    renderStatePortals;


/* ---------- END PART 5 ---------- */
/* =========================================================
   SCRIPT.JS — PART 6
   NOTIFICATIONS + SAVED ITEMS + TRACKER + PAGE DATA
   ========================================================= */


/* ---------- NOTIFICATION DATABASE ---------- */

const notificationDatabase = [

    {
        id: "n001",
        title: "New Government Jobs",
        text: "Latest government recruitment updates are available.",
        type: "job",
        date: "Today",
        url: "jobs.html"
    },

    {
        id: "n002",
        title: "Latest Results",
        text: "Check recently released examination results.",
        type: "result",
        date: "Today",
        url: "results.html"
    },

    {
        id: "n003",
        title: "Admit Card Updates",
        text: "Check latest admit card and exam updates.",
        type: "admit",
        date: "Today",
        url: "admit-card.html"
    },

    {
        id: "n004",
        title: "New Scholarships",
        text: "Find scholarship opportunities and application updates.",
        type: "scholarship",
        date: "Today",
        url: "scholarship.html"
    },

    {
        id: "n005",
        title: "Latest Syllabus Updates",
        text: "Check examination syllabus and pattern information.",
        type: "syllabus",
        date: "Today",
        url: "syllabus.html"
    }
];


/* ---------- NOTIFICATION STORAGE ---------- */

function getNotifications() {

    const stored =
        getData("notifications");

    if (Array.isArray(stored)) {
        return stored;
    }

    saveData(
        "notifications",
        notificationDatabase
    );

    return notificationDatabase;
}


/* ---------- RENDER NOTIFICATIONS ---------- */

function renderNotifications(
    containerId = "notificationList"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    const notifications =
        getNotifications();

    container.innerHTML = "";

    if (!notifications.length) {

        container.innerHTML = `
            <div class="empty-box">
                <h3>No notifications</h3>
                <p>
                    New updates will appear here.
                </p>
            </div>
        `;

        return;
    }

    notifications.forEach(
        function (item) {

            const card =
                document.createElement("div");

            card.className =
                "notification-item";

            card.innerHTML = `
                <div class="notification-content">
                    <span class="badge badge-primary">
                        ${escapeHTML(item.type)}
                    </span>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.text)}
                    </p>

                    <small>
                        ${escapeHTML(item.date)}
                    </small>
                </div>

                <a
                    href="${escapeHTML(item.url)}"
                    class="btn btn-secondary"
                >
                    View
                </a>
            `;

            container.appendChild(card);
        }
    );
}


/* ---------- NOTIFICATION COUNT ---------- */

function updateNotificationCount() {

    const notifications =
        getNotifications();

    const elements =
        $$(
            ".notification-count, [data-notification-count]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                notifications.length;
        }
    );
}


/* ---------- SAVED JOB COUNT ---------- */

function updateSavedJobCount() {

    const jobs =
        getSavedJobs();

    const elements =
        $$(
            ".saved-job-count, [data-saved-job-count]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                jobs.length;
        }
    );
}


/* ---------- APPLICATION COUNT ---------- */

function updateApplicationCount() {

    const applications =
        getApplications();

    const elements =
        $$(
            ".application-count, [data-application-count]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                applications.length;
        }
    );
}


/* ---------- REMINDER COUNT ---------- */

function updateReminderCount() {

    const reminders =
        getReminders();

    const elements =
        $$(
            ".reminder-count, [data-reminder-count]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                reminders.length;
        }
    );
}


/* ---------- DASHBOARD COUNTS ---------- */

function updateDashboardCounts() {

    updateNotificationCount();

    updateSavedJobCount();

    updateApplicationCount();

    updateReminderCount();
}


/* ---------- SAVED ITEMS RENDER ---------- */

function renderSavedItemsSummary(
    containerId = "savedItemsSummary"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    const jobs =
        getSavedJobs();

    container.innerHTML = "";

    if (!jobs.length) {

        container.innerHTML = `
            <div class="empty-box">
                <h3>No saved jobs</h3>

                <p>
                    Save a government job to
                    see it here.
                </p>

                <a
                    href="jobs.html"
                    class="btn btn-primary"
                >
                    Browse Jobs
                </a>
            </div>
        `;

        return;
    }

    jobs.slice(0, 5).forEach(
        function (job) {

            const item =
                document.createElement("div");

            item.className =
                "tracker-item";

            item.innerHTML = `
                <div class="tracker-info">
                    <h3>
                        ${escapeHTML(
                            job.title ||
                            job.post ||
                            "Saved Job"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            job.department ||
                            job.organization ||
                            ""
                        )}
                    </p>
                </div>

                <a
                    href="${escapeHTML(
                        job.url || "jobs.html"
                    )}"
                    class="btn btn-secondary"
                >
                    View
                </a>
            `;

            container.appendChild(item);
        }
    );
}


/* ---------- APPLICATION SUMMARY ---------- */

function renderApplicationSummary(
    containerId = "applicationSummary"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    const applications =
        getApplications();

    container.innerHTML = "";

    if (!applications.length) {

        container.innerHTML = `
            <div class="empty-box">
                <h3>No applications tracked</h3>

                <p>
                    Add your applications to
                    track their status.
                </p>
            </div>
        `;

        return;
    }

    applications
        .slice(0, 5)
        .forEach(
            function (application) {

                const item =
                    document.createElement("div");

                item.className =
                    "tracker-item";

                const status =
                    application.status ||
                    "Applied";

                item.innerHTML = `
                    <div class="tracker-info">
                        <h3>
                            ${escapeHTML(
                                application.title ||
                                application.post ||
                                "Application"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                application.exam ||
                                application.department ||
                                ""
                            )}
                        </p>
                    </div>

                    <span class="tracker-status">
                        ${escapeHTML(status)}
                    </span>
                `;

                container.appendChild(item);
            }
        );
}


/* ---------- REMINDER SUMMARY ---------- */

function renderReminderSummary(
    containerId = "reminderSummary"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    const reminders =
        getReminders();

    container.innerHTML = "";

    if (!reminders.length) {

        container.innerHTML = `
            <div class="empty-box">
                <h3>No reminders</h3>

                <p>
                    Create a reminder for an
                    important application date.
                </p>
            </div>
        `;

        return;
    }

    reminders
        .slice(0, 5)
        .forEach(
            function (reminder) {

                const item =
                    document.createElement("div");

                item.className =
                    "reminder-item";

                item.innerHTML = `
                    <div>
                        <strong>
                            ${escapeHTML(
                                reminder.title ||
                                "Reminder"
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                reminder.date ||
                                ""
                            )}
                        </p>
                    </div>
                `;

                container.appendChild(item);
            }
        );
}


/* ---------- DASHBOARD SUMMARY ---------- */

function renderDashboardSummaries() {

    renderSavedItemsSummary();

    renderApplicationSummary();

    renderReminderSummary();

    renderNotifications();

    updateDashboardCounts();
}


/* ---------- PAGE TITLE ---------- */

function updatePageTitle() {

    const page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const titles = {

        "index.html":
            "Sarkariiichij — Government Jobs, Results & Career",

        "jobs.html":
            "Government Jobs — Sarkariiichij",

        "eligibility.html":
            "Eligibility Checker — Sarkariiichij",

        "admission.html":
            "Admission — Sarkariiichij",

        "results.html":
            "Government Results — Sarkariiichij",

        "admit-card.html":
            "Admit Card — Sarkariiichij",

        "syllabus.html":
            "Syllabus — Sarkariiichij",

        "cutoff.html":
            "Cut Off — Sarkariiichij",

        "papers.html":
            "Previous Year Papers — Sarkariiichij",

        "scholarship.html":
            "Scholarship — Sarkariiichij",

        "yojana.html":
            "Sarkari Yojana — Sarkariiichij",

        "sarkari-kaam.html":
            "Sarkari Kaam — Sarkariiichij",

        "career-tools.html":
            "Career Tools — Sarkariiichij",

        "mock-test.html":
            "Mock Test — Sarkariiichij"
    };

    if (titles[page]) {
        document.title =
            titles[page];
    }
}


/* ---------- CURRENT PAGE DATA ---------- */

function getCurrentPage() {

    const pathname =
        window.location.pathname;

    return pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";
}


/* ---------- PAGE TYPE ---------- */

function getPageType() {

    const page =
        getCurrentPage();

    if (page === "index.html") {
        return "home";
    }

    if (page.includes("job")) {
        return "jobs";
    }

    if (page.includes("result")) {
        return "results";
    }

    if (page.includes("admit")) {
        return "admit";
    }

    if (page.includes("syllabus")) {
        return "syllabus";
    }

    if (page.includes("cutoff")) {
        return "cutoff";
    }

    if (page.includes("paper")) {
        return "papers";
    }

    if (page.includes("scholarship")) {
        return "scholarship";
    }

    if (page.includes("yojana")) {
        return "yojana";
    }

    if (page.includes("admission")) {
        return "admission";
    }

    if (page.includes("career")) {
        return "career";
    }

    if (page.includes("mock")) {
        return "mock";
    }

    return "other";
}


/* ---------- INITIALIZE PART 6 ---------- */

function initializePart6Systems() {

    updatePageTitle();

    renderDashboardSummaries();

    updateDashboardCounts();
}


/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitializePart6 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart6();

    try {

        initializePart6Systems();

    } catch (error) {

        console.warn(
            "Part 6 initialization failed:",
            error
        );
    }
};


/* ---------- GLOBAL API ---------- */

window.SarkariiChij =
    window.SarkariiChij ||
    {};


window.SarkariiChij
    .getCurrentPage =
    getCurrentPage;


window.SarkariiChij
    .getPageType =
    getPageType;


window.SarkariiChij
    .updateDashboard =
    renderDashboardSummaries;


/* ---------- END PART 6 ---------- */
/* =========================================================
   SCRIPT.JS — PART 7
   TABS + DROPDOWNS + UI HELPERS + DATE SYSTEM
   ========================================================= */


/* ---------- TAB SYSTEM ---------- */

function setupTabs() {

    const tabContainers =
        $$(".tabs");

    if (!tabContainers.length) {
        return;
    }

    tabContainers.forEach(function (container) {

        const tabs =
            container.querySelectorAll(
                ".tab"
            );

        tabs.forEach(function (tab) {

            tab.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const targetId =
                        tab.getAttribute(
                            "data-tab"
                        );

                    if (!targetId) {
                        return;
                    }

                    tabs.forEach(
                        function (otherTab) {
                            otherTab.classList
                                .remove("active");
                        }
                    );

                    tab.classList.add("active");

                    const parent =
                        tab.closest(
                            ".tab-container"
                        ) ||
                        container.parentElement;

                    if (!parent) {
                        return;
                    }

                    const contents =
                        parent.querySelectorAll(
                            ".tab-content"
                        );

                    contents.forEach(
                        function (content) {

                            content.style.display =
                                "none";

                            content.classList
                                .remove("active");
                        }
                    );

                    const target =
                        document.getElementById(
                            targetId
                        );

                    if (target) {

                        target.style.display =
                            "block";

                        target.classList
                            .add("active");
                    }
                }
            );
        });
    });
}


/* ---------- DROPDOWN SYSTEM ---------- */

function setupDropdowns() {

    const dropdowns =
        $$(".custom-dropdown");

    if (!dropdowns.length) {
        return;
    }

    dropdowns.forEach(function (dropdown) {

        const trigger =
            dropdown.querySelector(
                ".dropdown-trigger"
            );

        const menu =
            dropdown.querySelector(
                ".dropdown-menu"
            );

        if (!trigger || !menu) {
            return;
        }

        trigger.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                dropdown.classList.toggle(
                    "active"
                );
            }
        );

        menu.querySelectorAll("a").forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {
                        dropdown.classList
                            .remove("active");
                    }
                );
            }
        );
    });

    document.addEventListener(
        "click",
        function () {

            dropdowns.forEach(
                function (dropdown) {

                    dropdown.classList
                        .remove("active");
                }
            );
        }
    );
}


/* ---------- DATE FORMATTER ---------- */

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        dateValue instanceof Date
            ? dateValue
            : new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* ---------- DATE AND TIME FORMATTER ---------- */

function formatDateTime(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        dateValue instanceof Date
            ? dateValue
            : new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* ---------- DAYS REMAINING ---------- */

function getDaysRemaining(targetDate) {

    const target =
        new Date(targetDate);

    if (Number.isNaN(target.getTime())) {
        return null;
    }

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    target.setHours(
        0,
        0,
        0,
        0
    );

    const difference =
        target.getTime() -
        today.getTime();

    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );
}


/* ---------- LAST DATE LABEL ---------- */

function getDeadlineLabel(targetDate) {

    const days =
        getDaysRemaining(
            targetDate
        );

    if (days === null) {
        return "";
    }

    if (days < 0) {
        return "Closed";
    }

    if (days === 0) {
        return "Last date today";
    }

    if (days === 1) {
        return "1 day remaining";
    }

    return days +
        " days remaining";
}


/* ---------- SCROLL REVEAL ---------- */

function setupScrollReveal() {

    const elements =
        $$(
            ".card, .job-card, .service-card, .resource-card, .update-card"
        );

    if (!elements.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(
            function (element) {
                element.classList.add(
                    "visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.08
            }
        );

    elements.forEach(
        function (element) {
            observer.observe(element);
        }
    );
}


/* ---------- LOADING STATE ---------- */

function showLoading(
    container,
    message = "Loading..."
) {

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading-box">
            <div class="spinner"></div>
            <p>
                ${escapeHTML(message)}
            </p>
        </div>
    `;
}


function hideLoading(
    container
) {

    if (!container) {
        return;
    }

    const loading =
        container.querySelector(
            ".loading-box"
        );

    if (loading) {
        loading.remove();
    }
}


/* ---------- EMPTY STATE ---------- */

function showEmptyState(
    container,
    title = "No data found",
    message = "Nothing is available right now."
) {

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="empty-box">
            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>
        </div>
    `;
}


/* ---------- ERROR STATE ---------- */

function showErrorState(
    container,
    message = "Something went wrong."
) {

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="error-box">
            <h3>
                Unable to load data
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                type="button"
                class="btn btn-secondary"
                onclick="location.reload()"
            >
                Retry
            </button>
        </div>
    `;
}


/* ---------- SMOOTH PAGE TOP ---------- */

function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ---------- SCROLL TO ELEMENT ---------- */

function scrollToElement(
    selector
) {

    if (!selector) {
        return;
    }

    const element =
        typeof selector === "string"
            ? document.querySelector(selector)
            : selector;

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ---------- MOBILE MENU CLOSE ON LINK ---------- */

function setupMobileLinkClose() {

    const links =
        $$(
            ".mobile-menu a, .mobile-nav a"
        );

    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                try {
                    closeMobileMenu();
                } catch (error) {
                    console.warn(
                        "Mobile menu close failed:",
                        error
                    );
                }
            }
        );
    });
}


/* ---------- ESCAPE MOBILE MENU ---------- */

function setupMobileResize() {

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 950) {

                try {
                    closeMobileMenu();
                } catch (error) {
                    // Ignore
                }
            }
        }
    );
}


/* ---------- ONLINE / OFFLINE STATUS ---------- */

function setupConnectionStatus() {

    const updateStatus =
        function () {

            const elements =
                $$(
                    "[data-connection-status]"
                );

            elements.forEach(
                function (element) {

                    if (navigator.onLine) {

                        element.textContent =
                            "Online";

                        element.classList
                            .remove(
                                "offline"
                            );

                        element.classList
                            .add(
                                "online"
                            );

                    } else {

                        element.textContent =
                            "Offline";

                        element.classList
                            .remove(
                                "online"
                            );

                        element.classList
                            .add(
                                "offline"
                            );
                    }
                }
            );
        };

    window.addEventListener(
        "online",
        updateStatus
    );

    window.addEventListener(
        "offline",
        updateStatus
    );

    updateStatus();
}


/* ---------- GENERIC BUTTON LOADING ---------- */

function setButtonLoading(
    button,
    loading = true
) {

    if (!button) {
        return;
    }

    if (loading) {

        if (
            !button.dataset.originalText
        ) {
            button.dataset.originalText =
                button.innerHTML;
        }

        button.disabled = true;

        button.innerHTML = `
            <span class="spinner"></span>
            Please wait...
        `;

    } else {

        button.disabled = false;

        if (
            button.dataset.originalText
        ) {
            button.innerHTML =
                button.dataset.originalText;
        }
    }
}


/* ---------- INITIALIZE PART 7 ---------- */

function initializePart7Systems() {

    setupTabs();

    setupDropdowns();

    setupScrollReveal();

    setupMobileLinkClose();

    setupMobileResize();

    setupConnectionStatus();
}


/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitializePart7 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart7();

    try {

        initializePart7Systems();

    } catch (error) {

        console.warn(
            "Part 7 initialization failed:",
            error
        );
    }
};


/* ---------- GLOBAL HELPERS ---------- */

window.SarkariiChij =
    window.SarkariiChij ||
    {};


window.SarkariiChij.formatDate =
    formatDate;


window.SarkariiChij.formatDateTime =
    formatDateTime;


window.SarkariiChij.getDaysRemaining =
    getDaysRemaining;


window.SarkariiChij.getDeadlineLabel =
    getDeadlineLabel;


window.SarkariiChij.scrollToTop =
    scrollToTop;


window.SarkariiChij.scrollToElement =
    scrollToElement;


window.SarkariiChij.showLoading =
    showLoading;


window.SarkariiChij.hideLoading =
    hideLoading;


window.SarkariiChij.showEmptyState =
    showEmptyState;


window.SarkariiChij.showErrorState =
    showErrorState;


window.SarkariiChij.setButtonLoading =
    setButtonLoading;


/* ---------- END PART 7 ---------- */
/* =========================================================
   SCRIPT.JS — PART 8
   TOOLS + COUNTDOWN + CHECKBOX + MOBILE NAVIGATION
   ========================================================= */


/* ---------- NUMBER FORMAT ---------- */

function formatNumber(value) {

    const number =
        Number(value);

    if (Number.isNaN(number)) {
        return String(value || "");
    }

    return number.toLocaleString(
        "en-IN"
    );
}


/* ---------- SIMPLE CALCULATOR ---------- */

function calculateExpression(
    expression
) {

    if (!expression) {
        return null;
    }

    const value =
        String(expression)
            .replace(/[^0-9+\-*/().%\s]/g, "");

    if (!value) {
        return null;
    }

    try {

        const result =
            Function(
                '"use strict"; return (' +
                value +
                ')'
            )();

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {
            return null;
        }

        return result;

    } catch (error) {

        return null;
    }
}


/* ---------- CALCULATOR SYSTEM ---------- */

function setupCalculator() {

    const calculators =
        $$(".calculator-box");

    if (!calculators.length) {
        return;
    }

    calculators.forEach(
        function (calculator) {

            const display =
                calculator.querySelector(
                    "[data-calculator-display]"
                ) ||
                calculator.querySelector(
                    "input"
                );

            const result =
                calculator.querySelector(
                    "[data-calculator-result]"
                ) ||
                calculator.querySelector(
                    ".calculator-result"
                );

            const buttons =
                calculator.querySelectorAll(
                    "[data-calculator-value]"
                );

            if (!display) {
                return;
            }

            buttons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const value =
                                button.getAttribute(
                                    "data-calculator-value"
                                );

                            if (
                                value ===
                                "clear"
                            ) {

                                display.value = "";

                                if (result) {
                                    result.textContent =
                                        "";
                                }

                                return;
                            }

                            if (
                                value ===
                                "equals"
                            ) {

                                const answer =
                                    calculateExpression(
                                        display.value
                                    );

                                if (
                                    answer === null
                                ) {

                                    if (result) {
                                        result.textContent =
                                            "Invalid calculation";
                                    }

                                } else {

                                    display.value =
                                        answer;

                                    if (result) {
                                        result.textContent =
                                            formatNumber(
                                                answer
                                            );
                                    }
                                }

                                return;
                            }

                            display.value += value;
                        }
                    );
                }
            );
        }
    );
}


/* ---------- COUNTDOWN TIMER ---------- */

function startCountdown(
    element,
    targetDate
) {

    if (!element || !targetDate) {
        return null;
    }

    const target =
        new Date(targetDate)
            .getTime();

    if (Number.isNaN(target)) {
        return null;
    }

    function update() {

        const now =
            Date.now();

        let difference =
            target - now;

        if (difference <= 0) {

            element.textContent =
                "Time ended";

            return false;
        }

        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );

        difference %=
            (1000 * 60 * 60 * 24);

        const hours =
            Math.floor(
                difference /
                (1000 * 60 * 60)
            );

        difference %=
            (1000 * 60 * 60);

        const minutes =
            Math.floor(
                difference /
                (1000 * 60)
            );

        difference %=
            (1000 * 60);

        const seconds =
            Math.floor(
                difference /
                1000
            );

        element.textContent =
            days + "d " +
            hours + "h " +
            minutes + "m " +
            seconds + "s";

        return true;
    }

    update();

    const timer =
        setInterval(
            function () {

                const active =
                    update();

                if (!active) {
                    clearInterval(timer);
                }

            },
            1000
        );

    return timer;
}


/* ---------- AUTO COUNTDOWN ELEMENTS ---------- */

function setupCountdowns() {

    const elements =
        $$(
            "[data-countdown]"
        );

    elements.forEach(
        function (element) {

            const target =
                element.getAttribute(
                    "data-countdown"
                );

            startCountdown(
                element,
                target
            );
        }
    );
}


/* ---------- SEARCH CLEAR ---------- */

function setupSearchClearButtons() {

    const buttons =
        $$(
            "[data-clear-search]"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const targetId =
                        button.getAttribute(
                            "data-clear-search"
                        );

                    const input =
                        targetId
                            ? document.getElementById(
                                targetId
                            )
                            : document.querySelector(
                                ".search-box input"
                            );

                    if (!input) {
                        return;
                    }

                    input.value = "";

                    input.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                    input.focus();
                }
            );
        }
    );
}


/* ---------- SELECT ALL CHECKBOX ---------- */

function setupSelectAllCheckboxes() {

    const masters =
        $$(
            "[data-select-all]"
        );

    masters.forEach(
        function (master) {

            const groupName =
                master.getAttribute(
                    "data-select-all"
                );

            const checkboxes =
                $$(
                    'input[type="checkbox"][data-checkbox-group="' +
                    groupName +
                    '"]'
                );

            master.addEventListener(
                "change",
                function () {

                    checkboxes.forEach(
                        function (checkbox) {

                            checkbox.checked =
                                master.checked;
                        }
                    );
                }
            );

            checkboxes.forEach(
                function (checkbox) {

                    checkbox.addEventListener(
                        "change",
                        function () {

                            const checked =
                                checkboxes.filter(
                                    function (item) {
                                        return item.checked;
                                    }
                                ).length;

                            master.checked =
                                checked ===
                                checkboxes.length;

                            master.indeterminate =
                                checked > 0 &&
                                checked <
                                checkboxes.length;
                        }
                    );
                }
            );
        }
    );
}


/* ---------- MOBILE BOTTOM NAV ---------- */

function setupMobileBottomNavigation() {

    const nav =
        document.querySelector(
            ".mobile-bottom-nav"
        );

    if (!nav) {
        return;
    }

    const links =
        nav.querySelectorAll(
            "a"
        );

    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    links.forEach(
                        function (item) {
                            item.classList
                                .remove(
                                    "active"
                                );
                        }
                    );

                    link.classList.add(
                        "active"
                    );
                }
            );
        }
    );
}


/* ---------- SAVE LAST VISITED PAGE ---------- */

function saveLastVisitedPage() {

    const page =
        window.location.href;

    saveData(
        "lastVisitedPage",
        {
            url: page,
            time: new Date().toISOString()
        }
    );
}


/* ---------- CONTINUE LAST VISITED PAGE ---------- */

function getLastVisitedPage() {

    return getData(
        "lastVisitedPage"
    );
}


/* ---------- LAST VISITED BUTTON ---------- */

function setupContinueButton() {

    const buttons =
        $$(
            "[data-continue-last]"
        );

    buttons.forEach(
        function (button) {

            const lastPage =
                getLastVisitedPage();

            if (!lastPage ||
                !lastPage.url) {

                button.style.display =
                    "none";

                return;
            }

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    window.location.href =
                        lastPage.url;
                }
            );
        }
    );
}


/* ---------- PAGE VISIT COUNTER ---------- */

function updatePageVisitCount() {

    const page =
        getCurrentPage();

    const key =
        "pageVisits_" + page;

    const count =
        Number(
            getData(key) || 0
        ) + 1;

    saveData(
        key,
        count
    );

    const elements =
        $$(
            "[data-page-visits]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                formatNumber(count);
        }
    );
}


/* ---------- QUICK ACTION BUTTONS ---------- */

function setupQuickActions() {

    const buttons =
        $$(
            "[data-go]"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const destination =
                        button.getAttribute(
                            "data-go"
                        );

                    if (!destination) {
                        return;
                    }

                    goToPage(
                        destination
                    );
                }
            );
        }
    );
}


/* ---------- PREVENT DOUBLE SUBMIT ---------- */

function setupFormDoubleSubmitProtection() {

    const forms =
        $$("form");

    forms.forEach(
        function (form) {

            form.addEventListener(
                "submit",
                function () {

                    if (
                        form.dataset.submitted ===
                        "true"
                    ) {
                        return;
                    }

                    form.dataset.submitted =
                        "true";

                    const buttons =
                        form.querySelectorAll(
                            'button[type="submit"], input[type="submit"]'
                        );

                    buttons.forEach(
                        function (button) {

                            button.disabled =
                                true;
                        }
                    );
                }
            );
        }
    );
}


/* ---------- INITIALIZE PART 8 ---------- */

function initializePart8Systems() {

    setupCalculator();

    setupCountdowns();

    setupSearchClearButtons();

    setupSelectAllCheckboxes();

    setupMobileBottomNavigation();

    saveLastVisitedPage();

    setupContinueButton();

    updatePageVisitCount();

    setupQuickActions();

    setupFormDoubleSubmitProtection();
}


/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitializePart8 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart8();

    try {

        initializePart8Systems();

    } catch (error) {

        console.warn(
            "Part 8 initialization failed:",
            error
        );
    }
};


/* ---------- GLOBAL API ---------- */

window.SarkariiChij =
    window.SarkariiChij ||
    {};


window.SarkariiChij.formatNumber =
    formatNumber;


window.SarkariiChij.calculate =
    calculateExpression;


window.SarkariiChij.startCountdown =
    startCountdown;


window.SarkariiChij.getLastVisitedPage =
    getLastVisitedPage;


/* ---------- END PART 8 ---------- */
/* =========================================================
   SCRIPT.JS — PART 9
   MOCK TEST ENGINE
   ========================================================= */


/* ---------- MOCK TEST DATA ---------- */

const defaultMockQuestions = [
    {
        question: "भारत की राजधानी क्या है?",
        options: [
            "मुंबई",
            "नई दिल्ली",
            "कोलकाता",
            "चेन्नई"
        ],
        answer: 1
    },
    {
        question: "भारतीय संविधान कब लागू हुआ?",
        options: [
            "15 अगस्त 1947",
            "26 जनवरी 1950",
            "26 नवंबर 1949",
            "2 अक्टूबर 1950"
        ],
        answer: 1
    },
    {
        question: "भारत में कितने राज्य हैं?",
        options: [
            "28",
            "29",
            "30",
            "27"
        ],
        answer: 0
    },
    {
        question: "UP की राजधानी क्या है?",
        options: [
            "कानपुर",
            "वाराणसी",
            "लखनऊ",
            "प्रयागराज"
        ],
        answer: 2
    },
    {
        question: "SSC का पूरा नाम क्या है?",
        options: [
            "Staff Selection Commission",
            "State Selection Commission",
            "Service Selection Council",
            "Staff Service Commission"
        ],
        answer: 0
    }
];


/* ---------- MOCK STATE ---------- */

const mockTestState = {
    questions: [],
    currentQuestion: 0,
    answers: {},
    timer: null,
    timeLeft: 0,
    started: false,
    submitted: false
};


/* ---------- LOAD QUESTIONS ---------- */

function getMockQuestions() {

    const stored =
        getData("mockQuestions");

    if (
        Array.isArray(stored) &&
        stored.length
    ) {
        return stored;
    }

    return defaultMockQuestions;
}


/* ---------- INITIALIZE MOCK ---------- */

function initializeMockTest(
    questions = null,
    durationMinutes = 10
) {

    mockTestState.questions =
        Array.isArray(questions) &&
        questions.length
            ? questions
            : getMockQuestions();

    mockTestState.currentQuestion = 0;
    mockTestState.answers = {};
    mockTestState.started = true;
    mockTestState.submitted = false;

    mockTestState.timeLeft =
        Number(durationMinutes) *
        60;

    renderMockQuestion();
    renderMockPalette();
    updateMockTimer();

    startMockTimer();
}


/* ---------- START TIMER ---------- */

function startMockTimer() {

    if (mockTestState.timer) {
        clearInterval(
            mockTestState.timer
        );
    }

    mockTestState.timer =
        setInterval(
            function () {

                if (
                    mockTestState.timeLeft <=
                    0
                ) {

                    clearInterval(
                        mockTestState.timer
                    );

                    submitMockTest(
                        true
                    );

                    return;
                }

                mockTestState.timeLeft--;

                updateMockTimer();

            },
            1000
        );
}


/* ---------- UPDATE TIMER ---------- */

function updateMockTimer() {

    const timer =
        document.querySelector(
            ".mock-timer"
        );

    if (!timer) {
        return;
    }

    const totalSeconds =
        Math.max(
            0,
            mockTestState.timeLeft
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    timer.textContent =
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(seconds)
            .padStart(2, "0");

    if (totalSeconds <= 60) {
        timer.classList.add(
            "danger"
        );
    } else {
        timer.classList.remove(
            "danger"
        );
    }
}


/* ---------- RENDER QUESTION ---------- */

function renderMockQuestion() {

    const questions =
        mockTestState.questions;

    if (!questions.length) {
        return;
    }

    const index =
        mockTestState.currentQuestion;

    const question =
        questions[index];

    const number =
        document.querySelector(
            ".question-number"
        );

    const text =
        document.querySelector(
            ".question-text"
        );

    const options =
        document.querySelector(
            ".options-list"
        );

    if (!text || !options) {
        return;
    }

    if (number) {
        number.textContent =
            "Question " +
            (index + 1) +
            " of " +
            questions.length;
    }

    text.textContent =
        question.question || "";

    options.innerHTML = "";

    question.options.forEach(
        function (option, optionIndex) {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "option";

            if (
                mockTestState.answers[index] ===
                optionIndex
            ) {
                label.classList.add(
                    "selected"
                );
            }

            label.innerHTML = `
                <input
                    type="radio"
                    name="mock-option"
                    value="${optionIndex}"
                    ${
                        mockTestState.answers[index] ===
                        optionIndex
                            ? "checked"
                            : ""
                    }
                >

                <span>
                    ${escapeHTML(
                        option
                    )}
                </span>
            `;

            label.addEventListener(
                "click",
                function () {

                    selectMockOption(
                        optionIndex
                    );
                }
            );

            options.appendChild(
                label
            );
        }
    );

    updateMockNavigation();
}


/* ---------- SELECT OPTION ---------- */

function selectMockOption(
    optionIndex
) {

    const questionIndex =
        mockTestState.currentQuestion;

    mockTestState.answers[
        questionIndex
    ] = optionIndex;

    renderMockQuestion();
    renderMockPalette();
}


/* ---------- NEXT QUESTION ---------- */

function nextMockQuestion() {

    if (
        mockTestState.currentQuestion <
        mockTestState.questions.length - 1
    ) {

        mockTestState.currentQuestion++;

        renderMockQuestion();
        renderMockPalette();
    }
}


/* ---------- PREVIOUS QUESTION ---------- */

function previousMockQuestion() {

    if (
        mockTestState.currentQuestion >
        0
    ) {

        mockTestState.currentQuestion--;

        renderMockQuestion();
        renderMockPalette();
    }
}


/* ---------- GO TO QUESTION ---------- */

function goToMockQuestion(
    index
) {

    if (
        index < 0 ||
        index >= mockTestState.questions.length
    ) {
        return;
    }

    mockTestState.currentQuestion =
        index;

    renderMockQuestion();
    renderMockPalette();
}


/* ---------- NAVIGATION BUTTONS ---------- */

function updateMockNavigation() {

    const previous =
        document.querySelector(
            "[data-mock-previous]"
        );

    const next =
        document.querySelector(
            "[data-mock-next]"
        );

    if (previous) {
        previous.disabled =
            mockTestState.currentQuestion === 0;
    }

    if (next) {

        next.disabled =
            mockTestState.currentQuestion ===
            mockTestState.questions.length - 1;
    }
}


/* ---------- QUESTION PALETTE ---------- */

function renderMockPalette() {

    const palette =
        document.querySelector(
            ".question-palette"
        );

    if (!palette) {
        return;
    }

    palette.innerHTML = "";

    mockTestState.questions.forEach(
        function (question, index) {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "question-number-btn";

            button.textContent =
                index + 1;

            if (
                index ===
                mockTestState.currentQuestion
            ) {
                button.classList.add(
                    "active"
                );
            }

            if (
                Object.prototype
                    .hasOwnProperty.call(
                        mockTestState.answers,
                        index
                    )
            ) {
                button.classList.add(
                    "answered"
                );
            }

            button.addEventListener(
                "click",
                function () {

                    goToMockQuestion(
                        index
                    );
                }
            );

            palette.appendChild(
                button
            );
        }
    );
}


/* ---------- CALCULATE RESULT ---------- */

function calculateMockResult() {

    let correct = 0;
    let attempted = 0;

    mockTestState.questions.forEach(
        function (question, index) {

            if (
                Object.prototype
                    .hasOwnProperty.call(
                        mockTestState.answers,
                        index
                    )
            ) {

                attempted++;

                if (
                    mockTestState.answers[index] ===
                    question.answer
                ) {
                    correct++;
                }
            }
        }
    );

    const total =
        mockTestState.questions.length;

    const wrong =
        attempted - correct;

    const skipped =
        total - attempted;

    const percentage =
        total
            ? Math.round(
                (correct / total) *
                100
            )
            : 0;

    return {
        total,
        attempted,
        correct,
        wrong,
        skipped,
        percentage
    };
}


/* ---------- RENDER RESULT ---------- */

function renderMockResult(
    result
) {

    const container =
        document.querySelector(
            ".mock-result"
        );

    if (!container) {
        return;
    }

    container.style.display =
        "block";

    container.innerHTML = `
        <div class="score-circle">
            ${result.percentage}%
        </div>

        <h2>
            Mock Test Result
        </h2>

        <div class="mock-stat-grid">

            <div class="mock-stat">
                <strong>
                    ${result.total}
                </strong>

                <span>
                    Total
                </span>
            </div>

            <div class="mock-stat">
                <strong>
                    ${result.correct}
                </strong>

                <span>
                    Correct
                </span>
            </div>

            <div class="mock-stat">
                <strong>
                    ${result.wrong}
                </strong>

                <span>
                    Wrong
                </span>
            </div>

            <div class="mock-stat">
                <strong>
                    ${result.skipped}
                </strong>

                <span>
                    Skipped
                </span>
            </div>

        </div>

        <p>
            You attempted
            ${result.attempted}
            out of
            ${result.total}
            questions.
        </p>
    `;

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ---------- SUBMIT TEST ---------- */

function submitMockTest(
    autoSubmit = false
) {

    if (
        mockTestState.submitted
    ) {
        return;
    }

    mockTestState.submitted =
        true;

    if (mockTestState.timer) {

        clearInterval(
            mockTestState.timer
        );

        mockTestState.timer =
            null;
    }

    const result =
        calculateMockResult();

    saveData(
        "lastMockResult",
        {
            ...result,
            date:
                new Date()
                    .toISOString()
        }
    );

    renderMockResult(
        result
    );

    if (autoSubmit) {

        showToast(
            "Time ended. Test submitted automatically.",
            "warning"
        );

    } else {

        showToast(
            "Mock test submitted successfully.",
            "success"
        );
    }
}


/* ---------- RESET MOCK TEST ---------- */

function resetMockTest() {

    if (mockTestState.timer) {

        clearInterval(
            mockTestState.timer
        );
    }

    mockTestState.questions =
        [];

    mockTestState.currentQuestion =
        0;

    mockTestState.answers =
        {};

    mockTestState.timer =
        null;

    mockTestState.timeLeft =
        0;

    mockTestState.started =
        false;

    mockTestState.submitted =
        false;

    const result =
        document.querySelector(
            ".mock-result"
        );

    if (result) {
        result.style.display =
            "none";
    }
}


/* ---------- MOCK TEST EVENT SETUP ---------- */

function setupMockTestEvents() {

    const previous =
        document.querySelector(
            "[data-mock-previous]"
        );

    const next =
        document.querySelector(
            "[data-mock-next]"
        );

    const submit =
        document.querySelector(
            "[data-mock-submit]"
        );

    const start =
        document.querySelector(
            "[data-mock-start]"
        );

    const restart =
        document.querySelector(
            "[data-mock-restart]"
        );

    if (previous) {

        previous.addEventListener(
            "click",
            function () {
                previousMockQuestion();
            }
        );
    }

    if (next) {

        next.addEventListener(
            "click",
            function () {
                nextMockQuestion();
            }
        );
    }

    if (submit) {

        submit.addEventListener(
            "click",
            function () {

                confirmAction(
                    "Are you sure you want to submit the test?",
                    function () {
                        submitMockTest(false);
                    }
                );
            }
        );
    }

    if (start) {

        start.addEventListener(
            "click",
            function () {

                const duration =
                    Number(
                        start.getAttribute(
                            "data-duration"
                        ) || 10
                    );

                initializeMockTest(
                    null,
                    duration
                );
            }
        );
    }

    if (restart) {

        restart.addEventListener(
            "click",
            function () {

                resetMockTest();

                initializeMockTest(
                    null,
                    10
                );
            }
        );
    }
}


/* ---------- INITIALIZE PART 9 ---------- */

function initializePart9Systems() {

    setupMockTestEvents();
}


/* ---------- EXTEND INITIALIZATION ---------- */

const previousInitializePart9 =
    initializeSarkariiChij;

initializeSarkariiChij = function () {

    previousInitializePart9();

    try {

        initializePart9Systems();

    } catch (error) {

        console.warn(
            "Part 9 initialization failed:",
            error
        );
    }
};


/* ---------- GLOBAL MOCK API ---------- */

window.SarkariiChij =
    window.SarkariiChij ||
    {};


window.SarkariiChij.startMock =
    initializeMockTest;


window.SarkariiChij.submitMock =
    submitMockTest;


window.SarkariiChij.resetMock =
    resetMockTest;


window.SarkariiChij.nextMock =
    nextMockQuestion;


window.SarkariiChij.previousMock =
    previousMockQuestion;


window.SarkariiChij.mockResult =
    calculateMockResult;


/* ---------- END PART 9 ---------- */
/* =========================================================
   SCRIPT.JS — PART 10
   ELIGIBILITY CHECKER SYSTEM
   ========================================================= */

/* ---------- Numeric Helper ---------- */

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

/* ---------- Age From DOB ---------- */

function calculateAgeFromDOB(dob, referenceDate = new Date()) {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const currentDate = new Date(referenceDate);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  if (birthDate > currentDate) {
    return null;
  }

  let years =
    currentDate.getFullYear() -
    birthDate.getFullYear();

  let months =
    currentDate.getMonth() -
    birthDate.getMonth();

  let days =
    currentDate.getDate() -
    birthDate.getDate();

  if (days < 0) {
    months--;

    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalYears: years,
    totalMonths: years * 12 + months
  };
}

/* ---------- Age Eligibility ---------- */

function checkAgeEligibility(
  dob,
  minimumAge,
  maximumAge,
  referenceDate = new Date()
) {
  const age = calculateAgeFromDOB(
    dob,
    referenceDate
  );

  if (!age) {
    return {
      eligible: false,
      reason: "Invalid date of birth."
    };
  }

  const min = toNumber(minimumAge);
  const max = toNumber(maximumAge);

  const eligible =
    age.years >= min &&
    age.years <= max;

  return {
    eligible,
    age,
    minimumAge: min,
    maximumAge: max,
    reason: eligible
      ? "Age requirement satisfied."
      : `Required age: ${min}–${max} years.`
  };
}

/* ---------- Qualification Eligibility ---------- */

function checkQualificationEligibility(
  userQualification,
  requiredQualifications
) {
  if (!userQualification) {
    return {
      eligible: false,
      reason: "Qualification not provided."
    };
  }

  if (!Array.isArray(requiredQualifications)) {
    requiredQualifications = [
      requiredQualifications
    ];
  }

  const user = String(userQualification)
    .trim()
    .toLowerCase();

  const eligible =
    requiredQualifications.some(function (qualification) {
      return (
        String(qualification)
          .trim()
          .toLowerCase() === user
      );
    });

  return {
    eligible,
    userQualification,
    requiredQualifications,
    reason: eligible
      ? "Qualification requirement satisfied."
      : "Required qualification does not match."
  };
}

/* ---------- Percentage Eligibility ---------- */

function checkPercentageEligibility(
  percentage,
  minimumPercentage
) {
  const userPercentage = toNumber(percentage);
  const minimum = toNumber(minimumPercentage);

  const eligible =
    userPercentage >= minimum;

  return {
    eligible,
    percentage: userPercentage,
    minimumPercentage: minimum,
    reason: eligible
      ? "Percentage requirement satisfied."
      : `Minimum required percentage: ${minimum}%.`
  };
}

/* ---------- Height Eligibility ---------- */

function checkHeightEligibility(
  heightCm,
  minimumHeightCm
) {
  const height = toNumber(heightCm);
  const minimum = toNumber(minimumHeightCm);

  const eligible = height >= minimum;

  return {
    eligible,
    heightCm: height,
    minimumHeightCm: minimum,
    reason: eligible
      ? "Height requirement satisfied."
      : `Minimum required height: ${minimum} cm.`
  };
}

/* ---------- Category Eligibility ---------- */

function checkCategoryEligibility(
  userCategory,
  allowedCategories
) {
  if (!userCategory) {
    return {
      eligible: false,
      reason: "Category not provided."
    };
  }

  if (!Array.isArray(allowedCategories)) {
    allowedCategories = [
      allowedCategories
    ];
  }

  const user = String(userCategory)
    .trim()
    .toLowerCase();

  const eligible =
    allowedCategories.some(function (category) {
      return (
        String(category)
          .trim()
          .toLowerCase() === user
      );
    });

  return {
    eligible,
    userCategory,
    allowedCategories,
    reason: eligible
      ? "Category requirement satisfied."
      : "Category requirement does not match."
  };
}

/* ---------- Complete Eligibility Check ---------- */

function checkEligibility(options = {}) {
  const results = [];

  if (options.dob) {
    results.push({
      type: "age",
      ...checkAgeEligibility(
        options.dob,
        options.minimumAge ?? 0,
        options.maximumAge ?? 200,
        options.referenceDate
      )
    });
  }

  if (
    options.qualification &&
    options.requiredQualifications
  ) {
    results.push({
      type: "qualification",
      ...checkQualificationEligibility(
        options.qualification,
        options.requiredQualifications
      )
    });
  }

  if (
    options.percentage !== undefined &&
    options.minimumPercentage !== undefined
  ) {
    results.push({
      type: "percentage",
      ...checkPercentageEligibility(
        options.percentage,
        options.minimumPercentage
      )
    });
  }

  if (
    options.heightCm !== undefined &&
    options.minimumHeightCm !== undefined
  ) {
    results.push({
      type: "height",
      ...checkHeightEligibility(
        options.heightCm,
        options.minimumHeightCm
      )
    });
  }

  if (
    options.category &&
    options.allowedCategories
  ) {
    results.push({
      type: "category",
      ...checkCategoryEligibility(
        options.category,
        options.allowedCategories
      )
    });
  }

  const eligible =
    results.length > 0 &&
    results.every(function (item) {
      return item.eligible;
    });

  return {
    eligible,
    results,
    checkedAt: new Date().toISOString()
  };
}

/* ---------- Render Eligibility Result ---------- */

function renderEligibilityResult(
  result,
  target = "#eligibilityResult"
) {
  const element =
    typeof target === "string"
      ? $(target)
      : target;

  if (!element || !result) return;

  let html = "";

  if (result.eligible) {
    html += `
      <div class="eligibility-box eligible">
        <strong>✓ You appear eligible</strong>
        <p>All entered eligibility conditions are satisfied.</p>
      </div>
    `;
  } else {
    html += `
      <div class="eligibility-box not-eligible">
        <strong>✕ Eligibility not satisfied</strong>
        <p>One or more entered conditions are not satisfied.</p>
      </div>
    `;
  }

  if (Array.isArray(result.results)) {
    html += `<div class="eligibility-grid">`;

    result.results.forEach(function (item) {
      const statusClass =
        item.eligible
          ? "eligible"
          : "not-eligible";

      html += `
        <div class="eligibility-item ${statusClass}">
          <strong>
            ${escapeHTML(
              String(item.type || "Requirement")
            )}
          </strong>

          <p>
            ${escapeHTML(
              String(item.reason || "")
            )}
          </p>
        </div>
      `;
    });

    html += `</div>`;
  }

  element.innerHTML = html;
}

/* ---------- Eligibility Checker Form ---------- */

function setupEligibilityChecker() {
  const form = $("#eligibilityChecker");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const dob = $("#eligibilityDOB");
    const qualification = $("#eligibilityQualification");
    const percentage = $("#eligibilityPercentage");
    const height = $("#eligibilityHeight");
    const category = $("#eligibilityCategory");

    const minimumAge = form.dataset.minAge || 18;
    const maximumAge = form.dataset.maxAge || 40;
    const minimumPercentage =
      form.dataset.minPercentage || 0;
    const minimumHeight =
      form.dataset.minHeight || 0;

    const options = {
      dob: dob ? dob.value : "",
      minimumAge,
      maximumAge,
      qualification: qualification
        ? qualification.value
        : "",
      requiredQualifications:
        form.dataset.requiredQualification
          ? form.dataset.requiredQualification
              .split(",")
          : [],
      percentage: percentage
        ? percentage.value
        : undefined,
      minimumPercentage,
      heightCm: height
        ? height.value
        : undefined,
      minimumHeightCm: minimumHeight,
      category: category
        ? category.value
        : "",
      allowedCategories:
        form.dataset.allowedCategories
          ? form.dataset.allowedCategories
              .split(",")
          : []
    };

    const result = checkEligibility(options);

    renderEligibilityResult(
      result,
      "#eligibilityResult"
    );
  });
}

/* ---------- Automatic DOB Age Display ---------- */

function setupDOBAgeCalculation() {
  const dobInputs = $$(
    'input[type="date"][data-age-display]'
  );

  dobInputs.forEach(function (input) {
    const displaySelector =
      input.dataset.ageDisplay;

    input.addEventListener("change", function () {
      const age = calculateAgeFromDOB(
        input.value
      );

      const display =
        $(displaySelector);

      if (!display) return;

      if (!age) {
        display.textContent =
          "Invalid date";
        return;
      }

      display.textContent =
        `${age.years} Years, ` +
        `${age.months} Months, ` +
        `${age.days} Days`;
    });
  });
}

/* ---------- Part 10 Initializer ---------- */

function initializePart10Systems() {
  setupEligibilityChecker();
  setupDOBAgeCalculation();
}

/* ---------- Chain With Previous Initialization ---------- */

const previousInitializePart10 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart10();
  initializePart10Systems();
};

/* ---------- Global Eligibility API ---------- */

window.SarkariiChijEligibility = {
  calculateAgeFromDOB,
  checkAgeEligibility,
  checkQualificationEligibility,
  checkPercentageEligibility,
  checkHeightEligibility,
  checkCategoryEligibility,
  checkEligibility,
  renderEligibilityResult,
  setupEligibilityChecker
};

/* ---------- END PART 10 ---------- */
/* =========================================================
   SCRIPT.JS — PART 11
   CAREER TOOLS COMMON ENGINE
   ========================================================= */

/* ---------- Percentage Calculator ---------- */

function calculatePercentage(marks, total) {
  marks = Number(marks);
  total = Number(total);

  if (
    !Number.isFinite(marks) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return null;
  }

  return {
    marks,
    total,
    percentage: (marks / total) * 100
  };
}

function setupPercentageCalculator() {
  const form = $("#percentageCalculator");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const marks = parseFloat(
      $("#percentageMarks")?.value
    );

    const total = parseFloat(
      $("#percentageTotal")?.value
    );

    const result = calculatePercentage(
      marks,
      total
    );

    const output = $("#percentageResult");

    if (!output) return;

    if (!result) {
      output.innerHTML =
        `<div class="error-box">
          Please enter valid marks and total marks.
        </div>`;
      return;
    }

    output.innerHTML = `
      <div class="calculator-result">
        <strong>
          Percentage: ${result.percentage.toFixed(2)}%
        </strong>
        <p>
          Marks: ${result.marks} / ${result.total}
        </p>
      </div>
    `;
  });
}

/* ---------- Age Calculator ---------- */

function calculateDetailedAge(
  dob,
  referenceDate = new Date()
) {
  if (!dob) return null;

  const birth = new Date(dob);
  const current = new Date(referenceDate);

  if (
    Number.isNaN(birth.getTime()) ||
    Number.isNaN(current.getTime()) ||
    birth > current
  ) {
    return null;
  }

  let years =
    current.getFullYear() -
    birth.getFullYear();

  let months =
    current.getMonth() -
    birth.getMonth();

  let days =
    current.getDate() -
    birth.getDate();

  if (days < 0) {
    months--;

    const previousMonth = new Date(
      current.getFullYear(),
      current.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days
  };
}

function setupCareerAgeCalculator() {
  const form = $("#careerAgeCalculator");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const dob = $("#careerAgeDOB")?.value;
    const result = calculateDetailedAge(dob);
    const output = $("#careerAgeResult");

    if (!output) return;

    if (!result) {
      output.innerHTML =
        `<div class="error-box">
          Please enter a valid date of birth.
        </div>`;
      return;
    }

    output.innerHTML = `
      <div class="calculator-result">
        <strong>Your Age</strong>
        <p>
          ${result.years} Years,
          ${result.months} Months,
          ${result.days} Days
        </p>
      </div>
    `;
  });
}

/* ---------- Salary Calculator ---------- */

function calculateSalary(
  basicSalary,
  allowances,
  deductions
) {
  basicSalary = Number(basicSalary);
  allowances = Number(allowances);
  deductions = Number(deductions);

  if (
    !Number.isFinite(basicSalary) ||
    !Number.isFinite(allowances) ||
    !Number.isFinite(deductions)
  ) {
    return null;
  }

  const grossSalary =
    basicSalary + allowances;

  const inHandSalary =
    grossSalary - deductions;

  return {
    basicSalary,
    allowances,
    deductions,
    grossSalary,
    inHandSalary
  };
}

function setupSalaryCalculator() {
  const form = $("#salaryCalculator");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const basic =
      parseFloat(
        $("#salaryBasic")?.value
      ) || 0;

    const allowance =
      parseFloat(
        $("#salaryAllowance")?.value
      ) || 0;

    const deduction =
      parseFloat(
        $("#salaryDeduction")?.value
      ) || 0;

    const result = calculateSalary(
      basic,
      allowance,
      deduction
    );

    const output = $("#salaryResult");

    if (!output || !result) return;

    output.innerHTML = `
      <div class="calculator-result">

        <div class="info-row">
          <span>Basic Salary</span>
          <strong>
            ₹${formatNumber(result.basicSalary)}
          </strong>
        </div>

        <div class="info-row">
          <span>Allowances</span>
          <strong>
            ₹${formatNumber(result.allowances)}
          </strong>
        </div>

        <div class="info-row">
          <span>Gross Salary</span>
          <strong>
            ₹${formatNumber(result.grossSalary)}
          </strong>
        </div>

        <div class="info-row">
          <span>Deductions</span>
          <strong>
            ₹${formatNumber(result.deductions)}
          </strong>
        </div>

        <div class="info-row">
          <span>Estimated In-Hand</span>
          <strong>
            ₹${formatNumber(result.inHandSalary)}
          </strong>
        </div>

      </div>
    `;
  });
}

/* ---------- EMI Calculator ---------- */

function calculateEMI(
  principal,
  annualInterest,
  months
) {
  principal = Number(principal);
  annualInterest = Number(annualInterest);
  months = Number(months);

  if (
    principal <= 0 ||
    months <= 0 ||
    !Number.isFinite(principal) ||
    !Number.isFinite(annualInterest) ||
    !Number.isFinite(months)
  ) {
    return null;
  }

  const monthlyRate =
    annualInterest / 12 / 100;

  let emi;

  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(
      1 + monthlyRate,
      months
    );

    emi =
      (principal *
        monthlyRate *
        factor) /
      (factor - 1);
  }

  const totalPayment =
    emi * months;

  const totalInterest =
    totalPayment - principal;

  return {
    emi,
    totalPayment,
    totalInterest
  };
}

function setupCareerEMICalculator() {
  const form = $("#careerEMICalculator");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const principal =
      parseFloat(
        $("#careerEMIPrincipal")?.value
      );

    const rate =
      parseFloat(
        $("#careerEMIRate")?.value
      );

    const months =
      parseFloat(
        $("#careerEMIMonths")?.value
      );

    const result = calculateEMI(
      principal,
      rate,
      months
    );

    const output =
      $("#careerEMIResult");

    if (!output) return;

    if (!result) {
      output.innerHTML =
        `<div class="error-box">
          Please enter valid EMI details.
        </div>`;
      return;
    }

    output.innerHTML = `
      <div class="calculator-result">

        <div class="info-row">
          <span>Monthly EMI</span>
          <strong>
            ₹${result.emi.toFixed(2)}
          </strong>
        </div>

        <div class="info-row">
          <span>Total Interest</span>
          <strong>
            ₹${result.totalInterest.toFixed(2)}
          </strong>
        </div>

        <div class="info-row">
          <span>Total Payment</span>
          <strong>
            ₹${result.totalPayment.toFixed(2)}
          </strong>
        </div>

      </div>
    `;
  });
}

/* ---------- BMI Calculator ---------- */

function calculateCareerBMI(
  weightKg,
  heightCm
) {
  weightKg = Number(weightKg);
  heightCm = Number(heightCm);

  if (
    weightKg <= 0 ||
    heightCm <= 0 ||
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightCm)
  ) {
    return null;
  }

  const heightMeter =
    heightCm / 100;

  const bmi =
    weightKg /
    (heightMeter * heightMeter);

  let category;

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obesity";
  }

  return {
    bmi,
    category
  };
}

function setupCareerBMICalculator() {
  const form = $("#careerBMICalculator");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const weight =
      parseFloat(
        $("#careerBMIWeight")?.value
      );

    const height =
      parseFloat(
        $("#careerBMIHeight")?.value
      );

    const result =
      calculateCareerBMI(
        weight,
        height
      );

    const output =
      $("#careerBMIResult");

    if (!output) return;

    if (!result) {
      output.innerHTML =
        `<div class="error-box">
          Please enter valid height and weight.
        </div>`;
      return;
    }

    output.innerHTML = `
      <div class="calculator-result">
        <strong>
          BMI: ${result.bmi.toFixed(2)}
        </strong>
        <p>
          Category: ${result.category}
        </p>
      </div>
    `;
  });
}

/* ---------- Date Difference Calculator ---------- */

function calculateDateDifference(
  startDate,
  endDate
) {
  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return null;
  }

  const milliseconds =
    Math.abs(
      end.getTime() -
      start.getTime()
    );

  const days =
    Math.ceil(
      milliseconds /
      (1000 * 60 * 60 * 24)
    );

  return {
    days
  };
}

function setupDateDifferenceCalculator() {
  const form =
    $("#dateDifferenceCalculator");

  if (!form) return;

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const start =
        $("#dateDifferenceStart")?.value;

      const end =
        $("#dateDifferenceEnd")?.value;

      const result =
        calculateDateDifference(
          start,
          end
        );

      const output =
        $("#dateDifferenceResult");

      if (!output) return;

      if (!result) {
        output.innerHTML =
          `<div class="error-box">
            Please select valid dates.
          </div>`;
        return;
      }

      output.innerHTML = `
        <div class="calculator-result">
          <strong>
            ${result.days} Days
          </strong>
          <p>
            Difference between selected dates.
          </p>
        </div>
      `;
    }
  );
}

/* ---------- Career Tools Initializer ---------- */

function initializeCareerTools() {
  setupPercentageCalculator();
  setupCareerAgeCalculator();
  setupSalaryCalculator();
  setupCareerEMICalculator();
  setupCareerBMICalculator();
  setupDateDifferenceCalculator();
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart11 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart11();
  initializeCareerTools();
};

/* ---------- Global Career Tools API ---------- */

window.SarkariiChijCareerTools = {
  calculatePercentage,
  calculateDetailedAge,
  calculateSalary,
  calculateEMI,
  calculateCareerBMI,
  calculateDateDifference,
  initializeCareerTools
};

/* ---------- END PART 11 ---------- */
/* =========================================================
   SCRIPT.JS — PART 12
   JOB DETAILS + JOB ACTIONS ENGINE
   ========================================================= */

/* ---------- Job Database ---------- */

const SarkariiChijJobs = [
  {
    id: "ssc-chsl",
    title: "SSC CHSL",
    department: "Staff Selection Commission",
    category: "SSC",
    qualification: "12th Pass",
    state: "All India",
    jobType: "Central Government",
    salary: "As per post",
    officialWebsite: "https://ssc.gov.in/"
  },

  {
    id: "ssc-cgl",
    title: "SSC CGL",
    department: "Staff Selection Commission",
    category: "SSC",
    qualification: "Graduate",
    state: "All India",
    jobType: "Central Government",
    salary: "As per post",
    officialWebsite: "https://ssc.gov.in/"
  },

  {
    id: "ssc-gd",
    title: "SSC GD Constable",
    department: "Staff Selection Commission",
    category: "SSC GD",
    qualification: "10th Pass",
    state: "All India",
    jobType: "Central Government",
    salary: "As per notification",
    officialWebsite: "https://ssc.gov.in/"
  },

  {
    id: "india-post-gds",
    title: "India Post GDS",
    department: "India Post",
    category: "Postal",
    qualification: "10th Pass",
    state: "All India",
    jobType: "Government",
    salary: "As per notification",
    officialWebsite: "https://indiapostgdsonline.gov.in/"
  },

  {
    id: "rrb-group-d",
    title: "RRB Group D",
    department: "Railway Recruitment Board",
    category: "Railway",
    qualification: "10th / ITI",
    state: "All India",
    jobType: "Central Government",
    salary: "As per notification",
    officialWebsite: "https://www.rrbcdg.gov.in/"
  },

  {
    id: "rrb-ntpc",
    title: "RRB NTPC",
    department: "Railway Recruitment Board",
    category: "Railway",
    qualification: "12th / Graduate",
    state: "All India",
    jobType: "Central Government",
    salary: "As per post",
    officialWebsite: "https://www.rrbcdg.gov.in/"
  },

  {
    id: "up-police",
    title: "UP Police",
    department: "Uttar Pradesh Police",
    category: "Police",
    qualification: "As per notification",
    state: "Uttar Pradesh",
    jobType: "State Government",
    salary: "As per notification",
    officialWebsite: "https://uppbpb.gov.in/"
  },

  {
    id: "upsssc-pet",
    title: "UPSSSC PET",
    department: "Uttar Pradesh Subordinate Services Selection Commission",
    category: "UPSSSC",
    qualification: "10th Pass",
    state: "Uttar Pradesh",
    jobType: "State Government",
    salary: "Not applicable",
    officialWebsite: "https://upsssc.gov.in/"
  }
];

/* ---------- Find Job ---------- */

function findSarkariiChijJob(jobId) {
  return SarkariiChijJobs.find(function (job) {
    return String(job.id) === String(jobId);
  }) || null;
}

/* ---------- Get Job From URL ---------- */

function getJobIdFromURL() {
  const params = new URLSearchParams(
    window.location.search
  );

  return (
    params.get("job") ||
    params.get("jobId") ||
    params.get("id")
  );
}

/* ---------- Job Details HTML ---------- */

function renderJobDetails(
  job,
  target = "#jobDetails"
) {
  const element =
    typeof target === "string"
      ? $(target)
      : target;

  if (!element || !job) return;

  element.innerHTML = `
    <article class="job-detail">

      <div class="job-detail-header">

        <div>
          <span class="job-badge">
            ${escapeHTML(job.category)}
          </span>

          <h1>
            ${escapeHTML(job.title)}
          </h1>

          <p>
            ${escapeHTML(job.department)}
          </p>
        </div>

      </div>

      <div class="job-detail-meta">

        <div class="info-card">
          <strong>Qualification</strong>
          <span>
            ${escapeHTML(job.qualification)}
          </span>
        </div>

        <div class="info-card">
          <strong>State</strong>
          <span>
            ${escapeHTML(job.state)}
          </span>
        </div>

        <div class="info-card">
          <strong>Job Type</strong>
          <span>
            ${escapeHTML(job.jobType)}
          </span>
        </div>

        <div class="info-card">
          <strong>Salary</strong>
          <span>
            ${escapeHTML(job.salary)}
          </span>
        </div>

      </div>

      <div class="job-detail-body">

        <h2>Job Information</h2>

        <div class="info-grid">

          <div class="info-row">
            <span>Post</span>
            <strong>
              ${escapeHTML(job.title)}
            </strong>
          </div>

          <div class="info-row">
            <span>Department</span>
            <strong>
              ${escapeHTML(job.department)}
            </strong>
          </div>

          <div class="info-row">
            <span>Qualification</span>
            <strong>
              ${escapeHTML(job.qualification)}
            </strong>
          </div>

          <div class="info-row">
            <span>State</span>
            <strong>
              ${escapeHTML(job.state)}
            </strong>
          </div>

        </div>

        <div class="action-links">

          <button
            type="button"
            class="btn btn-primary"
            data-save-job="${escapeHTML(job.id)}">
            Save Job
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            data-reminder-job="${escapeHTML(job.id)}">
            Set Reminder
          </button>

          <a
            class="btn btn-success"
            href="${escapeHTML(job.officialWebsite)}"
            target="_blank"
            rel="noopener noreferrer">
            Official Website
          </a>

        </div>

      </div>

    </article>
  `;

  setupSavedJobEvents();
  setupReminderEvents();
}

/* ---------- Job List Renderer ---------- */

function renderSarkariiChijJobs(
  jobs = SarkariiChijJobs,
  target = "#jobList"
) {
  const element =
    typeof target === "string"
      ? $(target)
      : target;

  if (!element) return;

  if (!Array.isArray(jobs) || jobs.length === 0) {
    element.innerHTML = `
      <div class="empty-box">
        No jobs found.
      </div>
    `;
    return;
  }

  element.innerHTML = jobs.map(function (job) {
    return `
      <article
        class="job-card"
        data-job-id="${escapeHTML(job.id)}">

        <span class="job-badge">
          ${escapeHTML(job.category)}
        </span>

        <h3>
          ${escapeHTML(job.title)}
        </h3>

        <p>
          ${escapeHTML(job.department)}
        </p>

        <div class="job-meta">
          <span>
            ${escapeHTML(job.qualification)}
          </span>

          <span>
            ${escapeHTML(job.state)}
          </span>
        </div>

        <div class="job-actions">

          <button
            type="button"
            class="btn btn-primary"
            data-view-job="${escapeHTML(job.id)}">
            View Details
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            data-save-job="${escapeHTML(job.id)}">
            Save
          </button>

        </div>

      </article>
    `;
  }).join("");

  setupJobCardEvents();
  setupSavedJobEvents();
}

/* ---------- View Job ---------- */

function openJobDetails(jobId) {
  const job = findSarkariiChijJob(jobId);

  if (!job) {
    showToast(
      "Job details not found.",
      "error"
    );
    return;
  }

  const currentPage =
    window.location.pathname
      .split("/")
      .pop();

  if (
    currentPage !== "jobs.html" &&
    !$("#jobDetails")
  ) {
    window.location.href =
      `jobs.html?job=${encodeURIComponent(job.id)}`;

    return;
  }

  renderJobDetails(
    job,
    "#jobDetails"
  );

  scrollToElement("#jobDetails");
}

/* ---------- Job Card Events ---------- */

function setupJobCardEvents() {
  $$("[data-view-job]").forEach(function (button) {
    button.addEventListener(
      "click",
      function () {
        openJobDetails(
          button.dataset.viewJob
        );
      }
    );
  });
}

/* ---------- Job Page Initializer ---------- */

function initializeJobSystem() {
  const jobId =
    getJobIdFromURL();

  if (jobId) {
    const job =
      findSarkariiChijJob(jobId);

    if (job && $("#jobDetails")) {
      renderJobDetails(
        job,
        "#jobDetails"
      );
    }
  }

  if ($("#jobList")) {
    renderSarkariiChijJobs();
  }
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart12 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart12();
  initializeJobSystem();
};

/* ---------- Global Job API ---------- */

window.SarkariiChijJobs = {
  database: SarkariiChijJobs,
  find: findSarkariiChijJob,
  renderList: renderSarkariiChijJobs,
  renderDetails: renderJobDetails,
  openDetails: openJobDetails,
  initialize: initializeJobSystem
};

/* ---------- END PART 12 ---------- */
/* =========================================================
   SCRIPT.JS — PART 13
   JOB FILTER + SEARCH + SORT ENGINE
   ========================================================= */

/* ---------- Filter Jobs ---------- */

function filterSarkariiChijJobs(filters = {}) {
  let jobs = [...SarkariiChijJobs];

  const search = String(
    filters.search || ""
  ).trim().toLowerCase();

  const qualification = String(
    filters.qualification || ""
  ).trim().toLowerCase();

  const category = String(
    filters.category || ""
  ).trim().toLowerCase();

  const state = String(
    filters.state || ""
  ).trim().toLowerCase();

  const jobType = String(
    filters.jobType || ""
  ).trim().toLowerCase();

  if (search) {
    jobs = jobs.filter(function (job) {
      const text = [
        job.title,
        job.department,
        job.category,
        job.qualification,
        job.state,
        job.jobType
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }

  if (qualification) {
    jobs = jobs.filter(function (job) {
      return String(job.qualification)
        .toLowerCase()
        .includes(qualification);
    });
  }

  if (category) {
    jobs = jobs.filter(function (job) {
      return String(job.category)
        .toLowerCase()
        .includes(category);
    });
  }

  if (state) {
    jobs = jobs.filter(function (job) {
      return String(job.state)
        .toLowerCase()
        .includes(state);
    });
  }

  if (jobType) {
    jobs = jobs.filter(function (job) {
      return String(job.jobType)
        .toLowerCase()
        .includes(jobType);
    });
  }

  return jobs;
}

/* ---------- Sort Jobs ---------- */

function sortSarkariiChijJobs(
  jobs,
  sortType = "latest"
) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  const sorted = [...jobs];

  if (sortType === "name") {
    sorted.sort(function (a, b) {
      return a.title.localeCompare(
        b.title
      );
    });
  }

  if (sortType === "department") {
    sorted.sort(function (a, b) {
      return a.department.localeCompare(
        b.department
      );
    });
  }

  if (sortType === "qualification") {
    sorted.sort(function (a, b) {
      return a.qualification.localeCompare(
        b.qualification
      );
    });
  }

  return sorted;
}

/* ---------- Read Job Filters ---------- */

function getJobFilterValues() {
  return {
    search:
      $("#jobSearch")?.value || "",

    qualification:
      $("#jobQualification")?.value || "",

    category:
      $("#jobCategory")?.value || "",

    state:
      $("#jobState")?.value || "",

    jobType:
      $("#jobType")?.value || "",

    sort:
      $("#jobSort")?.value || "latest"
  };
}

/* ---------- Apply Job Filters ---------- */

function applySarkariiChijJobFilters() {
  const filters =
    getJobFilterValues();

  let jobs =
    filterSarkariiChijJobs(filters);

  jobs =
    sortSarkariiChijJobs(
      jobs,
      filters.sort
    );

  renderSarkariiChijJobs(
    jobs,
    "#jobList"
  );

  updateJobFilterCount(
    jobs.length
  );
}

/* ---------- Filter Count ---------- */

function updateJobFilterCount(count) {
  const elements = [
    "#jobFilterCount",
    "#jobResultsCount",
    "[data-job-count]"
  ];

  elements.forEach(function (selector) {
    const element = $(selector);

    if (element) {
      element.textContent =
        `${count} Jobs Found`;
    }
  });
}

/* ---------- Setup Job Search ---------- */

function setupJobSearch() {
  const input =
    $("#jobSearch");

  if (!input) return;

  let timer = null;

  input.addEventListener(
    "input",
    function () {
      clearTimeout(timer);

      timer = setTimeout(
        function () {
          applySarkariiChijJobFilters();
        },
        250
      );
    }
  );
}

/* ---------- Setup Job Select Filters ---------- */

function setupJobSelectFilters() {
  const selectors = [
    "#jobQualification",
    "#jobCategory",
    "#jobState",
    "#jobType",
    "#jobSort"
  ];

  selectors.forEach(function (selector) {
    const element = $(selector);

    if (!element) return;

    element.addEventListener(
      "change",
      function () {
        applySarkariiChijJobFilters();
      }
    );
  });
}

/* ---------- Reset Job Filters ---------- */

function resetSarkariiChijJobFilters() {
  const fields = [
    "#jobSearch",
    "#jobQualification",
    "#jobCategory",
    "#jobState",
    "#jobType"
  ];

  fields.forEach(function (selector) {
    const element = $(selector);

    if (element) {
      element.value = "";
    }
  });

  const sort =
    $("#jobSort");

  if (sort) {
    sort.value = "latest";
  }

  renderSarkariiChijJobs(
    SarkariiChijJobs,
    "#jobList"
  );

  updateJobFilterCount(
    SarkariiChijJobs.length
  );
}

/* ---------- Reset Button ---------- */

function setupJobFilterReset() {
  const buttons = $$(
    "#resetJobFilters, " +
    "[data-reset-job-filters]"
  );

  buttons.forEach(function (button) {
    button.addEventListener(
      "click",
      function () {
        resetSarkariiChijJobFilters();
      }
    );
  });
}

/* ---------- Search On Enter ---------- */

function setupJobSearchEnter() {
  const input =
    $("#jobSearch");

  if (!input) return;

  input.addEventListener(
    "keydown",
    function (event) {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      applySarkariiChijJobFilters();
    }
  );
}

/* ---------- Job Filter Initializer ---------- */

function initializeJobFilterSystem() {
  setupJobSearch();
  setupJobSearchEnter();
  setupJobSelectFilters();
  setupJobFilterReset();

  if ($("#jobList")) {
    updateJobFilterCount(
      SarkariiChijJobs.length
    );
  }
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart13 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart13();
  initializeJobFilterSystem();
};

/* ---------- Global Filter API ---------- */

window.SarkariiChijJobFilters = {
  filter: filterSarkariiChijJobs,
  sort: sortSarkariiChijJobs,
  apply: applySarkariiChijJobFilters,
  reset: resetSarkariiChijJobFilters,
  getValues: getJobFilterValues,
  initialize: initializeJobFilterSystem
};

/* ---------- END PART 13 ---------- */
/* =========================================================
   SCRIPT.JS — PART 14
   JOB PAGE URL + DETAIL ACTIONS + APPLY SYSTEM
   ========================================================= */

/* ---------- Official Link Safety ---------- */

function isSafeExternalURL(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    );
  } catch (error) {
    return false;
  }
}

/* ---------- Open Official Website ---------- */

function openOfficialWebsite(jobId) {
  const job =
    findSarkariiChijJob(jobId);

  if (!job) {
    showToast(
      "Job not found.",
      "error"
    );
    return;
  }

  if (
    !job.officialWebsite ||
    !isSafeExternalURL(
      job.officialWebsite
    )
  ) {
    showToast(
      "Official website is not available.",
      "warning"
    );
    return;
  }

  window.open(
    job.officialWebsite,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ---------- Generate Job Detail URL ---------- */

function getJobDetailURL(jobId) {
  return (
    "jobs.html?job=" +
    encodeURIComponent(jobId)
  );
}

/* ---------- Copy Job Link ---------- */

function copyJobLink(jobId) {
  const url =
    new URL(
      getJobDetailURL(jobId),
      window.location.href
    ).href;

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {
    navigator.clipboard
      .writeText(url)
      .then(function () {
        showToast(
          "Job link copied.",
          "success"
        );
      })
      .catch(function () {
        fallbackCopyText(url);
      });

    return;
  }

  fallbackCopyText(url);
}

/* ---------- Fallback Copy ---------- */

function fallbackCopyText(text) {
  const textarea =
    document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(
    textarea
  );

  textarea.select();

  try {
    document.execCommand("copy");

    showToast(
      "Job link copied.",
      "success"
    );
  } catch (error) {
    showToast(
      "Unable to copy link.",
      "error"
    );
  }

  textarea.remove();
}

/* ---------- Share Job ---------- */

function shareJob(jobId) {
  const job =
    findSarkariiChijJob(jobId);

  if (!job) {
    showToast(
      "Job not found.",
      "error"
    );
    return;
  }

  const url =
    new URL(
      getJobDetailURL(jobId),
      window.location.href
    ).href;

  const shareData = {
    title: job.title,
    text:
      `${job.title} - ` +
      `${job.department}`,
    url
  };

  if (
    navigator.share &&
    typeof navigator.share === "function"
  ) {
    navigator.share(
      shareData
    ).catch(function () {
      /* User cancelled share */
    });

    return;
  }

  copyJobLink(jobId);
}

/* ---------- Apply Button ---------- */

function applyForJob(jobId) {
  const job =
    findSarkariiChijJob(jobId);

  if (!job) {
    showToast(
      "Job not found.",
      "error"
    );
    return;
  }

  if (
    !job.officialWebsite ||
    !isSafeExternalURL(
      job.officialWebsite
    )
  ) {
    showToast(
      "Official application link is not available.",
      "warning"
    );
    return;
  }

  /*
   * Only the official website is opened.
   * No fake application URL is generated.
   */

  window.open(
    job.officialWebsite,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ---------- Notification Link ---------- */

function openJobFromNotification(jobId) {
  if (!jobId) return;

  const job =
    findSarkariiChijJob(jobId);

  if (!job) {
    showToast(
      "Job information not available.",
      "error"
    );
    return;
  }

  window.location.href =
    getJobDetailURL(job.id);
}

/* ---------- Job Action Buttons ---------- */

function setupJobActionButtons() {
  $$("[data-open-official]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          openOfficialWebsite(
            button.dataset.openOfficial
          );
        }
      );
    }
  );

  $$("[data-apply-job]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          applyForJob(
            button.dataset.applyJob
          );
        }
      );
    }
  );

  $$("[data-copy-job]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          copyJobLink(
            button.dataset.copyJob
          );
        }
      );
    }
  );

  $$("[data-share-job]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          shareJob(
            button.dataset.shareJob
          );
        }
      );
    }
  );

  $$("[data-open-job]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          openJobDetails(
            button.dataset.openJob
          );
        }
      );
    }
  );
}

/* ---------- Enhance Job Details ---------- */

function addJobDetailActions(job) {
  const container =
    $("#jobDetails");

  if (!container || !job) return;

  const actionArea =
    container.querySelector(
      ".job-detail-body"
    );

  if (!actionArea) return;

  const existing =
    actionArea.querySelector(
      ".job-extra-actions"
    );

  if (existing) {
    existing.remove();
  }

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "action-links job-extra-actions";

  wrapper.innerHTML = `
    <button
      type="button"
      class="btn btn-success"
      data-apply-job="${escapeHTML(job.id)}">
      Apply / Official Portal
    </button>

    <button
      type="button"
      class="btn btn-secondary"
      data-copy-job="${escapeHTML(job.id)}">
      Copy Link
    </button>

    <button
      type="button"
      class="btn btn-secondary"
      data-share-job="${escapeHTML(job.id)}">
      Share
    </button>
  `;

  actionArea.appendChild(
    wrapper
  );

  setupJobActionButtons();
}

/* ---------- Job Detail Initialization ---------- */

function initializeJobDetailActions() {
  const jobId =
    getJobIdFromURL();

  if (!jobId) return;

  const job =
    findSarkariiChijJob(jobId);

  if (!job) return;

  addJobDetailActions(job);
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart14 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart14();
  setupJobActionButtons();
  initializeJobDetailActions();
};

/* ---------- Global Job Action API ---------- */

window.SarkariiChijJobActions = {
  openOfficialWebsite,
  getJobDetailURL,
  copyJobLink,
  shareJob,
  applyForJob,
  openJobFromNotification,
  initializeJobDetailActions
};

/* ---------- END PART 14 ---------- */
/* =========================================================
   SCRIPT.JS — PART 15
   RESULTS / ADMIT CARD / SYLLABUS / CUTOFF / PAPERS
   COMMON RESOURCE ENGINE
   ========================================================= */

/* ---------- Resource Database ---------- */

const SarkariiChijResources = {
  results: [
    {
      id: "ssc-result",
      title: "SSC Results",
      department: "Staff Selection Commission",
      type: "Result",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "rrb-result",
      title: "Railway Results",
      department: "Railway Recruitment Boards",
      type: "Result",
      officialWebsite: "https://www.rrbcdg.gov.in/"
    },
    {
      id: "up-result",
      title: "UP Government Exam Results",
      department: "Uttar Pradesh",
      type: "Result",
      officialWebsite: "https://up.gov.in/"
    }
  ],

  admitCards: [
    {
      id: "ssc-admit-card",
      title: "SSC Admit Card",
      department: "Staff Selection Commission",
      type: "Admit Card",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "rrb-admit-card",
      title: "Railway Admit Card",
      department: "Railway Recruitment Boards",
      type: "Admit Card",
      officialWebsite: "https://www.rrbcdg.gov.in/"
    }
  ],

  syllabus: [
    {
      id: "ssc-chsl-syllabus",
      title: "SSC CHSL Syllabus",
      department: "Staff Selection Commission",
      type: "Syllabus",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "ssc-cgl-syllabus",
      title: "SSC CGL Syllabus",
      department: "Staff Selection Commission",
      type: "Syllabus",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "ssc-gd-syllabus",
      title: "SSC GD Syllabus",
      department: "Staff Selection Commission",
      type: "Syllabus",
      officialWebsite: "https://ssc.gov.in/"
    }
  ],

  cutoffs: [
    {
      id: "ssc-cutoff",
      title: "SSC Cut Off",
      department: "Staff Selection Commission",
      type: "Cut Off",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "rrb-cutoff",
      title: "Railway Cut Off",
      department: "Railway Recruitment Boards",
      type: "Cut Off",
      officialWebsite: "https://www.rrbcdg.gov.in/"
    }
  ],

  papers: [
    {
      id: "ssc-chsl-papers",
      title: "SSC CHSL Previous Year Papers",
      department: "Staff Selection Commission",
      type: "Previous Papers",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "ssc-cgl-papers",
      title: "SSC CGL Previous Year Papers",
      department: "Staff Selection Commission",
      type: "Previous Papers",
      officialWebsite: "https://ssc.gov.in/"
    },
    {
      id: "ssc-gd-papers",
      title: "SSC GD Previous Year Papers",
      department: "Staff Selection Commission",
      type: "Previous Papers",
      officialWebsite: "https://ssc.gov.in/"
    }
  ]
};

/* ---------- Get Resource Collection ---------- */

function getResourceCollection(type) {
  const collections = {
    results:
      SarkariiChijResources.results,

    admitCards:
      SarkariiChijResources.admitCards,

    syllabus:
      SarkariiChijResources.syllabus,

    cutoffs:
      SarkariiChijResources.cutoffs,

    papers:
      SarkariiChijResources.papers
  };

  return collections[type] || [];
}

/* ---------- Find Resource ---------- */

function findSarkariiChijResource(
  type,
  resourceId
) {
  const collection =
    getResourceCollection(type);

  return collection.find(
    function (item) {
      return (
        String(item.id) ===
        String(resourceId)
      );
    }
  ) || null;
}

/* ---------- Resource Search ---------- */

function searchSarkariiChijResources(
  type,
  query
) {
  const collection =
    getResourceCollection(type);

  const search =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!search) {
    return collection;
  }

  return collection.filter(
    function (item) {
      const text = [
        item.title,
        item.department,
        item.type
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    }
  );
}

/* ---------- Resource Card ---------- */

function createResourceCard(item) {
  if (!item) return "";

  const officialLink =
    isSafeExternalURL(
      item.officialWebsite
    )
      ? item.officialWebsite
      : "#";

  return `
    <article
      class="resource-card"
      data-resource-id="${escapeHTML(item.id)}">

      <span class="badge badge-primary">
        ${escapeHTML(item.type)}
      </span>

      <h3>
        ${escapeHTML(item.title)}
      </h3>

      <p>
        ${escapeHTML(item.department)}
      </p>

      <div class="action-links">

        <a
          href="${escapeHTML(officialLink)}"
          class="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer">
          Official Website
        </a>

        <button
          type="button"
          class="btn btn-secondary"
          data-copy-resource="${escapeHTML(item.id)}">
          Copy Link
        </button>

      </div>

    </article>
  `;
}

/* ---------- Render Resources ---------- */

function renderSarkariiChijResources(
  type,
  target = "#resourceList",
  query = ""
) {
  const element =
    typeof target === "string"
      ? $(target)
      : target;

  if (!element) return;

  const resources =
    searchSarkariiChijResources(
      type,
      query
    );

  if (!resources.length) {
    element.innerHTML = `
      <div class="empty-box">
        No resource found.
      </div>
    `;
    return;
  }

  element.innerHTML =
    resources
      .map(createResourceCard)
      .join("");

  setupResourceButtons();
}

/* ---------- Resource URL ---------- */

function getResourceURL(
  type,
  resourceId
) {
  const pageMap = {
    results: "results.html",
    admitCards: "admit-card.html",
    syllabus: "syllabus.html",
    cutoffs: "cutoff.html",
    papers: "papers.html"
  };

  const page =
    pageMap[type];

  if (!page) return "#";

  return (
    page +
    "?resource=" +
    encodeURIComponent(resourceId)
  );
}

/* ---------- Copy Resource Link ---------- */

function copyResourceLink(
  type,
  resourceId
) {
  const relativeURL =
    getResourceURL(
      type,
      resourceId
    );

  if (relativeURL === "#") {
    showToast(
      "Resource link unavailable.",
      "error"
    );
    return;
  }

  const fullURL =
    new URL(
      relativeURL,
      window.location.href
    ).href;

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {
    navigator.clipboard
      .writeText(fullURL)
      .then(function () {
        showToast(
          "Resource link copied.",
          "success"
        );
      })
      .catch(function () {
        fallbackCopyText(fullURL);
      });

    return;
  }

  fallbackCopyText(fullURL);
}

/* ---------- Resource Buttons ---------- */

function setupResourceButtons() {
  $$("[data-copy-resource]").forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          const id =
            button.dataset.copyResource;

          const resourceTypes = [
            "results",
            "admitCards",
            "syllabus",
            "cutoffs",
            "papers"
          ];

          let foundType = null;

          resourceTypes.some(
            function (type) {
              if (
                findSarkariiChijResource(
                  type,
                  id
                )
              ) {
                foundType = type;
                return true;
              }

              return false;
            }
          );

          if (foundType) {
            copyResourceLink(
              foundType,
              id
            );
          }
        }
      );
    }
  );
}

/* ---------- Resource Page Setup ---------- */

function initializeResourceSystem() {
  const page =
    getCurrentPage();

  const pageMap = {
    "results.html": "results",
    "admit-card.html": "admitCards",
    "syllabus.html": "syllabus",
    "cutoff.html": "cutoffs",
    "papers.html": "papers"
  };

  const type =
    pageMap[page];

  if (!type) return;

  const searchInput =
    $("#resourceSearch");

  if (searchInput) {
    let timer = null;

    searchInput.addEventListener(
      "input",
      function () {
        clearTimeout(timer);

        timer = setTimeout(
          function () {
            renderSarkariiChijResources(
              type,
              "#resourceList",
              searchInput.value
            );
          },
          200
        );
      }
    );
  }

  if ($("#resourceList")) {
    renderSarkariiChijResources(
      type,
      "#resourceList"
    );
  }
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart15 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {
  previousInitializePart15();
  initializeResourceSystem();
};

/* ---------- Global Resource API ---------- */

window.SarkariiChijResources = {
  database: SarkariiChijResources,
  getCollection: getResourceCollection,
  find: findSarkariiChijResource,
  search: searchSarkariiChijResources,
  render: renderSarkariiChijResources,
  getURL: getResourceURL,
  copyLink: copyResourceLink,
  initialize: initializeResourceSystem
};

/* ---------- END PART 15 ---------- */
/* =========================================================
   SCRIPT.JS — PART 16
   ADMISSION + SCHOLARSHIP + YOJANA + SARKARI KAAM ENGINE
   ========================================================= */

/* ---------- Common Service Database ---------- */

const SarkariiChijServices = {

  admission: [
    {
      id: "up-admission",
      title: "UP College Admission",
      category: "Admission",
      state: "Uttar Pradesh",
      description: "College and university admission information.",
      officialWebsite: "https://up.gov.in/"
    },
    {
      id: "university-admission",
      title: "University Admission",
      category: "Admission",
      state: "All India",
      description: "Admission related information and official portals.",
      officialWebsite: "https://www.ugc.gov.in/"
    }
  ],

  scholarship: [
    {
      id: "up-scholarship",
      title: "UP Scholarship",
      category: "Scholarship",
      state: "Uttar Pradesh",
      description: "UP government scholarship information.",
      officialWebsite: "https://scholarship.up.gov.in/"
    },
    {
      id: "national-scholarship",
      title: "National Scholarship Portal",
      category: "Scholarship",
      state: "All India",
      description: "Central and state scholarship services.",
      officialWebsite: "https://scholarships.gov.in/"
    }
  ],

  yojana: [
    {
      id: "pm-kisan",
      title: "PM-KISAN",
      category: "Sarkari Yojana",
      state: "All India",
      description: "Government scheme information for eligible farmers.",
      officialWebsite: "https://pmkisan.gov.in/"
    },
    {
      id: "ayushman-bharat",
      title: "Ayushman Bharat",
      category: "Sarkari Yojana",
      state: "All India",
      description: "Government health scheme information.",
      officialWebsite: "https://pmjay.gov.in/"
    }
  ],

  sarkariKaam: [
    {
      id: "income-certificate",
      title: "Income Certificate",
      category: "Sarkari Kaam",
      state: "Uttar Pradesh",
      description: "Income certificate related government service.",
      officialWebsite: "https://edistrict.up.gov.in/"
    },
    {
      id: "caste-certificate",
      title: "Caste Certificate",
      category: "Sarkari Kaam",
      state: "Uttar Pradesh",
      description: "Caste certificate related government service.",
      officialWebsite: "https://edistrict.up.gov.in/"
    },
    {
      id: "domicile-certificate",
      title: "Domicile Certificate",
      category: "Sarkari Kaam",
      state: "Uttar Pradesh",
      description: "Residence/domicile certificate service.",
      officialWebsite: "https://edistrict.up.gov.in/"
    }
  ]
};

/* ---------- Get Service Collection ---------- */

function getServiceCollection(type) {
  return (
    SarkariiChijServices[type] || []
  );
}

/* ---------- Find Service ---------- */

function findSarkariiChijService(
  type,
  serviceId
) {
  return getServiceCollection(type).find(
    function (service) {
      return (
        String(service.id) ===
        String(serviceId)
      );
    }
  ) || null;
}

/* ---------- Search Services ---------- */

function searchSarkariiChijServices(
  type,
  query
) {
  const collection =
    getServiceCollection(type);

  const search =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!search) {
    return collection;
  }

  return collection.filter(
    function (service) {

      const text = [
        service.title,
        service.category,
        service.state,
        service.description
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    }
  );
}

/* ---------- Service Card ---------- */

function createServiceCard(service) {
  if (!service) return "";

  const website =
    isSafeExternalURL(
      service.officialWebsite
    )
      ? service.officialWebsite
      : "#";

  return `
    <article
      class="service-card"
      data-service-id="${escapeHTML(service.id)}">

      <div class="service-icon">
        ✓
      </div>

      <span class="badge badge-primary">
        ${escapeHTML(service.category)}
      </span>

      <h3>
        ${escapeHTML(service.title)}
      </h3>

      <p>
        ${escapeHTML(service.description)}
      </p>

      <div class="service-meta">
        <span>
          ${escapeHTML(service.state)}
        </span>
      </div>

      <div class="action-links">

        <a
          href="${escapeHTML(website)}"
          class="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer">
          Official Portal
        </a>

        <button
          type="button"
          class="btn btn-secondary"
          data-copy-service="${escapeHTML(service.id)}">
          Copy Link
        </button>

      </div>

    </article>
  `;
}

/* ---------- Render Services ---------- */

function renderSarkariiChijServices(
  type,
  target = "#serviceList",
  query = ""
) {
  const element =
    typeof target === "string"
      ? $(target)
      : target;

  if (!element) return;

  const services =
    searchSarkariiChijServices(
      type,
      query
    );

  if (!services.length) {
    element.innerHTML = `
      <div class="empty-box">
        No service found.
      </div>
    `;

    return;
  }

  element.innerHTML =
    services
      .map(createServiceCard)
      .join("");

  setupServiceButtons();
}

/* ---------- Service Page Map ---------- */

function getServiceTypeFromPage() {
  const page =
    getCurrentPage();

  const map = {
    "admission.html": "admission",
    "scholarship.html": "scholarship",
    "yojana.html": "yojana",
    "sarkari-kaam.html": "sarkariKaam"
  };

  return map[page] || null;
}

/* ---------- Service Search Setup ---------- */

function setupServiceSearch(type) {
  const input =
    $("#serviceSearch");

  if (!input) return;

  let timer = null;

  input.addEventListener(
    "input",
    function () {

      clearTimeout(timer);

      timer = setTimeout(
        function () {

          renderSarkariiChijServices(
            type,
            "#serviceList",
            input.value
          );

        },
        200
      );
    }
  );
}

/* ---------- Service Buttons ---------- */

function setupServiceButtons() {
  $$("[data-copy-service]").forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const serviceId =
            button.dataset.copyService;

          let foundType = null;

          Object.keys(
            SarkariiChijServices
          ).some(
            function (type) {

              if (
                findSarkariiChijService(
                  type,
                  serviceId
                )
              ) {
                foundType = type;
                return true;
              }

              return false;
            }
          );

          if (!foundType) {
            showToast(
              "Service not found.",
              "error"
            );

            return;
          }

          const pageMap = {
            admission:
              "admission.html",

            scholarship:
              "scholarship.html",

            yojana:
              "yojana.html",

            sarkariKaam:
              "sarkari-kaam.html"
          };

          const page =
            pageMap[foundType];

          if (!page) return;

          const url =
            new URL(
              `${page}?service=${encodeURIComponent(serviceId)}`,
              window.location.href
            ).href;

          if (
            navigator.clipboard &&
            navigator.clipboard.writeText
          ) {

            navigator.clipboard
              .writeText(url)
              .then(
                function () {
                  showToast(
                    "Service link copied.",
                    "success"
                  );
                }
              )
              .catch(
                function () {
                  fallbackCopyText(url);
                }
              );

          } else {

            fallbackCopyText(url);

          }
        }
      );

    }
  );
}

/* ---------- Initialize Service System ---------- */

function initializeServiceSystem() {

  const type =
    getServiceTypeFromPage();

  if (!type) return;

  setupServiceSearch(type);

  if ($("#serviceList")) {

    renderSarkariiChijServices(
      type,
      "#serviceList"
    );

  }
}

/* ---------- Chain Initialization ---------- */

const previousInitializePart16 =
  initializeSarkariiChij;

initializeSarkariiChij = function () {

  previousInitializePart16();

  initializeServiceSystem();

};

/* ---------- Global Service API ---------- */

window.SarkariiChijServicesAPI = {

  database:
    SarkariiChijServices,

  getCollection:
    getServiceCollection,

  find:
    findSarkariiChijService,

  search:
    searchSarkariiChijServices,

  render:
    renderSarkariiChijServices,

  initialize:
    initializeServiceSystem

};

/* ---------- END PART 16 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 17 — SERVICE DETAIL + OFFICIAL ACTION ENGINE
   Scholarship / Yojana / Sarkari Kaam
   ========================================================= */

function getServiceIdFromURL() {
    const params = new URLSearchParams(window.location.search);

    return (
        params.get("id") ||
        params.get("service") ||
        params.get("serviceId") ||
        ""
    ).trim();
}


/* ---------- Find service from all service collections ---------- */

function findServiceById(serviceId) {
    if (!serviceId || typeof SarkariiChijServices === "undefined") {
        return null;
    }

    const collections = [
        SarkariiChijServices.admission || [],
        SarkariiChijServices.scholarship || [],
        SarkariiChijServices.yojana || [],
        SarkariiChijServices.sarkariKaam || []
    ];

    for (const collection of collections) {
        const found = collection.find(item => {
            return String(item.id) === String(serviceId);
        });

        if (found) {
            return found;
        }
    }

    return null;
}


/* ---------- Safe value helper ---------- */

function serviceValue(value, fallback = "जानकारी उपलब्ध नहीं है") {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    return value;
}


/* ---------- Convert array into HTML list ---------- */

function createServiceList(items, emptyText = "जानकारी उपलब्ध नहीं है") {
    if (!Array.isArray(items) || items.length === 0) {
        return `<p class="empty-text">${escapeHTML(emptyText)}</p>`;
    }

    return `
        <ul class="service-detail-list">
            ${items.map(item => `
                <li>${escapeHTML(String(item))}</li>
            `).join("")}
        </ul>
    `;
}


/* ---------- Render service detail ---------- */

function renderServiceDetail(service, container) {
    if (!container) {
        return;
    }

    if (!service) {
        container.innerHTML = `
            <div class="empty-box">
                <h3>Service नहीं मिली</h3>
                <p>
                    जिस Scholarship, Yojana या Sarkari Kaam की जानकारी
                    मांगी गई है वह उपलब्ध नहीं है।
                </p>
                <a href="index.html" class="btn btn-primary">
                    Home पर जाएँ
                </a>
            </div>
        `;

        return;
    }

    const title = service.title || service.name || "Service";
    const description =
        service.description ||
        service.shortDescription ||
        "इस सेवा से संबंधित महत्वपूर्ण जानकारी यहाँ उपलब्ध है।";

    const category =
        service.category ||
        service.type ||
        "Government Service";

    const eligibility =
        service.eligibility ||
        service.eligibleFor ||
        service.criteria ||
        [];

    const documents =
        service.documents ||
        service.requiredDocuments ||
        [];

    const importantDates =
        service.importantDates ||
        service.dates ||
        [];

    const process =
        service.process ||
        service.applicationProcess ||
        service.steps ||
        [];

    const fee =
        service.fee ||
        service.applicationFee ||
        "निःशुल्क / जानकारी उपलब्ध नहीं";

    const officialURL =
        service.officialUrl ||
        service.officialURL ||
        service.website ||
        service.applyUrl ||
        service.applyURL ||
        "";

    const image =
        service.image ||
        service.logo ||
        "";

    container.innerHTML = `
        <div class="job-detail service-detail-page">

            <div class="job-detail-header">

                <div class="service-detail-heading">

                    ${
                        image
                        ? `
                            <div class="service-detail-image">
                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(title)}"
                                    loading="lazy"
                                >
                            </div>
                        `
                        : ""
                    }

                    <div>
                        <span class="badge badge-primary">
                            ${escapeHTML(String(category))}
                        </span>

                        <h1>${escapeHTML(String(title))}</h1>

                        <p>
                            ${escapeHTML(String(description))}
                        </p>
                    </div>

                </div>

                <div class="job-detail-meta">

                    <div class="info-row">
                        <strong>Category</strong>
                        <span>${escapeHTML(String(category))}</span>
                    </div>

                    <div class="info-row">
                        <strong>Fee</strong>
                        <span>${escapeHTML(String(fee))}</span>
                    </div>

                    <div class="info-row">
                        <strong>Service ID</strong>
                        <span>${escapeHTML(String(service.id || "N/A"))}</span>
                    </div>

                </div>

            </div>


            <div class="action-links service-action-links">

                ${
                    officialURL
                    ? `
                        <button
                            type="button"
                            class="btn btn-primary service-official-btn"
                            data-service-url="${escapeHTML(officialURL)}"
                        >
                            Official Website / Apply
                        </button>
                    `
                    : `
                        <span class="btn btn-secondary">
                            Official Link उपलब्ध नहीं
                        </span>
                    `
                }

                <button
                    type="button"
                    class="btn btn-secondary service-copy-btn"
                    data-service-id="${escapeHTML(String(service.id || ""))}"
                >
                    Link Copy करें
                </button>

                <button
                    type="button"
                    class="btn btn-secondary service-share-btn"
                    data-service-id="${escapeHTML(String(service.id || ""))}"
                >
                    Share करें
                </button>

            </div>


            <div class="job-detail-body">

                <section class="info-card service-detail-section">

                    <h2>Eligibility / पात्रता</h2>

                    ${createServiceList(
                        Array.isArray(eligibility)
                            ? eligibility
                            : [eligibility]
                    )}

                </section>


                <section class="info-card service-detail-section">

                    <h2>Required Documents / जरूरी दस्तावेज</h2>

                    ${createServiceList(
                        Array.isArray(documents)
                            ? documents
                            : [documents]
                    )}

                </section>


                <section class="info-card service-detail-section">

                    <h2>Important Dates / महत्वपूर्ण तिथियाँ</h2>

                    ${
                        Array.isArray(importantDates)
                        ? createServiceList(importantDates)
                        : `
                            <p>
                                ${escapeHTML(String(importantDates))}
                            </p>
                        `
                    }

                </section>


                <section class="info-card service-detail-section">

                    <h2>Application Process / आवेदन प्रक्रिया</h2>

                    ${createServiceList(
                        Array.isArray(process)
                            ? process
                            : [process]
                    )}

                </section>


                <section class="info-card service-detail-section">

                    <h2>Important Information</h2>

                    <p>
                        आवेदन करने से पहले संबंधित विभाग की
                        official website पर notification और latest
                        instructions जरूर check करें।
                    </p>

                </section>

            </div>

        </div>
    `;
}


/* ---------- Render current service detail page ---------- */

function initializeServiceDetailPage() {
    const container =
        document.querySelector(
            "#service-detail-container, " +
            ".service-detail-container, " +
            "[data-service-detail]"
        );

    if (!container) {
        return;
    }

    const serviceId = getServiceIdFromURL();
    const service = findServiceById(serviceId);

    renderServiceDetail(service, container);
}


/* ---------- Build service detail URL ---------- */

function getServiceDetailURL(serviceId) {
    if (!serviceId) {
        return "index.html";
    }

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    const detailPage =
        currentPage.includes("scholarship")
            ? "scholarship.html"
            : currentPage.includes("yojana")
                ? "yojana.html"
                : currentPage.includes("sarkari-kaam")
                    ? "sarkari-kaam.html"
                    : currentPage.includes("admission")
                        ? "admission.html"
                        : "index.html";

    return `${detailPage}?id=${encodeURIComponent(serviceId)}`;
}


/* ---------- Copy service link ---------- */

function copyServiceLink(serviceId) {
    const url =
        new URL(
            getServiceDetailURL(serviceId),
            window.location.href
        ).href;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showToast(
                    "Service link copy हो गया।",
                    "success"
                );
            })
            .catch(() => {
                fallbackCopyText(url);
            });

        return;
    }

    fallbackCopyText(url);
}


/* ---------- Share service ---------- */

function shareService(serviceId) {
    const url =
        new URL(
            getServiceDetailURL(serviceId),
            window.location.href
        ).href;

    const service =
        findServiceById(serviceId);

    const title =
        service?.title ||
        service?.name ||
        "Sarkariiichij Service";

    if (navigator.share) {
        navigator.share({
            title: title,
            text: `${title} — Sarkariiichij`,
            url: url
        }).catch(() => {});
        return;
    }

    copyServiceLink(serviceId);
}


/* ---------- Open official service website ---------- */

function openServiceOfficialWebsite(url) {
    if (!url) {
        showToast(
            "Official link उपलब्ध नहीं है।",
            "warning"
        );
        return;
    }

    if (typeof isSafeExternalURL === "function") {
        if (!isSafeExternalURL(url)) {
            showToast(
                "यह official link सुरक्षित नहीं है।",
                "error"
            );
            return;
        }
    }

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* ---------- Service action events ---------- */

function setupServiceDetailActions() {

    document.addEventListener("click", function(event) {

        const officialButton =
            event.target.closest(
                ".service-official-btn"
            );

        if (officialButton) {
            const url =
                officialButton.dataset.serviceUrl || "";

            openServiceOfficialWebsite(url);
            return;
        }


        const copyButton =
            event.target.closest(
                ".service-copy-btn"
            );

        if (copyButton) {
            const serviceId =
                copyButton.dataset.serviceId || "";

            copyServiceLink(serviceId);
            return;
        }


        const shareButton =
            event.target.closest(
                ".service-share-btn"
            );

        if (shareButton) {
            const serviceId =
                shareButton.dataset.serviceId || "";

            shareService(serviceId);
            return;
        }

    });
}


/* ---------- Initialize Part 17 ---------- */

function initializePart17Systems() {

    initializeServiceDetailPage();

    setupServiceDetailActions();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart17 =
    initializeSarkariiChij;

initializeSarkariiChij = function() {

    previousInitializePart17();

    initializePart17Systems();

};


/* ---------- Global service detail API ---------- */

window.SarkariiChijServiceDetails = {

    getServiceIdFromURL,

    findServiceById,

    renderServiceDetail,

    initializeServiceDetailPage,

    getServiceDetailURL,

    copyServiceLink,

    shareService,

    openServiceOfficialWebsite,

    setupServiceDetailActions

};


/* ---------- END PART 17 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 18 — EXAM RESOURCE DETAIL ENGINE
   PART 1 / 2
   Admission / Results / Admit Card / Syllabus
   Cut Off / Previous Year Papers
   ========================================================= */


/* ---------- Get resource ID from URL ---------- */

function getResourceIdFromURL() {

    const params =
        new URLSearchParams(window.location.search);

    return (
        params.get("id") ||
        params.get("resource") ||
        params.get("resourceId") ||
        ""
    ).trim();
}


/* ---------- Get resource type from current page ---------- */

function getCurrentResourceType() {

    const path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (path.includes("result")) {
        return "results";
    }

    if (path.includes("admit")) {
        return "admitCards";
    }

    if (path.includes("syllabus")) {
        return "syllabus";
    }

    if (path.includes("cutoff")) {
        return "cutoffs";
    }

    if (
        path.includes("paper") ||
        path.includes("previous")
    ) {
        return "papers";
    }

    if (path.includes("admission")) {
        return "admission";
    }

    return "";
}


/* ---------- Find resource ---------- */

function findResourceByIdAndType(
    resourceId,
    resourceType
) {

    if (
        !resourceId ||
        typeof SarkariiChijResources === "undefined"
    ) {
        return null;
    }

    let collection = [];

    if (
        resourceType === "results" &&
        Array.isArray(
            SarkariiChijResources.results
        )
    ) {
        collection =
            SarkariiChijResources.results;
    }

    else if (
        resourceType === "admitCards" &&
        Array.isArray(
            SarkariiChijResources.admitCards
        )
    ) {
        collection =
            SarkariiChijResources.admitCards;
    }

    else if (
        resourceType === "syllabus" &&
        Array.isArray(
            SarkariiChijResources.syllabus
        )
    ) {
        collection =
            SarkariiChijResources.syllabus;
    }

    else if (
        resourceType === "cutoffs" &&
        Array.isArray(
            SarkariiChijResources.cutoffs
        )
    ) {
        collection =
            SarkariiChijResources.cutoffs;
    }

    else if (
        resourceType === "papers" &&
        Array.isArray(
            SarkariiChijResources.papers
        )
    ) {
        collection =
            SarkariiChijResources.papers;
    }

    else if (
        resourceType === "admission" &&
        Array.isArray(
            SarkariiChijResources.admission
        )
    ) {
        collection =
            SarkariiChijResources.admission;
    }

    const found =
        collection.find(item => {

            return String(item.id) ===
                String(resourceId);

        });

    return found || null;
}


/* ---------- Generic resource value ---------- */

function resourceDetailValue(
    value,
    fallback = "जानकारी उपलब्ध नहीं है"
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    return value;
}


/* ---------- Resource list HTML ---------- */

function createResourceDetailList(
    items,
    emptyText = "जानकारी उपलब्ध नहीं है"
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return `
            <p class="empty-text">
                ${escapeHTML(emptyText)}
            </p>
        `;
    }

    return `
        <ul class="syllabus-list">

            ${items.map(item => `

                <li class="syllabus-item">

                    ${escapeHTML(
                        String(item)
                    )}

                </li>

            `).join("")}

        </ul>
    `;
}


/* ---------- Render resource detail ---------- */

function renderResourceDetail(
    resource,
    resourceType,
    container
) {

    if (!container) {
        return;
    }

    if (!resource) {

        container.innerHTML = `

            <div class="empty-box">

                <h3>
                    जानकारी उपलब्ध नहीं है
                </h3>

                <p>
                    इस resource की जानकारी अभी
                    उपलब्ध नहीं है।
                </p>

                <a
                    href="index.html"
                    class="btn btn-primary"
                >
                    Home पर जाएँ
                </a>

            </div>

        `;

        return;
    }


    const title =
        resource.title ||
        resource.name ||
        "Exam Resource";


    const description =
        resource.description ||
        resource.shortDescription ||
        "इस परीक्षा से संबंधित महत्वपूर्ण जानकारी।";


    const department =
        resource.department ||
        resource.organization ||
        resource.board ||
        "Government / Examination";


    const exam =
        resource.exam ||
        resource.examName ||
        resource.title ||
        "Exam";


    const date =
        resource.date ||
        resource.examDate ||
        resource.resultDate ||
        resource.releaseDate ||
        "";


    const status =
        resource.status ||
        "";


    const qualification =
        resource.qualification ||
        resource.eligibility ||
        "";


    const officialURL =
        resource.officialUrl ||
        resource.officialURL ||
        resource.website ||
        "";


    const downloadURL =
        resource.downloadUrl ||
        resource.downloadURL ||
        resource.pdf ||
        resource.pdfUrl ||
        "";


    const applyURL =
        resource.applyUrl ||
        resource.applyURL ||
        "";


    const details =
        resource.details ||
        resource.highlights ||
        resource.points ||
        [];


    const documents =
        resource.documents ||
        resource.requiredDocuments ||
        [];


    const subjects =
        resource.subjects ||
        resource.sections ||
        [];


    const pattern =
        resource.examPattern ||
        resource.pattern ||
        [];


    const years =
        resource.years ||
        [];


    const cutoff =
        resource.cutoff ||
        resource.cutOff ||
        resource.cutOffMarks ||
        "";


    container.innerHTML = `

        <div class="job-detail resource-detail-page">

            <div class="job-detail-header">

                <span class="badge badge-primary">

                    ${escapeHTML(
                        String(
                            resourceType ||
                            "Resource"
                        )
                    )}

                </span>

                <h1>

                    ${escapeHTML(
                        String(title)
                    )}

                </h1>

                <p>

                    ${escapeHTML(
                        String(description)
                    )}

                </p>


                <div class="job-detail-meta">

                    <div class="info-row">

                        <strong>
                            Exam
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(exam)
                            )}
                        </span>

                    </div>


                    <div class="info-row">

                        <strong>
                            Department
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(department)
                            )}
                        </span>

                    </div>


                    ${
                        date
                        ? `

                            <div class="info-row">

                                <strong>
                                    Date
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(date)
                                    )}
                                </span>

                            </div>

                        `
                        : ""
                    }


                    ${
                        status
                        ? `

                            <div class="info-row">

                                <strong>
                                    Status
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(status)
                                    )}
                                </span>

                            </div>

                        `
                        : ""
                    }


                    ${
                        qualification
                        ? `

                            <div class="info-row">

                                <strong>
                                    Eligibility
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(
                                            qualification
                                        )
                                    )}
                                </span>

                            </div>

                        `
                        : ""
                    }

                </div>

            </div>


            <div class="action-links">

                ${
                    officialURL
                    ? `

                        <button
                            type="button"
                            class="btn btn-primary resource-official-btn"
                            data-resource-url="${escapeHTML(
                                officialURL
                            )}"
                        >
                            Official Website
                        </button>

                    `
                    : ""
                }


                ${
                    applyURL
                    ? `

                        <button
                            type="button"
                            class="btn btn-success resource-apply-btn"
                            data-resource-url="${escapeHTML(
                                applyURL
                            )}"
                        >
                            Apply Online
                        </button>

                    `
                    : ""
                }


                ${
                    downloadURL
                    ? `

                        <button
                            type="button"
                            class="btn btn-secondary resource-download-btn"
                            data-resource-url="${escapeHTML(
                                downloadURL
                            )}"
                        >
                            Download / PDF
                        </button>

                    `
                    : ""
                }


                <button
                    type="button"
                    class="btn btn-secondary resource-copy-btn"
                    data-resource-id="${escapeHTML(
                        String(
                            resource.id || ""
                        )
                    )}"
                    data-resource-type="${escapeHTML(
                        String(
                            resourceType || ""
                        )
                    )}"
                >
                    Link Copy करें
                </button>


                <button
                    type="button"
                    class="btn btn-secondary resource-share-btn"
                    data-resource-id="${escapeHTML(
                        String(
                            resource.id || ""
                        )
                    )}"
                    data-resource-type="${escapeHTML(
                        String(
                            resourceType || ""
                        )
                    )}"
                >
                    Share करें
                </button>

            </div>


            ${
                Array.isArray(details) &&
                details.length
                ? `

                    <section class="info-card">

                        <h2>
                            Important Details
                        </h2>

                        ${createResourceDetailList(
                            details
                        )}

                    </section>

                `
                : ""
            }


            ${
                qualification
                ? `

                    <section class="info-card">

                        <h2>
                            Eligibility / पात्रता
                        </h2>

                        <p>
                            ${escapeHTML(
                                String(
                                    qualification
                                )
                            )}
                        </p>

                    </section>

                `
                : ""
            }


            ${
                Array.isArray(documents) &&
                documents.length
                ? `

                    <section class="info-card">

                        <h2>
                            Required Documents
                        </h2>

                        ${createResourceDetailList(
                            documents
                        )}

                    </section>

                `
                : ""
            }


            ${
                Array.isArray(subjects) &&
                subjects.length
                ? `

                    <section class="info-card">

                        <h2>
                            Subjects / Sections
                        </h2>

                        ${createResourceDetailList(
                            subjects
                        )}

                    </section>

                `
                : ""
            }


            ${
                Array.isArray(pattern) &&
                pattern.length
                ? `

                    <section class="info-card">

                        <h2>
                            Exam Pattern
                        </h2>

                        ${createResourceDetailList(
                            pattern
                        )}

                    </section>

                `
                : ""
            }


            ${
                cutoff
                ? `

                    <section class="info-card">

                        <h2>
                            Cut Off Information
                        </h2>

                        <p>
                            ${escapeHTML(
                                String(cutoff)
                            )}
                        </p>

                    </section>

                `
                : ""
            }


            ${
                Array.isArray(years) &&
                years.length
                ? `

                    <section class="info-card">

                        <h2>
                            Previous Years
                        </h2>

                        ${createResourceDetailList(
                            years
                        )}

                    </section>

                `
                : ""
            }


            <section class="info-card">

                <h2>
                    Important Notice
                </h2>

                <p>
                    आवेदन, डाउनलोड या परीक्षा से संबंधित
                    किसी भी महत्वपूर्ण कार्रवाई से पहले
                    संबंधित विभाग की official website पर
                    latest notification जरूर verify करें।
                </p>

            </section>

        </div>

    `;
}


/* ---------- END PART 18 — PART 1 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 18 — PART 2 / 2
   Resource Actions + Initialization + Global API
   ========================================================= */


/* ---------- Resource detail page initialization ---------- */

function initializeResourceDetailPage() {

    const container =
        document.querySelector(
            "#resource-detail-container, " +
            ".resource-detail-container, " +
            "[data-resource-detail]"
        );

    if (!container) {
        return;
    }


    const resourceId =
        getResourceIdFromURL();


    const resourceType =
        getCurrentResourceType();


    const resource =
        findResourceByIdAndType(
            resourceId,
            resourceType
        );


    renderResourceDetail(
        resource,
        resourceType,
        container
    );
}


/* ---------- Resource detail URL ---------- */

function getResourceDetailPageURL(
    resourceId,
    resourceType
) {

    if (!resourceId) {
        return "index.html";
    }


    const pages = {

        admission:
            "admission.html",

        results:
            "results.html",

        admitCards:
            "admit-card.html",

        syllabus:
            "syllabus.html",

        cutoffs:
            "cutoff.html",

        papers:
            "papers.html"

    };


    const page =
        pages[resourceType] ||
        "index.html";


    return `${page}?id=${encodeURIComponent(
        resourceId
    )}`;
}


/* ---------- Open resource URL ---------- */

function openResourceURL(url) {

    if (!url) {

        showToast(
            "Link उपलब्ध नहीं है।",
            "warning"
        );

        return;
    }


    if (
        typeof isSafeExternalURL === "function" &&
        !isSafeExternalURL(url)
    ) {

        showToast(
            "यह link सुरक्षित नहीं है।",
            "error"
        );

        return;
    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* ---------- Copy resource link ---------- */

function copyResourceDetailLink(
    resourceId,
    resourceType
) {

    const relativeURL =
        getResourceDetailPageURL(
            resourceId,
            resourceType
        );


    const url =
        new URL(
            relativeURL,
            window.location.href
        ).href;


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(url)
            .then(() => {

                showToast(
                    "Resource link copy हो गया।",
                    "success"
                );

            })
            .catch(() => {

                fallbackCopyText(url);

            });

        return;
    }


    fallbackCopyText(url);
}


/* ---------- Share resource ---------- */

function shareResourceDetail(
    resourceId,
    resourceType
) {

    const relativeURL =
        getResourceDetailPageURL(
            resourceId,
            resourceType
        );


    const url =
        new URL(
            relativeURL,
            window.location.href
        ).href;


    const resource =
        findResourceByIdAndType(
            resourceId,
            resourceType
        );


    const title =
        resource?.title ||
        resource?.name ||
        "Sarkariiichij Resource";


    if (navigator.share) {

        navigator.share({

            title: title,

            text:
                `${title} — Sarkariiichij`,

            url: url

        }).catch(() => {});

        return;
    }


    copyResourceDetailLink(
        resourceId,
        resourceType
    );
}


/* ---------- Resource action events ---------- */

function setupResourceDetailActions() {

    document.addEventListener(
        "click",
        function(event) {


            const officialButton =
                event.target.closest(
                    ".resource-official-btn"
                );


            if (officialButton) {

                openResourceURL(
                    officialButton.dataset.resourceUrl
                );

                return;
            }


            const applyButton =
                event.target.closest(
                    ".resource-apply-btn"
                );


            if (applyButton) {

                openResourceURL(
                    applyButton.dataset.resourceUrl
                );

                return;
            }


            const downloadButton =
                event.target.closest(
                    ".resource-download-btn"
                );


            if (downloadButton) {

                openResourceURL(
                    downloadButton.dataset.resourceUrl
                );

                return;
            }


            const copyButton =
                event.target.closest(
                    ".resource-copy-btn"
                );


            if (copyButton) {

                copyResourceDetailLink(

                    copyButton.dataset.resourceId,

                    copyButton.dataset.resourceType

                );

                return;
            }


            const shareButton =
                event.target.closest(
                    ".resource-share-btn"
                );


            if (shareButton) {

                shareResourceDetail(

                    shareButton.dataset.resourceId,

                    shareButton.dataset.resourceType

                );

                return;
            }

        }
    );
}


/* ---------- Initialize Part 18 ---------- */

function initializePart18Systems() {

    initializeResourceDetailPage();

    setupResourceDetailActions();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart18 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart18();

    initializePart18Systems();

};


/* ---------- Global Resource Detail API ---------- */

window.SarkariiChijResourceDetails = {

    getResourceIdFromURL,

    getCurrentResourceType,

    findResourceByIdAndType,

    renderResourceDetail,

    initializeResourceDetailPage,

    getResourceDetailPageURL,

    openResourceURL,

    copyResourceDetailLink,

    shareResourceDetail,

    setupResourceDetailActions

};


/* ---------- END PART 18 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 19 — RELATED EXAM RESOURCES ENGINE
   ========================================================= */


/* ---------- Find related resources by exam ---------- */

function findRelatedResources(
    currentResource,
    currentType,
    limit = 8
) {

    if (
        !currentResource ||
        typeof SarkariiChijResources === "undefined"
    ) {
        return [];
    }


    const currentExam =
        String(
            currentResource.exam ||
            currentResource.examName ||
            currentResource.title ||
            ""
        )
        .toLowerCase()
        .trim();


    if (!currentExam) {
        return [];
    }


    const collections = [
        {
            type: "results",
            items:
                SarkariiChijResources.results || []
        },

        {
            type: "admitCards",
            items:
                SarkariiChijResources.admitCards || []
        },

        {
            type: "syllabus",
            items:
                SarkariiChijResources.syllabus || []
        },

        {
            type: "cutoffs",
            items:
                SarkariiChijResources.cutoffs || []
        },

        {
            type: "papers",
            items:
                SarkariiChijResources.papers || []
        },

        {
            type: "admission",
            items:
                SarkariiChijResources.admission || []
        }
    ];


    const related = [];


    collections.forEach(collection => {

        collection.items.forEach(item => {

            if (
                String(item.id) ===
                String(currentResource.id)
            ) {
                return;
            }


            const itemExam =
                String(
                    item.exam ||
                    item.examName ||
                    item.title ||
                    ""
                )
                .toLowerCase()
                .trim();


            if (!itemExam) {
                return;
            }


            const sameExam =
                itemExam === currentExam ||
                itemExam.includes(currentExam) ||
                currentExam.includes(itemExam);


            if (sameExam) {

                related.push({
                    ...item,
                    resourceType:
                        collection.type
                });

            }

        });

    });


    return related.slice(0, limit);
}


/* ---------- Resource type label ---------- */

function getResourceTypeLabel(type) {

    const labels = {

        results:
            "Result",

        admitCards:
            "Admit Card",

        syllabus:
            "Syllabus",

        cutoffs:
            "Cut Off",

        papers:
            "Previous Paper",

        admission:
            "Admission"

    };


    return (
        labels[type] ||
        "Resource"
    );
}


/* ---------- Create related resource card ---------- */

function createRelatedResourceCard(
    resource
) {

    if (!resource) {
        return "";
    }


    const type =
        resource.resourceType ||
        "";


    const title =
        resource.title ||
        resource.name ||
        "Exam Resource";


    const description =
        resource.description ||
        resource.shortDescription ||
        "";


    const url =
        getResourceDetailPageURL(
            resource.id,
            type
        );


    return `

        <article class="resource-card">

            <div class="badge badge-primary">

                ${escapeHTML(
                    getResourceTypeLabel(type)
                )}

            </div>


            <h3>

                ${escapeHTML(
                    String(title)
                )}

            </h3>


            ${
                description
                ? `

                    <p>
                        ${escapeHTML(
                            String(description)
                        )}
                    </p>

                `
                : ""
            }


            <a
                href="${escapeHTML(url)}"
                class="btn btn-secondary"
            >
                View Details
            </a>

        </article>

    `;
}


/* ---------- Render related resources ---------- */

function renderRelatedResources(
    currentResource,
    currentType,
    container
) {

    if (!container) {
        return;
    }


    const related =
        findRelatedResources(
            currentResource,
            currentType
        );


    if (!related.length) {

        container.innerHTML = `
            <div class="empty-box">

                <h3>
                    Related Resources
                </h3>

                <p>
                    इस exam के अन्य resources
                    अभी उपलब्ध नहीं हैं।
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="section-header">

            <div>

                <h2 class="section-title">
                    Related Resources
                </h2>

                <p class="section-subtitle">
                    इसी परीक्षा से संबंधित
                    महत्वपूर्ण जानकारी
                </p>

            </div>

        </div>


        <div class="resource-grid">

            ${related.map(resource =>

                createRelatedResourceCard(
                    resource
                )

            ).join("")}

        </div>

    `;
}


/* ---------- Initialize related resource section ---------- */

function initializeRelatedResources() {

    const container =
        document.querySelector(
            "#related-resources, " +
            ".related-resources, " +
            "[data-related-resources]"
        );


    if (!container) {
        return;
    }


    const resourceId =
        getResourceIdFromURL();


    const resourceType =
        getCurrentResourceType();


    const currentResource =
        findResourceByIdAndType(
            resourceId,
            resourceType
        );


    renderRelatedResources(
        currentResource,
        resourceType,
        container
    );
}


/* ---------- Search related resources ---------- */

function searchRelatedResources(
    searchTerm
) {

    if (
        !searchTerm ||
        typeof SarkariiChijResources ===
            "undefined"
    ) {
        return [];
    }


    const term =
        String(searchTerm)
            .toLowerCase()
            .trim();


    const collections = [
        {
            type: "results",
            items:
                SarkariiChijResources.results || []
        },

        {
            type: "admitCards",
            items:
                SarkariiChijResources.admitCards || []
        },

        {
            type: "syllabus",
            items:
                SarkariiChijResources.syllabus || []
        },

        {
            type: "cutoffs",
            items:
                SarkariiChijResources.cutoffs || []
        },

        {
            type: "papers",
            items:
                SarkariiChijResources.papers || []
        },

        {
            type: "admission",
            items:
                SarkariiChijResources.admission || []
        }
    ];


    const results = [];


    collections.forEach(collection => {

        collection.items.forEach(item => {

            const searchableText =
                [
                    item.title,
                    item.name,
                    item.exam,
                    item.examName,
                    item.description,
                    item.department
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            if (
                searchableText.includes(term)
            ) {

                results.push({
                    ...item,
                    resourceType:
                        collection.type
                });

            }

        });

    });


    return results;
}


/* ---------- Render resource search results ---------- */

function renderResourceSearchResults(
    results,
    container
) {

    if (!container) {
        return;
    }


    if (
        !Array.isArray(results) ||
        results.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-box">

                <h3>
                    कोई resource नहीं मिला
                </h3>

                <p>
                    दूसरा exam या keyword search करें।
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = `

        <div class="resource-grid">

            ${results.map(resource =>

                createRelatedResourceCard(
                    resource
                )

            ).join("")}

        </div>

    `;
}


/* ---------- Resource search input ---------- */

function setupResourceRelatedSearch() {

    const input =
        document.querySelector(
            "#resource-search, " +
            ".resource-search"
        );


    const container =
        document.querySelector(
            "#resource-search-results, " +
            ".resource-search-results"
        );


    if (!input || !container) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            const value =
                input.value.trim();


            if (!value) {

                container.innerHTML = "";

                return;
            }


            const results =
                searchRelatedResources(
                    value
                );


            renderResourceSearchResults(
                results,
                container
            );

        }
    );
}


/* ---------- Initialize Part 19 ---------- */

function initializePart19Systems() {

    initializeRelatedResources();

    setupResourceRelatedSearch();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart19 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart19();

    initializePart19Systems();

};


/* ---------- Global Related Resource API ---------- */

window.SarkariiChijRelatedResources = {

    findRelatedResources,

    getResourceTypeLabel,

    createRelatedResourceCard,

    renderRelatedResources,

    initializeRelatedResources,

    searchRelatedResources,

    renderResourceSearchResults,

    setupResourceRelatedSearch

};


/* ---------- END PART 19 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 20 — JOB ↔ EXAM RESOURCE CROSS-LINK SYSTEM
   ========================================================= */


/* ---------- Find resources related to a job ---------- */

function findJobRelatedResources(job) {

    if (
        !job ||
        typeof SarkariiChijResources === "undefined"
    ) {
        return [];
    }

    const jobExam = String(
        job.exam ||
        job.examName ||
        job.title ||
        ""
    ).toLowerCase().trim();

    if (!jobExam) {
        return [];
    }

    const collections = [
        {
            type: "results",
            items: SarkariiChijResources.results || []
        },
        {
            type: "admitCards",
            items: SarkariiChijResources.admitCards || []
        },
        {
            type: "syllabus",
            items: SarkariiChijResources.syllabus || []
        },
        {
            type: "cutoffs",
            items: SarkariiChijResources.cutoffs || []
        },
        {
            type: "papers",
            items: SarkariiChijResources.papers || []
        }
    ];

    const related = [];

    collections.forEach(collection => {

        collection.items.forEach(resource => {

            const resourceExam = String(
                resource.exam ||
                resource.examName ||
                resource.title ||
                ""
            ).toLowerCase().trim();

            if (!resourceExam) {
                return;
            }

            const matched =
                resourceExam === jobExam ||
                resourceExam.includes(jobExam) ||
                jobExam.includes(resourceExam);

            if (matched) {

                related.push({
                    ...resource,
                    resourceType: collection.type
                });

            }

        });

    });

    return related;
}


/* ---------- Job resource type labels ---------- */

function getJobResourceLabel(type) {

    const labels = {

        results: "Result",

        admitCards: "Admit Card",

        syllabus: "Syllabus",

        cutoffs: "Cut Off",

        papers: "Previous Papers"

    };

    return labels[type] || "Resource";
}


/* ---------- Create job resource link ---------- */

function createJobResourceLink(resource) {

    if (!resource) {
        return "";
    }

    const resourceType =
        resource.resourceType || "";

    const resourceId =
        resource.id || "";

    if (!resourceId) {
        return "";
    }

    const url =
        getResourceDetailPageURL(
            resourceId,
            resourceType
        );

    return `
        <a
            href="${escapeHTML(url)}"
            class="btn btn-secondary"
        >
            ${escapeHTML(
                getJobResourceLabel(resourceType)
            )}
        </a>
    `;
}


/* ---------- Render job related resources ---------- */

function renderJobRelatedResources(
    job,
    container
) {

    if (!container) {
        return;
    }

    const resources =
        findJobRelatedResources(job);

    if (!resources.length) {

        container.innerHTML = `
            <div class="empty-box">

                <h3>
                    Exam Resources
                </h3>

                <p>
                    इस exam के Result, Admit Card,
                    Syllabus, Cut Off या Previous Paper
                    अभी उपलब्ध नहीं हैं।
                </p>

            </div>
        `;

        return;
    }

    const uniqueTypes = [];

    resources.forEach(resource => {

        if (
            !uniqueTypes.includes(
                resource.resourceType
            )
        ) {
            uniqueTypes.push(
                resource.resourceType
            );
        }

    });

    container.innerHTML = `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Exam Resources
                    </h2>

                    <p class="section-subtitle">
                        इस भर्ती परीक्षा से संबंधित
                        महत्वपूर्ण resources
                    </p>

                </div>

            </div>


            <div class="action-links">

                ${resources.map(resource =>
                    createJobResourceLink(resource)
                ).join("")}

            </div>


            <div class="job-resource-summary">

                ${uniqueTypes.map(type => `

                    <span class="badge badge-secondary">

                        ${escapeHTML(
                            getJobResourceLabel(type)
                        )}

                    </span>

                `).join("")}

            </div>

        </section>

    `;
}


/* ---------- Initialize job resource links ---------- */

function initializeJobRelatedResources() {

    const container =
        document.querySelector(
            "#job-related-resources, " +
            ".job-related-resources, " +
            "[data-job-resources]"
        );

    if (!container) {
        return;
    }

    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";

    if (!jobId) {
        return;
    }

    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;

    if (!job) {
        return;
    }

    renderJobRelatedResources(
        job,
        container
    );
}


/* ---------- Create direct resource URL ---------- */

function getJobResourceURL(
    resourceId,
    resourceType
) {

    return getResourceDetailPageURL(
        resourceId,
        resourceType
    );
}


/* ---------- Open job resource ---------- */

function openJobResource(
    resourceId,
    resourceType
) {

    const url =
        getJobResourceURL(
            resourceId,
            resourceType
        );

    if (!url) {
        return;
    }

    window.location.href = url;
}


/* ---------- Find one resource for job ---------- */

function findSingleJobResource(
    job,
    resourceType
) {

    const resources =
        findJobRelatedResources(job);

    return (
        resources.find(resource => {
            return resource.resourceType ===
                resourceType;
        }) || null
    );
}


/* ---------- Add resource shortcuts ---------- */

function addJobResourceShortcuts(job) {

    if (!job) {
        return;
    }

    const resourceTypes = [
        "results",
        "admitCards",
        "syllabus",
        "cutoffs",
        "papers"
    ];

    resourceTypes.forEach(type => {

        const resource =
            findSingleJobResource(
                job,
                type
            );

        if (!resource) {
            return;
        }

        const selector =
            `[data-job-resource="${type}"]`;

        document
            .querySelectorAll(selector)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function() {

                        openJobResource(
                            resource.id,
                            type
                        );

                    }
                );

            });

    });
}


/* ---------- Initialize shortcuts ---------- */

function initializeJobResourceShortcuts() {

    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";

    if (!jobId) {
        return;
    }

    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;

    if (!job) {
        return;
    }

    addJobResourceShortcuts(job);
}


/* ---------- Initialize Part 20 ---------- */

function initializePart20Systems() {

    initializeJobRelatedResources();

    initializeJobResourceShortcuts();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart20 =
    initializeSarkariiChij;

initializeSarkariiChij = function() {

    previousInitializePart20();

    initializePart20Systems();

};


/* ---------- Global Job Resource API ---------- */

window.SarkariiChijJobResources = {

    findJobRelatedResources,

    getJobResourceLabel,

    createJobResourceLink,

    renderJobRelatedResources,

    initializeJobRelatedResources,

    getJobResourceURL,

    openJobResource,

    findSingleJobResource,

    addJobResourceShortcuts,

    initializeJobResourceShortcuts

};


/* ---------- END PART 20 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 21 — COMPLETE JOB INFORMATION SYSTEM
   ========================================================= */


/* ---------- Job information value helper ---------- */

function getJobInfoValue(
    job,
    keys,
    fallback = "जानकारी उपलब्ध नहीं है"
) {

    if (!job) {
        return fallback;
    }

    for (const key of keys) {

        if (
            job[key] !== undefined &&
            job[key] !== null &&
            job[key] !== ""
        ) {
            return job[key];
        }

    }

    return fallback;
}


/* ---------- Format job information ---------- */

function formatJobInfoValue(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "जानकारी उपलब्ध नहीं है";
    }

    if (Array.isArray(value)) {

        return value
            .map(item => String(item))
            .join(", ");

    }

    return String(value);
}


/* ---------- Create job information row ---------- */

function createJobInfoRow(
    label,
    value
) {

    return `

        <div class="info-row">

            <strong>
                ${escapeHTML(label)}
            </strong>

            <span>
                ${escapeHTML(
                    formatJobInfoValue(value)
                )}
            </span>

        </div>

    `;
}


/* ---------- Create job information section ---------- */

function createJobInformationSection(job) {

    if (!job) {
        return "";
    }


    const post =
        getJobInfoValue(
            job,
            [
                "post",
                "postName",
                "posts"
            ]
        );


    const department =
        getJobInfoValue(
            job,
            [
                "department",
                "organization",
                "board"
            ]
        );


    const qualification =
        getJobInfoValue(
            job,
            [
                "qualification",
                "eligibility",
                "education"
            ]
        );


    const age =
        getJobInfoValue(
            job,
            [
                "age",
                "ageLimit",
                "age_limit"
            ]
        );


    const salary =
        getJobInfoValue(
            job,
            [
                "salary",
                "payScale",
                "pay"
            ]
        );


    const vacancy =
        getJobInfoValue(
            job,
            [
                "vacancy",
                "vacancies",
                "totalVacancy",
                "totalPosts"
            ]
        );


    const fee =
        getJobInfoValue(
            job,
            [
                "fee",
                "applicationFee",
                "examFee"
            ]
        );


    const startDate =
        getJobInfoValue(
            job,
            [
                "startDate",
                "applicationStart",
                "applyStartDate"
            ]
        );


    const lastDate =
        getJobInfoValue(
            job,
            [
                "lastDate",
                "lastDateToApply",
                "applicationLastDate"
            ]
        );


    const examDate =
        getJobInfoValue(
            job,
            [
                "examDate",
                "examinationDate"
            ]
        );


    const selection =
        getJobInfoValue(
            job,
            [
                "selectionProcess",
                "selection",
                "selectionProcedure"
            ]
        );


    const documents =
        getJobInfoValue(
            job,
            [
                "documents",
                "requiredDocuments"
            ]
        );


    const pattern =
        getJobInfoValue(
            job,
            [
                "examPattern",
                "pattern"
            ]
        );


    return `

        <section class="info-card job-information-section">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Job Information
                    </h2>

                    <p class="section-subtitle">
                        भर्ती से संबंधित महत्वपूर्ण जानकारी
                    </p>

                </div>

            </div>


            <div class="job-detail-meta">

                ${createJobInfoRow(
                    "Post Name",
                    post
                )}

                ${createJobInfoRow(
                    "Department",
                    department
                )}

                ${createJobInfoRow(
                    "Qualification",
                    qualification
                )}

                ${createJobInfoRow(
                    "Age Limit",
                    age
                )}

                ${createJobInfoRow(
                    "Salary / Pay",
                    salary
                )}

                ${createJobInfoRow(
                    "Total Vacancy",
                    vacancy
                )}

                ${createJobInfoRow(
                    "Application Fee",
                    fee
                )}

                ${createJobInfoRow(
                    "Application Start Date",
                    startDate
                )}

                ${createJobInfoRow(
                    "Last Date",
                    lastDate
                )}

                ${createJobInfoRow(
                    "Exam Date",
                    examDate
                )}

            </div>

        </section>


        <section class="info-card">

            <h2>
                Selection Process
            </h2>

            <p>
                ${escapeHTML(
                    formatJobInfoValue(
                        selection
                    )
                )}
            </p>

        </section>


        <section class="info-card">

            <h2>
                Required Documents
            </h2>

            ${
                Array.isArray(documents)
                ? createResourceDetailList(
                    documents
                )
                : `
                    <p>
                        ${escapeHTML(
                            formatJobInfoValue(
                                documents
                            )
                        )}
                    </p>
                `
            }

        </section>


        <section class="info-card">

            <h2>
                Exam Pattern
            </h2>

            ${
                Array.isArray(pattern)
                ? createResourceDetailList(
                    pattern
                )
                : `
                    <p>
                        ${escapeHTML(
                            formatJobInfoValue(
                                pattern
                            )
                        )}
                    </p>
                `
            }

        </section>

    `;
}


/* ---------- Render complete job information ---------- */

function renderCompleteJobInformation(
    job,
    container
) {

    if (!container) {
        return;
    }


    if (!job) {

        container.innerHTML = `

            <div class="empty-box">

                <h3>
                    Job information नहीं मिली
                </h3>

                <p>
                    इस भर्ती की जानकारी अभी उपलब्ध नहीं है।
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        createJobInformationSection(job);
}


/* ---------- Initialize complete job information ---------- */

function initializeCompleteJobInformation() {

    const container =
        document.querySelector(
            "#complete-job-information, " +
            ".complete-job-information, " +
            "[data-complete-job-info]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;


    renderCompleteJobInformation(
        job,
        container
    );
}


/* ---------- Initialize Part 21 ---------- */

function initializePart21Systems() {

    initializeCompleteJobInformation();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart21 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart21();

    initializePart21Systems();

};


/* ---------- Global Job Information API ---------- */

window.SarkariiChijJobInformation = {

    getJobInfoValue,

    formatJobInfoValue,

    createJobInfoRow,

    createJobInformationSection,

    renderCompleteJobInformation,

    initializeCompleteJobInformation

};


/* ---------- END PART 21 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 22 — JOB OFFICIAL LINKS & ACTION SYSTEM
   ========================================================= */


/* ---------- Safe job URL helper ---------- */

function getSafeJobURL(job, keys) {

    if (!job) {
        return "";
    }

    for (const key of keys) {

        const value = job[key];

        if (
            typeof value === "string" &&
            value.trim() !== "" &&
            isSafeExternalURL(value.trim())
        ) {
            return value.trim();
        }

    }

    return "";
}


/* ---------- Create official action button ---------- */

function createJobOfficialButton(
    label,
    url,
    type = "primary"
) {

    if (!url) {

        return `
            <button
                type="button"
                class="btn btn-secondary"
                disabled
                title="Official link उपलब्ध नहीं है"
            >
                ${escapeHTML(label)}
                — उपलब्ध नहीं
            </button>
        `;

    }


    return `

        <a
            href="${escapeHTML(url)}"
            class="btn btn-${escapeHTML(type)}"
            target="_blank"
            rel="noopener noreferrer"
            data-official-link="true"
        >
            ${escapeHTML(label)}
        </a>

    `;
}


/* ---------- Build complete job action buttons ---------- */

function createCompleteJobActions(job) {

    if (!job) {
        return "";
    }


    const notificationURL =
        getSafeJobURL(
            job,
            [
                "notificationURL",
                "notificationUrl",
                "notification",
                "pdf",
                "notificationPDF"
            ]
        );


    const applyURL =
        getSafeJobURL(
            job,
            [
                "applyURL",
                "applyUrl",
                "apply",
                "applyOnline"
            ]
        );


    const officialURL =
        getSafeJobURL(
            job,
            [
                "officialURL",
                "officialUrl",
                "officialWebsite",
                "website"
            ]
        );


    const syllabusURL =
        getSafeJobURL(
            job,
            [
                "syllabusURL",
                "syllabusUrl",
                "syllabus"
            ]
        );


    const admitCardURL =
        getSafeJobURL(
            job,
            [
                "admitCardURL",
                "admitCardUrl",
                "admitCard"
            ]
        );


    const resultURL =
        getSafeJobURL(
            job,
            [
                "resultURL",
                "resultUrl",
                "result"
            ]
        );


    const cutoffURL =
        getSafeJobURL(
            job,
            [
                "cutoffURL",
                "cutoffUrl",
                "cutoff"
            ]
        );


    const paperURL =
        getSafeJobURL(
            job,
            [
                "paperURL",
                "paperUrl",
                "previousPaperURL",
                "previousPapers"
            ]
        );


    const answerKeyURL =
        getSafeJobURL(
            job,
            [
                "answerKeyURL",
                "answerKeyUrl",
                "answerKey"
            ]
        );


    return `

        <section class="info-card job-official-actions">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Official Links
                    </h2>

                    <p class="section-subtitle">
                        इस भर्ती से संबंधित उपलब्ध official links
                    </p>

                </div>

            </div>


            <div class="job-actions">

                ${createJobOfficialButton(
                    "Notification",
                    notificationURL,
                    "primary"
                )}


                ${createJobOfficialButton(
                    "Apply Online",
                    applyURL,
                    "success"
                )}


                ${createJobOfficialButton(
                    "Official Website",
                    officialURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Syllabus",
                    syllabusURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Admit Card",
                    admitCardURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Result",
                    resultURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Cut Off",
                    cutoffURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Previous Papers",
                    paperURL,
                    "secondary"
                )}


                ${createJobOfficialButton(
                    "Answer Key",
                    answerKeyURL,
                    "secondary"
                )}

            </div>

        </section>

    `;
}


/* ---------- Copy job link button ---------- */

function createJobCopyShareActions(job) {

    if (!job) {
        return "";
    }


    const jobURL =
        typeof getJobDetailURL === "function"
            ? getJobDetailURL(job.id)
            : window.location.href;


    return `

        <div class="job-actions">

            <button
                type="button"
                class="btn btn-secondary"
                data-job-copy-link="${escapeHTML(
                    job.id || ""
                )}"
            >
                Copy Job Link
            </button>


            <button
                type="button"
                class="btn btn-secondary"
                data-job-share="${escapeHTML(
                    job.id || ""
                )}"
            >
                Share Job
            </button>

        </div>

    `;
}


/* ---------- Render official links ---------- */

function renderJobOfficialLinks(
    job,
    container
) {

    if (!container) {
        return;
    }


    if (!job) {

        container.innerHTML = `

            <div class="empty-box">

                <h3>
                    Links उपलब्ध नहीं हैं
                </h3>

                <p>
                    इस भर्ती की जानकारी नहीं मिली।
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        createCompleteJobActions(job) +
        createJobCopyShareActions(job);


    setupJobOfficialLinkTracking(
        container
    );


    setupJobCopyShareActions(
        container
    );
}


/* ---------- Track official link clicks ---------- */

function setupJobOfficialLinkTracking(
    container
) {

    const links =
        container.querySelectorAll(
            '[data-official-link="true"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            function() {

                try {

                    const url =
                        this.getAttribute("href");

                    const label =
                        this.textContent.trim();

                    const history =
                        getData(
                            "officialLinkHistory",
                            []
                        );


                    history.unshift({

                        label: label,

                        url: url,

                        time:
                            new Date().toISOString()

                    });


                    saveData(
                        "officialLinkHistory",
                        history.slice(0, 50)
                    );

                } catch (error) {

                    console.warn(
                        "Official link history error:",
                        error
                    );

                }

            }
        );

    });

}


/* ---------- Copy/share setup ---------- */

function setupJobCopyShareActions(
    container
) {

    const copyButtons =
        container.querySelectorAll(
            "[data-job-copy-link]"
        );


    copyButtons.forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const jobId =
                    this.getAttribute(
                        "data-job-copy-link"
                    );


                if (
                    typeof copyJobLink === "function"
                ) {

                    copyJobLink(jobId);

                    return;

                }


                const job =
                    typeof findSarkariiChijJob ===
                    "function"
                        ? findSarkariiChijJob(jobId)
                        : null;


                const url =
                    job &&
                    typeof getJobDetailURL ===
                    "function"
                        ? getJobDetailURL(jobId)
                        : window.location.href;


                fallbackCopyText(url);

            }
        );

    });


    const shareButtons =
        container.querySelectorAll(
            "[data-job-share]"
        );


    shareButtons.forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const jobId =
                    this.getAttribute(
                        "data-job-share"
                    );


                if (
                    typeof shareJob === "function"
                ) {

                    shareJob(jobId);

                }

            }
        );

    });

}


/* ---------- Initialize official links ---------- */

function initializeJobOfficialLinks() {

    const container =
        document.querySelector(
            "#job-official-links, " +
            ".job-official-links, " +
            "[data-job-official-links]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;


    renderJobOfficialLinks(
        job,
        container
    );

}


/* ---------- Initialize Part 22 ---------- */

function initializePart22Systems() {

    initializeJobOfficialLinks();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart22 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart22();

    initializePart22Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobOfficialLinks = {

    getSafeJobURL,

    createJobOfficialButton,

    createCompleteJobActions,

    createJobCopyShareActions,

    renderJobOfficialLinks,

    initializeJobOfficialLinks

};


/* ---------- END PART 22 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 23 — IMPORTANT DATES, VACANCY & ELIGIBILITY
   ========================================================= */


/* ---------- Important date helper ---------- */

function getJobDateValue(job, keys) {

    if (!job) {
        return "";
    }

    for (const key of keys) {

        if (
            job[key] !== undefined &&
            job[key] !== null &&
            job[key] !== ""
        ) {
            return String(job[key]);
        }

    }

    return "";

}


/* ---------- Create date card ---------- */

function createJobDateCard(
    label,
    value,
    type = ""
) {

    const displayValue =
        value ||
        "जानकारी उपलब्ध नहीं है";


    let statusClass = "";


    if (type === "lastDate" && value) {

        const days =
            typeof getDaysRemaining === "function"
                ? getDaysRemaining(value)
                : null;


        if (days !== null) {

            if (days < 0) {
                statusClass = "badge-danger";
            } else if (days <= 3) {
                statusClass = "badge-warning";
            } else {
                statusClass = "badge-success";
            }

        }

    }


    return `

        <div class="calendar-card">

            <div class="calendar-date">

                ${escapeHTML(label)}

            </div>

            <h3>

                ${escapeHTML(displayValue)}

            </h3>

            ${
                statusClass
                    ? `
                        <span class="badge ${statusClass}">
                            ${
                                type === "lastDate"
                                    ? "Application Deadline"
                                    : "Important Date"
                            }
                        </span>
                    `
                    : ""
            }

        </div>

    `;

}


/* ---------- Create important dates ---------- */

function createJobImportantDates(job) {

    if (!job) {
        return "";
    }


    const startDate =
        getJobDateValue(
            job,
            [
                "startDate",
                "applicationStart",
                "applyStartDate"
            ]
        );


    const lastDate =
        getJobDateValue(
            job,
            [
                "lastDate",
                "applicationLastDate",
                "lastDateToApply"
            ]
        );


    const examDate =
        getJobDateValue(
            job,
            [
                "examDate",
                "examinationDate"
            ]
        );


    const correctionDate =
        getJobDateValue(
            job,
            [
                "correctionDate",
                "correctionLastDate"
            ]
        );


    const admitCardDate =
        getJobDateValue(
            job,
            [
                "admitCardDate"
            ]
        );


    const resultDate =
        getJobDateValue(
            job,
            [
                "resultDate"
            ]
        );


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Important Dates
                    </h2>

                    <p class="section-subtitle">
                        इस भर्ती की महत्वपूर्ण तिथियाँ
                    </p>

                </div>

            </div>


            <div class="calendar-grid">

                ${createJobDateCard(
                    "Application Start",
                    startDate,
                    "startDate"
                )}


                ${createJobDateCard(
                    "Last Date",
                    lastDate,
                    "lastDate"
                )}


                ${createJobDateCard(
                    "Exam Date",
                    examDate,
                    "examDate"
                )}


                ${createJobDateCard(
                    "Correction Last Date",
                    correctionDate,
                    "correctionDate"
                )}


                ${createJobDateCard(
                    "Admit Card",
                    admitCardDate,
                    "admitCardDate"
                )}


                ${createJobDateCard(
                    "Result",
                    resultDate,
                    "resultDate"
                )}

            </div>

        </section>

    `;

}


/* ---------- Vacancy breakdown ---------- */

function getJobVacancyData(job) {

    if (!job) {
        return [];
    }


    const vacancy =
        job.vacancyBreakup ||
        job.postWiseVacancy ||
        job.vacanciesByPost ||
        job.postVacancies;


    if (Array.isArray(vacancy)) {
        return vacancy;
    }


    return [];

}


/* ---------- Create vacancy table ---------- */

function createJobVacancyBreakup(job) {

    const vacancies =
        getJobVacancyData(job);


    if (!vacancies.length) {

        const total =
            getJobInfoValue(
                job,
                [
                    "vacancy",
                    "totalVacancy",
                    "totalPosts"
                ]
            );


        return `

            <section class="info-card">

                <h2 class="section-title">
                    Vacancy Details
                </h2>

                <div class="info-row">

                    <strong>
                        Total Vacancy
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(total)
                        )}
                    </span>

                </div>

                <p class="section-subtitle">

                    Post-wise vacancy breakup उपलब्ध नहीं है।

                </p>

            </section>

        `;

    }


    let rows = "";


    vacancies.forEach(item => {

        if (!item) {
            return;
        }


        const post =
            item.post ||
            item.postName ||
            item.name ||
            "Post";


        const count =
            item.vacancy ||
            item.count ||
            item.seats ||
            item.total ||
            "जानकारी उपलब्ध नहीं";


        const category =
            item.category ||
            item.reservation ||
            "";


        rows += `

            <tr>

                <td>
                    ${escapeHTML(
                        String(post)
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        String(count)
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        String(category)
                    )}
                </td>

            </tr>

        `;

    });


    return `

        <section class="info-card">

            <h2 class="section-title">
                Post-wise Vacancy
            </h2>

            <div class="table-wrap">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Post
                            </th>

                            <th>
                                Vacancy
                            </th>

                            <th>
                                Category / Reservation
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </section>

    `;

}


/* ---------- Eligibility highlights ---------- */

function createJobEligibilityHighlights(job) {

    if (!job) {
        return "";
    }


    const qualification =
        getJobInfoValue(
            job,
            [
                "qualification",
                "eligibility",
                "education"
            ]
        );


    const age =
        getJobInfoValue(
            job,
            [
                "age",
                "ageLimit",
                "age_limit"
            ]
        );


    const category =
        getJobInfoValue(
            job,
            [
                "category",
                "categories",
                "eligibleCategories"
            ]
        );


    const experience =
        getJobInfoValue(
            job,
            [
                "experience",
                "workExperience"
            ]
        );


    const nationality =
        getJobInfoValue(
            job,
            [
                "nationality"
            ]
        );


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Eligibility Highlights
                    </h2>

                    <p class="section-subtitle">
                        आवेदन करने से पहले eligibility जरूर जाँचें
                    </p>

                </div>

            </div>


            <div class="eligibility-grid">

                <div class="eligibility-item">

                    <strong>
                        Qualification
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(
                                qualification
                            )
                        )}
                    </span>

                </div>


                <div class="eligibility-item">

                    <strong>
                        Age Limit
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(
                                age
                            )
                        )}
                    </span>

                </div>


                <div class="eligibility-item">

                    <strong>
                        Category
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(
                                category
                            )
                        )}
                    </span>

                </div>


                <div class="eligibility-item">

                    <strong>
                        Experience
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(
                                experience
                            )
                        )}
                    </span>

                </div>


                <div class="eligibility-item">

                    <strong>
                        Nationality
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatJobInfoValue(
                                nationality
                            )
                        )}
                    </span>

                </div>

            </div>

        </section>

    `;

}


/* ---------- Render Part 23 ---------- */

function renderJobPart23(
    job,
    container
) {

    if (!container || !job) {
        return;
    }


    container.innerHTML +=

        createJobImportantDates(job) +

        createJobVacancyBreakup(job) +

        createJobEligibilityHighlights(job);

}


/* ---------- Initialize Part 23 ---------- */

function initializeJobPart23() {

    const container =
        document.querySelector(
            "#job-detail-content, " +
            ".job-detail-content, " +
            "[data-job-detail-content]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;


    if (!job) {
        return;
    }


    renderJobPart23(
        job,
        container
    );

}


/* ---------- Initialize Part 23 systems ---------- */

function initializePart23Systems() {

    initializeJobPart23();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart23 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart23();

    initializePart23Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobPart23 = {

    getJobDateValue,

    createJobDateCard,

    createJobImportantDates,

    getJobVacancyData,

    createJobVacancyBreakup,

    createJobEligibilityHighlights,

    renderJobPart23,

    initializeJobPart23

};


/* ---------- END PART 23 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 24 — SELECTION PROCESS & EXAM PATTERN SYSTEM
   ========================================================= */


/* ---------- Selection stages ---------- */

function getJobSelectionStages(job) {

    if (!job) {
        return [];
    }


    const selection =
        job.selectionProcess ||
        job.selection ||
        job.selectionProcedure;


    if (Array.isArray(selection)) {
        return selection;
    }


    if (typeof selection === "string" && selection.trim()) {

        return selection
            .split(/\n|→|->|,/)
            .map(item => item.trim())
            .filter(Boolean);

    }


    return [];

}


/* ---------- Create selection process ---------- */

function createJobSelectionProcess(job) {

    const stages =
        getJobSelectionStages(job);


    if (!stages.length) {

        return `

            <section class="info-card">

                <h2 class="section-title">
                    Selection Process
                </h2>

                <div class="empty-box">

                    Selection process की जानकारी
                    अभी उपलब्ध नहीं है।

                </div>

            </section>

        `;

    }


    const items =
        stages.map(
            (stage, index) => `

                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        Stage ${index + 1}
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(stage)
                        )}
                    </strong>

                </div>

            `
        ).join("");


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Selection Process
                    </h2>

                    <p class="section-subtitle">
                        भर्ती में चयन के संभावित चरण
                    </p>

                </div>

            </div>


            <div class="syllabus-list">

                ${items}

            </div>

        </section>

    `;

}


/* ---------- Exam pattern data ---------- */

function getJobExamPattern(job) {

    if (!job) {
        return [];
    }


    const pattern =
        job.examPattern ||
        job.exam_pattern ||
        job.pattern;


    if (Array.isArray(pattern)) {
        return pattern;
    }


    if (
        pattern &&
        typeof pattern === "object"
    ) {

        return Object.keys(pattern)
            .map(key => ({

                subject: key,

                details: pattern[key]

            }));

    }


    return [];

}


/* ---------- Create exam pattern table ---------- */

function createJobExamPattern(job) {

    const pattern =
        getJobExamPattern(job);


    if (!pattern.length) {

        return `

            <section class="info-card">

                <h2 class="section-title">
                    Exam Pattern
                </h2>

                <div class="empty-box">

                    Exam pattern की जानकारी
                    अभी उपलब्ध नहीं है।

                </div>

            </section>

        `;

    }


    const rows =
        pattern.map(item => {

            if (
                typeof item === "string"
            ) {

                return `

                    <tr>

                        <td colspan="5">

                            ${escapeHTML(item)}

                        </td>

                    </tr>

                `;

            }


            const subject =
                item.subject ||
                item.name ||
                item.section ||
                "Section";


            const questions =
                item.questions ??
                item.questionCount ??
                item.totalQuestions ??
                "";


            const marks =
                item.marks ??
                item.totalMarks ??
                "";


            const duration =
                item.duration ??
                item.time ??
                "";


            const negative =
                item.negativeMarking ??
                item.negative ??
                "";


            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            String(subject)
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            String(
                                questions ||
                                "जानकारी उपलब्ध नहीं"
                            )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            String(
                                marks ||
                                "जानकारी उपलब्ध नहीं"
                            )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            String(
                                duration ||
                                "जानकारी उपलब्ध नहीं"
                            )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            String(
                                negative ||
                                "जानकारी उपलब्ध नहीं"
                            )
                        )}
                    </td>

                </tr>

            `;

        }).join("");


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Exam Pattern
                    </h2>

                    <p class="section-subtitle">
                        उपलब्ध परीक्षा पैटर्न की जानकारी
                    </p>

                </div>

            </div>


            <div class="table-wrap">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Subject / Section
                            </th>

                            <th>
                                Questions
                            </th>

                            <th>
                                Marks
                            </th>

                            <th>
                                Duration
                            </th>

                            <th>
                                Negative Marking
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </section>

    `;

}


/* ---------- Additional exam information ---------- */

function createJobExamSummary(job) {

    if (!job) {
        return "";
    }


    const totalQuestions =
        getJobInfoValue(
            job,
            [
                "totalQuestions",
                "questions"
            ],
            ""
        );


    const totalMarks =
        getJobInfoValue(
            job,
            [
                "totalMarks",
                "marks"
            ],
            ""
        );


    const duration =
        getJobInfoValue(
            job,
            [
                "duration",
                "examDuration",
                "timeDuration"
            ],
            ""
        );


    const negativeMarking =
        getJobInfoValue(
            job,
            [
                "negativeMarking",
                "negative"
            ],
            ""
        );


    if (
        !totalQuestions &&
        !totalMarks &&
        !duration &&
        !negativeMarking
    ) {
        return "";
    }


    return `

        <section class="info-card">

            <h2 class="section-title">
                Exam Summary
            </h2>


            <div class="eligibility-grid">

                ${
                    totalQuestions
                        ? `
                            <div class="eligibility-item">

                                <strong>
                                    Total Questions
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(
                                            totalQuestions
                                        )
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }


                ${
                    totalMarks
                        ? `
                            <div class="eligibility-item">

                                <strong>
                                    Total Marks
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(
                                            totalMarks
                                        )
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }


                ${
                    duration
                        ? `
                            <div class="eligibility-item">

                                <strong>
                                    Exam Duration
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(
                                            duration
                                        )
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }


                ${
                    negativeMarking
                        ? `
                            <div class="eligibility-item">

                                <strong>
                                    Negative Marking
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        String(
                                            negativeMarking
                                        )
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }

            </div>

        </section>

    `;

}


/* ---------- Render Part 24 ---------- */

function renderJobPart24(
    job,
    container
) {

    if (!container || !job) {
        return;
    }


    container.innerHTML +=

        createJobSelectionProcess(job) +

        createJobExamPattern(job) +

        createJobExamSummary(job);

}


/* ---------- Initialize Part 24 ---------- */

function initializeJobPart24() {

    const container =
        document.querySelector(
            "#job-detail-content, " +
            ".job-detail-content, " +
            "[data-job-detail-content]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;


    if (!job) {
        return;
    }


    renderJobPart24(
        job,
        container
    );

}


/* ---------- Initialize Part 24 systems ---------- */

function initializePart24Systems() {

    initializeJobPart24();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart24 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart24();

    initializePart24Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobPart24 = {

    getJobSelectionStages,

    createJobSelectionProcess,

    getJobExamPattern,

    createJobExamPattern,

    createJobExamSummary,

    renderJobPart24,

    initializeJobPart24

};


/* ---------- END PART 24 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 25 — DOCUMENTS, INSTRUCTIONS & JOB FAQ
   ========================================================= */


/* ---------- Get job documents ---------- */

function getJobDocuments(job) {

    if (!job) {
        return [];
    }


    const documents =
        job.documents ||
        job.requiredDocuments ||
        job.documentsRequired;


    if (Array.isArray(documents)) {
        return documents;
    }


    if (
        typeof documents === "string" &&
        documents.trim()
    ) {

        return documents
            .split(/\n|,/)
            .map(item => item.trim())
            .filter(Boolean);

    }


    return [];

}


/* ---------- Create document list ---------- */

function createJobDocuments(job) {

    const documents =
        getJobDocuments(job);


    if (!documents.length) {

        return `

            <section class="info-card">

                <h2 class="section-title">
                    Required Documents
                </h2>

                <div class="empty-box">

                    इस भर्ती के लिए documents की
                    जानकारी अभी उपलब्ध नहीं है।

                </div>

            </section>

        `;

    }


    const items =
        documents.map(
            (document, index) => `

                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        ${index + 1}
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(document)
                        )}
                    </strong>

                </div>

            `
        ).join("");


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Required Documents
                    </h2>

                    <p class="section-subtitle">
                        आवेदन के समय आवश्यक documents
                    </p>

                </div>

            </div>


            <div class="syllabus-list">

                ${items}

            </div>

        </section>

    `;

}


/* ---------- Get important instructions ---------- */

function getJobInstructions(job) {

    if (!job) {
        return [];
    }


    const instructions =
        job.instructions ||
        job.importantInstructions ||
        job.importantNotes ||
        job.notes;


    if (Array.isArray(instructions)) {
        return instructions;
    }


    if (
        typeof instructions === "string" &&
        instructions.trim()
    ) {

        return instructions
            .split(/\n/)
            .map(item => item.trim())
            .filter(Boolean);

    }


    return [];

}


/* ---------- Create instructions ---------- */

function createJobInstructions(job) {

    const instructions =
        getJobInstructions(job);


    if (!instructions.length) {

        return `

            <section class="info-card">

                <h2 class="section-title">
                    Important Instructions
                </h2>

                <div class="empty-box">

                    इस भर्ती के लिए विशेष instructions
                    अभी उपलब्ध नहीं हैं।

                </div>

            </section>

        `;

    }


    const items =
        instructions.map(
            (instruction, index) => `

                <div class="info-row">

                    <strong>
                        ${index + 1}.
                    </strong>

                    <span>
                        ${escapeHTML(
                            String(instruction)
                        )}
                    </span>

                </div>

            `
        ).join("");


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Important Instructions
                    </h2>

                    <p class="section-subtitle">
                        आवेदन से पहले ध्यान देने योग्य बातें
                    </p>

                </div>

            </div>


            <div>

                ${items}

            </div>

        </section>

    `;

}


/* ---------- Default application instructions ---------- */

function createGeneralApplicationInstructions() {

    return `

        <section class="info-card">

            <h2 class="section-title">
                Application Instructions
            </h2>

            <div class="syllabus-list">

                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        1
                    </span>

                    <strong>
                        Official notification को ध्यान से पढ़ें।
                    </strong>

                </div>


                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        2
                    </span>

                    <strong>
                        अपनी qualification और age eligibility
                        verify करें।
                    </strong>

                </div>


                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        3
                    </span>

                    <strong>
                        सभी required documents तैयार रखें।
                    </strong>

                </div>


                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        4
                    </span>

                    <strong>
                        Application form में नाम, DOB,
                        category और अन्य details ध्यान से भरें।
                    </strong>

                </div>


                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        5
                    </span>

                    <strong>
                        Final submission के बाद application
                        form और payment receipt सुरक्षित रखें।
                    </strong>

                </div>


                <div class="syllabus-item">

                    <span class="badge badge-primary">
                        6
                    </span>

                    <strong>
                        अंतिम निर्णय के लिए हमेशा official
                        notification को प्राथमिक source मानें।
                    </strong>

                </div>

            </div>

        </section>

    `;

}


/* ---------- Get job FAQ ---------- */

function getJobFAQ(job) {

    if (!job) {
        return [];
    }


    const faq =
        job.faq ||
        job.faqs ||
        job.questions;


    if (Array.isArray(faq)) {
        return faq;
    }


    return [];

}


/* ---------- Create FAQ ---------- */

function createJobFAQ(job) {

    const faq =
        getJobFAQ(job);


    if (!faq.length) {

        return `

            <section class="info-card">

                <div class="section-header">

                    <div>

                        <h2 class="section-title">
                            Frequently Asked Questions
                        </h2>

                        <p class="section-subtitle">
                            इस भर्ती से जुड़े सामान्य सवाल
                        </p>

                    </div>

                </div>


                <div class="faq-list">

                    <div class="faq-item">

                        <button
                            type="button"
                            class="faq-question"
                        >

                            इस भर्ती की eligibility कहाँ
                            check करें?

                            <span>+</span>

                        </button>

                        <div class="faq-answer">

                            Official notification में दी गई
                            eligibility को प्राथमिकता दें।

                        </div>

                    </div>


                    <div class="faq-item">

                        <button
                            type="button"
                            class="faq-question"
                        >

                            Apply करने से पहले क्या करें?

                            <span>+</span>

                        </button>

                        <div class="faq-answer">

                            Qualification, age limit, fee,
                            dates और required documents
                            verify करें।

                        </div>

                    </div>


                    <div class="faq-item">

                        <button
                            type="button"
                            class="faq-question"
                        >

                            Official website कौन सी है?

                            <span>+</span>

                        </button>

                        <div class="faq-answer">

                            Sarkariiichij पर उपलब्ध link से
                            संबंधित official website खोली जा
                            सकती है, यदि verified official URL
                            उपलब्ध हो।

                        </div>

                    </div>

                </div>

            </section>

        `;

    }


    const items =
        faq.map(
            item => {

                const question =
                    item.question ||
                    item.q ||
                    "Question";


                const answer =
                    item.answer ||
                    item.a ||
                    "जानकारी उपलब्ध नहीं है";


                return `

                    <div class="faq-item">

                        <button
                            type="button"
                            class="faq-question"
                        >

                            ${escapeHTML(
                                String(question)
                            )}

                            <span>+</span>

                        </button>

                        <div class="faq-answer">

                            ${escapeHTML(
                                String(answer)
                            )}

                        </div>

                    </div>

                `;

            }
        ).join("");


    return `

        <section class="info-card">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Frequently Asked Questions
                    </h2>

                    <p class="section-subtitle">
                        भर्ती से जुड़े सामान्य प्रश्न
                    </p>

                </div>

            </div>


            <div class="faq-list">

                ${items}

            </div>

        </section>

    `;

}


/* ---------- Job information disclaimer ---------- */

function createJobInformationDisclaimer() {

    return `

        <section class="info-card">

            <h2 class="section-title">
                Important Notice
            </h2>

            <p>

                Sarkariiichij पर दी गई भर्ती संबंधी जानकारी
                उपयोगी reference के लिए है। Vacancy, dates,
                eligibility, fee, syllabus, selection process
                और अन्य नियमों में बदलाव संभव है।

            </p>

            <p>

                आवेदन करने से पहले संबंधित recruitment
                authority की official notification और
                official website पर जानकारी verify करें।

            </p>

        </section>

    `;

}


/* ---------- Render Part 25 ---------- */

function renderJobPart25(
    job,
    container
) {

    if (!container || !job) {
        return;
    }


    container.innerHTML +=

        createJobDocuments(job) +

        createJobInstructions(job) +

        createGeneralApplicationInstructions() +

        createJobFAQ(job) +

        createJobInformationDisclaimer();


    if (
        typeof setupFAQ === "function"
    ) {

        setupFAQ();

    }

}


/* ---------- Initialize Part 25 ---------- */

function initializeJobPart25() {

    const container =
        document.querySelector(
            "#job-detail-content, " +
            ".job-detail-content, " +
            "[data-job-detail-content]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob === "function"
            ? findSarkariiChijJob(jobId)
            : null;


    if (!job) {
        return;
    }


    renderJobPart25(
        job,
        container
    );

}


/* ---------- Initialize Part 25 systems ---------- */

function initializePart25Systems() {

    initializeJobPart25();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart25 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart25();

    initializePart25Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobPart25 = {

    getJobDocuments,

    createJobDocuments,

    getJobInstructions,

    createJobInstructions,

    createGeneralApplicationInstructions,

    getJobFAQ,

    createJobFAQ,

    createJobInformationDisclaimer,

    renderJobPart25,

    initializeJobPart25

};


/* ---------- END PART 25 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 26 — RELATED JOBS & RELATED RESOURCES
   ========================================================= */


/* ---------- Find similar jobs ---------- */

function findSimilarJobs(job) {

    if (
        !job ||
        !Array.isArray(SarkariiChijJobs)
    ) {
        return [];
    }


    const currentId =
        job.id;


    const currentDepartment =
        String(
            job.department ||
            job.organization ||
            ""
        ).toLowerCase();


    const currentQualification =
        String(
            job.qualification ||
            job.education ||
            ""
        ).toLowerCase();


    const currentCategory =
        String(
            job.category ||
            job.jobType ||
            ""
        ).toLowerCase();


    return SarkariiChijJobs
        .filter(item => {

            if (!item || item.id === currentId) {
                return false;
            }


            const department =
                String(
                    item.department ||
                    item.organization ||
                    ""
                ).toLowerCase();


            const qualification =
                String(
                    item.qualification ||
                    item.education ||
                    ""
                ).toLowerCase();


            const category =
                String(
                    item.category ||
                    item.jobType ||
                    ""
                ).toLowerCase();


            return (
                (
                    currentDepartment &&
                    department &&
                    (
                        department.includes(
                            currentDepartment
                        ) ||
                        currentDepartment.includes(
                            department
                        )
                    )
                ) ||

                (
                    currentQualification &&
                    qualification &&
                    (
                        qualification.includes(
                            currentQualification
                        ) ||
                        currentQualification.includes(
                            qualification
                        )
                    )
                ) ||

                (
                    currentCategory &&
                    category &&
                    category === currentCategory
                )
            );

        })
        .slice(0, 6);

}


/* ---------- Create related job card ---------- */

function createRelatedJobCard(job) {

    if (!job) {
        return "";
    }


    const title =
        job.title ||
        job.name ||
        job.post ||
        "Government Job";


    const department =
        job.department ||
        job.organization ||
        "Department जानकारी उपलब्ध नहीं";


    const qualification =
        job.qualification ||
        job.education ||
        "Qualification जानकारी उपलब्ध नहीं";


    const lastDate =
        job.lastDate ||
        job.applicationLastDate ||
        "जानकारी उपलब्ध नहीं";


    const jobURL =
        typeof getJobDetailURL === "function"
            ? getJobDetailURL(job.id)
            : "#";


    return `

        <article class="job-card">

            <div class="job-badge">
                Government Job
            </div>


            <h3 class="job-title">

                ${escapeHTML(
                    String(title)
                )}

            </h3>


            <div class="job-meta">

                <div>

                    <strong>
                        Department:
                    </strong>

                    ${escapeHTML(
                        String(department)
                    )}

                </div>


                <div>

                    <strong>
                        Qualification:
                    </strong>

                    ${escapeHTML(
                        String(qualification)
                    )}

                </div>


                <div>

                    <strong>
                        Last Date:
                    </strong>

                    ${escapeHTML(
                        String(lastDate)
                    )}

                </div>

            </div>


            <div class="job-actions">

                <a
                    href="${escapeHTML(jobURL)}"
                    class="btn btn-primary"
                >
                    View Details
                </a>

            </div>

        </article>

    `;

}


/* ---------- Render related jobs ---------- */

function renderRelatedJobs(
    job,
    container
) {

    if (!container) {
        return;
    }


    const relatedJobs =
        findSimilarJobs(job);


    if (!relatedJobs.length) {

        container.innerHTML = `

            <section class="info-card">

                <h2 class="section-title">
                    Related Government Jobs
                </h2>

                <div class="empty-box">

                    इस भर्ती से संबंधित अन्य jobs
                    अभी उपलब्ध नहीं हैं।

                </div>

            </section>

        `;

        return;
    }


    const cards =
        relatedJobs
            .map(
                createRelatedJobCard
            )
            .join("");


    container.innerHTML = `

        <section class="section">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Related Government Jobs
                    </h2>

                    <p class="section-subtitle">
                        आपकी वर्तमान भर्ती से संबंधित
                        अन्य सरकारी नौकरियाँ
                    </p>

                </div>

            </div>


            <div class="job-grid">

                ${cards}

            </div>

        </section>

    `;

}


/* ---------- Find related resources ---------- */

function findJobRelatedResourceItems(job) {

    if (!job) {
        return [];
    }


    const resources = [];


    const jobId =
        job.id;


    if (
        typeof findSingleJobResource === "function"
    ) {

        const resource =
            findSingleJobResource(
                jobId
            );


        if (resource) {

            if (Array.isArray(resource)) {

                resources.push(
                    ...resource
                );

            } else {

                resources.push(
                    resource
                );

            }

        }

    }


    if (
        typeof findJobRelatedResources ===
        "function"
    ) {

        const related =
            findJobRelatedResources(
                job
            );


        if (Array.isArray(related)) {

            related.forEach(item => {

                if (
                    item &&
                    !resources.some(
                        existing =>
                            existing.id === item.id
                    )
                ) {

                    resources.push(item);

                }

            });

        }

    }


    return resources.slice(0, 8);

}


/* ---------- Create related resource card ---------- */

function createJobRelatedResourceCard(
    resource
) {

    if (!resource) {
        return "";
    }


    const title =
        resource.title ||
        resource.name ||
        "Exam Resource";


    const type =
        resource.type ||
        resource.resourceType ||
        "Resource";


    let url = "#";


    if (
        typeof getResourceDetailPageURL ===
        "function" &&
        resource.id
    ) {

        url =
            getResourceDetailPageURL(
                resource.id,
                resource.type ||
                resource.resourceType ||
                ""
            );

    }


    return `

        <article class="resource-card">

            <div class="badge badge-primary">

                ${escapeHTML(
                    String(type)
                )}

            </div>


            <h3>

                ${escapeHTML(
                    String(title)
                )}

            </h3>


            <div class="resource-card-actions">

                <a
                    href="${escapeHTML(url)}"
                    class="btn btn-secondary"
                >
                    Open Resource
                </a>

            </div>

        </article>

    `;

}


/* ---------- Render related resources ---------- */

function renderJobRelatedResources(
    job,
    container
) {

    if (!container) {
        return;
    }


    const resources =
        findJobRelatedResourceItems(
            job
        );


    if (!resources.length) {

        container.innerHTML = `

            <section class="info-card">

                <h2 class="section-title">
                    Related Resources
                </h2>

                <div class="empty-box">

                    इस भर्ती के related resources
                    अभी उपलब्ध नहीं हैं।

                </div>

            </section>

        `;

        return;
    }


    const cards =
        resources
            .map(
                createJobRelatedResourceCard
            )
            .join("");


    container.innerHTML = `

        <section class="section">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        Related Exam Resources
                    </h2>

                    <p class="section-subtitle">
                        Syllabus, Admit Card, Result,
                        Cut Off और अन्य उपलब्ध resources
                    </p>

                </div>

            </div>


            <div class="resource-grid">

                ${cards}

            </div>

        </section>

    `;

}


/* ---------- Combined related section ---------- */

function renderCompleteRelatedSection(
    job,
    container
) {

    if (!container || !job) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "job-related-content";


    const jobsContainer =
        document.createElement("div");


    jobsContainer.className =
        "related-jobs-container";


    const resourcesContainer =
        document.createElement("div");


    resourcesContainer.className =
        "related-resources-container";


    wrapper.appendChild(
        jobsContainer
    );


    wrapper.appendChild(
        resourcesContainer
    );


    container.appendChild(
        wrapper
    );


    renderRelatedJobs(
        job,
        jobsContainer
    );


    renderJobRelatedResources(
        job,
        resourcesContainer
    );

}


/* ---------- Initialize Part 26 ---------- */

function initializeJobPart26() {

    const container =
        document.querySelector(
            "#job-related-content, " +
            ".job-related-content, " +
            "[data-job-related-content]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob ===
        "function"
            ? findSarkariiChijJob(jobId)
            : null;


    if (!job) {
        return;
    }


    renderCompleteRelatedSection(
        job,
        container
    );

}


/* ---------- Initialize Part 26 systems ---------- */

function initializePart26Systems() {

    initializeJobPart26();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart26 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart26();

    initializePart26Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobRelated = {

    findSimilarJobs,

    createRelatedJobCard,

    renderRelatedJobs,

    findJobRelatedResourceItems,

    createJobRelatedResourceCard,

    renderJobRelatedResources,

    renderCompleteRelatedSection,

    initializeJobPart26

};


/* ---------- END PART 26 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 27 — SAVE JOB, REMINDER & APPLICATION TRACKER
   ========================================================= */


/* ---------- Create Job Personal Actions ---------- */

function createJobPersonalActions(job) {

    if (!job) {
        return "";
    }


    const jobId =
        String(job.id || "");


    if (!jobId) {
        return "";
    }


    const saved =
        typeof isJobSaved === "function"
            ? isJobSaved(jobId)
            : false;


    const saveLabel =
        saved
            ? "★ Saved Job"
            : "☆ Save Job";


    return `

        <section class="info-card job-personal-actions">

            <div class="section-header">

                <div>

                    <h2 class="section-title">
                        My Job Actions
                    </h2>

                    <p class="section-subtitle">
                        इस भर्ती को save करें और
                        अपनी application track करें
                    </p>

                </div>

            </div>


            <div class="job-actions">

                <button
                    type="button"
                    class="btn btn-primary"
                    data-personal-save-job="${escapeHTML(jobId)}"
                >
                    ${saveLabel}
                </button>


                <button
                    type="button"
                    class="btn btn-secondary"
                    data-personal-reminder-job="${escapeHTML(jobId)}"
                >
                    🔔 Set Reminder
                </button>


                <button
                    type="button"
                    class="btn btn-secondary"
                    data-personal-track-job="${escapeHTML(jobId)}"
                >
                    📋 Track Application
                </button>

            </div>


            <div
                class="job-personal-status"
                data-job-personal-status="${escapeHTML(jobId)}"
            ></div>

        </section>

    `;

}


/* ---------- Save Job ---------- */

function handlePersonalSaveJob(jobId) {

    if (!jobId) {
        return;
    }


    if (
        typeof toggleSavedJob === "function"
    ) {

        toggleSavedJob(jobId);

    }


    updatePersonalJobActionState(
        jobId
    );

}


/* ---------- Reminder ---------- */

function handlePersonalJobReminder(job) {

    if (!job) {
        return;
    }


    const jobId =
        String(job.id || "");


    if (!jobId) {
        return;
    }


    const lastDate =
        job.lastDate ||
        job.applicationLastDate ||
        "";


    const title =
        job.title ||
        job.name ||
        job.post ||
        "Government Job";


    if (
        typeof createReminder === "function"
    ) {

        const reminder =
            createReminder({

                id:
                    "job-reminder-" +
                    jobId,

                type:
                    "job",

                title:
                    title,

                jobId:
                    jobId,

                date:
                    lastDate,

                message:
                    "Application Last Date Reminder"

            });


        if (reminder) {

            showToast(
                "Job reminder set successfully.",
                "success"
            );

        }

    }


    updatePersonalJobActionState(
        jobId
    );

}


/* ---------- Application Tracker ---------- */

function handlePersonalJobTracker(job) {

    if (!job) {
        return;
    }


    const jobId =
        String(job.id || "");


    if (!jobId) {
        return;
    }


    const title =
        job.title ||
        job.name ||
        job.post ||
        "Government Job";


    const existing =
        typeof getApplications === "function"
            ? getApplications()
            : [];


    const alreadyExists =
        existing.some(
            item =>
                String(
                    item.jobId || ""
                ) === jobId
        );


    if (alreadyExists) {

        showToast(
            "यह job पहले से Application Tracker में है।",
            "info"
        );

        return;
    }


    if (
        typeof saveApplication === "function"
    ) {

        saveApplication({

            id:
                "application-" +
                jobId,

            jobId:
                jobId,

            title:
                title,

            status:
                "Not Applied",

            lastDate:
                job.lastDate ||
                job.applicationLastDate ||
                "",

            createdAt:
                new Date().toISOString()

        });


        showToast(
            "Job Application Tracker में add हो गई।",
            "success"
        );

    }


    updatePersonalJobActionState(
        jobId
    );

}


/* ---------- Update action state ---------- */

function updatePersonalJobActionState(
    jobId
) {

    if (!jobId) {
        return;
    }


    const saveButton =
        document.querySelector(
            `[data-personal-save-job="${CSS.escape(jobId)}"]`
        );


    if (saveButton) {

        const saved =
            typeof isJobSaved === "function"
                ? isJobSaved(jobId)
                : false;


        saveButton.textContent =
            saved
                ? "★ Saved Job"
                : "☆ Save Job";

    }


    const status =
        document.querySelector(
            `[data-job-personal-status="${CSS.escape(jobId)}"]`
        );


    if (!status) {
        return;
    }


    const applications =
        typeof getApplications === "function"
            ? getApplications()
            : [];


    const reminders =
        typeof getReminders === "function"
            ? getReminders()
            : [];


    const saved =
        typeof isJobSaved === "function"
            ? isJobSaved(jobId)
            : false;


    const tracked =
        applications.some(
            item =>
                String(
                    item.jobId || ""
                ) === String(jobId)
        );


    const reminded =
        reminders.some(
            item =>
                String(
                    item.jobId || ""
                ) === String(jobId)
        );


    const states = [];


    if (saved) {
        states.push("✓ Saved");
    }


    if (reminded) {
        states.push("✓ Reminder Set");
    }


    if (tracked) {
        states.push("✓ Application Tracked");
    }


    status.innerHTML =
        states.length
            ? `
                <div class="badge badge-success">
                    ${escapeHTML(
                        states.join(" • ")
                    )}
                </div>
              `
            : "";

}


/* ---------- Setup personal action events ---------- */

function setupPersonalJobActionEvents(
    container,
    job
) {

    if (!container || !job) {
        return;
    }


    const saveButton =
        container.querySelector(
            `[data-personal-save-job="${CSS.escape(
                String(job.id || "")
            )}"]`
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function() {

                handlePersonalSaveJob(
                    String(job.id || "")
                );

            }
        );

    }


    const reminderButton =
        container.querySelector(
            `[data-personal-reminder-job="${CSS.escape(
                String(job.id || "")
            )}"]`
        );


    if (reminderButton) {

        reminderButton.addEventListener(
            "click",
            function() {

                handlePersonalJobReminder(
                    job
                );

            }
        );

    }


    const trackerButton =
        container.querySelector(
            `[data-personal-track-job="${CSS.escape(
                String(job.id || "")
            )}"]`
        );


    if (trackerButton) {

        trackerButton.addEventListener(
            "click",
            function() {

                handlePersonalJobTracker(
                    job
                );

            }
        );

    }


    updatePersonalJobActionState(
        String(job.id || "")
    );

}


/* ---------- Render personal actions ---------- */

function renderJobPersonalActions(
    job,
    container
) {

    if (!container || !job) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.innerHTML =
        createJobPersonalActions(
            job
        );


    container.appendChild(
        wrapper
    );


    setupPersonalJobActionEvents(
        wrapper,
        job
    );

}


/* ---------- Initialize Part 27 ---------- */

function initializeJobPart27() {

    const container =
        document.querySelector(
            "#job-personal-actions-container, " +
            ".job-personal-actions-container, " +
            "[data-job-personal-actions]"
        );


    if (!container) {
        return;
    }


    const jobId =
        typeof getJobIdFromURL === "function"
            ? getJobIdFromURL()
            : "";


    if (!jobId) {
        return;
    }


    const job =
        typeof findSarkariiChijJob ===
        "function"
            ? findSarkariiChijJob(jobId)
            : null;


    if (!job) {
        return;
    }


    renderJobPersonalActions(
        job,
        container
    );

}


/* ---------- Initialize Part 27 systems ---------- */

function initializePart27Systems() {

    initializeJobPart27();

}


/* ---------- Chain initialization ---------- */

const previousInitializePart27 =
    initializeSarkariiChij;


initializeSarkariiChij = function() {

    previousInitializePart27();

    initializePart27Systems();

};


/* ---------- Global API ---------- */

window.SarkariiChijJobPersonal = {

    createJobPersonalActions,

    handlePersonalSaveJob,

    handlePersonalJobReminder,

    handlePersonalJobTracker,

    updatePersonalJobActionState,

    setupPersonalJobActionEvents,

    renderJobPersonalActions,

    initializeJobPart27

};


/* ---------- END PART 27 ---------- */
/* =========================================================
   SARKARIIICHIJ — SCRIPT.JS
   PART 28 — FINAL INTEGRATION & SAFETY CHECK
   ========================================================= */


/* ---------- Final System State ---------- */

SarkariiChij.finalSystem = {

    version: "1.0.0",

    initialized: false,

    initializedAt: null,

    errors: [],

    warnings: []

};


/* ---------- Safe Function Runner ---------- */

function runSarkariiChijSafe(
    functionName,
    callback
) {

    if (
        typeof callback !== "function"
    ) {
        return null;
    }


    try {

        return callback();

    } catch (error) {

        SarkariiChij.finalSystem.errors.push({

            function:
                functionName,

            message:
                error &&
                error.message
                    ? error.message
                    : String(error),

            time:
                new Date().toISOString()

        });


        console.error(
            "Sarkariiichij error:",
            functionName,
            error
        );


        return null;

    }

}


/* ---------- Final Counter Refresh ---------- */

function refreshFinalCounters() {

    runSarkariiChijSafe(
        "updateDashboardCounts",
        function() {

            if (
                typeof updateDashboardCounts ===
                "function"
            ) {

                updateDashboardCounts();

            }

        }
    );


    runSarkariiChijSafe(
        "updateSavedJobCount",
        function() {

            if (
                typeof updateSavedJobCount ===
                "function"
            ) {

                updateSavedJobCount();

            }

        }
    );


    runSarkariiChijSafe(
        "updateApplicationCount",
        function() {

            if (
                typeof updateApplicationCount ===
                "function"
            ) {

                updateApplicationCount();

            }

        }
    );


    runSarkariiChijSafe(
        "updateReminderCount",
        function() {

            if (
                typeof updateReminderCount ===
                "function"
            ) {

                updateReminderCount();

            }

        }
    );

}


/* ---------- Final Dashboard Refresh ---------- */

function refreshFinalDashboard() {

    runSarkariiChijSafe(
        "renderSavedItemsSummary",
        function() {

            if (
                typeof renderSavedItemsSummary ===
                "function"
            ) {

                renderSavedItemsSummary();

            }

        }
    );


    runSarkariiChijSafe(
        "renderApplicationSummary",
        function() {

            if (
                typeof renderApplicationSummary ===
                "function"
            ) {

                renderApplicationSummary();

            }

        }
    );


    runSarkariiChijSafe(
        "renderReminderSummary",
        function() {

            if (
                typeof renderReminderSummary ===
                "function"
            ) {

                renderReminderSummary();

            }

        }
    );

}


/* ---------- Final Mobile Check ---------- */

function finalMobileSystemCheck() {

    runSarkariiChijSafe(
        "setupMobileBottomNavigation",
        function() {

            if (
                typeof setupMobileBottomNavigation ===
                "function"
            ) {

                setupMobileBottomNavigation();

            }

        }
    );


    runSarkariiChijSafe(
        "setupMobileLinkClose",
        function() {

            if (
                typeof setupMobileLinkClose ===
                "function"
            ) {

                setupMobileLinkClose();

            }

        }
    );

}


/* ---------- Final Search Check ---------- */

function finalSearchSystemCheck() {

    runSarkariiChijSafe(
        "initializeSearchSystem",
        function() {

            if (
                typeof initializeSearchSystem ===
                "function"
            ) {

                initializeSearchSystem();

            }

        }
    );

}


/* ---------- Final Job System Check ---------- */

function finalJobSystemCheck() {

    runSarkariiChijSafe(
        "initializeJobSystem",
        function() {

            if (
                typeof initializeJobSystem ===
                "function"
            ) {

                initializeJobSystem();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeJobFilterSystem",
        function() {

            if (
                typeof initializeJobFilterSystem ===
                "function"
            ) {

                initializeJobFilterSystem();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeJobDetailActions",
        function() {

            if (
                typeof initializeJobDetailActions ===
                "function"
            ) {

                initializeJobDetailActions();

            }

        }
    );

}


/* ---------- Final Resource Check ---------- */

function finalResourceSystemCheck() {

    runSarkariiChijSafe(
        "initializeResourceSystem",
        function() {

            if (
                typeof initializeResourceSystem ===
                "function"
            ) {

                initializeResourceSystem();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeRelatedResources",
        function() {

            if (
                typeof initializeRelatedResources ===
                "function"
            ) {

                initializeRelatedResources();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeJobRelatedResources",
        function() {

            if (
                typeof initializeJobRelatedResources ===
                "function"
            ) {

                initializeJobRelatedResources();

            }

        }
    );

}


/* ---------- Final Service Check ---------- */

function finalServiceSystemCheck() {

    runSarkariiChijSafe(
        "initializeServiceSystem",
        function() {

            if (
                typeof initializeServiceSystem ===
                "function"
            ) {

                initializeServiceSystem();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeServiceDetailPage",
        function() {

            if (
                typeof initializeServiceDetailPage ===
                "function"
            ) {

                initializeServiceDetailPage();

            }

        }
    );

}


/* ---------- Final Career Tools Check ---------- */

function finalCareerToolsCheck() {

    runSarkariiChijSafe(
        "initializeCareerTools",
        function() {

            if (
                typeof initializeCareerTools ===
                "function"
            ) {

                initializeCareerTools();

            }

        }
    );


    runSarkariiChijSafe(
        "initializeMockTest",
        function() {

            if (
                typeof initializeMockTest ===
                "function"
            ) {

                initializeMockTest();

            }

        }
    );


    runSarkariiChijSafe(
        "setupEligibilityChecker",
        function() {

            if (
                typeof setupEligibilityChecker ===
                "function"
            ) {

                setupEligibilityChecker();

            }

        }
    );

}


/* ---------- Final Page Systems Check ---------- */

function finalPageSystemsCheck() {

    runSarkariiChijSafe(
        "setupFAQ",
        function() {

            if (
                typeof setupFAQ ===
                "function"
            ) {

                setupFAQ();

            }

        }
    );


    runSarkariiChijSafe(
        "setupTabs",
        function() {

            if (
                typeof setupTabs ===
                "function"
            ) {

                setupTabs();

            }

        }
    );


    runSarkariiChijSafe(
        "setupDropdowns",
        function() {

            if (
                typeof setupDropdowns ===
                "function"
            ) {

                setupDropdowns();

            }

        }
    );


    runSarkariiChijSafe(
        "setupBackToTop",
        function() {

            if (
                typeof setupBackToTop ===
                "function"
            ) {

                setupBackToTop();

            }

        }
    );

}


/* ---------- Final Personal System Check ---------- */

function finalPersonalSystemCheck() {

    runSarkariiChijSafe(
        "setupSavedJobEvents",
        function() {

            if (
                typeof setupSavedJobEvents ===
                "function"
            ) {

                setupSavedJobEvents();

            }

        }
    );


    runSarkariiChijSafe(
        "setupReminderEvents",
        function() {

            if (
                typeof setupReminderEvents ===
                "function"
            ) {

                setupReminderEvents();

            }

        }
    );


    runSarkariiChijSafe(
        "setupApplicationTracker",
        function() {

            if (
                typeof setupApplicationTracker ===
                "function"
            ) {

                setupApplicationTracker();

            }

        }
    );

}


/* ---------- Final State Portal Check ---------- */

function finalStatePortalCheck() {

    runSarkariiChijSafe(
        "renderStatePortals",
        function() {

            if (
                typeof renderStatePortals ===
                "function"
            ) {

                renderStatePortals();

            }

        }
    );

}


/* ---------- Final Notifications Check ---------- */

function finalNotificationCheck() {

    runSarkariiChijSafe(
        "renderNotifications",
        function() {

            if (
                typeof renderNotifications ===
                "function"
            ) {

                renderNotifications();

            }

        }
    );


    runSarkariiChijSafe(
        "updateNotificationCount",
        function() {

            if (
                typeof updateNotificationCount ===
                "function"
            ) {

                updateNotificationCount();

            }

        }
    );

}


/* ---------- Final System Verification ---------- */

function verifySarkariiChijSystems() {

    const requiredFunctions = [

        "goToPage",

        "searchSite",

        "saveJob",

        "removeSavedJob",

        "createReminder",

        "saveApplication",

        "checkEligibility",

        "calculatePercentage",

        "calculateEMI",

        "calculateCareerBMI",

        "initializeMockTest",

        "findSarkariiChijJob",

        "renderJobDetails",

        "renderSarkariiChijResources",

        "renderSarkariiChijServices",

        "renderCompleteJobInformation",

        "createCompleteJobActions",

        "createJobImportantDates",

        "createJobSelectionProcess",

        "createJobExamPattern",

        "createJobDocuments",

        "createJobFAQ",

        "renderRelatedJobs",

        "renderJobPersonalActions"

    ];


    const missing = [];


    requiredFunctions.forEach(
        function(functionName) {

            if (
                typeof window[functionName] !==
                "function"
            ) {

                missing.push(
                    functionName
                );

            }

        }
    );


    SarkariiChij.finalSystem.warnings =
        missing;


    if (missing.length) {

        console.warn(
            "Sarkariiichij missing functions:",
            missing
        );

    }


    return {

        success:
            missing.length === 0,

        missing:
            missing,

        errors:
            SarkariiChij.finalSystem.errors

    };

}


/* ---------- Final Integration ---------- */

function initializeFinalSarkariiChijSystem() {

    if (
        SarkariiChij.finalSystem.initialized
    ) {

        return;

    }


    SarkariiChij.finalSystem.initialized =
        true;


    SarkariiChij.finalSystem.initializedAt =
        new Date().toISOString();


    refreshFinalCounters();

    refreshFinalDashboard();

    finalMobileSystemCheck();

    finalSearchSystemCheck();

    finalJobSystemCheck();

    finalResourceSystemCheck();

    finalServiceSystemCheck();

    finalCareerToolsCheck();

    finalPageSystemsCheck();

    finalPersonalSystemCheck();

    finalStatePortalCheck();

    finalNotificationCheck();


    const verification =
        verifySarkariiChijSystems();


    if (verification.success) {

        console.log(
            "Sarkariiichij: Final system check completed successfully."
        );

    } else {

        console.warn(
            "Sarkariiichij: Final check completed with warnings."
        );

    }

}


/* ---------- Final DOM Ready ---------- */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            setTimeout(
                initializeFinalSarkariiChijSystem,
                0
            );

        },
        {
            once: true
        }
    );

} else {

    setTimeout(
        initializeFinalSarkariiChijSystem,
        0
    );

}


/* ---------- Global Final API ---------- */

window.SarkariiChijFinal = {

    verify:
        verifySarkariiChijSystems,

    initialize:
        initializeFinalSarkariiChijSystem,

    refreshCounters:
        refreshFinalCounters,

    refreshDashboard:
        refreshFinalDashboard,

    getState:
        function() {

            return SarkariiChij.finalSystem;

        }

};


/* =========================================================
   FINAL SCRIPT.JS COMPLETE
   ========================================================= */
