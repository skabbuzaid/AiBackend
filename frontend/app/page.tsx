'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, Brain, Zap, Globe, Sparkles, 
    CheckCircle2, Star, ChevronDown, ChevronUp,
    MessageCircle, Shield, GraduationCap
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const FAQs = [
    {
        q: "How does the AI Tutor work?",
        a: "Our AI analyzes your learning style and current knowledge to generate personalized explanations, quizzes, and flashcards in real-time."
    },
    {
        q: "Is it suitable for all subjects?",
        a: "Yes! From History to Quantum Physics, our advanced language models can handle virtually any academic or professional topic."
    },
    {
        q: "Can I track my progress?",
        a: "Absolutely. We provide detailed analytics on your quiz scores, learning streaks, and topic mastery levels."
    }
];

const Testimonials = [
    {
        name: "Sarah Chen",
        role: "Medical Student",
        content: "EduAI saved me during finals. The flashcard generation is literally magic.",
        avatar: "SC"
    },
    {
        name: "James Wilson",
        role: "Software Engineer",
        content: "I use it to learn new programming concepts quickly. The interactive quizzes are spot on.",
        avatar: "JW"
    },
    {
        name: "Elena Rodriguez",
        role: "High School Teacher",
        content: "I recommend this to all my students. It's like having a personal tutor 24/7.",
        avatar: "ER"
    }
];

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-background text-foreground selection:bg-indigo-500/30">
            
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 p-6 z-50 transition-all duration-300 bg-background/50 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                            EduAI
                        </span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/dashboard">
                            <button className="px-6 py-2.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section (100vh) */}
            <main className="relative min-h-screen flex items-center pt-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                    
                    {/* Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-medium text-sm mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>The Future of Personalized Learning</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
                            Unlock Your <br />
                            <span className="text-gradient">Full Potential</span>
                        </h1>
                        
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                            Master any subject with an AI tutor that adapts to you. 
                            Instant quizzes, smart flashcards, and 24/7 support.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/dashboard">
                                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center gap-3 group w-full sm:w-auto justify-center">
                                    Start Learning Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto">
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Free tier available</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 blur-[120px] opacity-20 rounded-full animate-pulse" />
                        
                        {/* Floating Card */}
                        <div className="relative glass rounded-[2.5rem] p-8 border border-white/20 shadow-2xl animate-float">
                            {/* Floating Elements */}
                            <div className="absolute -top-10 -right-10 glass p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">A+</div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Current Grade</div>
                                        <div className="font-bold">Excellent</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -left-8 glass p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Learning Streak</div>
                                        <div className="font-bold">12 Days 🔥</div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Card Content */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">Your Learning Path</h3>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">LIVE</span>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { title: "Quantum Physics Basics", progress: 75, color: "bg-indigo-500" },
                                        { title: "European History", progress: 45, color: "bg-purple-500" },
                                        { title: "Calculus II", progress: 90, color: "bg-pink-500" }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{item.title}</span>
                                                <span className="text-muted-foreground">{item.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                    className={`h-full ${item.color}`} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-40 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-indigo-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <div className="text-center relative z-10">
                                        <div className="text-4xl font-bold mb-1">850+</div>
                                        <div className="text-sm text-muted-foreground">Concepts Mastered</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
                >
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                </motion.div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Excel</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Our platform combines advanced AI with proven cognitive science principles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: 'Smart Quizzes', 
                                desc: 'Adaptive testing that identifies your weak spots and helps you strengthen them.', 
                                icon: <Brain className="w-8 h-8 text-white" />, 
                                color: 'from-indigo-400 to-blue-600' 
                            },
                            { 
                                title: 'AI Flashcards', 
                                desc: 'Instantly generate flashcards from any text or topic. Master concepts faster.', 
                                icon: <Zap className="w-8 h-8 text-white" />, 
                                color: 'from-purple-400 to-pink-600' 
                            },
                            { 
                                title: 'Global Knowledge', 
                                desc: 'Access a world of information. Ask anything, get instant, accurate answers.', 
                                icon: <Globe className="w-8 h-8 text-white" />, 
                                color: 'from-emerald-400 to-teal-600' 
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="glass-card p-10 rounded-[2rem] group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 px-6 bg-secondary/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Loved by Learners</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Testimonials.map((t, i) => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-sm text-muted-foreground">{t.role}</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-muted-foreground italic">"{t.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {FAQs.map((faq, i) => (
                            <div key={i} className="glass rounded-2xl overflow-hidden border border-white/10">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-lg">{faq.q}</span>
                                    {openFaq === i ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/10 bg-black/20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Brain className="w-6 h-6 text-indigo-500" />
                            <span className="text-xl font-bold">EduAI</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Empowering the next generation of learners with artificial intelligence.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-indigo-400">Features</Link></li>
                            <li><Link href="/dashboard" className="hover:text-indigo-400">Pricing</Link></li>
                            <li><Link href="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-indigo-400">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-400">Contact</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-indigo-400">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
                    © 2024 EduAI Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
