
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
  color: 'green' | 'red' | 'emerald' | 'blue';
  info?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, info }) => {
  const colorMap = {
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50'
  };

  const iconBorderMap = {
    green: 'border-green-100',
    red: 'border-red-100',
    emerald: 'border-emerald-100',
    blue: 'border-blue-100'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all group relative overflow-hidden h-32 flex flex-col justify-center shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{title}</p>
             {info && <span className="text-gray-300 hover:text-gray-500 cursor-pointer">{info}</span>}
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{value}</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg border ${iconBorderMap[color]} ${colorMap[color]} transition-transform group-hover:scale-105 shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
