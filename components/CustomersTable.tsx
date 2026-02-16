
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomersTable: React.FC = () => {
  const headers = ['CLIENTE', 'FATURADO', 'RECEBIDO', 'EM ABERTO', 'STATUS'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[500px] shadow-sm group hover:shadow-md transition-all overflow-hidden">
      <div className="p-8 pb-6">
        <h3 className="text-slate-900 font-bold text-base tracking-tight">Clientes</h3>
        <p className="text-[11px] text-slate-400 font-medium">Visão geral por cliente</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-5 px-8 py-3 border-y border-slate-100 bg-slate-50/20">
          {headers.map((header) => (
            <span key={header} className={`text-[9px] font-black text-slate-400 tracking-[0.15em] ${header === 'EM ABERTO' || header === 'STATUS' ? 'text-right' : ''} ${header === 'FATURADO' || header === 'RECEBIDO' ? 'text-center' : ''}`}>
              {header}
            </span>
          ))}
        </div>
        
        <div className="flex-1 flex items-center justify-center text-center p-8 bg-slate-50/10">
          <span className="text-[13px] font-medium text-slate-300 opacity-60">Nenhum cliente encontrado</span>
        </div>
      </div>

      <div className="p-6 border-t border-slate-50 bg-white">
        <button className="flex items-center gap-2 text-blue-600 text-[11px] font-black uppercase tracking-widest hover:gap-3 transition-all">
          Ver todos os clientes <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
