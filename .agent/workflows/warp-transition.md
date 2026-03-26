---
description: How to implement the warp transition effect for planetary navigation
---

# Warp Transition Implementation

## Context
The portfolio uses a planetary navigation system. When users navigate between sections (planets), there should be an animated warp/hyperspace effect.

## Current State
- `usePlanetNavigation` hook manages `isTransitioning` state
- `PlanetaryLayoutWrapper` wraps all content 
- Background colors transition smoothly
- **Missing**: Visual warp animation overlay

## Goal
When transitioning between planets:
1. Content fades out quickly
2. Black screen with animated star streaks appears
3. Star streaks animate (like hyperspace jump)
4. Warp stays visible while new page loads
5. Fades out to reveal new planet

## Key Files to Modify
- `src/hooks/usePlanetNavigation.tsx` - Add `showWarp` state
- `src/components/layout/PlanetaryLayoutWrapper.tsx` - Add warp overlay component

## Approach
1. Add a `showWarp` boolean to navigation context
2. Create `WarpAnimation` component with CSS/framer-motion animated lines
3. Set z-index high enough (9999) to overlay everything
4. Trigger warp on `navigateToPlanet()` call
5. Keep warp visible until transition completes

## Previous Issues
- Warp overlay wasn't rendering visibly
- May be z-index conflicts
- May be timing issues with framer-motion

## Testing
- Hard refresh page after changes
- Use browser dev tools to inspect if warp div exists
- Check console for any errors
