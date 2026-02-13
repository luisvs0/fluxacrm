
import React, { useState } from 'react';
import { X, TrendingUp, Info, Plus, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewCostCenterModal: React.FC<NewCostCenterModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', budget: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.budget) return alert('Preencha nome e budget.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('cost_centers').insert([{
        user_id: user.id, // VÍNCULO OBRIGATÓRIO
        name: formData.name,
        code: formData.code,
        budget: parseFloat(formData.budget.replace(',', '.'))
      }]);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar centro de custo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[520px] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-slate-100 flex flex-col">
        <div className="p-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100 flex items-center justify-center shadow-sm">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Novo Centro</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Classificação Orçamentária</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Centro *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Marketing Digital, Operação SP" 
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Código de Referência</label>
              <input 
                type="text" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                placeholder="0001" 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Mensal (R$) *</label>
              <input 
                type="text" 
                value={formData.budget} 
                onChange={e => setFormData({...formData, budget: e.target.value})} 
                placeholder="0,00" 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-black text-blue-600 focus:border-blue-500 outline-none transition-all shadow-inner" 
              />
            </div>
          </div>

          <div className="bg-amber-50/50 p-5 rounded-2xl border-2 border-amber-100 flex gap-4">
            <Info size={20} className="text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase">
              Centros de custo permitem o rastreio preciso de onde o capital da sua conta está sendo alocado.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 pb-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Confirmar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCostCenterModal;
