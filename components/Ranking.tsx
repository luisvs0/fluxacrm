
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
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col space-y-6 hover:shadow-md transition-all group min-h-[380px] md:min-h-[420px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-2.5 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        <TrendingUp size={18} className="text-slate-200" />
      </div>
      
      <div className="space-y-3 flex-1">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
            <Database size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[150px]">Sem dados isolados</p>
          </div>
        ) : items.slice(0, 5).map((item, idx) => (
          <div 
            key={idx} 
            className={`relative flex items-center justify-between p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] transition-all overflow-hidden ${
              item.isWinner 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'bg-slate-50/50 border border-slate-100 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.isWinner && (
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Trophy size={40} />
              </div>
            )}
            
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] font-black border-2 ${
                item.isWinner ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-400 shadow-sm'
              }`}>
                {item.initial}
              </div>
              <div className="min-w-0">
                <p className={`text-xs md:text-sm font-bold truncate max-w-[100px] md:max-w-none ${item.isWinner ? 'text-white' : 'text-slate-800'}`}>
                  {item.name}
                </p>
                <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${item.isWinner ? 'text-blue-400' : 'text-slate-400'}`}>
                  Nível {item.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 relative z-10">
              <div className={`text-lg md:text-xl font-black tracking-tighter ${item.isWinner ? 'text-white' : 'text-slate-900'}`}>
                {item.value}
              </div>
              {item.isWinner ? <Trophy size={14} className="text-amber-400" /> : <Medal size={14} className="text-slate-200" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculando Performance...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500 shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dados Auditados SQL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Leaderboard Realtime</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Ranking extraído da sua base de leads.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
             {['Hoje', 'Mês', 'Geral'].map(range => (
               <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {range}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <RenderMetricCard title="Prospecções" icon={<PhoneCall size={18} />} items={rankings.prospeccoes} />
        <RenderMetricCard title="Reuniões" icon={<CalendarDays size={18} />} items={rankings.reunioes} />
        <RenderMetricCard title="Vendas" icon={<Trophy size={18} />} items={rankings.vendas} />
      </div>

      <div className="space-y-4 md:space-y-6">
        <h3 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Sua Performance</h3>

        <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative group overflow-hidden hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Target size={300} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 text-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500 italic">
                {(user?.user_metadata?.full_name || 'U').substring(0,1).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-blue-600 border-4 border-white rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xs md:text-sm font-black shadow-lg">
                {Math.floor(rankings.myStats.sales / 5) + 1}
              </div>
            </div>

            <div className="flex-1 w-full space-y-6 md:space-y-8">
              <div className="text-center md:text-left space-y-1">
                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{user?.user_metadata?.full_name}</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600">
                  <Star size={14} className="fill-blue-600" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-black">Performance Auditada SQL</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Revenue Impact</span>
                  <span className="text-xs md:text-sm font-black text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rankings.myStats.value)}
                  </span>
                </div>
                <div className="h-2 md:h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" 
                    style={{ width: `${Math.min((rankings.myStats.value / 100000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
               <button className="flex flex-row md:flex-col items-center justify-center gap-3 group/ai w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                 <div className="w-12 h-12 md:w-20 md:h-20 bg-white md:bg-blue-50 text-blue-600 rounded-xl md:rounded-[2rem] flex items-center justify-center shadow-sm group-hover/ai:bg-blue-600 group-hover/ai:text-white group-hover/ai:scale-105 transition-all duration-300 border border-blue-100/50">
                   <Sparkles size={24} className="md:size-32" />
                 </div>
                 <div className="flex flex-col md:items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/ai:text-blue-600 transition-colors">Performance AI</span>
                 </div>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
