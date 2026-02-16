
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
  MoreVertical,
  Receipt,
  TrendingUp
} from 'lucide-react';
import NewTaxModal from './NewTaxModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface TaxesProps {
  user: any;
}

const Taxes: React.FC<TaxesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Tributos');
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provisionedTotal, setProvisionedTotal] = useState(0);

  const [filters, setFilters] = useState({
    status: 'Todos',
    sphere: 'Todos'
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-8 pt-8">
      
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Scale size={14} className="text-blue-600" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Fiscal Governance Hub</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Compliance <span className="text-blue-600 not-italic">Tributário</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Monitoramento de obrigações e provisão fiscal auditada</p>
        </div>
        <button 
          onClick={() => setIsNewTaxModalOpen(true)} 
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Nova Regra Fiscal
        </button>
      </div>

      {/* KPI Row (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Tributos Ativos" value={taxes.length.toString()} subtitle="Configurados na conta" icon={<Building2 />} color="blue" />
        <StatCard title="Provisão Mensal" value={formatCurrency(provisionedTotal)} subtitle="Estimativa s/ faturamento" icon={<Percent />} color="blue" />
        <StatCard title="Total Liquidado" value="R$ 0,00" subtitle="Impostos Pagos" icon={<CheckCircle2 />} color="emerald" />
        <StatCard title="Total Pendente" value="R$ 0,00" subtitle="Obrigações em Aberto" icon={<Clock />} color="blue" />
      </div>

      {/* Toolbar SaaS */}
      <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 flex-1">
          {['Tributos', 'Retenções', 'Créditos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 px-2">
           <div className="relative">
              <select 
                value={filters.sphere}
                onChange={e => setFilters({...filters, sphere: e.target.value})}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-black uppercase appearance-none pr-10 outline-none focus:border-blue-500 transition-all"
              >
                <option>Esfera: Todas</option>
                <option>Federal</option>
                <option>Estadual</option>
                <option>Municipal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
             <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Tabela Fiscal (Journal Style) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Compilando Matriz Fiscal...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tributo & Identificação Técnica</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Esfera</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Alíquota Real</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Recorrência</th>
                  <th className="px-8 py-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxes.map(tax => (
                  <tr key={tax.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight uppercase italic">{tax.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Base: {tax.calculation_base || 'Faturamento Consolidado'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-500`}>
                        {tax.sphere}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                        <Percent size={12} strokeWidth={3} />
                        <span className="text-sm font-black tracking-tighter">{tax.rate}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{tax.recurrence}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Vencimento: Dia {tax.due_day}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                         <MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
                {taxes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-32 text-center opacity-30">
                       <Receipt size={48} strokeWidth={1} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma regra fiscal ativa</p>
                    </td>
                  </tr>
                )}
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
