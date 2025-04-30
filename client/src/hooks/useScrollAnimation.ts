import { useCallback } from "react";

export function useScrollAnimation() {
  const setupScrollAnimations = useCallback(() => {
    const animatedElements = document.querySelectorAll('.animate-slide-up');
    
    const checkScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
          element.classList.add('opacity-100');
        }
      });
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return { setupScrollAnimations };
}
