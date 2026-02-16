
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
import Inspections from './components/Inspections';
import Disbursements from './components/Disbursements';
import AIChatAssistant from './components/AIChatAssistant'; // Import da IA
import { supabase } from './lib/supabase';
import { Bell, X, Calendar, Clock, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');
  
  // Estado para o Popup de Notificação da Agenda
  const [activeToast, setActiveToast] = useState<any>(null);

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

  // NOTIFICATION ENGINE: Monitoramento em Tempo Real de Compromissos
  useEffect(() => {
    if (!session?.user) return;

    const checkAppointments = async () => {
      const now = new Date().toISOString();
      
      try {
        // 1. Busca eventos vencidos ou no horário que não foram notificados
        const { data: dueAppointments, error: queryError } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('notified', false)
          .eq('is_completed', false)
          .lte('start_time', now);

        if (queryError) throw queryError;

        if (dueAppointments && dueAppointments.length > 0) {
          console.log(`[Engine] Encontrados ${dueAppointments.length} compromissos para notificar.`);
          
          for (const appt of dueAppointments) {
            // 2. Cria o registro na tabela física de notificações
            const { error: insertError } = await supabase.from('notifications').insert([{
              user_id: session.user.id,
              title: `Início: ${appt.title}`,
              description: `O compromisso agendado para as ${new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} deve ser iniciado agora.`,
              type: 'alerta',
              is_read: false
            }]);

            if (insertError) {
              console.error('[Engine] Erro ao inserir notificação:', insertError);
              continue;
            }

            // 3. Marca como notificado para não disparar novamente
            await supabase.from('appointments')
              .update({ notified: true })
              .eq('id', appt.id)
              .eq('user_id', session.user.id);
            
            // 4. Dispara o Popup Visual (Toast)
            setActiveToast({
              id: appt.id,
              title: appt.title,
              time: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });

            // Fecha o popup após 12 segundos
            setTimeout(() => setActiveToast(null), 12000);
          }
        }
      } catch (err) {
        console.error('[Engine Critical] Erro na verificação de compromissos:', err);
      }
    };

    // Varredura a cada 30 segundos
    const intervalId = setInterval(checkAppointments, 30000);
    checkAppointments(); // Verificação inicial ao carregar

    return () => clearInterval(intervalId);
  }, [session]);

  const renderView = () => {
    const user = session?.user;
    if (!user) return null;

    switch (activeView) {
      case 'Dashboard': return <Dashboard user={user} />;
      case 'Imóveis': return <Properties user={user} />;
      case 'Visitas': return <Visits user={user} />;
      case 'Vistorias': return <Inspections user={user} />;
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
          <div className="w-10 h-10 border-4 border-[#01223d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#01223d]">Fluxa Imob Engine</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginView onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#111827] relative overflow-x-hidden">
      
      {/* POPUP DE NOTIFICAÇÃO (TOAST) - ANIMADO */}
      {activeToast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right-10 duration-500">
          <div className="bg-white border-2 border-indigo-100 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex gap-4 w-[400px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1.5 bg-[#01223d] animate-toast-bar w-full" />
            
            <div className="w-14 h-14 bg-indigo-50 text-[#01223d] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
              <Calendar size={28} />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Compromisso Agora</span>
                </div>
                <button onClick={() => setActiveToast(null)} className="text-slate-300 hover:text-slate-900 transition-colors">
                  <X size={16}/>
                </button>
              </div>
              
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1.5 line-clamp-1 italic">{activeToast.title}</h4>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <Clock size={12} className="text-[#01223d]" /> 
                  Iniciado às {activeToast.time}
                </div>
                <button 
                  onClick={() => { setActiveView('Agenda'); setActiveToast(null); }}
                  className="text-[10px] font-black text-[#01223d] uppercase tracking-widest hover:underline"
                >
                  Abrir Agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={activeView} 
          onOpenTv={() => setActiveView('Dashboard-TV')}
          onNavigate={(view) => setActiveView(view)}
          activeView={activeView}
        />
        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>

      {/* COMPONENTE DA IA */}
      <AIChatAssistant />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toast-bar {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-bar {
          animation: toast-bar 12s linear forwards;
        }
      `}} />
    </div>
  );
};

export default App;
