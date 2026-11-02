"use client";

import { useId } from "react";

interface WireframeSurfaceProps {
  className?: string;
  variant?: "card" | "hero" | "subtle";
  showMotion?: boolean;
}

/**
 * Architectural wireframe grid overlay that reveals under the mouse cursor.
 * Features:
 * - High-precision technical CAD/coordinate grid
 * - Crosshair intersection nodes and sub-dots
 * - Top-left directional light wash that cascades across the surface
 * - Streaming telemetry motion lines that flow along the grid (slow & purposeful)
 * - Interactive wide radar pulse at cursor position
 * - Radial spotlight mask following local (--mx, --my) or global (--mouse-x, --mouse-y)
 */
export function WireframeSurface({
  className = "",
  variant = "card",
  showMotion = true,
}: WireframeSurfaceProps) {
  const id = useId();

  return (
    <div
      aria-hidden="true"
      className={`wireframe-surface ${variant === "hero" ? "wireframe-hero-backdrop" : ""} ${className}`}
    >
      {/* Directional light beam falling from top-left */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--sheen-soft)] via-transparent to-transparent opacity-50" />

      {/* Precision CAD grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${id}`}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            {/* Orthogonal grid lines */}
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              className="text-[var(--wireframe-line)]"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            {/* Coordinate intersection ticks */}
            <path
              d="M 0 3.5 L 0 -3.5 M -3.5 0 L 3.5 0"
              fill="none"
              stroke="currentColor"
              className="text-[var(--wireframe-cross)]"
              strokeWidth="1"
            />
            {/* Center sub-dot */}
            <circle
              cx="16"
              cy="16"
              r="0.8"
              fill="currentColor"
              className="text-[var(--wireframe-subtle)]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* Streaming motion lines flowing along the grid (slow, steady, purposeful) */}
      {showMotion && <div className="wireframe-motion-layer" />}

      {/* Dynamic radar ring following the cursor */}
      <div className="wireframe-radar" />
    </div>
  );
}
