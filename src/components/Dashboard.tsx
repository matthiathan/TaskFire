import { useMemo } from 'react';
import { PostgrestTask, UserProfile } from '@/src/types';
import { cn } from '@/src/lib/utils';
import ReportGenerator from './ReportGenerator';
import StatusDistribution from './StatusDistribution';
import ResolutionTimeChart from './ResolutionTimeChart';

interface DashboardProps {
  tasks: PostgrestTask[];
  profile: UserProfile | null;
}

/**
 * Dashboard serves as the command center for TaskFire.
 * It provides a high-level overview of operational metrics and real-time process streams.
 */
export default function Dashboard({ tasks, profile }: DashboardProps) {
  // Memoized strategic metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const completed = completedTasks.length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;

    let totalHours = 0;
    let countWithTiming = 0;

    completedTasks.forEach(task => {
      if (task.started_at && task.completed_at) {
        const start = new Date(task.started_at).getTime();
        const end = new Date(task.completed_at).getTime();
        const diffHours = (end - start) / (1000 * 60 * 60);
        totalHours += diffHours;
        countWithTiming++;
      }
    });

    const averageCompletionTime = countWithTiming > 0 ? (totalHours / countWithTiming).toFixed(1) : '0';
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

    return { total, completed, inProgress, pending, averageCompletionTime, completionRate };
  }, [tasks]);

  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#FF4D00' },
    { name: 'In Progress', value: stats.inProgress, color: '#FF9900' },
    { name: 'Pending', value: stats.pending, color: 'rgba(255,255,255,0.2)' },
  ].filter(d => d.value > 0);

  const resolutionData = useMemo(() => {
    const priorities = ['Low', 'Medium', 'High'];
    return priorities.map(p => {
      const priorityTasks = tasks.filter(t => t.priority === p && t.status === 'Completed' && t.started_at && t.completed_at);
      let totalHours = 0;
      priorityTasks.forEach(t => {
        const start = new Date(t.started_at!).getTime();
        const end = new Date(t.completed_at!).getTime();
        totalHours += (end - start) / (1000 * 60 * 60);
      });
      const avg = priorityTasks.length > 0 ? (totalHours / priorityTasks.length).toFixed(1) : '0';
      return { name: p, avg: parseFloat(avg), count: priorityTasks.length };
    });
  }, [tasks]);

  const maxAvg = Math.max(...resolutionData.map(d => d.avg), 1);

  return (
    <div className="space-y-8 pb-10">
      {/* Executive Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
            {profile?.role === 'director' ? 'Executive Control' : 'Personal Monitor'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">
            {profile?.role === 'director' 
              ? 'Real-time performance briefing for TaskFire Directors' 
              : 'Operational status of your productive flow'}
          </p>
        </div>
        {profile?.role === 'director' && <ReportGenerator tasks={tasks} stats={stats} />}
      </div>

      {/* Key Result Areas (KRA) Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          label="Total Task Corpus" 
          value={stats.total.toString()} 
          trend="+5.2%" 
          trendLabel="Stream Velocity"
        />
        <SummaryCard 
          label="Efficiency Index" 
          value={`${stats.completionRate}%`} 
          progress={parseFloat(stats.completionRate)}
        />
        <SummaryCard 
          label="Avg. Resolution" 
          value={`${stats.averageCompletionTime}h`} 
          trend="-0.8h"
          trendPositive={true}
          trendLabel="Operational Gain"
        />
        <SummaryCard 
          label="Active Engagements" 
          value={stats.inProgress.toString()} 
          trend="Real-time"
          isStatus={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactical Stream Feed */}
        <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Priority Operation Stream</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               Live Data Feed
            </span>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="text-slate-500 font-bold border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-4 uppercase tracking-[0.1em] text-[10px]">Operation Identifier</th>
                    <th className="px-6 py-4 uppercase tracking-[0.1em] text-[10px]">Strategic Priority</th>
                    <th className="px-6 py-4 uppercase tracking-[0.1em] text-[10px]">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tasks.slice(0, 5).map(task => (
                    <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-medium text-white truncate max-w-[200px] group-hover:text-[#FF4D00] transition-colors">{task.title}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 border rounded-md text-[9px] font-black tracking-widest",
                          task.priority === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          task.priority === 'Medium' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            task.status === 'Completed' ? "bg-emerald-500" :
                            task.status === 'In Progress' ? "bg-amber-500 animate-pulse" :
                            "bg-amber-500/30"
                          )}></div>
                          <span className="text-slate-300">{task.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium italic">No active tactical operations recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>

        {/* Strategic Analytics Visualization */}
        <div className="flex flex-col gap-6">
          <StatusDistribution 
            data={statusData} 
            completionRate={stats.completionRate} 
          />
          <ResolutionTimeChart 
            data={resolutionData} 
            maxAvg={maxAvg} 
          />
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  trendPositive?: boolean;
  progress?: number;
  isStatus?: boolean;
}

function SummaryCard({ label, value, trend, trendLabel, trendPositive, progress, isStatus }: SummaryCardProps) {
  return (
    <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all shadow-lg">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 leading-none">{label}</p>
      <div className="flex items-end justify-between relative z-10">
        <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
        {trend && (
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              isStatus ? "text-slate-600 italic" : 
              trendPositive ? "text-emerald-500" : "text-amber-500"
            )}>
              {trend}
            </span>
            <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">{trendLabel}</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden mb-2 border border-white/5">
            <div className="bg-[#FF4D00] h-full transition-all duration-1000 shadow-[0_0_8px_#FF4D00]" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
      
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF4D00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}
