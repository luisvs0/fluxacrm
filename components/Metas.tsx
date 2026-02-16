
import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  Database,
  RefreshCcw,
  Activity,
  ChevronRight
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface MetasProps {
  user: any;
}

const Metas: React.FC<MetasProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'individuais' | 'squads'>('empresa');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('goals').select('*').eq('user_id', user.id);
      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const stats = useMemo(() => {
    const active = goals.length;
    const avgProgress = goals.length > 0 
      ? goals.reduce((acc, g) => acc + (Math.min(Number(g.current_value) / Number(g.target_value), 1) * 100), 0) / goals.length 
      : 0;
    
    return { active, avgProgress };
  }, [goals]);

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: <Building2 size={16} /> },
    { id: 'individuais', label: 'Individuais', icon: <User size={16} /> },
    { id: 'squads', label: 'Squads', icon: <Users size={16} /> },
  ];

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.scope?.toLowerCase() === activeTab.substring(0, activeTab.length - (activeTab.endsWith('s') ? 1 : 0)).toLowerCase() || 
                       (activeTab === 'empresa' && g.scope === 'Empresa'));
  }, [goals, activeTab]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Corporativo */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
               <Target size={20} className="text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Strategic Performance</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Metas <span className="text-[#203267] not-italic">& OKRs</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Nova Meta
          </button>
          <button onClick={fetchGoals} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Metas Ativas" value={stats.active.toString()} subtitle="Monitoramento SQL" icon={<Target />} color="blue" />
          <StatCard title="Atingimento Médio" value={`${stats.avgProgress.toFixed(1)}%`} subtitle="Performance Realtime" icon={<TrendingUp />} color="emerald" />
          <StatCard title="Ciclo Atual" value="Q1 2026" subtitle="Jan - Mar" icon={<Activity />} color="blue" />
          <StatCard title="Projeção IA" value="84%" subtitle="Confidence Level" icon={<Sparkles />} color="blue" showInfo />
        </div>

        {/* Navigation Console */}
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Ledger Sync</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>

        {/* Goals Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculando Ativos...</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-24 text-center group hover:border-[#203267] transition-all duration-700">
             <Database size={60} strokeWidth={1} className="mx-auto text-slate-200 mb-6 group-hover:scale-110 transition-transform" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum objetivo para este segmento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGoals.map((goal) => {
              const perc = Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100) || 0;
              return (
                <div key={goal.id} className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-[#203267] bg-indigo-50 px-3 py-1 rounded-md border border-slate-300 uppercase tracking-[0.2em] shadow-sm">
                          {goal.metric || 'Métrica'}
                        </span>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase truncate">{goal.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{goal.period}</p>
                      </div>
                      <div className={`p-3 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-500 group-hover:scale-110 ${perc >= 100 ? 'text-emerald-500 border-emerald-300 bg-emerald-50' : 'text-slate-300'}`}>
                        <CheckCircle2 size={24} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Objetivo</span>
                           <span className="text-2xl font-black text-slate-950 tracking-tighter italic">
                             {goal.current_value} <span className="text-slate-300 not-italic">/</span> <span className="text-slate-300">{goal.target_value}</span>
                           </span>
                        </div>
                        <span className="text-lg font-black text-[#203267]">{perc.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className={`h-full transition-all duration-1000 shadow-sm rounded-full ${perc >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-[#203267] to-indigo-500'}`} style={{ width: `${perc}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accent Line */}
                  <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 ${perc >= 100 ? 'bg-emerald-500' : 'bg-[#203267]'}`}></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewGoalModal isOpen={isNewGoalModalOpen} onClose={() => { setIsNewGoalModalOpen(false); fetchGoals(); }} user={user} />
    </div>
  );
};

export default Metas;
