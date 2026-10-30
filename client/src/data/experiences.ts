export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  arrangement?: string;
  description: string;
  skills: string[];
  type: 'work' | 'startup';
  companyUrl?: string;
  earlier?: boolean;
}

// Titles, monthly dates, and responsibilities checked against the owner's LinkedIn:
// https://www.linkedin.com/in/nicholas-gattuso/details/experience/
// Collect presidency is owner-confirmed; its start date has not been supplied.
// Concurrent roles and promotions are intentionally kept as separate entries.
export const experiences: Experience[] = [
  {
    "id": 1,
    "role": "President",
    "company": "Collect Software",
    "period": "Present",
    "description": "Lead Collect Software, building custom web, mobile, and enterprise software, integrating AI into business workflows, and providing senior technical consulting.",
    "skills": [
      "Software Development",
      "AI Integration",
      "Technical Consulting"
    ],
    "type": "startup",
    "companyUrl": "https://collectsoftware.org/"
  },
  {
    "id": 2,
    "role": "Founding Team, Head of Engineering",
    "company": "Somethings",
    "period": "Sep 2024 – Present",
    "arrangement": "Full-time",
    "description": "Lead onshore and offshore engineering teams building web and mobile applications for youth mental health support. Work across product, sales, and clinical operations to develop the platform and support the business.",
    "skills": [
      "Engineering Leadership",
      "Web & Mobile",
      "Cross-functional Delivery"
    ],
    "type": "work",
    "companyUrl": "https://www.somethings.com/"
  },
  {
    "id": 3,
    "role": "Co-Founder / President / Full Stack Developer",
    "company": "Life Skills Software",
    "period": "Dec 2016 – Dec 2025",
    "arrangement": "Self-employed",
    "description": "Co-founded a Stevens Venture Center company developing educational games and simulations for students with multiple disabilities. Led game programmers and full-stack developers building tools for special-needs classrooms.",
    "skills": [
      "Entrepreneurship",
      "Full-Stack Development",
      "Educational Games"
    ],
    "type": "startup",
    "companyUrl": "https://lifeskills.software/"
  },
  {
    "id": 4,
    "role": "Lead Software Engineer, Vice President",
    "company": "Wells Fargo",
    "period": "Sep 2024 – May 2025",
    "description": "Led a microfrontend migration of the customer-service agent interface. Coordinated delivery across three scrum teams for a platform serving 80,000 customer support agents.",
    "skills": [
      "Microfrontends",
      "Engineering Leadership",
      "Delivery Coordination"
    ],
    "type": "work"
  },
  {
    "id": 5,
    "role": "Fractional Head of Engineering",
    "company": "Somethings",
    "period": "Aug 2023 – Sep 2024",
    "arrangement": "Part-time",
    "description": "Served as fractional Head of Engineering before joining the founding team full-time in September 2024.",
    "skills": [
      "Engineering Leadership"
    ],
    "type": "work",
    "companyUrl": "https://www.somethings.com/"
  },
  {
    "id": 6,
    "role": "Senior Software Engineer, GBS (ES & iX)",
    "company": "IBM",
    "period": "Jul 2022 – Sep 2024",
    "arrangement": "Full-time",
    "description": "Joined the Center of Excellence to improve stability, maintainability, and triage. Coordinated Jaeger tracing across 250+ streaming microservices, designed a Kubernetes StatefulSet proof of concept, built internal tools, and taught Spring and Kafka to new hires.",
    "skills": [
      "Java",
      "Kubernetes",
      "Jaeger",
      "Spring",
      "Kafka"
    ],
    "type": "work"
  },
  {
    "id": 7,
    "role": "Co-Founder / President / Head of Engineering",
    "company": "Mira Therapeutics",
    "period": "May 2017 – Feb 2023",
    "arrangement": "Self-employed",
    "description": "Co-founded the digital health company and owned mobile and web development through a seed funding round, supporting over 15,000 users. Led onshore and offshore teams building symptom-tracking, self-management, and therapist tools for trauma care.",
    "skills": [
      "Entrepreneurship",
      "Mobile & Web Development",
      "Team Leadership",
      "Firebase"
    ],
    "type": "startup"
  },
  {
    "id": 8,
    "role": "Associate Developer, GBS (ES & iX)",
    "company": "IBM",
    "period": "Jul 2020 – Jul 2022",
    "arrangement": "Full-time",
    "description": "Worked in Digital Strategy & Interactive Experience within financial services before progressing to Senior Software Engineer.",
    "skills": [
      "Software Development",
      "Financial Services"
    ],
    "type": "work"
  },
  {
    "id": 9,
    "role": "Teaching Assistant for CS423 (Senior Design)",
    "company": "Stevens Institute of Technology",
    "period": "Aug 2019 – Dec 2019",
    "arrangement": "Part-time",
    "description": "Teaching assistant for the Computer Science Senior Design course.",
    "skills": [
      "Computer Science",
      "Teaching"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 10,
    "role": "Extreme Blue Technical Intern",
    "company": "IBM",
    "period": "May 2019 – Aug 2019",
    "arrangement": "Internship",
    "description": "Applied machine learning to proactive server-support data. Built prediction and alert-timeline modules for a React and Node.js dashboard, using Python, the ELK stack, and Watson Studio for analysis.",
    "skills": [
      "Python",
      "React",
      "Node.js",
      "Machine Learning",
      "ELK"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 11,
    "role": "Head of Asset Allocation",
    "company": "Stevens Student Managed Investment Fund",
    "period": "Dec 2018 – May 2019",
    "arrangement": "Part-time",
    "description": "Led asset allocation for the student-managed portion of the university endowment, reporting on the fund's work and performance to university leadership.",
    "skills": [
      "Asset Allocation",
      "Investment Research"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 12,
    "role": "Quantitative Analyst / Programming Consultant",
    "company": "Stevens Student Managed Investment Fund",
    "period": "Aug 2018 – Dec 2018",
    "description": "Introduced Git, branching, and Agile practices to the quantitative team. Refactored code, worked on moving CSV data into MySQL, and used R-based risk screening to evaluate investment ideas and monitor portfolio risk.",
    "skills": [
      "R",
      "MySQL",
      "Git",
      "Agile",
      "Risk Analysis"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 13,
    "role": "Software Development Intern",
    "company": "iCIMS",
    "period": "Jan 2018 – Aug 2018",
    "arrangement": "Internship",
    "description": "Researched and refactored the codebase for a Hibernate ORM upgrade. Also developed a browser extension to help test engineers distinguish test portals from customer production sites.",
    "skills": [
      "Java",
      "Gradle",
      "Hibernate",
      "JavaScript"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 14,
    "role": "Software Development Intern",
    "company": "iCIMS",
    "period": "Jun 2017 – Aug 2017",
    "arrangement": "Internship",
    "description": "Built BranchToolGit to check Jira patch-week tickets against Bitbucket test and patch branches. Used React, Node.js, PostgreSQL, Jira and Bitbucket APIs, and Docker.",
    "skills": [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "API Integration"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 15,
    "role": "Software Engineering Intern",
    "company": "Yashi",
    "period": "Jun 2016 – Aug 2016",
    "arrangement": "Internship",
    "description": "Worked with engineers and fellow interns on an RFP generator, an iOS and Android conference-room scheduler, and updates to a weather-targeting database.",
    "skills": [
      "PHP",
      "JavaScript",
      "Java",
      "Swift",
      "MongoDB",
      "Python"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 16,
    "role": "Software Engineering Intern",
    "company": "Yashi",
    "period": "Jun 2015 – Sep 2015",
    "arrangement": "Internship",
    "description": "Developed a Python data-collection script with a fellow intern, a Java interface, and a PostgreSQL database to support developer outreach and track contact status.",
    "skills": [
      "Python",
      "Java",
      "PostgreSQL"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 17,
    "role": "Software Developer / Research Scientist",
    "company": "Monmouth University",
    "period": "Jun 2015 – Aug 2015",
    "arrangement": "Internship",
    "description": "Led the ThingMagic software team during a summer research program and contributed to database and front-end work. Built real-time RFID tracking with Java, the ThingMagic API, MongoDB, and a web map.",
    "skills": [
      "Java",
      "RFID",
      "MongoDB",
      "Node.js"
    ],
    "type": "work",
    "earlier": true
  },
  {
    "id": 18,
    "role": "Software Developer / Research Scientist",
    "company": "Monmouth University",
    "period": "Jun 2014 – Aug 2014",
    "arrangement": "Internship",
    "description": "Researched and built a Java desktop gradebook for professors during the university's summer research program.",
    "skills": [
      "Java",
      "Research",
      "Desktop Applications"
    ],
    "type": "work",
    "earlier": true
  }
];
