
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Settings2, 
  Users, 
  BarChart, 
  PhoneCall, 
  Building2, 
  DollarSign, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Target,
  Loader2,
  Database
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import { supabase } from '../lib/supabase';

const Pipeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*');
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
  }, []);

  const columns = [
    { id: 'lead', label: 'Novo Lead', color: 'bg-indigo-500' },
    { id: 'contato', label: 'Contato', color: 'bg-blue-500' },
    { id: 'reuniao', label: 'Reunião', color: 'bg-purple-500' },
    { id: 'proposta', label: 'Proposta', color: 'bg-rose-500' },
    { id: 'fechado', label: 'Fechado', color: 'bg-emerald-500' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10">
      
      {/* Header Responsivo */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Pipeline de Vendas</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{leads.length} registros no SQL</span>
          </div>
        </div>

        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Novo Lead
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Banco...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto px-4 md:px-8 pb-10 no-scrollbar">
          <div className="flex gap-4 md:gap-6 h-full min-w-max">
            {columns.map((column) => {
              const columnLeads = leads.filter(l => (l.stage || 'lead').toLowerCase() === column.id);
              const totalValue = columnLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);

              return (
                <div key={column.id} className="w-[280px] md:w-[300px] flex flex-col h-full group">
                  <div className="mb-4 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-4 ${column.color} rounded-full`}></div>
                        <span className="text-[11px] font-black text-slate-900 tracking-widest uppercase">{column.label}</span>
                      </div>
                      <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase">{columnLeads.length}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 pl-3.5 tracking-tight uppercase">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>

                  <div className="flex-1 bg-slate-50/50 rounded-2xl md:rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50 transition-all">
                    {columnLeads.map((lead) => (
                      <div key={lead.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab group/card relative">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5 max-w-[85%]">
                              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight line-clamp-1">{lead.name}</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{lead.company || 'Pessoa Física'}</p>
                            </div>
                            <button className="text-slate-200 hover:text-slate-900"><MoreVertical size={14} /></button>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                             <span className="text-[11px] font-black text-blue-600 tracking-tighter">{formatCurrency(lead.value || 0)}</span>
                             <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[8px] font-black italic shadow-sm">
                               {String(lead.assigned_to || '?').substring(0, 1).toUpperCase()}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsNewLeadModalOpen(true)}
                      className="w-full py-4 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-white transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); fetchLeads(); }} />
    </div>
  );
};

export default Pipeline;
