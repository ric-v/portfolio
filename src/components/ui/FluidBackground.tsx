"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../providers/ThemeContext";

// Fluid shader material for animated gradient background
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uThemeProgress;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseVelocity;
  
  // Sunrise colors
  uniform vec3 uSunriseTop;
  uniform vec3 uSunriseMid;
  uniform vec3 uSunriseBottom;
  uniform vec3 uSunriseAccent;
  
  // Sunset colors
  uniform vec3 uSunsetTop;
  uniform vec3 uSunsetMid;
  uniform vec3 uSunsetBottom;
  uniform vec3 uSunsetAccent;
  
  varying vec2 vUv;
  
  // Simplex 2D noise
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
    m = m*m ;
    m = m*m ;
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
  
  // FBM (Fractal Brownian Motion)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Correct aspect ratio to prevent stretching
    float aspect = uResolution.x / uResolution.y;
    // We adjust uv.x to match the aspect ratio so that the noise scale is isotropic
    vec2 adjustedUv = uv;
    adjustedUv.x *= aspect;

    float time = uTime * 0.15;
    
    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.1;
    float mouseStrength = uMouseVelocity * 0.3;
    
    // Apply noise distortion using adjusted UVs for shape, but original UVs for position gradients might be needed
    // Actually using adjustedUv for noise makes the noise blobs round.
    float noise1 = fbm(adjustedUv * 3.0 + time + mouseInfluence * mouseStrength);
    float noise2 = fbm(adjustedUv * 2.0 - time * 0.5);
    
    vec2 distortedUv = uv + vec2(noise1, noise2) * 0.08;
    
    // Calculate gradient position with wave effect - use original UV Y for vertical gradient
    // But use adjusted X for horizontal wave frequency to keep waves consistent
    float waveY = sin(adjustedUv.x * 3.14159 * 2.0 + time) * 0.05;
    float gradientPos = distortedUv.y + waveY + noise1 * 0.1;
    
    // Sunrise gradient
    vec3 sunriseColor;
    if (gradientPos < 0.4) {
      sunriseColor = mix(uSunriseBottom, uSunriseMid, gradientPos / 0.4);
    } else if (gradientPos < 0.7) {
      sunriseColor = mix(uSunriseMid, uSunriseTop, (gradientPos - 0.4) / 0.3);
    } else {
      sunriseColor = uSunriseTop;
    }
    
    // Add sunrise accent (sun glow at horizon)
    float horizonGlow = smoothstep(0.5, 0.2, abs(gradientPos - 0.3));
    sunriseColor += uSunriseAccent * horizonGlow * 0.4;
    
    // Sunset gradient
    vec3 sunsetColor;
    if (gradientPos < 0.4) {
      sunsetColor = mix(uSunsetBottom, uSunsetMid, gradientPos / 0.4);
    } else if (gradientPos < 0.7) {
      sunsetColor = mix(uSunsetMid, uSunsetTop, (gradientPos - 0.4) / 0.3);
    } else {
      sunsetColor = uSunsetTop;
    }
    
    // Add sunset accent (purple/magenta glow)
    float sunsetGlow = smoothstep(0.6, 0.3, abs(gradientPos - 0.35));
    sunsetColor += uSunsetAccent * sunsetGlow * 0.3;
    
    // Stars for sunset theme - Multiple layers for depth
    float stars = 0.0;
    if (uThemeProgress < 0.5) {
      float nightIntensity = 1.0 - uThemeProgress * 2.0;
      
      // Use adjustedUv for stars so they are round, not stretched
      // Layer 1: Large bright stars (fewer, brighter)
      float starNoise1 = snoise(adjustedUv * 80.0);
      float bigStars = smoothstep(0.92, 0.95, starNoise1) * 1.5;
      bigStars *= (0.7 + 0.3 * sin(uTime * 2.0 + starNoise1 * 10.0)); // Twinkle
      
      // Layer 2: Medium stars
      float starNoise2 = snoise(adjustedUv * 150.0 + 42.0);
      float mediumStars = smoothstep(0.93, 0.97, starNoise2) * 1.0;
      mediumStars *= (0.8 + 0.2 * sin(uTime * 3.0 + starNoise2 * 15.0));
      
      // Layer 3: Small scattered stars (many, dimmer)
      float starNoise3 = snoise(adjustedUv * 300.0 + 123.0);
      float smallStars = smoothstep(0.94, 0.99, starNoise3) * 0.6;
      
      // Layer 4: Tiny dust-like stars
      float starNoise4 = snoise(adjustedUv * 500.0 + 789.0);
      float tinyStars = smoothstep(0.96, 1.0, starNoise4) * 0.3;
      
      stars = (bigStars + mediumStars + smallStars + tinyStars) * nightIntensity;
      stars *= smoothstep(0.15, 0.5, gradientPos); // Fade out near bottom
      
    }
    
    // Mix between themes based on progress
    vec3 finalColor = mix(sunsetColor, sunriseColor, uThemeProgress);
    
    // Add stars to final color
    finalColor += vec3(stars) * vec3(0.8, 0.9, 1.0);
    
    // Add subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    finalColor *= vignette * 0.3 + 0.7;
    
    // Add noise grain for texture (also correct aspect for grain)
    float grain = (snoise(adjustedUv * 500.0 + time * 10.0) * 0.5 + 0.5) * 0.03;
    finalColor += grain - 0.015;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface FluidMeshProps {
  themeProgress: number;
  colors: {
    sunrise: { top: string; mid: string; bottom: string; accent: string };
    sunset: { top: string; mid: string; bottom: string; accent: string };
  };
}

function FluidMesh({ themeProgress, colors }: FluidMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 });
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uThemeProgress: { value: themeProgress },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouseVelocity: { value: 0 },
      // Sunrise colors (from config)
      uSunriseTop: { value: new THREE.Color(colors.sunrise.top) },
      uSunriseMid: { value: new THREE.Color(colors.sunrise.mid) },
      uSunriseBottom: { value: new THREE.Color(colors.sunrise.bottom) },
      uSunriseAccent: { value: new THREE.Color(colors.sunrise.accent) },
      // Sunset colors (from config)
      uSunsetTop: { value: new THREE.Color(colors.sunset.top) },
      uSunsetMid: { value: new THREE.Color(colors.sunset.mid) },
      uSunsetBottom: { value: new THREE.Color(colors.sunset.bottom) },
      uSunsetAccent: { value: new THREE.Color(colors.sunset.accent) },
    }),
    [colors] // Re-create uniforms if colors change
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX / window.innerWidth;
      const newY = 1 - e.clientY / window.innerHeight;

      mouseRef.current.vx = Math.abs(newX - mouseRef.current.x);
      mouseRef.current.vy = Math.abs(newY - mouseRef.current.y);
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update resolution uniform when size changes
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
    material.uniforms.uThemeProgress.value = themeProgress;
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    material.uniforms.uResolution.value.set(state.size.width, state.size.height);

    // Decay velocity
    const velocity = Math.sqrt(
      mouseRef.current.vx * mouseRef.current.vx +
      mouseRef.current.vy * mouseRef.current.vy
    );
    material.uniforms.uMouseVelocity.value = velocity;
    mouseRef.current.vx *= 0.95;
    mouseRef.current.vy *= 0.95;
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

export interface FluidBackgroundProps {
  config?: {
    sunrise: { top: string; mid: string; bottom: string; accent: string };
    sunset: { top: string; mid: string; bottom: string; accent: string };
  };
}

export function FluidBackground({ config }: FluidBackgroundProps) {
  const { theme, visualProgress } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default colors if no config provided
  const defaultColors = {
    sunrise: {
      top: '#e8f4f8',
      mid: '#c0e8f0',
      bottom: '#ffe0b2',
      accent: '#ffb74d',
    },
    sunset: {
      top: '#030a0c',
      mid: '#051a1f',
      bottom: '#0a2a30',
      accent: 'rgba(120, 72, 197, 0.5)',
    },
  };

  const colors = config || defaultColors;

  // visualProgress is now handled centrally: 0 = Sunset (Dark), 1 = Sunrise (Light)
  const animatedProgress = visualProgress;

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: theme === "sunrise" ? colors.sunrise.top : colors.sunset.top }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0, 1] }}
      >
        <FluidMesh themeProgress={animatedProgress} colors={colors} />
      </Canvas>

      {/* Global Atmosphere Overlay - Simulates directional light from top-right source */}
      <Canvas
        className="z-[1] absolute inset-0"
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Allow frame skipping under load
        gl={{
          antialias: false, // Disable for better performance
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{
          background: theme === "sunrise"
            ? "linear-gradient(225deg, rgba(255, 183, 77, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)"
            : "linear-gradient(225deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0) 50%, transparent 80%)",
          transition: "background 2.5s ease-in-out"
        }}
      >
        {/* You might render a simple plane or other elements here for the overlay if needed */}
      </Canvas>

      {/* Animated Clouds removed - replaced by PlanetAmbientLayer */}

    </div>
  );
}

export default FluidBackground;
