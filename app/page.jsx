

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import TechNews from "@/components/TechNews";
import Contact from "@/components/Contact";
import AboutMe from "@/components/AboutMe";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <Navbar />
      <div className="pt-20 container mx-auto ">
        <Hero />
        <Projects />
        <AboutMe />
        <Skills />
        <TechNews />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
