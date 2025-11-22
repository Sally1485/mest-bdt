import Companies from "@/components/companies/Companies";
import CompaniesHeader from "@/components/companies/CompaniesHeader";

export default function CompaniesPage() {
  return (
    <>
      <div className="flex flex-col bg-gray-200 p-8 text-black">
        <CompaniesHeader />
        <Companies />
      </div>
    </>
  );
}
