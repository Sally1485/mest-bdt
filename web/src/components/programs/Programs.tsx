"use client";
import useSWR from "swr";
import ProgramCard from "./ProgramCard";
import { apiFetcher } from "@/utils/api";
import { Program } from "@/utils/types";

export default function Programs() {
  const { data, isLoading, error } = useSWR("/programs", apiFetcher);

  if (isLoading) {
    return (
      <section>
        <p>Loading all programs...</p>
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
    <section className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
      {data.map((program: Program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </section>
  );
}
