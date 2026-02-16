
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
  X
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
  
  // Estados de Filtro
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

  // Colunas Expandidas para Fluxo Imobiliário Real (7 Estágios)
  const columns = [
    { id: 'lead', label: 'Entrada / Novo', color: 'border-slate-300' },
    { id: 'qualificacao', label: 'Qualificação', color: 'border-blue-300' },
    { id: 'reuniao', label: 'Visita Agendada', color: 'border-indigo-300' },
    { id: 'pos_visita', label: 'Pós-Visita', color: 'border-purple-300' },
    { id: 'proposta', label: 'Proposta', color: 'border-amber-300' },
    { id: 'negociacao', label: 'Negociação', color: 'border-orange-300' },
    { id: 'fechado', label: 'Fechamento', color: 'border-emerald-400' }
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

  // Lista de corretores únicos para o filtro
  const brokers = useMemo(() => {
    const b = new Set(leads.map(l => l.assigned_to).filter(Boolean));
    return Array.from(b);
  }, [leads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Ghost effect delay
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

    // Update optimista para UX instantânea
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));

    try {
      await supabase.from('leads').update({ stage: stageId }).eq('id', leadId).eq('user_id', user.id);
    } catch (err) {
      console.error('Erro ao mover:', err);
      fetchLeads(); // Reverte se falhar
    }
  };

  const getTemperatureBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return { label: 'Quente', class: 'bg-rose-500 text-white' };
      case 'Média': return { label: 'Morno', class: 'bg-amber-100 text-amber-700' };
      default: return { label: 'Frio', class: 'bg-slate-100 text-slate-500' };
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col animate-in fade-in duration-500">
      
      {/* Top Header & Search */}
      <div className="bg-white px-8 py-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#203267] rounded-xl flex items-center justify-center text-white shadow-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Atendimentos</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestão de Funil Realtime</p>
          </div>
        </div>
        
        <div className="relative w-full max-w-xl">
          <input 
            type="text" 
            placeholder="Buscar por cliente, telefone ou imóvel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-5 pr-12 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        </div>

        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="bg-[#203267] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a2954] transition-all shadow-xl shadow-indigo-900/20 active:scale-95 whitespace-nowrap flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Novo atendimento
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white px-8 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Filtro Prioridade */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioridade:</span>
            <select 
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-slate-600 outline-none focus:border-indigo-300 transition-all cursor-pointer"
            >
              <option>Todas</option>
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Filtro Corretor */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corretor:</span>
            <select 
              value={filterBroker}
              onChange={e => setFilterBroker(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-slate-600 outline-none focus:border-indigo-300 transition-all cursor-pointer"
            >
              <option>Todos</option>
              {brokers.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          
          {(filterPriority !== 'Todas' || filterBroker !== 'Todos' || searchTerm !== '') && (
            <button 
              onClick={() => { setFilterPriority('Todas'); setFilterBroker('Todos'); setSearchTerm(''); }}
              className="text-[10px] font-black text-rose-500 uppercase hover:underline flex items-center gap-1"
            >
              <X size={12} /> Limpar Filtros
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <Database size={12} className="text-blue-500" />
             SQL Realtime
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Funil...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-8 no-scrollbar scroll-smooth">
          <div className="flex gap-6 h-full min-w-max pb-4">
            {columnData.map((column) => (
              <div 
                key={column.id} 
                className={`w-[320px] flex flex-col h-full rounded-[2.5rem] transition-all duration-300 border-2 ${
                  dragOverColumn === column.id ? 'bg-indigo-50/50 border-indigo-200 scale-[1.01] shadow-2xl shadow-indigo-100/50' : 'border-transparent'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="mb-5 flex items-center justify-between px-6 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{column.label}</span>
                    <div className={`h-1 w-8 mt-1 rounded-full opacity-30 ${dragOverColumn === column.id ? 'bg-indigo-600 scale-x-150' : 'bg-[#203267]'}`}></div>
                  </div>
                  <span className="text-[10px] font-black bg-white border border-slate-100 text-[#203267] px-2.5 py-1 rounded-lg shadow-sm">{column.count}</span>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-20 px-2">
                  {column.items.map((lead) => {
                    const temp = getTemperatureBadge(lead.priority);
                    return (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white rounded-[2rem] p-6 shadow-sm border-2 border-transparent hover:border-[#203267] transition-all cursor-grab active:cursor-grabbing group relative ${
                          draggedId === lead.id ? 'opacity-30 grayscale blur-[1px]' : 'hover:shadow-xl hover:-translate-y-1'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-1 uppercase tracking-tight">{lead.name}</h4>
                          <MoreVertical size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                           <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Phone size={12} /></div>
                           <p className="text-[11px] text-slate-500 font-bold">{lead.phone || '(11) 9 9999-9999'}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm ${temp.class}`}>
                            {temp.label}
                          </span>
                          <span className="bg-slate-900 text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-md">
                            {lead.property_code || 'S/ REF'}
                          </span>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase italic">
                               {(lead.assigned_to || 'C').substring(0,1)}
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Corretor</span>
                               <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">{lead.assigned_to || 'N/A'}</span>
                             </div>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-300 font-black text-[9px] uppercase tracking-tighter">
                             <Clock size={12} />
                             {getTimeElapsed(lead.created_at)}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:text-[#203267] hover:border-[#203267] hover:bg-white transition-all group shadow-inner"
                  >
                    <Plus size={24} className="group-hover:scale-125 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest mt-2">Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => { setIsNewLeadModalOpen(false); setLeadToEdit(null); fetchLeads(); }} 
        user={user} 
        leadToEdit={leadToEdit}
      />
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => { setSelectedLead(null); fetchLeads(); }} 
          onEdit={handleOpenEdit}
          user={user} 
        />
      )}
    </div>
  );
};

export default Pipeline;
