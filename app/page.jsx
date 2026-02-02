"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import TechNews from "@/components/TechNews";
import Contact from "@/components/Contact";
import AboutMe from "@/components/AboutMe";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full relative">
      {/* Floating background particles */}
      <Particles />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="pt-20 container mx-auto">
        <Hero />
        <Projects />
        <AboutMe />
        <Skills />
        <TechNews limit={6} />
        <Contact />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
