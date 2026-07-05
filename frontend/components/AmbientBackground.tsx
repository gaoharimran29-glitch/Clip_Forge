"use client";

import { motion } from "framer-motion";

export function AmbientBackground({ loading }: { loading: boolean }) {
  return (
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
  );
}
