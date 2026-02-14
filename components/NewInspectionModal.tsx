
import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, Calendar, User, Home, ChevronDown, Loader2, Save, Info, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewInspectionModal: React.FC<NewInspectionModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    property_id: '',
    type: 'Entrada',
    date: new Date().toISOString().split('T')[0],
    inspector_name: '',
    status: 'Agendada',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      supabase.from('properties').select('id, title').eq('user_id', user.id).then(({ data }) => {
        if (data) setProperties(data);
      });
      setFormData(prev => ({ ...prev, inspector_name: user.user_metadata?.full_name || '' }));
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.property_id) return alert('Imóvel é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('inspections').insert([{
        user_id: user.id,
        property_id: formData.property_id,
        type: formData.type,
        date: formData.date,
        inspector_name: formData.inspector_name,
        status: formData.status,
        notes: formData.notes
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar vistoria.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-slate-100 flex flex-col">
        <div className="p-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl border-2 border-slate-100 flex items-center justify-center shadow-sm">
              <ClipboardCheck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Registrar Vistoria</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Laudo Técnico de Preservação</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Imóvel Alvo *</label>
            <div className="relative group">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                value={formData.property_id}
                onChange={e => setFormData({...formData, property_id: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold appearance-none outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
              >
                <option value="">Selecione o imóvel</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Vistoria</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-bold uppercase"
                >
                   <option>Entrada</option>
                   <option>Saída</option>
                   <option>Rotina</option>
                   <option>Manutenção</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Agendada</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold" />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vistoriador / Responsável</label>
             <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input type="text" value={formData.inspector_name} onChange={e => setFormData({...formData, inspector_name: e.target.value})} placeholder="Nome do vistoriador" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold shadow-inner" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas Iniciais</label>
            <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Ex: Verificar vazamento na suíte master..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 px-6 text-sm font-medium resize-none outline-none focus:bg-white focus:border-blue-500 transition-all" />
          </div>

          <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
             <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
             <p className="text-[10px] text-amber-800 font-bold uppercase leading-relaxed">O laudo fotográfico deve ser anexado após a realização da vistoria no campo de detalhes do registro.</p>
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Agendar Vistoria</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInspectionModal;
