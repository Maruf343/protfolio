"use client";

import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-white dark:bg-gray-900 py-10 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Branding / Copyright */}
        <div className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base text-center md:text-left">
          © {new Date().getFullYear()} Maruf. All rights reserved.
        </div>

        {/* Social Icons */}
        <div className="flex space-x-5 mt-4 md:mt-0">
          <a
            href="https://www.facebook.com/Abdullah.Maruf3434/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-300"
          >
            <FaFacebookF size={20} />
          </a>

          <a
            href="https://www.linkedin.com/in/mohammad-abdullah-al-maruf-63a393200/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-700 transition-colors duration-300"
          >
            <FaLinkedinIn size={20} />
          </a>

          <a
            href="https://github.com/Maruf343"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>

      {/* Divider Line */}
      <div className="mt-6 w-28 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm"></div>

      {/* Tagline */}
      <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm md:text-base">
        Professional frontend solutions | Modern, clean & responsive web experiences
      </div>
    </footer>
  );
}
