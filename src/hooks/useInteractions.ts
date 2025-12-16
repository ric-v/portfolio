"use client";

import { useEffect, useState, useCallback, RefObject } from "react";

interface MouseVelocity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

export function useMouseVelocity(): MouseVelocity {
  const [mouseData, setMouseData] = useState<MouseVelocity>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now();
      const dt = currentTime - lastTime;

      if (dt > 0) {
        const vx = (e.clientX - lastX) / dt;
        const vy = (e.clientY - lastY) / dt;
        const speed = Math.sqrt(vx * vx + vy * vy);

        setMouseData({
          x: e.clientX,
          y: e.clientY,
          vx,
          vy,
          speed,
        });

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = currentTime;
      }
    };

    // Decay velocity when not moving
    const decay = () => {
      setMouseData((prev) => ({
        ...prev,
        vx: prev.vx * 0.95,
        vy: prev.vy * 0.95,
        speed: prev.speed * 0.95,
      }));
      rafId = requestAnimationFrame(decay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(decay);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return mouseData;
}

interface ScrollVelocity {
  scrollY: number;
  velocity: number;
  direction: "up" | "down" | "idle";
}

export function useScrollVelocity(): ScrollVelocity {
  const [scrollData, setScrollData] = useState<ScrollVelocity>({
    scrollY: 0,
    velocity: 0,
    direction: "idle",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number;

    const handleScroll = () => {
      const currentTime = performance.now();
      const currentScrollY = window.scrollY;
      const dt = currentTime - lastTime;

      if (dt > 0) {
        const velocity = Math.abs(currentScrollY - lastScrollY) / dt;
        const direction =
          currentScrollY > lastScrollY
            ? "down"
            : currentScrollY < lastScrollY
              ? "up"
              : "idle";

        setScrollData({
          scrollY: currentScrollY,
          velocity,
          direction,
        });

        lastScrollY = currentScrollY;
        lastTime = currentTime;
      }
    };

    // Decay velocity
    const decay = () => {
      setScrollData((prev) => ({
        ...prev,
        velocity: prev.velocity * 0.9,
        direction: prev.velocity < 0.01 ? "idle" : prev.direction,
      }));
      rafId = requestAnimationFrame(decay);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(decay);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return scrollData;
}

interface MagneticPosition {
  x: number;
  y: number;
}

export function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  strength: number = 0.4
): MagneticPosition {
  const [position, setPosition] = useState<MagneticPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Only apply effect when cursor is near the element
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = Math.max(rect.width, rect.height);

      if (distance < maxDistance) {
        const factor = 1 - distance / maxDistance;
        setPosition({
          x: distanceX * strength * factor,
          y: distanceY * strength * factor,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    [ref, strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return position;
}
