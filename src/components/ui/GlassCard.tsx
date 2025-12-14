"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../providers/ThemeContext";
import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    tiltIntensity?: number;
    glowOnHover?: boolean;
}

export function GlassCard({
    children,
    className,
    tiltIntensity = 10,
    glowOnHover = true,
}: GlassCardProps) {
    const { theme, visualProgress } = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics for smooth movement
    const springConfig = { damping: 25, stiffness: 300 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

    // Glow position
    const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
    const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize to -0.5 to 0.5
        const normalizedX = (e.clientX - centerX) / rect.width;
        const normalizedY = (e.clientY - centerY) / rect.height;

        mouseX.set(normalizedX);
        mouseY.set(normalizedY);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    // Theme Layer Component to reduce repetition
    const ThemeLayer = ({ 
        mode, 
        opacity 
    }: { 
        mode: "sunrise" | "sunset", 
        opacity: number 
    }) => {
        const isSunrise = mode === "sunrise";
        
        return (
            <motion.div 
                className={cn(
                    "absolute inset-0 pointer-events-none transition-none", // Ensure no CSS transition conflicts
                    isSunrise ? "bg-white/20 border-white/30" : "bg-slate-900/40 border-purple-500/20",
                    "border rounded-2xl"
                )}
                style={{ opacity }}
            >
                {/* Neon border on hover */}
                {glowOnHover && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            background: isSunrise
                                ? "linear-gradient(135deg, rgba(255, 183, 77, 0.25), rgba(255, 224, 178, 0.1))"
                                : "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.1))",
                            opacity: isHovered ? 1 : 0,
                        }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                {/* Dynamic glow following cursor */}
                {glowOnHover && isHovered && (
                    <motion.div
                        className="absolute w-32 h-32 rounded-full blur-2xl top-0 left-0"
                        style={{
                            left: glowX,
                            top: glowY,
                            x: "-50%",
                            y: "-50%",
                            background: isSunrise
                                ? "radial-gradient(circle, rgba(255, 183, 77, 0.25), transparent)"
                                : "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)",
                        }}
                    />
                )}

                {/* Complex Glass Lighting */}
                <div
                    className="absolute inset-0 rounded-2xl z-20"
                    style={{
                        background: isSunrise
                            ? `
                  linear-gradient(225deg, rgba(255,255,255,0.7) 0%, transparent 40%),
                  linear-gradient(45deg, rgba(20,50,50,0.2) 0%, transparent 40%),
                  linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 3%)
                `
                            : `
                  linear-gradient(225deg, rgba(255,255,255,0.1) 0%, transparent 40%),
                  linear-gradient(45deg, rgba(0,0,0,0.7) 0%, transparent 45%),
                  linear-gradient(to top, rgba(139, 92, 246, 0.15) 0%, transparent 3%)
                `,
                        mixBlendMode: "overlay",
                    }}
                />

                {/* Physical Edge Simulation */}
                <div
                    className="absolute inset-0 rounded-2xl z-30"
                    style={{
                        boxShadow: isSunrise
                            ? "inset 1px 1px 0 rgba(255,255,255,0.6), inset -1px -1px 0 rgba(0,0,0,0.05)"
                            : "inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.4)",
                    }}
                />
            </motion.div>
        );
    };

    return (
        <motion.div
            ref={cardRef}
            className={cn(
                "relative rounded-2xl overflow-hidden gpu-accelerate",
                "backdrop-blur-xl", // blur on parent
                className
            )}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
                boxShadow: "0 8px 32px var(--glass-shadow)",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            }}
        >
            {/* Sunset Layer (Base) - Opacity decreases as we go to Sunrise */}
            <ThemeLayer mode="sunset" opacity={1 - visualProgress} />
            
            {/* Sunrise Layer (Overlay) - Opacity increases as we go to Sunrise */}
            <ThemeLayer mode="sunrise" opacity={visualProgress} />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

export default GlassCard;
