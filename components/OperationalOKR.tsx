
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
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewOKRModal from './NewOKRModal';

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
        .eq('user_id', user.id) // ISOLAÇÃO
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

  const filteredOKRs = useMemo(() => {
    return okrs.filter(o => o.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [okrs, searchTerm]);

  const stats = useMemo(() => {
    const total = okrs.length;
    const avgProgress = total > 0 ? Math.round(okrs.reduce((acc, o) => acc + (Math.min(o.current / o.target, 1) * 100), 0) / total) : 0;
    return [
      { label: 'Seus Objetivos', value: total.toString(), trend: 'Em execução', icon: <Target size={18}/>, color: 'text-blue-600' },
      { label: 'Atingimento Médio', value: `${avgProgress}%`, trend: 'Base SQL Individual', icon: <TrendingUp size={18}/>, color: 'text-emerald-500' },
    ];
  }, [okrs]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><CircleDot size={24} /></div>
          <div><div className="flex items-center gap-2 mb-0.5"><Database size={14} className="text-blue-500" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">OKR Data Sync</span></div><h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Seus OKRs</h2></div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"><Plus size={20} /> Novo Objetivo</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4"><p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p><div className={`p-2 bg-slate-50 ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>{stat.icon}</div></div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Seus Resultados...</p></div>
      ) : filteredOKRs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-blue-100 relative overflow-hidden">
           <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
             <Target size={40} strokeWidth={1.5} />
           </div>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Nenhum OKR encontrado</p>
           <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Definir primeiro objetivo</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
           {filteredOKRs.map(okr => {
             const perc = Math.min((okr.current / okr.target) * 100, 100);
             return (
               <div key={okr.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between min-h-[280px]">
                 <div><div className="flex justify-between items-start mb-6"><div className="space-y-2"><span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">{okr.period || 'Ciclo 2026'}</span><h4 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-2 uppercase">{okr.title}</h4></div><button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button></div></div>
                 <div className="space-y-4 pt-6 border-t border-slate-50"><div className="flex justify-between items-end"><div className="flex flex-col"><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Progresso</span><span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">{okr.current} / {okr.target}</span></div><span className={`text-xs md:text-sm font-black ${perc >= 100 ? 'text-emerald-500' : 'text-blue-600'}`}>{perc.toFixed(1)}%</span></div><div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 shadow-sm ${perc >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${perc}%` }}></div></div></div>
               </div>
             );
           })}
        </div>
      )}

      <NewOKRModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOKRs(); }} user={user} />
    </div>
  );
};

export default OperationalOKR;
