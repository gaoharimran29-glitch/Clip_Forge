"use client";

import { forwardRef, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";
import { ClipCard } from "@/components/ClipCard";
import type { Clip } from "@/types/clip";

interface ResultsSectionProps {
  clips: Clip[] | null;
  videoRefs: MutableRefObject<(HTMLVideoElement | null)[]>;
  onVideoPlay: (index: number) => void;
  onDownloadAll: () => void;
}

export const ResultsSection = forwardRef<HTMLDivElement, ResultsSectionProps>(
  function ResultsSection({ clips, videoRefs, onVideoPlay, onDownloadAll }, ref) {
    return (
      <AnimatePresence>
        {clips && clips.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            ref={ref}
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
                onClick={onDownloadAll}
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
                  onVideoPlay={onVideoPlay}
                />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    );
  },
);
