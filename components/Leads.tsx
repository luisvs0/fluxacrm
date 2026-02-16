
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  UserPlus, 
  Filter,
  MoreVertical,
  ArrowUpRight,
  Mail,
  Building2,
  Calendar,
  Loader2,
  Database,
  ExternalLink,
  RefreshCcw
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import ImportLeadsModal from './ImportLeadsModal';
import { supabase } from '../lib/supabase';

interface LeadsProps {
  user: any;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('Todas as Fases');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id) // GARANTIR ISOLAMENTO
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro Leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = selectedStage === 'Todas as Fases' || lead.stage?.toLowerCase() === selectedStage.toLowerCase();
      return matchesSearch && matchesStage;
    });
  }, [leads, searchTerm, selectedStage]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-10 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500 shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Leads Intelligence</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Leads Central</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Exibindo {filteredLeads.length} leads da sua conta.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Novo
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar nos seus leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead & Organização</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fase</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Est.</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto text-blue-500 mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando seus registros...</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                     <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Sem leads cadastrados por você</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md italic">
                          {lead.name.substring(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[200px]">{lead.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{lead.company || 'Pessoa Física'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100/50">
                        {lead.stage || 'lead'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">{formatCurrency(lead.value || 0)}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase">{formatDate(lead.created_at)}</span>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={16}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); fetchLeads(); }} user={user} />
      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Leads;
