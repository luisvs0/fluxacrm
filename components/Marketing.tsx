
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
  AlertCircle
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Marketing Ops...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Megaphone size={24} />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Marketing Ativo</span>
             </div>
             <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Marketing Intelligence</h2>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            {['Semana', 'Mês', 'Geral'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fluxo de Produção Realtime</h3>
              <p className="text-xs text-slate-400 font-medium">Distribuição de tarefas por estágio do funil de conteúdo</p>
            </div>
            <button onClick={fetchMarketingData} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
              <RefreshCcw size={18} />
            </button>
          </div>
          
          <div className="space-y-8">
            {kanbanStages.map((stage, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stage.name}</span>
                  <span className="text-sm font-bold text-slate-900">{stage.count} tarefas</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} rounded-full transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${stage.perc}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#002147] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles size={150} />
            </div>
            <div className="relative z-10 space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">IA Content Insights</h4>
              <p className="text-xl font-bold leading-tight tracking-tight">
                Seu canal mais eficiente hoje é o <span className="text-blue-400 italic">LinkedIn</span>.
              </p>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                Baseado nos dados do SQL, tarefas de "Vídeo" convertem 22% mais que imagens estáticas. Recomendamos priorizar esse formato no próximo sprint.
              </p>
              <button className="w-full py-4 bg-white text-[#002147] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                Analisar Performance
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Engagement Realtime</h3>
            <div className="space-y-6">
              {[
                { name: 'Instagram', icon: <Instagram size={14}/>, perc: 92, color: 'bg-rose-500' },
                { name: 'LinkedIn', icon: <Linkedin size={14}/>, perc: 78, color: 'bg-blue-600' },
                { name: 'E-mail Marketing', icon: <Megaphone size={14}/>, perc: 45, color: 'bg-indigo-500' },
              ].map((channel, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">{channel.icon}</div>
                       <span className="text-xs font-bold text-slate-700">{channel.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{channel.perc}%</span>
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
