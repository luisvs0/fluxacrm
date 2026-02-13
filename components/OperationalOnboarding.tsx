
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  ChevronDown,
  Search,
  MoreVertical,
  Clock,
  User,
  Zap,
  ArrowUpRight,
  Loader2,
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const OperationalOnboarding: React.FC = () => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { id: 'kickoff', label: 'Kickoff', color: 'bg-indigo-500' },
    { id: 'setup', label: 'Setup técnico', color: 'bg-blue-500' },
    { id: 'config', label: 'Configuração', color: 'bg-purple-500' },
    { id: 'training', label: 'Treinamento', color: 'bg-amber-500' },
    { id: 'live', label: 'Go-Live', color: 'bg-emerald-500' },
  ];

  const fetchOnboardings = async () => {
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
        `);
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
  }, []);

  const stats = useMemo(() => {
    const total = onboardings.length;
    const inTime = onboardings.filter(o => o.status !== 'Risco' && o.status !== 'Atenção').length;
    const atRisk = total - inTime;
    const avgProgress = total > 0 ? Math.round(onboardings.reduce((acc, o) => acc + (o.progress || 0), 0) / total) : 0;

    return [
      { label: 'Setups Ativos', value: total.toString(), icon: <Rocket size={20} />, color: 'text-blue-600' },
      { label: 'No Prazo', value: inTime.toString(), icon: <CheckCircle2 size={20} />, color: 'text-emerald-500' },
      { label: 'Atenção/Risco', value: atRisk.toString(), icon: <AlertTriangle size={20} />, color: 'text-amber-500' },
      { label: 'Avg. Progresso', value: `${avgProgress}%`, icon: <Zap size={20} />, color: 'text-indigo-600' },
    ];
  }, [onboardings]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Onboardings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Onboarding Data Ops</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Onboarding Engine</h2>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchOnboardings} className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Clock size={18} /> Atualizar Fluxo
          </button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            <Rocket size={18} /> Iniciar Onboarding
          </button>
        </div>
      </div>

      <div className="px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
             <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
             </div>
             <div className={`${stat.color} opacity-80 bg-slate-50 p-2.5 rounded-xl`}>
                {stat.icon}
             </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-10 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => {
            const colOnboardings = onboardings.filter(o => (o.stage || 'kickoff').toLowerCase() === col.id);
            return (
              <div key={col.id} className="w-[320px] flex flex-col h-full group">
                <div className="mb-4 flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-4 ${col.color} rounded-full`}></div>
                      <span className="text-sm font-bold text-slate-900 tracking-tight">{col.label}</span>
                    </div>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">{colOnboardings.length}</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50/40 rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                  {colOnboardings.map(item => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group/card relative overflow-hidden">
                      {(item.status === 'Risco' || item.status === 'Atenção') && <div className={`absolute top-0 right-0 w-1 h-full ${item.status === 'Risco' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>}
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item.contracts?.customers?.name || 'Cliente S/N'}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.contracts?.amount || 0)}
                            </p>
                          </div>
                          <button className="text-slate-200 hover:text-slate-900 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <span>Progresso</span>
                            <span className="text-slate-900">{item.progress || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.status === 'Risco' ? 'bg-rose-500' : 'bg-blue-600'} rounded-full transition-all duration-700`} 
                              style={{ width: `${item.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                          <div className="flex items-center gap-1.5">
                             <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-slate-500">
                               {(item.owner || '?').substring(0,1).toUpperCase()}
                             </div>
                             <span className="text-[10px] font-bold text-slate-400">{item.owner || 'A definir'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colOnboardings.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                       <CheckCircle2 size={32} className="text-slate-300 mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sem Pendências</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OperationalOnboarding;
