import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PostgrestTask, Priority } from '@/src/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingTask: PostgrestTask | null;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  priority: Priority;
  setPriority: (val: Priority) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  loading: boolean;
}

/**
 * TaskModal provides the interface for creating and updating strategic entities.
 * It uses a tactical, dark-themed overlay consistent with the TaskFire branding.
 */
export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  loading
}: TaskModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {editingTask ? 'Review Parameters' : 'Target Specification'}
              </h3>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Subject Header</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all placeholder:text-slate-700 font-medium"
                  placeholder="Enter task identifier"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Descriptive Subtext</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all resize-none placeholder:text-slate-700 leading-relaxed font-medium"
                  placeholder="Provide operational details..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Criticality Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                        priority === p 
                          ? "bg-[#FF4D00] text-white border-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.3)]" 
                          : "bg-white/5 text-slate-500 border-white/10 hover:border-[#FF4D00]/50"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Activation Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all color-scheme-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Termination Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all color-scheme-dark"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 px-6 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 border border-white/10 transition-all uppercase tracking-widest text-xs"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#FF4D00] to-[#FF9900] text-white font-black rounded-2xl hover:scale-105 shadow-[0_4px_20px_rgba(255,77,0,0.3)] transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {loading ? 'SYNCING...' : editingTask ? 'UPDATE STREAM' : 'INITIALIZE'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
