
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
  ExternalLink
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
    const totalSaaS = tools.filter(t => t.status === 'Ativo').reduce((acc, t) => acc + (Number(t.price) || 0), 0);
    const activeCount = tools.filter(t => t.status === 'Ativo').length;
    
    return [
      { label: 'Assinaturas Ativas', value: activeCount.toString(), trend: 'Ativos no SQL', icon: <Layers size={18} />, color: 'text-blue-600' },
      { label: 'Burn Rate (SaaS)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaaS), trend: 'Custo Mensal', icon: <DollarSign size={18} />, color: 'text-slate-900' },
      { label: 'Otimização', value: '12%', trend: 'Savings Q1', icon: <Zap size={18} />, color: 'text-emerald-500' },
    ];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.provider?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Wrench size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stack Infrastructure</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Ferramentas & Licenças</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Nova Ferramenta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${m.color}`}>{isLoading ? '...' : m.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{m.trend}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar ferramenta ou provedor..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>
        <button onClick={fetchTools} className="p-2.5 text-slate-400 hover:text-slate-900 mr-2"><RefreshCcw size={18}/></button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Stack Tecnológica...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ferramenta & Provedor</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Setor</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Preço Mensal</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Cobrança</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform ${tool.status === 'Ativo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {tool.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{tool.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{tool.provider || 'S/P'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-wider">
                        {tool.category || 'Geral'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tool.price || 0)}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="text-xs font-bold text-slate-700">Dia {tool.billing_day || '01'}</span>
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
      </div>

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => { setIsNewToolModalOpen(false); fetchTools(); }} />
    </div>
  );
};

export default OperationalFerramentas;
