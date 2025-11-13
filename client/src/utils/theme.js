// Initialize theme from localStorage or system preference
export function initializeTheme() {
  try {
    const savedTheme = localStorage.getItem("theme");
    const systemPreferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = savedTheme || (systemPreferDark ? "dark" : "light");

    // Apply theme to document using data-theme (project uses a data-theme-based dark variant)
    document.documentElement.setAttribute("data-theme", theme);

    return theme;
  } catch (err) {
    // If anything fails (SSR/environment), default to light
    return "light";
  }
}

// Handle theme changes
export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (err) {
    // ignore
  }
}
