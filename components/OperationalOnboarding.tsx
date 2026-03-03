
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

interface OperationalOnboardingProps {
  user: any;
}

const OperationalOnboarding: React.FC<OperationalOnboardingProps> = ({ user }) => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'kickoff', label: 'Kickoff', color: 'bg-indigo-400' },
    { id: 'setup', label: 'Setup Técnico', color: 'bg-blue-500' },
    { id: 'config', label: 'Configuração', color: 'bg-purple-500' },
    { id: 'training', label: 'Treinamento', color: 'bg-amber-500' },
    { id: 'live', label: 'Go-Live', color: 'bg-emerald-500' },
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
        .eq('user_id', user.id); // ISOLAÇÃO
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
    const atRisk = total - inTime;
    const avgProgress = total > 0 ? Math.round(onboardings.reduce((acc, o) => acc + (o.progress || 0), 0) / total) : 0;

    return [
      { label: 'Seus Onboardings', value: total.toString(), trend: 'Em fluxo', icon: <Rocket size={20} />, color: 'blue' },
      { label: 'No Prazo', value: inTime.toString(), trend: 'Performance OK', icon: <CheckCircle2 size={20} />, color: 'emerald' },
      { label: 'Em Atenção', value: atRisk.toString(), trend: 'Bloqueios', icon: <AlertTriangle size={20} />, color: 'amber' },
      { label: 'Avg. Progresso', value: `${avgProgress}%`, trend: 'Consolidado', icon: <Zap size={20} />, color: 'indigo' },
    ];
  }, [onboardings]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 text-center">Filtrando Sua Entrega...</p></div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10">
      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><div className="flex items-center gap-2 mb-1"><Database size={14} className="text-blue-500 shrink-0" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seu Fluxo de Implementação</span></div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboarding Operacional</h2></div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={fetchOnboardings} className="flex-1 md:flex-none p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"><RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
          <button onClick={() => setIsModalOpen(true)} className="flex-[3] md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Plus size={20} /> Iniciar Fluxo</button>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 md:grid md:grid-cols-4 min-w-max md:min-w-0">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-[200px] md:min-w-0 group hover:border-blue-100 transition-all">
              <div className="space-y-0.5"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p><p className="text-lg font-black text-slate-900 tracking-tighter">{stat.value}</p><p className="text-[8px] font-bold text-blue-500 uppercase">{stat.trend}</p></div>
              <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>{React.cloneElement(stat.icon as React.ReactElement<any>, { size: 18 })}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar px-4 md:px-8 pb-10">
        <div className="flex gap-4 md:gap-6 h-full min-w-max">
          {columns.map((col) => {
            const colOnboardings = onboardings.filter(o => (o.stage || 'kickoff').toLowerCase() === col.id);
            return (
              <div key={col.id} className="w-[280px] md:w-[320px] flex flex-col h-full group">
                <div className="mb-4 flex flex-col gap-1 px-1"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={`w-1.5 h-4 ${col.color} rounded-full`}></div><span className="text-[11px] font-black text-slate-900 tracking-widest uppercase">{col.label}</span></div><span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase">{colOnboardings.length}</span></div></div>
                <div className="flex-1 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                  {colOnboardings.map(item => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group/card relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start"><div className="space-y-1 min-w-0 pr-4"><h4 className="text-xs font-black text-slate-900 uppercase truncate">{item.contracts?.customers?.name || 'Cliente'}</h4><p className="text-[10px] text-blue-600 font-black tracking-tighter">{item.progress || 0}% de conclusão</p></div><button className="text-slate-200 hover:text-slate-900 transition-colors shrink-0"><MoreVertical size={14} /></button></div>
                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden"><div className={`h-full bg-blue-600 rounded-full`} style={{ width: `${item.progress || 0}%` }}></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewOnboardingModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOnboardings(); }} user={user} />
    </div>
  );
};

export default OperationalOnboarding;
