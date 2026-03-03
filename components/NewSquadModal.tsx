
import React, { useState, useEffect } from 'react';
import { X, Upload, ChevronDown, Users, Check, Plus, Info, Loader2, UserCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

interface DBUser {
  id: string;
  full_name: string;
  email?: string;
}

const NewSquadModal: React.FC<NewSquadModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    mantra: ''
  });

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setDbUsers(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const toggleMember = (name: string) => {
    setSelectedMembers(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do squad é obrigatório.');
    if (!formData.leader) return alert('Selecione um líder para o squad.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('squads').insert([{
        name: formData.name,
        description: formData.description,
        leader: formData.leader,
        mantra: formData.mantra,
        members: selectedMembers,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);

      if (error) throw error;
      
      setFormData({ name: '', description: '', leader: '', mantra: '' });
      setSelectedMembers([]);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar squad:', err);
      alert('Erro ao criar squad.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[650px] max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Squad</h2>
              <p className="text-xs text-slate-400 font-medium">Estruture sua equipe de alta performance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 no-scrollbar">
          
          {/* Bandeira / Flag Upload UI */}
          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bandeira do Squad</label>
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <ImageIcon size={24} />
                </div>
                <div className="flex flex-col gap-1">
                   <button type="button" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Enviar bandeira</button>
                   <p className="text-[10px] text-slate-400 font-medium uppercase">PNG, JPG. Máx 5MB</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Squad Alpha"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Líder</label>
              <div className="relative">
                <select 
                  value={formData.leader}
                  onChange={e => setFormData({...formData, leader: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="">Selecione o líder</option>
                  {dbUsers.map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
            <textarea 
              rows={2}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o objetivo do squad..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
               <Sparkles size={12} className="text-amber-500" /> Mantra do Time
            </label>
            <input 
              type="text" 
              value={formData.mantra}
              onChange={e => setFormData({...formData, mantra: e.target.value})}
              placeholder="Ex: Juntos somos invencíveis!"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all italic"
            />
            <p className="text-[10px] text-slate-400 font-medium ml-1">Frase motivacional exibida quando o squad está em primeiro lugar</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Membros</label>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{selectedMembers.length} membro(s) selecionado(s)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dbUsers.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => toggleMember(user.full_name)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${selectedMembers.includes(user.full_name) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${selectedMembers.includes(user.full_name) ? 'bg-blue-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    {getInitials(user.full_name)}
                  </div>
                  <span className="text-xs font-bold truncate flex-1">{user.full_name}</span>
                  {selectedMembers.includes(user.full_name) && <Check size={14} strokeWidth={4} />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-900">Ativo</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Squads inativos não aparecem nas opções</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center gap-3 shrink-0 bg-white border-t border-slate-50">
          <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Squad'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSquadModal;
