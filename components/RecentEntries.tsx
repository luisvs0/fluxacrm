
import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ArrowUpRight, ArrowDownLeft, Database } from 'lucide-react';

const RecentEntries: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Entradas', 'Saídas', 'Pendentes'];

  const dummyData = []; // Vazio conforme solicitado

  return (
    <div className="bg-white flex flex-col h-[500px] overflow-hidden transition-all duration-500">
      <div className="p-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-[#203267] rounded-lg border border-slate-300"><Database size={18}/></div>
          <div>
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">Movimentações</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-80">Registro de Transações</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-300">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-tight transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#203267] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
        {dummyData.length === 0 ? (
          <div className="space-y-4 opacity-20">
             <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto border border-slate-300 shadow-sm">
                <Database size={32} className="text-slate-400" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Base de Dados Vazia</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase">Aguardando novos lançamentos</p>
             </div>
          </div>
        ) : (
          <div className="w-full divide-y divide-slate-200">
             {/* Conteúdo dinâmico aqui */}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-300 bg-slate-50/50">
        <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-3.5 rounded-lg text-[#203267] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-sm active:scale-[0.99]">
          Ver Ledger Completo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
