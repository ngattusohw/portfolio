import { useEffect, useState, useRef } from "react";
import { projects, featuredProject } from "@/data/projects";
import CompanyLogo from "@/components/ui/CompanyLogo";

export default function ProjectsSection() {
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

  const investors = ["Catalio Capital", "General Catalyst", "Tusk Ventures"];
  const pressMentions = featuredProject.press || [];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-32 bg-slate-950 relative overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div
          className={`max-w-3xl mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-blue-400 font-mono text-sm mb-4 tracking-wider">
            02. What I've Built
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-400 text-lg">
            A selection of projects I've led, co-founded, or contributed to significantly.
          </p>
        </div>

        {/* Featured Project - Somethings */}
        <div
          className={`mb-20 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Left - Visual */}
                <div className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 to-blue-400 p-8 lg:p-12 flex items-center justify-center min-h-[300px]">
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: "32px 32px",
                    }}
                  />

                  <div className="relative text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-4">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      Current Role
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      {featuredProject.title}
                    </h3>
                    <p className="text-white/80 font-medium">
                      {featuredProject.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right - Details */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                  {/* Metrics row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {featuredProject.metrics?.map((metric, i) => (
                      <div key={i}>
                        <p className="text-2xl lg:text-3xl font-bold text-slate-100">
                          {metric.value}
                        </p>
                        <p className="text-slate-500 text-sm">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    {featuredProject.description}
                  </p>

                  {/* Backers with logos */}
                  <div className="mb-6">
                    <p className="text-slate-500 text-sm mb-3">Backed by</p>
                    <div className="flex flex-wrap items-center gap-4">
                      {investors.map((investor) => (
                        <div
                          key={investor}
                          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-colors"
                        >
                          <CompanyLogo company={investor} size="md" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Press mentions with logos */}
                  {pressMentions.length > 0 && (
                    <div className="mb-6">
                      <p className="text-slate-500 text-sm mb-3">Featured in</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {pressMentions.map((press) => (
                          <a
                            key={press.name}
                            href={press.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-slate-800/30 border border-slate-800 rounded-lg hover:border-slate-600 hover:bg-slate-800/50 transition-colors"
                          >
                            <CompanyLogo company={press.name} size="sm" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredProject.technologies.slice(0, 6).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={featuredProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      Visit Site
                      <svg
                        className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Projects - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative h-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300">
                {/* Project header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                {/* Title & subtitle */}
                <h3 className="text-xl font-semibold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                </h3>
                <p className="text-slate-500 text-sm mb-4">{project.subtitle}</p>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-slate-500 text-xs font-mono"
                    >
                      {tech}{i < Math.min(project.technologies.length, 4) - 1 ? " •" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More projects link */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/ngattusohw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-mono text-sm"
          >
            View more on GitHub
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
