
import React, { useState } from 'react';
import { 
  Star, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  BarChart, 
  Building2, 
  FileText,
  ChevronDown,
  ArrowUpRight,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import NewNPSModal from './NewNPSModal';

const OperationalNPS: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [activeView, setActiveView] = useState<'Cohort' | 'Cliente' | 'Pesquisas'>('Cohort');
  const [isNewNPSModalOpen, setIsNewNPSModalOpen] = useState(false);

  const metrics = [
    { label: 'Score Geral', value: '72', sub: 'Zona de Qualidade', icon: <Star size={18} />, color: 'text-emerald-500' },
    { label: 'Taxa de Resposta', value: '64%', sub: '+12% vs mês ant.', icon: <MessageSquare size={18} />, color: 'text-blue-500' },
    { label: 'Promotores', value: '78', sub: 'Clientes Leais', icon: <Smile size={18} />, color: 'text-emerald-600' },
    { label: 'Detratores', value: '12', sub: 'Ação Imediata', icon: <Frown size={18} />, color: 'text-rose-500' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Sentiment Analytics</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-slate-400 text-sm font-medium">Monitoramento de Satisfação</span>
               <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
               <span className="text-emerald-600 text-sm font-bold tracking-tight">NPS Saudável</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeSegment === 'Clientes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeSegment === 'Equipe' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Equipe (eNPS)
            </button>
          </div>
          <button 
            onClick={() => setIsNewNPSModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Pesquisa
          </button>
        </div>
      </div>

      {/* NPS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className={`p-2 bg-slate-50 ${m.color} rounded-xl group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{m.value}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-3xl shadow-sm w-fit">
        {['Cohort', 'Por Cliente', 'Pesquisas'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view as any)}
            className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeView === view 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Main Analysis Canvas */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[450px] flex flex-col p-10 group relative overflow-hidden transition-all hover:border-blue-100">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
          <BarChart size={300} />
        </div>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Distribuição de Feedback</h3>
            <p className="text-xs text-slate-400 font-medium">Visualização analítica por trimestre</p>
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
            <TrendingUp size={18} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500">
            <MessageSquare size={40} />
          </div>
          <div className="max-w-xs">
            <p className="text-sm font-medium text-slate-400 italic leading-relaxed">
              Inicie uma nova campanha de {activeSegment.toLowerCase()} para visualizar os dados de sentimento aqui.
            </p>
          </div>
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
            Ver documentação de NPS
          </button>
        </div>
      </div>

      <NewNPSModal isOpen={isNewNPSModalOpen} onClose={() => setIsNewNPSModalOpen(false)} />
    </div>
  );
};

export default OperationalNPS;
