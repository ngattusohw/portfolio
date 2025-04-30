import { useEffect } from "react";
import ParticleAnimation from "@/components/ui/ParticleAnimation";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 to-primary">
      <ParticleAnimation />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl animate-fade-in opacity-0">
          <p className="text-accent font-mono mb-3 text-lg">Hello, I'm</p>
          <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-6">
            Nick Gattuso <span className="text-secondary">III</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8">
            Entrepreneur, Software Engineer & Technical Leader
          </p>
          <p className="text-slate-300 text-lg max-w-2xl mb-10">
            Passionate about building innovative products and leading engineering teams to create impactful solutions.
            From startups to Fortune 500 companies, I've helped shape the future of technology.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#projects" 
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg shadow-lg transition-colors"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium rounded-lg transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-white opacity-75 hover:opacity-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
