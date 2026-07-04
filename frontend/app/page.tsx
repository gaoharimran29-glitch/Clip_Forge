"use client";

import { useState, useRef } from "react";
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
  filename: string;
  download_url: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");

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

        {/* ================= Results ================= */}
        <AnimatePresence>
          {clips && clips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-28 w-full"
            >
              <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7C5CFC]/20 bg-[#7C5CFC]/10 text-[#a996ff]">
                    <Video className="h-4.5 w-4.5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight">
                    Your generated shorts
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {clips.length} clip{clips.length > 1 ? "s" : ""} ready
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clips.map((clip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -6 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl transition-colors hover:border-[#7C5CFC]/30"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#7C5CFC]/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="relative mx-auto mb-4 aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${clip.download_url}`}
                          controls
                          onPlay={() => handleVideoPlay(index)}
                          className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 transition-opacity group-hover:opacity-0">
                          <div className="rounded-full border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
                            <Play className="h-5 w-5 fill-white text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="px-1">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white/90">
                            Clip #{clip.id}
                          </h3>
                          <span className="rounded-md bg-gradient-to-r from-[#7C5CFC]/20 to-[#35E7D2]/20 px-2 py-0.5 text-[11px] font-bold text-[#a996ff]">
                            {clip.score}/10
                          </span>
                        </div>
                        <p className="mb-4 text-xs leading-relaxed text-white/40">
                          {clip.reason ||
                            "No description parsed for this segment."}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${clip.download_url}`}
                      download
                      className="relative flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                      Download clip
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}