
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Database, 
  Plus, 
  AlertCircle, 
  Share2, 
  Unlink, 
  CheckCircle,
  RefreshCw,
  Activity,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewAppointmentModal from './NewAppointmentModal';
import { googleCalendar } from '../lib/googleCalendar';

interface AgendaProps {
  user: any;
}

const Agenda: React.FC<AgendaProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(googleCalendar.isConnected());

  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const fetchAppointments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', firstDay)
        .lte('start_time', lastDay)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate, user]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ is_completed: !currentStatus })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      fetchAppointments();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleConnectGoogle = async () => {
    await googleCalendar.connect();
    setIsGoogleConnected(googleCalendar.isConnected());
  };

  const handleDisconnectGoogle = () => {
    googleCalendar.disconnect();
    setIsGoogleConnected(false);
  };

  const selectedFullDate = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
  }, [currentDate, selectedDay]);

  const dayAppointments = useMemo(() => {
    return appointments.filter(app => {
      const date = new Date(app.start_time);
      return date.getDate() === selectedDay;
    });
  }, [appointments, selectedDay]);

  const daysWithData = useMemo(() => {
    const days = new Set();
    appointments.forEach(app => days.add(new Date(app.start_time).getDate()));
    return days;
  }, [appointments]);

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'comercial': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'financeiro': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'gestão': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <CalendarIcon size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Temporal Schedule Hub SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Minha <span className="text-[#203267] not-italic">Agenda</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão de prazos e compromissos sincronizados</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Novo Evento
          </button>
          <button onClick={fetchAppointments} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all shadow-sm">
            <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Lado Esquerdo: Calendário */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm flex flex-col transition-all hover:shadow-xl duration-700">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic underline decoration-[#203267]/20 decoration-4 underline-offset-8">{monthYear}</h2>
                <div className="flex gap-2">
                   <button onClick={() => changeMonth(-1)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-[#203267] transition-all text-slate-400 hover:text-[#203267] active:scale-90 shadow-sm">
                     <ChevronLeft size={20} strokeWidth={3} />
                   </button>
                   <button onClick={() => changeMonth(1)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-[#203267] transition-all text-slate-400 hover:text-[#203267] active:scale-90 shadow-sm">
                     <ChevronRight size={20} strokeWidth={3} />
                   </button>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black uppercase text-slate-300 pb-4 tracking-[0.3em]">{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const hasData = daysWithData.has(dayNum);
                  const isSelected = selectedDay === dayNum;
                  const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <div 
                      key={dayNum} 
                      onClick={() => setSelectedDay(dayNum)} 
                      className={`aspect-square border rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer shadow-sm group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-100 scale-105 z-10' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-[#203267] hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-black ${isSelected ? 'text-blue-400' : isToday ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`}>{dayNum}</span>
                        {hasData && !isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-sm"></div>}
                        {isToday && !isSelected && <div className="absolute top-1 right-1 w-1 h-1 bg-blue-600 rounded-full"></div>}
                      </div>
                      {hasData && <div className={`text-[8px] font-black uppercase tracking-widest truncate ${isSelected ? 'text-white/60' : 'text-slate-300'}`}>{appointments.filter(a => new Date(a.start_time).getDate() === dayNum).length} Op.</div>}
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-2">
                      <ShieldCheck size={16} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Governance Node</span>
                   </div>
                   <h3 className="text-xl font-black uppercase tracking-tight italic">Relatório Mensal de Produtividade</h3>
                   <p className="text-sm text-white/40 font-medium">Consolidação automática de todos os eventos realizados no ciclo atual.</p>
                </div>
                <button className="px-8 py-3 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all shadow-xl active:scale-95">Gerar Ledger Mensal</button>
             </div>
             <Database size={180} className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Lado Direito: Timeline & Integração */}
        <div className="space-y-8">
          {/* Card Google Calendar Corporate */}
          <div className={`p-8 rounded-xl border border-slate-300 transition-all duration-700 bg-white shadow-sm hover:shadow-xl group ${isGoogleConnected ? 'border-emerald-200' : 'hover:border-[#203267]'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-md group-hover:scale-110 transition-transform ${isGoogleConnected ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-7 h-7" alt="GCal" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Google Integration</h4>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isGoogleConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {isGoogleConnected ? 'Sincronização Ativa' : 'DB Node Desconectado'}
                  </span>
                </div>
              </div>
              {isGoogleConnected && (
                <button onClick={handleDisconnectGoogle} className="p-2 text-slate-300 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-lg border border-slate-100"><Unlink size={16} /></button>
              )}
            </div>
            
            {!isGoogleConnected ? (
              <button 
                onClick={handleConnectGoogle}
                className="w-full py-4 bg-[#203267] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
              >
                <Share2 size={16} /> Autorizar Sincronismo
              </button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                 <CheckCircle size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Eventos auditados e espelhados</span>
              </div>
            )}
          </div>

          {/* Timeline do Dia */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">Timeline Dia {selectedDay}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-2.5 bg-indigo-50 text-[#203267] rounded-xl border border-slate-200 hover:bg-[#203267] hover:text-white transition-all active:scale-90 shadow-sm"
              >
                 <Plus size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                   <Loader2 className="animate-spin text-[#203267]" size={32} />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Horários SQL...</p>
                </div>
              ) : dayAppointments.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white border border-slate-300 rounded-xl shadow-sm group">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarIcon size={32} className="text-slate-200" />
                  </div>
                  <div className="px-8">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">Nenhum registro para este nó temporal</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline underline-offset-8 decoration-2 italic">Criar evento agora</button>
                  </div>
                </div>
              ) : (
                dayAppointments.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-300 p-6 rounded-xl flex gap-6 items-center group hover:border-[#203267] hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center text-slate-400 border-r border-slate-100 pr-6 group-hover:text-[#203267] transition-colors min-w-[70px]">
                      <Clock size={16} className="mb-1.5" />
                      <span className="text-sm font-black tracking-tighter italic">{new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-black group-hover:text-slate-900 transition-colors truncate uppercase tracking-tight italic ${item.is_completed ? 'text-slate-300 line-through' : 'text-slate-800'}`}>{item.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md border shadow-sm ${getCategoryColor(item.category)}`}>{item.category || 'Geral'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleComplete(item.id, item.is_completed)}
                      className={`transition-all hover:scale-110 active:scale-90 p-2 rounded-lg border ${item.is_completed ? 'bg-emerald-50 border-emerald-300 text-emerald-500 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-200 hover:text-slate-400 hover:border-slate-300 shadow-sm'}`}
                    >
                       <CheckCircle2 size={22} strokeWidth={3} />
                    </button>
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-[#203267] opacity-40`}></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchAppointments(); }} 
        user={user}
        defaultDate={selectedFullDate}
      />
    </div>
  );
};

export default Agenda;
