
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
  Lock
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white relative font-['Inter'] selection:bg-blue-600 selection:text-white">
      
      {/* Blueprint Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 w-full max-w-[480px] p-8 flex flex-col items-center">
        
        {/* Logo Section - Pure & Animated */}
        <div className="mb-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-full"></div>
            <img 
              src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
              alt="Fluxa Logo" 
              className="h-20 w-auto object-contain relative animate-logo-float"
            />
          </div>
        </div>

        {/* Action Card */}
        <div className="w-full bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100/50 transition-all duration-500">
          
          <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              {isRegistering ? 'Provisionar' : 'Autenticar'}
            </h1>
            <div className="h-1 w-12 bg-blue-600 mt-4 rounded-full"></div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-3 text-emerald-700 text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95">
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50/50 border-b-2 border-slate-100 px-0 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">E-mail Profissional</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50/50 border-b-2 border-slate-100 px-0 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Senha de Acesso</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-slate-50/50 border-b-2 border-slate-100 px-0 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Confirmar Senha</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-slate-50/50 border-b-2 border-slate-100 px-0 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}

            <div className="pt-8">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] hover:bg-black disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-blue-500" />
                ) : (
                  <>
                    {isRegistering ? 'Iniciar Provisionamento' : 'Acessar Workspace'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-blue-500" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
              }}
              className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all border-b border-transparent hover:border-blue-600 pb-1"
            >
              {isRegistering ? 'Já possuo uma estrutura? Entrar' : "Novo por aqui? Criar conta corporativa"}
            </button>
          </div>
        </div>

        {/* Safety Badges */}
        <div className="mt-12 flex justify-center items-center gap-8 opacity-20 group">
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-slate-900" />
              <span className="text-[8px] font-black uppercase tracking-widest">ISO 27001</span>
           </div>
           <div className="flex items-center gap-2">
              <Zap size={12} className="text-slate-900" />
              <span className="text-[8px] font-black uppercase tracking-widest">Realtime SQL</span>
           </div>
           <div className="flex items-center gap-2">
              <Globe size={12} className="text-slate-900" />
              <span className="text-[8px] font-black uppercase tracking-widest">Global Ops</span>
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
