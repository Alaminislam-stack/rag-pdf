import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Search,
  FolderHeart,
  BrainCircuit,
  Bell,
  CreditCard,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { supabase } from "@/src/utils/supabase/supabase";
import { useOtherContext } from "@/src/context/OtherContext";

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState("Personal Workspace");
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const { subscription } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

    const { pdfs } = useOtherContext()

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "PDF Archive", icon: FileText, path: "/dashboard/pdfs" },
    { name: "AI Chat RAG", icon: MessageSquare, path: "/dashboard/chat" },
    { name: "Collections", icon: FolderHeart, path: "/dashboard/collections" },
    { name: "My Profile", icon: User, path: "/dashboard/profile" },
  ];
  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  const handleNav = (path: string) => {
    navigate(path);
  };

  const activeIndex = menuItems.findIndex((item) => {
    if (item.path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(item.path);
  });

  return (
    <div
      className={`relative h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer select-none overflow-hidden"
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 dark:text-white tracking-tight leading-none text-[15px]">
                COGNITIVE AI
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase mt-1">
                PDF Engine
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {menuItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.name}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}
              />

              {!isCollapsed && (
                <span className="text-left truncate">{item.name}</span>
              )}

              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-[72px] bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-55">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout buttons and indicators */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => signOut()}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 text-rose-500 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};
