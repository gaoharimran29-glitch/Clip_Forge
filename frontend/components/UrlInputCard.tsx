"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Link2, Video } from "lucide-react";

interface UrlInputCardProps {
  url: string;
  onUrlChange: (url: string) => void;
  loading: boolean;
  progress: number;
  step: string;
  error: string | null;
  onGenerate: () => void;
}

export function UrlInputCard({
  url,
  onUrlChange,
  loading,
  progress,
  step,
  error,
  onGenerate,
}: UrlInputCardProps) {
  return (
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
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-11 pr-4 text-[15px] text-white placeholder-white/25 outline-none transition-all focus:border-[#7C5CFC]/50 focus:bg-black/60 focus:ring-2 focus:ring-[#7C5CFC]/20 disabled:opacity-40"
            />
          </div>

          <motion.button
            onClick={onGenerate}
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
  );
}
