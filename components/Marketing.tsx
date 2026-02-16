
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

interface MarketingProps {
  user: any;
}

const Marketing: React.FC<MarketingProps> = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMarketingData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('marketing_tasks').select('*').eq('user_id', user.id);
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
  }, [user]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.stage === 'live').length;
    const inProd = tasks.filter(t => t.stage === 'prod' || t.stage === 'review').length;

    return [
      { label: 'Projetos Seus', value: total.toString(), trend: 'Ativos no SQL', icon: <Globe size={18} />, color: 'blue' },
      { label: 'Publicados', value: completed.toString(), trend: 'Status Live', icon: <Target size={18} />, color: 'emerald' },
      { label: 'Em Produção', value: inProd.toString(), trend: 'Work-in-progress', icon: <Zap size={18} />, color: 'indigo' },
      { label: 'Taxa de Entrega', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%', trend: 'Performance', icon: <Share2 size={18} />, color: 'blue' },
    ];
  }, [tasks]);

  const kanbanStages = useMemo(() => {
    const stages = [
      { id: 'idea', name: 'Ideação', color: 'bg-slate-200' },
      { id: 'prod', name: 'Produção', color: 'bg-blue-500' },
      { id: 'review', name: 'Revisão', color: 'bg-amber-500' },
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
             <Megaphone size={24} />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marketing Isolado</span>
             </div>
             <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Marketing Intelligence</h2>
           </div>
        </div>
      </div>

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
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Seu Fluxo de Produção</h3>
              <p className="text-xs text-slate-400 font-medium">Distribuição por estágio do funil da sua conta</p>
            </div>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            {kanbanStages.map((stage, idx) => (
              <div key={idx} className="group">
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
      </div>
    </div>
  );
};

export default Marketing;
