"use client";
import useSWR from "swr";
import { apiFetcher, apiClient } from "@/utils/api";
import { Response } from "@/utils/types";
import { Loader2, AlertCircle, FileX, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/user";




export default function UserResponses() {
  const { user } = useUser();
  const { data: responses, isLoading, error, mutate } = useSWR<Response[]>(
   user?.company ? `/responses?companyId=${user.company}` : null,
    apiFetcher
  );

  // /companies/{id}/responses

  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this input?")) return;

    setDeletingId(id);
    try {
      await apiClient.delete(`/responses/${id}`);
      toast.success("Input deleted");
      mutate(responses?.filter((r) => r.id !== id), false);
    } catch {
      toast.error("Failed to delete input");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">
            Portal Initialization
          </p>
          <p className="text-foreground font-bold text-lg">
            Loading Your Inputs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="p-4 rounded-3xl bg-rose-500/10">
          <AlertCircle size={48} className="text-rose-500/60" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-rose-500">
            Failed to Load Inputs
          </h2>
          <p className="text-sm text-foreground/50">
            We couldn&apos;t retrieve your form inputs. Please refresh and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="p-4 rounded-3xl bg-foreground/5">
          <FileX size={48} className="text-foreground/20" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
            No Inputs Yet
          </p>
          <p className="text-foreground/50 text-sm max-w-xs">
            You haven&apos;t submitted any forms yet. Start by filling out a form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase italic">
          Your Inputs
        </h1>
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.2em]">
          {responses.length} form{responses.length !== 1 ? "s" : ""} submitted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {responses.map((response) => {
          let preview = "...";
          try {
            const data = JSON.parse(response.data);
            const values = Object.values(data).slice(0, 1);
            preview =
              values.length > 0 ? String(values[0]).substring(0, 50) : "...";
          } catch {
            preview = response.data.substring(0, 50);
          }

          return (
            <div
              key={response.id}
              className="card-meltwater overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileX size={24} />
                  </div>
                  <span className="text-[9px] font-black text-primary uppercase italic px-2 py-1 bg-primary/10 rounded-full">
                    Submitted
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-1">
                      Form ID
                    </span>
                    <p className="text-xs font-mono text-foreground truncate">
                      {response.form}
                    </p>
                  </div>

                  <div className="bg-foreground/5 p-3 rounded-lg border border-border">
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-2">
                      Data Preview
                    </span>
                    <p className="text-xs text-foreground/70 line-clamp-2">
                      {preview}
                    </p>
                  </div>

                  <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    {response.createdAt
                      ? new Date(response.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 p-4 border-t border-border flex items-center gap-2">
                <Link href={`/user/responses/view?id=${response.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer">
                    <Eye size={14} />
                    View
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(response.id)}
                  disabled={deletingId === response.id}
                  className="p-2 rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
