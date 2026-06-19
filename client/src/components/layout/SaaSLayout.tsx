import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Menu, X } from "lucide-react";

interface SaaSLayoutProps {
  children: React.ReactNode;
}

export const SaaSLayout: React.FC<SaaSLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 h-screen overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Floating Mobile Sidebar Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 z-30 md:hidden"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 z-40 md:hidden animate-in slide-in-from-left duration-250">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </>
      )}

      {/* Primary content area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Responsive Mobile Header */}
        <div className="md:hidden h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 flex items-center gap-1 text-xs font-semibold"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
          <span className="font-bold text-xs tracking-tight text-slate-800 dark:text-white">
            COGNITIVE RAG
          </span>
          <div className="" >
            <Topbar />
          </div>
          {/* Include Topbar in mobile header for consistent access to profile & theme toggle */}
          
        </div>

        {/* Generic Topbar with search details & badges (Hidden/displayed proportionally) */}
        <div className="hidden md:flex h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 items-center justify-end z-20">
          <Topbar />
        </div>

        {/* Scrollable Children Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
};
