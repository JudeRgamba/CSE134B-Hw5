(() => {
    const storageKey = "portfolio-theme";
    const root = document.documentElement;

    // Restore before the page is rendered; light is the default.
    try {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme === "light" || savedTheme === "dark") {
            root.dataset.theme = savedTheme;
        }
    } catch {
        // Storage may be blocked. The default theme is still usable.
    }

    document.addEventListener("DOMContentLoaded", () => {
        const button = document.querySelector(".theme-toggle");
        if (!button) return;

        const icons = document.querySelectorAll("img[data-dark-src]");
        // Keep each original source so switching back restores the light icon.
        icons.forEach(icon => {
            icon.dataset.lightSrc = icon.getAttribute("src");
        });

        function updateThemeControls() {
            const isDark = root.dataset.theme === "dark";
            button.textContent = isDark
                ? "Switch to light theme"
                : "Switch to dark theme";
            icons.forEach(icon => {
                icon.setAttribute("src", isDark
                    ? icon.dataset.darkSrc
                    : icon.dataset.lightSrc);
            });
        }

        function applyTheme(theme) {
            root.dataset.theme = theme;
            updateThemeControls();

            try {
                localStorage.setItem(storageKey, theme);
            } catch {
                // Switching still works when storage is blocked
            }
        }
        
        button.addEventListener("click", () => {
            const theme = root.dataset.theme === "dark" ? "light" : "dark";

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            if (typeof document.startViewTransition === "function"
                && !reduceMotion) {
                document.startViewTransition(() => {
                    applyTheme(theme);
                });
            } else {
                applyTheme(theme);
            }
        });

        updateThemeControls();
        button.hidden = false;
    });
})();
