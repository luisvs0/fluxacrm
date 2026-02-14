
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
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewVisitModal from './NewVisitModal';

interface VisitsProps {
  user: any;
}

const Visits: React.FC<VisitsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          properties (title, address, rent_price, sale_price)
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Showings & Feedback Loop</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Controle de Visitas</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Pipeline de demonstração e interessados</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          Agendar Demonstração
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-3 border-2 border-slate-100 rounded-[2rem] shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou imóvel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-600 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {['Todas', 'Agendada', 'Realizada', 'Cancelada', 'Proposta'].map(st => (
            <button 
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === st ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
          <button onClick={fetchVisits} className="ml-2 p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-600">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela de Visitas Aprimorada */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data & Operação</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imóvel Alvo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interessado</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Feedback Quick-View</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Agenda...</p>
                  </td>
                </tr>
              ) : filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-40 text-center opacity-30">
                    <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhuma visita para os critérios atuais</p>
                  </td>
                </tr>
              ) : (
                filteredVisits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          <Clock size={10} className="text-blue-500" /> {item.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-500 uppercase mt-1">
                           <User size={10} /> {item.visitor_name || 'Corretor não definido'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-blue-600 rounded-2xl border-2 border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                          <Home size={18} strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[200px]">{item.properties?.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[200px]">{item.properties?.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.client_name}</p>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                           <Phone size={10} className="text-emerald-500" /> {item.client_phone || 'S/ Telefone'}
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       {item.feedback ? (
                         <div className="flex flex-col gap-2 max-w-[200px]">
                            <div className="flex gap-0.5">{renderStars(item.feedback_rating || 0)}</div>
                            <p className="text-[10px] text-slate-500 italic line-clamp-2 leading-relaxed">"{item.feedback}"</p>
                         </div>
                       ) : (
                         <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Aguardando Feedback</span>
                       )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 shadow-sm ${
                        item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                        item.status === 'Cancelada' ? 'bg-rose-50 text-rose-600 border-rose-500' :
                        item.status === 'Proposta' ? 'bg-indigo-50 text-indigo-600 border-indigo-500 animate-pulse' :
                        'bg-blue-50 text-blue-600 border-blue-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all">
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

      <NewVisitModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchVisits(); }} user={user} />
    </div>
  );
};

export default Visits;
