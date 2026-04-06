"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, X, Trash2, Video as VideoIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVideosClient() {
  const [videos, setVideos] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [srcFile, setSrcFile] = useState<File | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error("Failed to fetch videos from server", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !duration || !coverFile || !srcFile) return;

    setAdding(true);
    try {
      // Upload cover image
      const coverData = new FormData();
      coverData.append("file", coverFile);
      const coverRes = await fetch("/api/upload", { method: "POST", body: coverData });
      const coverJson = await coverRes.json();
      if (!coverRes.ok) throw new Error(coverJson.error || "Cover upload failed");

      // Upload video file
      const srcData = new FormData();
      srcData.append("file", srcFile);
      const srcRes = await fetch("/api/upload", { method: "POST", body: srcData });
      const srcJson = await srcRes.json();
      if (!srcRes.ok) throw new Error(srcJson.error || "Video upload failed");

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          duration,
          cover: coverJson.url,
          src: srcJson.url,
        }),
      });

      if (res.ok) {
        setTitle("");
        setLocation("");
        setDuration("");
        setCoverFile(null);
        setSrcFile(null);
        setIsModalOpen(false);
        fetchVideos();
      }
    } catch (error: any) {
      alert(error.message || "Failed to create video");
      console.error("Failed to create video", error);
    }
    setAdding(false);
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete "${titleStr}"?`)) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (res.ok) fetchVideos();
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
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

          {/* Scroll arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
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
              className="flex-shrink-0 snap-start group relative"
              style={{ width: "200px" }}
            >
              <div
                className="relative rounded-3xl overflow-hidden bg-slate-800 shadow-xl"
                style={{ aspectRatio: "9/16" }}
              >
                <Image
                  src={video.cover || "/everest.png"}
                  alt={video.title}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration badge */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {video.duration}
                </div>

                {/* DELETE ICON INTERCEPT OVERLAY */}
                <button
                  onClick={() => handleDelete(video.id, video.title)}
                  className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm text-white p-1.5 rounded-full z-10 transition shadow-lg opacity-0 group-hover:opacity-100"
                  title="Delete Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Central Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                    {video.title}
                  </p>
                  <p className="text-white/60 text-[11px] font-medium">{video.location}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Your Video card */}
          <div
            className="flex-shrink-0 snap-start cursor-pointer group"
            style={{ width: "200px" }}
            onClick={() => setIsModalOpen(true)}
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

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <VideoIcon className="w-5 h-5 text-emerald-600" />
                  Upload New Video
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Sunrise at Everest"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Khumbu, Nepal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. 1:24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (JPEG, PNG)</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Video File (MP4, WebM)</label>
                    <input
                      type="file"
                      accept="video/mp4, video/webm"
                      required
                      onChange={(e) => setSrcFile(e.target.files?.[0] || null)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={adding}
                      className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                    >
                      {adding ? "Uploading..." : "Save to Timeline"}
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
