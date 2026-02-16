
import React, { useState } from 'react';
import { X, UserPlus, Shield, ChevronDown, Loader2, Save } from 'lucide-react';
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
      
      <div className="relative bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 p-10 border border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <UserPlus size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Convidar Membro</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Acessos Isolada</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo *</label>
            <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Ex: Ana Silva" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ana@empresa.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nível de Acesso</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold">
              <option>Visualizador</option><option>Financeiro</option><option>Comercial</option><option>Administrador</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar Acesso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserModal;
