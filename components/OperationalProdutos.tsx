
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

  const stats = useMemo(() => {
    const active = products.filter(p => p.status === 'Ativo').length;
    return [
      { label: 'Seus Itens', value: products.length.toString(), trend: 'Base Auditada', icon: <Package size={18}/> },
      { label: 'Ativos', value: active.toString(), trend: 'Disponíveis', icon: <Zap size={18}/> },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Meus Produtos</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Novo Produto
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
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Catálogo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto & SLA</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.sla_days} dias SLA</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                        product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {product.status}
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

      <NewProductModal isOpen={isNewProductModalOpen} onClose={() => { setIsNewProductModalOpen(false); fetchProducts(); }} user={user} />
    </div>
  );
};

export default OperationalProdutos;
