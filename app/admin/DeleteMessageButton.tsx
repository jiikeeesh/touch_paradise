"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMessage } from "@/app/actions/messages";

interface DeleteMessageButtonProps {
  id: string;
  className?: string;
  showText?: boolean;
}

export default function DeleteMessageButton({ id, className, showText }: DeleteMessageButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoading(true);
    try {
      const res = await deleteMessage(id);
      if (res?.error) {
        alert(res.error);
      }
    } catch (err) {
      alert("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`inline-flex items-center gap-2 transition ${
        loading 
          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
          : "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
      } ${className || "p-2 rounded-full justify-center"}`}
      title="Delete Message"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      {showText && <span>Delete</span>}
    </button>
  );
}
