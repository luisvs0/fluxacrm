
import React, { useState } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Settings2, 
  Users, 
  BarChart, 
  PhoneCall, 
  Building2, 
  DollarSign, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Target
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';

interface LeadCard {
  id: string;
  name: string;
  company: string;
  value: string;
  assignedTo: string;
  assignedAvatar: string;
  origin: string;
}

interface Column {
  id: string;
  label: string;
  count: number;
  totalValue?: string;
  color: string;
  leads: LeadCard[];
}

const Pipeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const columns: Column[] = [
    {
      id: 'lead',
      label: 'Novo Lead',
      count: 0,
      color: 'bg-indigo-500',
      leads: []
    },
    {
      id: 'contato',
      label: 'Contato Iniciado',
      count: 1,
      totalValue: 'R$ 397,00',
      color: 'bg-blue-500',
      leads: [
        {
          id: '1',
          name: 'ANDRE GOMES',
          company: 'Agência de marketing digital',
          value: 'R$ 397,00',
          assignedTo: 'Lucca H.',
          assignedAvatar: 'LU',
          origin: 'Outbound'
        }
      ]
    },
    {
      id: 'reuniao',
      label: 'Reunião Marcada',
      count: 2,
      totalValue: 'R$ 994,00',
      color: 'bg-purple-500',
      leads: [
        {
          id: '2',
          name: 'Wesley Araujo',
          company: 'Shark Pay',
          value: 'R$ 497,00',
          assignedTo: 'Luis Venx',
          assignedAvatar: 'LU',
          origin: 'Outbound'
        },
        {
          id: '3',
          name: 'Gustavo dos Reis',
          company: 'Subido Pro',
          value: 'R$ 497,00',
          assignedTo: 'Luis Venx',
          assignedAvatar: 'LU',
          origin: 'Outbound'
        }
      ]
    },
    {
      id: 'proposta',
      label: 'Proposta Enviada',
      count: 0,
      color: 'bg-rose-500',
      leads: []
    },
    {
      id: 'fechado',
      label: 'Fechamento',
      count: 0,
      color: 'bg-emerald-500',
      leads: []
    }
  ];

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      {/* Premium Header */}
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Pipeline de Vendas</h2>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-slate-400 text-sm font-medium">122 leads ativos</span>
             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
             <span className="text-emerald-600 text-sm font-bold tracking-tight">R$ 1.340.000 em potencial</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => setActiveTab('Pipeline')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'Pipeline' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <BarChart size={14} className="rotate-90" />
              Quadro
            </button>
            <button 
              onClick={() => setActiveTab('Follow-ups')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'Follow-ups' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <PhoneCall size={14} />
              Follow-ups
            </button>
          </div>

          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="px-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="bg-white border border-slate-200 rounded-2xl py-2 pl-4 pr-10 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm min-w-[160px]">
              <option>Todos os squads</option>
              <option>Squad Alpha</option>
              <option>Squad Beta</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          <div className="relative">
            <select className="bg-white border border-slate-200 rounded-2xl py-2 pl-4 pr-10 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm min-w-[160px]">
              <option>Todas as origens</option>
              <option>Inbound</option>
              <option>Outbound</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button className="p-2 text-slate-300 hover:text-slate-900"><ChevronLeft size={20}/></button>
           <button className="p-2 text-slate-300 hover:text-slate-900"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-10 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-[320px] flex flex-col h-full group">
              {/* Column Header */}
              <div className="mb-4 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-4 ${column.color} rounded-full`}></div>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{column.label}</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">{column.count}</span>
                </div>
                {column.totalValue && (
                  <span className="text-[11px] font-bold text-slate-400 pl-3.5 tracking-tight">{column.totalValue}</span>
                )}
              </div>

              {/* Column Dropzone Area */}
              <div className="flex-1 bg-slate-50/40 rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                {column.leads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group/card relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 max-w-[80%]">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1">{lead.name}</h4>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Building2 size={10} />
                            <span className="text-[10px] font-bold truncate tracking-tight">{lead.company}</span>
                          </div>
                        </div>
                        <button className="text-slate-200 hover:text-slate-900 transition-colors opacity-0 group-hover/card:opacity-100">
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-blue-600 font-bold text-sm tracking-tighter">
                        <span>{lead.value}</span>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                             {lead.assignedAvatar}
                           </div>
                           <span className="text-[10px] font-bold text-slate-400">{lead.assignedTo}</span>
                        </div>
                        <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">
                          {lead.origin}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setIsNewLeadModalOpen(true)}
                  className="w-full py-4 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-white transition-all group/add"
                >
                  <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} />
    </div>
  );
};

export default Pipeline;
