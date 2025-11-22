"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../core/Button";
import { apiClient, apiFetcher } from "@/utils/api";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";
import useSWR from "swr";

export default function CompanyHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const { data } = useSWR(`/companies/${searchParams.get("id")}`, apiFetcher);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await apiClient.delete(
          `/companies/${searchParams.get("id")}`,
        );
        console.log(response.data);
        toast.success("Company deleted successfully!");
        // Navigate back
        router.back();
      } catch (error) {
        toast.error("Failed to delete company!");
        console.log(error);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between  md:items-start w-full">
      <div className="w-full md:w-auto">
        <div className="flex justify-between md:justify-start items-center gap-2">
          <Building2 size={30} className="shrink-0" />
          <h1 className="text-lg leading-relaxed">{data?.name}</h1>
          <p className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full ">
            onboarding
          </p>
        </div>
        <div className="mt-1 md:mb-8">
          <p className="text-gray-500 leading-relaxed">
            Part of leadership development program
          </p>
        </div>
      </div>

      <div className="flex md:flex-wrap gap-3 mt-4 mb-6 md:mb-0">
        <Link
          href={`/companies/edit?id=${searchParams.get("id")}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold"
        >
          Edit Company
        </Link>
        <Button
          isLoading={isPending}
          onClick={handleDelete}
          size="sm"
          variant="danger"
        >
          Delete Company
        </Button>
      </div>
    </div>
  );
}
