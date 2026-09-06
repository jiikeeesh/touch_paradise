"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  CheckCircle2,
  X,
  ToggleLeft,
  ToggleRight,
  Mountain,
  Briefcase,
  Globe,
  MapPin,
  Search,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface TravelNotice {
  id: string;
  severity: "CLOSURE" | "ADVISORY";
  targetType: "TREK" | "REGION" | "SERVICE" | "GLOBAL";
  targetSlug: string;
  headline: string;
  detail: string;
  actionText: string;
  resolveBy: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM: Omit<TravelNotice, "id" | "createdAt" | "updatedAt"> = {
  severity: "ADVISORY",
  targetType: "TREK",
  targetSlug: "",
  headline: "",
  detail: "",
  actionText: "",
  resolveBy: "",
  active: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  CLOSURE: {
    label: "Hard Closure",
    description: "Red banner — trek/region/service is fully suspended",
    icon: ShieldAlert,
    pill: "bg-red-100 text-red-700 border-red-200",
    badge: "bg-red-600 text-white",
    dot: "bg-red-500",
  },
  ADVISORY: {
    label: "Travel Advisory",
    description: "Amber caution — open but with conditions / access issues",
    icon: ShieldCheck,
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    badge: "bg-amber-500 text-white",
    dot: "bg-amber-400",
  },
};

const TARGET_CONFIG = {
  TREK: { label: "Trek", icon: Mountain, color: "text-emerald-600" },
  REGION: { label: "Region", icon: MapPin, color: "text-sky-600" },
  SERVICE: { label: "Service", icon: Briefcase, color: "text-orange-600" },
  GLOBAL: { label: "Global (all pages)", icon: Globe, color: "text-violet-600" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── Notice Card ──────────────────────────────────────────────────────────────
function NoticeCard({
  notice,
  onEdit,
  onDelete,
  onToggle,
  deleting,
  toggling,
}: {
  notice: TravelNotice;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  deleting: boolean;
  toggling: boolean;
}) {
  const sev = SEVERITY_CONFIG[notice.severity];
  const tgt = TARGET_CONFIG[notice.targetType];
  const SevIcon = sev.icon;
  const TgtIcon = tgt.icon;

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${
      notice.active ? "border-slate-200 shadow-sm" : "border-slate-100 opacity-60"
    }`}>
      {/* Left accent bar */}
      <div className={`h-1 w-full ${notice.severity === "CLOSURE" ? "bg-gradient-to-r from-red-600 to-orange-500" : "bg-gradient-to-r from-amber-500 to-yellow-400"}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Severity badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${sev.pill}`}>
              <SevIcon className="w-3 h-3" strokeWidth={2.5} />
              {sev.label}
            </span>
            {/* Target badge */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600">
              <TgtIcon className={`w-3 h-3 ${tgt.color}`} />
              {tgt.label}
            </span>
            {/* Target slug */}
            {notice.targetSlug && notice.targetSlug !== "all" && (
              <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {notice.targetSlug}
              </code>
            )}
            {/* Active/inactive */}
            {!notice.active && (
              <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Inactive
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onToggle}
              disabled={toggling}
              title={notice.active ? "Deactivate" : "Activate"}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                notice.active
                  ? "text-emerald-600 hover:bg-emerald-50"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              {toggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : notice.active ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onEdit}
              title="Edit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              title="Delete"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-slate-900 font-bold text-sm mb-1.5 leading-snug">{notice.headline}</h3>

        {/* Detail (truncated) */}
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{notice.detail}</p>

        {/* Footer chips */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          {notice.resolveBy && (
            <span className="text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              Est. resolved: {notice.resolveBy}
            </span>
          )}
          {notice.actionText && (
            <span className="text-[10px] text-slate-500 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full truncate max-w-[200px]">
              CTA: {notice.actionText}
            </span>
          )}
          <span className="text-[10px] text-slate-400 ml-auto">Created {formatDate(notice.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Notice Form Modal ─────────────────────────────────────────────────────────
function NoticeFormModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Omit<TravelNotice, "id" | "createdAt" | "updatedAt"> & { id?: string };
  onSave: (data: typeof initial) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const isEdit = !!initial.id;

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const isGlobal = form.targetType === "GLOBAL";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEdit ? "Edit Notice" : "Create Travel Notice"}
              </h2>
              <p className="text-xs text-slate-400">
                {isEdit ? "Update the notice details below" : "Add a closure or advisory to a trek, region, or service"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-5">

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Notice Severity *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["CLOSURE", "ADVISORY"] as const).map((sev) => {
                const cfg = SEVERITY_CONFIG[sev];
                const Icon = cfg.icon;
                const selected = form.severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => set("severity", sev)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
                      selected
                        ? sev === "CLOSURE"
                          ? "border-red-500 bg-red-50"
                          : "border-amber-400 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selected ? (sev === "CLOSURE" ? "text-red-600" : "text-amber-600") : "text-slate-400"}`} strokeWidth={2} />
                    <div>
                      <p className={`font-bold text-sm ${selected ? (sev === "CLOSURE" ? "text-red-700" : "text-amber-700") : "text-slate-600"}`}>
                        {cfg.label}
                      </p>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">{cfg.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Type + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Type *
              </label>
              <select
                value={form.targetType}
                onChange={(e) => {
                  set("targetType", e.target.value);
                  if (e.target.value === "GLOBAL") set("targetSlug", "all");
                  else set("targetSlug", "");
                }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {(Object.entries(TARGET_CONFIG) as [string, typeof TARGET_CONFIG[keyof typeof TARGET_CONFIG]][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Slug {isGlobal ? "(auto)" : "*"}
              </label>
              <input
                type="text"
                value={isGlobal ? "all (global)" : form.targetSlug}
                disabled={isGlobal}
                onChange={(e) => set("targetSlug", e.target.value)}
                placeholder={
                  form.targetType === "TREK" ? "e.g. everest-base-camp" :
                  form.targetType === "REGION" ? "e.g. annapurna" :
                  "e.g. helicopter-tour"
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-400 font-mono"
              />
              {!isGlobal && (
                <p className="text-[10px] text-slate-400 mt-1">Use the URL slug exactly as in the database</p>
              )}
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Headline * <span className="text-slate-400 font-normal">(shown as the notice title)</span>
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => set("headline", e.target.value)}
              placeholder="e.g. Closed Due to Flash Floods — Road Access Severed"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Detail */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Description * <span className="text-slate-400 font-normal">(shown to customers)</span>
            </label>
            <textarea
              value={form.detail}
              onChange={(e) => set("detail", e.target.value)}
              rows={4}
              placeholder="Explain the situation in detail — what happened, what's affected, and what customers should do..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Est. Resolution <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.resolveBy}
                onChange={(e) => set("resolveBy", e.target.value)}
                placeholder="e.g. November 2026"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Action Text <span className="text-slate-400 font-normal">(optional CTA hint)</span>
              </label>
              <input
                type="text"
                value={form.actionText}
                onChange={(e) => set("actionText", e.target.value)}
                placeholder="e.g. Fly KTM → PKR instead of road"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <button
              type="button"
              onClick={() => set("active", !form.active)}
              className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.active ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-700">{form.active ? "Active — visible to customers" : "Inactive — hidden from public"}</p>
              <p className="text-xs text-slate-400">Toggle to instantly show or hide this notice without deleting it</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.headline || !form.detail || (!isGlobal && !form.targetSlug)}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> {isEdit ? "Update Notice" : "Publish Notice"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ notice, onConfirm, onClose, deleting }: {
  notice: TravelNotice;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Delete Notice?</h3>
        <p className="text-slate-500 text-sm text-center mb-1">{notice.headline}</p>
        <p className="text-red-500 text-xs text-center mb-6">This will permanently remove this notice from all pages.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Client ───────────────────────────────────────────────────────────────
export default function AdminNoticesClient() {
  const [notices, setNotices] = useState<TravelNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [showInactive, setShowInactive] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<TravelNotice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TravelNotice | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to fetch notices");
      const data = await res.json();
      setNotices(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleSave = async (form: Omit<TravelNotice, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    setSaving(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/notices", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      const saved = await res.json();
      setNotices((prev) =>
        isEdit
          ? prev.map((n) => (n.id === saved.id ? saved : n))
          : [saved, ...prev]
      );
      setModalOpen(false);
      setEditingNotice(null);
      showToast(isEdit ? "Notice updated successfully!" : "Notice published successfully!");
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice: TravelNotice) => {
    setDeletingId(notice.id);
    try {
      const res = await fetch(`/api/notices?id=${notice.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setNotices((prev) => prev.filter((n) => n.id !== notice.id));
      setDeleteTarget(null);
      showToast("Notice deleted.");
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (notice: TravelNotice) => {
    setTogglingId(notice.id);
    try {
      const res = await fetch("/api/notices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notice.id, active: !notice.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const updated = await res.json();
      setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      showToast(updated.active ? "Notice activated — now visible to customers." : "Notice deactivated — hidden from public.");
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setTogglingId(null);
    }
  };

  // Filtered notices
  const filtered = notices.filter((n) => {
    if (!showInactive && !n.active) return false;
    if (filterType !== "ALL" && n.targetType !== filterType) return false;
    if (filterSeverity !== "ALL" && n.severity !== filterSeverity) return false;
    if (search) {
      const q = search.toLowerCase();
      return n.headline.toLowerCase().includes(q) || n.targetSlug.toLowerCase().includes(q) || n.detail.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = notices.filter((n) => n.active).length;
  const closureCount = notices.filter((n) => n.severity === "CLOSURE" && n.active).length;
  const advisoryCount = notices.filter((n) => n.severity === "ADVISORY" && n.active).length;

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Notices", value: activeCount, color: "text-slate-900", bg: "bg-white", border: "border-slate-100" },
          { label: "Hard Closures", value: closureCount, color: "text-red-700", bg: "bg-red-50", border: "border-red-100" },
          { label: "Advisories", value: advisoryCount, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} rounded-2xl border ${border} p-5 text-center shadow-sm`}>
            <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by headline, slug..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">All Types</option>
              <option value="TREK">Trek</option>
              <option value="REGION">Region</option>
              <option value="SERVICE">Service</option>
              <option value="GLOBAL">Global</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">All Severity</option>
              <option value="CLOSURE">Closure</option>
              <option value="ADVISORY">Advisory</option>
            </select>
            <button
              onClick={() => setShowInactive((v) => !v)}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition ${showInactive ? "bg-slate-800 text-white border-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
            >
              {showInactive ? "Hide Inactive" : "Show Inactive"}
            </button>
            <button
              onClick={fetchNotices}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition text-sm flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Create button */}
          <button
            onClick={() => { setEditingNotice(null); setModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm shadow-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Notice
          </button>
        </div>
      </div>

      {/* Notice list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl px-6 py-5">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-20 px-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            {notices.length === 0 ? "No Notices Yet" : "No Notices Match Your Filters"}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {notices.length === 0
              ? "Create your first travel notice to inform customers about closures or conditions."
              : "Try adjusting your search or filters."}
          </p>
          {notices.length === 0 && (
            <button
              onClick={() => { setEditingNotice(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Create First Notice
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={() => { setEditingNotice(notice); setModalOpen(true); }}
              onDelete={() => setDeleteTarget(notice)}
              onToggle={() => handleToggle(notice)}
              deleting={deletingId === notice.id}
              toggling={togglingId === notice.id}
            />
          ))}
        </div>
      )}

      {/* How it works hint */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          How Notices Work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 leading-relaxed">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700">Hard Closure</strong> — Shows a bold red blocking section on the page. Disables the booking button. For fully closed routes.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700">Travel Advisory</strong> — Shows an amber caution banner. Trek remains bookable. For access issues or conditions.</span>
          </div>
          <div className="flex items-start gap-2">
            <Mountain className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700">Target Slug</strong> — Use the exact URL slug from the database (e.g., <code className="font-mono bg-white border px-1 rounded">everest-base-camp</code>).</span>
          </div>
          <div className="flex items-start gap-2">
            <Globe className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700">Global</strong> — Appears on all trek/service listing pages as a site-wide alert strip.</span>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <NoticeFormModal
          initial={editingNotice
            ? { ...editingNotice }
            : { ...EMPTY_FORM }
          }
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingNotice(null); }}
          saving={saving}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          notice={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          deleting={deletingId === deleteTarget.id}
        />
      )}
    </div>
  );
}
