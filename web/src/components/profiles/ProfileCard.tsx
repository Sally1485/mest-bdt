"use client";
import { Profile } from "@/utils/types";
import { Mail, Calendar, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/date";

export interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.email.substring(0, 2).toUpperCase();

  return (
    <div className="card-meltwater overflow-hidden group flex flex-col h-full hover:border-primary/30 transition-all duration-300">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
            <span className="text-lg font-bold text-primary group-hover:text-white">
              {initials}
            </span>
          </div>
          <Link href={`/profiles/view?id=${profile.id}`}>
            <button className="p-2 rounded-xl bg-foreground/5 hover:bg-primary hover:text-white transition-all duration-300">
              <Eye size={18} />
            </button>
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate mb-1">
            {profile.email.split("@")[0]}
          </h3>
          <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 uppercase tracking-wider">
            <Mail size={12} className="text-primary" />
            <span className="truncate">{profile.email}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              Added On
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Calendar size={12} className="text-primary" />
              <span>
                {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>
          <span className="bg-foreground/5 text-foreground/60 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            User
          </span>
        </div>
      </div>

      <Link href={`/profiles/view?id=${profile.id}`} className="block">
        <div className="px-6 py-3 bg-foreground/[0.02] border-t border-border group-hover:bg-primary/5 transition-colors flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            Manage Profile
          </span>
          <ArrowRight
            size={14}
            className="text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </div>
      </Link>
    </div>
  );
}
