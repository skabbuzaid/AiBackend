'use client';

import React, { useState } from 'react';
import { generateQuiz, submitQuiz } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, Trophy, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizComponentProps {
    sessionId: string;
}

export default function QuizComponent({ sessionId }: QuizComponentProps) {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const data = await generateQuiz(topic, difficulty, 5, sessionId);
            setQuiz(data);
            setAnswers({});
            setResult(null);
            setCurrentQuestionIndex(0);
        } catch (error) {
            console.error('Failed to generate quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
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
        try {
            const data = await submitQuiz(quiz.quiz_id, answers, sessionId);
            setResult(data);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] glass rounded-3xl">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 relative z-10" />
                </div>
                <p className="mt-4 text-muted-foreground font-medium animate-pulse">
                    {quiz ? 'Analyzing results...' : 'Generating your quiz...'}
                </p>
            </div>
        );
    }

    if (result) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-8 text-center max-w-2xl mx-auto"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                    <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
                    {result.score}%
                </div>
                <p className="text-muted-foreground mb-8 text-lg">
                    {result.score >= 80 ? 'Outstanding performance! 🌟' : 
                     result.score >= 60 ? 'Good job! Keep practicing. 👍' : 
                     'Keep learning, you can do better! 💪'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-600 font-medium">Correct Answers</p>
                        <p className="text-2xl font-bold text-green-700">{Object.keys(result.feedback).filter(k => result.feedback[k].correct).length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-600 font-medium">Incorrect Answers</p>
                        <p className="text-2xl font-bold text-red-700">{Object.keys(result.feedback).filter(k => !result.feedback[k].correct).length}</p>
                    </div>
                </div>

                <button
                    onClick={() => { setQuiz(null); setResult(null); setTopic(''); }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
                >
                    Take Another Quiz
                </button>
            </motion.div>
        );
    }

    if (quiz) {
        const question = quiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

        return (
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                        <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                        <span>{Math.round(progress)}% Completed</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <motion.div 
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass rounded-3xl p-8 mb-8"
                >
                    <h3 className="text-xl font-bold mb-6 leading-relaxed">{question.question}</h3>
                    <div className="space-y-3">
                        {question.options.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                    answers[currentQuestionIndex] === option
                                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30'
                                }`}
                            >
                                <span className="font-medium">{option}</span>
                                {answers[currentQuestionIndex] === option && (
                                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="flex justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    
                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== quiz.questions.length}
                            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                        >
                            Next Question <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Arena</h2>
            <p className="text-muted-foreground mb-8">Test your knowledge with AI-generated quizzes tailored to your needs.</p>

            <div className="space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium mb-2 ml-1">Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Quantum Physics, French History..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 ml-1">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                                    difficulty === diff
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
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
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
}
