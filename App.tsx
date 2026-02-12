
import React, { useState } from 'react';
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
import Operational from './components/Operational';
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

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');

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
      case 'Operacional': return <Operational />;
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
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#111827] relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
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

      {/* Main Content Area - Padding dinâmico baseado no estado do menu lateral */}
      <div className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} title={activeView} />
        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
