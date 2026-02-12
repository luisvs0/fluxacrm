
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronDown,
  LayoutGrid,
  Filter,
  Users2
} from 'lucide-react';
import NewSquadModal from './NewSquadModal';

const Squads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Estrutura de Squads</h2>
          <p className="text-slate-500 font-medium mt-1">Organize seu time em células de alta performance e metas compartilhadas.</p>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Squad
        </button>
      </div>

      {/* Search & Control Bar */}
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

      {/* Main Content Area - Empty State */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[500px] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden transition-all hover:border-blue-100">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <Users2 size={250} />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-sm border border-slate-100">
            <Users size={48} strokeWidth={1.5} />
          </div>
          
          <div className="max-w-sm">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Nenhum squad configurado</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Squads permitem segmentar metas, analisar performance por canais e criar uma competição saudável entre os times de receita.
            </p>
          </div>

          <button 
            onClick={() => setIsNewSquadModalOpen(true)}
            className="px-10 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Criar primeiro squad
          </button>
        </div>
      </div>

      <NewSquadModal 
        isOpen={isNewSquadModalOpen} 
        onClose={() => setIsNewSquadModalOpen(false)} 
      />

    </div>
  );
};

export default Squads;
