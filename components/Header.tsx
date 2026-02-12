
import React from 'react';
import { Menu, Tv, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="px-6 py-5 flex items-center justify-between bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-500 hover:text-gray-900 group"
        >
          <Menu size={22} className="group-hover:scale-110 transition-transform" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Strict Financial Management</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
        </button>
        <button className="hidden md:flex items-center gap-2 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm text-gray-700">
          <Tv size={14} className="text-blue-600" />
          <span>Modo TV</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
