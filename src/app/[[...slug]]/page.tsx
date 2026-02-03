"use client";

import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { currentPlanet } = usePlanetNavigation();

  // Map planet IDs to their respective sections
  const renderSection = () => {
    switch (currentPlanet.id) {
      case 'earth':
        return <HeroSection />;
      case 'mars':
        return <AboutSection />;
      case 'jupiter':
        return <SkillsSection />;
      case 'saturn':
        return <ExperienceSection />;
      case 'uranus':
        return <ProjectsSection />;
      case 'pluto':
        return <ContactSection />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <MainLayout>
      {/* 
          We use a key on the motion div to trigger mount/unmount animations 
          although the main warp effect handles the "transition" visually.
          This ensures the DOM is clean and we don't render hidden sections.
      */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlanet.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} // Small delay to let warp start
            className="w-full h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
