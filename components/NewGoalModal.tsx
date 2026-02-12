
import React from 'react';
import { X, ChevronDown, Calendar } from 'lucide-react';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[460px] max-h-[95vh] overflow-y-auto rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Nova Meta</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5">
          {/* Nome da Meta */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Nome da Meta</label>
            <input 
              type="text" 
              placeholder="Ex: Meta de leads Q1"
              className="w-full bg-[#f8fafc] border-2 border-blue-600 rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none text-gray-700 transition-all placeholder:text-gray-400 font-medium shadow-sm shadow-blue-500/10"
              autoFocus
            />
          </div>

          {/* Tipo e Período */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Tipo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Empresa</option>
                  <option>Individual</option>
                  <option>Squad</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Período</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Métrica */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Métrica</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                <option>Leads Criados</option>
                <option>Reuniões Marcadas</option>
                <option>Propostas Enviadas</option>
                <option>Vendas Concluídas</option>
                <option>Valor em Vendas (R$)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Valor da Meta e Alerta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Valor da Meta</label>
              <input 
                type="number" 
                defaultValue="0"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Alerta (%)</label>
              <input 
                type="number" 
                defaultValue="80"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Data de Início e Término */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Data de Início</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="12/02/2026"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e293b]" size={16} />
            </div>
            <p className="text-[13px] text-gray-400 font-medium ml-1">Término: 09/03/2026</p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Descrição (opcional)</label>
            <textarea 
              rows={4}
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none shadow-sm"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 bg-white border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-10 py-3 bg-[#1d4ed8] text-white rounded-[14px] text-[14px] font-bold hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGoalModal;
