
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Lock, 
  CreditCard, 
  Building2, 
  Save, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  Database,
  CheckCircle2,
  Share2,
  Unlink,
  ChevronRight,
  AlertCircle,
  Copy,
  ExternalLink,
  Check,
  Globe
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
  const [showGCalHelp, setShowGCalHelp] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    document: '',
    email: '',
    currency: 'BRL - Real Brasileiro',
    address: ''
  });

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.fluxascales.com';

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
    try {
      await googleCalendar.connect();
      setIsGoogleConnected(googleCalendar.isConnected());
    } catch (err) {
      console.error('Erro ao conectar Google:', err);
      setShowGCalHelp(true);
    }
  };

  const handleDisconnectGoogle = () => {
    googleCalendar.disconnect();
    setIsGoogleConnected(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const menuItems = [
    { label: 'Perfil Institucional', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Integrações Globais', id: 'Integrações' as SettingsTab, icon: <Share2 size={18}/> },
    { label: 'Alertas & Push', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Criptografia SQL', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Ciclo de Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#01223d] mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Preferências...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Dados de <span className="text-[#01223d] not-italic">Governança</span></h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Informações institucionais auditadas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Razão Social / Nome Fantasia</label>
                 <input 
                  type="text" 
                  value={companyData.name} 
                  onChange={e => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Documento Identificador (CNPJ)</label>
                 <input 
                  type="text" 
                  value={companyData.document} 
                  onChange={e => setCompanyData({...companyData, document: e.target.value})}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all shadow-inner" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail de Auditoria Master</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d]" size={16} />
                    <input 
                      type="email" 
                      value={companyData.email} 
                      onChange={e => setCompanyData({...companyData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all shadow-inner" 
                    />
                 </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-50">
               <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto bg-[#01223d] text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Salvar Preferências</>}
               </button>
            </div>
          </div>
        );
      case 'Integrações':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Hub de <span className="text-[#01223d] not-italic">Integrações</span></h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Conectividade externa e automação SQL</p>
             </div>

             <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-6 group hover:border-[#b4a183] transition-all shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-12 h-12" alt="Google Calendar" />
                     </div>
                     <div>
                        <h4 className="text-base font-black text-slate-900 uppercase italic">Google Agenda</h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed mt-2 max-w-xs">Sincronize tours, visitas e compromissos táticos com sua conta Google Workspace.</p>
                     </div>
                  </div>
                  {isGoogleConnected ? (
                    <div className="flex items-center gap-3">
                      <div className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100 shadow-sm">
                         <CheckCircle2 size={14} /> Conectado
                      </div>
                      <button 
                        onClick={handleDisconnectGoogle}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                        title="Desconectar"
                      >
                        <Unlink size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={handleConnectGoogle}
                        className="bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center gap-2"
                      >
                        <Globe size={14} className="text-[#b4a183]" /> Ativar Link
                      </button>
                      <button 
                        onClick={() => setShowGCalHelp(!showGCalHelp)}
                        className="text-[9px] font-black text-[#203267] uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                      >
                        {showGCalHelp ? 'Ocultar Ajuda' : 'Correção de Erro 400'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Painel de Resolução de Erro 400 - Ajustado para o domínio do usuário */}
                {showGCalHelp && (
                  <div className="bg-slate-50 border-2 border-indigo-100 rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3 text-indigo-700">
                      <AlertCircle size={20} />
                      <h5 className="text-[12px] font-black uppercase tracking-widest">Guia para Erro 400: redirect_uri_mismatch</h5>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      O Google bloqueou o acesso porque o seu domínio ainda não foi autorizado no console do desenvolvedor.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Copie o endereço abaixo:</p>
                           {copiedUrl === currentOrigin && <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1"><Check size={10}/> Copiado!</span>}
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                          <code className="text-xs font-mono font-bold text-blue-600 truncate mr-4">{currentOrigin}</code>
                          <button 
                            onClick={() => copyToClipboard(currentOrigin)}
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Configure no Google Cloud Console:</p>
                        <div className="space-y-3 text-[11px] font-medium text-slate-600">
                          <div className="flex gap-3">
                             <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center shrink-0 font-black text-[9px]">A</div>
                             <p>Acesse o menu <span className="text-slate-900 font-bold italic">APIs e Serviços > Credenciais</span>.</p>
                          </div>
                          <div className="flex gap-3">
                             <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center shrink-0 font-black text-[9px]">B</div>
                             <p>Clique para editar seu <span className="text-slate-900 font-bold italic">ID de Cliente OAuth 2.0</span>.</p>
                          </div>
                          <div className="flex gap-3">
                             <div className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded flex items-center justify-center shrink-0 font-black text-[9px]">C</div>
                             <p>Em <span className="text-indigo-700 font-bold underline">Origens JavaScript autorizadas</span>, adicione a URL que você copiou acima.</p>
                          </div>
                          <div className="flex gap-3">
                             <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center shrink-0 font-black text-[9px]">D</div>
                             <p>Salve e aguarde <span className="text-slate-900 font-bold">10 minutos</span> antes de tentar conectar novamente.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-[#203267] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-900/20"
                    >
                      Ir para Google Cloud Console <ExternalLink size={14} />
                    </a>
                  </div>
                )}
             </div>

             <div className="bg-slate-50 border border-slate-100 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center gap-4 opacity-50">
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-slate-300 shadow-sm"><Share2 size={32} strokeWidth={1} /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Provisionamento Pendente</p>
                   <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Slack, WhatsApp Business e RD Station em desenvolvimento.</p>
                </div>
             </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Central de <span className="text-[#01223d] not-italic">Alertas</span></h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Configuração de push e governança de dados</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-xl group hover:border-[#01223d] transition-all">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Alertas de Lançamento Financeiro</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Avisar a cada nova entrada/saída no Ledger</p>
                  </div>
                  <button className="w-11 h-6 bg-[#01223d] rounded-full relative shadow-md">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
              </div>
              <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-xl group">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Push de Novos Leads</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sinalizar prospecção em tempo real</p>
                  </div>
                  <button className="w-11 h-6 bg-slate-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
              </div>
            </div>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-[#01223d] p-10 rounded-xl space-y-8 text-white relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="p-3 bg-white/10 rounded-xl w-fit text-[#b4a183] border border-white/10 shadow-inner"><Lock size={24}/></div>
                    <div>
                       <h4 className="text-xl font-black tracking-tight uppercase italic leading-none">Isolamento de Dados SQL</h4>
                       <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-3 leading-relaxed">
                         Sua conta opera em um ambiente de sessão única com criptografia de ponta a ponta. Sua chave privada de API nunca sai do navegador.
                       </p>
                    </div>
                  </div>
                  <div className="relative z-10 pt-6 border-t border-white/5 flex gap-4">
                     <span className="px-3 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase border border-white/10 tracking-widest">AES-256</span>
                     <span className="px-3 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase border border-white/10 tracking-widest">ISO 27001</span>
                  </div>
                  <Database size={200} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform pointer-events-none" />
              </div>
          </div>
        );
      default:
        return <div className="py-24 text-center opacity-30 font-black uppercase tracking-widest italic text-slate-300">Provisionamento em Breve</div>;
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 font-['Inter'] relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#01223d] rounded-xl flex items-center justify-center text-[#b4a183] shadow-lg shrink-0 border border-slate-700">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
               Ajustes <span className="text-[#01223d] not-italic">Globais</span>
            </h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-3">Environment Control & SQL Ledger Preferences</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="flex xl:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-4 p-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap min-w-max xl:min-w-0 ${
                 activeTab === item.id 
                  ? 'bg-[#01223d] text-white border-[#01223d] shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-900 hover:border-slate-300'
               }`}
             >
               <span className={`transition-colors ${activeTab === item.id ? 'text-[#b4a183]' : 'text-slate-300'}`}>{item.icon}</span>
               <span className="flex-1 text-left">{item.label}</span>
               {activeTab === item.id && <ChevronRight size={14} className="text-[#b4a183] hidden xl:block" />}
             </button>
           ))}
        </div>

        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-10 md:p-14 shadow-sm relative overflow-hidden flex flex-col min-h-[600px]">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
