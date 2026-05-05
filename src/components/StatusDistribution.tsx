import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusDistributionProps {
  data: { name: string; value: number; color: string }[];
  completionRate: string;
}

export default function StatusDistribution({ data, completionRate }: StatusDistributionProps) {
  return (
    <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-wider relative z-10">Status Distribution</h3>
      <div className="h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FFF' }}
              itemStyle={{ color: '#FFF' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="block text-3xl font-bold text-white">{completionRate}%</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Eff.</span>
        </div>
      </div>
      
      <div className="mt-6 space-y-3 relative z-10">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
              {d.name}
            </div>
            <span className="text-xs font-bold text-white tracking-widest">{d.value}</span>
          </div>
        ))}
      </div>
      
      {/* Visual flair */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF4D00]/5 rounded-full blur-3xl group-hover:bg-[#FF4D00]/10 transition-all duration-700"></div>
    </div>
  );
}
