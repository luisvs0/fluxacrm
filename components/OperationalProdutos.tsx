
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
  Database
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
      { label: 'Produtos Ativos', value: active.toString(), trend: 'Em catálogo', icon: <Package size={18}/> },
      { label: 'SLA de Entrega', value: `${avgSLA} dias`, trend: 'Média global', icon: <Clock size={18}/> },
      { label: 'Setores Ativos', value: Array.from(new Set(products.map(p => p.responsible_unit))).length.toString(), trend: 'Unidades Org.', icon: <Layers size={18}/> },
      { label: 'Total de ITENS', value: products.length.toString(), trend: 'Auditado', icon: <Zap size={18}/> },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.responsible_unit?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Package size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Management</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Catálogo de Serviços</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar produto por nome ou setor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600"
          />
        </div>
        <button onClick={fetchProducts} className="mr-2 p-2.5 text-slate-400 hover:text-slate-900"><Filter size={18}/></button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Catálogo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Produto & Setor</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">SLA Padrão</th>
                  <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${product.status === 'Ativo' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.responsible_unit || 'Geral'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                         {product.type === 'Recorrente' ? <Repeat size={14} className="text-blue-500" /> : <ShoppingBag size={14} className="text-amber-500" />}
                         <span className="text-xs font-bold text-slate-600">{product.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-black text-slate-900">{product.sla_days} dias</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                        product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
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
