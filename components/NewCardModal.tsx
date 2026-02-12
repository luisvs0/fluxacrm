
import React, { useState } from 'react';
import { X, ChevronDown, Building2, CreditCard, Info, Plus } from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vincular Novo Cartão</h2>
              <p className="text-xs text-slate-400 font-medium">Configure um novo meio de pagamento</p>
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
          {/* Nome do cartão */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Cartão</label>
            <input 
              type="text" 
              placeholder="Ex: Visa Corporate Gold, Nubank Empresa..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Uso</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>Cartão Empresa</option>
                  <option>Cartão Pessoal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Final do Cartão */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Últimos 4 dígitos</label>
              <input 
                type="text" 
                placeholder="0000"
                maxLength={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
            <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Cartão empresa <span className="font-bold">impacta</span> o financeiro. Gastos entram no fluxo de caixa, dashboards e centros de custo.
            </p>
          </div>

          {/* Toggle Ativo */}
          <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
            <div>
              <p className="text-sm font-semibold text-slate-900">Cartão Ativo</p>
              <p className="text-[11px] text-slate-400 font-medium">Habilitar para novos lançamentos</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
            </button>
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
              Criar Cartão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCardModal;
