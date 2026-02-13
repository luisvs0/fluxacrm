
import React, { useState } from 'react';
import { X, CreditCard, Plus, Loader2, Info, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    last_digits: '', 
    limit: '', 
    type: 'Cartão Empresa', 
    color: 'bg-slate-900' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.limit) return alert('Preencha nome e limite.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('cards').insert([{
        user_id: user.id, // ISOLAÇÃO
        name: formData.name,
        last_digits: formData.last_digits,
        limit_amount: parseFloat(formData.limit.replace(',', '.')),
        type: formData.type,
        color: formData.color,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cartão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[520px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><CreditCard size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vincular Novo Cartão</h2>
              <p className="text-xs text-slate-400 font-medium">Gestão de limites via SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Cartão *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Visa Platinum Corp" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Últimos Dígitos (4)</label>
                <input 
                  type="text" 
                  maxLength={4} 
                  value={formData.last_digits} 
                  onChange={e => setFormData({...formData, last_digits: e.target.value})} 
                  placeholder="0000" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Limite Disponível (R$) *</label>
                <input 
                  type="text" 
                  value={formData.limit} 
                  onChange={e => setFormData({...formData, limit: e.target.value})} 
                  placeholder="0,00" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo *</label>
              <div className="relative">
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Cartão Empresa</option>
                  <option>Cartão Sócio</option>
                  <option>Cartão Prepago</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
                Cartão empresa impacta o financeiro. Gastos entram no caixa, Dashboard e Centros de Custo.
              </p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Cartão ativo</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Habilitado para lançamentos</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Salvar Cartão</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCardModal;
