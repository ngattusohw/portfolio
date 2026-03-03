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
    role: "Founding Team, Head of Engineering",
    company: "Somethings",
    period: "2024 - Present",
    description: "Building the greatest team in mental health tech. Leading onshore and offshore teams to build HIPAA and SOC2 compliant web & mobile applications. Working across product, sales and clinical operations to create industry-leading solutions.",
    skills: ["Leadership", "React Native", "HIPAA Compliance", "Team Management", "System Design"],
    type: "work"
  },
  {
    id: 2,
    role: "Lead Software Engineer, Vice President",
    company: "Wells Fargo",
    period: "2024 - 2025",
    description: "Transformed the customer service agent interface by adopting a Microfrontend strategy, significantly improving scalability and maintainability. Coordinated across three scrum teams to ensure on-time delivery affecting 80,000 customer support agents.",
    skills: ["Microfrontends", "React", "Team Coordination", "Enterprise Architecture", "Agile"],
    type: "work"
  },
  {
    id: 3,
    role: "Senior Software Engineer",
    company: "IBM",
    period: "2020 - 2024",
    description: "Recruited to Center of Excellence to lead strategic initiatives. Coordinated Jaeger Tracing implementation across 250+ streaming microservices. Architected Stateful Set Kubernetes workloads and created training courses in Spring and Kafka.",
    skills: ["Java", "Kubernetes", "Kafka", "Spring", "Microservices"],
    type: "work"
  },
  {
    id: 4,
    role: "Co-Founder, Head of Engineering",
    company: "Mira Therapeutics",
    period: "2017 - 2023",
    description: "Cofounded digital health company changing how people recover from trauma. Led offshore and onshore teams to build HIPAA compliant applications through seed funding, supporting over 15,000 users. Won Best Pitch at NJEN 2018.",
    skills: ["React Native", "Firebase", "HIPAA", "Startup", "Team Leadership"],
    type: "startup"
  },
  {
    id: 5,
    role: "Co-Founder, President",
    company: "Life Skills Software",
    period: "2016 - Present",
    description: "Stevens Venture Center company bringing special needs classrooms into the 21st century. Lead team of game programmers and developers building transitional games and simulations for students with multiple disabilities.",
    skills: ["Game Development", "Education Tech", "Entrepreneurship", "Full-Stack", "Leadership"],
    type: "startup"
  }
];
