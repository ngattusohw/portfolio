import { useEffect, useState } from 'react';
import starbaseImage from '@assets/starbase.jpeg';

export default function SpaceXSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    const section = document.getElementById('spacex-section');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);
  
  return (
    <section id="spacex-section" className="py-16 bg-gradient-to-b from-slate-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-mono mb-2">SpaceX Starbase</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">The Future of Space Travel</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <img 
              src={starbaseImage} 
              alt="SpaceX Starbase facility with Starship rocket" 
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm">SpaceX Starbase in Boca Chica, Texas</p>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <h3 className="text-2xl font-bold mb-4">Revolutionizing Space Transportation</h3>
            <p className="mb-6 text-slate-700">
              SpaceX's Starship is designed to be a fully reusable transportation system capable of carrying both crew and cargo to Earth orbit, the Moon, Mars, and beyond. 
              As the world's most powerful launch vehicle, Starship represents a significant leap in space technology.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Fully reusable spacecraft capable of multiple flights</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Designed to transport both humans and cargo to deep space</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Critical technology for establishing a sustainable presence on Mars</span>
              </li>
            </ul>
            <a 
              href="https://www.spacex.com/vehicles/starship/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}