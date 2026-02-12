
import React from 'react';
import { 
  Trophy, 
  Users, 
  PhoneCall, 
  CalendarDays, 
  Star, 
  User, 
  Sparkles,
  Medal,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';

interface RankItem {
  name: string;
  initial: string;
  level: number;
  value: number;
  isWinner?: boolean;
}

const Ranking: React.FC = () => {
  const prospeccoes: RankItem[] = [
    { name: 'Kyros', initial: 'K', level: 1, value: 1, isWinner: true },
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0 },
  ];

  const reunioes: RankItem[] = [
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0, isWinner: true },
    { name: 'Kyros', initial: 'K', level: 1, value: 0 },
  ];

  const conversoes: RankItem[] = [
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0, isWinner: true },
    { name: 'Kyros', initial: 'K', level: 1, value: 0 },
  ];

  const RenderMetricCard = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: RankItem[] }) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col space-y-6 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        <button className="text-slate-300 hover:text-slate-900 transition-colors">
          <TrendingUp size={18} />
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((item, idx) => (
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
              <div>
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
      
      <button className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
        Ver Ranking Completo
      </button>
    </div>
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Leaderboard</h2>
          <p className="text-slate-500 font-medium mt-1">Gamificação e performance comercial em tempo real.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
             <button className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-md">Semana</button>
             <button className="px-5 py-2 text-slate-500 text-xs font-bold">Mês</button>
             <button className="px-5 py-2 text-slate-500 text-xs font-bold">Geral</button>
          </div>
        </div>
      </div>

      {/* Metrics Ranking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RenderMetricCard 
          title="Prospecções" 
          icon={<PhoneCall size={18} />} 
          items={prospeccoes} 
        />
        <RenderMetricCard 
          title="Reuniões" 
          icon={<CalendarDays size={18} />} 
          items={reunioes} 
        />
        <RenderMetricCard 
          title="Vendas" 
          icon={<Trophy size={18} />} 
          items={conversoes} 
        />
      </div>

      {/* Individual Statistics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Seu Perfil de Atleta</h3>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Status: Em Evolução</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Target size={300} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            {/* Avatar Profile */}
            <div className="relative">
              <div className="w-32 h-32 bg-slate-50 border-4 border-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-slate-900 shadow-xl group-hover:shadow-blue-200/50 transition-all duration-500">
                K
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 border-4 border-white rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg">
                1
              </div>
            </div>

            {/* Profile Info & XP */}
            <div className="flex-1 w-full space-y-8">
              <div className="text-center md:text-left space-y-1">
                <h4 className="text-3xl font-bold text-slate-900 tracking-tight">Kyros</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-bold">
                  <Star size={16} className="fill-blue-600" />
                  <span className="text-xs uppercase tracking-widest font-black">Novato da Temporada (Lv. 1)</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">XP de Performance</span>
                    <span className="p-1 bg-slate-50 rounded text-[9px] font-bold text-slate-400 border border-slate-100">PROX: 500 XP</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">1 / 500</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full w-[1%] bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000"></div>
                </div>
              </div>
            </div>

            {/* AI Action Button */}
            <div className="shrink-0">
               <button className="flex flex-col items-center gap-3 group/ai">
                 <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-sm group-hover/ai:bg-blue-600 group-hover/ai:text-white group-hover/ai:scale-105 transition-all duration-300">
                   <Sparkles size={32} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/ai:text-blue-600 transition-colors">AI Mentor</span>
               </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Ranking;
