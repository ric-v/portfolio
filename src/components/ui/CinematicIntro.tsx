"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../providers/ThemeContext";
import gsap from "gsap";

export function CinematicIntro() {
  const { setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [activeTheme, setActiveTheme] = useState<"sunrise" | "sunset">("sunset");

  useEffect(() => {
    // 1. Check if visited recently (within 6 hours)
    const lastVisited = localStorage.getItem("intro_last_shown");
    const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours
    const now = Date.now();

    if (lastVisited) {
      const timeDiff = now - parseInt(lastVisited, 10);
      if (timeDiff < COOLDOWN_MS) {
        setIsVisible(false);
        return;
      }
    }

    // 2. Determine time and theme
    const hour = new Date().getHours();
    let timeGreeting = "Hello";
    let targetTheme: "sunrise" | "sunset" = "sunset";

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good Morning";
      targetTheme = "sunrise";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good Afternoon";
      targetTheme = "sunrise"; // Still bright
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "Good Evening";
      targetTheme = "sunset";
    } else {
      timeGreeting = "Good Night";
      targetTheme = "sunset";
    }

    setGreeting(timeGreeting);
    setTheme(targetTheme);
    setActiveTheme(targetTheme);

    // 3. Cinematic Animation Sequence
    // Lock scroll
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        localStorage.setItem("intro_last_shown", now.toString());
        document.body.style.overflow = "";
      }
    });

    if (containerRef.current && textRef.current && cloudsRef.current) {
      // Initial state
      gsap.set(containerRef.current, { autoAlpha: 1 });
      gsap.set(textRef.current, { autoAlpha: 0, y: 20, scale: 0.95 });

      // Clouds initial state (hidden below/sides)
      const clouds = cloudsRef.current.children;
      gsap.set(clouds, { y: "100%", opacity: 0 });

      // Sequence
      // 1. Reveal Greeting
      tl.to(textRef.current, {
        duration: 1.5,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        ease: "power3.out"
      })
        .to(textRef.current, {
          duration: 1.0,
          autoAlpha: 0,
          y: -20,
          scale: 1.05,
          ease: "power2.in",
          delay: 0.8
        });

      // 2. Clouds Wipe In (covering screen)
      // Start showing clouds before text is fully gone
      tl.to(clouds, {
        duration: 1.8,
        y: "0%",
        opacity: 1,
        stagger: {
          amount: 0.3,
          from: "random"
        },
        ease: "power2.out"
      }, "-=1.2");

      // 3. Fade out black overlay behind clouds
      // This makes the background transparent so we see the app behind the clouds
      tl.to(containerRef.current, {
        duration: 0.5,
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
      }, "-=0.5");

      // 4. Clouds Wipe Out (reveal app)
      // Move clouds DOWN (y: 100%) to reveal Top first, matching content entry
      tl.add("reveal");

      tl.to(clouds, {
        duration: 1.8,
        y: "150%", // Move down to reveal from top
        opacity: 0,
        stagger: {
          amount: 0.2,
          from: "end" // Top clouds move first? Or just spread naturally
        },
        ease: "power2.inOut"
      }, "reveal");

      // 5. Content Entry (Top-to-Bottom)
      // Animate the main content sliding down as clouds clear
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        // Set initial state for content
        gsap.set(mainContent, { y: -50, autoAlpha: 0 });

        // Animate EXACTLY with cloud wipe
        tl.to(mainContent, {
          duration: 1.5,
          y: 0,
          autoAlpha: 1,
          ease: "power3.out"
        }, "reveal+=0.2"); // Slight offset to let clouds start moving first, but mostly parallel
      }
    }

  }, [setTheme]);

  if (!isVisible) return null;

  const cloudColorClass = activeTheme === "sunrise"
    ? "bg-white/90"
    : "bg-gradient-to-br from-[#1a0b2e]/95 to-[#1f2937]/95"; // Deep purple to grey

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl transition-colors"
      aria-hidden="true"
    >
      <h1
        ref={textRef}
        className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-white opacity-0 font-['Geist_Mono'] relative z-20"
      >
        {greeting}
      </h1>

      {/* Clouds Container */}
      <div ref={cloudsRef} className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* Multiple cloud layers for dense coverage */}
        <div className={`absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[80px] ${cloudColorClass}`} />
        <div className={`absolute -bottom-[10%] left-[20%] w-[70%] h-[70%] rounded-full blur-[90px] ${cloudColorClass}`} />
        <div className={`absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[80px] ${cloudColorClass}`} />

        {/* Upper layer to ensure full coverage during wipe */}
        <div className={`absolute top-[100%] left-0 w-full h-full rounded-full blur-[100px] scale-150 ${cloudColorClass}`} />
      </div>
    </div>
  );
}
