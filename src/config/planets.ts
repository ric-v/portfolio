// Planet configurations for the portfolio universe
// Each planet represents a section with unique atmosphere and surface

export type AmbientLayerType =
  | 'clouds-high'
  | 'clouds-low'
  | 'birds'
  | 'comets'
  | 'stars'
  | 'dust-haze'
  | 'particulates'
  | 'cloud-band'
  | 'turbulence'
  | 'ring-dust'
  | 'fog'
  | 'breathing'
  | 'ice-sparkle'
  | 'none';

export interface AmbientLayerConfig {
  type: AmbientLayerType;
  options?: {
    speed?: 'ultra-slow' | 'slow' | 'moderate' | 'fast';
    opacity?: number;
    color?: string;
    density?: number;
    count?: number; // Max concurrent items
    interval?: number; // Average spawn interval in ms
  };
}


export type PlanetId = 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'pluto';

export interface LightModeConfig {
  enabled: boolean;
  opacityTransitionDuration?: number; // ms, default 10000
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    glow?: string; // Optional glow color for gradients
  };
  fluidBackground: {
    sunrise: {
      top: string;
      mid: string;
      bottom: string;
      accent: string;
    };
    sunset: {
      top: string;
      mid: string;
      bottom: string;
      accent: string;
    };
  };
}

export interface PlanetConfig {
  id: PlanetId;
  name: string;
  section: string;
  path: string;
  emoji: string;
  surfaceImage?: string;
  lightMode?: LightModeConfig;

  colors?: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  atmosphere: {
    deepSpace: string;
    upper: string;
    mid: string;
    lower: string;
    accent: string;
  };
  surface: {
    primary: string;
    secondary: string;
    glow: string;
  };
  effects: {
    starDensity: number;
    cloudOpacity: number;
    glowIntensity: number;
    hasRings?: boolean;
    ringColor?: string;
    hasDust?: boolean;
    hasIce?: boolean;
  };
  // The CSS Variables that components should consume
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  // The actual color values for themes
  palettes: {
    dark: {
      primary: string;
      secondary: string;
      muted: string;
      accent: string;
      glow?: string;
    };
    light: {
      primary: string;
      secondary: string;
      muted: string;
      accent: string;
      glow?: string;
    };
  };
  // Ambient effects for this planet
  // Ambient effects for this planet (max 2 layers: primary + secondary)
  ambientLayer?: {
    dark?: {
      primary?: AmbientLayerConfig;
      secondary?: AmbientLayerConfig;
      stars?: boolean; // Stars are special/base layer in dark mode
    };
    light?: {
      primary?: AmbientLayerConfig;
      secondary?: AmbientLayerConfig;
    };
  };
}

// Common CSS variables used by all planets
const PLANET_VARS = {
  primary: 'var(--planet-text-primary)',
  secondary: 'var(--planet-text-secondary)',
  muted: 'var(--planet-text-muted)',
  accent: 'var(--planet-text-accent)',
};

export const planets: Record<PlanetId, PlanetConfig> = {
  earth: {
    id: 'earth',
    name: 'Earth',
    section: 'Home',
    path: '/',
    emoji: '🌍',
    surfaceImage: '/earth.png',
    colors: {
      primary: '#0F2E44', // Ocean Shadow
      secondary: '#2C4B3F', // Land (Muted Green)
      tertiary: '#1F6FA8', // Ocean Highlight
    },
    atmosphere: {
      deepSpace: '#070C12', // Cold near-black
      upper: '#0D1A2B',     // Midnight blue
      mid: '#122B45',       // Deep ocean blue
      lower: '#1E4E7A',     // Atmospheric blue
      accent: '#4FC3F7',    // Primary glow
    },
    surface: {
      primary: '#0F2E44',   // Ocean Surface
      secondary: '#1F6FA8', // Ocean Highlight
      glow: '#4FC3F7',      // Primary Glow
    },
    effects: {
      starDensity: 0.9,
      cloudOpacity: 0.4,    // Keep soft
      glowIntensity: 0.4,   // Reduced for sharpness
      hasRings: false,
      hasDust: false,
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#F4FAFF',
        secondary: '#C6D8E6',
        muted: '#9FB4C6',
        accent: '#2ED4A4',
      },
      light: {
        primary: '#0E2233',   // Deep slate blue (Headline)
        secondary: '#2F3E4C', // Neutral charcoal-blue (Body)
        muted: '#5E6F7E',     // Muted Blue-Grey (Metadata)
        accent: '#1E5C85',    // Muted steel blue (Emphasis)
        glow: '#4FC3F7',
      }
    },
    ambientLayer: {
      dark: {
        primary: {
          type: 'clouds-low',
          options: { speed: 'ultra-slow', opacity: 0.12, color: '#E6F1FA' } // Cloud base
        },
        secondary: {
          type: 'clouds-high', // Replaced comets with high clouds for depth, or aurora? User mentioned Aurora night only.
          options: { speed: 'slow', opacity: 0.05, color: '#3DE3C3' } // Aurora (very low opacity)
        },
        stars: true
      },
      light: {
        primary: {
          type: 'clouds-high',
          options: { speed: 'ultra-slow', opacity: 0.15, color: '#FFFFFF' }
        },
        secondary: {
          type: 'birds',
          options: { speed: 'moderate', count: 3, interval: 8000 }
        }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' }, // Deprecated
      fluidBackground: {
        sunrise: {
          top: '#EAF4FF',   // Sky top
          mid: '#CFE8FF',   // Sky mid
          bottom: '#FFD9A8', // Horizon (Sunrise)
          accent: '#FFF1DC', // Atmospheric wash
        },
        sunset: {
          top: '#030a0c',
          mid: '#051a1f',
          bottom: '#0a2a30',
          accent: 'rgba(120, 72, 197, 0.5)',
        },
      },
    },
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    section: 'About',
    path: '/about',
    emoji: '🔴',
    surfaceImage: '/mars.png',
    colors: {
      primary: '#D28A4C', // Desaturated Rust
      secondary: '#9C6236', // Darker Rust
      tertiary: '#bf360c',
    },
    atmosphere: {
      deepSpace: '#0F0B09', // Almost black, warm-neutral
      upper: '#1C1511',     // Cold brown
      mid: '#2A1D16',       // Dusty umber
      lower: '#3A2418',     // Subtle warmth
      accent: '#D28A4C',    // Thin horizon glow
    },
    surface: {
      primary: '#d84315',
      secondary: '#bf360c',
      glow: '#ff7043',
    },
    effects: {
      starDensity: 1.5,
      cloudOpacity: 0.2, // Reduced thinned dust
      glowIntensity: 0.3, // Thinner, sharper glow
      hasDust: true,
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#E9E3DD',
        secondary: '#C7B8AD',
        muted: '#9A8A7F',
        accent: '#D28A4C',
      },
      light: {
        primary: '#3f1a16',
        secondary: '#5d2924',
        muted: '#8c3d35',
        accent: '#e65100',
        glow: '#ff8a65',
      }
    },
    ambientLayer: {
      dark: {
        primary: {
          type: 'dust-haze',
          options: { speed: 'ultra-slow', opacity: 0.08, color: '#D28A4C' } // 8% opacity
        },
        secondary: {
          type: 'particulates',
          options: { speed: 'slow', opacity: 0.05, color: '#9C6236' } // 5% opacity
        }
      },
      light: {
        primary: { type: 'dust-haze', options: { opacity: 0.14, color: '#C48A54' } },
        secondary: { type: 'particulates', options: { opacity: 0.2 } }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' }, // Deprecated
      fluidBackground: {
        sunrise: {
          top: '#EFE6DA',    // Sky top (Pale Sand)
          mid: '#E3C6A4',    // Sky mid (Beige)
          bottom: '#D9A36B', // Horizon (Warm Sand)
          accent: '#C48A54', // Dust Wash
        },
        sunset: {
          top: '#2d0a05',
          mid: '#5d1a0e',
          bottom: '#8c2815',
          accent: '#ff5722',
        },
      },
    },
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    section: 'Experience',
    path: '/experience',
    emoji: '🟤',
    surfaceImage: '/jupiter.png',
    colors: {
      primary: '#d7c7aa',
      secondary: '#a49880',
      tertiary: '#736a58',
    },
    atmosphere: {
      deepSpace: '#1c1917',
      upper: '#1c1917',
      mid: '#292524',
      lower: '#44403c',
      accent: '#d6d3d1',
    },
    surface: {
      primary: '#a49880',
      secondary: '#736a58',
      glow: '#d7c7aa',
    },
    effects: {
      starDensity: 0.4,
      cloudOpacity: 0.8,
      glowIntensity: 0.4,
      hasRings: false,
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#e7e5e4',
        secondary: '#d6d3d1',
        muted: '#78716c',
        accent: '#a8a29e',
      },
      light: {
        primary: '#1f2937',
        secondary: '#374151',
        muted: '#4b5563',
        accent: '#991b1b',
        glow: '#ef4444',
      }
    },
    ambientLayer: {
      dark: {
        primary: { type: 'cloud-band', options: { speed: 'ultra-slow', opacity: 0.4 } },
        secondary: { type: 'turbulence', options: { speed: 'slow', opacity: 0.2 } }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' },
      fluidBackground: {
        sunrise: {
          top: '#f3f4f6',
          mid: '#d1d5db',
          bottom: '#b91c1c',
          accent: '#991b1b',
        },
        sunset: {
          top: '#1c1917',
          mid: '#292524',
          bottom: '#44403c',
          accent: '#d6d3d1',
        },
      },
    },
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    section: 'Skills',
    path: '/skills',
    emoji: '🪐',
    surfaceImage: '/saturn.png',
    colors: {
      primary: '#eec07b',
      secondary: '#d4a356',
      tertiary: '#8d6e3c',
    },
    atmosphere: {
      deepSpace: '#1a1610',
      upper: '#1a1610',
      mid: '#2c251a',
      lower: '#3d3424',
      accent: '#fbbf24',
    },
    surface: {
      primary: '#d4a356',
      secondary: '#8d6e3c',
      glow: '#eec07b',
    },
    effects: {
      starDensity: 0.6,
      cloudOpacity: 0.3,
      glowIntensity: 0.5,
      hasRings: true,
      ringColor: '#fcd34d',
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#fde68a',
        secondary: '#fcd34d',
        muted: '#b45309',
        accent: '#fbbf24',
      },
      light: {
        primary: '#451a03',
        secondary: '#78350f',
        muted: '#92400e',
        accent: '#d97706',
        glow: '#f59e0b',
      }
    },
    ambientLayer: {
      dark: {
        primary: { type: 'ring-dust', options: { speed: 'slow', opacity: 0.3 } },
        secondary: { type: 'fog', options: { opacity: 0.2 } }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' },
      fluidBackground: {
        sunrise: {
          top: '#fefce8',
          mid: '#fde68a',
          bottom: '#d6d3d1',
          accent: '#f59e0b',
        },
        sunset: {
          top: '#1a1610',
          mid: '#2c251a',
          bottom: '#3d3424',
          accent: '#fbbf24',
        },
      },
    },
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    section: 'Projects',
    path: '/projects',
    emoji: '💎',
    colors: {
      primary: '#00bcd4',
      secondary: '#0097a7',
      tertiary: '#006064',
    },
    atmosphere: {
      deepSpace: '#04181a',
      upper: '#04181a',
      mid: '#002529',
      lower: '#00363a',
      accent: '#00e5ff',
    },
    surface: {
      primary: '#0097a7',
      secondary: '#006064',
      glow: '#00bcd4',
    },
    effects: {
      starDensity: 0.8,
      cloudOpacity: 0.2,
      glowIntensity: 0.8,
      hasIce: true,
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#00bcd4',
        secondary: '#4dd0e1',
        muted: '#006064',
        accent: '#18ffff',
      },
      light: {
        primary: '#164e63',
        secondary: '#155e75',
        muted: '#0e7490',
        accent: '#06b6d4',
        glow: '#22d3ee',
      }
    },
    ambientLayer: {
      dark: {
        primary: { type: 'fog', options: { opacity: 0.4, color: '#00e5ff' } },
        secondary: { type: 'breathing', options: { speed: 'slow', opacity: 0.2 } }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' },
      fluidBackground: {
        sunrise: {
          top: '#ffffff',
          mid: '#cffafe',
          bottom: '#e0e7ff',
          accent: '#06b6d4',
        },
        sunset: {
          top: '#04181a',
          mid: '#002529',
          bottom: '#00363a',
          accent: '#00e5ff',
        },
      },
    },
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    section: 'Contact',
    path: '/contact',
    emoji: '❄️',
    surfaceImage: '/pluto.png',
    colors: {
      primary: '#9ca3af',
      secondary: '#6b7280',
      tertiary: '#4b5563',
    },
    atmosphere: {
      deepSpace: '#0f1419',
      upper: '#0f1419',
      mid: '#1f2937',
      lower: '#374151',
      accent: '#d1d5db',
    },
    surface: {
      primary: '#6b7280',
      secondary: '#4b5563',
      glow: '#9ca3af',
    },
    effects: {
      starDensity: 0.95,
      cloudOpacity: 0.1,
      glowIntensity: 0.3,
      hasRings: false,
      hasIce: true,
    },
    text: PLANET_VARS,
    palettes: {
      dark: {
        primary: '#f3f4f6',
        secondary: '#e5e7eb',
        muted: '#d1d5db',
        accent: '#9ca3af',
      },
      light: {
        primary: '#111827',
        secondary: '#1f2937',
        muted: '#374151',
        accent: '#6366f1',
        glow: '#818cf8',
      }
    },
    ambientLayer: {
      dark: {
        primary: { type: 'none' },
        secondary: { type: 'ice-sparkle', options: { interval: 15000, opacity: 0.5 } }
      }
    },
    lightMode: {
      enabled: true,
      text: { primary: '', secondary: '', muted: '', accent: '' },
      fluidBackground: {
        sunrise: {
          top: '#f9fafb',
          mid: '#e5e7eb',
          bottom: '#9ca3af',
          accent: '#6366f1',
        },
        sunset: {
          top: '#0f1419',
          mid: '#1f2937',
          bottom: '#374151',
          accent: '#d1d5db',
        },
      },
    },
  },
};

// Navigation order
export const planetOrder: PlanetId[] = ['earth', 'mars', 'jupiter', 'saturn', 'uranus', 'pluto'];

// Get planet by path
export function getPlanetByPath(path: string): PlanetConfig {
  const planet = Object.values(planets).find(p => p.path === path);
  return planet || planets.earth;
}

// Get next planet in order
export function getNextPlanet(currentId: PlanetId): PlanetConfig {
  const currentIndex = planetOrder.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % planetOrder.length;
  return planets[planetOrder[nextIndex]];
}

// Get previous planet in order
export function getPrevPlanet(currentId: PlanetId): PlanetConfig {
  const currentIndex = planetOrder.indexOf(currentId);
  const prevIndex = (currentIndex - 1 + planetOrder.length) % planetOrder.length;
  return planets[planetOrder[prevIndex]];
}
