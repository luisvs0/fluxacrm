
import React from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle, Clock, Trash2, CheckCheck } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
  onMarkAllRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onMarkAllRead }) => {
  const notifications = [
    {
      id: 1,
      type: 'venda',
      title: 'Nova Venda Realizada!',
      desc: 'Sirius Tecnologia fechou contrato de R$ 15.000,00.',
      time: 'Agora mesmo',
      unread: true,
    },
    {
      id: 2,
      type: 'dados',
      title: 'Dados Finalizados',
      desc: 'O DRE de Abril/2024 foi consolidado com sucesso.',
      time: 'Há 12 min',
      unread: true,
    },
    {
      id: 3,
      type: 'alerta',
      title: 'Atenção ao Budget',
      desc: 'O Squad Alpha atingiu 90% do orçamento de Marketing.',
      time: 'Há 2 horas',
      unread: true,
    },
    {
      id: 4,
      type: 'venda',
      title: 'Lead Convertido',
      desc: 'Gabriel Dantas moveu "Agência PV" para Fechado.',
      time: 'Há 5 horas',
      unread: false,
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'venda': return <ShoppingBag size={14} className="text-emerald-500" />;
      case 'dados': return <CheckCircle2 size={14} className="text-blue-500" />;
      case 'alerta': return <AlertCircle size={14} className="text-amber-500" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'venda': return 'bg-emerald-50';
      case 'dados': return 'bg-blue-50';
      case 'alerta': return 'bg-amber-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <>
      {/* Backdrop invisível para fechar ao clicar fora */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute top-full right-0 mt-3 w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notificações</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Alertas em tempo real</p>
          </div>
          <button 
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CheckCheck size={14} /> Lidas
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${notif.unread ? 'bg-blue-50/20' : ''}`}
            >
              {notif.unread && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>
              )}
              
              <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${getBg(notif.type)} shadow-sm`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-50">
          <button className="w-full py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm">
            Ver todo o histórico
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
