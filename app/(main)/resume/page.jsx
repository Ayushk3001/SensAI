import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  // Fetch existing resume data from the database
  const resume = await getResume();

  return (
    <div className="container mx-auto py-10">
      <ResumeBuilder initialData={resume} />
    </div>
  );
}