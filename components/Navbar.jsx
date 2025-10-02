"use client";
import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";

const sections = ["home", "projects", "skills", "contact"];

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="font-bold text-xl">Maruf</h1>
        <div className="flex items-center space-x-4">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`capitalize ${
                active === section
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-300"
              } hover:text-blue-500`}
            >
              {section}
            </a>
          ))}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
