import AddCohortForm from "@/components/cohorts/AddCohortForm";

export default function AddCohortPage() {
  return (
    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 w-full min-h-screen flex ">
      <div className="w-full ">
        {/* Add Cohort Form */}
        <AddCohortForm />
      </div>
    </div>
  );
}
