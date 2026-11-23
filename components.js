class JudeFacts extends HTMLElement {
    static observedAttributes = ["compact"];

    constructor() {
        super();

        this.currentIndex = 0;
        this.layoutToggle = null;
        this.storageKey = "hw5-jude-facts-mode";
        this.initialized = false;

        this.facts = [
            {
                title: "Mechanical keyboards",
                text: "Jude has built more than 10 mechanical keyboards."
            },
            {
                title: "Mechanical keyboards",
                text: "I have spent over 6 hours lubing and tuning keyboard switches."
            },
            {
                title: "Gaming",
                text: "I have played Rocket League for over 1500 hours."
            },
            {
                title: "Gaming",
                text: "The first game I took seriously on PC was COD: Warzone."
            },
            {
                title: "Traveling",
                text: "I have traveled to 5 different countries."
            },
            {
                title: "Traveling",
                text: "My favorite cuisine is Japanese food."
            },
            {
                title: "Personal",
                text: "I have been to over 20 concerts in the past 4 years."
            },
            {
                title: "Personal",
                text: "The most amount of screen time I have had in a day was 12 hours."
            },
            {
                title: "Dragon Boat",
                text: "I have been doing dragon boat for over a year now."
            },
            {
                title: "Dragon Boat",
                text: "I have been able to train with people who have competed at the dragon boat world championships."
            },
        ];
    }

    connectedCallback() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.buildInterface();

        this.layoutToggle = document.querySelector(
            "#jude-facts-layout-toggle"
        );

        if (this.layoutToggle) {
            this.layoutToggle.hidden = false;
            this.layoutToggle.addEventListener("click", () => {
                this.toggleAttribute("compact");
            });
        }

        this.restoreCompactPreference();
        this.classList.add("is-enhanced");
    }

    buildInterface() {
        const fallback = this.querySelector(".jude-facts-fallback");
        if (fallback) {
            fallback.remove();
        }

        this.panel = document.createElement("article");
        this.panel.className = "jude-facts-panel";

        this.heading = document.createElement("h3");
        this.heading.className = "jude-facts-title";
        this.heading.textContent = this.facts[this.currentIndex].title;
        this.panel.appendChild(this.heading);

        this.fact = document.createElement("p");
        this.fact.className = "jude-facts-fact";
        this.panel.appendChild(this.fact);

        this.nextButton = document.createElement("button");
        this.nextButton.type = "button";
        this.nextButton.className = "jude-facts-button";
        this.nextButton.textContent = "Next fact";
        this.panel.appendChild(this.nextButton);

        this.liveButton = document.createElement("button");
        this.liveButton.type = "button";
        this.liveButton.className = "jude-facts-button";
        this.liveButton.textContent = "Load a random fact";
        this.panel.appendChild(this.liveButton);

        this.status = document.createElement("P");
        this.status.className = "jude-facts-status";
        this.status.setAttribute("role", "status");
        this.status.setAttribute("aria-live", "polite");
        this.panel.appendChild(this.status);

        this.appendChild(this.panel);

        this.nextButton.addEventListener("click", () => {
            this.currentIndex = (this.currentIndex + 1) % this.facts.length;
            this.showLocalFact();
        });

        this.liveButton.addEventListener("click", () => {
            this.loadLiveFact();
        });

        this.showLocalFact();
    }

    showLocalFact() {
        const item = this.facts[this.currentIndex];

        this.heading.textContent = item.title;
        this.fact.textContent = item.text;
        this.status.textContent = `Fact ${this.currentIndex + 1} of ${this.facts.length}`;
    }

    async loadLiveFact() {
        this.liveButton.disabled = true;
        this.status.textContent = "Loading a random fact...";

        try {
            const response = await fetch(
                "https://uselessfacts.jsph.pl/api/v2/facts/random"
            );

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();

            if (typeof data?.text !== "string" || data.text.length === 0) {
                throw new Error("The response did not contain a fact");
            }

            this.heading.textContent = "Live random fact";
            this.fact.textContent = data.text;
            this.status.textContent = "Random fact loaded successfully.";
        } catch {
            this.status.textContent =
                "Could not load a random fact. Check your connection and try again.";
        } finally {
            this.liveButton.disabled = false;
        }
    }

    restoreCompactPreference() {
        let savedMode = "expanded";

        try {
            const saved = localStorage.getItem(this.storageKey);

            if (saved === "compact" || saved === "expanded") {
                savedMode = saved;
            }
        } catch {
            savedMode = "expanded";
        }

        this.toggleAttribute("compact", savedMode === "compact");
    }

    saveCompactPreference() {
        try {
            localStorage.setItem(
                this.storageKey,
                this.hasAttribute("compact") ? "compact" : "expanded"
            );
        } catch {
            // the attribute still changes the current page
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (
            name !== "compact" ||
            oldValue === newValue ||
            !this.initialized
        ) {
            return;
        }

        const compact = this.hasAttribute("compact");

        if (this.heading) {
            this.heading.hidden = compact;
        }

        this.classList.toggle("compact", compact);

        if (this.layoutToggle) {
            this.layoutToggle.textContent = compact
                ? "Enable expanded view"
                : "Enable compact view";
            
            this.layoutToggle.setAttribute(
                "aria-pressed",
                String(compact)
            );
        }

        this.saveCompactPreference();
    }
}

customElements.define("jude-facts", JudeFacts);