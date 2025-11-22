"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CompaniesHeader() {
  const searchParams = useSearchParams();

  return (
    <section className=" flex justify-between gap-4  ">
      <div>
        <h1 className="text-xl md:text-3xl  font-semibold text-gray-900 tracking-tight">
          Companies Management
        </h1>
        <p className="mt-1 text-gray-600 text-base">List of Companies</p>
      </div>
      <div>
        <Link href={`/companies/add?cid=${searchParams.get("cid")}`}>
          <button className="w-full bg-black p-1 text-xs md:text-lg md:p-2 flex md:flex-row md:gap-2 text-white rounded-lg cursor-pointer items-center">
            <span>
              <Plus className="w-6 h-6" />
            </span>
            Add Company
          </button>
        </Link>
      </div>
    </section>
  );
}
