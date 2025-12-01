import Cohorts from "@/components/cohorts/Cohorts";
import CohortsHeader from "@/components/cohorts/CohortsHeader";

export default function CohortsPage() {
  return (
    <div className="bg-[#0B1220] p-8 rounded-md  ">
      <CohortsHeader />
      <Cohorts />
    </div>
  );
}
