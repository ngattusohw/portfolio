import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RomanHero from "@/components/sections/RomanHero";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import ProjectModal from "@/components/ui/ProjectModal";

export default function Home() {
  return (
    <div className="portfolio-page">
      <Header />
      <main id="main-content">
        <RomanHero />
        <ProjectsSection />
        <AboutSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal />
    </div>
  );
}
