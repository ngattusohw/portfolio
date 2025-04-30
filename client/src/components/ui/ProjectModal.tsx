import { useEffect, useState } from "react";
import { Project } from "@/data/projects";

export default function ProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Add event listener for opening the modal
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<Project>;
      setProject(customEvent.detail);
      setIsOpen(true);
    };

    document.addEventListener('openProjectModal', handleOpenModal);

    // Cleanup
    return () => {
      document.removeEventListener('openProjectModal', handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <button 
            className="text-slate-400 hover:text-slate-600"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="w-full h-64 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-32 w-32 text-primary/30" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {project.id === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />}
              {project.id === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />}
              {project.id === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
              {project.id === 4 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}
            </svg>
          </div>
          <h4 className="text-xl font-bold mb-3">Project Overview</h4>
          <p className="text-slate-700 mb-6">{project.description}</p>
          
          <h4 className="text-xl font-bold mb-3">Challenges & Solutions</h4>
          <p className="text-slate-700 mb-6">
            {project.challenges}
          </p>
          
          <h4 className="text-xl font-bold mb-3">Technologies Used</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-2 bg-slate-100 text-slate-700 rounded">
                {tech}
              </span>
            ))}
          </div>
          
          <h4 className="text-xl font-bold mb-3">Results & Impact</h4>
          <p className="text-slate-700">
            {project.results}
          </p>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button 
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md mr-3"
            onClick={handleClose}
          >
            Close
          </button>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
}
