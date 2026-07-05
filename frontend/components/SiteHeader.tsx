"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
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
  );
}
