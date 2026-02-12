
import React, { useState } from 'react';
import { 
  Target, 
  UserPlus, 
  Users, 
  Trophy, 
  CalendarDays, 
  Filter, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCcw, 
  AlertTriangle,
  ArrowRight,
  MoreVertical,
  Briefcase,
  TrendingUp,
  Search
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';

const Crm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const periods = ['Semana', 'Mês', 'Trimestre', 'Ano'];

  const ranking = [
    { name: 'Gabriel Dantras', initial: 'GD', deals: 12, val: 'R$ 45.0k', perf: 95, color: 'bg-blue-500' },
    { name: 'Kyros Financial', initial: 'K', deals: 9, val: 'R$ 38.2k', perf: 80, color: 'bg-indigo-500' },
    { name: 'Luis Venx', initial: 'LV', deals: 7, val: 'R$ 21.0k', perf: 65, color: 'bg-emerald-500' },
    { name: 'Lucca Hurtado', initial: 'LH', deals: 5, val: 'R$ 15.4k', perf: 45, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Target size={24} />
           </div>
           <div>
             <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Comando Comercial</h2>
             <p className="text-slate-500 font-medium mt-1">Revenue Ops & Gestão de Pipeline.</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedPeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* CRM KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor em Pipeline</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 1.340.000</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12% vs jan
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Leads Ativos</p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">154</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">24 novos hoje</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Win</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Trophy size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">24.5%</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1">Acima do target (20%)</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cycle Time</p>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarDays size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">18 dias</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1">Redução de 2 dias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Funnel */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fluxo do Funil de Vendas</h3>
            <button className="text-slate-300 hover:text-slate-900 transition-colors">
              <TrendingUp size={18} />
            </button>
          </div>
          
          <div className="space-y-8">
            {[
              { label: 'Prospecção', val: '80', perc: 100, color: 'bg-slate-100' },
              { label: 'Qualificação', val: '45', perc: 56, color: 'bg-blue-100' },
              { label: 'Proposta', val: '22', perc: 27, color: 'bg-blue-300' },
              { label: 'Negociação', val: '12', perc: 15, color: 'bg-blue-500' },
              { label: 'Fechamento', val: '8', perc: 10, color: 'bg-emerald-500' },
            ].map((step, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{step.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-900">{step.val}</span>
                    <span className="text-[10px] font-bold text-slate-300">({step.perc}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${step.color} rounded-full transition-all duration-1000 group-hover:brightness-95 shadow-sm`} 
                    style={{ width: `${step.perc}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Ranking & AI */}
        <div className="space-y-8">
          {/* IA Deal Forecast */}
          <div className="bg-[#002147] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles size={150} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">IA Deal Forecast</h4>
                <RefreshCcw size={14} className="text-white/30 cursor-pointer hover:rotate-180 transition-all duration-500"/>
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold leading-tight tracking-tight">
                  Previsão de Fechamento: <span className="text-emerald-400">R$ 120k</span>
                </p>
                <p className="text-xs text-white/60 font-medium leading-relaxed">
                  Alta probabilidade nos próximos 7 dias. Foque nos leads <span className="text-white font-bold">Sirius e Omni</span>.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-[#002147] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                Executar Plano de Ação
              </button>
            </div>
          </div>

          {/* Top Closers */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Top Closers</h3>
            <div className="space-y-5">
              {ranking.map((member, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                    {member.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                      <span className="text-[10px] font-bold text-slate-400">{member.deals} deals</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${member.color} rounded-full`} style={{ width: `${member.perf}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
              Leaderboard Completo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-6 flex items-start gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900">Alerta de Ociosidade</h4>
            <p className="text-xs text-rose-700 font-medium mt-1 leading-relaxed">
              3 Leads estão sem contato há mais de 48h. Risco de perda estimado em <span className="font-bold">R$ 15.000</span>.
            </p>
          </div>
        </div>
      </div>

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} />
    </div>
  );
};

export default Crm;
