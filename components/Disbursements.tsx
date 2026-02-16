
import React, { useState, useEffect } from 'react';
import { 
  HandCoins, 
  Plus, 
  ChevronDown, 
  Receipt, 
  Info, 
  Loader2, 
  Database,
  ArrowUpRight,
  User,
  RefreshCcw,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Download,
  FileText,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';

interface DisbursementsProps {
  user: any;
}

const Disbursements: React.FC<DisbursementsProps> = ({ user }) => {
  const [disbursements, setDisbursements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [summary, setSummary] = useState({
    gross: 0,
    fees: 0,
    net: 0,
    pendingCount: 0
  });

  const fetchDisbursements = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: props, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Alugado');

      if (error) throw error;

      const formatted = (props || []).map(p => {
        const gross = Number(p.rent_price) || 0;
        const adminFee = gross * 0.10;
        const net = gross - adminFee;

        return {
          id: p.id,
          property_title: p.title,
          property_address: p.address,
          owner_name: 'Proprietário SQL Exemplo',
          gross_rent: gross,
          admin_fee: adminFee,
          net_repasse: net,
          status: 'Aguardando Pagamento',
          due_date: '10/02/2026'
        };
      });

      setDisbursements(formatted);
      
      const totalGross = formatted.reduce((acc, curr) => acc + curr.gross_rent, 0);
      const totalFees = formatted.reduce((acc, curr) => acc + curr.admin_fee, 0);
      const totalNet = formatted.reduce((acc, curr) => acc + curr.net_repasse, 0);

      setSummary({
        gross: totalGross,
        fees: totalFees,
        net: totalNet,
        pendingCount: formatted.length
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-1000 pb-24 md:pb-20 relative overflow-hidden">
      {/* Background Micro-Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />
      
      {/* Header Premium */}
      <div className="relative z-10 px-4 md:px-10 pt-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white border border-slate-700 shadow-lg group hover:scale-105 transition-transform duration-500 cursor-pointer">
                <HandCoins size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Administration & Rent Ledger SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Repasses <span className="text-[#203267] not-italic">Financeiros</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão de liquidação de aluguéis e comissões corporativas</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={fetchDisbursements} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all shadow-sm">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95">
             Processar Lote SQL
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-10 mt-10 space-y-12">
        {/* Tier 1: KPIs Executivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total a Repassar" value={formatCurrency(summary.net)} subtitle="Ciclo Atual Auditado" icon={<HandCoins />} color="blue" />
          <StatCard title="Taxas Adm (MRR)" value={formatCurrency(summary.fees)} subtitle="Receita Líquida Imob" icon={<TrendingUp />} color="emerald" />
          <StatCard title="Liquidação Pendente" value={summary.pendingCount.toString()} subtitle="Registros em Aberto" icon={<Receipt />} color="blue" />
          <div className="bg-[#0a0c10] border border-slate-700 rounded-xl p-8 shadow-xl flex flex-col justify-between overflow-hidden relative min-h-[160px] group">
            <div className="relative z-10">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sync Health</span>
               <h3 className="text-3xl font-black tracking-tighter mt-3 italic text-emerald-500">94.8%</h3>
            </div>
            <div className="relative z-10 pt-3 border-t border-white/5 flex items-center gap-2">
               <Activity size={12} className="text-blue-500 animate-pulse" />
               <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Database Node Realtime</span>
            </div>
            <Database size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Tabela Journal Premium */}
        <div className="space-y-8 pb-10">
          <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
             <div className="px-4 py-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-[#203267] rounded-sm"></span> Journal de Liquidação
                </h3>
             </div>
             <div className="flex items-center gap-3 pr-4">
                <div className="relative">
                  <select className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-[10px] font-black uppercase appearance-none pr-10 outline-none focus:border-[#203267] transition-all">
                    <option>Ciclo Fevereiro / 2026</option>
                    <option>Ciclo Janeiro / 2026</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-xl duration-700">
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Imóvel & Proprietário</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Aluguel Bruto</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Taxa Imob (10%)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Líquido Repasse</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                    <th className="px-10 py-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Protocolos de Repasse...</p>
                      </td>
                    </tr>
                  ) : disbursements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-48 text-center opacity-30">
                        <HandCoins size={60} strokeWidth={1} className="mx-auto text-slate-300 mb-6" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Nenhum fluxo de repasse ativo</p>
                      </td>
                    </tr>
                  ) : (
                    disbursements.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-[#203267] transition-colors italic">{item.property_title}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[250px] mt-1">{item.owner_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                           <span className="text-sm font-black text-slate-900">{formatCurrency(item.gross_rent)}</span>
                        </td>
                        <td className="px-8 py-8 text-right">
                           <span className="text-sm font-black text-rose-500 italic">-{formatCurrency(item.admin_fee)}</span>
                        </td>
                        <td className="px-8 py-8 text-right">
                           <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-300 shadow-sm group-hover:scale-105 transition-transform">
                              <span className="text-sm font-black text-emerald-600">{formatCurrency(item.net_repasse)}</span>
                           </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                           <span className={`text-[9px] font-black px-5 py-2 rounded-md uppercase tracking-widest border transition-all ${
                             item.status === 'Pago' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-amber-50 text-amber-600 border-amber-300'
                           }`}>
                             {item.status}
                           </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setSelectedReceipt(item)}
                                className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm"
                                title="Ver Comprovante"
                              >
                                 <FileText size={18} />
                              </button>
                              <button className="p-3 text-slate-300 hover:text-slate-900 transition-all active:scale-90">
                                <MoreVertical size={18} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Comprovante Premium */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedReceipt(null)} />
           <div className="relative bg-white w-full max-w-[500px] rounded-xl shadow-2xl p-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-300">
              <div className="flex justify-between items-start mb-10">
                 <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg border border-slate-700 italic"><FileText size={24} className="text-blue-400" /></div>
                 <button onClick={() => setSelectedReceipt(null)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors border border-slate-200"><X size={20}/></button>
              </div>
              
              <div className="space-y-8">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Comprovante de <span className="text-[#203267] not-italic">Repasse</span></h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3">Auditado via Fluxa Intelligence Engine SQL</p>
                 </div>

                 <div className="space-y-5 border-y border-slate-100 py-8">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo Destino</span>
                       <span className="text-sm font-bold text-slate-900 uppercase italic">{selectedReceipt.owner_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ativo Referência</span>
                       <span className="text-sm font-bold text-slate-900 uppercase truncate max-w-[200px]">{selectedReceipt.property_title}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aluguel Bruto</span>
                       <span className="text-sm font-black text-slate-900">{formatCurrency(selectedReceipt.gross_rent)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Taxa Administrativa</span>
                       <span className="text-sm font-black text-rose-500 italic">-{formatCurrency(selectedReceipt.admin_fee)}</span>
                    </div>
                 </div>

                 <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Liquidação Líquida</span>
                       <p className="text-3xl font-black text-emerald-500 tracking-tighter italic mt-1">{formatCurrency(selectedReceipt.net_repasse)}</p>
                    </div>
                    <ShieldCheck size={48} className="text-white/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                 </div>

                 <button className="w-full py-5 bg-[#203267] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                    <Download size={18} /> Baixar Auditoria PDF
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Disbursements;
