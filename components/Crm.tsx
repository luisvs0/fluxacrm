
import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ArrowUpRight,
  UserPlus,
  CheckCircle2,
  Bell,
  Loader2,
  Database,
  BarChart3,
  CalendarDays,
  UserCheck,
  Zap,
  Info,
  RefreshCcw,
  ArrowDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Crm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  
  // Dashboard Data State
  const [data, setData] = useState({
    potentialValue: 0,
    contactToMeeting: 0,
    closingRate: 0,
    leadsCount: 0,
    contactedCount: 0,
    meetingsScheduled: 0,
    meetingsDone: 0,
    noShow: 0,
    closings: 0,
    funnel: {
      lead: 0,
      contato: 0,
      reuniao: 0,
      proposta: 0,
      fechado: 0
    },
    ranking: [] as any[]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: leads, error } = await supabase.from('leads').select('*');
      if (error) throw error;

      if (leads) {
        const funnel = leads.reduce((acc: any, lead: any) => {
          const stage = lead.stage?.toLowerCase();
          if (acc[stage] !== undefined) acc[stage]++;
          return acc;
        }, { lead: 0, contato: 0, reuniao: 0, proposta: 0, fechado: 0 });

        const potential = leads
          .filter(l => l.status !== 'LOST' && l.stage !== 'fechado')
          .reduce((acc, l) => acc + (Number(l.value) || 0), 0);

        const convContactMeeting = funnel.contato > 0 ? (funnel.reuniao / funnel.contato) * 100 : 0;
        const closingRate = leads.length > 0 ? (funnel.fechado / leads.length) * 100 : 0;

        const reps = ['Gabriel Dantras', 'Kyros', 'Luis Venx', 'Lucca Hurtado'];
        const ranking = reps.map(name => ({
          name,
          initials: name.split(' ').map(n => n[0]).join(''),
          value: leads.filter(l => l.assigned_to?.includes(name) && l.stage === 'fechado').length
        })).sort((a, b) => b.value - a.value);

        setData({
          potentialValue: potential,
          contactToMeeting: convContactMeeting,
          closingRate: closingRate,
          leadsCount: leads.length,
          contactedCount: funnel.contato + funnel.reuniao + funnel.proposta + funnel.fechado,
          meetingsScheduled: funnel.reuniao + funnel.proposta + funnel.fechado,
          meetingsDone: funnel.proposta + funnel.fechado,
          noShow: 0,
          closings: funnel.fechado,
          funnel,
          ranking
        });
      }
    } catch (err) {
      console.error('Erro ao processar dados CRM:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Sincronizando Dashboard Comercial...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700">
      
      {/* Header & Filter Bar - Responsivo */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Dashboard Comercial</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Acompanhe a performance do time em tempo real</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm overflow-x-auto no-scrollbar shrink-0">
             <Calendar size={14} className="text-slate-400 mx-3 shrink-0" />
             <div className="flex gap-1">
               {['Hoje', 'Mês', 'Tri', 'Ano'].map(p => (
                 <button 
                  key={p} 
                  onClick={() => setActivePeriod(p === 'Tri' ? 'Este Trimestre' : p === 'Mês' ? 'Este Mês' : p === 'Ano' ? 'Este Ano' : p)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${activePeriod.includes(p) || activePeriod === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <select className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-[11px] font-bold text-slate-600 appearance-none pr-10 shadow-sm">
                <option>Todos os Squads</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            </div>
            <button onClick={fetchData} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all">
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6 md:mt-8 space-y-6">
        
        {/* Main 3 KPIs Row - Adaptativo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={18}/></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter truncate">{formatCurrency(data.potentialValue)}</h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight size={14} /> Pipeline ativo
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">Conv. Agendamento</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><TrendingUp size={18}/></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{data.contactToMeeting.toFixed(0)}%</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-2">
              Contato → Reunião
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm relative group sm:col-span-2 lg:col-span-1 hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Target size={18}/></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{data.closingRate.toFixed(0)}%</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-2">
              {data.closings} de {data.leadsCount} leads
            </p>
          </div>
        </div>

        {/* Activity Row - Responsivo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { label: 'Prospectados', val: data.leadsCount, icon: <Users size={12}/> },
            { label: 'Contatados', val: data.contactedCount, icon: <UserCheck size={12}/> },
            { label: 'Agendados', val: data.meetingsScheduled, icon: <CalendarDays size={12}/> },
            { label: 'Realizados', val: data.meetingsDone, icon: <CheckCircle2 size={12}/> },
            { label: 'No-show', val: data.noShow, icon: <UserPlus size={12}/> },
            { label: 'Vendas', val: data.closings, icon: <Trophy size={12}/> },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 md:p-4 shadow-sm group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.label}</span>
                <div className="p-1.5 bg-slate-50 text-slate-400 group-hover:text-blue-500 rounded-lg transition-colors">{item.icon}</div>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Funnel & Grid Central - Stacked no mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Funil Visual */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-widest">Funil de Conversão</h4>
            <div className="space-y-5">
              {[
                { label: 'Lead', count: data.funnel.lead, color: 'bg-blue-400' },
                { label: 'Contato', count: data.funnel.contato, color: 'bg-blue-600' },
                { label: 'Reunião', count: data.funnel.reuniao, color: 'bg-purple-500' },
                { label: 'Proposta', count: data.funnel.proposta, color: 'bg-rose-400' },
                { label: 'Fechado', count: data.funnel.fechado, color: 'bg-emerald-500' },
              ].map((step, i) => {
                const perc = data.leadsCount > 0 ? (step.count / data.leadsCount) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{step.label}</span>
                      <span className="text-[10px] font-black text-slate-900">{step.count} <span className="text-slate-300 ml-0.5">({perc.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: `${perc}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Atividades & Metas */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col min-h-[300px]">
               <div className="flex justify-between items-center mb-10">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Performance Semanal</h4>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Prospecção</span>
                 </div>
               </div>
               <div className="flex-1 flex items-center justify-center opacity-10">
                  <TrendingUp size={80} />
               </div>
               <div className="flex justify-between mt-4 text-[8px] font-black text-slate-300 uppercase px-2">
                  <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span>
               </div>
            </div>
          </div>

          {/* Ranking Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Top Closers</h4>
               <div className="space-y-4">
                  {data.ranking.slice(0, 4).map((rep, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all`}>{rep.initials}</div>
                          <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{rep.name}</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{rep.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#002147] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                     <Sparkles size={16} className="text-blue-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/50">IA Insights</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">Sua conversão de proposta está <span className="text-emerald-400 font-bold">12% acima</span> da média.</p>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Análise Detalhada</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-[100]">
          <Loader2 size={16} className="animate-spin text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Atualizando...</span>
        </div>
      )}
    </div>
  );
};

export default Crm;
