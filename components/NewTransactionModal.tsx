
import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Plus, DollarSign, Loader2, User, Truck, Users, LayoutGrid, Banknote, CreditCard, Building2, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[800px] max-h-[92vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Lançamento</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Fluxa Engine Finance v2.6</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
          <form id="new-detailed-tx-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Top Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Tipo *</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'IN'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'IN' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Entrada
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'OUT'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'OUT' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Status *</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PENDING'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.status === 'PENDING' ? 'bg-white text-amber-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Pendente
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PAID'})}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.status === 'PAID' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Pago
                  </button>
                </div>
              </div>
            </div>

            {/* Core Data Card */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento *</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Pagamento de consultoria Alpha"
                  className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor (R$) *</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0,00"
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-xl font-black text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Competência *</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="date"
                      value={formData.competence_date}
                      onChange={(e) => setFormData({...formData, competence_date: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Relations Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</label>
                  <button type="button" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Novo</button>
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select 
                    value={formData.customer_id}
                    onChange={e => setFormData({...formData, customer_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-50"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fornecedor (opc)</label>
                  <button type="button" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Novo</button>
                </div>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-50">
                    <option value="">Vincular a fornecedor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro Equipe</label>
                  <button type="button" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Novo</button>
                </div>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select 
                    value={formData.team_member_id}
                    onChange={e => setFormData({...formData, team_member_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-50"
                  >
                    <option value="">Vincular a membro</option>
                    {teamMembers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Taxonomy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
                 <div className="relative">
                   <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <select 
                    value={formData.cost_center_id}
                    onChange={e => setFormData({...formData, cost_center_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none"
                   >
                     <option value="">Selecione</option>
                     {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                   </select>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta Contábil</label>
                 <div className="relative">
                   <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none">
                     <option value="">Selecione</option>
                     <option>Receita de Vendas</option>
                     <option>Prestação de Serviços</option>
                     <option>Despesas Operacionais</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banco</label>
                 <div className="relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <select 
                    value={formData.bank_account_id}
                    onChange={e => setFormData({...formData, bank_account_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-5 text-xs font-bold text-slate-600 appearance-none outline-none"
                   >
                     <option value="">Selecione o banco</option>
                     {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            {/* Payment & Installments */}
            <div className="space-y-6 pt-4">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meio de Pagamento</label>
                  <div className="flex flex-wrap gap-2">
                    {['Pix', 'Boleto', 'Transferência', 'Cartão', 'Outro'].map(method => (
                      <button 
                        key={method}
                        type="button"
                        onClick={() => setFormData({...formData, payment_method: method})}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${formData.payment_method === method ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="flex items-center justify-between p-6 bg-blue-50/30 border border-blue-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><Banknote size={20}/></div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Parcelado</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Dividir em múltiplas parcelas no ledger</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, is_installment: !formData.is_installment})}
                    className={`w-12 h-7 rounded-full relative transition-all duration-300 ${formData.is_installment ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${formData.is_installment ? 'left-6 shadow-sm' : 'left-1'}`} />
                  </button>
               </div>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 flex gap-4">
               <div className="p-2 bg-white rounded-xl text-amber-500 shrink-0 shadow-sm"><Layers size={20}/></div>
               <p className="text-[11px] text-amber-700 font-bold leading-relaxed italic">
                 "Salve o lançamento primeiro para habilitar a gestão de anexos e comprovantes fiscais."
               </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center gap-4 shrink-0 border-t border-slate-50 bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="new-detailed-tx-form"
            type="submit" 
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Criar Lançamento</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
