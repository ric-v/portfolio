"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageNavigator() {
  const pathname = usePathname();
  const [nextPage, setNextPage] = useState<{ path: string; label: string }>({ path: "/about", label: "About" });

  useEffect(() => {
    switch (pathname) {
      case "/":
        setNextPage({ path: "/about", label: "About" });
        break;
      case "/about":
        setNextPage({ path: "/projects", label: "Projects" });
        break;
      case "/projects":
        setNextPage({ path: "/contact", label: "Contact" });
        break;
      case "/contact":
        setNextPage({ path: "/", label: "Home" });
        break;
      default:
        setNextPage({ path: "/", label: "Home" });
    }
  }, [pathname]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href={nextPage.path}>
        <motion.button
          layoutId="page-navigator"
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-3xl transition-shadow duration-300 cursor-pointer"
          style={{
            background: "var(--accent-primary)",
            color: "var(--bg-primary)"
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="sr-only">Go to {nextPage.label}</span>
          <AnimatePresence mode="wait">
            <motion.svg
              key={nextPage.path}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </AnimatePresence>
        </motion.button>
      </Link>
    </div>
  );
}
