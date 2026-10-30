import {
  Activity, BarChart3, Bot, Brain, GraduationCap, Heart, MessagesSquare,
  Palette, Scale, Users,
} from "lucide-react";
import type { ProjectIconName } from "@/data/projects";

const icons = {
  automation: Bot,
  legal: Scale,
  wedding: Heart,
  creative: Palette,
  support: MessagesSquare,
  monitoring: Activity,
  community: Users,
  analytics: BarChart3,
  education: GraduationCap,
  memory: Brain,
} satisfies Record<ProjectIconName, typeof Activity>;

export default function ProjectIcon({
  name,
  className,
}: {
  name: ProjectIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />;
}
