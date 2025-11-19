import { Plus } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProgram() {
  return (
    <>
      
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="inline-block">
          <Link
            href={"/programs"}
            className="flex  items-center gap-2 rounded-lg text-sm text-black  hover:bg-gray-300 px-3 py-2  transition-all duration-200 "
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to programs
          </Link>
        </div>

        {/* <p>Add a new program page showing a form to fill and submit</p> */}
        <div className="mt-6 bg-white p-4 shadow-lg rounded-lg text-black">
          <h1 className=" text-xl md:ml-6  font-bold">Edit Program</h1>
          <p className="mt-2 md:ml-6 text-gray-700 text-sm">
            Update the program information below
          </p>
          <div className=" w-[95%] mx-auto mt-6">
            <h2 className="text-sm">Basic Information</h2>
            <form action="" className="space-y-6 mt-4">
              <div className=" flex flex-col justify-between">
                <label
                  htmlFor=""
                  className="text-sm text-gray-700 font-semibold"
                >
                  Program Name
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Leadership Development Program"
                  className="bg-gray-100 px-2 py-1 rounded-lg text-sm"
                />
              </div>
              <div className=" flex flex-col justify-between">
                <label
                  htmlFor=""
                  className="text-sm text-gray-700 font-semibold"
                >
                  Description
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
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
                <div className=" flex flex-col justify-between">
                  <label
                    htmlFor=""
                    className=" block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Status
                    <span className="text-red-700">*</span>
                  </label>
                  <select
                    name=""
                    id=""
                    className="w-full text-sm text-gray-700 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">upcoming</option>
                    <option value="">active</option>
                    <option value="">complete</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-10 border border-t-gray-400  "></div>

          {/* Schedule & Participants Form Section  */}
          <div className=" mt-4 w-[95%] mx-auto">
            <h2 className="text-sm">Schedule & Participants</h2>
            <form
              action=""
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 "
            >
              <div className="text-sm flex flex-col justify-between gap-2">
                <label htmlFor="">
                  Start Date
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="date"
                  name=""
                  id=""
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
                  name=""
                  id=""
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
                  id=""
                  className="block bg-gray-100 px-2 py-1 rounded-lg w-full"
                />
              </div>
            </form>
          </div>
          <div className="mt-10 border border-t-gray-400  "></div>

          {/* Program Objectives */}
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

          {/* Inserting Image */}
          <div className="w-[95%] mx-auto mt-4">
            <h2 className="text-sm">
              Image URL
              <span className="text-red-700">*</span>
            </h2>
            <div>
              <input
                type="file"
                placeholder=" https://example.com/image.jpg"
                className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-10 border border-t-gray-400  "></div>

          <div className=" flex  gap-6 w-[95%] mx-auto mt-6 mb-10">
            <button className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg cursor-pointer">
              Update program
            </button>
            <div className="flex px-4 py-2 rounded-lg border border-gray-600 cursor-pointer items-center justify-center">
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
