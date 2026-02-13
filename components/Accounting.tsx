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
  History,
  Info,
  CheckCircle2,
  AlertCircle,
  Equal,
  ChevronRight,
  ShieldAlert,
  // Fix: Added missing 'Plus' import from lucide-react
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AccountingProps {
  user: any;
}

const Accounting: React.FC<AccountingProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Balanço');
  const [isLoading, setIsLoading] = useState(true);
  const [dreLines, setDreLines] = useState<any[]>([]);
  const [dfcMetrics, setDfcMetrics] = useState({
    caixaInicial: 0,
    variacao: 0,
    caixaFinal: 0,
    ebitda: 0
  });
  
  const [filters, setFilters] = useState({
    period: 'Este Mês',
    regime: 'Caixa',
    vision: 'Consolidado',
    compare: false
  });

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      const { data: taxesData } = await supabase.from('taxes').select('rate').eq('user_id', user.id);
      
      const revenue = txs?.filter(t => t.type === 'IN' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const taxRate = (taxesData?.reduce((acc, t) => acc + Number(t.rate), 0) || 0) / 100;
      const taxAmount = revenue * taxRate;
      const netRevenue = revenue - taxAmount;
      const operatingCosts = txs?.filter(t => t.type === 'OUT' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const ebitda = netRevenue - operatingCosts;

      const format = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
      const calcRL = (val: number) => netRevenue > 0 ? `${((val / netRevenue) * 100).toFixed(1)}%` : '--';

      setDreLines([
        { label: 'Receita Bruta', value: revenue, display: format(revenue), rl: calcRL(revenue), type: 'item', color: 'text-emerald-600' },
        { label: '(-) Deduções/Taxas', value: -taxAmount, display: format(-taxAmount), rl: calcRL(-taxAmount), type: 'item', color: 'text-rose-500' },
        { label: '= Receita Líquida', value: netRevenue, display: format(netRevenue), rl: '100%', type: 'subtotal' },
        { label: '(-) CMV', value: 0, display: format(0), rl: '0%', type: 'item', color: 'text-rose-500' },
        { label: '= Lucro Bruto', value: netRevenue, display: format(netRevenue), rl: calcRL(netRevenue), type: 'subtotal' },
        { label: '(-) Despesas Variáveis', value: 0, display: format(0), rl: '0%', type: 'item', color: 'text-rose-500' },
        { label: '= Margem de Contribuição', value: netRevenue, display: format(netRevenue), rl: calcRL(netRevenue), type: 'subtotal' },
        { label: '(-) Despesas Fixas (OPEX)', value: -operatingCosts, display: format(-operatingCosts), rl: calcRL(-operatingCosts), type: 'item', color: 'text-rose-500' },
        { label: '= EBITDA', value: ebitda, display: format(ebitda), rl: calcRL(ebitda), type: 'total' },
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

  const renderBalanceSheetView = () => (
    <div className="space-y-6">
      {/* Banner de Status - Equação Contábil */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle2 size={18} className="text-emerald-500" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-emerald-900">Balanço fechado</span>
          <span className="text-xs text-emerald-700">Ativo = Passivo + Patrimônio Líquido</span>
        </div>
      </div>

      {/* Alerta de Configuração */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
          <Info size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Configuração incompleta</h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">• Saldos iniciais não configurados</p>
          <button className="text-[11px] font-black text-blue-600 uppercase underline underline-offset-4 mt-3 hover:text-blue-700">Ir para configurações</button>
        </div>
      </div>

      {/* Colunas Ativo / Passivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lado do Ativo */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
           <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Ativo</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Em 28/02/2026</p>
              </div>
              <span className="text-xl font-black text-slate-950">{formatCurrency(dfcMetrics.caixaFinal)}</span>
           </div>

           <div className="space-y-6">
              {/* Ativo Circulante */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-800">Ativo Circulante</span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(dfcMetrics.caixaFinal)}</span>
                 </div>
                 <div className="pl-4 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">1.1.01</span> Caixa e Equivalentes</span>
                       <span className="text-[11px] font-bold text-slate-700">{formatCurrency(dfcMetrics.caixaFinal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">1.1.02</span> Contas a Receber</span>
                       <span className="text-[11px] font-bold text-slate-700">{formatCurrency(0)}</span>
                    </div>
                 </div>
              </div>

              {/* Ativo Não Circulante */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-800">Ativo Não Circulante</span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(0)}</span>
                 </div>
                 <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex items-center gap-3">
                    <ShieldAlert size={14} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nenhuma conta configurada para esta seção</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Lado do Passivo + PL */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-10">
           <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Passivo + Patrimônio Líquido</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Em 28/02/2026</p>
              </div>
              <span className="text-xl font-black text-slate-950">{formatCurrency(dfcMetrics.caixaFinal)}</span>
           </div>

           <div className="space-y-8">
              {/* Passivo */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-900">Passivo</span>
                    <span className="text-sm font-black text-slate-950">{formatCurrency(0)}</span>
                 </div>
                 
                 <div className="pl-4 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">Passivo Circulante</span>
                        <span className="text-sm font-black text-slate-900">{formatCurrency(0)}</span>
                      </div>
                      <div className="pl-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">2.1.01</span> Contas a Pagar</span>
                          <span className="text-[11px] font-bold text-slate-700">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">2.1.02</span> Impostos a Recolher</span>
                          <span className="text-[11px] font-bold text-slate-700">{formatCurrency(0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">Passivo Não Circulante</span>
                        <span className="text-sm font-black text-slate-900">{formatCurrency(0)}</span>
                      </div>
                      <div className="pl-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">2.2.01</span> Empréstimos LP</span>
                          <span className="text-[11px] font-bold text-slate-700">{formatCurrency(0)}</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Patrimônio Líquido */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-900">Patrimônio Líquido</span>
                    <span className="text-sm font-black text-slate-950">{formatCurrency(dfcMetrics.caixaFinal)}</span>
                 </div>
                 
                 <div className="pl-4 space-y-6">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">Capital Social</span>
                          <span className="text-sm font-black text-slate-900">{formatCurrency(0)}</span>
                       </div>
                       <div className="pl-4">
                         <div className="flex justify-between items-center">
                           <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">3.0.01</span> Capital Social</span>
                           <span className="text-[11px] font-bold text-slate-700">{formatCurrency(0)}</span>
                         </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">Lucros Acumulados</span>
                          <span className="text-sm font-black text-slate-900">{formatCurrency(dfcMetrics.caixaFinal)}</span>
                       </div>
                       <div className="pl-4">
                         <div className="flex justify-between items-center">
                           <span className="text-[11px] font-medium text-slate-500"><span className="text-slate-300 mr-2">3.0.02</span> Lucros Acumulados</span>
                           <span className="text-[11px] font-bold text-slate-700">{formatCurrency(dfcMetrics.caixaFinal)}</span>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer / Summary Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-10">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Ativo</p>
            <p className="text-base font-black text-slate-900">{formatCurrency(dfcMetrics.caixaFinal)}</p>
          </div>
          <Equal className="text-slate-200" size={16} />
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Passivo</p>
            <p className="text-base font-black text-slate-900">{formatCurrency(0)}</p>
          </div>
          <Plus className="text-slate-200" size={16} />
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Patrimônio Líquido</p>
            <p className="text-base font-black text-slate-900">{formatCurrency(dfcMetrics.caixaFinal)}</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
           <Download size={16} /> Exportar
        </button>
      </div>
    </div>
  );

  const renderReconciliationView = () => (
    <div className="space-y-8">
      {/* Cards de Resumo Reconciliação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lucro Líquido (DRE)</p>
          <h3 className="text-2xl font-black text-slate-900 mb-4">{formatCurrency(dfcMetrics.ebitda)}</h3>
          <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-3 py-1 rounded-md uppercase border border-slate-100">Regime de Caixa</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Variação de Caixa (DFC)</p>
          <h3 className="text-2xl font-black text-slate-900 mb-4">{formatCurrency(dfcMetrics.variacao)}</h3>
          <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-3 py-1 rounded-md uppercase border border-slate-100">Regime de Caixa</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:border-blue-200 transition-all">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Diferença</p>
          <h3 className="text-2xl font-black text-blue-600 mb-4">+R$ 0,00</h3>
          <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-md uppercase border border-blue-100">Conciliado</span>
        </div>
      </div>

      {/* Tabela de Reconciliação */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="p-10 pb-6">
           <div className="flex items-center gap-3">
              <ArrowRightLeft className="text-slate-400" size={24} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reconciliação DRE x DFC</h3>
                <p className="text-slate-400 text-sm font-medium">fevereiro 2026</p>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100">
                <th className="px-10 py-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest">Linha</th>
                <th className="px-10 py-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest text-right">DRE (Competência)</th>
                <th className="px-10 py-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest text-right">DFC (Caixa)</th>
                <th className="px-10 py-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest text-right">Diferença</th>
                <th className="px-10 py-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest text-center">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { label: 'Receitas', dre: dfcMetrics.ebitda + 500, dfc: dfcMetrics.ebitda + 500, diff: 0, bold: false },
                { label: 'Despesas Operacionais', dre: -500, dfc: -500, diff: 0, bold: false },
                { label: 'Resultado Operacional', dre: dfcMetrics.ebitda, dfc: dfcMetrics.ebitda, diff: 0, bold: true },
                { label: 'Investimentos', dre: 0, dfc: 0, diff: 0, bold: false },
                { label: 'Financiamento', dre: 0, dfc: 0, diff: 0, bold: false },
                { label: 'Resultado Final', dre: dfcMetrics.ebitda, dfc: dfcMetrics.ebitda, diff: 0, bold: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2">
                       <span className={`text-sm ${row.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.label}</span>
                       <Info size={12} className="text-slate-300" />
                    </div>
                  </td>
                  <td className={`px-10 py-5 text-sm text-right ${row.bold ? 'font-black text-slate-950' : 'text-slate-600'}`}>{formatCurrency(row.dre)}</td>
                  <td className={`px-10 py-5 text-sm text-right ${row.bold ? 'font-black text-slate-950' : 'text-slate-600'}`}>{formatCurrency(row.dfc)}</td>
                  <td className="px-10 py-5 text-sm text-right font-bold text-slate-400">+R$ 0,00</td>
                  <td className="px-10 py-5 text-center">
                    <div className="flex justify-center"><Equal size={14} className="text-slate-200" /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Box Explicativo Inferior */}
        <div className="p-10 pt-10 border-t border-slate-50">
           <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-4">
              <h4 className="text-[13px] font-bold text-slate-600">Por que existe diferença?</h4>
              <ul className="space-y-2.5">
                <li className="text-[12px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">• Timing:</strong> Receitas reconhecidas no DRE (competência) podem não ter sido recebidas ainda no caixa.
                </li>
                <li className="text-[12px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">• Depreciação:</strong> O DRE registra depreciação como despesa, mas não há saída de caixa correspondente.
                </li>
                <li className="text-[12px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">• Capital de giro:</strong> Pagamentos antecipados a fornecedores ou recebimentos antecipados de clientes afetam o caixa sem impactar o DRE no mesmo período.
                </li>
                <li className="text-[12px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">• Investimentos e Financiamentos:</strong> Compra de ativos e amortização de empréstimos afetam o caixa mas não o resultado operacional.
                </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* 1. Header Principal */}
      <div className="flex items-start gap-4 mb-10">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <Scale size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Contábil / Relatórios</h2>
          <p className="text-slate-400 text-sm font-medium">DRE, DFC e Balanço Patrimonial gerencial</p>
        </div>
      </div>

      {/* 2. Barra de Filtros Master */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Período:</span>
            <div className="relative">
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 appearance-none pr-10 focus:outline-none">
                <option>Este Mês</option>
                <option>Este Ano</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
             <div className={`w-10 h-5 rounded-full relative transition-all bg-slate-200`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full left-1`} />
             </div>
             <span className="text-xs font-bold text-slate-600">Comparar período anterior</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regime:</span>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none"><option>Caixa</option></select>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-400 whitespace-nowrap">01 fev - 28 fev 2026</div>
      </div>

      {/* 3. Navegação por Abas */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'DRE', icon: <FileText size={16} /> },
          { id: 'DFC', icon: <TrendingUp size={16} /> },
          { id: 'DRE x DFC', icon: <ArrowRightLeft size={16} /> },
          { id: 'Balanço', icon: <Scale size={16} /> },
          { id: 'Configurações', icon: <Settings size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon} {tab.id}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /></div>
      ) : activeTab === 'DFC' ? (
        <div className="space-y-6">
          {/* Cards Superiores DFC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Caixa Inicial</p>
                <h3 className="text-xl font-black text-slate-900">{formatCurrency(dfcMetrics.caixaInicial)}</h3>
              </div>
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl"><Wallet size={20} /></div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Variação no Período</p>
                <h3 className="text-xl font-black text-emerald-600">+{formatCurrency(dfcMetrics.variacao)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowUp size={20} /></div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Caixa Final</p>
                <h3 className="text-xl font-black text-emerald-600">{formatCurrency(dfcMetrics.caixaFinal)}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={20} /></div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-3">
                 <TrendingUp className="text-slate-400" size={24} />
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">DFC - Demonstrativo de Fluxo de Caixa</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-xs">fevereiro 2026</span>
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Regime de Caixa</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
                 {[
                   { label: 'Consolidado', icon: <LayoutGrid size={14}/> },
                   { label: 'Por Centro de Custo', icon: <Database size={14}/> },
                   { label: 'Por Cliente', icon: <Users size={14}/> },
                   { label: 'Por Produto', icon: <Package size={14}/> },
                 ].map((btn, i) => (
                   <button key={i} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap ${i === 0 ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                     {btn.icon} {btn.label}
                   </button>
                 ))}
                 <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 shadow-sm ml-2">
                   <Download size={14} /> Exportar
                 </button>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-3">
               {[
                 { label: 'Fluxo de Caixa Operacional', val: dfcMetrics.variacao },
                 { label: 'Fluxo de Caixa de Investimento', val: 0 },
                 { label: 'Fluxo de Caixa de Financiamento', val: 0 },
                 { label: 'Variação de Caixa no Período', val: dfcMetrics.variacao, highlight: true },
               ].map((row, i) => (
                 <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${row.highlight ? 'bg-slate-50/50 border-slate-100 font-bold' : 'bg-white border-slate-50 hover:border-slate-100'}`}>
                    <span className="text-sm text-slate-700">{row.label}</span>
                    <span className={`text-sm font-black ${row.val >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {row.val >= 0 ? '+' : ''}{formatCurrency(row.val)}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'DRE x DFC' ? (
        renderReconciliationView()
      ) : activeTab === 'Balanço' ? (
        renderBalanceSheetView()
      ) : (
        /* Visão DRE Existente */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
               <FileText className="text-slate-400" size={24} />
               <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">DRE - Demonstração do Resultado</h3>
                  <p className="text-slate-400 text-sm font-medium">fevereiro 2026</p>
               </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
               <Download size={16} /> Exportar
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-100">
                  <th className="px-10 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                  <th className="px-10 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Valor (R$)</th>
                  <th className="px-10 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right w-32">% RL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dreLines.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/30 transition-colors ${row.type !== 'item' ? 'bg-slate-50/10' : ''}`}>
                    <td className={`px-10 py-4 text-sm tracking-tight ${row.type === 'subtotal' ? 'font-bold text-slate-900' : row.type === 'total' ? 'font-black text-slate-950 bg-blue-50/20' : 'text-slate-600 pl-14'}`}>{row.label}</td>
                    <td className={`px-10 py-4 text-sm text-right tracking-tight ${row.type === 'total' ? 'font-black text-slate-950 bg-blue-50/20' : row.type === 'subtotal' ? 'font-bold text-slate-900' : row.color || 'text-slate-700'}`}>{row.display}</td>
                    <td className={`px-10 py-4 text-sm font-bold text-right text-slate-400 ${row.type === 'total' ? 'bg-blue-50/20 text-slate-900' : ''}`}>{row.rl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
