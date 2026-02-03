# Richie Varghese Portfolio - Design System

## Vision

A **planetary portfolio** where each section is a unique planet. Users experience the website as if standing on different worlds, looking at their unique skies and atmospheres.

---

## Planet System

| Planet | Section | Path | Visual Identity |
|--------|---------|------|-----------------|
| 🌍 Earth | Home | `/` | Blue-green sky, familiar, welcoming |
| 🔴 Mars | About | `/about` | Dusty red/orange, personal exploration |
| 💎 Crystal | Skills | `/skills` | Electric cyan/purple, tech precision |
| 🪐 Saturn | Experience | `/experience` | Golden/amber, timeline rings |
| 🟤 Jupiter | Projects | `/projects` | Stormy brown/orange |
| 🔵 Neptune | Contact | `/contact` | Deep ice blue |

### Planet Colors (from `src/config/planets.ts`)

Each planet has:
- **Atmosphere**: `top`, `mid`, `bottom`, `accent` colors for sky gradient
- **Surface**: `primary`, `secondary`, `glow` colors for ground horizon
- **Text**: `primary`, `secondary`, `muted`, `accent` for content
- **Effects**: `starDensity`, `cloudOpacity`, `glowIntensity`, plus flags like `hasRings`

---

## Visual Design

### Standing On Planets
- User is standing ON each planet surface, looking at the sky
- Planet surface visible as curved horizon arc at bottom of screen (15vh)
- Sky is the main focus using FluidBackground-style shaders
- Each atmosphere has unique color gradients and star density

### Surface Horizon
- Curved arc representing planet surface at bottom
- Uses `surface.primary` and `surface.secondary` colors
- Subtle glow emanating upward from surface
- Saturn has visible ring bands above horizon

### PlanetSurface Component (`src/components/universe/PlanetSurface.tsx`)
Static ground layer that establishes "where you are" — a spatial anchor for each planet.

**Visual Composition:**
- Fixed at bottom `-8%`, width `120%`, height `30%`
- Curved top edge via `border-radius: 50% 50% 0 0`
- Radial gradient from `surface.secondary` → `surface.primary`
- Atmospheric fade overlay using `atmosphere.bottom`
- Subtle horizon glow line at top edge

**Micro-Motion:**
- 45s loop with 1px vertical drift (slower)
- **New Atmosphere Layers**:
  - Two drifting cloud layers using radial gradients
  - One shimmering aurora layer with color shift
  - Designed to break up the "blob" shape and add organic depth

**Per-Planet Differentiation:**
| Planet | Cue |
|--------|-----|
| 🌍 Earth | Cool blue-greens, strong atmosphere |
| 🔴 Mars | Warm rust/sienna, thin atmosphere |
| 💎 Crystal | Deep blue, cyan glow, sharp edge |
| 🪐 Saturn | Golden sand, visible haze |
| 🟤 Jupiter | Storm browns/oranges |
| 🔵 Neptune | Ice blue, minimal glow |

### Atmospheric Sky (PlanetaryBackground)
- GLSL shader-based gradient sky
- Stars visible (more at top, fade toward horizon)
- Noise-based cloud/atmosphere effects
- Smooth color transitions between planets

---

## Navigation

### Top Navigation Bar
- Links: Home, About, Skills, Experience, Projects, Contact
- Uses `navigateToPlanet()` from `usePlanetNavigation` hook
- Colors adapt to current planet's text colors

### Planet Navigator (Bottom Bar)
- Emoji icons for each planet
- Shows current planet name
- Click triggers navigation with transition

---

## Transitions (TODO - NOT WORKING)

### Desired Warp Effect
When navigating between planets:
1. Current content fades out
2. **Warp animation appears**: Screen goes dark with animated star streaks/lines moving across (like hyperspace jump)
3. Warp stays visible throughout navigation
4. New page loads behind warp
5. Warp fades out revealing new planet

### Current State
- Content fades during transition
- PlanetaryBackground smoothly interpolates colors
- **MISSING**: The animated warp overlay effect

### Technical Challenge
The warp overlay component was implemented but wasn't appearing. Issues may include:
- z-index conflicts
- framer-motion animation timing
- Next.js page transitions conflicting

---

## Content Sections

### HeroSection (Earth)
- Name and tagline with TypewriterText
- HeroCarousel rotating headlines
- Scroll indicator
- Earth emoji indicator

### AboutSection (Mars)
- Profile image with gradient mask
- Bio paragraphs
- Location tag
- Quote blockquote
- **GitHubActivity component** showing live stats

### SkillsSection (Crystal)
- Skills grouped by category badges
- Glassmorphic styling
- Hover effects on skill badges

### ExperienceSection (Saturn)
- Vertical timeline with connecting lines
- Each role as a card with technologies
- Timeline dots styled like moons

### ProjectsSection (Jupiter)
- 3-column grid of project cards
- GitHub links and star counts
- Open source badges
- Moon-like gradient backgrounds

### ContactSection (Neptune)
- Contact form with glassmorphic inputs
- Social links
- Ice blue theme

---

## Key Files

### Configuration
- `src/config/planets.ts` - Planet colors and configurations
- `src/config/portfolio.ts` - Content data

### Universe Components
- `src/components/universe/PlanetaryBackground.tsx` - GLSL shader atmosphere
- `src/components/layout/PlanetaryLayoutWrapper.tsx` - Main layout with background

### Navigation
- `src/hooks/usePlanetNavigation.tsx` - Navigation state and transitions
- `src/components/ui/PlanetaryNav.tsx` - Bottom planet bar
- `src/components/ui/Navigation.tsx` - Top navigation

### Sections
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/SkillsSection.tsx`
- `src/components/sections/ExperienceSection.tsx`
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/sections/Footer.tsx`

---

## Animation Style

- **Duration**: Slow and comfortable (0.5-2s)
- **Easing**: Smooth ease-in-out
- **Philosophy**: Calm, collected, thoughtful - not flashy
- **Scroll animations**: Fade in with slight Y translation
- **Hover effects**: Subtle scale and glow changes

---

## Dependencies

- Next.js 16
- React Three Fiber + Three.js (for shaders)
- Framer Motion (animations)
- Tailwind CSS (styling)

---

## What Needs Work

1. **Warp Transition Animation** - The main priority. Need a visible animated effect during planet navigation
2. **Mobile testing** - Touch navigation
3. **Performance optimization** - Shader performance on mobile
4. **Sound effects** (optional) - Subtle whoosh during transitions
