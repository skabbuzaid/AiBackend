'use client';

import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function MainLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="relative min-h-screen flex">
            {/* Sidebar */}
            <Sidebar 
                className={`
                    fixed top-0 left-0 h-full w-64 z-50 shadow-xl bg-white/90 backdrop-blur-lg
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:relative md:shadow-none
                `}
            />

         

            {/* Main Content */}
            <main className="flex-1 min-h-screen relative">
                {/* Theme toggle */}
                <div className="absolute top-6 right-8 z-50">
                    <ThemeToggle />
                </div>

            

                {/* Page Content */}
                <div className="w-full mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
