import { getCareerDashboardData, getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const [insights, careerData] = await Promise.all([
    getIndustryInsights(),
    getCareerDashboardData(),
  ]);

  return (
    <div>
      <DashboardView insights={insights} careerData={careerData} />
    </div>
  );
}
