import { Cohort } from "@/utils/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface CohortCardProps {
  cohort: Cohort;
}

export default function CohortCard({ cohort }: CohortCardProps) {
  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden bg-white shadow-md">
      <div className="relative w-full h-64">
        <Image
          src="https://i.pinimg.com/1200x/40/6d/46/406d46cfab7c97768870aaf287d89b5b.jpg"
          alt="Cohort 1"
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-md"
        />

        {/* Icons */}
        <div className="absolute top-2 right-2 flex space-x-4">
          <Link
            href={`/cohorts/view?id=${cohort.id}`}
            className="p-2 bg-white/30 rounded-md backdrop-blur-sm  hover:scale-110 transition"
          >
            <Eye className="h-6 w-6 text-[#432DD7]" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{cohort.name}</h3>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          {cohort.description}
        </p>
      </div>
    </div>
  );
}
