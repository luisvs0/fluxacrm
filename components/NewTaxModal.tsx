
import React, { useState } from 'react';
import { X, ChevronDown, Receipt, Info, Plus, Loader2, Calendar, Target, Repeat, Save, Percent } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTaxModal: React.FC<NewTaxModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    sphere: 'Federal',
    calculation_base: 'Faturamento',
    rate: '',
    due_day: '15',
    recurrence: 'Mensal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.rate) return alert('Preencha os campos obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('taxes').insert([{
        user_id: user.id,
        name: formData.name,
        sphere: formData.sphere,
        calculation_base: formData.calculation_base,
        rate: parseFloat(formData.rate.replace(',', '.')),
        due_day: parseInt(formData.due_day),
        recurrence: formData.recurrence,
        status: isActive ? 'Active' : 'Inactive'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tributo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] max-h-[92vh] overflow-hidden rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-10 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] border-2 border-blue-100 flex items-center justify-center shadow-sm">
              <Receipt size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Novo Imposto</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Configuração Fiscal Auditada</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-10 pt-4 no-scrollbar space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Tributo *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: ISS, PIS/COFINS, IOF" 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-inner" 
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Esfera</label>
                <div className="relative">
                  <select 
                    value={formData.sphere} 
                    onChange={e => setFormData({...formData, sphere: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all"
                  >
                    <option>Federal</option>
                    <option>Estadual</option>
                    <option>Municipal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cálculo Base</label>
                <div className="relative">
                   <select 
                    value={formData.calculation_base} 
                    onChange={e => setFormData({...formData, calculation_base: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all"
                   >
                    <option>Faturamento</option>
                    <option>Lucro Real</option>
                    <option>Valor Fixo</option>
                  </select>
                  <Target className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Alíquota (%) *</label>
                <div className="relative">
                  <Percent className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={18} strokeWidth={3} />
                  <input 
                    type="text" 
                    value={formData.rate} 
                    onChange={e => setFormData({...formData, rate: e.target.value})} 
                    placeholder="5.00" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-lg font-black text-blue-600 outline-none focus:border-blue-500 transition-all shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vencimento (Dia)</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={formData.due_day} 
                    onChange={e => setFormData({...formData, due_day: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-700 outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Recorrência Fiscal</label>
              <div className="relative">
                <Repeat className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  value={formData.recurrence} 
                  onChange={e => setFormData({...formData, recurrence: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all"
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border-2 border-blue-100 flex gap-4">
              <Info size={20} className="text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed uppercase">
                O sistema calculará a provisão baseando-se na alíquota acima aplicada sobre a receita confirmada no ledger.
              </p>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50/50 border-2 border-slate-100 rounded-[1.75rem]">
              <div>
                <p className="text-sm font-black text-slate-900 uppercase">Tributo Ativo</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Impacta o provisionamento automático</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Regra</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaxModal;
