"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";
import Link from "next/link";
import { portfolioConfig } from "@/config/portfolio";

// Helper component for smooth theme transitions
function ThemeImage({ lightSrc, darkSrc, alt, className, style = {} }: {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { visualProgress } = useTheme();

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* Light Mode Image */}
      <div
        className="absolute inset-0"
        style={{ opacity: visualProgress }}
      >
        <Image
          src={lightSrc}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>

      {/* Dark Mode Image */}
      <div
        className="absolute inset-0"
        style={{ opacity: 1 - visualProgress }}
      >
        <Image
          src={darkSrc}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    </div >
  );
}

export function AboutSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen py-24 px-6 flex flex-col justify-center"
      id="about"
      style={{ y, opacity, scale }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text Content */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between lg:block mb-6">
              <h2
                className="text-4xl md:text-5xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                About{" "}
                <GradientText colors={{
                  sunrise: "linear-gradient(135deg, #ff7e33, #ff9500)",
                  sunset: "linear-gradient(135deg, #8b5cf6, #22d3ee)"
                }}>
                  Me
                </GradientText>
              </h2>

              {/* Mobile Image */}
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden lg:hidden flex-shrink-0 border-2 border-[var(--text-primary)]">
                <ThemeImage
                  lightSrc={portfolioConfig.personalInfo.profileImage.light}
                  darkSrc={portfolioConfig.personalInfo.profileImage.dark}
                  alt="Profile"
                />
              </div>
            </div>

            <div className="space-y-4" style={{ color: "var(--text-secondary)" }}>
              {portfolioConfig.personalInfo.bio.map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            <motion.blockquote
              className="mt-8 p-6 rounded-lg relative overflow-hidden"
              style={{
                backgroundColor: "rgba(var(--primary-rgb), 0.05)",
                borderLeft: "4px solid var(--text-primary)",
              }}
              variants={itemVariants}
            >
              <div
                className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                style={{
                  background: "linear-gradient(45deg, transparent, var(--text-primary), transparent)",
                }}
              />
              <p
                className="text-lg md:text-xl italic font-medium relative z-10"
                style={{ color: "var(--text-primary)" }}
              >
                &quot;{portfolioConfig.personalInfo.quote}&quot;
              </p>
            </motion.blockquote>
          </motion.div>

          {/* Image (Desktop Only) */}
          <motion.div
            variants={itemVariants}
            className="relative h-full w-full rounded-2xl overflow-hidden hidden lg:block"
          >
            <div className="absolute inset-0 z-20" style={{ background: "linear-gradient(to bottom, transparent 0%, var(--background) 100%)" }} />
            <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, transparent 30%, var(--background) 100%)" }} />

            <ThemeImage
              lightSrc={portfolioConfig.personalInfo.profileImage.light}
              darkSrc={portfolioConfig.personalInfo.profileImage.dark}
              alt="Profile Background"
              className="opacity-80"
              style={{
                maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 100%)"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default AboutSection;
