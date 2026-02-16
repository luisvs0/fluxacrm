
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Download, 
  Plus, 
  Search, 
  ArrowDownLeft, 
  Target, 
  MoreVertical,
  Loader2,
  Database
} from 'lucide-react';
import NewCostCenterModal from './NewCostCenterModal';
import ExportPDFModal from './ExportPDFModal';
import { supabase } from '../lib/supabase';

interface CostCentersProps {
  user: any;
}

const CostCenters: React.FC<CostCentersProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCostCenters = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cost_centers')
        .select(`
          *,
          transactions(amount, type)
        `)
        .eq('user_id', user.id); 

      if (error) throw error;

      const formatted = data.map(center => {
        const spent = center.transactions
          ?.filter((t: any) => t.type === 'OUT')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
        
        const budget = Number(center.budget) || 1;
        const perc = Math.min((spent / budget) * 100, 100);

        return { ...center, spent, perc };
      });

      setCostCenters(formatted);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500 shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Budget Matrix SQL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Centros de Custo</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Gestão de verbas isolada por conta</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
            Relatórios
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Novo Centro
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Sua Estrutura...</p>
          </div>
        ) : (
          <div className="p-4 md:p-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {costCenters.map((center) => (
              <div key={center.id} className="p-8 bg-white border-2 border-blue-50 rounded-[2.5rem] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-widest">
                      #{center.code || 'CC'}
                    </span>
                    <h4 className="text-base font-black text-slate-900 tracking-tight uppercase truncate">{center.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Budget: {formatCurrency(center.budget)}</p>
                  </div>
                  <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20} /></button>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Consumido</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(center.spent)}</span>
                    </div>
                    <span className={`text-xs font-black ${center.perc > 90 ? 'text-rose-600' : 'text-blue-600'}`}>
                      {center.perc.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 shadow-sm ${center.perc > 90 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                      style={{ width: `${center.perc}%` }}
                    ></div>
                  </div>
                </div>

                {/* Visual Accent */}
                <div className={`absolute bottom-0 left-0 h-1.5 w-full transition-all duration-500 opacity-20 ${center.perc > 90 ? 'bg-rose-500' : 'bg-blue-500 group-hover:opacity-40'}`}></div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 hover:border-blue-400/50 group min-h-[220px] transition-all"
            >
              <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:border-blue-100 group-hover:scale-110 shadow-sm transition-all">
                <Plus size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Criar Novo Centro</p>
              </div>
            </button>
          </div>
        )}
      </div>
      <NewCostCenterModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCostCenters(); }} user={user} />
      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default CostCenters;
