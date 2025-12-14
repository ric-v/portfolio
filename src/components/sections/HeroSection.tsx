"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "../ui/Button";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";

export function HeroSection() {
  const { theme, visualProgress } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-24"
      style={{ y, opacity, scale }}
    >
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.p
          className="text-lg md:text-xl mb-4"
          style={{ color: "var(--text-muted)" }}
          variants={itemVariants}
        >
          Hello, I&apos;m Richie Varghese
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
          variants={itemVariants}
        >
          <span>
            I Engineer {" "}
            <GradientText>Scalable Systems</GradientText>
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10"
          style={{ color: "var(--text-secondary)" }}
          variants={itemVariants}
        >
          Tech Lead and Principal Engineer specializing in distributed systems, and data-intensive platforms.
          <br />I architect, design, and deliver software that stays fast, reliable, and observable under real-world load.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button
              variant="solid"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
            </Button>
            <Button
              variant="hollow"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Me
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
