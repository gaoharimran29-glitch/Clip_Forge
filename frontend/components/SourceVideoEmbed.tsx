"use client";

import { AnimatePresence, motion } from "framer-motion";

export function SourceVideoEmbed({ videoId }: { videoId: string | null }) {
  return (
    <AnimatePresence>
      {videoId && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_0_5px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              Source Video
            </h3>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
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
  );
}
