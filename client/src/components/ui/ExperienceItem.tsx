import { Plus } from "lucide-react";
import type { Experience } from "@/data/experiences";

export default function ExperienceItem({
  experience,
  defaultOpen = false,
}: {
  experience: Experience;
  defaultOpen?: boolean;
}) {
  return (
    <details className="experience-row" open={defaultOpen || undefined}>
      <summary>
        <div className="experience-row-title">
          <span className="experience-period">{experience.period}</span>
          <h3>{experience.company}</h3>
          <p>{experience.role}</p>
        </div>
        <Plus className="experience-toggle" size={18} aria-hidden="true" />
      </summary>
      <div className="experience-details">
        {experience.arrangement && (
          <p className="experience-arrangement">{experience.arrangement}</p>
        )}
        <p>{experience.description}</p>
        <ul aria-label="Skills">
          {experience.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        {experience.companyUrl && (
          <a
            href={experience.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Company website ↗
          </a>
        )}
      </div>
    </details>
  );
}
