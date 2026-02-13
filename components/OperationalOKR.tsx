
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
  MoreVertical
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const OperationalOKR: React.FC = () => {
  const [okrs, setOkrs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOKRs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('okrs').select('*').order('title');
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
  }, []);

  const filteredOKRs = useMemo(() => {
    return okrs.filter(o => o.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [okrs, searchTerm]);

  const stats = useMemo(() => {
    const total = okrs.length;
    const avgProgress = total > 0 ? Math.round(okrs.reduce((acc, o) => acc + (Math.min(o.current / o.target, 1) * 100), 0) / total) : 0;
    const atRisk = okrs.filter(o => o.status === 'Risco' || o.status === 'Atenção').length;

    return [
      { label: 'Objetivos Ativos', value: total.toString(), trend: 'Em execução', icon: <Target size={18}/>, color: 'text-blue-600' },
      { label: 'Key Results', value: (total * 3).toString(), trend: 'Média estimada', icon: <KeyRound size={18}/>, color: 'text-indigo-500' },
      { label: 'Progresso Médio', value: `${avgProgress}%`, trend: 'Base SQL Realtime', icon: <TrendingUp size={18}/>, color: 'text-emerald-500' },
      { label: 'Em Risco', value: atRisk.toString(), trend: 'Ação necessária', icon: <AlertTriangle size={18}/>, color: 'text-rose-500' },
    ];
  }, [okrs]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <CircleDot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">OKR Data Engine</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Objectives & Key Results</h2>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
          <Plus size={20} />
          Novo Objetivo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar objetivo no banco..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600"
          />
        </div>
        <button onClick={fetchOKRs} className="p-2.5 text-slate-400 hover:text-slate-900 mr-2"><RefreshCcw size={18}/></button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Metas...</p>
        </div>
      ) : filteredOKRs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden transition-all hover:border-blue-100">
           <Zap className="text-slate-100 w-48 h-48 mb-4" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum objetivo definido no banco</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {filteredOKRs.map(okr => {
             const perc = Math.min((okr.current / okr.target) * 100, 100);
             return (
               <div key={okr.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                 {okr.status === 'Risco' && <div className="absolute top-0 right-0 w-1 h-full bg-rose-500"></div>}
                 
                 <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md border border-slate-100">
                         {okr.period || 'Q1 - 2024'}
                       </span>
                       <h4 className="text-xl font-bold text-slate-900 tracking-tight mt-2 uppercase">{okr.title}</h4>
                       <p className="text-xs text-slate-400 font-medium">Responsável: {okr.owner || 'A definir'}</p>
                    </div>
                    <button className="text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Progresso Consolidado</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            {okr.current} <span className="text-slate-300">/ {okr.target}</span>
                          </span>
                       </div>
                       <span className={`text-sm font-black ${perc >= 100 ? 'text-emerald-500' : 'text-blue-600'}`}>{perc.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 shadow-sm ${perc >= 100 ? 'bg-emerald-500' : okr.status === 'Risco' ? 'bg-rose-500' : 'bg-blue-600'}`} 
                         style={{ width: `${perc}%` }}
                       ></div>
                    </div>
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};

export default OperationalOKR;
