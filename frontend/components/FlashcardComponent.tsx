'use client';

import React, { useState } from 'react';
import { generateFlashcards } from '@/lib/api';
import { Loader2, RotateCw, ChevronLeft, ChevronRight, Sparkles, Layers, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardComponentProps {
    sessionId: string;
}

export default function FlashcardComponent({ sessionId }: FlashcardComponentProps) {
    const [topic, setTopic] = useState('');
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const data = await generateFlashcards(topic, 5, sessionId);
            setFlashcards(data.flashcards);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (error) {
            console.error('Failed to generate flashcards:', error);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass rounded-3xl p-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-16 h-16 animate-spin text-pink-500 relative z-10" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Generating Flashcards</h3>
                <p className="mt-2 text-muted-foreground font-medium animate-pulse">
                    Crafting your study materials...
                </p>
            </div>
        );
    }

    if (flashcards.length > 0) {
        return (
            <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 px-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <div className="p-2 bg-pink-500/20 rounded-xl border border-pink-500/30">
                            <Layers className="w-6 h-6 text-pink-400" />
                        </div>
                        {topic}
                    </h2>
                    <span className="text-sm font-medium text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                        {currentIndex + 1} / {flashcards.length}
                    </span>
                </div>

                <div className="flex-1 flex items-center justify-center min-h-[400px] perspective-1000 relative px-4">
                    <motion.div
                        className="w-full max-w-2xl aspect-[3/2] relative preserve-3d cursor-pointer"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden glass rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center text-center border border-white/10 shadow-2xl hover:shadow-pink-500/10 transition-shadow bg-gradient-to-br from-white/5 to-white/0">
                            <div className="absolute top-6 left-6">
                                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">Question</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold leading-relaxed text-white">{flashcards[currentIndex].front}</h3>
                            <div className="absolute bottom-6 text-sm text-muted-foreground flex items-center gap-2 animate-pulse">
                                <RotateCw className="w-4 h-4" /> Click to flip
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden glass rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center text-center rotate-y-180 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 shadow-2xl">
                            <div className="absolute top-6 left-6">
                                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">Answer</span>
                            </div>
                            <p className="text-xl md:text-2xl leading-relaxed text-white/90">{flashcards[currentIndex].back}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="flex justify-center gap-6 mt-8 pb-8">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                        <RotateCw className="w-4 h-4" /> Flip Card
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                        className="p-4 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="text-center pb-4">
                    <button
                        onClick={() => { setFlashcards([]); setTopic(''); }}
                        className="text-sm text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
                    >
                        Create New Set
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto glass rounded-[32px] p-8 md:p-12 text-center shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

            <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 border border-white/5 shadow-inner backdrop-blur-sm">
                <Brain className="w-12 h-12 text-pink-400" />
            </div>

            <h2 className="text-3xl font-bold mb-3 text-white">Flashcard Generator</h2>
            <p className="text-muted-foreground mb-10 text-lg">Master any subject with AI-generated flashcards using spaced repetition.</p>

            <div className="space-y-6 text-left">
                <div>
                    <label className="block text-sm font-medium mb-2 ml-1 text-pink-300">What do you want to learn?</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Spanish Vocabulary, React Hooks..."
                            className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all shadow-inner"
                        />
                        <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || loading}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Generate Flashcards
                </button>
            </div>
        </div>
    );
}
