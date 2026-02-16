
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
    green: 'bg-emerald-50 text-emerald-600 border-emerald-300',
    red: 'bg-rose-50 text-rose-500 border-rose-300',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-300',
    blue: 'bg-indigo-50 text-[#203267] border-indigo-300'
  };

  const accentColorMap = {
    green: 'bg-emerald-600',
    red: 'bg-rose-500',
    emerald: 'bg-emerald-600',
    blue: 'bg-[#203267]'
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-6 transition-all duration-700 group shadow-sm hover:shadow-xl hover:border-[#203267]/40 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</span>
        <div className={`p-2.5 rounded-lg border transition-all duration-500 group-hover:scale-105 shadow-sm ${colorMap[color]}`}>
          {icon && React.cloneElement(icon as React.ReactElement<any>, { size: 16, strokeWidth: 3 })}
        </div>
      </div>
      
      <div className="space-y-1 relative z-10">
        <h3 className="text-2xl font-black text-slate-950 tracking-tighter leading-none">{value}</h3>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-slate-400 tracking-tight">{subtitle}</p>
          {showInfo && <Info size={11} className="text-slate-300 group-hover:text-blue-500 transition-colors" />}
        </div>
      </div>

      {/* Corporate Accent Line */}
      <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 ease-out opacity-60 ${accentColorMap[color]}`}></div>
      
      {/* Background Micro-decoration */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-1000 ${colorMap[color].split(' ')[1]}`}>
        {icon && React.cloneElement(icon as React.ReactElement<any>, { size: 100 })}
      </div>
    </div>
  );
};

export default StatCard;
