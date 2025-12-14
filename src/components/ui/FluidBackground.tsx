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
      
      // Shooting star effect - subtle and distant
      float shootingStarCycle = 12.0; // seconds per shooting star cycle
      float shootingTime = mod(uTime, shootingStarCycle);
      float shootingLength = 3.0; // Duration of one star event
      
      // Active window of time
      float shootingActive = smoothstep(0.0, 0.5, shootingTime) * smoothstep(shootingLength, shootingLength - 1.0, shootingTime);
      
      if (shootingActive > 0.01) {
        // Randomize position based on cycle
        float cycleId = floor(uTime / shootingStarCycle);
        float randX = fract(sin(cycleId * 12.9898) * 43758.5453) * aspect; // Spread across aspect
        float randY = fract(sin(cycleId * 78.233) * 43758.5453);
        
        vec2 shootStart = vec2(0.3 * aspect + randX * 0.4, 0.5 + randY * 0.4);
        
        // Direction: Moving Right and slightly Down
        vec2 shootDir = normalize(vec2(1.0, -0.3));
        
        // Position update
        float shootProgress = shootingTime / shootingLength;
        vec2 shootPos = shootStart + shootDir * shootProgress * 0.4; // Speed scale
        
        // Geometry calculations for Trail
        // adjustedUv is used for correct shape
        vec2 toPixel = adjustedUv - shootPos;
        
        // Project relative position onto movement direction
        float u = dot(toPixel, shootDir); // Distance along path (negative is behind)
        float v = length(toPixel - u * shootDir); // Perpendicular distance
        
        // Trail parameters
        float trailLen = 0.2; // Length of the tail
        float trailWidth = 0.002; // Thickness
        
        // Initialize star glow
        float glow = 0.0;
        
        // Check if pixel is behind the head (u < 0) and within trail length
        if (u < 0.0 && u > -trailLen) {
           // Fade trail as it gets further back (linear fade)
           float trailFade = smoothstep(-trailLen, 0.0, u); // 0 at back, 1 at head
           
           // Thin trail with soft edges
           float trailShape = smoothstep(trailWidth * 3.0, 0.0, v);
           
           glow += trailFade * trailShape * 0.6;
        }
        
        // Star Head (Bright dot at u ~= 0, v ~= 0)
        float headDist = length(toPixel);
        float headGlow = smoothstep(0.008, 0.001, headDist);
        glow += headGlow * 1.5; // Brighter head
        
        // Add to scene
        stars += glow * shootingActive * nightIntensity;
      }
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
}

function FluidMesh({ themeProgress }: FluidMeshProps) {
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
      // Sunrise colors (warm, light)
      uSunriseTop: { value: new THREE.Color("#e8f4f8") },
      uSunriseMid: { value: new THREE.Color("#c0e8f0") },
      uSunriseBottom: { value: new THREE.Color("#ffe0b2") }, // Pale Orange
      uSunriseAccent: { value: new THREE.Color("#ffb74d") }, // Lighter Orange
      // Sunset colors (dark, teal/emerald)
      uSunsetTop: { value: new THREE.Color("#030a0c") },
      uSunsetMid: { value: new THREE.Color("#051a1f") },
      uSunsetBottom: { value: new THREE.Color("#0a2a30") },
      uSunsetAccent: { value: new THREE.Color("rgba(120, 72, 197, 0.5)") }, // Violet 700 - Darker shade of glow
    }),
    []
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

export function FluidBackground() {
  const { theme, visualProgress } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        style={{ backgroundColor: theme === "sunrise" ? "#e8f4f8" : "#050f12" }}
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
        <FluidMesh themeProgress={animatedProgress} />
      </Canvas>

      {/* Global Atmosphere Overlay - Simulates directional light from top-right source */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: theme === "sunrise"
            ? "linear-gradient(225deg, rgba(255, 183, 77, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)"
            : "linear-gradient(225deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0) 50%, transparent 80%)",
          transition: "background 2.5s ease-in-out"
        }}
      />

      {/* Animated Clouds for Dark Mode - Lower Half - Optimized for Mobile */}
      {theme === "sunset" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {/* Cloud Layer 1 - Large, slow clouds at the bottom */}
          <div
            className="absolute"
            style={{
              bottom: isMobile ? '2%' : '5%',
              left: isMobile ? '-10%' : '-20%',
              width: isMobile ? '80%' : '50%',
              height: isMobile ? '100px' : '150px',
              background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(109, 40, 217, 0.3) 0%, rgba(124, 58, 237, 0.15) 40%, transparent 70%)',
              filter: isMobile ? 'blur(25px)' : 'blur(40px)',
              animation: 'cloudDrift 80s linear infinite',
              opacity: isMobile ? 0.8 : 1
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: isMobile ? '5%' : '8%',
              left: isMobile ? '20%' : '30%',
              width: isMobile ? '90%' : '60%',
              height: isMobile ? '90px' : '130px',
              background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(91, 33, 182, 0.25) 0%, rgba(109, 40, 217, 0.15) 50%, transparent 75%)',
              filter: isMobile ? 'blur(20px)' : 'blur(35px)',
              animation: 'cloudDrift 100s linear infinite',
              animationDelay: '-30s',
              opacity: isMobile ? 0.7 : 1
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '2%',
              left: isMobile ? '10%' : '-10%',
              width: isMobile ? '80%' : '70%',
              height: isMobile ? '70px' : '100px',
              background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(124, 58, 237, 0.25) 0%, rgba(139, 92, 246, 0.15) 45%, transparent 70%)',
              filter: isMobile ? 'blur(15px)' : 'blur(30px)',
              animation: 'cloudDrift 70s linear infinite',
              animationDelay: '-50s',
              opacity: isMobile ? 0.6 : 1
            }}
          />
        </div>
      )}

      {/* Bird Flock for Light Mode - Top Right Horizon - V Formation - Optimized for Mobile */}
      {theme === "sunrise" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {Array.from({ length: isMobile ? 7 : 14 }).map((_, i) => { // Reduce bird count on mobile
            // V-formation math
            const row = Math.floor((i + 1) / 2);
            const side = i % 2 === 0 ? 1 : -1;

            // Base position (Leader at front)
            const baseX = isMobile ? 85 : 75; // Move further right on mobile
            const baseY = isMobile ? 12 : 15;

            // Offsets for larger V shape
            const offsetX = -row * (isMobile ? 1.0 : 1.5); // Tighter formation on mobile
            const offsetY = row * side * (isMobile ? 0.8 : 1.2);

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${baseX + offsetX}%`,
                  top: `${baseY + offsetY}%`,
                  // Cohesive movement: synchronized duration with minimal variance
                  animation: `fly-away ${22 + Math.random() * 2}s linear infinite`,
                  // Slight stagger for natural feel, but mostly together
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0,
                  transform: isMobile ? 'scale(0.7)' : 'scale(1)' // Smaller birds on mobile
                }}
              >
                <div
                  style={{
                    animation: 'fly-cycle 0.5s ease-in-out infinite alternate',
                    animationDelay: `${Math.random()}s`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Smaller V-shape bird svg */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 14C6 14 8 8 12 14C16 8 18 14 22 14" stroke="#0d2f2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default FluidBackground;
