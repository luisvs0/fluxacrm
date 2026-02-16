
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
  RefreshCcw
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-[#203267]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Realtime</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Ledger Financeiro</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Exibindo {filteredTransactions.length} registros auditados</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
          >
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a2954] shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={18} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-3 border-2 border-slate-100 rounded-[2rem] shadow-md">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar border border-slate-200/50">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap border-2 ${selectedTab === tab ? 'bg-white text-[#203267] border-[#203267] shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto md:pr-2">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou banco..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:border-[#203267] text-slate-600 transition-all"
            />
          </div>
          <button onClick={fetchTransactions} className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela com Bordas Dinâmicas */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col transition-all hover:border-slate-200">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descrição & Centro</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Valor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Conciliando Base...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-40 text-center opacity-30">
                    <Database size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sem registros vinculados à sua conta</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-50 transition-all group border-l-[6px] ${item.type === 'IN' ? 'border-emerald-500/80 hover:bg-emerald-50/20' : 'border-rose-500/80 hover:bg-rose-50/20'}`}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight">{formatDate(item.competence_date)}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase">{item.bank_accounts?.name || 'Caixa'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`p-2.5 rounded-2xl border-2 transition-transform group-hover:scale-110 shadow-sm ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                          {item.type === 'IN' ? <ArrowDownLeft size={16} strokeWidth={3} /> : <ArrowUpRight size={16} strokeWidth={3} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[300px]">{item.description}</p>
                          <p className="text-[9px] font-black text-[#203267] uppercase tracking-widest mt-0.5">{item.cost_centers?.name || 'Geral Operacional'}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-base font-black text-right tracking-tighter ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 shadow-sm ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                        'bg-amber-50 text-amber-600 border-amber-500'
                      }`}>
                        {item.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchTransactions(); }} user={user} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
