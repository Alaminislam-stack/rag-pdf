import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
} from 'lucide-react';
import { Card, Input, Button } from '../components/common/UIControls';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase/supabase';
import { toast } from 'react-toastify';

export const ProfileSettings: React.FC = () => {
  const { session, refreshProfile } = useAuth();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fachProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();

    setLoading(false);
    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    if (data) {
      setName(data.name || '');
      setEmail(data.email || '');
    }
  };

  useEffect(() => {
    if (user) {
      fachProfile();
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name })
      .select();


    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated successfully");
      await refreshProfile();
    }
  };

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
              <p className="text-[11px] text-slate-400 mt-2">
                {user?.user_metadata?.company || 'No Company'}
              </p>
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
              </div>
            </Card>
          </form>
          <Button onClick={handleUpdate} disabled={loading} className="mt-2 text-xs">
            {loading ? 'Saving...' : 'Save Profile Commit'}
          </Button>
        </div>

      </div>

    </div>
  );
};
