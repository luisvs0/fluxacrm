
import React, { useState, useEffect, useMemo } from 'react';
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
  UserPlus,
  Loader2,
  Database,
  BarChart3,
  CalendarDays,
  UserCheck,
  Zap,
  Info,
  RefreshCcw,
  ArrowDown,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CrmProps {
  user: any;
}

const Crm: React.FC<CrmProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  const [leads, setLeads] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  
  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [leadsRes, goalsRes] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id)
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados comerciais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const potentialValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    
    const stages = {
      lead: leads.filter(l => l.stage === 'lead').length,
      contato: leads.filter(l => l.stage === 'contato' || l.stage === 'qualificacao').length,
      reuniao: leads.filter(l => l.stage === 'reuniao').length,
      proposta: leads.filter(l => l.stage === 'proposta' || l.stage === 'negociacao').length,
      fechado: leads.filter(l => l.stage === 'fechado').length
    };

    const closings = stages.fechado;
    const meetings = stages.reuniao;
    const contacted = totalLeads - stages.lead;

    const contactToMeetingRate = contacted > 0 ? Math.round((meetings / contacted) * 100) : 0;
    const closingRate = totalLeads > 0 ? Math.round((closings / totalLeads) * 100) : 0;

    const rankingData = leads
      .filter(l => l.stage === 'fechado')
      .reduce((acc: any, curr) => {
        const name = curr.assigned_to || 'Sem Atribuição';
        if (!acc[name]) acc[name] = 0;
        acc[name]++;
        return acc;
      }, {});

    const sortedRanking = Object.entries(rankingData)
      .map(([name, count]) => ({ 
        name, 
        count: count as number,
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      }))
      .sort((a, b) => b.count - a.count);

    const alerts = goals.filter(g => {
      const p = (g.current_value / g.target_value) * 100;
      return p < (g.alert_threshold || 80);
    }).map(g => ({
      title: `Meta em risco: ${g.title}`,
      prog: `${((g.current_value / g.target_value) * 100).toFixed(0)}%`,
      exp: `${g.alert_threshold}%`
    }));

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const chartData = last7Days.map(date => {
      const leadsOnDay = leads.filter(l => l.created_at?.startsWith(date)).length;
      return { date, count: leadsOnDay };
    });

    const maxLeads = Math.max(...chartData.map(d => d.count), 1);

    return {
      totalLeads,
      potentialValue,
      contactToMeetingRate,
      closingRate,
      contacted,
      meetings,
      closings,
      stages,
      ranking: sortedRanking,
      alerts,
      chartData,
      maxLeads
    };
  }, [leads, goals]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Processando Engine Comercial SQL...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700">
      
      <div className="px-4 md:px-8 pt-6 md:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Performance Comercial</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Insights táticos baseados em dados reais do banco</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
             <Calendar size={14} className="text-slate-400 mx-3 shrink-0" />
             <div className="flex gap-1">
               {['Mês', 'Tri', 'Ano'].map(p => (
                 <button 
                  key={p} 
                  onClick={() => setActivePeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${activePeriod === p ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>
          <button onClick={fetchDashboardData} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#203267] shadow-sm transition-all active:scale-95">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6 md:mt-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-[#203267] transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial Total</h4>
                   <Info size={12} className="text-slate-200" />
                </div>
                <div className="p-2.5 bg-indigo-50 text-[#203267] rounded-xl border border-indigo-100 transition-transform group-hover:scale-110">
                   <DollarSign size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(metrics.potentialValue)}</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.totalLeads} leads em prospecção</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-[#203267] opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-indigo-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa Contato → Reunião</h4>
                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100 transition-transform group-hover:scale-110">
                   <TrendingUp size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.contactToMeetingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.meetings} reuniões de {metrics.contacted} contatos</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-indigo-600 opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-emerald-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</h4>
                <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl border border-emerald-100 transition-transform group-hover:scale-110">
                   <Target size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.closingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.closings} de {metrics.totalLeads} leads fechados</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-600 opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Leads Prospectados', val: metrics.totalLeads, icon: <Users size={16}/> },
            { label: 'Leads Contatados', val: metrics.contacted, icon: <UserCheck size={16}/> },
            { label: 'Reuniões Marcadas', val: metrics.meetings, icon: <CalendarDays size={16}/> },
            { label: 'Reuniões Realizadas', val: metrics.closings, icon: <Calendar size={16}/> }, 
            { label: 'No-show', val: 0, icon: <UserPlus size={16}/> }, 
            { label: 'Fechamentos', val: metrics.closings, icon: <Trophy size={16}/> },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-[#203267] transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-tight max-w-[80px]">{item.label}</span>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-[#203267] group-hover:text-white transition-all">{item.icon}</div>
              </div>
              <p className="text-xl font-black text-slate-900">{item.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Funil de Conversão Real</h4>
            <div className="space-y-6 flex-1">
              {[
                { label: 'Lead', count: metrics.stages.lead, color: 'bg-indigo-900', perc: metrics.totalLeads > 0 ? (metrics.stages.lead / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Contato Iniciado', count: metrics.stages.contato, color: 'bg-indigo-700', perc: metrics.totalLeads > 0 ? (metrics.stages.contato / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Reunião Marcada', count: metrics.stages.reuniao, color: 'bg-indigo-500', perc: metrics.totalLeads > 0 ? (metrics.stages.reuniao / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Proposta Enviada', count: metrics.stages.proposta, color: 'bg-indigo-300', perc: metrics.totalLeads > 0 ? (metrics.stages.proposta / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Fechado', count: metrics.stages.fechado, color: 'bg-emerald-500', perc: metrics.totalLeads > 0 ? (metrics.stages.fechado / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
              ].map((step, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{step.label}</span>
                    <span className="text-xs font-black text-slate-900">{step.count} <span className="text-slate-300 ml-1">({step.perc})</span></span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: step.perc }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Evolução de Atividades</h4>
            
            <div className="flex-1 relative flex flex-col">
               <div className="absolute left-0 top-0 bottom-10 w-8 flex flex-col justify-between text-[9px] font-black text-slate-300">
                  <span>{Math.ceil(metrics.maxLeads)}</span>
                  <span>0</span>
               </div>
               
               <div className="flex-1 ml-10 mb-10 relative border-l border-b border-slate-50">
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d={`M ${metrics.chartData.map((d, i) => `${(i / 6) * 100},${100 - (d.count / metrics.maxLeads * 100)}`).join(' L ')}`}
                      fill="none" 
                      stroke="#203267" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />
                  </svg>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="bg-[#1a2954] rounded-[2rem] p-8 shadow-xl relative group overflow-hidden flex flex-col items-center justify-center text-center flex-1">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 shadow-2xl border border-indigo-500/30">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <h5 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Briefing do Time</h5>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#203267] border border-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-800 shadow-xl transition-all">
                <Zap size={14} fill="currentColor" /> Gerar Briefing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crm;
