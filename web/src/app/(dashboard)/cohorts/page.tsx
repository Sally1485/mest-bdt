import Cohorts from "@/components/cohorts/Cohorts";
import CohortsHeader from "@/components/cohorts/CohortsHeader";

export default function CohortsPage() {
  return (
    <div className=" bg-gray-200 p-8 rounded-md text-black">
      <CohortsHeader />
      <Cohorts />
    </div>
  );
}
