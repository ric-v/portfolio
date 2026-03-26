"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const pageOrder = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/skills", label: "Skills" },
  { path: "/experience", label: "Experience" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export function PageNavigator() {
  const pathname = usePathname();

  const nextPage = useMemo(() => {
    const currentIndex = pageOrder.findIndex((page) => page.path === pathname);
    const nextIndex = (currentIndex + 1) % pageOrder.length;
    return pageOrder[nextIndex];
  }, [pathname]);

  return (
    <Link href={nextPage.path}>
      <motion.button
        layoutId="page-navigator"
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-500 cursor-pointer"
        style={{
          background: "var(--accent-primary)",
          color: "var(--bg-primary)"
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.4 }}
      >
        <span className="sr-only">Go to {nextPage.label}</span>
        <AnimatePresence mode="wait">
          <motion.svg
            key={nextPage.path}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </AnimatePresence>
      </motion.button>
    </Link>
  );
}
