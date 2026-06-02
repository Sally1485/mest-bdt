"use client";
import React, { useState } from "react";
import { Trash2, FileText, Calendar, Building, Info } from "lucide-react";
import { Response } from "@/utils/types";
import { apiClient } from "@/utils/api";
import toast from "react-hot-toast";

interface ResponseCardProps {
  response: Response;
  onDelete: (id: string) => void;
}

export default function ResponseCard({
  response,
  onDelete,
}: ResponseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/responses/${response.id}`);
      toast.success("Response deleted successfully");
      onDelete(response.id);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete response");
    } finally {
      setIsDeleting(false);
    }
  };

  const parsedData = (() => {
    try {
      return JSON.parse(response.data);
    } catch {
      return { raw: response.data };
    }
  })();

  const dataPreview = Object.entries(parsedData)
    .slice(0, 3)
    .map(([key, value]) => (
      <div
        key={key}
        className="flex justify-between text-xs py-1 border-b border-border last:border-0"
      >
        <span className="text-foreground/40 font-bold uppercase tracking-wider">
          {key}
        </span>
        <span className="text-foreground font-semibold truncate max-w-[150px]">
          {String(value)}
        </span>
      </div>
    ));

  return (
    <div className="card-meltwater overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <FileText size={24} />
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Building size={12} className="text-primary" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                Company ID
              </span>
            </div>
            <p className="text-xs font-bold text-foreground truncate pl-4 border-l-2 border-primary/20">
              {response.company}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Info size={12} className="text-primary" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                Form ID
              </span>
            </div>
            <p className="text-xs font-bold text-foreground truncate pl-4 border-l-2 border-primary/20">
              {response.form}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-foreground/5 border border-border">
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block mb-2">
            Data Payload
          </span>
          <div className="space-y-1">
            {dataPreview}
            {Object.keys(parsedData).length > 3 && (
              <p className="text-[10px] text-foreground/20 italic mt-2">
                + {Object.keys(parsedData).length - 3} more fields
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-foreground/5 p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
          <Calendar size={12} />
          {formatDate(response.createdAt)}
        </div>
        <span className="text-[10px] font-black text-primary uppercase italic">
          Submitted
        </span>
      </div>
    </div>
  );
}
