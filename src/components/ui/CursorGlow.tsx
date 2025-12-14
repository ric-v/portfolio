"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../providers/ThemeContext";

export function CursorGlow() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const lastMoveRef = useRef<number>(Date.now());

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring animation for cursor following
    // Slightly stiffer for a tighter "ring" feel
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            lastMoveRef.current = Date.now();
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        // Hide cursor glow when idle
        const idleCheck = setInterval(() => {
            if (Date.now() - lastMoveRef.current > 3000) {
                setIsVisible(false);
            }
        }, 1000);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            clearInterval(idleCheck);
        };
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-50 flex items-center justify-center"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
                width: 32,
                height: 32,
            }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
        >
            {/* 
               Subtle Ring with Glow 
               - Minimalist circle
               - Soft glow matching theme
            */}
            <div
                className="w-full h-full rounded-full border-[1.5px] transition-colors duration-500"
                style={{
                    borderColor: theme === "sunrise"
                        ? "rgba(255, 149, 0, 0.4)"
                        : "rgba(139, 92, 246, 0.5)",
                    boxShadow: theme === "sunrise"
                        ? "0 0 10px 1px rgba(255, 149, 0, 0.3), inset 0 0 10px rgba(255, 149, 0, 0.1)"
                        : "0 0 12px 1px rgba(139, 92, 246, 0.4), inset 0 0 12px rgba(139, 92, 246, 0.2)",
                    backgroundColor: theme === "sunrise"
                        ? "rgba(255, 149, 0, 0.05)"
                        : "rgba(139, 92, 246, 0.05)",
                }}
            />

            {/* Center dot (optional, keeping minimal for "subtle circle" request - maybe remove entirely? 
                User said "subtle circle with glow *around* the mouse pointer". 
                Usually this means the default cursor stays and this ring follows.
                Let's keep just the ring for now.
            */}
        </motion.div>
    );
}

export default CursorGlow;
