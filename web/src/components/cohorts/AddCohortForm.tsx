"use client";
import SubmitButton from "../core/SubmitButton";
import { apiClient } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../core/Button";
import toast from "react-hot-toast";

export default function AddCohortForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.post("/cohorts", {
        program: searchParams.get("pid"),
        name: data.get("name"),
        description: data.get("description"),
        image: "<image link will go here after upload>",
        startDate: data.get("startDate"),
        endDate: data.get("endDate"),
      });
      console.log(response.data);
      toast.success("Cohort added successfully!");
      // Navigate back
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add cohort!");
    }
  };

  return (
    <form
      autoComplete="off"
      action={handleSubmit}
      className="mt-6 bg-white p-4 sm:p-6 shadow-lg rounded-lg text-black"
    >
      <h1 className="text-xl font-bold text-center sm:text-left">
        Add New Cohort
      </h1>
      <p className="mt-2 text-gray-700 text-sm text-center sm:text-left">
        Create a new cohort by filling out the information below
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
            <SubmitButton title="Create Cohort" />
            <Button type="button" variant="danger" onClick={router.back}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
