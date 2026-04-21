import { UserPlus, FileEdit, Users, LineChart, Map, TrendingUp } from "lucide-react";
export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock and voice interviews tailored to your role",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },

  {
    title: "Map Your Roadmap",
    description: "Receive a personalized step-by-step career path with curated milestones and learning resources.",
    icon: <Map size={48} />,
  },
  {
    title: "Industrial Insights",
    description: "Stay ahead with real-time data on market trends, salary benchmarks, and in-demand skills.",
    icon: <TrendingUp size={48} />,
  },
];
