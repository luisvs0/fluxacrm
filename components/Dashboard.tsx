
import React, { useState } from 'react';
import { 
  ChevronDown, 
  Settings2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users,
  Target,
  Maximize2,
  Edit2,
  CalendarDays,
  CircleDollarSign,
  Wallet,
  Info
} from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import RecentEntries from './RecentEntries';
import CustomersTable from './CustomersTable';

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');

  const periods = ['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano', 'Realizado'];
  
  const chartLabels = ['01/02', '02/02', '03/02', '04/02', '05/02', '06/02', '07/02', '08/02', '09/02', '10/02', '11/02', '12/02', '13/02', '14/02', '15/02', '16/02', '17/02', '18/02', '19/02', '20/02', '21/02', '22/02', '23/02', '24/02', '25/02', '26/02', '27/02', '28/02'];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-16 px-6 lg:px-8 mt-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1 text-gray-400 border-r border-gray-100">
            <CalendarDays size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Período:</span>
          </div>
          <div className="flex items-center gap-1 ml-1 overflow-x-auto no-scrollbar">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${selectedPeriod === period ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {period}
              </button>
            ))}
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-gray-900">
               <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all hover:border-gray-300">
            <Settings2 size={12} className="text-gray-400" />
            Avançado
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="hidden xl:flex items-center justify-end gap-6 px-4 text-[9px] font-black uppercase tracking-widest text-gray-400 border-l border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Visualizando:</span>
            <span className="text-blue-600">{selectedPeriod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Modo:</span>
            <span className="text-gray-900 font-bold tracking-tight">Realizado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Meta:</span>
            <span className="text-gray-900 font-bold tracking-tight">Mensal</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Entradas" value="R$ 0,00" subtitle="0 transações" icon={<ArrowDownLeft size={16} />} color="green" />
        <StatCard title="Saídas" value="R$ 0,00" subtitle="0 transações" icon={<ArrowUpRight size={16} />} color="red" />
        <StatCard title="Lucro Líquido" value="R$ 0,00" subtitle="% do LL — " icon={<TrendingUp size={16} />} color="emerald" info={<Info size={12} />} />
        <StatCard title="Ticket Médio" value="R$ 0,00" subtitle="0 clientes ativos" icon={<Users size={16} />} color="blue" />
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Meta Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col h-64 hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-[9px] font-black border border-gray-100 px-2.5 py-1 rounded-lg uppercase tracking-widest bg-gray-50 transition-colors">
              Mensal <ChevronDown size={10} />
            </button>
            <div className="flex gap-2">
              <button className="text-gray-300 hover:text-blue-600 transition-colors"><Edit2 size={12} /></button>
              <button className="text-gray-300 hover:text-gray-900 transition-colors"><Maximize2 size={12} /></button>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full border border-dashed border-gray-200 flex items-center justify-center text-gray-200 group-hover:border-blue-600 group-hover:text-blue-600 transition-all">
              <Target size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-3">Meta não definida</h3>
              <button className="bg-gray-900 hover:bg-blue-600 border border-gray-800 px-4 py-2 rounded-xl text-[9px] font-black text-white flex items-center gap-2 mx-auto transition-all transform hover:scale-105">
                <Target size={12} /> DEFINIR META
              </button>
            </div>
          </div>
        </div>

        {/* A Receber Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 h-64 flex flex-col hover:border-[#ffab00]/30 transition-all shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[#ffab00]">
            <CircleDollarSign size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">A Receber</span>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold tracking-tight text-gray-900">R$ 0,00</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total em aberto (atual + futuro)</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest">
                <span>Recebido</span>
                <span>Em aberto</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 flex overflow-hidden">
                 <div className="bg-[#ffab00] w-0 transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-600">
                <span>R$ 0,00</span>
                <span>R$ 0,00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase flex items-center gap-1"><Edit2 size={10} /> Pendências</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase flex items-center gap-1"><Users size={10} /> Clientes</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contas a Pagar Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 h-64 flex flex-col hover:border-red-500/30 transition-all shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <wallet size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contas a Pagar</span>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold tracking-tight text-gray-900">R$ 0,00</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">0 contas pendentes</div>
            </div>
            <div className="h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] text-center px-4 leading-relaxed">Nenhuma fatura em aberto</span>
            </div>
          </div>
        </div>

        {/* MRR Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 h-64 flex flex-col hover:border-cyan-600/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-cyan-600">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">MRR</span>
            </div>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] border border-gray-100 px-2 py-1 rounded-lg bg-gray-50">0 contratos</span>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold tracking-tight text-gray-900">R$ 0,00</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">Garantido mensalmente • <span className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer font-black underline underline-offset-4 decoration-blue-500/30">Detalhes</span></div>
            </div>
            <div className="h-24 flex items-center justify-center">
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.15em] text-center px-4 leading-relaxed">Nenhum contrato recorrente ativo no momento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wide Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title="Entradas x Saídas"
          legend={[
            { label: 'Entradas', color: '#10b981' },
            { label: 'Saídas', color: '#ef4444' }
          ]}
          xAxisLabels={chartLabels}
        />
        <ChartCard 
          title="Lucro Líquido por Período"
          xAxisLabels={chartLabels}
        />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentEntries />
        <CustomersTable />
      </div>
    </div>
  );
};

export default Dashboard;
