"use client";

import { motion } from "framer-motion";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { getPlanetByPath, type PlanetId } from "@/config/planets";

export function Navigation() {
  const { currentPlanet, isTransitioning, navigateToPlanet } = usePlanetNavigation();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    const planet = getPlanetByPath(path);
    navigateToPlanet(planet.id as PlanetId);
  };

  return (
    <motion.nav
      className="absolute top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isTransitioning ? 0.3 : 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* Container for Left elements (Logo) */}
      <div className="flex items-center gap-4 z-50">
        {/* Logo / Name */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="relative text-xl font-bold tracking-tight cursor-pointer"
        >
          <span style={{ color: currentPlanet.text.primary }}>Richie</span>
          <span style={{ color: currentPlanet.text.accent }}> •</span>
        </a>
      </div>
    </motion.nav>
  );
}
