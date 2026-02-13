
import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Tag, Layers, ChevronDown, ListTodo, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    board_id: '',
    category: 'Geral',
    type: 'copy',
    priority: 'Média',
    stage: 'idea'
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchBoards();
    }
  }, [isOpen, user]);

  const fetchBoards = async () => {
    const { data } = await supabase.from('marketing_boards').select('id, name').eq('user_id', user.id);
    if (data) setBoards(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.board_id) {
      alert('Título e Quadro são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('marketing_tasks').insert([{
        user_id: user.id, // Salvando o ID de quem adicionou
        board_id: formData.board_id,
        title: formData.title,
        category: formData.category,
        type: formData.type,
        priority: formData.priority,
        stage: formData.stage
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      alert('Erro ao salvar tarefa.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <ListTodo size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Nova Tarefa</h2>
              <p className="text-xs text-slate-400 font-medium">Adicionar item ao workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título da Tarefa *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Ex: Criar post de feriado" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" 
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quadro de Destino *</label>
            <div className="relative">
              <select 
                value={formData.board_id} 
                onChange={e => setFormData({...formData, board_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecione o quadro</option>
                {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-bold outline-none">
                <option>Geral</option>
                <option>Social Media</option>
                <option>Anúncios</option>
                <option>Conteúdo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-bold outline-none">
                <option value="copy">Copy / Texto</option>
                <option value="image">Imagem / Design</option>
                <option value="video">Vídeo / Reel</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prioridade</label>
            <div className="flex gap-2">
              {['Baixa', 'Média', 'Alta'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.priority === p ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Tarefa</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
