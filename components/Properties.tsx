
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  MapPin, 
  MoreVertical, 
  Loader2, 
  Database,
  RefreshCcw,
  BedDouble,
  Bath,
  Maximize,
  ChevronDown,
  Sparkles,
  Zap,
  Tag,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewPropertyModal from './NewPropertyModal';
import PropertyDetailModal from './PropertyDetailModal';

interface PropertiesProps {
  user: any;
}

const Properties: React.FC<PropertiesProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const fetchProperties = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Erro ao buscar imóveis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'Todos' || p.type === filterType;
      return matchSearch && matchType;
    });
  }, [properties, searchTerm, filterType]);

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
                <Home size={20} className="text-blue-400" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#203267]/60">Inventory Ledger SQL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Base de <span className="text-[#203267] not-italic">Imóveis</span>
          </h1>
          <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Gestão analítica de {filteredProperties.length} unidades em portfólio</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#203267] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Novo Imóvel
          </button>
          <button onClick={fetchProperties} className="p-4 bg-white border border-slate-300 rounded-xl text-slate-400 hover:text-[#203267] hover:border-[#203267] transition-all active:scale-90 shadow-sm">
            <RefreshCcw size={22} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Toolbar Premium */}
      <div className="relative z-10 px-4 md:px-10 mt-10 mb-10">
        <div className="bg-white border border-slate-300 p-2 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
          <div className="relative flex-1 w-full lg:max-w-xl pl-2 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#203267]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por título, endereço ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-12 pr-4 text-xs font-bold focus:border-[#203267] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
            {['Todos', 'Apartamento', 'Casa', 'Comercial'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterType === type ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-4 pr-6 text-[10px] font-black text-[#203267] uppercase tracking-[0.2em]">
             <span className="opacity-40 flex items-center gap-2"><Database size={12}/> Inventory Node</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Grid de Cards Premium */}
      <div className="relative z-10 px-4 md:px-10">
        {isLoading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin mx-auto text-[#203267] mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Inventário SQL...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-40 text-center bg-white border border-slate-300 rounded-xl group transition-all">
            <Home size={48} className="mx-auto text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum imóvel localizado na busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProperty(p)}
                className="bg-white border border-slate-300 rounded-xl overflow-hidden group hover:border-[#203267] hover:shadow-2xl transition-all duration-700 flex flex-col cursor-pointer relative"
              >
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    p.status === 'Disponível' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 
                    p.status === 'Alugado' ? 'bg-blue-50 text-blue-600 border-blue-300' :
                    'bg-slate-50 text-slate-600 border-slate-300'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-300">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Sem registro visual</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-slate-900/95 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl border border-slate-700">
                      {p.type}
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-[#203267] transition-colors italic">{p.title}</h3>
                    <MoreVertical size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-slate-400 mb-6">
                    <MapPin size={12} className="text-[#203267]" />
                    <span className="text-[9px] font-bold uppercase truncate tracking-tight">{p.address}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-6 mb-6">
                     <div className="flex flex-col items-center gap-1.5 border-r border-slate-50">
                        <BedDouble size={16} className="text-slate-300 group-hover:text-[#203267] transition-colors" />
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{p.bedrooms || 0} Dorm.</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 border-r border-slate-50">
                        <Bath size={16} className="text-slate-300 group-hover:text-[#203267] transition-colors" />
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{p.bathrooms || 0} Ban.</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5">
                        <Maximize size={16} className="text-slate-300 group-hover:text-[#203267] transition-colors" />
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{p.area || 0} m²</span>
                     </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Venda Ref.</span>
                          <span className="text-lg font-black text-slate-900 tracking-tighter italic">{formatCurrency(p.sale_price || 0)}</span>
                       </div>
                       {p.rent_price > 0 && (
                         <div className="flex flex-col text-right">
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Aluguel</span>
                            <span className="text-sm font-black text-[#203267] italic">{formatCurrency(p.rent_price)}</span>
                         </div>
                       )}
                    </div>
                    <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 bg-[#203267]`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewPropertyModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchProperties(); }} user={user} />
      {selectedProperty && (
        <PropertyDetailModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
};

export default Properties;
