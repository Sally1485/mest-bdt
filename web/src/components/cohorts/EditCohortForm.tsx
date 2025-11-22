"use client";
import SubmitButton from "../core/SubmitButton";
import { apiClient, apiFetcher } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../core/Button";
import toast from "react-hot-toast";
import useSWR from "swr";
import dayjs from "dayjs";

export default function EditCohortForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useSWR(`/cohorts/${searchParams.get("id")}`, apiFetcher);

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.patch(
        `/cohorts/${searchParams.get("id")}`,
        {
          name: data.get("name"),
          description: data.get("description"),
          image: "<image link will go here after upload>",
          startDate: data.get("startDate"),
          endDate: data.get("endDate"),
        },
      );
      console.log(response.data);
      toast.success("Cohort updated successfully!");
      // Navigate back
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update cohort!");
    }
  };

  return (
    <form
      autoComplete="off"
      action={handleSubmit}
      className="mt-6 bg-white p-4 sm:p-6 shadow-lg rounded-lg text-black"
    >
      <h1 className="text-xl font-bold text-center sm:text-left">
        Edit Cohort
      </h1>
      <p className="mt-2 text-gray-700 text-sm text-center sm:text-left">
        Update cohort information by filling this form
      </p>
      <div className="w-full mx-auto mt-6">
        <div className="space-y-6 mt-4">
          {/* Cohort Name */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-semibold">
              Cohort Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={data?.name}
              placeholder="e.g., 2025 Spring Cohort"
              className="bg-gray-200 px-2 py-3 rounded-lg text-sm border border-gray-400"
            />
          </div>
          {/* Cohort Description */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-semibold">
              Cohort Description
              <span className="text-red-700">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={data?.description}
              placeholder="Provide a detailed description of the cohort..."
              className="bg-gray-100 px-2 py-3 rounded-lg text-sm border border-gray-400"
              rows={5}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col w-[45%]">
              <label className="text-sm text-gray-700 font-semibold">
                Start Date
                <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                defaultValue={dayjs(data?.startDate).format("YYYY-MM-DD")}
                className="bg-gray-200 px-2 py-3 rounded-lg text-sm border border-gray-400"
              />
            </div>
            <div className="flex flex-col w-[45%]">
              <label className="text-sm text-gray-700 font-semibold">
                End Date
                <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                defaultValue={dayjs(data?.endDate).format("YYYY-MM-DD")}
                className="bg-gray-200 px-2 py-3 rounded-lg text-sm border border-gray-400"
              />
            </div>
          </div>
          {/* Upload Image */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 font-semibold">
              Upload Image
              <span className="text-gray-400 ml-1">(Optional)</span>
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="bg-gray-100 px-2 py-3 rounded-lg text-sm  border border-gray-400"
            />
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <SubmitButton title="Edit Cohort" />
            <Button type="button" variant="danger" onClick={router.back}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
