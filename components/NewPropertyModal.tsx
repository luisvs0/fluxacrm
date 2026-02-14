
import React, { useState, useRef } from 'react';
import { X, Home, MapPin, DollarSign, Loader2, Save, Maximize, Bath, BedDouble, Tag, Info, Zap, Sparkles, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewPropertyModal: React.FC<NewPropertyModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    type: 'Apartamento',
    status: 'Disponível',
    sale_price: '',
    rent_price: '',
    condo_fee: '0',
    iptu_value: '0',
    area: '',
    bedrooms: '2',
    bathrooms: '1',
    is_exclusive: false,
    is_opportunity: false,
    image_url: '' // Nova coluna
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.address) return alert('Título e Endereço são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('properties').insert([{
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        address: formData.address,
        type: formData.type,
        status: formData.status,
        sale_price: parseFloat(formData.sale_price.replace(',', '.')) || 0,
        rent_price: parseFloat(formData.rent_price.replace(',', '.')) || 0,
        condo_fee: parseFloat(formData.condo_fee.replace(',', '.')) || 0,
        iptu_value: parseFloat(formData.iptu_value.replace(',', '.')) || 0,
        area: parseFloat(formData.area) || 0,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        is_exclusive: formData.is_exclusive,
        is_opportunity: formData.is_opportunity,
        image_url: formData.image_url // Salvando a imagem
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar imóvel.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[800px] max-h-[95vh] rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-slate-100 flex flex-col">
        <div className="p-10 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100 flex items-center justify-center shadow-sm">
              <Home size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Novo Imóvel na Base</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Gestão Analítica de Ativos SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-4 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Seção de Foto Principal */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Imagem de Capa</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-64 w-full rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                  formData.image_url ? 'border-blue-500' : 'border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400'
                }`}
              >
                {formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <div className="bg-white p-3 rounded-2xl text-blue-600 shadow-xl"><Camera size={20} /></div>
                       <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, image_url: ''}) }}
                        className="bg-white p-3 rounded-2xl text-rose-500 shadow-xl"
                       >
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Clique para enviar foto</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">PNG, JPG ou WebP (Máx 5MB)</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Título e Destaques */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Informações Básicas</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Título do Anúncio (Ex: Mansão em Condomínio Fechado)"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center justify-between p-5 bg-slate-50/50 border-2 border-slate-100 rounded-2xl group cursor-pointer hover:bg-white hover:border-indigo-500 transition-all" onClick={() => setFormData({...formData, is_exclusive: !formData.is_exclusive})}>
                    <div className="flex items-center gap-3">
                       <Sparkles size={20} className={formData.is_exclusive ? 'text-indigo-600' : 'text-slate-300'} />
                       <span className="text-[11px] font-black uppercase text-slate-700">Contrato de Exclusividade</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_exclusive ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_exclusive ? 'left-6' : 'left-1'}`}></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-5 bg-slate-50/50 border-2 border-slate-100 rounded-2xl group cursor-pointer hover:bg-white hover:border-amber-500 transition-all" onClick={() => setFormData({...formData, is_opportunity: !formData.is_opportunity})}>
                    <div className="flex items-center gap-3">
                       <Zap size={20} className={formData.is_opportunity ? 'text-amber-500' : 'text-slate-300'} />
                       <span className="text-[11px] font-black uppercase text-slate-700">Marcar como Oportunidade</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_opportunity ? 'bg-amber-500' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_opportunity ? 'left-6' : 'left-1'}`}></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização *</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, Número, Bairro, Cidade - Estado"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-xs font-black uppercase">
                     <option>Apartamento</option>
                     <option>Casa</option>
                     <option>Comercial</option>
                     <option>Terreno</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dormitórios</label>
                  <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banheiros</label>
                  <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Área (m²)</label>
                  <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold" />
               </div>
            </div>

            {/* Valores e Taxas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor de Venda (R$)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                    <input type="text" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} placeholder="0,00" className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-8 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm" />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Aluguel Mensal (R$)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={24} />
                    <input type="text" value={formData.rent_price} onChange={e => setFormData({...formData, rent_price: e.target.value})} placeholder="0,00" className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-8 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Condomínio (R$)</label>
                  <input type="text" value={formData.condo_fee} onChange={e => setFormData({...formData, condo_fee: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700" />
               </div>
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">IPTU Mensal (R$)</label>
                  <input type="text" value={formData.iptu_value} onChange={e => setFormData({...formData, iptu_value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700" />
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Anúncio</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Destaque os principais diferenciais deste imóvel..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 px-6 text-sm font-medium resize-none outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button type="button" onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
              <button type="submit" disabled={isSaving} className="flex-1 py-5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Ativo</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPropertyModal;
