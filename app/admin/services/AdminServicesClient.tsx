"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Settings,
  Briefcase,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { CategoryForm, ServiceForm } from "./ServiceForms";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  _count?: { services: number };
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationDays: number | null;
  price: number;
  itinerary: string;
  images: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
}

type ActiveForm =
  | { type: "new-category" }
  | { type: "edit-category"; category: Category }
  | { type: "new-service" }
  | { type: "edit-service"; service: Service }
  | null;

export default function AdminServicesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const editCategoryFormRef = useRef<HTMLDivElement>(null);
  const editServiceFormRef = useRef<HTMLDivElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "category" | "service";
    id: string;
    name: string;
  } | null>(null);
  const [showServices, setShowServices] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState<"asc" | "desc">("asc");
  const [serviceSortOrder, setServiceSortOrder] = useState<"asc" | "desc">("asc");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const ts = Date.now();
      const [catRes, svcRes] = await Promise.all([
        fetch(`/api/service-categories?t=${ts}`),
        fetch(`/api/services?t=${ts}`),
      ]);
      if (!catRes.ok || !svcRes.ok) throw new Error("Failed to load data");
      const [catData, svcData] = await Promise.all([
        catRes.json(),
        svcRes.json(),
      ]);
      setCategories(catData);
      setServices(svcData);
    } catch {
      setError("Failed to load services and categories. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/service-categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setServices((prev) => prev.filter((s) => s.categoryId !== id));
    } catch {
      setError("Failed to delete category.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete service item.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
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
              Delete {confirmDelete.type === "category" ? "Category" : "Service"}?
            </h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              <strong>&quot;{confirmDelete.name}&quot;</strong> will be permanently deleted.
              {confirmDelete.type === "category" && " All services in this category will also be deleted."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete.type === "category" ? handleDeleteCategory(confirmDelete.id) : handleDeleteService(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {deletingId === confirmDelete.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Categories Section ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Service Categories</h2>
              <p className="text-xs text-slate-400">{categories.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCategorySortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="p-2 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-transparent hover:bg-slate-100 transition text-slate-400 flex items-center gap-1.5"
              title={`Sort ${categorySortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-xs font-semibold sm:hidden inline-block">{categorySortOrder === "asc" ? "A-Z" : "Z-A"}</span>
            </button>
            <button onClick={() => setActiveForm(activeForm?.type === "new-category" ? null : { type: "new-category" })} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Category
            </button>
            <button
              onClick={() => setShowCategories((v) => !v)}
              className="p-2 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-transparent hover:bg-slate-100 transition text-slate-400"
            >
              {showCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {activeForm?.type === "new-category" && (
          <div className="p-6 bg-slate-50 border-b">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
              New Category
            </p>
            <CategoryForm onSuccess={(c) => { setCategories([c, ...categories]); setActiveForm(null); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}
        {activeForm?.type === "edit-category" && (
          <div ref={editCategoryFormRef} className="p-6 bg-emerald-50 border-b">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
              ✏️ Edit Category
            </p>
            <CategoryForm initial={activeForm.category} onSuccess={(c) => { setCategories(categories.map(x => x.id === c.id ? c : x)); setActiveForm(null); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}

        {showCategories && (
          <div className="divide-y">
            {categories.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No categories yet. Add your first one above.</p>
              </div>
            ) : (() => {
              const sortedCategories = [...categories].sort((a, b) => {
                const cmp = a.name.localeCompare(b.name);
                return categorySortOrder === "asc" ? cmp : -cmp;
              });
              return sortedCategories.map(cat => (
                <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                  <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill sizes="60px" className="object-cover" />
                    ) : (
                      <Settings className="w-5 h-5 text-slate-300 m-auto mt-3.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{cat.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveForm({ type: "edit-category", category: cat });
                        setTimeout(() => editCategoryFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                      }}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: "category", id: cat.id, name: cat.name })}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* ─── Service Items Section ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Service Items</h2>
              <p className="text-xs text-slate-400">{services.length} total</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
                />
              </div>
              <button
                onClick={() => setServiceSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="p-2 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-transparent hover:bg-slate-100 transition text-slate-400 flex-shrink-0"
                title={`Sort ${serviceSortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <button disabled={categories.length === 0} onClick={() => setActiveForm(activeForm?.type === "new-service" ? null : { type: "new-service" })} className="flex flex-1 sm:flex-none items-center justify-center bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition gap-1.5 disabled:opacity-50">
                <Plus className="w-4 h-4" /> Add Service
              </button>
              <button
                onClick={() => setShowServices((v) => !v)}
                className="p-2 rounded-xl bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-transparent hover:bg-slate-100 transition text-slate-400"
              >
                {showServices ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {activeForm?.type === "new-service" && (
          <div className="p-6 bg-slate-50 border-b">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
              New Service
            </p>
            <ServiceForm categories={categories} onSuccess={(s) => { setServices([s, ...services]); setActiveForm(null); fetchAll(); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}
        {activeForm?.type === "edit-service" && (
          <div ref={editServiceFormRef} className="p-6 bg-blue-50 border-b">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
              ✏️ Edit Service
            </p>
            <ServiceForm initial={activeForm.service} categories={categories} onSuccess={(s) => { setServices(services.map(x => x.id === s.id ? s : x)); setActiveForm(null); fetchAll(); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}

        {showServices && (
          <div className="overflow-visible">
            {services.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No services yet. Add your first one above.</p>
              </div>
            ) : (() => {
              const filteredServices = services.filter((s) =>
                s.title.toLowerCase().includes(serviceSearchQuery.toLowerCase())
              ).sort((a, b) => {
                const cmp = a.title.localeCompare(b.title);
                return serviceSortOrder === "asc" ? cmp : -cmp;
              });
              return filteredServices.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No services match &quot;{serviceSearchQuery}&quot;.</p>
                </div>
              ) : (
              <div className="divide-y divide-slate-100">
                {filteredServices.map((svc) => (
                  <div key={svc.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {svc.images?.split("|")[0] ? (
                          <Image src={svc.images.split("|")[0]} alt="" fill sizes="60px" className="object-cover" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-slate-300 m-auto mt-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{svc.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {svc.category?.name ?? "—"}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ${svc.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => {
                          setActiveForm({ type: "edit-service", service: svc });
                          setTimeout(() => editServiceFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                        }}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ type: "service", id: svc.id, name: svc.title })}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

