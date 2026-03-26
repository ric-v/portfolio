"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeContext";
import { type PlanetConfig, type AmbientLayerConfig } from "@/config/planets";

interface PlanetAmbientLayerProps {
  planet: PlanetConfig;
}

/**
 * PlanetAmbientLayer
 * 
 * Orchestrates the ambient effects for a planet based on the current theme (Light/Dark).
 * Enforces the "One Primary + One Secondary" layer rule.
 */
export function PlanetAmbientLayer({ planet }: PlanetAmbientLayerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !planet.ambientLayer) return null;

  // Determine which config to use (Sunrise = Light, Sunset = Dark)
  // Default to Dark if Light config is missing
  const isLightMode = theme === 'sunrise' && planet.lightMode?.enabled;
  const config = isLightMode
    ? planet.ambientLayer.light
    : planet.ambientLayer.dark;

  if (!config) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {/* Base Star Layer (Specific to Earth Dark Mode primarily) */}
      {!isLightMode && planet.ambientLayer?.dark?.stars && <StarsEffect />}

      {/* Primary Ambient Layer */}
      {config.primary && (
        <AmbientLayerRenderer config={config.primary} layer="primary" />
      )}

      {/* Secondary Ambient Layer */}
      {config.secondary && (
        <AmbientLayerRenderer config={config.secondary} layer="secondary" />
      )}
    </div>
  );
}

function AmbientLayerRenderer({ config, layer }: { config: AmbientLayerConfig; layer: 'primary' | 'secondary' }) {
  switch (config.type) {
    case 'clouds-high':
      return <CloudsHighEffect options={config.options} />;
    case 'clouds-low':
      return <CloudsLowEffect options={config.options} />;
    case 'birds':
      return <BirdsEffect options={config.options} />;
    case 'comets':
      return <CometsEffect options={config.options} />;
    case 'dust-haze':
      return <DustHazeEffect options={config.options} />;
    case 'particulates':
      return <ParticulatesEffect options={config.options} />;
    case 'cloud-band':
      return <CloudBandEffect options={config.options} />;
    case 'turbulence':
      return <TurbulenceEffect options={config.options} />;
    case 'ring-dust':
      return <RingDustEffect options={config.options} />;
    case 'fog':
      return <FogEffect options={config.options} />;
    case 'breathing':
      return <BreathingGradientEffect options={config.options} />;
    case 'ice-sparkle':
      return <IceSparkleEffect options={config.options} />;
    default:
      return null;
  }
}

// --- Specific Effects ---

function StarsEffect() {
  // "Must twinkle by opacity, not scale"
  // "Static position"
  const starCount = 50;
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Keep to top 60%
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: 0.3,
            animation: `twinkle 4s ease-in-out infinite ${star.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

function CloudsHighEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // "Large, soft, slow. Horizontal drift. Very low contrast."
  const speed = options?.speed === 'ultra-slow' ? 120 : 60;

  return (
    <div className="absolute inset-0 z-1 opacity-60">
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
          filter: 'blur(60px)',
          transformOrigin: 'center',
        }}
        animate={{ x: ['-10%', '10%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute top-0 left-0 w-[150%] h-full"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: ['0%', '-20%'] }}
        transition={{ duration: speed * 1.5, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
      />
    </div>
  );
}

function CloudsLowEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // "Darker, heavier. Slight vertical parallax. Almost imperceptible motion."
  return (
    <div className="absolute inset-0 z-2">
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[60%]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
          opacity: options?.opacity || 0.2,
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[50%] blur-[80px] bg-slate-900/40" />
    </div>
  );
}

function BirdsEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // "Groups, slow, zoom/fade at random locations"
  const [birds, setBirds] = useState<{ id: number; x: number; y: number; delay: number; duration: number; scaleMod: number }[]>([]);

  useEffect(() => {
    const intervalTime = options?.interval || 12000;

    const spawnGroup = () => {
      // Occasional groups (30% chance to skip)
      if (Math.random() > 0.7) return;

      const groupId = Date.now();
      const groupX = 10 + Math.random() * 80; // Random X (10-90%)
      const groupY = 15 + Math.random() * 25; // General altitude (15-40%)
      const groupSize = 3 + Math.floor(Math.random() * 4); // 3-6 birds

      const newBirds = Array.from({ length: groupSize }).map((_, i) => ({
        id: groupId + i,
        x: groupX + (Math.random() * 10 - 5), // Spread X locally
        y: groupY + (Math.random() * 10 - 5), // Spread Y locally
        delay: i * (0.5 + Math.random() * 0.5), // Stagger start
        duration: 35 + Math.random() * 15, // Slow: 35-50s
        scaleMod: 0.5 + Math.random() * 0.3 // Variation in size (Smaller for distance)
      }));

      setBirds(prev => [...prev, ...newBirds]);

      // Cleanup
      const maxDuration = Math.max(...newBirds.map(b => b.duration));
      setTimeout(() => {
        setBirds(prev => prev.filter(b => b.id < groupId || b.id >= groupId + groupSize));
      }, maxDuration * 1000 + 10000);
    };

    // Check every 4s
    const interval = setInterval(spawnGroup, 4000);
    spawnGroup(); // Initial spawn attempt

    return () => clearInterval(interval);
  }, [options?.interval]);

  return (
    <div className="absolute inset-0 z-3 pointer-events-none">
      <AnimatePresence>
        {birds.map(bird => (
          <Bird key={bird.id} {...bird} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Bird({ x, y, delay, duration, scaleMod }: { x: number; y: number; delay: number; duration: number; scaleMod: number }) {
  return (
    <motion.div
      initial={{ x: `${x}vw`, opacity: 0, scale: 0.4 * scaleMod }}
      animate={{
        x: `${x + 15}vw`, // Drift 15vw to the right
        opacity: [0, 1, 1, 0],
        scale: [0.4 * scaleMod, 1 * scaleMod, 1 * scaleMod, 0.4 * scaleMod]
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: 'linear',
        opacity: { times: [0, 0.2, 0.8, 1], duration: duration, delay: delay }, // Slower fade in/out
        scale: { times: [0, 0.2, 0.8, 1], duration: duration, delay: delay },
        x: { duration: duration, ease: 'linear', delay: delay }
      }}
      className="absolute w-4 h-3"
      style={{ top: `${y}%` }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="text-stone-900 opacity-70 w-full h-full">
        <path d="M2,12 C8,12 10,16 12,16 C14,16 16,12 22,12" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </motion.div>
  );
}

function CometsEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Strict meteor rules:
  // - 1-2px thin, short tapered tail (front brighter)
  // - Desaturated white -> pale cyan, no pure white/neon
  // - 400-700ms, linear, straight line, no scale/rotation change
  // - One every 20-45s, max 1 at a time, spawn top 40%, angle -20 to -60 deg
  const [comet, setComet] = useState<{ id: number; x: number; y: number; angle: number; duration: number } | null>(null);

  useEffect(() => {
    const spawnMeteor = () => {
      // Random interval 20-45s
      const nextInterval = 20000 + Math.random() * 25000;

      const id = Date.now();
      // Spawn in top 40% of screen, random X
      const startX = 10 + Math.random() * 80; // 10-90% X
      const startY = 5 + Math.random() * 30; // 5-35% Y (above horizon)

      // Angle: -20 to -60 degrees (downward-left trajectory)
      // In CSS rotation: 0 = right. Negative = upward. We need downward diagonal.
      // A "downward-left" trajectory for a streak starting from its tail...
      // If the gradient goes from tail (left) to head (right), 
      // and we translate right (+x), the streak moves in its local X direction.
      // We need to rotate so that local-X points down-left.
      // Down-left from horizontal: 180 + 20 to 180 + 60 = 200 to 240 deg? 
      // Actually simpler: angle 200-240 means pointing bottom-left. Let's do 210-250 for visible diagonal.
      // Let me reconsider: user says angle between -20 to -60. 
      // This likely means measured from horizontal: -20 is slightly down, -60 is steeply down.
      // If we visualize: 0 = horizontal right. -20 = slightly below horizontal right.
      // But meteor should go FROM top-right TO bottom-left. 
      // So the *direction of travel* is roughly 180 + 20 to 180 + 60 = 200-240.
      // The streak itself (gradient) should be rotated to align with travel direction.
      const travelAngle = 200 + Math.random() * 40; // 200-240 degrees (down-left travel)

      // Duration 400-700ms
      const duration = 0.4 + Math.random() * 0.3;

      setComet({ id, x: startX, y: startY, angle: travelAngle, duration });

      // Clear after animation completes
      setTimeout(() => {
        setComet(null);
        // Schedule next
        setTimeout(spawnMeteor, nextInterval);
      }, duration * 1000 + 100);
    };

    // Initial delay before first meteor
    const initialDelay = 3000 + Math.random() * 5000;
    const timeout = setTimeout(spawnMeteor, initialDelay);

    return () => clearTimeout(timeout);
  }, []);

  if (!comet) return null;

  // Calculate travel distance (should be short-medium, not cross entire screen)
  // ~150-250px is reasonable for a fast, short meteor
  const travelDistance = 150 + Math.random() * 100;

  return (
    <div className="absolute inset-0 z-4 overflow-hidden pointer-events-none">
      <motion.div
        key={comet.id}
        initial={{
          left: `${comet.x}%`,
          top: `${comet.y}%`,
          opacity: 0,
          x: 0,
          y: 0
        }}
        animate={{
          opacity: [0, 0.9, 0],
          // Move along the angle direction
          x: Math.cos(comet.angle * Math.PI / 180) * travelDistance,
          y: Math.sin(comet.angle * Math.PI / 180) * travelDistance
        }}
        transition={{
          duration: comet.duration,
          ease: "linear",
          opacity: { duration: comet.duration, times: [0, 0.15, 1] }
        }}
        // Thin streak: 60-80px long, 1px tall, gradient tail
        className="absolute h-px w-[70px]"
        style={{
          transform: `rotate(${comet.angle}deg)`,
          // Gradient: tail (left, transparent) to head (right, pale cyan)
          background: 'linear-gradient(to right, transparent 0%, rgba(180, 210, 220, 0.3) 40%, rgba(200, 225, 235, 0.8) 100%)',
        }}
      />
    </div>
  );
}

function DustHazeEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // "Horizontal dust haze"
  return (
    <div className="absolute inset-0 z-2 opacity-30 mix-blend-overlay">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${options?.color} 50%, transparent 100%)`,
          filter: 'blur(20px)',
          opacity: 0.4
        }}
        animate={{ x: ['-10%', '10%'] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />
    </div>
  );
}

function ParticulatesEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // "Tiny particulate drift"
  return (
    <div className="absolute inset-0 z-3 overflow-hidden">
      {/* CSS based particles using generated shadow box could be lighter, but divs are fine for < 20 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: Math.random() * 50 - 25,
            y: Math.random() * 50 - 25,
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function CloudBandEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Jupiter: "Slow cloud band shear"
  return (
    <div className="absolute inset-0 z-2 opacity-20 mix-blend-soft-light">
      <motion.div
        className="absolute top-[20%] w-full h-[15%] bg-stone-500/30 blur-xl"
        animate={{ x: ['-5%', '5%'] }}
        transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute top-[50%] w-full h-[20%] bg-stone-700/30 blur-xl"
        animate={{ x: ['5%', '-5%'] }}
        transition={{ duration: 50, repeat: Infinity, repeatType: 'reverse' }}
      />
    </div>
  )
}

function TurbulenceEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Jupiter: "Subtle light turbulence"
  return (
    <div className="absolute inset-0 z-3 mix-blend-overlay opacity-20">
      {/* Use large noise texture or simple moving gradients */}
      <motion.div
        className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 30, repeat: Infinity }}
      />
    </div>
  )
}

function RingDustEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Saturn: "Ring dust shimmer (very faint)"
  return (
    <div className="absolute transition-opacity duration-1000 inset-0 z-3">
      <div className="absolute top-[50%] left-[10%] w-[80%] h-px bg-amber-200/20 shadow-[0_0_10px_rgba(251,191,36,0.2)] animate-pulse" />
    </div>
  )
}

function FogEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Uranus: "Soft volumetric fog"
  return (
    <div className="absolute inset-0 z-2 bg-cyan-900/10 blur-3xl" /> // Static base
  )
}

function BreathingGradientEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Uranus: "Light gradient breathing"
  return (
    <motion.div
      className="absolute inset-0 z-1 bg-gradient-radial from-cyan-500/5 to-transparent"
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function IceSparkleEffect({ options }: { options?: AmbientLayerConfig['options'] }) {
  // Pluto: "Faint ice sparkle once in a while"
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) return;
      const id = Date.now();
      setSparkles(prev => [...prev.slice(-2), { id, x: Math.random() * 100, y: Math.random() * 100 }]);
      setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 2000);
    }, options?.interval || 5000);
    return () => clearInterval(interval);
  }, [options?.interval]);

  return (
    <div className="absolute inset-0 z-4">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 45 }}
            transition={{ duration: 1.5 }}
            className="absolute w-1 h-1 bg-white blur-[0.5px]"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PlanetAmbientLayer;
