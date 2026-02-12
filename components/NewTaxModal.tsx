
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

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
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[460px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[19px] font-bold text-[#1e293b]">Novo Tributo</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-gray-700">Nome</label>
            <input 
              type="text" 
              placeholder="Ex: ISS, PIS/COFINS, IOF"
              className="w-full bg-[#f8fafc] border-2 border-blue-600 rounded-[14px] py-3 px-4 text-[14px] focus:outline-none text-gray-700 transition-all placeholder:text-gray-400 font-medium shadow-sm shadow-blue-500/10"
              autoFocus
            />
          </div>

          {/* Tipo e Base de Cálculo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-gray-700">Tipo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Federal</option>
                  <option>Estadual</option>
                  <option>Municipal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-gray-700">Base de Cálculo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Faturamento</option>
                  <option>Lucro Bruto</option>
                  <option>Valor Fixo</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Taxa e Dia de Vencimento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-gray-700">Taxa (%)</label>
              <input 
                type="text" 
                placeholder="Ex: 5.00"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-gray-700">Dia de Vencimento</label>
              <input 
                type="text" 
                placeholder="15"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-gray-700">Recorrência</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                <option>Mensal</option>
                <option>Trimestral</option>
                <option>Anual</option>
                <option>Eventual</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Ativo Status Box */}
          <div className="bg-white border border-[#e2e8f0] rounded-[18px] p-5 flex items-center justify-between group transition-colors hover:border-blue-200">
            <div className="space-y-1 pr-4">
              <p className="text-[15px] font-bold text-gray-800 tracking-tight">Ativo</p>
              <p className="text-[12.5px] text-gray-400 font-medium leading-tight">
                Tributos inativos não geram lançamentos automáticos
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 ${isActive ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-9 py-3.5 bg-[#1d4ed8] text-white rounded-[16px] text-[14px] font-bold hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaxModal;
