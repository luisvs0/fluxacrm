
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
  Database,
  RefreshCcw,
  Activity
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
          transactions(amount, type, status)
        `)
        .eq('user_id', user.id); 

      if (error) throw error;

      const formatted = data.map(center => {
        const spent = center.transactions
          ?.filter((t: any) => t.type === 'OUT' && t.status === 'PAID')
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-8 pt-8">
      
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Activity size={14} className="text-blue-600" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Budget Allocation Hub</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Centros de <span className="text-blue-600 not-italic">Custo</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Classificação analítica por unidade de negócio</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            Exportar Budget
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
            <Plus size={18} strokeWidth={3} /> Novo Centro
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 text-center">
          <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Alocação de Recursos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {costCenters.map((center) => (
            <div key={center.id} className="bg-white border border-slate-200 rounded-xl p-8 transition-all duration-300 group shadow-sm hover:shadow-md relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest border border-blue-100">
                    ID: {center.code || 'CC-00'}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{center.name}</h4>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={18} /></button>
              </div>
              
              <div className="space-y-6 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget Teto</span>
                      <span className="text-sm font-bold text-slate-500 tracking-tight">{formatCurrency(center.budget)}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consumido Real</span>
                      <span className="text-base font-black text-slate-900 tracking-tighter">{formatCurrency(center.spent)}</span>
                   </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Utilização</span>
                     <span className={`text-[10px] font-black ${center.perc > 90 ? 'text-rose-500' : 'text-blue-600'}`}>{center.perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-1000 shadow-sm ${center.perc > 90 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                      style={{ width: `${center.perc}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Accent Bar */}
              <div className={`absolute bottom-0 left-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-all duration-500 ${center.perc > 90 ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-blue-400 transition-all group min-h-[250px]"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-slate-100">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600">Provisionar Novo Centro</span>
          </button>
        </div>
      )}

      <NewCostCenterModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCostCenters(); }} user={user} />
      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default CostCenters;
