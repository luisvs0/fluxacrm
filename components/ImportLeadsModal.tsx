
import React, { useState } from 'react';
import { X, Upload, FileText, ChevronDown, Download, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[90vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Upload size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Importação em Massa</h2>
              <p className="text-xs text-slate-400 font-medium">Sincronize sua base de leads rapidamente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Selecione um arquivo <span className="text-slate-900 font-bold">CSV ou Excel</span> para importar seus leads. Seus leads entrarão automaticamente na fase inicial do pipeline.
          </p>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-blue-100 bg-blue-50/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-blue-50/40 transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">Arraste seu arquivo aqui</p>
              <p className="text-xs text-slate-400 font-medium">XLSX, CSV ou Google Sheets Export</p>
            </div>
            <input type="file" className="hidden" />
          </div>

          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors mx-auto">
            <Download size={14} />
            Baixar Template Estruturado
          </button>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Origem dos Dados *</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>Planilha Externa</option>
                  <option>Google Maps Export</option>
                  <option>LinkedIn Navigator</option>
                  <option>Mailing Comprado</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Atribuição Inteligente</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>Round Robin (Distribuição igual)</option>
                  <option>Squad Alpha</option>
                  <option>Squad Beta</option>
                  <option>Apenas Reservar (Sem responsável)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
            <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
              O sistema fará a <span className="font-bold">desduplicação</span> automática baseada no e-mail e CNPJ dos leads importados.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-8 pt-4 flex items-center justify-end gap-3 shrink-0">
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
            <CheckCircle2 size={18} />
            Iniciar Importação
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportLeadsModal;
