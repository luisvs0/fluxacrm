
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
  Database
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
    { label: 'Perfil da Empresa', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Notificações', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Segurança', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
    { label: 'Integrações', id: 'Integrações' as SettingsTab, icon: <Globe size={18}/> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Preferências...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Razão Social</label>
                 <input 
                  type="text" 
                  value={companyData.name} 
                  onChange={e => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">CNPJ</label>
                 <input 
                  type="text" 
                  value={companyData.document} 
                  onChange={e => setCompanyData({...companyData, document: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">E-mail Financeiro</label>
                 <input 
                  type="email" 
                  value={companyData.email} 
                  onChange={e => setCompanyData({...companyData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Moeda Padrão</label>
                 <select 
                  value={companyData.currency}
                  onChange={e => setCompanyData({...companyData, currency: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none shadow-inner"
                 >
                    <option>BRL - Real Brasileiro</option>
                    <option>USD - Dólar Americano</option>
                 </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Endereço Fiscal</label>
                 <input 
                  type="text" 
                  value={companyData.address}
                  onChange={e => setCompanyData({...companyData, address: e.target.value})}
                  placeholder="Av. Paulista, 1000 - São Paulo, SP" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner" 
                 />
              </div>
            </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              {[
                { title: 'Lançamentos Financeiros', desc: 'Receba alertas sobre novas entradas e saídas pendentes.', channels: ['E-mail', 'Push'] },
                { title: 'Relatórios Mensais', desc: 'Avisar quando o DRE e DFC do mês anterior estiverem consolidados.', channels: ['E-mail'] },
                { title: 'Novos Leads', desc: 'Notificar responsáveis quando um novo lead entrar no pipeline.', channels: ['Push', 'WhatsApp'] },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-2xl group hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                  </div>
                  <button className="w-10 h-5 bg-blue-600 rounded-full relative ml-2">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Credenciais SQL</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Senha de Acesso</label>
                    <input type="password" placeholder="••••••••••••" readOnly className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed" />
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Solicitar alteração de senha segura</button>
                </div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] space-y-4">
                  <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Proteção de Dados</h4>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Sua conta está protegida por criptografia AES-256 e protocolos de segurança do Supabase Auth. 
                  </p>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    Ativar 2FA
                  </button>
              </div>
            </div>
          </div>
        );
      case 'Faturamento':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <CreditCard size={150} />
                </div>
                <div className="relative z-10 space-y-10">
                  <div>
                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Enterprise Plan</span>
                    <h3 className="text-4xl font-black mt-4 tracking-tighter italic">SQL UNLIMITED</h3>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Ver Faturas</button>
                    <button className="bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Contrato</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">Módulo em Integração</div>;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Environment Preferences</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Configurações</h2>
          <p className="text-sm font-medium text-gray-400">Personalize os parâmetros operacionais e institucionais.</p>
        </div>
        {activeTab === 'Perfil' && !isLoading && (
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
           >
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar no Banco
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="space-y-1.5">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                 activeTab === item.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'text-gray-400 border-transparent hover:bg-white hover:text-gray-900 hover:border-gray-100'
               }`}
             >
               <span className={activeTab === item.id ? 'text-blue-400' : 'text-gray-300'}>
                 {item.icon}
               </span>
               <span>{item.label}</span>
               {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
             </button>
           ))}
        </div>

        <div className="xl:col-span-3 bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Settings size={250} />
           </div>
           
           <div className="relative z-10 flex-1 flex flex-col">
             <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-8">
                <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  {menuItems.find(m => m.id === activeTab)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Fluxa Cloud / {activeTab}</p>
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
