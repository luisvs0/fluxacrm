
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  BarChart, 
  Smile, 
  Meh, 
  Frown,
  Loader2,
  Database,
  RefreshCcw,
  Sparkles,
  Search,
  MoreVertical,
  Activity,
  Award
} from 'lucide-react';
import NewNPSModal from './NewNPSModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface OperationalNPSProps {
  user: any;
}

const OperationalNPS: React.FC<OperationalNPSProps> = ({ user }) => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [isNewNPSModalOpen, setIsNewNPSModalOpen] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNPS = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('nps_responses')
        .select(`
          *,
          customers (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error('Erro NPS:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNPS();
  }, []);

  const stats = useMemo(() => {
    if (responses.length === 0) return { score: 0, total: 0, promotores: 0, detratores: 0, passivos: 0 };
    
    const promotores = responses.filter(r => r.score >= 9).length;
    const detratores = responses.filter(r => r.score <= 6).length;
    const npsScore = Math.round(((promotores - detratores) / responses.length) * 100);
    
    return {
      score: npsScore,
      total: responses.length,
      promotores,
      detratores,
      passivos: responses.length - promotores - detratores
    };
  }, [responses]);

  const filteredResponses = useMemo(() => {
    return responses.filter(r => 
      r.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [responses, searchTerm]);

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
                <Smile size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Sentiment Analytics SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Customer <span className="text-[#203267] not-italic">Sentiment</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Métricas de satisfação e fidelidade da carteira</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white border border-slate-300 rounded-xl p-1 shadow-md">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Clientes' ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Equipe' ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              eNPS (Equipe)
            </button>
          </div>
          <button 
            onClick={() => setIsNewNPSModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Registrar Nota
          </button>
          <button onClick={fetchNPS} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* NPS Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-8 shadow-xl flex flex-col justify-between overflow-hidden relative min-h-[180px] group">
            <div className="relative z-10">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Score NPS Consolidado</span>
               <h3 className={`text-5xl font-black tracking-tighter mt-4 italic ${stats.score >= 70 ? 'text-emerald-500' : stats.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{stats.score}</h3>
            </div>
            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center gap-2">
               <Sparkles size={12} className="text-blue-500" />
               <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Zona de {stats.score >= 75 ? 'Excelência' : stats.score >= 50 ? 'Qualidade' : 'Aperfeiçoamento'}</span>
            </div>
            <Database size={150} className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 transition-transform" />
          </div>

          <StatCard title="Amostragem Base" value={stats.total.toString()} subtitle="Feedbacks Coletados" icon={<Activity />} color="blue" />
          <StatCard title="Promotores" value={stats.promotores.toString()} subtitle="9-10: Clientes Fiéis" icon={<Smile />} color="emerald" />
          <StatCard title="Detratores" value={stats.detratores.toString()} subtitle="0-6: Risco de Churn" icon={<Frown />} color="red" />
        </div>

        {/* Toolbar & Table */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Filtrar por cliente ou comentário qualitativo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> DB Node Sentiment</span>
               <div className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cliente & Contexto</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Nota</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Comentário Analítico</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Data Protocolo</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processando Matriz de Sentimento...</p>
                      </td>
                    </tr>
                  ) : filteredResponses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-48 text-center opacity-30">
                         <Award size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum feedback localizado nesta conta</p>
                      </td>
                    </tr>
                  ) : (
                    filteredResponses.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                            <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[250px] group-hover:text-[#203267] transition-colors">{res.customers?.name || 'Cliente Removido'}</p>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{res.context || 'Ponto de Contato Geral'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 font-black text-lg italic shadow-sm group-hover:scale-110 transition-transform ${
                               res.score >= 9 ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                               res.score >= 7 ? 'bg-amber-50 text-amber-600 border-amber-300' :
                               'bg-rose-50 text-rose-600 border-rose-300'
                            }`}>
                               {res.score}
                            </div>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md italic line-clamp-2">
                             "{res.comment || 'Nenhuma percepção qualitativa registrada para este nó.'}"
                           </p>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-900 uppercase">{new Date(res.created_at).toLocaleDateString('pt-BR')}</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-tighter italic">Auditado SQL</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all active:scale-90">
                              <MoreVertical size={20} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <NewNPSModal isOpen={isNewNPSModalOpen} onClose={() => { setIsNewNPSModalOpen(false); fetchNPS(); }} />
    </div>
  );
};

export default OperationalNPS;
