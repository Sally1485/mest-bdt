import { Users, Dot, Calendar, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Companies() {


  return (
    <>
      <div className="flex flex-col bg-gray-200 p-8 text-black">
        <section className=" flex justify-between gap-4  ">
          <div>
            <h1 className="text-xl md:text-3xl  font-semibold text-gray-900 tracking-tight">
              Companies Management
            </h1>
            <p className="mt-1 text-gray-600 text-base">List of Companies</p>
          </div>
          <div>
            <Link href={"/companies/add"}>
              <button className="w-full bg-black p-1 text-xs md:text-lg md:p-2 flex md:flex-row md:gap-2 text-white rounded-lg cursor-pointer items-center">
                <span>
                  <Plus className="w-6 h-6" />
                </span>
                Add Company
              </button>
            </Link>
          </div>
        </section>


        {/* company card 1 */}
        <section className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4  cursor-pointer ">
          <div className=" relative rounded-lg shadow-md space-y-2 bg-white border border-transparent hover:border-blue-400  hover:shadow-lg ">
            {/* Card Image */}
            <div className="relative w-full h-48  overflow-hidden">
              <Image
                src={
                  "https://i.pinimg.com/1200x/40/6d/46/406d46cfab7c97768870aaf287d89b5b.jpg"
                }
                alt="image complete"
                fill
                quality={100}
                style={{ objectFit: "cover" }}
                className="rounded-t-lg transform transition-transform duration-300 hover:scale-110 "
              />
            </div>

            {/* Company Details */}
            <div className="  flex flex-col p-3  ">
              <div className="flex justify-between">
                <h2 className="text-gray-800 text-sm md:text-sm hover:text-blue-700 ">
                  StartupHub Ventures
                </h2>
                <p className="bg-gray-200 flex items-center text-black px-2 py-1 rounded-full text-xs">
                  completed{" "}
                </p>
              </div>
              <div className=" mt-1.5 flex items-center text-xs md:text-sm text-gray-700">
                <p>Venture Captial </p>
                <span className="flex items-center ml-2"><Dot /> 85 employees</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mt-4 text-xs md:text-sm text-gray-600 px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <p>Participants: 6</p>
                </div>
              </div>
              <div className="flex text-xs md:text-sm items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p>Onboarded:</p>
                </div>
                <p>Aug 15, 2024</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-lg w-full md:w-72 mt-2 md:block p-4">
              <div className="flex justify-between">
                <p className="text-sm mb-1 text-gray-600">Completion</p>
                <p className="text-sm mb-1">100%</p>
              </div>
              <div className="w-full h-2 bg-gray-400 rounded-full">
                <div className="w-4/4 h-full  bg-black rounded-full">
                </div>
              </div>
            </div>
          </div>



          {/* company card 2*/}
          <div className="relative rounded-lg shadow-md space-y-2 bg-white border border-transparent hover:border-blue-400  hover:shadow-lg ">
            {/* Card Image */}
            <div className="relative w-full h-48 overflow-hidden ">
              <Image
                src={
                  "https://i.pinimg.com/1200x/a3/51/30/a35130edc8113b0b747ed58f84fa3f8c.jpg"
                }
                alt="image completed"
                fill
                quality={100}
                style={{ objectFit: "cover" }}
                className="rounded-t-lg transform transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Company Details */}
            <div className="  flex flex-col p-3  ">
              <div className="flex justify-between">
                <h2 className="text-gray-800 text-sm md:text-sm  hover:text-blue-700">
                  BrightRight Solution
                </h2>
                <p className="bg-gray-200  flex items-center text-black px-2 py-1 rounded-full text-xs">
                  completed{" "}
                </p>
              </div>
              <div className=" mt-1.5 flex items-center text-xs md:text-sm text-gray-700">
                <p>Construction Tech</p>
                <span className="flex items-center ml-2"><Dot /> 320 employees</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mt-4 text-sm text-gray-600 px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <p>Participants: 8</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p>Onboarded:</p>
                </div>
                <p>Aug 20, 2024</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="bg-white rounded-lg w-full md:w-72  block p-4">
              <div className="flex justify-between">
                <p className="text-sm mb-1 text-gray-600">completion</p>
                <p className="text-sm mb-1">100%</p>
              </div>
              <div className="w-full h-2 bg-gray-400 rounded-full">
                <div className="w-4/4 h-full bg-black rounded-full">
                </div>
              </div>
            </div>
          </div>


          {/* company card 3 */}
          <div className="relative rounded-lg shadow-md space-y-2 bg-white border border-transparent hover:border-blue-400  hover:shadow-lg ">
            {/* card Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={
                  "https://i.pinimg.com/1200x/2f/94/e1/2f94e1314b23dda5338f32b587489d90.jpg"
                }
                alt="image complete"
                fill
                quality={100}
                style={{ objectFit: "cover" }}
                className="rounded-t-lg transform transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Company Details */}
            <div className=" flex flex-col p-3  ">
              <div className="flex justify-between">
                <h2 className="text-gray-800 text-sm md:text-sm hover:text-blue-700 ">
                  HealthTech Innovations
                </h2>
                <p className="bg-gray-200  flex items-center text-black px-2 py-1 rounded-full text-xs">
                  completed{" "}
                </p>
              </div>
              <div className=" mt-1.5 flex items-center text-xs md:text-sm text-gray-700">
                <p>Healthcare </p>
                <span className="flex items-center ml-2"><Dot /> 540 employees</span>
              </div>
            </div>
            {/* Details */}
            <div className="space-y-2 mt-4 text-sm text-gray-600 px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <p>Participants: 4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p>Onboarded:</p>
                </div>
                <p>Aug 10, 2024</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="bg-white rounded-lg w-full md:w-72 block p-4">
              <div className="flex justify-between">
                <p className="text-sm mb-1 text-gray-600">completion</p>
                <p className="text-sm mb-1">100%</p>
              </div>
              <div className="w-full h-2 bg-gray-400 rounded-full">
                <div className="w-4/4 h-full bg-black rounded-full"></div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>
  );
}
