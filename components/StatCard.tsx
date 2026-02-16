
import React from 'react';
import { Info } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
  color: 'green' | 'red' | 'emerald' | 'blue';
  showInfo?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, showInfo }) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-rose-50 text-rose-500 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };

  const trendIconBg = {
    green: 'bg-emerald-100 text-emerald-600',
    red: 'bg-rose-100 text-rose-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 transition-all duration-300 group shadow-sm hover:shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`p-2 rounded-lg border transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          {icon && React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-[26px] font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] font-medium text-slate-400">{subtitle}</span>
          {showInfo && <Info size={12} className="text-slate-300 cursor-help" />}
        </div>
      </div>
      {/* Mini Trend Indicator Badge at Bottom Right if available */}
      <div className="absolute bottom-6 right-6">
         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trendIconBg[color]} opacity-50`}>
             {icon && React.cloneElement(icon as React.ReactElement<any>, { size: 14 })}
         </div>
      </div>
    </div>
  );
};

export default StatCard;
