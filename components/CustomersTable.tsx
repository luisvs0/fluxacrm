
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomersTable: React.FC = () => {
  const headers = ['CLIENTE', 'FATURADO', 'RECEBIDO', 'EM ABERTO', 'STATUS'];

  return (
    <div className="bg-white flex flex-col h-[500px] hover:shadow-md transition-all overflow-hidden">
      <div className="p-8 pb-4">
        <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">Ativos em Carteira</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Análise de Portfólio</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-5 px-8 py-4 border-y border-slate-300 bg-slate-50/50">
          {headers.map((header) => (
            <span key={header} className={`text-[8px] font-black text-slate-500 tracking-[0.15em] ${header === 'EM ABERTO' || header === 'STATUS' ? 'text-right' : ''} ${header === 'FATURADO' || header === 'RECEBIDO' ? 'text-center' : ''}`}>
              {header}
            </span>
          ))}
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-30 bg-slate-50/20">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 border border-slate-300 shadow-sm">
             <ArrowRight size={20} className="text-slate-300" />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nenhum registro consolidado</span>
        </div>
      </div>

      <div className="p-6 border-t border-slate-300 bg-slate-50/50">
        <button className="flex items-center gap-2 text-[#203267] text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">
          Painel de Relacionamento <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
