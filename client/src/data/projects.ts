export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  challenges: string;
  results: string;
  technologies: string[];
  categories: string[];
  url: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "What Did You Get Done",
    subtitle: "Productivity Tracking App",
    description: "A productivity tracking application designed to help users track daily accomplishments and boost motivation through achievement visualization.",
    challenges: "One of the main challenges was creating an intuitive interface that encourages daily use without becoming a burden. We implemented a minimalist design with smart reminders and quick-entry functionality to make tracking accomplishments as frictionless as possible.",
    results: "The application has significantly improved user productivity, with 75% of active users reporting higher motivation and better task completion rates. The visual progress tracking feature has been particularly effective in helping users maintain consistent daily habits.",
    technologies: ["React", "Firebase", "Tailwind CSS", "Redux", "Node.js"],
    categories: ["web", "startup"],
    url: "https://whatdidyougetdone.netlify.app/"
  },
  {
    id: 2,
    title: "Everybody Polls",
    subtitle: "Interactive Polling Platform",
    description: "A real-time polling application enabling users to create, share, and participate in polls with instant results visualization and analytics.",
    challenges: "Real-time data synchronization across thousands of concurrent users was a significant technical challenge. We implemented a WebSocket architecture with an efficient caching layer to ensure instantaneous updates without overloading the server.",
    results: "The platform has facilitated over 100,000 polls with more than 1 million votes. It's been used by organizations ranging from small businesses to educational institutions for gathering instant feedback and making data-driven decisions.",
    technologies: ["Vue.js", "Node.js", "MongoDB", "Socket.IO", "D3.js"],
    categories: ["web", "startup"],
    url: "https://www.everybodypolls.com/"
  },
  {
    id: 3,
    title: "LifeSkills.software",
    subtitle: "Educational Platform",
    description: "A comprehensive platform teaching essential life skills through interactive lessons, practical exercises, and personalized learning paths.",
    challenges: "Creating engaging educational content that adapts to different learning styles while maintaining high retention rates was challenging. We developed an adaptive learning algorithm that personalizes content delivery based on user progress and engagement patterns.",
    results: "The platform has seen impressive user retention, with 82% completion rates for courses (compared to the industry average of 30%). Users report significant improvements in practical life skills, with the financial literacy and communication modules being particularly impactful.",
    technologies: ["Next.js", "GraphQL", "Prisma", "PostgreSQL", "AWS"],
    categories: ["web", "startup"],
    url: "https://lifeskills.software/"
  },
  {
    id: 4,
    title: "Somethings",
    subtitle: "Head of Engineering",
    description: "Led engineering teams in building innovative solutions, establishing technical roadmaps, and implementing scalable architecture for product growth.",
    challenges: "Scaling the technical infrastructure to support rapid user growth while maintaining system reliability and performance was a major challenge. We implemented a microservices architecture with robust monitoring and automated scaling protocols.",
    results: "Successfully led the engineering team through a period of 300% growth, while improving system reliability to 99.99% uptime. Implemented CI/CD pipelines that reduced deployment time by 70% and established a technical mentorship program that improved team retention by 40%.",
    technologies: ["Leadership", "System Design", "Team Building", "Cloud Architecture", "Agile"],
    categories: ["enterprise", "startup"],
    url: "https://somethings.com/"
  }
];
