
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomersTable: React.FC = () => {
  const headers = ['CLIENTE', 'FATURADO', 'RECEBIDO', 'EM ABERTO', 'STATUS'];

  return (
    <div className="bg-white border border-slate-100 rounded-xl flex flex-col h-[450px] hover:shadow-md transition-all overflow-hidden shadow-sm">
      <div className="p-6 pb-4">
        <h3 className="text-slate-900 font-bold text-base tracking-tight">Clientes</h3>
        <p className="text-[11px] text-slate-400 font-medium">Visão geral por cliente</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-5 px-6 py-3 border-y border-slate-50 bg-slate-50/30">
          {headers.map((header) => (
            <span key={header} className={`text-[9px] font-bold text-slate-400 tracking-widest ${header === 'EM ABERTO' || header === 'STATUS' ? 'text-right' : ''} ${header === 'FATURADO' || header === 'RECEBIDO' ? 'text-center' : ''}`}>
              {header}
            </span>
          ))}
        </div>
        
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <span className="text-[12px] font-medium text-slate-300">Nenhum cliente encontrado</span>
        </div>
      </div>

      <div className="p-6 border-t border-slate-50">
        <button className="flex items-center gap-2 text-blue-600 text-[11px] font-bold hover:gap-3 transition-all">
          Ver todos os clientes <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
