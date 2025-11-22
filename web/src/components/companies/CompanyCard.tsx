import { Company } from "@/utils/types";
import { Users, Dot, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
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
          <Link
            href={`/companies/view?id=${company.id}`}
            className="text-gray-800 text-sm md:text-sm hover:text-blue-700 "
          >
            {company.name}
          </Link>
          <p className="bg-gray-200 flex items-center text-black px-2 py-1 rounded-full text-xs">
            completed{" "}
          </p>
        </div>
        <div className=" mt-1.5 flex items-center text-xs md:text-sm text-gray-700">
          <p>Venture Captial </p>
          <span className="flex items-center ml-2">
            <Dot /> 85 employees
          </span>
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
          <div className="w-4/4 h-full  bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
