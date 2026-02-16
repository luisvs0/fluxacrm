
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
  RefreshCcw,
  LayoutGrid
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
    { id: 'idea', label: 'Ideação', color: 'bg-indigo-400', border: 'border-indigo-400' },
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
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10">
      
      {/* Header Responsivo */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-blue-500 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Manager Isolado</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Fluxos de Conteúdo</h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsNewKanbanModalOpen(true)}
            className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold hover:bg-slate-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <LayoutGrid size={18} /> Novo Quadro
          </button>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Nova Tarefa
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Sua Base...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto no-scrollbar px-4 md:px-8 pb-10">
          <div className="flex gap-4 md:gap-6 h-full min-w-max">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter(t => (t.stage || 'idea').toLowerCase() === col.id);
              return (
                <div key={col.id} className="w-[280px] md:w-[320px] flex flex-col h-full group">
                  <div className="mb-4 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-4 ${col.color} rounded-full`}></div>
                        <span className="text-[11px] font-black text-slate-900 tracking-widest uppercase">{col.label}</span>
                      </div>
                      <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg uppercase">{colTasks.length}</span>
                    </div>
                  </div>

                  <div className={`flex-1 bg-slate-50/40 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed ${col.border.replace('border-', 'border-').concat('/30')} p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all`}>
                    {colTasks.map(task => (
                      <div key={task.id} className={`bg-white border-2 ${col.border.replace('border-', 'border-').concat('/60')} hover:border-blue-500 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all group/card relative overflow-hidden border-l-[6px]`}>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {task.category || 'Geral'}
                            </span>
                            <button className="text-slate-300 hover:text-slate-900 transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                          
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 leading-tight tracking-tight uppercase line-clamp-2">
                            {task.title}
                          </h4>

                          <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px]">
                                 {getTypeIcon(task.type)}
                                 <span>{task.type || 'copy'}</span>
                              </div>
                            </div>
                            <button onClick={fetchTasks} className="text-slate-200 hover:text-blue-500"><RefreshCcw size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsNewTaskModalOpen(true)}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400/50 hover:bg-white transition-all group/add shadow-inner"
                    >
                      <Plus size={18} className="group-hover/add:scale-125 transition-transform" />
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
