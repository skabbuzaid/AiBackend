'use client';

import React, { useEffect, useState } from 'react';
import { createSession, getChatHistory, getProgress } from '@/lib/api';
import { MessageSquare, Calendar, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryPage() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const id = await createSession();
                setSessionId(id);

                const [chatHist, progress] = await Promise.all([
                    getChatHistory(id),
                    getProgress(id)
                ]);

                setHistory(chatHist);
                setRecentQuizzes(progress.recent_quizzes || []);
            } catch (error) {
                console.error('Failed to load history:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                        Learning History
                    </h1>
                    <p className="text-muted-foreground">Track your progress and review past conversations.</p>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {/* Chat History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-8 h-[600px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <div className="p-2 bg-indigo-500/10 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                            </div>
                            Recent Conversations
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-50">
                                <MessageSquare className="w-12 h-12 mb-4" />
                                <p>No chat history yet.</p>
                            </div>
                        ) : (
                            history.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
                                        }`}>
                                        {msg.role === 'user' ? 'YOU' : 'AI'}
                                    </div>
                                    <div className={`flex-1 p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-indigo-500/10 border border-indigo-500/20 rounded-tr-none'
                                            : 'bg-white/5 border border-white/10 rounded-tl-none'
                                        }`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {new Date(msg.timestamp).toLocaleDateString()} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quiz History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-8 h-[600px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <div className="p-2 bg-green-500/10 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            Quiz Performance
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {recentQuizzes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-50">
                                <CheckCircle className="w-12 h-12 mb-4" />
                                <p>No quizzes taken yet.</p>
                            </div>
                        ) : (
                            recentQuizzes.map((quiz, idx) => (
                                <div key={idx} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{quiz.topic}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(quiz.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${quiz.score >= 80 ? 'bg-green-500/20 text-green-500' :
                                                quiz.score >= 60 ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-red-500/20 text-red-500'
                                            }`}>
                                            {quiz.score}%
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${quiz.score >= 80 ? 'bg-green-500' :
                                                    quiz.score >= 60 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${quiz.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
