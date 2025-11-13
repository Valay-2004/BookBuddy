import { useState } from "react";
import { initializeTheme, applyTheme } from "../utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => initializeTheme());

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
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
