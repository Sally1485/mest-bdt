"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CohortsHeader() {
  const searchParams = useSearchParams();

  return (
    <div className="w-full mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Header Title */}
      <h1 className="text-2xl font-bold text-white-800">Cohort Details</h1>

      {/* Right: Search + Add Button Group */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search cohorts..."
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Cohort Button */}
        <Link
          href={`/cohorts/add?pid=${searchParams.get("pid")}`}
          className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Add Cohort
        </Link>
      </div>
    </div>
  );
}
