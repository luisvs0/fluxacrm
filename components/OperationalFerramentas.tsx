
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

interface OperationalFerramentasProps {
  user: any;
}

const OperationalFerramentas: React.FC<OperationalFerramentasProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('tools').select('*').eq('user_id', user.id).order('name');
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
  }, [user]);

  const stats = useMemo(() => {
    const activeTools = tools.filter(t => t.status === 'Ativo');
    const totalSaaS = activeTools.reduce((acc, t) => acc + (Number(t.price) || 0), 0);
    
    return [
      { label: 'Suas Licenças', value: activeTools.length.toString(), trend: 'Stack Isolada', icon: <Layers size={18} />, color: 'blue' },
      { label: 'Custo Mensal', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaaS), trend: 'Custo da Conta', icon: <DollarSign size={18} />, color: 'slate' },
    ];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Minha Stack SQL</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Suas Ferramentas</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Nova Ferramenta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm group">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{m.label}</p>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight text-slate-900`}>{isLoading ? '...' : m.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden min-h-[450px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Dados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ferramenta</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 uppercase">{tool.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{tool.provider}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tool.price || 0)}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${tool.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50'}`}>
                         {tool.status}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => { setIsNewToolModalOpen(false); fetchTools(); }} user={user} />
    </div>
  );
};

export default OperationalFerramentas;
