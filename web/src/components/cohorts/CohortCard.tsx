"use client";
import { Cohort } from "@/utils/types";
import { Eye, Edit, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/date";

export interface CohortCardProps {
  cohort: Cohort;
}

export default function CohortCard({ cohort }: CohortCardProps) {
  return (
    <div className="card-meltwater overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-40 w-full bg-foreground/5 overflow-hidden">
        <Image
          src={cohort.image || "https://placehold.co/600x400.png"}
          alt={cohort.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shadow-lg">
            Active
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {cohort.name}
        </h2>
        <p className="text-sm text-foreground/50 line-clamp-2 mb-6 font-medium leading-relaxed">
          {cohort.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} className="text-primary" /> Start Date
              </span>
              <span className="text-xs font-bold text-foreground">
                {formatDate(cohort.startDate)}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-l border-border pl-4">
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} className="text-primary" /> End Date
              </span>
              <span className="text-xs font-bold text-foreground">
                {formatDate(cohort.endDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Link href={`/cohorts/view?id=${cohort.id}`} className="flex-1">
              <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2">
                <Eye size={14} /> View
              </button>
            </Link>
            <Link href={`/cohorts/edit?id=${cohort.id}`}>
              <button className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all duration-300">
                <Edit size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
