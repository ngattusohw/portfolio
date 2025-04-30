import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
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
    // Setup scroll animations when component mounts
    setupScrollAnimations();

    // Setup smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for header
            behavior: 'smooth'
          });
        }
      });
    });
  }, [setupScrollAnimations]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
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
