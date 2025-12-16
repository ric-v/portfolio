"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import gsap from "gsap";

export type Theme = "sunrise" | "sunset";
export type TransitionDirection = "sunrise-to-sunset" | "sunset-to-sunrise" | null;

interface ThemeContextType {
  theme: Theme;
  transitionProgress: number;
  visualProgress: number;
  isTransitioning: boolean;
  transitionDirection: TransitionDirection;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "sunset" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef({ value: 0 });

  // Load saved theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "sunrise" || savedTheme === "sunset")) {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply theme to document and save to local storage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return;

    const newTheme = theme === "sunrise" ? "sunset" : "sunrise";
    const isSunriseToSunset = theme === "sunrise";

    setIsTransitioning(true);
    setTransitionDirection(isSunriseToSunset ? "sunrise-to-sunset" : "sunset-to-sunrise");

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Lock scroll during transition
    document.body.style.overflow = "hidden";

    // Reset progress
    progressRef.current.value = 0;
    setTransitionProgress(0);

    // Duration: Slower for "proper" sunrise/sunset feel
    // Sunrise (Sunset -> Sunrise) should be slower, more gradual
    const duration = isSunriseToSunset ? 5.0 : 4.0;

    // Create the transition timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        setTransitionDirection(null);
        document.body.style.overflow = "";
        setTransitionProgress(1);
      },
    });

    // Animate transition progress (0 → 1)
    tl.to(progressRef.current, {
      value: 1,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        setTransitionProgress(progressRef.current.value);
      },
    });

    // Switch theme state at specific point for color blending
    // For sunrise (dark -> light), switch later to let light creep in
    // For sunset (light -> dark), switch earlier to let darkness fall
    tl.call(() => setThemeState(newTheme), [], isSunriseToSunset ? 0.4 : 0.6);

    // Animate CSS custom properties for smooth color transition
    const root = document.documentElement;

    // We want the CSS variables to interpolate over the full duration
    // The actual "theme" switch happens in the middle, but colors should morph
    // This requires the CSS transition on body (in globals.css) to handle the heavy lifting
    // OR we animate specific variables here.

    // Let's rely on the background shader and CSS transitions for the bulk, 
    // but we can animate specific "atmosphere" vars here if needed.

    if (newTheme === "sunrise") {
      // Sunset → Sunrise (Dark to Light)
      // Mimic pre-dawn glow before full light
      tl.to(root, {
        "--light-intensity": 1,
        "--glow-opacity": 0.6,
        "--shadow-depth": 0.1,
        duration: duration * 0.8,
        ease: "power2.out",
      }, 0);
    } else {
      // Sunrise → Sunset (Light to Dark)
      // Mimic golden hour fading into blue hour then night
      tl.to(root, {
        "--light-intensity": 0.3,
        "--glow-opacity": 0.8,
        "--shadow-depth": 0.4,
        duration: duration * 0.8,
        ease: "power2.out",
      }, 0);
    }

    timelineRef.current = tl;
  }, [theme, isTransitioning]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme !== theme) {
      toggleTheme();
    }
  }, [theme, toggleTheme]);

  // Calculate visual progress (0 = Sunset/Dark, 1 = Sunrise/Light) based on direction
  let visualProgress: number;
  if (transitionDirection === "sunset-to-sunrise") {
    visualProgress = transitionProgress;
  } else if (transitionDirection === "sunrise-to-sunset") {
    visualProgress = 1 - transitionProgress;
  } else {
    visualProgress = theme === "sunrise" ? 1 : 0;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        transitionProgress,
        isTransitioning,
        transitionDirection,
        visualProgress,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
