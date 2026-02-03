"use client";

import { motion } from "framer-motion";
import { type PlanetConfig } from "@/config/planets";

interface PlanetSurfaceArcProps {
  planet: PlanetConfig;
  /** 0 = full arc at bottom, 1 = shrunk to circle at center */
  transitionProgress?: number;
  /** Whether this is the departing planet (rises up) or arriving planet (comes down) */
  isArriving?: boolean;
}

export function PlanetSurfaceArc({
  planet,
  transitionProgress = 0,
  isArriving = false,
}: PlanetSurfaceArcProps) {
  // Calculate animation values based on progress
  // At progress 0: full arc at bottom
  // At progress 1: small circle at vanishing point (top for departing, comes from top for arriving)

  const scale = 1 - transitionProgress * 0.95; // 1 -> 0.05
  const translateY = isArriving
    ? -100 + transitionProgress * 100 // Start at -100vh, end at 0
    : -transitionProgress * 120; // Start at 0, end at -120vh (goes up and beyond)

  // Arc dimensions - starts as wide ellipse at bottom
  const arcHeight = 15; // vh at full size

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-visible"
      style={{
        height: `${arcHeight}vh`,
        zIndex: 5,
      }}
      animate={{
        scale,
        y: `${translateY}vh`,
        opacity: transitionProgress > 0.9 && !isArriving ? 0 : 1,
      }}
      transition={{
        duration: 0.1,
        ease: "linear",
      }}
    >
      {/* Planet surface - curved ellipse */}
      <div
        className="absolute w-[200vw] left-1/2 -translate-x-1/2"
        style={{
          height: "300vh",
          bottom: "-285vh",
          borderRadius: "50%",
          background: `
            radial-gradient(ellipse at 50% 0%, 
              ${planet.surface.glow}40 0%,
              ${planet.surface.primary} 20%,
              ${planet.surface.secondary} 60%,
              ${planet.atmosphere.bottom} 100%
            )
          `,
          boxShadow: `
            0 -20px 60px ${planet.surface.glow}50,
            0 -40px 100px ${planet.surface.glow}30,
            inset 0 10px 40px ${planet.surface.glow}20
          `,
        }}
      />

      {/* Horizon glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%,
            ${planet.surface.glow}60 20%,
            ${planet.surface.glow} 50%,
            ${planet.surface.glow}60 80%,
            transparent 100%
          )`,
          boxShadow: `0 0 20px ${planet.surface.glow}, 0 0 40px ${planet.surface.glow}50`,
        }}
      />

      {/* Atmospheric haze above surface */}
      <div
        className="absolute -top-20 left-0 right-0 h-24"
        style={{
          background: `linear-gradient(to top, 
            ${planet.atmosphere.bottom}80 0%,
            transparent 100%
          )`,
        }}
      />
    </motion.div>
  );
}

export default PlanetSurfaceArc;
