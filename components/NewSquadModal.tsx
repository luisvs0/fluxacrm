
import React, { useState, useEffect } from 'react';
import { X, Upload, ChevronDown, Users, Check, Plus, Info, Loader2, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DBUser {
  id: string;
  full_name: string;
  email?: string;
}

const NewSquadModal: React.FC<NewSquadModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: ''
  });

  // Busca usuários reais do banco de dados
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Tentamos buscar da tabela 'profiles' que é o padrão para metadados de usuários no Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setDbUsers(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      // Fallback silencioso ou feedback de erro se necessário
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
        members: selectedMembers,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);

      if (error) throw error;
      
      setFormData({ name: '', description: '', leader: '' });
      setSelectedMembers([]);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar squad:', err);
      alert('Erro ao criar squad. Verifique a conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Squad</h2>
              <p className="text-xs text-slate-400 font-medium">Estruture sua equipe baseada em dados reais</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 no-scrollbar">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Squad *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Squad de Performance, Vendas Sul..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Objetivo / Descrição</label>
              <textarea 
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Mantra ou meta principal do time..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Líder do Squad *</label>
              <div className="relative">
                <select 
                  value={formData.leader}
                  onChange={e => setFormData({...formData, leader: e.target.value})}
                  disabled={isLoadingUsers}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  <option value="">{isLoadingUsers ? 'Carregando usuários...' : 'Selecione o responsável'}</option>
                  {dbUsers.map(u => (
                    <option key={u.id} value={u.full_name}>{u.full_name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vincular Membros</label>
                {isLoadingUsers && <Loader2 size={12} className="animate-spin text-blue-500" />}
              </div>
              
              <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] overflow-hidden divide-y divide-slate-100">
                {isLoadingUsers ? (
                  <div className="p-8 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Sincronizando base de usuários...</p>
                  </div>
                ) : dbUsers.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <UserCircle size={24} className="mx-auto text-slate-200" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum usuário encontrado no banco</p>
                  </div>
                ) : (
                  dbUsers.map((user) => (
                    <div 
                      key={user.id}
                      onClick={() => toggleMember(user.full_name)}
                      className="flex items-center justify-between p-4 hover:bg-white transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                          {getInitials(user.full_name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 tracking-tight">{user.full_name}</span>
                          <span className="text-[9px] text-slate-300 font-medium uppercase tracking-tighter">{user.email}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMembers.includes(user.full_name) 
                          ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg shadow-blue-200' 
                          : 'bg-white border-slate-200'
                      }`}>
                        {selectedMembers.includes(user.full_name) && <Check size={12} className="text-white font-bold" strokeWidth={4} />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">Squad Ativo</p>
                <p className="text-[11px] text-slate-400 font-medium">Disponível para distribuição de metas</p>
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

          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-3">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Apenas usuários com perfil ativo no banco de dados podem ser vinculados a células de trabalho.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center gap-3 shrink-0 bg-white border-t border-slate-50">
          <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSaving || isLoadingUsers}
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Finalizar Criação
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSquadModal;
