
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
  ChevronRight,
  ArrowUpRight,
  Trophy,
  Loader2,
  Database,
  ArrowRight
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';
import { supabase } from '../lib/supabase';

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
    
    return [
      { label: 'Metas Ativas', value: active.toString(), subtitle: 'Monitoramento', icon: <Target />, color: 'blue' },
      { label: 'Atingimento Médio', value: `${avgProgress.toFixed(1)}%`, subtitle: 'Realtime SQL', icon: <TrendingUp />, color: 'emerald' },
      { label: 'Individuais', value: goals.filter(g => g.scope === 'Individual').length.toString(), subtitle: 'Personal goals', icon: <User />, color: 'blue' },
      { label: 'Squads', value: goals.filter(g => g.scope === 'Squad').length.toString(), subtitle: 'Team performance', icon: <Users />, color: 'purple' },
    ];
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-[#203267] shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">OKR Data Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Metas & Performance</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Gestão estratégica de OKRs para sua conta.</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl md:rounded-full text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Sparkles size={16} className="text-[#203267]" /> <span className="hidden sm:inline">AI Gen</span> <span className="sm:hidden">AI</span>
          </button>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 bg-[#203267] text-white rounded-xl md:rounded-full text-xs md:text-sm font-bold hover:bg-[#1a2954] transition-all shadow-lg shadow-indigo-900/20"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Nova Meta</span> <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>
                {/* Added React.ReactElement<any> cast to fix property access error */}
                {stat.icon && React.cloneElement(stat.icon as React.ReactElement<any>, { size: 18 })}
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl md:rounded-2xl w-full overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[100px] md:min-w-0 flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando OKRs...</p>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shadow-sm min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center p-8 md:p-12 text-center group relative overflow-hidden transition-all hover:border-[#203267]">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Trophy size={250} />
          </div>
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-indigo-50 group-hover:text-[#203267] transition-all duration-500 shadow-sm border border-slate-100">
              <Target size={32} />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-2 uppercase">Configure seus objetivos de {activeTab}</h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">Defina metas isoladas para sua operação e acompanhe os resultados em tempo real.</p>
            </div>
            <button onClick={() => setIsNewGoalModalOpen(true)} className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Criar primeira meta</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {filteredGoals.map((goal) => {
            const perc = Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100);
            return (
              <div key={goal.id} className="bg-white border border-slate-100 rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="space-y-1 min-w-0 pr-4">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-[#203267] px-2 py-0.5 rounded-md border border-indigo-100">{goal.metric}</span>
                    <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight mt-2 uppercase truncate">{goal.title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-medium italic">{goal.period}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-50 shrink-0 ${perc >= 100 ? 'text-emerald-500' : 'text-slate-300'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Progresso</span>
                       <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                         {goal.current_value} <span className="text-slate-200">/</span> <span className="text-slate-300">{goal.target_value}</span>
                       </span>
                    </div>
                    <span className="text-xs md:text-sm font-black text-[#203267]">{perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 shadow-sm ${perc >= 100 ? 'bg-emerald-500' : 'bg-[#203267]'}`} style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewGoalModal isOpen={isNewGoalModalOpen} onClose={() => { setIsNewGoalModalOpen(false); fetchGoals(); }} user={user} />
    </div>
  );
};

export default Metas;
