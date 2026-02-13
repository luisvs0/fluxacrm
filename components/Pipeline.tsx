
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Loader2,
  Database
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import { supabase } from '../lib/supabase';

interface PipelineProps {
  user: any;
}

const Pipeline: React.FC<PipelineProps> = ({ user }) => {
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*').eq('user_id', user.id);
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const columns = [
    { id: 'lead', label: 'Novo Lead', color: 'bg-slate-400', border: 'border-slate-400' },
    { id: 'qualificacao', label: 'Qualificação', color: 'bg-indigo-400', border: 'border-indigo-400' },
    { id: 'contato', label: 'Contato', color: 'bg-blue-500', border: 'border-blue-500' },
    { id: 'reuniao', label: 'Reunião', color: 'bg-purple-500', border: 'border-purple-500' },
    { id: 'proposta', label: 'Proposta', color: 'bg-orange-500', border: 'border-orange-500' },
    { id: 'negociacao', label: 'Negociação', color: 'bg-rose-500', border: 'border-rose-500' },
    { id: 'fechado', label: 'Fechado', color: 'bg-emerald-500', border: 'border-emerald-500' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    // Atualização Otimista
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));

    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: stageId })
        .eq('id', leadId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao mover lead:', err);
      fetchLeads(); // Reverte se falhar
    }
    setDraggedId(null);
  };

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10">
      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Pipeline de Vendas</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{leads.length} Oportunidades Ativas</span>
          </div>
        </div>

        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Novo Lead
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Funil comercial...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto px-4 md:px-8 pb-10 no-scrollbar">
          <div className="flex gap-4 md:gap-5 h-full min-w-max">
            {columns.map((column) => {
              const columnLeads = leads.filter(l => (l.stage || 'lead').toLowerCase() === column.id);
              const totalValue = columnLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);

              return (
                <div 
                  key={column.id} 
                  className="w-[260px] md:w-[280px] flex flex-col h-full group"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="mb-4 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-3.5 ${column.color} rounded-full`}></div>
                        <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">{column.label}</span>
                      </div>
                      <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase">{columnLeads.length}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 pl-3 tracking-tight uppercase">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>

                  <div className={`flex-1 bg-slate-50/30 rounded-[1.5rem] border-2 border-dashed ${column.border.replace('border-', 'border-').concat('/20')} p-2.5 space-y-3 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all`}>
                    {columnLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`bg-white border-2 ${column.border.replace('border-', 'border-').concat('/50')} hover:border-blue-500 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-grab active:cursor-grabbing group/card relative border-l-[5px] ${draggedId === lead.id ? 'opacity-40 grayscale scale-95' : ''}`}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5 max-w-[85%]">
                              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight line-clamp-1">{lead.name}</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{lead.company || 'Pessoa Física'}</p>
                            </div>
                            <button className="text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={12} /></button>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                             <span className="text-[10px] font-black text-blue-600 tracking-tighter">{formatCurrency(lead.value || 0)}</span>
                             <div className={`w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[8px] font-black italic shadow-sm uppercase border ${column.border.replace('border-', 'border-').concat('/30')}`}>
                               {String(lead.assigned_to || '?').substring(0, 1)}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsNewLeadModalOpen(true)}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-400/50 hover:bg-white transition-all group/add shadow-inner"
                    >
                      <Plus size={16} className="group-hover/add:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); fetchLeads(); }} user={user} />
    </div>
  );
};

export default Pipeline;
