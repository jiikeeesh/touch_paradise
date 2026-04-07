"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMessage } from "@/app/actions/messages";

interface DeleteMessageButtonProps {
  id: string;
}

export default function DeleteMessageButton({ id }: DeleteMessageButtonProps) {
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
      className={`p-2 rounded-full transition ${
        loading 
          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
          : "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
      }`}
      title="Delete Message"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
