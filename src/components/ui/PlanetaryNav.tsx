"use client";

import { motion } from "framer-motion";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { planets, planetOrder, type PlanetId } from "@/config/planets";

// Emoji map removed - using planet.emoji from config

export function PlanetaryNav() {
  const { currentPlanet, isTransitioning, navigateToPlanet } = usePlanetNavigation();

  return (
    <motion.nav
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl"
        style={{
          backgroundColor: `${currentPlanet.atmosphere.mid}80`,
          border: `1px solid ${currentPlanet.text.accent}30`,
          boxShadow: `0 0 30px ${currentPlanet.surface.glow}20`,
        }}
      >
        {planetOrder.map((planetId) => {
          const planet = planets[planetId];
          const isActive = currentPlanet.id === planetId;

          return (
            <button
              key={planetId}
              onClick={() => navigateToPlanet(planetId)}
              disabled={isTransitioning}
              className="relative group"
              title={planet.section}
            >
              {/* Active indicator ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${planet.text.accent}`,
                  boxShadow: `0 0 12px ${planet.surface.glow}`,
                }}
                initial={false}
                animate={{
                  scale: isActive ? 1.3 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Planet dot */}
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300"
                style={{
                  backgroundColor: isActive
                    ? planet.surface.primary
                    : `${planet.surface.primary}60`,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm" role="img" aria-label={planet.name}>
                  {planet.emoji}
                </span>
              </motion.div>

              {/* Tooltip */}
              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
                style={{
                  backgroundColor: `${planet.atmosphere.mid}ee`,
                  color: planet.text.primary,
                  border: `1px solid ${planet.text.accent}40`,
                }}
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {planet.section}
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* Current planet label */}
      <motion.div
        key={currentPlanet.id}
        className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wider"
        style={{ color: currentPlanet.text.accent }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {currentPlanet.name.toUpperCase()}
      </motion.div>
    </motion.nav>
  );
}

export default PlanetaryNav;
