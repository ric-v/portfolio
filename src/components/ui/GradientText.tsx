"use client";

import { motion } from "framer-motion";
import { useTheme } from "../providers/ThemeContext";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Optional: override theme colors.
   * Default sunrise: orange/amber
   * Default sunset: purple/pink
   */
  colors?: {
    sunrise: string;
    sunset: string;
  };
  /**
   * Optional: manually pass visualProgress for synchronization.
   * If not provided, it will use the global visualProgress from ThemeContext.
   */
  visualProgress?: number;
}

export function GradientText({
  children,
  className,
  colors,
  visualProgress: propProgress,
}: GradientTextProps) {
  const { theme, visualProgress: ctxProgress } = useTheme();

  // Use prop if provided, otherwise context
  const progress = propProgress ?? ctxProgress;

  // Default gradients
  // Sunrise: Orange -> Amber
  const sunriseGradient = colors?.sunrise || "linear-gradient(135deg, #ff7e33, #ff9500)";
  // Sunset: Purple -> Pink
  const sunsetGradient = colors?.sunset || "linear-gradient(135deg, #8b5cf6, #ec4899)";

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Base Layer (Sunset/Dark) - Opacity decreases as we go to Sunrise (1) */}
      <motion.span
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: sunsetGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          backgroundSize: "200% auto",
          opacity: 1 - progress,
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        {children}
      </motion.span>

      {/* Overlay Layer (Sunrise/Light) - Opacity increases as we go to Sunrise (1) */}
      {/* Using relative positioning here ensures the parent span takes up space */}
      <motion.span
        className="relative z-10 block"
        style={{
          backgroundImage: sunriseGradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          backgroundSize: "200% auto",
          opacity: progress,
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        {children}
      </motion.span>
    </span>
  );
}
