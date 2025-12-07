'use client';

import React, { useEffect, useState } from 'react';
import FlashcardComponent from '@/components/FlashcardComponent';
import { createSession } from '@/lib/api';

export default function FlashcardsPage() {
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
        <div className="min-h-[calc(100vh-8rem)] w-full">
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-400">
                Study Flashcards
            </h1>
            <div className="bg-[#078d99] dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
                <FlashcardComponent sessionId={sessionId} />
            </div>
        </div>
    );
}
