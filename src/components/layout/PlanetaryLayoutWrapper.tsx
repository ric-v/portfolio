"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PlanetNavigationProvider, usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { PlanetaryNav } from "@/components/ui/PlanetaryNav";
import { Navigation } from "@/components/ui/Navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GlobalSceneWrapper } from "@/components/layout/GlobalSceneWrapper";
import { useTheme } from "@/components/providers/ThemeContext";
import dynamic from "next/dynamic";



// Lazy load heavy ThreeJS components for better initial load
const PlanetaryBackground = dynamic(
  () => import("@/components/universe/PlanetaryBackground"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-950" />
  }
);

const FluidBackground = dynamic(
  () => import("@/components/ui/FluidBackground"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/50 animate-pulse" />
  }
);



const PlanetSurface = dynamic(
  () => import("@/components/universe/PlanetSurface"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent" />
  }
);

const PlanetAmbientLayer = dynamic(
  () => import("@/components/universe/PlanetAmbientLayer"),
  { ssr: false }
);

function PlanetaryLayout({ children }: { children: React.ReactNode }) {
  const { currentPlanet, targetPlanet, phase } = usePlanetNavigation();
  const { theme, visualProgress } = useTheme();

  // 7. Background Parallax (Space Illusion)
  const isDrifting = phase === "drift";

  // Check if we should show the Amber Light Mode (Fluid Background)
  // Now generalized: Checks if the current planet supports light mode
  const isLightMode = currentPlanet.lightMode?.enabled && theme === 'sunrise';

  // Inject CSS variables for configurable Light Mode text colors
  useEffect(() => {
    // Requires config with palettes to function
    if (currentPlanet.palettes) {
      const root = document.documentElement;

      const palette = theme === 'sunrise' ? currentPlanet.palettes.light : currentPlanet.palettes.dark;

      root.style.setProperty('--planet-text-primary', palette.primary);
      root.style.setProperty('--planet-text-secondary', palette.secondary);
      root.style.setProperty('--planet-text-muted', palette.muted);
      root.style.setProperty('--planet-text-accent', palette.accent);
    }
  }, [theme, currentPlanet]);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black text-white">
      {/* 1. Background Layers (Visible during Void Phase) */}
      <motion.div
        className="fixed inset-0 z-0"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0 }}
      >
        {/* STACKED BACKGROUNDS FOR SMOOTH CROSS-FADE */}

        {/* 1. Dark Mode / Space Background Layer */}
        {/* Fades out as visualProgress goes to 1 (Sunrise) if Light Mode is supported */}
        <div
          className="absolute inset-0"
          style={{
            opacity: currentPlanet.lightMode?.enabled ? (1 - visualProgress) : 1,
            pointerEvents: (currentPlanet.lightMode?.enabled && visualProgress > 0.9) ? 'none' : 'auto'
          }}
        >
          {/* Simple color background that shifts */}
          <PlanetaryBackground
            planetId={currentPlanet.id}
            targetPlanetId={targetPlanet?.id}
            transition={0}
          />
          {/* Static Planet Surface */}
          <PlanetSurface planet={currentPlanet} />
        </div>

        {/* Planet Ambient Layer (Strictly Controlled Effects) */}
        {/* Placed outside fading containers because it handles its own light/dark switching internally */}
        <PlanetAmbientLayer planet={currentPlanet} />

        {/* 2. Light Mode / Fluid Cloud Layer */}
        {currentPlanet.lightMode?.enabled && (
          <div
            className="absolute inset-0"
            style={{
              opacity: visualProgress,
              pointerEvents: visualProgress > 0.1 ? 'auto' : 'none'
            }}
          >
            <FluidBackground
              key={currentPlanet.id}
              config={currentPlanet.lightMode.fluidBackground}
            />
          </div>
        )}
      </motion.div>

      {/* Navigation Elements - Fixed HUD outside scene physics */}
      <Navigation />

      {/* 2. Global Scene Wrapper (Handles Lift-off/Landing Physics) */}
      <GlobalSceneWrapper className="z-10 bg-transparent">
        <div className="relative min-h-screen w-full">
          {/* Main Page Content */}
          <main className="relative z-0">
            {children}
          </main>
        </div>
      </GlobalSceneWrapper>

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Bottom Navigator - Fixed HUD outside scene physics */}
      <PlanetaryNav />
    </div>
  );
}

export function PlanetaryLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PlanetNavigationProvider>
      <PlanetaryLayout>{children}</PlanetaryLayout>
    </PlanetNavigationProvider>
  );
}

export default PlanetaryLayoutWrapper;
