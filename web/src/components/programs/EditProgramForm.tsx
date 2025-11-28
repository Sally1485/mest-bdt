"use client";
import SubmitButton from "../core/SubmitButton";
import { apiClient, apiFetcher } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../core/Button";
import toast from "react-hot-toast";
import useSWR from "swr";
import dayjs from "dayjs";

export default function EditProgramForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useSWR(`/programs/${searchParams.get("id")}`, apiFetcher);

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.patch(
        `/programs/${searchParams.get("id")}`,
        {
          name: data.get("name"),
          description: data.get("description"),
          image: "<image link will go here after upload>",
          startDate: data.get("startDate"),
          endDate: data.get("endDate"),
        },
      );
      console.log(response.data);
      toast.success("Program updated successfully!");
      // Navigate back
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update program!");
    }
  };

  return (
    <form
      autoComplete="off"
      action={handleSubmit}
      className="mt-6 bg-white p-4 shadow-lg rounded-lg text-gray-700 border border-gray-300"
    >
      <h1 className=" text-xl md:ml-6  font-bold">Edit Program</h1>
      <p className="mt-2 md:ml-6 text-gray-700 text-sm">
        Update the program information below
      </p>
      <div className=" w-[95%] mx-auto mt-6">
        {/* Basic Information Section */}
        <h2 className="text-sm">Basic Information</h2>
        <div className="space-y-6 mt-4">
          <div className=" flex flex-col justify-between">
            <label htmlFor="" className="text-sm  font-semibold">
              Program Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={data?.name}
              placeholder="e.g., Leadership Development Program"
              className="bg-gray-100 px-2 py-1 rounded-lg text-sm"
              required
            />
          </div>
          <div className=" flex flex-col justify-between">
            <label htmlFor="" className="text-sm font-semibold">
              Description
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="description"
              defaultValue={data?.description}
              placeholder="Provide a detailed description of the program..."
              className="bg-gray-100 px-2 py-3 rounded-lg text-sm"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-200  "></div>

      {/* Scheduling */}
      <div className=" mt-4 w-[95%] mx-auto">
        <h2 className="text-sm">Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          <div className="text-sm flex flex-col justify-between gap-2">
            <label htmlFor="">
              Start Date
              <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              defaultValue={dayjs(data?.startDate).format("YYYY-MM-DD")}
              className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
              required
            />
          </div>
          <div className="text-sm flex flex-col justify-between gap-2">
            <label htmlFor="" className="text-sm">
              End Date
              <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              defaultValue={dayjs(data?.endDate).format("YYYY-MM-DD")}
              className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-200  "></div>

      {/* Insert of Images */}
      <div className="w-[95%] mx-auto mt-4">
        <h2 className="text-sm">Image(Optional)</h2>
        <div>
          <input
            type="file"
            placeholder=" https://example.com/image.jpg"
            className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="mt-10 border border-t-gray-400  "></div>

      {/* Buttons */}
      <div className=" flex  gap-6 w-[95%] mx-auto mt-6 mb-10">
        <SubmitButton title="Update program" />
        <Button type="button" variant="danger" onClick={router.back}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
