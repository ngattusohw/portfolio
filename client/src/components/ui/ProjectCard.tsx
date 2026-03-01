import { useState } from "react";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "large";
}

// Icon mapping based on project categories/type
const getProjectIcon = (project: Project) => {
  const title = project.title.toLowerCase();
  if (title.includes("kai") || project.categories.includes("ai")) {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    );
  }
  if (title.includes("watchpoint") || title.includes("monitor")) {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    );
  }
  if (title.includes("life") || title.includes("skill")) {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    );
  }
  if (title.includes("poll")) {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    );
  }
  if (title.includes("ministry") || title.includes("faith")) {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    );
  }
  // Default: productivity/task icon
  return (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  );
};

// Color gradient based on category
const getGradient = (project: Project) => {
  if (project.categories.includes("ai")) {
    return "from-purple-600 via-primary to-accent";
  }
  if (project.categories.includes("enterprise")) {
    return "from-primary via-primary/80 to-accent";
  }
  return "from-primary to-accent";
};

export default function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleShowDetails = () => {
    const event = new CustomEvent('openProjectModal', { detail: project });
    document.dispatchEvent(event);
  };

  const isLarge = variant === "large";

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-2 ${
        isLarge ? "" : ""
      }`}
      data-category={project.categories.join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border gradient on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-2xl bg-white" />

      {/* Header with gradient */}
      <div className={`relative overflow-hidden ${isLarge ? "h-56" : "h-44"}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(project)} opacity-90`} />

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }} />
        </div>

        {/* Floating orb */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl transition-transform duration-700 ${isHovered ? "scale-150" : "scale-100"}`} />

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`p-6 rounded-2xl bg-white/10 backdrop-blur-sm transition-transform duration-500 ${isHovered ? "scale-110 rotate-3" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${isLarge ? "h-16 w-16" : "h-12 w-12"} text-white`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {getProjectIcon(project)}
            </svg>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
          <h4 className={`font-bold text-white ${isLarge ? "text-2xl" : "text-xl"}`}>
            {project.title}
          </h4>
          <p className="text-white/80 text-sm mt-1">{project.subtitle}</p>
        </div>

        {/* Category badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {project.categories.includes("ai") && (
            <span className="px-2 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              AI
            </span>
          )}
          {project.categories.includes("enterprise") && (
            <span className="px-2 py-1 bg-primary/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              Enterprise
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`relative p-6 ${isLarge ? "md:p-8" : ""}`}>
        {/* Key metric for large cards */}
        {isLarge && project.results && (
          <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <p className="text-sm text-slate-600 line-clamp-2">
              <span className="font-semibold text-primary">Impact:</span> {project.results.split('.')[0]}.
            </p>
          </div>
        )}

        <p className={`text-slate-600 mb-5 ${isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.slice(0, isLarge ? 8 : 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs rounded-full font-medium border border-slate-200"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (isLarge ? 8 : 4) && (
            <span className="px-3 py-1 text-slate-500 text-xs">
              +{project.technologies.length - (isLarge ? 8 : 4)} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group/link"
          >
            <span>Visit Site</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform group-hover/link:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors group/btn"
            onClick={handleShowDetails}
          >
            <span>Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
