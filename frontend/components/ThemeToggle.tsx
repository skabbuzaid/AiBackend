'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            setTheme('system');
            applyTheme('system');
        }
    }, []);

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else if (newTheme === 'light') {
            root.classList.remove('dark');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    if (!mounted) return null;

    return (
        <div className="glass p-1 rounded-full flex items-center gap-1">
            {(['light', 'system', 'dark'] as const).map((t) => (
                <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`relative p-2 rounded-full transition-all duration-300 ${theme === t ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {theme === t && (
                        <motion.div
                            layoutId="theme-indicator"
                            className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">
                        {t === 'light' && <Sun className="w-4 h-4" />}
                        {t === 'system' && <Monitor className="w-4 h-4" />}
                        {t === 'dark' && <Moon className="w-4 h-4" />}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
