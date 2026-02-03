"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { type PlanetConfig, planets } from "@/config/planets";

// Atmospheric shader for planet sky
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uTransition;
  uniform vec2 uResolution;
  
  // Current planet colors
  uniform vec3 uAtmosphereTop;
  uniform vec3 uAtmosphereMid;
  uniform vec3 uAtmosphereBottom;
  uniform vec3 uAtmosphereAccent;
  
  // Target planet colors (for transition)
  uniform vec3 uTargetTop;
  uniform vec3 uTargetMid;
  uniform vec3 uTargetBottom;
  uniform vec3 uTargetAccent;
  
  uniform float uStarDensity;
  uniform float uCloudOpacity;
  uniform float uGlowIntensity;
  
  varying vec2 vUv;
  
  // Noise functions
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 adjustedUv = uv;
    adjustedUv.x *= aspect;
    
    float time = uTime * 0.08; // Slow movement
    
    // Mix current and target colors based on transition
    vec3 topColor = mix(uAtmosphereTop, uTargetTop, uTransition);
    vec3 midColor = mix(uAtmosphereMid, uTargetMid, uTransition);
    vec3 bottomColor = mix(uAtmosphereBottom, uTargetBottom, uTransition);
    vec3 accentColor = mix(uAtmosphereAccent, uTargetAccent, uTransition);
    
    // Create flowing noise distortion
    float noise1 = fbm(adjustedUv * 2.0 + time);
    float noise2 = fbm(adjustedUv * 1.5 - time * 0.5);
    
    vec2 distortedUv = uv + vec2(noise1, noise2) * 0.06;
    
    // Gradient with wave effect
    float waveY = sin(adjustedUv.x * 3.14159 * 2.0 + time) * 0.03;
    float gradientPos = distortedUv.y + waveY + noise1 * 0.08;
    
    // Sky gradient
    vec3 skyColor;
    if (gradientPos < 0.35) {
      skyColor = mix(bottomColor, midColor, gradientPos / 0.35);
    } else if (gradientPos < 0.7) {
      skyColor = mix(midColor, topColor, (gradientPos - 0.35) / 0.35);
    } else {
      skyColor = topColor;
    }
    
    // Horizon glow
    float horizonGlow = smoothstep(0.5, 0.15, abs(gradientPos - 0.25));
    skyColor += accentColor * horizonGlow * uGlowIntensity * 0.4;
    
    // Stars (more visible at top)
    float stars = 0.0;
    float starFade = smoothstep(0.3, 0.7, gradientPos);
    
    // Multiple star layers
    float starNoise1 = snoise(adjustedUv * 100.0);
    float bigStars = smoothstep(0.93, 0.96, starNoise1) * 1.2;
    bigStars *= (0.7 + 0.3 * sin(uTime * 1.5 + starNoise1 * 8.0));
    
    float starNoise2 = snoise(adjustedUv * 200.0 + 50.0);
    float medStars = smoothstep(0.94, 0.98, starNoise2) * 0.8;
    medStars *= (0.8 + 0.2 * sin(uTime * 2.0 + starNoise2 * 12.0));
    
    float starNoise3 = snoise(adjustedUv * 400.0 + 150.0);
    float smallStars = smoothstep(0.95, 0.99, starNoise3) * 0.5;
    
    stars = (bigStars + medStars + smallStars) * starFade * uStarDensity;
    
    // Clouds/atmosphere
    float clouds = 0.0;
    if (uCloudOpacity > 0.01) {
      float cloudNoise = fbm(adjustedUv * 3.0 + time * 0.3);
      clouds = smoothstep(0.2, 0.6, cloudNoise) * uCloudOpacity;
      clouds *= smoothstep(0.0, 0.4, gradientPos); // Fade out at bottom
    }
    
    vec3 finalColor = skyColor;
    finalColor += vec3(stars) * vec3(0.9, 0.95, 1.0);
    finalColor = mix(finalColor, accentColor * 0.3 + vec3(0.7), clouds * 0.3);
    
    // Vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    vignette = smoothstep(0.0, 0.8, vignette);
    finalColor *= vignette * 0.25 + 0.75;
    
    // Film grain
    float grain = (snoise(adjustedUv * 500.0 + time * 10.0) * 0.5 + 0.5) * 0.02;
    finalColor += grain - 0.01;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface AtmosphereMeshProps {
  currentPlanet: PlanetConfig;
  targetPlanet: PlanetConfig;
  transition: number;
}

function AtmosphereMesh({ currentPlanet, targetPlanet, transition }: AtmosphereMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTransition: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },

      uAtmosphereTop: { value: new THREE.Color(currentPlanet.atmosphere.top) },
      uAtmosphereMid: { value: new THREE.Color(currentPlanet.atmosphere.mid) },
      uAtmosphereBottom: { value: new THREE.Color(currentPlanet.atmosphere.bottom) },
      uAtmosphereAccent: { value: new THREE.Color(currentPlanet.atmosphere.accent) },

      uTargetTop: { value: new THREE.Color(targetPlanet.atmosphere.top) },
      uTargetMid: { value: new THREE.Color(targetPlanet.atmosphere.mid) },
      uTargetBottom: { value: new THREE.Color(targetPlanet.atmosphere.bottom) },
      uTargetAccent: { value: new THREE.Color(targetPlanet.atmosphere.accent) },

      uStarDensity: { value: currentPlanet.effects.starDensity },
      uCloudOpacity: { value: currentPlanet.effects.cloudOpacity },
      uGlowIntensity: { value: currentPlanet.effects.glowIntensity },
    }),
    []
  );

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uTransition.value = transition;

    // Update colors
    material.uniforms.uAtmosphereTop.value.set(currentPlanet.atmosphere.top);
    material.uniforms.uAtmosphereMid.value.set(currentPlanet.atmosphere.mid);
    material.uniforms.uAtmosphereBottom.value.set(currentPlanet.atmosphere.bottom);
    material.uniforms.uAtmosphereAccent.value.set(currentPlanet.atmosphere.accent);

    material.uniforms.uTargetTop.value.set(targetPlanet.atmosphere.top);
    material.uniforms.uTargetMid.value.set(targetPlanet.atmosphere.mid);
    material.uniforms.uTargetBottom.value.set(targetPlanet.atmosphere.bottom);
    material.uniforms.uTargetAccent.value.set(targetPlanet.atmosphere.accent);

    // Interpolate effects
    const starDensity = currentPlanet.effects.starDensity + (targetPlanet.effects.starDensity - currentPlanet.effects.starDensity) * transition;
    const cloudOpacity = currentPlanet.effects.cloudOpacity + (targetPlanet.effects.cloudOpacity - currentPlanet.effects.cloudOpacity) * transition;
    const glowIntensity = currentPlanet.effects.glowIntensity + (targetPlanet.effects.glowIntensity - currentPlanet.effects.glowIntensity) * transition;

    material.uniforms.uStarDensity.value = starDensity;
    material.uniforms.uCloudOpacity.value = cloudOpacity;
    material.uniforms.uGlowIntensity.value = glowIntensity;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface PlanetaryBackgroundProps {
  planetId: keyof typeof planets;
  targetPlanetId?: keyof typeof planets;
  transition?: number;
}

export function PlanetaryBackground({
  planetId,
  targetPlanetId,
  transition = 0
}: PlanetaryBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const currentPlanet = planets[planetId];
  const targetPlanet = planets[targetPlanetId || planetId];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: currentPlanet.atmosphere.mid }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        <AtmosphereMesh
          currentPlanet={currentPlanet}
          targetPlanet={targetPlanet}
          transition={transition}
        />
      </Canvas>

      {/* Surface horizon arc at bottom */}
      <PlanetSurface
        currentPlanet={currentPlanet}
        targetPlanet={targetPlanet}
        transition={transition}
      />
    </div>
  );
}

interface PlanetSurfaceProps {
  currentPlanet: PlanetConfig;
  targetPlanet: PlanetConfig;
  transition: number;
}

function PlanetSurface({ currentPlanet, targetPlanet, transition }: PlanetSurfaceProps) {
  // Interpolate surface colors
  const surfacePrimary = interpolateColor(
    currentPlanet.surface.primary,
    targetPlanet.surface.primary,
    transition
  );
  const surfaceSecondary = interpolateColor(
    currentPlanet.surface.secondary,
    targetPlanet.surface.secondary,
    transition
  );
  const surfaceGlow = interpolateColor(
    currentPlanet.surface.glow,
    targetPlanet.surface.glow,
    transition
  );

  return (
    <>
      {/* Surface glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 100%, ${surfaceGlow}40 0%, transparent 70%)`,
          transition: 'background 0.5s ease-out',
        }}
      />

      {/* Main surface arc */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ height: '15vh' }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '200vw',
            height: '200vw',
            borderRadius: '50%',
            background: `linear-gradient(to top, ${surfacePrimary} 0%, ${surfaceSecondary} 30%, transparent 50%)`,
            transform: 'translateX(-50%) translateY(96%)',
            transition: 'background 0.5s ease-out',
          }}
        />
      </div>

      {/* Surface texture overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none opacity-30"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            ${surfaceSecondary}20 2px,
            ${surfaceSecondary}20 4px
          )`,
        }}
      />

      {/* Saturn rings effect */}
      {(currentPlanet.effects.hasRings || (targetPlanet.effects.hasRings && transition > 0.5)) && (
        <motion.div
          className="absolute bottom-16 left-0 right-0 h-8 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: transition > 0.5 ? 1 : (currentPlanet.effects.hasRings ? 1 : 0) }}
          transition={{ duration: 1 }}
          style={{
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              ${surfaceGlow}30 20%, 
              ${surfaceGlow}50 40%, 
              ${surfaceGlow}30 60%, 
              transparent 80%
            )`,
          }}
        />
      )}
    </>
  );
}

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export default PlanetaryBackground;
