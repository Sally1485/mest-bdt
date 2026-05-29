"use client";
import Image from "next/image";
import { useUser } from "@/hooks/user";
import useSWR from "swr";
import { apiClient, apiFetcher } from "@/utils/api";
import SubmitButton from "../core/SubmitButton";
import toast from "react-hot-toast";
import { Building2, Activity, Target } from "lucide-react";


export default function CompanyInfo() {
  const { user } = useUser();
  const { data, mutate } = useSWR(`/companies/${user?.company}`, apiFetcher);

  const handleSubmit = async (data: FormData) => {
    try {
      await apiClient.patch(`/companies/${user?.company}`, {
        name: data.get("name"),
        mainPointOfContact: data.get("mainPointOfContact"),
        altPointOfContact: data.get("altPointOfContact"),
        projectManager: data.get("projectManager"),
        keyOrgUnits: data.get("keyOrgUnits"),
        sector: data.get("sector"),
        productOrService: data.get("productOrService"),
        annualRevenue: data.get("annualRevenue"),
        operationalYears: data.get("operationalYears"),
        totalUsers: data.get("totalUsers"),
        totalEmployees: data.get("totalEmployees"),
        expectation: data.get("expectation"),
        mission: data.get("mission"),
      });
      toast.success("Company profile updated successfully");
      await mutate();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update company details");
    }
  };

  const inputClass =
    "mt-1 w-full px-4 py-3 bg-foreground/5 border border-transparent focus:border-primary/30 rounded-xl text-sm font-bold placeholder:text-foreground/20 outline-none transition-all font-sans";
  const labelClass =
    "text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-1 block mb-2";

  return (
    <div className="space-y-8">
      {/* BANNER SECTION */}
      <div className="card-meltwater p-1.5 overflow-hidden">
        <div className="relative w-full h-64 rounded-xl overflow-hidden group">
          <Image
            src="https://i.pinimg.com/1200x/53/bb/a5/53bba57fcb64c79582f30c913c2eb7f4.jpg"
            alt="Company Banner"
            fill
            className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest transition-all">
              Replace Cover Image
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED FORM */}
      <div className="card-meltwater p-8 sm:p-10">
        <form autoComplete="off" action={handleSubmit} className="space-y-12">
          {/* Identity & Contacts */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Identity & Contact Points
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-2">
                <label className={labelClass}>Registered Company Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={data?.name}
                  className={inputClass}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>Project Manager</label>
                <input
                  type="text"
                  name="projectManager"
                  defaultValue={data?.projectManager}
                  className={inputClass}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>Main Point of Contact</label>
                <input
                  type="text"
                  name="mainPointOfContact"
                  defaultValue={data?.mainPointOfContact}
                  className={inputClass}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>
                  Alternative point of Contact
                </label>
                <input
                  type="text"
                  name="altPointOfContact"
                  defaultValue={data?.altPointOfContact}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Business Metrics */}
          <section className="space-y-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Business Metrics & Scale
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <label className={labelClass}>Industry Sector</label>
                <input
                  type="text"
                  name="sector"
                  defaultValue={data?.sector}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Key Org Units</label>
                <input
                  type="number"
                  name="keyOrgUnits"
                  defaultValue={data?.keyOrgUnits}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Operational Years</label>
                <input
                  type="number"
                  name="operationalYears"
                  defaultValue={data?.operationalYears}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Total Employees</label>
                <input
                  type="number"
                  name="totalEmployees"
                  defaultValue={data?.totalEmployees}
                  className={inputClass}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>Primary Product / service</label>
                <input
                  type="text"
                  name="productOrService"
                  defaultValue={data?.productOrService}
                  className={inputClass}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>Estimated Annual Revenue</label>
                <input
                  type="number"
                  name="annualRevenue"
                  defaultValue={data?.annualRevenue}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Mission & Future */}
          <section className="space-y-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Mission & Objectives
              </h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className={labelClass}>Corporate Mission</label>
                <textarea
                  rows={4}
                  name="mission"
                  defaultValue={data?.mission}
                  placeholder="Describe what your company aims to achieve..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Expectations from BDT</label>
                <textarea
                  rows={4}
                  name="expectation"
                  defaultValue={data?.expectation}
                  placeholder="What are you hoping to gain from this diagnostic process?"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>
        <section>

      </section>
          {/* Action Footer */}
          <div className="flex justify-end pt-8 border-t border-border">
            <SubmitButton
              title="Save Company Profile"
              className="px-12 py-3.5 btn-pill text-sm shadow-xl shadow-primary/20"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
