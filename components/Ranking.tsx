
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  PhoneCall, 
  CalendarDays, 
  Star, 
  Sparkles,
  Medal,
  TrendingUp,
  Target,
  Loader2,
  Database,
  RefreshCcw,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface RankingProps {
  user: any;
}

interface RankItem {
  name: string;
  initial: string;
  level: number;
  value: number;
  isWinner?: boolean;
}

const Ranking: React.FC<RankingProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('Geral');

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*').eq('user_id', user.id);
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const rankings = useMemo(() => {
    const grouped: Record<string, { prospects: number, meetings: number, sales: number, value: number }> = {};

    leads.forEach(lead => {
      const rep = lead.assigned_to || 'Sem Atribuição';
      if (!grouped[rep]) grouped[rep] = { prospects: 0, meetings: 0, sales: 0, value: 0 };
      grouped[rep].prospects++;
      if (lead.stage?.toLowerCase() === 'reuniao') grouped[rep].meetings++;
      if (lead.stage?.toLowerCase() === 'fechado') {
        grouped[rep].sales++;
        grouped[rep].value += Number(lead.value) || 0;
      }
    });

    const createRank = (key: 'prospects' | 'meetings' | 'sales') => {
      return Object.entries(grouped)
        .map(([name, stats]) => ({
          name,
          initial: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          level: Math.floor(stats.sales / 5) + 1,
          value: stats[key]
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, isWinner: index === 0 }));
    };

    return {
      prospeccoes: createRank('prospects'),
      reunioes: createRank('meetings'),
      vendas: createRank('sales'),
      myStats: grouped[user?.user_metadata?.full_name] || { prospects: 0, meetings: 0, sales: 0, value: 0 }
    };
  }, [leads, user]);

  const RenderMetricCard = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: RankItem[] }) => (
    <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm flex flex-col space-y-8 hover:shadow-xl transition-all duration-700 group min-h-[450px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-[#203267] rounded-xl border border-slate-300 group-hover:scale-110 transition-transform shadow-sm">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 })}
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">{title}</h3>
        </div>
        <TrendingUp size={20} className="text-slate-200" />
      </div>
      
      <div className="space-y-3 flex-1">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
            <Database size={40} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[150px]">Matriz de Dados SQL em Processamento</p>
          </div>
        ) : items.slice(0, 5).map((item, idx) => (
          <div 
            key={idx} 
            className={`relative flex items-center justify-between p-4 rounded-lg transition-all border ${
              item.isWinner 
                ? 'bg-indigo-50 border-[#203267]/30 text-slate-900 shadow-md scale-[1.02]' 
                : 'bg-slate-50/30 border-slate-200 text-slate-700 hover:bg-white hover:border-[#203267]'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
                item.isWinner ? 'bg-slate-900 border-slate-700 text-white shadow-lg' : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {item.initial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-tight truncate max-w-[120px]">{item.name}</p>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Nível {item.level}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="text-xl font-black tracking-tighter italic text-slate-950">{item.value}</div>
              {item.isWinner ? <Trophy size={16} className="text-amber-500" /> : <Medal size={16} className="text-slate-200" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculando Performance Auditada...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Corporativo */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <Award size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">League of Excellence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Top <span className="text-[#203267] not-italic">Performers</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-white border border-slate-300 rounded-xl p-1 shadow-md w-full md:w-auto overflow-x-auto no-scrollbar">
             {['Hoje', 'Mês', 'Geral'].map(range => (
               <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${timeRange === range ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
               >
                 {range}
               </button>
             ))}
          </div>
          <button onClick={fetchData} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RenderMetricCard title="Prospecções SQL" icon={<PhoneCall />} items={rankings.prospeccoes} />
          <RenderMetricCard title="Visitas Auditadas" icon={<CalendarDays />} items={rankings.reunioes} />
          <RenderMetricCard title="Sales Revenue" icon={<Trophy />} items={rankings.vendas} />
        </div>

        {/* User Status Section - Executive Styled */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 italic">Análise de Performance Individual</h3>

          <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-10 shadow-2xl relative group overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none text-white">
              <Target size={350} strokeWidth={1} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
              <div className="relative shrink-0 transition-transform duration-700 group-hover:scale-105">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-5xl md:text-6xl font-black shadow-2xl text-white italic">
                  {(user?.user_metadata?.full_name || 'U').substring(0,1).toUpperCase()}
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#203267] border-4 border-[#0a0c10] rounded-xl flex items-center justify-center text-white text-lg font-black shadow-xl">
                  {Math.floor(rankings.myStats.sales / 5) + 1}
                </div>
              </div>

              <div className="flex-1 w-full space-y-10">
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-blue-500 mb-2">
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black">Performance Auditada SQL</span>
                  </div>
                  <h4 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">{user?.user_metadata?.full_name}</h4>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest italic">Score Consolidado na Conta Isolada</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Impacto Financeiro (Sales Value)</span>
                    <span className="text-xl font-black text-white italic tracking-tighter">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rankings.myStats.value)}
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[#203267] to-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-1500" 
                      style={{ width: `${Math.min((rankings.myStats.value / 100000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto flex flex-col items-center gap-4">
                 <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-500 shadow-xl group-hover:bg-[#203267] group-hover:text-white transition-all duration-500">
                   <Target size={48} strokeWidth={2.5} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Sync Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
