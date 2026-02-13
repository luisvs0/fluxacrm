
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CreditCard, 
  MoreVertical, 
  Trash2, 
  Loader2, 
  Database, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import NewCardModal from './NewCardModal';
import { supabase } from '../lib/supabase';

const Cards: React.FC = () => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*');
      
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
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCards();
    } catch (err) {
      alert('Erro ao excluir cartão.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500 shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Wallet Sincronizada</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Meus Cartões</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Gestão de limites e meios corporativos.</p>
        </div>
        
        <button 
          onClick={() => setIsNewCardModalOpen(true)} 
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 md:py-2.5 rounded-xl md:rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} />
          Vincular Cartão
        </button>
      </div>

      {isLoading ? (
        <div className="py-32 text-center">
          <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Criptografando conexão...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {cards.map(card => (
            <div key={card.id} className="relative group">
              <div className={`bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden`}>
                {/* Visual Glow de Fundo Sutil */}
                <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] opacity-10 ${card.color || 'bg-slate-900'}`}></div>

                <div className="flex justify-between items-start mb-8 md:mb-10 relative z-10">
                  <div className={`w-12 h-9 md:w-14 md:h-10 ${card.color || 'bg-slate-900'} rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform`}>
                    <div className="absolute top-2 left-2 w-3 h-2 bg-yellow-400/40 rounded-sm"></div>
                    <CreditCard size={20} className="md:size-6" />
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)}
                      className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl"
                    >
                      <MoreVertical size={20}/>
                    </button>

                    {menuOpenId === card.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => deleteCard(card.id)}
                          className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 rounded-2xl transition-colors"
                        >
                          <Trash2 size={14} /> Excluir Cartão
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-6 relative z-10">
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">{card.name}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-mono tracking-[0.25em] mt-1 italic">
                      •••• •••• •••• {card.last_digits || '0000'}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Limite Mensal</span>
                      <span className="text-base md:text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(card.limit_amount || 0)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full opacity-60 ${card.color || 'bg-slate-900'} w-0 group-hover:w-[65%] transition-all duration-1000`}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 md:pt-2">
                    <span className={`text-[8px] md:text-[9px] font-black px-2.5 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                      card.type === 'Empresa' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'
                    }`}>
                      {card.type}
                    </span>
                    <span className="text-[8px] md:text-[9px] font-black bg-emerald-50 text-emerald-600 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                      {card.status || 'Ativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Botão de Adição Estilizado */}
          <button 
            onClick={() => setIsNewCardModalOpen(true)} 
            className="border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 md:gap-5 hover:bg-slate-50 hover:border-blue-100 transition-all group min-h-[250px] md:min-h-[320px] bg-white/50"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white border border-slate-100 rounded-[1.25rem] md:rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 shadow-sm transition-all group-hover:scale-110">
              <Plus size={28} className="md:size-32" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Vincular Novo Cartão</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Adicione um novo meio corporativo</p>
            </div>
          </button>
        </div>
      )}

      {/* Dica de Segurança */}
      {!isLoading && cards.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-blue-50/50 border border-blue-100/50 p-6 rounded-[2rem] max-w-2xl">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Segurança de Dados PCI-DSS</p>
            <p className="text-[11px] text-blue-700/70 font-medium leading-relaxed">Armazenamos apenas os últimos 4 dígitos. Todos os dados são criptografados em repouso no Supabase Vault.</p>
          </div>
        </div>
      )}

      <NewCardModal 
        isOpen={isNewCardModalOpen} 
        onClose={() => { 
          setIsNewCardModalOpen(false); 
          fetchCards(); 
        }} 
      />
    </div>
  );
};

export default Cards;
