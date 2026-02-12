
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Plus, 
  ChevronDown, 
  Calendar, 
  PieChart,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  MoreVertical
} from 'lucide-react';
import NewCostCenterModal from './NewCostCenterModal';
import ExportPDFModal from './ExportPDFModal';

const CostCenters: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Anual');

  const mockCenters = [
    { id: 1, name: 'Operacional / CS', value: 'R$ 45.200,00', budget: 'R$ 50.000', perc: 90.4, color: 'bg-blue-600' },
    { id: 2, name: 'Marketing & Growth', value: 'R$ 28.900,00', budget: 'R$ 35.000', perc: 82.5, color: 'bg-rose-500' },
    { id: 3, name: 'Infraestrutura Cloud', value: 'R$ 12.450,50', budget: 'R$ 15.000', perc: 83.0, color: 'bg-emerald-500' },
    { id: 4, name: 'Administrativo / RH', value: 'R$ 8.300,00', budget: 'R$ 10.000', perc: 83.0, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Centros de Custo</h2>
          <p className="text-slate-500 font-medium mt-1">Alocação estratégica de recursos por departamento.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={18} />
            Relatórios
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Centro
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Alocado</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 94.850,50</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <ArrowDownLeft size={14} /> Dentro do budget
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Maior Centro</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Operacional</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">47.6% do faturamento</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Eficiência Médio</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">84.2%</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Utilização de orçamento</p>
        </div>
        <div className="bg-[#002147] rounded-[1.75rem] p-6 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Meta de Savings</p>
            <h3 className="text-2xl font-bold tracking-tight">R$ 12.000</h3>
            <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-widest">Ativo</p>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Main List & Analysis Area */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
            {['Anual', 'Mensal', 'Q1'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedPeriod(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedPeriod === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCenters.map((center) => (
            <div key={center.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight uppercase">{center.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Orçamento: {center.budget}</p>
                </div>
                <button className="text-slate-200 hover:text-slate-900 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">{center.value}</span>
                  <span className="text-xs font-bold text-slate-400">{center.perc}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${center.color} transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${center.perc}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                    ID: 000{center.id}
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Regular
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 transition-all group"
          >
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all">
              <Plus size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Novo Centro</p>
              <p className="text-xs text-slate-400 font-medium">Clique para adicionar um departamento</p>
            </div>
          </button>
        </div>
      </div>

      <NewCostCenterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default CostCenters;
