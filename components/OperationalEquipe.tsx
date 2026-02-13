
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
  Heart
} from 'lucide-react';
import NewMemberModal from './NewMemberModal';
import { supabase } from '../lib/supabase';

const OperationalEquipe: React.FC = () => {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('team_members').select('*').order('name');
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
  }, []);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === 'Ativo').length;
    const payroll = members.reduce((acc, m) => acc + (Number(m.salary_value) || 0), 0);
    
    return [
      { label: 'Total da Equipe', value: `${total} Membros`, icon: <UserCheck size={20}/>, color: 'blue' },
      { label: 'Burn Rate (Folha)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payroll), icon: <Wallet size={20}/>, color: 'slate' },
      { label: 'Retenção (eNPS)', value: '88/100', icon: <Heart size={20}/>, color: 'rose' },
      { label: 'Contratações Ativas', value: active.toString(), icon: <TrendingUp size={20}/>, color: 'emerald' },
    ];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Human Capital Data Sync</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Células de Talento</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewMemberModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Novo Membro
        </button>
      </div>

      {/* HR Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">{isLoading ? '...' : stat.value}</h3>
              <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, cargo ou squad..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600 placeholder:text-slate-300"
          />
        </div>
        <button onClick={fetchMembers} className="hidden lg:flex p-2.5 text-slate-400 hover:text-slate-900 mr-2 bg-slate-50 rounded-xl">
           <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Members List */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Organograma...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro & Especialidade</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Centro de Custo</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Folha Mensal</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform italic">
                          {member.name.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{member.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{member.role || 'Generalista'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                        {member.cost_center || 'Operacional'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(member.salary_value || 0)}
                      </p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Base Auditoria</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                        member.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {member.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => { setIsNewMemberModalOpen(false); fetchMembers(); }} />
    </div>
  );
};

export default OperationalEquipe;
