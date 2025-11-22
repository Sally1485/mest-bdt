// src/components/dashboard/StatCardsGrid.tsx
"use client";
import useSWR from "swr";
import StatCard from "./StatCard";
import { Briefcase, Building2, Calendar, Users } from "lucide-react";
import { apiFetcher } from "@/utils/api";

const StatCardsGrid = () => {
  const { data: totalPrograms } = useSWR("/programs/count", apiFetcher);
  const { data: totalCohorts } = useSWR("/cohorts/count", apiFetcher);
  const { data: activePrograms } = useSWR("/programs/count", apiFetcher);
  const { data: upcomingCohorts } = useSWR("/cohorts/count", apiFetcher);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Total Programs"
        value={totalPrograms || 0}
        change="+8%"
        changeType="increase"
        icon={Briefcase}
      />
      <StatCard
        title="Total Cohorts"
        value={totalCohorts || 0}
        change="+5%"
        changeType="increase"
        icon={Users}
      />
      <StatCard
        title="Active Programs"
        value={activePrograms || 0}
        change="Pending"
        changeType="pending"
        icon={Calendar}
      />
      <StatCard
        title="Upcoming Cohorts"
        value={upcomingCohorts || 0}
        change="+2%"
        changeType="increase"
        icon={Building2}
      />
    </div>
  );
};

export default StatCardsGrid;
