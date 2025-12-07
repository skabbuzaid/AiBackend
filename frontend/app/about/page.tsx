'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Heart, Award, Rocket, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/assets/hero-bg.png')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
            </div>

            {/* Navbar Placeholder (Back Button) */}
            <nav className="absolute top-0 left-0 right-0 p-6 z-50">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group px-4 py-2 rounded-full glass hover:bg-white/10">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-medium text-sm mb-8">
                            <Rocket className="w-4 h-4" />
                            <span>Our Journey</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
                            We Are <span className="text-gradient">EduAI</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
                            className="glass p-8 rounded-3xl text-center hover:bg-white/10 transition-colors"
                        >
                            <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="max-w-7xl mx-auto mb-32">
                    <div className="relative rounded-[3rem] overflow-hidden glass border border-white/10 p-8 md:p-16">
                        <div className="absolute inset-0 -z-10">
                            <Image
                                src="/assets/hero-bg.png"
                                alt="Background"
                                fill
                                className="object-cover opacity-10"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { icon: <Target className="w-8 h-8" />, title: "Our Mission", desc: "To make personalized, high-quality education accessible to everyone, everywhere, regardless of their background." },
                                { icon: <Heart className="w-8 h-8" />, title: "Our Values", desc: "We believe in curiosity, inclusivity, and the transformative power of technology to unlock human potential." },
                                { icon: <Award className="w-8 h-8" />, title: "Our Quality", desc: "We hold our AI models to the highest standards of accuracy and pedagogical effectiveness." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-lg">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Alex Rivera", role: "Founder & CEO", image: "/assets/team-1.png" },
                            { name: "Sarah Chen", role: "Head of AI", image: "/assets/team-2.png" },
                            { name: "Marcus Johnson", role: "Lead Designer", image: "/assets/team-3.png" }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass rounded-3xl overflow-hidden group border border-white/10"
                            >
                                <div className="h-80 relative overflow-hidden bg-gradient-to-b from-indigo-500/20 to-purple-500/20">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </div>
                                <div className="p-8 relative -mt-20 z-10">
                                    <h3 className="text-2xl font-bold mb-1 text-white">{member.name}</h3>
                                    <p className="text-indigo-300 font-medium">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-12 text-center text-muted-foreground border-t border-white/10 bg-black/20">
                <p>© 2024 EduAI. Built with passion.</p>
            </footer>
        </div>
    );
}
