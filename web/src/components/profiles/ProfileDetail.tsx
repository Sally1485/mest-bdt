"use client";
import React from "react";
import useSWR from "swr";
import { apiFetcher } from "@/utils/api";
import { Profile } from "@/utils/types";
import { formatDate } from "@/utils/date";
import {
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  MailCheck,
  Loader2,
  User as UserIcon,
  Activity,
} from "lucide-react";

interface ProfileDetailProps {
  id: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ id }) => {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR<Profile>(id ? `/profiles/${id}` : null, apiFetcher);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 card-meltwater bg-foreground/[0.02]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
          Loading Profile details...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 card-meltwater border-rose-500/20 bg-rose-500/5">
        <p className="text-rose-500 font-bold">Error loading profile details</p>
      </div>
    );
  }

  const initials = profile.email.substring(0, 2).toUpperCase();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Card Summary */}
        <div className="card-meltwater p-8 bg-primary/5 border-primary/10 flex items-center gap-8">
          <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary/20">
            {initials}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
              {profile.email.split("@")[0]}
            </h2>
            <div className="flex flex-wrap gap-3">
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Administrator
              </span>
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <MailCheck size={12} /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="card-meltwater p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <UserIcon size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Account Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                Email Address
              </span>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-foreground/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Mail size={16} className="text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {profile.email}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                Username
              </span>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground/5 rounded-lg">
                  <UserIcon size={16} className="text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  @{profile.email.split("@")[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-meltwater p-8 bg-foreground/[0.01] border-dashed border-border flex flex-col items-center justify-center py-16 gap-4">
          <Activity size={32} className="text-foreground/10" />
          <p className="text-sm font-bold text-foreground/20 uppercase tracking-widest">
            User Activity Logs Restricted
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metadata Card */}
        <div className="card-meltwater p-8">
          <h3 className="text-lg font-bold text-foreground mb-8 tracking-tight">
            System Metadata
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <Calendar size={16} className="text-primary" />
                Created
              </div>
              <span className="text-xs font-bold text-foreground">
                {formatDate(profile.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <Clock size={16} className="text-primary" />
                Updated
              </div>
              <span className="text-xs font-bold text-foreground">
                {formatDate(profile.updatedAt)}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center justify-between text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              <span>Account Status:</span>
              <span className="text-emerald-500">Active</span>
            </div>
          </div>
        </div>

        <div className="card-meltwater p-8 bg-primary/5 border-primary/10">
          <h4 className="text-sm font-bold text-foreground mb-4">
            Security Tip
          </h4>
          <p className="text-xs font-medium text-foreground/60 leading-relaxed">
            Always ensure the user has verified their email address before
            granting administrative privileges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
