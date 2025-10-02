"use client";
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
