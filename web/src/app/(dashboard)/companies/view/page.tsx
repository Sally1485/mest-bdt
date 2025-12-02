import Image from "next/image";
import { Building2, Users, Mail, Phone, Calendars, IdCardLanyard } from "lucide-react";
import CompanyHeader from "@/components/companies/CompanyHeader";

export default function ViewCompanyPage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100  text-gray-900  transition-colors duration-300">
      <CompanyHeader />

      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300  w-full">
          <h2 className=" mb-10 text-gray-950 font-bold">Sector</h2>
          <span className="flex items-center gap-2">
            <Building2 size={20} />
            <p>Technology</p>
          </span>
        </div>
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300   w-full">
          <h2 className="mb-10 text-gray-950 font-bold">Company size</h2>
          <span className="flex items-center gap-2">
            <IdCardLanyard size={20} />
            <p>250 employees</p>
          </span>
        </div>
        <div className="bg-white shadow-lg px-6 text-sm  py-4 rounded-2xl border border-gray-300   w-full">
          <h2 className="mb-10 text-gray-950  font-bold">
            Operational years
          </h2>
          <span className="flex items-center gap-2">
            <Calendars size={20} />
            <p>8 years</p>
          </span>
        </div>
        <div className="bg-white shadow-lg text-sm px-6 py-4 rounded-2xl border border-gray-300  w-full">
          <h2 className="mb-10 text-gray-950 font-bold">Total Users</h2>
          <span className="flex items-center gap-2">
            <Users size={20} />
            <p>5 users</p>
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
          <div className="mt-4 mb-4">
            <h2 className=" text-gray-900 text-base font-bold mb-1">
              {" "}
              Contact Information
            </h2>

          </div>
          <div className=" border-t  border-gray-200"></div>
          <div className="mt-2 mb-4 ">
            <p className="text-gray-600 text-sm mb-3">
              Primary contact for this company
            </p>
            <h2 className=" text-sm text-gray-600 font-normal ">
              Contact Person
            </h2>
            <p className="text-sm font-semibold text-gray-900 mt-2">Sarah Ayitey</p>

            <div className="mt-2 mb-4 ">
              <h2 className="text-sm text-gray-600 font-normal">Email Address</h2>
              <span className="flex gap-2 items-center mt-2">
                <Mail size={16} />
                <p className="text-sm text-blue-600 hover:underline cursor-pointer ">
                  {" "}
                  saraha@gmail.com
                </p>
              </span>
            </div>
            <div className="mt-4 ">
              <h2 className="text-sm text-blue-600l">Phone Number</h2>
              <span className="flex items-center  gap-2">
                <Phone size={16} />
                <p className="text-sm text-blue-700">+233 (023)(2345)</p>
              </span>
            </div>
          </div>
          <div className="border-t border-gray-400"></div>


          <div className="mt-4">

            <p className="text-gray-600 text-sm">
              Alternative contact
            </p>

            <div className="mt-2 mb-4">
              <h2 className=" text-sm text-gray-600 font-normal ">
                Contact Person
              </h2>
              <p className="text-sm font-semibold text-gray-900 mt-2">Sarah Ayitey</p>
            </div>

            <div className="mt-2 mb-4 ">
              <h2 className="text-sm text-gray-600 font-normal">Email Address</h2>
              <span className="flex gap-2 items-center mt-2">
                <Mail size={16} />
                <p className="text-sm text-blue-600 hover:underline cursor-pointer ">
                  {" "}
                  saraha@gmail.com
                </p>
              </span>
            </div>
            <div className="mt-4 mb-4">
              <h2 className="text-sm text-blue-600l">Phone Number</h2>
              <span className="flex items-center  gap-2">
                <Phone size={16} />
                <p className="text-sm text-blue-700">+233 (023)(2345)</p>
              </span>
            </div>
          </div>

        </div>

        {/* Organization Overview */}
        <div className="bg-white rounded-lg px-6 py-6 border border-gray-300 w-full">

          <div className="mb-4">
            <h2 className="text-base text-gray-900 font-semibold mb-2">Organization Profile</h2>
            <div className=" border-t  border-gray-200"></div>
            <p className="text-sm mt-2 text-gray-600">Business Operation Overview</p>
          </div>

          <div>
            <h2 className="text-sm mt-2 text-gray-900 font-bold">Project Manager</h2>
            <p className="text-sm mt-2 text-gray-900 mb-4">Eramus Konney</p>
          </div>

          <div className=" border-t  border-gray-400"></div>
          {/* Key Data Fields */}
          <div className="space-y-4 mt-4 mb-2">

            <div>
              <h2 className="text-sm mt-2 text-gray-900 ">Total Number of Employees</h2>
              <p className="text-sm mt-2 text-gray-900 mb-4">60</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-800 font-medium">Key Organizational Units</h3>
              <p className="text-sm text-gray-700">10</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-800 font-medium">Product / Service</h3>
              <p className="text-sm text-gray-700">Technology</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-800 font-medium">Annual Revenue</h3>
              <p className="text-sm text-gray-700">$16.0M</p>
            </div>
          </div>
        </div>
      </div>

      {/* company's goals and expection */}
      <div className="mt-8 bg-white shadow-lg border border-gray-300 px-6 pb-6 rounded-lg">
        <div className="mt-6 ">
          <h2 className="text-base text-gray-900 font-bold mb-1">
            Mission and Goals
          </h2>
          <p className="text-sm text-gray-600 ">
            Mission and Expected Outcomes
          </p>
        </div>
        <div className="flex flex-col  mt-6  ">
          <div className="flex flex-col mb-4">

            <h2 className="text-sm text-gray-900 mb-2">Company&#39;s Mission</h2>
            <p className="text-sm text-gray-600 ">Our mission is to empower individuals and businesses with innovative, reliable solutions that simplify their daily operations and unlock new opportunities for growth. We are committed to delivering exceptional value through integrity, customer-focused service, and continuous improvement in everything we do.</p>
          </div>
          <div className=" border-t  border-gray-400"></div>
          <div className="mt-4 mb-4">
            <h2 className="text-sm text-gray-900 mb-2">Expections</h2>
            <p className="text-sm text-gray-600">
              We expect every team member to uphold our core values of integrity, collaboration, and accountability in all aspects of their work. The company also expects employees to consistently strive for excellence, embrace innovation, and contribute to a positive and productive work environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
