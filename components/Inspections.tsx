
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  MoreVertical, 
  Loader2, 
  Database,
  RefreshCcw,
  Home,
  CheckCircle2,
  Clock,
  Filter,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewInspectionModal from './NewInspectionModal';
import InspectionDetailModal from './InspectionDetailModal';

interface InspectionsProps {
  user: any;
}

const Inspections: React.FC<InspectionsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInspections = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          properties (title, address, type, status, image_url)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (err) {
      console.error('Erro ao buscar vistorias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [user]);

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => 
      i.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.inspector_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inspections, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <ShieldCheck size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Technical Audit Engine SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Vistorias <span className="text-[#203267] not-italic">Técnicas</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Controle de conformidade, entrada e preservação de ativos</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Nova Vistoria
          </button>
          <button onClick={fetchInspections} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all shadow-sm">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Toolbar Premium */}
      <div className="relative z-10 px-4 md:px-10 mt-10 mb-8">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
          <div className="relative flex-1 w-full lg:max-w-xl pl-2 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
            <input 
              type="text" 
              placeholder="Filtrar por imóvel ou vistoriador responsável..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> DB Node Inspection</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tabela Journal Premium */}
      <div className="relative z-10 px-4 md:px-10">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data & Tipo de Laudo</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ativo Imobiliário</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Vistoriador</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Mídia/Fotos</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status Auditoria</th>
                  <th className="px-10 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processando Laudos Técnicos SQL...</p>
                    </td>
                  </tr>
                ) : filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-48 text-center opacity-30">
                      <ClipboardCheck size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhuma vistoria registrada</p>
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedInspection(item)}
                      className="hover:bg-slate-50 transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tighter italic">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                          <span className={`text-[9px] font-black uppercase mt-1.5 tracking-widest ${item.type === 'Saída' ? 'text-rose-500' : 'text-blue-500'}`}>
                             • Vistoria de {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-md flex items-center justify-center italic font-black text-xs">
                             <Home size={18} />
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900 truncate max-w-[200px] uppercase group-hover:text-[#203267] transition-colors">{item.properties?.title}</p>
                              <p className="text-[9px] text-slate-400 truncate max-w-[200px] font-bold mt-0.5 tracking-tight uppercase">{item.properties?.address}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-600 italic">
                               {item.inspector_name?.substring(0,1).toUpperCase() || 'U'}
                            </div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{item.inspector_name}</span>
                         </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-slate-300 rounded-lg shadow-sm">
                            <Camera size={12} className="text-blue-500" strokeWidth={3} />
                            <span className="text-[10px] font-black text-[#203267]">{item.photos?.length || 0} Itens</span>
                         </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                         <span className={`text-[9px] font-black px-4 py-2 rounded-md uppercase tracking-widest border transition-all ${
                           item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 
                           item.status === 'Cancelada' ? 'bg-rose-50 text-rose-600 border-rose-300' :
                           'bg-amber-50 text-amber-600 border-amber-300'
                         }`}>
                           {item.status}
                         </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm">
                           <MoreVertical size={18} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NewInspectionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchInspections(); }} user={user} />
      {selectedInspection && (
        <InspectionDetailModal 
          inspection={selectedInspection} 
          onClose={() => setSelectedInspection(null)} 
        />
      )}
    </div>
  );
};

export default Inspections;
