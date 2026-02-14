
import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle, Clock, Trash2, Bell, Loader2, Database, Calendar, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotificationCenterProps {
  onClose: () => void;
  onMarkAllRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onMarkAllRead }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Sincronização em Tempo Real: Atualiza a lista automaticamente se um alerta de agenda for gerado
    const channel = supabase
      .channel('notification-center-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new, ...prev].slice(0, 20));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      if (error) throw error;
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      onMarkAllRead();
    } catch (err) {
      console.error('Erro ao marcar como lidas:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'venda': return <ShoppingBag size={14} className="text-emerald-500" />;
      case 'dados': return <CheckCircle2 size={14} className="text-blue-500" />;
      case 'alerta': return <Calendar size={14} className="text-[#203267]" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'venda': return 'bg-emerald-50';
      case 'dados': return 'bg-blue-50';
      case 'alerta': return 'bg-indigo-50';
      default: return 'bg-slate-50';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Há ${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute top-full right-0 mt-3 w-[400px] bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300 border-t-4 border-t-[#203267]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Central de Alertas</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
               <Database size={10} className="text-blue-500" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Live Database Sync</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchNotifications}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <CheckCheck size={14} /> Lidas
            </button>
          </div>
        </div>

        <div className="max-h-[450px] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Acessando Engine...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-30">
               <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                  <Bell size={32} className="text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-center px-8">Sem alertas pendentes no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-6 flex gap-5 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notif.is_read ? 'bg-indigo-50/20' : ''}`}
                >
                  {!notif.is_read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#203267] rounded-r-full"></div>
                  )}
                  
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${getBg(notif.type)} shadow-sm group-hover:scale-105 transition-transform border border-slate-100`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight leading-tight">{notif.title}</h4>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter shrink-0">{formatTime(notif.created_at)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2 font-medium italic">"{notif.description}"</p>
                    <div className="flex items-center gap-2 mt-3">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${notif.type === 'alerta' ? 'bg-[#203267] text-white' : 'bg-slate-100 text-slate-400'}`}>
                         {notif.type || 'SISTEMA'}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
          <button className="w-full py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 hover:border-slate-200 hover:shadow-md transition-all">
            Limpar Histórico no SQL
          </button>
        </div>
      </div>
    </>
  );
};

const CheckCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12l5 5L22 4"/><path d="M12 12l5 5L22 4"/></svg>
);

export default NotificationCenter;
