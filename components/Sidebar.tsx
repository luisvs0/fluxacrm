
import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Megaphone, 
  Settings, 
  Users, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  BarChart,
  UserCheck,
  Target,
  Trophy,
  Receipt,
  Network,
  CreditCard,
  FileText,
  BarChart3,
  Wrench,
  X,
  Building2,
  Package,
  Rocket,
  Star,
  CircleDot,
  Wallet,
  PanelLeftClose,
  PanelLeft,
  Scale,
  Users2,
  FileSignature,
  ShieldCheck,
  Loader2,
  Home,
  MapPin,
  HandCoins,
  Eye
} from 'lucide-react';
import { NavItem } from '../types';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  userEmail?: string;
  userName?: string;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed, 
  userEmail, 
  userName, 
  toggleSidebar, 
  toggleCollapse, 
  onNavigate, 
  activeView 
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Imobiliária', 'Financeiro', 'Operacional', 'Comercial']);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMenu = (id: string) => {
    if (isCollapsed) {
      toggleCollapse();
      setExpandedMenus(prev => prev.includes(id) ? prev : [...prev, id]);
      return;
    }
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
  };

  const userInitial = (userName || userEmail || 'U').substring(0, 1).toUpperCase();

  const navItems: NavItem[] = [
    { 
      id: 'Imobiliária', 
      label: 'Imobiliária', 
      icon: <Home size={18} />,
      subItems: [
        { id: 'Imóveis', label: 'Gestão de Imóveis', icon: <MapPin size={16} /> },
        { id: 'Visitas', label: 'Controle de Visitas', icon: <Eye size={16} /> },
        { id: 'Repasses', label: 'Gestão de Repasses', icon: <HandCoins size={16} /> },
      ]
    },
    { id: 'Agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { 
      id: 'Financeiro', 
      label: 'Financeiro', 
      icon: <DollarSign size={18} />,
      subItems: [
        { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'Lançamentos', label: 'Lançamentos', icon: <Receipt size={16} /> },
        { id: 'Centros', label: 'Centros de Custo', icon: <Network size={16} /> },
        { id: 'Cartões', label: 'Cartões', icon: <CreditCard size={16} /> },
        { id: 'Impostos', label: 'Impostos', icon: <FileText size={16} /> },
        { id: 'Contábil', label: 'Contábil', icon: <Scale size={16} /> },
      ]
    },
    { 
      id: 'Comercial', 
      label: 'Comercial', 
      icon: <Briefcase size={18} />,
      subItems: [
        { id: 'Comercial-Dashboard', label: 'Dashboard', icon: <LayoutGrid size={16} /> },
        { id: 'Pipeline', label: 'Pipeline', icon: <BarChart size={16} /> },
        { id: 'Leads', label: 'Leads', icon: <UserCheck size={16} /> },
        { id: 'Metas', label: 'Metas', icon: <Target size={16} /> },
        { id: 'Ranking', label: 'Ranking', icon: <Trophy size={16} /> },
        { id: 'Squads', label: 'Squads', icon: <Users2 size={16} /> },
      ]
    },
    { 
      id: 'Marketing', 
      label: 'Marketing', 
      icon: <Megaphone size={18} />,
      subItems: [
        { id: 'Marketing-Dashboard', label: 'Dashboard', icon: <LayoutGrid size={16} /> },
        { id: 'Marketing-Kanbans', label: 'Kanbans', icon: <BarChart3 size={16} /> },
      ]
    },
    { 
      id: 'Operacional', 
      label: 'Operacional', 
      icon: <Building2 size={18} />,
      subItems: [
        { id: 'Operacional-Clientes', label: 'Clientes', icon: <Users size={16} /> },
        { id: 'Operacional-Contratos', label: 'Contratos', icon: <FileSignature size={16} /> },
        { id: 'Operacional-Produtos', label: 'Produtos', icon: <Package size={16} /> },
        { id: 'Operacional-Onboarding', label: 'Onboarding', icon: <Rocket size={16} /> },
        { id: 'Operacional-NPS', label: 'NPS', icon: <Star size={16} /> },
        { id: 'Operacional-OKR', label: 'OKR', icon: <CircleDot size={16} /> },
        { id: 'Operacional-Equipe', label: 'Equipe', icon: <Wallet size={16} /> },
        { id: 'Operacional-Ferramentas', label: 'Ferramentas', icon: <Wrench size={16} /> },
      ]
    },
    {
      id: 'Admin',
      label: 'Administração',
      icon: <ShieldCheck size={18} />,
      subItems: [
        { id: 'Usuários', label: 'Equipe & Acessos', icon: <Users size={16} /> },
        { id: 'Configurações', label: 'Ajustes de Conta', icon: <Settings size={16} /> },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-100 transition-all duration-500 ease-in-out transform flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'w-[280px] lg:w-20' : 'w-[280px] lg:w-72'}`}
    >
      {/* Header Fixo do Sidebar */}
      <div className={`p-6 flex items-center justify-between bg-white shrink-0 ${isCollapsed ? 'lg:flex-col lg:gap-6' : 'pb-8'}`}>
        <div 
          className="flex items-center group cursor-pointer overflow-hidden max-w-full"
          onClick={() => isCollapsed ? toggleCollapse() : onNavigate('Dashboard')}
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
            alt="Fluxa Logo" 
            className={`transition-all duration-500 object-contain ${isCollapsed ? 'h-7 lg:h-7 lg:w-7' : 'h-8'}`}
          />
        </div>
        
        <button 
          onClick={toggleCollapse} 
          className="hidden lg:flex p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-900"
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-900"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Rolável */}
      <div className={`flex-1 overflow-y-auto no-scrollbar pb-10 ${isCollapsed ? 'px-6 lg:px-2 space-y-8 lg:space-y-6' : 'px-6 space-y-8'}`}>
        {navItems.map((item) => (
          <div key={item.id} className="space-y-3">
            {/* Categoria/Divisor */}
            <div className={`px-3 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : ''}`}>
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-[0.25em]">{item.label}</span>
              {item.subItems && (
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className="text-slate-300 hover:text-slate-900 transition-colors"
                >
                  {expandedMenus.includes(item.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
              )}
            </div>
            
            {isCollapsed && <div className="hidden lg:block w-full h-px bg-slate-50 mx-auto max-w-[24px]" />}
            
            <div className="space-y-1">
              {!item.subItems ? (
                <button 
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-2xl transition-all duration-300 group ${
                    isCollapsed ? 'justify-center lg:justify-center p-3.5' : 'gap-3.5 p-3.5'
                  } ${activeView === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <span className={`${activeView === item.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-slate-900'}`}>{item.icon}</span>
                  <span className={`flex-1 text-left text-xs font-medium tracking-tight ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <button 
                    onClick={() => toggleMenu(item.id)}
                    title={item.label}
                    className={`w-full flex items-center rounded-2xl transition-all group ${
                      isCollapsed ? 'justify-center lg:justify-center p-3.5' : 'gap-3.5 p-3.5'
                    } ${expandedMenus.includes(item.id) ? 'bg-slate-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    <span className="text-slate-300 group-hover:text-slate-900">{item.icon}</span>
                    <span className={`flex-1 text-left text-xs font-medium tracking-tight ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    <ChevronDown size={12} className={`text-slate-300 transition-transform ${isCollapsed ? 'lg:hidden' : ''} ${expandedMenus.includes(item.id) ? '' : '-rotate-90'}`} />
                  </button>
                  
                  {(expandedMenus.includes(item.id)) && (
                    <div className={`space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
                      {item.subItems.map(sub => (
                        <button 
                          key={sub.id} 
                          onClick={() => onNavigate(sub.id)}
                          className={`w-full flex items-center gap-4 p-3 rounded-xl text-[12px] font-medium transition-all group ${
                            activeView === sub.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`transition-colors ${activeView === sub.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-900'}`}>{sub.icon}</span>
                          <span className="tracking-tight">{sub.label}</span>
                          {activeView === sub.id && <div className="ml-auto w-1 h-1 bg-white rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé do Sidebar */}
      <div className={`p-6 border-t border-slate-50 bg-white shrink-0 ${isCollapsed ? 'lg:flex lg:flex-col lg:items-center lg:gap-6' : ''}`}>
        <div className={`bg-slate-50 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-medium shadow-sm italic">{userInitial}</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-blue-600 font-medium uppercase tracking-widest leading-none mb-1">Conta Ativa</span>
            <span className="text-xs text-slate-900 font-medium truncate">{userEmail || 'Usuário'}</span>
          </div>
        </div>
        
        <div className={`grid grid-cols-2 gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <button 
            onClick={() => onNavigate('Configurações')} 
            className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl transition-all border ${activeView === 'Configurações' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm'}`}
          >
            <Settings size={18} />
            <span className="text-[10px] font-medium uppercase tracking-widest">Ajustes</span>
          </button>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex flex-col items-center justify-center gap-2 p-3.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-2xl transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            <span className="text-[10px] font-medium uppercase tracking-widest">Sair</span>
          </button>
        </div>

        {/* Mini rodapé visível apenas quando colapsado no desktop */}
        <div className={`hidden ${isCollapsed ? 'lg:flex lg:flex-col lg:items-center lg:gap-5' : ''}`}>
            <button 
              onClick={() => onNavigate('Configurações')}
              title="Configurações"
              className={`p-3 rounded-2xl transition-all ${activeView === 'Configurações' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              title="Sair"
              className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <LogOut size={20} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-medium shadow-sm mt-2 italic">{userInitial}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
