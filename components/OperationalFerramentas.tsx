
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Plus, 
  DollarSign, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  Layers,
  Zap,
  Loader2,
  Database,
  RefreshCcw,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import NewToolModal from './NewToolModal';
import { supabase } from '../lib/supabase';

const OperationalFerramentas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('tools').select('*').order('name');
      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Erro Ferramentas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const stats = useMemo(() => {
    const activeTools = tools.filter(t => t.status === 'Ativo');
    const totalSaaS = activeTools.reduce((acc, t) => acc + (Number(t.price) || 0), 0);
    const activeCount = activeTools.length;
    
    return [
      { label: 'Licenças Ativas', value: activeCount.toString(), trend: 'Stack Atual', icon: <Layers size={18} />, color: 'blue' },
      { label: 'Burn Rate (SaaS)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaaS), trend: 'Custo Mensal', icon: <DollarSign size={18} />, color: 'slate' },
      { label: 'Segurança SQL', value: '100%', trend: 'Auditado', icon: <ShieldCheck size={18} />, color: 'emerald' },
      { label: 'Próx. Renovação', value: 'Dia 05', trend: 'AWS Cloud', icon: <Clock size={18} />, color: 'blue' },
    ];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.provider?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Wrench size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stack Infrastructure Realtime</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Ferramentas & Licenças</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Nova Ferramenta
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
            </div>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight text-slate-900`}>{isLoading ? '...' : m.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{m.trend}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar ferramenta ou provedor no banco..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600 placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-2 pr-0 lg:pr-2 w-full lg:w-auto">
           <button onClick={fetchTools} className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-all shadow-sm">
             <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
           </button>
           <button className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all shadow-sm">
             <Filter size={18}/>
           </button>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Stack Tecnológica...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ferramenta & Provedor</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Categoria</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ciclo de Cobrança</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-md group-hover:scale-110 transition-transform ${tool.status === 'Ativo' ? 'bg-slate-900 text-white italic' : 'bg-slate-100 text-slate-400'}`}>
                          {tool.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{tool.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{tool.provider || 'S/P'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-widest">
                        {tool.category || 'SaaS Infrastructure'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tool.price || 0)}
                      </p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{tool.recurrence || 'Mensal'}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                          <span className="text-xs font-black text-slate-700">Dia {tool.billing_day || '01'}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Renovação SQL</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <ExternalLink size={18} />
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

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => { setIsNewToolModalOpen(false); fetchTools(); }} />
    </div>
  );
};

export default OperationalFerramentas;
