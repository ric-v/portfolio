"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type PlanetId,
  type PlanetConfig,
  planets,
  getPlanetByPath,
  getNextPlanet,
  getPrevPlanet
} from "@/config/planets";

// 3. Scene State Model
export type TransitionPhase =
  | "idle"
  | "anticipation"
  | "liftoff"
  | "drift"
  | "landing"
  | "settle";

interface PlanetNavigationContextType {
  currentPlanet: PlanetConfig;
  targetPlanet: PlanetConfig | null;
  phase: TransitionPhase;
  isTransitioning: boolean;
  navigateToPlanet: (planetId: PlanetId) => void;
  navigateToNext: () => void;
  navigateToPrev: () => void;
}

const PlanetNavigationContext = createContext<PlanetNavigationContextType | undefined>(undefined);

// Helper for async delays
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function PlanetNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentPlanet, setCurrentPlanet] = useState<PlanetConfig>(getPlanetByPath(pathname));
  // targetPlanet is purely for visual reference if needed, though route swap handles logical change
  const [targetPlanet, setTargetPlanet] = useState<PlanetConfig | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  // Sync with route changes when not transitioning (e.g. initial load or back button)
  useEffect(() => {
    const newPlanet = getPlanetByPath(pathname);
    if (phase === "idle" && newPlanet.id !== currentPlanet.id) {
      setCurrentPlanet(newPlanet);
    }
  }, [pathname, phase, currentPlanet.id]);

  const navigateToPlanet = useCallback(async (planetId: PlanetId) => {
    if (phase !== "idle" || planetId === currentPlanet.id) return;

    const target = planets[planetId];
    setTargetPlanet(target);

    // 6. Orchestration Logic

    // Phase 1: Anticipation (0.2s)
    setPhase("anticipation");
    await wait(200);

    // Phase 2: Lift-off (0.6s)
    setPhase("liftoff");
    await wait(600);

    // Phase 3: Drift (Space) (0.8s total)
    setPhase("drift");

    // Wait part of drift before swapping
    await wait(300);

    // 🔥 Swap page HERE (user should not notice)
    // We update state immediately but visual content is hidden/blurred/scaled down
    router.push(target.path);
    setCurrentPlanet(target);

    // Continue drift to let route settle
    await wait(500);

    // Phase 4: Re-entry (0.8s)
    setPhase("landing");
    await wait(800);

    // Phase 5: Settle (0.4s)
    setPhase("settle");
    await wait(400);

    // Done
    setPhase("idle");
    setTargetPlanet(null);

  }, [currentPlanet.id, phase, router]);

  const navigateToNext = useCallback(() => {
    const next = getNextPlanet(currentPlanet.id);
    navigateToPlanet(next.id);
  }, [currentPlanet.id, navigateToPlanet]);

  const navigateToPrev = useCallback(() => {
    const prev = getPrevPlanet(currentPlanet.id);
    navigateToPlanet(prev.id);
  }, [currentPlanet.id, navigateToPlanet]);

  return (
    <PlanetNavigationContext.Provider
      value={{
        currentPlanet,
        targetPlanet,
        phase,
        isTransitioning: phase !== "idle",
        navigateToPlanet,
        navigateToNext,
        navigateToPrev,
      }}
    >
      {children}
    </PlanetNavigationContext.Provider>
  );
}

export function usePlanetNavigation() {
  const context = useContext(PlanetNavigationContext);
  if (context === undefined) {
    throw new Error("usePlanetNavigation must be used within a PlanetNavigationProvider");
  }
  return context;
}
