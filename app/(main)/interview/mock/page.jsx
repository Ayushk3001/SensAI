import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/interview">
          <Button variant="link" className="pl-0 text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Hub
          </Button>
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-6xl font-bold tracking-tighter text-foreground">
          Mock Interview
        </h1>
        <p className="text-xl text-muted-foreground mt-3">
          Sharpen your skills with AI-generated technical questions
        </p>
      </div>

      <Quiz />
    </div>
  );
}
