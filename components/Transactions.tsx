
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
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-8 pt-8">
      
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Database size={14} className="text-blue-600" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ledger Auditado v2.6</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Extrato de <span className="text-blue-600 not-italic">Lançamentos</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Gestão consolidada de {filteredTransactions.length} registros</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Toolbar SaaS */}
      <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedTab === tab ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto px-2">
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou banco..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-50 focus:border-blue-500 text-slate-600 transition-all outline-none"
            />
          </div>
          <button onClick={fetchTransactions} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data de Competência</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descrição & Classificação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status Auditoria</th>
                <th className="px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-40 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Consolidando Ledger Financeiro...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-40 text-center opacity-30">
                    <Database size={48} strokeWidth={1} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum registro localizado</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-all group relative">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight italic">{formatDate(item.competence_date)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.bank_accounts?.name || 'Caixa Local'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          {item.type === 'IN' ? <ArrowDownLeft size={16} strokeWidth={3} /> : <ArrowUpRight size={16} strokeWidth={3} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate max-w-[300px] uppercase">{item.description}</p>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{item.cost_centers?.name || 'Não Classificado'}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-right tracking-tighter`}>
                       <span className={`text-base font-black ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                         {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-md uppercase tracking-widest border transition-all ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 
                        'bg-amber-50 text-amber-600 border-amber-300'
                      }`}>
                        {item.status === 'PAID' ? 'Efetivado' : 'Aguardando'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
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
