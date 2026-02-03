"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";
import { portfolioConfig } from "@/config/portfolio";

export function Footer() {
  const { currentPlanet } = usePlanetNavigation();
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Experience", path: "/experience" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative py-20 px-6">
      {/* Ambient gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute bottom-0 left-1/2 w-[600px] h-[300px] -translate-x-1/2"
          style={{
            background: `radial-gradient(ellipse at center bottom, ${currentPlanet.surface.glow}15 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Separator line with glow */}
        <motion.div
          className="h-px mb-16 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentPlanet.text.accent}, transparent)`,
            boxShadow: `0 0 20px ${currentPlanet.surface.glow}50`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo/Name */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: currentPlanet.text.primary }}
            >
              {portfolioConfig.footer.tagline}
            </h3>
            <p
              className="text-sm"
              style={{ color: currentPlanet.text.muted }}
            >
              {portfolioConfig.footer.subTagline}
            </p>
          </motion.div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-sm transition-colors relative group"
                style={{ color: currentPlanet.text.secondary }}
              >
                <span
                  className="transition-colors duration-500"
                  style={{
                    color: currentPlanet.text.secondary,
                  }}
                >
                  {link.name}
                </span>
                <span
                  className="absolute -bottom-1 left-0 w-full h-px origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: currentPlanet.text.accent }}
                />
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <motion.p
            className="text-sm text-center md:text-right"
            style={{ color: currentPlanet.text.muted }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            © {currentYear} All rights reserved
          </motion.p>
        </div>

        {/* Ambient floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: `${currentPlanet.text.accent}60`,
                left: `${20 + i * 30}%`,
                bottom: "20%",
              }}
              animate={{
                y: [-10, -40, -10],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 8 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
