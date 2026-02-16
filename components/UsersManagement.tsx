
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
      // Filtramos perfis que pertencem ao mesmo user_id ou organizacao (simulado por user_id aqui)
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

  const stats = useMemo(() => {
    const total = users.length;
    return [
      { label: 'Sua Equipe', value: total.toString(), trend: 'Membros Ativos', icon: <Users size={18}/> },
      { label: 'Status Base', value: 'Isolado', trend: 'SQL Personal', icon: <Database size={18}/> },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Management</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm group">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4 px-8">
             <UserPlus size={40} className="mx-auto" />
             <p className="text-sm font-bold uppercase tracking-widest">Nenhum membro cadastrado por você</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Membro & E-mail</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Permissão</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <p className="font-bold text-slate-900 uppercase text-sm">{u.full_name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-slate-50 border border-slate-100">
                         {u.role || 'Membro'}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18}/></button>
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
        user={user}
      />
    </div>
  );
};

export default UsersManagement;
