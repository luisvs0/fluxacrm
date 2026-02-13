
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
  Smartphone, 
  Mail, 
  ExternalLink,
  Slack,
  MessageSquare,
  Calendar,
  Cloud,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Briefcase,
  Zap,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type SettingsTab = 'Perfil' | 'Notificações' | 'Segurança' | 'Faturamento' | 'Integrações';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    document: '',
    email: '',
    currency: 'BRL - Real Brasileiro',
    address: ''
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('company_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      
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
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: companyData.name,
        document: companyData.document,
        email: companyData.email,
        currency: companyData.currency,
        address: companyData.address
      };

      let error;
      if (companyData.id) {
        const result = await supabase.from('company_settings').update(payload).eq('id', companyData.id);
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
      alert('Erro ao salvar configurações no banco.');
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { label: 'Perfil Institucional', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Notificações', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Segurança SQL', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
    { label: 'Integrações', id: 'Integrações' as SettingsTab, icon: <Globe size={18}/> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Preferências...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Razão Social / Nome Fantasia</label>
                 <input 
                  type="text" 
                  value={companyData.name} 
                  onChange={e => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">CNPJ Institucional</label>
                 <input 
                  type="text" 
                  value={companyData.document} 
                  onChange={e => setCompanyData({...companyData, document: e.target.value})}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Financeiro Master</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                    <input 
                      type="email" 
                      value={companyData.email} 
                      onChange={e => setCompanyData({...companyData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Moeda de Auditoria</label>
                 <div className="relative">
                   <select 
                    value={companyData.currency}
                    onChange={e => setCompanyData({...companyData, currency: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none shadow-inner focus:bg-white cursor-pointer"
                   >
                      <option>BRL - Real Brasileiro</option>
                      <option>USD - Dólar Americano</option>
                   </select>
                   <Zap className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Endereço Fiscal & Operacional</label>
                 <input 
                  type="text" 
                  value={companyData.address}
                  onChange={e => setCompanyData({...companyData, address: e.target.value})}
                  placeholder="Logradouro, número, bairro - Cidade/UF" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                 />
              </div>
            </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {[
              { title: 'Lançamentos Financeiros', desc: 'Receba alertas sobre novas entradas e saídas pendentes.', channels: ['E-mail', 'Push'] },
              { title: 'Relatórios Mensais', desc: 'Avisar quando o DRE e DFC do mês anterior estiverem consolidados.', channels: ['E-mail'] },
              { title: 'Novos Leads de Marketing', desc: 'Notificar responsáveis quando um novo lead entrar no pipeline.', channels: ['Push', 'WhatsApp'] },
              { title: 'Segurança & Acessos', desc: 'Alertar sobre novos logins e alterações de senhas administrativas.', channels: ['E-mail'] },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium max-w-md">{item.desc}</p>
                </div>
                <button className="w-11 h-6 bg-blue-600 rounded-full relative transition-all shadow-md shadow-blue-500/20">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            ))}
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-600">
                  <ShieldCheck size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Protocolos SQL Ativos</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha de Master Access</label>
                    <input type="password" placeholder="••••••••••••" readOnly className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none cursor-not-allowed opacity-60" />
                  </div>
                  <button className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">Solicitar Alteração Segura</button>
                </div>
              </div>
              <div className="bg-[#002147] p-8 rounded-[2.5rem] space-y-6 text-white relative overflow-hidden group shadow-xl">
                  <div className="relative z-10 space-y-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl w-fit text-blue-400"><Lock size={20}/></div>
                    <h4 className="text-lg font-bold tracking-tight uppercase">Double Encryption</h4>
                    <p className="text-xs text-white/50 font-medium leading-relaxed">
                      Sua conta está protegida por criptografia de ponta e protocolos OAuth 2.0. Ative o 2FA para segurança adicional.
                    </p>
                    <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95">
                      Ativar Autenticação 2FA
                    </button>
                  </div>
                  <Sparkles className="absolute -right-6 -bottom-6 text-white/5 size-40 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        );
      case 'Faturamento':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Briefcase size={200} />
                </div>
                <div className="relative z-10 space-y-12">
                  <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Cloud Active</span>
                    <h3 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Enterprise Plan</h3>
                    <p className="text-sm text-white/40 font-medium tracking-wide">Recorrência Mensal: SQL Unlimited & Data Analytics</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-white/5 pt-10">
                     <div>
                        <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Próxima Fatura</p>
                        <p className="text-xl font-bold mt-1 tracking-tight">15 de Março, 2026</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Meio de Pagamento</p>
                        <p className="text-xl font-bold mt-1 tracking-tight">Cartão •••• 4492</p>
                     </div>
                     <div className="flex gap-3 mt-4 lg:mt-0">
                        <button className="flex-1 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Ver Faturas</button>
                        <button className="flex-1 bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Mudar Plano</button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner">
               <Zap size={40} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Módulo em Integração SQL</p>
               <p className="text-xs text-slate-300 font-medium mt-1">Conectando Webhooks e APIs externas...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Settings size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Preferences</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight uppercase italic">Ajustes</h2>
          </div>
        </div>

        {activeTab === 'Perfil' && !isLoading && (
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl md:rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
           >
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar Preferências
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Tab Selector - Scrollable on Mobile */}
        <div className="flex xl:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-4 p-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap min-w-max xl:min-w-0 ${
                 activeTab === item.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-200'
               }`}
             >
               <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-300'}>
                 {item.icon}
               </span>
               <span className="hidden sm:inline">{item.label}</span>
               <span className="sm:hidden">{item.label.split(' ')[0]}</span>
               {activeTab === item.id && <div className="ml-auto hidden xl:block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
              <Settings size={300} />
           </div>
           
           <div className="relative z-10 flex-1 flex flex-col">
             <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
                <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                  {menuItems.find(m => m.id === activeTab)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-tight">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-0.5">Fluxa Cloud Platform / {activeTab}</p>
                </div>
             </div>
             
             {renderContent()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
