
import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Users, 
  User, 
  Building2,
  ChevronRight,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';

const Metas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'individuais' | 'squads'>('empresa');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);

  const stats = [
    { label: 'Metas Globais', value: '12', subtitle: '8 em andamento', icon: <Target />, color: 'blue' },
    { label: 'Atingimento', value: '84.2%', subtitle: '+5.2% vs Q4', icon: <TrendingUp />, color: 'emerald' },
    { label: 'Individual (Média)', value: '72%', subtitle: 'Top: Gabriel (98%)', icon: <User />, color: 'blue' },
    { label: 'Squads (Média)', value: '65%', subtitle: 'Atenção: Squad Beta', icon: <Users />, color: 'orange' },
  ];

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: <Building2 size={16} /> },
    { id: 'individuais', label: 'Individuais', icon: <User size={16} /> },
    { id: 'squads', label: 'Squads', icon: <Users size={16} /> },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Metas & Performance</h2>
          <p className="text-slate-500 font-medium mt-1">Gestão estratégica de OKRs e objetivos táticos.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Sparkles size={18} className="text-blue-500" />
            AI Generator
          </button>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            Nova Meta
          </button>
        </div>
      </div>

      {/* CRM Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon && React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full lg:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Goal Content */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[450px] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden transition-all hover:border-blue-100">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <Trophy size={250} />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-sm">
            <Target size={40} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Configure seus objetivos de {activeTab}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Defina metas claras para alinhar seu time. Acompanhe leads criados, reuniões agendadas ou volume de vendas em tempo real.
            </p>
          </div>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Criar primeira meta
          </button>
        </div>
      </div>

      <NewGoalModal 
        isOpen={isNewGoalModalOpen} 
        onClose={() => setIsNewGoalModalOpen(false)} 
      />
    </div>
  );
};

export default Metas;
