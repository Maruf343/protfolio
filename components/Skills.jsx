"use client";

import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaJsSquare } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiFirebase, SiMongodb, SiExpress } from "react-icons/si";
import { useRef, useEffect, useState } from "react";

const skillCategories = [
  {
    category: "Frontend",
    glowColor: "rgba(59, 130, 246, 0.15)",
    icon: <FaReact size={28} className="text-blue-500" />,
    skills: [
      { name: "React", level: 90, icon: <FaReact className="text-blue-500 w-6 h-6" /> },
      { name: "Next.js", level: 85, icon: <SiNextdotjs className="w-6 h-6" /> },
      { name: "Tailwind CSS", level: 95, icon: <SiTailwindcss className="w-6 h-6 text-teal-500" /> },
      { name: "JavaScript", level: 95, icon: <FaJsSquare className="text-yellow-500 w-6 h-6" /> },
    ],
  },
  {
    category: "Backend",
    glowColor: "rgba(34,197,94,0.15)",
    icon: <FaNodeJs size={28} className="text-green-500" />,
    skills: [
      { name: "Node.js", level: 85, icon: <FaNodeJs className="text-green-500 w-6 h-6" /> },
      { name: "Express.js", level: 80, icon: <SiExpress className="w-6 h-6" /> },
      { name: "Firebase", level: 80, icon: <SiFirebase className="text-orange-500 w-6 h-6" /> },
    ],
  },
  {
    category: "Database",
    glowColor: "rgba(128, 90, 213,0.15)",
    icon: <FaDatabase size={28} className="text-purple-500" />,
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

  // Generate floating particles
  useEffect(() => {
    const tempParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
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
      className="relative min-h-screen px-6 md:px-20 py-16 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Floating particles */}
      <svg className="absolute inset-0 w-full h-full -z-20">
        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill="rgba(99, 102, 241, 0.2)" fillOpacity={p.opacity} />
        ))}
      </svg>

      {/* Animated network lines */}
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
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="1"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: (i + j) * 0.1 }}
                />
              );
            }
            return null;
          })
        )}
      </svg>

      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4 relative z-10">
        My Skills
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto relative z-10">
        I am a MERN Stack developer with expertise in modern frontend and backend technologies. Here’s a look at my core skills and proficiency levels.
      </p>

      {skillCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-10 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            {category.icon && <div>{category.icon}</div>}
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{category.category}</h3>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start relative">
            <div
              className="absolute inset-0 rounded-3xl -z-10 blur-3xl"
              style={{ backgroundColor: category.glowColor }}
            />

            {category.skills.map((skill, index) => (
              <motion.div
                key={index}
                className="skill-card w-full md:w-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col gap-3 cursor-pointer relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.15, boxShadow: "0px 30px 50px rgba(0,0,0,0.4)" }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  {skill.icon && <motion.div whileHover={{ scale: 1.3 }} transition={{ duration: 0.2 }}>{skill.icon}</motion.div>}
                  <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-300">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
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
    </section>
  );
}
