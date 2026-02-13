
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
  Filter
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

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Management SQL</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Equipe & Acessos</h2>
          <p className="text-sm font-medium text-gray-400">Gerencie permissões e usuários ativos na organização.</p>
        </div>
        <button 
          onClick={() => setIsNewUserModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95"
        >
          <UserPlus size={18} /> Convidar Membro
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600"
          />
        </div>
        <button onClick={fetchUsers} className="p-2.5 text-slate-400 hover:text-slate-900 mr-2 transition-all">
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30 text-center space-y-4">
             <UserPlus size={48} className="mx-auto" />
             <p className="text-sm font-bold uppercase tracking-widest">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cargo / Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user, i) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform italic">
                        {(user.full_name || 'U').substring(0,1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 uppercase tracking-tight text-sm">{user.full_name}</p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                       <ShieldCheck size={16} className="text-blue-500" />
                       <span className="text-sm font-bold text-gray-600">{user.role || 'Membro'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                       Ativo
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors bg-slate-50 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-100">
                      <MoreVertical size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
