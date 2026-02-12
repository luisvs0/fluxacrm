
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
  ChevronRight
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';

const Metas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'individuais' | 'squads'>('empresa');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);

  const stats = [
    { label: 'Total de Metas', value: '0', subtitle: '0 metas de empresa ativas', icon: <Target size={20} />, color: 'text-gray-400' },
    { label: 'Concluídas', value: '0', subtitle: '0% do total', icon: <CheckCircle2 size={20} />, color: 'text-emerald-500' },
    { label: 'Em Andamento', value: '0', subtitle: 'metas ativas', icon: <TrendingUp size={20} />, color: 'text-blue-500' },
    { label: 'Atenção', value: '0', subtitle: 'abaixo do esperado', icon: <AlertTriangle size={20} />, color: 'text-orange-500' },
  ];

  const tabs = [
    { id: 'empresa', label: 'Empresa', count: 0, icon: <Building2 size={16} /> },
    { id: 'individuais', label: 'Individuais', count: 0, icon: <User size={16} /> },
    { id: 'squads', label: 'Squads', count: 0, icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Metas</h2>
          <p className="text-sm text-gray-400 font-medium">Gestão de metas da empresa, individuais e por squad</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Sparkles size={18} className="text-blue-500" />
            Gerar Sugeridas
          </button>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Nova Meta
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-32 hover:border-gray-200 transition-all group">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-gray-900">{stat.label}</span>
              <div className={`${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-2 bg-[#f1f5f9]/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Descriptive Text */}
      <div className="space-y-1">
        <p className="text-sm text-gray-400 font-medium">
          {activeTab === 'empresa' && "Metas globais da empresa. Uma meta por métrica/período."}
          {activeTab === 'individuais' && "Metas específicas por membro do time."}
          {activeTab === 'squads' && "Metas coletivas divididas por cada squad comercial."}
        </p>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl min-h-[400px] flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-blue-100 hover:bg-blue-50/10">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300">
          <Target size={32} />
        </div>
        <h3 className="mt-6 text-base font-bold text-gray-900 tracking-tight">Nenhuma meta cadastrada.</h3>
        
        <button 
          onClick={() => setIsNewGoalModalOpen(true)}
          className="mt-6 flex items-center gap-2 px-8 py-3 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          Criar Meta
        </button>
      </div>

      {/* New Goal Modal Integration */}
      <NewGoalModal 
        isOpen={isNewGoalModalOpen} 
        onClose={() => setIsNewGoalModalOpen(false)} 
      />

    </div>
  );
};

export default Metas;
