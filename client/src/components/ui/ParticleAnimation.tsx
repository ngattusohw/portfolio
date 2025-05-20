import { useEffect, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
}

interface Connection {
  startIndex: number;
  endIndex: number;
  opacity: number;
  highlight: boolean;
}

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      initializeStars(); // Reinitialize stars when canvas is resized
    };
    
    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    // For mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
    };
    
    // Create stars and connections
    let stars: Star[] = [];
    let connections: Connection[] = [];
    
    // Generate a vibrant palette
    const primaryColors = [
      '68, 138, 255',   // Blue
      '255, 112, 67',   // Orange
      '102, 187, 106',  // Green
      '171, 71, 188',   // Purple
      '255, 167, 38'    // Amber
    ];
    
    const initializeStars = () => {
      stars = [];
      const starCount = Math.min(Math.floor(canvas.width * canvas.height / 10000), 150);
      
      // Create stars
      for (let i = 0; i < starCount; i++) {
        const colorIdx = Math.floor(Math.random() * primaryColors.length);
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 2,
          opacity: Math.random() * 0.5 + 0.5,
          pulse: 0,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          color: primaryColors[colorIdx]
        });
      }
      
      // Create connections
      connections = [];
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create connections between stars that are close to each other
          if (distance < canvas.width / 5) {
            connections.push({
              startIndex: i,
              endIndex: j,
              opacity: (1 - distance / (canvas.width / 5)) * 0.3,
              highlight: false
            });
          }
        }
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // First draw connections
      connections.forEach(connection => {
        const startStar = stars[connection.startIndex];
        const endStar = stars[connection.endIndex];
        
        // Check if this connection is close to mouse cursor
        if (isInteractive) {
          const midX = (startStar.x + endStar.x) / 2;
          const midY = (startStar.y + endStar.y) / 2;
          const distToMouse = Math.sqrt(
            Math.pow(midX - mousePosition.current.x, 2) +
            Math.pow(midY - mousePosition.current.y, 2)
          );
          
          connection.highlight = distToMouse < 100;
        }
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(startStar.x, startStar.y);
        ctx.lineTo(endStar.x, endStar.y);
        
        if (connection.highlight) {
          // Enhanced connection when mouse is near
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = `rgba(${startStar.color}, 0.8)`;
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${startStar.color}, 0.8)`;
        } else {
          // Normal connection
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${startStar.color}, ${connection.opacity})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow for next drawing
      });
      
      // Then draw stars
      stars.forEach((star, index) => {
        // Update star pulse
        star.pulse += star.pulseSpeed;
        if (star.pulse > Math.PI * 2) star.pulse = 0;
        
        // Calculate current size with pulsing effect
        const pulseFactor = Math.sin(star.pulse) * 0.5 + 1;
        const currentSize = star.size * pulseFactor;
        
        // Check if mouse is near this star
        if (isInteractive) {
          const distToMouse = Math.sqrt(
            Math.pow(star.x - mousePosition.current.x, 2) +
            Math.pow(star.y - mousePosition.current.y, 2)
          );
          
          if (distToMouse < 80) {
            // Enhanced star when mouse is near
            const glow = 20 * (1 - distToMouse / 80);
            ctx.shadowBlur = glow;
            ctx.shadowColor = `rgba(${star.color}, ${star.opacity})`;
            
            // Draw star with glow
            ctx.beginPath();
            ctx.arc(star.x, star.y, currentSize * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
            ctx.fill();
          } else {
            // Normal star
            ctx.beginPath();
            ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.7})`;
            ctx.fill();
          }
        } else {
          // Normal star (non-interactive mode)
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.7})`;
          ctx.fill();
        }
        
        ctx.shadowBlur = 0; // Reset shadow for next drawing
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    // Initialize everything
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    animate();
    
    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isInteractive]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0" 
      style={{ 
        zIndex: 0,
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)'
      }}
    />
  );
}
