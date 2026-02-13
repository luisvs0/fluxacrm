
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  LayoutGrid,
  Filter,
  Users2,
  Loader2,
  Database,
  MoreVertical,
  Target
} from 'lucide-react';
import NewSquadModal from './NewSquadModal';
import { supabase } from '../lib/supabase';

const Squads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSquads = async () => {
    setIsLoading(true);
    try {
      // Busca squads do Supabase (sem ordenação por created_at para evitar erro de coluna)
      const { data, error } = await supabase.from('squads').select('*');
      if (error) throw error;
      setSquads(data || []);
    } catch (err) {
      console.error('Erro ao buscar squads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const filteredSquads = useMemo(() => {
    return squads.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.leader?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [squads, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Org Sincronizado</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Células Operacionais</h2>
          <p className="text-slate-500 font-medium mt-1">Gestão de estrutura organizacional do time.</p>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Novo Squad
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do squad ou líder..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="bg-slate-50 p-1 rounded-xl flex items-center gap-1">
             <button className="p-2 bg-white text-slate-900 rounded-lg shadow-sm border border-slate-100"><LayoutGrid size={18}/></button>
             <button className="p-2 text-slate-400 hover:text-slate-600"><Filter size={18}/></button>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Organograma...</p>
        </div>
      ) : filteredSquads.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[450px] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden transition-all hover:border-blue-100">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Users2 size={250} />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-sm border border-slate-100">
              <Users size={48} strokeWidth={1.5} />
            </div>
            
            <div className="max-w-sm">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Nenhum squad encontrado</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Você ainda não configurou células operacionais. Crie squads para organizar metas e responsabilidades.
              </p>
            </div>

            <button 
              onClick={() => setIsNewSquadModalOpen(true)}
              className="px-10 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Criar Primeiro Squad
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSquads.map((squad) => (
            <div key={squad.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[340px]">
               <div>
                 <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform italic">
                      {squad.name.substring(0,1).toUpperCase()}
                    </div>
                    <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={20}/></button>
                 </div>

                 <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{squad.name}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">{squad.description || 'Nenhum mantra definido para este squad.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Head Responsável</p>
                         <p className="text-sm font-bold text-slate-700 mt-1 truncate">{squad.leader || 'A definir'}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Time Ativo</p>
                         <p className="text-sm font-bold text-slate-700 mt-1">{Array.isArray(squad.members) ? squad.members.length : 0} membros</p>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex items-center gap-2 pt-6">
                   <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${squad.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      {squad.status || 'Ativo'}
                   </span>
                   <div className="flex -space-x-2 ml-auto">
                      {(squad.members || []).slice(0, 4).map((member: string, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm" title={member}>
                          {member.substring(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {(squad.members || []).length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[9px] font-black text-blue-600 shadow-sm">
                          +{(squad.members || []).length - 4}
                        </div>
                      )}
                   </div>
               </div>
            </div>
          ))}
        </div>
      )}

      <NewSquadModal 
        isOpen={isNewSquadModalOpen} 
        onClose={() => { setIsNewSquadModalOpen(false); fetchSquads(); }} 
      />
    </div>
  );
};

export default Squads;
