"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CarouselItem {
  headline: string;
  subtext: string;
}

interface HeroCarouselProps {
  items: CarouselItem[];
  interval?: number;
  className?: string;
}

export function HeroCarousel({
  items,
  interval = 6000,
  className = "",
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval, isPaused]);

  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className={`relative min-h-[240px] flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-full px-4"
        >
          <h3
            className="text-2xl md:text-3xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {items[currentIndex].headline}
          </h3>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {items[currentIndex].subtext}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
