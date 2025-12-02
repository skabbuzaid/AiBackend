'use client';

import React, { useEffect, useState } from 'react';
import { createSession, getProgress } from '@/lib/api';
import { Sparkles, BookOpen, MessageSquare, TrendingUp, Calendar, Trophy, ArrowRight, Zap } from 'lucide-react';
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
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-md border border-white/20">
                            AI Learning Assistant
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">Scholar!</span>
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
                        Your personalized learning journey continues. The AI has analyzed your progress and prepared new challenges for you.
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Score', value: `${stats?.average_score || 0}%`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Quizzes Taken', value: stats?.total_quizzes || 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Flashcard Sets', value: stats?.flashcard_sets || 0, icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    { label: 'Day Streak', value: stats?.learning_streak || 0, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Start Learning
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/chat" className="group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br from-blue-500 to-cyan-400">
                        <div className="bg-card h-full rounded-xl p-6 relative overflow-hidden group-hover:bg-opacity-90 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all"></div>
                            <MessageSquare className="w-10 h-10 mb-4 text-blue-500" />
                            <h3 className="text-xl font-bold mb-2">AI Tutor Chat</h3>
                            <p className="text-muted-foreground text-sm mb-4">Have a conversation with your personal AI tutor about any topic.</p>
                            <div className="flex items-center text-blue-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Start Chat <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/quiz" className="group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br from-purple-500 to-pink-500">
                        <div className="bg-card h-full rounded-xl p-6 relative overflow-hidden group-hover:bg-opacity-90 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>
                            <BookOpen className="w-10 h-10 mb-4 text-purple-500" />
                            <h3 className="text-xl font-bold mb-2">Quiz Arena</h3>
                            <p className="text-muted-foreground text-sm mb-4">Challenge yourself with AI-generated quizzes to test your knowledge.</p>
                            <div className="flex items-center text-purple-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Take Quiz <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/flashcards" className="group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br from-orange-500 to-red-500">
                        <div className="bg-card h-full rounded-xl p-6 relative overflow-hidden group-hover:bg-opacity-90 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all"></div>
                            <Sparkles className="w-10 h-10 mb-4 text-orange-500" />
                            <h3 className="text-xl font-bold mb-2">Flashcards</h3>
                            <p className="text-muted-foreground text-sm mb-4">Master concepts quickly with smart flashcards and spaced repetition.</p>
                            <div className="flex items-center text-orange-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Create Set <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
