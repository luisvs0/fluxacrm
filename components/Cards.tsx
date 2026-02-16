
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
  ShieldCheck
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
    status: 'Todos'
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
    if (!confirm('Confirmar desvinculação deste ativo da conta?')) return;
    try {
      const { error } = await supabase.from('cards').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      fetchCards();
    } catch (err) {
      alert('Erro ao excluir.');
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-8 pt-8">
      
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <ShieldCheck size={14} className="text-blue-600" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Asset Management Node</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Minha <span className="text-blue-600 not-italic">Wallet</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Gestão centralizada de meios de pagamento corporativos</p>
        </div>
        <button 
          onClick={() => setIsNewCardModalOpen(true)} 
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Vincular Ativo
        </button>
      </div>

      {/* KPI Row (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Cartões Empresa" value={companyCardsCount.toString()} subtitle="Ativos na conta" icon={<Building2 />} color="blue" />
        <StatCard title="Cartões Sócio" value={personalCardsCount.toString()} subtitle="Isolamento de gasto" icon={<User />} color="emerald" />
        <StatCard title="Gasto Consolidado" value="R$ 0,00" subtitle="Ciclo Atual" icon={<DollarSign />} color="blue" />
        <StatCard title="Limites Disponíveis" value="R$ 0,00" subtitle="Margem de Crédito" icon={<Wallet />} color="blue" />
      </div>

      {/* Toolbar Executiva */}
      <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col sm:flex-row gap-3">
         <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 flex-1">
           {['Todos', 'Empresa', 'Pessoal'].map(t => (
             <button
               key={t}
               onClick={() => setFilters({...filters, type: t})}
               className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                 filters.type === t ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-700'
               }`}
             >
               {t}
             </button>
           ))}
         </div>
         <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 flex-1">
           {['Todos', 'Ativo', 'Inativo'].map(s => (
             <button
               key={s}
               onClick={() => setFilters({...filters, status: s})}
               className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                 filters.status === s ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-700'
               }`}
             >
               {s}
             </button>
           ))}
         </div>
      </div>

      {/* Grid de Cartões Business */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>
        ) : cards.length === 0 ? (
          <div className="col-span-full py-32 bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center opacity-40">
            <CreditCard size={48} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-black uppercase tracking-widest">Nenhum ativo vinculado</p>
          </div>
        ) : (
          cards.map(card => (
            <div key={card.id} className="bg-white border border-slate-200 rounded-xl p-8 transition-all duration-300 group shadow-sm hover:shadow-xl relative overflow-hidden border-t-4 border-t-blue-600">
              <div className="flex justify-between items-start mb-12">
                <div className={`w-14 h-9 ${card.color || 'bg-slate-900'} rounded-lg flex items-center justify-center text-white shadow-inner relative group-hover:scale-110 transition-transform`}>
                   <div className="absolute top-2 left-2 w-3 h-2 bg-yellow-400/40 rounded-sm"></div>
                   <CreditCard size={20} />
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button>
                  {menuOpenId === card.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                      <button onClick={() => deleteCard(card.id)} className="w-full text-left px-5 py-4 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 flex items-center gap-3 rounded-xl transition-all">
                        <Trash2 size={14} /> Excluir Ativo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h4 className="text-base font-black text-slate-900 uppercase italic leading-none">{card.name}</h4>
                    <p className="text-[10px] font-mono font-black text-slate-400 mt-2 tracking-[0.25em]">•••• •••• •••• {card.last_digits || '0000'}</p>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-50 space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Limite Auditado</span>
                       <span className="text-xl font-black text-slate-900 tracking-tighter italic">{formatCurrency(card.limit_amount || 0)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <div className={`h-full bg-blue-600 transition-all duration-[2000ms] w-0 group-hover:w-[65%]`}></div>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
        
        {!isLoading && (
           <button onClick={() => setIsNewCardModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-blue-400 transition-all group min-h-[250px]">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-slate-100">
                <Plus size={24} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600">Novo Meio de Pagamento</span>
           </button>
        )}
      </div>

      <NewCardModal isOpen={isNewCardModalOpen} onClose={() => { setIsNewCardModalOpen(false); fetchCards(); }} user={user} />
    </div>
  );
};

export default Cards;
