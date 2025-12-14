"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "../providers/ThemeContext";

export function Footer() {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-6">
            {/* Ambient gradient overlay - very subtle, near-still */}
            <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="absolute bottom-0 left-1/2 w-[600px] h-[300px] -translate-x-1/2"
                    style={{
                        background: theme === "sunrise"
                            ? "radial-gradient(ellipse at center bottom, rgba(255, 149, 0, 0.1) 0%, transparent 70%)"
                            : "radial-gradient(ellipse at center bottom, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
                    }}
                    animate={{
                        opacity: [0.5, 0.7, 0.5],
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Separator line with glow */}
                <motion.div
                    className="h-px mb-12 rounded-full"
                    style={{
                        background: theme === "sunrise"
                            ? "linear-gradient(90deg, transparent, var(--accent-primary), transparent)"
                            : "linear-gradient(90deg, transparent, var(--accent-primary), transparent)",
                        boxShadow: `0 0 20px ${theme === "sunrise" ? "rgba(255, 149, 0, 0.5)" : "rgba(139, 92, 246, 0.5)"}`,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo/Name */}
                    <motion.div
                        className="text-center md:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3
                            className="text-xl font-bold mb-1"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Creative Developer
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Crafting digital experiences
                        </p>
                    </motion.div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-6">
                        {["Home", "About", "Projects", "Contact"].map((link) => (
                            <Link
                                key={link}
                                href={link === "Home" ? "/" : `/pages/${link.toLowerCase()}`}
                                className="text-sm transition-colors relative group"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <span className="group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                                    {link}
                                </span>
                                <span
                                    className="absolute -bottom-1 left-0 w-full h-px origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                    style={{ backgroundColor: "var(--accent-primary)" }}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Copyright */}
                    <motion.p
                        className="text-sm text-center md:text-right"
                        style={{ color: "var(--text-muted)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        © {currentYear} All rights reserved
                    </motion.p>
                </div>

                {/* Ambient floating particles - very slow, subtle */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                backgroundColor: theme === "sunrise"
                                    ? "rgba(255, 149, 0, 0.4)"
                                    : "rgba(139, 92, 246, 0.4)",
                                left: `${20 + i * 30}%`,
                                bottom: "20%",
                            }}
                            animate={{
                                y: [-10, -30, -10],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 6 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
