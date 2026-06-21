import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  SetStateAction,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase/supabase";
import { toast } from "react-toastify";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  token: string | null;
  profile: any;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  token: null,
  profile: null,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const token = session?.access_token ?? null;
  const user = session?.user;
  // console.log(user?.id);


  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    initAuth();


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: SetStateAction<Session | null>) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const fachProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    if (data) {
      setProfile({
        ...data,
        name: data.name || user.user_metadata?.full_name || '',
        email: data.email || user.email || '',
        avatar: user.user_metadata?.avatar || '',
      });
    } else {
      setProfile({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar || '',
      });
    }
  };

  useEffect(() => {
    if (user) {
      // Set initial profile from user metadata synchronously to avoid null properties crash
      setProfile({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar || '',
      });
      fachProfile();
    } else {
      setProfile(null);
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ session, loading, token, profile, refreshProfile: fachProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);