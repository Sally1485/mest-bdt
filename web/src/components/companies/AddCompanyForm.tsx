"use client";
import SubmitButton from "../core/SubmitButton";
import { apiClient } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../core/Button";
import toast from "react-hot-toast";

export default function AddCompanyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await apiClient.post("/companies", {
        cohort: searchParams.get("cid"),
        name: data.get("name"),
      });
      console.log(response.data);
      toast.success("Company added successfully!");
      // Navigate back
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add company!");
    }
  };

  return (
    <form
      autoComplete="off"
      action={handleSubmit}
      className="mt-6 bg-white p-4 shadow-lg rounded-lg border border-gray-200 text-gray-800"
    >
      <h1 className=" text-xl md:ml-6  font-bold">Add Company</h1>
      <p className="mt-2 md:ml-6 text-gray-700 text-sm">
        Add a company information for Leadership Development Program
      </p>
      {/* Basic information details */}
      <div className=" w-[95%] mx-auto mt-6">
        {/* <h2 className="text-sm">Basic Information</h2> */}
        <div className="space-y-6 mt-4">
          <div className=" flex flex-col justify-between">
            <label
              htmlFor=""
              className=" flex text-sm gap-1 mb-1 text-gray-900 font-bold"
            >
              Company Name
              <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., TechVentures Inc."
              className="bg-gray-100 px-4 py-3 rounded-lg text-sm"
            />
          </div>
     
        </div>
      </div>

         

      {/* Company Information */}
      <div className=" mt-4 w-[95%] mx-auto text-gray-800 ">
        {/* <h2 className="text-sm">Contact Information</h2> */}
        <div className="mt-4">
          <label
            htmlFor=""
            className="flex gap-1 items-center text-gray-900 font-bold text-sm mb-1 "
          >
            Project Manager
            <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Sarah Ayitey"
            className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
         required
         />
        </div>

       
      </div>
      <div className="mt-10 border-t border-gray-200  "></div>

      {/* Buttons */}
      <div className=" flex text-sm gap-4 md:gap-6 w-[95%] mx-auto mt-6 mb-10">
        <SubmitButton title="Create Company" />
        <Button type="button" variant="danger" onClick={router.back}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
