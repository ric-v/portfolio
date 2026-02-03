# Portfolio Copilot Context

This is Richie Varghese's personal portfolio website built with Next.js.

## Design Concept

**Planetary Portfolio**: Each section is a different planet. Users experience the site as if traveling between worlds.

| Planet | Section | Theme |
|--------|---------|-------|
| 🌍 Earth | Home | Blue-green, welcoming |
| 🔴 Mars | About + GitHub | Dusty red/orange |
| 💎 Crystal | Skills | Cyan/purple tech |
| 🪐 Saturn | Experience | Golden with timeline rings |
| 🟤 Jupiter | Projects | Brown/orange storm |
| 🔵 Neptune | Contact | Ice blue |

## Key Architecture

- `src/config/planets.ts` - Planet color configurations
- `src/hooks/usePlanetNavigation.tsx` - Navigation hook with transition state
- `src/components/universe/PlanetaryBackground.tsx` - GLSL shader background
- `src/components/layout/PlanetaryLayoutWrapper.tsx` - Main layout wrapper

## Animation Philosophy

- Slow, comfortable transitions (2+ seconds)
- Calm and collected, not flashy
- Each planet has unique atmosphere colors

## Outstanding Task: Warp Transition

**Goal**: When navigating between planets, show an animated warp effect:
1. Content fades to black
2. Animated star streaks/lines move across screen (like hyperspace)
3. Stars/warp stays visible during page load
4. Fades out to reveal new planet

**Problem**: Previous attempts to add warp overlay didn't render visibly.

## Tech Stack

- Next.js 16
- React Three Fiber + GLSL shaders
- Framer Motion
- Tailwind CSS

## Content

- GitHub profile: ric-v
- Uses `GitHubActivity` component showing live stats
- Real projects from GitHub
