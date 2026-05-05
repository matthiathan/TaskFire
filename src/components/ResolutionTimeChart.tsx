import React from 'react';
import { cn } from '@/src/lib/utils';

interface ResolutionTimeChartProps {
  data: { name: string; avg: number; count: number }[];
  maxAvg: number;
}

export default function ResolutionTimeChart({ data, maxAvg }: ResolutionTimeChartProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-56 shadow-xl relative overflow-hidden group">
      <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider relative z-10">Avg. Resolution (Hours)</h3>
      <div className="flex-1 flex items-end justify-between gap-4 px-2 relative z-10">
        {data.map((d) => {
          const height = maxAvg > 0 ? (d.avg / maxAvg) * 100 : 0;
          return (
            <div key={d.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="text-[10px] font-bold text-white mb-1">{d.avg}h</div>
              <div 
                className={cn(
                  "w-full rounded-t-lg transition-all duration-700 ease-out origin-bottom",
                  d.name === 'High' ? "bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]" :
                  d.name === 'Medium' ? "bg-[#FF4D00]/70" : "bg-[#FF4D00]/30"
                )} 
                style={{ height: `${Math.max(height, 5)}%` }}
              ></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{d.name}</span>
            </div>
          );
        })}
      </div>
      
      {/* Visual flair */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF4D00]/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
