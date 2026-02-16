
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
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
  ChevronDown,
  Activity,
  LayoutGrid
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface MarketingProps {
  user: any;
}

const Marketing: React.FC<MarketingProps> = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');
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

    return {
      total,
      completed,
      inProd,
      rate: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%'
    };
  }, [tasks]);

  const kanbanStages = useMemo(() => {
    const stages = [
      { id: 'idea', name: 'Ideação', color: 'bg-slate-300' },
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

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <Megaphone size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Growth Engineering SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Marketing <span className="text-[#203267] not-italic">Intelligence</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Monitoramento de ativos digitais e campanhas da conta</p>
        </div>

        <button onClick={fetchMarketingData} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
          <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Projetos Ativos" value={stats.total.toString()} subtitle="Registros em Pipeline" icon={<Globe />} color="blue" />
          <StatCard title="Publicados" value={stats.completed.toString()} subtitle="Status Live" icon={<Target />} color="emerald" />
          <StatCard title="Em Produção" value={stats.inProd.toString()} subtitle="Work-in-progress" icon={<Zap />} color="blue" />
          <StatCard title="Taxa de Entrega" value={stats.rate} subtitle="Performance Mensal" icon={<Share2 />} color="blue" showInfo />
        </div>

        {/* Tier 2: Flow Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white border border-slate-300 rounded-xl p-10 shadow-sm transition-all hover:shadow-xl duration-700">
             <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-300 flex items-center justify-center text-[#203267] shadow-sm"><Activity size={24}/></div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Fluxo de Produção Auditado</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Distribuição por estágio do funil</p>
                </div>
             </div>

             <div className="space-y-8">
                {kanbanStages.map((stage, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-3 rounded-full ${stage.color}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stage.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase">{stage.count} tarefas ({stage.perc.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all duration-[1500ms] shadow-sm`} 
                        style={{ width: `${stage.perc}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Marketing Insights</span>
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tight italic">Relatório de Impacto Digital</h4>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed">Analise o desempenho de suas campanhas através de integração SQL direta.</p>
                   <button className="w-full py-4 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all shadow-xl active:scale-95">Gerar Insights AI</button>
                </div>
                <Database size={200} className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 transition-transform" />
             </div>

             <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm flex items-center justify-between group hover:border-[#203267] transition-all">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronização</p>
                   <p className="text-sm font-black text-slate-900 uppercase">Redes Sociais</p>
                </div>
                <div className="flex gap-2">
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-300"><Instagram size={18} /></div>
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-300"><Linkedin size={18} /></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
