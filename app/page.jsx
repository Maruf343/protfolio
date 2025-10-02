
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <Navbar />
      <div className="pt-20 container mx-auto ">
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}
