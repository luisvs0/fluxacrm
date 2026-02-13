
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

const OperationalOnboarding: React.FC = () => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { id: 'kickoff', label: 'Kickoff', color: 'bg-indigo-400' },
    { id: 'setup', label: 'Setup Técnico', color: 'bg-blue-500' },
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
      { label: 'Setups Ativos', value: total.toString(), trend: 'Em Fluxo', icon: <Rocket size={20} />, color: 'blue' },
      { label: 'No Prazo', value: inTime.toString(), trend: 'Performance OK', icon: <CheckCircle2 size={20} />, color: 'emerald' },
      { label: 'Em Atenção', value: atRisk.toString(), trend: 'Bloqueios', icon: <AlertTriangle size={20} />, color: 'amber' },
      { label: 'Avg. Progresso', value: `${avgProgress}%`, trend: 'Consolidado', icon: <Zap size={20} />, color: 'indigo' },
    ];
  }, [onboardings]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 text-center">Sincronizando Onboarding Ops...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10">
      
      {/* Header Responsivo */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-blue-500 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Onboarding Engine SQL</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fluxos de Implementação</h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={fetchOnboardings} className="flex-1 md:flex-none p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm">
             <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-[3] md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
            <Plus size={20} /> Iniciar Onboarding
          </button>
        </div>
      </div>

      {/* KPI Stats - Horizontal no mobile */}
      <div className="px-4 md:px-8 pb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 md:grid md:grid-cols-4 min-w-max md:min-w-0">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-[200px] md:min-w-0 group hover:border-blue-100 transition-all">
               <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter">{stat.value}</p>
                  <p className="text-[8px] font-bold text-blue-500 uppercase">{stat.trend}</p>
               </div>
               <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Container Kanban */}
      <div className="flex-1 overflow-x-auto no-scrollbar px-4 md:px-8 pb-10">
        <div className="flex gap-4 md:gap-6 h-full min-w-max">
          {columns.map((col) => {
            const colOnboardings = onboardings.filter(o => (o.stage || 'kickoff').toLowerCase() === col.id);
            return (
              <div key={col.id} className="w-[280px] md:w-[320px] flex flex-col h-full group">
                <div className="mb-4 flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-4 ${col.color} rounded-full`}></div>
                      <span className="text-[11px] font-black text-slate-900 tracking-widest uppercase">{col.label}</span>
                    </div>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase">{colOnboardings.length}</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50/40 rounded-2xl md:rounded-[2.5rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                  {colOnboardings.map(item => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all group/card relative overflow-hidden">
                      {item.status === 'Risco' && <div className="absolute top-0 right-0 w-1 h-full bg-rose-500"></div>}
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 min-w-0 pr-4">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{item.contracts?.customers?.name || 'Cliente S/N'}</h4>
                            <p className="text-[10px] text-blue-600 font-black tracking-tighter">
                               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.contracts?.amount || 0)} <span className="text-slate-300 font-bold ml-1">MRR</span>
                            </p>
                          </div>
                          <button className="text-slate-200 hover:text-slate-900 transition-colors shrink-0">
                            <MoreVertical size={14} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <span>Status da Entrega</span>
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
                             <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[8px] font-black italic shadow-sm">
                               {(item.owner || '?').substring(0,1).toUpperCase()}
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{item.owner || 'A definir'}</span>
                          </div>
                          {item.progress === 100 && <CheckCircle size={14} className="text-emerald-500" />}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colOnboardings.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center opacity-10 text-center space-y-2">
                       <CheckCircle2 size={32} />
                       <p className="text-[9px] font-black uppercase tracking-widest">Sem Pendências</p>
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
