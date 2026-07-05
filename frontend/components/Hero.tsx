"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
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
  );
}
