"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Plus } from "lucide-react";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const selectCls =
  "w-full border border-slate-200 bg-white text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const textareaCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CategoryFormProps {
  initial?: Category;
  onSuccess: (category: Category) => void;
  onCancel: () => void;
}

export function CategoryForm({ initial, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initial) setSlug(slugify(val));
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const blob = await res.json();
      setImage(blob.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = initial ? "PUT" : "POST";
      const url = initial ? `/api/service-categories/${initial.id}` : "/api/service-categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      onSuccess(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category Name *</label>
          <input value={name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={textareaCls} />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Cover Image</label>
        <div className="flex items-start gap-3">
          {image && (
            <div className="relative w-24 h-20 rounded-xl overflow-hidden border">
              <Image src={image} alt="Cover" fill sizes="96px" className="object-cover" />
              <button type="button" onClick={() => setImage("")} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 border border-dashed rounded-xl px-4 py-3 text-sm hover:border-emerald-400 transition">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl border text-sm">Cancel</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {initial ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Service Item Form
// ──────────────────────────────────────────────────────────────────────────────

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
}

interface ServiceFormProps {
  initial?: Service;
  categories: Category[];
  onSuccess: (service: Service) => void;
  onCancel: () => void;
}

export function ServiceForm({ initial, categories, onSuccess, onCancel }: ServiceFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [durationDays, setDurationDays] = useState(String(initial?.durationDays ?? ""));
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [itinerary, setItinerary] = useState(initial?.itinerary ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ? initial.images.split("|").filter(Boolean) : []);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initial) setSlug(slugify(val));
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const blob = await res.json();
      setImages((prev) => [...prev, blob.url]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) { setError("Please select a category"); return; }
    setSaving(true);
    try {
      const method = initial ? "PUT" : "POST";
      const url = initial ? `/api/services/${initial.id}` : "/api/services";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, description,
          durationDays: durationDays ? Number(durationDays) : null,
          price: Number(price),
          itinerary,
          images: images.join("|"),
          categoryId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      onSuccess(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Title *</label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={selectCls}>
            <option value="">Select...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Duration (days)</label>
          <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Price *</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={textareaCls} />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Itinerary</label>
        <textarea value={itinerary} onChange={(e) => setItinerary(e.target.value)} rows={4} className={textareaCls + " font-mono"} placeholder="Day 1: ...\nDay 2: ..." />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border">
              <Image src={img} alt={`Img ${idx}`} fill sizes="96px" className="object-cover" />
              <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center w-24 h-20 border border-dashed rounded-xl text-slate-400 hover:border-emerald-400 transition gap-1">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span className="text-[10px]">{uploading ? "Uploading" : "Add Photo"}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl border text-sm">Cancel</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {initial ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  );
}
