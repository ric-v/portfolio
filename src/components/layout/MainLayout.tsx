"use client";

import { Navigation } from "@/components/ui/Navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string; // Allow passing styles like min-h-screen
}

export function MainLayout({ children, className = "" }: MainLayoutProps) {
  return (
    <div className={`relative h-screen w-screen overflow-y-auto overflow-x-hidden md:overflow-hidden ${className}`}>
      {/* Top Navigation */}
      <Navigation />

      {/* Theme Toggle (Fixed Top Right) */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
