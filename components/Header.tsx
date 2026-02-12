
import React, { useState } from 'react';
import { Menu, Tv, Bell, Search, Command } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import GlobalSearchOverlay from './GlobalSearchOverlay';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Formata o título para parecer um path técnico
  const formattedTitle = title.includes('-') ? title.split('-').join(' / ') : title;

  return (
    <header className="px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-slate-100"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
             <h1 className="text-[18px] font-bold text-slate-900 tracking-tight leading-none">
               {formattedTitle}
             </h1>
             <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mt-0.5"></div>
          </div>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mt-1.5">
            Fluxa Financial Engine v2.6
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        {/* Barra de Busca Interativa */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-slate-400 hover:bg-slate-100 transition-all cursor-pointer group group-hover:border-slate-200"
        >
           <Search size={14} className="group-hover:text-slate-600 transition-colors" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Busca Inteligente...</span>
           <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-300">
             <Command size={10} />
             <span className="text-[9px] font-black">K</span>
           </div>
        </div>

        <div className="h-6 w-px bg-slate-100 mx-1 hidden sm:block"></div>

        {/* Notificações com Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 border transition-all relative rounded-full active:scale-90 group ${isNotificationsOpen ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 shadow-sm'}`}
          >
            <Bell size={18} className={`${isNotificationsOpen ? '' : 'group-hover:rotate-12'} transition-transform`} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </button>
          
          {isNotificationsOpen && (
            <NotificationCenter 
              onClose={() => setIsNotificationsOpen(false)} 
              onMarkAllRead={() => setUnreadCount(0)}
            />
          )}
        </div>

        <button className="hidden sm:flex items-center gap-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 group">
          <Tv size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Dashboard TV</span>
        </button>
      </div>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
