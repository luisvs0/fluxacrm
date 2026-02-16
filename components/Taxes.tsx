
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
  Filter,
  Search
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white border border-slate-700 shadow-lg">
                <Scale size={16} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#203267]/60">Fiscal Compliance Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão <span className="text-[#203267] not-italic">Tributária</span></h1>
          <p className="text-[13px] text-slate-400 font-medium mt-1">Provisionamento automático e controle de obrigações fiscais</p>
        </div>
        <button 
          onClick={() => setIsNewTaxModalOpen(true)} 
          className="w-full md:w-auto bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Novo Tributo
        </button>
      </div>

      {/* KPI Section */}
      <div className="relative z-10 px-4 md:px-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tributos Ativos" value={taxes.length.toString()} subtitle="Regras cadastradas" icon={<Building2 />} color="blue" />
        <StatCard title="Provisão Mensal" value={formatCurrency(provisionedTotal)} subtitle="Estimativa baseada em faturamento" icon={<Percent />} color="blue" showInfo />
        <StatCard title="Total Pago" value="R$ 0,00" subtitle="Ciclo Fevereiro" icon={<CheckCircle2 />} color="emerald" />
        <StatCard title="Pendente" value="R$ 0,00" subtitle="Aguardando guia" icon={<Clock />} color="red" />
      </div>

      {/* Filter Pill Bar */}
      <div className="relative z-10 px-4 md:px-10 mt-10 mb-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 pl-4">
             <div className="flex items-center gap-2">
                <Filter size={14} className="text-[#203267]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtros SQL:</span>
             </div>
             <div className="flex gap-2">
                <select className="bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-tight text-slate-600 focus:ring-2 focus:ring-[#203267]/10 outline-none transition-all">
                   <option>Todos os Status</option>
                   <option>Ativos</option>
                </select>
                <select className="bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-tight text-slate-600 focus:ring-2 focus:ring-[#203267]/10 outline-none transition-all">
                   <option>Todas as Esferas</option>
                   <option>Federal</option>
                </select>
             </div>
          </div>
          <div className="flex items-center gap-3 pr-4 text-[10px] font-black text-[#203267] uppercase tracking-[0.1em]">
             <span className="flex items-center gap-1.5 opacity-40"><Database size={12}/> Live Matrix v2</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Main Container Premium */}
      <div className="relative z-10 px-4 md:px-10">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
          <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
              {['Tributos', 'Retenções', 'Créditos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button onClick={fetchData} className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-slate-300">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tributo & Identificação</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Esfera</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Alíquota</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Recorrência</th>
                  <th className="px-10 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Matriz Fiscal...</p>
                    </td>
                  </tr>
                ) : taxes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-48 text-center opacity-30">
                       <Database size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhuma regra fiscal na sua conta</p>
                    </td>
                  </tr>
                ) : (
                  taxes.map(tax => (
                    <tr key={tax.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-[#203267] transition-colors">{tax.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Base: {tax.calculation_base || 'Faturamento'}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className="text-[9px] font-black px-4 py-1.5 rounded-md uppercase tracking-widest border border-slate-300 bg-white text-slate-500 shadow-sm">
                          {tax.sphere}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#203267] px-4 py-2 rounded-lg border border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                          <Percent size={14} strokeWidth={3} />
                          <span className="text-sm font-black tracking-tighter">{tax.rate}%</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{tax.recurrence}</span>
                          <span className="text-[9px] font-black text-[#203267]/60 uppercase mt-1 italic">Dia {tax.due_day}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all active:scale-90">
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

      <NewTaxModal isOpen={isNewTaxModalOpen} onClose={() => { setIsNewTaxModalOpen(false); fetchData(); }} user={user} />
    </div>
  );
};

export default Taxes;
