
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  MoreVertical,
  Loader2,
  Database,
  RefreshCcw,
  ChevronDown
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';
import { supabase } from '../lib/supabase';

interface TransactionsProps {
  user: any;
}

const Transactions: React.FC<TransactionsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['Todos', 'Pagos', 'Pendentes', 'Atrasados'];

  const fetchTransactions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bank_accounts (name),
          cost_centers (name)
        `)
        .eq('user_id', user.id)
        .order('competence_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (selectedTab === 'Pagos') {
      result = result.filter(t => t.status === 'PAID');
    } else if (selectedTab === 'Pendentes') {
      result = result.filter(t => t.status === 'PENDING');
    } else if (selectedTab === 'Atrasados') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(t => t.status === 'PENDING' && t.competence_date < today);
    }
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.description?.toLowerCase().includes(lowSearch) || 
        t.bank_accounts?.name?.toLowerCase().includes(lowSearch)
      );
    }
    return result;
  }, [transactions, selectedTab, searchTerm]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white border border-slate-700 shadow-lg">
                <Database size={16} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#203267]/60">Live Ledger SQL</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Journal <span className="text-[#203267] not-italic">Financeiro</span></h1>
          <p className="text-[13px] text-slate-400 font-medium mt-1">Exibindo {filteredTransactions.length} registros auditados em tempo real</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-300 text-slate-600 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-[#203267] hover:text-[#203267] transition-all shadow-sm active:scale-95"
          >
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Toolbar design refinado */}
      <div className="relative z-10 px-4 md:px-10 mt-8 mb-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full lg:w-auto overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all duration-300 whitespace-nowrap ${selectedTab === tab ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto md:pr-2">
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por descrição ou banco..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-4 focus:ring-[#203267]/5 focus:border-[#203267] text-slate-600 transition-all outline-none"
              />
            </div>
            <button onClick={fetchTransactions} className="p-3 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] hover:shadow-lg transition-all active:scale-90">
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container corporativo */}
      <div className="relative z-10 px-4 md:px-10">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[550px] flex flex-col transition-all hover:shadow-xl duration-700">
          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data de Competência</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Entidade & Descrição</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Valor Auditado</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-10 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Conciliando Base SQL...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-48 text-center opacity-30">
                      <Database size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum registro localizado na conta</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-all group relative">
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tighter italic">{formatDate(item.competence_date)}</span>
                          <span className="text-[9px] font-black text-[#203267]/60 uppercase tracking-widest mt-1">{item.bank_accounts?.name || 'Tesouraria'}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-lg border transition-all duration-500 group-hover:scale-105 flex items-center justify-center shadow-sm ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-rose-50 text-rose-500 border-rose-300'}`}>
                            {item.type === 'IN' ? <ArrowDownLeft size={20} strokeWidth={3} /> : <ArrowUpRight size={20} strokeWidth={3} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[350px] group-hover:text-[#203267] transition-colors">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-300">{item.cost_centers?.name || 'Geral'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-10 py-8 text-lg font-black text-right tracking-tighter ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                          item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 
                          'bg-amber-50 text-amber-600 border-amber-300'
                        }`}>
                          {item.status === 'PAID' ? 'Liquidado' : 'Pendente'}
                        </span>
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

      <NewTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchTransactions(); }} user={user} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
