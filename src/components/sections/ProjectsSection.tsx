"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";
import { Badge } from "../ui/Badge";
import { portfolioConfig, type Project } from "@/config/portfolio";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <GlassCard
        className="group overflow-hidden"
        tiltIntensity={8}
        glowOnHover={true}
      >
        <div
          className="relative h-48 md:h-56 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Placeholder gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: theme === "sunrise"
                ? `linear-gradient(135deg, 
                    hsl(${30 + index * 20}, 80%, 70%) 0%, 
                    hsl(${50 + index * 20}, 70%, 60%) 50%,
                    hsl(${70 + index * 20}, 60%, 50%) 100%)`
                : `linear-gradient(135deg, 
                    hsl(${260 + index * 15}, 70%, 30%) 0%, 
                    hsl(${280 + index * 15}, 60%, 25%) 50%,
                    hsl(${300 + index * 15}, 50%, 20%) 100%)`,
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundColor: theme === "sunrise"
                ? "rgba(0, 50, 50, 0.7)"
                : "rgba(0, 0, 0, 0.7)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="hollow">View Code</Button>
            <Button variant="solid">Live Demo</Button>
          </motion.div>

          {/* Project number indicator */}
          <div
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: "var(--glass-bg)",
              color: "var(--accent-primary)",
              backdropFilter: "blur(8px)",
            }}
          >
            0{index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {project.title}
          </h3>
          <p
            className="text-sm mb-4 line-clamp-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ProjectsSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-6"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Featured{" "}
            <GradientText>Projects</GradientText>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            A selection of projects that showcase my passion for creating
            exceptional digital experiences.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {portfolioConfig.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>


      </div>
    </section>
  );
}

export default ProjectsSection;
