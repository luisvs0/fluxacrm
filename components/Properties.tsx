
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Cloud Sync</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">Base de Imóveis</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
            Gestão analítica de {filteredProperties.length} unidades
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Novo Imóvel
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-3 border-2 border-slate-100 rounded-[2rem] shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por título ou endereço..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-600 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {['Todos', 'Apartamento', 'Casa', 'Comercial'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                filterType === type ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-100 hidden lg:block"></div>
          <button onClick={fetchProperties} className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid de Cards */}
      {isLoading ? (
        <div className="py-40 text-center">
          <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mapeando Ativos...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-40 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
          <Home size={48} className="mx-auto text-slate-100 mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum imóvel encontrado nesta busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProperties.map((p) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedProperty(p)}
              className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden group hover:border-blue-500 hover:shadow-2xl transition-all duration-500 flex flex-col relative cursor-pointer"
            >
              
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 shadow-sm backdrop-blur-md ${
                  p.status === 'Disponível' ? 'bg-emerald-50/90 text-emerald-600 border-emerald-500' : 
                  p.status === 'Alugado' ? 'bg-blue-50/90 text-blue-600 border-blue-500' :
                  'bg-slate-50/90 text-slate-600 border-slate-500'
                }`}>
                  {p.status}
                </span>
                {p.is_opportunity && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <Zap size={10} fill="white" /> Oportunidade
                  </span>
                )}
                {p.is_exclusive && (
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <Sparkles size={10} fill="white" /> Exclusividade
                  </span>
                )}
              </div>

              <div className="h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50 group-hover:bg-blue-50/20 transition-colors">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Sem foto</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg">
                    {p.type}
                  </div>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                  <button className="text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20} /></button>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-400 mb-6">
                  <MapPin size={12} className="text-blue-400" />
                  <span className="text-[10px] font-bold uppercase truncate">{p.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 border-y border-slate-50 py-5 mb-6">
                   <div className="flex flex-col items-center gap-1.5 border-r border-slate-50">
                      <BedDouble size={16} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-700">{p.bedrooms || 0} Dorm.</span>
                   </div>
                   <div className="flex flex-col items-center gap-1.5 border-r border-slate-50">
                      <Bath size={16} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-700">{p.bathrooms || 0} Ban.</span>
                   </div>
                   <div className="flex flex-col items-center gap-1.5">
                      <Maximize size={16} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-700">{p.area || 0} m²</span>
                   </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Venda</span>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(p.sale_price || 0)}</span>
                     </div>
                     {p.rent_price > 0 && (
                       <div className="flex flex-col text-right">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Aluguel</span>
                          <span className="text-sm font-black text-blue-600">{formatCurrency(p.rent_price)}</span>
                       </div>
                     )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50/50">
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Cond. {formatCurrency(p.condo_fee || 0)}</span>
                     </div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">IPTU {formatCurrency(p.iptu_value || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
