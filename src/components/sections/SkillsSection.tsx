"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { portfolioConfig, type Skill } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

const categoryLabels: Record<Skill["category"], string> = {
  languages: "Languages",
  frameworks: "Frameworks & APIs",
  cloud: "Cloud & Infrastructure",
  databases: "Data & Messaging",
  tools: "Tools & Practices",
};

const categoryOrder: Skill["category"][] = [
  "languages",
  "frameworks",
  "cloud",
  "databases",
  "tools",
];

function SkillBadge({ skill, index, planetColors }: {
  skill: Skill;
  index: number;
  planetColors: { accent: string; secondary: string; primary: string };
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-500 hover:scale-105"
      style={{
        backgroundColor: `${planetColors.accent}15`,
        border: `1px solid ${planetColors.accent}40`,
        color: planetColors.primary,
        boxShadow: `0 0 20px ${planetColors.accent}10`,
      }}
      whileHover={{
        boxShadow: `0 0 25px ${planetColors.accent}30`,
      }}
    >
      {skill.name}
    </motion.span>
  );
}

function SkillCategory({
  category,
  skills,
  index,
  planetColors,
}: {
  category: Skill["category"];
  skills: Skill[];
  index: number;
  planetColors: { accent: string; secondary: string; primary: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="space-y-4"
    >
      <h3
        className="text-lg font-semibold tracking-wide"
        style={{ color: planetColors.secondary }}
      >
        {categoryLabels[category]}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <SkillBadge
            key={skill.name}
            skill={skill}
            index={i}
            planetColors={planetColors}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const skillsByCategory = categoryOrder.reduce(
    (acc, category) => {
      acc[category] = portfolioConfig.skills.filter(
        (skill) => skill.category === category
      );
      return acc;
    },
    {} as Record<Skill["category"], Skill[]>
  );

  const planetColors = {
    accent: currentPlanet.text.accent,
    secondary: currentPlanet.text.secondary,
    primary: currentPlanet.text.primary,
  };

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6"
      id="skills"
    >
      <div className="max-w-5xl mx-auto">
        {/* Planet indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-4xl" role="img" aria-label={currentPlanet.name}>{currentPlanet.emoji}</span>
          <span
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: currentPlanet.text.accent }}
          >
            {currentPlanet.name} Station
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
            Technical{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentPlanet.text.accent}, ${currentPlanet.surface.glow})`,
              }}
            >
              Expertise
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: currentPlanet.text.secondary }}
          >
            Technologies I've worked with across distributed systems,
            cloud platforms, and full-stack development.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {categoryOrder.map((category, index) => (
            <SkillCategory
              key={category}
              category={category}
              skills={skillsByCategory[category]}
              index={index}
              planetColors={planetColors}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
