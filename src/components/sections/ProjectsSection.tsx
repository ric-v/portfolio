"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { portfolioConfig, type Project } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { currentPlanet } = usePlanetNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div
        className="group overflow-hidden h-full rounded-xl backdrop-blur-sm transition-all duration-500"
        style={{
          backgroundColor: `${currentPlanet.surface.primary}50`,
          border: `1px solid ${currentPlanet.text.accent}30`,
          boxShadow: isHovered
            ? `0 0 40px ${currentPlanet.surface.glow}30`
            : `0 0 20px ${currentPlanet.surface.glow}10`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-40 md:h-48 overflow-hidden">
          {/* Moon-like gradient background for each project */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                ${currentPlanet.text.accent}40 0%, 
                ${currentPlanet.surface.primary} 60%,
                ${currentPlanet.atmosphere.top} 100%)`,
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Project number as orbital element */}
          <div
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: `${currentPlanet.text.accent}30`,
              border: `2px solid ${currentPlanet.text.accent}`,
              color: currentPlanet.text.accent,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Open Source Badge */}
          {project.isOpenSource && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{
                backgroundColor: `${currentPlanet.atmosphere.mid}90`,
                color: currentPlanet.text.primary,
                border: `1px solid ${currentPlanet.text.accent}40`,
              }}
            >
              Open Source
            </div>
          )}

          {/* Stars Badge */}
          {project.stars && project.stars > 0 && (
            <div
              className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1"
              style={{
                backgroundColor: `${currentPlanet.atmosphere.mid}90`,
                color: currentPlanet.text.accent,
              }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {project.stars}
            </div>
          )}

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-4"
            style={{
              backgroundColor: `${currentPlanet.atmosphere.top}e0`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${currentPlanet.text.accent}`,
                    color: currentPlanet.text.accent,
                  }}
                  whileHover={{
                    backgroundColor: `${currentPlanet.text.accent}20`,
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  GitHub
                </motion.button>
              </a>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: currentPlanet.text.primary }}
          >
            {project.title}
          </h3>
          <p
            className="text-sm mb-4 line-clamp-2 leading-relaxed"
            style={{ color: currentPlanet.text.secondary }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${currentPlanet.text.accent}15`,
                  color: currentPlanet.text.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        {/* Planet indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-4xl" role="img" aria-label="Jupiter">🟤</span>
          <span
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: currentPlanet.text.accent }}
          >
            Jupiter System
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
            Open Source{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentPlanet.text.accent}, ${currentPlanet.surface.glow})`,
              }}
            >
              Projects
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: currentPlanet.text.secondary }}
          >
            Side projects and open source contributions that solve real problems
            and explore new technologies.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioConfig.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="https://github.com/ric-v"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              className="px-6 py-3 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${currentPlanet.text.accent}`,
                color: currentPlanet.text.accent,
              }}
              whileHover={{
                backgroundColor: `${currentPlanet.text.accent}20`,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              View All on GitHub →
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
