'use client';

import React, { useState } from 'react';
import { generateFlashcards } from '@/lib/api';
import {
    Loader2, RotateCw, ChevronLeft, ChevronRight,
    Layers, Brain, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FlashcardComponentProps {
    sessionId: string;
}

const COLORS = [
    "#F4B183", "#BDD7EE", "#C5E0B4", "#FFE699",
    "#FFB4B4", "#D5A6E6", "#A9CCE3", "#ABEBC6"
];

function getReadableText(bg: string) {
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#1a1a1a" : "#ffffff";
}

export default function FlashcardComponent({ sessionId }: FlashcardComponentProps) {
    const [topic, setTopic] = useState('');
    const [numCards, setNumCards] = useState(5);
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);

        try {
            const data = await generateFlashcards(topic, numCards, sessionId);
            const raw = Array.isArray(data?.cards) ? data.cards : [];
            const styled = raw.map((c: any) => {
                const bg = COLORS[Math.floor(Math.random() * COLORS.length)];
                return {
                    ...c,
                    bg,
                    textColor: getReadableText(bg)
                };
            });

            setFlashcards(styled);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (error) {
            console.error('Flashcard error:', error);
            setFlashcards([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
        }
    };

    // Loader UI
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] glass-panel rounded-[32px]">
                <Loader2 className="w-20 h-20 animate-spin text-primary" />
                <h3 className="mt-6 text-2xl font-bold">Generating Flashcards...</h3>
                <p className="text-muted-foreground mt-2">Please wait</p>
            </div>
        );
    }

    // Viewer mode
    if (flashcards.length > 0) {
        const card = flashcards[currentIndex];

        return (
            <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 px-4">
                    <h2 className="text-3xl font-bold flex items-center gap-4">
                        <Layers className="w-6 h-6 text-primary" />
                        {topic}
                    </h2>
                    <span className="text-sm font-bold text-primary">
                        {currentIndex + 1} / {flashcards.length}
                    </span>
                </div>

                {/* Card */}
                <div className="flex-1 flex items-center justify-center min-h-[500px] perspective-1000">
                    <motion.div
                        className="w-full max-w-3xl aspect-[1.6/1] relative preserve-3d cursor-pointer shadow-2xl"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ background: card.bg, color: card.textColor, borderRadius: 40 }}
                    >
                        {/* FRONT */}
                        <div className="absolute inset-0 backface-hidden p-14 flex flex-col items-center justify-center text-center rounded-[40px]">
                            <span className="absolute top-8 left-8 text-xs font-bold uppercase bg-white/20 px-4 py-2 rounded-xl border-white/10">
                                Question
                            </span>
                            <h3 className="text-4xl font-bold">{card.front}</h3>
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 p-14 flex flex-col items-center justify-center text-center rounded-[40px]">
                            <span className="absolute top-8 left-8 text-xs font-bold uppercase bg-white/30 px-4 py-2 rounded-xl">
                                Answer
                            </span>
                            <p className="text-3xl font-medium">{card.back}</p>

                            {card.hint && (
                                <div className="absolute bottom-8 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl border border-white/20">
                                    <Lightbulb className="w-4 h-4" />
                                    <span className="text-sm">{card.hint}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-center gap-8 mt-10 pb-10">
                    {currentIndex > 0 && (
                        <button onClick={handlePrev}>
                            <ChevronLeft className="w-9 h-9" />
                        </button>
                    )}

                    <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 bg-primary text-white rounded-xl font-semibold">
                        <RotateCw className="w-5 h-5 inline mr-2" />
                        Flip
                    </button>

                    {currentIndex < flashcards.length - 1 && (
                        <button onClick={handleNext}>
                            <ChevronRight className="w-9 h-9" />
                        </button>
                    )}
                </div>

                <div className="text-center pb-6">
                    <button
                        onClick={() => setFlashcards([])}
                        className="text-sm text-muted-foreground px-7 py-4 rounded-xl font-bold bg-[#0aa39e] hover:underline"
                    >
                        Start a New Session
                    </button>
                </div>
            </div>
        );
    }

    // Start screen
    return (
        <div className="max-w-xl mx-auto glass-panel rounded-[40px] p-10 md:p-14 text-center shadow-2xl">
            <Brain className="w-14 h-14 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Flashcard Forge</h2>
            <p className="text-muted-foreground mb-10 text-lg">
                Master any subject with AI-generated flashcards.
            </p>

            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. JavaScript, Quantum Physics, Biology"
                className="w-full bg-background border rounded-xl px-6 py-5 mb-4"
            />

            {/* Number of Flashcards */}
            <input
                type="number"
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
                min={1}
                max={10}
                className="w-full bg-background border rounded-xl px-6 py-5 mb-6"
                placeholder="Number of Flashcards"
            />

            <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="w-full py-5 bg-primary text-white bg-[#3b0e5e] rounded-xl font-bold text-xl"
            >
                Generate Flashcards
            </button>
        </div>
    );
}
