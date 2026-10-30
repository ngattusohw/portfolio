import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RomanHero from "@/components/sections/RomanHero";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import ProjectModal from "@/components/ui/ProjectModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Home() {
  const { setupScrollAnimations } = useScrollAnimation();

  useEffect(() => {
    return setupScrollAnimations();
  }, [setupScrollAnimations]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <RomanHero />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal />
    </div>
  );
}
