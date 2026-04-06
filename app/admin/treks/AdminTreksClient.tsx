"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Mountain,
  MapPin,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RegionForm, TrekForm } from "./TrekForms";

interface Region {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  _count?: { treks: number };
}

interface Trek {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationDays: number;
  price: number;
  altitude: string;
  season: string;
  itinerary: string;
  images: string;
  regionId: string;
  region?: { id: string; name: string; slug: string };
}

type ActiveForm =
  | { type: "new-region" }
  | { type: "edit-region"; region: Region }
  | { type: "new-trek" }
  | { type: "edit-trek"; trek: Trek }
  | null;

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  "Moderate–Hard": "bg-orange-100 text-orange-700",
  Hard: "bg-red-100 text-red-700",
};

export default function AdminTreksClient() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "region" | "trek";
    id: string;
    name: string;
  } | null>(null);
  const [showTreks, setShowTreks] = useState(true);
  const [showRegions, setShowRegions] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [regRes, trekRes] = await Promise.all([
        fetch("/api/regions"),
        fetch("/api/treks"),
      ]);
      if (!regRes.ok || !trekRes.ok) throw new Error("Failed to load data");
      const [regData, trekData] = await Promise.all([
        regRes.json(),
        trekRes.json(),
      ]);
      setRegions(regData);
      setTreks(trekData);
    } catch {
      setError("Failed to load regions and treks. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDeleteRegion = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/regions/${id}`, { method: "DELETE" });
      setRegions((prev) => prev.filter((r) => r.id !== id));
      setTreks((prev) => prev.filter((t) => t.regionId !== id));
    } catch {
      setError("Failed to delete region.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleDeleteTrek = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/treks/${id}`, { method: "DELETE" });
      setTreks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete trek.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleRegionSuccess = (region: Region) => {
    setRegions((prev) => {
      const idx = prev.findIndex((r) => r.id === region.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = region;
        return next;
      }
      return [region, ...prev];
    });
    setActiveForm(null);
  };

  const handleTrekSuccess = (trek: Trek) => {
    setTreks((prev) => {
      const idx = prev.findIndex((t) => t.id === trek.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = trek;
        return next;
      }
      return [trek, ...prev];
    });
    setActiveForm(null);
    fetchAll(); // refresh counts
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* ─── Confirm Delete Dialog ─────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Delete {confirmDelete.type === "region" ? "Region" : "Trek"}?
            </h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              <strong>&quot;{confirmDelete.name}&quot;</strong> will be permanently deleted.
              {confirmDelete.type === "region" && " All treks in this region will also be deleted."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === "region")
                    handleDeleteRegion(confirmDelete.id);
                  else handleDeleteTrek(confirmDelete.id);
                }}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {deletingId === confirmDelete.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Regions Section ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Regions</h2>
              <p className="text-xs text-slate-400">{regions.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveForm(
                  activeForm?.type === "new-region" ? null : { type: "new-region" }
                )
              }
              className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Region
            </button>
            <button
              onClick={() => setShowRegions((v) => !v)}
              className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400"
            >
              {showRegions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {activeForm?.type === "new-region" && (
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
              New Region
            </p>
            <RegionForm
              onSuccess={handleRegionSuccess}
              onCancel={() => setActiveForm(null)}
            />
          </div>
        )}

        {activeForm?.type === "edit-region" && (
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
              Edit Region
            </p>
            <RegionForm
              initial={activeForm.region}
              onSuccess={handleRegionSuccess}
              onCancel={() => setActiveForm(null)}
            />
          </div>
        )}

        {showRegions && (
          <>
            {regions.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No regions yet. Add your first one above.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition"
                  >
                    <div className="relative w-14 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      {region.image ? (
                        <Image
                          src={region.image}
                          alt={region.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <MapPin className="w-5 h-5 text-slate-300 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">{region.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{region.slug}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                        {region.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mr-4">
                      <Mountain className="w-3.5 h-3.5" />
                      {region._count?.treks ?? 0} trek{region._count?.treks !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setActiveForm({ type: "edit-region", region })
                        }
                        className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDelete({
                            type: "region",
                            id: region.id,
                            name: region.name,
                          })
                        }
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Treks Section ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Treks</h2>
              <p className="text-xs text-slate-400">{treks.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveForm(
                  activeForm?.type === "new-trek" ? null : { type: "new-trek" }
                )
              }
              disabled={regions.length === 0}
              title={regions.length === 0 ? "Create a region first" : ""}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Trek
            </button>
            <button
              onClick={() => setShowTreks((v) => !v)}
              className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400"
            >
              {showTreks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {activeForm?.type === "new-trek" && (
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
              New Trek
            </p>
            <TrekForm
              regions={regions}
              onSuccess={handleTrekSuccess}
              onCancel={() => setActiveForm(null)}
            />
          </div>
        )}

        {activeForm?.type === "edit-trek" && (
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
              Edit Trek
            </p>
            <TrekForm
              initial={activeForm.trek}
              regions={regions}
              onSuccess={handleTrekSuccess}
              onCancel={() => setActiveForm(null)}
            />
          </div>
        )}

        {showTreks && (
          <>
            {treks.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Mountain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No treks yet. Add your first one above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-3">Trek</th>
                      <th className="px-6 py-3">Region</th>
                      <th className="px-6 py-3">Difficulty</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {treks.map((trek) => {
                      const firstImg = trek.images?.split("|")[0];
                      return (
                        <tr
                          key={trek.id}
                          className="hover:bg-slate-50/50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                {firstImg && (
                                  <Image
                                    src={firstImg}
                                    alt={trek.title}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {trek.title}
                                </p>
                                <p className="text-xs text-slate-400 font-mono">
                                  {trek.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-600">
                              {trek.region?.name ?? "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                difficultyColor[trek.difficulty] ??
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {trek.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {trek.durationDays}d
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            ${trek.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  setActiveForm({ type: "edit-trek", trek })
                                }
                                className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmDelete({
                                    type: "trek",
                                    id: trek.id,
                                    name: trek.title,
                                  })
                                }
                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
