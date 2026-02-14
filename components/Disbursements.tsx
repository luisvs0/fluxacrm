
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
  // Added MoreVertical import
  MoreVertical
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DisbursementsProps {
  user: any;
}

const Disbursements: React.FC<DisbursementsProps> = ({ user }) => {
  const [disbursements, setDisbursements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      // Buscamos imóveis alugados para simular os repasses
      const { data: props, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Alugado');

      if (error) throw error;

      // Transformamos os dados dos imóveis alugados em uma visão de repasse
      // Simulando uma taxa de adm de 10%
      const formatted = (props || []).map(p => {
        const gross = Number(p.rent_price) || 0;
        const adminFee = gross * 0.10;
        const net = gross - adminFee;

        return {
          id: p.id,
          property_title: p.title,
          property_address: p.address,
          owner_name: 'Proprietário SQL',
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <ArrowRightLeft size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Administration & Rent Management</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Repasses Financeiros</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Gestão de liquidação de aluguéis e comissões</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Relatório Geral</button>
           <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">Processar Lote</button>
        </div>
      </div>

      {/* KPI Row Aprimorada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total a Repassar</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(summary.net)}</h3>
            <span className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1 mt-1">
              <Clock size={10} /> Ciclo Fev/26
            </span>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><HandCoins size={28} /></div>
        </div>

        <div className="bg-white border-2 border-emerald-50 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Taxas de Adm. (MRR)</p>
            <h3 className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(summary.fees)}</h3>
            <span className="text-[9px] font-bold text-emerald-400 uppercase flex items-center gap-1 mt-1">
               <TrendingUp size={10} /> Receita Líquida Imob.
            </span>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><DollarSign size={28} /></div>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:border-slate-400 transition-all">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aguardando Cliente</p>
            <h3 className="text-2xl font-black text-slate-400 tracking-tighter">{summary.pendingCount}</h3>
            <span className="text-[9px] font-bold text-slate-300 uppercase flex items-center gap-1 mt-1">
               <AlertCircle size={10} /> Boletos em aberto
            </span>
          </div>
          <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Receipt size={28} /></div>
        </div>

        <div className="bg-blue-600 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-center group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Status da Conciliação</p>
              <h3 className="text-2xl font-black text-white tracking-tighter">94%</h3>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-white h-full" style={{ width: '94%' }}></div>
              </div>
           </div>
           <CheckCircle2 className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Tabela de Auditoria Aprimorada */}
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-10 border-b-2 border-slate-50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-50/20">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Journal de Liquidação</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Processamento individual por contrato</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="relative">
                <select className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase appearance-none pr-10 outline-none focus:border-blue-400 transition-all">
                  <option>Fevereiro / 2026</option>
                  <option>Janeiro / 2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              </div>
              <button onClick={fetchDisbursements} className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
             <thead>
               <tr className="bg-white border-b-2 border-slate-50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imóvel & Endereço</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aluguel Bruto</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxa Imob (10%)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Líquido Proprietário</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-6 w-10"></th>
               </tr>
             </thead>
             <tbody className="divide-y-2 divide-slate-50">
               {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-40 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calculando Repasses...</p>
                    </td>
                  </tr>
               ) : disbursements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-40 text-center opacity-30">
                       <HandCoins size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum aluguel ativo para repasse</p>
                    </td>
                  </tr>
               ) : (
                 disbursements.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-all group">
                     <td className="px-10 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{item.property_title}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[250px]">{item.property_address}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900">{formatCurrency(item.gross_rent)}</span>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-sm font-black text-rose-500">-{formatCurrency(item.admin_fee)}</span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 inline-block">
                           <span className="text-sm font-black text-emerald-600">{formatCurrency(item.net_repasse)}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-center">
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 shadow-sm ${
                          item.status === 'Pago' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                          'bg-amber-50 text-amber-600 border-amber-500'
                        }`}>
                          {item.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Disbursements;