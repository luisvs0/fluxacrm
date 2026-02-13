
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
  Sparkles
} from 'lucide-react';
import NewNPSModal from './NewNPSModal';
import { supabase } from '../lib/supabase';

const OperationalNPS: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [isNewNPSModalOpen, setIsNewNPSModalOpen] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (responses.length === 0) return { score: 0, rate: 0, promotores: 0, detratores: 0, passivos: 0 };
    
    const promotores = responses.filter(r => r.score >= 9).length;
    const detratores = responses.filter(r => r.score <= 6).length;
    const passivos = responses.length - promotores - detratores;
    
    const npsScore = Math.round(((promotores - detratores) / responses.length) * 100);
    
    return {
      score: npsScore,
      rate: responses.length,
      promotores,
      detratores,
      passivos
    };
  }, [responses]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Star size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sentiment Realtime Sync</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Voz do Cliente (NPS)</h2>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Clientes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Equipe' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              eNPS
            </button>
          </div>
          <button 
            onClick={() => setIsNewNPSModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={20} /> Registrar Resposta
          </button>
        </div>
      </div>

      {/* KPI NPS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">NPS Score Geral</p>
          <div className="flex items-end justify-between">
            <h3 className={`text-3xl md:text-4xl font-black tracking-tighter ${stats.score >= 70 ? 'text-emerald-500' : stats.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
              {isLoading ? '...' : stats.score}
            </h3>
            <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
               <TrendingUp size={20} className={stats.score >= 70 ? 'text-emerald-500' : 'text-rose-400'} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Zona de {stats.score >= 75 ? 'Excelência' : stats.score >= 50 ? 'Qualidade' : 'Aperfeiçoamento'}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Promotores</p>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-2xl"><Smile size={24} /></div>
             <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stats.promotores}</h3>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-2">9-10: Clientes Fiéis</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Detratores</p>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl"><Frown size={24} /></div>
             <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stats.detratores}</h3>
          </div>
          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-2">0-6: Risco de Churn</p>
        </div>

        <div className="bg-[#002147] rounded-[1.75rem] p-5 md:p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] md:text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Amostragem Base</p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{stats.rate} Respostas</h3>
            <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
               <Database size={12} /> SQL Realtime Audit
            </p>
          </div>
          <BarChart className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Tabela de Feedbacks */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Comentários e Percepções</h3>
              <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">{responses.length} feedbacks</span>
           </div>
           <button onClick={fetchNPS} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl">
             <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Sentimentos...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4">
             <MessageSquare size={48} className="mx-auto" />
             <p className="text-sm font-bold uppercase tracking-widest">Sem respostas registradas na base</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente & Contexto</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Comentário Qualitativo</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {responses.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate max-w-[200px]">{res.customers?.name || 'Cliente Removido'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{res.context || 'Geral'}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`w-10 h-10 inline-flex items-center justify-center rounded-xl font-black text-sm shadow-sm border ${
                        res.score >= 9 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        res.score >= 7 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {res.score}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md italic line-clamp-2">
                        "{res.comment || 'Nenhuma observação adicional fornecida.'}"
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(res.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewNPSModal isOpen={isNewNPSModalOpen} onClose={() => { setIsNewNPSModalOpen(false); fetchNPS(); }} />
    </div>
  );
};

export default OperationalNPS;
