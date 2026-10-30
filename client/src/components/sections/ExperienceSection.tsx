import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import ExperienceItem from "@/components/ui/ExperienceItem";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
  const [showEarlier, setShowEarlier] = useState(false);
  const recent = experiences.filter((e) => !e.earlier);
  const earlier = experiences.filter((e) => e.earlier);
  return (
    <section
      id="experience"
      className="folio-section experience-section"
      aria-labelledby="experience-title"
    >
      <div className="folio-container experience-grid">
        <div className="experience-heading">
          <p className="folio-kicker">III / Experience</p>
          <h2 id="experience-title">
            A few chapters
            <br />
            <em>so far.</em>
          </h2>
          <p>From enterprise systems to companies built from the ground up.</p>
          <a
            className="folio-text-link"
            href="https://www.linkedin.com/in/nicholas-gattuso/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="experience-list">
          {recent.map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              defaultOpen={index < 2}
            />
          ))}
          <div id="earlier-experience" hidden={!showEarlier}>
            {showEarlier &&
              earlier.map((experience) => (
                <ExperienceItem key={experience.id} experience={experience} />
              ))}
          </div>
          <button
            className="experience-expand"
            type="button"
            aria-expanded={showEarlier}
            aria-controls="earlier-experience"
            onClick={() => setShowEarlier((v) => !v)}
          >
            {showEarlier
              ? "Hide earlier experience"
              : "Show earlier experience"}
            <span>{earlier.length} roles</span>
            {showEarlier ? (
              <Minus size={17} aria-hidden="true" />
            ) : (
              <Plus size={17} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
