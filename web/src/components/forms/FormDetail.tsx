"use client";
import useSWR from "swr";
import { apiFetcher } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import {
  Info,
  Code,
  Layout,
  Calendar,
  Clock,
  Hash,
  Loader2,
  FileText,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/date";

export default function FormDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: form,
    isLoading,
    error,
  } = useSWR(id ? `/forms/${id}` : null, apiFetcher);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 card-meltwater bg-foreground/[0.02]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
          Loading structure...
        </p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="card-meltwater p-12 text-center border-rose-500/20 bg-rose-500/5">
        <p className="text-rose-500 font-bold">
          Failed to load form definitions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Details Card */}
      <div className="card-meltwater p-8">
        <div className="flex items-center gap-3 mb-6">
          <Info size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            General Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground/30 mb-1">
              <FileText size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Internal Name
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">{form.name}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-foreground/30 mb-1">
              <Hash size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Configuration ID
              </span>
            </div>
            <p className="text-[11px] font-mono text-foreground/60 break-all">
              {form.id || (form as { _id?: string })._id}
            </p>
          </div>

          <div className="space-y-1 md:col-span-3">
            <div className="flex items-center gap-2 text-foreground/30 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Description
              </span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              {form.description}
            </p>
          </div>

          {(form.createdAt || form.updatedAt) && (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground/30 mb-1">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Created
                  </span>
                </div>
                <p className="text-[11px] font-bold text-foreground/60">
                  {formatDate(form.createdAt, {
                        dateStyle: "long",
                      })}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground/30 mb-1">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Last Modified
                  </span>
                </div>
                <p className="text-[11px] font-bold text-foreground/60">
                  {formatDateTime(form.updatedAt)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Schemas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* JSON Schema */}
        <div className="card-meltwater p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Code size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Data Schema
            </h2>
          </div>
          <div className="flex-1 bg-foreground/[0.03] p-5 rounded-2xl overflow-hidden border border-border/50">
            <pre className="h-[400px] overflow-auto text-[11px] text-foreground/50 font-mono scrollbar-hide">
              {typeof form.schema === "string"
                ? (() => {
                    try {
                      return JSON.stringify(JSON.parse(form.schema), null, 2);
                    } catch {
                      return form.schema;
                    }
                  })()
                : JSON.stringify(form.schema, null, 2)}
            </pre>
          </div>
        </div>

        {/* UI Schema */}
        <div className="card-meltwater p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Layout size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              UX Configuration
            </h2>
          </div>
          <div className="flex-1 bg-foreground/[0.03] p-5 rounded-2xl overflow-hidden border border-border/50">
            <pre className="h-[400px] overflow-auto text-[11px] text-foreground/50 font-mono scrollbar-hide">
              {typeof form.uiSchema === "string"
                ? (() => {
                    try {
                      return JSON.stringify(
                        JSON.parse(form.uiSchema || "{}"),
                        null,
                        2,
                      );
                    } catch {
                      return form.uiSchema;
                    }
                  })()
                : JSON.stringify(form.uiSchema || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
