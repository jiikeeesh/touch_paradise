"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteInterviewApplication } from "@/app/actions/interview";

export default function DeleteInterviewButton({ id }: { id: string }) {
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
      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-1.5"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition shadow-sm border border-red-100"
      title="Delete Application"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}
