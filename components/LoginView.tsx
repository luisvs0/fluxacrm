
import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Github,
  Chrome,
  Zap,
  ShieldCheck,
  Globe
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
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });
        if (error) throw error;
        setSuccess('Verifique sua caixa de entrada para validar o acesso.');
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfd] relative overflow-hidden font-['Inter']">
      
      {/* Soft Glow Effects (Light Startup Aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/5 blur-[120px] rounded-full"></div>
      
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 p-4 lg:p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Left Side: Brand & Social Proof */}
        <div className="hidden lg:flex flex-col justify-center space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap size={12} fill="currentColor" /> Fluxa Engine v2.6
            </div>
            <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-[1.1]">
              Inteligência financeira <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">em tempo real.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              A stack definitiva para gestão de fluxos, OKRs e auditoria bancária automatizada.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-white border border-slate-100 space-y-2 shadow-sm">
              <ShieldCheck className="text-emerald-500" size={20} />
              <p className="text-slate-900 text-sm font-bold uppercase tracking-tight">SQL Encryption</p>
              <p className="text-slate-400 text-xs font-medium">Dados protegidos por protocolos de nível bancário.</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-100 space-y-2 shadow-sm">
              <Globe className="text-blue-500" size={20} />
              <p className="text-slate-900 text-sm font-bold uppercase tracking-tight">Cloud Sync</p>
              <p className="text-slate-400 text-xs font-medium">Acesse sua operação de qualquer lugar do mundo.</p>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Trusted by modern teams</p>
            <div className="flex gap-8 opacity-20 grayscale transition-opacity hover:opacity-40">
              <span className="text-xl font-black text-slate-900 italic">SIRIUS</span>
              <span className="text-xl font-black text-slate-900">ORBIT</span>
              <span className="text-xl font-black text-slate-900 tracking-widest">NEXUS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-full max-w-[440px] bg-white border border-slate-200/60 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            
            {/* Header */}
            <div className="mb-10">
              <img 
                src="https://lh3.googleusercontent.com/d/1TIYyVwcuCt7uOdJocoOY6B8GyYXmSPyh" 
                alt="Fluxa" 
                className="h-8 mb-8"
              />
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
                {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                {isRegistering ? 'Junte-se à nova geração de gestores.' : 'Acesse seu dashboard operacional.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in zoom-in-95">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold animate-in zoom-in-95">
                <CheckCircle2 size={16} />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1">
                  <input 
                    type="text" 
                    required
                    placeholder="Nome Completo"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-1">
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Senha"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegistering && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Confirmar Senha"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isRegistering ? 'Criar Conta' : 'Entrar na Plataforma'}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-300"><span className="bg-white px-3">Ou continue com</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl transition-all shadow-sm">
                <Chrome size={18} className="text-slate-400" />
                <span className="text-xs font-bold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl transition-all shadow-sm">
                <Github size={18} className="text-slate-400" />
                <span className="text-xs font-bold">GitHub</span>
              </button>
            </div>

            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
              }}
              className="w-full mt-10 text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              {isRegistering ? 'Já possui uma conta? Login' : "Não tem conta? Cadastre-se"}
            </button>
          </div>

          <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
            <a href="#" className="hover:text-slate-500 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-500 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
