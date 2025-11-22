import CohortDetail from "@/components/cohorts/CohortDetail";
import CohortHeader from "@/components/cohorts/CohortHeader";

export default function ViewCohortPage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <CohortHeader />
      <CohortDetail />
    </div>
  );
}
