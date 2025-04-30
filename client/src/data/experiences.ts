export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  type: 'work' | 'startup';
}

export const experiences: Experience[] = [
  {
    id: 1,
    role: "Head of Engineering",
    company: "Somethings",
    period: "2020 - Present",
    description: "Lead a team of 25+ engineers building cutting-edge solutions. Responsible for technical direction, architecture decisions, and aligning engineering efforts with business objectives.",
    skills: ["Leadership", "Cloud Architecture", "Strategic Planning", "Team Management", "System Design"],
    type: "work"
  },
  {
    id: 2,
    role: "Senior Software Engineer",
    company: "IBM",
    period: "2017 - 2020",
    description: "Contributed to enterprise-scale cloud solutions, focusing on microservices architecture and DevOps practices. Led several key initiatives resulting in significant performance improvements.",
    skills: ["Microservices", "Kubernetes", "Java/Spring", "Cloud Computing", "DevOps"],
    type: "work"
  },
  {
    id: 3,
    role: "Software Developer",
    company: "Wells Fargo",
    period: "2015 - 2017",
    description: "Developed secure financial applications with a focus on data security and regulatory compliance. Implemented automated testing frameworks that reduced defect rates by 30%.",
    skills: ["Security", "Financial Systems", "Testing", "Compliance", "Java"],
    type: "work"
  },
  {
    id: 4,
    role: "Founder & CTO",
    company: "Tech Startup (Acquired)",
    period: "2013 - 2015",
    description: "Founded and led technical development for a startup that created innovative solutions for the education sector. Successfully acquired after building product and scaling to market.",
    skills: ["Entrepreneurship", "Product Development", "Scaling", "Full-Stack", "Leadership"],
    type: "startup"
  }
];
