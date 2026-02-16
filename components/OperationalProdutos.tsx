
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ChevronDown,
  Filter,
  Zap,
  Clock,
  TrendingUp,
  MoreVertical,
  Layers,
  Repeat,
  ShoppingBag,
  Loader2,
  Database,
  RefreshCcw,
  Target
} from 'lucide-react';
import NewProductModal from './NewProductModal';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface OperationalProdutosProps {
  user: any;
}

const OperationalProdutos: React.FC<OperationalProdutosProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('user_id', user.id).order('name');
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erro produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

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
                <Package size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Catalog Management SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Meus <span className="text-[#203267] not-italic">Produtos</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão de ativos e serviços do catálogo operacional</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsNewProductModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Produto
          </button>
          <button onClick={fetchProducts} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total de Itens" value={products.length.toString()} subtitle="Base Auditada" icon={<Package />} color="blue" />
          <StatCard title="Produtos Ativos" value={products.filter(p => p.status === 'Ativo').length.toString()} subtitle="Disponíveis para Contrato" icon={<Zap />} color="emerald" />
          <StatCard title="Avg. SLA" value="5.2 Dias" subtitle="Performance Operacional" icon={<Clock />} color="blue" />
          <StatCard title="Share de Vendas" value="84%" subtitle="Penetração em Base" icon={<Target />} color="blue" showInfo />
        </div>

        {/* Toolbar & Table */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 lg:max-w-2xl group pl-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome do produto ou SLA..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
               <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Catalog Node Sync</span>
               <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Produto & Identificação</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Tipo</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">SLA de Entrega</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status Ativo</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Catálogo SQL...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-48 text-center opacity-30">
                         <Package size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum item localizado na base</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-md flex items-center justify-center font-black text-xs italic group-hover:scale-105 transition-transform">
                              {product.name?.substring(0,1).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[300px] group-hover:text-[#203267] transition-colors">{product.name}</p>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic line-clamp-1">{product.description || 'Sem descrição técnica'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className="text-[10px] font-black text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1 rounded-md uppercase tracking-tight">
                             {product.type || 'Recorrente'}
                           </span>
                        </td>
                        <td className="px-8 py-8 text-center">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#203267] px-4 py-2 rounded-lg border border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                               <Clock size={14} className="text-blue-500" />
                               <span className="text-sm font-black tracking-tighter">{product.sla_days || '0'} Dias</span>
                            </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                             product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-300'
                           }`}>
                             {product.status}
                           </span>
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

      <NewProductModal isOpen={isNewProductModalOpen} onClose={() => { setIsNewProductModalOpen(false); fetchProducts(); }} user={user} />
    </div>
  );
};

export default OperationalProdutos;
