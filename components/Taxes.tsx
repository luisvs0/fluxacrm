
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  FileText, 
  Percent, 
  CheckCircle2, 
  Clock,
  CreditCard,
  Receipt,
  Download,
  Info,
  ArrowUpRight
} from 'lucide-react';
import NewTaxModal from './NewTaxModal';

const Taxes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tributos');
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Impostos & Taxas</h2>
          <p className="text-slate-500 font-medium mt-1">Controle de obrigações tributárias e taxas operacionais.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            Exportar Guia
          </button>
          <button 
            onClick={() => setIsNewTaxModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Tributo
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Provisionado</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">R$ 12.840,00</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Competência Fev/26</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Taxa Média Pagto</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">2.45%</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            -0.2% vs jan
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Status de Regularidade</p>
          <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">Certidão Positiva</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Válido até 30/03</p>
        </div>
        <div className="bg-slate-900 rounded-[1.75rem] p-6 shadow-xl text-white">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Próximo Vencimento</p>
          <h3 className="text-2xl font-bold tracking-tight">20 Fev</h3>
          <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">DAS - Simples Nac.</p>
        </div>
      </div>

      {/* Content Area with Tabs */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
            {['Tributos', 'Taxas de Pagamento', 'Retenções'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
               <Calendar size={16} /> Fev 2026
             </button>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
            <Receipt size={40} />
          </div>
          <div className="max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum {activeTab.toLowerCase()} pendente</h3>
            <p className="text-sm text-slate-400 font-medium">Todos os lançamentos tributários deste mês foram processados ou ainda não foram gerados.</p>
          </div>
          <button 
            onClick={() => setIsNewTaxModalOpen(true)}
            className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
          >
            Configurar novo imposto manual
          </button>
        </div>
      </div>

      <NewTaxModal isOpen={isNewTaxModalOpen} onClose={() => setIsNewTaxModalOpen(false)} />
    </div>
  );
};

export default Taxes;
