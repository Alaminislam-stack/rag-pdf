import React, { useState } from 'react';
import { supabase } from '../utils/supabase/supabase';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { Button, Card, Input } from '../components/common/UIControls';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }
  if (session) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      toast.success('Login successful!');
    }
    setLoading(false);
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-6 text-slate-800 dark:text-slate-100 font-sans relative">
      <div className="absolute top-10 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-indigo-650 flex items-center justify-center text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white">
          COGNITIVE AI
        </span>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <Card className="shadow-2xl border-slate-200/80 p-5 md:p-8 flex flex-col gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white tracking-tight">
                Sign In to Workspace
              </h2>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Enter your credentials to access your cognitive cloud vault.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-650 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <Input
                label="Work Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4 text-slate-400" />}
                required
              />

              <Input
                label="Resilient Password"
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4 text-slate-400" />}
                required
              />

              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
                Don't have an account yet?{' '}
                <span 
                  onClick={() => navigate('/register')} 
                  className="font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}