"use client";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CohortsHeader() {
  const searchParams = useSearchParams();
  return (
    <div className="p-2 sm:p-4 bg-[#0B1220] rounded-md">
      <header className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Cohorts</h1>
            <p className="text-sm text-slate-400">
              List of Cohorts enrolled across our edTech offerings
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            {/* Add New Cohort Button */}
            <Link href={`/cohorts/add?pid=${searchParams.get("pid")}`}>
              <button className="flex items-center gap-2 bg-[#0F1724] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">
                <Plus className="h-4 w-4" />
                Add New Cohort
              </button>
            </Link>
          </div>
        </div>
      </header>
      {/* Filter Bar and Sorting cards */}
      <div className=" bg-[#0b1220] p-2 sm:p-4 rounded-md border border-slate-800 flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="flex items-center gap-2 flex-1">
          <span className="sr-only">Search cohorts</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0f1724] rounded-md border border-slate-800 w-full">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search by cohort name"
              className="bg-transparent outline-none text-slate-200 placeholder:text-slate-500 w-full text-sm"
            />
          </div>
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-sm text-slate-400">Status</div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 rounded-md text-sm border bg-slate-700 text-white border-slate-600 cursor-pointer">
              All
            </button>
            <button className="px-3 py-1 rounded-md text-sm border bg-transparent text-slate-300 border-slate-800 cursor-pointer">
              Active
            </button>
            <button className="px-3 py-1 rounded-md text-sm border bg-transparent text-slate-300 border-slate-800 cursor-pointer">
              Ongoing
            </button>
            <button className="px-3 py-1 rounded-md text-sm border bg-transparent text-slate-300 border-slate-800 cursor-pointer">
              Completed
            </button>
          </div>
        </div>
        <div className="lg:ml-auto text-white flex items-center gap-2">
          <label className="text-sm text-slate-400">Sort</label>
          <select
            className="px-3 py-2 text-sm rounded-md bg-[#0f1724] border border-slate-800"
          >
            <option>Start date (newest)</option>
            <option>Start date (oldest)</option>
            <option>Name (A → Z)</option>
          </select>
        </div>
    </div>
    </div>
  );
}