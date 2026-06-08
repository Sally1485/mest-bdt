"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient, apiFetcher } from "@/utils/api";
import useSWR from "swr";
import { Profile } from "@/utils/types";
import Button from "../core/Button";

interface EditProfileFormBodyProps {
  id: string;
  profile: Profile;
}

// Inner form. The `key={profile.id}` on the parent guarantees this component
// is remounted whenever the loaded profile changes, so we can safely seed
// `email` from props in `useState` without needing a sync effect.
const EditProfileFormBody = ({ id, profile }: EditProfileFormBodyProps) => {
  const router = useRouter();
  const [email, setEmail] = useState(profile.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required!");

    setIsLoading(true);
    try {
      await apiClient.patch(`/profiles/${id}`, { email });
      toast.success("Profile updated successfully!");
      router.back();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update profile!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
          Edit Profile
        </h1>
        <p className="text-foreground/40 text-sm font-medium">
          Update the user&apos;s email address and profile settings.
        </p>
      </div>

      <div className="card-meltwater p-8 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <User size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              User Identity
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-1"
              >
                Email Address <span className="text-primary">*</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-transparent focus:border-primary/30 rounded-xl text-sm font-bold placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8 border-t border-border">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Account Status
            </h2>
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground mb-0.5">
                Verified Profile
              </p>
              <p className="text-[10px] font-medium text-foreground/40">
                This account is fully verified and active.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="px-8"
        >
          Cancel
        </Button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-pill bg-primary text-primary-foreground px-10 py-3 font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

const EditProfileForm = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: profile, isLoading: isFetching } = useSWR<Profile>(
    id ? `/profiles/${id}` : null,
    apiFetcher,
  );

  if (isFetching || !profile || !id) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 card-meltwater bg-foreground/[0.02]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
          Loading profile data...
        </p>
      </div>
    );
  }

  // `key` ensures the inner form remounts whenever the loaded profile
  // changes, so the email seed in `useState` always reflects the current
  // profile without a sync-from-prop effect.
  return <EditProfileFormBody key={id} id={id} profile={profile} />;
};

export default EditProfileForm;
