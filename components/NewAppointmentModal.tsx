
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  defaultDate?: Date;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, user, defaultDate }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    category: 'Geral',
    date: '',
    start_time: '09:00',
    end_time: '10:00',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        date: defaultDate ? formatDateForInput(defaultDate) : formatDateForInput(new Date())
      }));
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.date) {
      alert('Por favor, preencha o título e a data.');
      return;
    }

    setIsSaving(true);
    try {
      const startDateTime = new Date(`${formData.date}T${formData.start_time}:00`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.end_time}:00`).toISOString();

      const { error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          start_time: startDateTime,
          end_time: endDateTime,
          description: formData.description,
          is_completed: false
        }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Erro ao salvar compromisso:', err);
      alert('Erro ao agendar compromisso.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Compromisso</h2>
              <p className="text-xs text-slate-400 font-medium">Agende uma atividade na sua timeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
          <form id="new-appointment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título do Evento *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Reunião de Alinhamento Imob"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Início</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Término</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição (Opcional)</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Notas sobre o compromisso..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-8 pt-4 flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="new-appointment-form"
            type="submit" 
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Confirmar Agenda</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
