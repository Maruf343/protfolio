"use client";

import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaJsSquare } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiFirebase, SiMongodb, SiExpress } from "react-icons/si";
import { useRef, useEffect, useState } from "react";

const skillCategories = [
  {
    category: "Frontend",
    glowColor: "rgba(99,102,241,0.12)",
    icon: <FaReact size={28} className="text-indigo-500" />,
    skills: [
      { name: "React", level: 90, icon: <FaReact className="text-indigo-500 w-6 h-6" /> },
      { name: "Next.js", level: 85, icon: <SiNextdotjs className="w-6 h-6 text-indigo-600" /> },
      { name: "Tailwind CSS", level: 95, icon: <SiTailwindcss className="w-6 h-6 text-indigo-400" /> },
      { name: "JavaScript", level: 95, icon: <FaJsSquare className="text-yellow-400 w-6 h-6" /> },
    ],
  },
  {
    category: "Backend",
    glowColor: "rgba(99,102,241,0.12)",
    icon: <FaNodeJs size={28} className="text-indigo-500" />,
    skills: [
      { name: "Node.js", level: 85, icon: <FaNodeJs className="text-indigo-500 w-6 h-6" /> },
      { name: "Express.js", level: 80, icon: <SiExpress className="w-6 h-6 text-indigo-400" /> },
      { name: "Firebase", level: 80, icon: <SiFirebase className="w-6 h-6 text-indigo-500" /> },
    ],
  },
  {
    category: "Database",
    glowColor: "rgba(99,102,241,0.12)",
    icon: <FaDatabase size={28} className="text-indigo-500" />,
    skills: [
      { name: "MongoDB", level: 80, icon: <SiMongodb className="text-green-700 w-6 h-6" /> },
    ],
  },
];

export default function Skills() {
  const containerRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [particles, setParticles] = useState([]);

  // Track card positions for network lines
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const nodes = containerRef.current.querySelectorAll(".skill-card");
      const pos = Array.from(nodes).map(node => {
        const rect = node.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
      setCards(pos);
    };
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  // Floating particles
  useEffect(() => {
    const tempParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.2 + 0.05,
    }));
    setParticles(tempParticles);

    const moveParticles = () => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          y: p.y - p.speed < 0 ? window.innerHeight : p.y - p.speed,
        }))
      );
      requestAnimationFrame(moveParticles);
    };
    moveParticles();
  }, []);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen px-6 md:px-24 py-24
        bg-gradient-to-br from-slate-50 via-white to-indigo-50
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* Floating particles */}
      <svg className="absolute inset-0 w-full h-full -z-20">
        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="rgba(99,102,241,0.1)" fillOpacity={p.opacity} />
        ))}
      </svg>

      {/* Network lines */}
      <svg className="absolute inset-0 w-full h-full -z-10">
        {cards.map((cardA, i) =>
          cards.map((cardB, j) => {
            if (i < j) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={cardA.x}
                  y1={cardA.y}
                  x2={cardB.x}
                  y2={cardB.y}
                  stroke="rgba(99,102,241,0.1)"
                  strokeWidth="1"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: (i + j) * 0.1 }}
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Title */}
      <h2 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 dark:text-white mb-6 relative z-10">
        My <span className="text-indigo-500">Skills</span>
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-16 max-w-3xl mx-auto relative z-10">
        I am a MERN Stack developer with expertise in modern frontend and backend technologies. Here’s a look at my core skills and proficiency levels.
      </p>

      {/* Skill Categories */}
      {skillCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-16 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            {category.icon}
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{category.category}</h3>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start relative">
            {/* Glow behind cards */}
            <div
              className="absolute inset-0 rounded-3xl -z-10 blur-3xl"
              style={{ backgroundColor: category.glowColor }}
            />

            {category.skills.map((skill, index) => (
              <motion.div
                key={index}
                className="skill-card w-full md:w-60 bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-xl p-5 flex flex-col gap-3 cursor-pointer relative z-10 backdrop-blur-md border border-indigo-300/20 dark:border-indigo-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 30px 60px rgba(0,0,0,0.25)" }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3 relative">
                  {skill.icon && (
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      transition={{ duration: 0.2 }}
                      className="relative before:absolute before:-inset-2 before:rounded-full before:bg-indigo-500/20 before:blur-xl"
                    >
                      {skill.icon}
                    </motion.div>
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-300">{skill.level}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="text-center mt-12 relative z-10">
        <motion.a
          href="#projects"
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-500 text-white font-medium shadow-lg hover:bg-indigo-600"
        >
          See My Projects
        </motion.a>
      </div>
    </section>
  );
}
