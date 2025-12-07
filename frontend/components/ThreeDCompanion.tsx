'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useCompanion } from '@/context/CompanionContext';
import { PerspectiveCamera } from '@react-three/drei';
import { a } from '@react-spring/three';


function MorphingEntity() {
    const { state } = useCompanion();
    const meshRef = useRef<THREE.Mesh>(null);
    const particleRef = useRef<THREE.Points>(null);

    // Target geometry based on state
    // Idle -> Sphere (Wholeness/Circle)
    // Thinking -> Tetrahedron (Sharp/Triangle)
    // Talking -> Box (Structure/Square)
    // Happy -> Icosahedron (Complex/Radiant)

    // We will use a single mesh and morph its scale/rotation to simulate shape shifting 
    // or render 3 distinct meshes and crossfade their opacity/scale.
    // Crossfading is smoother for distinct geometries.

    // Geometries
    const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
    const boxGeo = useMemo(() => new THREE.BoxGeometry(1.5, 1.5, 1.5), []);
    const tetraGeo = useMemo(() => new THREE.TetrahedronGeometry(1.5), []);

    // Premium Cosmic Glass Material
    const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#ffffff', // Base white, tinted by lights
        roughness: 0,
        metalness: 0.1,
        transmission: 1, // Glass-like
        thickness: 2, // Refraction
        clearcoat: 1,
        clearcoatRoughness: 0,
        ior: 1.5, // Index of refraction
        attenuationDistance: 0.5,
        attenuationColor: '#6366f1' // Indigo tint deep inside
    }), []);

    // Inner Glow Material
    const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#aaddff',
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
    }), []);

    useFrame((stateThree) => {
        const t = stateThree.clock.getElapsedTime();

        if (meshRef.current) {
            // Constant subtle rotation
            meshRef.current.rotation.y = t * 0.2;
            meshRef.current.rotation.z = t * 0.1;

            // Pulse scale based on state
            if (state === 'thinking') {
                // Rapid pulse
                const scale = 1 + Math.sin(t * 10) * 0.05;
                meshRef.current.scale.setScalar(scale);
            } else if (state === 'talking') {
                // Modulate with speech-like rhythm
                const scale = 1 + Math.sin(t * 15) * 0.02 + Math.sin(t * 3) * 0.05;
                meshRef.current.scale.setScalar(scale);
            } else {
                // Gentle breathing
                const scale = 1 + Math.sin(t * 2) * 0.02;
                meshRef.current.scale.setScalar(scale);
            }
        }

        if (particleRef.current) {
            particleRef.current.rotation.y = -t * 0.1;
        }
    });

    // Determine active geometry and colors
    let ActiveGeo = sphereGeo;
    let coreColor = "#6366f1"; // Indigo

    if (state === 'thinking') {
        ActiveGeo = tetraGeo;
        coreColor = "#fbbf24"; // Gold/Amber
    } else if (state === 'talking') {
        ActiveGeo = boxGeo;
        coreColor = "#38bdf8"; // Sky Blue
    } else if (state === 'happy') {
        ActiveGeo = sphereGeo;
        coreColor = "#4ade80"; // Green
    } else if (state === 'waving') {
        ActiveGeo = boxGeo;
    }

    // Update material attenuation color dynamically for the glass tint
    // (Note: mutating material props in render loop is fine for color if optimized, 
    // generally better to use a spring but direct prop update works for simple changes)
    glassMaterial.attenuationColor.set(coreColor);

    return (
        <group>
            {/* Main Entity */}
            <a.mesh
                ref={meshRef}
                geometry={ActiveGeo}
                material={glassMaterial}
                animate={{
                    rotateZ: state === 'thinking' ? 1 : 0,
                }}
                transition={{ duration: 0.8 }}
            >
                {/* Inner Core for Glow */}
                <meshBasicMaterial attach="material-1" color={coreColor} transparent opacity={0.2} />
            </a.mesh>

            {/* Core Light Source */}
            <pointLight position={[0, 0, 0]} intensity={2} color={coreColor} distance={3} decay={2} />

            {/* Halo / Particles */}
            <group ref={particleRef}>
                <Sparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color={coreColor} />
            </group>
        </group>
    );
}

export default function ThreeDCompanion() {
    return (
        <div className="fixed bottom-8 right-8 w-[250px] h-[300px] pointer-events-none z-50">
            {/* Gradient backing for better visibility against white pages, very subtle */}
            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent blur-xl transform translate-y-10"></div>

            <Canvas shadows dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />

                {/* Lighting Environment */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#4f46e5" />

                <Float
                    speed={2}
                    rotationIntensity={0.5}
                    floatIntensity={0.5}
                    floatingRange={[-0.1, 0.1]}
                >
                    <MorphingEntity />
                </Float>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
