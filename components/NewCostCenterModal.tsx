
import React from 'react';
import { X, TrendingUp, Info, Plus, Target, ChevronDown } from 'lucide-react';

interface NewCostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCostCenterModal: React.FC<NewCostCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Centro de Custo</h2>
              <p className="text-xs text-slate-400 font-medium">Categorize suas despesas por departamento</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 pt-4 space-y-6">
          {/* Nome do Centro */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Centro</label>
            <input 
              type="text" 
              placeholder="Ex: Marketing Digital, Infraestrutura, RH..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Código (Opcional)</label>
              <input 
                type="text" 
                placeholder="0001"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
            
            {/* Budget */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teto Mensal (R$)</label>
              <input 
                type="text" 
                placeholder="0,00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>

          {/* Categoria Superior */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Agrupamento Pai</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                <option>Nenhum (Centro Raiz)</option>
                <option>Operacional</option>
                <option>Marketing</option>
                <option>Infraestrutura</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Centros de custo permitem que você acompanhe a rentabilidade de cada área da empresa de forma isolada no DRE.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Criar Centro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCostCenterModal;
