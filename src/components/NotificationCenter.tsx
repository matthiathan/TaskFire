import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDeadlines } from '../hooks/useDeadlines';
import { PostgrestTask } from '../types';
import { cn, formatEnum } from '../lib/utils';

interface NotificationCenterProps {
  tasks: PostgrestTask[];
  onTaskClick: (task: PostgrestTask) => void;
}

/**
 * Tactical Notification Center for monitoring mission-critical deadlines.
 */
export function NotificationCenter({ tasks, onTaskClick }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { urgentTasks, hasTodayDeadline, count } = useDeadlines(tasks);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside tactical zone
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Tactical Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-xl border transition-all active:scale-95 group",
          isOpen 
            ? "bg-[#FF4D00] border-[#FF4D00] text-white shadow-[0_0_15px_rgba(255,77,0,0.5)]" 
            : "bg-white/5 border-white/10 text-slate-400 hover:border-[#FF4D00]/50 hover:text-white"
        )}
      >
        <Bell className={cn(
          "w-5 h-5",
          hasTodayDeadline && !isOpen && "animate-[bell-shake_1s_infinite_ease-in-out]"
        )} />
        
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              hasTodayDeadline ? "bg-red-400" : "bg-amber-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-4 w-4 items-center justify-center text-[9px] font-black text-white",
              hasTodayDeadline ? "bg-red-500" : "bg-amber-500"
            )}>
              {count}
            </span>
          </span>
        )}
      </button>

      {/* Operational Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  Notification Center
                  {count > 0 && <span className="text-[#FF4D00] animate-pulse">●</span>}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tight">Active Operation Briefing</p>
              </div>
              <span className="text-[9px] font-black text-slate-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {count} URGENT
              </span>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {urgentTasks.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {urgentTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        onTaskClick(task);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-white/[0.03] transition-colors group flex gap-4"
                    >
                      <div className={cn(
                        "mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        task.urgency === 'today' 
                          ? "bg-red-500/10 text-red-500 border-red-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {task.urgency === 'today' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            task.urgency === 'today' ? "text-red-500" : "text-amber-500"
                          )}>
                            {task.urgency === 'today' ? 'Strategic Deadline: Today' : 'Upcoming: Tomorrow'}
                          </span>
                          <span className={cn(
                            "text-[8px] font-bold text-slate-600 uppercase tracking-tighter",
                            task.priority === 'high' && "text-red-400"
                          )}>
                            {formatEnum(task.priority)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#FF4D00] transition-colors truncate">
                          {task.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-[#FF4D00] transition-colors self-center" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-10 py-16 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <Bell className="w-8 h-8 opacity-20" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Alpha Clear</h4>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter italic">
                    All set. No immediate deadlines detected in the grid.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#0A0A0A] flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">TaskFire v2.0 // Ops</span>
              {count > 0 && (
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-[9px] font-black text-[#FF4D00] hover:text-white uppercase tracking-widest transition-colors"
                >
                  Dismiss HUD
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
          90% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
