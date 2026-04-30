import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getResume, getResumeVersions } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import ResumeBuilder from "../_components/resume-builder";

export default async function ResumeBuilderPage() {
  const [resume, versions] = await Promise.all([getResume(), getResumeVersions()]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/resume">
          <Button variant="link" className="pl-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Dashboard
          </Button>
        </Link>
      </div>
      <ResumeBuilder initialData={resume} initialVersions={versions} />
    </div>
  );
}
