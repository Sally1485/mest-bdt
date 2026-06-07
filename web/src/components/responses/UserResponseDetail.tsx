"use client";
import useSWR from "swr";
import { apiFetcher, apiClient } from "@/utils/api";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Copy, Download, ArrowLeft, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function UserResponseDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { data: response, isLoading, error } = useSWR(
    id ? `/responses/${id}` : null,
    apiFetcher
  );

  const handleCopyJson = () => {
    if (response?.data) {
      navigator.clipboard.writeText(response.data);
      toast.success("JSON copied to clipboard");
    }
  };

  const handleDownloadJson = () => {
    if (response?.data) {
      const element = document.createElement("a");
      const file = new Blob([response.data], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = `input-${id}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("JSON downloaded");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this input?")) return;

    try {
      await apiClient.delete(`/responses/${id}`);
      toast.success("Input deleted");
      router.back();
    } catch {
      toast.error("Failed to delete input");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
        <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">
          Loading Input...
        </p>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="p-4 rounded-3xl bg-rose-500/10">
          <AlertCircle size={48} className="text-rose-500/60" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-rose-500">
            Input Not Found
          </h2>
          <p className="text-sm text-foreground/50">
            We couldn&apos;t load this input. It may have been deleted.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  let parsedData: Record<string, unknown> = {};
  try {
    parsedData = JSON.parse(response.data);
  } catch {
    parsedData = { raw: response.data };
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl bg-foreground/5 text-foreground/40 hover:text-primary transition-all hover:bg-primary/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase italic">
            Input Details
          </h1>
          <p className="text-foreground/40 text-xs mt-2 font-bold uppercase tracking-[0.2em]">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleCopyJson}
          className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-lg hover:border-primary/30 transition-all font-bold text-xs uppercase tracking-wider"
        >
          <Copy size={14} />
          Copy JSON
        </button>
        <button
          onClick={handleDownloadJson}
          className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-lg hover:border-primary/30 transition-all font-bold text-xs uppercase tracking-wider"
        >
          <Download size={14} />
          Download
        </button>
        
           <button
          onClick={() => router.push(`/user/responses/edit?id=${id}`)}          
    className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-lg hover:border-primary/30 transition-all font-bold text-xs uppercase tracking-wider"
  >
    <Edit className="h-4 w-4" />
    Edit
  </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card-meltwater p-4">
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-2">
            Form ID
          </span>
          <p className="text-sm font-mono text-foreground truncate">
            {response.form}
          </p>
        </div>
        <div className="card-meltwater p-4">
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-2">
            Submitted Date
          </span>
          <p className="text-sm font-bold text-foreground">
            {response.createdAt
              ? new Date(response.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Form Data */}
      <div className="card-meltwater p-8 mb-8">
        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-6">
          Your Input Data
        </span>
        <div className="space-y-6">
          {Object.entries(parsedData).map(([key, value]) => (
            <div
              key={key}
              className="border-b border-border last:border-0 pb-6 last:pb-0"
            >
              <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">
                {key}
              </div>
              <div className="bg-foreground/5 p-4 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground break-words">
                  {typeof value === "string" || typeof value === "number"
                    ? String(value)
                    : JSON.stringify(value, null, 2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON */}
      <div className="card-meltwater p-8 mb-8">
        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-6">
          Raw JSON
        </span>
        <pre className="bg-foreground/[0.03] border border-border p-6 rounded-lg overflow-x-auto text-xs font-mono text-foreground/70 max-h-96">
          {JSON.stringify(JSON.parse(response.data), null, 2)}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-foreground/5 border border-border rounded-lg font-bold text-xs uppercase tracking-wider hover:border-primary/30 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all"
        >
          Delete Input
        </button>
      </div>
    </div>
  );
}
