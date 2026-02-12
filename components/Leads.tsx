
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  UserPlus, 
  Filter,
  MoreVertical
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import ImportLeadsModal from './ImportLeadsModal';

interface LeadRow {
  id: string;
  name: string;
  company: string;
  fase: string;
  valor: string;
  responsavel: string | null;
  squad: string;
  origem: string;
  criadoEm: string;
}

const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const leads: LeadRow[] = [
    {
      id: '1',
      name: 'Webound - Agência de Tráfego Pago, Marketing Digital e Vídeos',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    },
    {
      id: '2',
      name: 'Agência PV | Marketing Digital em Belo Horizonte, Social media, Trafego Pago, Criação de Sites, Automações para Marketing',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    },
    {
      id: '3',
      name: 'Agência Matrix | Tráfego Pago | Anúncios online',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    },
    {
      id: '4',
      name: 'Gestor de Tráfego Pago BH | Rafaelle Vieira',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    },
    {
      id: '5',
      name: 'Felipe',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    },
    {
      id: '6',
      name: 'GM ASSESSORIA',
      company: 'Agência de marketing digital',
      fase: '-',
      valor: '-',
      responsavel: null,
      squad: '-',
      origem: 'Importação',
      criadoEm: '09/02/2026'
    }
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Leads</h2>
          <p className="text-sm text-gray-400 font-medium">122 leads encontrados</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload size={18} className="text-gray-400" />
            Importar
          </button>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm min-w-[160px] cursor-pointer group">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600 flex-1">Todas as fases</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm min-w-[180px] cursor-pointer group">
              <span className="text-sm font-medium text-gray-600 flex-1">Todos os squads</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Fase</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Estimado</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Squad</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Origem</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 max-w-md">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900 leading-snug">{lead.name}</p>
                      <p className="text-[13px] text-gray-400 font-medium">{lead.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400">{lead.fase}</td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400">{lead.valor}</td>
                  <td className="px-6 py-6">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                      <UserPlus size={18} />
                      <span className="text-sm font-bold">Assumir</span>
                    </button>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400">{lead.squad}</td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-600">{lead.origem}</td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">{lead.criadoEm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
      />

      <ImportLeadsModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
    </div>
  );
};

export default Leads;
