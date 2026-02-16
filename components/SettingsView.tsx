
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  Lock, 
  CreditCard, 
  Building2, 
  Save, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  Database,
  Calendar,
  CheckCircle2,
  Share2,
  Unlink,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { googleCalendar } from '../lib/googleCalendar';

interface SettingsViewProps {
  user: any;
}

type SettingsTab = 'Perfil' | 'Notificações' | 'Segurança' | 'Faturamento' | 'Integrações';

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(googleCalendar.isConnected());
  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    document: '',
    email: '',
    currency: 'BRL - Real Brasileiro',
    address: ''
  });

  const fetchSettings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('company_settings').select('*').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      
      if (data) {
        setCompanyData({
          id: data.id,
          name: data.name || '',
          document: data.document || '',
          email: data.email || '',
          currency: data.currency || 'BRL - Real Brasileiro',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.error('Erro settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name: companyData.name,
        document: companyData.document,
        email: companyData.email,
        currency: companyData.currency,
        address: companyData.address
      };

      let error;
      if (companyData.id) {
        const result = await supabase.from('company_settings').update(payload).eq('id', companyData.id).eq('user_id', user.id);
        error = result.error;
      } else {
        const result = await supabase.from('company_settings').insert([payload]);
        error = result.error;
      }

      if (error) throw error;
      alert('Configurações atualizadas com sucesso!');
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar no banco.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGoogle = async () => {
    await googleCalendar.connect();
    setIsGoogleConnected(googleCalendar.isConnected());
  };

  const handleDisconnectGoogle = () => {
    googleCalendar.disconnect();
    setIsGoogleConnected(false);
  };

  const menuItems = [
    { label: 'Perfil Institucional', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Integrações Live', id: 'Integrações' as SettingsTab, icon: <Share2 size={18}/> },
    { label: 'Notificações Push', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Segurança SQL', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#203267] mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Preferências...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Razão Social / Nome Fantasia</label>
                 <input 
                  type="text" 
                  value={companyData.name} 
                  onChange={e => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">CNPJ Institucional</label>
                 <input 
                  type="text" 
                  value={companyData.document} 
                  onChange={e => setCompanyData({...companyData, document: e.target.value})}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">E-mail Financeiro Master</label>
                 <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
                    <input 
                      type="email" 
                      value={companyData.email} 
                      onChange={e => setCompanyData({...companyData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] transition-all shadow-inner focus:bg-white" 
                    />
                 </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
               <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Sincronização Ledger</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">Todos os dados são criptografados em repouso</p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-300 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} /> Auditado
               </div>
            </div>
          </div>
        );
      case 'Integrações':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 italic">Conectar Serviços Externos</h3>
                <p className="text-xs text-slate-400 font-bold">Expanda o ecossistema Fluxa através de integrações SQL diretas.</p>
             </div>

             <div className="bg-white border border-slate-300 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#203267] transition-all shadow-sm">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-10 h-10" alt="Google Calendar" />
                   </div>
                   <div>
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">Google Agenda</h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Sincronize visitas e contratos automaticamente.</p>
                   </div>
                </div>
                {isGoogleConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-300 shadow-sm">
                       <CheckCircle2 size={14} /> Sincronizado
                    </div>
                    <button 
                      onClick={handleDisconnectGoogle}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
                      title="Desconectar"
                    >
                      <Unlink size={20} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleConnectGoogle}
                    className="bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                  >
                    Conectar Ledger
                  </button>
                )}
             </div>

             <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center gap-4 opacity-40 group hover:opacity-100 transition-all">
                <div className="p-4 bg-white rounded-xl border border-slate-300 text-slate-300 group-hover:text-[#203267] transition-colors"><Share2 size={32}/></div>
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Protocolos em Desenvolvimento</p>
                   <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase italic">Slack, WhatsApp Business e RD Station v3</p>
                </div>
             </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Configure a densidade de alertas da sua conta isolada.</p>
            <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-300 rounded-xl group hover:border-[#203267] transition-all">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Alertas de Liquidação SQL</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Receber push em cada entrada/saída realizada</p>
                </div>
                <button className="w-12 h-6 bg-[#203267] rounded-full relative shadow-md">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/5 rounded-lg text-blue-400 border border-white/10"><Lock size={20}/></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Secure Environment</span>
                    </div>
                    <h4 className="text-2xl font-black tracking-tight uppercase italic">Privacidade Total Auditada</h4>
                    <p className="text-sm text-white/40 font-medium leading-relaxed max-w-md">
                      Sua conta opera em um ambiente isolado. Todas as chaves de acesso são renovadas periodicamente através do protocolo Fluxa SQL.
                    </p>
                    <button className="px-8 py-3 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all shadow-xl active:scale-95">Gerenciar Chaves 2FA</button>
                  </div>
                  <Database size={250} className="absolute -right-16 -bottom-16 opacity-[0.03] group-hover:scale-110 transition-transform" />
              </div>
          </div>
        );
      default:
        return <div className="py-24 text-center opacity-30 font-black uppercase tracking-[0.3em] italic">Módulo em Processamento...</div>;
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg shrink-0 group hover:scale-105 transition-transform duration-500 cursor-pointer">
            <Settings size={24} className="text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#203267]/60">Environment Configuration SQL</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Configurações <span className="text-[#203267] not-italic">da Conta</span></h2>
          </div>
        </div>

        {activeTab === 'Perfil' && !isLoading && (
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto bg-[#203267] text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50"
           >
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar Preferências
           </button>
        )}
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-12 grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="flex xl:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center justify-between p-5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap min-w-max xl:min-w-0 ${
                 activeTab === item.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-300 hover:text-slate-900 hover:border-[#203267]'
               }`}
             >
               <div className="flex items-center gap-4">
                  <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-300'}>{item.icon}</span>
                  <span>{item.label}</span>
               </div>
               <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
             </button>
           ))}
        </div>

        <div className="xl:col-span-3 bg-white border border-slate-300 rounded-xl p-8 md:p-14 shadow-sm relative overflow-hidden flex flex-col min-h-[550px] transition-all hover:shadow-xl duration-700">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
