
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  ChevronDown,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MoreVertical,
  Calendar,
  Loader2,
  Database,
  RefreshCw,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import NewContractModal from './NewContractModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface OperationalContratosProps {
  user: any;
}

const OperationalContratos: React.FC<OperationalContratosProps> = ({ user }) => {
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContracts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          customers (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      console.error('Erro ao buscar contratos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const stats = useMemo(() => {
    const active = contracts.filter(c => c.status === 'ACTIVE' || c.status === 'Em vigor');
    const mrr = active.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    return {
      activeCount: active.length,
      mrrTotal: mrr,
      totalCount: contracts.length
    };
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

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
                <FileText size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Contract Management SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Meus <span className="text-[#203267] not-italic">Contratos</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão de vigências e liquidação recorrente da base</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewContractModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Contrato
          </button>
          <button onClick={fetchContracts} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="MRR Contratual" value={formatCurrency(stats.mrrTotal)} subtitle="Receita Líquida Recorrente" icon={<CreditCard />} color="blue" />
          <StatCard title="Em Vigência" value={stats.activeCount.toString()} subtitle="Ativos Processando" icon={<ShieldCheck />} color="emerald" />
          <StatCard title="Sua Base Total" value={stats.totalCount.toString()} subtitle="Registros Consolidados" icon={<FileText />} color="blue" />
        </div>

        {/* Toolbar & Table */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por cliente ou ID de protocolo contratual..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Distributed Ledger</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cliente & Protocolo</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Valor Mensal</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status Ativo</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Assinatura</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Registros Contratuais...</p>
                      </td>
                    </tr>
                  ) : filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-48 text-center opacity-30">
                         <FileText size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum contrato ativo localizado</p>
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                             <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[250px] group-hover:text-[#203267] transition-colors">{contract.customers?.name || 'Cliente Removido'}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Vigência: {contract.duration_months} Meses • Protocolo #{contract.id.substring(0,8)}</p>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <p className="text-lg font-black text-slate-900 tracking-tighter italic">{formatCurrency(contract.amount || 0)}</p>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                             contract.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-rose-50 text-rose-600 border-rose-300'
                           }`}>
                             {contract.status === 'ACTIVE' ? 'Em vigor' : 'Inativo'}
                           </span>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#203267] px-4 py-2 rounded-lg border border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              <span className="text-[10px] font-black uppercase tracking-tight">Auditado</span>
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

      <NewContractModal isOpen={isNewContractModalOpen} onClose={() => { setIsNewContractModalOpen(false); fetchContracts(); }} user={user} />
    </div>
  );
};

export default OperationalContratos;
