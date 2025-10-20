"use client";

import Image from "next/image";
import marufPhoto from "../public/maruf.png"; // আপনার ছবি public ফোল্ডারে আছে
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
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [index, displayedName]);

  // Resume download
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Mohammad_abdullah_al_maruf.pdf"; // ✅ শুধু public ফোল্ডারের path
    link.download = "Mohammad_Abdullah_Al_Maruf_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="home"
      className="w-full h-screen flex flex-col md:flex-row justify-center items-center text-center md:text-left bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 px-6 md:px-32 overflow-hidden"
    >
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
          {displayedName}
          <span className="blinking-cursor">|</span>
        </h1>

        <p className="mt-4 text-md sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg">
          A MERN Stack Developer building modern, responsive, and high-performance web applications with{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            MongoDB, Express, React, Node.js
          </span>.
        </p>

        <button
          onClick={downloadResume}
          className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 hover:scale-105 transition transform duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600"
        >
          Resume
        </button>
      </div>

      {/* Right Content - Image */}
      <div className="flex-1 mt-10 md:mt-0 flex justify-center md:justify-end relative z-10">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-xl hover:scale-105 transition-transform duration-500">
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

      {/* CSS for blinking cursor */}
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
