'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CompanionState = 'idle' | 'thinking' | 'talking' | 'happy' | 'sad';

interface CompanionContextType {
    state: CompanionState;
    setState: (state: CompanionState) => void;
    message: string | null;
    setMessage: (msg: string | null) => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

export function CompanionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CompanionState>('idle');
    const [message, setMessage] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchState = async () => {
            try {
                // In a real app, send actual context (page, activity)
                const context = {
                    page: window.location.pathname,
                    action: 'viewing'
                };

                const response = await fetch('http://localhost:8000/api/companion/state', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(context)
                });

                if (response.ok) {
                    const data = await response.json();
                    // Only update if not currently in a temporary override state (like thinking during quiz gen)
                    // For simplicity, we allow overwrite but usually we'd have a priority system.
                    // Here we'll just check if we are 'idle' or randomly updating.

                    // Actually, let's just update "message" and "state" if we are not in a critical block
                    // or maybe just update periodically.

                    // User Request: "they call the api for the all minmam 5 time" -> Assume 5 seconds? or 5 times? 
                    // "minmam 5 time" likely means minimum 5 seconds interval.

                    if (data.state) setState(data.state as CompanionState);
                    if (data.message) setMessage(data.message);
                }
            } catch (error) {
                console.error("Failed to fetch companion state", error);
            }
        };

        const interval = setInterval(fetchState, 5000); // Poll every 5 seconds
        fetchState(); // Initial call

        return () => clearInterval(interval);
    }, []);

    return (
        <CompanionContext.Provider value={{ state, setState, message, setMessage }}>
            {children}
        </CompanionContext.Provider>
    );
}

export function useCompanion() {
    const context = useContext(CompanionContext);
    if (context === undefined) {
        throw new Error('useCompanion must be used within a CompanionProvider');
    }
    return context;
}
