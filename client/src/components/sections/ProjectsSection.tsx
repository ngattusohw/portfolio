import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import {
  COLLECT_SOFTWARE_URL,
  projects,
  type ProjectCategory,
} from "@/data/projects";

const filters: { value: "all" | ProjectCategory; label: string }[] = [
  { value: "all", label: "All projects" },
  { value: "ai", label: "AI" },
  { value: "developer-tools", label: "Developer tools" },
  { value: "platforms", label: "Platforms & sites" },
];
const featuredIds = ["kai", "recollect-ai", "somethings", "watchpoint"];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | ProjectCategory>(
    "all",
  );
  const matches = projects.filter(
    (project) =>
      activeFilter === "all" || project.categories.includes(activeFilter),
  );
  const featured = featuredIds.flatMap((id) =>
    matches.filter((project) => project.id === id),
  );
  const more = matches.filter((project) => !featuredIds.includes(project.id));
  return (
    <section
      id="projects"
      className="folio-section work-section"
      aria-labelledby="work-title"
    >
      <div className="folio-container">
        <div className="section-heading">
          <div>
            <p className="folio-kicker">I / Selected work</p>
            <h2 id="work-title">
              Ideas, <em>made real.</em>
            </h2>
          </div>
          <p>
            Selected products and client work across AI, developer tools, and
            digital platforms.{" "}
            <a
              href={COLLECT_SOFTWARE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Collect Software{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </p>
        </div>
        <div className="work-filters" role="group" aria-label="Filter projects">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
              <span aria-hidden="true">
                {filter.value === "all"
                  ? projects.length
                  : projects.filter((p) =>
                      p.categories.includes(filter.value as ProjectCategory),
                    ).length}
              </span>
            </button>
          ))}
        </div>
        <div className="featured-grid">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              number={index + 1}
            />
          ))}
        </div>
        {more.length > 0 && (
          <div className="more-work">
            <p className="folio-kicker">Also in the collection</p>
            <div>
              {more.map((project) => (
                <article key={project.id} className="project-row">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.subtitle}</p>
                  </div>
                  <span className="project-row-category">
                    {project.tags[0]}
                  </span>
                  <div className="project-row-actions">
                    <button
                      type="button"
                      aria-label={`Details about ${project.title}`}
                      onClick={() =>
                        document.dispatchEvent(
                          new CustomEvent("openProjectModal", {
                            detail: project,
                          }),
                        )
                      }
                    >
                      Details <Plus size={16} aria-hidden="true" />
                    </button>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title} website (opens in a new tab)`}
                    >
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        <p className="work-count" aria-live="polite">
          Showing {matches.length}{" "}
          {matches.length === 1 ? "project" : "projects"}
        </p>
      </div>
    </section>
  );
}
