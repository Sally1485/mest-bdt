import ProgramDetail from "@/components/programs/ProgamDetail";
import ProgamHeader from "@/components/programs/ProgramHeader";

export default function ViewProgramPage() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ProgamHeader />
      <ProgramDetail />
    </div>
  );
}
