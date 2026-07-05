"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Video,
  Download,
  Link2,
  AlertCircle,
  Play,
  ArrowRight,
} from "lucide-react";

interface Clip {
  id: number;
  start: number;
  end: number;
  score: number;
  reason: string;
  caption: string;
  filename: string;
  download_url: string;
}

function ClipCard({
  clip,
  index,
  videoRefs,
  handleVideoPlay,
}: {
  clip: Clip;
  index: number;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  handleVideoPlay: (index: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: py * -8, y: px * 8 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      onAnimationComplete={() => setRevealed(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
    >
      {/* animated rim glow */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-[conic-gradient(from_0deg,transparent,rgba(124,92,252,0.6),transparent_40%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-[1px] rounded-3xl bg-[#050507]" />

      <div className="relative z-10">
        {/* Rank badge + score */}
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#35E7D2] px-3 text-xs font-black text-black">
            #{index + 1} PICK
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            className="relative overflow-hidden rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white"
          >
            {clip.score}/10
            {revealed && (
              <motion.span
                className="absolute inset-0 -skew-x-12 bg-white/40"
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            )}
          </motion.span>
        </div>

        {/* Video with scan-line reveal */}
        <div className="relative mx-auto mb-4 aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${clip.download_url}`}
            controls
            onPlay={() => handleVideoPlay(index)}
            className="h-full w-full object-cover"
          />
          {!revealed && (
            <motion.div
              className="absolute inset-0 z-20 bg-gradient-to-b from-[#7C5CFC] to-[#35E7D2]"
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15 + 0.2,
                ease: "easeInOut",
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 transition-opacity group-hover:opacity-0">
            <div className="rounded-full border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>
        </div>

        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/80">
          Why this reel will go viral
        </h4>
        <p className="mb-4 text-xs leading-relaxed text-white/50">
          {clip.reason || "No description parsed for this segment."}
        </p>

        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/80">
          Best caption for this clip
        </h4>
        <p className="mb-4 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs leading-relaxed text-white/60">
          {clip.caption || "No caption parsed for this segment."}
        </p>
      </div>

      <a
        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${clip.download_url}`}
        download
        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    </motion.div>
  );
}

function getYouTubeId(url: string) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\/\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [ytVideoId, setYtVideoId] = useState<string | null>(null);
  useEffect(() => {
    if (url) {
      setYtVideoId(getYouTubeId(url));
    } else {
      setYtVideoId(null);
    }
  }, [url]);
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clips && clips.length > 0) {
      const t = setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [clips]);

  const generateClips = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setClips(null);
    setProgress(0);
    setStep("Starting...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to start clip generation.");
      }

      const data = await response.json();
      const jobId = data.job_id;
      const jobToken = data.job_token;

      if (!jobId) {
        throw new Error("No job ID returned from backend.");
      }

      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/${jobId}?token=${encodeURIComponent(jobToken)}`,
      );

      eventSource.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data);

          if (update.progress !== undefined) {
            setProgress(update.progress);
          }

          if (update.step) {
            setStep(update.step);
          }

          if (update.status === "completed") {
            const result = update.result;

            if (result?.clips) {
              setClips(result.clips);
            } else if (result?.clip_generator?.clips) {
              setClips(result.clip_generator.clips);
            } else {
              setError("Job completed but no clips were returned.");
            }

            setLoading(false);
            eventSource.close();
          }

          if (update.status === "failed") {
            setError(update.error || "Clip generation failed.");
            setLoading(false);
            eventSource.close();
          }
        } catch (err) {
          console.error("Failed to parse SSE update:", err);
          setError("Invalid update received from server.");
          setLoading(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setError("Lost connection to progress stream.");
        setLoading(false);
        eventSource.close();
      };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleVideoPlay = (currentIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  };

  const downloadAllClips = async () => {
    if (!clips) return;
    for (const clip of clips) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${clip.download_url}`,
      );
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = clip.filename || `clip-${clip.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050507] text-white antialiased selection:bg-[#7C5CFC]/30 selection:text-white">
      {/* ================= Ambient background system ================= */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* base grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* signature glow — pulses with progress while a job runs */}
        <motion.div
          className="absolute left-1/2 top-[-10%] h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,92,252,0.35) 0%, rgba(53,231,210,0.18) 45%, transparent 70%)",
          }}
          animate={
            loading
              ? { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }
              : { opacity: 0.55, scale: 1 }
          }
          transition={
            loading
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 1 }
          }
        />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#35E7D2]/10 blur-[160px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_78%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-32 pt-10 md:px-10">
        {/* ================= Header ================= */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#35E7D2] shadow-[0_0_20px_rgba(124,92,252,0.5)]">
              <Sparkles className="h-4 w-4 text-black" />
            </span>
            ClipForge
            <span className="text-white/30">.ai</span>
          </div>
        </motion.header>
          {/* ================= Hero ================= */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mb-14 flex flex-col items-center text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-md">
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#35E7D2] bg-clip-text text-transparent">
                AI-powered
              </span>
              retention analysis, frame by frame
            </div>

            <h1 className="text-balance text-5xl font-black leading-[1.02] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              Turn long videos
              <br />
              into{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-white via-[#c9c2ff] to-[#7C5CFC] bg-clip-text text-transparent">
                  viral shorts
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#35E7D2]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-white/45 md:text-lg">
              Paste a link. Our pipeline finds the highest-retention moments and
              cuts them into vertical, ready-to-post clips — automatically.
            </p>
          </motion.section>

          {/* ================= Input card ================= */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative w-full max-w-xl"
          >
            <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8">
              <div className="space-y-3">
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30 transition-colors group-focus-within:text-[#7C5CFC]">
                    <Link2 className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Paste a YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-11 pr-4 text-[15px] text-white placeholder-white/25 outline-none transition-all focus:border-[#7C5CFC]/50 focus:bg-black/60 focus:ring-2 focus:ring-[#7C5CFC]/20 disabled:opacity-40"
                  />
                </div>

                <motion.button
                  onClick={generateClips}
                  disabled={loading || !url}
                  whileTap={{ scale: loading || !url ? 1 : 0.98 }}
                  className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#5B3FE0] py-4 font-semibold text-white shadow-[0_0_30px_rgba(124,92,252,0.35)] transition-all disabled:cursor-not-allowed disabled:from-white/[0.06] disabled:to-white/[0.06] disabled:text-white/30 disabled:shadow-none"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex w-full flex-col items-center gap-3 px-2"
                      >
                        <div className="flex items-center gap-2.5 text-sm">
                          <span className="relative flex h-4 w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-white/80" />
                          </span>
                          <span>{step || "Processing..."}</span>
                          <span className="text-white/50">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-white to-[#35E7D2]"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 text-[15px]"
                      >
                        <Video className="h-4.5 w-4.5" />
                        Forge micro-clips
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex items-start gap-3 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300"
                  >
                    <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        
          {/* ================= Source Video Embed ================= */}
          <AnimatePresence>
            {ytVideoId && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-12 w-full max-w-2xl"
              >
                <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_0_5px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                  <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                    Source Video
                  </h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytVideoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        {/* ================= Results — Cinematic Reveal ================= */}
        <AnimatePresence>
          {clips && clips.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              ref={resultsRef}
              className="relative mt-24 w-full scroll-mt-10"
            >
              {/* Section intro — big cinematic reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-16 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="mb-5 flex items-center gap-2 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-4 py-1.5 text-xs font-semibold text-[#a996ff]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {clips.length} viral moment{clips.length > 1 ? "s" : ""}{" "}
                  extracted
                </motion.div>

                <h2 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-br from-white via-[#c9c2ff] to-[#7C5CFC] bg-clip-text text-transparent">
                    Ready to post.
                  </span>
                </h2>

                <button
                  onClick={downloadAllClips}
                  className="group relative mt-8 flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Download All Clips
                  <motion.span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#7C5CFC] to-[#35E7D2] opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </motion.div>

              {/* Card grid with 3D tilt + scan reveal */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {clips.map((clip, index) => (
                  <ClipCard
                    key={index}
                    clip={clip}
                    index={index}
                    videoRefs={videoRefs}
                    handleVideoPlay={handleVideoPlay}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
