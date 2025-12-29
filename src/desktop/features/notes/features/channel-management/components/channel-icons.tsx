import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Heart,
  Target,
  Users,
} from "lucide-react";

export const channelIcons = {
  general: Sparkles,
  work: Briefcase,
  study: GraduationCap,
  ideas: Lightbulb,
  personal: Heart,
  goals: Target,
  team: Users,
  default: BookOpen,
} as const;

export const getChannelIcon = (channelId: string) => {
  const IconComponent =
    channelIcons[channelId as keyof typeof channelIcons] || channelIcons.default;
  return <IconComponent className="w-4 h-4" />;
};
