
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users, 
  Target, 
  RefreshCcw, 
  Loader2, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Wallet,
  Receipt,
  CircleDashed,
  Maximize2,
  Edit2,
  FileText,
  User,
  Database,
  Tv
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import RecentEntries from './RecentEntries';
import CustomersTable from './CustomersTable';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  
  const [metrics, setMetrics] = useState({
    entradas: 0,
    countIn: 0,
    saidas: 0,
    countOut: 0,
    lucro: 0,
    ticketMedio: 0,
    aReceber: 0,
    contasPagar: 0,
    countPagar: 0,
    mrr: 0,
    countContracts: 0,
    activeClients: 0
  });

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      const { data: contracts } = await supabase.from('contracts').select('amount').eq('status', 'ACTIVE').eq('user_id', user.id);
      const { count: clientCount } = await supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      if (txs) {
        const stats = txs.reduce((acc, curr) => {
          const val = Number(curr.amount);
          if (curr.type === 'IN') {
            if (curr.status === 'PAID') {
              acc.entradas += val;
              acc.countIn += 1;
            } else {
              acc.aReceber += val;
            }
          } else {
            if (curr.status === 'PAID') {
              acc.saidas += val;
              acc.countOut += 1;
            } else {
              acc.contasPagar += val;
              acc.countPagar += 1;
            }
          }
          return acc;
        }, { entradas: 0, countIn: 0, saidas: 0, countOut: 0, aReceber: 0, contasPagar: 0, countPagar: 0 });

        const totalMRR = contracts?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;

        setMetrics({
          ...stats,
          lucro: stats.entradas - stats.saidas,
          ticketMedio: stats.countIn > 0 ? stats.entradas / stats.countIn : 0,
          mrr: totalMRR,
          countContracts: contracts?.length || 0,
          activeClients: clientCount || 0
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-10">
      
      {/* Header Responsivo */}
      <div className="px-4 md:px-8 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Dashboard Financeiro</h1>
          <p className="text-xs text-slate-400 font-medium">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Tv size={14} className="text-slate-400" /> Modo TV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 mb-8 mt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Periodo:</span>
            </div>
            {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
              <button 
                key={p} 
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${activePeriod === p ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
            
            <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
               Realizado <ChevronDown size={14} className="text-slate-300" />
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
               <Filter size={14} className="text-slate-300" /> Avançado <ChevronDown size={14} className="text-slate-300" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
             <span>Visualizando: <strong className="text-slate-800">{activePeriod}</strong></span>
             <span className="opacity-40">|</span>
             <span>Modo: <strong className="text-slate-800">Realizado</strong></span>
             <span className="opacity-40">|</span>
             <span>Meta: <strong className="text-slate-800">Mensal</strong></span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70">Indicadores Principais</p>
      </div>

      {/* Main Content Area */}
      <div className="px-4 md:px-8 space-y-8">
        
        {/* Row 1: Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Entradas" 
            value={formatCurrency(metrics.entradas)} 
            subtitle={`${metrics.countIn} transações`}
            icon={<ArrowDownLeft />} 
            color="emerald" 
          />
          <StatCard 
            title="Saídas" 
            value={formatCurrency(metrics.saidas)} 
            subtitle={`${metrics.countOut} transações`}
            icon={<ArrowUpRight />} 
            color="red" 
          />
          <StatCard 
            title="Lucro Líquido" 
            value={formatCurrency(metrics.lucro)} 
            subtitle="% do LL — "
            icon={<TrendingUp />} 
            color="blue" 
            showInfo
          />
          <StatCard 
            title="Ticket Médio" 
            value={formatCurrency(metrics.ticketMedio)} 
            subtitle={`${metrics.activeClients} clientes ativos`}
            icon={<Users />} 
            color="blue" 
          />
        </div>

        {/* Row 2: Secondary Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card Meta */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-400">
                Mensal <ChevronDown size={10} />
              </button>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Edit2 size={12} className="text-slate-300 cursor-pointer hover:text-slate-600" />
              <Maximize2 size={12} className="text-slate-300 cursor-pointer hover:text-slate-600" />
            </div>

            <div className="relative mb-6 mt-4">
              <CircleDashed size={80} strokeWidth={1} className="text-slate-100" />
              <Target size={28} className="absolute inset-0 m-auto text-slate-300" />
            </div>
            <h4 className="text-[12px] font-medium text-slate-500 mb-6">Meta não definida</h4>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
              <Target size={14} /> Definir Meta
            </button>
          </div>

          {/* Card A Receber */}
          <div className="bg-white border-l-4 border-l-amber-400 border border-slate-200 rounded-xl p-6 shadow-sm group hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100"><Wallet size={18} className="text-amber-500" /></div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">A Receber</h4>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatCurrency(metrics.aReceber)}</h3>
              <p className="text-[10px] text-slate-400 font-medium">Total em aberto (atual + futuro)</p>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-400">Recebido</span>
                <span className="text-slate-400">Em aberto</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-50">
                 <div className="h-full bg-emerald-400/30 w-[15%]" />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-800">
                <span>R$ 0,00</span>
                <span>R$ 0,00</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg text-slate-300"><FileText size={12} /></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pendências</span><span className="text-sm font-black text-slate-900">0</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg text-slate-300"><User size={12} /></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Clientes</span><span className="text-sm font-black text-slate-900">0</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Contas a Pagar */}
          <div className="bg-white border-l-4 border-l-rose-400 border border-slate-200 rounded-xl p-6 shadow-sm group hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-100"><Receipt size={18} className="text-rose-500" /></div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contas a Pagar</h4>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatCurrency(metrics.contasPagar)}</h3>
              <p className="text-[10px] text-slate-400 font-medium">0 contas pendentes</p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center opacity-[0.03] grayscale">
               <Receipt size={100} strokeWidth={1} />
            </div>
          </div>

          {/* Card MRR */}
          <div className="bg-white border-l-4 border-l-blue-400 border border-slate-200 rounded-xl p-6 shadow-sm group hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100"><RefreshCcw size={18} className="text-blue-500" /></div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRR</h4>
              </div>
              <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">0 contratos</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatCurrency(metrics.mrr)}</h3>
              <p className="text-[10px] text-slate-400 font-medium">Garantido mensalmente • Clique para detalhes</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-10">
               <p className="text-[12px] text-slate-500">Nenhum contrato recorrente ativo</p>
            </div>
          </div>
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Entradas x Saídas" 
            xAxisLabels={['02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
            legend={[
              { label: 'Entradas', color: '#10b981' },
              { label: 'Saídas', color: '#f43f5e' }
            ]}
          />
          <ChartCard 
            title="Lucro Líquido por Período" 
            xAxisLabels={['02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
          />
        </div>

        {/* Row 4: Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          <div className="lg:col-span-7">
            <RecentEntries />
          </div>
          <div className="lg:col-span-5">
            <CustomersTable />
          </div>
        </div>

      </div>

      {isLoading && (
        <div className="fixed bottom-24 md:bottom-12 right-4 md:right-12 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-white/10">
          <Loader2 size={20} className="animate-spin text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest">Sincronizando base...</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
