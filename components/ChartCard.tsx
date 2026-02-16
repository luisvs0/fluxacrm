
import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  legend?: { label: string; color: string }[];
  xAxisLabels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, legend, xAxisLabels }) => {
  return (
    <div className="bg-white p-6 md:p-8 flex flex-col h-[420px] transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-300">
              <BarChart3 size={16} />
           </div>
           <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest">{title}</h3>
        </div>
      </div>
      
      <div className="flex-1 relative flex flex-col px-2">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[8px] text-slate-400 font-black">
          <span>R$ 4</span>
          <span>R$ 3</span>
          <span>R$ 2</span>
          <span>R$ 1</span>
          <span>R$ 0</span>
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 ml-8 mb-8 relative border-l border-b border-slate-200">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-t border-slate-100 border-dotted"></div>
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full overflow-visible opacity-40">
            {/* Linha placeholder suave */}
            <polyline
              fill="none"
              stroke="#203267"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,180 150,140 300,160 450,110 600,130 750,80 900,100"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            {/* Pontos */}
            {[0, 150, 300, 450, 600, 750, 900].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy={i % 2 === 0 ? "140" : "110"} r="3" fill="#203267" />
              </g>
            ))}
          </svg>
        </div>
        
        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[8px] text-slate-400 font-black overflow-hidden px-1 uppercase tracking-widest">
          {xAxisLabels.map((label, idx) => (
            <span key={idx} className={idx % 2 === 0 ? '' : 'hidden md:inline'}>{label}</span>
          ))}
        </div>
      </div>

      {legend && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-300">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 group cursor-default">
              <div className="w-2 h-2 rounded-full transition-transform group-hover:scale-110" style={{ backgroundColor: item.color }}></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
