"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../providers/ThemeContext";

export function Navigation() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 * i + 0.3,
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };

  return (
    <motion.nav
      className="absolute top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Container for Left elements (Hamburger + Logo) */}
      <div className="flex items-center gap-4 z-50">
        {/* Mobile Hamburger Button - Moved to Left */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-[var(--text-primary)] rounded-full origin-center transition-colors duration-300"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-colors duration-300"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-[var(--text-primary)] rounded-full origin-center transition-colors duration-300"
          />
        </button>

        {/* Logo / Name */}
        <Link href="/" className="relative text-xl font-bold tracking-tight">
          <span style={{ color: isOpen ? "var(--text-primary)" : "var(--text-primary)" }}>Richie</span>
          <span style={{ color: "var(--accent-primary)" }}> •</span>
        </Link>
      </div>

      {/* Desktop Links - Centered */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className="text-sm font-medium relative group"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="group-hover:text-[var(--accent-primary)] transition-colors duration-300">
              {link.name}
            </span>
            <span
              className="absolute -bottom-1 left-0 w-full h-px origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              style={{ backgroundColor: "var(--accent-primary)" }}
            />
          </Link>
        ))}
      </div>

      {/* Right side spacer to balance the flex (matches left container width notionally) */}
      <div className="w-10 md:w-0"></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 w-screen h-screen bg-[var(--bg-primary)]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8"
          >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/10 rounded-full blur-[100px]" />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 z-10">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  custom={i}
                >
                  <Link
                    href={link.path}
                    className="text-4xl font-light tracking-tighter hover:text-[var(--accent-primary)] transition-colors duration-300"
                    style={{ color: "var(--text-primary)" }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
