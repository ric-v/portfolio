"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TypewriterText } from "../ui/TypewriterText";
import { HeroCarousel } from "../ui/HeroCarousel";
import { portfolioConfig } from "@/config/portfolio";
import { useTheme } from "@/components/providers/ThemeContext";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

// Helper to interpolate colors
function interpolateColor(color1: string, color2: string, t: number): string {
  if (color1.startsWith('var')) return color1; // Fallback for pure vars if needed

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function HeroSection() {
  const { currentPlanet } = usePlanetNavigation();
  const { visualProgress } = useTheme(); // 0 = Sunset (Dark), 1 = Sunrise (Light)
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  // Compute colors for smooth transition
  // We manually define the Start (Dark) and End (Light) colors to interpolate
  // This bypasses the CSS variable snapping issue

  // Earth Dark (Sunset) Colors (From palette)
  const darkPalette = currentPlanet.palettes?.dark;
  const darkAccentHex = darkPalette?.accent || "#64b5f6";
  const darkGlowHex = darkPalette?.glow || "#4caf50";

  // Earth Light (Sunrise) Colors (From palette)
  const lightPalette = currentPlanet.palettes?.light;
  const lightAccent = lightPalette?.accent || "#d97706";
  const lightGlow = lightPalette?.glow || "#fb923c";

  // Current Interpolated Colors
  const isLightModeSupported = !!currentPlanet.palettes;

  const activeAccent = isLightModeSupported
    ? interpolateColor(darkAccentHex, lightAccent, visualProgress)
    : currentPlanet.text.accent;

  const activeGlow = isLightModeSupported
    ? interpolateColor(darkGlowHex, lightGlow, visualProgress)
    : currentPlanet.surface.glow;

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-32"
      style={{ y, opacity, scale }}
    >
      <div className="max-w-4xl mx-auto text-center">


        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl mb-6"
          style={{ color: currentPlanet.text.muted }}
        >
          <TypewriterText
            text={`Hello, I'm ${portfolioConfig.personalInfo.name}`}
            delay={0.5}
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          style={{ color: currentPlanet.text.primary }}
        >
          <span className="block md:inline">
            <TypewriterText
              text={portfolioConfig.personalInfo.role.split(" ").slice(0, 2).join(" ") + " "}
              delay={2.0}
            />
          </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${activeAccent}, ${activeGlow})`,
              transition: isLightModeSupported ? 'none' : 'background-image 1s', // Disable CSS transition for interpolation
            }}
          >
            <TypewriterText
              text={portfolioConfig.personalInfo.role.split(" ").slice(2).join(" ")}
              delay={2.8}
            />
          </span>
        </motion.h1>

        {/* Carousel Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-12"
        >
          <HeroCarousel items={portfolioConfig.hero.carouselItems} />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-sm tracking-wider"
              style={{ color: currentPlanet.text.muted }}
            >
              Explore the universe
            </span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: activeAccent }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
