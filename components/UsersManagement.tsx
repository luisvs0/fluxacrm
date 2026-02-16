
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Database, 
  Loader2, 
  RefreshCcw,
  Search,
  Filter,
  Users,
  ShieldAlert,
  Clock,
  UserCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewUserModal from './NewUserModal';
import StatCard from './StatCard';

interface UsersManagementProps {
  user: any;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ user }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Erro usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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
                <UserCheck size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Access Control SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Equipe <span className="text-[#203267] not-italic">& Acessos</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão de permissões e governança da conta isolada</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewUserModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <UserPlus size={18} strokeWidth={3} /> Convidar Membro
          </button>
          <button onClick={fetchUsers} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Assentos Ativos" value={users.length.toString()} subtitle="Membros em Organograma" icon={<Users />} color="blue" />
          <StatCard title="Protocolo Base" value="Isolado" subtitle="SQL Personal Ledger" icon={<Database />} color="emerald" />
          <StatCard title="Node Status" value="Online" subtitle="Synchronized Agent" icon={<Activity size={24}/>} color="blue" />
          <StatCard title="Integridade" value="100%" subtitle="Security Compliance" icon={<ShieldCheck />} color="blue" showInfo />
        </div>

        {/* Toolbar & Table */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome, e-mail ou nível de acesso..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Auth Node Sync</span>
               <div className="relative w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Membro & E-mail Profissional</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Nível de Permissão</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Último Acesso</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Acessos SQL...</p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-48 text-center opacity-30">
                         <Users size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum membro localizado nesta conta</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-md flex items-center justify-center font-black text-xs italic group-hover:scale-105 transition-transform">
                              {u.full_name?.substring(0,1).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[250px] group-hover:text-[#203267] transition-colors">{u.full_name}</p>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className="text-[10px] font-black text-slate-900 bg-white border border-slate-300 px-4 py-2 rounded-md uppercase tracking-tight shadow-sm">
                             {u.role || 'Membro'}
                           </span>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-900 uppercase">Hoje</span>
                              <span className="text-[8px] font-black text-emerald-500 uppercase mt-1 tracking-tighter italic">Sessão Ativa</span>
                           </div>
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

      <NewUserModal 
        isOpen={isNewUserModalOpen} 
        onClose={() => { setIsNewUserModalOpen(false); fetchUsers(); }} 
        user={user}
      />
    </div>
  );
};

export default UsersManagement;
