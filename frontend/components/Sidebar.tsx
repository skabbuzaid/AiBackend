"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  BookOpen,
  Sparkles,
  GraduationCap,
  LayoutDashboard,
  History,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: MessageSquare, label: "AI Tutor Chat", href: "/chat" },
    { icon: BookOpen, label: "Quiz Arena", href: "/quiz" },
    { icon: Sparkles, label: "Flashcards", href: "/flashcards" },
    { icon: History, label: "History", href: "/history" },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIsMobile(true);
        setExpanded(false);
      } else if (width < 1024) {
        setIsMobile(false);
        setExpanded(false);
      } else {
        setIsMobile(false);
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        isMobile &&
        expanded
      ) {
        setExpanded(false);
      }
    };

    if (isMobile && expanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobile, expanded]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobile, expanded]);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  const handleNavClick = () => {
    if (isMobile && expanded) {
      setExpanded(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !expanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Backdrop Overlay */}
      {isMobile && expanded && (
        <div
          onClick={() => setExpanded(false)}
          className="fixed inset-0 bg-black/50 z-40"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${isMobile
          ? expanded
            ? "translate-x-0 w-64"
            : "-translate-x-full w-0"
          : expanded
            ? "w-64"
            : "w-[72px]"
          }`}
      >
        <div className="h-full glass-panel border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-4 cursor-pointer" onClick={toggleSidebar}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a1c2e] to-[#2d3748] flex items-center justify-center shadow-lg ring-1 ring-white/10 relative overflow-hidden group">
                {/* Geometric Logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-center gap-[2px]">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <div className="w-2 h-2 bg-purple-400 transform rotate-45"></div>
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent border-b-cyan-400"></div>
                </div>
              </div>
              {expanded && (
                <div style={{ animation: "slideIn 0.3s ease-out" }}>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300">EduAI</h1>
                  <p className="text-[10px] text-indigo-200/60 uppercase tracking-widest font-semibold">
                    Geometric Intelligence
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            )}

            {/* Mobile Close Button */}
            {isMobile && expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => !expanded && !isMobile && setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {expanded && (
                      <span style={{ animation: "slideIn 0.3s ease-out" }}>
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {!expanded && !isMobile && hoveredItem === index && (
                    <div
                      className="absolute left-[78px] top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50 pointer-events-none"
                      style={{ animation: "fadeIn 0.2s ease-out" }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Account */}
          {expanded && (
            <div className="p-4 mt-auto flex items-center gap-3 cursor-pointer border-t border-border/50">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
                US
              </div>
              <div style={{ animation: "slideIn 0.3s ease-out" }}>
                <p className="text-sm font-bold text-foreground">User Account</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Content Spacer for desktop/tablet */}
      {!isMobile && (
        <div
          className={`transition-all duration-300 ${expanded ? "w-64" : "w-[72px]"
            }`}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
        }

        .glass-panel {
  background: rgba(200, 455, 0, 0.2); /* Yellow with transparency */
  backdrop-filter: blur(10px);
}
      `}</style>
    </>
  );
};

export default Sidebar;