"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "../ui/GlassCard";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";

const skills = [
  { name: "React & Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Three.js & WebGL", level: 80 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX Design", level: 75 },
];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 px-6"
      id="about"
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
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
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

            <div className="space-y-4" style={{ color: "var(--text-secondary)" }}>
              <p className="text-lg">
                I&apos;m a Tech Lead and Principal Engineer focused on building scalable, high-performance systems.
                My work spans distributed backends, data-intensive platforms, and cloud-native architectures, with a strong emphasis on performance, reliability, and observability.
              </p>
              <p className="text-lg">
                With a focus on performance and aesthetics, I craft interfaces that
                don&apos;t just work—they <em>feel</em> right. From fluid animations to
                thoughtful micro-interactions, every detail matters.
              </p>
              <p className="text-lg">
                I enjoy working close to system fundamentals—designing software that stays predictable under load and remains easy to reason about as it grows.
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-8">
              <h3
                className="text-2xl font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Core Skills
              </h3>

              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span style={{ color: "var(--text-primary)" }}>
                        {skill.name}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--glass-bg)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: theme === "sunrise"
                            ? "linear-gradient(90deg, #ff7e33, #ff9500)"
                            : "linear-gradient(90deg, #8b5cf6, #ec4899)",
                        }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{
                          duration: 1,
                          delay: 0.5 + index * 0.1,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
