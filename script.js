(function () {
    "use strict";

    const App = window.SarkariiChij = window.SarkariiChij || {};

    App.config = {
        name: "Sarkariiichij",
        version: "1.0.0",
        storage: "sarkariiichij_"
    };

    App.state = {
        page: location.pathname.split("/").pop() || "index.html",
        jobs: [],
        savedJobs: [],
        reminders: []
    };

    App.$ = function (selector) {
        return document.querySelector(selector);
    };

    App.$$ = function (selector) {
        return Array.from(
            document.querySelectorAll(selector)
        );
    };

    App.text = function (value) {
        return value === null || value === undefined
            ? ""
            : String(value).trim();
    };

    App.escape = function (value) {
        return App.text(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    App.storage = {
        get: function (key, fallback) {
            try {
                const value = localStorage.getItem(
                    App.config.storage + key
                );

                return value === null
                    ? fallback
                    : JSON.parse(value);

            } catch (error) {
                return fallback;
            }
        },

        set: function (key, value) {
            try {
                localStorage.setItem(
                    App.config.storage + key,
                    JSON.stringify(value)
                );

                return true;

            } catch (error) {
                return false;
            }
        },

        remove: function (key) {
            try {
                localStorage.removeItem(
                    App.config.storage + key
                );
            } catch (error) {}
        }
    };

    App.toast = function (message) {
        let box = App.$("#sarkarii-toast");

        if (!box) {
            box = document.createElement("div");
            box.id = "sarkarii-toast";

            box.style.position = "fixed";
            box.style.left = "50%";
            box.style.bottom = "80px";
            box.style.transform = "translateX(-50%)";
            box.style.zIndex = "99999";
            box.style.padding = "10px 16px";
            box.style.borderRadius = "8px";
            box.style.background = "#111827";
            box.style.color = "#fff";
            box.style.fontSize = "14px";
            box.style.boxShadow =
                "0 5px 20px rgba(0,0,0,.2)";

            document.body.appendChild(box);
        }

        box.textContent = App.text(message);
        box.style.display = "block";

        clearTimeout(box._timer);

        box._timer = setTimeout(function () {
            box.style.display = "none";
        }, 2500);
    };

    App.loadSavedJobs = function () {
        const saved = App.storage.get(
            "savedJobs",
            []
        );

        App.state.savedJobs =
            Array.isArray(saved) ? saved : [];
    };

    App.saveJob = function (id) {
        id = App.text(id);

        if (!id) return false;

        if (
            !App.state.savedJobs.includes(id)
        ) {
            App.state.savedJobs.push(id);
        }

        App.storage.set(
            "savedJobs",
            App.state.savedJobs
        );

        return true;
    };

    App.removeSavedJob = function (id) {
        App.state.savedJobs =
            App.state.savedJobs.filter(
                function (item) {
                    return item !== id;
                }
            );

        App.storage.set(
            "savedJobs",
            App.state.savedJobs
        );
    };

    App.isSaved = function (id) {
        return App.state.savedJobs.includes(
            App.text(id)
        );
    };

    App.toggleSavedJob = function (id) {
        if (App.isSaved(id)) {
            App.removeSavedJob(id);
            App.toast("Job saved list se hata di gayi.");
            return false;
        }

        App.saveJob(id);
        App.toast("Job saved list me add ho gayi.");
        return true;
    };

    App.setYear = function () {
        const year =
            new Date().getFullYear();

        App.$$("[data-current-year]")
            .forEach(function (element) {
                element.textContent = year;
            });
    };

    App.externalLinks = function () {
        App.$$("a[target='_blank']")
            .forEach(function (link) {
                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );
            });
    };

    App.init = function () {
        App.loadSavedJobs();
        App.setYear();
        App.externalLinks();
    };

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            App.init,
            { once: true }
        );
    } else {
        App.init();
    }

})();
(function () {
    "use strict";

    const App = window.SarkariiChij;

    if (!App) return;

    App.jobs = App.jobs || {};

    App.jobs.data = [];

    App.jobs.get = function () {
        return App.jobs.data;
    };

    App.jobs.set = function (jobs) {
        App.jobs.data =
            Array.isArray(jobs) ? jobs : [];

        App.state.jobs =
            App.jobs.data;

        return App.jobs.data;
    };

    App.jobs.find = function (id) {
        id = App.text(id);

        return App.jobs.data.find(
            function (job) {
                return App.text(job.id) === id;
            }
        ) || null;
    };

    App.jobs.search = function (query) {
        query =
            App.text(query).toLowerCase();

        if (!query) {
            return App.jobs.data.slice();
        }

        return App.jobs.data.filter(
            function (job) {

                const text = [
                    job.title,
                    job.department,
                    job.qualification,
                    job.state,
                    job.category,
                    job.type
                ]
                .map(App.text)
                .join(" ")
                .toLowerCase();

                return text.includes(query);
            }
        );
    };

    App.jobs.filter = function (options) {

        options = options || {};

        return App.jobs.data.filter(
            function (job) {

                const search =
                    App.text(
                        options.search
                    ).toLowerCase();

                const qualification =
                    App.text(
                        options.qualification
                    ).toLowerCase();

                const department =
                    App.text(
                        options.department
                    ).toLowerCase();

                const state =
                    App.text(
                        options.state
                    ).toLowerCase();

                const category =
                    App.text(
                        options.category
                    ).toLowerCase();

                const content = [
                    job.title,
                    job.department,
                    job.qualification,
                    job.state,
                    job.category,
                    job.type
                ]
                .map(App.text)
                .join(" ")
                .toLowerCase();

                if (
                    search &&
                    !content.includes(search)
                ) {
                    return false;
                }

                if (
                    qualification &&
                    App.text(
                        job.qualification
                    )
                    .toLowerCase()
                    .indexOf(
                        qualification
                    ) === -1
                ) {
                    return false;
                }

                if (
                    department &&
                    App.text(
                        job.department
                    )
                    .toLowerCase()
                    .indexOf(
                        department
                    ) === -1
                ) {
                    return false;
                }

                if (
                    state &&
                    App.text(
                        job.state
                    )
                    .toLowerCase()
                    .indexOf(
                        state
                    ) === -1
                ) {
                    return false;
                }

                if (
                    category &&
                    App.text(
                        job.category
                    )
                    .toLowerCase()
                    .indexOf(
                        category
                    ) === -1
                ) {
                    return false;
                }

                return true;
            }
        );
    };

    App.jobs.isOfficialLink =
        function (url) {

            url = App.text(url);

            if (!url) return false;

            try {

                const parsed =
                    new URL(url);

                return (
                    parsed.protocol ===
                    "https:"
                );

            } catch (error) {

                return false;
            }
        };

    App.jobs.getOfficialLink =
        function (job) {

            if (!job) return "";

            const links = [
                job.applyUrl,
                job.notificationUrl,
                job.officialUrl
            ];

            for (
                let i = 0;
                i < links.length;
                i++
            ) {

                if (
                    App.jobs.isOfficialLink(
                        links[i]
                    )
                ) {
                    return links[i];
                }
            }

            return "";
        };

    App.jobs.status =
        function (job) {

            if (!job) {
                return "unknown";
            }

            if (
                App.text(job.status)
                    .toLowerCase() ===
                "closed"
            ) {
                return "closed";
            }

            if (
                job.lastDate &&
                App.utils &&
                App.utils.date &&
                App.utils.date.isPast &&
                App.utils.date.isPast(
                    job.lastDate
                )
            ) {
                return "closed";
            }

            return "open";
        };

    App.jobs.countOpen =
        function () {

            return App.jobs.data.filter(
                function (job) {
                    return (
                        App.jobs.status(job) ===
                        "open"
                    );
                }
            ).length;
        };

    App.jobs.countClosed =
        function () {

            return App.jobs.data.filter(
                function (job) {
                    return (
                        App.jobs.status(job) ===
                        "closed"
                    );
                }
            ).length;
        };

})();
(function () {
    "use strict";

    const App = window.SarkariiChij;

    if (!App || !App.jobs) return;

    App.jobs.normalize = function (job) {

        job = job || {};

        return {
            id: App.text(job.id),

            title: App.text(job.title),

            department:
                App.text(job.department),

            qualification:
                App.text(job.qualification),

            age:
                App.text(job.age),

            salary:
                App.text(job.salary),

            vacancy:
                App.text(job.vacancy),

            fee:
                App.text(job.fee),

            state:
                App.text(job.state),

            category:
                App.text(job.category),

            startDate:
                App.text(job.startDate),

            lastDate:
                App.text(job.lastDate),

            examDate:
                App.text(job.examDate),

            status:
                App.text(job.status),

            officialUrl:
                App.text(job.officialUrl),

            notificationUrl:
                App.text(job.notificationUrl),

            applyUrl:
                App.text(job.applyUrl),

            description:
                App.text(job.description)
        };
    };


    App.jobs.add = function (job) {

        const item =
            App.jobs.normalize(job);

        if (!item.id) {
            return false;
        }

        const exists =
            App.jobs.find(item.id);

        if (exists) {
            return false;
        }

        App.jobs.data.push(item);

        App.state.jobs =
            App.jobs.data;

        return true;
    };


    App.jobs.replace = function (jobs) {

        App.jobs.data = [];

        if (!Array.isArray(jobs)) {
            return [];
        }

        jobs.forEach(function (job) {
            App.jobs.add(job);
        });

        return App.jobs.data;
    };


    App.jobs.card = function (job) {

        if (!job || !job.id) {
            return "";
        }

        const title =
            App.escape(job.title) ||
            "Government Job";

        const department =
            App.escape(
                job.department ||
                "Government Department"
            );

        const qualification =
            App.escape(
                job.qualification ||
                "As per official notification"
            );

        const state =
            App.escape(
                job.state ||
                "All India"
            );

        const lastDate =
            App.escape(
                job.lastDate ||
                "Not available"
            );

        const salary =
            App.escape(
                job.salary ||
                "As per official notification"
            );

        const saved =
            App.jobs.isSaved(job.id);

        return `
            <article class="job-card"
                data-job-id="${App.escape(job.id)}">

                <div class="job-card-header">

                    <span class="job-badge">
                        Government Job
                    </span>

                    <h3>
                        ${title}
                    </h3>

                    <p>
                        ${department}
                    </p>

                </div>

                <div class="job-card-meta">

                    <div class="info-row">
                        <span>Qualification</span>
                        <strong>
                            ${qualification}
                        </strong>
                    </div>

                    <div class="info-row">
                        <span>State</span>
                        <strong>
                            ${state}
                        </strong>
                    </div>

                    <div class="info-row">
                        <span>Salary</span>
                        <strong>
                            ${salary}
                        </strong>
                    </div>

                    <div class="info-row">
                        <span>Last Date</span>
                        <strong>
                            ${lastDate}
                        </strong>
                    </div>

                </div>

                <div class="job-actions">

                    <a
                        class="btn btn-primary"
                        href="job-detail.html?job=${encodeURIComponent(job.id)}"
                    >
                        Full Details
                    </a>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-save-job="${App.escape(job.id)}"
                    >
                        ${saved ? "Saved" : "Save Job"}
                    </button>

                </div>

            </article>
        `;
    };


    App.jobs.render = function (jobs) {

        const container =
            App.$("#jobs-list") ||
            App.$("#jobs-grid");

        if (!container) {
            return;
        }

        const list =
            Array.isArray(jobs)
                ? jobs
                : [];

        if (!list.length) {

            container.innerHTML = `
                <div class="empty-box">
                    <h3>No verified jobs available</h3>
                    <p>
                        Current verified recruitment data
                        is not available right now.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML =
            list.map(
                App.jobs.card
            ).join("");

        App.jobs.bindCards(
            container
        );
    };


    App.jobs.bindCards =
        function (container) {

            container
                .querySelectorAll(
                    "[data-save-job]"
                )
                .forEach(function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                button.getAttribute(
                                    "data-save-job"
                                );

                            const saved =
                                App.jobs
                                    .toggleSave(id);

                            button.textContent =
                                saved
                                    ? "Saved"
                                    : "Save Job";

                        }
                    );

                });

        };


})();
/* ==================== JOBS: OFFICIAL SOURCES ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.officialSources = [
        {
            id: "ssc",
            name: "Staff Selection Commission",
            short: "SSC",
            url: "https://ssc.gov.in/",
            type: "Central Recruitment"
        },
        {
            id: "upsc",
            name: "Union Public Service Commission",
            short: "UPSC",
            url: "https://www.upsc.gov.in/",
            type: "Central Recruitment"
        },
        {
            id: "uppsc",
            name: "Uttar Pradesh Public Service Commission",
            short: "UPPSC",
            url: "https://uppsc.up.nic.in/",
            type: "State Recruitment"
        },
        {
            id: "ibps",
            name: "Institute of Banking Personnel Selection",
            short: "IBPS",
            url: "https://www.ibps.in/",
            type: "Banking Recruitment"
        },
        {
            id: "sbi",
            name: "State Bank of India Careers",
            short: "SBI",
            url: "https://sbi.co.in/web/careers",
            type: "Banking Recruitment"
        },
        {
            id: "rbi",
            name: "Reserve Bank of India",
            short: "RBI",
            url: "https://www.rbi.org.in/",
            type: "Banking Recruitment"
        },
        {
            id: "indiapost",
            name: "India Post",
            short: "India Post",
            url: "https://www.indiapost.gov.in/",
            type: "Postal Recruitment"
        },
        {
            id: "gds",
            name: "India Post GDS Online",
            short: "GDS",
            url: "https://indiapostgdsonline.gov.in/",
            type: "Postal Recruitment"
        },
        {
            id: "indianrailways",
            name: "Indian Railways",
            short: "Railway",
            url: "https://indianrailways.gov.in/",
            type: "Railway Recruitment"
        },
        {
            id: "rrbprayagraj",
            name: "Railway Recruitment Board Prayagraj",
            short: "RRB Prayagraj",
            url: "https://www.rrbald.gov.in/",
            type: "Railway Recruitment"
        },
        {
            id: "rrbgorakhpur",
            name: "Railway Recruitment Board Gorakhpur",
            short: "RRB Gorakhpur",
            url: "https://www.rrbgkp.gov.in/",
            type: "Railway Recruitment"
        }
    ];

    App.jobs.getOfficialSources = function () {
        return App.jobs.officialSources.slice();
    };

    App.jobs.getOfficialSource = function (id) {
        return App.jobs.officialSources.find(function (item) {
            return item.id === id;
        }) || null;
    };

    App.jobs.officialSourceCard = function (source) {
        if (!source || !source.url) return "";

        return `
            <article class="job-card official-source-card">
                <div class="job-card-content">
                    <span class="job-badge">Official</span>

                    <h3>${App.utils.escape(source.name)}</h3>

                    <p>
                        ${App.utils.escape(source.type)}
                    </p>

                    <div class="job-card-actions">
                        <a
                            class="btn btn-primary"
                            href="${App.utils.escape(source.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Official Website
                        </a>
                    </div>
                </div>
            </article>
        `;
    };

    App.jobs.renderOfficialSources = function (container) {
        if (!container) return;

        var sources = App.jobs.getOfficialSources();

        if (!sources.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Official sources unavailable</h3>
                    <p>Verified recruitment sources are not available right now.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sources
            .map(App.jobs.officialSourceCard)
            .join("");
    };

})(window.SarkariiChij);
/* ==================== JOBS: SOURCE FILTERING ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.getSourcesByType = function (type) {
        if (!type) return App.jobs.getOfficialSources();

        return App.jobs.getOfficialSources().filter(function (source) {
            return source.type === type;
        });
    };

    App.jobs.searchOfficialSources = function (query) {
        var text = String(query || "").trim().toLowerCase();

        if (!text) {
            return App.jobs.getOfficialSources();
        }

        return App.jobs.getOfficialSources().filter(function (source) {
            return (
                source.name.toLowerCase().includes(text) ||
                source.short.toLowerCase().includes(text) ||
                source.type.toLowerCase().includes(text)
            );
        });
    };

    App.jobs.getSourceTypes = function () {
        var types = [];

        App.jobs.getOfficialSources().forEach(function (source) {
            if (types.indexOf(source.type) === -1) {
                types.push(source.type);
            }
        });

        return types;
    };

    App.jobs.renderSourceList = function (container, query, type) {
        if (!container) return;

        var sources;

        if (type) {
            sources = App.jobs.getSourcesByType(type);
        } else {
            sources = App.jobs.searchOfficialSources(query);
        }

        if (!sources.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No official source found</h3>
                    <p>Try another department or recruitment organization.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sources
            .map(App.jobs.officialSourceCard)
            .join("");
    };

    App.jobs.bindSourceSearch = function () {
        var input = document.querySelector("#official-source-search");
        var list = document.querySelector("#official-sources-list");

        if (!input || !list) return;

        input.addEventListener("input", function () {
            App.jobs.renderSourceList(
                list,
                input.value,
                ""
            );
        });
    };

})(window.SarkariiChij);
/* ==================== JOBS: FILTER CONTROLLER ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.applyPageFilters = function () {
        var search = document.querySelector("#job-search");
        var qualification = document.querySelector("#job-qualification");
        var department = document.querySelector("#job-department");
        var state = document.querySelector("#job-state");
        var category = document.querySelector("#job-category");
        var list = document.querySelector("#jobs-list");

        if (!list) return;

        var result = App.jobs.filter({
            search: search ? search.value : "",
            qualification: qualification ? qualification.value : "",
            department: department ? department.value : "",
            state: state ? state.value : "",
            category: category ? category.value : ""
        });

        App.jobs.render(list, result);

        App.jobs.updateStats(result);
    };

    App.jobs.resetPageFilters = function () {
        [
            "#job-search",
            "#job-qualification",
            "#job-department",
            "#job-state",
            "#job-category"
        ].forEach(function (selector) {
            var element = document.querySelector(selector);

            if (element) {
                element.value = "";
            }
        });

        App.jobs.applyPageFilters();
    };

    App.jobs.updateStats = function (jobs) {
        var total = document.querySelector("#jobs-total-count");
        var newest = document.querySelector("#jobs-new-count");
        var lastDate = document.querySelector("#jobs-last-date-count");
        var saved = document.querySelector("#jobs-saved-count");

        if (total) {
            total.textContent = jobs.length;
        }

        if (newest) {
            newest.textContent = jobs.filter(function (job) {
                return job.status === "open";
            }).length;
        }

        if (lastDate) {
            lastDate.textContent = jobs.filter(function (job) {
                return job.lastDate;
            }).length;
        }

        if (saved) {
            saved.textContent = App.savedJobs
                ? App.savedJobs.length
                : 0;
        }
    };

    App.jobs.bindPageFilters = function () {
        var apply = document.querySelector("#apply-job-filters");
        var reset = document.querySelector("#reset-job-filters");

        if (apply) {
            apply.addEventListener("click", function () {
                App.jobs.applyPageFilters();
            });
        }

        if (reset) {
            reset.addEventListener("click", function () {
                App.jobs.resetPageFilters();
            });
        }
    };

})(window.SarkariiChij);
/* ==================== JOBS: DISPLAY + LOADING ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.showLoading = function (container) {
        if (!container) return;

        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Verified jobs load हो रही हैं...</p>
            </div>
        `;
    };

    App.jobs.showEmpty = function (container, message) {
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <h3>कोई verified job उपलब्ध नहीं है</h3>
                <p>
                    ${App.escape(
                        message ||
                        "अभी verified recruitment data उपलब्ध नहीं है।"
                    )}
                </p>
            </div>
        `;
    };

    App.jobs.renderVerified = function (container, jobs) {
        if (!container) return;

        if (!Array.isArray(jobs) || !jobs.length) {
            App.jobs.showEmpty(
                container,
                "अभी कोई verified vacancy उपलब्ध नहीं है।"
            );
            return;
        }

        var validJobs = jobs.filter(function (job) {
            return job &&
                job.title &&
                App.jobs.isOfficialLink(job.officialUrl);
        });

        if (!validJobs.length) {
            App.jobs.showEmpty(
                container,
                "Verified official recruitment link वाला job उपलब्ध नहीं है।"
            );
            return;
        }

        App.jobs.render(container, validJobs);
        App.jobs.bindCards(container);
    };

    App.jobs.loadPage = function () {
        var container = document.querySelector("#jobs-list");

        if (!container) return;

        App.jobs.showLoading(container);

        setTimeout(function () {
            var jobs = App.jobs.get();

            App.jobs.renderVerified(container, jobs);
            App.jobs.updateStats(jobs);
        }, 100);
    };

    App.jobs.refreshPage = function () {
        var container = document.querySelector("#jobs-list");

        if (!container) return;

        App.jobs.showLoading(container);

        setTimeout(function () {
            var jobs = App.jobs.get();

            App.jobs.renderVerified(container, jobs);
            App.jobs.updateStats(jobs);
        }, 100);
    };

    App.jobs.initDisplay = function () {
        var container = document.querySelector("#jobs-list");

        if (!container) return;

        App.jobs.loadPage();
    };

    document.addEventListener("DOMContentLoaded", function () {
        App.jobs.initDisplay();
    });

})(window.SarkariiChij);
/* ==================== JOBS: VERIFIED DATA CONTROL ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.cleanText = function (value) {
        return String(value || "").trim();
    };

    App.jobs.makeId = function (job) {
        if (!job) return "";

        if (job.id) {
            return App.jobs.cleanText(job.id);
        }

        var title = App.jobs.cleanText(job.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        var department = App.jobs.cleanText(job.department)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        return [title, department]
            .filter(Boolean)
            .join("-");
    };

    App.jobs.validate = function (job) {
        if (!job || typeof job !== "object") {
            return false;
        }

        if (!App.jobs.cleanText(job.title)) {
            return false;
        }

        if (!App.jobs.cleanText(job.department)) {
            return false;
        }

        if (!App.jobs.isOfficialLink(job.officialUrl)) {
            return false;
        }

        return true;
    };

    App.jobs.findDuplicate = function (job) {
        var id = App.jobs.makeId(job);

        if (!id) return null;

        return App.jobs.get().find(function (item) {
            return App.jobs.makeId(item) === id;
        }) || null;
    };

    App.jobs.addVerified = function (job) {
        if (!App.jobs.validate(job)) {
            return {
                success: false,
                message: "Job में valid official HTTPS link आवश्यक है।"
            };
        }

        var existing = App.jobs.findDuplicate(job);

        if (existing) {
            return {
                success: false,
                message: "यह job पहले से मौजूद है।"
            };
        }

        var newJob = App.jobs.normalize(job);

        newJob.id = App.jobs.makeId(newJob);
        newJob.verified = true;

        App.jobs.data.push(newJob);

        return {
            success: true,
            job: newJob
        };
    };

    App.jobs.remove = function (id) {
        var before = App.jobs.data.length;

        App.jobs.data = App.jobs.data.filter(function (job) {
            return job.id !== id;
        });

        return before !== App.jobs.data.length;
    };

    App.jobs.clear = function () {
        App.jobs.data = [];
        return true;
    };

    App.jobs.getVerified = function () {
        return App.jobs.get().filter(function (job) {
            return job.verified === true &&
                App.jobs.isOfficialLink(job.officialUrl);
        });
    };

})(window.SarkariiChij);
/* ==================== JOBS: ADVANCED FILTER ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.matchValue = function (jobValue, filterValue) {
        if (!filterValue) return true;

        var job = String(jobValue || "").toLowerCase();
        var filter = String(filterValue || "").toLowerCase();

        if (!job) return false;

        return job === filter || job.includes(filter);
    };

    App.jobs.filterVerified = function (filters) {
        filters = filters || {};

        var search = String(filters.search || "").trim().toLowerCase();
        var qualification = String(filters.qualification || "").trim();
        var department = String(filters.department || "").trim();
        var state = String(filters.state || "").trim();
        var category = String(filters.category || "").trim();

        return App.jobs.getVerified().filter(function (job) {

            var text = [
                job.title,
                job.department,
                job.qualification,
                job.state,
                job.category,
                job.post
            ].join(" ").toLowerCase();

            if (search && !text.includes(search)) {
                return false;
            }

            if (
                qualification &&
                !App.jobs.matchValue(
                    job.qualification,
                    qualification
                )
            ) {
                return false;
            }

            if (
                department &&
                !App.jobs.matchValue(
                    job.department,
                    department
                )
            ) {
                return false;
            }

            if (
                state &&
                !App.jobs.matchValue(
                    job.state,
                    state
                )
            ) {
                return false;
            }

            if (
                category &&
                !App.jobs.matchValue(
                    job.category,
                    category
                )
            ) {
                return false;
            }

            return true;
        });
    };

    App.jobs.applyVerifiedFilters = function () {
        var container = document.querySelector("#jobs-list");

        if (!container) return;

        var filters = {
            search: document.querySelector("#job-search")?.value || "",
            qualification:
                document.querySelector("#job-qualification")?.value || "",
            department:
                document.querySelector("#job-department")?.value || "",
            state:
                document.querySelector("#job-state")?.value || "",
            category:
                document.querySelector("#job-category")?.value || ""
        };

        var jobs = App.jobs.filterVerified(filters);

        App.jobs.renderVerified(container, jobs);
        App.jobs.updateStats(jobs);
    };

    App.jobs.bindVerifiedFilters = function () {
        var button = document.querySelector("#apply-job-filters");
        var reset = document.querySelector("#reset-job-filters");

        if (button) {
            button.addEventListener("click", function () {
                App.jobs.applyVerifiedFilters();
            });
        }

        if (reset) {
            reset.addEventListener("click", function () {
                App.jobs.resetPageFilters();
                App.jobs.applyVerifiedFilters();
            });
        }
    };

})(window.SarkariiChij);
/* ==================== JOBS: DATE + STATUS ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.parseDate = function (value) {
        if (!value) return null;

        var date = new Date(value);

        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    };

    App.jobs.formatDate = function (value) {
        var date = App.jobs.parseDate(value);

        if (!date) return "Not Verified";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    App.jobs.getStatus = function (job) {
        if (!job) return "unknown";

        var lastDate = App.jobs.parseDate(job.lastDate);

        if (!lastDate) {
            return job.status || "unknown";
        }

        var now = new Date();

        if (lastDate < now) {
            return "closed";
        }

        return "open";
    };

    App.jobs.isOpen = function (job) {
        return App.jobs.getStatus(job) === "open";
    };

    App.jobs.isClosed = function (job) {
        return App.jobs.getStatus(job) === "closed";
    };

    App.jobs.getOpen = function () {
        return App.jobs.getVerified().filter(function (job) {
            return App.jobs.isOpen(job);
        });
    };

    App.jobs.getClosed = function () {
        return App.jobs.getVerified().filter(function (job) {
            return App.jobs.isClosed(job);
        });
    };

    App.jobs.getLastDateJobs = function () {
        return App.jobs.getVerified().filter(function (job) {
            return Boolean(
                App.jobs.parseDate(job.lastDate)
            );
        });
    };

    App.jobs.getDateInfo = function (job) {
        return {
            startDate: App.jobs.formatDate(job.startDate),
            lastDate: App.jobs.formatDate(job.lastDate),
            examDate: App.jobs.formatDate(job.examDate),
            status: App.jobs.getStatus(job)
        };
    };

})(window.SarkariiChij);
/* ==================== JOBS: CARD DETAILS ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.statusLabel = function (job) {
        var status = App.jobs.getStatus(job);

        if (status === "open") return "Application Open";
        if (status === "closed") return "Application Closed";

        return "Status Not Verified";
    };

    App.jobs.statusClass = function (job) {
        var status = App.jobs.getStatus(job);

        if (status === "open") return "status-open";
        if (status === "closed") return "status-closed";

        return "status-unknown";
    };

    App.jobs.cardDetails = function (job) {
        var dateInfo = App.jobs.getDateInfo(job);

        return `
            <div class="job-meta">
                <div class="job-meta-item">
                    <span>Qualification</span>
                    <strong>
                        ${App.utils.escape(
                            job.qualification || "Not Verified"
                        )}
                    </strong>
                </div>

                <div class="job-meta-item">
                    <span>Department</span>
                    <strong>
                        ${App.utils.escape(
                            job.department || "Not Verified"
                        )}
                    </strong>
                </div>

                <div class="job-meta-item">
                    <span>State</span>
                    <strong>
                        ${App.utils.escape(
                            job.state || "Not Verified"
                        )}
                    </strong>
                </div>

                <div class="job-meta-item">
                    <span>Last Date</span>
                    <strong>${dateInfo.lastDate}</strong>
                </div>
            </div>

            <div class="job-status ${App.jobs.statusClass(job)}">
                ${App.jobs.statusLabel(job)}
            </div>
        `;
    };

    App.jobs.officialButton = function (job) {
        if (!App.jobs.isOfficialLink(job.officialUrl)) {
            return `
                <span class="btn btn-secondary">
                    Official Link Not Verified
                </span>
            `;
        }

        return `
            <a
                class="btn btn-primary"
                href="${App.utils.escape(job.officialUrl)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Official Website
            </a>
        `;
    };

    App.jobs.card = function (job) {
        if (!App.jobs.validate(job)) return "";

        var saved = App.isSavedJob
            ? App.isSavedJob(job.id)
            : false;

        return `
            <article class="job-card" data-job-id="${App.utils.escape(job.id)}">

                <div class="job-card-content">

                    <div class="job-card-top">
                        <span class="job-badge">Verified</span>

                        <button
                            type="button"
                            class="save-job-btn ${saved ? "saved" : ""}"
                            data-save-job="${App.utils.escape(job.id)}"
                        >
                            ${saved ? "Saved" : "Save Job"}
                        </button>
                    </div>

                    <h3>
                        ${App.utils.escape(job.title)}
                    </h3>

                    <p>
                        ${App.utils.escape(
                            job.post || job.department || ""
                        )}
                    </p>

                    ${App.jobs.cardDetails(job)}

                    <div class="job-card-actions">

                        <a
                            class="btn btn-secondary"
                            href="job-detail.html?job=${encodeURIComponent(job.id)}"
                        >
                            View Details
                        </a>

                        ${App.jobs.officialButton(job)}

                    </div>

                </div>

            </article>
        `;
    };

})(window.SarkariiChij);
/* ==================== JOBS: SAVE SYSTEM ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.isSaved = function (id) {
        if (!id) return false;

        var saved = App.storage.get("savedJobs", []);

        return Array.isArray(saved) &&
            saved.indexOf(String(id)) !== -1;
    };

    App.jobs.save = function (id) {
        if (!id) return false;

        var saved = App.storage.get("savedJobs", []);

        if (!Array.isArray(saved)) {
            saved = [];
        }

        id = String(id);

        if (saved.indexOf(id) === -1) {
            saved.push(id);
        }

        App.storage.set("savedJobs", saved);

        return true;
    };

    App.jobs.unsave = function (id) {
        if (!id) return false;

        var saved = App.storage.get("savedJobs", []);

        if (!Array.isArray(saved)) {
            return false;
        }

        id = String(id);

        saved = saved.filter(function (item) {
            return String(item) !== id;
        });

        App.storage.set("savedJobs", saved);

        return true;
    };

    App.jobs.toggleSave = function (id) {
        if (App.jobs.isSaved(id)) {
            App.jobs.unsave(id);
            return false;
        }

        App.jobs.save(id);
        return true;
    };

    App.jobs.getSaved = function () {
        var saved = App.storage.get("savedJobs", []);

        if (!Array.isArray(saved)) {
            return [];
        }

        return App.jobs.get().filter(function (job) {
            return saved.indexOf(String(job.id)) !== -1;
        });
    };

    App.jobs.updateSaveButtons = function () {
        document.querySelectorAll("[data-save-job]")
            .forEach(function (button) {

                var id = button.getAttribute("data-save-job");

                if (App.jobs.isSaved(id)) {
                    button.textContent = "Saved";
                    button.classList.add("saved");
                } else {
                    button.textContent = "Save Job";
                    button.classList.remove("saved");
                }
            });
    };

    App.jobs.bindSaveButtons = function () {
        document.querySelectorAll("[data-save-job]")
            .forEach(function (button) {

                if (button.dataset.saveBound === "true") {
                    return;
                }

                button.dataset.saveBound = "true";

                button.addEventListener("click", function () {
                    var id = button.getAttribute("data-save-job");

                    if (!id) return;

                    var saved = App.jobs.toggleSave(id);

                    App.jobs.updateSaveButtons();

                    if (typeof App.toast === "function") {
                        App.toast(
                            saved
                                ? "Job saved"
                                : "Job removed from saved jobs"
                        );
                    }
                });
            });
    };

})(window.SarkariiChij);
/* ==================== JOBS: DETAIL LOOKUP ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.getIdFromUrl = function () {
        var params = new URLSearchParams(window.location.search);
        return params.get("job") || "";
    };

    App.jobs.getCurrentJob = function () {
        var id = App.jobs.getIdFromUrl();

        if (!id) return null;

        return App.jobs.find(id) || null;
    };

    App.jobs.renderDetail = function (job) {
        if (!job) {
            var empty = document.querySelector("#job-detail");

            if (empty) {
                empty.innerHTML = `
                    <div class="empty-state">
                        <h3>Job not found</h3>
                        <p>
                            यह job उपलब्ध नहीं है या verified नहीं है।
                        </p>
                    </div>
                `;
            }

            return;
        }

        var title = document.querySelector("#job-title");
        var department = document.querySelector("#job-department-name");
        var qualification = document.querySelector("#job-qualification");
        var state = document.querySelector("#job-state");
        var lastDate = document.querySelector("#job-last-date");
        var official = document.querySelector("#job-official-link");

        if (title) {
            title.textContent = job.title || "Not Verified";
        }

        if (department) {
            department.textContent =
                job.department || "Not Verified";
        }

        if (qualification) {
            qualification.textContent =
                job.qualification || "Not Verified";
        }

        if (state) {
            state.textContent =
                job.state || "Not Verified";
        }

        if (lastDate) {
            lastDate.textContent =
                App.jobs.formatDate(job.lastDate);
        }

        if (official) {
            if (App.jobs.isOfficialLink(job.officialUrl)) {
                official.href = job.officialUrl;
                official.textContent = "Official Website";
                official.style.display = "";
            } else {
                official.removeAttribute("href");
                official.textContent = "Official Link Not Verified";
            }
        }
    };

    App.jobs.initDetail = function () {
        if (!window.location.pathname.includes("job-detail")) {
            return;
        }

        var job = App.jobs.getCurrentJob();

        App.jobs.renderDetail(job);
    };

    document.addEventListener("DOMContentLoaded", function () {
        App.jobs.initDetail();
    });

})(window.SarkariiChij);
/* ==================== JOBS: OFFICIAL SOURCES PAGE ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.initOfficialSources = function () {
        var list = document.querySelector("#official-sources-list");

        if (!list) return;

        var search = document.querySelector("#official-source-search");
        var type = document.querySelector("#official-source-type");

        function render() {
            var query = search ? search.value : "";
            var selectedType = type ? type.value : "";

            var sources = App.jobs.getOfficialSources();

            if (query) {
                sources = sources.filter(function (source) {
                    var text = [
                        source.name,
                        source.short,
                        source.type
                    ].join(" ").toLowerCase();

                    return text.includes(
                        query.toLowerCase().trim()
                    );
                });
            }

            if (selectedType) {
                sources = sources.filter(function (source) {
                    return source.type === selectedType;
                });
            }

            if (!sources.length) {
                list.innerHTML = `
                    <div class="empty-state">
                        <h3>No official source found</h3>
                        <p>Verified recruitment source उपलब्ध नहीं है।</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = sources
                .map(App.jobs.officialSourceCard)
                .join("");
        }

        if (search) {
            search.addEventListener("input", render);
        }

        if (type) {
            type.innerHTML = `
                <option value="">All Departments</option>
                ${App.jobs.getSourceTypes()
                    .map(function (item) {
                        return `
                            <option value="${App.utils.escape(item)}">
                                ${App.utils.escape(item)}
                            </option>
                        `;
                    })
                    .join("")}
            `;

            type.addEventListener("change", render);
        }

        render();
    };

    document.addEventListener("DOMContentLoaded", function () {
        App.jobs.initOfficialSources();
    });

})(window.SarkariiChij);
/* ==================== JOBS: CENTRAL INITIALIZER ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.initialized = false;

    App.jobs.init = function () {
        if (App.jobs.initialized) {
            return;
        }

        App.jobs.initialized = true;

        var path = window.location.pathname.toLowerCase();

        if (path.endsWith("/jobs.html") || path.endsWith("jobs.html")) {
            App.jobs.bindPageFilters();
            App.jobs.bindVerifiedFilters();
            App.jobs.bindSaveButtons();
            App.jobs.loadPage();
        }

        if (path.includes("job-detail")) {
            App.jobs.initDetail();
        }

        if (
            document.querySelector("#official-sources-list")
        ) {
            App.jobs.initOfficialSources();
        }
    };

    App.jobs.rebind = function () {
        App.jobs.bindSaveButtons();

        var list = document.querySelector("#jobs-list");

        if (list) {
            App.jobs.bindCards(list);
        }

        App.jobs.updateSaveButtons();
    };
    document.addEventListener("DOMContentLoaded", function () {
    App.jobs.init();
});

})(window.SarkariiChij);
/* ==================== JOBS: FINAL SAFETY ==================== */

(function (App) {
    "use strict";

    App.jobs = App.jobs || {};

    App.jobs.safeRender = function () {
        try {
            var list = document.querySelector("#jobs-list");

            if (!list) return;

            var jobs = App.jobs.getVerified();

            if (!Array.isArray(jobs)) {
                App.jobs.showEmpty(
                    list,
                    "Verified job data उपलब्ध नहीं है।"
                );
                return;
            }

            App.jobs.renderVerified(list, jobs);
            App.jobs.bindSaveButtons();
            App.jobs.updateSaveButtons();
            App.jobs.updateStats(jobs);

        } catch (error) {
            console.error("Jobs render error:", error);

            var list = document.querySelector("#jobs-list");

            if (list) {
                App.jobs.showEmpty(
                    list,
                    "Jobs load करते समय समस्या हुई। कृपया थोड़ी देर बाद दोबारा प्रयास करें।"
                );
            }
        }
    };

    App.jobs.safeFilter = function () {
        try {
            App.jobs.applyVerifiedFilters();
        } catch (error) {
            console.error("Jobs filter error:", error);
            App.jobs.safeRender();
        }
    };

    App.jobs.verifyAll = function () {
        var jobs = App.jobs.get();

        if (!Array.isArray(jobs)) {
            return [];
        }

        return jobs.filter(function (job) {
            return App.jobs.validate(job);
        });
    };

    App.jobs.getVerifiedCount = function () {
        return App.jobs.verifyAll().length;
    };

    App.jobs.clearInvalid = function () {
        var valid = App.jobs.verifyAll();

        App.jobs.data = valid;

        return valid.length;
    };

    App.jobs.healthCheck = function () {
        return {
            script: true,
            jobsSystem: true,
            verifiedJobs: App.jobs.getVerifiedCount(),
            officialSources:
                App.jobs.getOfficialSources().length
        };
    };

    window.SarkariiChijJobsReady = true;

})(window.SarkariiChij);
