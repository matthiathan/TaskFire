import { useState, useMemo } from 'react';
import { PostgrestTask, Priority } from '@/src/types';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Archive
} from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryProps {
  tasks: PostgrestTask[];
  onRefresh: () => void;
}

/**
 * History provides an audited view of all completed tactical operations.
 * It includes advanced filtering and strategic sorting capabilities.
 */
export default function History({ tasks, onRefresh }: HistoryProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  // Strategic data transformation
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                             t.description?.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => {
        const dateA = new Date(a.completed_at || 0).getTime();
        const dateB = new Date(b.completed_at || 0).getTime();
        return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [tasks, search, priorityFilter, dateSort]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Hub */}
      <div className="bg-[#0F0F0F] p-4 sm:p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search archive stream..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#FF4D00] transition-all placeholder:text-slate-600 font-medium"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-transparent text-[10px] border-none outline-none text-slate-400 font-black uppercase tracking-widest cursor-pointer w-full"
            >
              <option value="All" className="bg-[#0F0F0F]">Alpha All</option>
              <option value="High" className="bg-[#0F0F0F]">High Red</option>
              <option value="Medium" className="bg-[#0F0F0F]">Medium Blue</option>
              <option value="Low" className="bg-[#0F0F0F]">Low Gray</option>
            </select>
          </div>

          <button 
            onClick={() => setDateSort(s => s === 'desc' ? 'asc' : 'desc')}
            className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex-1 sm:flex-initial"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {dateSort === 'desc' ? 'Newest' : 'Oldest'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Audit Log Table - with mobile card degradation */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Task Specifics</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rank</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-600">
                      <div className="flex flex-col items-center">
                        <Archive className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-sm font-bold uppercase tracking-widest italic">No matching audited data found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, idx) => (
                    <motion.tr 
                      key={task.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="font-bold text-white text-lg group-hover:text-[#FF4D00] transition-colors">{task.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-sm mt-1 leading-relaxed">{task.description || 'No descriptive payload recorded.'}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                           task.priority === 'High' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                           task.priority === 'Medium' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                           "bg-white/5 text-slate-500 border-white/10"
                        )}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-xs text-slate-500 font-bold uppercase tracking-tight">
                        {formatDate(task.started_at)}
                      </td>
                      <td className="px-6 py-6 text-xs text-emerald-500 font-black uppercase tracking-tight">
                        {formatDate(task.completed_at)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile-Only Stacked Cards */}
        <div className="md:hidden divide-y divide-white/10">
           {filteredTasks.length === 0 ? (
             <div className="px-6 py-20 text-center text-slate-600">
                <Archive className="w-12 h-12 mb-4 opacity-10 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">No data matching requirements</p>
             </div>
           ) : (
             filteredTasks.map((task) => (
                <div key={task.id} className="p-6 space-y-4 bg-white/[0.01]">
                   <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                         <h4 className="font-bold text-white text-lg leading-tight">{task.title}</h4>
                         <span className={cn(
                           "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shrink-0",
                            task.priority === 'High' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            task.priority === 'Medium' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-white/5 text-slate-500 border-white/10"
                         )}>
                           {task.priority}
                         </span>
                      </div>
                      {task.description && <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>}
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[9px] font-bold">
                         <p className="text-slate-600 uppercase tracking-widest mb-1">Engaged</p>
                         <p className="text-slate-400 font-mono">{formatDate(task.started_at)}</p>
                      </div>
                      <div className="text-right text-[9px] font-bold">
                         <p className="text-slate-600 uppercase tracking-widest mb-1">Resolved</p>
                         <p className="text-emerald-500 font-mono font-black">{formatDate(task.completed_at)}</p>
                      </div>
                   </div>
                </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
