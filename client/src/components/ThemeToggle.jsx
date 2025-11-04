import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPreferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (systemPreferDark ? "dark" : "light");
    setTheme(ini);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <section>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="bg-white text-indigo-600 dark:bg-indigo-700 dark:text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-600 transition-colors"
      >
        {theme === "dark" ? <span>🌞 Light</span> : <span>🌚 Dark</span>}
      </button>
    </section>
  );
};

export default ThemeToggle;
