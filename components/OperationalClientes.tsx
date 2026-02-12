
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Filter,
  ArrowUpRight,
  Activity,
  Target
} from 'lucide-react';
import NewClientModal from './NewClientModal';

const OperationalClientes: React.FC = () => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const clients = [
    { id: 1, name: 'SIRIUS TECNOLOGIA', initials: 'ST', segment: 'Software/SaaS', mrr: 'R$ 15.000,00', status: 'Ativo', health: 'Saudável' },
    { id: 2, name: 'GRUPO OMNI', initials: 'GO', segment: 'Varejo', mrr: 'R$ 8.500,00', status: 'Ativo', health: 'Atencão' },
    { id: 3, name: 'LOGIC LOGÍSTICA', initials: 'LL', segment: 'Transporte', mrr: 'R$ 4.200,00', status: 'Inativo', health: 'Churn' },
    { id: 4, name: 'AGÊNCIA MATRIX', initials: 'AM', segment: 'Marketing', mrr: 'R$ 12.000,00', status: 'Ativo', health: 'Saudável' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Portfólio de Clientes</h2>
            <p className="text-slate-500 font-medium mt-1">Gestão de sucesso, retenção e saúde da base ativa.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewClientModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total de Ativos</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">42 Contas</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={14} /> +2 este mês
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRR Total</p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 184.200</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Ticket Médio: R$ 4.385</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Saúde da Base</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">92.4%</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1">Score: Saudável</p>
        </div>

        <div className="bg-[#002147] rounded-[1.75rem] p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Churn Rate (30d)</p>
            <h3 className="text-2xl font-bold tracking-tight">2.1%</h3>
            <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-widest">Abaixo do Limite</p>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do cliente ou segmento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] tracking-widest">
                <option>Todos os Segmentos</option>
                <option>SaaS</option>
                <option>Varejo</option>
                <option>Serviços</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Premium Clients Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cliente & Status</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Segmento</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">MRR Atual</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Health Score</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{client.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'Ativo' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.status}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-wider">
                      {client.segment}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{client.mrr}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">recorrência</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                      client.health === 'Saudável' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      client.health === 'Atencão' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {client.health}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
            Ver portfólio completo <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => setIsNewClientModalOpen(false)} />
    </div>
  );
};

export default OperationalClientes;
