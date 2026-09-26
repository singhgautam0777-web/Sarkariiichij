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
