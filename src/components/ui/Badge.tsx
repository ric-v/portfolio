"use client";

import { useTheme } from "../providers/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const { theme, visualProgress } = useTheme();

  // Start with base styles
  const baseStyles = "px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 relative overflow-hidden";

  return (
    <span className={cn(baseStyles, className)}>
      {/* Background Layer - Sunrise */}
      <motion.span
        className="absolute inset-0 z-0 bg-orange-500/15"
        style={{ opacity: visualProgress }}
      />

      {/* Background Layer - Sunset */}
      <motion.span
        className="absolute inset-0 z-0 bg-purple-500/15"
        style={{ opacity: 1 - visualProgress }}
      />

      {/* Content (Text Color) */}
      {/* using mix-blend-mode or just absolute positioning for text might be tricky for selectable text.
                Instead, let's just use style for color which transitions fine via CSS/JS.
                Or for strictly correct interpolation:
             */}
      <span className="relative z-10" style={{ color: "transparent" }}>
        <span className="absolute inset-0" style={{ color: "var(--accent-primary)", opacity: 1 }}>{children}</span>
        {/* Actually, --accent-primary transitions via globals.css now! 
                     So we can just use that variable and rely on the global transition 
                     we added in the previous step. That's much simpler.
                 */}
      </span>
      <span className="relative z-10" style={{ color: "var(--accent-primary)" }}>
        {children}
      </span>
    </span>
  );
}
