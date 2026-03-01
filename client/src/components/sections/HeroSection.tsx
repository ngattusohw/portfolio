import { useEffect, useState, useRef } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Cursor spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 40%)`,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[128px]" />

      {/* Main content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Intro line */}
          <p className="text-slate-400 text-lg md:text-xl mb-6 font-mono">
            Hi, my name is
          </p>

          {/* Name */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-100 mb-4 tracking-tight">
            Nick Gattuso
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"> III</span>
          </h1>

          {/* Tagline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-400 mb-8">
            I build technology that saves lives.
          </h2>

          {/* Description */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
            I'm the <span className="text-slate-200 font-medium">Head of Engineering</span> at{" "}
            <a
              href="https://somethings.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300"
            >
              Somethings
            </a>
            , where I lead the team behind an AI-powered mental health platform.
            We've helped <span className="text-slate-200 font-medium">11,000+ teens</span> achieve
            a <span className="text-emerald-400 font-medium">65% reduction in depression</span>.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-blue-400/50 text-blue-400 font-medium rounded-lg hover:bg-blue-400/10 transition-all duration-300"
            >
              Check out my work
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-4 text-slate-400 font-medium hover:text-slate-200 transition-colors"
            >
              Get in touch
            </a>
          </div>

          {/* Stats row - clean and minimal */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
            {[
              { value: "$19.2M", label: "Series A Raised" },
              { value: "11,000+", label: "Teens Helped" },
              { value: "65%", label: "Depression Reduction" },
              { value: "1,100×", label: "User Growth" },
            ].map((stat, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-200">{stat.value}</span>
                <span className="text-slate-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors"
        >
          <span className="text-xs font-mono tracking-wider">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </a>
      </div>
    </section>
  );
}
