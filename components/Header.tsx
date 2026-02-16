
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Command, LayoutGrid, Tv, ChevronDown as ChevronDownIcon } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import GlobalSearchOverlay from './GlobalSearchOverlay';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenTv?: () => void;
  title: string;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onOpenTv, title, onNavigate, activeView }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (!error) setUnreadCount(count || 0);
    } catch (err) {
      console.error('Erro ao contar notificações:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    const channel = supabase
      .channel('header-notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    { label: 'Indicadores', view: 'Dashboard' },
    { label: 'Atendimentos', view: 'Pipeline' },
    { label: 'Imóveis', view: 'Imóveis' }
  ];

  const isItemActive = (view: string) => {
    if (view === 'Dashboard' && activeView === 'Dashboard') return true;
    if (view === 'Pipeline' && activeView === 'Pipeline') return true;
    if (view === 'Imóveis' && activeView === 'Imóveis') return true;
    return false;
  };

  return (
    <header className="px-4 md:px-8 h-20 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-10">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 hover:text-[#01223d] active:scale-95 transition-all">
          <Menu size={24} />
        </button>

        <nav className="hidden lg:flex items-center gap-10">
          {menuItems.map(item => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.view)}
              className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 h-20 relative group ${
                isItemActive(item.view) 
                ? 'text-[#01223d]' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}
              <ChevronDownIcon size={12} className={isItemActive(item.view) ? 'text-[#01223d]' : 'text-slate-300'} />
              {isItemActive(item.view) && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#01223d] rounded-t-full shadow-[0_-2px_8px_rgba(1,34,61,0.2)]"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
           <button 
             onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
             className="p-2.5 text-slate-400 hover:text-[#01223d] transition-all relative rounded-lg hover:bg-white hover:shadow-sm"
           >
             <Bell size={18} />
             {unreadCount > 0 && (
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-slate-50 rounded-full animate-bounce"></span>
             )}
           </button>
           
           <button 
             onClick={() => setIsSearchOpen(true)}
             className="p-2.5 text-slate-400 hover:text-[#01223d] transition-all rounded-lg hover:bg-white hover:shadow-sm"
           >
             <Search size={18} />
           </button>

           <button 
             onClick={onOpenTv}
             className="p-2.5 text-slate-400 hover:text-[#01223d] transition-all rounded-lg hover:bg-white hover:shadow-sm"
           >
             <LayoutGrid size={18} />
           </button>
        </div>
      </div>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {isNotificationsOpen && <NotificationCenter onClose={() => setIsNotificationsOpen(false)} onMarkAllRead={fetchUnreadCount} />}
    </header>
  );
};

export default Header;
