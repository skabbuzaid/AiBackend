'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2, History, MessageSquare, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, ChatMessage, getChatHistory } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps { sessionId: string; }
interface ChatSession { id: string; created_at: string; preview?: string; }

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages, isLoading, historyOpen]);

    useEffect(() => { inputRef.current?.focus(); loadChatHistory(); }, []);

    const loadChatHistory = async () => {
        setChatSessions([{ id: sessionId, created_at: new Date().toISOString(), preview: 'Current Chat' }]);
        const history = await getChatHistory(sessionId);
        if (history?.length) setMessages(history);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await sendMessage(input, sessionId, messages);
            const aiMessage: ChatMessage = { role: 'ai', content: res.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Error — Try again.' }]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleClearChat = () => {
        if (confirm('Clear all messages?')) setMessages([]);
    };

    return (
        <div className="flex h-full w-full overflow-hidden rounded-3xl relative bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] shadow-2xl border border-white/5">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Sidebar */}
            <AnimatePresence>
                {historyOpen && (
                    <motion.div
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute left-0 top-0 h-full w-80 bg-black/60 backdrop-blur-2xl border-r border-white/10 z-30 flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                                <History className="w-5 h-5 text-indigo-400" /> History
                            </h3>
                            <button onClick={() => setHistoryOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition duration-200 group">
                                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                            </button>
                        </div>

                        <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                            {chatSessions.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10 text-sm">No history yet</div>
                            ) : (
                                chatSessions.map(s => (
                                    <div key={s.id} className="group p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:from-indigo-600/20 hover:to-purple-600/20 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-200 text-sm font-medium truncate group-hover:text-white transition">{s.preview}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-11 group-hover:text-gray-400 transition">{new Date(s.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col z-10 relative">

                {/* Header */}
                <header className="h-20 px-8 bg-black/20 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-20">
                    <div className="flex items-center gap-4">
                        {!historyOpen && (
                            <button onClick={() => setHistoryOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
                                <Menu className="w-6 h-6" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Bot className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Tutor</span>
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">Always here to help</p>
                        </div>
                    </div>
                    <button onClick={handleClearChat} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 border border-red-500/20" title="Clear Chat">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative">
                    {messages.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center gap-6 p-10"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-sm">
                                <Bot className="w-12 h-12 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Welcome to AI Tutor</h3>
                                <p className="text-gray-400 max-w-sm">Ask me anything about your studies, assignments, or general knowledge.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-4">
                                {['Help me study calculus', 'Explain quantum physics', 'Quiz me on history', 'Writing tips'].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-200 text-left"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' && 'flex-row-reverse'}`}>
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 ring-2 ring-indigo-500/30'
                                        : 'bg-gradient-to-br from-emerald-600 to-teal-600 ring-2 ring-emerald-500/30'}`}
                                >
                                    {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                                </div>

                                <div className={`prose prose-invert max-w-none p-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-xl backdrop-blur-md border
                                    ${msg.role === 'user'
                                        ? 'bg-indigo-600/90 border-indigo-500/30 text-white rounded-tr-sm'
                                        : 'bg-gray-800/60 border-gray-700/50 text-gray-100 rounded-tl-sm'
                                    }`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                return inline ? (
                                                    <code className="bg-black/30 px-1 py-0.5 rounded text-indigo-300" {...props}>{children}</code>
                                                ) : (
                                                    <div className="bg-black/50 p-3 rounded-lg my-2 overflow-x-auto border border-white/10">
                                                        <code className="text-xs md:text-sm font-mono text-gray-200" {...props}>{children}</code>
                                                    </div>
                                                );
                                            },
                                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-500/30">
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-md rounded-tl-sm flex items-center gap-2 shadow-xl">
                                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-black/20 backdrop-blur-xl border-t border-white/5">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm"></div>
                        <div className="relative flex items-center gap-3 bg-[#0f172a] border border-white/10 px-2 py-2 rounded-2xl shadow-2xl">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-gray-500 text-sm md:text-base disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center transform"
                            >
                                <Send size={20} className={isLoading ? 'opacity-0 absolute' : 'opacity-100'} />
                                {isLoading && <Loader2 size={20} className="animate-spin" />}
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-3">AI can make mistakes. Check important information.</p>
                </div>
            </div>
        </div>
    );
}
