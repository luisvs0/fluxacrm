
import React, { useState } from 'react';
import { X, Upload, ChevronDown, Users, Check, Plus, Info, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSquadModal: React.FC<NewSquadModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: ''
  });

  const membersList = [
    { id: '1', name: 'Gabriel Dantras', initials: 'GD' },
    { id: '2', name: 'Kyros', initials: 'KY' },
    { id: '3', name: 'Lucca Hurtado', initials: 'LU' },
    { id: '4', name: 'Luis Venx', initials: 'LV' },
  ];

  const toggleMember = (name: string) => {
    setSelectedMembers(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do squad é obrigatório.');

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
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar squad.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Criar Novo Squad</h2>
              <p className="text-xs text-slate-400 font-medium">Agrupe talentos para objetivos comuns</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
          <div className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 group cursor-pointer hover:border-blue-100 transition-all">
              <Upload size={28} className="group-hover:text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 tracking-tight">Brasão do Squad</p>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Envie uma imagem JPG/PNG de até 2MB para representar o time.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome de Identificação *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Squad Alpha, Geração de Valor..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mantra / Objetivo do Time</label>
              <textarea 
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Foco total em conversão de leads frios."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Head / Líder do Squad</label>
              <div className="relative">
                <select 
                  value={formData.leader}
                  onChange={e => setFormData({...formData, leader: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="">Selecione o responsável</option>
                  {membersList.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vincular Membros</label>
              <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] overflow-hidden divide-y divide-slate-100">
                {membersList.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => toggleMember(member.name)}
                    className="flex items-center justify-between p-4 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                        {member.initials}
                      </div>
                      <span className="text-sm font-bold text-slate-700 tracking-tight">{member.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedMembers.includes(member.name) 
                        ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg' 
                        : 'bg-white border-slate-200'
                    }`}>
                      {selectedMembers.includes(member.name) && <Check size={12} className="text-white font-bold" strokeWidth={4} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">Squad Ativo</p>
                <p className="text-[11px] text-slate-400 font-medium">Habilitar para atribuição de leads</p>
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

          <div className="flex items-start gap-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Ao criar o squad, o histórico de performance será computado de forma agregada a partir de hoje.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Finalizar Criação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSquadModal;
