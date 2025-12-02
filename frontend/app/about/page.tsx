'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Heart, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar Placeholder (Back Button) */}
            <nav className="absolute top-0 left-0 right-0 p-6 z-50">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-8">
                            We Are <span className="text-gradient">EduAI</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            A passionate team of educators, engineers, and designers dedicated to democratizing elite-level tutoring through artificial intelligence.
                        </p>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                    {[
                        { label: "Active Learners", value: "50K+", color: "text-indigo-500" },
                        { label: "Questions Answered", value: "2M+", color: "text-purple-500" },
                        { label: "Countries Reached", value: "120+", color: "text-pink-500" },
                        { label: "Uptime", value: "99.9%", color: "text-green-500" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-3xl text-center"
                        >
                            <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: <Target className="w-8 h-8" />, title: "Our Mission", desc: "To make personalized, high-quality education accessible to everyone, everywhere, regardless of their background." },
                        { icon: <Heart className="w-8 h-8" />, title: "Our Values", desc: "We believe in curiosity, inclusivity, and the transformative power of technology to unlock human potential." },
                        { icon: <Award className="w-8 h-8" />, title: "Our Quality", desc: "We hold our AI models to the highest standards of accuracy and pedagogical effectiveness." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card p-10 rounded-3xl border border-white/10"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Alex Rivera", role: "Founder & CEO", bg: "bg-indigo-500" },
                            { name: "Sarah Chen", role: "Head of AI", bg: "bg-purple-500" },
                            { name: "Marcus Johnson", role: "Lead Designer", bg: "bg-pink-500" }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="glass rounded-3xl overflow-hidden group"
                            >
                                <div className={`h-64 ${member.bg} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                                    <Users className="w-24 h-24 text-white/50" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-indigo-400 font-medium">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-12 text-center text-muted-foreground border-t border-white/10">
                <p>© 2024 EduAI. Built with passion.</p>
            </footer>
        </div>
    );
}
