'use client';

import React, { useState } from 'react';
import { generateQuiz, submitQuiz } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, Trophy, ArrowRight, BookOpen, AlertCircle, Star, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizComponentProps {
    sessionId: string;
}

import { useCompanion } from '@/context/CompanionContext';

export default function QuizComponent({ sessionId }: QuizComponentProps) {
    const { setState } = useCompanion();
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setState('thinking');
        try {
            const data = await generateQuiz(topic, difficulty, 5, sessionId);
            setQuiz(data);
            setAnswers({});
            setResult(null);
            setCurrentQuestionIndex(0);
            setState('idle');
        } catch (error) {
            console.error('Failed to generate quiz:', error);
            setState('sad');
            setTimeout(() => setState('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option: string) => {
        if (!quiz) return;
        const currentQ = quiz.questions[currentQuestionIndex];
        // Use question ID as key, ensure it's a string for consistency
        setAnswers(prev => ({ ...prev, [String(currentQ.id)]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        setLoading(true);
        setError(null);
        setState('thinking');
        try {
            const data = await submitQuiz(quiz.quiz_id, answers, sessionId);
            setResult(data);
            if (data.score >= 60) {
                setState('happy');
            } else {
                setState('sad');
            }
            setTimeout(() => setState('idle'), 5000);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            setError('Failed to submit quiz. Please try again.');
            setState('sad');
            setTimeout(() => setState('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] glass rounded-[32px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-transparent to-indigo-500/20 animate-pulse-slow"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 relative">
                        <div className="absolute inset-0 bg-[#1d244b] blur-xl opacity-40 rounded-full animate-pulse"></div>
                        <Loader2 className="w-20 h-20 animate-spin text-violet-800 relative z-10" />
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-white tracking-tight">
                        {quiz ? 'Analyzing Performance...' : 'Crafting Your Quiz...'}
                    </h3>
                    <p className="mt-3 text-indigo-200 font-medium animate-pulse">
                        {quiz ? 'Calculating score and insights' : 'AI is generating unique questions'}
                    </p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-[32px] p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(234,179,8,0.3)] border border-yellow-500/30">
                    <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                </div>

                <h2 className="text-4xl font-bold mb-4 text-white">Quiz Completed!</h2>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-8 tracking-tighter">
                    {Math.round(result.score)}%
                </div>

                <p className="text-indigo-200 mb-10 text-xl font-light">
                    {result.score >= 80 ? 'Outstanding performance! You\'re a master! 🌟' :
                        result.score >= 60 ? 'Good job! You\'re on the right track. 👍' :
                            'Keep learning! Every mistake is a lesson. 💪'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <p className="text-sm text-green-300 font-medium uppercase tracking-wider">Correct</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{result.correct}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <p className="text-sm text-red-300 font-medium uppercase tracking-wider">Incorrect</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{result.total - result.correct}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            <p className="text-sm text-blue-300 font-medium uppercase tracking-wider">Total</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{result.total}</p>
                    </div>
                </div>

                {/* Detailed Review */}
                <div className="text-left mb-10 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" /> Answer Review
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {result.results.map((r: any, idx: number) => (
                            <div key={idx} className={`p-5 rounded-2xl border ${r.is_correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <div className="flex gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${r.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {r.is_correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-2">{r.question}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                                <span className="text-gray-400 block text-xs mb-1 uppercase tracking-wider">Your Answer</span>
                                                <span className={r.is_correct ? 'text-green-300' : 'text-red-300'}>{r.user_answer || '(No answer)'}</span>
                                            </div>
                                            {!r.is_correct && (
                                                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/10">
                                                    <span className="text-green-400/60 block text-xs mb-1 uppercase tracking-wider">Correct Answer</span>
                                                    <span className="text-green-300">{r.correct_answer}</span>
                                                </div>
                                            )}
                                        </div>
                                        {r.explanation && (
                                            <div className="mt-3 text-xs text-indigo-200/70 border-t border-white/5 pt-2">
                                                <span className="font-semibold text-indigo-400">Explanation:</span> {r.explanation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => { setQuiz(null); setResult(null); setTopic(''); }}
                        className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                    >
                        Take Another Quiz
                    </button>
                </div>
            </motion.div>
        );
    }

    if (quiz) {
        const question = quiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
        const currentAnswer = answers[String(question.id)];

        return (
            <div className="max-w-4xl mx-auto">
                {/* Header & Progress */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <span className="text-xl font-bold text-indigo-300">{currentQuestionIndex + 1}</span>
                        </div>
                        <div>
                            <h3 className="text-sm text-indigo-300 font-medium uppercase tracking-wider">Question</h3>
                            <p className="text-xs text-indigo-400/60">of {quiz.questions.length}</p>
                        </div>
                    </div>
                    <div className="flex-1 max-w-xs ml-8">
                        <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 50, rotateY: -10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, rotateY: 10 }}
                        transition={{ duration: 0.4 }}
                        className="glass rounded-[32px] p-8 md:p-12 mb-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen className="w-32 h-32 text-white" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-white relative z-10">
                            {question.question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                            {question.options.map((option: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`p-6 text-left rounded-2xl border transition-all duration-300 flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] ${currentAnswer === option
                                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30 text-indigo-100'
                                        }`}
                                >
                                    <span className="font-medium text-lg">{option}</span>
                                    {currentAnswer === option && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {
                    error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )
                }

                <div className="flex justify-between items-center px-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 text-indigo-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180" /> Previous
                    </button>

                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== quiz.questions.length}
                            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-10 py-4 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-white/10 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            Next Question <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div >
        );
    }

    return (
        <div className="max-w-xl mx-auto glass rounded-[40px] p-10 text-center relative overflow-hidden border border-white/10 bg-[#0f7383] shadow-2xl group">
            {/* Geometric Watermark */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-5">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-white animate-spin-slower">
                    <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
                    <rect x="27.5" y="27.5" width="45" height="45" strokeWidth="0.5" transform="rotate(45 50 50)" />
                    <polygon points="50,20 80,75 20,75" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/40 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 border border-white/10 shadow-inner backdrop-blur-md">
                <Star className="w-12 h-12 text-[#09644f] fill-indigo-400/20" />
            </div>

            <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">Quiz Arena</h2>
            <p className="text-indigo-700 mb-10 text-lg leading-relaxed">
                Challenge yourself with AI-generated quizzes tailored to your exact learning needs.
            </p>

            <div className="space-y-6 text-left relative z-10">
                <div>
                    <label className="block text-sm font-semibold mb-3 ml-1 text-indigo-600 uppercase tracking-wider">Topic</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quantum Physics, French History..."
                            className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner group-hover:bg-black/30"
                        />
                        <Zap className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-3 ml-1 text-indigo-300 uppercase tracking-wider">Difficulty</label>
                    <div className="flex gap-4 flex-col sm:flex-row w-full">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`py-3 rounded-2xl text-sm sm:w-1/3 font-bold transition-all duration-300 ${difficulty === diff
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                                    : 'bg-white/5 hover:bg-white/10 text-indigo-200 hover:text-white border border-white/5'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || loading}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-6 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Start Quiz Challenge
                </button>
            </div>
        </div>
    );
}
