
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

const OperationalProdutos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
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
  }, []);

  const stats = useMemo(() => {
    const active = products.filter(p => p.status === 'Ativo' || p.status === 'Active').length;
    const avgSLA = products.length > 0 ? (products.reduce((acc, p) => acc + (p.sla_days || 0), 0) / products.length).toFixed(1) : '0';
    
    return [
      { label: 'Itens em Catálogo', value: products.length.toString(), trend: 'Base Auditada', icon: <Package size={18}/>, color: 'blue' },
      { label: 'Produtos Ativos', value: active.toString(), trend: 'Disponíveis', icon: <Zap size={18}/>, color: 'emerald' },
      { label: 'Avg. SLA Entrega', value: `${avgSLA} dias`, trend: 'Média de Fluxo', icon: <Clock size={18}/>, color: 'indigo' },
      { label: 'Unidades Org.', value: Array.from(new Set(products.map(p => p.responsible_unit))).length.toString(), trend: 'Setores Responsáveis', icon: <Layers size={18}/>, color: 'blue' },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.responsible_unit?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Package size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Management</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Catálogo de Serviços</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-2xl md:rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar produto por nome ou unidade responsável..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 pr-0 lg:pr-2 w-full lg:w-auto">
           <button onClick={fetchProducts} className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-all shadow-sm">
             <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
           </button>
           <button className="flex-1 lg:flex-none p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all shadow-sm">
             <Filter size={18}/>
           </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Catálogo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto & Setor</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo de Entrega</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA Padrão</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${product.status === 'Ativo' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'} group-hover:scale-110 transition-transform shadow-sm`}>
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.responsible_unit || 'Geral'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                         {product.type === 'Recorrente' ? <Repeat size={14} className="text-blue-500" /> : <ShoppingBag size={14} className="text-amber-500" />}
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{product.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-sm font-black text-slate-900 tracking-tighter">{product.sla_days} dias</span>
                      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">lead time médio</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                        product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-100">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewProductModal isOpen={isNewProductModalOpen} onClose={() => { setIsNewProductModalOpen(false); fetchProducts(); }} />
    </div>
  );
};

export default OperationalProdutos;
