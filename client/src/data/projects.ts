export type ProjectCategory = "ai" | "developer-tools" | "platforms";

export type ProjectIconName =
  | "automation" | "legal" | "wedding" | "creative" | "support"
  | "monitoring" | "community" | "analytics" | "education" | "polling";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  tags: string[];
  categories: ProjectCategory[];
  icon: ProjectIconName;
  url: string;
  sourceUrl?: string;
}

export const COLLECT_SOFTWARE_URL = "https://collectsoftware.org/";

// Company portfolio attribution: https://collectsoftware.org/.
// Product descriptions do not imply individual authorship or a specific stack.
export const projects: Project[] = [
  {
    id: "kai",
    title: "kAI",
    subtitle: "AI Infrastructure",
    description: "An AI engineering product that investigates infrastructure issues and proposes fixes through pull requests.",
    // Product features: https://joinkai.app/.
    features: [
      "Brings logs, metrics, code, and other integrations into investigations.",
      "Supports reusable workflows and a Command Center for reviewing work.",
    ],
    tags: ["AI", "Infrastructure", "Developer Tools"],
    categories: ["ai", "developer-tools"],
    icon: "automation",
    url: "https://joinkai.app/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "internicola",
    title: "Internicola Law Firm",
    subtitle: "Franchise Law",
    description: "A national franchise law firm providing counsel, compliance support, and resources for growing franchise businesses.",
    tags: ["Legal", "Franchising"],
    categories: ["platforms"],
    icon: "legal",
    url: "https://www.franchiselawsolutions.com/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "wedded",
    title: "Wedded",
    subtitle: "Wedding Planning",
    description: "AI-assisted wedding venue discovery, matching, outreach, and tour coordination.",
    tags: ["AI", "Wedding Planning"],
    categories: ["ai", "platforms"],
    icon: "wedding",
    url: "https://getwedded.ai/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "persona-ai",
    title: "Persona AI",
    subtitle: "Ad Creative",
    description: "AI market research, buyer personas, and static-ad generation for review and download.",
    tags: ["AI", "Marketing", "Ad Creative"],
    categories: ["ai", "platforms"],
    icon: "creative",
    url: "https://personaapp.ai/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "somethings",
    title: "Somethings",
    subtitle: "Peer Support",
    description: "A platform connecting young people with Certified Peer Specialist Mentors for ongoing one-to-one support.",
    tags: ["Peer Support", "Mentorship"],
    categories: ["platforms"],
    icon: "support",
    url: "https://www.somethings.com/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "watchpoint",
    title: "Watchpoint",
    subtitle: "Application Monitoring",
    description: "A dashboard bringing service health, errors, analytics, and custom metrics together across applications and APIs.",
    // Product features: https://watchpoint.dev/.
    features: [
      "Monitors uptime with HTTP health checks and tracks application errors.",
      "Connects App Store Connect, CloudWatch, Sentry, OneSignal, PostHog, and Sendbird.",
      "Accepts application-specific metrics through a custom metrics API.",
    ],
    tags: ["Developer Tools", "Monitoring", "Analytics"],
    categories: ["developer-tools"],
    icon: "monitoring",
    url: "https://watchpoint.dev/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "3punchconvo",
    title: "3PunchConvo",
    subtitle: "MMA & UFC Community",
    description: "A community for MMA and UFC discussion, analysis, and fan engagement.",
    tags: ["Community", "Sports"],
    categories: ["platforms"],
    icon: "community",
    url: "https://3punchconvo.com/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "modern-ai",
    title: "Modern.ai",
    subtitle: "Commerce Analytics",
    description: "Commerce reporting and AI-powered insights that bring data from sales channels and business tools together.",
    // Product positioning: https://www.modern.ai/.
    features: [
      "Unifies reporting across ecommerce, marketplace, advertising, and other business data.",
      "Provides structured data for dashboards and AI workflows.",
    ],
    tags: ["AI", "Commerce", "Analytics"],
    categories: ["ai", "platforms"],
    icon: "analytics",
    url: "https://modern.ai/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "life-skills-software",
    title: "Life Skills Software",
    subtitle: "Educational Games",
    description: "Educational web games for K–12 special-needs students, covering academic, social, and transitional life skills.",
    tags: ["Education", "Web Games"],
    categories: ["platforms"],
    icon: "education",
    url: "https://lifeskills.software/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
  {
    id: "everybody-polls",
    title: "Everybody Polls",
    subtitle: "Political Polling",
    description: "A mobile political polling app with issue voting, demographic insights, and predictions.",
    tags: ["Polling", "Mobile"],
    categories: ["platforms"],
    icon: "polling",
    url: "https://everybodypolls.com/",
    sourceUrl: COLLECT_SOFTWARE_URL,
  },
];
