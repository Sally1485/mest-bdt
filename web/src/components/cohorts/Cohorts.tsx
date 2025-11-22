"use client";
import useSWR from "swr";
import { apiFetcher } from "@/utils/api";
import { Cohort } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import CohortCard from "./CohortCard";

export default function Cohorts() {
  const searchParams = useSearchParams();
  const filter = JSON.stringify({ program: searchParams.get("pid") });
  const { data, isLoading, error } = useSWR(
    `/cohorts?filter=${filter}`,
    apiFetcher,
  );

  if (isLoading) {
    return (
      <section>
        <p>Loading all cohorts...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <p>An unexpected error occured...</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full mb-6">
      {data.map((cohort: Cohort) => (
        <CohortCard key={cohort.id} cohort={cohort} />
      ))}
    </section>
  );
}
