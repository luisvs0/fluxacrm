
import React, { useState } from 'react';
import { X, UserPlus, Shield, ChevronDown, Loader2, Save, Database, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'Visualizador'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.full_name || !formData.email) return alert('Nome e E-mail são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').insert([{
        user_id: user.id, // VÍNCULO AO DONO DA CONTA
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar novo usuário.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-300 flex flex-col overflow-hidden">
        <div className="p-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-slate-900 text-white rounded-xl border border-slate-700 flex items-center justify-center shadow-lg group hover:scale-105 transition-transform duration-500">
                <UserPlus size={24} className="text-blue-400" />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Convidar <span className="text-[#203267] not-italic">Operador</span></h2>
                <div className="flex items-center gap-2 mt-2">
                   <Database size={10} className="text-blue-500" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permissão SQL Ledger</p>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-lg border border-slate-200"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Nome do Colaborador *</label>
            <input 
              type="text" 
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
              placeholder="Ex: Ana Silva" 
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] transition-all shadow-inner" 
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">E-mail Profissional *</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="ana@empresa.com" 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] transition-all shadow-inner" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Nível de Acesso SQL</label>
            <div className="relative">
              <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-4 px-6 text-sm font-bold text-slate-900 appearance-none outline-none focus:border-[#203267] transition-all"
              >
                <option>Visualizador</option>
                <option>Financeiro</option>
                <option>Comercial</option>
                <option>Administrador</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 pb-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-4 bg-[#203267] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Salvar Acesso</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserModal;
