
import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users,
  Target,
  Plus,
  ChevronDown,
  Maximize2,
  Edit2,
  Wallet,
  Receipt,
  RefreshCcw,
  CircleDashed
} from 'lucide-react';
import ChartCard from './ChartCard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 animate-in fade-in duration-700 pb-20 px-8 pt-6">
      
      {/* Top Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Indicadores Principais</span>
      </div>

      {/* Row 1: 4 Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Entradas', val: 'R$ 0,00', sub: '0 transações', icon: <ArrowDownLeft size={14} />, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Saídas', val: 'R$ 0,00', sub: '0 transações', icon: <ArrowUpRight size={14} />, color: 'text-rose-500 bg-rose-50' },
          { label: 'Lucro Líquido', val: 'R$ 0,00', sub: '% do LL — ?', icon: <TrendingUp size={14} />, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Ticket Médio', val: 'R$ 0,00', sub: '0 clientes ativos', icon: <Users size={14} />, color: 'text-blue-500 bg-blue-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.color}`}>{item.icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{item.val}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: 4 Detail Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Meta Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative group min-h-[220px]">
           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-slate-300 hover:text-slate-600"><Edit2 size={14}/></button>
              <button className="p-1.5 text-slate-300 hover:text-slate-600"><Maximize2 size={14}/></button>
           </div>
           <div className="w-20 h-20 rounded-full border-4 border-slate-50 flex items-center justify-center text-slate-200 mb-4">
              <CircleDashed size={40} strokeWidth={1} className="animate-[spin_10s_linear_infinite]" />
           </div>
           <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-tighter">Meta não definida</p>
           <button className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
             <Target size={12} /> Definir Meta
           </button>
        </div>

        {/* A Receber */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col min-h-[220px]">
           <div className="flex items-center gap-2 mb-4">
              <Wallet size={16} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">A Receber</span>
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tighter">R$ 0,00</h3>
           <p className="text-[10px] text-slate-400 font-bold mb-6">Total em aberto (atual + futuro)</p>
           
           <div className="space-y-4 flex-1">
             <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-300">Recebido</span>
                <span className="text-slate-300">Em aberto</span>
             </div>
             <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-blue-500"></div>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1"><Receipt size={10}/> Pendências</p>
                   <p className="text-sm font-black text-slate-900">0</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1"><Users size={10}/> Clientes</p>
                   <p className="text-sm font-black text-slate-900">0</p>
                </div>
             </div>
           </div>
        </div>

        {/* Contas a Pagar */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col min-h-[220px]">
           <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-3 bg-rose-400 rounded-sm"></div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contas a Pagar</span>
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tighter">R$ 0,00</h3>
           <p className="text-[10px] text-slate-400 font-bold mb-4">0 contas pendentes</p>
           <div className="h-px bg-slate-50 w-full mt-2"></div>
        </div>

        {/* MRR */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col min-h-[220px] relative">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCcw size={16} className="text-blue-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">MRR</span>
              </div>
              <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">0 contratos</span>
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tighter">R$ 0,00</h3>
           <p className="text-[10px] text-slate-400 font-bold mb-10">Garantido mensalmente • <span className="text-blue-500 cursor-pointer">Clique para detalhes</span></p>
           
           <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed px-4">Nenhum contrato recorrente ativo</p>
           </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
          <h4 className="text-sm font-bold text-slate-800 mb-10 tracking-tight">Entradas x Saídas</h4>
          <div className="flex-1 flex flex-col relative border-l border-b border-slate-50 ml-8 mb-8">
             {/* Simple Line Mock */}
             <svg className="w-full h-full text-rose-500 overflow-visible">
                <circle cx="10%" cy="95%" r="3" fill="currentColor" />
                <circle cx="20%" cy="95%" r="3" fill="currentColor" />
                <circle cx="95%" cy="95%" r="3" fill="currentColor" />
                <line x1="10%" y1="95%" x2="95%" y2="95%" stroke="currentColor" strokeWidth="2" />
             </svg>
             <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-300">
                <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
             </div>
             <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-slate-300">
                <span>R$ 4</span><span>R$ 3</span><span>R$ 2</span><span>R$ 1</span><span>R$ 0</span>
             </div>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Entradas</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Saídas</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
          <h4 className="text-sm font-bold text-slate-800 mb-10 tracking-tight">Lucro Líquido por Período</h4>
          <div className="flex-1 flex flex-col relative border-l border-b border-slate-50 ml-8 mb-8">
             <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-300">
                <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
             </div>
             <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-slate-300">
                <span>R$ 4</span><span>R$ 3</span><span>R$ 2</span><span>R$ 1</span><span>R$ 0</span>
             </div>
          </div>
        </div>
      </div>

      {/* Row 4: Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[350px]">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">Lançamentos Recentes</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Últimas movimentações financeiras</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-lg">
                 {['Todos', 'Entradas', 'Saídas', 'Pendentes'].map(t => (
                   <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${activeTab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
           </div>
           <div className="flex-1 flex items-center justify-center">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Nenhum lançamento encontrado</p>
           </div>
           <div className="p-4 border-t border-slate-50">
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">Ver todos os lançamentos <ArrowUpRight size={12}/></button>
           </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[350px]">
           <div className="p-6">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">Clientes</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Visão geral por cliente</p>
           </div>
           <div className="grid grid-cols-5 px-6 py-3 bg-slate-50 border-y border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <span>Cliente</span>
              <span>Faturado</span>
              <span>Recebido</span>
              <span>Em Aberto</span>
              <span>Status</span>
           </div>
           <div className="flex-1 flex items-center justify-center">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Nenhum cliente encontrado</p>
           </div>
           <div className="p-4 border-t border-slate-50">
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">Ver todos os clientes <ArrowUpRight size={12}/></button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
