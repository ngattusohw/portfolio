import { useEffect, useState, useRef } from "react";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
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
      id="experience"
      className="py-32 bg-slate-900 relative overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div
          className={`max-w-3xl mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-blue-400 font-mono text-sm mb-4 tracking-wider">
            03. Where I've Worked
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Experience
          </h2>
          <p className="text-slate-400 text-lg">
            A timeline of my professional journey in software engineering.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className={`relative pl-8 pb-12 last:pb-0 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-[11px] top-6 w-[2px] h-full bg-slate-800" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>

              {/* Content */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      {experience.role}
                    </h3>
                    <p className="text-blue-400 font-medium">
                      {experience.company}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-sm rounded-lg font-mono">
                    {experience.period}
                  </span>
                </div>

                <p className="text-slate-400 mb-4 leading-relaxed">
                  {experience.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resume link */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-mono text-sm"
          >
            View Full Resume
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
