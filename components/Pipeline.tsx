
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Loader2,
  Database,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  ArrowUpDown,
  User,
  Zap,
  TrendingUp,
  X,
  LayoutGrid,
  Calendar,
  DollarSign,
  ArrowRight,
  // Added Home to fix 'Cannot find name' error on line 208
  Home
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import LeadDetailModal from './LeadDetailModal';
import { supabase } from '../lib/supabase';

interface PipelineProps {
  user: any;
}

const Pipeline: React.FC<PipelineProps> = ({ user }) => {
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadToEdit, setLeadToEdit] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchLeads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  // Estrutura expandida para 12 estágios (High Performance Workflow)
  const columns = [
    { id: 'lead', label: '1. Entrada', color: 'bg-blue-300' },
    { id: 'qualificacao', label: '2. SDR Check', color: 'bg-slate-400' },
    { id: 'agendamento', label: '3. Agendamento', color: 'bg-indigo-400' },
    { id: 'reuniao', label: '4. Tour/Visita', color: 'bg-[#01223d]' },
    { id: 'feedback', label: '5. Feedback', color: 'bg-[#b4a183]' },
    { id: 'followup', label: '6. Follow-up', color: 'bg-teal-500' },
    { id: 'nutricao', label: '7. Nutrição', color: 'bg-slate-500' },
    { id: 'analise', label: '8. Análise SQL', color: 'bg-violet-500' },
    { id: 'proposta', label: '9. Negociação', color: 'bg-amber-500' },
    { id: 'compliance', label: '10. Diligência', color: 'bg-rose-500' },
    { id: 'contrato', label: '11. Jurídico', color: 'bg-orange-500' },
    { id: 'fechado', label: '12. Liquidez', color: 'bg-emerald-600' }
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.property_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const columnData = useMemo(() => {
    return columns.map(col => ({
      ...col,
      items: filteredLeads.filter(l => (l.stage || 'lead').toLowerCase() === col.id),
      count: filteredLeads.filter(l => (l.stage || 'lead').toLowerCase() === col.id).length
    }));
  }, [filteredLeads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    setDragOverColumn(null);
    setDraggedId(null);
    if (!leadId) return;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));
    try {
      await supabase.from('leads').update({ stage: stageId }).eq('id', leadId).eq('user_id', user.id);
    } catch (err) {
      fetchLeads();
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 bg-white border-b border-slate-200 px-6 md:px-10 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#01223d] rounded-xl flex items-center justify-center text-[#b4a183] shadow-lg shrink-0">
             <LayoutGrid size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Pipeline <span className="text-[#01223d] not-italic">Enterprise</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2">Funil de Atendimento de Alta Granularidade SQL</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar interessado ou ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 outline-none text-slate-600 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-[#01223d] text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl active:scale-95 flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Novo Atendimento
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Fluxo Enterprise...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-6 md:p-10 no-scrollbar relative z-10 bg-slate-50/10">
          <div className="flex gap-5 h-full min-w-max">
            {columnData.map((column) => (
              <div 
                key={column.id} 
                onDragOver={(e) => { e.preventDefault(); setDragOverColumn(column.id); }}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-[300px] flex flex-col h-full rounded-xl border-2 transition-all duration-300 ${
                  dragOverColumn === column.id ? 'bg-[#01223d]/5 border-[#b4a183] border-dashed' : 'bg-transparent border-transparent'
                }`}
              >
                <div className="mb-4 flex items-center justify-between px-3 pt-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${column.color} rounded-full shadow-sm`}></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{column.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="text-[9px] font-black bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm">{column.count}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10 px-2">
                  {column.items.map((lead) => (
                    <div 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] hover:border-[#b4a183] transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight line-clamp-1 italic group-hover:text-[#01223d] transition-colors">{lead.name}</h4>
                        <div className={`w-2 h-2 rounded-full ${lead.priority === 'Alta' ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`}></div>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 mb-4">
                         <div className="flex items-center gap-2.5 text-slate-400">
                           <div className="w-5 h-5 bg-slate-50 rounded flex items-center justify-center border border-slate-100"><Phone size={10} className="text-emerald-500" /></div>
                           <p className="text-[10px] font-bold text-slate-600">{lead.phone || '(00) 00000-0000'}</p>
                         </div>
                         <div className="flex items-center gap-2.5 text-slate-400">
                           <div className="w-5 h-5 bg-slate-50 rounded flex items-center justify-center border border-slate-100"><Home size={10} className="text-[#b4a183]" /></div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#01223d] opacity-80 truncate">{lead.property_code || 'S/ REF'}</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Ticket Est.</span>
                            <span className="text-[13px] font-black text-slate-900 tracking-tighter italic">{formatCurrency(lead.value || 0)}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-[9px] font-black text-[#b4a183] border border-slate-700 shadow-sm group-hover:scale-110 transition-transform italic">
                             {(lead.assigned_to || 'U').substring(0,1)}
                           </div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-[#b4a183]"></div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#01223d] hover:border-[#b4a183] hover:bg-white transition-all group shadow-inner"
                  >
                    <Plus size={18} className="group-hover:scale-125 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); setLeadToEdit(null); fetchLeads(); }} user={user} leadToEdit={leadToEdit} />
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => { setSelectedLead(null); fetchLeads(); }} onEdit={l => { setSelectedLead(null); setLeadToEdit(l); setIsNewLeadModalOpen(true); }} user={user} />}
    </div>
  );
};

export default Pipeline;
