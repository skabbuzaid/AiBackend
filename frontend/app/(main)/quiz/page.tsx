'use client';

import React, { useEffect, useState } from 'react';
import QuizComponent from '@/components/QuizComponent';
import { createSession } from '@/lib/api';

export default function QuizPage() {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const initSession = async () => {
            const id = await createSession();
            setSessionId(id);
        };
        initSession();
    }, []);

    if (!sessionId) return null;

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Knowledge Quiz
            </h1>
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
                <QuizComponent sessionId={sessionId} />
            </div>
        </div>
    );
}
