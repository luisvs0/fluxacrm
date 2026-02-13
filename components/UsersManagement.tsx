
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
  UserCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewUserModal from './NewUserModal';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'Administrador').length;
    return [
      { label: 'Total do Time', value: total.toString(), trend: 'Membros Ativos', icon: <Users size={18}/> },
      { label: 'Administradores', value: admins.toString(), trend: 'Full Access', icon: <ShieldCheck size={18}/> },
      { label: 'Status da Base', value: 'Sincronizada', trend: 'SQL Realtime', icon: <Database size={18}/> },
      { label: 'Acessos Hoje', value: '12', trend: 'Logs de Login', icon: <Clock size={18}/> },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Management SQL</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Equipe & Acessos</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewUserModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus size={18} /> Convidar Membro
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Toolbar Adaptável */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-0 lg:pr-2 w-full lg:w-auto">
           <button onClick={fetchUsers} className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
             <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
             <span className="lg:hidden text-[10px] font-black uppercase tracking-widest">Atualizar</span>
           </button>
           <button className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
             <Filter size={18} />
             <span className="lg:hidden text-[10px] font-black uppercase tracking-widest">Filtros</span>
           </button>
        </div>
      </div>

      {/* Users Data Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4 px-8">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300">
                <UserPlus size={40} />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest">Nenhum membro encontrado na base SQL</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Membro & E-mail</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Permissão</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform italic shrink-0">
                          {(user.full_name || 'U').substring(0,1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 uppercase tracking-tight text-sm truncate">{user.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border shadow-sm ${
                         user.role === 'Administrador' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                       }`}>
                         {user.role || 'Membro'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm inline-flex items-center gap-1.5">
                         <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                         Ativo
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-100">
                        <MoreVertical size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewUserModal 
        isOpen={isNewUserModalOpen} 
        onClose={() => { setIsNewUserModalOpen(false); fetchUsers(); }} 
      />
    </div>
  );
};

export default UsersManagement;
