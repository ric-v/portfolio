"use client";

import { useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../providers/ThemeContext";
import { cn } from "@/lib/utils";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    magneticStrength?: number;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: "solid" | "hollow" | "ghost";
}

// ... (imports)

export function Button({
    children,
    className,
    magneticStrength = 0.4,
    onClick,
    variant = "solid",
}: ButtonProps) {
    const { theme, visualProgress } = useTheme();
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Outer container styles
    const getContainerStyles = () => {
        const base = "relative font-medium transition-all duration-300 isolate group";
        return cn(base, "px-6 py-3 rounded-xl", className);
    };

    // Text colors (Simple fade via CSS is okay for text usually, but let's be precise if needed)
    // For text, we can stick to class swapping because CSS transition handles color well.
    const getTextColors = () => {
        if (variant === "solid") return "text-white";
        // For hollow/ghost, we rely on the global CSS transition for color
        if (variant === "hollow") return theme === "sunrise" ? "text-orange-600" : "text-purple-300";
        return theme === "sunrise" ? "text-teal-700 hover:bg-teal-100/50" : "text-cyan-300 hover:bg-cyan-900/30";
    };

    const buttonVariants = {
        default: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    const glowVariants = {
        default: {
            opacity: 1,
            boxShadow: "0 8px 32px var(--glass-shadow)",
            scale: 1,
        },
        hover: {
            opacity: 1,
            boxShadow: "0 8px 32px var(--glass-shadow)",
            scale: variant === "hollow" ? 1.05 : 1,
        },
    };

    return (
        <motion.button
            ref={buttonRef}
            className={cn(getContainerStyles(), getTextColors())}
            onClick={onClick}
            initial="default"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
        >
            {/* BACKGROUND LAYERS FOR SMOOTH TRANSITION */}
            {variant === "solid" && (
                <>
                    {/* Sunset Gradient (Base) - Muted Purple/Slate */}
                    <div
                        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none bg-gradient-to-r from-slate-800 to-purple-900 group-hover:from-slate-700 group-hover:to-purple-800 transition-colors duration-300"
                        style={{ opacity: 1 }}
                    />
                    {/* Sunrise Gradient (Overlay) - Burnt Orange/Amber */}
                    <div
                        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none bg-gradient-to-r from-orange-700 to-amber-600 group-hover:from-orange-600 group-hover:to-amber-500 transition-colors duration-300"
                        style={{ opacity: visualProgress }}
                    />
                </>
            )}

            {variant === "hollow" && (
                <>
                    {/* Backgrounds for Hollow (Backdrop blur is shared? Yes) */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none backdrop-blur-xl border border-transparent transition-colors duration-300" />

                    {/* Sunset Border/Bg */}
                    <div
                        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none bg-slate-900/40 border-purple-500/20 border transition-colors duration-300"
                        style={{ opacity: 1 - visualProgress }}
                    />
                    {/* Sunrise Border/Bg */}
                    <div
                        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none bg-white/20 border-white/30 border transition-colors duration-300"
                        style={{ opacity: visualProgress }}
                    />
                </>
            )}

            {/* HOVER NEON BORDER */}
            {(variant === "hollow" || variant === "solid") && (
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ opacity: 0 }}
                    variants={{
                        hover: { opacity: 1 },
                        default: { opacity: 0 }
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Sunset Glow: Cyan Micro-glow */}
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(6, 182, 212, 0.1))", // Cyan
                            opacity: 1 - visualProgress,
                            boxShadow: "0 0 10px rgba(34, 211, 238, 0.2)"
                        }}
                    />
                    {/* Sunrise Glow: Subtle Cyan (replacing yellow) */}
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.4), rgba(103, 232, 249, 0.1))", // Cyan
                            opacity: visualProgress,
                            boxShadow: "0 0 8px rgba(34, 211, 238, 0.15)"
                        }}
                    />
                </motion.div>
            )}

            {/* LIGHTING LAYER (Shared, but colors differ slightly? Transparency mainly. Let's keep it simple) */}
            {(variant === "hollow" || variant === "solid") && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none z-[1]"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)", // simplified
                        opacity: visualProgress * 0.5 + 0.1 // Just simpler lighting
                    }}
                />
            )}

            {/* CONTENT */}
            <span className="relative z-10">{children}</span>

            {/* Shimmer for Solid */}
            {variant === "solid" && (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-[2]">
                    <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        whileHover={{
                            translateX: "100%",
                            transition: { duration: 0.6, ease: "easeInOut" }
                        }}
                    />
                </div>
            )}
        </motion.button>
    );
}

export default Button;
