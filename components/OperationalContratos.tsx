
import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  ChevronDown,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MoreVertical,
  Calendar
} from 'lucide-react';
import NewContractModal from './NewContractModal';

const OperationalContratos: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  const stats = [
    { label: 'MRR Contratual', value: 'R$ 142.500', trend: '+8%', icon: <CreditCard size={18}/> },
    { label: 'Contratos Ativos', value: '38', trend: '2 novos', icon: <CheckCircle2 size={18}/> },
    { label: 'A vencer (30d)', value: '5', trend: 'R$ 12k', icon: <Clock size={18}/> },
    { label: 'Em Renegociação', value: '2', trend: 'R$ 4.5k', icon: <AlertCircle size={18}/> },
  ];

  const contracts = [
    { id: 1, client: 'Sirius Tecnologia', value: 'R$ 15.000,00', start: '12/01/2024', end: '12/01/2025', status: 'Em vigor' },
    { id: 2, client: 'Grupo Omni', value: 'R$ 8.500,00', start: '05/02/2024', end: '05/02/2025', status: 'Vencendo' },
    { id: 3, client: 'Logic Logística', value: 'R$ 4.200,00', start: '20/11/2023', end: '20/11/2024', status: 'Em vigor' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Gestão de Contratos</h2>
            <p className="text-slate-500 font-medium mt-1">Controle de vigência, recorrência e saúde financeira.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewContractModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Novo Contrato
        </button>
      </div>

      {/* Contract KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight size={14} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou número do contrato..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px] tracking-widest">
                <option>Todos os Status</option>
                <option>Em vigor</option>
                <option>Vencendo</option>
                <option>Encerrados</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Início</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Término</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{contract.client}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">CTR-00{contract.id}2024</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{contract.value}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-bold text-slate-500">{contract.start}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-bold text-slate-500">{contract.end}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                      contract.status === 'Em vigor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
            Ver histórico completo <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <NewContractModal isOpen={isNewContractModalOpen} onClose={() => setIsNewContractModalOpen(false)} />
    </div>
  );
};

export default OperationalContratos;
