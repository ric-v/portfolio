"use client";

import { motion, Variants } from "framer-motion";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { ReactNode } from "react";

interface GlobalSceneWrapperProps {
  children: ReactNode;
  className?: string;
}

// 4. Framer Motion Variants (CAMERA)
const sceneVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    opacity: 1,
  },

  anticipation: {
    y: 0, // No dip
    scale: 1,
    // @ts-ignore
    transition: { duration: 0.4, ease: "easeOut" as any }
  },

  liftoff: {
    y: 0, // No fly up
    scale: 1, // No shrink
    opacity: 0.2, // Fade out instead
    filter: "blur(10px)",
    // @ts-ignore
    transition: { duration: 0.8, ease: "easeInOut" }
  },

  drift: {
    scale: 1,
    y: 0,
    opacity: 0, // Hidden behind warp
    filter: "blur(20px)",
    // @ts-ignore
    transition: { duration: 1.6, ease: "linear" }
  },

  landing: {
    y: 0, // No fly down
    scale: 1,
    opacity: 0.2, // Fade in
    filter: "blur(10px)",
    // @ts-ignore
    transition: { duration: 1.2, ease: "easeOut" }
  },

  settle: {
    y: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    // @ts-ignore
    transition: { duration: 0.4, ease: "easeOut" as any }
  }
};

export function GlobalSceneWrapper({ children, className }: GlobalSceneWrapperProps) {
  const { phase } = usePlanetNavigation();

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* The Main Content Scene */}
      <motion.div
        className="relative z-10 w-full h-full origin-center will-change-transform"
        variants={sceneVariants}
        initial="idle"
        animate={phase}
      >
        {children}
      </motion.div>
    </div>
  );
}
