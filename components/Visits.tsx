
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Loader2,
  Database,
  RefreshCcw,
  MessageSquare,
  Home,
  Star,
  Phone,
  Filter,
  UserCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewVisitModal from './NewVisitModal';
import VisitDetailModal from './VisitDetailModal';

interface VisitsProps {
  user: any;
}

const Visits: React.FC<VisitsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');

  const fetchVisits = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          properties (title, address, rent_price, sale_price, type, bedrooms, bathrooms, area, status, image_url)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (err) {
      console.error('Erro ao buscar visitas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user]);

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchSearch = v.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Todas' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [visits, searchTerm, statusFilter]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={10} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));
  };

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
                <Eye size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Showings & Feedback Loop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Controle de <span className="text-[#203267] not-italic">Visitas</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Pipeline de demonstração e interessados auditados</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} /> Agendar Demonstração
          </button>
          <button onClick={fetchVisits} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all shadow-sm">
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
              placeholder="Buscar por cliente ou imóvel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Todas', 'Agendada', 'Realizada', 'Cancelada', 'Proposta'].map(st => (
              <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === st ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Showing SQL</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {/* Tabela Journal Premium */}
      <div className="relative z-10 px-4 md:px-10">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data & Operação</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Imóvel Alvo</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Interessado (Lead)</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Feedback Analítico</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-10 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Demonstrações SQL...</p>
                    </td>
                  </tr>
                ) : filteredVisits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-48 text-center opacity-30">
                      <Calendar size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum registro localizado</p>
                    </td>
                  </tr>
                ) : (
                  filteredVisits.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedVisit(item)}
                      className="hover:bg-slate-50 transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tighter italic">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-[#203267]/60 uppercase mt-1 tracking-widest">
                            <Clock size={10} strokeWidth={3} /> {item.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-500 uppercase mt-1.5">
                             <User size={10} strokeWidth={3} /> {item.visitor_name || 'Corretor SQL'}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-md flex items-center justify-center font-black text-xs italic group-hover:scale-105 transition-transform">
                            <Home size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[200px] group-hover:text-[#203267] transition-colors">{item.properties?.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[200px] mt-0.5">{item.properties?.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.client_name}</p>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <Phone size={10} className="text-emerald-500" /> {item.client_phone || 'S/ Registro'}
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         {item.feedback ? (
                           <div className="flex flex-col gap-2 max-w-[200px]">
                              <div className="flex gap-0.5">{renderStars(item.feedback_rating || 0)}</div>
                              <p className="text-[10px] text-slate-500 italic line-clamp-2 leading-relaxed">"{item.feedback}"</p>
                           </div>
                         ) : (
                           <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest opacity-60">Aguardando Ledger</span>
                         )}
                      </td>
                      <td className="px-8 py-8 text-center">
                        <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                          item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 
                          item.status === 'Cancelada' ? 'bg-rose-50 text-rose-600 border-rose-300' :
                          'bg-indigo-50 text-indigo-600 border-indigo-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all active:scale-90 shadow-sm border border-transparent hover:border-slate-200">
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

      <NewVisitModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchVisits(); }} user={user} />
      {selectedVisit && (
        <VisitDetailModal 
          visit={selectedVisit} 
          onClose={() => setSelectedVisit(null)} 
        />
      )}
    </div>
  );
};

export default Visits;
