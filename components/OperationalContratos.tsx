
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
  Database
} from 'lucide-react';
import NewContractModal from './NewContractModal';
import { supabase } from '../lib/supabase';

const OperationalContratos: React.FC = () => {
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          customers (name)
        `)
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
  }, []);

  const stats = useMemo(() => {
    const active = contracts.filter(c => c.status === 'ACTIVE' || c.status === 'Em vigor');
    const mrr = active.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const expiring = contracts.filter(c => {
      if (!c.end_date) return false;
      const days = (new Date(c.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return days > 0 && days <= 30;
    }).length;

    return [
      { label: 'MRR Contratual', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr), trend: 'Base SQL', icon: <CreditCard size={18}/> },
      { label: 'Contratos Ativos', value: active.length.toString(), trend: 'Em vigência', icon: <CheckCircle2 size={18}/> },
      { label: 'A vencer (30d)', value: expiring.toString(), trend: 'Atenção', icon: <Clock size={18}/> },
      { label: 'Total Registrado', value: contracts.length.toString(), trend: 'Auditado', icon: <FileText size={18}/> },
    ];
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => 
      c.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toString().includes(searchTerm)
    );
  }, [contracts, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contratos Sincronizados</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Gestão de Contratos</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewContractModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Novo Contrato
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou número do contrato..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>
        <button onClick={fetchContracts} className="mr-2 p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Arquivos Digitais...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
               <FileText size={40} />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum contrato ativo no banco</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Início</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Término</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{contract.customers?.name || 'Cliente Removido'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {contract.id.toString().substring(0,8)}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.amount || 0)}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-bold text-slate-500">
                        {contract.start_date ? new Date(contract.start_date).toLocaleDateString('pt-BR') : '—'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-bold text-slate-500">
                        {contract.end_date ? new Date(contract.end_date).toLocaleDateString('pt-BR') : 'Indeterminado'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                        contract.status === 'ACTIVE' || contract.status === 'Em vigor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {contract.status === 'ACTIVE' ? 'Em vigor' : contract.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewContractModal isOpen={isNewContractModalOpen} onClose={() => { setIsNewContractModalOpen(false); fetchContracts(); }} />
    </div>
  );
};

export default OperationalContratos;
