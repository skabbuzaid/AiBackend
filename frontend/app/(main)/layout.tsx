'use client';

import React from 'react';
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                <div className="absolute top-6 right-8 z-50">
                    <ThemeToggle />
                </div>
                <div className="max-w-7xl mx-auto pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
