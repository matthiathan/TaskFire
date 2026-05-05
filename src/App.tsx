import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import Auth from '@/src/components/Auth';
import Layout from '@/src/components/Layout';
import Dashboard from '@/src/components/Dashboard';
import TaskList from '@/src/components/TaskList';
import History from '@/src/components/History';
import { TaskListSkeleton, DashboardSkeleton } from '@/src/components/Skeleton';
import { PostgrestTask, UserProfile } from './types';
import { taskService } from '@/src/services/taskService';
import { Loader2, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<PostgrestTask[]>([]);

  const [initError, setInitError] = useState<string | null>(null);

  /**
   * Fetches the user profile from the public.users table.
   */
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error('[App] Profile fetch error:', err);
    }
  };

  /**
   * Primary authentication and system initialization logic.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('[App] Auth init error:', err);
        setInitError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state transitions (Sign In / Out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  /**
   * Tactical data synchronization.
   */
  const fetchTasks = async (silent = false) => {
    if (!silent) setLoadingTasks(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('[App] Task fetch error:', error);
    } finally {
      if (!silent) setLoadingTasks(false);
    }
  };

  /**
   * Established real-time operational stream for tasks.
   */
  useEffect(() => {
    if (session) {
      fetchTasks();

      // Realtime operational subscription
      const channel = supabase
        .channel('tasks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*', 
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('[App] Real-time tactical update:', payload);
            // Silent refresh to avoid jarring UI flickers during background updates
            fetchTasks(true);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const renderActiveTab = () => {
    if (loadingTasks && tasks.length === 0) {
      if (activeTab === 'dashboard') return <DashboardSkeleton />;
      return <TaskListSkeleton />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} profile={userProfile} />;
      case 'tasks':
        return <TaskList tasks={tasks.filter(t => t.status !== 'Completed')} onRefresh={() => fetchTasks(true)} />;
      case 'history':
        return <History tasks={tasks.filter(t => t.status === 'Completed')} onRefresh={() => fetchTasks(true)} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-6">
        <div className="w-16 h-16 fire-gradient rounded-2xl flex items-center justify-center fire-shadow animate-pulse">
            <Flame className="text-white w-10 h-10" />
        </div>
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#FF4D00] animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Stream...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
        <div className="max-w-xl w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 glass rounded-[2.5rem] border-[#FF4D00]/20 shadow-[0_0_50px_rgba(255,77,0,0.1)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 fire-gradient rounded-xl flex items-center justify-center fire-shadow">
                <Flame className="text-white w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">System Activation Required</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Status: Pending Configuration</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 text-sm font-medium">
                  {initError}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Required Secrets:</h3>
                <div className="grid gap-3">
                  <SecretItem 
                    label="VITE_SUPABASE_URL" 
                    value="https://fxqzpossvboaswlhroxh.supabase.co" 
                    desc="Project API Level"
                  />
                  <SecretItem 
                    label="VITE_SUPABASE_ANON_KEY" 
                    value="••••••••••••••••" 
                    desc="Public API Key"
                  />
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl space-y-3 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest underline decoration-[#FF4D00] underline-offset-4">Instructions:</h4>
                <ol className="text-slate-400 text-sm space-y-2 list-decimal list-inside">
                  <li>Click **Settings** (top right) in AI Studio.</li>
                  <li>Open the **Secrets** panel.</li>
                  <li>Click **Add Secret** and enter the keys above.</li>
                  <li>Click **Save** and wait for the system to re-initialize.</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="https://supabase.com/dashboard/project/fxqzpossvboaswlhroxh/settings/api"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-center text-sm uppercase tracking-widest border border-white/10"
              >
                Open Supabase Dashboard
              </a>
              <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest mt-2">
                TaskFire // Executive Productivity Stream
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

function SecretItem({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-[#FF4D00]/30 transition-all">
      <div>
        <p className="text-[10px] font-black text-[#FF4D00] uppercase tracking-tighter mb-0.5">{desc}</p>
        <p className="text-xs font-bold text-white font-mono">{label}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300 transition-colors truncate max-w-[150px]">{value}</p>
      </div>
    </div>
  );
}

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} profile={userProfile}>
      {renderActiveTab()}
    </Layout>
  );
}
