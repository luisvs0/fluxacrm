
import React from 'react';
import { Calendar } from 'lucide-react';

interface ChartCardProps {
  title: string;
  legend?: { label: string; color: string }[];
  xAxisLabels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, legend, xAxisLabels }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col h-[450px] shadow-sm group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-slate-900 font-bold text-[15px] tracking-tight">{title}</h3>
      </div>
      
      <div className="flex-1 relative flex flex-col px-2">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-10 w-10 flex flex-col justify-between text-[10px] text-slate-300 font-bold tracking-tighter">
          <span>R$ 4</span>
          <span>R$ 3</span>
          <span>R$ 2</span>
          <span>R$ 1</span>
          <span>R$ 0</span>
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 ml-10 mb-10 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-t border-slate-50 border-dashed"></div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full overflow-visible opacity-40">
              {/* Representação minimalista de linha de dados */}
              <polyline
                fill="none"
                stroke={legend?.[0]?.color || "#3b82f6"}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points="0,180 150,180 300,180 450,180 600,180 750,180 900,180 1050,180"
                className="transition-all duration-[2000ms] ease-out"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
              {[0, 150, 300, 450, 600, 750, 900, 1050].map((x, i) => (
                <circle key={i} cx={x} cy="180" r="3.5" fill={legend?.[0]?.color || "#3b82f6"} className="transition-all duration-300 hover:r-5 cursor-pointer" />
              ))}
            </svg>
          </div>
        </div>
        
        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-slate-400 font-bold overflow-hidden px-1">
          {xAxisLabels.map((label, idx) => (
            <span key={idx} className={idx % 2 === 0 ? '' : 'hidden md:inline'}>{label}</span>
          ))}
        </div>
      </div>

      {legend && (
        <div className="flex items-center justify-center gap-6 mt-4">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
