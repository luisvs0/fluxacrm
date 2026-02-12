
import React, { useState } from 'react';
import { 
  CircleDot, 
  Plus, 
  Target, 
  KeyRound, 
  TrendingUp, 
  AlertTriangle,
  Building2,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Filter,
  Search,
  Zap,
  MoreVertical
} from 'lucide-react';

const OperationalOKR: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('Todos os tipos');
  const [statusFilter, setStatusFilter] = useState('Ativo');
  
  const stats = [
    { label: 'Objetivos Ativos', value: '12', trend: '85% progresso', icon: <Target size={18}/>, color: 'text-blue-600' },
    { label: 'Key Results', value: '48', trend: '6 pendentes', icon: <KeyRound size={18}/>, color: 'text-indigo-500' },
    { label: 'Progresso Médio', value: '74.2%', trend: '+4.1% vs jan', icon: <TrendingUp size={18}/>, color: 'text-emerald-500' },
    { label: 'Em Risco', value: '2', trend: 'Ação necessária', icon: <AlertTriangle size={18}/>, color: 'text-rose-500' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <CircleDot size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Objectives & Key Results</h2>
            <p className="text-slate-500 font-medium mt-1">Gestão estratégica por resultados de alto impacto.</p>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
          <Plus size={20} />
          Novo Objetivo
        </button>
      </div>

      {/* OKR KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest font-black text-[9px]">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 ml-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] tracking-widest">
                <option>Q1 - 2026</option>
                <option>Q2 - 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px] tracking-widest">
                <option>Todos os tipos</option>
                <option>Empresa</option>
                <option>Squad</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar objetivo..." 
              className="bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-blue-100 w-64"
            />
          </div>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Objectives Canvas */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[500px] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden transition-all hover:border-blue-100">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <Zap size={250} />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-sm border border-slate-100">
            <CircleDot size={48} strokeWidth={1.5} />
          </div>
          
          <div className="max-w-sm">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Acelerando Resultados</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Crie objetivos ambiciosos e quebre-os em resultados-chave mensuráveis para alinhar toda a operação ao crescimento.
            </p>
          </div>

          <button className="px-10 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            Definir Primeiro OKR
          </button>
        </div>
      </div>

    </div>
  );
};

export default OperationalOKR;
