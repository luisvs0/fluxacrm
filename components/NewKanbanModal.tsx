
import React, { useState } from 'react';
import { X, Loader2, Database, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewKanbanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewKanbanModal: React.FC<NewKanbanModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#5c6cf2');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const colors = [
    '#5c6cf2', '#8b5cf6', '#a855f7', '#ec4899', '#ef4444', '#f59e0b', '#22c55e', '#14b8a6', '#3b82f6',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do quadro é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('marketing_boards').insert([{
        name: formData.name,
        description: formData.description,
        color: selectedColor,
        status: 'Ativo'
      }]);

      if (error) throw error;
      
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      console.error('Erro ao salvar board:', err);
      alert('Erro ao criar quadro no banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Quadro</h2>
              <p className="text-xs text-slate-400 font-medium">Estrutura de workflow via PostgreSQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Board *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Lançamento Produto X, Social Media..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Objetivo do Fluxo</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o propósito deste kanban..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-1">
                <Palette size={14} className="text-slate-400" />
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Identidade Visual</label>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all relative flex items-center justify-center ${
                      selectedColor === color 
                      ? 'ring-4 ring-blue-100 scale-110 shadow-lg' 
                      : 'hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Quadro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewKanbanModal;
