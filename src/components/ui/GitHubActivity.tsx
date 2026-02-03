"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
}

export function GitHubActivity({ username = "ric-v" }: { username?: string }) {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch GitHub stats
  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();

        // Fetch repos for star count
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposRes.json();

        const totalStars = Array.isArray(reposData)
          ? reposData.reduce((sum: number, repo: { stargazers_count?: number }) =>
            sum + (repo.stargazers_count || 0), 0)
          : 0;

        setStats({
          publicRepos: userData.public_repos || 0,
          followers: userData.followers || 0,
          totalStars,
        });
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
        // Fallback stats
        setStats({
          publicRepos: 30,
          followers: 10,
          totalStars: 50,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [username]);

  const statItems = stats ? [
    { label: "Repositories", value: stats.publicRepos, icon: "📁" },
    { label: "Total Stars", value: stats.totalStars, icon: "⭐" },
    { label: "Followers", value: stats.followers, icon: "👥" },
  ] : [];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full"
    >
      {/* GitHub Contribution Graph */}
      <div
        className="rounded-xl p-6 backdrop-blur-sm mb-6"
        style={{
          backgroundColor: `${currentPlanet.surface.primary}40`,
          border: `1px solid ${currentPlanet.text.accent}30`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ color: currentPlanet.text.accent }}
          >
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <h3
            className="text-lg font-semibold"
            style={{ color: currentPlanet.text.primary }}
          >
            GitHub Activity
          </h3>
        </div>

        {/* Contribution Graph Embed */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={`https://ghchart.rshah.org/4fc3f7/${username}`}
            alt="GitHub Contribution Graph"
            className="w-full h-auto opacity-90"
            style={{
              filter: `hue-rotate(${getHueRotation(currentPlanet.id)}deg)`,
            }}
          />
        </div>

        <p
          className="text-xs mt-3 text-center"
          style={{ color: currentPlanet.text.muted }}
        >
          Contribution activity over the last year
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center backdrop-blur-sm animate-pulse"
              style={{
                backgroundColor: `${currentPlanet.surface.primary}30`,
                border: `1px solid ${currentPlanet.text.accent}20`,
              }}
            >
              <div
                className="h-8 w-16 mx-auto mb-2 rounded"
                style={{ backgroundColor: `${currentPlanet.text.accent}20` }}
              />
              <div
                className="h-4 w-20 mx-auto rounded"
                style={{ backgroundColor: `${currentPlanet.text.accent}10` }}
              />
            </div>
          ))
        ) : (
          statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="rounded-xl p-4 text-center backdrop-blur-sm"
              style={{
                backgroundColor: `${currentPlanet.surface.primary}30`,
                border: `1px solid ${currentPlanet.text.accent}20`,
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: currentPlanet.text.accent }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs"
                style={{ color: currentPlanet.text.muted }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View Profile Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 text-center"
      >
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline"
          style={{ color: currentPlanet.text.accent }}
        >
          View Full Profile →
        </a>
      </motion.div>
    </motion.div>
  );
}

// Helper to adjust contribution graph color per planet
function getHueRotation(planetId: string): number {
  const rotations: Record<string, number> = {
    earth: 120,    // Green-ish
    mars: 0,       // Red
    crystal: 180,  // Cyan
    saturn: 40,    // Gold
    jupiter: 20,   // Orange
    neptune: 200,  // Blue
  };
  return rotations[planetId] || 0;
}

export default GitHubActivity;
