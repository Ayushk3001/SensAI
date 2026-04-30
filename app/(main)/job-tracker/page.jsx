import { getJobTrackerData } from "@/actions/job-tracker";
import JobTracker from "./_components/job-tracker";

export default async function JobTrackerPage() {
  const data = await getJobTrackerData();

  return (
    <div className="px-5">
      <JobTracker
        initialApplications={data.applications}
        resumeVersions={data.resumeVersions}
        coverLetters={data.coverLetters}
      />
    </div>
  );
}
