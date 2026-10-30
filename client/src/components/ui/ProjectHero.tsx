import type { Project } from "@/data/projects";
import ProjectIcon from "@/components/ui/ProjectIcon";

interface ProjectHeroProps {
  project: Project;
  variant?: "card" | "detail";
}

export default function ProjectHero({ project, variant = "card" }: ProjectHeroProps) {
  const hero = project.hero;
  const paired = hero?.layout === "paired";

  return (
    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-primary/10">
      {hero ? (
        <div className={paired ? "grid h-full grid-cols-2 gap-2 bg-[#f5f3ed] p-3" : "h-full"}>
          {hero.images.map(image => (
            <img
              key={image.src}
              src={image.src}
              srcSet={image.srcSet}
              sizes={variant === "detail" ? "(max-width: 768px) calc(100vw - 64px), 704px" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading={variant === "detail" ? "eager" : "lazy"}
              decoding="async"
              className={`h-full min-h-0 w-full min-w-0 ${paired ? "object-contain" : "object-cover"}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <ProjectIcon name={project.icon} className="h-20 w-20 text-primary/50" />
        </div>
      )}
      {hero?.label && (
        <span className="absolute bottom-3 left-3 rounded bg-black/75 px-2 py-1 text-xs text-white">
          {hero.label}
        </span>
      )}
    </div>
  );
}
