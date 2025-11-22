"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../core/Button";
import { apiClient } from "@/utils/api";
import toast from "react-hot-toast";

export default function CohortHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await apiClient.delete(
          `/cohorts/${searchParams.get("id")}`,
        );
        console.log(response.data);
        toast.success("Program deleted successfully!");
        // Navigate back
        router.back();
      } catch (error) {
        toast.error("Failed to delete program!");
        console.log(error);
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
        Cohort Details
      </h1>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/companies?cid=${searchParams.get("id")}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold"
        >
          View Companies
        </Link>
        <Link
          href={`/cohorts/edit?id=${searchParams.get("id")}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold"
        >
          Edit Cohort
        </Link>
        <Button
          isLoading={isPending}
          onClick={handleDelete}
          size="sm"
          variant="danger"
        >
          Delete Cohort
        </Button>
      </div>
    </div>
  );
}
