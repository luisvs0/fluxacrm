
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Command, LayoutGrid } from 'lucide-react';
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
    
    // Inscrição em tempo real para reagir a novas notificações geradas pelo sistema
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
    <header className="px-4 md:px-8 py-3.5 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4 md:gap-8">
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map(item => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.view)}
              className={`text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 h-14 relative ${
                isItemActive(item.view) 
                ? 'text-[#203267]' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}
              <ChevronDown size={12} className={isItemActive(item.view) ? 'text-[#203267]' : 'text-slate-300'} />
              {isItemActive(item.view) && (
                <div className="absolute bottom-[-14px] left-0 right-0 h-[3px] bg-[#203267] rounded-t-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="p-2 text-slate-400 hover:text-[#203267] transition-all relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-bounce"></span>
          )}
        </button>
        
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 text-slate-400 hover:text-[#203267] transition-all"
        >
          <Search size={20} />
        </button>

        <button className="p-2 text-slate-400 hover:text-[#203267] transition-all">
          <LayoutGrid size={20} />
        </button>
      </div>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {isNotificationsOpen && <NotificationCenter onClose={() => setIsNotificationsOpen(false)} onMarkAllRead={fetchUnreadCount} />}
    </header>
  );
};

const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

export default Header;
