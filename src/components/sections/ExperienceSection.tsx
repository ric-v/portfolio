"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { portfolioConfig, type Experience } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

function ExperienceCard({
  experience,
  index,
  isLast,
}: {
  experience: Experience;
  index: number;
  isLast: boolean;
}) {
  const { currentPlanet } = usePlanetNavigation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline Line (Saturn's Ring effect) */}
      {!isLast && (
        <div
          className="absolute left-[11px] md:left-[15px] top-8 w-[2px] h-[calc(100%+2rem)]"
          style={{
            background: `linear-gradient(to bottom, ${currentPlanet.text.accent}, ${currentPlanet.text.accent}20)`,
          }}
        />
      )}

      {/* Timeline Dot (like a moon) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
        className="absolute left-0 top-2 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: `${currentPlanet.text.accent}30`,
          border: `2px solid ${currentPlanet.text.accent}`,
          boxShadow: `0 0 15px ${currentPlanet.surface.glow}50`,
        }}
      >
        <div
          className="w-2 h-2 md:w-3 md:h-3 rounded-full"
          style={{
            backgroundColor: currentPlanet.text.accent,
          }}
        />
      </motion.div>

      {/* Content Card */}
      <div
        className="p-6 md:p-8 rounded-xl backdrop-blur-sm"
        style={{
          backgroundColor: `${currentPlanet.surface.primary}40`,
          border: `1px solid ${currentPlanet.text.accent}30`,
          boxShadow: `0 0 30px ${currentPlanet.surface.glow}10`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <h3
              className="text-xl md:text-2xl font-bold mb-1"
              style={{ color: currentPlanet.text.primary }}
            >
              {experience.role}
            </h3>
            <p
              className="text-base font-medium"
              style={{ color: currentPlanet.text.accent }}
            >
              {experience.company}
            </p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <p
              className="text-sm font-medium"
              style={{ color: currentPlanet.text.muted }}
            >
              {experience.duration}
            </p>
            <p
              className="text-sm"
              style={{ color: currentPlanet.text.muted }}
            >
              {experience.location}
            </p>
          </div>
        </div>

        {/* Description */}
        <ul className="space-y-2 mb-6">
          {experience.description.map((item, i) => (
            <li
              key={i}
              className="text-sm md:text-base flex items-start"
              style={{ color: currentPlanet.text.secondary }}
            >
              <span
                className="mr-3 mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: currentPlanet.text.accent,
                }}
              />
              {item}
            </li>
          ))}
        </ul>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${currentPlanet.text.accent}20`,
                color: currentPlanet.text.accent,
                border: `1px solid ${currentPlanet.text.accent}40`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6"
      id="experience"
    >
      <div className="max-w-4xl mx-auto">
        {/* Planet indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-4xl" role="img" aria-label="Saturn">🪐</span>
          <span
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: currentPlanet.text.accent }}
          >
            Saturn Orbit
          </span>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: currentPlanet.text.primary }}
          >
            Professional{" "}
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
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: currentPlanet.text.secondary }}
          >
            A timeline of roles where I've built, scaled, and led engineering teams.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12">
          {portfolioConfig.experience.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={index}
              isLast={index === portfolioConfig.experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
