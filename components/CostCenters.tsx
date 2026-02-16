
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
  Sparkles
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white border border-slate-700 shadow-lg">
                <Target size={16} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#203267]/60">Budget Allocation Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Centros de <span className="text-[#203267] not-italic">Custo</span></h1>
          <p className="text-[13px] text-slate-400 font-medium mt-1">Gestão de verbas isolada com monitoramento de teto orçamentário</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex-1 md:flex-none bg-white border border-slate-300 text-slate-600 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-[#203267] transition-all shadow-sm active:scale-95">
            Relatórios
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
            <Plus size={18} strokeWidth={3} /> Novo Centro
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10">
        {isLoading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Acessando Matriz Orçamentária...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {costCenters.map((center) => (
              <div key={center.id} className="bg-white border border-slate-300 rounded-xl p-8 transition-all duration-700 group shadow-sm hover:shadow-xl hover:border-[#203267]/40 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-[#203267] bg-indigo-50 px-3 py-1 rounded-md border border-slate-300 uppercase tracking-[0.2em] shadow-sm">
                        #{center.code || 'SYS'}
                      </span>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase truncate">{center.name}</h4>
                    </div>
                    <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-300 hover:text-slate-900 transition-all"><MoreVertical size={20} /></button>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Mensal</span>
                        <span className="text-2xl font-black text-slate-950 tracking-tighter">{formatCurrency(center.budget)}</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consumido</span>
                        <span className={`text-lg font-black tracking-tighter ${center.perc > 90 ? 'text-rose-600' : 'text-[#203267]'}`}>{formatCurrency(center.spent)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Status do Teto</span>
                        <span className={center.perc > 90 ? 'text-rose-500' : 'text-[#203267]'}>{center.perc.toFixed(1)}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-[1500ms] shadow-sm ${center.perc > 90 ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-[#203267] to-indigo-500'}`} 
                          style={{ width: `${center.perc}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Decoration */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-1000 text-[#203267]">
                   <Database size={160} />
                </div>
                <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 opacity-60 ${center.perc > 90 ? 'bg-rose-500' : 'bg-[#203267]'}`}></div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="group border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center gap-6 hover:bg-white hover:border-[#203267] hover:shadow-xl transition-all duration-700 min-h-[300px]"
            >
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-[#203267] group-hover:scale-110 shadow-sm transition-all">
                <Plus size={32} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-[#203267] transition-colors">Expandir Estrutura</p>
                <p className="text-[10px] text-slate-300 font-medium uppercase mt-1">Criar novo centro de alocação</p>
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
