
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  Filter, 
  ChevronDown,
  Search,
  MoreVertical,
  Clock,
  User,
  Zap,
  ArrowUpRight,
  Loader2,
  Database,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewOnboardingModal from './NewOnboardingModal';
import StatCard from './StatCard';

interface OperationalOnboardingProps {
  user: any;
}

const OperationalOnboarding: React.FC<OperationalOnboardingProps> = ({ user }) => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'kickoff', label: 'Kickoff', color: 'bg-slate-400', border: 'border-slate-300' },
    { id: 'setup', label: 'Setup Técnico', color: 'bg-blue-500', border: 'border-blue-500' },
    { id: 'config', label: 'Configuração', color: 'bg-indigo-500', border: 'border-indigo-500' },
    { id: 'training', label: 'Treinamento', color: 'bg-amber-500', border: 'border-amber-500' },
    { id: 'live', label: 'Go-Live', color: 'bg-emerald-500', border: 'border-emerald-500' },
  ];

  const fetchOnboardings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboardings')
        .select(`
          *,
          contracts (
            amount,
            customers (name)
          )
        `)
        .eq('user_id', user.id);
      if (error) throw error;
      setOnboardings(data || []);
    } catch (err) {
      console.error('Erro Onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardings();
  }, [user]);

  const stats = useMemo(() => {
    const total = onboardings.length;
    const inTime = onboardings.filter(o => o.status !== 'Risco' && o.status !== 'Atenção').length;
    const avgProgress = total > 0 ? Math.round(onboardings.reduce((acc, o) => acc + (o.progress || 0), 0) / total) : 0;

    return { total, inTime, avgProgress };
  }, [onboardings]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden flex flex-col">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <Rocket size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Implementation Loop SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Onboarding <span className="text-[#203267] not-italic">Flow</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Acompanhamento de novos contratos em implantação</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Iniciar Fluxo
          </button>
          <button onClick={fetchOnboardings} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-10 flex-1 flex flex-col">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Em Fluxo" value={stats.total.toString()} subtitle="Projetos Ativos" icon={<Rocket />} color="blue" />
          <StatCard title="No Prazo" value={stats.inTime.toString()} subtitle="SLA em Conformidade" icon={<CheckCircle2 />} color="emerald" />
          <StatCard title="Avg. Progresso" value={`${stats.avgProgress}%`} subtitle="Performance Global" icon={<Zap />} color="blue" />
          <StatCard title="Node Status" value="Online" subtitle="Distributed Implementation" icon={<Database />} color="blue" />
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
             <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Implementações...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto no-scrollbar pb-10">
            <div className="flex gap-8 h-full min-w-max">
              {columns.map((col) => {
                const colItems = onboardings.filter(o => (o.stage || 'kickoff').toLowerCase() === col.id);
                return (
                  <div key={col.id} className="w-[320px] flex flex-col h-full group">
                    <div className="mb-6 flex items-center justify-between px-2 pt-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{col.label}</span>
                        <div className={`h-[3px] w-8 rounded-full ${col.color}`}></div>
                      </div>
                      <span className="text-[10px] font-black bg-white border border-slate-300 text-slate-900 px-3 py-1 rounded-md shadow-sm">{colItems.length}</span>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar pb-20">
                      {colItems.map(item => (
                        <div key={item.id} className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#203267] transition-all group/card relative overflow-hidden border-t-[8px] border-t-slate-50">
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover/card:text-[#203267] transition-colors">{item.contracts?.customers?.name || 'Cliente Sem Nome'}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #{item.id.substring(0,8)}</p>
                              </div>
                              <MoreVertical size={16} className="text-slate-300 group-hover/card:text-slate-900 transition-colors" />
                            </div>

                            <div className="space-y-3">
                               <div className="flex justify-between items-end">
                                  <span className="text-[9px] font-black text-slate-400 uppercase">Progresso Técnico</span>
                                  <span className="text-xs font-black text-[#203267] italic">{item.progress || 0}%</span>
                               </div>
                               <div className="h-2 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
                                  <div className="h-full bg-gradient-to-r from-[#203267] to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${item.progress || 0}%` }}></div>
                               </div>
                            </div>

                            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white border border-slate-700 flex items-center justify-center text-[10px] font-black italic">
                                     {(item.responsible || 'U').substring(0,1).toUpperCase()}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[100px]">{item.responsible || 'Sem Resp.'}</span>
                               </div>
                               <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase border ${item.status === 'Risco' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                 {item.status || 'No Prazo'}
                               </span>
                            </div>
                          </div>
                          <div className={`absolute top-0 left-0 right-0 h-[8px] ${col.color} opacity-40`}></div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:text-[#203267] hover:border-[#203267] hover:bg-white transition-all group shadow-inner"
                      >
                        <Plus size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <NewOnboardingModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOnboardings(); }} user={user} />
    </div>
  );
};

export default OperationalOnboarding;
