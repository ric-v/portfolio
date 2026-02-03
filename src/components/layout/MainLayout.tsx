"use client";

import { Navigation } from "@/components/ui/Navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PageNavigator } from "@/components/ui/PageNavigator";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className = "" }: MainLayoutProps) {
  return (
    <div className={`relative min-h-screen w-screen overflow-x-hidden ${className}`}>
      {/* Top Navigation */}
      <Navigation />

      {/* Theme Toggle (Fixed Top Right) */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Page Navigator (Fixed Bottom Right) */}
      <div className="fixed bottom-8 right-8 z-50">
        <PageNavigator />
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
