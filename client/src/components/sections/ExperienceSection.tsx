import ExperienceItem from "@/components/ui/ExperienceItem";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono mb-2">My Journey</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Professional Experience</h2>
          <div className="w-20 h-1 bg-secondary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto timeline-container pl-12">
          {experiences.map((experience, index) => (
            <ExperienceItem 
              key={experience.id}
              experience={experience}
              delay={index * 100 + 100} // 100ms delay increment for each item
            />
          ))}
        </div>
      </div>
    </section>
  );
}
