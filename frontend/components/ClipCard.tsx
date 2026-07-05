"use client";

import { useRef, useState, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Play } from "lucide-react";
import { backendUrl } from "@/lib/backend";
import type { Clip } from "@/types/clip";

interface ClipCardProps {
  clip: Clip;
  index: number;
  videoRefs: MutableRefObject<(HTMLVideoElement | null)[]>;
  onVideoPlay: (index: number) => void;
}

export function ClipCard({
  clip,
  index,
  videoRefs,
  onVideoPlay,
}: ClipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = async () => {
    if (!clip.caption) return;
    await navigator.clipboard.writeText(clip.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: py * -8, y: px * 8 });
  };

  const clipUrl = backendUrl(clip.download_url);

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
            src={clipUrl}
            controls
            onPlay={() => onVideoPlay(index)}
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
        <div className="group/caption relative mb-4 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="pr-8 text-xs leading-relaxed text-white/60">
            {clip.caption || "No caption parsed for this segment."}
          </p>

          {clip.caption && (
            <button
              onClick={handleCopyCaption}
              className="absolute right-2 top-2 rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/40 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white group-hover/caption:opacity-100 sm:opacity-0"
              title="Copy caption"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-3.5 w-3.5 text-[#35E7D2]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>

      <a
        href={clipUrl}
        download
        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    </motion.div>
  );
}
