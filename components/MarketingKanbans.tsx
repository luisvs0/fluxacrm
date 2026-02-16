
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Loader2,
  Database,
  RefreshCw,
  LayoutGrid,
  RefreshCcw,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import NewKanbanModal from './NewKanbanModal';
import NewTaskModal from './NewTaskModal';
import { supabase } from '../lib/supabase';

interface MarketingKanbansProps {
  user: any;
}

const MarketingKanbans: React.FC<MarketingKanbansProps> = ({ user }) => {
  const [isNewKanbanModalOpen, setIsNewKanbanModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { id: 'idea', label: 'Ideação', color: 'bg-slate-300', border: 'border-slate-300' },
    { id: 'prod', label: 'Produção', color: 'bg-blue-500', border: 'border-blue-500' },
    { id: 'review', label: 'Revisão', color: 'bg-amber-500', border: 'border-amber-500' },
    { id: 'sched', label: 'Agendado', color: 'bg-purple-500', border: 'border-purple-500' },
    { id: 'live', label: 'Publicado', color: 'bg-emerald-500', border: 'border-emerald-500' },
  ];

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Erro Kanban:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'image': return <ImageIcon size={12} />;
      case 'video': return <Video size={12} />;
      case 'copy': return <FileText size={12} />;
      default: return <FileText size={12} />;
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden flex flex-col">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <LayoutGrid size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Workflow Engine SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Marketing <span className="text-[#203267] not-italic">Boards</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Nova Tarefa
          </button>
          <button onClick={fetchTasks} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Toolbar Console */}
      <div className="relative z-10 px-4 md:px-10 mt-10 mb-8">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 lg:max-w-xl group pl-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
            <input 
              type="text" 
              placeholder="Filtrar por título ou categoria de mídia..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> DB Node Ledger</span>
             <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
           <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Fluxos...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto no-scrollbar px-4 md:px-10 pb-12 relative z-10">
          <div className="flex gap-8 h-full min-w-max">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter(t => (t.stage || 'idea').toLowerCase() === col.id);
              return (
                <div key={col.id} className="w-[320px] flex flex-col h-full group">
                  <div className="mb-6 flex items-center justify-between px-2 pt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{col.label}</span>
                      <div className={`h-[3px] w-8 rounded-full ${col.color}`}></div>
                    </div>
                    <span className="text-[10px] font-black bg-white border border-slate-300 text-slate-900 px-3 py-1 rounded-md shadow-sm">{colTasks.length}</span>
                  </div>

                  <div className="flex-1 space-y-5 overflow-y-auto no-scrollbar pb-20">
                    {colTasks.map(task => (
                      <div key={task.id} className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#203267] transition-all cursor-grab active:cursor-grabbing group/card relative overflow-hidden border-l-[10px] border-l-slate-100">
                        <div className="space-y-5">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#203267] bg-indigo-50 px-3 py-1 rounded-md border border-slate-300 shadow-sm">
                              {task.category || 'Geral'}
                            </span>
                            <button className="p-1.5 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight group-hover/card:text-[#203267] transition-colors line-clamp-2 italic">
                            {task.title}
                          </h4>

                          <div className="pt-5 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-tight">
                                 <div className="p-1.5 bg-slate-50 rounded-lg">{getTypeIcon(task.type)}</div>
                                 <span>{task.type || 'copy'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300 text-[9px] font-black uppercase">
                               <Clock size={12} /> {task.priority || 'Normal'}
                            </div>
                          </div>
                        </div>
                        <div className={`absolute left-0 top-0 bottom-0 w-[10px] ${col.color} opacity-40`}></div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsNewTaskModalOpen(true)}
                      className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-300 hover:text-[#203267] hover:border-[#203267] hover:bg-white transition-all group/add shadow-inner"
                    >
                      <Plus size={24} strokeWidth={3} className="group-hover/add:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewKanbanModal 
        isOpen={isNewKanbanModalOpen} 
        onClose={() => { setIsNewKanbanModalOpen(false); fetchTasks(); }} 
        user={user}
      />
      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => { setIsNewTaskModalOpen(false); fetchTasks(); }} 
        user={user}
      />
    </div>
  );
};

export default MarketingKanbans;
