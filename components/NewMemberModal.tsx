
import React, { useState, useEffect } from 'react';
import { X, User, Camera, ChevronDown, Loader2, Save, Phone, Mail, FileText, Wallet, LayoutGrid, Info, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [hasContract, setHasContract] = useState(false);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'Funcionário',
    email: '',
    phone: '',
    document_type: 'CPF',
    document_number: '',
    cost_center_id: '',
    salary_value: '0',
    observations: ''
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
    if (!formData.name || !formData.role) return alert('Nome e Cargo são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('team_members').insert([{
        user_id: user.id,
        name: formData.name,
        role: formData.role,
        type: formData.type,
        email: formData.email,
        phone: formData.phone,
        document_type: formData.document_type,
        document_number: formData.document_number,
        cost_center_id: formData.cost_center_id || null,
        salary_value: parseFloat(formData.salary_value.replace(',', '.')) || 0,
        status: isActive ? 'Ativo' : 'Inativo',
        has_contract: hasContract,
        observations: formData.observations
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar membro.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[680px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Membro</h2>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Gestão de capital humano e folha de pagamentos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
          {/* Header Foto */}
          <div className="flex flex-col items-center gap-4 py-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-dashed">
             <div className="w-24 h-24 rounded-full bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-200 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/10 transition-all overflow-hidden relative shadow-inner">
                <Camera size={28} strokeWidth={1.5} />
             </div>
             <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">Adicionar foto</button>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
              <Info size={12} className="text-blue-500" /> Dados Básicos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome completo" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo *</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Desenvolvedor" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                <div className="relative">
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                    <option>Funcionário</option>
                    <option>Sócio</option>
                    <option>PJ / Terceiro</option>
                    <option>Estagiário</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@exemplo.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-semibold outline-none shadow-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(11) 99999-9999" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-semibold outline-none shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo Doc.</label>
                    <select value={formData.document_type} onChange={e => setFormData({...formData, document_type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-black outline-none shadow-sm">
                      <option>CPF</option>
                      <option>RG</option>
                      <option>CNPJ</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Documento</label>
                    <input type="text" value={formData.document_number} onChange={e => setFormData({...formData, document_number: e.target.value})} placeholder="000.000.000-00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-bold outline-none shadow-sm" />
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
             <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem]">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Ativo</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Habilitado no organograma</p>
                </div>
                <button type="button" onClick={() => setIsActive(!isActive)} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
                </button>
             </div>
             <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem]">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Possui contrato</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Impacta gestão de contratos</p>
                </div>
                <button type="button" onClick={() => setHasContract(!hasContract)} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${hasContract ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${hasContract ? 'left-[22px]' : 'left-1'}`} />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
              <div className="relative">
                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select value={formData.cost_center_id} onChange={e => setFormData({...formData, cost_center_id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-semibold appearance-none outline-none shadow-sm">
                  <option value="">Nenhum</option>
                  {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Mensal (Ref)</label>
              <div className="relative">
                 <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                 <input type="text" value={formData.salary_value} onChange={e => setFormData({...formData, salary_value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-black text-slate-900 outline-none shadow-inner" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações</label>
            <textarea rows={3} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Histórico, links ou detalhes do colaborador..." className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-3 transition-all">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Membro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMemberModal;
