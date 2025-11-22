import Image from "next/image";
import { Building2, Users, Calendar, Mail, Phone } from "lucide-react";
import CompanyHeader from "@/components/companies/CompanyHeader";

export default function ViewCompanyPage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100  text-gray-900  transition-colors duration-300">
      <CompanyHeader />

      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300  w-full">
          <h2 className=" mb-10 text-gray-950 font-bold">Industry</h2>
          <span className="flex items-center gap-2">
            <Building2 size={20} />
            <p>Technology</p>
          </span>
        </div>
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300   w-full">
          <h2 className="mb-10 text-gray-950 font-bold">Company size</h2>
          <span className="flex items-center gap-2">
            <Users size={20} />
            <p>250 employees</p>
          </span>
        </div>
        <div className="bg-white shadow-lg px-6 text-sm  py-4 rounded-2xl border border-gray-300   w-full">
          <h2 className="mb-10 text-gray-950  font-bold">
            Participants enrolled
          </h2>
          <span className="flex items-center gap-2">
            <Users size={20} />
            <p>8 participants</p>
          </span>
        </div>
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300  w-full">
          <h2 className="mb-10 text-gray-950 font-bold">Onboarding Date</h2>
          <span className="flex items-center gap-2">
            <Calendar size={20} />
            <p>Feb 15, 2025</p>
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative mt-8  mb-10">
        <Image
          src="https://i.pinimg.com/1200x/a3/51/30/a35130edc8113b0b747ed58f84fa3f8c.jpg"
          alt="Company Image"
          width={1200}
          height={400}
          quality={100}
          className="rounded-2xl object-cover shadow-md "
        />
      </div>

      {/* Company details */}
      <div className="flex flex-col md:flex-row justify-between gap-4 ">
        <div className="bg-white rounded-lg px-6 border  border-gray-300 w-full">
          <div className="mt-4 mb-7">
            <h2 className=" text-gray-900 text-sm font-bold mb-1">
              {" "}
              Contact Information
            </h2>
            <p className="text-gray-600 text-sm">
              Primary contact for this company
            </p>
          </div>
          <div className="mb-4">
            <h2 className=" text-sm text-gray-600 font-normal ">
              Contact Person
            </h2>
            <p className="text-sm font-semibold text-gray-900">Sarah Ayitey</p>
          </div>
          <div className=" border-t  border-gray-200"></div>
          <div className="mt-6 mb-4 ">
            <h2 className="text-sm text-gray-600 font-normal">Email Address</h2>
            <span className="flex gap-2 items-center mt-2">
              <Mail size={16} />
              <p className="text-sm text-blue-600 hover:underline cursor-pointer ">
                {" "}
                saraha@gmail.com
              </p>
            </span>
          </div>
          <div className="border-t border-gray-200"></div>
          <div className="mt-4 mb-4">
            <h2 className="text-sm text-blue-600l">Phone Number</h2>
            <span className="flex items-center  gap-2">
              <Phone size={16} />
              <p className="text-sm text-blue-700">+233 (023)(2345)</p>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg px-6 border border-gray-300 w-full">
          <div className="mt-4">
            <h2 className="text-sm text-gray-900 font-bold mb-2">
              {" "}
              Progress & performance{" "}
            </h2>
            <p className="text-sm text-gray-700 mb-8">
              Company&#39;s program performance metrics
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white rounded-lg  block mb-4 ">
            <div className="flex justify-between">
              <p className="text-sm mb-1 text-gray-900">Completion Rate</p>
              <p className="text-sm mb-1">0%</p>
            </div>
            <div className="w-full h-2 bg-gray-400 rounded-full">
              {/* <div className="w-4/4 h-full  bg-black rounded-full"> */}
            </div>
          </div>

          <div className=" border-t border-gray-300"></div>
          <div className="flex  items-center mt-4 gap-4 md:gap-20 mb-4 ">
            <div>
              <h2 className="text-sm text-gray-600">Status</h2>
              <p className="px-2 py-1 text-xs bg-blue-300 text-blue-700 rounded-full">
                onboarding
              </p>
            </div>
            <div className=" text-gray-900">
              <h2 className="text-sm text-gray-600">Participants</h2>
              <p className="mt-2 text-sm">8 enrolled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-lg border border-gray-300 px-6 pb-6 rounded-lg">
        <div className="mt-6 ">
          <h2 className="text-sm text-gray-900 font-bold mb-1">
            Company Details
          </h2>
          <p className="text-sm text-gray-600 ">
            Overview of company information
          </p>
        </div>
        <div className="flex flex-col md:flex-row  md:gap-40 md:items-center mt-6  ">
          <div className="flex flex-col justify-between gap-6">
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Company Name</h2>
              <p className="text-sm text-gray-900 ">TechVentures Inc,</p>
            </span>
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Industry</h2>
              <p className="text-sm text-gray-900 ">Technology</p>
            </span>
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Organization Size</h2>
              <p className="text-sm text-gray-900 ">250 employees</p>
            </span>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Program Enrollment</h2>
              <p className="text-sm text-gray-900">
                8 participants from this organization
              </p>
            </span>
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Onboarding status</h2>
              <p className="text-sm text-gray-900">onboarding</p>
            </span>
            <span>
              <h2 className="text-sm text-gray-600 mb-2">Join Date</h2>
              <p className="text-sm text-gray-900">Feb 15, 2025</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
