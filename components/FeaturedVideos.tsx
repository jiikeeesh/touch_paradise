"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Pause,
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

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Sunrise at Everest Base Camp",
    location: "Khumbu, Nepal",
    duration: "1:24",
    cover: "/everest.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "2",
    title: "Annapurna Circuit Highlights",
    location: "Annapurna, Nepal",
    duration: "2:10",
    cover: "/annapurna.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "3",
    title: "Mardi Himal Ridge Walk",
    location: "Pokhara, Nepal",
    duration: "1:45",
    cover: "/mardi.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "4",
    title: "Langtang Valley Morning",
    location: "Langtang, Nepal",
    duration: "0:58",
    cover: "/langtang.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "5",
    title: "Gosaikunda Sacred Lake",
    location: "Rasuwa, Nepal",
    duration: "1:30",
    cover: "/gosaikunda.png",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
];

// ─── Lightbox Modal ───────────────────────────────────────────────────────────
const Lightbox = ({
  video,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  video: Video;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => setPlaying(false));

    const onTime = () => setProgress((el.currentTime / el.duration) * 100);
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [video.id]);

  // Close on Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [hasPrev, hasNext, onClose, onPrev, onNext]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    playing ? el.pause() : el.play();
    setPlaying(!playing);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Portrait Video Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden bg-black shadow-2xl"
        style={{ aspectRatio: "9/16", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-cover"
          playsInline
          muted={muted}
          loop
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          <div>
            <p className="text-white font-bold text-sm leading-snug drop-shadow">{video.title}</p>
            <p className="text-white/70 text-xs">{video.location}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Center play/pause tap zone */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <AnimatePresence>
            {!playing && (
              <motion.div
                key="pause-icon"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress bar */}
          <div
            className="h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleScrub}
          >
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 text-white text-sm font-semibold"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Prev / Next arrows */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {/* Note: dot indicators map omitted for dynamic lengths to prevent layout breaking on too many videos */}
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const FeaturedVideos = () => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setVideos(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch videos from server", err);
      }
    };
    fetchVideos();
  }, []);

  const openVideo = (index: number) => setActiveIndex(index);
  const closeVideo = () => setActiveIndex(null);
  const prevVideo = () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const nextVideo = () =>
    setActiveIndex((i) => (i !== null && i < videos.length - 1 ? i + 1 : i));

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3">
              On the Trail
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Featured <span className="text-emerald-400">Videos</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-lg">
              Get a taste of what awaits you — raw, unfiltered moments from our expeditions
              across the Himalayas.
            </p>
          </div>

          {/* Scroll arrows — desktop only */}
          <div className="hidden md:flex gap-3">
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
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex-shrink-0 snap-start group cursor-pointer"
              style={{ width: "200px" }}
              onClick={() => openVideo(index)}
            >
              {/* Portrait Card — 9:16 ratio */}
              <div
                className="relative rounded-3xl overflow-hidden bg-slate-800 shadow-xl"
                style={{ aspectRatio: "9/16" }}
              >
                <Image
                  src={video.cover}
                  alt={video.title}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {video.duration}
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-emerald-500/80 transition-colors"
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </motion.div>
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

        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            video={videos[activeIndex]}
            onClose={closeVideo}
            onPrev={prevVideo}
            onNext={nextVideo}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < videos.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedVideos;
