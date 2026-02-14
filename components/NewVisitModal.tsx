
import React, { useState, useEffect } from 'react';
import { X, Eye, Calendar, Clock, User, Home, ChevronDown, Loader2, Save, Phone, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewVisitModal: React.FC<NewVisitModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    property_id: '',
    client_name: '',
    client_phone: '',
    visitor_name: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    status: 'Agendada'
  });

  useEffect(() => {
    if (isOpen && user) {
      supabase.from('properties').select('id, title').eq('user_id', user.id).then(({ data }) => {
        if (data) setProperties(data);
      });
      // Pré-preenche o corretor com o nome do usuário se disponível
      setFormData(prev => ({ ...prev, visitor_name: user.user_metadata?.full_name || '' }));
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.property_id || !formData.client_name) return alert('Imóvel e Cliente são obrigatórios.');

    setIsSaving(true);
    try {
      // Busca o título do imóvel para o compromisso na agenda
      const selectedProperty = properties.find(p => p.id === formData.property_id);
      const propTitle = selectedProperty ? selectedProperty.title : 'Imóvel';

      // 1. Cadastrar a Visita
      const { error: visitError } = await supabase.from('visits').insert([{
        user_id: user.id,
        property_id: formData.property_id,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        visitor_name: formData.visitor_name,
        date: formData.date,
        time: formData.time,
        status: formData.status
      }]);

      if (visitError) throw visitError;

      // 2. Automação: Cadastrar na Agenda (appointments)
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();
      
      const { error: apptError } = await supabase.from('appointments').insert([{
        user_id: user.id,
        title: `Visita: ${propTitle} (${formData.client_name})`,
        category: 'Comercial',
        start_time: startDateTime,
        description: `Visita agendada via módulo imobiliário.\nCorretor: ${formData.visitor_name}\nCliente: ${formData.client_name}\nTelefone: ${formData.client_phone}`,
        is_completed: false,
        notified: false // Garantindo estado inicial
      }]);

      if (apptError) {
        console.warn('Visita criada, mas houve um erro ao sincronizar com a agenda:', apptError);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao agendar visita.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-slate-100 flex flex-col">
        <div className="p-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl border-2 border-indigo-100 flex items-center justify-center shadow-sm">
              <Eye size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Agendar Demonstração</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Sincronização Automática com Agenda</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Imóvel Alvo *</label>
            <div className="relative group">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-50 transition-colors" size={18} />
              <select 
                value={formData.property_id}
                onChange={e => setFormData({...formData, property_id: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold appearance-none outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
              >
                <option value="">Selecione a unidade na base</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Interessado (Lead) *</label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                     <input type="text" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} placeholder="Nome completo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-5 pl-11 pr-5 text-sm font-bold shadow-inner" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Celular</label>
                   <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                     <input type="text" value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} placeholder="(00) 00000-0000" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold shadow-inner" />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Corretor / Apresentador</label>
             <div className="relative">
               <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
               <input type="text" value={formData.visitor_name} onChange={e => setFormData({...formData, visitor_name: e.target.value})} placeholder="Nome do responsável pela visita" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold shadow-inner" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold" />
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3 pt-8 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Confirmar Agenda</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVisitModal;
