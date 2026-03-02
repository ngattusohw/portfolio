import { useEffect, useState, useRef } from "react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 bg-slate-950 relative overflow-hidden"
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Section label */}
          <p className="text-blue-400 font-mono text-sm mb-8 tracking-wider">
            01. About Me
          </p>

          {/* Main narrative */}
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-slate-300 text-xl md:text-2xl leading-relaxed mb-8">
              I've been building software for over a decade, with a focus on products that
              genuinely help people. These days, I spend most of my time thinking about
              how AI can make mental healthcare more accessible.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              At{" "}
              <a
                href="https://somethings.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 no-underline border-b border-blue-400/30 hover:border-blue-300 transition-colors"
              >
                Somethings
              </a>
              , I lead engineering for an AI-powered peer mentorship platform.
              We match teens with trained mentors who've faced similar challenges.
              The results have been remarkable—65% of our users see meaningful
              reductions in depression symptoms.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Before Somethings, I was an engineer at{" "}
              <a
                href="https://joinkai.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 no-underline border-b border-blue-400/30 hover:border-blue-300 transition-colors"
              >
                kAI
              </a>{" "}
              (an AI code assistant) and{" "}
              <a
                href="https://watchpoint.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 no-underline border-b border-blue-400/30 hover:border-blue-300 transition-colors"
              >
                Watchpoint
              </a>{" "}
              (API monitoring). I also co-founded{" "}
              <a
                href="https://lifeskills.software"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 no-underline border-b border-blue-400/30 hover:border-blue-300 transition-colors"
              >
                Life Skills Software
              </a>{" "}
              to help students with special needs learn essential life skills through
              interactive technology.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              I'm drawn to hard problems at the intersection of technology and human welfare.
              If you're working on something similar, I'd love to chat.
            </p>
          </div>

          {/* Skills - clean horizontal layout */}
          <div className="mt-16 pt-16 border-t border-slate-800">
            <p className="text-slate-500 text-sm font-mono mb-6">Technologies I work with</p>
            <div className="flex flex-wrap gap-3">
              {[
                "TypeScript",
                "React / React Native",
                "Node.js",
                "Python",
                "AWS",
                "PostgreSQL",
                "AI/ML",
                "System Design",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-sm hover:border-slate-700 hover:text-slate-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm">
            <a
              href="https://github.com/ngattusohw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/nickgattuso"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="mailto:nick@example.com"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
