
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
  RefreshCcw,
  LayoutGrid
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
  
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [filterBroker, setFilterBroker] = useState('Todos');

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

  const columns = [
    { id: 'lead', label: 'Entrada / Novo', color: 'bg-slate-300' },
    { id: 'qualificacao', label: 'Qualificação', color: 'bg-blue-300' },
    { id: 'reuniao', label: 'Visita Agendada', color: 'bg-indigo-300' },
    { id: 'pos_visita', label: 'Pós-Visita', color: 'bg-purple-300' },
    { id: 'proposta', label: 'Proposta', color: 'bg-amber-300' },
    { id: 'negociacao', label: 'Negociação', color: 'bg-orange-300' },
    { id: 'fechado', label: 'Fechamento', color: 'bg-emerald-400' }
  ];

  const filteredLeadsByFilter = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.property_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPriority = filterPriority === 'Todas' || l.priority === filterPriority;
      const matchBroker = filterBroker === 'Todos' || l.assigned_to === filterBroker;
      
      return matchSearch && matchPriority && matchBroker;
    });
  }, [leads, searchTerm, filterPriority, filterBroker]);

  const columnData = useMemo(() => {
    return columns.map(col => ({
      ...col,
      items: filteredLeadsByFilter.filter(l => (l.stage || 'lead').toLowerCase() === col.id),
      count: filteredLeadsByFilter.filter(l => (l.stage || 'lead').toLowerCase() === col.id).length
    }));
  }, [filteredLeadsByFilter]);

  const brokers = useMemo(() => {
    const b = new Set(leads.map(l => l.assigned_to).filter(Boolean));
    return Array.from(b);
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        const el = e.target as HTMLElement;
        el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    setDragOverColumn(null);
    const el = e.target as HTMLElement;
    el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
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
      console.error('Erro ao mover:', err);
      fetchLeads();
    }
  };

  const getTemperatureBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return { label: 'Quente', class: 'bg-rose-500 text-white' };
      case 'Média': return { label: 'Morno', class: 'bg-amber-100 text-amber-700 border-amber-200' };
      default: return { label: 'Frio', class: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  const getTimeElapsed = (dateStr: string) => {
    const created = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    if (diffHrs < 1) return 'Agora';
    if (diffHrs < 24) return `${diffHrs}h`;
    return `${diffDays}d`;
  };

  const handleOpenEdit = (lead: any) => {
    setSelectedLead(null);
    setLeadToEdit(lead);
    setIsNewLeadModalOpen(true);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
               <TrendingUp size={20} className="text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Sales Engineering</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Sales <span className="text-[#203267] not-italic">Pipeline</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Atendimento
          </button>
          <button 
            onClick={fetchLeads} 
            className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all active:scale-90"
          >
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mb-8 mt-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 pl-3">
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar cliente ou imóvel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            
            <div className="h-10 w-[1px] bg-slate-300 mx-2 hidden lg:block opacity-50"></div>

            <div className="flex gap-2">
              <select 
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:border-[#203267] outline-none"
              >
                <option>Todas as Temperaturas</option>
                <option value="Alta">Quente</option>
                <option value="Média">Morno</option>
                <option value="Baixa">Frio</option>
              </select>

              <select 
                value={filterBroker}
                onChange={e => setFilterBroker(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:border-[#203267] outline-none"
              >
                <option>Todos os Corretores</option>
                {brokers.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Pipeline Node Central</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Funil SQL...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-4 md:p-10 no-scrollbar relative z-10">
          <div className="flex gap-8 h-full min-w-max pb-10">
            {columnData.map((column) => (
              <div 
                key={column.id} 
                className={`w-[320px] flex flex-col h-full rounded-xl transition-all duration-300 border-2 ${
                  dragOverColumn === column.id ? 'bg-slate-100 border-[#203267] scale-[1.02]' : 'border-transparent'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="mb-6 flex items-center justify-between px-2 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{column.label}</span>
                    <div className={`h-[3px] w-8 rounded-full ${column.color}`}></div>
                  </div>
                  <span className="text-[10px] font-black bg-white border border-slate-300 text-slate-900 px-3 py-1 rounded-md shadow-sm">{column.count}</span>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar pb-20">
                  {column.items.map((lead) => {
                    const temp = getTemperatureBadge(lead.priority);
                    return (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white border border-slate-300 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#203267] transition-all cursor-grab active:cursor-grabbing group relative ${
                          draggedId === lead.id ? 'opacity-30 blur-[1px]' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase line-clamp-1 italic">{lead.name}</h4>
                          <MoreVertical size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-5">
                           <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-[#203267] transition-colors"><Phone size={14} /></div>
                           <p className="text-[11px] text-slate-600 font-bold">{lead.phone || '(11) 9 9999-9999'}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm ${temp.class}`}>
                            {temp.label}
                          </span>
                          <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest border border-slate-700 shadow-md">
                            {lead.property_code || 'S/ REF'}
                          </span>
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-slate-900 text-white border border-slate-700 flex items-center justify-center text-[10px] font-black italic">
                               {(lead.assigned_to || 'C').substring(0,1)}
                             </div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[100px]">{lead.assigned_to || 'N/A'}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-300 font-black text-[10px] uppercase">
                             <Clock size={12} /> {getTimeElapsed(lead.created_at)}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:text-[#203267] hover:border-[#203267] hover:bg-white transition-all group"
                  >
                    <Plus size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => { setSelectedLead(null); fetchLeads(); }} 
          onEdit={handleOpenEdit}
          user={user} 
        />
      )}
      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => { setIsNewLeadModalOpen(false); setLeadToEdit(null); fetchLeads(); }} 
        user={user} 
        leadToEdit={leadToEdit}
      />
    </div>
  );
};

export default Pipeline;
