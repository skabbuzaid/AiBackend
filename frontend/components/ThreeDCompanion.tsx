'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCompanion } from '@/context/CompanionContext';
import { PerspectiveCamera } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// --- Guard Bot Components ---

function GuardBot() {
    const { state } = useCompanion();
    const groupRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);

    // Spring animations for smooth transitions
    const { rotation, scale, color } = useSpring({
        rotation: state === 'thinking' ? [0, 0, 0.2] :
            state === 'sad' ? [0.3, 0, 0] :
                state === 'happy' ? [0, 0, 0] : [0, 0, 0],
        scale: state === 'talking' ? 1.05 : 1,
        color: state === 'happy' ? '#4ade80' : // Green
            state === 'sad' ? '#ef4444' :   // Red
                state === 'thinking' ? '#fbbf24' : // Amber
                    '#ffffff', // White
        config: { mass: 1, tension: 170, friction: 26 }
    });

    useFrame((stateThree) => {
        const t = stateThree.clock.getElapsedTime();

        if (groupRef.current) {
            // Idle Floating
            groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;

            // Breathing
            const breathe = 1 + Math.sin(t * 2) * 0.02;
            groupRef.current.scale.set(breathe, breathe, breathe);
        }

        if (headRef.current) {
            // Subtle head look
            headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;

            // Emotion specific head movements
            if (state === 'sad') {
                headRef.current.rotation.x = 0.3 + Math.sin(t * 1) * 0.05; // Head down
            } else if (state === 'happy') {
                headRef.current.rotation.x = Math.sin(t * 5) * 0.1; // Nodding
            }
        }
    });

    // Materials
    const suitMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ec4899', // Hot Pink / Red depending on lighting
        roughness: 0.3,
        metalness: 0.1
    }), []);

    const maskMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#111111',
        roughness: 0.1,
        metalness: 0.8,
    }), []);

    const symbolMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        toneMapped: false // Glow effect 
    }), []);

    // Symbol Geometry Helper
    const Symbol = () => {
        // Circle (Worker)
        if (state === 'idle' || state === 'happy') {
            return (
                <mesh position={[0, 0, 1.05]}>
                    <ringGeometry args={[0.3, 0.4, 32]} />
                    <a.meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            );
        }
        // Triangle (Soldier) -> Thinking/Warning
        if (state === 'thinking' || state === 'waving') {
            return (
                <mesh position={[0, -0.1, 1.05]} rotation={[0, 0, 0]}>
                    <ringGeometry args={[0.3, 0.4, 3]} />
                    <a.meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            );
        }
        // Square (Manager) -> Talking
        if (state === 'talking') {
            return (
                <mesh position={[0, 0, 1.05]} rotation={[0, 0, Math.PI / 4]}>
                    <ringGeometry args={[0.35, 0.45, 4]} />
                    <a.meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            );
        }
        // X / Cross -> Sad/Error
        if (state === 'sad') {
            return (
                <group position={[0, 0, 1.05]}>
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.8, 0.1, 0.01]} />
                        <a.meshBasicMaterial color={color} toneMapped={false} />
                    </mesh>
                    <mesh rotation={[0, 0, -Math.PI / 4]}>
                        <boxGeometry args={[0.8, 0.1, 0.01]} />
                        <a.meshBasicMaterial color={color} toneMapped={false} />
                    </mesh>
                </group>
            );
        }
        return null;
    };

    return (
        <a.group ref={groupRef} rotation-z={rotation.z as any}>
            {/* HEAD GROUP */}
            <group ref={headRef} position={[0, 1.2, 0]}>
                {/* Hood/Helmet Main Shape */}
                <mesh material={suitMaterial}>
                    <sphereGeometry args={[1.1, 64, 64]} />
                </mesh>

                {/* Face Mask Area (Black Screen) */}
                <mesh position={[0, 0, 0.15]} material={maskMaterial}>
                    <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
                </mesh>

                {/* Glowing Symbol */}
                <Symbol />
            </group>

            {/* BODY GROUP */}
            <group position={[0, -0.5, 0]}>
                {/* Torso */}
                <mesh position={[0, 0, 0]} material={suitMaterial}>
                    <capsuleGeometry args={[0.8, 2, 4, 16]} />
                </mesh>

                {/* Zipper details (optional simple line) */}
                <mesh position={[0, 0, 0.81]}>
                    <boxGeometry args={[0.1, 1.5, 0.02]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
            </group>

            {/* EMOTIONAL AURA */}
            {state === 'happy' && (
                <Sparkles count={20} scale={4} size={4} speed={0.4} opacity={0.5} color="#4ade80" />
            )}
            {state === 'thinking' && (
                <Sparkles count={10} scale={2} size={2} speed={1} opacity={0.5} color="#fbbf24" />
            )}

        </a.group>
    );
}

export default function ThreeDCompanion() {
    return (
        <div className="fixed bottom-0 right-0 w-[300px] h-[400px] pointer-events-none z-50">
            {/* Gradient backing */}
            <div className="absolute inset-0 bg-radial-gradient from-black/20 to-transparent blur-2xl transform translate-y-10"></div>

            <Canvas shadows dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 6], fov: 40 }}>
                {/* Lighting Environment */}
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#4f46e5" />
                <pointLight position={[0, 1, 3]} intensity={0.5} color="#ffffff" />

                <Float
                    speed={2}
                    rotationIntensity={0.2}
                    floatIntensity={0.5}
                    floatingRange={[-0.1, 0.1]}
                >
                    <GuardBot />
                </Float>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
