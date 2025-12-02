'use client';

import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { createSession } from '@/lib/api';

export default function ChatPage() {
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
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex-1 min-h-0">
                <ChatInterface sessionId={sessionId} />
            </div>
        </div>
    );
}
