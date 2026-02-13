
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
  Database
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';
import { supabase } from '../lib/supabase';

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['Todos', 'Pagos', 'Pendentes', 'Atrasados'];

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bank_accounts (name),
          cost_centers (name)
        `)
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
  }, []);

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
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Realtime</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Ledger Financeiro</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Exibindo {filteredTransactions.length} registros.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm"
          >
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Novo
          </button>
        </div>
      </div>

      {/* Toolbar Adaptável */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl md:rounded-[1.25rem] w-full lg:w-auto overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 md:px-5 py-2 rounded-lg md:rounded-[1rem] text-xs font-bold transition-all whitespace-nowrap ${selectedTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto md:pr-2">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600"
            />
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabela de Dados com Scroll Horizontal Controlado */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 md:px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 md:px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultando Supabase...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Sem registros</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 md:px-8 py-5">
                      <span className="text-sm font-semibold text-slate-400">{formatDate(item.competence_date)}</span>
                    </td>
                    <td className="px-6 md:px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg shrink-0 ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {item.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-[200px]">{item.description}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase truncate">{item.cost_centers?.name || 'Geral'}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 md:px-8 py-5 text-sm font-bold text-right tracking-tight ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 md:px-8 py-5 text-center">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                        'bg-amber-50 text-amber-500 border-amber-100'
                      }`}>
                        {item.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-900">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchTransactions(); }} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
