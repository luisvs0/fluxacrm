
import React, { useState } from 'react';
import { X, ChevronDown, Receipt, Info, Plus } from 'lucide-react';

interface NewTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTaxModal: React.FC<NewTaxModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);

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
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Tributo</h2>
              <p className="text-xs text-slate-400 font-medium">Registre uma nova obrigação fiscal</p>
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
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Tributo</label>
            <input 
              type="text" 
              placeholder="Ex: ISS, PIS/COFINS, Simples Nacional..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Esfera</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                  <option>Federal</option>
                  <option>Estadual</option>
                  <option>Municipal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Base */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Base de Cálculo</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                  <option>Faturamento</option>
                  <option>Lucro Bruto</option>
                  <option>Valor Fixo</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Taxa */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alíquota (%)</label>
              <input 
                type="text" 
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all font-bold"
              />
            </div>
            
            {/* Dia */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dia de Vencimento</label>
              <input 
                type="text" 
                placeholder="15"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex gap-4">
            <Info size={18} className="text-rose-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-rose-700 font-semibold leading-relaxed">
              O sistema gera automaticamente o lançamento no fluxo de caixa baseado nas regras fiscais cadastradas.
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
              className="flex-1 py-4 bg-rose-500 text-white rounded-full text-xs font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Criar Tributo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaxModal;
