
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  FileText,
  LayoutGrid,
  ChevronDown,
  Layers,
  Loader2,
  Database,
  CheckCircle2
} from 'lucide-react';
import NewKanbanModal from './NewKanbanModal';
import { supabase } from '../lib/supabase';

const MarketingKanbans: React.FC = () => {
  const [isNewKanbanModalOpen, setIsNewKanbanModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Conteúdo Social');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { id: 'idea', label: 'Ideação', color: 'bg-indigo-400' },
    { id: 'prod', label: 'Produção', color: 'bg-blue-500' },
    { id: 'review', label: 'Revisão', color: 'bg-amber-500' },
    { id: 'sched', label: 'Agendado', color: 'bg-purple-500' },
    { id: 'live', label: 'Publicado', color: 'bg-emerald-500' },
  ];

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('marketing_tasks').select('*');
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
  }, []);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-rose-500';
      case 'Média': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SQL Task Manager</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Fluxos de Conteúdo</h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewKanbanModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2"
          >
            <Layers size={18} /> Quadros
          </button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            <Plus size={20} /> Nova Tarefa
          </button>
        </div>
      </div>

      <div className="px-8 pb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por tarefa ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300 shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando Tasks do Banco...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-10 no-scrollbar">
          <div className="flex gap-6 h-full min-w-max">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter(t => (t.stage || 'idea').toLowerCase() === col.id);
              return (
                <div key={col.id} className="w-[320px] flex flex-col h-full group">
                  <div className="mb-4 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-4 ${col.color} rounded-full`}></div>
                        <span className="text-sm font-bold text-slate-900 tracking-tight">{col.label}</span>
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">{colTasks.length}</span>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50/40 rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                    {colTasks.map(task => (
                      <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group/card relative overflow-hidden">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                 {task.category || 'Geral'}
                               </span>
                               <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                                 {task.priority || 'Normal'}
                               </div>
                            </div>
                            <button className="text-slate-200 hover:text-slate-900 transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                          
                          <h4 className="text-sm font-bold text-slate-800 leading-tight tracking-tight uppercase">
                            {task.title}
                          </h4>

                          <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                 {getTypeIcon(task.type)}
                                 <span className="text-[10px] font-bold uppercase tracking-widest">{task.type || 'copy'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                 <Calendar size={12} className="text-slate-300" />
                                 <span className="text-[10px] font-bold">{task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'S/D'}</span>
                              </div>
                            </div>
                            
                            <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm border-2 border-white ring-1 ring-slate-100">
                              {String(task.assigned_to || '?').substring(0, 1).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="py-12 flex flex-col items-center justify-center opacity-20 text-center space-y-2">
                        <CheckCircle2 size={24} />
                        <p className="text-[9px] font-black uppercase tracking-widest">Coluna Vazia</p>
                      </div>
                    )}
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
      />
    </div>
  );
};

export default MarketingKanbans;
