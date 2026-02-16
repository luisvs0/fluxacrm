
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircleDot, 
  Plus, 
  Target, 
  KeyRound, 
  TrendingUp, 
  AlertTriangle,
  ChevronDown,
  Filter,
  Search,
  Zap,
  Loader2,
  Database,
  RefreshCcw,
  MoreVertical,
  CheckCircle2,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewOKRModal from './NewOKRModal';
import StatCard from './StatCard';

interface OperationalOKRProps {
  user: any;
}

const OperationalOKR: React.FC<OperationalOKRProps> = ({ user }) => {
  const [okrs, setOkrs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOKRs = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('user_id', user.id)
        .order('title');
      if (error) throw error;
      setOkrs(data || []);
    } catch (err) {
      console.error('Erro OKR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOKRs();
  }, [user]);

  const stats = useMemo(() => {
    const total = okrs.length;
    const avgProgress = total > 0 ? Math.round(okrs.reduce((acc, o) => acc + (Math.min(o.current / o.target, 1) * 100), 0) / total) : 0;
    return { total, avgProgress };
  }, [okrs]);

  const filteredOKRs = useMemo(() => {
    return okrs.filter(o => o.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [okrs, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
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
                <CircleDot size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Objective Alignment SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Meus <span className="text-[#203267] not-italic">OKRs</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Definição e acompanhamento de metas estratégicas</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Objetivo
          </button>
          <button onClick={fetchOKRs} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Objetivos Ativos" value={stats.total.toString()} subtitle="Work-in-progress" icon={<Target />} color="blue" />
          <StatCard title="Atingimento Médio" value={`${stats.avgProgress}%`} subtitle="Performance Realtime" icon={<TrendingUp />} color="emerald" />
          {/* FIX: The Activity component below requires a 'size' prop in its type definition, so it must be optional or provided. */}
          <StatCard title="Ciclo Atual" value="Q1 2026" subtitle="Jan - Mar" icon={<Activity />} color="blue" />
          <StatCard title="Status Ledger" value="Syncing" subtitle="SQL Central Hub" icon={<Database />} color="blue" />
        </div>

        {/* Toolbar & Grid */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por objetivo ou indicador chave..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Ledger Sync Node</span>
               <div className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
               <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Seus Resultados...</p>
            </div>
          ) : filteredOKRs.length === 0 ? (
            <div className="bg-white border border-slate-300 rounded-xl shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center group">
               <Database size={60} strokeWidth={1} className="mx-auto text-slate-200 mb-6 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum objetivo localizado para esta conta</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredOKRs.map(okr => {
                const perc = Math.min((okr.current / okr.target) * 100, 100);
                return (
                  <div key={okr.id} className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div className="space-y-2">
                           <span className="text-[9px] font-black uppercase tracking-[0.25em] bg-indigo-50 text-[#203267] px-3 py-1 rounded-md border border-slate-300 shadow-sm">
                             {okr.period || 'Ciclo Operacional 2026'}
                           </span>
                           <h4 className="text-xl font-black text-slate-900 tracking-tight mt-3 uppercase italic group-hover:text-[#203267] transition-colors">{okr.title}</h4>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-all bg-slate-50 border border-slate-200 rounded-lg">
                           <MoreVertical size={20}/>
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do KR</span>
                              <span className="text-2xl font-black text-slate-950 tracking-tighter italic">
                                {okr.current} <span className="text-slate-300 not-italic">/</span> <span className="text-slate-300">{okr.target}</span>
                              </span>
                           </div>
                           <div className="text-right">
                              <span className={`text-xl font-black ${perc >= 100 ? 'text-emerald-500' : 'text-[#203267]'}`}>{perc.toFixed(1)}%</span>
                           </div>
                        </div>
                        <div className="h-3 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                           <div 
                             className={`h-full rounded-full transition-all duration-[1500ms] shadow-sm ${perc >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-[#203267] to-indigo-500'}`} 
                             style={{ width: `${perc}%` }}
                           ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:scale-125">
                      <Target size={180} />
                    </div>
                    <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 ${perc >= 100 ? 'bg-emerald-500' : 'bg-[#203267]'}`}></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <NewOKRModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOKRs(); }} user={user} />
    </div>
  );
};

// FIX: Made 'size' property optional with a default value to fix the TypeScript missing property error in StatCard usage.
const Activity = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default OperationalOKR;
