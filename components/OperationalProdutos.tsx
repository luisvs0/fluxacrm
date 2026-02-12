
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ChevronDown,
  Filter,
  Zap,
  Clock,
  TrendingUp,
  BarChart3,
  MoreVertical,
  Layers,
  Repeat,
  ShoppingBag
} from 'lucide-react';
import NewProductModal from './NewProductModal';

const OperationalProdutos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  const stats = [
    { label: 'Produtos Ativos', value: '14', trend: '2 novos', icon: <Package size={18}/> },
    { label: 'Ticket Médio', value: 'R$ 4.850', trend: '+12%', icon: <TrendingUp size={18}/> },
    { label: 'SLA de Entrega', value: '4.2 dias', trend: '-0.5d', icon: <Clock size={18}/> },
    { label: 'Produtividade', value: '92%', trend: '+5%', icon: <Zap size={18}/> },
  ];

  const products = [
    { id: 1, name: 'Gestão de Tráfego Paid', type: 'Recorrente', sla: '5 dias', responsible: 'Marketing', status: 'Ativo' },
    { id: 2, name: 'Auditoria Financeira', type: 'Único', sla: '10 dias', responsible: 'Financeiro', status: 'Ativo' },
    { id: 3, name: 'Setup de CRM', type: 'Único', sla: '3 dias', responsible: 'Comercial', status: 'Ativo' },
    { id: 4, name: 'Consultoria Estratégica', type: 'Recorrente', sla: '7 dias', responsible: 'CS', status: 'Inativo' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Catálogo de Serviços</h2>
            <p className="text-slate-500 font-medium mt-1">Configuração de produtos, SLAs e unidades operacionais.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Product KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">{stat.trend} vs anterior</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar produto por nome ou setor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] tracking-widest">
                <option>Todos os Tipos</option>
                <option>Recorrente</option>
                <option>Único</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Products Matrix */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${product.status === 'Ativo' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'} transition-colors`}>
                        <Layers size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.responsible}</p>
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
                    <span className="text-xs font-black text-slate-900">{product.sla}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                      product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      'bg-slate-50 text-slate-400 border border-slate-100'
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
      </div>

      <NewProductModal isOpen={isNewProductModalOpen} onClose={() => setIsNewProductModalOpen(false)} />
    </div>
  );
};

export default OperationalProdutos;
