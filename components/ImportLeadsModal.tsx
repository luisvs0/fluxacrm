
import React, { useState } from 'react';
import { X, Upload, FileText, ChevronDown, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Importar Leads</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            Selecione um arquivo CSV ou Excel para importar seus leads em massa para o pipeline.
          </p>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-blue-100 bg-blue-50/20 rounded-[18px] p-10 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-blue-50/40 transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#1e293b]">Arraste seu arquivo aqui</p>
              <p className="text-xs text-gray-400 font-medium">ou clique para procurar no computador</p>
            </div>
            <input type="file" className="hidden" />
          </div>

          {/* Download Template Link */}
          <button className="flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors">
            <Download size={16} />
            Baixar modelo de planilha
          </button>

          {/* Configurations */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Origem dos Leads *</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer">
                  <option>Selecione a origem</option>
                  <option>Planilha Externa</option>
                  <option>Google Maps</option>
                  <option>LinkedIn</option>
                  <option>Outros</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Atribuir ao Squad</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer">
                  <option>Nenhum (Livre)</option>
                  <option>Squad Alpha</option>
                  <option>Squad Beta</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Help Info */}
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <AlertCircle size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-[12px] text-gray-500 leading-tight">
              Os leads serão importados para a fase inicial do seu pipeline por padrão.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3.5 bg-white border border-[#e2e8f0] rounded-[12px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-9 py-3.5 bg-[#1d4ed8] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLeadsModal;
