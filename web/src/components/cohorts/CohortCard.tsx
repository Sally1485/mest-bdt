import { Cohort } from "@/utils/types";
import { Eye, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface CohortCardProps { cohort: Cohort; }

export default function CohortCard({ cohort }: CohortCardProps) {
  return (
    <div className="bg-[#0b1220] rounded-md overflow-hidden border border-slate-800 shadow-sm flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full bg-slate-900 transform transition-transform duration-300 hover:scale-110">
        <Image
          src="https://i.pinimg.com/736x/ff/ad/d0/ffadd05c91a3025f9bad3895f090ecce.jpg"
          alt="Cohort 1"
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      {/* Card Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name and Description*/}
        <div>
          <h2 className="text-slate-100 font-medium">{cohort.name}</h2>
          <p className="text-sm text-slate-400 mt-1 line-clamp-3">
            {cohort.description}
          </p>
        </div>
        <div className="flex-1" />
        {/* Status */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs px-2 py-1 rounded-md border bg-green-800/30 border-green-700 text-green-200">
            Active
          </span>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <Link href={`/cohorts/view?id=${cohort.id}`}>
            <button className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm flex items-center gap-2 cursor-pointer">
              <Eye className="h-4 w-4" /> View
            </button>
          </Link>
          <Link href={`/cohorts/edit?id=${cohort.id}`}>
            <button className="px-2 py-1 rounded-md border text-slate-100 border-slate-700 text-sm flex items-center gap-2 cursor-pointer">
              <Edit className="h-4 w-4" /> Edit
            </button>
          </Link>
        </div>
        {/* Dates */}
        <div className="mt-3 text-sm text-slate-300">
          <div>
            <span className="text-slate-500">Start Date: </span>
            {new Date(cohort.startDate).toDateString()}
          </div>
          <div>
            <span className="text-slate-500">End Date: </span>
            {new Date(cohort.endDate).toDateString()}
          </div>
        </div>
      </div>
    </div>
  )
};