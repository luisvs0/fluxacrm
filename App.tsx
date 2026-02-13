
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Agenda from './components/Agenda';
import CostCenters from './components/CostCenters';
import Cards from './components/Cards';
import Taxes from './components/Taxes';
import Accounting from './components/Accounting';
import Crm from './components/Crm';
import Pipeline from './components/Pipeline';
import Leads from './components/Leads';
import Metas from './components/Metas';
import Ranking from './components/Ranking';
import Squads from './components/Squads';
import Marketing from './components/Marketing';
import MarketingKanbans from './components/MarketingKanbans';
import OperationalClientes from './components/OperationalClientes';
import OperationalContratos from './components/OperationalContratos';
import OperationalProdutos from './components/OperationalProdutos';
import OperationalOnboarding from './components/OperationalOnboarding';
import OperationalNPS from './components/OperationalNPS';
import OperationalOKR from './components/OperationalOKR';
import OperationalEquipe from './components/OperationalEquipe';
import OperationalFerramentas from './components/OperationalFerramentas';
import UsersManagement from './components/UsersManagement';
import SettingsView from './components/SettingsView';
import DashboardTv from './components/DashboardTv';
import LoginView from './components/LoginView';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Escutar mudanças no estado de auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard': return <Dashboard />;
      case 'Lançamentos': return <Transactions />;
      case 'Agenda': return <Agenda />;
      case 'Centros': return <CostCenters />;
      case 'Cartões': return <Cards />;
      case 'Impostos': return <Taxes />;
      case 'Contábil': return <Accounting />;
      
      // Comercial routes
      case 'Comercial-Dashboard': return <Crm />; 
      case 'Pipeline': return <Pipeline />; 
      case 'Leads': return <Leads />; 
      case 'Metas': return <Metas />; 
      case 'Ranking': return <Ranking />; 
      case 'Squads': return <Squads />; 
      
      // Marketing routes
      case 'Marketing-Dashboard': return <Marketing />;
      case 'Marketing-Kanbans': return <MarketingKanbans />;
      
      // Operacional routes
      case 'Operacional-Clientes': return <OperationalClientes />;
      case 'Operacional-Contratos': return <OperationalContratos />;
      case 'Operacional-Produtos': return <OperationalProdutos />;
      case 'Operacional-Onboarding': return <OperationalOnboarding />;
      case 'Operacional-NPS': return <OperationalNPS />;
      case 'Operacional-OKR': return <OperationalOKR />;
      case 'Operacional-Equipe': return <OperationalEquipe />;
      case 'Operacional-Ferramentas': return <OperationalFerramentas />;

      case 'Usuários': return <UsersManagement />;
      case 'Configurações': return <SettingsView />;
      
      // Fullscreen views
      case 'Dashboard-TV': return <DashboardTv onBack={() => setActiveView('Dashboard')} />;
      
      default: return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fluxa Financial Engine</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra a tela de login real
  if (!session) {
    return <LoginView onLogin={() => {}} />; // O onAuthStateChange cuidará do estado
  }

  // Se estiver na visão de TV, não renderizamos Sidebar nem Header padrão
  if (activeView === 'Dashboard-TV') {
    return <DashboardTv onBack={() => setActiveView('Dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#111827] relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        userEmail={session.user.email}
        userName={session.user.user_metadata?.full_name}
        toggleSidebar={() => setIsSidebarOpen(false)} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNavigate={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        activeView={activeView}
      />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={activeView} 
          onOpenTv={() => setActiveView('Dashboard-TV')}
        />
        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
