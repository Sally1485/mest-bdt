"use client";
import { Plus } from "lucide-react";
import SubmitButton from "../core/SubmitButton";
import { apiClient } from "@/utils/api";
import { useRouter } from "next/navigation";
import Button from "../core/Button";
import toast from "react-hot-toast";

export default function AddProgramForm() {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.post("/programs", {
        name: data.get("name"),
        description: data.get("description"),
        image: "<image link will go here after upload>",
        startDate: data.get("startDate"),
        endDate: data.get("endDate"),
      });
      console.log(response.data);
      toast.success("Program added successfully!");
      // Navigate back
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add program!");
    }
  };

  return (
    <form
      autoComplete="off"
      action={handleSubmit}
      className="mt-6 bg-white p-4 shadow-lg rounded-lg text-black"
    >
      <h1 className=" text-xl md:ml-6  font-bold">Add New Program</h1>
      <p className="mt-2 md:ml-6 text-gray-700 text-sm">
        Create a new cohort program by filling out the information below
      </p>
      <div className=" w-[95%] mx-auto mt-6">
        {/* Basic Information Section */}
        <h2 className="text-sm">Basic Information</h2>
        <div className="space-y-6 mt-4">
          <div className=" flex flex-col justify-between">
            <label htmlFor="" className="text-sm text-gray-700 font-semibold">
              Program Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Leadership Development Program"
              className="bg-gray-100 px-2 py-1 rounded-lg text-sm"
            />
          </div>
          <div className=" flex flex-col justify-between">
            <label htmlFor="" className="text-sm text-gray-700 font-semibold">
              Description
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="description"
              placeholder="Provide a detailed description of the program..."
              className="bg-gray-100 px-2 py-3 rounded-lg text-sm"
            />
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2  gap-8">
            <div className=" flex flex-col justify-between">
              <label
                htmlFor=""
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Cohort
                <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 2025 cohort spring"
                className="bg-gray-100 px-2 py-1 rounded-lg text-sm w-full"
              />
            </div>
            <div className=" flex flex-col w-full ">
              <label
                htmlFor=""
                className=" block text-sm font-semibold text-gray-700 mb-1"
              >
                Status
                <span className="text-red-700">*</span>
              </label>
              <select
                name=""
                className="md:w-full text-sm text-gray-700 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-base"
              >
                <option value="">upcoming</option>
                <option value="">active</option>
                <option value="">complete</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 border border-t-gray-400  "></div>

      {/* Scheduling of participants */}
      <div className=" mt-4 w-[95%] mx-auto">
        <h2 className="text-sm">Schedule & Participants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          <div className="text-sm flex flex-col justify-between gap-2">
            <label htmlFor="">
              Start Date
              <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
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
              className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
            />
          </div>
          <div className="text-sm flex flex-col justify-between gap-2">
            <label htmlFor="">
              Number of Participants
              <span className="text-red-700">*</span>
            </label>
            <input
              type="number"
              name=""
              className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
            />
          </div>
        </div>
      </div>
      <div className="mt-10 border border-t-gray-400  "></div>

      {/* Programs objectives */}
      <div className=" mt-4 w-[95%] mx-auto text-black ">
        <h2 className="text-sm">Program Objectives</h2>
        <div className="mt-2 flex justify-between gap-4 ">
          <input
            type="text"
            placeholder="Add a program objective..."
            className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex gap-2 border px-3 py-1 rounded-lg items-center bg-white  cursor-pointer">
            <span>
              <Plus />
            </span>
            <span>Add</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Please Enter or Click Add to include an objective
        </p>
      </div>
      <div className="mt-10 border border-t-gray-400  "></div>

      {/* Insert of Images */}
      <div className="w-[95%] mx-auto mt-4">
        <h2 className="text-sm">Image(Optional)</h2>
        <div>
          <input
            type="file"
            placeholder=" https://example.com/image.jpg"
            className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-10 border border-t-gray-400  "></div>

      {/* Buttons */}
      <div className=" flex  gap-6 w-[95%] mx-auto mt-6 mb-10">
        <SubmitButton title="Create program" />
        <Button type="button" variant="danger" onClick={router.back}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
