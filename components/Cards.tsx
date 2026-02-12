
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  CreditCard, 
  User, 
  DollarSign, 
  AlertCircle,
  Building2,
  MoreVertical,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import NewCardModal from './NewCardModal';

const Cards: React.FC = () => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');

  const mockCards = [
    { id: 1, name: 'Visa Corporate', last4: '4412', type: 'Empresa', limit: 'R$ 50.000', used: 'R$ 12.400', status: 'Ativo', color: 'bg-slate-900' },
    { id: 2, name: 'Nubank Platinum', last4: '8821', type: 'Pessoal', limit: 'R$ 15.000', used: 'R$ 2.100', status: 'Ativo', color: 'bg-purple-700' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Cartões</h2>
          <p className="text-slate-500 font-medium mt-1">Gestão centralizada de meios de pagamento corporativos e pessoais.</p>
        </div>
        
        <button 
          onClick={() => setIsNewCardModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Cartão
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Cartões Ativos</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">04</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">2 empresa / 2 pessoal</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gasto Mensal (Corp)</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 14.580,00</h3>
          <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={14} /> +8% vs mês ant.
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Limite Disponível</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 82.000,00</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1">Margem segura</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Próximo Vencimento</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">15 Fev</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Fatura Visa Corporate</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-[1.25rem]">
          {['Todos', 'Empresa', 'Pessoal'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-[1rem] text-xs font-bold transition-all ${selectedTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Calendar size={18}/></button>
        </div>
      </div>

      {/* Cards Visualization Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockCards.map(card => (
          <div key={card.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-10 ${card.color} rounded-lg flex items-center justify-center text-white/20 overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <CreditCard size={24} className="relative z-10 text-white" />
              </div>
              <button className="text-slate-300 hover:text-slate-900"><MoreVertical size={20}/></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">{card.name}</h4>
                <p className="text-xs text-slate-400 font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Uso do Limite</span>
                  <span className="text-slate-900">{card.used} / {card.limit}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${card.type === 'Empresa' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {card.type}
                </span>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">
                  {card.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Add Card Placeholder */}
        <button 
          onClick={() => setIsNewCardModalOpen(true)}
          className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-all group min-h-[320px]"
        >
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all shadow-sm">
            <Plus size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Vincular Novo Cartão</p>
            <p className="text-xs text-slate-400 font-medium">Adicione cartões para conciliação automática</p>
          </div>
        </button>
      </div>

      <NewCardModal isOpen={isNewCardModalOpen} onClose={() => setIsNewCardModalOpen(false)} />
    </div>
  );
};

export default Cards;
