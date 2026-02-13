
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2, Star, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewNPSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewNPSModal: React.FC<NewNPSModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    score: '10',
    comment: '',
    context: ''
  });

  useEffect(() => {
    if (isOpen) fetchCustomers();
  }, [isOpen]);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('id, name').order('name');
    if (data) setCustomers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return alert('Selecione um cliente.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('nps_responses').insert([{
        customer_id: formData.customer_id,
        score: parseInt(formData.score),
        comment: formData.comment,
        context: formData.context
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar resposta NPS.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 p-10 border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registrar Feedback</h2>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente *</label>
            <div className="relative">
              <select 
                value={formData.customer_id}
                onChange={e => setFormData({...formData, customer_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none"
              >
                <option value="">Selecione o cliente</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Qual a nota (0-10)?</label>
            <div className="grid grid-cols-6 gap-2">
               {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                 <button 
                  key={n}
                  type="button"
                  onClick={() => setFormData({...formData, score: n.toString()})}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${formData.score === n.toString() ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                 >
                   {n}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contexto da Pesquisa</label>
            <input 
              type="text" 
              value={formData.context}
              onChange={e => setFormData({...formData, context: e.target.value})}
              placeholder="Ex: Entrega de Projeto, Suporte Técnico..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Comentário / Percepção</label>
            <textarea 
              rows={3}
              value={formData.comment}
              onChange={e => setFormData({...formData, comment: e.target.value})}
              placeholder="O que o cliente relatou?"
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-3.5 px-5 text-sm font-medium resize-none outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNPSModal;
