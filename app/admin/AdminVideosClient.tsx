"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Video as VideoIcon,
  Plus,
  Pencil,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  id: string;
  title: string;
  location: string;
  duration: string;
  cover: string;
  src: string;
}

export default function AdminVideosClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Upload modal ──────────────────────────────────────────────
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [srcFile, setSrcFile] = useState<File | null>(null);

  // ── Edit modal ────────────────────────────────────────────────
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) setVideos(await res.json());
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  // ── Upload ────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !srcFile) return;
    setAdding(true);
    try {
      // Upload video file
      const fd = new FormData();
      fd.append("file", srcFile);
      const uploadRes = await fetch("/api/media", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || "Upload failed");
      const { url: srcUrl } = await uploadRes.json();

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, duration: "", cover: "", src: srcUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");

      setTitle(""); setLocation(""); setSrcFile(null);
      setIsUploadOpen(false);
      fetchVideos();
    } catch (error: unknown) {
      alert((error as Error).message || "Failed to create video");
    }
    setAdding(false);
  };

  // ── Edit ──────────────────────────────────────────────────────
  const openEdit = (v: Video) => {
    setEditVideo(v);
    setEditTitle(v.title);
    setEditLocation(v.location);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVideo) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/videos/${editVideo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, location: editLocation }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setEditVideo(null);
      fetchVideos();
    } catch (error: unknown) {
      alert((error as Error).message || "Failed to update video");
    }
    setSaving(false);
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: string, t: string) => {
    if (!confirm(`Delete "${t}"?`)) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (res.ok) fetchVideos();
    } catch (err) {
      console.error("Failed to delete video", err);
    }
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-950 py-16 -mx-4 sm:mx-0 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">
              Admin Interface
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Manage <span className="text-emerald-400">Timeline</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scroll("left")} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll("right")} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex-shrink-0 snap-start group relative w-[65vw] sm:w-[200px] max-w-[280px]"
            >
              <div className="relative rounded-3xl overflow-hidden bg-slate-800 shadow-xl" style={{ aspectRatio: "9/16" }}>
                {/* Autoplay muted preview */}
                <video
                  src={video.src}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 sm:opacity-0 group-hover:opacity-100 opacity-100 transition">
                  <button
                    onClick={() => openEdit(video)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
                    title="Edit Video"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{video.title}</p>
                  <p className="text-white/60 text-[11px] font-medium">{video.location}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add card */}
          <div
            className="flex-shrink-0 snap-start cursor-pointer group w-[65vw] sm:w-[200px] max-w-[280px]"
            onClick={() => setIsUploadOpen(true)}
          >
            <div
              className="relative rounded-3xl overflow-hidden border-2 border-dashed border-emerald-500/30 group-hover:border-emerald-400 bg-emerald-500/5 transition-colors flex flex-col items-center justify-center gap-3 text-center px-4"
              style={{ aspectRatio: "9/16" }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7" />
              </div>
              <p className="text-emerald-400 font-bold tracking-tight">Add Your Video</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upload Modal ── */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <VideoIcon className="w-5 h-5 text-emerald-600" />
                  Upload New Video
                </h3>
                <button onClick={() => setIsUploadOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Sunrise at Everest"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Khumbu, Nepal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Video File (MP4, WebM)</label>
                    <input
                      type="file" accept="video/mp4,video/webm" required
                      onChange={(e) => setSrcFile(e.target.files?.[0] || null)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit" disabled={adding}
                      className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      {adding ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Save to Timeline"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-600" />
                  Edit Video
                </h3>
                <button onClick={() => setEditVideo(null)} className="p-2 hover:bg-blue-100 rounded-full transition">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text" required value={editLocation} onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button" onClick={() => setEditVideo(null)}
                      className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={saving}
                      className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
