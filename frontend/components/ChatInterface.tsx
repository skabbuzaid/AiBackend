'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Trash2, History, MessageSquare, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, ChatMessage, getChatHistory, getChatSession } from '@/lib/api';

interface ChatInterfaceProps {
    sessionId: string;
}

interface ChatSession {
    id: string;
    created_at: string;
    preview?: string;
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        // Focus input on mount
        inputRef.current?.focus();
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        // In a real app, you'd fetch the list of sessions. 
        // For now, we'll just simulate it or fetch the current session's history if available.
        try {
            // This is a placeholder for fetching all sessions. 
            // You might need to add an API endpoint for listing sessions.
            // For now, let's just show the current session in the list.
            setChatSessions([{ id: sessionId, created_at: new Date().toISOString(), preview: 'Current Session' }]);
            
            // Load messages for the current session
            const history = await getChatHistory(sessionId);
            if (history && history.length > 0) {
                 // Map the API history to the ChatMessage format if needed, 
                 // assuming getChatHistory returns compatible objects
                 setMessages(history);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessage(input, sessionId, messages);
            
            const aiMessage: ChatMessage = { role: 'ai', content: response.response };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage: ChatMessage = { role: 'ai', content: 'I apologize, but I encountered a connection error. Please try again.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleClearChat = () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            setMessages([]);
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden rounded-3xl glass shadow-2xl relative">
            {/* Sidebar (History) */}
            <AnimatePresence>
                {historyOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col z-20"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <History className="w-4 h-4 text-indigo-400" />
                                History
                            </h3>
                            <button onClick={() => setHistoryOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {chatSessions.map((session) => (
                                <div key={session.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/5 hover:border-indigo-500/30 group">
                                    <div className="flex items-center gap-3 mb-1">
                                        <MessageSquare className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                                        <span className="text-sm font-medium text-white truncate">
                                            {session.preview || 'New Conversation'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pl-7">
                                        {new Date(session.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative bg-gradient-to-br from-gray-900/50 to-black/50">
                {/* Header */}
                <div className="h-16 px-6 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        {!historyOpen && (
                            <button 
                                onClick={() => setHistoryOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-white transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-full"></div>
                                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 relative">
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    AI Tutor
                                </h2>
                                <p className="text-xs text-indigo-300/80 font-medium">Always here to help</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleClearChat}
                            className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative backdrop-blur-sm">
                                    <Sparkles className="w-10 h-10 text-indigo-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Welcome back!</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    I'm your AI Tutor. Ask me anything about your studies, request a quiz, or let's just chat!
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                                {['Help me study', 'Create a quiz', 'Explain a concept', 'Summarize notes'].map((suggestion) => (
                                    <button 
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-sm text-left text-muted-foreground hover:text-white transition-all hover:scale-[1.02]"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' 
                                            : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white'
                                    }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    
                                    <div
                                        className={`p-4 rounded-2xl shadow-md backdrop-blur-sm ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white/10 border border-white/10 text-gray-100 rounded-bl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="flex items-end gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-white/5 backdrop-blur-md z-10">
                    <div className="relative flex items-center gap-2 max-w-4xl mx-auto bg-black/20 p-1.5 rounded-[24px] border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[20px] transition-all disabled:opacity-0 disabled:scale-75 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-muted-foreground/60">AI can make mistakes. Verify important information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
