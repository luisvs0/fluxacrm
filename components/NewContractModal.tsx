
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, Package, FileText, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    status: 'ACTIVE',
    start_date: new Date().toISOString().split('T')[0],
    duration_months: '12',
    deployment_fee: '0',
    amount: '0',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
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
      const { error } = await supabase.from('contracts').insert([{
        customer_id: formData.customer_id,
        amount: parseFloat(formData.amount.replace(',', '.')) || 0,
        deployment_fee: parseFloat(formData.deployment_fee.replace(',', '.')) || 0,
        start_date: formData.start_date,
        status: formData.status,
        notes: formData.notes
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar contrato.');
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Contrato</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente *</label>
            <div className="relative">
              <select 
                value={formData.customer_id}
                onChange={e => setFormData({...formData, customer_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Selecione o cliente</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">MRR (R$)</label>
              <input type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Setup (R$)</label>
              <input type="text" value={formData.deployment_fee} onChange={e => setFormData({...formData, deployment_fee: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Início</label>
              <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duração (Meses)</label>
              <input type="number" value={formData.duration_months} onChange={e => setFormData({...formData, duration_months: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações</label>
            <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Cláusulas específicas, bônus, etc..." className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-3.5 px-5 text-sm font-medium resize-none" />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContractModal;
