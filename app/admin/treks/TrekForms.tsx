"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Plus } from "lucide-react";

interface Region {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface RegionFormProps {
  initial?: Region;
  onSuccess: (region: Region) => void;
  onCancel: () => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Shared class strings so every input/textarea/select has consistent, readable styling
const inputCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const selectCls =
  "w-full border border-slate-200 bg-white text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const textareaCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none";

export function RegionForm({ initial, onSuccess, onCancel }: RegionFormProps) {
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
      // PROXY LOGIC: Send file to our own API route to avoid CORS
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const blob = await res.json();
      const url = blob.url;
      setImage(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const method = initial ? "PUT" : "POST";
      const url = initial ? `/api/regions/${initial.id}` : "/api/regions";
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Region Name *
          </label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="e.g. Khumbu"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Slug *
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. khumbu"
            className={inputCls + " font-mono"}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="A brief description of the region..."
          className={textareaCls}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Cover Image
        </label>
        <div className="flex items-start gap-3">
          {image && (
            <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
              <Image src={image} alt="Cover" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border border-dashed border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? "Saving..." : initial ? "Update Region" : "Create Region"}
        </button>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Trek Form
// ──────────────────────────────────────────────────────────────────────────────

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
}

interface TrekFormProps {
  initial?: Trek;
  regions: Region[];
  onSuccess: (trek: Trek) => void;
  onCancel: () => void;
}

const DIFFICULTIES = ["Easy", "Moderate", "Moderate–Hard", "Hard"];

export function TrekForm({ initial, regions, onSuccess, onCancel }: TrekFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "Moderate");
  const [durationDays, setDurationDays] = useState(String(initial?.durationDays ?? ""));
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [altitude, setAltitude] = useState(initial?.altitude ?? "");
  const [season, setSeason] = useState(initial?.season ?? "");
  const [itinerary, setItinerary] = useState(initial?.itinerary ?? "");
  const [images, setImages] = useState<string[]>(
    initial?.images ? initial.images.split("|").filter(Boolean) : []
  );
  const [regionId, setRegionId] = useState(initial?.regionId ?? "");
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
      // PROXY LOGIC: Send file to our own API route to avoid CORS
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const blob = await res.json();
      const url = blob.url;
      setImages((prev) => [...prev, url]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regionId) {
      setError("Please select a region");
      return;
    }
    setSaving(true);
    try {
      const method = initial ? "PUT" : "POST";
      const url = initial ? `/api/treks/${initial.id}` : "/api/treks";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          difficulty,
          durationDays: Number(durationDays),
          price: Number(price),
          altitude,
          season,
          itinerary,
          images: images.join("|"),
          regionId,
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. Everest Base Camp"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Slug *
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. everest-base-camp"
            className={inputCls + " font-mono"}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Describe the trek..."
          className={textareaCls}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Region *
          </label>
          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            required
            className={selectCls}
          >
            <option value="">Select…</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Difficulty *
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={selectCls}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Duration (days)
          </label>
          <input
            type="number"
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder="14"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Price (USD)
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1450"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Max Altitude
          </label>
          <input
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
            placeholder="e.g. 5,364m"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Best Season
          </label>
          <input
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="e.g. Mar–May, Sep–Nov"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Itinerary{" "}
          <span className="text-slate-400 normal-case font-normal">
            (one entry per line, e.g. &quot;Day 1: Kathmandu to Lukla&quot;)
          </span>
        </label>
        <textarea
          value={itinerary}
          onChange={(e) => setItinerary(e.target.value)}
          rows={6}
          placeholder={"Day 1: Fly Kathmandu → Lukla, trek to Phakding\nDay 2: Trek to Namche Bazaar"}
          className={textareaCls + " font-mono"}
        />
      </div>

      {/* Image gallery */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Images
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200"
            >
              <Image src={img} alt={`Image ${idx + 1}`} fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center w-24 h-20 border border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition disabled:opacity-50 text-xs gap-1"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {uploading ? "Uploading" : "Add Photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? "Saving..." : initial ? "Update Trek" : "Create Trek"}
        </button>
      </div>
    </form>
  );
}
