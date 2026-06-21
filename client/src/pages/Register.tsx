import { Lock, Mail, Sparkles, User } from "lucide-react";
import React, { useState } from "react";
import { Button, Card, Input } from "../components/common/UIControls";
import { supabase } from "@/src/utils/supabase/supabase";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const { session, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }
  if (session) {
    return <Navigate to="/dashboard" />;
  }


  const handleAction = (e: React.FormEvent) => {
    e.preventDefault(); 
    supabase.auth
      .signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Registration successful! Please check your email to verify your account.");
        }
      });
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
        <form onSubmit={handleAction}>
          <Card className="shadow-2xl border-slate-200/80 p-5 md:p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">
              Create Your Account
            </h2>
            <div>
              <Input
                label="Display Name"
                type="text"
                placeholder="e.g. Alamin Islam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="h-4 w-4 text-slate-400" />}
                required
              />

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

              <Button type="submit" className="w-full mt-4">
                Enter Workspace
              </Button>

              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
                Already have an account?{' '}
                <span 
                  onClick={() => navigate('/login')} 
                  className="font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                >
                  Sign In
                </span>
              </p>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default Register;
