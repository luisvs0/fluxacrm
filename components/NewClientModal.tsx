
import React, { useState } from 'react';
import { X, Upload, Building2, FileText, ChevronDown, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    segment: 'SaaS',
    document_type: 'CNPJ',
    document_number: '',
    status: 'Ativo',
    status_nf: 'OK',
    mrr_value: '',
    health_score: '100',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do cliente é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('customers').insert([{
        name: formData.name,
        segment: formData.segment,
        document_type: formData.document_type,
        document_number: formData.document_number,
        status: formData.status,
        status_nf: formData.status_nf,
        mrr_value: parseFloat(formData.mrr_value.replace(',', '.')) || 0,
        health_score: parseInt(formData.health_score),
        observations: formData.observations
      }]);

      if (error) throw error;
      
      setFormData({
        name: '',
        segment: 'SaaS',
        document_type: 'CNPJ',
        document_number: '',
        status: 'Ativo',
        status_nf: 'OK',
        mrr_value: '',
        health_score: '100',
        observations: ''
      });
      onClose();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao cadastrar cliente no banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar p-10 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 sticky top-0 bg-white z-10 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Cliente</h2>
              <p className="text-xs text-slate-400 font-medium">Registro direto no PostgreSQL Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 flex-1">
          {/* Section: Identidade Visual */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-xl font-black text-slate-300 border border-slate-100 shadow-inner">
                {formData.name ? formData.name.substring(0, 1).toUpperCase() : '?'}
              </div>
              <div className="space-y-2">
                <button type="button" className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <Upload size={16} className="text-slate-400" />
                  Enviar logo
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PNG, JPG ou WebP. Máx 5MB.</p>
              </div>
            </div>

            <div className="h-px bg-slate-50 w-full" />

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Razão Social / Nome Fantasia *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Sirius Tecnologia LTDA"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Segmento</label>
                  <div className="relative">
                    <select 
                      value={formData.segment}
                      onChange={e => setFormData({...formData, segment: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      <option>SaaS</option>
                      <option>Varejo</option>
                      <option>Indústria</option>
                      <option>Serviços</option>
                      <option>Educação</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">MRR (R$)</label>
                  <input 
                    type="text" 
                    value={formData.mrr_value}
                    onChange={e => setFormData({...formData, mrr_value: e.target.value})}
                    placeholder="0,00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo Doc.</label>
                  <div className="relative">
                    <select 
                      value={formData.document_type}
                      onChange={e => setFormData({...formData, document_type: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-semibold text-slate-700 appearance-none focus:outline-none"
                    >
                      <option>CNPJ</option>
                      <option>CPF</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="col-span-8 space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Número do Documento</label>
                  <input 
                    type="text" 
                    value={formData.document_number}
                    onChange={e => setFormData({...formData, document_number: e.target.value})}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status Base</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none"
                    >
                      <option>Ativo</option>
                      <option>Inativo</option>
                      <option>Aguardando</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Health Score (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={formData.health_score}
                    onChange={e => setFormData({...formData, health_score: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notas Internas</label>
            <textarea 
              rows={3}
              value={formData.observations}
              onChange={e => setFormData({...formData, observations: e.target.value})}
              placeholder="Dores do cliente, metas de sucesso, etc..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-4 px-5 text-sm font-medium text-slate-700 transition-all resize-none outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t border-slate-50">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar no Banco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
