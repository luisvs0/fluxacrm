
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, User, DollarSign, Target, ChevronRight, History } from 'lucide-react';

interface GlobalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = query.length > 2 ? [
    { category: 'Clientes', icon: <User size={14}/>, items: ['Sirius Tecnologia', 'Grupo Omni'] },
    { category: 'Financeiro', icon: <DollarSign size={14}/>, items: ['Lançamento AWS Cloud', 'Nota Fiscal 2024-02'] },
    { category: 'Comercial', icon: <Target size={14}/>, items: ['Lead: André Gomes', 'Pipeline Alpha'] }
  ] : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop transparente (apenas para fechar ao clicar fora) */}
      <div 
        className="absolute inset-0 bg-transparent animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Search Palette */}
      <div className="relative bg-white w-full max-w-[650px] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] animate-in zoom-in-95 slide-in-from-top-4 duration-300 overflow-hidden border border-slate-100">
        
        {/* Search Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search size={22} className="text-blue-600 shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Busque por clientes, transações, leads ou comandos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-900 placeholder:text-slate-300"
          />
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">ESC</span>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Body */}
        <div className="max-h-[50vh] overflow-y-auto no-scrollbar p-4">
          {query.length <= 2 ? (
            <div className="p-8 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto">
                 <History size={32} />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-900">Busca Rápida Fluxa</p>
                 <p className="text-xs text-slate-400 font-medium">Digite pelo menos 3 caracteres para pesquisar em toda a base.</p>
               </div>
               <div className="flex flex-wrap justify-center gap-2 pt-2">
                 {['Clientes', 'MRR', 'Pipeline', 'NPS', 'DRE'].map(tag => (
                   <button key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all">
                     {tag}
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((group, i) => (
                <div key={i} className="space-y-2">
                   <div className="px-4 flex items-center gap-2">
                     <span className="text-blue-500 opacity-50">{group.icon}</span>
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{group.category}</span>
                   </div>
                   <div className="grid gap-1">
                      {group.items.map((item, j) => (
                        <button key={j} className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 flex items-center justify-between group transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600 shadow-sm transition-all">
                              {item.substring(0,1)}
                            </div>
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{item}</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                        </button>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8">
           <div className="flex items-center gap-6">
             <span className="flex items-center gap-1.5"><ChevronRight size={12} className="rotate-90"/> Selecionar</span>
             <span className="flex items-center gap-1.5"><Command size={10}/> Navegar</span>
           </div>
           <span>Powered by Fluxa AI Search</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchOverlay;
