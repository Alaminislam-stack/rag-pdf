import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  HelpCircle,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '@/src/utils/supabase/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'react-toastify';

export const Topbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
  } = useAppContext();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const {session} = useAuth();
  const user = session?.user;

  async function signOut() {
  const { error } = await supabase.auth.signOut()
  if(error){
    console.error(error);
    toast.error(error.message);
    return;
  }
  toast.success("Sign out successful!");
  navigate('/login');
}
  
  const navigate = useNavigate();

  return (
    <div className="md:h-16 h-full md:border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-end z-20">
      {/* Action Toolbar */}
      <div className="flex items-center gap-4">
        
        {/* Support helper details */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 px-2.5 hover:bg-slate-150/40 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-slate-500 dark:text-slate-400 text-xs font-semibold cursor-pointer">
          <HelpCircle className="h-4 w-4" />
          <span>Help Docs</span>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-transform active:scale-95 text-slate-600 dark:text-slate-300"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Profile User avatar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-3 cursor-pointer rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-150 transition-all text-left"
          >
            <img
                src={user?.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-550/20 shadow-lg"
              />
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">{user?.user_metadata?.full_name}</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">PRO USER</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-40 flex flex-col gap-2">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-semibold leading-none">Registered Account</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 leading-tight">{user.email}</p>
              </div>

              <button 
                onClick={() => { navigate('/dashboard/profile'); setShowProfileMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
              >
                Profile settings
              </button>
              <button 
                onClick={() => { signOut(); setShowProfileMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
