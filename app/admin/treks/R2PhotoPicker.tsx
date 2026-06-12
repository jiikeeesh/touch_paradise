"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Search,
  CheckCircle2,
  ImageIcon,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";

interface R2Photo {
  key: string;
  url: string;
  size: number;
  lastModified: string;
}

interface R2PhotoPickerProps {
  /** URLs already attached to the trek — shown as pre-selected */
  attachedUrls: string[];
  /** Called with an array of *newly chosen* URLs (already-attached ones are excluded) */
  onSelect: (urls: string[]) => void;
  onClose: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function R2PhotoPicker({
  attachedUrls,
  onSelect,
  onClose,
}: R2PhotoPickerProps) {
  const [photos, setPhotos] = useState<R2Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  // Selected = URLs the user has ticked in this session (excluding already-attached)
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const attachedSet = new Set(attachedUrls);

  // Fetch bucket listing once on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/r2-photos")
      .then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error)));
        return r.json();
      })
      .then((data: R2Photo[]) => {
        if (!cancelled) setPhotos(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = photos.filter((p) =>
    p.key.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = useCallback(
    (url: string) => {
      if (attachedSet.has(url)) return; // already attached, can't deselect
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(url)) next.delete(url);
        else next.add(url);
        return next;
      });
    },
    [attachedSet]
  );

  const handleConfirm = () => {
    onSelect(Array.from(selected));
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div
        className="relative flex flex-col bg-white rounded-2xl shadow-2xl w-full max-w-4xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Choose from R2 Photos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selected.size} selected &middot; {photos.length} photos in bucket
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by filename…"
              className="w-full border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Grid area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
              <AlertCircle className="w-10 h-10" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <ImageIcon className="w-12 h-12" />
              <p className="text-sm">
                {query ? "No photos match your search." : "No photos in bucket yet."}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((photo) => {
                const isAttached = attachedSet.has(photo.url);
                const isSelected = selected.has(photo.url);
                const active = isAttached || isSelected;

                return (
                  <button
                    key={photo.key}
                    type="button"
                    onClick={() => toggle(photo.url)}
                    title={photo.key}
                    className={[
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      active
                        ? "border-emerald-500 ring-2 ring-emerald-300"
                        : "border-slate-200 hover:border-emerald-300",
                      isAttached ? "cursor-default opacity-80" : "cursor-pointer",
                    ].join(" ")}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.key}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Overlay */}
                    <div
                      className={[
                        "absolute inset-0 transition-opacity",
                        active ? "bg-emerald-900/30" : "bg-black/0 group-hover:bg-black/10",
                      ].join(" ")}
                    />

                    {/* Checkmark badge */}
                    {active && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* "Already added" label */}
                    {isAttached && (
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[10px] font-semibold text-center py-0.5">
                        Already added
                      </div>
                    )}

                    {/* Size on hover */}
                    {!isAttached && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatBytes(photo.size)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-500">
            {selected.size > 0
              ? `${selected.size} photo${selected.size > 1 ? "s" : ""} ready to add`
              : "Click photos to select them"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add {selected.size > 0 ? `${selected.size} ` : ""}Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
