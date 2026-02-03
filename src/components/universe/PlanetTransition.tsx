"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { type PlanetConfig } from "@/config/planets";
import { AnimatePresence, motion } from "framer-motion";

interface PlanetTransitionProps {
  isTransitioning: boolean;
  currentPlanet: PlanetConfig;
  targetPlanet: PlanetConfig | null;
  /** 0-1 progress through the transition */
  progress: number;
}

export function PlanetTransition({
  isTransitioning,
  currentPlanet,
  targetPlanet,
  progress,
}: PlanetTransitionProps) {
  if (!isTransitioning || !targetPlanet) return null;

  return (
    <div className="fixed inset-0 z-100 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <TransitionScene
          currentPlanet={currentPlanet}
          targetPlanet={targetPlanet}
          progress={progress}
        />
      </Canvas>

      {/* Cinematic vignette overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, black 100%)`,
          opacity: 0.4
        }}
      />
    </div>
  );
}

function TransitionScene({
  currentPlanet,
  targetPlanet,
  progress,
}: {
  currentPlanet: PlanetConfig;
  targetPlanet: PlanetConfig;
  progress: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    // Camera stays static, we move the world to simulate flight
    // This allows for easier control over the composition
  });

  // Flight Path Logic - DISABLED (User requested no zoom/movement)
  // Instead of flying away/approaching, we just hold position and fade.

  // 1. Departure (Static hold)
  const departScale = 7;
  const departY = -6.8;

  // 2. Arrival (Static hold)
  const arriveScale = 7;
  const arriveY = -6.8;

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} />

      {/* Starfield - Warp speed at crossover */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={progress > 0.4 && progress < 0.6 ? 25 : 0.5}
      />

      <group>
        {/* Departing Planet - Just fades out */}
        <PlanetBody
          planet={currentPlanet}
          position={[0, departY, 0]}
          scale={departScale}
          opacity={progress < 0.4 ? 1 : 1 - (progress - 0.4) * 5} // Faster fade out
          visible={progress < 0.6}
        />

        {/* Arriving Planet - Just fades in */}
        <PlanetBody
          planet={targetPlanet}
          position={[0, arriveY, 0]}
          scale={arriveScale}
          opacity={progress < 0.4 ? 0 : (progress - 0.4) * 5} // Fade in
          visible={progress > 0.4}
        />
      </group>
    </>
  );
}

function PlanetBody({
  planet,
  position,
  scale,
  opacity = 1,
  visible = true
}: {
  planet: PlanetConfig;
  position: [number, number, number];
  scale: number;
  opacity?: number;
  visible?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Atmosphere glow shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        c: { value: 0.1 },
        p: { value: 4.0 },
        glowColor: { value: new THREE.Color(planet.atmosphere.accent) },
        viewVector: { value: new THREE.Vector3() }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() 
        {
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * viewVector );
            intensity = pow( c - dot(vNormal, vNormel), p );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4( glow, 1.0 );
        }
      `
    });
  }, [planet.atmosphere.accent]);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate planet slowly
      meshRef.current.rotation.y += 0.0005;

      // Update atmosphere view vector
      const viewVector = new THREE.Vector3().subVectors(state.camera.position, meshRef.current.position);
      atmosphereMaterial.uniforms.viewVector.value.copy(viewVector);
    }
  });

  if (!visible) return null;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Main Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          color={planet.surface.primary}
          roughness={0.8}
          metalness={0.2}
          emissive={planet.surface.glow}
          emissiveIntensity={0.15}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>

      {/* Atmosphere Shell */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default PlanetTransition;
