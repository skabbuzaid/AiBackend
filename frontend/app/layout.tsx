import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CompanionProvider } from "@/context/CompanionContext";
import ThreeDCompanion from "@/components/ThreeDCompanion";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EduAI Platform",
    description: "Your Personal AI Learning Assistant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.className} bg-background text-foreground antialiased transition-colors duration-300 overflow-x-hidden`}>
                {/* Dynamic Background Elements */}
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />
                <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

                {/* Ambient Orbs */}
                <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] -z-10 animate-pulse-slow pointer-events-none" />
                <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] -z-10 animate-pulse-slow pointer-events-none delay-1000" />

                <CompanionProvider>
                    {children}
                    <ThreeDCompanion />
                </CompanionProvider>
            </body>
        </html>
    );
}
