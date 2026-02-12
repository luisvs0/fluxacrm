
import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  Trophy, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  ArrowUpRight,
  ArrowDown,
  RefreshCcw,
  CheckCircle2,
  Bell
} from 'lucide-react';

const Crm: React.FC = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 animate-in fade-in duration-700 pb-20 px-8 pt-6">
      
      {/* Row 1: Top 3 Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Valor Potencial */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1.5">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Valor Potencial Total</span>
               <AlertCircle size={12} className="text-slate-300" />
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">R$ 1.391,00</h3>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[11px] font-black text-emerald-500 uppercase">+100.0%</span>
            <span className="text-[11px] text-slate-400 font-bold">em pipeline ativo</span>
          </div>
        </div>

        {/* Taxa Contato -> Reunião */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1.5">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Taxa Contato → Reunião</span>
               <AlertCircle size={12} className="text-slate-300" />
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <TrendingUp size={20} className="rotate-45" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">0%</h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-black text-slate-300 uppercase">— 0.0%</span>
            <span className="text-[11px] text-slate-400 font-bold">0 de 0 leads</span>
          </div>
        </div>

        {/* Taxa de Fechamento */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1.5">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Taxa de Fechamento</span>
               <AlertCircle size={12} className="text-slate-300" />
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <Target size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">0%</h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-black text-slate-300 uppercase">— 0.0%</span>
            <span className="text-[11px] text-slate-400 font-bold">0 de 122 leads</span>
          </div>
        </div>
      </div>

      {/* Row 2: Mini Metric Strip (6 items) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Leads Prospectados', val: '122', trend: '+100.0%', color: 'text-emerald-500', icon: <Users size={14}/> },
          { label: 'Leads Contatados', val: '0', trend: '— 0.0%', color: 'text-slate-300', icon: <Users size={14}/> },
          { label: 'Reuniões Marcadas', val: '0', trend: '— 0.0%', color: 'text-slate-300', icon: <Calendar size={14}/> },
          { label: 'Reuniões Realizadas', val: '0', trend: '— 0.0%', color: 'text-slate-300', icon: <Calendar size={14}/> },
          { label: 'No-show', val: '0', trend: '— 0.0%', color: 'text-slate-300', icon: <Clock size={14}/> },
          { label: 'Fechamentos', val: '0', trend: '— 0.0%', color: 'text-slate-300', icon: <Trophy size={14}/> },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate pr-2">{m.label}</span>
              <div className="text-blue-500 bg-blue-50 p-1.5 rounded-lg shrink-0">{m.icon}</div>
            </div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{m.val}</h4>
            <p className={`text-[9px] font-black uppercase mt-1 ${m.color}`}>{m.trend} <span className="text-slate-400 font-bold">vs anterior</span></p>
          </div>
        ))}
      </div>

      {/* Middle Grid: Funnel, Evolution, Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Funnel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col">
           <h4 className="text-sm font-bold text-slate-800 mb-8 tracking-tight">Funil de Conversão</h4>
           <div className="space-y-6 flex-1">
             {[
               { label: 'Lead', val: 0, perc: 0, color: 'bg-blue-500' },
               { label: 'Contato Iniciado', val: 1, perc: 0, color: 'bg-blue-600', sub: '(0%)' },
               { label: 'Reunião Marcada', val: 2, perc: 200, color: 'bg-purple-500', sub: '(200%)' },
               { label: 'Proposta Enviada', val: 0, perc: 0, color: 'bg-rose-400', sub: '(0%)', alert: 'Gargalo' },
               { label: 'Fechado', val: 0, perc: 0, color: 'bg-purple-600', sub: '(0%)' },
             ].map((step, idx) => (
               <div key={idx} className="relative group">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{step.label}</span>
                   <div className="flex items-center gap-1.5">
                     <span className="text-xs font-bold text-slate-900">{step.val}</span>
                     {step.sub && <span className="text-[10px] font-bold text-amber-600">{step.sub}</span>}
                   </div>
                 </div>
                 <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${step.color} transition-all duration-1000 shadow-sm`} style={{ width: `${step.perc > 100 ? 100 : step.perc}%` }}></div>
                 </div>
                 {idx < 4 && (
                   <div className="flex flex-col items-center justify-center py-1">
                      <ArrowDown size={10} className="text-slate-200" />
                      {step.alert && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-amber-100 shadow-sm">
                          <AlertCircle size={8} /> {step.alert}
                        </div>
                      )}
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>

        {/* Evolution & Metas (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm min-h-[160px] flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-4">
                 <Target size={18} className="text-blue-500" />
                 <h4 className="text-sm font-bold text-slate-800 tracking-tight">Progresso de Metas</h4>
              </div>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Nenhuma meta ativa no período</p>
           </div>

           <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex-1 flex flex-col min-h-[300px]">
              <h4 className="text-sm font-bold text-slate-800 mb-8 tracking-tight">Evolução de Atividades</h4>
              <div className="flex-1 relative border-l border-b border-slate-50 ml-8 mb-8">
                 {/* Line Graph Mock */}
                 <svg className="w-full h-full text-blue-600 overflow-visible">
                    <path d="M 0 100 Q 100 0 150 10 L 150 100 Z" fill="url(#grad)" fillOpacity="0.1" />
                    <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,100 120,100 140,10 160,100 300,100" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'rgb(37,99,235)',stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'rgb(255,255,255)',stopOpacity:0}} />
                      </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-300">
                    <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
                 </div>
                 <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-slate-300">
                    <span>140</span><span>105</span><span>70</span><span>35</span><span>0</span>
                 </div>
              </div>
              <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Leads Criados</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Reuniões Marcadas</div>
              </div>
           </div>
        </div>

        {/* Ranking & Conversion Rates (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">Ranking de Fechamentos</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Gabriel Dantras', avatar: 'GD', color: 'bg-slate-100' },
                   { name: 'Kyros', avatar: 'K', color: 'bg-slate-100' },
                   { name: 'Luis Venx', avatar: 'LV', color: 'bg-slate-100' },
                   { name: 'Lucca Hurtado', avatar: 'LH', color: 'bg-slate-100' },
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-300 w-3">{i+1 === 1 ? '🥇' : i+1}</span>
                       <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 uppercase">{p.avatar}</div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-slate-700">{p.name}</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                       </div>
                     </div>
                     <span className="text-sm font-black text-slate-900">0</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[350px] flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 mb-8 tracking-tight">Taxas de Conversão</h4>
              <div className="flex-1 flex flex-col justify-between py-2 relative">
                 <div className="absolute inset-y-0 left-20 right-0 border-x border-slate-50 opacity-50 flex justify-between">
                   <div className="h-full w-px bg-slate-50"></div>
                   <div className="h-full w-px bg-slate-50"></div>
                   <div className="h-full w-px bg-slate-50"></div>
                 </div>
                 
                 {[
                   { label: 'Lead → Contato Iniciado', perc: 0 },
                   { label: 'Contato Iniciado → Reunião Marcada', perc: 100, color: 'bg-blue-600' },
                   { label: 'Reunião Marcada → Proposta Enviada', perc: 0 },
                   { label: 'Proposta Enviada → Fechado', perc: 0 },
                 ].map((t, i) => (
                   <div key={i} className="flex items-center gap-4 relative z-10">
                     <span className="text-[8px] font-black text-slate-400 uppercase w-20 leading-tight text-right">{t.label}</span>
                     <div className="flex-1 h-3 bg-slate-50/50 rounded-sm overflow-hidden">
                       <div className={`h-full ${t.color || 'bg-slate-200'} transition-all`} style={{ width: `${t.perc/2}%` }}></div>
                     </div>
                   </div>
                 ))}
                 
                 <div className="flex justify-between pl-24 text-[8px] font-black text-slate-300 mt-4">
                    <span>0%</span><span>50%</span><span>100%</span><span>150%</span><span>200%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Row 4: Bottom Section (Alerts & AI Briefing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alertas */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="flex items-center gap-2 mb-8 self-start">
             <AlertCircle size={16} className="text-amber-500" />
             <h4 className="text-sm font-bold text-slate-800 tracking-tight">Alertas</h4>
           </div>
           <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <CheckCircle2 size={24} />
           </div>
           <h5 className="text-sm font-bold text-slate-800">Tudo em ordem!</h5>
           <p className="text-[11px] text-slate-400 font-medium">Nenhum alerta no momento</p>
        </div>

        {/* AI Briefing */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col relative group">
           <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-2">
               <Sparkles size={16} className="text-blue-500" />
               <h4 className="text-sm font-bold text-slate-800 tracking-tight">Briefing do Time</h4>
             </div>
             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all">
               <RefreshCcw size={12} /> Gerar
             </button>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-2xl">
                 <Sparkles size={28} className="text-blue-600" />
              </div>
              <div className="max-w-xs text-center">
                 <h5 className="text-sm font-bold text-slate-800 mb-1">Resumo com IA</h5>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Gere um resumo inteligente do desempenho do time</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1147b1] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all">
                 <Sparkles size={14} /> Gerar Briefing
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Crm;
