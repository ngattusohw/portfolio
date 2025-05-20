import { useEffect, useRef, useState } from "react";

// Types for our space objects
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
  type: 'star' | 'dust';
}

interface Connection {
  startIndex: number;
  endIndex: number;
  opacity: number;
  highlight: boolean;
}

interface Rocket {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  visible: boolean;
  nextLaunchTime: number;
  exhaust: {
    particles: Array<{x: number, y: number, size: number, opacity: number, speed: number}>;
  };
}

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const rocketRef = useRef<Rocket | null>(null);
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
      initializeSpaceObjects(); // Reinitialize objects when canvas is resized
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
    
    // Generate a space-themed color palette
    const starColors = [
      '220, 230, 255',  // Blue-white
      '255, 220, 180',  // Yellow-white
      '255, 180, 180',  // Red-ish
      '180, 180, 255',  // Blue-ish
      '255, 255, 255',  // Pure white
    ];
    
    const dustColors = [
      '100, 149, 237',  // Cornflower blue 
      '147, 112, 219',  // Medium purple
      '65, 105, 225',   // Royal blue
      '72, 61, 139',    // Dark slate blue
      '25, 25, 112',    // Midnight blue
    ];
    
    const createStarShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, spikes = 4) => {
      let rotation = Math.PI / 2 * 3;
      let step = Math.PI / spikes;
      
      ctx.beginPath();
      for (let i = 0; i < spikes; i++) {
        const outerX = x + Math.cos(rotation) * size;
        const outerY = y + Math.sin(rotation) * size;
        ctx.lineTo(outerX, outerY);
        rotation += step;
        
        const innerX = x + Math.cos(rotation) * (size * 0.4);
        const innerY = y + Math.sin(rotation) * (size * 0.4);
        ctx.lineTo(innerX, innerY);
        rotation += step;
      }
      ctx.closePath();
    };
    
    const initializeSpaceObjects = () => {
      stars = [];
      
      // Reduce universe size factor for better performance
      const universeSize = Math.min(Math.floor(canvas.width * canvas.height / 15000), 100);
      
      // Create main stars (larger, brighter)
      const mainStarCount = Math.floor(universeSize * 0.2);
      for (let i = 0; i < mainStarCount; i++) {
        const colorIdx = Math.floor(Math.random() * starColors.length);
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2.5, // Larger stars
          opacity: Math.random() * 0.3 + 0.7, // Brighter
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.01 + 0.005,
          color: starColors[colorIdx],
          type: 'star'
        });
      }
      
      // Create small background stars (numerous, smaller)
      const bgStarCount = Math.floor(universeSize * 0.4);
      for (let i = 0; i < bgStarCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.2 + 0.8, // Smaller stars
          opacity: Math.random() * 0.5 + 0.3, // Less bright
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.005 + 0.002,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          type: 'star'
        });
      }
      
      // Create cosmic dust (smallest, dimmest) - reduced count for performance
      const dustCount = Math.floor(universeSize * 0.15);
      for (let i = 0; i < dustCount; i++) {
        const colorIdx = Math.floor(Math.random() * dustColors.length);
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.6 + 0.2, // Very small
          opacity: Math.random() * 0.2 + 0.1, // Very dim
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.005, // Moderate pulse
          color: dustColors[colorIdx],
          type: 'dust'
        });
      }
      
      // Create constellation connections between main stars (significantly reduced for performance)
      connections = [];
      // Only create connections for a subset of main stars
      const connectionLimit = Math.min(10, mainStarCount);
      for (let i = 0; i < connectionLimit && i < stars.length; i++) {
        // Limit the number of connections per star
        const maxConnections = 2;
        let starConnections = 0;
        
        for (let j = i + 1; j < connectionLimit && j < stars.length && starConnections < maxConnections; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create connections between stars that are close to each other
          if (distance < canvas.width / 5) {
            connections.push({
              startIndex: i,
              endIndex: j,
              opacity: (1 - distance / (canvas.width / 5)) * 0.2, // More subtle connections
              highlight: false
            });
            starConnections++;
          }
        }
      }
      
      // Initialize rocket animation
      initializeRocket();
    };
    
    // Initialize rocket
    const initializeRocket = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      rocketRef.current = {
        x: -100, // Start off-screen
        y: canvas.height * (0.3 + Math.random() * 0.4), // Random vertical position
        width: 40,
        height: 80,
        speed: 1 + Math.random() * 0.5, // Variable speed
        visible: false,
        nextLaunchTime: Date.now() + (10000 + Math.random() * 15000), // 10-25 seconds from now
        exhaust: {
          particles: []
        }
      };
    };
    
    // Draw SpaceX Starship
    const drawRocket = () => {
      const rocket = rocketRef.current;
      const canvas = canvasRef.current;
      if (!rocket || !canvas || !ctx) return;
      
      // Check if it's time to launch rocket
      if (!rocket.visible && Date.now() > rocket.nextLaunchTime) {
        rocket.visible = true;
        rocket.x = -rocket.width;
        rocket.y = canvas.height * (0.3 + Math.random() * 0.4);
        rocket.speed = 1 + Math.random() * 0.5;
        rocket.exhaust.particles = [];
      }
      
      // Update rocket position
      if (rocket.visible) {
        rocket.x += rocket.speed;
        
        // Create exhaust particles
        if (Math.random() > 0.3) {
          for (let i = 0; i < 3; i++) {
            rocket.exhaust.particles.push({
              x: rocket.x,
              y: rocket.y + rocket.height,
              size: 1 + Math.random() * 2,
              opacity: 0.6 + Math.random() * 0.4,
              speed: 0.5 + Math.random() * 0.5
            });
          }
        }
        
        // Update and draw exhaust particles
        ctx.save();
        for (let i = 0; i < rocket.exhaust.particles.length; i++) {
          const particle = rocket.exhaust.particles[i];
          particle.x -= particle.speed;
          particle.y += (Math.random() - 0.4) * 1.5;
          particle.opacity -= 0.02;
          
          if (particle.opacity <= 0) {
            rocket.exhaust.particles.splice(i, 1);
            i--;
            continue;
          }
          
          // Draw exhaust particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 160, 60, ${particle.opacity})`;
          ctx.fill();
        }
        ctx.restore();
        
        // Draw SpaceX Starship rocket (more realistic)
        ctx.save();
        
        // Main rocket body (silver with slight gradient)
        const bodyGradient = ctx.createLinearGradient(rocket.x, 0, rocket.x + rocket.width, 0);
        bodyGradient.addColorStop(0, '#D8D8D8');
        bodyGradient.addColorStop(0.5, '#E6E9ED');
        bodyGradient.addColorStop(1, '#CCD1D9');
        
        // Draw cylindrical rocket body
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.rect(
          rocket.x, 
          rocket.y + rocket.height * 0.2,
          rocket.width, 
          rocket.height * 0.65
        );
        ctx.fill();
        
        // Draw nose cone (pointed top)
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y + rocket.height * 0.2);
        ctx.lineTo(rocket.x + rocket.width * 0.5, rocket.y);
        ctx.lineTo(rocket.x + rocket.width, rocket.y + rocket.height * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Windows/portholes
        ctx.fillStyle = '#34495E';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(
            rocket.x + rocket.width * 0.5,
            rocket.y + rocket.height * (0.3 + i * 0.12),
            rocket.width * 0.06,
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
        
        // Bottom engine section (darker)
        ctx.fillStyle = '#AAB2BD';
        ctx.beginPath();
        ctx.rect(
          rocket.x,
          rocket.y + rocket.height * 0.85,
          rocket.width,
          rocket.height * 0.15
        );
        ctx.fill();
        
        // Engine nozzles
        ctx.fillStyle = '#656D78';
        for (let i = 0; i < 3; i++) {
          const nozzleWidth = rocket.width * 0.2;
          const spacing = (rocket.width - nozzleWidth * 3) / 4;
          const nozzleX = rocket.x + spacing + (nozzleWidth + spacing) * i;
          
          ctx.beginPath();
          ctx.rect(
            nozzleX,
            rocket.y + rocket.height,
            nozzleWidth,
            rocket.height * 0.1
          );
          ctx.fill();
        }
        
        // Fins (more aerodynamic)
        ctx.fillStyle = '#CCD1D9';
        
        // Left fin
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y + rocket.height * 0.6);
        ctx.lineTo(rocket.x - rocket.width * 0.2, rocket.y + rocket.height * 0.9);
        ctx.lineTo(rocket.x, rocket.y + rocket.height);
        ctx.closePath();
        ctx.fill();
        
        // Right fin
        ctx.beginPath();
        ctx.moveTo(rocket.x + rocket.width, rocket.y + rocket.height * 0.6);
        ctx.lineTo(rocket.x + rocket.width + rocket.width * 0.2, rocket.y + rocket.height * 0.9);
        ctx.lineTo(rocket.x + rocket.width, rocket.y + rocket.height);
        ctx.closePath();
        ctx.fill();
        
        // Detail lines for realism
        ctx.strokeStyle = '#AAB2BD';
        ctx.lineWidth = 0.5;
        
        // Horizontal line separating sections
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y + rocket.height * 0.85);
        ctx.lineTo(rocket.x + rocket.width, rocket.y + rocket.height * 0.85);
        ctx.stroke();
        
        // SpaceX logo (simplified)
        ctx.fillStyle = '#34495E';
        ctx.font = `bold ${rocket.width * 0.15}px Arial`;
        ctx.fillText("SPACEX", rocket.x + rocket.width * 0.2, rocket.y + rocket.height * 0.55);
        
        ctx.restore();
        
        // Check if rocket has left the screen
        if (rocket.x > canvas.width + 100) {
          rocket.visible = false;
          rocket.nextLaunchTime = Date.now() + (20000 + Math.random() * 30000); // 20-50 seconds until next appearance
        }
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update stars
      stars.forEach(star => {
        // Update star pulse
        star.pulse += star.pulseSpeed;
        if (star.pulse > Math.PI * 2) star.pulse = 0;
      });
      
      // Draw cosmic dust first (background layer)
      stars.forEach((star, index) => {
        if (star.type === 'dust') {
          // Simple circle for dust
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.5})`;
          ctx.fill();
        }
      });
      
      // Draw connections (middle layer)
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
          
          connection.highlight = distToMouse < 120; // Increased interaction range
        }
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(startStar.x, startStar.y);
        ctx.lineTo(endStar.x, endStar.y);
        
        if (connection.highlight) {
          // Enhanced connection when mouse is near
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = `rgba(${startStar.color}, 0.7)`;
          
          // Glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(${startStar.color}, 0.7)`;
        } else {
          // Normal connection
          ctx.lineWidth = 0.7;
          ctx.strokeStyle = `rgba(${startStar.color}, ${connection.opacity})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow for next drawing
      });
      
      // Draw stars (foreground layer)
      stars.forEach((star, index) => {
        if (star.type === 'dust') return; // Already drawn
        
        // Calculate current size with pulsing effect for stars
        let currentSize = star.size;
        const pulseFactor = Math.sin(star.pulse) * 0.2 + 1; // Reduced pulse effect
        currentSize = star.size * pulseFactor;
        
        // Check if mouse is near this star
        if (isInteractive) {
          const distToMouse = Math.sqrt(
            Math.pow(star.x - mousePosition.current.x, 2) +
            Math.pow(star.y - mousePosition.current.y, 2)
          );
          
          const interactionRange = 60; // Reduced range
          
          if (distToMouse < interactionRange) {
            // Enhanced star when mouse is near
            const glowIntensity = 10; // Reduced glow
            const glow = glowIntensity * (1 - distToMouse / interactionRange);
            ctx.shadowBlur = glow;
            ctx.shadowColor = `rgba(${star.color}, ${star.opacity})`;
            
            // Draw star with glow - no random special shapes for better performance
            ctx.beginPath();
            ctx.arc(star.x, star.y, currentSize * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
            ctx.fill();
          } else {
            // Normal drawing
            ctx.beginPath();
            ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.8})`;
            ctx.fill();
          }
        } else {
          // Non-interactive mode
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${star.opacity * 0.8})`;
          ctx.fill();
        }
        
        ctx.shadowBlur = 0; // Reset shadow for next drawing
      });
      
      // Draw the SpaceX Starship rocket if needed
      drawRocket();
      
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
        background: 'radial-gradient(ellipse at center, #0f1729 0%, #0c0d20 50%, #050510 100%)'
      }}
    />
  );
}
