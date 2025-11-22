// src/app/(dashboard)/page.tsx
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCardsGrid from "@/components/dashboard/StatCardsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentActivities from "@/components/dashboard/RecentActivities";

export default function DashboardPage() {
  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <DashboardHeader />
      <div className="space-y-8">
        <StatCardsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <div>
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
}
