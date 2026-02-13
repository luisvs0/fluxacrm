
import React, { useState } from 'react';
import { X, Package, Users, Clock, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Recorrente',
    status: 'Ativo',
    description: '',
    sla_days: '5',
    responsible_unit: 'Marketing'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do produto é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        sla_days: parseInt(formData.sla_days),
        responsible_unit: formData.responsible_unit
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-10 border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Produto</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Produto *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Gestão de Tráfego Paid" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none">
                <option>Recorrente</option>
                <option>Único</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">SLA (Dias)</label>
              <input type="number" value={formData.sla_days} onChange={e => setFormData({...formData, sla_days: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Setor Responsável</label>
            <select value={formData.responsible_unit} onChange={e => setFormData({...formData, responsible_unit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none">
              <option>Marketing</option>
              <option>Financeiro</option>
              <option>Comercial</option>
              <option>Operacional</option>
              <option>CS</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="O que está incluso neste serviço?" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-3.5 px-5 text-sm font-medium resize-none" />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;
