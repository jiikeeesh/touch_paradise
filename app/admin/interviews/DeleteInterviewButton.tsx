"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteInterviewApplication } from "@/app/actions/interview";

export default function DeleteInterviewButton({ id, className }: { id: string, className?: string }) {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteInterviewApplication(id);
      if (result.error) {
        alert(result.error);
      }
      setIsConfirming(false);
    });
  };

  if (isConfirming) {
    return (
      <div className={`flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 ${className || ''}`}>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 justify-center px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition flex items-center gap-1.5"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-3 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className={`inline-flex justify-center items-center gap-2 transition hover:bg-red-100 ${
        className || "px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg shadow-sm border border-red-100"
      }`}
      title="Delete Application"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}
