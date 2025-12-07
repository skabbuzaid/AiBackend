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
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // New State for immediate feedback
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [scoreCount, setScoreCount] = useState(0); // Track score locally
    const [answersMap, setAnswersMap] = useState<Record<string, string>>({}); // For final submission

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setState('thinking');
        try {
            const data = await generateQuiz(topic, difficulty, 5, sessionId);
            setQuiz(data);
            // Reset states
            setResult(null);
            setCurrentQuestionIndex(0);
            setScoreCount(0);
            setAnswersMap({});
            resetQuestionState();

            setState('idle');
        } catch (error) {
            console.error('Failed to generate quiz:', error);
            setState('sad');
            setTimeout(() => setState('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const resetQuestionState = () => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsCorrect(false);
    };

    const normalizeAnswer = (text: string) => {
        // Simple normalization to handle "A. Answer" vs "Answer" or case differences
        // We assume the backend might send "A" or the full text. 
        // Based on backend logic, it compares first char often. 
        // Let's rely on the text matching if possible, or basic cleaning.
        if (!text) return "";
        return text.trim().toLowerCase();
    };

    // Helper to check if an option matches the correct answer
    // The backend logic is robust (extracts A/B/C), but frontend needs to match what user sees
    // If backend sends `correct_answer: "A"`, and option is "A. Paris", we need to be careful.
    // However, usually `correct_answer` in the payload is the FULL string or the Letter. 
    // Let's assume the question object has `correct_answer` that matches one of the options text 
    // OR contains the letter prefix.
    const checkAnswer = (option: string, correct: string) => {
        // 1. Exact match
        if (option === correct) return true;

        // 2. Letter match (e.g. Correct="A", Option="A. Paris")
        // or Correct="A. Paris", Option="A" (rare)
        const optionChar = option.trim().charAt(0).toUpperCase();
        const correctChar = correct.trim().charAt(0).toUpperCase();

        // If both start with a letter followed by dot/paren, compare letters
        const isOptionLabeled = /^[A-D][\.\)]/.test(option);
        const isCorrectLabeled = /^[A-D][\.\)]/.test(correct);

        if (isOptionLabeled || correct.length === 1) {
            return optionChar === correctChar;
        }

        return normalizeAnswer(option) === normalizeAnswer(correct);
    };

    const handleOptionSelect = (option: string) => {
        if (isAnswered) return; // Prevent changing after answer

        setSelectedAnswer(option);
        setIsAnswered(true);

        const currentQ = quiz.questions[currentQuestionIndex];
        const correct = currentQ.correct_answer;

        const correctBool = checkAnswer(option, correct);
        setIsCorrect(correctBool);

        // Update Companion
        if (correctBool) {
            setState('happy');
            setScoreCount(prev => prev + 1);
        } else {
            setState('sad');
        }

        // Save for final submission
        setAnswersMap(prev => ({ ...prev, [String(currentQ.id)]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
            setState('idle');
        } else {
            // End of quiz
            handleFinalSubmit();
        }
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        setState('thinking');
        try {
            // We already validated locally, but we need to save progress to DB
            const data = await submitQuiz(quiz.quiz_id, answersMap, sessionId);
            setResult(data);
            setState('happy'); // Celebrate completion
        } catch (error) {
            console.error('Failed to save quiz:', error);
            setError('Quiz completed, but failed to save progress.');
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
                        {quiz ? 'Analyzing Results...' : 'Crafting Your Quiz...'}
                    </h3>
                    <p className="mt-3 text-indigo-200 font-medium animate-pulse">
                        {quiz ? 'Saving your progress' : 'AI is generating unique questions'}
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

                <h2 className="text-4xl font-bold mb-4 text-white">Quiz Mastered!</h2>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-8 tracking-tighter">
                    {Math.round(result.score)}%
                </div>

                <p className="text-indigo-200 mb-10 text-xl font-light">
                    {result.score >= 80 ? 'Outstanding performance! You\'re a master! 🌟' :
                        result.score >= 60 ? 'Good job! You\'re on the right track. 👍' :
                            'Keep learning! Every mistake is a lesson. 💪'}
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => { setQuiz(null); setResult(null); setTopic(''); }}
                        className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                    >
                        New Challenge
                    </button>
                </div>
            </motion.div>
        );
    }

    if (quiz) {
        const question = quiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;
        const totalQ = quiz.questions.length;

        // Ensure we handle cases where `correct_answer` might not match exactly 
        // by highlighting the one that matched our logic or failing that, the raw string
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
                            <p className="text-xs text-indigo-400/60">of {totalQ}</p>
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
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="glass rounded-[32px] p-8 md:p-12 mb-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-white relative z-10">
                            {question.question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                            {question.options.map((option: string, idx: number) => {
                                // Determine styling based on state
                                let styleClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30 text-indigo-100";
                                let icon = null;

                                if (isAnswered) {
                                    const isSelected = selectedAnswer === option;
                                    const isThisCorrect = checkAnswer(option, question.correct_answer);

                                    if (isSelected && isThisCorrect) {
                                        // Correct Selection
                                        styleClass = "bg-green-500/20 border-green-500 text-white shadow-[0_0_30px_rgba(74,222,128,0.2)]";
                                        icon = <CheckCircle className="w-6 h-6 text-green-400" />;
                                    } else if (isSelected && !isThisCorrect) {
                                        // Wrong Selection
                                        styleClass = "bg-red-500/20 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]";
                                        icon = <XCircle className="w-6 h-6 text-red-500" />;
                                    } else if (!isSelected && isThisCorrect) {
                                        // Show Correct Answer if user missed it
                                        styleClass = "bg-green-500/10 border-green-500/50 text-green-100";
                                        icon = <CheckCircle className="w-5 h-5 text-green-400 opacity-50" />;
                                    } else {
                                        // Unselected, incorrect options - dim them
                                        styleClass = "opacity-50 bg-black/20 border-transparent";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={isAnswered}
                                        className={`p-6 text-left rounded-2xl border transition-all duration-300 flex items-center justify-between group ${!isAnswered && 'hover:scale-[1.02] active:scale-[0.98]'} ${styleClass}`}
                                    >
                                        <span className="font-medium text-lg pr-4">{option}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation or Feedback Message */}
                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-8 p-4 rounded-xl border ${isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    {isCorrect ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
                                    <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? "Correct!" : "Incorrect"}
                                    </span>
                                </div>
                                {question.explanation && (
                                    <p className="text-indigo-200 text-sm leading-relaxed">
                                        <span className="font-semibold text-indigo-400">Why? </span>
                                        {question.explanation}
                                    </p>
                                )}
                            </motion.div>
                        )}

                    </motion.div>
                </AnimatePresence>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex justify-end items-center px-4 h-20">
                    {isAnswered && (
                        <button
                            onClick={handleNext}
                            className="px-10 py-4 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-white/10 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            {currentQuestionIndex === totalQ - 1 ? 'Finish Quiz' : 'Next Question'}
                            <ArrowRight className="w-5 h-5" />
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
