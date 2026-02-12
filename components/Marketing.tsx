
import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Share2, 
  ListTodo, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  RefreshCcw,
  Target,
  Zap,
  Globe,
  Instagram,
  Linkedin
} from 'lucide-react';

const Marketing: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const periods = ['Semana', 'Mês', 'Trimestre', 'Ano'];

  const stats = [
    { label: 'Alcance Total', value: '42.5k', trend: '+18%', icon: <Globe size={18} />, color: 'blue' },
    { label: 'Leads (ToFu)', value: '842', trend: '+12%', icon: <Target size={18} />, color: 'emerald' },
    { label: 'CPL Médio', value: 'R$ 4,20', trend: '-5%', icon: <Zap size={18} />, color: 'indigo' },
    { label: 'Taxa Engaj.', value: '4.8%', trend: '+0.5%', icon: <Share2 size={18} />, color: 'blue' },
  ];

  const kanbanStages = [
    { name: 'Backlog/Ideação', count: 12, perc: 40, color: 'bg-slate-200' },
    { name: 'Produção Design', count: 8, perc: 25, color: 'bg-blue-300' },
    { name: 'Copywriting', count: 5, perc: 15, color: 'bg-blue-500' },
    { name: 'Aprovação Final', count: 3, perc: 10, color: 'bg-indigo-500' },
    { name: 'Agendado/Live', count: 22, perc: 100, color: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Megaphone size={24} />
           </div>
           <div>
             <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Marketing Ops</h2>
             <p className="text-slate-500 font-medium mt-1">Gestão de Canais, Performance & Conteúdo.</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedPeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            <TrendingUp size={18} />
            Ver Relatórios
          </button>
        </div>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
              <ArrowUpRight size={14} className={stat.trend.startsWith('-') ? 'rotate-90' : ''} /> {stat.trend} vs anterior
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow Intelligence Card */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Status de Produção de Conteúdo</h3>
            <button className="text-slate-300 hover:text-slate-900 transition-colors">
              <RefreshCcw size={18} />
            </button>
          </div>
          
          <div className="space-y-8">
            {kanbanStages.map((stage, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stage.name}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-900">{stage.count} tasks</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} rounded-full transition-all duration-1000 group-hover:brightness-95 shadow-sm`} 
                    style={{ width: `${stage.perc}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: AI & Channel Engagement */}
        <div className="space-y-8">
          {/* AI ROI Forecast */}
          <div className="bg-[#002147] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles size={150} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">IA Growth Forecast</h4>
                <RefreshCcw size={14} className="text-white/30 cursor-pointer hover:rotate-180 transition-all duration-500"/>
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold leading-tight tracking-tight">
                  Projeção de ROAS: <span className="text-emerald-400">4.2x</span>
                </p>
                <p className="text-xs text-white/60 font-medium leading-relaxed">
                  Baseado no engajamento orgânico do <span className="text-white font-bold">LinkedIn</span>, recomendamos migrar 15% do budget de Ads para conteúdo institucional.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-[#002147] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                Otimizar Investimento
              </button>
            </div>
          </div>

          {/* Top Channels */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Canais em Destaque</h3>
            <div className="space-y-6">
              {[
                { name: 'Instagram', icon: <Instagram size={14}/>, perc: 92, val: '12.4k', color: 'bg-rose-500' },
                { name: 'LinkedIn', icon: <Linkedin size={14}/>, perc: 78, val: '8.1k', color: 'bg-blue-600' },
                { name: 'E-mail Marketing', icon: <Megaphone size={14}/>, perc: 45, val: '3.2k', color: 'bg-indigo-500' },
              ].map((channel, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-lg bg-slate-50 text-slate-400`}>
                         {channel.icon}
                       </div>
                       <span className="text-xs font-bold text-slate-700">{channel.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{channel.val} interações</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${channel.color} rounded-full`} style={{ width: `${channel.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts / Bottlenecks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-6 flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Gargalo Identificado</h4>
            <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">
              Existem <span className="font-bold">12 tasks</span> aguardando revisão de Design há mais de 72h. Risco de atraso no cronograma de Maio.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">Oportunidade ToFu</h4>
            <p className="text-xs text-blue-700 font-medium mt-1 leading-relaxed">
              O artigo <span className="font-bold">"Gestão de Fluxo de Caixa"</span> atingiu o maior tempo médio de leitura. Recomendamos transformar em um Reel/Shorts.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Marketing;
