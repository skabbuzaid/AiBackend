'use client';

import React, { useEffect, useState } from 'react';
import { createSession, getProgress } from '@/lib/api';
import {
    Sparkles, BookOpen, MessageSquare, Trophy, ArrowRight, Zap, PlayCircle, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const id = await createSession();
                setSessionId(id);
                const progress = await getProgress(id);
                setStats(progress);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen z-50 bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 text-white">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-[1440px] mx-auto px-6 lg:px-16 py-12 space-y-10"
            >
                {/* Welcome Banner */}
                <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
                    
                    <div className="relative z-10 space-y-5">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 text-sm font-medium">
                            AI Learning Assistant
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Welcome back, 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200"> Scholar!</span>
                        </h1>
                        <p className="max-w-3xl text-lg md:text-xl text-indigo-100/80 leading-relaxed">
                            Your AI-powered learning journey continues. New challenges, quizzes, and flashcards await you to level up your knowledge.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/quiz" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-transform">
                                <PlayCircle className="w-5 h-5" /> Continue Learning
                            </Link>
                            <Link href="/progress" className="flex items-center gap-2 border border-white/30 px-6 py-3 rounded-xl backdrop-blur-md hover:bg-white/10 transition">
                                <BarChart3 className="w-5 h-5" /> View Progress
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Avg Score', value: `${stats?.average_score || 0}%`, icon: Trophy, color: 'text-yellow-400' },
                        { label: 'Quizzes Taken', value: stats?.total_quizzes || 0, icon: BookOpen, color: 'text-blue-400' },
                        { label: 'Flashcards Made', value: stats?.flashcard_sets || 0, icon: Sparkles, color: 'text-pink-400' },
                        { label: 'Day Streak', value: stats?.learning_streak || 0, icon: Zap, color: 'text-orange-400' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
                        >
                            <div className={`p-4 rounded-xl bg-white/20`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-white/70 font-medium">{stat.label}</p>
                                <h3 className="text-2xl md:text-3xl font-bold">{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                        Start Learning
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                href: "/chat",
                                title: "AI Tutor Chat",
                                desc: "Have a 1-on-1 conversation with your personal AI tutor.",
                                icon: MessageSquare,
                                gradient: "from-blue-500 to-cyan-400",
                                text: "Start Chat",
                            },
                            {
                                href: "/quiz",
                                title: "Quiz Arena",
                                desc: "Boost your knowledge with AI-generated quizzes.",
                                icon: BookOpen,
                                gradient: "from-purple-500 to-pink-500",
                                text: "Take Quiz",
                            },
                            {
                                href: "/flashcards",
                                title: "Flashcards",
                                desc: "Master concepts faster with spaced repetition.",
                                icon: Sparkles,
                                gradient: "from-orange-500 to-red-500",
                                text: "Create Set",
                            },
                        ].map((action, idx) => (
                            <Link key={idx} href={action.href} className={`group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br ${action.gradient} shadow-lg`}>
                                <div className="bg-white/10 backdrop-blur-xl h-full rounded-3xl p-6 flex flex-col justify-between transition-transform group-hover:scale-105">
                                    <div className="space-y-3">
                                        <action.icon className="w-12 h-12 opacity-90" />
                                        <h3 className="text-xl font-bold">{action.title}</h3>
                                        <p className="text-white/70 text-sm">{action.desc}</p>
                                    </div>
                                    <div className="flex items-center text-sm font-medium gap-1 text-white/90 mt-4 group-hover:translate-x-1 transition-transform">
                                        {action.text} <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
