
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
  Camera
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Technical Inspection Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Vistorias Técnicas</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Controle de entrada, saída e rotina</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Nova Vistoria
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-3 border-2 border-slate-100 rounded-[2rem] shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por imóvel ou vistoriador..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-600 transition-all outline-none"
          />
        </div>
        <button onClick={fetchInspections} className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-600">
           <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Carregando Laudos...</p>
          </div>
        ) : filteredInspections.length === 0 ? (
          <div className="py-40 text-center opacity-30">
            <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhuma vistoria pendente ou realizada</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data & Tipo</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imóvel</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vistoriador</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fotos</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredInspections.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedInspection(item)}
                    className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                        <span className={`text-[9px] font-black uppercase mt-1 ${item.type === 'Saída' ? 'text-rose-500' : 'text-blue-500'}`}>
                           • Vistoria de {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Home size={14} /></div>
                         <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] uppercase group-hover:text-blue-600 transition-colors">{item.properties?.title}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[200px] font-medium">{item.properties?.address}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black italic">
                             {item.inspector_name?.substring(0,1).toUpperCase() || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{item.inspector_name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                          <Camera size={12} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600">{item.photos?.length || 0}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border-2 ${
                         item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                         item.status === 'Cancelada' ? 'bg-rose-50 text-rose-600 border-rose-500' :
                         'bg-amber-50 text-amber-600 border-amber-500'
                       }`}>
                         {item.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
