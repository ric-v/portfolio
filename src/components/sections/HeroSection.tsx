"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "../ui/Button";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";
import { TypewriterText } from "../ui/TypewriterText";

import { HeroCarousel, CarouselItem } from "../ui/HeroCarousel";

const carouselItems: CarouselItem[] = [
  {
    headline: "Distributed systems at production scale",
    subtext: "Designing microservices that handle high-frequency traffic with predictable latency."
  },
  {
    headline: "Performance is a feature",
    subtext: "Optimized low level systems to achieve sub 100ms response times under real-world load which is used by millions of users."
  },
  {
    headline: "Data-intensive by design",
    subtext: "Database query optimization, planning, and schema decisions that reduce latency. When scaling, every microsecond counts."
  },
  {
    headline: "Built to fail gracefully",
    subtext: "Systems designed with observability, timeouts, circuit breakers, and degradation in mind. Looking pretty under pressure."
  },
  {
    headline: "Hands-on technical leadership",
    subtext: "Leading small teams, reviewing critical code, and owning architectural decisions end-to-end."
  },
  {
    headline: "Builder beyond the day job",
    subtext: "Creating developer tools, internal utilities, and experiments to improve self, team, and product."
  },
  {
    headline: "Break. Build. Repeat.",
    subtext: "Nothing is permanent. Iterate and improve. If it's not broken, break it, and make it better."
  }
];

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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 4.0, // Wait for most typing to finish
        duration: 0.8,
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-24"
      style={{ y, opacity, scale }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Greeting */}
        <div
          className="text-lg md:text-xl mb-4 h-8"
          style={{ color: "var(--text-muted)" }}
        >
          <TypewriterText
            text="Hello, I'm Richie Varghese"
            delay={0.5}
          />
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="block md:inline">
            <TypewriterText
              text="I Engineer "
              delay={2.0}
            />
          </span>
          <GradientText>
            <TypewriterText
              text="Scalable Systems"
              delay={2.6}
            />
          </GradientText>
        </h1>

        {/* Carousel Tagline */}
        <div className="mb-10">
          <HeroCarousel items={carouselItems} />
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">

          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
