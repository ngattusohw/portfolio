import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="#hero" className="text-2xl font-sans font-bold text-primary tracking-tight">
            NG<span className="text-secondary">III</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li><a href="#about" className="font-medium hover:text-primary transition-colors">About</a></li>
              <li><a href="#projects" className="font-medium hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#experience" className="font-medium hover:text-primary transition-colors">Experience</a></li>
              <li><a href="#blog" className="font-medium hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#contact" className="font-medium hover:text-primary transition-colors">Contact</a></li>
              <li>
                <a 
                  href="#contact" 
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-slate-700 hover:text-primary"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            <a 
              href="#about" 
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
              onClick={closeMobileMenu}
            >
              About
            </a>
            <a 
              href="#projects" 
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
              onClick={closeMobileMenu}
            >
              Projects
            </a>
            <a 
              href="#experience" 
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
              onClick={closeMobileMenu}
            >
              Experience
            </a>
            <a 
              href="#blog" 
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
              onClick={closeMobileMenu}
            >
              Blog
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
              onClick={closeMobileMenu}
            >
              Contact
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 bg-primary text-white rounded-md"
              onClick={closeMobileMenu}
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
