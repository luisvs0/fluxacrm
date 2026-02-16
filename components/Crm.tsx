
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  Trophy, 
  Sparkles, 
  ChevronDown,
  UserPlus,
  Loader2,
  Database,
  UserCheck,
  Zap,
  RefreshCcw,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Activity,
  Bot,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';
import ChartCard from './ChartCard';

interface CrmProps {
  user: any;
}

const Crm: React.FC<CrmProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  const [selectedSquad, setSelectedSquad] = useState('Todos os Squads');
  const [selectedMember, setSelectedMember] = useState('Todos os Membros');
  
  const [leads, setLeads] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [squads, setSquads] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

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
      case 'Este Trimestre':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
      case 'Este Ano':
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
    }
    return { start, end };
  };
  
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { start, end } = getPeriodDates(activePeriod);
      
      const [leadsRes, goalsRes, squadsRes, membersRes] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id).gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('squads').select('id, name, members').eq('user_id', user.id),
        supabase.from('profiles').select('id, full_name').eq('user_id', user.id)
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (squadsRes.data) setSquads(squadsRes.data);
      if (membersRes.data) setMembers(membersRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados comerciais:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, activePeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const metrics = useMemo(() => {
    let filteredLeads = [...leads];

    if (selectedMember !== 'Todos os Membros') {
      filteredLeads = filteredLeads.filter(l => l.assigned_to === selectedMember);
    }

    if (selectedSquad !== 'Todos os Squads') {
      const squad = squads.find(s => s.name === selectedSquad);
      if (squad && Array.isArray(squad.members)) {
        filteredLeads = filteredLeads.filter(l => squad.members.includes(l.assigned_to));
      }
    }

    const totalLeads = filteredLeads.length;
    const potentialValue = filteredLeads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    
    const stages = {
      lead: filteredLeads.filter(l => l.stage?.toLowerCase() === 'lead').length,
      contato: filteredLeads.filter(l => l.stage?.toLowerCase() === 'qualificacao' || l.stage?.toLowerCase() === 'contato').length,
      reuniao: filteredLeads.filter(l => l.stage?.toLowerCase() === 'reuniao' || l.stage?.toLowerCase() === 'visita').length,
      proposta: filteredLeads.filter(l => l.stage?.toLowerCase() === 'proposta' || l.stage?.toLowerCase() === 'negociacao').length,
      fechado: filteredLeads.filter(l => l.stage?.toLowerCase() === 'fechado').length
    };

    const closings = stages.fechado;
    const meetings = stages.reuniao;
    const contacted = totalLeads - stages.lead;

    const contactToMeetingRate = contacted > 0 ? Math.round((meetings / contacted) * 100) : 0;
    const closingRate = totalLeads > 0 ? Math.round((closings / totalLeads) * 100) : 0;

    const groupedRanking = filteredLeads.reduce((acc: any, lead) => {
      if (lead.stage?.toLowerCase() === 'fechado') {
        const name = lead.assigned_to || 'Sem Corretor';
        acc[name] = (acc[name] || 0) + 1;
      }
      return acc;
    }, {});

    const ranking = Object.entries(groupedRanking)
      .map(([name, score]) => ({
        name,
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        score: score as number
      }))
      .sort((a, b) => b.score - a.score);

    return {
      totalLeads,
      potentialValue,
      contactToMeetingRate,
      closingRate,
      contacted,
      meetings,
      closings,
      stages,
      ranking
    };
  }, [leads, selectedMember, selectedSquad, squads]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Corporativo Comercial */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
               <BriefcaseIcon size={20} className="text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Performance & Pipeline</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Dashboard <span className="text-[#203267] not-italic">Comercial</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sincronização Comercial</span>
             <span className="text-xs font-bold text-slate-900">Distributed Leads Node</span>
          </div>
          <button 
            onClick={fetchDashboardData} 
            className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] hover:shadow-xl transition-all duration-700 active:scale-90 group"
          >
            <RefreshCcw size={22} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'}`} />
          </button>
        </div>
      </div>

      {/* Filter Console Unificado */}
      <div className="relative z-10 px-4 md:px-10 mb-12 mt-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex flex-wrap items-center gap-3 pl-3">
            <div className="flex items-center gap-3 mr-4 py-2 px-4 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
              <Calendar size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Período Fiscal</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {['Hoje', 'Esta Semana', 'Este Mês', 'Este Trimestre', 'Este Ano'].map(p => (
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
              <div className="relative group">
                <select 
                  value={selectedSquad}
                  onChange={(e) => setSelectedSquad(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg px-5 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-[#203267] transition-all shadow-sm focus:outline-none cursor-pointer"
                >
                  <option>Todos os Squads</option>
                  {squads.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#203267]" size={14} />
              </div>

              <div className="relative group">
                <select 
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg px-5 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-[#203267] transition-all shadow-sm focus:outline-none cursor-pointer"
                >
                  <option>Todos os Membros</option>
                  {members.map(m => <option key={m.id} value={m.full_name}>{m.full_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#203267]" size={14} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> CRM Node Central</span>
             <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Architecture */}
      <div className="relative z-10 px-4 md:px-10 space-y-12">
        
        {/* Row 1: Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Valor Potencial" 
            value={formatCurrency(metrics.potentialValue)} 
            subtitle="Pipeline Total em SQL"
            icon={<DollarSign />} 
            color="blue" 
          />
          <StatCard 
            title="Taxa de Reunião" 
            value={`${metrics.contactToMeetingRate}%`} 
            subtitle={`${metrics.meetings} visitas agendadas`}
            icon={<TrendingUp />} 
            color="red" 
          />
          <StatCard 
            title="Taxa de Conversão" 
            value={`${metrics.closingRate}%`} 
            subtitle="Fechamentos vs Total Leads"
            icon={<Target />} 
            color="blue" 
            showInfo
          />
          <StatCard 
            title="Leads Ativos" 
            value={metrics.totalLeads.toString()} 
            subtitle="Base processada no período"
            icon={<Users />} 
            color="blue" 
          />
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Prospecções', val: metrics.totalLeads, icon: <UserPlus size={16}/> },
            { label: 'Contatados', val: metrics.contacted, icon: <MessageSquare size={16}/> },
            { label: 'Visitas', val: metrics.meetings, icon: <Activity size={16}/> },
            { label: 'Propostas', val: metrics.stages.proposta, icon: <Zap size={16}/> },
            { label: 'Fechamentos', val: metrics.closings, icon: <Trophy size={16}/> },
            { label: 'Churn Rate', val: '0.0%', icon: <AlertTriangle size={16}/> },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm group hover:border-[#203267] hover:shadow-xl transition-all flex flex-col justify-between">
               <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-[#203267] transition-colors">{s.icon}</div>
                  <span className="text-[8px] font-black uppercase text-slate-300">Auditado</span>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate mb-1">{s.label}</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter">{s.val}</h3>
               </div>
            </div>
          ))}
        </div>

        {/* Main Strategic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Funnel Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white border border-slate-300 rounded-xl p-10 shadow-sm transition-all hover:shadow-2xl duration-700">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 italic">Funil de Conversão</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Leads', count: metrics.totalLeads, perc: '100%', color: 'bg-blue-600' },
                    { label: 'Qualificação', count: metrics.contacted, perc: `${Math.round((metrics.contacted/metrics.totalLeads)*100) || 0}%`, color: 'bg-indigo-500' },
                    { label: 'Demonstração', count: metrics.meetings, perc: `${Math.round((metrics.meetings/metrics.totalLeads)*100) || 0}%`, color: 'bg-indigo-400' },
                    { label: 'Negociação', count: metrics.stages.proposta, perc: `${Math.round((metrics.stages.proposta/metrics.totalLeads)*100) || 0}%`, color: 'bg-indigo-300' },
                    { label: 'Fechamento', count: metrics.closings, perc: `${Math.round((metrics.closings/metrics.totalLeads)*100) || 0}%`, color: 'bg-emerald-500' },
                  ].map((step, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{step.label}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-black text-slate-900">{step.count}</span>
                           <span className="text-[10px] font-bold text-slate-300">({step.perc})</span>
                        </div>
                      </div>
                      <div className="h-9 w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center p-1">
                        <div className={`h-full ${step.color} rounded-md transition-all duration-1000 shadow-sm`} style={{ width: step.perc }}></div>
                      </div>
                      {i < 4 && <div className="flex justify-center py-1 opacity-10"><ArrowDown size={10}/></div>}
                    </div>
                  ))}
               </div>
            </div>

            {/* In-Risk Leads Card */}
            <div className="bg-white border border-slate-300 rounded-xl p-10 shadow-sm transition-all hover:shadow-2xl duration-700">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                     <AlertTriangle size={16} className="text-amber-500" /> Alertas CRM
                  </h4>
               </div>
               <div className="space-y-3">
                  <div className="p-6 bg-rose-50 border border-rose-300 rounded-lg group hover:scale-[1.02] transition-all cursor-pointer">
                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Leads em Estagnação (48h+)</p>
                     <p className="text-[10px] font-medium text-slate-500 mt-1 italic">3 Atendimentos sem movimentação no pipeline</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Goals & Charts Section */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white border border-slate-300 rounded-xl p-10 shadow-sm transition-all hover:shadow-2xl duration-700">
               <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-blue-50 text-[#203267] rounded-xl border border-blue-300 shadow-sm"><Target size={24}/></div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Progresso de Metas</h4>
               </div>
               <div className="space-y-10">
                  {goals.filter(g => g.scope === 'Empresa').slice(0, 2).map((g, i) => {
                    const perc = Math.min((Number(g.current_value)/Number(g.target_value))*100, 100) || 0;
                    return (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase">{g.title}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{g.current_value} de {formatCurrency(g.target_value)}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-xl font-black text-[#203267]">{perc.toFixed(0)}%</p>
                            </div>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                            <div className={`h-full bg-[#203267] transition-all duration-1000 shadow-sm`} style={{ width: `${perc}%` }} />
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-2xl duration-700">
               <div className="p-10 border-b border-slate-300 flex items-center justify-between bg-slate-50/20">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                     <Activity size={20} className="text-[#203267]"/> Atividade de Prospecção
                  </h4>
                  <span className="text-[10px] text-[#203267] font-black bg-white px-4 py-1.5 rounded-full border border-slate-300 shadow-sm">SQL Realtime</span>
               </div>
               <div className="p-2">
                  <ChartCard 
                    title="" 
                    xAxisLabels={['02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
                    legend={[
                      { label: 'Novos Leads', color: '#203267' },
                      { label: 'Contatos', color: '#22c55e' }
                    ]}
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Row 4: Ranking & AI Briefing */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-16">
          <div className="xl:col-span-2 border border-slate-300 rounded-xl bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-700">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-300"><Trophy size={24}/></div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Ranking de Performance</h4>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.ranking.slice(0, 6).map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-lg border border-slate-300 group hover:bg-white hover:border-[#203267] transition-all">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-slate-300 w-4">{i + 1}</span>
                         <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black italic border border-slate-700">
                            {item.initials}
                         </div>
                         <div className="flex flex-col">
                            <p className="text-sm font-bold text-slate-700 uppercase tracking-tight truncate max-w-[120px]">{item.name}</p>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocolo Ativo</span>
                         </div>
                      </div>
                      <span className="text-2xl font-black text-slate-900">{item.score}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* AI Briefing - Executive Styled */}
          <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-10 text-white shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 flex flex-col items-center text-center">
             <div className="absolute top-8 left-8 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Commercial Analysis</span>
             </div>
             
             <div className="mt-16 mb-8 relative">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                   <Bot size={48} className="text-indigo-200" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg border-4 border-[#0a0c10] flex items-center justify-center">
                   <Zap size={14} fill="white" />
                </div>
             </div>

             <h4 className="text-xl font-black uppercase tracking-tight mb-3 italic">Briefing Inteligente</h4>
             <p className="text-sm text-white/40 font-medium leading-relaxed mb-12 max-w-[250px]">
                Consolide métricas de conversão e pipeline em um relatório executivo instantâneo.
             </p>

             <button className="w-full py-5 bg-white text-[#0a0c10] rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                <Zap size={18} fill="currentColor" /> Sincronizar Briefing
             </button>
             
             <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12">
                <Bot size={250} />
             </div>
          </div>
        </div>

      </div>

      {/* Floating Indicator */}
      {isLoading && (
        <div className="fixed bottom-24 md:bottom-12 right-4 md:right-12 bg-slate-900 text-white px-10 py-5 rounded-xl shadow-2xl flex items-center gap-5 z-[60] border border-slate-700 animate-bounce">
          <Loader2 size={24} className="animate-spin text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-1 text-white">Engine Sincronizada</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight">Conciliando funil comercial SQL...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const BriefcaseIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

export default Crm;
