
import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Lead</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Nome *</label>
            <input 
              type="text" 
              placeholder="Nome do contato"
              className="w-full bg-[#f8fafc] border-2 border-blue-600 rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none text-gray-700 transition-all placeholder:text-gray-400 font-medium shadow-sm shadow-blue-500/10"
              autoFocus
            />
          </div>

          {/* Empresa */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Empresa</label>
            <input 
              type="text" 
              placeholder="Nome da empresa"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Website</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com.br"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Email & Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Email</label>
              <input 
                type="email" 
                placeholder="email@exemplo.com"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Telefone</label>
              <input 
                type="text" 
                placeholder="(11) 99999-9999"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all"
              />
            </div>
          </div>

          {/* Origem & Valor Estimado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Origem</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer">
                  <option>Selecione a origem</option>
                  <option>Indicação</option>
                  <option>Inbound</option>
                  <option>Outbound</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Valor Estimado (R$)</label>
              <input 
                type="text" 
                placeholder="0"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all"
              />
            </div>
          </div>

          {/* Fase */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Fase</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer">
                <option>Lead</option>
                <option>Qualificação</option>
                <option>Proposta</option>
                <option>Fechamento</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Responsável & Squad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Responsável</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer">
                  <option>Selecione</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Squad</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer">
                  <option>Selecione</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Observações</label>
            <textarea 
              rows={4}
              placeholder="Informações adicionais sobre o lead..."
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3 bg-white border border-[#e2e8f0] rounded-[12px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-9 py-3 bg-[#1d4ed8] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLeadModal;
