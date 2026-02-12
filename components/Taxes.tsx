
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  FileText, 
  Percent, 
  CheckCircle2, 
  Clock,
  CreditCard,
  Receipt
} from 'lucide-react';
import NewTaxModal from './NewTaxModal';

const Taxes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tributos');
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Impostos & Taxas</h2>
              <p className="text-sm text-gray-500 font-medium">Gerencie tributos e taxas de provedores de pagamento</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 bg-[#f1f5f9] rounded-xl border border-gray-100">
            <button 
              onClick={() => setActiveTab('Tributos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Tributos' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FileText size={14} />
              Tributos
            </button>
            <button 
              onClick={() => setActiveTab('Taxas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'Taxas' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CreditCard size={14} />
              Taxas de Pagamento
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsNewTaxModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Tributo
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tributos Ativos */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tributos Ativos</p>
            <p className="text-2xl font-bold text-blue-700">0</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Receipt size={22} />
          </div>
        </div>

        {/* Estimativa Mensal */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-gray-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimativa Mensal</p>
            <p className="text-2xl font-bold text-gray-700">R$ 0,00</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Baseado nas taxas cadastradas</p>
          </div>
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
            <Percent size={22} />
          </div>
        </div>

        {/* Total Pago */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pago</p>
            <p className="text-2xl font-bold text-emerald-500">R$ 0,00</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Total Pendente */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-orange-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pendente</p>
            <p className="text-2xl font-bold text-orange-400">R$ 0,00</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-400 rounded-xl flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Status</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
                <option>Pago</option>
                <option>Pendente</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tipo</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
                <option>Federal</option>
                <option>Estadual</option>
                <option>Municipal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data Inicial</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="01/02/2026"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 text-gray-700 font-medium"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data Final</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="28/02/2026"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 text-gray-700 font-medium"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area / Empty State */}
      <div className="bg-white border border-gray-100 rounded-2xl min-h-[160px] flex items-center justify-center p-12 text-center shadow-sm">
        <p className="text-gray-400 font-medium text-lg tracking-tight">Nenhum tributo cadastrado.</p>
      </div>

      {/* New Tax Modal Integration */}
      <NewTaxModal 
        isOpen={isNewTaxModalOpen} 
        onClose={() => setIsNewTaxModalOpen(false)} 
      />

    </div>
  );
};

export default Taxes;
