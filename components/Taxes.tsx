
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  Clock,
  Download,
  Loader2,
  Database,
  Building2,
  RefreshCcw,
  Scale,
  MoreVertical
} from 'lucide-react';
import NewTaxModal from './NewTaxModal';
import { supabase } from '../lib/supabase';

interface TaxesProps {
  user: any;
}

const Taxes: React.FC<TaxesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Tributos');
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provisionedTotal, setProvisionedTotal] = useState(0);

  // Estados dos Filtros
  const [filters, setFilters] = useState({
    status: 'Todos',
    type: 'Todos',
    startDate: '2026-02-01',
    endDate: '2026-02-28'
  });

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: taxesData } = await supabase.from('taxes').select('*').eq('user_id', user.id);
      setTaxes(taxesData || []);

      const { data: txs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'IN')
        .eq('status', 'PAID');

      const revenue = txs?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const totalRate = taxesData?.reduce((acc, t) => acc + (Number(t.rate) || 0), 0) || 0;
      setProvisionedTotal(revenue * (totalRate / 100));

    } catch (err) {
      console.error('Erro ao buscar impostos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">Impostos</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gerencie obrigações fiscais e tributos</p>
        </div>
        <button 
          onClick={() => setIsNewTaxModalOpen(true)} 
          className="w-full md:w-auto bg-[#0042b3] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#003691] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Novo Tributo
        </button>
      </div>

      {/* Summary Stats Row (Based on Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Tributos Ativos */}
        <div className="bg-white border-2 border-slate-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tributos Ativos</p>
            <h3 className="text-2xl font-black text-blue-700">{taxes.length}</h3>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"><Building2 size={20} /></div>
        </div>

        {/* Estimativa Mensal */}
        <div className="bg-white border-2 border-slate-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimativa Mensal</p>
            <h3 className="text-2xl font-black text-slate-800">{formatCurrency(provisionedTotal)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Baseado nas taxas cadastradas</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"><Percent size={20} /></div>
        </div>

        {/* Total Pago */}
        <div className="bg-white border-2 border-emerald-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pago</p>
            <h3 className="text-2xl font-black text-emerald-600">R$ 0,00</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"><CheckCircle2 size={20} /></div>
        </div>

        {/* Total Pendente */}
        <div className="bg-white border-2 border-orange-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendente</p>
            <h3 className="text-2xl font-black text-orange-500">R$ 0,00</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl border border-orange-100"><Clock size={20} /></div>
        </div>
      </div>

      {/* Filter Bar Section */}
      <div className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-sm mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <div className="relative">
              <select 
                value={filters.status} 
                onChange={e => setFilters({...filters, status: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
            <div className="relative">
              <select 
                value={filters.type} 
                onChange={e => setFilters({...filters, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Todos</option>
                <option>Federal</option>
                <option>Estadual</option>
                <option>Municipal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data inicial</label>
            <div className="relative">
              <input 
                type="date" 
                value={filters.startDate}
                onChange={e => setFilters({...filters, startDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data final</label>
            <div className="relative">
              <input 
                type="date" 
                value={filters.endDate}
                onChange={e => setFilters({...filters, endDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - List */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col transition-all hover:border-slate-200">
        <div className="p-6 md:p-8 border-b-2 border-slate-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full lg:w-auto border border-slate-200/50">
            {['Tributos', 'Retenções', 'Créditos'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${activeTab === tab ? 'bg-white text-blue-600 border-blue-500 shadow-sm' : 'border-transparent text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all">
            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compilando Matriz Fiscal...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tributo & Identificação</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Esfera</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Alíquota</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Recorrência</th>
                  <th className="px-8 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {taxes.map(tax => (
                  <tr key={tax.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight uppercase">{tax.name}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">Base: {tax.calculation_base || 'Faturamento'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-500`}>
                        {tax.sphere}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
                        <Percent size={12} strokeWidth={3} />
                        <span className="text-sm font-black tracking-tighter">{tax.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{tax.recurrence}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase">Dia {tax.due_day}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2.5 text-slate-200 hover:text-slate-900 transition-all"><MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewTaxModal isOpen={isNewTaxModalOpen} onClose={() => { setIsNewTaxModalOpen(false); fetchData(); }} user={user} />
    </div>
  );
};

export default Taxes;
