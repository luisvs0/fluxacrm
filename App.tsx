
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
import Properties from './components/Properties';
import Visits from './components/Visits';
import Disbursements from './components/Disbursements';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    const user = session?.user;
    if (!user) return null;

    switch (activeView) {
      case 'Dashboard': return <Dashboard user={user} />;
      
      // Imobiliária
      case 'Imóveis': return <Properties user={user} />;
      case 'Visitas': return <Visits user={user} />;
      case 'Repasses': return <Disbursements user={user} />;

      case 'Lançamentos': return <Transactions user={user} />;
      case 'Agenda': return <Agenda user={user} />;
      case 'Centros': return <CostCenters user={user} />;
      case 'Cartões': return <Cards user={user} />;
      case 'Impostos': return <Taxes user={user} />;
      case 'Contábil': return <Accounting user={user} />;
      
      case 'Comercial-Dashboard': return <Crm user={user} />; 
      case 'Pipeline': return <Pipeline user={user} />; 
      case 'Leads': return <Leads user={user} />; 
      case 'Metas': return <Metas user={user} />; 
      case 'Ranking': return <Ranking user={user} />; 
      case 'Squads': return <Squads user={user} />; 
      
      case 'Marketing-Dashboard': return <Marketing user={user} />;
      case 'Marketing-Kanbans': return <MarketingKanbans user={user} />;
      
      case 'Operacional-Clientes': return <OperationalClientes user={user} />;
      case 'Operacional-Contratos': return <OperationalContratos user={user} />;
      case 'Operacional-Produtos': return <OperationalProdutos user={user} />;
      case 'Operacional-Onboarding': return <OperationalOnboarding user={user} />;
      case 'Operacional-NPS': return <OperationalNPS user={user} />;
      case 'Operacional-OKR': return <OperationalOKR user={user} />;
      case 'Operacional-Equipe': return <OperationalEquipe user={user} />;
      case 'Operacional-Ferramentas': return <OperationalFerramentas user={user} />;

      case 'Usuários': return <UsersManagement user={user} />;
      case 'Configurações': return <SettingsView user={user} />;
      
      case 'Dashboard-TV': return <DashboardTv onBack={() => setActiveView('Dashboard')} user={user} />;
      
      default: return <Dashboard user={user} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Fluxa Imob Engine</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginView onLogin={() => {}} />;
  }

  if (activeView === 'Dashboard-TV') {
    return <DashboardTv onBack={() => setActiveView('Dashboard')} user={session.user} />;
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
