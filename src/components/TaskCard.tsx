import React from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, Activity, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';
import { PostgrestTask, Status } from '@/src/types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: PostgrestTask;
  idx: number;
  onUpdateStatus: (id: string, status: Status) => void;
  onEdit: (task: PostgrestTask) => void;
  onDelete: (id: string) => void;
}

/**
 * TaskCard represents a single tactical operation in the TaskList.
 * It features responsive controls and real-time status indicators.
 */
export default function TaskCard({ task, idx, onUpdateStatus, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
      key={task.id}
      className={cn(
        "bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 hover:border-[#FF4D00]/50 transition-all group relative overflow-hidden",
        task.status === 'Completed' && "border-emerald-500/10"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative z-10 w-full">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
              task.priority === 'High' ? "bg-red-500/20 text-red-500 border-red-500/30" :
              task.priority === 'Medium' ? "bg-blue-500/20 text-blue-500 border-blue-500/30" :
              "bg-slate-500/20 text-slate-500 border-slate-500/30"
            )}>
              {task.priority} Priority
            </span>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
              task.status === 'In Progress' ? "bg-[#FF9900]/20 text-[#FF9900] border-[#FF9900]/30" :
              task.status === 'Completed' ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" :
              "bg-white/5 text-slate-400 border-white/10"
            )}>
              {task.status}
            </span>
          </div>
          <h4 className={cn("text-xl font-bold text-white truncate", task.status === 'Completed' && "opacity-50 line-through")}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
          
          <div className="flex items-center gap-4 sm:gap-6 mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-max">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              LOGGED {format(new Date(task.created_at), 'MMM dd, yyyy')}
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1.5 text-rose-500/80 min-w-max">
                <Calendar className="w-3.5 h-3.5" />
                DUE {format(new Date(task.due_date), 'MMM dd, yyyy')}
              </div>
            )}
            {task.started_at && (
              <div className="flex items-center gap-1.5 text-[#FF9900]/80 min-w-max">
                <Activity className="w-3.5 h-3.5" />
                ENGAGED {formatDate(task.started_at)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end sm:justify-start">
          {task.status === 'Pending' && (
            <button 
              onClick={() => onUpdateStatus(task.id, 'In Progress')}
              className="w-10 h-10 flex items-center justify-center bg-[#FF9900]/10 hover:bg-[#FF9900] text-[#FF9900] hover:text-white rounded-xl transition-all"
              title="Initiate Project"
            >
              <Clock className="w-5 h-5" />
            </button>
          )}
          {task.status === 'In Progress' && (
            <button 
              onClick={() => onUpdateStatus(task.id, 'Completed')}
              className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all"
              title="Terminate Project"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onEdit(task)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
            title="Modify Parameters"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
            title="Erase Operation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF4D00]/5 to-transparent pointer-events-none -mr-16 -mt-16 rounded-full blur-2xl"></div>
    </motion.div>
  );
}
