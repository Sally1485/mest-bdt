"use client";
import { apiFetcher } from "@/utils/api";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function ProgramDetail() {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useSWR(
    `/programs/${searchParams.get("id")}`,
    apiFetcher,
  );

  if (isLoading) {
    return (
      <section>
        <p>Loading program detail...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <p>An unexpected error occured...</p>
      </section>
    );
  }

  return (
    <>
      {/* Image Section */}
      <div className="relative mb-10">
        <Image
          src="https://i.pinimg.com/1200x/a3/51/30/a35130edc8113b0b747ed58f84fa3f8c.jpg"
          alt="Program Image"
          width={1200}
          height={500}
          quality={100}
          className="rounded-2xl object-cover shadow-md"
        />
        <p className="absolute top-5 left-5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          Active
        </p>
      </div>

      {/* Summary Information */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 rounded-2xl shadow-md mb-10">
        <h2 className="text-lg font-semibold mb-5 text-gray-800 dark:text-gray-200">
          Summary Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Program Name</p>
            <p className="font-semibold">{data.name}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="font-semibold">
              {new Date(data.startDate).toDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">End Date</p>
            <p className="font-semibold">
              {new Date(data.endDate).toDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Cohort</p>
            <p className="font-semibold">2025 Spring Cohort</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Participants</p>
            <p className="font-semibold">24</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Description
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {data.description}
        </p>
      </div>
    </>
  );
}
