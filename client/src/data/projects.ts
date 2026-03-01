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
  featured?: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
  press?: string[];
}

// Featured project - shown prominently at top
export const featuredProject: Project = {
  id: 100,
  title: "Somethings",
  subtitle: "Founding Team, Head of Engineering",
  description: "AI-enabled, HIPAA-compliant teen mental health platform connecting ages 13-26 with Certified Peer Specialist mentors who have lived experience with mental health challenges.",
  challenges: "Building a platform that handles sensitive mental health conversations while ensuring HIPAA compliance, real-time safety screening, and seamless AI-assisted mentor tools required solving complex technical and regulatory challenges.",
  results: "Led engineering through 1,100x user growth. Platform has supported 11,000+ teens across 200+ schools and 250+ community organizations. Achieved 65% reduction in depression and 60% reduction in suicidal ideation among participants.",
  technologies: ["React Native", "TypeScript", "AI/ML", "HIPAA Infrastructure", "Real-time Messaging", "Node.js", "PostgreSQL"],
  categories: ["enterprise", "startup", "ai"],
  url: "https://somethings.com",
  featured: true,
  metrics: [
    { label: "Series A Raised", value: "$19.2M" },
    { label: "Teens Helped", value: "11,000+" },
    { label: "Depression Reduction", value: "65%" },
    { label: "User Growth", value: "1,100x" },
  ],
  press: ["MobiHealthNews", "Yahoo Finance", "Behavioral Health Business", "AlleyWatch", "PR Newswire"]
};

export const projects: Project[] = [
  {
    id: 1,
    title: "kAI",
    subtitle: "Engineer",
    description: "AI engineering agent for enterprise teams. Integrates with Slack to automate bug investigation, diagnose root causes, run tests, and open pull requests autonomously.",
    challenges: "Building an AI system that can understand complex codebases, integrate with multiple developer tools, and produce production-ready code fixes while maintaining security and compliance standards.",
    results: "Platform enables engineering teams to reduce time spent on bug triage by automating investigation, testing, and initial fixes. Deployed in enterprise environments with SOC 2 compliance.",
    technologies: ["Node.js", "TypeScript", "AWS", "Slack API", "GitHub API", "AI/ML", "Datadog"],
    categories: ["enterprise", "ai", "startup"],
    url: "https://joinkai.app"
  },
  {
    id: 2,
    title: "Watchpoint",
    subtitle: "Engineer",
    description: "Application monitoring and tracking platform providing centralized oversight of multiple applications in one unified interface with real-time alerts and analytics.",
    challenges: "Creating a unified monitoring solution that aggregates data from diverse application stacks while providing actionable insights without overwhelming users with noise.",
    results: "Platform enables teams to monitor all their applications from a single dashboard, reducing context switching and improving incident response times.",
    technologies: ["Next.js", "TRPC", "Tailwind CSS", "PostgreSQL", "React", "TypeScript"],
    categories: ["web", "enterprise"],
    url: "https://watchpoint.dev"
  },
  {
    id: 3,
    title: "Life Skills Software",
    subtitle: "Co-Founder",
    description: "Educational video games for students with learning disabilities and special needs, teaching practical life skills like money handling, shopping, and spelling through interactive gameplay.",
    challenges: "Creating engaging educational content that works for students with diverse learning disabilities while ensuring the games remain fun and not patronizing.",
    results: "Won 1st place at UPitchNJ 2019 with $2,000 PNC Bank prize. Platform has helped students with special needs develop essential life skills through gamified learning.",
    technologies: ["Game Development", "Educational Software", "Accessible Design", "JavaScript"],
    categories: ["startup", "web"],
    url: "https://lifeskills.software"
  },
  {
    id: 4,
    title: "What Did You Get Done",
    subtitle: "Creator",
    description: "A productivity tracking application designed to help users track daily accomplishments and boost motivation through achievement visualization and weekly summaries.",
    challenges: "Creating an intuitive interface that encourages daily use without becoming a burden. Implemented minimalist design with smart reminders and quick-entry functionality.",
    results: "75% of active users report higher motivation and better task completion rates. Visual progress tracking helps users maintain consistent daily habits.",
    technologies: ["React", "Firebase", "Tailwind CSS", "Redux", "Node.js"],
    categories: ["web", "startup"],
    url: "https://whatdidyougetdone.netlify.app/"
  },
  {
    id: 5,
    title: "Everybody Polls",
    subtitle: "Creator",
    description: "Real-time polling application enabling users to create, share, and participate in polls with instant results visualization and analytics.",
    challenges: "Real-time data synchronization across thousands of concurrent users. Implemented WebSocket architecture with efficient caching layer.",
    results: "Platform has facilitated over 100,000 polls with more than 1 million votes across businesses and educational institutions.",
    technologies: ["Vue.js", "Node.js", "MongoDB", "Socket.IO", "D3.js"],
    categories: ["web", "startup"],
    url: "https://www.everybodypolls.com/"
  },
  {
    id: 6,
    title: "aCrossMinistry",
    subtitle: "Creator",
    description: "Digital platform for faith-based communities to connect, share resources, and coordinate ministry efforts across different locations and denominations.",
    challenges: "Creating a platform that addresses the diverse needs of different faith communities while maintaining an inclusive and user-friendly interface.",
    results: "Successfully built a platform that serves multiple churches and ministry organizations, facilitating resource sharing and community building.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    categories: ["web", "startup"],
    url: "https://a-crossministry.net"
  }
];
