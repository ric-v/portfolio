"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { useTheme } from "../providers/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isSunrise = theme === "sunrise";

  return (
    <div className="relative w-32 h-32 overflow-visible pointer-events-auto z-50 flex items-center justify-center">
      {/* 
         DIFFUSE ATMOSPHERE (The "Glow" around the icon) 
         - No sharp edges
         - Large spread
         - Blends into background 
      */}
      <motion.div
        className="absolute inset-0 -m-20 rounded-full blur-[60px] pointer-events-none"
        style={{
          background: isSunrise
            ? "radial-gradient(circle, rgba(255, 183, 77, 0.5) 0%, rgba(255, 183, 77, 0.1) 50%, transparent 80%)"
            : "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 80%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core Intensity Glow (Closer to center) */}
      <motion.div
        className="absolute inset-0 -m-4 rounded-full blur-[20px] pointer-events-none"
        style={{
          background: isSunrise
            ? "rgba(255, 183, 77, 0.6)"
            : "rgba(139, 92, 246, 0.5)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Button
        variant="hollow"
        onClick={toggleTheme}
        className="p-0 bg-white/10 backdrop-blur-md border border-white/20 text-teal-800 dark:text-cyan-200 hover:bg-white/20 transition-all shadow-lg hover:shadow-cyan-500/20"
        aria-label={`Switch to ${isSunrise ? "sunset" : "sunrise"} theme`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSunrise ? (
            /* ==================== SUN (Day Mode) ==================== */
            <motion.div
              key="sun-container"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{
                duration: 2.5,
                ease: "easeInOut"
              }}
            >
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                {/* Sun Core */}
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #fff7ed, #ffb74d)",
                    boxShadow: "0 0 10px rgba(255, 183, 77, 0.8)" /* Reduced internal shadow, relying on outer glow */
                  }}
                />

                {/* Sun Rays (Subtle Rotary) */}
                <motion.div
                  className="absolute inset-0 -m-8 border-[1.5px] border-dashed border-orange-200/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : (
            /* ==================== MOON (Night Mode) ==================== */
            <motion.div
              key="moon-container"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{
                duration: 2.5,
                ease: "easeInOut"
              }}
            >
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                {/* Moon Core */}
                <div
                  className="w-14 h-14 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #f1f5f9, #64748b)",
                    boxShadow: "inset -6px -6px 12px rgba(0,0,0,0.5)"
                  }}
                >
                  <div className="absolute top-3 left-4 w-3 h-3 rounded-full bg-slate-500/20 shadow-inner" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-slate-500/20 shadow-inner" />
                  <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-slate-500/20 shadow-inner" />
                </div>

                {/* Moon Aura (Attached to object) */}
                <motion.div
                  className="absolute inset-0 -m-2 rounded-full blur-md opacity-40"
                  style={{ background: "#a78bfa" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}

export default ThemeToggle;

