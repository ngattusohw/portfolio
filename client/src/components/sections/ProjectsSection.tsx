import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

type FilterType = "all" | "web" | "startup" | "enterprise";

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter === "all") return true;
    return project.categories.includes(activeFilter);
  });

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono mb-2">My Work</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
          
          {/* Project Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeFilter === "all" ? "bg-primary text-white" : "bg-slate-200 hover:bg-slate-300"}`}
              onClick={() => handleFilterChange("all")}
            >
              All Projects
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeFilter === "web" ? "bg-primary text-white" : "bg-slate-200 hover:bg-slate-300"}`}
              onClick={() => handleFilterChange("web")}
            >
              Web Apps
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeFilter === "startup" ? "bg-primary text-white" : "bg-slate-200 hover:bg-slate-300"}`}
              onClick={() => handleFilterChange("startup")}
            >
              Startups
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeFilter === "enterprise" ? "bg-primary text-white" : "bg-slate-200 hover:bg-slate-300"}`}
              onClick={() => handleFilterChange("enterprise")}
            >
              Enterprise
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
