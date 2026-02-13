
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2, Save, Wrench, DollarSign, Calendar, LayoutGrid, CreditCard, Info, Tag, Repeat } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewToolModal: React.FC<NewToolModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    price: '0',
    billing_day: '1',
    category: 'SaaS',
    recurrence: 'Mensal',
    cost_center_id: '',
    payment_method: 'Nenhum'
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchCostCenters();
    }
  }, [isOpen, user]);

  const fetchCostCenters = async () => {
    const { data } = await supabase.from('cost_centers').select('id, name').eq('user_id', user.id);
    if (data) setCostCenters(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome da ferramenta é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('tools').insert([{
        user_id: user.id,
        name: formData.name,
        provider: formData.provider,
        price: parseFloat(formData.price.replace(',', '.')) || 0,
        billing_day: parseInt(formData.billing_day),
        category: formData.category,
        recurrence: formData.recurrence,
        cost_center_id: formData.cost_center_id || null,
        payment_method: formData.payment_method,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar ferramenta.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Nova Ferramenta</h2>
              <p className="text-xs text-slate-400 font-medium">Controle de stack e assinaturas SaaS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: OpenAI API, Slack, AWS..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white shadow-sm transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fornecedor</label>
              <input 
                type="text" 
                value={formData.provider} 
                onChange={e => setFormData({...formData, provider: e.target.value})} 
                placeholder="Ex: Microsoft, OpenAI, Google..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none shadow-sm" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor mensal</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                  <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-5 text-sm font-black text-slate-900 shadow-inner" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dia de cobrança</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" min="1" max="31" value={formData.billing_day} onChange={e => setFormData({...formData, billing_day: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-5 text-sm font-bold text-slate-700" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recorrência</label>
                <select value={formData.recurrence} onChange={e => setFormData({...formData, recurrence: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                  <option>Mensal</option>
                  <option>Anual</option>
                  <option>Trimestral</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                  <option>Nenhuma</option>
                  <option>Desenvolvimento</option>
                  <option>Marketing</option>
                  <option>Produtividade</option>
                  <option>Infraestrutura</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Centro de custo</label>
              <div className="relative">
                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select value={formData.cost_center_id} onChange={e => setFormData({...formData, cost_center_id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-5 text-sm font-semibold appearance-none outline-none shadow-sm">
                  <option value="">Nenhum</option>
                  {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meio de pagamento padrão</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-5 text-sm font-semibold appearance-none outline-none shadow-sm">
                  <option>Nenhum</option>
                  <option>Cartão Corporativo</option>
                  <option>Transferência Internacional</option>
                  <option>Boleto / NF</option>
                  <option>PayPal / Outros</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
                Este meio de pagamento será usado nos lançamentos automáticos de cada ciclo de cobrança.
              </p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem]">
              <div>
                <p className="text-sm font-black text-slate-900 uppercase">Ferramenta ativa</p>
                <p className="text-[10px] text-slate-400 font-medium">Habilitada para provisionamento financeiro</p>
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
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 flex items-center justify-center gap-3">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Stack</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewToolModal;
