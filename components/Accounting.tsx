
import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ChevronDown, 
  FileText, 
  BarChart3, 
  Settings, 
  Download,
  TrendingUp,
  Calendar,
  Loader2,
  Database,
  ArrowRightLeft,
  LayoutGrid,
  Wallet,
  ArrowUp,
  Users,
  Package,
  Info,
  CheckCircle2,
  Plus,
  List,
  Link as LinkIcon,
  Search,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Save,
  Equal,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewAccountModal from './NewAccountModal';
import StatCard from './StatCard';

interface AccountingProps {
  user: any;
}

const Accounting: React.FC<AccountingProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('DRE');
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('Plano de Contas');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  
  const [dreLines, setDreLines] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [initialBalances, setInitialBalances] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);

  const [accSettings, setAccSettings] = useState({
    id: '',
    default_regime: 'Regime de Caixa',
    fiscal_year_start: 'Janeiro',
    main_cash_account_id: '',
    retained_earnings_account_id: ''
  });

  const [dfcMetrics, setDfcMetrics] = useState({
    caixaInicial: 0,
    variacao: 0,
    caixaFinal: 0,
    ebitda: 0
  });

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [
        { data: txs },
        { data: taxesData },
        { data: accountsData },
        { data: mappingsData },
        { data: balancesData },
        { data: ccData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('taxes').select('rate').eq('user_id', user.id),
        supabase.from('chart_of_accounts').select('*').eq('user_id', user.id).order('code'),
        supabase.from('accounting_mappings').select('*, chart_of_accounts(name, code)').eq('user_id', user.id),
        supabase.from('initial_balances').select('*, chart_of_accounts(name, code)').eq('user_id', user.id),
        supabase.from('cost_centers').select('id, name').eq('user_id', user.id),
        supabase.from('accounting_settings').select('*').eq('user_id', user.id).maybeSingle()
      ]);
      
      setAccounts(accountsData || []);
      setMappings(mappingsData || []);
      setInitialBalances(balancesData || []);
      setCostCenters(ccData || []);
      
      if (settingsData) {
        setAccSettings({
          id: settingsData.id,
          default_regime: settingsData.default_regime || 'Regime de Caixa',
          fiscal_year_start: settingsData.fiscal_year_start || 'Janeiro',
          main_cash_account_id: settingsData.main_cash_account_id || '',
          retained_earnings_account_id: settingsData.retained_earnings_account_id || ''
        });
      }

      const revenue = txs?.filter(t => t.type === 'IN' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const taxRate = (taxesData?.reduce((acc, t) => acc + Number(t.rate), 0) || 0) / 100;
      const taxAmount = revenue * taxRate;
      const netRevenue = revenue - taxAmount;
      const operatingCosts = txs?.filter(t => t.type === 'OUT' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const ebitda = netRevenue - operatingCosts;

      const format = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
      const calcRL = (val: number) => netRevenue > 0 ? `${((val / netRevenue) * 100).toFixed(1)}%` : '--';

      setDreLines([
        { label: 'Receita Bruta Operacional', value: revenue, display: format(revenue), rl: calcRL(revenue), type: 'item', color: 'text-emerald-600' },
        { label: '(-) Deduções e Tributos', value: -taxAmount, display: format(-taxAmount), rl: calcRL(-taxAmount), type: 'item', color: 'text-rose-500' },
        { label: '= Receita Líquida', value: netRevenue, display: format(netRevenue), rl: '100%', type: 'subtotal' },
        { label: '(-) CMV (Custo de Vendas)', value: 0, display: format(0), rl: '0%', type: 'item', color: 'text-rose-500' },
        { label: '= Lucro Bruto', value: netRevenue, display: format(netRevenue), rl: calcRL(netRevenue), type: 'subtotal' },
        { label: '(-) Despesas Gerais e Adm.', value: -operatingCosts, display: format(-operatingCosts), rl: calcRL(-operatingCosts), type: 'item', color: 'text-rose-500' },
        { label: '= EBITDA (Geração de Caixa)', value: ebitda, display: format(ebitda), rl: calcRL(ebitda), type: 'total' },
      ]);

      setDfcMetrics({
        caixaInicial: 0,
        variacao: revenue - operatingCosts,
        caixaFinal: revenue - operatingCosts,
        ebitda: ebitda
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-10 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <FileText size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Financial Reporting SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Intelligence <span className="text-[#203267] not-italic">Reports</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocolo de Consolidação</span>
             <span className="text-xs font-bold text-slate-900">Distributed Ledger Sync</span>
          </div>
          <button 
            onClick={fetchData} 
            className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] hover:shadow-xl transition-all duration-700 active:scale-90 group"
          >
            {/* FIX: Changed RefreshCcw to RefreshCw as per the error message and imports */}
            <RefreshCw size={22} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'}`} />
          </button>
        </div>
      </div>

      {/* Navigation & Filters Console */}
      <div className="relative z-10 px-4 md:px-10 mb-12 mt-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['DRE', 'DFC', 'Balanço', 'Configurações'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeTab === tab ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> DB Node Ledger</span>
             <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 px-4 md:px-10">
        {isLoading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Consolidando Livros Contábeis...</p>
          </div>
        ) : activeTab === 'DRE' ? (
          <div className="space-y-12">
            {/* KPI Summary for DRE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard 
                 title="Receita Líquida" 
                 value={formatCurrency(dreLines.find(l => l.label === '= Receita Líquida')?.value || 0)} 
                 subtitle="Total após deduções" 
                 icon={<ArrowDownLeft />} 
                 color="emerald" 
               />
               <StatCard 
                 title="Margem EBITDA" 
                 value={dreLines.find(l => l.label === '= EBITDA (Geração de Caixa)')?.rl || '0%'} 
                 subtitle="Eficiência Operacional" 
                 icon={<TrendingUp />} 
                 color="blue" 
               />
               <StatCard 
                 title="Geração de Caixa" 
                 value={formatCurrency(dfcMetrics.ebitda)} 
                 subtitle="EBITDA Nominal" 
                 icon={<Wallet />} 
                 color="blue" 
                 showInfo
               />
               <StatCard 
                 title="Break Even Status" 
                 value="Atingido" 
                 subtitle="Protocolo de Lucratividade" 
                 icon={<CheckCircle2 />} 
                 color="emerald" 
               />
            </div>

            <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-xl duration-700">
              <div className="p-10 border-b border-slate-300 flex items-center justify-between bg-slate-50/20">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-300 flex items-center justify-center text-[#203267] shadow-sm"><BarChart3 size={24}/></div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">DRE - Demonstrativo de Resultado</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mês de Referência: Fevereiro 2026</p>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                    <Download size={14} /> Exportar Auditoria PDF
                 </button>
              </div>
              
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-300">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descrição Operacional</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Valor Líquido</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center w-32">% S/ RL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dreLines.map((line, i) => (
                      <tr key={i} className={`group hover:bg-slate-50/50 transition-all ${line.type !== 'item' ? 'bg-slate-50/30' : ''}`}>
                        <td className={`px-10 py-8 text-sm tracking-tight ${line.type === 'subtotal' ? 'font-bold text-slate-900' : line.type === 'total' ? 'font-black text-slate-950 uppercase italic text-base' : 'text-slate-600 pl-16'}`}>
                          {line.label}
                        </td>
                        <td className={`px-10 py-8 text-right font-black tracking-tighter ${line.type === 'total' ? 'text-xl text-[#203267]' : line.color || 'text-slate-900'}`}>
                          {line.display}
                        </td>
                        <td className="px-10 py-8 text-center">
                           <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg border transition-all ${line.type === 'total' ? 'bg-[#203267] text-white border-[#203267] shadow-md' : 'bg-white text-slate-400 border-slate-300'}`}>
                             {line.rl}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'Configurações' ? (
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="p-8 border-b border-slate-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50">
               <div className="flex bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                 {['Plano de Contas', 'Mapeamento', 'Saldo Inicial'].map(sub => (
                   <button
                    key={sub}
                    onClick={() => setActiveSettingsSubTab(sub)}
                    className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeSettingsSubTab === sub ? 'bg-[#203267] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                     {sub}
                   </button>
                 ))}
               </div>
               {activeSettingsSubTab === 'Plano de Contas' && (
                 <button onClick={() => setIsNewAccountModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#203267] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                    <Plus size={16} strokeWidth={3} /> Nova Conta Contábil
                 </button>
               )}
            </div>

            <div className="flex-1 p-0">
               {activeSettingsSubTab === 'Plano de Contas' ? (
                 <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="bg-white border-b border-slate-300">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Código & Conta</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grupo</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Natureza</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Relatório</th>
                          <th className="px-10 py-6 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {accounts.map(acc => (
                          <tr key={acc.id} className="hover:bg-slate-50 transition-all group">
                             <td className="px-10 py-6">
                               <div className="flex flex-col">
                                  <span className="text-xs font-black text-[#203267] mb-1">{acc.code}</span>
                                  <span className="text-sm font-bold text-slate-900 uppercase">{acc.name}</span>
                               </div>
                             </td>
                             <td className="px-10 py-6">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{acc.account_group}</span>
                             </td>
                             <td className="px-10 py-6 text-center">
                               <span className={`text-[9px] font-black px-3 py-1.5 rounded-md uppercase border ${
                                 acc.nature === 'Ativo' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                 acc.nature === 'Passivo' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                 acc.nature === 'Receita' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                 'bg-rose-50 text-rose-600 border-rose-200'
                               }`}>
                                 {acc.nature}
                               </span>
                             </td>
                             <td className="px-10 py-6 text-center">
                               <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-300 px-3 py-1 rounded-md shadow-sm">{acc.report_type}</span>
                             </td>
                             <td className="px-10 py-6 text-right">
                               <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal size={20} /></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="py-32 text-center opacity-30">
                    <Database size={60} className="mx-auto mb-6 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest">Sincronizando {activeSettingsSubTab} SQL...</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="py-48 text-center bg-white border border-slate-300 rounded-xl shadow-sm group">
            <Database size={80} strokeWidth={1} className="mx-auto mb-8 text-slate-200 group-hover:text-[#203267] transition-all duration-1000 group-hover:scale-110" />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-300">Funcionalidade {activeTab} em Protocolo de Desenvolvimento</p>
          </div>
        )}
      </div>

      <NewAccountModal isOpen={isNewAccountModalOpen} onClose={() => { setIsNewAccountModalOpen(false); fetchData(); }} user={user} />
    </div>
  );
};

export default Accounting;
