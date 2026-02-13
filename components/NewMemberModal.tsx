
import React, { useState } from 'react';
import { X, User, Upload, ChevronDown, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'Funcionário',
    email: '',
    phone: '',
    document_type: 'CPF',
    document_number: '',
    cost_center: 'Operacional',
    salary_value: '0',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return alert('Nome e Cargo são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('team_members').insert([{
        name: formData.name,
        role: formData.role,
        type: formData.type,
        email: formData.email,
        phone: formData.phone,
        document_number: formData.document_number,
        cost_center: formData.cost_center,
        salary_value: parseFloat(formData.salary_value.replace(',', '.')) || 0,
        status: isActive ? 'Ativo' : 'Inativo',
        observations: formData.observations
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar membro.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-10 border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Colaborador</h2>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 mb-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
              <User size={40} className="text-slate-300" />
            </div>
            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
              Vincular Avatar
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Roberto Carlos" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo *</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Analista" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Custo Mensal (Ref)</label>
                <input type="text" value={formData.salary_value} onChange={e => setFormData({...formData, salary_value: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
              <select value={formData.cost_center} onChange={e => setFormData({...formData, cost_center: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none">
                <option>Operacional</option>
                <option>Comercial</option>
                <option>Marketing</option>
                <option>Diretoria</option>
              </select>
            </div>

            <div className="flex items-center gap-3 py-2">
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full relative transition-all duration-200 ${isActive ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'left-[22px]' : 'left-1'}`} />
              </button>
              <span className="text-[13px] font-bold text-slate-700">Membro Ativo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar no Banco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMemberModal;
