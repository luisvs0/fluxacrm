
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
  RefreshCcw
} from 'lucide-react';
import NewNPSModal from './NewNPSModal';
import { supabase } from '../lib/supabase';

const OperationalNPS: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [activeView, setActiveView] = useState<'Cohort' | 'Cliente' | 'Pesquisas'>('Pesquisas');
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Star size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sentiment Data Sync</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Customer Satisfaction</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeSegment === 'Clientes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeSegment === 'Equipe' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Equipe (eNPS)
            </button>
          </div>
          <button 
            onClick={() => setIsNewNPSModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Pesquisa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">NPS Score Geral</p>
          <h3 className={`text-3xl font-black tracking-tighter ${stats.score >= 70 ? 'text-emerald-500' : stats.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
            {isLoading ? '...' : stats.score}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Zona de {stats.score >= 75 ? 'Excelência' : stats.score >= 50 ? 'Qualidade' : 'Aperfeiçoamento'}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Amostragem</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.rate} Feedbacks`}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Base SQL Ativa</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Promotores</p>
          <div className="flex items-center gap-2">
             <Smile size={20} className="text-emerald-500" />
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stats.promotores}</h3>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Clientes Leais</p>
        </div>

        <div className="bg-[#002147] rounded-[1.75rem] p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Detratores</p>
            <div className="flex items-center gap-2">
               <Frown size={20} className="text-rose-400" />
               <h3 className="text-2xl font-bold tracking-tight">{stats.detratores}</h3>
            </div>
            <p className="text-xs text-rose-400 font-bold mt-1 uppercase tracking-widest">Ação Imediata</p>
          </div>
          <BarChart className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Feedbacks Recentes</h3>
              <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">{responses.length}</span>
           </div>
           <button onClick={fetchNPS} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><RefreshCcw size={18}/></button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Sentimentos...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30">
             <MessageSquare size={48} className="mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem respostas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Comentário</th>
                  <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {responses.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 uppercase">{res.customers?.name || 'Cliente S/N'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{res.context || 'Geral'}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`w-10 h-10 inline-flex items-center justify-center rounded-xl font-black text-sm shadow-sm ${
                        res.score >= 9 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        res.score >= 7 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {res.score}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md italic line-clamp-2">
                        "{res.comment || 'Sem observações.'}"
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
