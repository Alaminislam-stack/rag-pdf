import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  ShieldAlert,
  Key,
  CheckCircle,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { Card, Input, Button } from '../components/common/UIControls';
import { useAuth } from '../context/AuthContext';

export const ProfileSettings: React.FC = () => {
  const { session } = useAuth();
  const user = session?.user;

  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Sync state with user data once loaded
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);


  return (
    <div className="space-y-6 text-left max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Personal Profile Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your workspace visual coordinates, team role parameters, and secure API developer secrets.</p>
      </div>

      {/* CORE PROFILE GRID SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* Left Column: Avatar view */}
        <div className="md:col-span-1">
          <Card title="User Persona" description="Visual workspace avatar details.">
            <div className="flex flex-col items-center justify-center text-center p-3">
              <img
                src={user?.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-550/20 shadow-lg"
              />
              <span className="text-sm font-black text-slate-800 dark:text-white mt-3.5">
                {name || user?.user_metadata?.full_name || 'User Persona'}
              </span>
              <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-850 px-2.5 py-0.5 rounded-full mt-1.5 leading-none">PRO ACCOUNT MEMBER</span>
              <p className="text-[11px] text-slate-400 mt-2">
                {user?.user_metadata?.company || 'No Company'}
              </p>
              <button className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer mt-4.5">Change Avatar Frame</button>
            </div>
          </Card>
        </div>

        {/* Right Column: Fields forms */}
        <div className="md:col-span-2 space-y-6">
          <form >
            <Card title="Workspace Contact Properties" description="Configure contact details across corporate workspaces.">
              <div className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    icon={<User className="h-4 w-4 text-slate-400" />}
                    required
                  />
                  <Input
                    label="Registered Work Email"
                    type="email"
                    value={email}
                    icon={<Mail className="h-4 w-4 text-slate-400" />}
                    disabled
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 text-xs">Save Profile Commit</Button>
              </div>
            </Card>
          </form>
        </div>

      </div>

    </div>
  );
};
