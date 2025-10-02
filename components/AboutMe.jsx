"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import marufPhoto from "../public/about-me.png";

export default function AboutMe() {
  return (
    <section
      id="about-me"
      className="min-h-screen px-6 md:px-20 py-20 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-5xl font-extrabold text-center mb-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide"
      >
        👋 About Me
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
        {/* Left - Image with modern glass effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-xl backdrop-blur-3xl border border-indigo-500/20 bg-white/20 group hover:shadow-2xl transition-shadow duration-700">
            <Image
              src={marufPhoto}
              alt="Maruf"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left space-y-6"
        >
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            🚀 Frontend Developer | MERN Enthusiast
          </h3>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Hi! I'm{" "}
            <span className="font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Maruf
            </span>
            , a passionate Frontend Developer focusing on building{" "}
            <span className="italic text-purple-600 dark:text-purple-400">responsive, sleek, and high-performance web apps</span> using
            <span className="font-medium text-indigo-600 dark:text-indigo-400"> React, Next.js & MERN Stack</span>.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Outside coding, I enjoy <span className="font-medium">tech blogs, learning new frameworks</span>, and collaborating with fellow developers. 🌟
          </p>

          {/* Stats Section */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-center md:text-left">
            {[
              { label: "Years Exp", value: "2+" },
              { label: "Projects", value: "15+" },
              { label: "Clients", value: "5+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 dark:bg-gray-800/40 p-5 rounded-2xl shadow-lg backdrop-blur-2xl border border-gray-200/20 dark:border-gray-600/20 hover:scale-105 transition-transform duration-300"
              >
                <h4 className="text-2xl md:text-3xl font-bold text-indigo-500 dark:text-indigo-400">
                  {stat.value}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start">
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              View My Work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-8 py-3 rounded-full bg-white/20 dark:bg-gray-800/40 text-gray-900 dark:text-white font-medium shadow-lg border border-gray-300/20 dark:border-gray-600/30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Modern Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-24 max-w-4xl mx-auto"
      >
        <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          📌 My Journey
        </h3>
        <div className="space-y-8 relative border-l-2 border-indigo-500/20 pl-8">
          {[
            { year: "2022", text: "Started learning JavaScript & frontend basics." },
            { year: "2023", text: "Built projects with React, Firebase & MongoDB." },
            { year: "2024", text: "Learned Next.js, worked on full-stack MERN projects." },
            { year: "2025", text: "Creating professional portfolio & real-world apps." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-4 top-2 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md animate-pulse"></div>
              <p className="text-indigo-500 font-semibold">{item.year}</p>
              <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
