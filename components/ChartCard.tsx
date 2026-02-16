
import React from 'react';
import { Calendar } from 'lucide-react';

interface ChartCardProps {
  title: string;
  legend?: { label: string; color: string }[];
  xAxisLabels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, legend, xAxisLabels }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col h-[400px] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-slate-900 font-bold text-[14px] tracking-tight">{title}</h3>
      </div>
      
      <div className="flex-1 relative flex flex-col px-2">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[9px] text-slate-300 font-bold">
          <span>R$ 4</span>
          <span>R$ 3</span>
          <span>R$ 2</span>
          <span>R$ 1</span>
          <span>R$ 0</span>
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 ml-8 mb-8 relative border-l border-b border-slate-50">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-t border-slate-50 border-dotted"></div>
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full overflow-visible opacity-30">
            {/* Linha placeholder como na imagem */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,150 1000,150"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            {/* Pontos nas interseções */}
            {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
              <circle key={x} cx={x} cy="150" r="3" fill="#f43f5e" />
            ))}
          </svg>
        </div>
        
        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[8px] text-slate-300 font-bold overflow-hidden px-1">
          {xAxisLabels.map((label, idx) => (
            <span key={idx} className={idx % 2 === 0 ? '' : 'hidden md:inline'}>{label}</span>
          ))}
        </div>
      </div>

      {legend && (
        <div className="flex items-center justify-center gap-4 mt-2">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[10px] font-semibold text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
