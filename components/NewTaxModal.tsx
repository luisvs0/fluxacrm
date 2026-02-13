
import React, { useState } from 'react';
import { X, ChevronDown, Receipt, Info, Plus, Loader2, Calendar, Target, Repeat } from 'lucide-react';
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
        user_id: user.id, // ISOLAÇÃO
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
      <div className="relative bg-white w-full max-w-[550px] max-h-[95vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Imposto</h2>
              <p className="text-xs text-slate-400 font-medium">Configuração fiscal da sua conta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Tributo *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: ISS, PIS/COFINS, IOF" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo / Esfera</label>
                <div className="relative">
                  <select value={formData.sphere} onChange={e => setFormData({...formData, sphere: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                    <option>Federal</option>
                    <option>Estadual</option>
                    <option>Municipal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Base de Cálculo</label>
                <div className="relative">
                   <select value={formData.calculation_base} onChange={e => setFormData({...formData, calculation_base: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                    <option>Faturamento</option>
                    <option>Lucro Real</option>
                    <option>Valor Fixo</option>
                  </select>
                  <Target className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Taxa (%) *</label>
                <input 
                  type="text" 
                  value={formData.rate} 
                  onChange={e => setFormData({...formData, rate: e.target.value})} 
                  placeholder="5.00" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dia de Vencimento</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={formData.due_day} 
                    onChange={e => setFormData({...formData, due_day: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recorrência</label>
              <div className="relative">
                <select 
                  value={formData.recurrence} 
                  onChange={e => setFormData({...formData, recurrence: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
                <Repeat className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Ativo</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">Tributos inativos não geram lançamentos automáticos</p>
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

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Salvar Regra</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaxModal;
