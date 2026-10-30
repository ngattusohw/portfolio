import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import { COLLECT_SOFTWARE_URL, projects, type ProjectCategory } from "@/data/projects";

type FilterType = "all" | ProjectCategory;

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "ai", label: "AI" },
  { value: "developer-tools", label: "Developer Tools" },
  { value: "platforms", label: "Platforms & Sites" },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredProjects = projects.filter(project =>
    activeFilter === "all" || project.categories.includes(activeFilter)
  );

  return (
    <section id="projects" className="py-12 sm:py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <p className="text-primary font-mono mb-2">Collect Software</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Selected Projects</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-slate-600 mb-8">
            Projects from{" "}
            <a
              href={COLLECT_SOFTWARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Collect Software’s portfolio
            </a>
            , spanning AI products, developer tools, and digital platforms.
          </p>
          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 mb-8"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map(filter => (
              <button
                key={filter.value}
                type="button"
                className={`min-h-11 px-4 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${activeFilter === filter.value ? "bg-primary text-white" : "bg-slate-200 hover:bg-slate-300"}`}
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
