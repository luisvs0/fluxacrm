
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown, 
  Calendar, 
  X, 
  Eye, 
  Edit3,
  Building2,
  Wallet,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  CreditCard,
  UserCheck
} from 'lucide-react';
import NewMemberModal from './NewMemberModal';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  costCenter: string;
  value: string;
  status: string;
  totalPaid: string;
}

const OperationalEquipe: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('Ativos');
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);

  const members: TeamMember[] = [
    { id: '1', name: 'Gabriel Dantras', initials: 'GD', role: 'bdr executive', costCenter: 'Comercial', value: 'R$ 8.500,00', status: 'Ativo', totalPaid: 'R$ 68.000' },
    { id: '2', name: 'Kyros Financial', initials: 'K', role: 'founder', costCenter: 'Diretoria', value: 'R$ 15.000,00', status: 'Ativo', totalPaid: 'R$ 180.000' },
    { id: '3', name: 'Lucca Hurtado', initials: 'LH', role: 'tech lead', costCenter: 'Operacional', value: 'R$ 12.000,00', status: 'Ativo', totalPaid: 'R$ 144.000' },
    { id: '4', name: 'Luis Venx', initials: 'LV', role: 'fullstack dev', costCenter: 'Operacional', value: 'R$ 9.200,00', status: 'Ativo', totalPaid: 'R$ 92.000' },
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
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Células de Talento</h2>
            <p className="text-slate-500 font-medium mt-1">Gestão de capital humano, cargos e alocação de recursos.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewMemberModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Novo Membro
        </button>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total da Equipe</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">18 Membros</h3>
            <UserCheck size={20} className="text-blue-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Folha Mensal (Ref)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 84.500</h3>
            <Wallet size={20} className="text-emerald-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Retenção (eNPS)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">88/100</h3>
            <ShieldCheck size={20} className="text-indigo-500 opacity-20" />
          </div>
        </div>
        <div className="bg-[#002147] rounded-[1.75rem] p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Lançamentos em Aberto</p>
            <h3 className="text-2xl font-bold tracking-tight">R$ 12.400</h3>
            <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-widest">Aguardando Aprovação</p>
          </div>
          <CreditCard className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, cargo ou centro de custo..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px] tracking-widest">
                <option>Todos os Status</option>
                <option>Ativos</option>
                <option>Inativos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Membro & Cargo</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Centro de Custo</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Pago (Acum)</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{member.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-wider">
                      {member.costCenter}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{member.value}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-sm font-bold text-slate-400">{member.totalPaid}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit3 size={18} />
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
      </div>

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => setIsNewMemberModalOpen(false)} />
    </div>
  );
};

export default OperationalEquipe;
