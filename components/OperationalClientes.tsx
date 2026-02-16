
import React, { useState, useEffect, useMemo } from 'react';
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
  Target,
  Loader2,
  Database,
  RefreshCcw,
  Heart
} from 'lucide-react';
import NewClientModal from './NewClientModal';
import { supabase } from '../lib/supabase';

interface OperationalClientesProps {
  user: any;
}

const OperationalClientes: React.FC<OperationalClientesProps> = ({ user }) => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.segment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const stats = useMemo(() => {
    const totalActive = clients.filter(c => c.status === 'Ativo').length;
    const mrrTotal = clients.reduce((acc, curr) => acc + (Number(curr.mrr_value) || 0), 0);
    const avgHealth = clients.length > 0 
      ? Math.round(clients.reduce((acc, curr) => acc + (Number(curr.health_score) || 0), 0) / clients.length) 
      : 0;

    return {
      totalActive,
      mrrTotal,
      avgHealth
    };
  }, [clients]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

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
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sua Base SQL</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Meus Clientes</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewClientModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total de Ativos</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.totalActive} Contas`}</h3>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRR Total</p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">{isLoading ? '...' : formatCurrency(stats.mrrTotal)}</h3>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Saúde da Base</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Heart size={18} />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.avgHealth}%`}</h3>
        </div>

        <div className="bg-[#002147] rounded-[1.75rem] p-5 md:p-6 shadow-xl text-white relative overflow-hidden">
          <p className="text-[10px] md:text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Sua Base Total</p>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">{clients.length} Clientes</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Dados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente & Status</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">MRR Atual</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Health Score</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md italic">
                          {client.name?.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[200px]">{client.name}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">{formatCurrency(client.mrr_value || 0)}</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                          (client.health_score || 0) >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {client.health_score}%
                        </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => { setIsNewClientModalOpen(false); fetchClients(); }} user={user} />
    </div>
  );
};

export default OperationalClientes;
