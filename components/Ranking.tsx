
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

interface RankItem {
  name: string;
  initial: string;
  level: number;
  value: number;
  isWinner?: boolean;
}

const Ranking: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('Geral');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Busca todos os leads para processar o ranking localmente (agregação em tempo real)
      const { data, error } = await supabase.from('leads').select('*');
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
  }, []);

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
      myStats: grouped['Kyros (Financial Ops)'] || grouped['Kyrooss'] || { prospects: 0, meetings: 0, sales: 0, value: 0 }
    };
  }, [leads]);

  const RenderMetricCard = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: RankItem[] }) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col space-y-6 hover:shadow-md transition-all group min-h-[420px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        <TrendingUp size={18} className="text-slate-200" />
      </div>
      
      <div className="space-y-3 flex-1">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-2">
            <Database size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando dados SQL</p>
          </div>
        ) : items.slice(0, 5).map((item, idx) => (
          <div 
            key={idx} 
            className={`relative flex items-center justify-between p-4 rounded-[1.5rem] transition-all overflow-hidden ${
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
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border-2 ${
                item.isWinner ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-400 shadow-sm'
              }`}>
                {item.initial}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${item.isWinner ? 'text-white' : 'text-slate-800'}`}>
                  {item.name}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${item.isWinner ? 'text-blue-400' : 'text-slate-400'}`}>
                  Nível {item.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className={`text-xl font-black tracking-tighter ${item.isWinner ? 'text-white' : 'text-slate-900'}`}>
                {item.value}
              </div>
              {item.isWinner ? <Trophy size={16} className="text-amber-400" /> : <Medal size={16} className="text-slate-200" />}
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
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Banco de Dados Ativo</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Leaderboard</h2>
          <p className="text-slate-500 font-medium mt-1">Performance consolidada a partir dos leads do CRM.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
             {['Mês', 'Geral'].map(range => (
               <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {range}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RenderMetricCard 
          title="Prospecções" 
          icon={<PhoneCall size={18} />} 
          items={rankings.prospeccoes} 
        />
        <RenderMetricCard 
          title="Reuniões" 
          icon={<CalendarDays size={18} />} 
          items={rankings.reunioes} 
        />
        <RenderMetricCard 
          title="Vendas" 
          icon={<Trophy size={18} />} 
          items={rankings.vendas} 
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Seu Perfil de Performance</h3>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Target size={300} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500 italic">
                K
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 border-4 border-white rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg">
                {Math.floor(rankings.myStats.sales / 5) + 1}
              </div>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div className="text-center md:text-left space-y-1">
                <h4 className="text-3xl font-bold text-slate-900 tracking-tight">Kyros (Financial Ops)</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600">
                  <Star size={16} className="fill-blue-600" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Performance Realtime baseada em SQL</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Impacto Financeiro (Vendas Fechadas)</span>
                  <span className="text-sm font-black text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rankings.myStats.value)}
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" 
                    style={{ width: `${Math.min((rankings.myStats.value / 100000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="shrink-0">
               <button className="flex flex-col items-center gap-3 group/ai">
                 <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-sm group-hover/ai:bg-blue-600 group-hover/ai:text-white group-hover/ai:scale-105 transition-all duration-300 border border-blue-100/50">
                   <Sparkles size={32} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/ai:text-blue-600 transition-colors">AI Coach</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
