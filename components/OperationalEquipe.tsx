
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown, 
  Wallet,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Loader2,
  Database,
  RefreshCcw,
  Edit3,
  TrendingUp,
  Heart,
  Users2
} from 'lucide-react';
import NewMemberModal from './NewMemberModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface OperationalEquipeProps {
  user: any;
}

const OperationalEquipe: React.FC<OperationalEquipeProps> = ({ user }) => {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('team_members').select('*').eq('user_id', user.id).order('name');
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Erro Equipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const payrollTotal = useMemo(() => {
    return members.reduce((acc, m) => acc + (Number(m.salary_value) || 0), 0);
  }, [members]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <Users size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Human Resources SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Minha <span className="text-[#203267] not-italic">Equipe</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão isolada de capital humano e custos operacionais</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewMemberModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Membro
          </button>
          <button onClick={fetchMembers} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Membros" value={members.length.toString()} subtitle="Ativos em Organograma" icon={<UserCheck />} color="blue" />
          <StatCard title="Burn Rate (Mês)" value={formatCurrency(payrollTotal)} subtitle="Custo Operacional Estimado" icon={<Wallet />} color="blue" />
          <StatCard title="Squads Ativos" value="3" subtitle="Estruturas em Célula" icon={<Database />} color="blue" />
          <StatCard title="Health Score Time" value="92%" subtitle="Clima e Performance" icon={<Heart />} color="emerald" />
        </div>

        {/* Toolbar & Table */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar colaborador por nome, cargo ou permissão..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Human Node Ledger</span>
               <div className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Membro & Especialidade</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Tipo Vínculo</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Custo Mensal (Ref)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mapeando Talentos SQL...</p>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-48 text-center opacity-30">
                         <Users2 size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum colaborador localizado</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-md flex items-center justify-center font-black text-xs italic group-hover:scale-105 transition-transform">
                              {member.name?.substring(0,1).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[250px] group-hover:text-[#203267] transition-colors">{member.name}</p>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{member.role || 'Colaborador'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className="text-[10px] font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-md uppercase tracking-tight shadow-sm">
                             {member.type || 'Funcionário'}
                           </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <p className="text-lg font-black text-slate-900 tracking-tighter italic">{formatCurrency(member.salary_value || 0)}</p>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                             member.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-300'
                           }`}>
                             {member.status || 'Ativo'}
                           </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all active:scale-90">
                              <MoreVertical size={20} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => { setIsNewMemberModalOpen(false); fetchMembers(); }} user={user} />
    </div>
  );
};

export default OperationalEquipe;
