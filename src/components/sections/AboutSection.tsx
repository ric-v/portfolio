"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { portfolioConfig } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { GitHubActivity } from "@/components/ui/GitHubActivity";

export function AboutSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 80,
        duration: 0.8
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 px-6 flex flex-col justify-center"
      id="about"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Text Content */}
          <motion.div variants={itemVariants}>
            {/* Planet indicator */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-4xl" role="img" aria-label="Mars">🔴</span>
              <span
                className="text-sm font-medium tracking-wider uppercase"
                style={{ color: currentPlanet.text.accent }}
              >
                Mars Station
              </span>
            </motion.div>

            <div className="flex items-center justify-between lg:block mb-8">
              <h2
                className="text-4xl md:text-5xl font-bold"
                style={{ color: currentPlanet.text.primary }}
              >
                About{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${currentPlanet.text.accent}, ${currentPlanet.surface.glow})`,
                  }}
                >
                  Me
                </span>
              </h2>

              {/* Mobile Image */}
              <div
                className="relative w-24 h-24 rounded-2xl overflow-hidden lg:hidden flex-shrink-0"
                style={{ border: `2px solid ${currentPlanet.text.accent}` }}
              >
                <Image
                  src={portfolioConfig.personalInfo.profileImage.dark}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Location Tag */}
            <motion.p
              variants={itemVariants}
              className="text-sm font-medium mb-6 flex items-center gap-2"
              style={{ color: currentPlanet.text.accent }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {portfolioConfig.personalInfo.location}
            </motion.p>

            <div className="space-y-5">
              {portfolioConfig.personalInfo.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: currentPlanet.text.secondary }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.blockquote
              className="mt-10 p-6 rounded-xl relative overflow-hidden backdrop-blur-sm"
              style={{
                backgroundColor: `${currentPlanet.surface.primary}30`,
                borderLeft: `4px solid ${currentPlanet.text.accent}`,
              }}
              variants={itemVariants}
            >
              <p
                className="text-lg md:text-xl italic font-medium relative z-10"
                style={{ color: currentPlanet.text.primary }}
              >
                &quot;{portfolioConfig.personalInfo.quote}&quot;
              </p>
            </motion.blockquote>
          </motion.div>

          {/* Image (Desktop Only) */}
          <motion.div
            variants={itemVariants}
            style={{ y }}
            className="relative h-[500px] w-full rounded-2xl overflow-hidden hidden lg:block"
          >
            <div
              className="absolute inset-0 z-20"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${currentPlanet.atmosphere.lower} 100%)`
              }}
            />
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `radial-gradient(circle at center, transparent 30%, ${currentPlanet.atmosphere.mid} 100%)`
              }}
            />

            <Image
              src={portfolioConfig.personalInfo.profileImage.dark}
              alt="Profile Background"
              fill
              className="object-cover opacity-80"
              style={{
                maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 100%)"
              }}
            />
          </motion.div>
        </motion.div>

        {/* GitHub Activity */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <GitHubActivity username="ric-v" />
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
