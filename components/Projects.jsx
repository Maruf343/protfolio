"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const projects = [
  {
    title: "Portfolio Website",
    description:
      "My personal portfolio built with Next.js and Tailwind CSS. Responsive and modern design with dark mode support.",
    image: "/projects/portfolio.png",
    liveLink: "https://yourportfolio.com",
  },
  {
    title: "Chat App",
    description:
      "Messenger-style live chat with Firebase backend. Real-time messaging and notifications.",
    image: "/projects/chatapp.png",
    liveLink: "https://yourchatapp.com",
  },
  {
    title: "Gardening Community Hub",
    description:
      "Full-stack gardening community project with user authentication, tips sharing, and dark/light mode.",
    image: "/garden.PNG",
    liveLink: "https://garden-community-ee176.web.app/",
  },
  {
    title: "Food Donation App",
    description:
      "MERN Stack project to manage food donations and requests with Firebase authentication.",
    image: "/food.PNG",
    liveLink: "https://food-sharing-e4eb1.web.app/",
  },
];

export default function Projects() {
  const containerRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [particles, setParticles] = useState([]);

  // Track card positions for network lines
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const nodes = containerRef.current.querySelectorAll(".project-card");
      const pos = Array.from(nodes).map((node) => {
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
      setParticles((prev) =>
        prev.map((p) => ({
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
      id="projects"
      ref={containerRef}
      className="relative min-h-screen px-6 md:px-20 py-16 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Floating particles */}
      <svg className="absolute inset-0 w-full h-full -z-20">
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="rgba(99, 102, 241, 0.2)"
            fillOpacity={p.opacity}
          />
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
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: (i + j) * 0.1,
                  }}
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-center  mb-16 relative z-10"
      >
        My Projects
      </motion.h2>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8, scale: 1.03 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="project-card relative group rounded-2xl overflow-hidden shadow-2xl bg-white/70 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/40 hover:shadow-indigo-500/30 transition-all duration-500"
          >
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition duration-500"></div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.liveLink && (
                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
                >
                  View Live <ExternalLink size={18} />
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
