import { Experience } from "@/data/experiences";

interface ExperienceItemProps {
  experience: Experience;
  delay: number;
}

export default function ExperienceItem({ experience, delay }: ExperienceItemProps) {
  const delayClass = `delay-${delay}`;
  
  return (
    <div className={`mb-12 relative animate-slide-up opacity-0 ${delayClass}`}>
      <div className="absolute left-[-40px] w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
        {experience.type === 'work' ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${experience.type === 'startup' ? 'border-secondary' : 'border-primary'}`}>
        <div className="flex flex-wrap justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{experience.role}</h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{experience.period}</span>
        </div>
        <p className="text-lg text-primary mb-2">{experience.company}</p>
        <p className="text-slate-700 mb-4">
          {experience.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
