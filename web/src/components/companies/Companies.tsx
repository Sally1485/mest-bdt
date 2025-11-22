"use client";
import useSWR from "swr";
import CompanyCard from "./CompanyCard";
import { apiFetcher } from "@/utils/api";
import { Company } from "@/utils/types";
import { useSearchParams } from "next/navigation";

export default function Companies() {
  const searchParams = useSearchParams();
  const filter = JSON.stringify({ cohort: searchParams.get("cid") });
  const { data, isLoading, error } = useSWR(
    `/companies?filter=${filter}`,
    apiFetcher,
  );

  if (isLoading) {
    return (
      <section>
        <p>Loading all companies...</p>
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
    <section className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {data.map((company: Company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </section>
  );
}
