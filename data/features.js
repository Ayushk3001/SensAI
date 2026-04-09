import { BrainCircuit, Briefcase, LineChart, ScrollText, Mic, Map } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights tailored to your industry and experience level.",
  },
  {
    icon: <Mic className="w-10 h-10 mb-4 text-primary" />,
    title: "Live AI Voice Interviews",
    description:
      "Practice Technical, HR, Aptitude, and Managerial rounds with a real-time AI voice interviewer that adapts to your answers.",
  },
  {
    icon: <Map className="w-10 h-10 mb-4 text-primary" />,
    title: "Custom Learning Roadmaps",
    description:
      "Generate step-by-step, personalized learning paths and milestones to achieve your specific career goals.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes that highlight your skills and get you past the screening bots.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Cover Letter Generator",
    description: "Instantly draft compelling cover letters perfectly tailored to the job description you are applying for.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Performance Analytics",
    description: "Track your interview scores, identify weak points, and watch your communication skills improve over time.",
  }
];