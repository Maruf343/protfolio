"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Portfolio Website",
    description: "My personal portfolio built with Next.js and Tailwind CSS. Responsive and modern design with dark mode support.",
    image: "/projects/portfolio.png", // put image in public/projects/
    liveLink: "https://yourportfolio.com",
  },
  {
    title: "Chat App",
    description: "Messenger-style live chat with Firebase backend. Real-time messaging and notifications.",
    image: "/projects/chatapp.png",
    liveLink: "https://yourchatapp.com",
  },
  {
    title: "Gardening Community Hub",
    description: "Full-stack gardening community project with user authentication, tips sharing, and dark/light mode.",
    image: "/garden.PNG",
    liveLink: "https://garden-community-ee176.web.app/",
  },
  {
    title: "Food Donation App",
    description: "MERN Stack project to manage food donations and requests with Firebase authentication.",
    image: "/food.PNG",
    liveLink: "https://food-sharing-e4eb1.web.app/",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen px-6 md:px-20 py-16 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12">
        My Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
              </div>

              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors duration-300 text-center"
                >
                  Live Site
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
