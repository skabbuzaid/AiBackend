'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import {
    Brain, Zap, Sparkles, GraduationCap,
    ArrowRight, PlayCircle, CheckCircle2,
    MessageCircle, BarChart3, Globe,
    ChevronDown, Star, Shield, Users,
    Layers, Command, Cpu, Upload
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'py-6 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                            <Brain className="w-6 h-6" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 dark:from-white dark:to-white/60 text-foreground">
                        EduAI
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    {['Features', 'How it Works', 'Testimonials', 'Pricing'].map((item) => (
                        <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors relative group">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/dashboard">
                        <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const Hero = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        })
            .from(imageRef.current, {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            }, "-=0.8");

        // Parallax for Image
        gsap.to(imageRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden perspective-1000">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div ref={textRef} className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-sm mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Learning Revolution</span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight text-foreground">
                        Master Any <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Subject Faster
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                        Your personal AI tutor that adapts to your learning style.
                        Generate quizzes, flashcards, and explanations instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <Link href="/dashboard" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-3 group">
                                Start Learning Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 glass-button rounded-full font-bold text-lg text-foreground hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <PlayCircle className="w-5 h-5" />
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" />
                            <span>10k+ Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span>4.9/5 Rating</span>
                        </div>
                    </div>
                </div>

                <div ref={imageRef} className="relative hidden lg:block">
                    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
                        <Image
                            src="/hero-education-3d.png"
                            alt="AI Education 3D"
                            fill
                            className="object-contain drop-shadow-2xl animate-float"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </div>
        </section>
    );
};

const Features = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    useGSAP(() => {
        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: "-200vw",
            ease: "none",
            duration: 1,
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "+=3000",
                scrub: 0.6,
                pin: true,
            }
        });

        return () => {
            pin.kill();
        };
    }, { scope: triggerRef });

    const features = [
        {
            id: "01",
            title: "Instant Quizzes",
            desc: "Turn any text or topic into a comprehensive quiz in seconds. Test your knowledge immediately with AI-generated questions tailored to your level.",
            color: "from-amber-400 to-orange-600",
            image: "/feature-quiz.png",
            tags: ["AI Generation", "Real-time Feedback", "Adaptive Difficulty"]
        },
        {
            id: "02",
            title: "Smart Flashcards",
            desc: "Master new concepts with AI-generated flashcards. Our spaced repetition algorithm ensures you study efficiently and retain information longer.",
            color: "from-indigo-400 to-cyan-600",
            image: "/feature-flashcards.png",
            tags: ["Spaced Repetition", "Auto-Generation", "Progress Tracking"]
        },
        {
            id: "03",
            title: "24/7 AI Tutor",
            desc: "Stuck on a complex problem? Get instant, step-by-step explanations anytime, anywhere. It's like having a professor in your pocket.",
            color: "from-pink-400 to-rose-600",
            image: "/feature-tutor.png",
            tags: ["Instant Answers", "Context Aware", "Multi-subject Support"]
        }
    ];

    return (
        <section id="features" className="overflow-hidden bg-background">
            <div ref={triggerRef}>
                <div ref={sectionRef} className="h-screen w-[300vw] flex flex-row relative">
                    {features.map((f, i) => (
                        <div key={i} className="w-screen h-full flex items-center justify-center px-6 border-r border-white/5 relative overflow-hidden">
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-[0.03]`} />

                            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="order-2 lg:order-1 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${f.color} opacity-20`}>
                                            {f.id}
                                        </span>
                                        <div className={`h-px flex-1 bg-gradient-to-r ${f.color} opacity-30`} />
                                    </div>

                                    <h2 className="text-5xl md:text-7xl font-bold leading-tight">{f.title}</h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                        {f.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {f.tags.map((tag, idx) => (
                                            <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="group flex items-center gap-2 text-lg font-bold hover:gap-4 transition-all">
                                        Learn more <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="order-1 lg:order-2 flex justify-center relative">
                                    <div className="relative w-full aspect-square max-w-[600px]">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-20 blur-[100px] animate-pulse-slow`} />
                                        <Image
                                            src={f.image}
                                            alt={f.title}
                                            fill
                                            className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};



const HowItWorks = () => {
    const steps = [
        {
            icon: <Upload className="w-6 h-6" />,
            title: "Upload Content",
            desc: "Upload PDFs, paste text, or select a topic. Our AI accepts various formats to get you started.",
            color: "bg-blue-500"
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "AI Analysis",
            desc: "Our advanced models analyze your content, extracting key concepts, facts, and relationships.",
            color: "bg-purple-500"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Generate Learning Materials",
            desc: "Instantly get quizzes, flashcards, and summaries tailored to your learning style.",
            color: "bg-pink-500"
        },
        {
            icon: <GraduationCap className="w-6 h-6" />,
            title: "Master the Subject",
            desc: "Study interactively, track your progress, and master the material faster than ever.",
            color: "bg-emerald-500"
        }
    ];

    return (
        <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        From raw content to mastered knowledge in four simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -translate-y-1/2 opacity-30" />

                    {steps.map((step, i) => (
                        <div key={i} className="relative group">
                            <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-2xl relative z-10 bg-background/50">
                                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Pricing = () => {
    return (
        <section id="pricing" className="py-32 px-6 bg-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start for free, upgrade when you need more power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 relative">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="text-4xl font-black mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-muted-foreground mb-8">Perfect for getting started and trying out the platform.</p>
                        <ul className="space-y-4 mb-8">
                            {['5 Quizzes per day', 'basic Flashcards', 'Standard Support'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard">
                            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold">Get Started</button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="glass-panel p-10 rounded-3xl border border-indigo-500/50 bg-indigo-500/5 relative transform md:-translate-y-4 shadow-2xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-indigo-400">Pro</h3>
                        <div className="text-5xl font-black mb-6">$9<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-muted-foreground mb-8">Unlock the full power of AI learning.</p>
                        <ul className="space-y-4 mb-8">
                            {['Unlimited Quizzes', 'Advanced Flashcards', 'Priority AI Tutor', 'Progress Analytics', 'Export to PDF'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard">
                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02]">
                                Upgrade to Pro
                            </button>
                        </Link>
                    </div>

                    {/* Team Plan */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 relative">
                        <h3 className="text-2xl font-bold mb-2">Team</h3>
                        <div className="text-4xl font-black mb-6">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-muted-foreground mb-8">Collaborate with your study group or class.</p>
                        <ul className="space-y-4 mb-8">
                            {['Everything in Pro', 'Team Management', 'Shared Resources', 'Admin Dashboard'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard">
                            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold">Contact Sales</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".testimonial-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });
    }, { scope: containerRef });

    return (
        <section id="testimonials" ref={containerRef} className="py-32 px-6 bg-secondary/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by Students Worldwide</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join a community of learners who are achieving their goals faster with EduAI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Alex Rivera", role: "Med Student", text: "The flashcard generator saved me hours of prep time. Literally a lifesaver for anatomy!", avatar: "bg-blue-500" },
                        { name: "Sarah Kim", role: "Software Engineer", text: "I use the AI tutor to debug my logic. It's like having a senior dev sitting next to me 24/7.", avatar: "bg-purple-500" },
                        { name: "Mike Thompson", role: "High School Senior", text: "Finally understood Calculus thanks to the step-by-step breakdowns. My grades went from C to A.", avatar: "bg-green-500" }
                    ].map((t, i) => (
                        <div key={i} className="testimonial-card glass-panel p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-2xl group">
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
                            </div>
                            <p className="text-lg italic mb-8 text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${t.avatar} flex items-center justify-center text-white font-bold text-lg`}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{t.name}</div>
                                    <div className="text-sm text-indigo-400">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="py-20 px-6 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Brain className="w-8 h-8 text-indigo-500" />
                    <span className="text-2xl font-bold">EduAI</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Empowering the next generation of learners with artificial intelligence.
                    Personalized learning for everyone, everywhere.
                </p>
                <div className="flex gap-4">
                    {/* Social Icons Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Product</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                    <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">API</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-lg">Legal</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 EduAI Platform. All rights reserved.</div>
            <div className="flex gap-8">
                <span>Made with ❤️ for Education</span>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Ready to Start Learning?</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Join thousands of students who are already mastering their subjects with EduAI.
                    </p>
                    <Link href="/dashboard">
                        <button className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                            Get Started for Free
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
