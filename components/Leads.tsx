
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  UserPlus, 
  Filter,
  MoreVertical,
  ArrowUpRight,
  Mail,
  Building2,
  Calendar
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
    { id: '1', name: 'Webound - Tráfego Pago', company: 'Agência Digital', fase: 'Qualificação', valor: 'R$ 15.000', responsavel: null, squad: 'Alpha', origem: 'Google Ads', criadoEm: '12 Fev, 2026' },
    { id: '2', name: 'Agência PV | Marketing', company: 'Software/SaaS', fase: 'Negociação', valor: 'R$ 8.500', responsavel: 'Kyros', squad: 'Beta', origem: 'Indicação', criadoEm: '11 Fev, 2026' },
    { id: '3', name: 'Agência Matrix', company: 'Consultoria', fase: 'Proposta', valor: 'R$ 12.000', responsavel: null, squad: 'Alpha', origem: 'LinkedIn', criadoEm: '10 Fev, 2026' },
    { id: '4', name: 'Gestor de Tráfego BH', company: 'Autônomo', fase: 'Fechamento', valor: 'R$ 4.200', responsavel: 'Gabriel', squad: 'Beta', origem: 'WhatsApp', criadoEm: '09 Fev, 2026' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Leads Central</h2>
          <p className="text-slate-500 font-medium mt-1">Gerencie todos os contatos prospectados no pipeline.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Upload size={18} />
            Importar
          </button>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa ou consultor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px]">
                <option>Todas as Fases</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lead & Empresa</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fase Atual</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Est.</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Responsável</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Origem</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                        {lead.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight">{lead.name}</p>
                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      {lead.fase}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{lead.valor}</p>
                  </td>
                  <td className="px-6 py-6">
                    {lead.responsavel ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-slate-400">
                          {lead.responsavel.substring(0, 1)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{lead.responsavel}</span>
                      </div>
                    ) : (
                      <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors">
                        <UserPlus size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Assumir</span>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.origem}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-xs font-bold text-slate-400">{lead.criadoEm}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-50 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">
            Carregar mais leads
          </button>
        </div>
      </div>

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} />
      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Leads;
