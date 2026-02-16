
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  CreditCard, 
  MoreVertical, 
  Trash2, 
  Loader2, 
  Database, 
  User,
  Building2,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Calendar,
  Wallet
} from 'lucide-react';
import NewCardModal from './NewCardModal';
import { supabase } from '../lib/supabase';

interface CardsProps {
  user: any;
}

const Cards: React.FC<CardsProps> = ({ user }) => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Estados dos Filtros
  const [filters, setFilters] = useState({
    type: 'Todos',
    status: 'Todos',
    startDate: '2026-02-01',
    endDate: '2026-02-28'
  });

  const fetchCards = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id); 
      
      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Erro ao buscar cartões:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm('Tem certeza que deseja desvincular este cartão?')) return;
    try {
      const { error } = await supabase.from('cards').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      fetchCards();
    } catch (err) {
      alert('Erro ao excluir cartão.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const companyCardsCount = cards.filter(c => c.type?.includes('Empresa')).length;
  const personalCardsCount = cards.filter(c => c.type?.includes('Sócio') || c.type?.includes('Pessoal')).length;

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">Cartões</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gerencie cartões da empresa e pessoais</p>
        </div>
        <button 
          onClick={() => setIsNewCardModalOpen(true)} 
          className="w-full md:w-auto bg-[#0042b3] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#003691] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Novo cartão
        </button>
      </div>

      {/* Summary Stats Row (Smart Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card Empresa */}
        <div className="bg-white border-2 border-blue-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cartões Empresa</p>
            <h3 className="text-2xl font-black text-blue-700">{companyCardsCount} ativos</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"><Building2 size={20} /></div>
        </div>

        {/* Card Pessoal */}
        <div className="bg-white border-2 border-orange-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cartões Pessoais</p>
            <h3 className="text-2xl font-black text-orange-500">{personalCardsCount} ativos</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl border border-orange-100"><User size={20} /></div>
        </div>

        {/* Gasto Empresa */}
        <div className="bg-white border-2 border-emerald-50 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gasto Empresa</p>
            <h3 className="text-2xl font-black text-emerald-600">R$ 0,00</h3>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">Impacta o financeiro</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"><DollarSign size={20} /></div>
        </div>

        {/* Gasto Pessoal */}
        <div className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gasto Pessoal</p>
            <h3 className="text-2xl font-black text-slate-800">R$ 0,00</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Não impacta o financeiro</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-200"><AlertCircle size={20} /></div>
        </div>
      </div>

      {/* Filter Bar Section */}
      <div className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-sm mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
            <div className="relative">
              <select 
                value={filters.type} 
                onChange={e => setFilters({...filters, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Todos</option>
                <option>Empresa</option>
                <option>Pessoal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <div className="relative">
              <select 
                value={filters.status} 
                onChange={e => setFilters({...filters, status: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Listing Section */}
      <div className="px-1">
        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Listagem de Ativos</h4>
        {isLoading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Wallet...</p></div>
        ) : cards.length === 0 ? (
          <div className="py-24 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center opacity-40">
            <CreditCard size={48} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhum cartão cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map(card => (
              <div key={card.id} className="relative group">
                <div className={`bg-white border-2 ${card.type?.includes('Empresa') ? 'border-blue-100 hover:border-blue-500' : 'border-orange-100 hover:border-orange-500'} rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative border-l-[8px]`}>
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className={`w-14 h-10 ${card.color || 'bg-slate-900'} rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform`}>
                      <div className="absolute top-2 left-2 w-3 h-2 bg-yellow-400/40 rounded-sm"></div>
                      <CreditCard size={24} />
                    </div>
                    <div className="relative">
                      <button onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl">
                        <MoreVertical size={20}/>
                      </button>
                      {menuOpenId === card.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={() => deleteCard(card.id)} className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 rounded-2xl transition-colors">
                            <Trash2 size={14} /> Excluir Cartão
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">{card.name}</h4>
                      <p className="text-xs text-slate-400 font-mono tracking-[0.25em] mt-1 italic">•••• •••• •••• {card.last_digits || '0000'}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Limite Mensal</span>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(card.limit_amount || 0)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div className={`h-full opacity-60 ${card.color || 'bg-slate-900'} w-0 group-hover:w-[75%] transition-all duration-1000`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setIsNewCardModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 hover:border-blue-400 transition-all group min-h-[300px]">
              <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-blue-600 group-hover:scale-110 shadow-sm transition-all"><Plus size={32} /></div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Vincular Novo Cartão</p>
            </button>
          </div>
        )}
      </div>

      <NewCardModal isOpen={isNewCardModalOpen} onClose={() => { setIsNewCardModalOpen(false); fetchCards(); }} user={user} />
    </div>
  );
};

export default Cards;
