import Link from "next/link";
import { Plus } from "lucide-react";
import Programs from "@/components/programs/Programs";

export default function ProgramsPage() {
  return (
    <div className="flex flex-col bg-gray-200 p-8 text-black">
      <section className=" flex justify-between ">
        <div>
          <h1 className="text-2xl md:text-3xl  font-semibold text-gray-900 tracking-tight">
            Programs Management
          </h1>
          <p className="mt-1 text-gray-600 text-base">List of Programs</p>
        </div>
        <div>
          <Link href={"/programs/add"}>
            <button className="w-full bg-black p-1  md:p-2 flex md:flex-row md:gap-2 text-white rounded-lg cursor-pointer">
              <span>
                <Plus />
              </span>
              Add Program
            </button>
          </Link>
        </div>
      </section>
      <Programs />
    </div>
  );
}
