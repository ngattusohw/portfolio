import { ChevronRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectHero from "@/components/ui/ProjectHero";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const handleShowDetails = () => {
    document.dispatchEvent(new CustomEvent("openProjectModal", { detail: project }));
  };

  return (
    <article
      className="project-card min-w-0 flex flex-col bg-white rounded-xl shadow-md overflow-hidden"
      data-category={project.categories.join(" ")}
    >
      <ProjectHero project={project} />
      <div className="p-4 sm:p-6 break-words flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
        <p className="mb-4 text-sm text-primary">{project.subtitle}</p>
        <p className="text-slate-600 mb-4">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2 mb-4" aria-label="Project topics">
          {project.tags.map(tag => (
            <li key={tag} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap justify-between gap-x-3 gap-y-1">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={`Visit ${project.title} website (opens in a new tab)`}
            className="min-h-11 text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            <span>Visit Site</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <button 
            type="button"
            className="min-h-11 text-slate-600 hover:text-slate-800 flex items-center"
            aria-label={`Details about ${project.title}`}
            onClick={handleShowDetails}
          >
            <span>Details</span>
            <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
