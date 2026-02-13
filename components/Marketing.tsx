
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  Target, 
  Zap, 
  Globe, 
  Instagram, 
  Linkedin,
  Loader2,
  Database,
  RefreshCcw,
  ArrowUpRight,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Marketing: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMarketingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('marketing_tasks').select('*');
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Erro ao carregar marketing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.stage === 'live').length;
    const inProd = tasks.filter(t => t.stage === 'prod' || t.stage === 'review').length;

    return [
      { label: 'Projetos Totais', value: total.toString(), trend: 'Ativos no SQL', icon: <Globe size={18} />, color: 'blue' },
      { label: 'Publicados', value: completed.toString(), trend: 'Status Live', icon: <Target size={18} />, color: 'emerald' },
      { label: 'Em Produção', value: inProd.toString(), trend: 'Work-in-progress', icon: <Zap size={18} />, color: 'indigo' },
      { label: 'Taxa de Entrega', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%', trend: 'Performance', icon: <Share2 size={18} />, color: 'blue' },
    ];
  }, [tasks]);

  const kanbanStages = useMemo(() => {
    const stages = [
      { id: 'idea', name: 'Backlog/Ideação', color: 'bg-slate-200' },
      { id: 'prod', name: 'Em Produção', color: 'bg-blue-500' },
      { id: 'review', name: 'Revisão/Aprovação', color: 'bg-amber-500' },
      { id: 'sched', name: 'Agendado', color: 'bg-purple-500' },
      { id: 'live', name: 'Publicado', color: 'bg-emerald-500' },
    ];

    const total = tasks.length || 1;
    return stages.map(s => ({
      ...s,
      count: tasks.filter(t => t.stage === s.id).length,
      perc: (tasks.filter(t => t.stage === s.id).length / total) * 100
    }));
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Sincronizando Marketing Ops...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-10 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
             <Megaphone size={24} />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Marketing Ativo</span>
             </div>
             <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Marketing Intelligence</h2>
           </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex bg-white border border-slate-200 rounded-full p-1 shadow-sm overflow-x-auto no-scrollbar">
            {['Semana', 'Mês', 'Geral'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedPeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
          <button onClick={fetchMarketingData} className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* KPI Cards Adaptativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Gráfico de Fluxo - Prioridade Mobile */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm order-2 lg:order-1">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Fluxo de Produção Realtime</h3>
              <p className="text-xs text-slate-400 font-medium">Distribuição por estágio do funil</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
               <TrendingUp size={14} /> Performance
            </div>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            {kanbanStages.map((stage, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stage.name}</span>
                  <span className="text-xs md:text-sm font-bold text-slate-900">{stage.count} tarefas</span>
                </div>
                <div className="h-2 md:h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} rounded-full transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${stage.perc}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Cards - Stacked no mobile */}
        <div className="space-y-6 order-1 lg:order-2">
          <div className="bg-[#002147] rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles size={120} className="md:size-[150px]" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400"><Sparkles size={16} /></div>
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">IA Content Insights</h4>
              </div>
              <p className="text-lg md:text-xl font-bold leading-tight tracking-tight">
                Seu canal mais eficiente hoje é o <span className="text-blue-400 italic">LinkedIn</span>.
              </p>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Baseado no SQL, vídeos convertem <span className="text-white font-bold">22% mais</span> que imagens estáticas.
              </p>
              <button className="w-full py-3.5 md:py-4 bg-white text-[#002147] rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                Analisar Performance
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6">Engagement Realtime</h3>
            <div className="space-y-6">
              {[
                { name: 'Instagram', icon: <Instagram size={14}/>, perc: 92, color: 'bg-rose-500' },
                { name: 'LinkedIn', icon: <Linkedin size={14}/>, perc: 78, color: 'bg-blue-600' },
                { name: 'E-mail Marketing', icon: <Megaphone size={14}/>, perc: 45, color: 'bg-indigo-500' },
              ].map((channel, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-colors">{channel.icon}</div>
                       <span className="text-xs font-bold text-slate-700">{channel.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{channel.perc}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${channel.color} rounded-full`} style={{ width: `${channel.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
