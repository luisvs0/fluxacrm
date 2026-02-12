
import React from 'react';
import { X, ChevronDown, UserPlus, Info, Building2, Mail, Phone, DollarSign } from 'lucide-react';

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Capturar Novo Lead</h2>
              <p className="text-xs text-slate-400 font-medium">Inicie um novo ciclo de venda no pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 pt-4 space-y-8">
          {/* Nome e Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Contato *</label>
              <input 
                type="text" 
                placeholder="Ex: João Silva"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Empresa</label>
              <input 
                type="text" 
                placeholder="Razão Social / Fantasia"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="joao@empresa.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Telefone</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>

          {/* Valor e Origem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Estimado (R$)</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0,00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Origem do Lead</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>Inbound (Site/Ads)</option>
                  <option>Outbound (Prospecção)</option>
                  <option>Indicação</option>
                  <option>Eventos</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Atribuição */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Atribuir ao Consultor / Squad</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                <option>Selecione um responsável</option>
                <option>Gabriel Dantras (Alpha)</option>
                <option>Luis Venx (Beta)</option>
                <option>Kyros (Financial Ops)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Leads recém-criados entram automaticamente na fase de <span className="font-bold">Prospecção</span>. Ative lembretes para follow-up após a criação.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-4 pb-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Confirmar Entrada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLeadModal;
