import { useState } from "react";
import ExperienceItem from "@/components/ui/ExperienceItem";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
  const [showEarlier, setShowEarlier] = useState(false);
  const recentExperiences = experiences.filter(experience => !experience.earlier);
  const earlierExperiences = experiences.filter(experience => experience.earlier);
  return (
    <section id="experience" className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-primary font-mono mb-2">My Journey</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Professional Experience</h2>
          <div className="w-20 h-1 bg-secondary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto timeline-container pl-12">
          {recentExperiences.map((experience, index) => (
            <ExperienceItem 
              key={experience.id}
              experience={experience}
              delay={index * 100 + 100} // 100ms delay increment for each item
            />
          ))}
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="pl-12">
          <button
            type="button"
            className="min-h-11 px-4 py-2 border border-slate-300 rounded-md text-primary hover:bg-slate-50"
            aria-expanded={showEarlier}
            aria-controls="earlier-experience"
            onClick={() => setShowEarlier(value => !value)}
          >
            {showEarlier ? "Hide earlier experience" : "Show earlier experience"}
          </button>
          </div>
          <div id="earlier-experience" hidden={!showEarlier} className="timeline-container pl-12 mt-8">
            {showEarlier && earlierExperiences.map(experience => (
              <ExperienceItem key={experience.id} experience={experience} delay={100} animate={false} />
            ))}
          </div>
          <a
            href="https://www.linkedin.com/in/nicholas-gattuso/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-12 mt-4 inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            View my LinkedIn profile ↗
          </a>
        </div>
      </div>
    </section>
  );
}
