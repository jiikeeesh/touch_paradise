"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "category" | "service";
    id: string;
    name: string;
  } | null>(null);
  const [showServices, setShowServices] = useState(true);
  const [showCategories, setShowCategories] = useState(true);

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
                className="flex-1 px-4 py-2 border rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete.type === "category" ? handleDeleteCategory(confirmDelete.id) : handleDeleteService(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
              >
                {deletingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Categories Section ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-bold text-slate-900">Service Categories</h2>
          </div>
          <button onClick={() => setActiveForm({ type: "new-category" })} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {activeForm?.type === "new-category" && (
          <div className="p-6 bg-slate-50 border-b">
            <CategoryForm onSuccess={(c) => { setCategories([c, ...categories]); setActiveForm(null); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}
        {activeForm?.type === "edit-category" && (
          <div className="p-6 bg-slate-50 border-b">
            <CategoryForm initial={activeForm.category} onSuccess={(c) => { setCategories(categories.map(x => x.id === c.id ? c : x)); setActiveForm(null); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}

        <div className="divide-y">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
              <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100">
                {cat.image && <Image src={cat.image} alt={cat.name} fill sizes="60px" className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{cat.name}</p>
                <p className="text-xs text-slate-400">{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveForm({ type: "edit-category", category: cat })} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setConfirmDelete({ type: "category", id: cat.id, name: cat.name })} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Service Items Section ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-900">Service Items</h2>
          </div>
          <button disabled={categories.length === 0} onClick={() => setActiveForm({ type: "new-service" })} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {activeForm?.type === "new-service" && (
          <div className="p-6 bg-slate-50 border-b">
            <ServiceForm categories={categories} onSuccess={(s) => { setServices([s, ...services]); setActiveForm(null); fetchAll(); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}
        {activeForm?.type === "edit-service" && (
          <div className="p-6 bg-slate-50 border-b">
            <ServiceForm initial={activeForm.service} categories={categories} onSuccess={(s) => { setServices(services.map(x => x.id === s.id ? s : x)); setActiveForm(null); }} onCancel={() => setActiveForm(null)} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {svc.images?.split("|")[0] && <Image src={svc.images.split("|")[0]} alt="" fill sizes="50px" className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-semibold">{svc.title}</p>
                        <p className="text-xs text-slate-400">{svc.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{svc.category?.name ?? "—"}</td>
                  <td className="px-6 py-4 font-semibold">${svc.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setActiveForm({ type: "edit-service", service: svc })} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDelete({ type: "service", id: svc.id, name: svc.title })} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
