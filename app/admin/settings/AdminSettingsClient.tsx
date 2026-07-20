"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  HardDrive,
  Trash2,
  Video,
  FileImage,
  LayoutGrid,
  RefreshCw,
  AlertTriangle,
  X,
  Eye,
  Link as LinkIcon,
  Package,
} from "lucide-react";
import { R2PhotoPicker } from "@/components/R2PhotoPicker";

// ─── Types ────────────────────────────────────────────────────────────────────
interface R2File {
  key: string;
  url: string;
  size: number;
  lastModified: string;
  type: "image" | "video" | "other";
}

interface UsageEntry {
  label: string;
  href: string;
  section: string;
}

type UsageMap = Record<string, UsageEntry[]>;
type Tab = "all" | "image" | "video";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SECTION_COLORS: Record<string, string> = {
  Trek: "bg-emerald-100 text-emerald-700",
  Region: "bg-sky-100 text-sky-700",
  Video: "bg-violet-100 text-violet-700",
  Service: "bg-orange-100 text-orange-700",
  Team: "bg-pink-100 text-pink-700",
  Review: "bg-yellow-100 text-yellow-700",
  Setting: "bg-red-100 text-red-700",
};

function sectionColor(section: string) {
  return SECTION_COLORS[section] ?? "bg-slate-100 text-slate-600";
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  file,
  usages,
  onClose,
}: {
  file: R2File;
  usages: UsageEntry[];
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media */}
        <div className="flex-1 overflow-hidden min-h-0">
          {file.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.url}
              alt={file.key}
              className="w-full object-contain max-h-[55vh] bg-slate-950"
            />
          ) : (
            <video
              src={file.url}
              controls
              autoPlay
              muted
              className="w-full max-h-[55vh] bg-black"
            />
          )}
        </div>

        {/* Info panel */}
        <div className="bg-slate-800 p-5 space-y-4">
          <div>
            <p className="text-white font-semibold text-sm break-all">{file.key}</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {formatBytes(file.size)} · {formatDate(file.lastModified)} · {file.type.toUpperCase()}
            </p>
          </div>

          {/* Usage list */}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <LinkIcon className="w-3 h-3" /> Used In
            </p>
            {usages.length === 0 ? (
              <p className="text-slate-500 text-sm italic">Not used anywhere</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {usages.map((u, i) => (
                  <a
                    key={i}
                    href={u.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition hover:opacity-80 ${sectionColor(u.section)}`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    {u.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── File Card ─────────────────────────────────────────────────────────────────
function FileCard({
  file,
  usages,
  onPreview,
  onDelete,
}: {
  file: R2File;
  usages: UsageEntry[];
  onPreview: () => void;
  onDelete: () => void;
}) {
  const isUsed = usages.length > 0;

  return (
    <div className="group relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 hover:border-violet-200 hover:shadow-md transition-all flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-square relative bg-slate-100 overflow-hidden">
        {file.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.url}
            alt={file.key}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900">
            <Video className="w-8 h-8 text-violet-400" />
            <span className="text-xs text-slate-400 font-medium">VIDEO</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onPreview}
            className="w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Type badge */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
          file.type === "image" ? "bg-blue-600 text-white" : "bg-violet-600 text-white"
        }`}>
          {file.type}
        </span>

        {/* Used / Unused badge */}
        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isUsed ? "bg-emerald-500 text-white" : "bg-slate-700/80 text-slate-300"
        }`}>
          {isUsed ? `${usages.length} use${usages.length > 1 ? "s" : ""}` : "Unused"}
        </span>
      </div>

      {/* Info + usage */}
      <div className="p-2.5 flex-1 flex flex-col gap-1.5">
        <p className="text-xs font-semibold text-slate-700 truncate" title={file.key}>
          {file.key.split("/").pop()}
        </p>
        <p className="text-[10px] text-slate-400">
          {formatBytes(file.size)} · {formatDate(file.lastModified)}
        </p>

        {/* Usage tags */}
        {isUsed && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {usages.map((u, i) => (
              <a
                key={i}
                href={u.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={u.label}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full truncate max-w-full transition hover:opacity-80 ${sectionColor(u.section)}`}
              >
                <LinkIcon className="w-2.5 h-2.5 flex-shrink-0" />
                <span className="truncate">{u.section}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Storage Section ───────────────────────────────────────────────────────────
function StorageSection() {
  const [files, setFiles] = useState<R2File[]>([]);
  const [usageMap, setUsageMap] = useState<UsageMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<R2File | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [filesRes, usageRes] = await Promise.all([
        fetch("/api/r2-photos"),
        fetch("/api/r2-usage"),
      ]);
      if (!filesRes.ok) throw new Error("Failed to load storage files");
      if (!usageRes.ok) throw new Error("Failed to load usage data");

      const filesData = await filesRes.json();
      const usageData = await usageRes.json();

      if (filesData.error) throw new Error(filesData.error);
      if (usageData.error) throw new Error(usageData.error);

      setFiles(filesData);
      setUsageMap(usageData);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load storage");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (key: string) => {
    setDeletingKey(key);
    try {
      const res = await fetch(`/api/r2-photos?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      setFiles((prev) => prev.filter((f) => f.key !== key));
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to delete file");
    } finally {
      setDeletingKey(null);
      setConfirmKey(null);
    }
  };

  const getUsages = (file: R2File): UsageEntry[] => usageMap[file.url] ?? [];

  let filtered = tab === "all" ? files : files.filter((f) => f.type === tab);
  if (unusedOnly) filtered = filtered.filter((f) => getUsages(f).length === 0);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const imageCount = files.filter((f) => f.type === "image").length;
  const videoCount = files.filter((f) => f.type === "video").length;
  const unusedCount = files.filter((f) => getUsages(f).length === 0).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">R2 Storage</h2>
            <p className="text-xs text-slate-400">
              {files.length} files · {formatBytes(totalSize)} total
            </p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
        {[
          { label: "Total", value: files.length, icon: LayoutGrid, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Images", value: imageCount, icon: FileImage, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Videos", value: videoCount, icon: Video, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Unused", value: unusedCount, icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="py-4 px-3 text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${bg} mb-1.5`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-2 flex-wrap">
        <div className="flex gap-1">
          {(["all", "image", "video"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition ${
                tab === t
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t === "all" ? `All (${files.length})` : t === "image" ? `Images (${imageCount})` : `Videos (${videoCount})`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setUnusedOnly((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
            unusedOnly
              ? "bg-amber-500 text-white"
              : "border border-amber-300 text-amber-600 hover:bg-amber-50"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          {unusedOnly ? "Showing Unused" : `Show Unused (${unusedCount})`}
        </button>
      </div>

      {/* Legend */}
      <div className="px-6 pb-3 flex flex-wrap gap-2">
        {Object.entries(SECTION_COLORS).map(([section, cls]) => (
          <span key={section} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
            {section}
          </span>
        ))}
        <span className="text-[10px] text-slate-400 font-medium self-center ml-1">= where the file is used</span>
      </div>

      {/* Grid */}
      <div className="p-6 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl px-5 py-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <HardDrive className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((file) => (
              <FileCard
                key={file.key}
                file={file}
                usages={getUsages(file)}
                onPreview={() => setPreviewFile(file)}
                onDelete={() => setConfirmKey(file.key)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      {confirmKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Delete File?</h3>
            <p className="text-slate-600 text-sm text-center mb-1 break-all font-medium">
              {confirmKey.split("/").pop()}
            </p>
            {/* Warn if in use */}
            {(usageMap[files.find((f) => f.key === confirmKey)?.url ?? ""] ?? []).length > 0 && (
              <div className="mt-2 mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-amber-700 text-xs font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Still in use!
                </p>
                <ul className="list-disc list-inside text-amber-600 text-xs space-y-0.5">
                  {(usageMap[files.find((f) => f.key === confirmKey)?.url ?? ""] ?? []).map((u, i) => (
                    <li key={i}>{u.label}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-red-500 text-xs text-center mb-6">
              This permanently removes the file from R2 storage.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmKey(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmKey)}
                disabled={deletingKey === confirmKey}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {deletingKey === confirmKey ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <PreviewModal
          file={previewFile}
          usages={getUsages(previewFile)}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

// ─── Main Settings Client ──────────────────────────────────────────────────────
export default function AdminSettingsClient() {
  const [heroImage, setHeroImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const heroImgSetting = data.find((s: { key: string; value: string }) => s.key === "hero_image");
        if (heroImgSetting) setHeroImage(heroImgSetting.value);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_image", value: heroImage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Hero Image Setting ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerald-600" />
          Homepage Hero Image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="e.g. /hero.png or https://..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setShowPicker(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition shrink-0"
              >
                Browse
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              This image is displayed at the top of the homepage.
            </p>
          </div>

          {heroImage && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 h-64 relative bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Hero Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NDc0OGIiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved successfully
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {showPicker && (
          <R2PhotoPicker
            attachedUrls={heroImage ? [heroImage] : []}
            onSelect={(urls) => {
              if (urls.length > 0) setHeroImage(urls[urls.length - 1]);
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>

      {/* ── Storage Section ── */}
      <StorageSection />
    </div>
  );
}
