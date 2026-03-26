import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { portfolioConfig, type Experience } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

// Card Component (Presentational)
function ExperienceCard({
  experience,
  isActive,
}: {
  experience: Experience;
  isActive: boolean;
}) {
  const { currentPlanet } = usePlanetNavigation();

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-6 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.8,
        y: isActive ? 0 : 50,
        filter: isActive ? "none" : "blur(10px)",
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className="relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all duration-500"
        style={{
          // Frozen Milky Surface (Frost)
          // Using semi-opaque white/grey mix to catch light, making the blur visible
          backgroundColor: `rgba(30, 41, 59, 0.4)`, // Fallback / Base tint
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)`,

          // Heavy Blur + Saturation for vibrance
          backdropFilter: "blur(50px) saturate(200%) brightness(1.2)",
          WebkitBackdropFilter: "blur(50px) saturate(200%) brightness(1.2)",

          // Icy Border (Sharp White/Accent mix)
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          borderTop: `1px solid rgba(255, 255, 255, 0.4)`,
          borderLeft: `1px solid rgba(255, 255, 255, 0.2)`,

          // Deep Shadow + Frost Glow
          boxShadow: `
            0 20px 60px -10px rgba(0,0,0,0.5),
            inset 0 0 0 1px rgba(255,255,255,0.1),
            inset 0 0 60px 0 ${currentPlanet.surface.glow}20
          `,
          pointerEvents: isActive ? "auto" : "none",
        }}
      >

        {/* 1. Atmospheric Glow Blob (Internal Ambient Light) */}
        <div
          className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] rounded-full mix-blend-screen opacity-30 blur-[80px] pointer-events-none"
          style={{ background: currentPlanet.surface.glow }}
        />

        {/* 2. Metallic Sheen Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `linear-gradient(120deg, transparent 30%, ${currentPlanet.text.accent} 50%, transparent 70%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* 3. Top Rim Light (Accent Line) */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentPlanet.text.accent}80, transparent)`,
            boxShadow: `0 2px 10px ${currentPlanet.text.accent}40`
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h3
              className="text-4xl md:text-5xl font-bold mb-3 tracking-tight filter drop-shadow-lg"
              style={{ color: currentPlanet.text.primary }}
            >
              {experience.role}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <p
                className="text-xl md:text-2xl font-medium tracking-wide"
                style={{ color: currentPlanet.text.accent }}
              >
                {experience.company}
              </p>
              <span
                className="text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold"
                style={{
                  backgroundColor: `${currentPlanet.text.accent}15`,
                  color: currentPlanet.text.muted,
                  border: `1px solid ${currentPlanet.text.accent}25`
                }}
              >
                {experience.location}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p
              className="text-lg font-mono tracking-wider opacity-90"
              style={{ color: currentPlanet.text.muted }}
            >
              {experience.duration}
            </p>
          </div>
        </div>

        <ul className="relative z-10 space-y-5 mb-10">
          {experience.description.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="text-base md:text-lg flex items-start leading-relaxed font-normal"
              style={{ color: currentPlanet.text.secondary }}
            >
              <span
                className="mr-4 mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: currentPlanet.text.accent }}
              />
              {item}
            </motion.li>
          ))}
        </ul>

        <div className="relative z-10 flex flex-wrap gap-2">
          {experience.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: `${currentPlanet.surface.primary}30`,
                color: currentPlanet.text.secondary,
                border: `1px solid ${currentPlanet.text.primary}15`,
                boxShadow: `0 4px 10px -2px ${currentPlanet.surface.glow}10`
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Experience data
  const experiences = portfolioConfig.experience;
  const itemCount = experiences.length;

  // Make the scroll container TALL relative to number of items
  // More height = smoother transitions (more scroll distance per state change)
  const scrollHeight = `${(itemCount + 3) * 100}vh`;

  // Hide native scrollbar while in this section to rely on the custom timeline
  useEffect(() => {
    document.body.classList.add("no-scrollbar");
    document.documentElement.classList.add("no-scrollbar");

    // Add scroll snapping for the "Anchor" effect at the top
    document.documentElement.style.scrollSnapType = "y proximity";

    return () => {
      document.body.classList.remove("no-scrollbar");
      document.documentElement.classList.remove("no-scrollbar");
      document.documentElement.style.scrollSnapType = "";
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Smoothing Logic ---
  const smoothProgress = useMotionValue(0);

  // Sync smoothProgress with scrollYProgress, but handle the Loop Reset gracefully.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = smoothProgress.get();

    // Normal Scroll -> Spring Animation
    // Tuned for SMOOTH, BUTTERY feel
    animate(smoothProgress, latest, {
      type: "spring",
      damping: 30,    // Higher = less bouncy, more controlled
      stiffness: 60,  // Lower = slower, more gradual
      mass: 0.5,      // Higher = more inertia, "weight"
      restDelta: 0.0001
    });

    // When we reach the end, Smooth Scroll back to top (Rewind)
    if (latest >= 0.99) {
      // 1. Kill Scroll Momentum (Inertia) by locking overflow
      // This prevents the "bounce back down" effect
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      // 2. Snap to Top
      window.scrollTo({ top: 0, behavior: "instant" });

      // 3. Restore Scrollability after momentum is dead (short delay)
      setTimeout(() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        // Re-apply no-scrollbar class if needed (managed by useEffect, but inline style overrides)
        // usage of "" removes inline style, falling back to class
      }, 50);
    }
  });


  // --- Animation Constants ---
  const contentStart = 0.15;
  const contentEnd = 0.85;
  const contentSpace = contentEnd - contentStart;
  const slice = contentSpace / itemCount;

  // --- Zoom / Dive Animation Values ---
  // Cycle: Start (0) -> End (1) -> Rewind to Start (0)
  // Use smoothProgress for visuals

  // Scale: Zoom In (Start) -> Hold -> Zoom Out/Forward (End)
  const initialScale = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.8, 1.5, 1.5, 1.2]);

  // Title Opacity: Visible -> Hidden (Stays Hidden until reset)
  const initialOpacity = useTransform(smoothProgress, [0, 0.15, 0.9, 1], [1, 0, 0, 0]);

  // Atmosphere/Cards Overlay: Hidden -> Visible -> Fade Out slightly at end
  const overlayOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.5]);

  // Derived Transforms (Hook Extraction)
  const backgroundScale = useTransform(smoothProgress, [0, 1], [0.5, 3]);
  const introBlur = useTransform(initialOpacity, [1, 0], ["blur(0px)", "blur(20px)"]);
  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: scrollHeight }}
      id="experience"
    >
      {/* Scroll Anchor: Top of Page */}
      <div className="absolute top-0 left-0 w-full h-screen snap-start pointer-events-none" />

      {/* PORTAL: All visible content fixed to viewport */}
      {/* This bypasses all parent transforms (GlobalSceneWrapper) */}
      {mounted && createPortal(
        <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
          {/* Background Overlay (Radial gradient + Rings) */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
            style={{ opacity: overlayOpacity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 0%, ${currentPlanet.atmosphere.mid}60 100%)`
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full border-[100px]"
              style={{
                borderColor: `${currentPlanet.atmosphere.accent}15`,
                scale: backgroundScale,
              }}
            />
          </motion.div>

          {/* Intro / Header - Fades out as we scroll */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center text-center px-4"
            style={{
              opacity: initialOpacity,
              scale: initialScale,
              filter: introBlur
            }}
          >
            <div>
              <motion.div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-5xl md:text-6xl filter drop-shadow-lg" role="img" aria-label={currentPlanet.name}>
                  {currentPlanet.emoji}
                </span>
                <span
                  className="text-lg font-bold tracking-[0.2em] uppercase"
                  style={{ color: currentPlanet.text.accent }}
                >
                  {currentPlanet.name} Orbit
                </span>
              </motion.div>
              <h2
                className="text-5xl md:text-7xl lg:text-9xl font-bold mb-6 tracking-tighter"
                style={{ color: currentPlanet.text.primary }}
              >
                Professional
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${currentPlanet.text.accent}, ${currentPlanet.surface.glow})`,
                  }}
                >
                  Journey
                </span>
              </h2>
              <p
                className="text-xl md:text-2xl max-w-2xl mx-auto opacity-80"
                style={{ color: currentPlanet.text.secondary }}
              >
                Scroll to dive into the timeline
              </p>
              <motion.div
                className="mt-12 mx-auto w-px h-24"
                style={{ background: `linear-gradient(to bottom, ${currentPlanet.text.accent}, transparent)` }}
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Cards Stack */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto h-full px-6 pointer-events-none">
              {experiences.map((exp, i) => {
                const start = contentStart + (i * slice);
                const end = start + slice;
                return (
                  <CardWrapper
                    key={exp.id}
                    experience={exp}
                    progress={smoothProgress}
                    range={[start, end]}
                    total={itemCount}
                    index={i}
                  />
                )
              })}
            </div>
          </div>

          {/* Progress Timeline on the Left */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-white/5 z-30 hidden md:block">
            <motion.div
              className="w-full bg-white rounded-full"
              style={{
                height: progressHeight,
                backgroundColor: currentPlanet.text.accent,
                boxShadow: `0 0 20px ${currentPlanet.text.accent}`
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

// Wrapper to handle individual card strict timing
function CardWrapper({
  experience,
  progress,
  range,
  total,
  index
}: {
  experience: Experience,
  progress: any,
  range: [number, number],
  total: number,
  index: number
}) {
  const [start, end] = range;

  // Create a safe "duration" of the card's active slice
  const duration = end - start;
  // Widen entry/exit for smoother blends and longer "hold" time
  const entry = start + (duration * 0.25);
  const exit = end - (duration * 0.25);

  // --- Flythrough Animation (Matching Hero Title Style) ---

  // Opacity: Fade in, hold, fade out
  const opacity = useTransform(
    progress,
    [start, entry, exit, end],
    [0, 1, 1, 0]
  );

  // Scale: Dramatic zoom like the title (starts small, ends BIG)
  // Matches the hero's 0.8 -> 1.5 feel
  const scale = useTransform(
    progress,
    [start, entry, exit, end],
    [0.6, 1, 1, 1.5]
  );

  // Blur: Heavy blur on entry/exit (matches hero's 20px blur)
  const filter = useTransform(
    progress,
    [start, entry, exit, end],
    ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]
  );

  // Y-axis: Subtle rise
  const y = useTransform(
    progress,
    [start, end],
    [40, -40]
  );

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
      style={{ opacity, scale, filter, y }}
    >
      <div className="w-full max-w-4xl pointer-events-auto">
        <ExperienceCard experience={experience} isActive={true} />
      </div>
    </motion.div>
  )
}

export default ExperienceSection;
