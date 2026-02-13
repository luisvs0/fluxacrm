
import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Plus, DollarSign, Loader2, User, Truck, Users, LayoutGrid, Banknote, CreditCard, Building2, Layers, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'IN',
    status: 'PENDING',
    competence_date: new Date().toISOString().split('T')[0],
    customer_id: '',
    supplier_id: '',
    team_member_id: '',
    cost_center_id: '',
    bank_account_id: '',
    payment_method: 'Pix',
    is_installment: false,
    accounting_account: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchAuxiliaryData();
    }
  }, [isOpen, user]);

  async function fetchAuxiliaryData() {
    const [
      { data: c }, 
      { data: cc }, 
      { data: tm }, 
      { data: b }
    ] = await Promise.all([
      supabase.from('customers').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('cost_centers').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('team_members').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('bank_accounts').select('id, name').eq('user_id', user.id).order('name')
    ]);

    if (c) setClients(c);
    if (cc) setCostCenters(cc);
    if (tm) setTeamMembers(tm);
    if (b) setBankAccounts(b);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.description || !formData.amount) return alert('Descrição e Valor são obrigatórios.');

    setIsSaving(true);
    try {
      const cleanAmount = formData.amount.replace(',', '.');
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          description: formData.description,
          amount: parseFloat(cleanAmount),
          type: formData.type,
          status: formData.status,
          competence_date: formData.competence_date,
          customer_id: formData.customer_id || null,
          supplier_id: formData.supplier_id || null,
          team_member_id: formData.team_member_id || null,
          cost_center_id: formData.cost_center_id || null,
          bank_account_id: formData.bank_account_id || null,
          payment_method: formData.payment_method,
          accounting_account: formData.accounting_account
        }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lançamento.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[800px] max-h-[92vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-10 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] border-2 border-blue-100 flex items-center justify-center shadow-sm">
              <Plus size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Novo Lançamento</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Fluxa Engine Finance v2.6</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-4 no-scrollbar">
          <form id="new-detailed-tx-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Top Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Direção do Fluxo *</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200/50">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'IN'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.type === 'IN' ? 'bg-white text-emerald-600 border-emerald-500 shadow-lg' : 'border-transparent text-slate-400'}`}
                  >
                    Entrada
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'OUT'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.type === 'OUT' ? 'bg-white text-rose-600 border-rose-500 shadow-lg' : 'border-transparent text-slate-400'}`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status de Liquidação *</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200/50">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PENDING'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.status === 'PENDING' ? 'bg-white text-amber-600 border-amber-500 shadow-lg' : 'border-transparent text-slate-400'}`}
                  >
                    Pendente
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PAID'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.status === 'PAID' ? 'bg-white text-blue-600 border-blue-500 shadow-lg' : 'border-transparent text-slate-400'}`}
                  >
                    Efetivado
                  </button>
                </div>
              </div>
            </div>

            {/* Core Data Card */}
            <div className={`border-2 rounded-[2.5rem] p-10 space-y-8 transition-all duration-500 ${formData.type === 'IN' ? 'border-emerald-100 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}`}>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento *</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Consultoria Técnica Mensal"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 px-8 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Auditado (R$) *</label>
                  <div className="relative group">
                    <DollarSign className={`absolute left-6 top-1/2 -translate-y-1/2 ${formData.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`} size={24} />
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0,00"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-8 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Competência *</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="date"
                      value={formData.competence_date}
                      onChange={(e) => setFormData({...formData, competence_date: e.target.value})}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-8 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Relations Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
                 <div className="relative group">
                   <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={16} />
                   <select 
                    value={formData.cost_center_id}
                    onChange={e => setFormData({...formData, cost_center_id: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 transition-all"
                   >
                     <option value="">Selecione</option>
                     {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta Bancária</label>
                 <div className="relative group">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={16} />
                   <select 
                    value={formData.bank_account_id}
                    onChange={e => setFormData({...formData, bank_account_id: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 transition-all"
                   >
                     <option value="">Selecione o banco</option>
                     {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pagamento</label>
                 <div className="relative group">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={16} />
                   <select 
                    value={formData.payment_method}
                    onChange={e => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 transition-all"
                   >
                     {['Pix', 'Boleto', 'Transferência', 'Cartão', 'Espécie'].map(m => <option key={m}>{m}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
               </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-10 pt-6 flex items-center gap-4 shrink-0 border-t border-slate-100 bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="new-detailed-tx-form"
            type="submit" 
            disabled={isSaving}
            className="flex-1 py-5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Confirmar Lançamento</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
