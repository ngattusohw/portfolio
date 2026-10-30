import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectIcon from "@/components/ui/ProjectIcon";

export default function ProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Add event listener for opening the modal
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<Project>;
      triggerRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setProject(customEvent.detail);
      setIsOpen(true);
    };

    document.addEventListener('openProjectModal', handleOpenModal);

    // Cleanup
    return () => {
      document.removeEventListener('openProjectModal', handleOpenModal);
    };
  }, []);

  if (!project) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <DialogPrimitive.Content
            ref={dialogRef}
            tabIndex={-1}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto overscroll-contain"
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              dialogRef.current?.focus({ preventScroll: true });
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus({ preventScroll: true });
            }}
          >
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center gap-3">
              <DialogPrimitive.Title asChild>
                <h3 className="min-w-0 break-words text-xl sm:text-2xl font-bold">{project.title}</h3>
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center text-slate-400 hover:text-slate-600"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
            </div>
            <div className="p-4 sm:p-6 break-words">
              <div className="w-full h-32 sm:h-40 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                <ProjectIcon name={project.icon} className="h-20 w-20 text-primary/50" />
              </div>
              <p className="text-primary font-medium mb-3">{project.subtitle}</p>
              <p className="text-slate-700 mb-6">{project.description}</p>
              {project.features && project.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3">Product Features</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {project.features.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                </div>
              )}
              <ul className="flex flex-wrap gap-2 mb-6" aria-label="Project topics">
                {project.tags.map(tag => (
                  <li key={tag} className="px-3 py-2 bg-slate-100 text-slate-700 rounded">
                    {tag}
                  </li>
                ))}
              </ul>
              {project.sourceUrl && (
                <p className="text-sm text-slate-600">
                  Listed in{" "}
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    Collect Software’s portfolio
                  </a>.
                </p>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-200 flex flex-wrap justify-end gap-3">
              <DialogPrimitive.Close asChild>
                <button
                  className="min-h-11 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md"
                >
                  Close
                </button>
              </DialogPrimitive.Close>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title} website (opens in a new tab)`}
                className="inline-flex min-h-11 items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
              >
                Visit Site
              </a>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
