import { Program } from "@/utils/types";
import { Eye, Users, Dot, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className=" relative rounded-lg shadow-md space-y-2 bg-white ">
      <div className="relative w-full h-48  overflow-hidden">
        <Image
          src={
            "https://i.pinimg.com/1200x/40/6d/46/406d46cfab7c97768870aaf287d89b5b.jpg"
          }
          alt="image complete"
          fill
          quality={100}
          style={{ objectFit: "cover" }}
          className="rounded-t-lg"
        />
      </div>
      <div className="flex mt-4 items-center justify-between">
        {/*Action tags  */}
        <p className="bg-blue-100 absolute top-2 left-2 text-blue-900 px-2 py-1 rounded-full text-xs">
          upcoming{" "}
        </p>
        <div className=" absolute top-2  right-2 flex items-center gap-3">
          <Link href={`/programs/view?id=${program.id}`}>
            <Eye className="w-8 h-8 text-gray-600 bg-white p-1.5 rounded-full hover:text-blue-500 cursor-pointer transition" />
          </Link>
        </div>
      </div>

      {/* Program Details */}
      <div className=" flex flex-col p-3  ">
        <h2 className=" font-semibold ">{program.name}</h2>
        <p className="text-gray-700 text-base mt-2  leading-relaxed">
          {program.description}
        </p>
        <div>
          <div className="space-y-2 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users />
                <p>Cohort: 2025 Spring Cohort</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dot />
              <p>24 participants</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 mb-4">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-gray-600 text-sm">
              {new Date(program.startDate).toDateString()} -{" "}
              {new Date(program.endDate).toDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
