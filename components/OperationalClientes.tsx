
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
  Database
} from 'lucide-react';
import NewClientModal from './NewClientModal';
import { supabase } from '../lib/supabase';

const OperationalClientes: React.FC = () => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState('Todos os Segmentos');

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
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
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           client.segment?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === 'Todos os Segmentos' || client.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    });
  }, [clients, searchTerm, selectedSegment]);

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
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base SQL Sincronizada</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Portfólio de Clientes</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total de Ativos</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.totalActive} Contas`}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status Ativo no Banco</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRR Total</p>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : formatCurrency(stats.mrrTotal)}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Recorrência Mensal</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Saúde da Base</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.avgHealth}%`}</h3>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Score Médio</p>
        </div>

        <div className="bg-[#002147] rounded-[1.75rem] p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Base Total (SQL)</p>
            <h3 className="text-2xl font-bold tracking-tight">{clients.length} Clientes</h3>
            <p className="text-xs text-blue-400 font-bold mt-1 uppercase tracking-widest">Registros Auditados</p>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

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
              <select 
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] tracking-widest"
              >
                <option>Todos os Segmentos</option>
                <option>SaaS</option>
                <option>Varejo</option>
                <option>Serviços</option>
                <option>Educação</option>
                <option>Indústria</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button onClick={fetchClients} className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Engine de Dados...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
               <Users size={40} />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum cliente encontrado no banco</p>
             <button 
               onClick={() => setIsNewClientModalOpen(true)}
               className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
             >
               Cadastrar primeiro cliente
             </button>
          </div>
        ) : (
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
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform italic">
                          {client.name?.substring(0,1).toUpperCase()}
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
                        {client.segment || 'Geral'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">{formatCurrency(client.mrr_value || 0)}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">recorrência</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                        (client.health_score || 0) >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        (client.health_score || 0) >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {client.health_score}% - {(client.health_score || 0) >= 80 ? 'Saudável' : (client.health_score || 0) >= 50 ? 'Atenção' : 'Churn Risk'}
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
        )}
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
            Ver portfólio completo ({clients.length}) <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => { setIsNewClientModalOpen(false); fetchClients(); }} />
    </div>
  );
};

export default OperationalClientes;
