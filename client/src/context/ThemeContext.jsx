import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage
    if (typeof window !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    // 2. Check System Preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    // 3. Default to light
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove both potential classes to prevent conflicts
    root.classList.remove("light", "dark");
    // Add the current theme class
    root.classList.add(theme);
    // Save to storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
