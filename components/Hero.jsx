"use client";

import Image from "next/image";
import marufPhoto from "../public/maruf.png"; // Make sure your image is in public folder
import { useState, useEffect } from "react";

export default function Hero() {
  const fullName = "Mohammad Abdullah Al Maruf";
  const [displayedName, setDisplayedName] = useState("");
  const [index, setIndex] = useState(0);

  // Typing effect
  useEffect(() => {
    if (index < fullName.length) {
      const timeout = setTimeout(() => {
        setDisplayedName(displayedName + fullName[index]);
        setIndex(index + 1);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [index, displayedName]);

  // Resume download
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Mohammad_abdullah_al_maruf.pdf"; // PDF should be in public folder
    link.download = "Mohammad_Abdullah_Al_Maruf_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="home"
      className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center px-6 md:px-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 overflow-hidden"
    >
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-md">
          {displayedName}
          <span className="blinking-cursor">|</span>
        </h1>

        <p className="mt-6 text-md sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed">
          I am a <span className="font-semibold text-indigo-600 dark:text-indigo-400">MERN Stack Developer</span> 
          passionate about building modern, responsive, and high-performance web applications with 
          <span className="font-semibold text-indigo-600 dark:text-indigo-400"> MongoDB, Express, React, and Node.js</span>.
          I love crafting clean and user-friendly interfaces that provide an engaging user experience.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadResume}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 hover:scale-105 transition transform duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600"
          >
            Download Resume
          </button>

          <a
            href="#about"
            className="px-8 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 dark:text-indigo-400 transition duration-300 text-center"
          >
            About Me
          </a>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="flex-1 mt-10 md:mt-0 flex justify-center md:justify-end relative z-10">
        <div className="relative rounded-full w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
          <Image
            src={marufPhoto}
            alt="Mohammad Abdullah Al Maruf"
            className="object-cover"
            width={384}
            height={384}
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 384px"
            priority
          />
        </div>
      </div>

      {/* Blinking cursor style */}
      <style jsx>{`
        .blinking-cursor {
          font-weight: bold;
          font-size: inherit;
          color: #4f46e5; /* Indigo */
          animation: blink 1s step-start infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}  