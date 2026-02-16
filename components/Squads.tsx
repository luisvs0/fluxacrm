
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
  Target,
  RefreshCw,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import NewSquadModal from './NewSquadModal';
import { supabase } from '../lib/supabase';

interface SquadsProps {
  user: any;
}

const Squads: React.FC<SquadsProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSquads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('squads').select('*').eq('user_id', user.id);
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
  }, [user]);

  const filteredSquads = useMemo(() => {
    return squads.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.leader?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [squads, searchTerm]);

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
                <Users size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Organization Engine SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Células <span className="text-[#203267] not-italic">Operacionais</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão isolada de squads e performance de time</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewSquadModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Criar Novo Squad
          </button>
          <button onClick={fetchSquads} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all active:scale-90">
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Console */}
      <div className="relative z-10 px-4 md:px-10 mt-10 mb-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 lg:max-w-xl group pl-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, líder ou missão..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Team Node Cluster</span>
             <div className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="relative z-10 py-20 flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Organograma...</p>
        </div>
      ) : filteredSquads.length === 0 ? (
        <div className="relative z-10 mx-4 md:mx-10 bg-white border border-slate-300 rounded-xl shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center group">
          <Users2 size={60} strokeWidth={1} className="text-slate-200 mb-6 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum squad localizado na estrutura</p>
        </div>
      ) : (
        <div className="relative z-10 px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSquads.map((squad) => (
            <div key={squad.id} className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between min-h-[340px]">
               <div>
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform italic border border-slate-700">
                      {squad.name.substring(0,1).toUpperCase()}
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-all bg-slate-50 border border-slate-200 rounded-lg">
                      <MoreVertical size={20}/>
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="min-w-0">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase truncate group-hover:text-[#203267] transition-colors">{squad.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 line-clamp-2 italic">"{squad.description || 'Mantra de performance não definido.'}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Head of Squad</p>
                         <p className="text-xs font-black text-slate-900 mt-1 truncate italic">{squad.leader || 'A definir'}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ativos</p>
                         <p className="text-xs font-black text-slate-900 mt-1">{Array.isArray(squad.members) ? squad.members.length : 0} Colaboradores</p>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex items-center gap-2 pt-8 mt-auto border-t border-slate-50/50">
                   <span className={`text-[9px] font-black px-4 py-1.5 rounded-md uppercase tracking-widest border shadow-sm ${squad.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-300'}`}>
                      {squad.status || 'Ativo'}
                   </span>
                   <div className="flex -space-x-2 ml-auto">
                      {(squad.members || []).slice(0, 4).map((member: string, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-md italic transition-transform hover:z-20 hover:scale-110" title={member}>
                          {member.substring(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {(squad.members?.length || 0) > 4 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm">
                           +{squad.members.length - 4}
                        </div>
                      )}
                   </div>
               </div>

               <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:scale-125">
                 <Users size={180} />
               </div>
               <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 bg-[#203267] opacity-60"></div>
            </div>
          ))}
        </div>
      )}

      <NewSquadModal 
        isOpen={isNewSquadModalOpen} 
        onClose={() => { setIsNewSquadModalOpen(false); fetchSquads(); }} 
        user={user}
      />
    </div>
  );
};

export default Squads;
