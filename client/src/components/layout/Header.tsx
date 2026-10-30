import { useEffect, useRef, useState } from "react";

const navigation = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Blog", "blog"],
  ["Contact", "contact"],
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-[72px] justify-between items-center gap-4">
          <a href="/#hero" onClick={closeMobileMenu} aria-label="Nick Gattuso home" className="inline-flex min-h-11 items-center text-2xl font-sans font-bold text-primary tracking-tight rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            NG<span className="text-secondary">III</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center space-x-8">
              {navigation.map(([label, section]) => (
                <li key={section}><a href={`/#${section}`} className="inline-flex min-h-11 items-center font-medium hover:text-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{label}</a></li>
              ))}
              <li>
                <a 
                  href="/#contact"
                  className="inline-flex min-h-11 items-center px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            type="button"
            ref={menuButton}
            className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav id="mobile-navigation" aria-label="Mobile navigation" className={`lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-100 bg-white shadow-lg ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="container mx-auto px-4 sm:px-6 pt-2 pb-4 space-y-1">
            {navigation.map(([label, section]) => (
              <a key={section} href={`/#${section}`} className="flex min-h-12 items-center px-3 py-3 rounded-md font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" onClick={closeMobileMenu}>{label}</a>
            ))}
            <a 
              href="/#contact"
              className="flex min-h-12 items-center justify-center px-3 py-3 bg-primary text-white rounded-md font-medium"
              onClick={closeMobileMenu}
            >
              Hire Me
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
