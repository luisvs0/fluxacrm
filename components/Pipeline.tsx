
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
  Filter
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
      label: 'Lead',
      count: 0,
      color: '#4F46E5', // Indigo
      leads: []
    },
    {
      id: 'contato',
      label: 'Contato Iniciado',
      count: 1,
      totalValue: 'R$ 397,00',
      color: '#8B5CF6', // Violet
      leads: [
        {
          id: '1',
          name: 'ANDRE GOMES',
          company: 'Agência de marketing digital',
          value: 'R$ 397,00',
          assignedTo: 'Lucca H...',
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
      color: '#D946EF', // Fuchsia
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
          name: 'Gustavo dos Reis Costas',
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
      color: '#F472B6', // Pink
      leads: []
    },
    {
      id: 'fechado',
      label: 'Fechado',
      count: 0,
      color: '#FACC15', // Yellow
      leads: []
    }
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] animate-in fade-in duration-500 overflow-hidden flex flex-col">
      
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Pipeline</h2>
          <p className="text-sm text-gray-400 font-medium">122 leads • R$ 1.391,00 em potencial</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Tabs */}
          <div className="flex bg-[#f1f5f9] p-1 rounded-xl border border-gray-100 mr-4">
            <button 
              onClick={() => setActiveTab('Pipeline')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Pipeline' ? 'bg-[#0047AB] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <BarChart size={14} className="rotate-90" />
              Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('Follow-ups')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Follow-ups' ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <PhoneCall size={14} />
              Follow-ups
            </button>
          </div>

          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm min-w-[200px] cursor-pointer group">
              <Users size={16} className="text-gray-400 mr-2" />
              <span className="text-sm font-bold text-gray-700 flex-1">Todos os leads</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-900" />
            </div>
          </div>

          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
            <Settings2 size={18} />
          </button>

          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-[#0047AB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Second Filter Bar */}
      <div className="px-8 pb-4 flex items-center gap-4">
        <div className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400">
           <Filter size={14} />
        </div>
        
        <div className="relative">
          <select className="bg-white border border-gray-200 rounded-xl py-1.5 pl-4 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[160px]">
            <option>Todos os squads</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>

        <div className="relative">
          <select className="bg-white border border-gray-200 rounded-xl py-1.5 pl-4 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[160px]">
            <option>Todas as origens</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Horizontal Scroll Progress Bar Indicator */}
      <div className="px-8 mb-6">
        <div className="h-2 bg-white border border-gray-100 rounded-full flex items-center px-1 group cursor-pointer overflow-hidden relative">
          <div className="absolute left-10 w-44 h-1 bg-blue-600/50 rounded-full"></div>
          <button className="absolute left-1 bg-white border border-gray-100 rounded shadow-sm p-0.5 text-gray-400 z-10"><ChevronLeft size={10} /></button>
          <button className="absolute right-1 bg-white border border-gray-100 rounded shadow-sm p-0.5 text-gray-400 z-10"><ChevronRight size={10} /></button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-[340px] flex flex-col h-full">
              {/* Column Header */}
              <div 
                className="bg-white rounded-t-xl border-t-2 shadow-sm overflow-hidden flex flex-col"
                style={{ borderTopColor: column.color }}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{column.label}</span>
                    <span className="text-xs font-bold text-gray-400">{column.count}</span>
                  </div>
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="p-1 hover:bg-gray-50 rounded text-gray-400 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {column.totalValue && (
                  <div className="px-5 pb-4">
                    <span className="text-xs font-bold text-gray-400">{column.totalValue}</span>
                  </div>
                )}
              </div>

              {/* Column Content Area */}
              <div className="flex-1 bg-gray-50/50 border-x border-b border-gray-200/60 rounded-b-xl p-4 space-y-4 overflow-y-auto">
                {column.leads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 uppercase">{lead.name}</h4>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Building2 size={12} />
                          <span className="text-[11px] font-medium truncate">{lead.company}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                        <DollarSign size={14} />
                        <span>{lead.value}</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                             {lead.assignedAvatar}
                           </div>
                           <span className="text-[11px] font-bold text-gray-500">{lead.assignedTo}</span>
                           <UserPlus size={12} className="text-blue-500" />
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          {lead.origin}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {column.count === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Placeholder for empty state within column */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
      />
    </div>
  );
};

export default Pipeline;
