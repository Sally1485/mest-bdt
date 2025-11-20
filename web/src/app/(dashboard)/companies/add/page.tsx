import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddCompany() {
  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <div className="inline-block">
        {/* Back  Navigation */}
        <Link
          href={"/companies"}
          className="flex  items-center gap-2 rounded-lg text-sm text-black  hover:bg-gray-300 px-3 py-2  transition-all duration-200 "
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to companies
        </Link>
      </div>

      {/* Edit company page showing a form to fill and submit<*/}
        <div className="mt-6 bg-white p-4 shadow-lg rounded-lg border border-gray-200 text-gray-800">
          <h1 className=" text-sm md:ml-6  font-bold">Add Company</h1>
          <p className="mt-2 md:ml-6  text-gray-500 text-sm">
            Add a company information for Leadership Development Program
          </p>
          {/* Basic information details */}
          <div className=" w-[95%] mx-auto mt-6">
            <h2 className="text-sm">Basic Information</h2>
            <form action="" className="space-y-6 mt-4">
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
                  placeholder="e.g., TechVentures Inc."
                  className="bg-gray-100 px-3 py-2 rounded-lg text-sm"
                />
              </div>
              <div className=" flex flex-col  md:flex-row w-full justify-between gap-4">
                <div className="flex md:w-1/2 flex-col justify-between">
                  <label
                    htmlFor=""
                    className=" flex text-sm gap-1 mb-1 text-gray-900 font-bold"
                  >
                    Industry
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="eg.,Technology"
                    className="bg-gray-100 px-2 py-3 rounded-lg text-sm "
                  />
                </div>
                <div className="flex md:w-1/2 flex-col justify-between">
                  <label
                    htmlFor=""
                    className="flex gap-1 text-sm text-gray-900 font-bold mb-1 "
                  >
                    Company Size (Employees)
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g.,250"
                    className="bg-gray-100 px-2 py-3 rounded-lg text-sm w-full"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="mt-10 border-t border-gray-200  "></div>

          {/* Program Details  */}
          <div className=" mt-4 w-[95%] mx-auto">
            <h2 className="text-sm">Program Details</h2>
            <form
              action=""
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-center ">
              <div className="text-sm flex flex-col text-gray-800 justify-between gap-1 mb-1 ">
                <label htmlFor="" className=" text-sm flex gap-1 items-center text-gray-900 font-bold">
                  Onboarding Date
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="block bg-gray-100 px-3 py-2 rounded-lg w-full"
                />
              </div>
              <div className="text-sm flex flex-col justify-between  text-gray-800">
                <label
                  htmlFor=""
                  className="text-sm flex gap-1 mb-1 text-gray-900 font-bold">
                  Status
                  <span className="text-red-700">*</span>
                </label>
                <select name="" id="" className="text-gray-600 items-center block w-full px-3 py-2 bg-gray-100 rounded-lg">
                  <option value="">Onboarding</option>
                  <option value="">Active</option>
                  <option value="">Completed</option>
                </select>
              </div>
              <div className="text-sm flex flex-col justify-between gap-2 mb-1">
                <label htmlFor="" className="flex gap-1 items-center text-gray-900 font-bold ">
                  Participants Enrolled
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="number"
                  name=""
                  id=""
                  className="block bg-gray-100 px-3 py-2 rounded-lg w-full"
                  placeholder="e.g.,8"
                />
              </div>
            </form>
            <div>
              <label
               htmlFor="" 
               className="flex gap-1 items-center mb-1 text-sm text-gray-900 font-bold mt-4 ">
                Completion Rate(%)
                <span className="text-red-600">*</span>
              </label>
              <input 
              type="text" 
              name="" 
              id="" 
              placeholder="e.g.,65" 
              className="w-full px-3 py-1 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200 "></div>

          {/* Company Information */}
          <div className=" mt-4 w-[95%] mx-auto text-gray-800 ">
            <h2 className="text-sm">Contact Information</h2>
            <div className="mt-4">
              <label htmlFor="" className="flex gap-1 items-center text-gray-900 font-bold text-sm mb-1 ">
                Contact Person
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Add a company objective..."
                className="bg-gray-100 px-4 py-3 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className=" mt-6 flex flex-col md:flex-row w-full justify-between gap-4">
              <div className="flex md:w-1/2 flex-col justify-between">
                <label
                  htmlFor=""
                  className=" flex text-sm gap-1 text-gray-900 font-bold mb-1"
                >
                  Email Address
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="email"
                  placeholder="eg.,saraha@gmail.com"
                  className="bg-gray-100 px-2 py-3 rounded-lg text-sm "
                />
              </div>
              <div className="flex md:w-1/2 flex-col justify-between">
                <label
                  htmlFor=""
                  className="flex gap-1 text-sm text-gray-900 font-bold mb-1"
                >
                  Phone Address
                  <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g.,+233 (230) (9476)"
                  className="bg-gray-100 px-2 py-3 rounded-lg text-sm w-full"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200  "></div>

          {/* Inserting Image */}
          <div className="w-[95%] mx-auto text-sm mt-4">
            <h2 className="text-sm">
              Image URL
              <span className="text-red-700">*</span>
            </h2>
            <div>
              <input
                type="file"
                placeholder=" https://example.com/image.jpg"
                className="bg-gray-100 px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200  "></div>
          
          {/* Buttons */}
          <div className=" flex text-sm gap-4 md:gap-6 w-[95%] mx-auto mt-6 mb-10">
            <button className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg cursor-pointer">
              Add company
            </button>
            <div className="flex px-2 py-1 md:px-4 md:py-2 rounded-lg border border-gray-600 cursor-pointer items-center justify-center">
              Cancel
            </div>
          </div>
        </div>
    </div>
  );
}
