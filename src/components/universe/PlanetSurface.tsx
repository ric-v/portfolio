"use client";

import Image from "next/image";
import { type PlanetConfig } from "@/config/planets";
import styles from "./PlanetSurface.module.css";

interface PlanetSurfaceProps {
  planet: PlanetConfig;
}

/**
 * Static planet surface layer using either:
 * 1. A giant emoji (iconic representation) - Styled as "North Pole" horizon
 * 2. A custom PNG image (e.g. Earth) - Rendered FULL SCREEN as background
 */
export function PlanetSurface({ planet }: PlanetSurfaceProps) {
  const commonStyle = {
    "--atmosphere-glow": planet.atmosphere.accent,
    "--atmosphere-tint": `${planet.atmosphere.bottom}80`,
    "--aurora-color": planet.atmosphere.accent,
    "--surface-glow": planet.surface.glow,
  } as React.CSSProperties;

  // If there's an image, we show it full screen with atmospheric overlays
  if (planet.surfaceImage) {
    return (
      <div className={styles.surfaceContainer} style={commonStyle}>
        <div className={styles.imageSurface}>
          <Image
            src={planet.surfaceImage}
            alt={`${planet.name} surface`}
            fill
            priority
            quality={100}
            className="object-cover"
          />
        </div>

        {/* Atmospheric Overlays (Removed generic clouds/aurora - controlled by PlanetAmbientLayer) */}
      </div>
    );
  }

  // Fallback: Emoji North Pole style with atmospheric overlay
  return (
    <div className={styles.surfaceContainer} style={commonStyle}>
      <div
        className={`${styles.surfaceObject} ${styles.emojiSurface}`}
        role="img"
        aria-label={`${planet.name} surface`}
      >
        {planet.emoji}
      </div>

      {/* Overlay to blend emoji into scene */}
      <div className={styles.atmosphereOverlay} />
    </div>
  );
}

export default PlanetSurface;
