
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
  Wallet,
  Sparkles,
  Info
} from 'lucide-react';
import NewCardModal from './NewCardModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface CardsProps {
  user: any;
}

const Cards: React.FC<CardsProps> = ({ user }) => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Section */}
      <div className="relative z-10 px-4 md:px-10 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white border border-slate-700 shadow-lg">
                <CreditCard size={16} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#203267]/60">Secure Wallet SQL</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de <span className="text-[#203267] not-italic">Cartões</span></h1>
          <p className="text-[13px] text-slate-400 font-medium mt-1">Controle de limites corporativos e integração de despesas</p>
        </div>
        <button 
          onClick={() => setIsNewCardModalOpen(true)} 
          className="w-full md:w-auto bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Vincular Cartão
        </button>
      </div>

      {/* Summary Stats Premium */}
      <div className="relative z-10 px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Cards Empresa" 
          value={companyCardsCount.toString()} 
          subtitle="Ativos em Produção" 
          icon={<Building2 />} 
          color="blue" 
        />
        <StatCard 
          title="Cards Pessoais" 
          value={personalCardsCount.toString()} 
          subtitle="Vinculados à Conta" 
          icon={<User />} 
          color="emerald" 
        />
        <StatCard 
          title="Limite Corporativo" 
          value={formatCurrency(0)} 
          subtitle="Teto Total Somado" 
          icon={<DollarSign />} 
          color="blue" 
        />
        <StatCard 
          title="Status Wallet" 
          value="Seguro" 
          subtitle="AES-256 Encrypted" 
          icon={<Sparkles />} 
          color="emerald" 
        />
      </div>

      {/* Pill Filter Bar */}
      <div className="relative z-10 px-4 md:px-10 mb-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 pl-2">
            <div className="flex items-center gap-2 mr-4">
              <Calendar size={16} className="text-[#203267]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Filtragem SQL:</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               {['Todos', 'Empresa', 'Pessoal'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setFilters({...filters, type: p})}
                  className={`px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all duration-300 whitespace-nowrap ${filters.type === p ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pr-4 text-[10px] font-black text-[#203267] uppercase tracking-[0.1em]">
             <span className="flex items-center gap-1.5 opacity-40"><Database size={12}/> Secure Ledger</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Cards Listing Section Premium */}
      <div className="relative z-10 px-4 md:px-10">
        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 ml-2 italic">Ativos Vinculados</h4>
        {isLoading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Wallet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {cards.map(card => (
              <div key={card.id} className="relative group">
                <div className={`bg-white border border-slate-300 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden relative border-l-[10px] ${card.type?.includes('Empresa') ? 'border-[#203267]' : 'border-emerald-500'}`}>
                  
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div className={`w-14 h-10 ${card.color || 'bg-slate-900'} rounded-lg flex items-center justify-center text-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform`}>
                      <div className="absolute top-1.5 left-1.5 w-3 h-2 bg-yellow-400/30 rounded-sm"></div>
                      <CreditCard size={22} />
                    </div>
                    <div className="relative">
                      <button onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)} className="p-2 text-slate-300 hover:text-slate-900 transition-all bg-slate-50 border border-slate-200 rounded-lg">
                        <MoreVertical size={18}/>
                      </button>
                      {menuOpenId === card.id && (
                        <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-300 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={() => deleteCard(card.id)} className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex items-center gap-3 rounded-xl transition-colors">
                            <Trash2 size={16} /> Excluir Ativo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase group-hover:text-[#203267] transition-colors">{card.name}</h4>
                      <p className="text-[12px] text-slate-400 font-mono tracking-[0.3em] mt-2 italic">•••• •••• •••• {card.last_digits || '0000'}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teto Orçamentário</span>
                           <span className="text-2xl font-black text-slate-950 tracking-tighter">{formatCurrency(card.limit_amount || 0)}</span>
                        </div>
                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 uppercase shadow-sm">Auditado</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div className={`h-full opacity-80 rounded-full transition-all duration-[2000ms] ${card.color || 'bg-slate-900'} w-0 group-hover:w-[65%] shadow-sm`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:scale-125">
                     <CreditCard size={200} />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsNewCardModalOpen(true)} 
              className="group border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center gap-6 hover:bg-white hover:border-[#203267] hover:shadow-xl transition-all duration-700 min-h-[350px]"
            >
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-[#203267] group-hover:scale-110 shadow-sm transition-all">
                <Plus size={32} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-[#203267] transition-colors">Vincular Cartão</p>
                <p className="text-[10px] text-slate-300 font-medium uppercase mt-1">Expandir disponibilidade de crédito</p>
              </div>
            </button>
          </div>
        )}
      </div>

      <NewCardModal isOpen={isNewCardModalOpen} onClose={() => { setIsNewCardModalOpen(false); fetchCards(); }} user={user} />
    </div>
  );
};

export default Cards;
