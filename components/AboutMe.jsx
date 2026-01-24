"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import marufPhoto from "../public/about-me.png";
import { CodeBracketIcon, CommandLineIcon } from "@heroicons/react/24/outline";

export default function AboutMe() {
  return (
    <section
      id="about-me"
      className="relative overflow-hidden min-h-screen px-6 md:px-24 py-24
      bg-gradient-to-br from-slate-50 via-white to-indigo-50
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center text-5xl md:text-6xl font-extrabold mb-20"
      >
        About <span className="text-indigo-500">Me</span>
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left: Image + Terminal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center"
        >
          {/* Photo Card */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl backdrop-blur-lg bg-white/20 group hover:shadow-2xl transition-shadow duration-700">
            <Image
              src={marufPhoto}
              alt="Maruf"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
          </div>

          {/* Terminal / Developer card */}
          <div className="mt-10 w-full max-w-md bg-gray-900 text-gray-100 rounded-2xl shadow-xl border border-white/10 overflow-hidden font-mono">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="ml-3 text-sm text-gray-400">aboutMe.ts</span>
            </div>
            <pre className="p-4 text-sm leading-relaxed">
{`const developer = {
  name: "Maruf",
  background: "Islamic History & Culture",
  role: "Full-Stack Developer",
  stack: ["React", "Next.js", "Node", "MongoDB"],
  mindset: "Clean Code • Scalable UI • UX First"
};`}
            </pre>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Intro */}
          <h3 className="text-4xl font-bold leading-tight">
            Full-Stack Developer building
            <span className="text-indigo-500"> modern, scalable & user-focused apps</span>
          </h3>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Hi! I’m <span className="font-semibold text-indigo-500">Maruf</span>.
            I graduated in <strong>Islamic History & Culture</strong> but found my passion in software development. 
            Through self-learning and real projects, I became a full-stack developer capable of building professional, production-ready applications.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            I specialize in authentication systems, dashboards, CRUD-heavy apps, API integrations, and responsive UI with strong focus on performance and maintainability.
          </p>

          {/* Tech Stack */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
              <CodeBracketIcon className="w-5 h-5 text-indigo-500" />
              Core Stack
            </h4>
            <div className="flex flex-wrap gap-3">
              {["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase", "Tailwind", "JWT"].map(tech => (
                <span key={tech} className="px-4 py-1 rounded-full text-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="border-l-2 border-gray-200 dark:border-gray-800 pl-6">
            <p className="font-mono text-sm text-gray-500 mb-2">
              Philosophy
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Simple &gt; Clever<br />
              Readable &gt; Abstract<br />
              Maintainable &gt; Trendy
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6">
            {[
              { label: "Years Experience", value: "2+" },
              { label: "Projects Built", value: "15+" },
              { label: "Full-Stack Apps", value: "8+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/70 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 shadow-md text-center"
              >
                <p className="text-3xl font-bold text-indigo-500">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-6 pt-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#projects"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-indigo-500 text-white font-medium shadow-lg hover:bg-indigo-600"
            >
              <CommandLineIcon className="w-5 h-5" />
              View Projects
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#contact"
              className="px-7 py-3 rounded-full border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
