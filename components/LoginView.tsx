
import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Cpu,
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });

        if (signUpError) throw signUpError;
        setSuccess('Estrutura de acesso enviada para validação em seu e-mail.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fcfcfd] relative font-['Inter'] selection:bg-[#203267] selection:text-white">
      
      {/* Blueprint Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#203267 1px, transparent 1px), linear-gradient(90deg, #203267 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 w-full max-w-[500px] p-6 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative">
            <div className="absolute -inset-8 bg-blue-500/5 blur-3xl rounded-full"></div>
            <img 
              src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
              alt="Fluxa Logo" 
              className="h-24 w-auto object-contain relative animate-logo-float"
            />
          </div>
        </div>

        {/* Action Card Premium */}
        <div className="w-full bg-white rounded-xl p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-300 transition-all duration-700">
          
          <div className="mb-12 flex justify-between items-end">
            <div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#203267]/40 mb-2">
                  <Database size={12} /> Ledger Access v2
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
                 {isRegistering ? 'Provisionar' : 'Autenticar'}
               </h1>
            </div>
            <div className="h-[2px] w-12 bg-[#203267] mb-2 rounded-full"></div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 flex items-center gap-4 text-rose-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-8 p-5 bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-4 text-emerald-700 text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {isRegistering && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Protocolo de Nome</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome completo do administrador"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">E-mail Profissional</label>
              <input 
                type="email" 
                required
                placeholder="nome@empresa.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Chave de Segurança</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] focus:bg-white transition-all shadow-inner"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#203267] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Validar Chave</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Repita a chave de segurança"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#203267] focus:bg-white transition-all shadow-inner"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}

            <div className="pt-8">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-300 transition-all active:scale-[0.98] hover:bg-black disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin text-blue-500" />
                ) : (
                  <>
                    {isRegistering ? 'Provisionar Workspace' : 'Acessar Ambiente'}
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform text-blue-500" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
              }}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#203267] transition-all border-b border-transparent hover:border-[#203267] pb-1"
            >
              {isRegistering ? 'Já possuo infraestrutura? Entrar' : "Novo operador? Criar conta SQL"}
            </button>
          </div>
        </div>

        {/* Safety Badges Corporativos */}
        <div className="mt-14 flex justify-center items-center gap-10 opacity-30 group hover:opacity-60 transition-opacity">
           <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-slate-900" />
              <span className="text-[9px] font-black uppercase tracking-widest">AES-256 Auth</span>
           </div>
           <div className="flex items-center gap-3">
              <Cpu size={16} className="text-slate-900" />
              <span className="text-[9px] font-black uppercase tracking-widest">Isolated Engine</span>
           </div>
           <div className="flex items-center gap-3">
              <Globe size={16} className="text-slate-900" />
              <span className="text-[9px] font-black uppercase tracking-widest">Cloud Nodes</span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logo-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
        .animate-logo-float {
          animation: logo-float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default LoginView;
