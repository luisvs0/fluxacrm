
import React, { useState, useEffect, useCallback } from 'react';
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
  Edit2,
  User,
  Database,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Activity,
  Cpu,
  CheckCircle2
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
  const [regime, setRegime] = useState<'Caixa' | 'Competência'>('Caixa');
  const [isFilterActive, setIsFilterActive] = useState(false);
  
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

  const getPeriodDates = (period: string) => {
    const now = new Date();
    let start = new Date();
    let end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    switch (period) {
      case 'Hoje':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'Esta Semana':
        const day = now.getDay();
        start = new Date(now.setDate(now.getDate() - day));
        start.setHours(0, 0, 0, 0);
        end = new Date(now.setDate(now.getDate() + 6));
        end.setHours(23, 59, 59, 999);
        break;
      case 'Este Mês':
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'Este Ano':
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
    }
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { start, end } = getPeriodDates(activePeriod);

      // Busca Transações filtradas por data
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('competence_date', start.split('T')[0])
        .lte('competence_date', end.split('T')[0]);

      // Busca MRR e Clientes (Geral)
      const { data: contracts } = await supabase.from('contracts').select('amount').eq('status', 'ACTIVE').eq('user_id', user.id);
      const { count: clientCount } = await supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      if (txs) {
        const stats = txs.reduce((acc, curr) => {
          const val = Number(curr.amount);
          const isPaid = curr.status === 'PAID';

          if (curr.type === 'IN') {
            if (isPaid) {
              acc.entradas += val;
              acc.countIn += 1;
            } else {
              acc.aReceber += val;
            }
          } else {
            if (isPaid) {
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

        // Se o regime for competência, somamos o provisionado ao realizado para a visão de lucro
        const totalEntradas = regime === 'Competência' ? stats.entradas + stats.aReceber : stats.entradas;
        const totalSaidas = regime === 'Competência' ? stats.saidas + stats.contasPagar : stats.saidas;

        setMetrics({
          ...stats,
          lucro: totalEntradas - totalSaidas,
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
  }, [user, activePeriod, regime]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Corporativo Limpo */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
               <Cpu size={20} className="text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Gestão Consolidada</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Visão <span className="text-[#203267] not-italic">Financeira</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocolo de Sincronização</span>
             <span className="text-xs font-bold text-slate-900">Distributed Node SQL</span>
          </div>
          <button 
            onClick={fetchDashboardData} 
            className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] hover:shadow-xl transition-all duration-700 active:scale-90 group"
          >
            <RefreshCcw size={22} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'}`} />
          </button>
        </div>
      </div>

      {/* Filter Console - Funcional */}
      <div className="relative z-10 px-4 md:px-10 mb-12 mt-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex flex-wrap items-center gap-3 pl-3">
            <div className="flex items-center gap-3 mr-4 py-2 px-4 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
              <Calendar size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Período Fiscal</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setActivePeriod(p)}
                  className={`px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-tight transition-all duration-500 whitespace-nowrap ${activePeriod === p ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            
            <div className="h-10 w-[1px] bg-slate-300 mx-2 hidden lg:block opacity-50"></div>

            <div className="flex gap-2">
              <button 
                onClick={() => setRegime(regime === 'Caixa' ? 'Competência' : 'Caixa')}
                className={`flex items-center gap-2 px-5 py-2 border border-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm group ${regime === 'Caixa' ? 'bg-white text-slate-600 hover:border-[#203267]' : 'bg-slate-900 text-white border-slate-700 shadow-lg'}`}
              >
                 Regime {regime} {regime === 'Competência' && <CheckCircle2 size={14} className="text-blue-400" />}
                 <ChevronDown size={14} className={regime === 'Caixa' ? 'text-[#203267]' : 'text-white'} />
              </button>

              <button 
                onClick={() => setIsFilterActive(!isFilterActive)}
                className={`flex items-center gap-2 px-5 py-2 border border-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm group ${isFilterActive ? 'bg-[#203267] text-white border-[#203267]' : 'bg-white text-slate-600 hover:border-[#203267]'}`}
              >
                 <Filter size={14} /> {isFilterActive ? 'Filtros Ativos' : 'Filtros'} <ChevronDown size={14} className={isFilterActive ? 'text-white' : 'text-[#203267]'} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> DB Node Central</span>
             <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Architecture */}
      <div className="relative z-10 px-4 md:px-10 space-y-12">
        
        {/* Tier 1: Core Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Receita Realizada" 
            value={formatCurrency(metrics.entradas)} 
            subtitle={`${metrics.countIn} ordens liquidadas`}
            icon={<ArrowDownLeft />} 
            color="emerald" 
          />
          <StatCard 
            title="Despesa Operacional" 
            value={formatCurrency(metrics.saidas)} 
            subtitle={`${metrics.countOut} débitos processados`}
            icon={<ArrowUpRight />} 
            color="red" 
          />
          <StatCard 
            title="Resultado Líquido" 
            value={formatCurrency(metrics.lucro)} 
            subtitle={`Margem em Regime ${regime}`}
            icon={<TrendingUp />} 
            color="blue" 
            showInfo
          />
          <StatCard 
            title="Ticket Médio" 
            value={formatCurrency(metrics.ticketMedio)} 
            subtitle={`${metrics.activeClients} contas em base`}
            icon={<Users />} 
            color="blue" 
          />
        </div>

        {/* Tier 2: Asset Management & Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card Objetivo Estratégico */}
          <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#203267] hover:shadow-xl transition-all duration-700 relative overflow-hidden min-h-[380px]">
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-md">
                <Target size={12} className="text-blue-400" /> Target Pro
              </div>
            </div>
            <div className="absolute top-6 right-6 flex gap-2">
              <button className="p-2 bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#203267] hover:bg-white rounded-md transition-all"><Edit2 size={16} /></button>
            </div>

            <div className="relative mb-6">
              <CircleDashed size={120} strokeWidth={1} className="text-indigo-100 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-0 m-auto w-16 h-16 bg-white border border-slate-300 rounded-xl flex items-center justify-center text-[#203267] shadow-lg group-hover:scale-105 transition-transform duration-700">
                <Target size={32} strokeWidth={2.5} />
              </div>
            </div>
            
            <h4 className="text-[14px] font-black text-slate-900 mb-1 uppercase tracking-widest">Objetivo de Performance</h4>
            <p className="text-[10px] text-slate-400 font-bold mb-8 uppercase tracking-widest opacity-60">Matriz de crescimento 2026</p>
            
            <button className="w-full py-4 bg-[#203267] text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95">
              Sincronizar Alvo
            </button>
          </div>

          {/* Card Previsão de Receita (A Receber) */}
          <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm group hover:border-amber-400 hover:shadow-xl transition-all duration-700 flex flex-col justify-between overflow-hidden relative min-h-[380px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-500 shadow-sm">
                 <Wallet size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fluxo Provisionado</h4>
                 <span className="text-[8px] font-bold text-amber-600 uppercase">Recebíveis SQL</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatCurrency(metrics.aReceber)}</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                 <Activity size={10} className="text-amber-500" /> Previsão Analítica
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[9px] font-black text-slate-300 uppercase">Health Score</span>
                    <span className="text-[9px] font-black text-amber-600 uppercase">Calculado</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[15%] rounded-full transition-all duration-[2000ms]" />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Documentos</span>
                  <p className="text-base font-black text-slate-900">0</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risco</span>
                  <p className="text-base font-black text-rose-500">0.0%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Obrigações (Contas a Pagar) */}
          <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm group hover:border-rose-400 hover:shadow-xl transition-all duration-700 flex flex-col justify-between overflow-hidden relative min-h-[380px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 text-rose-500 shadow-sm">
                 <Receipt size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Obrigações</h4>
                 <span className="text-[8px] font-bold text-rose-600 uppercase tracking-tighter">Débitos em Ledger</span>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">{formatCurrency(metrics.contasPagar)}</h3>
              <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck size={10} /> {metrics.countPagar} débitos auditados
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center opacity-10 group-hover:opacity-20 transition-all duration-[1500ms]">
               <Receipt size={80} strokeWidth={1} className="text-rose-600" />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo Fiscal</span>
               <span className="text-[8px] font-black text-slate-900 bg-slate-100 border border-slate-300 px-2 py-1 rounded-md uppercase">Auto-Sync</span>
            </div>
          </div>

          {/* Card MRR Executive Tier */}
          <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-8 shadow-xl group hover:shadow-2xl transition-all duration-700 flex flex-col justify-between overflow-hidden relative min-h-[380px]">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-blue-400">
                   <RefreshCcw size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">MRR Contratual</h4>
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">Stability Matrix</span>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-md">
                {metrics.countContracts} Contratos Ativos
              </div>
            </div>

            <div className="relative z-10 space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tighter leading-none italic">{formatCurrency(metrics.mrr)}</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={10} className="text-blue-500" /> Receita Recorrente
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 relative z-10 bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-md">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-7 h-7 rounded-lg border-2 border-[#0a0c10] bg-slate-800 flex items-center justify-center text-[9px] font-black text-white overflow-hidden">
                      <User size={12} className="text-slate-500" />
                   </div>
                 ))}
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/60 uppercase tracking-tighter">Portfólio Ativo</span>
               </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none transition-all duration-1000" />
            <Sparkles className="absolute right-6 bottom-6 text-white/5 transition-all duration-1000" size={80} />
          </div>
        </div>

        {/* Tier 3: Strategic Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          <div className="group">
             <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                  <span className="w-1.5 h-3 bg-[#203267] rounded-sm"></span> Fluxo Auditado
                </h3>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                   <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse"></div>
                   <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Real-Time Ledger</span>
                </div>
             </div>
             <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-700">
               <ChartCard 
                 title="Comparativo Entradas x Saídas" 
                 xAxisLabels={['01/02', '02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
                 legend={[
                   { label: 'Entradas', color: '#203267' },
                   { label: 'Saídas', color: '#f43f5e' }
                 ]}
               />
             </div>
          </div>
          <div className="group">
             <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                  <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span> Rentabilidade
                </h3>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full shadow-lg">
                   <Activity size={10} className="text-blue-400" />
                   <span className="text-[9px] text-white font-black uppercase tracking-widest">Analytics SQL</span>
                </div>
             </div>
             <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-700">
               <ChartCard 
                 title="Evolução de Retorno Mensal" 
                 xAxisLabels={['01/02', '02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
               />
             </div>
          </div>
        </div>

        {/* Tier 4: Detailed Audit Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 pt-8">
          <div className="lg:col-span-7 border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
            <RecentEntries />
          </div>
          <div className="lg:col-span-5 border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
            <CustomersTable />
          </div>
        </div>

      </div>

      {/* Floating Indicator */}
      {isLoading && (
        <div className="fixed bottom-24 md:bottom-12 right-4 md:right-12 bg-slate-900 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 z-[60] border border-slate-700">
          <Loader2 size={20} className="animate-spin text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Processando Dados</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Sync SQL
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
