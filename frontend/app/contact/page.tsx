'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Phone, Send, Loader2, MessageSquare, Building } from 'lucide-react';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/assets/hero-bg.png')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
            </div>

            {/* Navbar Placeholder */}
            <nav className="absolute top-0 left-0 right-0 p-6 z-50">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group px-4 py-2 rounded-full glass hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-medium text-sm mb-8">
                            <MessageSquare className="w-4 h-4" />
                            <span>We'd love to hear from you</span>
                        </div>
                        <h1 className="text-5xl font-black mb-6 tracking-tight">
                            Get in <span className="text-gradient">Touch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                            Have questions about our AI Tutor? Want to explore enterprise solutions? We're here to help you transform your learning experience.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <Mail className="w-6 h-6" />, title: "Email Us", value: "hello@eduai.com", desc: "For general inquiries" },
                                { icon: <Phone className="w-6 h-6" />, title: "Call Us", value: "+1 (555) 123-4567", desc: "Mon-Fri, 9am-6pm EST" },
                                { icon: <MapPin className="w-6 h-6" />, title: "Visit Us", value: "123 Innovation Dr, Tech City, CA", desc: "Come say hello!" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-lg">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{item.title}</div>
                                        <div className="text-foreground font-medium">{item.value}</div>
                                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden border border-white/20 shadow-2xl">
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

                            {submitted ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 text-center p-8">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-green-500/30">
                                        <Send className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1 text-muted-foreground">First Name</label>
                                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1 text-muted-foreground">Last Name</label>
                                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1 text-muted-foreground">Email Address</label>
                                    <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1 text-muted-foreground">Message</label>
                                    <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none hover:bg-white/10" placeholder="How can we help you?" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
