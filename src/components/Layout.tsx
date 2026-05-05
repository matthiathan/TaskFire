import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { 
  LayoutDashboard, 
  ListTodo, 
  History as HistoryIcon, 
  LogOut, 
  Flame,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { UserProfile, PostgrestTask } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { Toaster, toast } from 'sonner';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  key?: string | number;
}

/**
 * SidebarItem component for consistent navigation links.
 */
function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-bold text-sm uppercase tracking-widest",
        active 
          ? "bg-white/5 border-l-4 border-[#FF4D00] text-white shadow-[inset_4px_0_10px_rgba(255,77,0,0.1)]" 
          : "text-slate-500 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-[#FF4D00]" : "opacity-60")} />
      <span>{label}</span>
    </button>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile | null;
  tasks: PostgrestTask[];
}

/**
 * Layout serves as the main application shell, providing responsive navigation
 * and identity management for TaskFire operators.
 */
export default function Layout({ children, activeTab, setActiveTab, profile, tasks }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onNotificationClick = (task: PostgrestTask) => {
    setActiveTab('tasks');
    // We could potentially scroll to or highlight the task here
  };

  // Securely terminates the session
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Hard reset to clear reactive state
  };

  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'tasks', label: 'Stream', icon: ListTodo },
    { id: 'history', label: 'Archive', icon: HistoryIcon },
  ];

  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex font-sans selection:bg-[#FF4D00]/30 selection:text-white">
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0F0F0F',
            border: '1px solid rgba(255, 77, 0, 0.2)',
            color: '#fff',
            borderRadius: '1rem',
            fontFamily: 'Inter, sans-serif'
          },
        }}
      />
      {/* Desktop Sidebar - Persistent on large screens */}
      <aside className="hidden lg:flex w-64 bg-[#0F0F0F] border-r border-white/10 flex-col p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF4D00] to-[#FF9900] flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.4)] ring-1 ring-white/10">
            <Flame className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">TaskFire</span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 px-4">Menu Selection</p>
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black px-4">
            {profile?.role === 'director' ? 'Executive Access' : 'Operational Node'}
          </p>
          <div className="px-4 py-3 flex items-center gap-3 bg-white/[0.02] rounded-2xl border border-white/5">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 text-xs font-black text-[#FF4D00] shadow-inner">
                {userInitials}
             </div>
             <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{profile?.full_name || 'Anonymous Operator'}</p>
                <p className="text-[9px] text-slate-500 font-bold truncate italic tracking-tight">{profile?.email}</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-all text-left w-full group"
          >
            <LogOut className="w-5 h-5 text-red-500/30 group-hover:text-red-500 transition-colors" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">End Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F] border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#FF9900] flex items-center justify-center shadow-lg">
             <Flame className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black text-white uppercase italic tracking-tighter">TaskFire</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter tasks={tasks} onTaskClick={onNotificationClick} />
          <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-white active:scale-95 transition-all outline-none"
              aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-3/4 max-w-sm bg-[#0F0F0F] border-l border-white/10 shadow-2xl p-6 flex flex-col pt-24"
            >
              <nav className="flex-1 space-y-3">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mb-6 px-4">Strategic Paths</p>
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>
              
              <div className="mt-auto space-y-6">
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] font-black">
                       {userInitials}
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-bold text-white truncate">{profile?.full_name}</p>
                       <p className="text-[10px] text-slate-500 truncate">{profile?.email}</p>
                    </div>
                 </div>
                 <button
                    onClick={handleLogout}
                    className="flex justify-center items-center gap-3 px-4 py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] w-full border border-red-500/20 active:scale-95 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Auth</span>
                  </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Primary Viewport */}
      <main className="flex-1 flex flex-col min-w-0 pt-20 lg:pt-0">
        {/* Context Header - Visible on desktop */}
        <header className="hidden lg:flex h-24 items-center px-10 justify-between bg-gradient-to-b from-[#0F0F0F] to-transparent sticky top-0 z-30">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              {activeTab === 'dashboard' ? 'Performance' : activeTab} Briefing
              <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse shadow-[0_0_8px_#FF4D00]"></div>
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Operator Context:</span>
                <span className="text-[10px] font-bold text-[#FF4D00] uppercase tracking-widest">{profile?.full_name || 'Unidentified'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationCenter tasks={tasks} onTaskClick={onNotificationClick} />
            <div className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl py-2 pl-6 pr-3 shadow-lg transition-all backdrop-blur-md group cursor-default">
              <div className="text-right">
                <p className="text-xs font-black text-white group-hover:text-[#FF4D00] transition-colors uppercase tracking-tight">{profile?.full_name || 'Staff'}</p>
                <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.1em] mt-0.5">
                  {profile?.role === 'director' ? 'Executive Lead' : 'Field Technician'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:border-[#FF4D00]/50 transition-colors">
                <span className="text-xs font-black text-[#FF4D00]">{userInitials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tactical Interaction Section */}
        <section className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
