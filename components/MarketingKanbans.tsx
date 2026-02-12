
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  FileText,
  User,
  LayoutGrid,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import NewKanbanModal from './NewKanbanModal';

interface MarketingTask {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video' | 'copy';
  dueDate: string;
  assignedTo: string;
  priority: 'Baixa' | 'Média' | 'Alta';
}

const MarketingKanbans: React.FC = () => {
  const [isNewKanbanModalOpen, setIsNewKanbanModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Conteúdo Social');
  
  const columns = [
    { id: 'idea', label: 'Ideação', count: 0, color: 'bg-indigo-400' },
    { id: 'prod', label: 'Produção', count: 2, color: 'bg-blue-500' },
    { id: 'review', label: 'Revisão', count: 1, color: 'bg-amber-500' },
    { id: 'sched', label: 'Agendado', count: 0, color: 'bg-purple-500' },
    { id: 'live', label: 'Publicado', count: 0, color: 'bg-emerald-500' },
  ];

  const tasks: MarketingTask[] = [
    { id: '1', title: 'Carrossel Institucional - Gestão Financeira', category: 'Instagram', type: 'image', dueDate: '15 Mai', assignedTo: 'Kyrooss', priority: 'Alta' },
    { id: '2', title: 'Reel: 5 Dicas para reduzir impostos', category: 'TikTok/Reels', type: 'video', dueDate: '16 Mai', assignedTo: 'Kyrooss', priority: 'Média' },
    { id: '3', title: 'Newsletter Semanal: Fechamento de Abril', category: 'E-mail', type: 'copy', dueDate: '12 Mai', assignedTo: 'Kyrooss', priority: 'Baixa' },
  ];

  const getTypeIcon = (type: MarketingTask['type']) => {
    switch (type) {
      case 'image': return <ImageIcon size={12} />;
      case 'video': return <Video size={12} />;
      case 'copy': return <FileText size={12} />;
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
      
      {/* SaaS Header */}
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Fluxos de Marketing</h2>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-slate-400 text-sm font-medium">4 quadros ativos</span>
             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
             <span className="text-blue-600 text-sm font-bold tracking-tight">Produção em 85% da capacidade</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2.5 pl-6 pr-12 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm min-w-[200px]"
            >
              <option>Conteúdo Social</option>
              <option>Campanhas Paid</option>
              <option>Eventos & PR</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <button 
            onClick={() => setIsNewKanbanModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2"
          >
            <Layers size={18} />
            Quadros
          </button>

          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="px-8 pb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por tarefa, responsável ou tag..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
           <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <Filter size={18} />
           </button>
           <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>
           <div className="flex items-center -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">U{i}</div>
              ))}
              <button className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shadow-sm">+</button>
           </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-10 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => (
            <div key={col.id} className="w-[320px] flex flex-col h-full group">
              {/* Column Header */}
              <div className="mb-4 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-4 ${col.color} rounded-full`}></div>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">{col.id === 'prod' ? '2' : col.id === 'review' ? '1' : '0'}</span>
                </div>
              </div>

              {/* Column Dropzone Area */}
              <div className="flex-1 bg-slate-50/40 rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                {tasks.filter(t => (col.id === 'prod' && (t.id === '1' || t.id === '2')) || (col.id === 'review' && t.id === '3')).map(task => (
                  <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group/card relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                             {task.category}
                           </span>
                           <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                             <div className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority).replace('text-', 'bg-')}`}></div>
                             {task.priority}
                           </div>
                        </div>
                        <button className="text-slate-200 hover:text-slate-900 transition-colors opacity-0 group-hover/card:opacity-100">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800 leading-tight tracking-tight">
                        {task.title}
                      </h4>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-300">
                             {getTypeIcon(task.type)}
                             <span className="text-[10px] font-bold uppercase tracking-widest">{task.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <Calendar size={12} className="text-slate-300" />
                             <span className="text-[10px] font-bold">{task.dueDate}</span>
                          </div>
                        </div>
                        
                        <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm border-2 border-white ring-1 ring-slate-100" title={task.assignedTo}>
                          {task.assignedTo.substring(0, 1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button className="w-full py-4 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-white transition-all group/add">
                  <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Column Placeholder */}
          <button className="w-[320px] h-[100px] border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:bg-slate-50 transition-all gap-2 group">
             <Plus size={24} className="group-hover:text-slate-400 transition-colors"/>
             <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Coluna</span>
          </button>
        </div>
      </div>

      <NewKanbanModal 
        isOpen={isNewKanbanModalOpen} 
        onClose={() => setIsNewKanbanModalOpen(false)} 
      />
    </div>
  );
};

export default MarketingKanbans;
