import { ArrowUpRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectHero from "@/components/ui/ProjectHero";
import { usePortfolioMotion } from "@/hooks/usePortfolioMotion";

export default function ProjectCard({
  project,
  number,
}: {
  project: Project;
  number: number;
}) {
  const { motionEnabled } = usePortfolioMotion();
  return (
    <motion.article
      className="project-card"
      data-category={project.categories.join(" ")}
      layout={motionEnabled ? "position" : false}
      initial={false}
      transition={
        motionEnabled
          ? { layout: { type: "spring", stiffness: 360, damping: 34 } }
          : { duration: 0 }
      }
    >
      <div className="project-card-art">
        <ProjectHero project={project} />
        <span className="project-index" aria-hidden="true">
          0{number}
        </span>
      </div>
      <div className="project-card-copy">
        <div className="project-card-title">
          <h3>{project.title}</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title} website (opens in a new tab)`}
          >
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        </div>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
        <div className="project-card-bottom">
          <ul aria-label="Project topics">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={`Details about ${project.title}`}
            onClick={() =>
              document.dispatchEvent(
                new CustomEvent("openProjectModal", { detail: project }),
              )
            }
          >
            Details <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
