
import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Megaphone, 
  Settings, 
  Users, 
  LogOut, 
  Sun, 
  Moon, 
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
  Wallet
} from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onNavigate, activeView }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Financeiro', 'Comercial', 'Marketing', 'Operacional']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const navItems: NavItem[] = [
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
        { id: 'Contábil', label: 'Contábil', icon: <BarChart3 size={16} /> },
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
        { id: 'Squads', label: 'Squads', icon: <Users size={16} /> },
      ]
    },
    { 
      id: 'Marketing', 
      label: 'Marketing', 
      icon: <Megaphone size={18} />,
      subItems: [
        { id: 'Marketing-Dashboard', label: 'Dashboard', icon: <LayoutGrid size={16} /> },
        { id: 'Marketing-Kanbans', label: 'Kanbans', icon: <BarChart size={16} /> },
      ]
    },
    { 
      id: 'Operacional', 
      label: 'Operacional', 
      icon: <Building2 size={18} />,
      subItems: [
        { id: 'Operacional-Clientes', label: 'Clientes', icon: <Users size={16} /> },
        { id: 'Operacional-Contratos', label: 'Contratos', icon: <FileText size={16} /> },
        { id: 'Operacional-Produtos', label: 'Produtos', icon: <Package size={16} /> },
        { id: 'Operacional-Onboarding', label: 'On-Boarding', icon: <Rocket size={16} /> },
        { id: 'Operacional-NPS', label: 'NPS', icon: <Star size={16} /> },
        { id: 'Operacional-OKR', label: 'OKR', icon: <CircleDot size={16} /> },
        { id: 'Operacional-Equipe', label: 'Equipe', icon: <Wallet size={16} /> },
        { id: 'Operacional-Ferramentas', label: 'Ferramentas', icon: <Wrench size={16} /> },
      ]
    }
  ];

  const handleNavClick = (id: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleMenu(id);
    } else {
      onNavigate(id);
    }
  };

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Header Fixo */}
      <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic text-white shadow-lg shadow-blue-500/20">S</div>
          <span className="font-bold text-lg tracking-tight text-gray-900">STRICT</span>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Rolável */}
      <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
        {navItems.map((item) => (
          <div key={item.id} className="mb-2">
            <button 
              onClick={() => handleNavClick(item.id, !!item.subItems)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeView.includes(item.id) || expandedMenus.includes(item.id) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <span className={`${(item.subItems && expandedMenus.includes(item.id)) || activeView === item.id || (item.subItems?.some(s => activeView.startsWith(s.id))) ? 'text-blue-600' : 'group-hover:text-gray-900'}`}>{item.icon}</span>
              <span className="flex-1 text-left text-sm font-semibold tracking-tight">{item.label}</span>
              {item.subItems && (
                <span className="text-gray-400">
                  {expandedMenus.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              )}
            </button>
            
            {item.subItems && expandedMenus.includes(item.id) && (
              <div className="ml-4 mt-1 border-l border-gray-100 pl-3 space-y-1">
                {item.subItems.map(sub => (
                  <button 
                    key={sub.id} 
                    onClick={() => onNavigate(sub.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-[13px] font-medium transition-all ${activeView === sub.id ? 'bg-[#0047AB] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span className={activeView === sub.id ? 'text-white' : 'text-gray-400'}>{sub.icon}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rodapé Fixo e "Flutuante" */}
      <div className="p-4 border-t border-gray-100 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        {/* Card do Usuário */}
        <div className="bg-gray-50 p-3 rounded-2xl mb-4 flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Admin</span>
            <span className="text-xs text-gray-700 font-bold truncate max-w-[140px]">kyroossx@gmail.com</span>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            <button className="p-1.5 hover:text-blue-600 text-gray-400 transition-colors"><Moon size={12} /></button>
            <button className="p-1.5 text-blue-600 bg-gray-50 rounded-lg transition-colors"><Sun size={12} /></button>
          </div>
        </div>
        
        {/* Opções de Sistema */}
        <div className="space-y-1">
          <button 
            onClick={() => onNavigate('Usuários')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${activeView === 'Usuários' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Users size={18} />
            <span>Usuários</span>
          </button>
          <button 
            onClick={() => onNavigate('Configurações')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${activeView === 'Configurações' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Settings size={18} />
            <span>Configurações</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-bold mt-1"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
