
import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentEntries: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Entradas', 'Saídas', 'Pendentes'];

  const dummyData = []; // Vazio para mostrar o estado "Nenhum lançamento encontrado" como na imagem

  return (
    <div className="bg-white border border-slate-100 rounded-xl flex flex-col h-[450px] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-slate-900 font-bold text-base tracking-tight">Lançamentos Recentes</h3>
          <p className="text-[11px] text-slate-400 font-medium">Últimas movimentações financeiras</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
        {dummyData.length === 0 ? (
          <p className="text-[12px] font-medium text-slate-400">Nenhum lançamento encontrado</p>
        ) : (
          <div className="w-full divide-y divide-slate-50">
             {/* Conteúdo se houvesse dados */}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-50">
        <button className="flex items-center gap-2 text-blue-600 text-[11px] font-bold hover:gap-3 transition-all">
          Ver todos os lançamentos <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
