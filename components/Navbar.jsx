"use client";
import { useState, useEffect, useRef } from "react";
import DarkModeToggle from "./DarkModeToggle";

const sections = ["home", "projects", "about-me", "skills", "tech-news", "contact", "footer"];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);

  // Observe sections to highlight active link
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

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200/40 dark:bg-gray-700/40">
        <div
          className="h-1 bg-indigo-600 dark:bg-indigo-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Glass Blur Navbar with Floating Hover Effect */}
      <nav
        ref={navRef}
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-7xl z-50 backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700/20 rounded-b-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">Maruf</h1>

          <div className="relative flex items-center space-x-6">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`capitalize text-sm md:text-base font-medium transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400 relative ${
                  active === section
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {section.replace("-", " ")}
                {/* Animated Underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                    active === section ? "w-full" : "w-0"
                  }`}
                ></span>
              </a>
            ))}

            <DarkModeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
